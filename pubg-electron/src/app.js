const API = 'https://api.pubg.com';
const REFRESH = 3 * 60 * 1000;

let S = {
  mode:'squad', boMode:'squad',
  accountId:null, matchIds:[],
  seasonId:null, seasonLabel:null,
  overlayMode:false, refreshTimer:null,
  matchesLoaded:false, bestofLoaded:false,
};

// In-memory mirror of the persisted config. The actual storage lives in the
// main process (encrypted via safeStorage / OS keychain) — the renderer
// never touches disk directly and never keeps the API key in localStorage.
let _cfgCache = {};

async function initConfig() {
  try {
    _cfgCache = (await window.electronAPI?.loadConfig()) || {};
  } catch {
    _cfgCache = {};
  }
}

function loadCfg() { return _cfgCache; }

async function saveCfgStore(o) {
  _cfgCache = o;
  const ok = await window.electronAPI?.saveConfig(o);
  if (!ok) console.error('Failed to persist config securely.');
}

document.addEventListener('DOMContentLoaded', async () => {
  await initConfig();
  const cfg = loadCfg();
  if (cfg.apiKey)    document.getElementById('cfgApiKey').value    = cfg.apiKey;
  if (cfg.player)    document.getElementById('cfgPlayer').value    = cfg.player;
  if (cfg.platform)  document.getElementById('cfgPlatform').value  = cfg.platform;
  if (cfg.startMode) { document.getElementById('cfgMode').value    = cfg.startMode; S.mode = cfg.startMode; }

  document.getElementById('modeBar').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    document.querySelectorAll('#modeBar .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active'); S.mode = c.dataset.mode;
    showSkeletons('season'); refreshSeason();
  });

  document.getElementById('boModeBar').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    document.querySelectorAll('#boModeBar .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active'); S.boMode = c.dataset.mode;
    S.bestofLoaded = false; loadBestOf(true);
  });

  window.electronAPI?.onSetMode(mode => {
    S.overlayMode = mode === 'overlay';
    document.body.classList.toggle('overlay-mode', S.overlayMode);
    document.getElementById('ovlBtn').classList.toggle('active', S.overlayMode);
  });

  window.electronAPI?.onUpdateAvailable(info => showUpdateBanner(info));

  // Titlebar controls
  document.getElementById('ovlBtn').addEventListener('click', toggleOverlay);
  document.getElementById('minBtn').addEventListener('click', () => window.electronAPI?.minimizeWindow());
  document.getElementById('closeBtn').addEventListener('click', () => window.electronAPI?.closeWindow());

  // Tabs (event delegation)
  document.getElementById('tabs').addEventListener('click', e => {
    const t = e.target.closest('.tab'); if (!t) return;
    switchTab(t.dataset.tab);
  });

  // Refresh / reload buttons
  document.getElementById('refreshBtn').addEventListener('click', refreshAll);
  document.getElementById('reloadMatchesBtn').addEventListener('click', () => loadMatches(true));

  // Config page
  document.getElementById('apiKeyLink').addEventListener('click', e => {
    e.preventDefault();
    openLink('https://developer.pubg.com');
  });
  document.getElementById('saveConfigBtn').addEventListener('click', saveConfig);
  document.getElementById('testApiBtn').addEventListener('click', testAPI);

  // Update banner
  document.getElementById('updateBannerDismiss').addEventListener('click', () => {
    document.getElementById('updateBanner').hidden = true;
  });

  if (cfg.apiKey && cfg.player) { setDot('load'); setStatus('CONNECTING…'); startRefresh(); }
  else { switchTab('cfg'); setDot('err'); setStatus('API KEY & PLAYER REQUIRED'); }
});

function switchTab(name) {
  const names = ['stats','matches','bestof','cfg'];
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', names[i]===name));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  if (name==='matches' && !S.matchesLoaded && S.accountId) loadMatches(false);
  if (name==='bestof'  && !S.bestofLoaded  && S.accountId) loadBestOf(false);
}

async function saveConfig() {
  const cfg = {
    apiKey:    document.getElementById('cfgApiKey').value.trim(),
    player:    document.getElementById('cfgPlayer').value.trim(),
    platform:  document.getElementById('cfgPlatform').value,
    startMode: document.getElementById('cfgMode').value,
  };
  if (!cfg.apiKey||!cfg.player) return setCfgStatus('API KEY AND PLAYER NAME REQUIRED','err');
  await saveCfgStore(cfg);
  S.mode=cfg.startMode; S.accountId=null; S.seasonId=null;
  S.matchesLoaded=false; S.bestofLoaded=false;
  setCfgStatus('SAVED!','ok');
  switchTab('stats'); showSkeletons('season'); startRefresh();
}

