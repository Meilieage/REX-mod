var WidgetMetadata = {
  id: "meilieage.rex.discover",
  title: "Meilieage · 影视发现",
  description: "个人明文模块：TMDB 热门、趋势、高分、动画、综艺相关分类、地区筛选和名称搜索。仅提供影视资料；按 ForwardWidget 规范编写，REX 客户端兼容性待实机验证。",
  author: "Meilieage（个人定制）",
  site: "https://github.com/Meilieage",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "热门、趋势与高分",
      description: "TMDB 榜单；不代表豆瓣或视频平台自家榜单。",
      requiresWebView: false,
      functionName: "loadCharts",
      cacheDuration: 1800,
      params: [
        { name: "mediaType", title: "类型", type: "enumeration", value: "movie", enumOptions: [{ title: "电影", value: "movie" }, { title: "剧集", value: "tv" }] },
        { name: "chart", title: "榜单", type: "enumeration", value: "popular", enumOptions: [{ title: "热门", value: "popular" }, { title: "每日趋势", value: "day" }, { title: "每周趋势", value: "week" }, { title: "TMDB 高分榜", value: "top_rated" }] },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    {
      title: "分类与地区片单",
      description: "按作品出品地区筛选；综艺相关分类采用 TMDB 的真人秀、脱口秀分类。",
      requiresWebView: false,
      functionName: "loadCategories",
      cacheDuration: 1800,
      params: [
        { name: "category", title: "分类", type: "enumeration", value: "movie", enumOptions: [{ title: "电影", value: "movie" }, { title: "剧集", value: "tv" }, { title: "动画电影", value: "animation_movie" }, { title: "动画剧集", value: "animation_tv" }, { title: "真人秀（综艺相关）", value: "reality" }, { title: "脱口秀（综艺相关）", value: "talk" }] },
        { name: "originCountry", title: "出品地区", type: "enumeration", value: "all", enumOptions: [{ title: "全部", value: "all" }, { title: "中国大陆", value: "CN" }, { title: "中国香港", value: "HK" }, { title: "中国台湾", value: "TW" }, { title: "日本", value: "JP" }, { title: "韩国", value: "KR" }, { title: "美国", value: "US" }, { title: "英国", value: "GB" }] },
        { name: "sort", title: "排序", type: "enumeration", value: "popular", enumOptions: [{ title: "热度", value: "popular" }, { title: "评分（设置最低评价人数）", value: "rating" }] },
        { name: "minVotes", title: "评分排序的最低评价人数", type: "input", value: "100", description: "仅评分排序使用；减少评价人数很少的作品占据前列。" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ],
  search: {
    title: "Meilieage · 名称搜索",
    functionName: "searchTitles",
    params: [
      { name: "query", title: "片名", type: "input", value: "" },
      { name: "mediaType", title: "类型", type: "enumeration", value: "multi", enumOptions: [{ title: "电影和剧集", value: "multi" }, { title: "电影", value: "movie" }, { title: "剧集", value: "tv" }] },
      { name: "page", title: "页码", type: "page", value: "1" }
    ]
  }
};

// 个性化配置：修改这里即可调整显示语言。不要把别人的 API 密钥写入脚本。
// TMDB 请求由客户端的 Widget.tmdb.get 负责；本脚本不自行携带密钥。
var DISCOVER_CONFIG = { language: "zh-CN" };
var discoverGenreCache = {};

function discoverPage(value) {
  var page = value === undefined || value === null || value === "" ? 1 : Number(value);
  if (!Number.isInteger(page) || page < 1 || page > 500) throw new Error("页码必须是 1 至 500 的整数。");
  return page;
}

function discoverChoice(value, choices, fallback, label) {
  var chosen = value === undefined || value === null || value === "" ? fallback : String(value);
  if (choices.indexOf(chosen) < 0) throw new Error(label + "参数无效：" + chosen);
  return chosen;
}

async function discoverGet(path, query, resultField) {
  if (typeof Widget === "undefined" || !Widget.tmdb || typeof Widget.tmdb.get !== "function") {
    throw new Error("客户端未提供 Widget.tmdb.get，暂不能运行此模块；请检查 REX 的模块接口与 TMDB 配置。");
  }
  var response;
  try {
    response = await Widget.tmdb.get(path, { params: query });
  } catch (_) {
    throw new Error("TMDB 请求失败（" + path + "）；请检查客户端 TMDB 配置、网络后重试。");
  }
  var data = response && response.data !== undefined ? response.data : response;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (_) { throw new Error("TMDB 返回了无法解析的数据（" + path + "）。"); }
  }
  if (!data || typeof data !== "object" || data.success === false) throw new Error("TMDB 返回错误（" + path + "），请检查客户端授权和网络。");
  if (!Array.isArray(data[resultField || "results"])) throw new Error("TMDB 返回结构不符合预期（" + path + "）。");
  if (query.page && data.page !== undefined && Number(data.page) !== query.page) {
    throw new Error("TMDB 返回页码与请求不一致，请刷新后重试。");
  }
  return data;
}

function discoverItems(data, fallbackType, requestedPage) {
  if (data.total_pages !== undefined && Number(data.total_pages) < requestedPage) return [];
  var seen = {};
  return data.results.reduce(function (items, entry) {
    if (!entry || entry.adult === true) return items;
    var mediaType = entry.media_type || fallbackType;
    if ((fallbackType === "movie" || fallbackType === "tv") && mediaType !== fallbackType) return items;
    if (mediaType !== "movie" && mediaType !== "tv") return items;
    var id = Number(entry.id);
    var title = mediaType === "movie" ? entry.title || entry.original_title : entry.name || entry.original_name;
    if (!Number.isSafeInteger(id) || id <= 0 || typeof title !== "string" || !title.trim()) return items;
    var key = mediaType + "." + id;
    if (seen[key]) return items;
    seen[key] = true;
    var item = { id: key, type: "tmdb", tmdbId: id, title: title, mediaType: mediaType };
    if (typeof entry.poster_path === "string" && entry.poster_path) item.posterPath = entry.poster_path;
    if (typeof entry.backdrop_path === "string" && entry.backdrop_path) item.backdropPath = entry.backdrop_path;
    var releaseDate = mediaType === "movie" ? entry.release_date : entry.first_air_date;
    if (typeof releaseDate === "string" && releaseDate) item.releaseDate = releaseDate;
    if (typeof entry.overview === "string" && entry.overview) item.description = entry.overview;
    if (typeof entry.vote_average === "number" && Number.isFinite(entry.vote_average)) item.rating = entry.vote_average.toFixed(1);
    items.push(item);
    return items;
  }, []);
}

// 动态读取 TMDB 分类表，避免把未核实的分类编号硬编码为当前事实。
async function discoverGenreId(mediaType, englishName) {
  var key = mediaType + ":" + englishName;
  if (discoverGenreCache[key]) return discoverGenreCache[key];
  var data = await discoverGet("/genre/" + mediaType + "/list", { language: "en-US" }, "genres");
  var found = data.genres.filter(function (genre) {
    return genre && typeof genre.name === "string" && genre.name.toLowerCase() === englishName.toLowerCase() && Number.isSafeInteger(Number(genre.id)) && Number(genre.id) > 0;
  });
  if (found.length !== 1) throw new Error("TMDB 当前分类表未能唯一匹配 " + englishName + "，请稍后重试或更新分类设置。");
  discoverGenreCache[key] = String(found[0].id);
  return discoverGenreCache[key];
}

async function loadCharts(params) {
  params = params || {};
  var mediaType = discoverChoice(params.mediaType, ["movie", "tv"], "movie", "类型");
  var chart = discoverChoice(params.chart, ["popular", "day", "week", "top_rated"], "popular", "榜单");
  var page = discoverPage(params.page);
  var path = chart === "day" || chart === "week" ? "/trending/" + mediaType + "/" + chart : "/" + mediaType + "/" + chart;
  var data = await discoverGet(path, { language: DISCOVER_CONFIG.language, page: page });
  return discoverItems(data, mediaType, page);
}

async function loadCategories(params) {
  params = params || {};
  var category = discoverChoice(params.category, ["movie", "tv", "animation_movie", "animation_tv", "reality", "talk"], "movie", "分类");
  var country = discoverChoice(params.originCountry, ["all", "CN", "HK", "TW", "JP", "KR", "US", "GB"], "all", "出品地区");
  var sort = discoverChoice(params.sort, ["popular", "rating"], "popular", "排序");
  var page = discoverPage(params.page);
  var mediaType = category === "movie" || category === "animation_movie" ? "movie" : "tv";
  var query = { language: DISCOVER_CONFIG.language, page: page, include_adult: false, sort_by: sort === "rating" ? "vote_average.desc" : "popularity.desc" };
  if (sort === "rating") {
    var minimum = params.minVotes === undefined || params.minVotes === null || params.minVotes === "" ? 100 : Number(params.minVotes);
    if (!Number.isSafeInteger(minimum) || minimum < 1 || minimum > 10000000) throw new Error("最低评价人数必须是 1 至 10000000 的整数。");
    query["vote_count.gte"] = minimum;
  }
  if (country !== "all") query.with_origin_country = country;
  var genreName = category.indexOf("animation_") === 0 ? "Animation" : category === "reality" ? "Reality" : category === "talk" ? "Talk" : "";
  if (genreName) query.with_genres = await discoverGenreId(mediaType, genreName);
  var data = await discoverGet("/discover/" + mediaType, query);
  return discoverItems(data, mediaType, page);
}

async function searchTitles(params) {
  params = params || {};
  var query = typeof params.query === "string" ? params.query.trim() : "";
  if (!query) return [];
  if (query.length > 200) throw new Error("片名过长，请输入 200 字以内的名称。");
  var mediaType = discoverChoice(params.mediaType, ["multi", "movie", "tv"], "multi", "搜索类型");
  var page = discoverPage(params.page);
  var data = await discoverGet("/search/" + mediaType, { query: query, language: DISCOVER_CONFIG.language, include_adult: false, page: page });
  return discoverItems(data, mediaType === "multi" ? "" : mediaType, page);
}
