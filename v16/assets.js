(function(){
'use strict';
const PV=window.PV4,D=PV?.D;
if(!PV||!D)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const compact=s=>norm(s).split(' ').filter(x=>!['fc','cf','afc','club','de','the','calcio','sad'].includes(x)).join(' ');

// Manually verified transparent/current-shirt artwork. These URLs come from the current
// 2026/27 FC Barcelona player profiles and are deliberately preferred over provider cutouts.
const OFFICIAL_CURRENT_CUTOUTS={
  'dominik livakovic':'https://www.fcbarcelona.com/photo-resources/2026/08/26/f1059387-7c3e-434a-8854-8f9a8d29b4f7/Livakovic-.png?height=790&width=670',
  'joan garcia':'https://www.fcbarcelona.com/photo-resources/2026/07/21/5d0c5826-9ec5-4625-a97b-3b8d0ca98418/01-Joan_Garcia.png?height=790&width=670',
  'karim adeyemi':'https://www.fcbarcelona.com/photo-resources/2026/07/24/545eed77-cb8c-48f7-a762-f9d459c45bf5/00-Adeyemi.png?height=790&width=670',
  'anthony gordon':'https://www.fcbarcelona.com/photo-resources/2026/07/21/8dfb11f8-dbb7-46e8-ab7e-4bb47f44d05e/00-Gordon.png?height=790&width=670',
  'gabriel jesus':'https://www.fcbarcelona.com/photo-resources/2026/09/03/f8d954d8-3841-490c-9db0-1614995ec68d/09-Gabriel_Jesus.png?height=790&width=670',
  'xavi espart':'https://www.fcbarcelona.com/photo-resources/2026/08/26/d83f3960-8967-4b02-9f2c-363fc34fd2f7/12-XAVI_ESPART-TRANSP.png?height=790&width=670',
  'rodri':'https://www.fcbarcelona.com/photo-resources/2026/08/18/e8a9d0db-9e45-4f40-8db5-c91530aefc21/00-Rodri.png?height=790&width=670',
  'joao cancelo':'https://www.fcbarcelona.com/photo-resources/2026/08/19/7d3f20c8-d349-42e6-90a5-d70a6a2f86b7/00-Cancelo.png?height=790&width=670'
};
const RECENT_TRANSFER_GUARD=new Set([
  'dominik livakovic','joan garcia','karim adeyemi','anthony gordon','gabriel jesus','rodri','joao cancelo','ferran torres','marc casado','hector fort'
]);

const TEAM_ALIASES={
  'FC Barcelona':['Barcelona','Barça','Barca'], 'Real Madrid':['Real Madrid CF'], 'Atlético de Madrid':['Atletico Madrid','Atlético Madrid'],
  'Athletic Club':['Athletic Bilbao'], 'Real Sociedad':['Real Sociedad de Fútbol'], 'Deportivo de La Coruña':['RC Deportivo','Deportivo La Coruna'],
  'CE Sabadell FC':['CE Sabadell','Sabadell'], 'Newcastle':['Newcastle United','Newcastle United FC'], 'Tottenham':['Tottenham Hotspur','Tottenham Hotspur FC'],
  'PSG':['Paris Saint-Germain','Paris Saint Germain','Paris SG'], 'Bayern München':['Bayern Munich','FC Bayern München','FC Bayern Munich'],
  'FC Bayern München':['Bayern München','Bayern Munich','FC Bayern Munich'], 'Inter':['Inter Milan','Internazionale','FC Internazionale Milano'],
  'AC Milan':['Milan'], 'Roma':['AS Roma'], 'R. Oviedo':['Real Oviedo','Oviedo'], 'Sporting Gijón':['Sporting Gijon','Real Sporting'],
  'R. Valladolid CF':['Real Valladolid','Real Valladolid CF','Valladolid'], 'UD Almería':['Almeria','UD Almeria'], 'Cádiz CF':['Cadiz','Cádiz'],
  'CD Leganés':['Leganes','Leganés'], 'CD Castellón':['Castellon','Castellón'], 'Córdoba CF':['Cordoba','Córdoba'], 'Albacete BP':['Albacete']
};
const LEAGUE_SPECS={
  'LaLiga EA Sports':{country:'Spain',re:/la liga|laliga|primera division/i,avoid:/women|femen/i},
  'LALIGA HYPERMOTION':{country:'Spain',re:/segunda|laliga.?2|hypermotion/i},
  'Premier League':{country:'England',re:/premier league/i},
  'Bundesliga':{country:'Germany',re:/bundesliga/i,avoid:/2\.|women|frauen/i},
  'Serie A':{country:'Italy',re:/serie a/i,avoid:/women|femmin/i},
  'Ligue 1':{country:'France',re:/ligue 1/i},
  'Liga Portugal':{country:'Portugal',re:/liga portugal|primeira liga/i},
  'Süper Lig':{country:'Turkey',re:/super lig|süper lig/i},
  'MLS':{country:'United States',re:/major league soccer|mls/i},
  'Scottish Premiership':{country:'Scotland',re:/premiership/i},
  'Belgian Pro League':{country:'Belgium',re:/pro league|first division a/i}
};
const basePlayers=D.PLAYERS.filter(p=>!p.special);
function baseFor(p){
  if(!p?.special)return p||null;
  if(p.baseCardId){const x=basePlayers.find(b=>b.id===p.baseCardId);if(x)return x;}
  return basePlayers.find(b=>p.identity&&b.identity===p.identity)||basePlayers.find(b=>norm(b.name)===norm(p.name))||null;
}
function officialFor(p){const b=baseFor(p)||p,key=norm(b?.name);return b?.club==='FC Barcelona'?OFFICIAL_CURRENT_CUTOUTS[key]||null:null;}
function validCutout(url){if(!url)return false;const u=String(url).toLowerCase();return (u.includes('/player/cutout/')||u.includes('/player_cutout/')||u.includes('photo-resources/')||u.endsWith('.png')||u.includes('.png?'))&&!u.includes('placeholder');}
function teamCandidates(club){return [club,...(TEAM_ALIASES[club]||[])].filter(Boolean)}
function teamMatches(actual,club){const a=compact(actual);return teamCandidates(club).some(x=>{const b=compact(x);return a===b||(a.length>4&&b.length>4&&(a.includes(b)||b.includes(a)));});}

PV.state.photoMetaV16=PV.state.photoMetaV16||{};PV.state.photoSourcesV12=PV.state.photoSourcesV12||{};
PV.state.clubLogos=PV.state.clubLogos||{};PV.state.leagueLogos=PV.state.leagueLogos||{};
if(PV.state.assetPolicyVersion!==16){
  for(const p of D.PLAYERS){
    const b=baseFor(p)||p,key=norm(b.name),official=officialFor(p);
    if(official){
      PV.state.photos[p.id]=official;PV.state.photoSourcesV12[p.id]='cutout';
      PV.state.photoMetaV16[p.id]={club:p.club,kind:p.special?'shared-base-cutout':'official-current-cutout',source:'FC Barcelona official',baseCardId:b.id,verifiedAt:'2026-09-14'};
    }else if(RECENT_TRANSFER_GUARD.has(key)){
      delete PV.state.photos[p.id];if(PV.state.photoMetaV15)delete PV.state.photoMetaV15[p.id];
    }
  }
  for(const p of D.PLAYERS.filter(x=>x.special)){
    const b=baseFor(p);if(!b||PV.state.photos[p.id]||!PV.state.photos[b.id])continue;
    const meta=PV.state.photoMetaV15?.[b.id];if(meta?.club===b.club&&meta.kind==='cutout'&&!RECENT_TRANSFER_GUARD.has(norm(b.name))){PV.state.photos[p.id]=PV.state.photos[b.id];PV.state.photoSourcesV12[p.id]='cutout';PV.state.photoMetaV16[p.id]={club:p.club,kind:'shared-base-cutout',source:meta.source||'base-card',baseCardId:b.id,verifiedAt:meta.verifiedAt||null};}
  }
  PV.state.assetPolicyVersion=16;PV.save?.();
}

const oldPhotoFor=PV.photoFor;
PV.photoFor=async p=>{
  if(!p)return null;
  const b=baseFor(p)||p,official=officialFor(p),key=norm(b.name);
  if(official){
    PV.state.photos[b.id]=official;PV.state.photoSourcesV12[b.id]='cutout';
    PV.state.photoMetaV16[b.id]={club:b.club,kind:'official-current-cutout',source:'FC Barcelona official',baseCardId:b.id,verifiedAt:'2026-09-14'};
    if(p.id!==b.id){PV.state.photos[p.id]=official;PV.state.photoSourcesV12[p.id]='cutout';PV.state.photoMetaV16[p.id]={club:p.club,kind:'shared-base-cutout',source:'FC Barcelona official',baseCardId:b.id,verifiedAt:'2026-09-14'};}
    PV.save?.();return official;
  }
  if(p.special&&b.id!==p.id){
    const u=await PV.photoFor(b);
    if(u){PV.state.photos[p.id]=u;PV.state.photoSourcesV12[p.id]='cutout';PV.state.photoMetaV16[p.id]={club:p.club,kind:'shared-base-cutout',source:PV.state.photoMetaV16[b.id]?.source||PV.state.photoMetaV15?.[b.id]?.source||'base-card',baseCardId:b.id,verifiedAt:new Date().toISOString().slice(0,10)};PV.save?.();return u;}
    return null;
  }
  // Provider metadata can update the team before its cutout artwork does. Recent transfers
  // therefore stay silhouettes until a current-shirt cutout has been manually verified.
  if(RECENT_TRANSFER_GUARD.has(key)){delete PV.state.photos[p.id];PV.save?.();return null;}
  const u=await oldPhotoFor?.(p);
  if(u&&validCutout(u)){PV.state.photoMetaV16[p.id]={club:p.club,kind:'provider-current-cutout',source:PV.state.photoMetaV15?.[p.id]?.source||'TheSportsDB',baseCardId:p.id,verifiedAt:PV.state.photoMetaV15?.[p.id]?.verifiedAt||new Date().toISOString().slice(0,10)};PV.save?.();return u;}
  return null;
};

const oldClubLogoFor=PV.clubLogoFor,oldClubLogoSync=PV.clubLogoSync,oldLeagueLogoFor=PV.leagueLogoFor;
PV.clubLogoSync=club=>PV.state.clubLogos?.[club]||oldClubLogoSync?.(club)||null;
PV.clubLogoFor=async club=>{
  if(!club)return null;if(PV.state.clubLogos?.[club])return PV.state.clubLogos[club];
  const inherited=await oldClubLogoFor?.(club);if(inherited){PV.state.clubLogos[club]=inherited;PV.save?.();return inherited;}
  for(const q of teamCandidates(club)){
    try{const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(q)}`);if(!r.ok)continue;const rows=(await r.json())?.teams||[];const hit=rows.find(x=>String(x.strSport||'').toLowerCase()==='soccer'&&teamMatches(x.strTeam,club));const url=hit?.strBadge||hit?.strLogo||null;if(url){PV.state.clubLogos[club]=url;PV.save?.();return url;}}catch{}
  }
  return null;
};
PV.leagueLogoFor=async league=>{
  if(!league)return null;if(PV.state.leagueLogos?.[league])return PV.state.leagueLogos[league];
  const inherited=await oldLeagueLogoFor?.(league);if(inherited){PV.state.leagueLogos[league]=inherited;PV.save?.();return inherited;}
  const spec=LEAGUE_SPECS[league];if(!spec)return null;
  try{const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/search_all_leagues.php?c=${encodeURIComponent(spec.country)}&s=Soccer`);if(!r.ok)return null;const j=await r.json(),rows=j?.countries||j?.leagues||[];const hit=rows.find(x=>{const s=`${x.strLeague||''} ${x.strLeagueAlternate||''}`;return spec.re.test(s)&&!(spec.avoid&&spec.avoid.test(s));});const url=hit?.strBadge||hit?.strLogo||null;if(url){PV.state.leagueLogos[league]=url;PV.save?.();return url;}}catch{}
  return null;
};

function paintPlayer(id,url){if(!url)return;document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{n.innerHTML=`<img class="pv12-player-art pv12-art-cutout pv15-player-art pv16-player-art" src="${PV.esc(url)}" alt="" loading="lazy" decoding="async">`;const img=n.querySelector('img');if(img)img.onerror=()=>{img.remove();n.innerHTML='<span class="pv13-silhouette" aria-hidden="true"><i></i><b></b></span>';};});}
function paintBadge(host,url,kind,label){if(!host||!url)return;let img=host.querySelector(':scope > img');if(!img){img=document.createElement('img');host.appendChild(img);}img.src=url;img.alt=label||'';img.loading='lazy';img.decoding='async';img.onload=()=>host.classList.add('pv15-has-asset','pv16-has-asset');img.onerror=()=>{img.remove();host.classList.remove('pv15-has-asset','pv16-has-asset');};if(img.complete&&img.naturalWidth)host.classList.add('pv15-has-asset','pv16-has-asset');host.dataset.assetKind=kind;}
async function pool(items,limit,fn){let i=0;const workers=Array.from({length:Math.min(limit,items.length)},async()=>{while(i<items.length){const x=items[i++];await fn(x);}});await Promise.all(workers);}
const oldHydrate=PV.hydrate;
PV.hydrate=root=>{
  oldHydrate?.(root);const scope=root||document;
  const photoIds=[...new Set([...(scope.querySelectorAll?.('[data-photo]')||[])].map(n=>n.dataset.photo).filter(Boolean))];
  photoIds.forEach(async id=>{const p=PV.byId(id);if(!p)return;const u=await PV.photoFor(p);if(u)paintPlayer(id,u);});
  const clubs=[...new Set([...(scope.querySelectorAll?.('[data-club-badge]')||[])].map(n=>n.dataset.clubBadge).filter(Boolean))];
  pool(clubs,4,async club=>{const u=await PV.clubLogoFor(club);if(!u)return;document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>paintBadge(n,u,'club',club));});
  const leagues=[...new Set([...(scope.querySelectorAll?.('[data-league-badge]')||[])].map(n=>n.dataset.leagueBadge).filter(Boolean))];
  pool(leagues,3,async league=>{const u=await PV.leagueLogoFor(league);if(!u)return;document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>paintBadge(n,u,'league',league));});
};

PV.assetCoverage16=()=>{
  const base=basePlayers,official=base.filter(p=>!!officialFor(p)).length,runtime=base.filter(p=>!!PV.state.photos?.[p.id]).length;
  const clubs=[...new Set(base.map(p=>p.club).filter(Boolean))],leagues=[...new Set(base.map(p=>p.league).filter(Boolean))];
  return{basePlayers:base.length,officialCurrentCutouts:official,runtimePlayerImages:runtime,clubBadgesResolved:clubs.filter(x=>!!PV.state.clubLogos?.[x]).length,totalClubs:clubs.length,leagueLogosResolved:leagues.filter(x=>!!PV.state.leagueLogos?.[x]).length,totalLeagues:leagues.length,specialsReuseBase:true,staleTransferGuard:[...RECENT_TRANSFER_GUARD]};
};
window.PV16_ASSET_AUDIT={version:16,officialCurrentCutouts:Object.keys(OFFICIAL_CURRENT_CUTOUTS),leagueSpecs:Object.keys(LEAGUE_SPECS),specialsReuseBase:true,coverage:PV.assetCoverage16};
})();