async function testAPI() {
  const cfg = { apiKey:document.getElementById('cfgApiKey').value.trim(), player:document.getElementById('cfgPlayer').value.trim(), platform:document.getElementById('cfgPlatform').value };
  if (!cfg.apiKey||!cfg.player) return setCfgStatus('FILL IN ALL FIELDS','err');
  setCfgStatus('TESTING…');
  try { const p=await getPlayer(cfg.apiKey,cfg.platform,cfg.player); setCfgStatus(`✓ FOUND: ${p.attributes.name}`,'ok'); }
  catch(e) { setCfgStatus('✗ '+e.message.toUpperCase(),'err'); }
}
function setCfgStatus(m,c='') { const e=document.getElementById('cfgStatus'); e.textContent=m; e.className='cfg-status '+c; }

function startRefresh() {
  if (S.refreshTimer) clearInterval(S.refreshTimer);
  refreshAll();
  S.refreshTimer = setInterval(refreshAll, REFRESH);
}

async function refreshAll() {
  const cfg = loadCfg(); if (!cfg.apiKey||!cfg.player) return;
  setDot('load'); const t0=Date.now();
  try {
    if (!S.accountId) {
      const p = await getPlayer(cfg.apiKey, cfg.platform, cfg.player);
      S.accountId = p.id;
      S.matchIds  = (p.relationships?.matches?.data||[]).map(m=>m.id).slice(0,3);
      const name  = p.attributes.name;
      document.getElementById('pName').textContent      = name.toUpperCase();
      document.getElementById('ovNameMini').textContent = name.toUpperCase();
    }
    if (!S.seasonId) {
      const {id,label} = await getCurrentSeason(cfg.apiKey, cfg.platform);
      S.seasonId=id; S.seasonLabel=label;
      document.getElementById('pSeason').textContent = label;
    }
    await refreshSeason();
    setDot('live'); setStatus(`UPDATED · ${Date.now()-t0}MS · AUTO IN 3MIN`);
    if (!S.matchesLoaded) loadMatches(false);
    if (!S.bestofLoaded)  loadBestOf(false);
  } catch(e) {
    setDot('err'); setStatus('ERROR: '+e.message.toUpperCase());
    if (e.message.includes('401')||e.message.includes('403')) S.accountId=null;
  }
}

async function refreshSeason() {
  const cfg=loadCfg();
  const data=await getSeasonStats(cfg.apiKey, cfg.platform, S.accountId, S.seasonId);
  const ms=data?.attributes?.gameModeStats?.[S.mode];
  if (!ms||ms.roundsPlayed===0) clearSeason(); else renderSeason(ms);
  document.getElementById('pMeta').textContent = (loadCfg().platform||'─').toUpperCase()+' · '+S.mode.toUpperCase();
}

function renderSeason(s) {
  const g=s.roundsPlayed||0, k=s.kills||0, d=Math.max(1,g-(s.wins||0));
  const kd=(k/d).toFixed(2), wr=g>0?((s.wins/g)*100).toFixed(1):'0.0';
  const t10=g>0?((s.top10s/g)*100).toFixed(1):'0.0', avgD=g>0?Math.round(s.damageDealt/g):0;
  setVal('s-kd',    kd,                   kd>=2?'acc':null);
  setVal('s-wins',  `${s.wins}`,          s.wins>0?'grn':null);
  setVal('s-games', g,                    null);
  setVal('s-kills', k,                    'red');
  setVal('s-top10', t10+'%',              null);
  setVal('s-dmg',   avgD,                 avgD>=300?'acc':null);
  setVal('s-hs',      s.headshotKills||0, null);
  setVal('s-assists', s.assists||0,       null);
  setVal('s-driven',  ((s.rideDistance||0)/1000).toFixed(1)+' km', null);
  setVal('s-walked',  ((s.walkDistance||0)/1000).toFixed(1)+' km', null);
  setVal('s-longest', Math.round(s.longestKill||0)+'m', null);
}

