(function(){
'use strict';
const PV=window.PV4;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const esc=PV.esc;
const OFFICIAL={...(window.PV11_ASSETS?.OFFICIAL_PLAYER_PHOTOS||{})};
const NAME_ALIASES={
  'vini jr':['vinicius junior','vinicius jr'],
  'kylian mbappe':['kylian mbappe'],
  'ousmane dembele':['ousmane dembele'],
  'nicolas barella':['nicolo barella'],
  'luis diaz':['luis diaz'],
  'julian alvarez':['julian alvarez'],
  'joao neves':['joao neves'],
  'joao cancelo':['joao cancelo'],
  'hakan calhanoglu':['hakan calhanoglu'],
  'karim adeyemi':['karim adeyemi']
};
const CLUB_ALIASES={
  'Real Madrid':['Real Madrid'],
  'FC Barcelona':['Barcelona','FC Barcelona'],
  'Atlético de Madrid':['Atletico Madrid','Atlético de Madrid'],
  'Manchester City':['Manchester City'],
  'Manchester United':['Manchester United'],
  'Arsenal':['Arsenal'],
  'Liverpool':['Liverpool'],
  'Chelsea':['Chelsea'],
  'Newcastle':['Newcastle United','Newcastle'],
  'PSG':['Paris Saint-Germain','Paris SG','PSG'],
  'Bayern München':['Bayern Munich','FC Bayern Munich','Bayern München'],
  'FC Bayern München':['Bayern Munich','FC Bayern Munich','Bayern München'],
  'Borussia Dortmund':['Borussia Dortmund'],
  'Inter':['Inter Milan','Internazionale','Inter'],
  'AC Milan':['AC Milan','Milan'],
  'Napoli':['Napoli'],
  'Roma':['Roma','AS Roma'],
  'Galatasaray':['Galatasaray'],
  'CE Sabadell FC':['CE Sabadell','Sabadell']
};
const EXTRA_FLAGS={'Kenia':'ke','Líbano':'lb'};
const baseFlag=PV.flag;
PV.flag=n=>{
  const code=EXTRA_FLAGS[n];
  if(!code)return baseFlag(n);
  return `<span class="pv11-flag" title="${esc(n)}" aria-label="${esc(n)}"><img src="https://flagcdn.com/${code}.svg" alt="${esc(n)}" loading="lazy" decoding="async"></span>`;
};

// Migration must be monotonic. If a later layer has already advanced assetPolicyVersion,
// V12 must never interpret that as a downgrade and wipe verified photos on reload.
if(Number(PV.state.assetPolicyVersion||0)<12){
  PV.state.photos={};PV.state.photoMissesV12={};PV.state.photoSourcesV12={};PV.state.assetPolicyVersion=12;PV.save?.();
}
PV.state.photoMissesV12=PV.state.photoMissesV12||{};PV.state.photoSourcesV12=PV.state.photoSourcesV12||{};

const namesFor=p=>{
  const n=norm(p.searchName||p.name),a=NAME_ALIASES[n]||[];
  return [...new Set([n,norm(p.name),...a.map(norm)])].filter(Boolean);
};
const clubsFor=club=>[club,...(CLUB_ALIASES[club]||[])].map(norm).filter(Boolean);
const exactName=(actual,p)=>namesFor(p).includes(norm(actual));
const exactClub=(actual,club)=>clubsFor(club).includes(norm(actual));

const inflight=new Map();
PV.photoFor=async p=>{
  if(!p)return null;
  const key=norm(p.name),official=OFFICIAL[key];
  if(official){PV.state.photos[p.id]=official;PV.state.photoSourcesV12[p.id]='official';return official}
  if(PV.state.photos[p.id])return PV.state.photos[p.id];
  if(PV.state.photoMissesV12[p.id])return null;
  if(inflight.has(p.id))return inflight.get(p.id);
  const job=(async()=>{
    let transientError=false,completedQueries=0;
    for(const q of namesFor(p)){
      try{
        const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(q)}`);
        if(!r.ok){transientError=true;continue}
        completedQueries++;
        const j=await r.json(),arr=j?.player||[];
        const hit=arr.find(x=>String(x.strSport||'Soccer').toLowerCase()==='soccer'&&exactName(x.strPlayer,p)&&exactClub(x.strTeam,p.club));
        // Only transparent/cutout artwork is accepted. Generic thumbs create inconsistent crops and old-shirt errors.
        const url=hit?.strCutout||null;
        if(url){PV.state.photos[p.id]=url;PV.state.photoSourcesV12[p.id]='cutout';delete PV.state.photoMissesV12[p.id];PV.save?.();return url}
      }catch{transientError=true}
    }
    // Cache a miss only after real successful API responses. Network/rate-limit failures are retried later.
    if(completedQueries>0&&!transientError){PV.state.photoMissesV12[p.id]=1;PV.save?.()}
    return null;
  })().finally(()=>inflight.delete(p.id));
  inflight.set(p.id,job);return job;
};

const pending=new Set();let queue=Promise.resolve();
function photoSource(id,url){const p=PV.byId(id),official=p&&OFFICIAL[norm(p.name)];return official&&official===url?'official':PV.state.photoSourcesV12[id]||'cutout'}
function paintPhoto(id,url){if(!url)return;const source=photoSource(id,url);PV.state.photoSourcesV12[id]=source;document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{n.innerHTML=`<img class="pv12-player-art pv12-art-${source}" src="${esc(url)}" alt="" loading="lazy" decoding="async">`})}
function enqueue(id){if(pending.has(id))return;const p=PV.byId(id);if(!p)return;pending.add(id);queue=queue.then(async()=>{const url=await PV.photoFor(p);if(url)paintPhoto(id,url);pending.delete(id);/* stay under public API burst limits */await new Promise(r=>setTimeout(r,1900))})}
let observer=null;
function photoObserver(){if(observer||typeof IntersectionObserver==='undefined')return observer;observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const id=e.target.dataset.photo;if(id)enqueue(id);observer.unobserve(e.target)})},{rootMargin:'240px 0px'});return observer}

PV.hydrate=root=>{
  const scope=root||document;
  const clubs=[...new Set([...scope.querySelectorAll('[data-club-badge]')].map(n=>n.dataset.clubBadge).filter(Boolean))];
  clubs.slice(0,50).forEach(async club=>{const url=await PV.clubLogoFor?.(club);if(!url)return;document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>n.innerHTML=`<img src="${esc(url)}" alt="${esc(club)}" loading="lazy" decoding="async">`)});
  const leagues=[...new Set([...scope.querySelectorAll('[data-league-badge]')].map(n=>n.dataset.leagueBadge).filter(Boolean))];
  leagues.slice(0,30).forEach(async league=>{const url=await PV.leagueLogoFor?.(league);if(!url)return;document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>n.innerHTML=`<img src="${esc(url)}" alt="${esc(league)}" loading="lazy" decoding="async">`)});
  const obs=photoObserver();let fallbackBudget=8;
  [...scope.querySelectorAll('[data-photo]')].forEach(n=>{
    const id=n.dataset.photo,p=PV.byId(id);if(!p)return;
    const cached=PV.state.photos[id]||OFFICIAL[norm(p.name)];
    if(cached){paintPhoto(id,cached);return}
    if(obs)obs.observe(n);else if(fallbackBudget-->0)enqueue(id);
  });
};

window.PV12_ASSET_AUDIT={policy:'official-first + exact-name/current-club cutout only',officialCount:Object.keys(OFFICIAL).length,remoteThrottleMs:1900,portraitClasses:['official','cutout']};
})();