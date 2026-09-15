/*
 * Meilieage 个人弹幕模块，全部为可编辑明文。
 * 接口约定：ForwardWidget 官方 danmu.js / README.md；REX 真机兼容性待验证。
 * 数据协议：弹弹play开放弹幕网络 https://www.dandanplay.com
 * 文档：https://doc.dandanplay.com/open/ （官方服务要求应用认证）
 * 只填您自己的兼容服务或已获准使用的服务；本文件不内置他人的服务和密钥。
 */
var WidgetMetadata = {
  id: "meilieage.danmu",
  title: "Meilieage 个人弹幕",
  description: "搜索自己的弹幕服务，支持多源并发搜索、屏蔽词、条数限制和颜色设置。首次使用请配置服务地址。",
  author: "Meilieage",
  site: "https://github.com/Meilieage",
  version: "1.0.0",
  requiredVersion: "0.0.2",
  globalParams: [
    { name: "servers", title: "我的弹幕服务", type: "input", value: "", description: "一行一个：名称|https://您的服务地址。最多5个，名称不可重复。地址可带服务路径，不要带/api/v2。只有一个服务时可直接填地址。" },
    { name: "blockedWords", title: "屏蔽词", type: "input", value: "", description: "多个词用逗号或换行分开；不区分英文字母大小写，按普通文字匹配。" },
    { name: "maxComments", title: "最多弹幕条数", type: "count", value: "5000", description: "范围1—50000。超量时沿整段时间均匀抽取，避免只保留片头。" },
    { name: "colorMode", title: "弹幕颜色", type: "enumeration", value: "original", enumOptions: [ {title:"保留原色",value:"original"}, {title:"统一白色",value:"white"}, {title:"自定义颜色",value:"custom"} ] },
    { name: "customColor", title: "自定义颜色", type: "input", value: "#FFFFFF", description: "自定义颜色模式使用，填写#RRGGBB，例如#80C8FF。" },
    { name: "withRelated", title: "包含服务提供的关联弹幕", type: "enumeration", value: "true", enumOptions: [ {title:"包含",value:"true"}, {title:"不包含",value:"false"} ] }
  ],
  modules: [
    { id: "searchDanmu", title: "搜索弹幕", functionName: "searchDanmu", type: "danmu", cacheDuration: 300, params: [] },
    { id: "getDetail", title: "选择集数", functionName: "getDetailById", type: "danmu", cacheDuration: 300, params: [] },
    { id: "getComments", title: "加载弹幕", functionName: "getCommentsById", type: "danmu", cacheDuration: 300, params: [] }
  ]
};

// 没有全局设置入口的客户端，可在这里直接修改默认值。
// 客户端设置中的非空值优先；服务地址、令牌仅保留在您的设备上，勿上传真实访问凭证。
var DANMU_CONFIG = {
  servers: "",             // 一行一个“名称|https://您的服务地址”；多行用换行符分开
  blockedWords: "",        // 逗号分隔的普通文字屏蔽词
  maxComments: 5000,
  colorMode: "original",   // original / white / custom
  customColor: "#FFFFFF",
  withRelated: "true"
};