function clearSeason() {
  ['s-kd','s-wins','s-games','s-kills','s-top10','s-dmg','s-hs','s-assists','s-driven','s-walked','s-longest']
    .forEach(id=>setVal(id,'─',null));
}

async function loadMatches(force) {
  if (S.matchesLoaded&&!force) return;
  if (!S.accountId) return;
  const cfg = loadCfg();
  if (force) {
    try { const p=await getPlayer(cfg.apiKey,cfg.platform,cfg.player); S.matchIds=(p.relationships?.matches?.data||[]).map(m=>m.id).slice(0,3); } catch(e) {}
  }
  if (!S.matchIds.length) {
    document.getElementById('matchesList').innerHTML='<div class="match-loading">NO MATCH IDs FOUND</div>';
    return;
  }
  const list = document.getElementById('matchesList');
  list.innerHTML = S.matchIds.map((_,i) =>
    `<div class="match-loading" id="ml-${i}"><div class="dot load" style="animation-delay:${i*.25}s"></div> LOADING MATCH ${i+1} OF 3…</div>`
  ).join('');
  for (let i=0; i<S.matchIds.length; i++) {
    try {
      const mdata=await getMatch(cfg.apiKey, cfg.platform, S.matchIds[i]);
      const ph=document.getElementById(`ml-${i}`);
      if (ph) ph.outerHTML=buildMatchCard(mdata, S.accountId);
    } catch(e) {
      const ph=document.getElementById(`ml-${i}`);
      if (ph) ph.outerHTML=`<div class="match-loading" style="color:var(--red2)">✗ MATCH ${i+1} ERROR: ${escapeHtml(e.message.slice(0,60).toUpperCase())}</div>`;
    }
  }
  S.matchesLoaded = true;
}

function buildMatchCard(mdata, accountId) {
  const match=mdata.data, included=mdata.included||[];
  const part=included.find(x=>x.type==='participant'&&x.attributes?.stats?.playerId===accountId);
  if (!part) return `<div class="match-loading" style="color:var(--dim)">NO PARTICIPANT DATA FOUND</div>`;
  const st=part.attributes.stats;
  const roster=included.find(x=>x.type==='roster'&&x.relationships?.participants?.data?.some(p=>p.id===part.id));
  const total=match.attributes?.totalParticipants||'?';
  const place=roster?.attributes?.stats?.rank||st.winPlace||'?';
  const rankCls=place===1?'win':place<=5?'top5':place<=10?'top10':'';
  const cardCls=place===1?'win-card':place<=5?'top5-card':place<=10?'top10-card':'';
  const kills=st.kills||0, assists=st.assists||0, dmg=Math.round(st.damageDealt||0);
  const headshots=st.headshotKills||0, knocks=st.DBNOs||0;
  const longest=Math.round(st.longestKill||0);
  const survived=fmtTime(st.timeSurvived||0);
  // mapName/modeRaw come from the PUBG API and are normally short enum-like
  // strings, but they're escaped defensively before going into innerHTML.
  const mapName=escapeHtml(mapAlias(match.attributes?.mapName||''));
  const modeRaw=escapeHtml(match.attributes?.gameMode||match.attributes?.matchType||'─');
  const dateStr=match.attributes?.createdAt?fmtDate(match.attributes.createdAt):'─';
  const duration=match.attributes?.duration?fmtTime(match.attributes.duration):'─';
  return `<div class="match-card ${cardCls}">
  <div class="match-top">
    <div class="match-rank">
      <div class="mr-num ${rankCls}">#${place}</div>
      <div class="mr-of">/ ${total}</div>
      <div class="mr-label ${place===1?'win':''}">${place===1?'WINNER':'PLACE'}</div>
    </div>
    <div class="match-stats">
      <div class="ms-item"><div class="ms-val ${kills>=5?'acc':kills>=2?'':''}">${kills}</div><div class="ms-key">Kills</div></div>
      <div class="ms-item"><div class="ms-val ${dmg>=400?'acc':''}">${dmg}</div><div class="ms-key">Damage</div></div>
      <div class="ms-item"><div class="ms-val">${assists}</div><div class="ms-key">Assists</div></div>
      <div class="ms-item"><div class="ms-val blu">${survived}</div><div class="ms-key">Survived</div></div>
      <div class="ms-item"><div class="ms-val ${headshots>0?'acc':''}">${headshots}</div><div class="ms-key">Headshots</div></div>
      <div class="ms-item"><div class="ms-val">${longest}m</div><div class="ms-key">Longest Kill</div></div>
      <div class="ms-item"><div class="ms-val grn">${knocks}</div><div class="ms-key">Knocks</div></div>
      <div class="ms-item"><div class="ms-val">${mapName}</div><div class="ms-key">Map</div></div>
    </div>
  </div>
  <div class="match-footer">
    <div class="mf-item">${dateStr}</div>
    <div class="mf-item">Duration: <span>${duration}</span></div>
    <div class="match-mode-tag">${modeRaw}</div>
  </div>
</div>`;
}

