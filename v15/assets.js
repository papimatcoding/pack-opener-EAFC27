(function(){
'use strict';
const PV=window.PV4;
if(!PV)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const RAW_NAME_ALIASES={
  'vini jr':['Vinícius Júnior','Vinicius Junior','Vini Jr'],
  'joao cancelo':['João Cancelo','Joao Cancelo'],
  'joao neves':['João Neves','Joao Neves'],
  'hakan calhanoglu':['Hakan Çalhanoğlu','Hakan Calhanoglu'],
  'nicolo barella':['Nicolò Barella','Nicolo Barella'],
  'ruben dias':['Rúben Dias','Ruben Dias'],
  'eder militao':['Éder Militão','Eder Militao'],
  'kylian mbappe':['Kylian Mbappé','Kylian Mbappe'],
  'lamine yamal':['Lamine Yamal'],
  'karim adeyemi':['Karim Adeyemi'],
  'wojciech szczesny':['Wojciech Szczęsny','Wojciech Szczesny'],
  'martin zubimendi':['Martín Zubimendi','Martin Zubimendi'],
  'milos kerkez':['Miloš Kerkez','Milos Kerkez'],
  'fermin lopez':['Fermín López','Fermin Lopez'],
  'alejandro balde':['Alejandro Balde'],
  'jules kounde':['Jules Koundé','Jules Kounde']
};
const CLUB_ALIASES={
  'fc barcelona':['FC Barcelona','Barcelona','Barça','Barca'],
  'real madrid':['Real Madrid','Real Madrid CF'],
  'atletico de madrid':['Atlético de Madrid','Atletico Madrid','Atlético Madrid'],
  'athletic club':['Athletic Club','Athletic Bilbao'],
  'real sociedad':['Real Sociedad','Real Sociedad de Fútbol'],
  'deportivo de la coruna':['Deportivo de La Coruña','Deportivo La Coruna','RC Deportivo'],
  'ce sabadell fc':['CE Sabadell FC','CE Sabadell','Sabadell'],
  'manchester city':['Manchester City','Manchester City FC'],
  'manchester united':['Manchester United','Manchester United FC'],
  'newcastle':['Newcastle','Newcastle United','Newcastle United FC'],
  'tottenham':['Tottenham','Tottenham Hotspur','Tottenham Hotspur FC'],
  'psg':['PSG','Paris Saint-Germain','Paris Saint Germain','Paris SG'],
  'bayern munchen':['Bayern München','Bayern Munich','FC Bayern München','FC Bayern Munich'],
  'inter':['Inter','Inter Milan','Internazionale','FC Internazionale Milano'],
  'ac milan':['AC Milan','Milan','AC Milan'],
  'rb leipzig':['RB Leipzig','RasenBallsport Leipzig'],
  'roma':['Roma','AS Roma'],
  'sporting gijon':['Sporting Gijón','Sporting Gijon','Real Sporting'],
  'r oviedo':['R. Oviedo','Real Oviedo'],
  'r valladolid cf':['R. Valladolid CF','Real Valladolid','Real Valladolid CF']
};
const compactClub=s=>norm(s).split(' ').filter(x=>!['fc','cf','afc','club','de','the','calcio'].includes(x)).join(' ');
function clubCandidates(club){
  const key=norm(club),raw=[club,...(CLUB_ALIASES[key]||[])];
  return [...new Set(raw.map(norm).filter(Boolean))];
}
function clubMatches(actual,club){
  const a=norm(actual),cands=clubCandidates(club);
  if(cands.includes(a))return true;
  const ac=compactClub(actual);
  return cands.some(c=>compactClub(c)===ac&&ac.length>=4);
}
function rawQueries(p){
  const key=norm(p.name),out=[p.searchName,p.name,...(RAW_NAME_ALIASES[key]||[])].filter(Boolean);
  // SearchPlayers is noticeably less reliable when accents/punctuation have been stripped.
  // Preserve canonical spelling first, then add a normalized fallback last.
  out.push(norm(p.name));
  return [...new Set(out.map(x=>String(x).trim()).filter(Boolean))];
}
function playerMatches(actual,p){
  const a=norm(actual);return rawQueries(p).some(q=>norm(q)===a);
}
function validCutout(url){
  if(!url)return false;
  const u=String(url).toLowerCase();
  return (u.includes('/player/cutout/')||u.includes('/player_cutout/')||u.endsWith('.png')||u.includes('.png/'))&&!u.includes('placeholder');
}

PV.state.photoMetaV15=PV.state.photoMetaV15||{};
PV.state.photoMissesV15=PV.state.photoMissesV15||{};
if(PV.state.assetPolicyVersion!==15){
  // Keep only already-verified V14 cutouts that still point at the same current club.
  for(const p of PV.D.PLAYERS){
    const old=PV.state.photoMetaV14?.[p.id],url=PV.state.photos?.[p.id];
    if(url&&old?.club===p.club&&old.kind==='cutout'&&validCutout(url))PV.state.photoMetaV15[p.id]={club:p.club,kind:'cutout',source:old.source||'TheSportsDB',verifiedAt:old.verifiedAt||null};
    else if(PV.state.photos?.[p.id])delete PV.state.photos[p.id];
  }
  PV.state.photoMissesV15={};
  PV.state.assetPolicyVersion=15;
  PV.save?.();
}

const inflight=new Map();
PV.photoFor=async p=>{
  if(!p)return null;
  const cached=PV.state.photos?.[p.id],meta=PV.state.photoMetaV15?.[p.id];
  if(cached&&meta?.club===p.club&&meta.kind==='cutout'&&validCutout(cached))return cached;
  if(cached){delete PV.state.photos[p.id];delete PV.state.photoMetaV15[p.id];}
  const miss=PV.state.photoMissesV15[p.id];
  if(miss?.club===p.club&&Date.now()-(miss.at||0)<7*864e5)return null;
  if(inflight.has(p.id))return inflight.get(p.id);
  const job=(async()=>{
    let successfulRequests=0;
    for(const query of rawQueries(p)){
      try{
        const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(query)}`);
        if(!r.ok)continue;
        successfulRequests++;
        const rows=(await r.json())?.player||[];
        const hit=rows.find(x=>String(x.strSport||'Soccer').toLowerCase()==='soccer'&&playerMatches(x.strPlayer,p)&&clubMatches(x.strTeam,p.club)&&validCutout(x.strCutout));
        if(hit){
          const url=hit.strCutout;
          PV.state.photos[p.id]=url;
          PV.state.photoSourcesV12[p.id]='cutout';
          PV.state.photoMetaV15[p.id]={club:p.club,kind:'cutout',source:'TheSportsDB',playerId:hit.idPlayer||null,team:hit.strTeam||p.club,verifiedAt:new Date().toISOString().slice(0,10)};
          delete PV.state.photoMissesV15[p.id];
          PV.save?.();
          return url;
        }
      }catch{}
    }
    if(successfulRequests)PV.state.photoMissesV15[p.id]={club:p.club,at:Date.now()};
    PV.save?.();
    return null;
  })().finally(()=>inflight.delete(p.id));
  inflight.set(p.id,job);return job;
};

function paint(id,url){
  if(!url)return;
  document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{
    n.innerHTML=`<img class="pv12-player-art pv12-art-cutout pv15-player-art" src="${PV.esc(url)}" alt="" loading="lazy" decoding="async">`;
    const img=n.querySelector('img');
    if(img)img.onerror=()=>{img.remove();n.innerHTML='<span class="pv13-silhouette" aria-hidden="true"><i></i><b></b></span>';};
  });
}
const pending=new Set();let queue=Promise.resolve();
function enqueue(id){
  if(pending.has(id))return;
  const p=PV.byId(id);if(!p)return;
  pending.add(id);
  queue=queue.then(async()=>{const u=await PV.photoFor(p);if(u)paint(id,u);pending.delete(id);await new Promise(r=>setTimeout(r,300));});
}
let observer=null;
function getObserver(){
  if(observer||typeof IntersectionObserver==='undefined')return observer;
  observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.photo;if(id)enqueue(id);observer.unobserve(e.target);}}),{rootMargin:'420px 0px'});
  return observer;
}
const oldHydrate=PV.hydrate;
PV.hydrate=root=>{
  oldHydrate?.(root);
  const scope=root||document,obs=getObserver();
  scope.querySelectorAll?.('[data-photo]').forEach(n=>{
    const id=n.dataset.photo,p=PV.byId(id);if(!p)return;
    const u=PV.state.photos?.[id],m=PV.state.photoMetaV15?.[id];
    if(u&&m?.club===p.club&&m.kind==='cutout'&&validCutout(u))paint(id,u);
    else if(obs)obs.observe(n);else enqueue(id);
  });
  // Old card layers render fallback initials and the real badge in the same grid cell.
  // Mark successful identity assets so CSS can show exactly one layer.
  scope.querySelectorAll?.('[data-club-badge] img,[data-league-badge] img').forEach(img=>{
    const host=img.parentElement;if(!host)return;
    const ok=()=>host.classList.add('pv15-has-asset');
    const bad=()=>{host.classList.remove('pv15-has-asset');img.remove();};
    if(img.complete){img.naturalWidth?ok():bad();}else{img.addEventListener('load',ok,{once:true});img.addEventListener('error',bad,{once:true});}
  });
};
PV.assetCoverage15=()=>{
  const base=PV.D.PLAYERS.filter(p=>!p.special),cutouts=base.filter(p=>PV.state.photos?.[p.id]&&PV.state.photoMetaV15?.[p.id]?.club===p.club).length;
  return{basePlayers:base.length,verifiedCurrentClubCutouts:cutouts,cutoutPct:base.length?Math.round(cutouts/base.length*1000)/10:0,policy:'exact player + exact current club + transparent cutout; otherwise silhouette'};
};
window.PV15_VISUAL_AUDIT={version:15,rawNameQueries:true,currentClubAliases:true,badgeFallbackLayering:'single-layer',coverage:PV.assetCoverage15};
})();