function myDanmuSettings(params) {
  var output = Object.assign({}, DANMU_CONFIG);
  Object.keys(params || {}).forEach(function(key) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") output[key] = params[key];
  });
  return output;
}
// 修改服务名称或地址后请清除客户端本模块缓存，再重新搜索。
function myDanmuServers(params) {
  params = myDanmuSettings(params);
  var raw = String(params.servers || "").trim();
  if (!raw) throw new Error("请先在模块设置的“我的弹幕服务”填写自己的兼容服务地址。官方弹弹play需要您自己的应用认证或签名中继。");
  var lines = raw.split(/[\r\n]+/).map(function(x){return x.trim();}).filter(Boolean);
  if (lines.length > 5) throw new Error("最多配置5个弹幕服务。");
  var seenNames = Object.create(null);
  var seenUrls = Object.create(null);
  return lines.map(function(line, index) {
    var separator = line.indexOf("|");
    var name = separator < 0 ? "服务" + (index + 1) : line.slice(0, separator).trim();
    var base = (separator < 0 ? line : line.slice(separator + 1)).trim().replace(/\/+$/, "").replace(/\/api\/v2$/i, "");
    if (!name || name.length > 40 || /[|\r\n]/.test(name)) throw new Error("服务名称不能为空，最多40字，且不能含竖线。");
    // 不接受用户名密码 URL、查询串和片段，防止拼接后的请求含义改变。
    var match = /^(https?):\/\/([^\/?#]+)(\/[^?#]*)?$/i.exec(base);
    if (!match || /[@\s\\]/.test(base) || /[<>"']/.test(base)) throw new Error(name + "：服务地址格式不正确，请填写HTTP或HTTPS服务根地址。");
    var authority = match[2].toLowerCase();
    if (authority === "api.dandanplay.net" || authority.indexOf("api.dandanplay.net:") === 0) throw new Error(name + "：官方弹弹play需要应用认证。请配置由您掌握凭证的签名中继，勿把AppSecret写入公开脚本。");
    if (seenNames[name]) throw new Error("服务名称重复：" + name);
    if (seenUrls[base]) throw new Error("同一个服务地址无需重复配置。");
    seenNames[name] = true;
    seenUrls[base] = true;
    return {name:name, base:base};
  });
}

// ID 只携带服务名称和原编号，不携带服务器地址或路径中的访问令牌。
function myDanmuId(source, id) {
  if (id === undefined || id === null || String(id) === "") throw new Error("服务未返回有效编号。");
  return "rx1|" + encodeURIComponent(source.name) + "|" + encodeURIComponent(String(id));
}

function myDanmuResolve(params, value) {
  var sources = myDanmuServers(params);
  var input = String(value === undefined || value === null ? "" : value);
  if (!input) throw new Error("请先搜索作品，再选择正确集数。");
  if (input.indexOf("rx1|") !== 0) {
    if (sources.length === 1) return {source:sources[0], id:input};
    throw new Error("多源模式需要重新搜索并选择结果，以确定所属服务。");
  }
  var parts = input.split("|");
  if (parts.length !== 3) throw new Error("弹幕编号格式错误，请重新搜索。");
  var name, id;
  try { name = decodeURIComponent(parts[1]); id = decodeURIComponent(parts[2]); }
  catch (_) { throw new Error("弹幕编号无法解析，请重新搜索。"); }
  var source = sources.find(function(item){return item.name === name;});
  if (!source || !id) throw new Error("原服务设置已变化，请清除模块缓存后重新搜索。");
  return {source:source, id:id};
}

async function myDanmuRequest(source, path) {
  var response;
  try {
    response = await Widget.http.get(source.base + path, {headers:{"Accept":"application/json","User-Agent":"MeilieageREX/1.0.0"}});
  } catch (_) { throw new Error(source.name + "：连接失败，请检查服务状态和访问授权。"); }
  var status = response && (response.status || response.statusCode);
  if (!response || (status && (status < 200 || status >= 300))) throw new Error(source.name + "：接口请求失败" + (status ? "（HTTP " + status + "）" : "") + "。");
  var data = response.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (_) { throw new Error(source.name + "：返回内容不是有效JSON。"); }
  }
  if (!data || typeof data !== "object") throw new Error(source.name + "：返回内容为空或格式不正确。");
  if (data.success === false) throw new Error(source.name + "：服务返回失败，请检查接口地址、应用授权及额度。");
  return data;
}

function myDanmuEpisode(source, item) {
  if (!item || item.episodeId === undefined || item.episodeId === null) return null;
  var output = Object.assign({}, item);
  output.episodeId = myDanmuId(source, item.episodeId);
  output.episodeTitle = String(item.episodeTitle || item.title || "未命名集数");
  return output;
}

async function searchDanmu(params) {
  params = myDanmuSettings(params);
  var sources = myDanmuServers(params);
  var title = String(params.title || params.seriesName || "").trim();
  if (!title) throw new Error("搜索关键词不能为空。");
  // 并发检索所有配置服务；各源结果单独标名，避免误把不同版本或季集合并。
  var results = await Promise.all(sources.map(async function(source) {
    try {
      var data = await myDanmuRequest(source, "/api/v2/search/anime?keyword=" + encodeURIComponent(title));
      if (!Array.isArray(data.animes)) throw new Error(source.name + "：搜索结果缺少animes列表。");
      var items = data.animes.map(function(item) {
        if (!item || typeof item !== "object") return null;
        var rawId = item.bangumiId !== undefined && item.bangumiId !== null ? item.bangumiId : item.animeId;
        if (rawId === undefined || rawId === null || String(rawId) === "") return null;
        var output = Object.assign({}, item);
        output.animeId = myDanmuId(source, rawId);
        output.bangumiId = output.animeId;
        output.animeTitle = "[" + source.name + "] " + String(item.animeTitle || item.title || title);
        if (Array.isArray(item.episodes)) output.episodes = item.episodes.map(function(e){return myDanmuEpisode(source,e);}).filter(Boolean);
        return output;
      }).filter(Boolean);
      return {items:items};
    } catch (error) { return {error:error.message}; }
  }));
  var errors = results.filter(function(r){return r.error;}).map(function(r){return r.error;});
  if (errors.length === sources.length) throw new Error(errors.join("\n"));
  if (errors.length && typeof console !== "undefined" && console.warn) console.warn("部分弹幕服务未返回结果：" + errors.join("；"));
  var animes = [];
  results.forEach(function(r){if(r.items) animes = animes.concat(r.items);});
  return {animes:animes};
}

async function getDetailById(params) {
  params = myDanmuSettings(params);
  var selected = myDanmuResolve(params, params.animeId || params.bangumiId);
  var data = await myDanmuRequest(selected.source, "/api/v2/bangumi/" + encodeURIComponent(selected.id));
  if (!data.bangumi || !Array.isArray(data.bangumi.episodes)) throw new Error(selected.source.name + "：详情结果缺少集数列表。");
  return data.bangumi.episodes.map(function(e){return myDanmuEpisode(selected.source,e);}).filter(Boolean);
}

function myDanmuFilter(comments, params) {
  var words = String(params.blockedWords || "").split(/[,，\r\n]+/).map(function(w){return w.trim().toLowerCase();}).filter(Boolean);
  var cap = Number(params.maxComments === undefined || params.maxComments === "" ? 5000 : params.maxComments);
  if (!Number.isFinite(cap) || cap < 1 || cap > 50000 || Math.floor(cap) !== cap) throw new Error("最多弹幕条数必须是1—50000之间的整数。");
  var mode = params.colorMode || "original";
  if (["original","white","custom"].indexOf(mode) < 0) throw new Error("弹幕颜色设置无效。");
  var custom = String(params.customColor || "#FFFFFF");
  if (mode === "custom" && !/^#[0-9a-f]{6}$/i.test(custom)) throw new Error("自定义颜色格式应为#RRGGBB，例如#80C8FF。");
  var forcedColor = mode === "white" ? 16777215 : parseInt(custom.slice(1),16);
  var seen = Object.create(null);
  var normalized = [];
  var validRecords = 0;
  comments.forEach(function(item, index) {
    if (!item || typeof item.p !== "string" || typeof item.m !== "string") return;
    var fields = item.p.split(",");
    var time = Number(fields[0]);
    if (!fields[0].trim() || !Number.isFinite(time) || time < 0 || fields.length < 3) return;
    var text = item.m.trim();
    validRecords += 1;
    if (!text || words.some(function(word){return text.toLowerCase().indexOf(word) >= 0;})) return;
    var position = Number(fields[1]);
    if ([1,4,5].indexOf(position) < 0) position = 1;
    var color = Number(fields[2]);
    if (!Number.isFinite(color) || color < 0 || color > 16777215 || Math.floor(color) !== color) color = 16777215;
    if (mode !== "original") color = forcedColor;
    // 只去除同一时刻、位置、内容相同的重复项，不跨时间误删有意义的重复发言。
    var key = JSON.stringify([time,position,text]);
    if (seen[key]) return;
    seen[key] = true;
    normalized.push({time:time, order:index, value:{p:[String(time),String(position),String(color),fields[3] || "0"].join(","),m:text,cid:item.cid === undefined ? String(index + 1) : String(item.cid)}});
  });
  if (comments.length > 0 && validRecords === 0) throw new Error("服务没有返回有效的弹弹play p/m格式弹幕。本模块暂不支持分段、XML或其他私有格式。");
  normalized.sort(function(a,b){return a.time - b.time || a.order - b.order;});
  if (normalized.length <= cap) return normalized.map(function(x){return x.value;});
  var sampled = [];
  for (var i=0; i<cap; i++) sampled.push(normalized[Math.floor(i * normalized.length / cap)].value);
  return sampled;
}

async function getCommentsById(params) {
  params = myDanmuSettings(params);
  myDanmuFilter([], params); // 先检查设置，再发起网络请求。
  var selected = myDanmuResolve(params, params.commentId);
  var related = String(params.withRelated === undefined ? "true" : params.withRelated) === "true";
  var data = await myDanmuRequest(selected.source, "/api/v2/comment/" + encodeURIComponent(selected.id) + "?withRelated=" + related + "&chConvert=1");
  var comments = Array.isArray(data) ? data : data.comments;
  if (!Array.isArray(comments)) throw new Error(selected.source.name + "：没有返回完整comments列表。本模块暂不支持分段弹幕服务。");
  return myDanmuFilter(comments, params);
}
