# REX-mod · Meilieage 个人明文模块

这是一组按 Meilieage 的需求独立编写的个人模块，供 REX 导入验证。文件均为可编辑的 JavaScript，没有加密。脚本、配置和后续修改由你管理；榜单、影视资料和弹幕仍来自数据服务。

它们是原目录五类用途的替代实现，不是对原加密文件的解密，也不保证与原版所有选项完全一致。原目录作者信息与参考来源见下文。

## 五个独立模块

| 文件 | 用途 | 实际范围与限制 |
| --- | --- | --- |
| modules/meilieage-guduo.js | 骨朵热榜 | 直接读取骨朵剧集、综艺、动漫、电影日榜；标明实际榜单日期；支持名称筛选和分页；仅展示能明确匹配 TMDB 的项目。 |
| modules/meilieage-discover.js | 影视发现 | 基于 TMDB 的热门、趋势、评分、分类和搜索；不宣称复现原“终极聚合”的全部平台。 |
| modules/meilieage-platforms.js | 平台片单 | 按地区、电影或剧集及平台筛选 TMDB/JustWatch 收录的可观看片单；不是平台官方热度榜，也不是豆瓣榜单。 |
| modules/meilieage-western.js | 欧美榜单 | 读取可访问的公开榜单并匹配 TMDB；数据网站访问受限时明确报错，不用其他榜单顶替。具体选项以文件中的模块设置为准。 |
| modules/meilieage-danmu.js | 个人弹幕 | 配置自己的弹弹play协议兼容服务后使用；多源并发搜索、屏蔽词、条数限制、颜色设置；未配置服务时不能取得弹幕。 |

## 如何修改

用文本编辑器打开对应 .js 文件即可。

- 显示名称：修改 WidgetMetadata.title；修改模块内 title 可调整列表名称。
- 作者与个人主页：修改 WidgetMetadata.author 和 site；不需要改动技术标识 id。
- 骨朵设置：在 GUDUO_CONFIG 中修改每页条数、查询最近天数、并发数等。
- 其他模块：使用代码开头的设置区或模块参数；具体字段附有中文说明。
- 保留每个模块独立的 id，避免覆盖客户端里原作者的模块。
- 修改后更新 version，再在客户端刷新来源；缓存可能使旧内容短时间继续显示。

## 导入与托管

