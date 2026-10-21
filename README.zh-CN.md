<div align="center">

# ✈ Skyfolio · 航迹

**用 Excel 记录航班，在地图上查看行程。**

本地 Excel 驱动的飞行手账：航线地图、登机牌式详情、旅行统计，保存后自动更新。

[English](README.md) · **简体中文**

[在线 Demo](https://zjlshuyu110.github.io/skyfolio/demo/?lang=zh-CN) · [开始使用](#开始使用) · [发布演示](#发布演示)

</div>

![中文版界面 — 全部为虚构行程](docs/assets/demo-zh.jpg)

## 能做什么

在 Excel 中添加或修改航班，保存后即可查看更新后的地图和统计。界面支持中英文切换。

| 功能 | 说明 |
| --- | --- |
| 交互地图 | 大圆航线、地区切换、缩放和拖动，点击航线查看对应记录。 |
| 搜索筛选 | 按航班号、城市、机场、预订号搜索，按年份和航司筛选。 |
| 旅行统计 | 已乘坐航段、估算里程、机场、国家与地区、计划飞行时长。 |
| 保留凭证 | 当地时刻、原始备注、推定字段、预订号和来源链接。 |
| 变更历史 | 取消及被替换的旧票单独保存，不计入已乘坐统计。 |
| 自动同步 | 约每 3 秒检查 Excel 保存更新，读不到文件时保留上次成功读取的数据。 |
| 双语界面 | 简体中文与英文随时切换，当前浏览器记住选择。 |
| 独立演示 | 用虚构行程展示体验，无需公开个人 Excel。 |

这是独立的个人航班历史项目，与 Flighty 无关联，不提供实时航班追踪。

## 体验 Demo

包含 **20 段虚构航班和 2 条取消示例**。航班号、时刻、预订号均为演示编造，不对应真实订单，不会读取你的 Excel 或调用本机 Excel 接口。

Windows 双击 **Start Demo.cmd**。其他已安装 Python 3 的环境，在项目根目录运行：

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory docs
```

打开 **http://127.0.0.1:8766/demo/**。右上角切换语言，或在网址后添加 `?lang=zh-CN` / `?lang=en`。请通过本地服务访问，不要直接双击 HTML 文件。

**[打开在线 Demo](https://zjlshuyu110.github.io/skyfolio/demo/?lang=zh-CN)**，通过 GitHub Pages 部署 `docs/` 中的静态演示。

## 开始使用

需要 **Python 3.10+**、现代浏览器及 `.xlsx` 文件：

```sh
python -m pip install -r requirements.txt
python outputs/flight-journal/app.py --workbook "你的Excel绝对路径.xlsx"
```

打开 **http://127.0.0.1:8765/**。

Windows 用户也可修改 `outputs/flight-journal/config.json` 中的 `workbook`，再双击 **启动航迹.cmd** 或 **Start Flight Journal.cmd**。相对路径以配置文件所在目录为基准，Windows JSON 路径可使用正斜杠。

启动器优先复用已有的 Codex Python，找不到时使用系统 `python`。默认配置指向作者本机的私人 Excel，该文件夹被 Git 忽略；新下载源码需要自行放入表格并配置路径。“打开 Excel”按钮使用 Windows 文件关联，其他系统请手动打开表格。

### 表格格式

支持中文和英文 Excel 格式，界面语言可独立切换。以下是中文格式，英文表名、表头和状态见 [English README](README.md#workbook-format)。列顺序可调整，标题需在前 20 行内；同一工作表或列不要同时放入两种语言版本。

| 工作表 | 用途 |
| --- | --- |
| `航班记录` | 必须存在的主表。 |
| `取消及旧票` | 可选，保存取消或被替换的原票。 |
| `待补充线索` | 可选，从第 5 行读取 C–E 列的标题、详情、背景。 |

| 列名 | 内容 |
| --- | --- |
| `起飞日期` | YYYY-MM-DD 或 Excel 日期，有效日期才显示该行。 |
| `航班号` | 航班编号。 |
| `出发机场`、`到达机场` | 必须保留两个标题，值以三字码开头，如 AMS 阿姆斯特丹。 |
| `起飞时间`、`到达日期`、`到达时间` | 计划当地时间及到达日期，支持 HH:MM 或 Excel 时间。 |
| `航空公司`、`订单/预订号` | 航司及预订信息。 |
| `凭证状态`、`乘坐/导入判定` | 记录依据及乘坐状态。 |
| `备注`、`来源邮箱`、`邮件日期` | 原始备注和来源信息。 |
| `原邮件链接`、`补充来源链接` | HTTP(S) 链接，一行一条。 |

状态为 `已乘坐`、`推定已乘坐`、`已导入` 时计入足迹；取消表中的记录始终不计入。主表中其他状态仍可查看，但不计入已乘坐总数。原始备注和凭证说明保持原文，不随语言改写。

无有效起飞日期的行会跳过并提示；时间缺失只影响时长；无法识别的机场不计入相应地图与里程。跨日、跨日期变更线的航班请准确填写到达日期。

## 发布演示

1. 修改界面后运行 `python scripts/build_demo.py` 重新生成静态演示。
2. 检查待提交内容，将源码和 `docs/` 推送到选定的 GitHub 仓库。
3. 在 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**，选择发布分支及 **/docs**，保存。
4. GitHub 给出网址后，将其补到仓库 About 和两份 README 中。

步骤依据 [GitHub 官方发布来源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。Pages 运行静态演示，读取 Excel 的服务继续在本机运行。本仓库已配置从 `main` 分支的 `/docs` 目录发布演示。

## 目录与私人资料

- `outputs/flight-journal/`：Python 服务、配置、启动器及 `web/` 界面。
- `outputs/flighty-history-20261007/`：私人 Excel，已被 Git 忽略。
- `scripts/`：虚构数据生成与明确文件清单的静态构建。
- `docs/demo/`：可发布的演示；`docs/assets/`：虚构数据截图。
- `tests/`：可公开运行的检查。
- `work/`：私人凭证、历史备份、日志，已被 Git 忽略。

Demo 构建只复制明确列出的前端文件，不读取私人表格或研究资料。忽略规则排除私人 Excel、凭证、原始个人截图和日志。上传前请检查待提交文件；已被 Git 跟踪的文件不会因添加忽略规则而自动移除。

## 开发与验证

原生 JavaScript、CSS、SVG，不需要 npm 或前端框架。修改 `outputs/flight-journal/web/`，翻译字典位于 `i18n.js`。

```sh
python scripts/build_demo.py
python -m unittest discover -s tests -v
```

安装依赖后运行 `python scripts/generate_demo.py` 可重新生成虚构数据，然后再构建。依赖私人历史资料的测试仍在被忽略的 work 文件夹中。

里程为机场间大圆距离估算，并非实际航迹；时长按计划时刻和机场时区计算，并非实际空中时间。国家与地区统计包含中转等起降地点。

## 数据致谢

[Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) 提供公共领域地图；[airportsdata](https://github.com/mborsetti/airportsdata) 提供机场与时区，附带 [MIT 许可](outputs/flight-journal/web/data/airports-LICENSE.txt)；[OurAirports](https://ourairports.com/data/) 提供历史机场补充数据。

第三方数据保留各自许可；项目原创代码的开源许可证尚未选定。


