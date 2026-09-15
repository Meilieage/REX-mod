var WidgetMetadata = {
  id: "meilieage.guduo",
  title: "Meilieage · 骨朵热榜",
  description: "直接读取骨朵日榜，标明榜单日期，保守匹配 TMDB。明文个人定制版。",
  author: "Meilieage（个人定制）",
  site: "https://github.com/Meilieage",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [{
    title: "骨朵日榜",
    description: "日期留空时查找最近有数据的日期；只展示能明确匹配影视资料的项目。",
    functionName: "loadGuduo",
    requiresWebView: false,
    cacheDuration: 1800,
    params: [
      { name: "category", title: "分类", type: "enumeration", value: "剧集", enumOptions: [
        { title: "剧集", value: "剧集" }, { title: "综艺", value: "综艺" },
        { title: "动漫", value: "动漫" }, { title: "电影", value: "电影" }
      ] },
      { name: "date", title: "榜单日期（留空取最近一期）", type: "input", value: "", description: "YYYY-MM-DD" },
      { name: "keyword", title: "名称筛选（可留空）", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" }
    ]
  }]
};

// ===== 个人设置：可直接编辑；无需解密 =====
var GUDUO_CONFIG = {
  endpoint: "https://d2.guduomedia.com/m/v3/billboard/list",
  pageSize: 10,
  lookbackDays: 7,
  concurrency: 3,
  language: "zh-CN"
};
var GUDUO_CATEGORIES = {
  "剧集": { code: "NETWORK_DRAMA", mediaType: "tv" },
  "综艺": { code: "NETWORK_VARIETY", mediaType: "tv" },
  "动漫": { code: "ALL_ANIME", mediaType: "tv" },
  "电影": { code: "NETWORK_MOVIE", mediaType: "movie" }
};

function guduoJson(response, label) {
  if (!response) throw new Error(label + "没有返回内容");
  var status = response.statusCode || response.status;
  if (Number(status) >= 400) throw new Error(label + "请求失败（HTTP " + status + "）");
  var value = Object.prototype.hasOwnProperty.call(response, "data") ? response.data : response;
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch (_) { throw new Error(label + "返回的内容不是有效 JSON"); }
  }
  if (!value || typeof value !== "object") throw new Error(label + "数据结构异常");
  return value;
}
function guduoDate(offset) {
  return new Date(Date.now() + 8 * 3600000 - offset * 86400000).toISOString().slice(0, 10);
}
function guduoValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var d = new Date(value + "T00:00:00Z");
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function guduoName(value) {
  return String(value || "").toLowerCase().replace(/[\s·•:：()（）《》\[\]【】,，.。\-—_!?！？]/g, "");
}
function guduoInt(value, fallback, min, max) {
  if (value === undefined || value === null || value === "") return fallback;
  var n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error("页码或设置必须是有效的正整数");
  return n;
}
async function guduoWorkers(items, limit, handler) {
  var next = 0;
  var results = new Array(items.length);
  async function worker() {
    while (next < items.length) {
      var i = next++;
      results[i] = await handler(items[i]);
    }
  }
  var tasks = [];
  for (var i = 0; i < Math.min(limit, items.length); i++) tasks.push(worker());
  await Promise.all(tasks);
  return results;
}
async function guduoFetch(category, date) {
  var url = GUDUO_CONFIG.endpoint + "?type=DAILY&category=" + encodeURIComponent(category.code)
    + "&date=" + encodeURIComponent(date) + "&attach=gdi&orderTitle=gdi&platformId=0";
  var response;
  try { response = await Widget.http.get(url, { decodable: true }); }
  catch (_) { throw new Error("无法连接骨朵榜单服务，请稍后重试"); }
  var body = guduoJson(response, "骨朵榜单");
  if (body.code !== undefined && String(body.code) !== "0") throw new Error("骨朵服务未成功返回榜单");
  if (!Array.isArray(body.data)) throw new Error("骨朵榜单字段发生变化，需要更新解析规则");
  return body.data;
}
function guduoSelect(candidates, row, category) {
  var target = guduoName(row.name);
  var withoutYear = target.replace(/(?:19|20)\d{2}$/, "");
  var year = row.releaseDate ? new Date(Number(row.releaseDate)).getUTCFullYear() : null;
  var choices = [];
  candidates.forEach(function(item) {
    if (!item || !Number.isInteger(Number(item.id)) || Number(item.id) <= 0 || item.adult === true) return;
    var names = [item.name, item.title, item.original_name, item.original_title].filter(Boolean).map(guduoName);
    var exact = names.indexOf(target) >= 0;
    var seasonal = category.mediaType === "tv" && target !== withoutYear && names.indexOf(withoutYear) >= 0;
    if (!exact && !seasonal) return;
    var score = exact ? 10 : 6;
    if (category.mediaType === "movie" && year && item.release_date) {
      var actualYear = Number(item.release_date.slice(0, 4));
      if (Math.abs(actualYear - year) > 1) return;
      if (actualYear === year) score += 3;
    }
    if (Array.isArray(item.origin_country) && item.origin_country.indexOf("CN") >= 0) score += 1;
    if (category.code === "ALL_ANIME" && Array.isArray(item.genre_ids) && item.genre_ids.indexOf(16) >= 0) score += 2;
    choices.push({ item: item, score: score });
  });
  choices.sort(function(a, b) { return b.score - a.score; });
  if (!choices.length || (choices.length > 1 && choices[0].score === choices[1].score)) return null;
  return choices[0].item;
}
async function guduoMatch(row, category) {
  var query = String(row.name || "").trim();
  if (!query) return { row: row, item: null };
  if (category.mediaType === "tv") query = query.replace(/(?:19|20)\d{2}$/, "").trim();
  try {
    var response = await Widget.tmdb.get("/search/" + category.mediaType, {
      params: { query: query, language: GUDUO_CONFIG.language, include_adult: false, page: 1 }
    });
    var body = guduoJson(response, "TMDB");
    if (!Array.isArray(body.results)) throw new Error("TMDB 返回结构异常");
    return { row: row, item: guduoSelect(body.results, row, category) };
  } catch (_) { return { row: row, item: null, failed: true }; }
}
async function loadGuduo(params) {
  params = params || {};
  var categoryName = params.category || "剧集";
  var category = GUDUO_CATEGORIES[categoryName];
  if (!category) throw new Error("请选择有效的榜单分类");
  if (typeof Widget === "undefined" || !Widget.http || !Widget.tmdb) throw new Error("客户端需要支持 Widget.http 与 Widget.tmdb");
  var page = guduoInt(params.page, 1, 1, 500);
  var size = guduoInt(GUDUO_CONFIG.pageSize, 10, 1, 50);
  var concurrency = guduoInt(GUDUO_CONFIG.concurrency, 3, 1, 8);
  var lookback = guduoInt(GUDUO_CONFIG.lookbackDays, 7, 1, 14);
  var date = String(params.date || "").trim();
  if (date && (!guduoValidDate(date) || date > guduoDate(0))) throw new Error("日期请填写有效的 YYYY-MM-DD，且不能晚于今天");
  var rows = [];
  if (date) rows = await guduoFetch(category, date);
  else {
    for (var offset = 1; offset <= lookback; offset++) {
      date = guduoDate(offset);
      rows = await guduoFetch(category, date);
      if (rows.length) break;
    }
  }
  if (!rows.length) throw new Error("所选日期或最近 " + lookback + " 天暂未发布该分类榜单");
  var keyword = guduoName(params.keyword);
  rows = rows.map(function(row, index) {
    return Object.assign({}, row, { _rank: Number(row.rank) > 0 ? Number(row.rank) : index + 1 });
  }).filter(function(row) { return typeof row.name === "string" && (!keyword || guduoName(row.name).indexOf(keyword) >= 0); });
  var pageRows = rows.slice((page - 1) * size, page * size);
  if (!pageRows.length) return [];
  var matches = await guduoWorkers(pageRows, concurrency, function(row) { return guduoMatch(row, category); });
  var failed = matches.filter(function(m) { return m.failed; }).length;
  if (failed) throw new Error("部分影视资料请求失败（" + failed + " 条），请重试后再加载榜单");
  var unmatched = matches.filter(function(m) { return !m.item; }).length;
  var seen = {};
  var results = matches.filter(function(m) { return !!m.item; }).map(function(m) {
    var item = m.item;
    var row = m.row;
    var id = category.mediaType + "." + item.id;
    if (seen[id]) return null;
    seen[id] = true;
    return {
      id: id, tmdbId: Number(item.id), type: "tmdb", mediaType: category.mediaType,
      title: item.name || item.title || row.name,
      posterPath: item.poster_path || "", backdropPath: item.backdrop_path || "",
      releaseDate: item.release_date || item.first_air_date || "",
      rating: Number(item.vote_average) || 0,
      genreTitle: categoryName,
      description: "骨朵日榜 " + date + " · 原榜第 " + row._rank + " 名 · 热度 " + String(row.gdi === undefined ? "未提供" : row.gdi)
        + "\n" + (unmatched ? "本页另有 " + unmatched + " 条名称未能明确匹配，未展示。\n" : "") + String(item.overview || "")
    };
  }).filter(Boolean);
  if (!results.length) throw new Error("本页榜单已取得，但未能明确匹配影视资料；未返回可能错绑的条目");
  return results;
}