var WidgetMetadata = {
  "id": "meilieage.library",
  "title": "Meilieage · 影视合集",
  "description": "骨朵热榜、影视发现、平台片单与欧美榜单。可直接添加的明文模块。",
  "author": "Meilieage（个人定制）",
  "site": "https://github.com/Meilieage/REX-mod",
  "version": "1.0.0",
  "requiredVersion": "0.0.1",
  "modules": [
    {
      "title": "骨朵日榜",
      "description": "日期留空时查找最近有数据的日期；只展示能明确匹配影视资料的项目。",
      "functionName": "loadGuduo",
      "requiresWebView": false,
      "cacheDuration": 1800,
      "params": [
        {
          "name": "category",
          "title": "分类",
          "type": "enumeration",
          "value": "剧集",
          "enumOptions": [
            {
              "title": "剧集",
              "value": "剧集"
            },
            {
              "title": "综艺",
              "value": "综艺"
            },
            {
              "title": "动漫",
              "value": "动漫"
            },
            {
              "title": "电影",
              "value": "电影"
            }
          ]
        },
        {
          "name": "date",
          "title": "榜单日期（留空取最近一期）",
          "type": "input",
          "value": "",
          "description": "YYYY-MM-DD"
        },
        {
          "name": "keyword",
          "title": "名称筛选（可留空）",
          "type": "input",
          "value": ""
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page"
        }
      ]
    },
    {
      "title": "热门、趋势与高分",
      "description": "TMDB 榜单；不代表豆瓣或视频平台自家榜单。",
      "requiresWebView": false,
      "functionName": "loadCharts",
      "cacheDuration": 1800,
      "params": [
        {
          "name": "mediaType",
          "title": "类型",
          "type": "enumeration",
          "value": "movie",
          "enumOptions": [
            {
              "title": "电影",
              "value": "movie"
            },
            {
              "title": "剧集",
              "value": "tv"
            }
          ]
        },
        {
          "name": "chart",
          "title": "榜单",
          "type": "enumeration",
          "value": "popular",
          "enumOptions": [
            {
              "title": "热门",
              "value": "popular"
            },
            {
              "title": "每日趋势",
              "value": "day"
            },
            {
              "title": "每周趋势",
              "value": "week"
            },
            {
              "title": "TMDB 高分榜",
              "value": "top_rated"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "分类与地区片单",
      "description": "按作品出品地区筛选；综艺相关分类采用 TMDB 的真人秀、脱口秀分类。",
      "requiresWebView": false,
      "functionName": "loadCategories",
      "cacheDuration": 1800,
      "params": [
        {
          "name": "category",
          "title": "分类",
          "type": "enumeration",
          "value": "movie",
          "enumOptions": [
            {
              "title": "电影",
              "value": "movie"
            },
            {
              "title": "剧集",
              "value": "tv"
            },
            {
              "title": "动画电影",
              "value": "animation_movie"
            },
            {
              "title": "动画剧集",
              "value": "animation_tv"
            },
            {
              "title": "真人秀（综艺相关）",
              "value": "reality"
            },
            {
              "title": "脱口秀（综艺相关）",
              "value": "talk"
            }
          ]
        },
        {
          "name": "originCountry",
          "title": "出品地区",
          "type": "enumeration",
          "value": "all",
          "enumOptions": [
            {
              "title": "全部",
              "value": "all"
            },
            {
              "title": "中国大陆",
              "value": "CN"
            },
            {
              "title": "中国香港",
              "value": "HK"
            },
            {
              "title": "中国台湾",
              "value": "TW"
            },
            {
              "title": "日本",
              "value": "JP"
            },
            {
              "title": "韩国",
              "value": "KR"
            },
            {
              "title": "美国",
              "value": "US"
            },
            {
              "title": "英国",
              "value": "GB"
            }
          ]
        },
        {
          "name": "sort",
          "title": "排序",
          "type": "enumeration",
          "value": "popular",
          "enumOptions": [
            {
              "title": "热度",
              "value": "popular"
            },
            {
              "title": "评分（设置最低评价人数）",
              "value": "rating"
            }
          ]
        },
        {
          "name": "minVotes",
          "title": "评分排序的最低评价人数",
          "type": "input",
          "value": "100",
          "description": "仅评分排序使用；减少评价人数很少的作品占据前列。"
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "按平台筛选电影、剧集",
      "description": "平台名称或编号会先与 TMDB 当前清单核对。数据来源：JustWatch / TMDB。观看地区与作品出品地区不同。",
      "functionName": "loadPlatformTitles",
      "requiresWebView": false,
      "cacheDuration": 1800,
      "params": [
        {
          "name": "mediaType",
          "title": "类型",
          "type": "enumeration",
          "value": "tv",
          "enumOptions": [
            {
              "title": "剧集",
              "value": "tv"
            },
            {
              "title": "电影",
              "value": "movie"
            }
          ]
        },
        {
          "name": "provider",
          "title": "平台名称或 TMDB 平台编号",
          "type": "input",
          "value": "Netflix",
          "description": "优先输入完整名称。查无结果或名称有歧义时，错误提示会列出可选名称和编号。",
          "placeholders": [
            {
              "title": "Netflix",
              "value": "Netflix"
            },
            {
              "title": "Disney Plus",
              "value": "Disney Plus"
            },
            {
              "title": "Amazon Prime Video",
              "value": "Amazon Prime Video"
            },
            {
              "title": "Apple TV",
              "value": "Apple TV"
            }
          ]
        },
        {
          "name": "watchRegion",
          "title": "观看地区（两位地区代码）",
          "type": "input",
          "value": "US",
          "description": "例如 US 美国、TW 中国台湾、HK 中国香港、JP 日本。只支持 TMDB / JustWatch 实际覆盖的地区。",
          "placeholders": [
            {
              "title": "美国",
              "value": "US"
            },
            {
              "title": "中国台湾",
              "value": "TW"
            },
            {
              "title": "中国香港",
              "value": "HK"
            },
            {
              "title": "日本",
              "value": "JP"
            },
            {
              "title": "韩国",
              "value": "KR"
            },
            {
              "title": "英国",
              "value": "GB"
            }
          ]
        },
        {
          "name": "monetization",
          "title": "观看方式",
          "type": "enumeration",
          "value": "flatrate",
          "enumOptions": [
            {
              "title": "订阅",
              "value": "flatrate"
            },
            {
              "title": "免费或广告支持",
              "value": "free|ads"
            },
            {
              "title": "租赁或购买",
              "value": "rent|buy"
            },
            {
              "title": "所有方式",
              "value": "all"
            }
          ]
        },
        {
          "name": "sort",
          "title": "排序",
          "type": "enumeration",
          "value": "popular",
          "enumOptions": [
            {
              "title": "TMDB 热度",
              "value": "popular"
            },
            {
              "title": "评分（设置最低评价人数）",
              "value": "rating"
            }
          ]
        },
        {
          "name": "minVotes",
          "title": "评分排序的最低评价人数",
          "type": "input",
          "value": "100",
          "description": "仅评分排序使用。"
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page",
          "value": "1"
        }
      ]
    },
    {
      "title": "欧美榜单",
      "description": "烂番茄电影、剧集页面已验证；FlixPatrol 当前测试网络返回 403。匹配不明确的条目会省略。",
      "functionName": "loadWestern",
      "requiresWebView": false,
      "cacheDuration": 1800,
      "params": [
        {
          "name": "list",
          "title": "榜单",
          "type": "enumeration",
          "value": "rt_movies",
          "enumOptions": [
            {
              "title": "烂番茄 · 流媒体热门电影",
              "value": "rt_movies"
            },
            {
              "title": "烂番茄 · 热门剧集",
              "value": "rt_tv"
            },
            {
              "title": "FlixPatrol · 待验证",
              "value": "flixpatrol"
            }
          ]
        },
        {
          "name": "platform",
          "title": "FlixPatrol 平台",
          "type": "enumeration",
          "value": "netflix",
          "belongTo": {
            "paramName": "list",
            "value": [
              "flixpatrol"
            ]
          },
          "enumOptions": [
            {
              "title": "Netflix",
              "value": "netflix"
            },
            {
              "title": "Disney+",
              "value": "disney"
            },
            {
              "title": "HBO",
              "value": "hbo"
            },
            {
              "title": "Amazon Prime",
              "value": "amazon-prime"
            },
            {
              "title": "Apple TV",
              "value": "apple-tv"
            }
          ]
        },
        {
          "name": "region",
          "title": "FlixPatrol 地区",
          "type": "enumeration",
          "value": "united-states",
          "belongTo": {
            "paramName": "list",
            "value": [
              "flixpatrol"
            ]
          },
          "enumOptions": [
            {
              "title": "美国",
              "value": "united-states"
            },
            {
              "title": "英国",
              "value": "united-kingdom"
            },
            {
              "title": "日本",
              "value": "japan"
            },
            {
              "title": "韩国",
              "value": "south-korea"
            }
          ]
        },
        {
          "name": "mediaType",
          "title": "FlixPatrol 类型",
          "type": "enumeration",
          "value": "movie",
          "belongTo": {
            "paramName": "list",
            "value": [
              "flixpatrol"
            ]
          },
          "enumOptions": [
            {
              "title": "电影",
              "value": "movie"
            },
            {
              "title": "剧集",
              "value": "tv"
            }
          ]
        },
        {
          "name": "page",
          "title": "页码",
          "type": "page"
        }
      ]
    }
  ],
  "search": {
    "title": "Meilieage · 名称搜索",
    "functionName": "searchTitles",
    "params": [
      {
        "name": "query",
        "title": "片名",
        "type": "input",
        "value": ""
      },
      {
        "name": "mediaType",
        "title": "类型",
        "type": "enumeration",
        "value": "multi",
        "enumOptions": [
          {
            "title": "电影和剧集",
            "value": "multi"
          },
          {
            "title": "电影",
            "value": "movie"
          },
          {
            "title": "剧集",
            "value": "tv"
          }
        ]
      },
      {
        "name": "page",
        "title": "页码",
        "type": "page",
        "value": "1"
      }
    ]
  }
};

// 本文件含四个影视模块的完整实现，无需导入资源库目录，也不动态加载远程脚本。

// ===== Meilieage · 骨朵热榜 =====
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

// ===== Meilieage · 影视发现 =====
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

// ===== Meilieage · 平台片单 =====
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

// ===== Meilieage · 欧美榜单 =====
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
