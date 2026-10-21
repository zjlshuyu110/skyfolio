'use strict';
// Interface translations only. Workbook notes and evidence are never rewritten.
const UI_EN = {
  '航迹':'Flight Journal', '航迹 · 我的飞行手账':'Flight Journal · Your flights, remembered',
  '跳到主要内容':'Skip to content','航迹 首页':'Flight Journal home','我的旅程':'MY JOURNEY','主要导航':'Main navigation',
  '飞行总览':'Overview','航班记录':'Flights','航线地图':'Route map','取消与旧票':'Canceled & replaced','数据与同步':'Data & sync',
  '只在本机运行':'Runs on your computer','收藏每一次抵达':'Every arrival, remembered','我的空间':'My journal',
  '正在读取 Excel':'Reading Excel','打开 Excel':'Open Excel','正在展开你的旅程':'Unfolding your journeys',
  '读取本地 Excel 航班记录…':'Reading your local workbook…','每一次出发，都值得被记住。':'Every departure deserves a memory.',
  '本地 Excel 驱动 · 无需上传数据':'Powered by local Excel · No upload needed',
  '每一次出发，都有迹可循。':'Every flight. A story worth keeping.', '我的飞行手账':'My flight journal',
  '筛选年份':'Filter by year','全部年份':'All years','飞行统计':'Flight statistics','已乘坐航段':'Flights taken','段':'flights',
  '所有年份的飞行记忆':'Your lifetime flight collection','累计飞行里程':'Distance traveled','约绕地球':'Around the Earth',
  '圈':'times','估算':'estimated','涉及国家与地区':'Countries & regions','个':'visited','足迹连接了':'Connected through',
  '座机场':'airports','计划飞行时长':'Scheduled flight time','小时':'h','分':'min','飞行足迹地图':'Flight map',
  '我的飞行足迹':'Your world, connected','地图视角':'Map region','世界':'World','欧洲':'Europe','北美':'N. America','亚洲':'Asia',
  '航线地图，可拖动、缩放，点击航线查看记录':'Route map. Drag to pan, zoom, or select a route.',
  '这个筛选条件下还没有飞行足迹':'No flights match this view.','放大地图':'Zoom in','缩小地图':'Zoom out','重置地图视角':'Reset map',
  '已乘坐航线':'Routes flown','点击航线查看 · 拖动地图探索':'Select a route · Drag to explore',
  '旅程，等待下一次出发':'Your next story starts here','保存 Excel 中的航班后，这里会自动出现。':'Save a flight in Excel to see it here.',
  '航班号待补':'Flight number pending','待补航班号':'Flight number pending','航空公司待补':'Airline pending','跨日':'+day',
  '出发日期':'Departure date','常飞航线':'Favorite routes','我的熟悉航路':'Familiar skies','次':'flights','还没有航线记录':'No routes yet',
  '搜索航班、城市、机场或预订号':'Search flight, city, airport or booking','搜索航班':'Search flights','筛选航空公司':'Filter by airline',
  '全部航空公司':'All airlines','清除筛选':'Clear filters','没有找到匹配的航班':'No matching flights',
  '试试其他城市、航班号，或者切换年份。':'Try another city, flight number or year.','重置筛选':'Reset filters',
  '航班':'Flight','航线':'Route','当地计划时间':'Scheduled local time','里程':'Distance','记录':'Record','详情':'Details',
  '含推定字段':'Inferred fields','最近的飞行':'Recent flights','我的航班':'Your flights',
  '每一段旅程，都在这里留下记录':'A place for every journey.','再看 20 段':'Show 20 more',
  '让回忆，自动归档。':'Your memories. Always in sync.',
  '照常编辑 Excel，保存后这里会自动更新。':'Edit your workbook as usual. Save it, and this journal updates.',
  '正在读取的 Excel':'Connected workbook','本地文件':'Local file','复制路径':'Copy path','立即刷新':'Refresh now',
  '文件最后保存':'Last saved','同步方式':'Sync method','每 3 秒自动检查':'Checked every 3 seconds',
  '主表 / 取消及旧票':'Flights / canceled & replaced','连接状态':'Connection',
  '你的 Excel，就是数据源。':'Your workbook is the source.',
  '在原表中更新航班':'Update your flights','修改、添加或删除行都可以，保留工作表名与列标题。':'Edit, add or remove rows. Keep the sheet names and column headers.',
  '保存 Excel':'Save your workbook','按 Ctrl + S。新航班请填写日期、两端机场，并设置乘坐状态。':'Press Ctrl + S. Include the date, both airports and flight status for new entries.',
  '界面自动更新':'Watch your journal update','航班、地图和统计同步变化，不需要重新导入。':'Your flights, map and statistics refresh together. No re-import needed.',
  '文件正在保存或暂时不可读时，会保留上次成功读取的记录，并自动重试。':'If the file is saving or unavailable, the last good snapshot stays visible while the app retries.',
  '记录口径':'How records are counted','按实际乘坐统计':'Count flights taken',
  '“已乘坐”“推定已乘坐”“已导入”计入足迹；取消及旧票单独保留。':'Flown, inferred-flown and imported entries count toward your map. Canceled and replaced tickets stay separate.',
  '里程与时长有依据':'Transparent estimates','里程为机场间大圆距离估算；时长按计划起降日期、当地时间和机场时区计算。':'Distance is the airport-to-airport great-circle estimate. Duration uses scheduled dates, local times and airport time zones.',
  '保留核对依据':'Keep the evidence','航班详情显示原表的备注、推定字段、预订号和邮件链接。':'Details preserve the original notes, inferred fields, booking references and source links.',
  '读取提示':'Reading notices','历史核对记录':'Research notes',
  '地图：Natural Earth（公共领域）。机场与时区：':'Map: Natural Earth (public domain). Airports & time zones:',
  '（':' (', '）':' )', '）；历史 PNH / REP 坐标：OurAirports。地图和机场数据均保存在本地。':'); historical PNH / REP: OurAirports. All map and airport assets are stored locally.',
  '最近一次飞行':'Latest flight','里程为机场间距离估算，时长为计划起降时长；此界面用于历史记录，不提供实时航班状态。':'Distance is estimated between airports; duration uses scheduled times. This is a flight history journal, not a live flight tracker.',
  '每一次变更，也有记录。':'Plans change. Keep the history.','那些飞过的日子。':'All the days you took to the sky.',
  '取消、退款与改签前的旧票，留在这里备查。':'Canceled, refunded and replaced tickets, kept for reference.',
  '按年份、航空公司或城市，找到某一次出发。':'Find a departure by year, airline or city.',
  '把世界，连成你的航线。':'A world connected by your flights.',
  '选择一个地区，或者点击航线，重温那一段旅程。':'Choose a region or select a route to revisit a journey.',
  '常到访的机场':'Frequent airports','次起降':'departures / arrivals',
  'Excel 路径已复制':'Workbook path copied','无法复制，请选中页面上的文件路径。':'Could not copy. Select the file path on the page instead.',
  '航班详情':'Flight details','关闭航班详情':'Close flight details','估算里程':'Estimated distance','行程信息':'Journey details',
  '出发':'Departure','到达':'Arrival','当地时间':'local time','预订号':'Booking reference','原始订单尚未取得':'Original booking not available',
  '记录位置':'Workbook location','记录依据':'Evidence','未填写':'Not provided','暂无备注':'No notes','原始来源':'Sources',
  'Gmail 原始邮件':'Original Gmail message','Outlook 原始邮件':'Original Outlook message','历史航班记录':'Historical flight record',
  '来自本地 Excel · 保存修改后自动更新':'From your local workbook · Updates when you save',
  '本地服务已断开':'Local service disconnected','Excel 自动同步':'Excel auto-sync','显示上次同步数据':'Showing last snapshot','等待 Excel':'Waiting for Excel',
  '重新运行「启动航迹.cmd」即可恢复':'Run Start Flight Journal.cmd to reconnect',
  '暂时连不上本地服务，当前保留已加载的记录。重新运行启动文件即可恢复。':'The local service is unavailable. Your loaded records are retained. Run the launcher to reconnect.',
  '当前保留上次成功读取的数据。':'The last successful snapshot is retained.',
  '已重新读取最新 Excel':'Workbook refreshed','暂时无法读取本地记录':'Unable to read local records',
  '确认本地服务正在运行，然后点击重试。':'Check that the local service is running, then retry.','重新读取':'Retry',
  '已请求打开 Excel，保存后界面会自动同步':'Opening your workbook. Save it to update this journal.',
  '请从数据源页面打开 Excel':'Open the workbook from Data & sync',
  '无法自动打开 Excel，请从数据源页面复制文件路径后打开。':'Could not open Excel. Copy the path from Data & sync and open it manually.',
  'Excel 已同步':'Workbook is up to date',
  '找不到 Excel 文件，请检查数据源路径；恢复文件后会自动重试。':'Workbook not found. Check its path; the app will retry automatically.',
  'Excel 暂时无法读取，可能正在保存或被独占打开；稍后自动重试。':'The workbook is unavailable or locked while saving. Retrying automatically.',
  'Excel 暂未完整保存或格式无法读取，稍后自动重试。':'The workbook is incomplete or unreadable. Retrying automatically.',
  '已乘坐':'Flown','推定已乘坐':'Inferred flown','已导入':'Imported','不导入':'Excluded','未乘坐':'Not flown','暂不导入':'On hold','待核对':'To review',
  '上海航空':'Shanghai Airlines','中国东方航空':'China Eastern','中国国际航空':'Air China','厦门航空':'XiamenAir','海南航空':'Hainan Airlines',
  '演示模式 · 全部航班均为虚构数据':'DEMO · All flight records are fictional',
  '演示数据':'Demo data','仅供演示':'Demo only','虚构旅客':'Demo traveler',
  '这是静态演示，不会读取你的 Excel。':'This static demo does not read your workbook.',
  '虚构数据，真实体验。':'Sample journeys. The real experience.',
  '浏览地图、搜索航班、切换语言；本机版本支持 Excel 自动同步。':'Explore the map, search flights and switch languages. The local app adds Excel auto-sync.',
  '示例数据快照':'Sample data snapshot','此示例不包含个人行程、邮件或预订凭证。':'This example contains no personal itineraries, emails or booking evidence.',
  '切换为本地 Excel 模式':'Use your own Excel','查看项目说明':'Read the project guide',
  '原始备注保持原文':'Workbook notes are shown in their original language',
  '日期待补':'Date pending','时长待补':'Duration pending',
};
let language = document.documentElement.dataset.mode === 'demo' ? 'en' : 'zh-CN';
try { const saved=localStorage.getItem('flight-journal-language');if(['en','zh-CN'].includes(saved))language=saved; } catch {}
const requestedLanguage = new URLSearchParams(location.search).get('lang');
if (['en','zh-CN'].includes(requestedLanguage)) language = requestedLanguage;
const locale = () => language === 'en' ? 'en-US' : 'zh-CN';
function t(value) {
  const raw=String(value??''); if(language!=='en')return raw;
  const s=raw.trim(); if(Object.hasOwn(UI_EN,s))return raw.replace(s,UI_EN[s]);
  const rules=[
    [/^(\d{4}) 年$/,(_,y)=>y], [/^(\d{4}) 年的飞行记忆$/,(_,y)=>`Your flights in ${y}`],
    [/^根据 (\d+) 段完整时刻计算$/,(_,n)=>`Based on ${n} complete schedules`],
    [/^(\d+) 分$/,(_,n)=>`${n} min`], [/^(\d+) 座机场$/,(_,n)=>`${n} airports`],
    [/^(\d+) 条往来航线$/,(_,n)=>`${n} routes`], [/^(\d+) 条备查线索$/,(_,n)=>`${n} reference notes`],
    [/^共 (\d+) 段 · 按出发日期排列$/,(_,n)=>`${n} flights · newest first`],
    [/^共 (\d+) 段 · 不计入已乘坐统计$/,(_,n)=>`${n} records · excluded from flight totals`],
    [/^查看全部 (\d+) 段$/,(_,n)=>`View all ${n} flights`],
    [/^查看 (.+) 航班详情$/,(_,n)=>`View ${n} flight details`],
    [/^查看 (.+) 到 (.+) 详情$/,(_,a,b)=>`View ${a} to ${b} details`],
    [/^查看 (.+) 和 (.+) 之间的 (\d+) 次飞行$/,(_,a,b,n)=>`View ${n} flights between ${a} and ${b}`],
    [/^(.+) · (\d+) 次飞行$/,(_,route,n)=>`${route} · ${n} flights`],
    [/^(.+) · (\d+) 次起降$/,(_,airport,n)=>`${airport} · ${n} departures / arrivals`],
    [/^(航班记录|取消及旧票) · 第 (\d+) 行$/,(_,sheet,n)=>`${t(sheet)} · row ${n}`],
    [/^(\d+) \/ (\d+) 段$/,(_,a,b)=>`${a} / ${b} flights`],
    [/^Excel 已更新 · (\d+) 段航班记录$/,(_,n)=>`Workbook updated · ${n} flights`],
    [/^(.+) 小时 (\d+) 分钟( · 跨日到达)?$/,(_,h,m,day)=>`${h}h ${m}m${day?' · next-day arrival':''}`],
    [/^(\d+) 小时( · 跨日到达)?$/,(_,h,day)=>`${h}h${day?' · next-day arrival':''}`],
    [/^(\d+) 分钟( · 跨日到达)?$/,(_,m,day)=>`${m}m${day?' · next-day arrival':''}`],
    [/^(.+) · 跨日到达$/,(_,text)=>`${text} · different arrival date`],
    [/^(.+) · 当地时间$/,(_,text)=>`${text} · local time`],
    [/^· 跨日到达$/,()=> '· different arrival date'], [/^· 当地时间$/,()=> '· local time'],
  ];
  for(const [pattern,replace] of rules) if(pattern.test(s))return raw.replace(s,s.replace(pattern,replace));
  return raw;
}
// Translate freshly rendered interface text, excluding verbatim workbook fields.
function localize(root) {
  if(language!=='en')return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node; while((node=walker.nextNode())) {
    if(!node.parentElement.closest('[data-verbatim],script,style'))node.nodeValue=t(node.nodeValue);
  }
  for(const el of root.querySelectorAll('[aria-label],[placeholder],[title]')) {
    if(el.closest('[data-verbatim]'))continue;
    for(const attr of ['aria-label','placeholder','title'])if(el.hasAttribute(attr))el.setAttribute(attr,t(el.getAttribute(attr)));
  }
}
