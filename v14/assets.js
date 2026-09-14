(function(){
'use strict';
const PV=window.PV4;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const NAME_ALIASES={
  'vini jr':['vinicius junior','vinicius jr'],'karim adeyemi':['karim adeyemi'],'joao cancelo':['joao cancelo'],'rodri':['rodrigo hernandez','rodri'],'gabriel jesus':['gabriel jesus'],'anthony gordon':['anthony gordon'],'joao neves':['joao neves'],'hakan calhanoglu':['hakan calhanoglu'],'nicolas barella':['nicolo barella']
};
const CLUB_ALIASES={
  'FC Barcelona':['Barcelona','FC Barcelona'],'Real Madrid':['Real Madrid'],'Atlético de Madrid':['Atletico Madrid','Atlético de Madrid'],'Arsenal':['Arsenal'],'Chelsea':['Chelsea'],'Liverpool':['Liverpool'],'Manchester City':['Manchester City'],'Manchester United':['Manchester United'],'Newcastle':['Newcastle United','Newcastle'],'Tottenham':['Tottenham Hotspur','Tottenham'],'Aston Villa':['Aston Villa'],'Everton':['Everton'],'PSG':['Paris Saint-Germain','Paris SG','PSG'],'Bayern München':['Bayern Munich','FC Bayern Munich','Bayern München'],'Inter':['Inter Milan','Internazionale','Inter'],'AC Milan':['AC Milan','Milan'],'Real Sociedad':['Real Sociedad'],'Deportivo de La Coruña':['Deportivo La Coruna','Deportivo de La Coruña'],'CE Sabadell FC':['CE Sabadell','Sabadell']
};
const namesFor=p=>[norm(p.searchName||p.name),norm(p.name),...(NAME_ALIASES[norm(p.name)]||[]).map(norm)].filter(Boolean);
const clubsFor=c=>[c,...(CLUB_ALIASES[c]||[])].map(norm).filter(Boolean);
const exactName=(actual,p)=>namesFor(p).includes(norm(actual));
const exactClub=(actual,club)=>clubsFor(club).includes(norm(actual));

// V0.14 policy: ONLY transparent football cutouts for the player's CURRENT club.
// Rectangular internet photos are intentionally discarded, including every old Sabadell portrait.
if(PV.state.assetPolicyVersion!==14){
  PV.state.photos={};PV.state.photoSourcesV12={};PV.state.photoMetaV14={};PV.state.photoMissesV14={};PV.state.assetPolicyVersion=14;PV.save?.();
}
PV.state.photoMetaV14=PV.state.photoMetaV14||{};PV.state.photoMissesV14=PV.state.photoMissesV14||{};
const inflight=new Map();
PV.photoFor=async p=>{
  if(!p)return null;
  const meta=PV.state.photoMetaV14[p.id],cached=PV.state.photos[p.id];
  if(cached&&meta&&meta.club===p.club&&meta.kind==='cutout')return cached;
  if(cached){delete PV.state.photos[p.id];delete PV.state.photoMetaV14[p.id];}
  const miss=PV.state.photoMissesV14[p.id];if(miss&&miss.club===p.club)return null;
  if(inflight.has(p.id))return inflight.get(p.id);
  const job=(async()=>{
    let completed=0,transient=false;
    for(const q of namesFor(p)){
      try{
        const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(q)}`);if(!r.ok){transient=true;continue}
        completed++;const j=await r.json(),arr=j?.player||[];
        const hit=arr.find(x=>String(x.strSport||'Soccer').toLowerCase()==='soccer'&&exactName(x.strPlayer,p)&&exactClub(x.strTeam,p.club));
        const url=hit?.strCutout||null;
        if(url){PV.state.photos[p.id]=url;PV.state.photoSourcesV12[p.id]='cutout';PV.state.photoMetaV14[p.id]={club:p.club,kind:'cutout',source:'TheSportsDB',verifiedAt:new Date().toISOString().slice(0,10)};delete PV.state.photoMissesV14[p.id];PV.save?.();return url}
      }catch{transient=true}
    }
    if(completed>0&&!transient){PV.state.photoMissesV14[p.id]={club:p.club,at:new Date().toISOString().slice(0,10)};PV.save?.()}
    return null;
  })().finally(()=>inflight.delete(p.id));
  inflight.set(p.id,job);return job;
};
const pending=new Set();let queue=Promise.resolve();
function paint(id,url){if(!url)return;document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{n.innerHTML=`<img class="pv12-player-art pv12-art-cutout" src="${PV.esc(url)}" alt="" loading="lazy" decoding="async">`})}
function enqueue(id){if(pending.has(id))return;const p=PV.byId(id);if(!p)return;pending.add(id);queue=queue.then(async()=>{const u=await PV.photoFor(p);if(u)paint(id,u);pending.delete(id);await new Promise(r=>setTimeout(r,1900))})}
let observer=null;function getObserver(){if(observer||typeof IntersectionObserver==='undefined')return observer;observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.photo;if(id)enqueue(id);observer.unobserve(e.target)}}),{rootMargin:'260px 0px'});return observer}

// Full replacement hydration: identity badges still hydrate, but legacy v11/v12 official portrait tables never run.
PV.hydrate=root=>{
  const scope=root||document;
  const clubs=[...new Set([...scope.querySelectorAll('[data-club-badge]')].map(n=>n.dataset.clubBadge).filter(Boolean))];
  clubs.slice(0,60).forEach(async club=>{const url=await PV.clubLogoFor?.(club);if(!url)return;document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>{const b=n.querySelector('b')?.outerHTML||`<b>${PV.clubAbbr(club)}</b>`;n.innerHTML=`${b}<img src="${PV.esc(url)}" alt="${PV.esc(club)}" loading="lazy" decoding="async">`})});
  const leagues=[...new Set([...scope.querySelectorAll('[data-league-badge]')].map(n=>n.dataset.leagueBadge).filter(Boolean))];
  leagues.slice(0,40).forEach(async league=>{const url=await PV.leagueLogoFor?.(league);if(!url)return;document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>{const label=String(league).split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();const b=n.querySelector('b')?.outerHTML||`<b>${PV.esc(label)}</b>`;n.innerHTML=`${b}<img src="${PV.esc(url)}" alt="${PV.esc(league)}" loading="lazy" decoding="async">`})});
  const obs=getObserver();let fallbackBudget=8;
  [...scope.querySelectorAll('[data-photo]')].forEach(n=>{const id=n.dataset.photo,p=PV.byId(id);if(!p)return;const meta=PV.state.photoMetaV14[id],u=PV.state.photos[id];if(u&&meta?.club===p.club&&meta?.kind==='cutout'){paint(id,u);return}n.querySelector('img')?.remove();if(obs)obs.observe(n);else if(fallbackBudget-->0)enqueue(id)});
};
PV.assetCoverage=()=>{
  const players=PV.D.PLAYERS.filter(p=>!p.special),photos=players.filter(p=>PV.state.photos[p.id]&&PV.state.photoMetaV14[p.id]?.club===p.club&&PV.state.photoMetaV14[p.id]?.kind==='cutout').length;
  const clubs=[...new Set(players.map(p=>p.club))],leagues=[...new Set(players.map(p=>p.league))];
  const clubBadges=clubs.filter(c=>PV.clubLogoSync?.(c)||PV.state.clubLogos?.[c]).length,leagueLogos=leagues.filter(l=>PV.state.leagueLogos?.[l]).length;
  return{players:players.length,verifiedCutouts:photos,photoPct:players.length?Math.round(photos/players.length*1000)/10:0,clubs:clubs.length,clubBadges,clubPct:clubs.length?Math.round(clubBadges/clubs.length*1000)/10:0,leagues:leagues.length,leagueLogos,leaguePct:leagues.length?Math.round(leagueLogos/leagues.length*1000)/10:0,policy:'CUTOUT ONLY + exact player + exact current club; otherwise silhouette'};
};
window.PV14_ASSET_AUDIT={policy:'cutout-only-current-club',rectangularPhotosAllowed:false,silhouettePreferred:true,legacyOfficialHydrationDisabled:true,coverage:PV.assetCoverage};
})();