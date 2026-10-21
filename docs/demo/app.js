'use strict';
const paths = {
  plane:'M22 2 9 15M22 2l-7 20-4-9-9-4 20-7Z', grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  ticket:'M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7Zm12 0v2m0 3v2m0 3v2',
  globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  archive:'M4 8h16v13H4zM3 3h18v5H3zM9 12h6', sheet:'M14 2H5v20h14V7l-5-5ZM14 2v6h5M8 12h8M8 16h8M11 10v9',
  external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7', spark:'m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z',
  arrow:'M4 12h16m-6-6 6 6-6 6', chevron:'m9 5 7 7-7 7', search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm6-2 5 5',
  clock:'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  route:'M4 5a2 2 0 1 0 0 .1Zm16 14a2 2 0 1 0 0 .1ZM6 5h10a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h10',
  close:'m6 6 12 12M6 18 18 6', check:'m5 12 4 4L19 6', refresh:'M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5',
  plus:'M12 5v14M5 12h14', minus:'M5 12h14', expand:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5', copy:'M8 8h13v13H8zM16 8V3H3v13h5', info:'M12 11v6m0-10v1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', down:'m6 9 6 6 6-6'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.plane}"/></svg>`;
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf = new Intl.NumberFormat('zh-CN');
const DEMO = document.documentElement.dataset.mode === 'demo' || new URLSearchParams(location.search).get('demo') === '1';
const labels = {overview:'飞行总览', flights:'航班记录', map:'航线地图', canceled:'取消与旧票', source:'数据与同步'};
let initialView = location.hash.slice(1);
const state = {view: labels[initialView] ? initialView : 'overview', year:'all', query:'', airline:'all', route:'', page:1, region:'world', data:null, world:null, selected:null, revision:null, networkError:false};
let pending = false, toastTimer, pollTimer;
const content = document.getElementById('content');
const dialog = document.getElementById('flight-dialog');
const dateText = (date, year=true) => date ? new Intl.DateTimeFormat(locale(), {year:year?'numeric':undefined,month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')) : t('日期待补');
const shortDate = value => value ? value.replaceAll('-', '.') : '—';
const hours = minutes => minutes == null ? t('时长待补') : language === 'en' ? `${Math.floor(minutes/60)?Math.floor(minutes/60)+'h ':''}${minutes%60?minutes%60+'m':''}`.trim() : `${Math.floor(minutes/60)?Math.floor(minutes/60)+' 小时 ':''}${minutes%60?minutes%60+' 分钟':''}`.trim();
const stamp = value => value ? new Date(value).toLocaleString(locale(), {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}) : '—';
function city(code, fallback) {return language==='en' ? state.data?.airports[code]?.city || code || fallback : fallback;}
function displayFlight(f) {if(language!=='en')return f;return {...f,originCity:city(f.origin,f.originCity),destinationCity:city(f.destination,f.destinationCity),originLabel:f.origin+' '+city(f.origin,f.originCity),destinationLabel:f.destination+' '+city(f.destination,f.destinationCity),airline:t(f.airline)};}
const allFlights = () => state.data.flights;
const flownFlights = () => allFlights().filter(f => f.flown && !f.excluded);
const byNewest = rows => [...rows].sort((a,b) => (b.date+(b.departure||'00:00')).localeCompare(a.date+(a.departure||'00:00')));
const routeKey = f => [f.origin,f.destination].sort().join('|');
function airlineStyle(f) {
  const code = (f.number.match(/^[A-Z0-9]{2}/)||[''])[0];
  const colors = {KL:'#1185b6',FR:'#233965',SN:'#73377e',LX:'#d94943',SK:'#35489f',W6:'#b42f8f',D8:'#cf4a49',DL:'#9b3149',AA:'#467d99',CA:'#c94c3b',LO:'#314a82',VY:'#a1892b',OS:'#cb5046',B6:'#37528e',AS:'#356169',NH:'#3063a2',JL:'#bd4141',HU:'#ba4440',MF:'#28719f',MU:'#3d5482'};
  return {code:code||'✈',color:colors[code]||'#607578'};
}
function airlineMark(f, large=false) {const {code,color}=airlineStyle(f);return `<span class="airline-mark ${large?'large':''}" style="--airline:${color}">${esc(code)}</span>`;}
function statusBadge(f) {return `<span class="badge ${f.excluded?'muted':f.flown?'green':'amber'}">${f.flown?icon('check'):''}${esc(f.status||'待核对')}</span>`;}
function filterRows(rows) {
  const query=state.query.trim().toLocaleLowerCase();
  return byNewest(rows.filter(f => (state.year==='all'||f.date.startsWith(state.year)) && (state.airline==='all'||f.airline===state.airline) && (!state.route||routeKey(f)===state.route) && (!query||[f.number,f.originLabel,f.destinationLabel,f.airline,f.date,f.booking,state.data.airports[f.origin]?.city,state.data.airports[f.destination]?.city,t(f.airline)].some(v=>String(v).toLowerCase().includes(query)))));
}
function summary(rows) {
  const codes=new Set(rows.flatMap(f=>[f.origin,f.destination]).filter(Boolean));
  const countries=new Set([...codes].map(c=>state.data.airports[c]?.country).filter(Boolean));
  return {count:rows.length,distance:rows.reduce((n,f)=>n+(f.distance||0),0),minutes:rows.reduce((n,f)=>n+(f.duration||0),0),timed:rows.filter(f=>f.duration!=null).length,airports:codes.size,countries:countries.size};
}
function topRoutes(rows) {
  const map=new Map();
  for(const f of rows){const key=routeKey(f);if(!map.has(key))map.set(key,{key,count:0,from:f.origin,to:f.destination,fromName:city(f.origin,f.originCity),toName:city(f.destination,f.destinationCity)});map.get(key).count++;}
  return [...map.values()].sort((a,b)=>b.count-a.count);
}
function showToast(message) {const el=document.getElementById('toast');el.textContent=t(message);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}
function pageHead(title,subtitle,eyebrow='MY FLIGHT JOURNAL') {
  return `<section class="page-heading"><div><p class="eyebrow">${esc(eyebrow)}</p><h1>${title}</h1><p class="heading-subtitle">${subtitle}</p></div>${state.view!=='source'?yearSelector():''}</section>`;
}
function yearSelector(){const years=[...new Set([...allFlights(),...state.data.canceled].map(f=>f.date.slice(0,4)))].sort().reverse();return `<label class="year-select"><span data-icon="calendar">${icon('clock')}</span><select id="year-filter" aria-label="筛选年份"><option value="all" ${state.year==='all'?'selected':''}>全部年份</option>${years.map(y=>`<option value="${y}" ${state.year===y?'selected':''}>${y} 年</option>`).join('')}</select>${icon('down')}</label>`;}
function statsMarkup(rows) {
  const s=summary(rows);
  return `<section class="stats-grid" aria-label="飞行统计">
    <article class="stat-card"><div class="stat-top">已乘坐航段<span class="stat-icon peach">${icon('plane')}</span></div><div class="stat-number">${nf.format(s.count)}<small>段</small></div><div class="stat-bottom">${state.year==='all'?'所有年份的飞行记忆':state.year+' 年的飞行记忆'}</div></article>
    <article class="stat-card"><div class="stat-top">累计飞行里程<span class="stat-icon blue">${icon('route')}</span></div><div class="stat-number">${nf.format(s.distance)}<small>km</small></div><div class="stat-bottom">约绕地球 <b>${(s.distance/40075).toFixed(1)}</b> 圈 <span class="tiny-label">估算</span></div></article>
    <article class="stat-card"><div class="stat-top">涉及国家与地区<span class="stat-icon purple">${icon('globe')}</span></div><div class="stat-number">${s.countries}<small>个</small></div><div class="stat-bottom">足迹连接了 <b>${s.airports}</b> 座机场</div></article>
    <article class="stat-card"><div class="stat-top">计划飞行时长<span class="stat-icon mint">${icon('clock')}</span></div><div class="stat-number">${nf.format(Math.floor(s.minutes/60))}<small>小时</small><span class="stat-minutes">${s.minutes%60} 分</span></div><div class="stat-bottom">根据 ${s.timed} 段完整时刻计算</div></article>
  </section>`;
}
function mapMarkup(rows,full=false) {
  return `<section class="map-card ${full?'full-map':''}" aria-label="飞行足迹地图"><div class="map-header"><div><p class="map-kicker">FLIGHT MAP</p><h2>我的飞行足迹</h2><p>${topRoutes(rows).length} 条往来航线 <span>·</span> ${summary(rows).airports} 座机场</p></div><div class="map-region" aria-label="地图视角">${[['world','世界'],['europe','欧洲'],['america','北美'],['asia','亚洲']].map(([k,n])=>`<button data-region="${k}" class="${state.region===k?'selected':''}" aria-pressed="${state.region===k}">${n}</button>`).join('')}</div></div><div class="map-canvas" id="map-canvas"><svg id="route-map" aria-label="航线地图，可拖动、缩放，点击航线查看记录" role="group" viewBox="0 30 1000 440"></svg><div class="map-tooltip" id="map-tooltip"></div><div class="map-empty" ${rows.length?'hidden':''}>这个筛选条件下还没有飞行足迹</div><div class="map-controls"><button id="map-in" aria-label="放大地图">${icon('plus')}</button><button id="map-out" aria-label="缩小地图">${icon('minus')}</button><button id="map-reset" aria-label="重置地图视角">${icon('expand')}</button></div></div><div class="map-bottom"><span><i></i> 已乘坐航线 <span class="map-hint">点击航线查看 · 拖动地图探索</span></span><span>Natural Earth</span></div></section>`;
}
function ticketMarkup(f) {
  if(f)f=displayFlight(f);
  if(!f)return `<div class="ticket-empty">${icon('plane')}<h3>还没有航班记录</h3><p>保存 Excel 中的航班后，这里会自动出现。</p></div>`;
  return `<div class="ticket-content"><div class="ticket-airline">${airlineMark(f)}<div><b>${esc(f.airline)}</b><small>${esc(f.number||'航班号待补')}</small></div>${statusBadge(f)}</div><div class="ticket-route"><div><strong>${esc(f.origin||'—')}</strong><span>${esc(f.originCity)}</span></div><div class="ticket-flightline"><span></span>${icon('plane')}<span></span></div><div><strong>${esc(f.destination||'—')}</strong><span>${esc(f.destinationCity)}</span></div></div><div class="ticket-times"><span>${f.departure||'—'}</span><small>${hours(f.duration)}</small><span>${f.arrival||'—'}${f.arrivalDate&&f.arrivalDate!==f.date?'<sup>跨日</sup>':''}</span></div><div class="ticket-perf"></div><div class="ticket-foot"><div><small>出发日期</small><b>${dateText(f.date)}</b></div><button class="round-button" data-flight="${f.id}" aria-label="查看 ${esc(f.number)} 航班详情">${icon('arrow')}</button></div></div>`;
}
function favoritesMarkup(rows) {const routes=topRoutes(rows).slice(0,3);return `<section class="favorites card"><div class="section-title"><h2>常飞航线</h2><span>最常乘坐的航线</span></div>${routes.length?routes.map((r,i)=>`<button class="favorite-route" data-route="${esc(r.key)}"><span class="route-rank">${String(i+1).padStart(2,'0')}</span><span><b>${esc(r.from)} <i>⇄</i> ${esc(r.to)}</b><small>${esc(r.fromName)} · ${esc(r.toName)}</small></span><strong>${r.count}<small> 次</small></strong></button>`).join(''):'<p class="empty-inline">还没有航线记录</p>'}</section>`;}
function searchMarkup(canceled=false) {
  const rows=canceled?state.data.canceled:allFlights();const airlines=[...new Set(rows.map(f=>f.airline).filter(Boolean))].sort();
  return `<div class="filter-bar"><label class="search-box">${icon('search')}<input id="flight-search" type="search" autocomplete="off" placeholder="搜索航班、城市、机场或预订号" aria-label="搜索航班" value="${esc(state.query)}"></label><label class="airline-filter"><select id="airline-filter" aria-label="筛选航空公司"><option value="all">全部航空公司</option>${airlines.map(a=>`<option value="${esc(a)}" ${state.airline===a?'selected':''}>${esc(a)}</option>`).join('')}</select>${icon('down')}</label>${state.route?`<button class="filter-chip" id="clear-route">${esc(state.route.replace('|',' ⇄ '))}${icon('close')}</button>`:''}${state.query||state.airline!=='all'?'<button class="text-button" id="clear-search">清除筛选</button>':''}</div>`;
}
function flightTable(rows,limit=20) {
  rows=rows.map(displayFlight);
  if(!rows.length)return `<div class="empty-state">${icon('search')}<h3>没有找到匹配的航班</h3><p>试试其他城市、航班号，或者切换年份。</p><button class="button" id="reset-filters">重置筛选</button></div>`;
  return `<div class="table-scroll"><table class="flight-table"><thead><tr><th>出发日期</th><th>航班</th><th>航线</th><th>当地计划时间</th><th>里程</th><th>记录</th><th><span class="sr-only">详情</span></th></tr></thead><tbody>${rows.slice(0,limit).map(f=>`<tr><td class="date-cell"><b>${shortDate(f.date)}</b><small>${new Intl.DateTimeFormat(locale(),{weekday:'long',timeZone:'UTC'}).format(new Date(f.date+'T12:00:00Z'))}</small></td><td><div class="flight-airline">${airlineMark(f)}<div><b>${esc(f.number||'待补航班号')}</b><small>${esc(f.airline||'航空公司待补')}</small></div></div></td><td><div class="table-route"><b>${esc(f.origin||'—')}</b>${icon('arrow')}<b>${esc(f.destination||'—')}</b></div><small class="route-cities">${esc(f.originCity)} → ${esc(f.destinationCity)}</small></td><td class="time-cell"><b>${f.departure||'—'} <span>—</span> ${f.arrival||'—'}</b><small>${hours(f.duration)}${f.arrivalDate&&f.arrivalDate!==f.date?' · 跨日到达':''}</small></td><td class="distance-cell">${f.distance==null?'—':nf.format(f.distance)} <small>km</small></td><td>${f.inferred?'<span class="badge amber">含推定字段</span>':statusBadge(f)}</td><td><button class="row-button" data-flight="${f.id}" aria-label="查看 ${esc(f.date+' '+f.number+' '+f.origin+' 到 '+f.destination)} 详情">${icon('chevron')}</button></td></tr>`).join('')}</tbody></table></div>`;
}
function flightSection(rows,overview=false) {const limit=overview?5:state.page*20;return `<section class="records card"><div class="section-title"><div><h2>${state.view==='canceled'?'取消与旧票':overview?'最近的飞行':'我的航班'}</h2><p>${overview?'最近的出发记录':`共 ${rows.length} 段${state.view==='canceled'?' · 不计入已乘坐统计':' · 按出发日期排列'}`}</p></div>${overview?`<button class="text-button" data-view="flights">查看全部 ${allFlights().length} 段 ${icon('arrow')}</button>`:''}</div>${overview?'':searchMarkup(state.view==='canceled')}${flightTable(rows,limit)}${!overview&&rows.length>limit?`<div class="load-more"><button class="button" id="load-more">再看 20 段 <span>${limit} / ${rows.length}</span></button></div>`:''}</section>`;}
function sourceMarkup() {
  if(DEMO)return demoSourceMarkup();
  const d=state.data, s=d.source;
  return pageHead('Excel 同步','照常编辑 Excel，保存后这里会自动更新。','CONNECTED TO YOUR EXCEL')+`<section class="source-grid"><article class="card source-card"><div class="source-card-icon">${icon('sheet')}</div><div class="section-title"><h2>正在读取的 Excel</h2><span class="badge green">本地文件</span></div><h3>${esc(s.name)}</h3><p class="source-path" data-verbatim>${esc(s.path)}</p><div class="source-actions"><button class="button primary" id="source-open">${icon('external')}打开 Excel</button><button class="button" id="copy-path">${icon('copy')}复制路径</button><button class="button" id="refresh-data">${icon('refresh')}立即刷新</button></div><dl class="source-details"><div><dt>文件最后保存</dt><dd id="source-modified">${stamp(s.modifiedAt)}</dd></div><div><dt>同步方式</dt><dd>每 3 秒自动检查</dd></div><div><dt>主表 / 取消及旧票</dt><dd>${d.flights.length} / ${d.canceled.length} 段</dd></div><div><dt>连接状态</dt><dd id="source-state">${esc(d.sync.message)}</dd></div></dl></article><article class="card how-card"><p class="eyebrow">WORKBOOK SYNC</p><h2>你的 Excel，就是数据源。</h2><ol><li><span>01</span><div><b>在原表中更新航班</b><p>修改、添加或删除行都可以，保留工作表名与列标题。</p></div></li><li><span>02</span><div><b>保存 Excel</b><p>按 Ctrl + S。新航班请填写日期、两端机场，并设置乘坐状态。</p></div></li><li><span>03</span><div><b>界面自动更新</b><p>航班、地图和统计同步变化，不需要重新导入。</p></div></li></ol><div class="info-note">${icon('info')}<span>文件正在保存或暂时不可读时，会保留上次成功读取的记录，并自动重试。</span></div></article></section><section class="card source-notes"><div class="section-title"><h2>记录口径</h2></div><div class="method-grid"><div>${icon('check')}<b>按实际乘坐统计</b><p>“已乘坐”“推定已乘坐”“已导入”计入足迹；取消及旧票单独保留。</p></div><div>${icon('route')}<b>里程与时长有依据</b><p>里程为机场间大圆距离估算；时长按计划起降日期、当地时间和机场时区计算。</p></div><div>${icon('ticket')}<b>保留核对依据</b><p>航班详情显示原表的备注、推定字段、预订号和邮件链接。</p></div></div></section>${d.warnings.length?`<section class="card warning-card"><h2>读取提示</h2>${d.warnings.map(w=>`<p>${esc(w)}</p>`).join('')}</section>`:''}<section class="card clue-card"><div class="section-title"><h2>历史核对记录</h2><span>${d.clues.length} 条备查线索</span></div>${d.clues.map(c=>`<details data-verbatim><summary>${esc(c.title)}${icon('down')}</summary><p>${esc(c.detail)}</p><p>${esc(c.context)}</p></details>`).join('')}</section><p class="data-credit">地图：Natural Earth（公共领域）。机场与时区：<a href="https://github.com/mborsetti/airportsdata" target="_blank" rel="noopener noreferrer">airportsdata</a>（<a href="./data/airports-LICENSE.txt" target="_blank">MIT</a>）；历史 PNH / REP 坐标：OurAirports。地图和机场数据均保存在本地。</p>`;
}
function render() {
  if(!state.data)return;
  const focus=document.activeElement?.id, pos=document.activeElement?.selectionStart, scroll=window.scrollY;
  document.querySelectorAll('.nav-item').forEach(el=>{el.classList.toggle('active',el.dataset.view===state.view);el.setAttribute('aria-current',el.dataset.view===state.view?'page':'false');});
  document.getElementById('breadcrumb').textContent=labels[state.view];
  document.getElementById('nav-flight-count').textContent=state.data.flights.length;
  document.getElementById('nav-canceled-count').textContent=state.data.canceled.length;
  let mapRows=null;
  if(state.view==='overview'){
    const rows=filterRows(flownFlights());mapRows=rows;const years=[...new Set(allFlights().map(f=>f.date.slice(0,4)))].sort();
    content.innerHTML=pageHead('飞行总览',`${years[0]||'—'} — ${years.at(-1)||'—'} <span class="subtitle-dot">·</span> 我的飞行手账`)+statsMarkup(rows)+`<div class="overview-grid">${mapMarkup(rows)}<div class="trip-aside"><section class="card latest-card"><div class="section-title"><h2>最近一次飞行</h2><span>LAST FLIGHT</span></div>${ticketMarkup(rows[0])}</section>${favoritesMarkup(rows)}</div></div>`+flightSection(rows,true)+`<p class="method-foot">里程为机场间距离估算，时长为计划起降时长；此界面用于历史记录，不提供实时航班状态。</p>`;
  }else if(state.view==='flights'||state.view==='canceled'){
    const canceled=state.view==='canceled';const rows=filterRows(canceled?state.data.canceled:allFlights());
    content.innerHTML=pageHead(canceled?'取消和改签记录':'航班记录列表',canceled?'取消、退款与改签前的旧票，留在这里备查。':'按年份、航空公司或城市，找到某一次出发。',canceled?'CHANGES & CANCELED TICKETS':'FLIGHT HISTORY')+flightSection(rows);
  }else if(state.view==='map'){
    const rows=filterRows(flownFlights());mapRows=rows;
    content.innerHTML=pageHead('查看航线','选择一个地区，或者点击航线，重温那一段旅程。','ROUTES')+statsMarkup(rows)+mapMarkup(rows,true)+`<div class="map-extras">${favoritesMarkup(rows)}<section class="card airport-list"><div class="section-title"><h2>常到访的机场</h2></div>${airportRanking(rows).slice(0,6).map(([code,count])=>`<button data-airport="${code}"><span>${icon('pin')}<b>${code}</b><small>${esc(state.data.airports[code]?.city||code)}</small></span><strong>${count}<small> 次起降</small></strong></button>`).join('')}</section></div>`;
  }else content.innerHTML=sourceMarkup();
  wirePage(); if(mapRows)drawMap(mapRows);localize(content);updateShell();
  if(focus&&document.getElementById(focus)){const el=document.getElementById(focus);el.focus({preventScroll:true});if(el.setSelectionRange&&pos!=null)el.setSelectionRange(pos,pos);}
  window.scrollTo({top:scroll});
}
function navigate(view) {if(!labels[view])return;state.view=view;state.page=1;if(view==='overview'||view==='map'||view==='source'||view==='canceled'){state.query='';state.route='';state.airline='all';}location.hash=view;render();window.scrollTo({top:0,behavior:'smooth'});}
function wirePage() {
  content.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
  content.querySelectorAll('[data-flight]').forEach(b=>b.addEventListener('click',()=>openFlight(b.dataset.flight)));
  content.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>openRoute(b.dataset.route)));
  content.querySelectorAll('[data-airport]').forEach(b=>b.addEventListener('click',()=>{state.query=b.dataset.airport;state.view='flights';state.page=1;location.hash='flights';render();window.scrollTo({top:0});}));
  document.getElementById('year-filter')?.addEventListener('change',e=>{state.year=e.target.value;state.page=1;render();});
  document.getElementById('airline-filter')?.addEventListener('change',e=>{state.airline=e.target.value;state.page=1;render();});
  document.getElementById('flight-search')?.addEventListener('input',e=>{state.query=e.target.value;state.page=1;render();});
  document.getElementById('clear-route')?.addEventListener('click',()=>{state.route='';render();});
  document.getElementById('clear-search')?.addEventListener('click',()=>{state.query='';state.airline='all';render();});
  document.getElementById('reset-filters')?.addEventListener('click',()=>{state.query='';state.year='all';state.airline='all';state.route='';render();});
  document.getElementById('load-more')?.addEventListener('click',()=>{state.page++;render();});
  document.getElementById('refresh-data')?.addEventListener('click',()=>poll(true));
  document.getElementById('source-open')?.addEventListener('click',openExcel);
  document.getElementById('copy-path')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(state.data.source.path);showToast('Excel 路径已复制');}catch{showToast('无法复制，请选中页面上的文件路径。');}});
}
function openRoute(route) {state.route=route;state.view='flights';state.query='';state.airline='all';state.page=1;location.hash='flights';render();window.scrollTo({top:0,behavior:'smooth'});}
function openFlight(id,refresh=false) {
  const raw=[...state.data.flights,...state.data.canceled].find(f=>f.id===id);if(!raw)return;const f=displayFlight(raw);
  state.selected=id;
  dialog.innerHTML=`<div class="dialog-header"><div><p class="eyebrow">FLIGHT DETAILS</p><h2 id="detail-title">${esc(f.number||'航班详情')}</h2></div><button class="round-button" id="close-dialog" aria-label="关闭航班详情">${icon('close')}</button></div><div class="detail-ticket">${ticketMarkup(f).replace(/<button class="round-button"[\s\S]*?<\/button>/,'')}</div><div class="detail-summary"><div><span>估算里程</span><b>${f.distance==null?'—':nf.format(f.distance)} <small>km</small></b></div><div><span>计划飞行时长</span><b>${hours(f.duration)}</b></div></div><div class="detail-section"><h3>行程信息</h3><dl><div><dt>出发</dt><dd>${esc(f.originLabel)}<small>${shortDate(f.date)} ${f.departure||'—'} · 当地时间</small></dd></div><div><dt>到达</dt><dd>${esc(f.destinationLabel)}<small>${shortDate(f.arrivalDate)} ${f.arrival||'—'} · 当地时间</small></dd></div><div><dt>预订号</dt><dd class="mono">${esc(f.booking||'原始订单尚未取得')}</dd></div><div><dt>记录位置</dt><dd>${esc(f.sheet)} · 第 ${f.row} 行</dd></div></dl></div><div class="detail-section"><h3>记录依据 ${f.inferred?'<span class="badge amber">含推定字段</span>':''}</h3><p class="evidence-name" data-verbatim>${esc(f.evidence||t('未填写'))}</p><p class="detail-notes" data-verbatim>${esc(f.notes||t('暂无备注'))}</p></div>${f.links.length?`<div class="detail-section"><h3>原始来源</h3><div class="source-links">${f.links.map((url,i)=>{let host=new URL(url).hostname;const name=host.includes('google.com')?'Gmail 原始邮件':host.includes('outlook')?'Outlook 原始邮件':host.includes('flightera')?'历史航班记录':host;return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${icon('external')}<span>${name}</span><small>${i+1}</small></a>`;}).join('')}</div></div>`:''}<p class="detail-foot">${DEMO?t('这是静态演示，不会读取你的 Excel。'):t('来自本地 Excel · 保存修改后自动更新')}</p>`;
  localize(dialog);
  document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
  if(!refresh&&!dialog.open)dialog.showModal();
}
dialog.addEventListener('close',()=>state.selected=null);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function airportRanking(rows){const m=new Map();for(const f of rows)for(const code of [f.origin,f.destination])if(code)m.set(code,(m.get(code)||0)+1);return [...m].sort((a,b)=>b[1]-a[1]);}
const project = (lon,lat) => [(lon+180)*1000/360,(90-lat)*500/180];
function greatCircle(a,b) {
  const rad=Math.PI/180;const unit=p=>[Math.cos(p.lat*rad)*Math.cos(p.lon*rad),Math.cos(p.lat*rad)*Math.sin(p.lon*rad),Math.sin(p.lat*rad)];
  const u=unit(a),v=unit(b),omega=Math.acos(Math.max(-1,Math.min(1,u.reduce((n,x,i)=>n+x*v[i],0)))),sin=Math.sin(omega);
  let path='',prev=null;
  for(let i=0;i<=64;i++){const t=i/64;let p;if(omega<.00001)p=[a.lon,a.lat];else{const k=Math.sin((1-t)*omega)/sin,l=Math.sin(t*omega)/sin,w=u.map((x,j)=>x*k+v[j]*l);p=[Math.atan2(w[1],w[0])/rad,Math.atan2(w[2],Math.hypot(w[0],w[1]))/rad];}const q=project(...p);path+=(!prev||Math.abs(q[0]-prev[0])>500?'M':'L')+q.map(n=>n.toFixed(2)).join(',');prev=q;}
  return path;
}
let worldPaths=null;
function makeWorldPaths(){if(worldPaths||!state.world)return;worldPaths=state.world.features.map(f=>{const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;const d=polygons.map(poly=>poly.map(ring=>ring.map((p,i)=>(i?'L':'M')+project(...p).map(n=>n.toFixed(2)).join(',')).join('')+'Z').join('')).join('');return {d,iso:f.properties.iso,name:f.properties.name};});}
function drawMap(rows) {
  const svg=document.getElementById('route-map');if(!svg||!state.world)return;makeWorldPaths();
  const routes=topRoutes(rows), airports=state.data.airports, visited=new Set(rows.flatMap(f=>[airports[f.origin]?.country,airports[f.destination]?.country]));
  svg.innerHTML=`<defs><radialGradient id="ocean-light"><stop stop-color="#233b4e"/><stop offset="1" stop-color="#111f2c"/></radialGradient><linearGradient id="flight-line" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#efb878"/><stop offset="1" stop-color="#ee8664"/></linearGradient></defs><rect x="-2000" y="-1000" width="5000" height="3000" fill="url(#ocean-light)"/><g class="map-grid">${Array.from({length:13},(_,i)=>`<path d="M${i*1000/12} 0V500"/>`).join('')}${Array.from({length:7},(_,i)=>`<path d="M0 ${i*500/6}H1000"/>`).join('')}</g><g class="map-land">${worldPaths.map(f=>`<path d="${f.d}" class="${visited.has(f.iso)?'visited':''}"><title>${esc(language==='en'&&/^[A-Z]{2}$/.test(f.iso)?new Intl.DisplayNames(['en'],{type:'region'}).of(f.iso):language==='en'?'Territory':f.name)}</title></path>`).join('')}</g><g class="map-routes">${routes.map(r=>{const a=airports[r.from],b=airports[r.to];if(!a||!b)return '';return `<path class="route-line" d="${greatCircle(a,b)}" data-route="${esc(r.key)}" data-tooltip="${esc(r.from+' ⇄ '+r.to+' · '+r.count+' 次飞行')}" tabindex="0" role="button" aria-label="查看 ${esc(r.from+' 和 '+r.to)} 之间的 ${r.count} 次飞行" style="stroke-width:${Math.min(2.5,0.6+Math.sqrt(r.count)*.26)}"/>`;}).join('')}</g><g id="map-airports"></g>`;
  const aspect=()=>svg.clientHeight/Math.max(svg.clientWidth,1);
  let view={x:0,y:20,w:1000,h:440},drag=null,dragged=false;
  function regionView(){const presets={world:[500,240,1000],europe:[540,98,225],america:[212,130,320],asia:[795,165,345]};const [cx,cy,w]=presets[state.region]||presets.world;const h=w*aspect();view={x:cx-w/2,y:cy-h/2,w,h};update();}
  function update(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);const factor=view.w/Math.max(svg.clientWidth,1);const ranking=airportRanking(rows);let boxes=[];
    document.getElementById('map-airports').innerHTML=ranking.map(([code,count])=>{const p=airports[code];if(!p)return '';const [x,y]=project(p.lon,p.lat),r=(2.3+Math.min(2,Math.sqrt(count)/3))*factor;let label='';const onScreen=x>view.x+12*factor&&x<view.x+view.w-30*factor&&y>view.y+14*factor&&y<view.y+view.h-14*factor;const priority=state.region!=='world'||['BOS','SFO','ARN','BRU','PEK','PVG','HND','BKK'].includes(code);if(onScreen&&priority){const box=[x+7*factor,y-6*factor,26*factor,14*factor];if(!boxes.some(b=>box[0]<b[0]+b[2]+3*factor&&box[0]+box[2]>b[0]&&box[1]<b[1]+b[3]&&box[1]+box[3]>b[1])){boxes.push(box);label=`<text x="${box[0]}" y="${y+4*factor}" font-size="${11*factor}">${code}</text>`;}}return `<g class="airport-point"><circle cx="${x}" cy="${y}" r="${r*2.5}" class="airport-halo"/><circle cx="${x}" cy="${y}" r="${r}"><title>${code} · ${count} 次起降</title></circle>${label}</g>`;}).join('');localize(svg);}
  regionView();localize(svg);
  content.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>{state.region=b.dataset.region;content.querySelectorAll('[data-region]').forEach(el=>{el.classList.toggle('selected',el.dataset.region===state.region);el.setAttribute('aria-pressed',el.dataset.region===state.region);});regionView();});
  function zoom(mult){const nw=Math.max(55,Math.min(1250,view.w*mult)),nh=nw*aspect();view={x:view.x+(view.w-nw)/2,y:view.y+(view.h-nh)/2,w:nw,h:nh};update();}
  document.getElementById('map-in').onclick=()=>zoom(.7);document.getElementById('map-out').onclick=()=>zoom(1/.7);document.getElementById('map-reset').onclick=regionView;
  svg.onpointerdown=e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,v:{...view}};dragged=false;};
  svg.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!dragged&&Math.hypot(dx,dy)>4){dragged=true;svg.setPointerCapture(e.pointerId);}if(dragged){view.x=drag.v.x-dx*view.w/svg.clientWidth;view.y=drag.v.y-dy*view.h/svg.clientHeight;update();}};
  svg.onpointerup=e=>{drag=null;try{svg.releasePointerCapture(e.pointerId);}catch{}setTimeout(()=>dragged=false,0);};svg.onpointercancel=()=>drag=null;
  const tooltip=document.getElementById('map-tooltip');
  svg.querySelectorAll('.route-line').forEach(p=>{p.addEventListener('click',()=>{if(!dragged)openRoute(p.dataset.route);});p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRoute(p.dataset.route);}});p.addEventListener('pointermove',e=>{if(dragged)return;tooltip.textContent=t(p.dataset.tooltip);const box=svg.getBoundingClientRect();tooltip.style.left=Math.min(e.clientX-box.left+12,box.width-155)+'px';tooltip.style.top=Math.max(8,e.clientY-box.top-34)+'px';tooltip.classList.add('visible');});p.addEventListener('pointerleave',()=>tooltip.classList.remove('visible'));});
}
function syncStatus() {
  if(DEMO){const el=document.getElementById('sync-status');el.querySelector('span').textContent=t('演示数据');el.title=t('这是静态演示，不会读取你的 Excel。');el.classList.remove('sync-warning');return;}
  const el=document.getElementById('sync-status');const sync=state.data?.sync;const ok=!state.networkError&&sync?.state==='ok';
  el.classList.toggle('sync-warning',!ok);el.querySelector('span').textContent=state.networkError?'本地服务已断开':ok?'Excel 自动同步':sync?.state==='stale'?'显示上次同步数据':'等待 Excel';el.querySelector('span').textContent=t(el.querySelector('span').textContent);el.title=state.networkError?'重新运行「启动航迹.cmd」即可恢复':sync?.message||'';
  el.title=t(el.title);
  const sourceState=document.getElementById('source-state');if(sourceState)sourceState.textContent=state.networkError?'本地服务已断开':sync?.message||'';
  if(sourceState)sourceState.textContent=t(sourceState.textContent);
  let banner=document.getElementById('sync-banner');
  if(!ok){if(!banner){banner=document.createElement('div');banner.id='sync-banner';banner.className='sync-banner';document.querySelector('.topbar').after(banner);}banner.textContent=state.networkError?'暂时连不上本地服务，当前保留已加载的记录。重新运行启动文件即可恢复。':`${sync.message}${sync.state==='stale'?' 当前保留上次成功读取的数据。':''}`;banner.textContent=state.networkError?t(banner.textContent):t(sync.message)+(sync.state==='stale'?' '+t('当前保留上次成功读取的数据。'):'');}else banner?.remove();
}
async function poll(force=false) {
  if(DEMO)return;
  if(pending)return;pending=true;
  try{
    const res=await fetch('./api/flights'+(force?'?force=1':''),{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!res.ok)throw Error('read failed');const data=await res.json();
    const first=!state.data,changed=data.revision!==state.revision||data.source.path!==state.data?.source.path||data.source.modifiedAt!==state.data?.source.modifiedAt;state.data=data;state.networkError=false;
    if(first||changed){state.revision=data.revision;render();if(state.selected){const f=data.flights.concat(data.canceled).find(f=>f.id===state.selected);if(f)openFlight(f.id,true);else dialog.close();}if(!first)showToast(`Excel 已更新 · ${data.flights.length} 段航班记录`);}
    syncStatus();if(force)showToast(data.sync.state==='ok'?'已重新读取最新 Excel':data.sync.message);
  }catch{state.networkError=true;syncStatus();if(!state.data)content.innerHTML=`<div class="empty-state startup-error">${icon('sheet')}<h2>暂时无法读取本地记录</h2><p>确认本地服务正在运行，然后点击重试。</p><button class="button" id="retry">重新读取</button></div>`;localize(content);document.getElementById('retry')?.addEventListener('click',()=>poll(true));}
  finally{pending=false;}
}
async function openExcel(){if(DEMO){showToast('这是静态演示，不会读取你的 Excel。');return;}try{const res=await fetch('./api/open-workbook',{method:'POST',headers:{'X-Flight-Journal':'1'}});const data=await res.json();if(!res.ok)throw Error(data.error);showToast('已请求打开 Excel，保存后界面会自动同步');}catch(e){showToast(e.message||'请从数据源页面打开 Excel');}}
document.querySelectorAll('.sidebar [data-view], #sync-status').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
document.getElementById('open-excel').addEventListener('click',openExcel);
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();navigate('overview');});
window.addEventListener('hashchange',()=>{const view=location.hash.slice(1);if(labels[view]&&view!==state.view){state.view=view;render();}});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(document.getElementById('route-map'))drawMap(filterRows(flownFlights()));},180);});