async function loadBestOf(force) {
  if (S.bestofLoaded&&!force) return;
  if (!S.accountId) return;
  const cfg=loadCfg();
  showSkeletons('bestof');
  try {
    const data=await getLifetimeStats(cfg.apiKey, cfg.platform, S.accountId);
    const ms=data?.attributes?.gameModeStats?.[S.boMode];
    if (!ms) { renderBestOfEmpty(); return; }
    renderBestOf(ms); S.bestofLoaded=true;
  } catch(e) {
    document.getElementById('bestofGrid').innerHTML=`<div style="grid-column:span 2;padding:20px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--red2)">ERROR: ${escapeHtml(e.message.toUpperCase())}</div>`;
  }
}

function renderBestOf(s) {
  const longest=Math.round(s.longestKill||0)+'m';
  const maxKS=s.maxKillStreaks||0;
  const maxDmg=Math.round(s.mostDamage||0);
  const survTime=Math.round((s.mostSurvivalTime||0)/60)+' min';
  const days=s.daysLasted||0;
  const hsTotal=s.headshotKills||0;
  const totalK=s.kills||0, totalW=s.wins||0, totalM=s.roundsPlayed||0;
  const totalKm=(((s.rideDistance||0)+(s.walkDistance||0)+(s.swimDistance||0))/1000).toFixed(0)+' km';
  document.getElementById('bestofGrid').innerHTML=`
<div class="bo-card acc">
  <div class="bo-val acc">${longest}</div>
  <div class="bo-label">Longest Kill</div>
  <div class="bo-sub">Best Single Shot Distance</div>
</div>
<div class="bo-card grn">
  <div class="bo-val grn">${maxKS}</div>
  <div class="bo-label">Kill Streak Record</div>
  <div class="bo-sub">Longest Kill Streak in a Match</div>
</div>
<div class="bo-card red">
  <div class="bo-val red">${maxDmg}</div>
  <div class="bo-label">Max Damage / Match</div>
  <div class="bo-sub">Highest Damage in a Single Game</div>
</div>
<div class="bo-card blu">
  <div class="bo-val blu">${survTime}</div>
  <div class="bo-label">Longest Survival</div>
  <div class="bo-sub">Most Survival Time in a Match</div>
</div>
<div class="bo-card neu">
  <div class="bo-val">${days}</div>
  <div class="bo-label">Days Lasted</div>
  <div class="bo-sub">Lifetime Days Lasted</div>
</div>
<div class="bo-card grn">
  <div class="bo-val grn">${hsTotal}</div>
  <div class="bo-label">Total Headshots</div>
  <div class="bo-sub">Lifetime Headshot Kills</div>
</div>
<div class="bo-wide">
  <div class="bow-item"><div class="bow-val">${totalK}</div><div class="bow-label">Total Kills</div></div>
  <div class="bow-item"><div class="bow-val">${totalW}</div><div class="bow-label">Total Wins</div></div>
  <div class="bow-item"><div class="bow-val">${totalM}</div><div class="bow-label">Total Matches</div></div>
  <div class="bow-item"><div class="bow-val">${totalKm}</div><div class="bow-label">Total Distance</div></div>
</div>`;
}

function renderBestOfEmpty() {
  document.getElementById('bestofGrid').innerHTML=`<div style="grid-column:span 2;padding:20px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim)">NO LIFETIME DATA FOR THIS MODE</div>`;
}

function setVal(id, val, colorClass) {
  const el=document.getElementById(id); if(!el) return;
  el.classList.remove('skel','acc','grn','red','blu');
  el.textContent=val; if(colorClass) el.classList.add(colorClass);
}

