var WidgetMetadata = {
  id: "meilieage.rex.platforms",
  title: "Meilieage · 平台片单",
  description: "个人明文模块：按平台和观看地区筛选 TMDB 片单。平台可用性数据由 JustWatch 提供，经 TMDB 获取；不是平台自家热榜或播放源。按 ForwardWidget 规范编写，REX 兼容性待实机验证。",
  author: "Meilieage（个人定制）",
  site: "https://github.com/Meilieage",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "按平台筛选电影、剧集",
      description: "平台名称或编号会先与 TMDB 当前清单核对。数据来源：JustWatch / TMDB。观看地区与作品出品地区不同。",
      functionName: "loadPlatformTitles",
      requiresWebView: false,
      cacheDuration: 1800,
      params: [
        { name: "mediaType", title: "类型", type: "enumeration", value: "tv", enumOptions: [{ title: "剧集", value: "tv" }, { title: "电影", value: "movie" }] },
        { name: "provider", title: "平台名称或 TMDB 平台编号", type: "input", value: "Netflix", description: "优先输入完整名称。查无结果或名称有歧义时，错误提示会列出可选名称和编号。", placeholders: [{ title: "Netflix", value: "Netflix" }, { title: "Disney Plus", value: "Disney Plus" }, { title: "Amazon Prime Video", value: "Amazon Prime Video" }, { title: "Apple TV", value: "Apple TV" }] },
        { name: "watchRegion", title: "观看地区（两位地区代码）", type: "input", value: "US", description: "例如 US 美国、TW 中国台湾、HK 中国香港、JP 日本。只支持 TMDB / JustWatch 实际覆盖的地区。", placeholders: [{ title: "美国", value: "US" }, { title: "中国台湾", value: "TW" }, { title: "中国香港", value: "HK" }, { title: "日本", value: "JP" }, { title: "韩国", value: "KR" }, { title: "英国", value: "GB" }] },
        { name: "monetization", title: "观看方式", type: "enumeration", value: "flatrate", enumOptions: [{ title: "订阅", value: "flatrate" }, { title: "免费或广告支持", value: "free|ads" }, { title: "租赁或购买", value: "rent|buy" }, { title: "所有方式", value: "all" }] },
        { name: "sort", title: "排序", type: "enumeration", value: "popular", enumOptions: [{ title: "TMDB 热度", value: "popular" }, { title: "评分（设置最低评价人数）", value: "rating" }] },
        { name: "minVotes", title: "评分排序的最低评价人数", type: "input", value: "100", description: "仅评分排序使用。" },
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    }
  ]
};

// 个性化配置：显示语言可修改。平台名称、观看地区可直接在客户端参数中调整。
// 无内置第三方密钥：依赖客户端 Widget.tmdb.get 的 TMDB 配置。
// 平台资料是地区可用性记录，不承诺可播放、免费或包含原加密模块的全部来源。
var PLATFORM_CONFIG = { language: "zh-CN", providerCacheMilliseconds: 21600000 };
var platformProviderCache = {};

function platformPage(value) {
  var page = value === undefined || value === null || value === "" ? 1 : Number(value);
  if (!Number.isInteger(page) || page < 1 || page > 500) throw new Error("页码必须是 1 至 500 的整数。");
  return page;
}

function platformChoice(value, choices, fallback, label) {
  var chosen = value === undefined || value === null || value === "" ? fallback : String(value);
  if (choices.indexOf(chosen) < 0) throw new Error(label + "参数无效：" + chosen);
  return chosen;
}

async function platformGet(path, query) {
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
  if (!Array.isArray(data.results)) throw new Error("TMDB 返回结构不符合预期（" + path + "）。");
  if (query.page && data.page !== undefined && Number(data.page) !== query.page) throw new Error("TMDB 返回页码与请求不一致，请刷新后重试。");
  return data;
}