const shellOriginals = [];
for(const root of document.querySelectorAll('.sidebar,.topbar,.footer,.skip,.loading')) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode()))if(node.nodeValue.trim()&&!node.parentElement.closest('#language-toggle,#sync-status,#breadcrumb,[data-icon],svg'))shellOriginals.push([node,node.nodeValue]);
}
function updateShell(){
  document.documentElement.lang=language;document.title=t('航迹 · 我的飞行手账');
  shellOriginals.forEach(([node,original])=>node.nodeValue=t(original));
  document.querySelector('.brand').setAttribute('aria-label',t('航迹 首页'));
  document.querySelector('.sidebar nav').setAttribute('aria-label',t('主要导航'));
  document.getElementById('breadcrumb').textContent=t(labels[state.view]);
  const toggle=document.getElementById('language-toggle');toggle.textContent=language==='en'?'ZH':'EN';
  toggle.setAttribute('aria-label',language==='en'?'Switch to Chinese':'Switch to English');
  if(DEMO){document.querySelector('.local-label span').textContent=t('仅供演示');document.querySelector('.profile b').textContent=t('虚构旅客');document.getElementById('open-excel').hidden=true;document.getElementById('demo-banner').textContent=t('演示模式 · 全部航班均为虚构数据');document.querySelector('.footer>span:last-child').textContent=t('这是静态演示，不会读取你的 Excel。');}
}
document.getElementById('language-toggle').addEventListener('click',()=>{
  language=language==='en'?'zh-CN':'en';try{localStorage.setItem('flight-journal-language',language);}catch{}
  const url=new URL(location.href);url.searchParams.delete('lang');history.replaceState(null,'',url);
  render();if(state.selected)openFlight(state.selected,true);updateShell();syncStatus();
});
function demoSourceMarkup(){return pageHead('关于演示','浏览地图、搜索航班、切换语言；本机版本支持 Excel 自动同步。','DEMO')+`<section class="card source-card"><h2>示例数据快照</h2><p class="demo-explanation">此示例不包含个人行程、邮件或预订凭证。</p><p class="demo-explanation">这是静态演示，不会读取你的 Excel。</p><div class="source-actions"><a class="button" href="./GUIDE.html?lang=${language}">查看项目说明</a></div></section>`;}
async function init(){
  if(DEMO){const banner=document.createElement('div');banner.id='demo-banner';banner.className='demo-banner';document.querySelector('.topbar').after(banner);}
  updateShell();
  try{state.world=await(await fetch('./data/world.json')).json();}catch{state.world={features:[]};}
  if(DEMO){try{const res=await fetch('./data/demo.json');if(!res.ok)throw Error();state.data=await res.json();state.revision=state.data.revision;render();syncStatus();}catch{content.innerHTML=`<div class="empty-state"><h2>${t('演示数据无法读取')}</h2><p>${t('请通过 HTTP 服务访问此文件夹。')}</p></div>`;}}else{await poll();pollTimer=setInterval(()=>poll(),3000);}
}
init();