function showSkeletons(type) {
  if (type==='season') {
    ['s-kd','s-wins','s-games','s-kills','s-top10','s-dmg','s-hs','s-assists','s-driven','s-walked','s-longest']
      .forEach(id=>{const e=document.getElementById(id);if(e){e.textContent='';e.classList.add('skel');}});
    setDot('load'); setStatus('LOADING…');
  }
  if (type==='bestof') {
    document.getElementById('bestofGrid').innerHTML=`
      <div class="bo-card acc"><div class="bo-val acc skel"></div><div class="bo-label">Longest Kill</div></div>
      <div class="bo-card grn"><div class="bo-val grn skel"></div><div class="bo-label">Kill Streak Record</div></div>
      <div class="bo-card red"><div class="bo-val red skel"></div><div class="bo-label">Max Damage / Match</div></div>
      <div class="bo-card blu"><div class="bo-val blu skel"></div><div class="bo-label">Longest Survival</div></div>
      <div class="bo-card neu"><div class="bo-val skel"></div><div class="bo-label">Days Lasted</div></div>
      <div class="bo-card grn"><div class="bo-val grn skel"></div><div class="bo-label">Total Headshots</div></div>`;
  }
}

function setDot(s)    { document.getElementById('dot').className='dot '+s; }
function setStatus(t) { document.getElementById('statusTxt').textContent=t; }
function toggleOverlay() { window.electronAPI?.toggleOverlay(); }

// All external navigation goes through the main process, which only allows
// https:// URLs and always opens them in the OS default browser — never
// inside an Electron window (see setWindowOpenHandler in main.js).
function openLink(u) { window.electronAPI?.openExternal(u); }

function showUpdateBanner({ version, url }) {
  document.getElementById('updateBannerText').textContent = `Update available: ${version}`;
  const link = document.getElementById('updateBannerLink');
  link.onclick = (e) => { e.preventDefault(); openLink(url); };
  document.getElementById('updateBanner').hidden = false;
}

// Minimal HTML-escaping helper. Used anywhere text that isn't fully
// controlled by this app (API error bodies, API-provided strings) is
// inserted via innerHTML/outerHTML instead of textContent.
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function fmtTime(sec) { const m=Math.floor(sec/60),s=Math.floor(sec%60); return m>0?`${m}m ${s}s`:`${s}s`; }
function fmtDate(iso) {
  const d=new Date(iso);
  return d.toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit',year:'numeric'})
    +' '+d.toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});
}
function mapAlias(raw) {
  return {'Baltic_Main':'Erangel','Desert_Main':'Miramar','Savage_Main':'Sanhok',
    'DihorOtok_Main':'Vikendi','Kiki_Main':'Deston','Tiger_Main':'Taego',
    'Neon_Main':'Rondo','Summerland_Main':'Karakin','Chimera_Main':'Paramo',
    'Heaven_Main':'Haven'}[raw]||raw.replace('_Main','').slice(0,7)||'?';
}

const hdrs = k => ({'Authorization':`Bearer ${k}`,'Accept':'application/vnd.api+json'});
async function apiFetch(k, path) {
  const r=await fetch(API+path,{headers:hdrs(k)});
  if (!r.ok){const t=await r.text().catch(()=>'');throw new Error(`HTTP ${r.status}${t?': '+t.slice(0,80):''}`);}
  return r.json();
}
async function getPlayer(k,pl,name) {
  const d=await apiFetch(k,`/shards/${pl}/players?filter[playerNames]=${encodeURIComponent(name)}`);
  const p=d?.data?.[0]; if(!p) throw new Error(`"${name}" not found`); return p;
}
async function getCurrentSeason(k,pl) {
  const d=await apiFetch(k,`/shards/${pl}/seasons`);
  const s=d.data?.find(x=>x.attributes?.isCurrentSeason); if(!s) throw new Error('Season not found');
  const m=s.id.match(/(\d{4}-\d+)$/)||s.id.match(/([^.]+)$/);
  return {id:s.id,label:m?'S'+m[1]:s.id};
}
async function getSeasonStats(k,pl,aid,sid) {
  return (await apiFetch(k,`/shards/${pl}/players/${aid}/seasons/${sid}`))?.data;
}
async function getLifetimeStats(k,pl,aid) {
  return (await apiFetch(k,`/shards/${pl}/players/${aid}/seasons/lifetime`))?.data;
}
async function getMatch(k,pl,mid) {
  return await apiFetch(k,`/shards/${pl}/matches/${mid}`);
}
