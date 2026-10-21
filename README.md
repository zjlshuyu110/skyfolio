<div align="center">

# ✈ Skyfolio · Flight Journal

**Your flights, remembered. Your workbook, in control.**

An interactive flight journal powered by your local Excel workbook.

**English** · [简体中文](README.zh-CN.md)

[Live demo](https://zjlshuyu110.github.io/skyfolio/demo/?lang=en) · [Quick start](#quick-start) · [Publish the demo](#publish-the-demo)

</div>

![English interface — entirely fictional journeys](docs/assets/demo-en.jpg)

## A home for every flight

Turn spreadsheet rows into a route map, travel statistics and boarding-pass-style flight details. Keep editing your workbook; the journal follows along when you save.

| Feature | What it does |
| --- | --- |
| Interactive map | Great-circle routes, region presets, zoom, pan and clickable routes. |
| Search & filters | Find flights by number, city, airport or booking; filter by year and airline. |
| Travel statistics | Flights taken, estimated distance, airports, countries/regions and scheduled duration. |
| Evidence preserved | Original notes, booking references, source links and inferred-field labels. |
| Separate change history | Canceled and replaced tickets do not count toward flown totals. |
| Excel auto-sync | Checks saved changes about every 3 seconds; retains the last good snapshot during read failures. |
| English & Chinese | Switch instantly; the browser remembers your language. |
| Static demo | Share the interface without publishing a personal workbook. |

An independent project, not affiliated with Flighty. This is a history journal, not a live flight tracker.

## Try the demo

The demo contains **20 fictional flights and 2 canceled examples**. Flight numbers, times and booking references are synthetic. It never reads your workbook or calls the Excel API.

On Windows, double-click **Start Demo.cmd**. Otherwise, run from the project root:

```sh
python -m http.server 8766 --bind 127.0.0.1 --directory docs
```

Open **http://127.0.0.1:8766/demo/**. Use the language button, or add `?lang=en` / `?lang=zh-CN` to the URL. Serve the folder over HTTP rather than opening the HTML file directly.

**[Open the live demo](https://zjlshuyu110.github.io/skyfolio/demo/?lang=en)** — hosted on GitHub Pages from `docs/`.

## Quick start

Requires **Python 3.10+**, a modern browser and an `.xlsx` workbook.

```sh
python -m pip install -r requirements.txt
python outputs/flight-journal/app.py --workbook "/absolute/path/to/flights.xlsx"
```

Open **http://127.0.0.1:8765/**.

For the Windows launcher, edit `workbook` in `outputs/flight-journal/config.json`, then double-click **Start Flight Journal.cmd** (or **启动航迹.cmd**). Relative paths resolve from the configuration folder. Forward slashes work for Windows JSON paths.

The launcher reuses an existing Codex Python runtime or falls back to `python` on PATH. The bundled configuration points to the owner's private workbook folder, which is excluded from Git: a fresh clone needs your own workbook and path. **Open Excel** uses Windows file associations; on other platforms open the workbook manually.

### Workbook format

Switching UI language does not change the schema. Keep these Chinese names exactly as written; headers can be reordered and must appear within the first 20 rows.

| Sheet | Purpose |
| --- | --- |
| `航班记录` | Required main flight sheet. |
| `取消及旧票` | Optional canceled/replaced tickets. |
| `待补充线索` | Optional legacy notes: title/detail/context in columns C–E, from row 5. |

| Headers | Meaning |
| --- | --- |
| `起飞日期` | Departure date, YYYY-MM-DD or Excel date; required for a row to appear. |
| `航班号` | Flight number. |
| `出发机场`, `到达机场` | Required headers. Values start with IATA codes, e.g. SFO San Francisco. |
| `起飞时间`, `到达日期`, `到达时间` | Scheduled local departure time, arrival date and arrival time; HH:MM or Excel time. |
| `航空公司`, `订单/预订号` | Airline and booking reference. |
| `凭证状态`, `乘坐/导入判定` | Evidence description and flight status. |
| `备注`, `来源邮箱`, `邮件日期` | Original notes and source metadata. |
| `原邮件链接`, `补充来源链接` | HTTP(S) source URLs, one per line. |

Statuses `已乘坐` (flown), `推定已乘坐` (inferred flown), and `已导入` (imported) count as flown. Canceled-sheet entries never count. Other statuses remain in the main list without contributing to flown totals. Original notes and evidence are not translated.

Invalid departure dates are skipped with a notice. Incomplete times omit duration; unknown airport codes omit their map positions and distance estimates. Enter the correct arrival date for overnight/date-line journeys.

## Publish the demo

1. Rebuild the static files after changing the UI: `python scripts/build_demo.py`.
2. Review and push your source and `docs/` folder to your chosen repository.
3. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, your publishing branch, and **/docs**. Save.
4. Add the resulting URL to the repository's About section and both READMEs.

See [GitHub's publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Pages serves the static preview; the Python Excel service stays local. This repository publishes its demo from the `main` branch, `/docs` folder.

## Structure & privacy

- `outputs/flight-journal/`: Python service, configuration, launchers and `web/` UI.
- `outputs/flighty-history-20261007/`: private workbook, ignored by Git.
- `scripts/`: fictional data generation and allowlisted static build.
- `docs/demo/`: generated public demo; `docs/assets/`: fictional-data screenshots.
- `tests/`: public checks.
- `work/`: private research, backups and logs, ignored by Git.

The demo build copies only explicitly listed frontend files and never reads personal workbooks or research archives. Ignore rules exclude personal Excel, evidence, personal screenshots and logs. Review staged files before publishing: ignore rules do not remove already-tracked files.

## Development

Plain JavaScript, CSS and SVG; no npm install or frontend framework required. Edit `outputs/flight-journal/web/`; translations are in `i18n.js`.

```sh
python scripts/build_demo.py
python -m unittest discover -s tests -v
```

To regenerate fictional data, install requirements and run `python scripts/generate_demo.py`, then rebuild. Private historical tests remain in the ignored work folder.

Distance is estimated between airports, not along the flown track. Duration uses scheduled timestamps and airport time zones, not actual airborne time. Country/region counts include connection airports.

## Credits

[Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) supplies the public-domain map. [airportsdata](https://github.com/mborsetti/airportsdata) supplies airports/time zones under its [MIT license](outputs/flight-journal/web/data/airports-LICENSE.txt). [OurAirports](https://ourairports.com/data/) supplies historical airport supplements.

Third-party data retains its own licensing. A license for the project's original code has not yet been selected.


