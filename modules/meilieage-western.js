var WidgetMetadata = {
  id: "meilieage.western",
  title: "Meilieage · 欧美榜单",
  description: "读取烂番茄公开热门榜单并保留原顺序；FlixPatrol 为待验证选项。明文个人定制版。",
  author: "Meilieage（个人定制）",
  site: "https://github.com/Meilieage",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [{
    title: "欧美榜单",
    description: "烂番茄电影、剧集页面已验证；FlixPatrol 当前测试网络返回 403。匹配不明确的条目会省略。",
    functionName: "loadWestern",
    requiresWebView: false,
    cacheDuration: 1800,
    params: [
      { name: "list", title: "榜单", type: "enumeration", value: "rt_movies", enumOptions: [
        { title: "烂番茄 · 流媒体热门电影", value: "rt_movies" },
        { title: "烂番茄 · 热门剧集", value: "rt_tv" },
        { title: "FlixPatrol · 待验证", value: "flixpatrol" }
      ] },
      { name: "platform", title: "FlixPatrol 平台", type: "enumeration", value: "netflix", belongTo: { paramName: "list", value: ["flixpatrol"] }, enumOptions: [
        { title: "Netflix", value: "netflix" }, { title: "Disney+", value: "disney" },
        { title: "HBO", value: "hbo" }, { title: "Amazon Prime", value: "amazon-prime" },
        { title: "Apple TV", value: "apple-tv" }
      ] },
      { name: "region", title: "FlixPatrol 地区", type: "enumeration", value: "united-states", belongTo: { paramName: "list", value: ["flixpatrol"] }, enumOptions: [
        { title: "美国", value: "united-states" }, { title: "英国", value: "united-kingdom" },
        { title: "日本", value: "japan" }, { title: "韩国", value: "south-korea" }
      ] },
      { name: "mediaType", title: "FlixPatrol 类型", type: "enumeration", value: "movie", belongTo: { paramName: "list", value: ["flixpatrol"] }, enumOptions: [
        { title: "电影", value: "movie" }, { title: "剧集", value: "tv" }
      ] },
      { name: "page", title: "页码", type: "page" }
    ]
  }]
};

// ===== 个人设置：可直接编辑；不需要原作者服务器 =====
var WESTERN_CONFIG = {
  pageSize: 10,
  concurrency: 3,
  language: "zh-CN",
  userAgent: "Mozilla/5.0",
  lists: {
    rt_movies: { url: "https://www.rottentomatoes.com/browse/movies_at_home/sort:popular", mediaType: "movie", title: "烂番茄流媒体热门电影" },
    rt_tv: { url: "https://www.rottentomatoes.com/browse/tv_series_browse/sort:popular", mediaType: "tv", title: "烂番茄热门剧集" }
  },
  flixpatrolBase: "https://flixpatrol.com/top10",
  platforms: ["netflix", "disney", "hbo", "amazon-prime", "apple-tv"],
  regions: ["united-states", "united-kingdom", "japan", "south-korea"]
};

function westernLog(message) {
  if (typeof console !== "undefined" && console.log) console.log("[欧美榜单] " + message);
}

