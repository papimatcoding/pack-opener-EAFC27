(function(){
'use strict';
const PV=window.PV4,D=PV?.D;if(!PV||!D)return;
const crest=id=>`https://crests.football-data.org/${id}.png`;

// Extra deterministic IDs verified against football-data.org documentation/crest payloads.
// Keep this conservative: a missing crest is better than a wrong crest.
const CLUB_IDS_V17={
  'Aston Villa':58,
  'Aston Villa FC':58,
  'Everton':62,
  'Everton FC':62,
  'Burnley':328,
  'Burnley FC':328,
  'Brentford':402,
  'Brentford FC':402,
  'Brighton':397,
  'Brighton & Hove Albion':397,
  'Crystal Palace':354,
  'Crystal Palace FC':354,
  'West Ham':563,
  'West Ham United':563,
  'Wolverhampton':76,
  'Wolverhampton Wanderers':76,
  'Leeds United':341,
  'Leeds':341
};

PV.state.clubLogos=PV.state.clubLogos||{};
PV.state.leagueLogos=PV.state.leagueLogos||{};
Object.entries(CLUB_IDS_V17).forEach(([name,id])=>PV.state.clubLogos[name]=crest(id));

// V14/V15 used to treat any later policy number as a reason to migrate again. V17 fixes
// those guards and gives old false-negative provider lookups one clean retry without ever
// deleting a verified photo. This is intentionally a separate marker from assetPolicyVersion.
if(PV.state.assetRecoveryV17!==1){
  PV.state.photoMissesV15={};
  PV.state.assetRecoveryV17=1;
  PV.save?.();
}

const oldClubSync=PV.clubLogoSync,oldClubFor=PV.clubLogoFor;
PV.clubLogoSync=club=>CLUB_IDS_V17[club]?crest(CLUB_IDS_V17[club]):oldClubSync?.(club)||PV.state.clubLogos?.[club]||null;
PV.clubLogoFor=async club=>CLUB_IDS_V17[club]?crest(CLUB_IDS_V17[club]):oldClubFor?.(club)||null;

function safeCachedPhoto(p){
  const u=PV.state.photos?.[p.id];if(!u)return null;
  const m16=PV.state.photoMetaV16?.[p.id],m15=PV.state.photoMetaV15?.[p.id],m14=PV.state.photoMetaV14?.[p.id];
  if(m16?.club===p.club)return u;
  if(m15?.club===p.club&&m15.kind==='cutout')return u;
  if(m14?.club===p.club&&m14.kind==='cutout')return u;
  return null;
}
function silhouette(host){host.innerHTML='<span class="pv13-silhouette" aria-hidden="true"><i></i><b></b></span>';}
function paintPlayer(id,url){
  if(!url)return;
  document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(host=>{
    host.innerHTML=`<img class="pv12-player-art pv12-art-cutout pv15-player-art pv16-player-art" src="${PV.esc(url)}" alt="" loading="lazy" decoding="async">`;
    const img=host.querySelector('img');if(img)img.onerror=()=>silhouette(host);
  });
}
function paintBadge(host,url,kind,label){
  if(!host||!url)return;
  let img=host.querySelector(':scope > img');if(!img){img=document.createElement('img');host.appendChild(img);}
  img.src=url;img.alt=label||'';img.loading='lazy';img.decoding='async';host.dataset.assetKind=kind;
  const ok=()=>host.classList.add('pv15-has-asset','pv16-has-asset','pv17-has-asset');
  const bad=()=>{img.remove();host.classList.remove('pv15-has-asset','pv16-has-asset','pv17-has-asset');};
  img.onload=ok;img.onerror=bad;if(img.complete&&img.naturalWidth)ok();
}
async function pool(items,limit,fn){
  let i=0;const workers=Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length){const x=items[i++];await fn(x);}});await Promise.all(workers);
}

// Player provider lookup is deliberately lazy. V16 previously re-requested every card in the
// Club DOM at once after V15 had already installed an IntersectionObserver. That caused avoidable
// request bursts and made valid cutouts look "missing". V17 becomes the final hydrator and only
// resolves a player when the card is near the viewport.
const pending=new Set();let photoQueue=Promise.resolve();
function enqueuePhoto(id){
  if(pending.has(id))return;const p=PV.byId(id);if(!p)return;pending.add(id);
  photoQueue=photoQueue.then(async()=>{try{const u=safeCachedPhoto(p)||await PV.photoFor?.(p);if(u)paintPlayer(id,u);}finally{pending.delete(id);}await new Promise(r=>setTimeout(r,240));});
}
let observer=null;
function photoObserver(){
  if(observer||typeof IntersectionObserver==='undefined')return observer;
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.photo;if(id)enqueuePhoto(id);observer.unobserve(e.target);}}),{rootMargin:'520px 0px'});return observer;
}

PV.hydrate=root=>{
  const scope=root||document,obs=photoObserver();
  [...(scope.querySelectorAll?.('[data-photo]')||[])].forEach(host=>{
    const id=host.dataset.photo,p=PV.byId(id);if(!p)return;const u=safeCachedPhoto(p);
    if(u)paintPlayer(id,u);else{host.querySelector('img')?.remove();if(obs)obs.observe(host);else enqueuePhoto(id);}
  });
  const clubs=[...new Set([...(scope.querySelectorAll?.('[data-club-badge]')||[])].map(n=>n.dataset.clubBadge).filter(Boolean))];
  pool(clubs,3,async club=>{const u=PV.clubLogoSync?.(club)||await PV.clubLogoFor?.(club);if(!u)return;document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>paintBadge(n,u,'club',club));});
  const leagues=[...new Set([...(scope.querySelectorAll?.('[data-league-badge]')||[])].map(n=>n.dataset.leagueBadge).filter(Boolean))];
  pool(leagues,2,async league=>{const u=PV.state.leagueLogos?.[league]||await PV.leagueLogoFor?.(league);if(!u)return;document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>paintBadge(n,u,'league',league));});
};

PV.assetCoverage17=()=>{
  const base=D.PLAYERS.filter(p=>!p.special),clubs=[...new Set(base.map(p=>p.club).filter(Boolean))],leagues=[...new Set(base.map(p=>p.league).filter(Boolean))];
  const photos=base.filter(p=>!!safeCachedPhoto(p)).length;
  const deterministicClubs=clubs.filter(c=>!!CLUB_IDS_V17[c]||/^https:\/\/crests\.football-data\.org\//.test(PV.state.clubLogos?.[c]||'')).length;
  const resolvedClubs=clubs.filter(c=>!!PV.clubLogoSync?.(c)||!!PV.state.clubLogos?.[c]).length;
  const resolvedLeagues=leagues.filter(l=>!!PV.state.leagueLogos?.[l]).length;
  return{basePlayers:base.length,cachedSafeCutouts:photos,totalClubs:clubs.length,deterministicClubs,resolvedClubs,totalLeagues:leagues.length,resolvedLeagues,recoveryV17:PV.state.assetRecoveryV17===1,hydration:'viewport-lazy player lookup + bounded identity lookup'};
};
window.PV17_ASSET_AUDIT={version:17,extraDeterministicClubIds:CLUB_IDS_V17,reloadPersistenceFix:true,lazyPhotoHydration:true,coverage:PV.assetCoverage17};
PV.save?.();
})();