仓库地址：[Meilieage/REX-mod](https://github.com/Meilieage/REX-mod)，分支为 `main`。

### 推荐先验证：影视合集单脚本

[添加 Meilieage · 影视合集](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-library.js)

复制以下完整地址，粘贴到之前成功添加骨朵单模块的同一个入口：

```text
https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-library.js
```

这个文件本身包含四个影视模块的完整实现、一个 `WidgetMetadata`，以及五个列表菜单和影视搜索入口。它不需要先解析资源库目录，也不动态下载执行其他脚本。菜单为骨朵日榜、热门/趋势/高分、分类与地区片单、按平台筛选、欧美榜单。

合集与单独脚本是两种使用方式，选择一种即可，避免显示重复功能。合集仍需 REX 实机验证；已有的成功反馈仅针对骨朵单模块。

弹幕保持单独添加：[Meilieage 个人弹幕](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-danmu.js)。首次使用仍须填写自己的兼容服务地址。

### 备选：分别添加五个单模块

| 模块 | 脚本地址 |
| --- | --- |
| 骨朵热榜 | [meilieage-guduo.js](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-guduo.js) |
| 影视发现 | [meilieage-discover.js](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-discover.js) |
| 平台片单 | [meilieage-platforms.js](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-platforms.js) |
| 欧美榜单 | [meilieage-western.js](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-western.js) |
| 个人弹幕 | [meilieage-danmu.js](https://raw.githubusercontent.com/Meilieage/REX-mod/main/modules/meilieage-danmu.js) |

### 目录导入问题的已知状态

用户提供的 REX 版本截图为 **0.1.0（10）**。本次反馈与复核：

- `modules/meilieage-guduo.js` 可以添加；这不等于其数据加载已经实机验证。
- 本仓库 `REX.js` 及改名后的 `REX.fwd` 均提示“模块校验失败”。
- 原作者的 `MakkaPakka.js` 在同一个入口可以添加。重新读取发现，它与本仓库修正版目录同为 `title / description / icon / widgets` 的 JSON 结构，条目字段也一致。
- 因此，先前将问题归为“.js 扩展名不适用于目录”或“该入口不支持 JSON 目录”的判断缺少依据，现明确更正。补图标、改为 `.fwd` 未解决本次问题。
- 已观察到托管服务器响应类型不同，但没有 REX 客户端日志或校验器证据，不能据此断言根因。
- 新增影视合集是绕过目录导入的替代方案，**不表示已修好原目录导入**。

根目录 `REX.js`、`REX.fwd` 和 `assets/icon.png` 暂保留，当前不再把两个目录地址推荐为已验证可用的导入方案。

### 后续维护

使用合集时，修改 `modules/meilieage-library.js` 内对应功能的代码和配置，并更新其版本后在客户端刷新。合集是静态文件，修改独立模块不会自动同步到合集；若两种形式都维护，需要同步对应实现。保留模块 ID，避免客户端把更新识别成另一个模块。

## 数据与兼容性边界

1. 四个榜单/片单模块显示影视元数据，不提供影视视频文件或播放服务；能浏览片单不代表客户端已有对应片源。
2. Widget.tmdb 由客户端提供。本地环境无法验证客户端的 TMDB 登录、网络或内置接口是否可用。
3. 骨朵榜单在测试时，2026-09-14 数据暂空，2026-09-13 四类各返回20条。模块会在指定范围内查找最近有数据的日期，显示原榜日期和名次，不冒充当日数据。
4. 同名作品无法明确匹配时省略，并说明原因，因此展示数量可能少于原榜。电影/剧集的编号与类别一并保留，避免同号错绑。
5. 弹幕模块不内置陌生服务或他人的访问密钥；需要你已有的兼容服务。官方弹弹play开放平台有应用认证要求，不能把公开接口地址等同于匿名可用服务。服务器提供的繁简转换不等于模块自带完整转换能力。
6. 实现依据是 ForwardWidget 官方公开协议与原作者公开模块所用的接口形式。尚未找到 REX 完整公开模块规范。用户已确认骨朵单模块可添加；其余模块、合集及实际交互仍需要手机端验证。

## 参考来源

- 用户指定的原目录：https://rex.fwd.ccwu.cc/js/MakkaPakka.js
- 原作者公开模块仓库：https://github.com/MakkaPakka518/FW
- 原作者榜单更新脚本（用于核实上游接口）：https://github.com/MakkaPakka518/List/blob/main/scripts/update_guduo.py
- ForwardWidget 官方模块规范：https://github.com/InchStudio/ForwardWidgets
- 官方弹幕示例：https://github.com/InchStudio/ForwardWidgets/blob/master/widgets/danmu.js
- TMDB API 文档：https://developer.themoviedb.org/reference/intro/getting-started
- 弹弹play开放平台：https://doc.dandanplay.com/open/

本次未改写、解密或重新署名原作者的加密文件。个人模块代码按公开协议与经验证的数据结构重新实现，由 Codex 按 Meilieage 需求编写。
## 本地验证记录（2026-09-15）

- 五个脚本的语法、元数据、函数入口、参数默认值、唯一编号和资源库目录引用均已检查。
- 骨朵模块：11组本地模拟与真实响应结构测试通过；四类上游日榜实测可返回数据。
- 影视发现与平台片单：26组本地隔离模拟测试通过；覆盖分页、类型、动态分类/平台匹配、歧义、缓存和异常响应。
- 个人弹幕：10组本地模拟测试通过；覆盖并发、集数隔离、缺少服务配置、屏蔽词、去重、排序、数量与颜色设置。
- 欧美榜单：实测烂番茄电影页、剧集页各解析28条；匹配、分页、异常、榜单类型隔离及错误配置测试通过。FlixPatrol 在上述测试网络中返回403，该记录不能证明该来源目前可用。
- 影视合集：14 组本地集成检查通过；46 个原顶层名称无冲突；同一上下文顺序调用五个列表入口和搜索入口，结果及请求参数与原独立脚本一致；导入时无网络请求。使用受控响应及 Node VM，不能代表 REX 实机验证。
- 手机端反馈：REX 0.1.0（10）可添加骨朵单模块，原作者目录也可添加；本仓库两个 JSON 目录仍校验失败。
- 未验证：其余单模块及新合集的实机导入和交互、客户端真实 TMDB 调用、用户弹幕服务连接。不能把本地模拟通过视为手机端已经可用。

弹幕版本只支持完整的弹弹play p/m JSON响应；未实现XML、分段弹幕或本地完整繁简转换。