function westernText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&#x([0-9a-f]+);/gi, function (_, code) {
    var n = parseInt(code, 16); return n <= 65535 ? String.fromCharCode(n) : "";
  }).replace(/&#(\d+);/g, function (_, code) {
    var n = Number(code); return n <= 65535 ? String.fromCharCode(n) : "";
  }).replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function westernAttr(tag, key) {
  var match = String(tag).match(new RegExp("\\b" + key + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
  return match ? westernText(match[2]) : "";
}

function westernSlot(html, slot) {
  var pattern = new RegExp("<([a-z][a-z0-9-]*)\\b[^>]*\\bslot=[\"']" + slot + "[\"'][^>]*>([\\s\\S]*?)<\\/\\1>", "i");
  var match = String(html).match(pattern);
  return match ? westernText(match[2]) : "";
}

function westernUnwrap(response, label) {
  if (response === null || response === undefined) throw new Error(label + "未返回内容");
  var status = response.statusCode || response.status;
  if (Number(status) >= 400) throw new Error(label + "请求失败（HTTP " + status + "），未使用其他榜单替代");
  return Object.prototype.hasOwnProperty.call(response, "data") ? response.data : response;
}

// 仅读取公开页面当前展示的卡片。热门顺序不等于评分高低，也不另加评分过滤。
function parseWesternRT(html, list) {
  var rows = [], seen = {}, expression = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi, match;
  while ((match = expression.exec(String(html)))) {
    var href = westernAttr(match[1], "href"), body = match[2];
    if (!/^\/(m|tv)\//.test(href)) continue;
    var titleMatch = body.match(/<([a-z][a-z0-9-]*)\b[^>]*data-qa=["']discovery-media-list-item-title["'][^>]*>([\s\S]*?)<\/\1>/i);
    if (!titleMatch) continue;
    var title = westernText(titleMatch[2]);
    if (!title || seen[href]) continue;
    seen[href] = true;
    var yearMatch = href.match(/_(19\d{2}|20\d{2})\/?$/);
    rows.push({ title: title, year: yearMatch ? yearMatch[1] : "", mediaType: list.mediaType,
      rank: rows.length + 1, sourceTitle: list.title, sourceUrl: "https://www.rottentomatoes.com" + href,
      critics: westernSlot(body, "criticsScore"), audience: westernSlot(body, "audienceScore") });
  }
  if (!rows.length) throw new Error("烂番茄页面没有可识别的榜单卡片，可能是网络拦截或页面结构变更");
  return rows;
}

// FlixPatrol 当前网络返回 403；只有公开页明确给出对应类型和排名的表格才接受。
// 未读取到对应结构时停止，不推测榜单、不替换成 TMDB 热度。
function parseWesternFlix(html, options) {
  var marker = options.mediaType === "movie" ? "movies" : "tv-shows";
  var id = options.platform + "-" + marker;
  var escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var heading = new RegExp("<[^>]+\\bid=[\"']" + escaped + "[\"'][^>]*>", "i").exec(String(html));
  if (!heading) throw new Error("FlixPatrol 未返回可确认的 " + id + " 榜单区域；该来源仍待客户端验证");
  var tail = String(html).slice(heading.index + heading[0].length);
  var table = tail.match(/<table\b[^>]*>([\s\S]*?)<\/table>/i);
  if (!table) throw new Error("FlixPatrol 对应区域缺少可识别表格；该来源仍待客户端验证");
  var nextSection = tail.search(/\bid=["'][a-z0-9-]+-(?:movies|tv-shows)["']/i);
  if (nextSection >= 0 && table.index > nextSection) throw new Error("FlixPatrol 对应区域没有表格，不能读取其他类型的榜单");
  var rows = [], seen = {}, regex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, row;
  while ((row = regex.exec(table[1]))) {
    var firstCell = row[1].match(/<td\b[^>]*>([\s\S]*?)<\/td>/i);
    var rank = firstCell ? westernText(firstCell[1]).match(/^(\d+)\.?$/) : null;
    if (!rank) continue;
    var links = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi, link;
    while ((link = links.exec(row[1]))) {
      var path = westernAttr(link[1], "href"), title = westernText(link[2]);
      if (!/^\/title\//.test(path) || !title || seen[path]) continue;
      seen[path] = true;
      rows.push({ title: title, year: "", mediaType: options.mediaType, rank: Number(rank[1]),
        sourceTitle: "FlixPatrol " + options.platform + " / " + options.region,
        sourceUrl: "https://flixpatrol.com" + path });
      break;
    }
  }
  if (!rows.length || rows.some(function (row, i) { return row.rank !== i + 1; })) {
    throw new Error("FlixPatrol 榜单为空或排名顺序不能确认，停止展示");
  }
  return rows.slice(0, 10);
}

function westernNormalize(title) {
  var text = westernText(title).toLowerCase();
  if (text.normalize) text = text.normalize("NFKD");
  return text.replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\u3400-\u9fff]/g, "");
}

function chooseWesternMatch(source, candidates) {
  var query = westernNormalize(source.title), matches = [], seen = {};
  (Array.isArray(candidates) ? candidates : []).forEach(function (item) {
    if (!item || !item.id || item.adult || (item.media_type && item.media_type !== source.mediaType)) return;
    var names = [item.title, item.original_title, item.name, item.original_name];
    if (!names.some(function (name) { return name && westernNormalize(name) === query; })) return;
    var date = source.mediaType === "movie" ? item.release_date : item.first_air_date;
    if (source.year && String(date || "").slice(0, 4) !== String(source.year)) return;
    if (!seen[item.id]) { seen[item.id] = true; matches.push(item); }
  });
  return matches.length === 1 ? matches[0] : null;
}

async function westernMap(source) {
  var response = await Widget.tmdb.get("search/" + source.mediaType, { params: {
    query: source.title, language: WESTERN_CONFIG.language, include_adult: false,
    page: 1
  } });
  var data = westernUnwrap(response, "TMDB 搜索");
  if (typeof data === "string") data = JSON.parse(data);
  if (!data || !Array.isArray(data.results)) throw new Error("TMDB 搜索结果结构异常");
  var match = chooseWesternMatch(source, data.results);
  if (!match) { westernLog("省略未明确匹配的条目：" + source.title + "（来源序号 " + source.rank + "）"); return null; }
  var details = [source.sourceTitle + " · 原榜序号 " + source.rank];
  if (source.critics) details.push("烂番茄评论家 " + source.critics);
  if (source.audience) details.push("烂番茄观众 " + source.audience);
  details.push("原榜名称：" + source.title);
  details.push("榜单来源：" + source.sourceUrl);
  details.push("影视资料与评分：TMDB");
  if (match.overview) details.push(match.overview);
  return { id: source.mediaType + "." + match.id, type: "tmdb", tmdbId: match.id,
    mediaType: source.mediaType, title: match.title || match.name || source.title,
    description: details.join("\n"), posterPath: match.poster_path || "", backdropPath: match.backdrop_path || "",
    releaseDate: match.release_date || match.first_air_date || "", rating: Number(match.vote_average) || 0,
    genreTitle: source.sourceTitle + " · #" + source.rank };
}

function westernPositiveInteger(value, maximum, label) {
  var number = Number(value);
  if ((typeof value !== "number" && typeof value !== "string") || !Number.isInteger(number) || number < 1 || number > maximum) {
    throw new Error(label + "必须为 1 至 " + maximum + " 的正整数");
  }
  return number;
}

async function loadWestern(params) {
  params = params || {};
  var pageValue = params.page === undefined || params.page === null || params.page === "" ? 1 : params.page;
  var page = westernPositiveInteger(pageValue, 500, "页码");
  var pageSize = westernPositiveInteger(WESTERN_CONFIG.pageSize, 50, "每页数量 pageSize");
  var concurrency = westernPositiveInteger(WESTERN_CONFIG.concurrency, 8, "并发数 concurrency");
  var key = params.list || "rt_movies", list = WESTERN_CONFIG.lists[key], rows;
  var url, options;
  if (list) url = list.url;
  else if (key === "flixpatrol") {
    options = { platform: params.platform || "netflix", region: params.region || "united-states", mediaType: params.mediaType || "movie" };
    if (WESTERN_CONFIG.platforms.indexOf(options.platform) < 0 || WESTERN_CONFIG.regions.indexOf(options.region) < 0 || ["movie", "tv"].indexOf(options.mediaType) < 0) {
      throw new Error("FlixPatrol 平台、地区或类型不在个人配置中");
    }
    url = WESTERN_CONFIG.flixpatrolBase + "/" + options.platform + "/" + options.region + "/";
  } else throw new Error("未配置该榜单");
  var response;
  try { response = await Widget.http.get(url, { headers: { "User-Agent": WESTERN_CONFIG.userAgent } }); }
  catch (error) { throw new Error((key === "flixpatrol" ? "FlixPatrol（当前实测为 403、待验证）" : "烂番茄") + "请求失败：" + (error.message || error)); }
  var html = westernUnwrap(response, key === "flixpatrol" ? "FlixPatrol" : "烂番茄");
  if (typeof html !== "string") throw new Error("榜单网站未返回网页内容");
  rows = list ? parseWesternRT(html, list) : parseWesternFlix(html, options);
  var slice = rows.slice((page - 1) * pageSize, page * pageSize);
  if (!slice.length) return [];
  var output = [], failures = 0;
  for (var i = 0; i < slice.length; i += concurrency) {
    var batch = slice.slice(i, i + concurrency);
    var mapped = await Promise.all(batch.map(async function (source) {
      try { return await westernMap(source); }
      catch (error) { failures++; westernLog(source.title + "匹配请求失败：" + (error.message || error)); return null; }
    }));
    output = output.concat(mapped.filter(Boolean));
  }
  if (!output.length) throw new Error(failures === slice.length ? "本页 TMDB 请求全部失败，榜单未替换为其他内容" : "本页条目均无法明确匹配 TMDB；已省略以避免关联错误影片");
  if (output.length !== slice.length) westernLog("本页显示 " + output.length + "/" + slice.length + " 条；省略歧义、未匹配或请求失败条目，保留原榜序号");
  return output;
}