function platformNormalizeName(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

async function platformProviders(mediaType, region) {
  var key = mediaType + ":" + region;
  var cached = platformProviderCache[key];
  if (cached && Date.now() - cached.time < PLATFORM_CONFIG.providerCacheMilliseconds) return cached.items;
  var data = await platformGet("/watch/providers/" + mediaType, { language: PLATFORM_CONFIG.language, watch_region: region });
  var providers = data.results.filter(function (item) {
    return item && Number.isSafeInteger(Number(item.provider_id)) && Number(item.provider_id) > 0 && typeof item.provider_name === "string" && item.provider_name.trim();
  });
  if (!providers.length) throw new Error("TMDB / JustWatch 当前没有返回 " + region + " 地区的可用平台；请更换观看地区或稍后重试。");
  platformProviderCache[key] = { time: Date.now(), items: providers };
  return providers;
}

function platformSuggestions(providers) {
  return providers.slice(0, 15).map(function (item) { return item.provider_name + " [" + item.provider_id + "]"; }).join("、");
}

async function platformResolveProvider(mediaType, region, input) {
  var name = platformNormalizeName(input);
  if (!name) throw new Error("请输入平台名称或 TMDB 平台编号。");
  if (name.length > 100) throw new Error("平台名称过长，请输入 100 字以内的名称。");
  var providers = await platformProviders(mediaType, region);
  var matching;
  if (/^\d+$/.test(name)) {
    var id = Number(name);
    matching = providers.filter(function (item) { return Number(item.provider_id) === id; });
  } else {
    matching = providers.filter(function (item) { return platformNormalizeName(item.provider_name) === name; });
    if (!matching.length) matching = providers.filter(function (item) { return platformNormalizeName(item.provider_name).indexOf(name) !== -1; });
  }
  if (matching.length === 1) return matching[0];
  if (matching.length > 1) throw new Error("平台名称对应多个结果，请输入完整名称或编号：" + platformSuggestions(matching));
  throw new Error(region + " 地区未找到该平台。当前可选示例：" + platformSuggestions(providers));
}

function platformItems(data, mediaType, page, provider, region) {
  if (data.total_pages !== undefined && Number(data.total_pages) < page) return [];
  var seen = {};
  return data.results.reduce(function (items, entry) {
    if (!entry || entry.adult === true || (entry.media_type && entry.media_type !== mediaType)) return items;
    var id = Number(entry.id);
    var title = mediaType === "movie" ? entry.title || entry.original_title : entry.name || entry.original_name;
    if (!Number.isSafeInteger(id) || id <= 0 || typeof title !== "string" || !title.trim()) return items;
    var key = mediaType + "." + id;
    if (seen[key]) return items;
    seen[key] = true;
    var item = {
      id: key, type: "tmdb", tmdbId: id, title: title, mediaType: mediaType,
      description: "平台：" + provider.provider_name + "；观看地区：" + region + "。平台可用性资料：JustWatch（经 TMDB 提供）。" + (typeof entry.overview === "string" && entry.overview ? "\n\n" + entry.overview : "")
    };
    if (typeof entry.poster_path === "string" && entry.poster_path) item.posterPath = entry.poster_path;
    if (typeof entry.backdrop_path === "string" && entry.backdrop_path) item.backdropPath = entry.backdrop_path;
    var date = mediaType === "movie" ? entry.release_date : entry.first_air_date;
    if (typeof date === "string" && date) item.releaseDate = date;
    if (typeof entry.vote_average === "number" && Number.isFinite(entry.vote_average)) item.rating = entry.vote_average.toFixed(1);
    items.push(item);
    return items;
  }, []);
}

async function loadPlatformTitles(params) {
  params = params || {};
  var mediaType = platformChoice(params.mediaType, ["movie", "tv"], "tv", "类型");
  var page = platformPage(params.page);
  var region = params.watchRegion === undefined || params.watchRegion === null || params.watchRegion === "" ? "US" : String(params.watchRegion).trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(region)) throw new Error("观看地区必须是两位地区代码，例如 US、TW、HK、JP。");
  var monetization = platformChoice(params.monetization, ["flatrate", "free|ads", "rent|buy", "all"], "flatrate", "观看方式");
  var sort = platformChoice(params.sort, ["popular", "rating"], "popular", "排序");
  var providerInput = params.provider === undefined || params.provider === null ? "Netflix" : String(params.provider);
  var query = { language: PLATFORM_CONFIG.language, page: page, include_adult: false, watch_region: region, sort_by: sort === "rating" ? "vote_average.desc" : "popularity.desc" };
  if (monetization !== "all") query.with_watch_monetization_types = monetization;
  if (sort === "rating") {
    var minimum = params.minVotes === undefined || params.minVotes === null || params.minVotes === "" ? 100 : Number(params.minVotes);
    if (!Number.isSafeInteger(minimum) || minimum < 1 || minimum > 10000000) throw new Error("最低评价人数必须是 1 至 10000000 的整数。");
    query["vote_count.gte"] = minimum;
  }
  var provider = await platformResolveProvider(mediaType, region, providerInput);
  query.with_watch_providers = String(provider.provider_id);
  var data = await platformGet("/discover/" + mediaType, query);
  return platformItems(data, mediaType, page, provider, region);
}
