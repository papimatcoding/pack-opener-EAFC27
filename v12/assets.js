(function(){
'use strict';
const PV=window.PV4,D=PV.D;
if(!PV||!D)return;
const esc=PV.esc;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const compact=s=>norm(s).replace(/\b(fc|cf|afc|sad|club|football|futbol|calcio|deportivo|sporting)\b/g,' ').replace(/\s+/g,' ').trim();

/*
 * PackVerse v0.12 asset layer
 * - Keep manually verified assets first.
 * - Resolve current player art by BOTH player identity and current club.
 * - Keep a silhouette/badge text fallback in the DOM if a remote image fails.
 * - Relax team/league matching enough to avoid false negatives, without accepting other sports.
 */

const V11=window.PV11_ASSETS||{};
const TRUSTED_PLAYER_PHOTOS={...(V11.OFFICIAL_PLAYER_PHOTOS||{})};
const TRUSTED_LEAGUE_LOGOS={...(V11.OFFICIAL_LEAGUE_LOGOS||{})};
const TRUSTED_CLUB_LOGOS={...(window.PV10_OFFICIAL_ASSETS||{})};

const CLUB_ALIASES={
  'CE Sabadell FC':['Sabadell','CE Sabadell'],
  'Real Madrid':['Real Madrid CF','Real Madrid'],
  'FC Barcelona':['Barcelona','FC Barcelona'],
  'Atlético de Madrid':['Atletico Madrid','Atlético Madrid','Club Atletico de Madrid'],
  'Manchester City':['Man City','Manchester City FC'],
  'Manchester United':['Man United','Manchester United FC'],
  'Bayern München':['Bayern Munich','FC Bayern Munich','FC Bayern München'],
  'FC Bayern München':['Bayern Munich','FC Bayern Munich','FC Bayern München'],
  'PSG':['Paris Saint-Germain','Paris SG','Paris Saint Germain'],
  'Inter':['Inter Milan','Internazionale','FC Internazionale Milano'],
  'AC Milan':['Milan','AC Milan'],
  'Roma':['AS Roma','Roma'],
  'Newcastle':['Newcastle United','Newcastle United FC'],
  'Tottenham':['Tottenham Hotspur','Spurs'],
  'Brighton':['Brighton & Hove Albion','Brighton and Hove Albion'],
  'RB Leipzig':['RasenBallsport Leipzig','Leipzig'],
  'Lyon':['Olympique Lyonnais','OL Lyonnes','Lyon'],
  'Gotham FC':['NJ/NY Gotham FC','Gotham FC'],
  'Orlando Pride':['Orlando Pride'],
  'Bay FC':['Bay FC'],
  'Al Hilal':['Al-Hilal','Al Hilal SFC'],
  'Al Ahli':['Al-Ahli','Al Ahli Saudi'],
  'Al Ittihad':['Al-Ittihad','Al Ittihad Club'],
  'Rosario Central':['CA Rosario Central','Rosario Central'],
  'Athletic Club':['Athletic Bilbao','Athletic Club Bilbao'],
  'Rayo Vallecano':['Rayo Vallecano de Madrid','Rayo Vallecano'],
  'Eintracht Frankfurt':['Eintracht Frankfurt'],
  'Club Brugge':['Club Brugge KV','Club Brugge'],
  'Santa Clara':['CD Santa Clara','Santa Clara'],
  'Union Berlin':['1. FC Union Berlin','Union Berlin'],
  'Heidenheim':['1. FC Heidenheim','Heidenheim']
};

const PLAYER_ALIASES={
  'vini jr':['Vinicius Junior','Vinícius Júnior'],
  'joao neves':['João Neves'],
  'joao cancelo':['João Cancelo'],
  'khvicha kvaratskhelia':['Khvicha Kvaratskhelia'],
  'nicol barella':['Nicolò Barella'],
  'ruben dias':['Rúben Dias'],
  'eder militao':['Éder Militão','Eder Militao'],
  'luka modric':['Luka Modrić'],
  'hakan calhanoglu':['Hakan Çalhanoğlu'],
  'angel di maria':['Ángel Di María'],
  'andrei ratiu':['Andrei Rațiu'],
  'baris alper yilmaz':['Barış Alper Yılmaz'],
  'jamie gittens':['Jamie Bynoe-Gittens','Jamie Gittens']
};

const clubNames=club=>[club,...(CLUB_ALIASES[club]||[])].map(compact).filter(Boolean);
const nameMatches=(a,b)=>{a=compact(a);b=compact(b);return !!a&&!!b&&(a===b||a.includes(b)||b.includes(a));};
const teamMatches=(team,club)=>clubNames(club).some(w=>nameMatches(team,w));
const playerNames=p=>[p.name,...(PLAYER_ALIASES[norm(p.name)]||[])].filter(Boolean);
const silhouette=()=>'<span class="pv7-silhouette" aria-hidden="true"><i></i><b></b></span>';
const img=(url,alt,cls='')=>`<img${cls?` class="${cls}"`:''} src="${esc(url)}" alt="${esc(alt||'')}" loading="lazy" decoding="async">`;

PV.state.photoMeta=PV.state.photoMeta||{};
PV.state.assetPolicyVersion=12;

const oldPhotoFor=PV.photoFor;
PV.photoFor=async p=>{
  if(!p)return null;
  PV.state.photos=PV.state.photos||{};
  PV.state.photoMeta=PV.state.photoMeta||{};

  const trusted=TRUSTED_PLAYER_PHOTOS[norm(p.name)]||TRUSTED_PLAYER_PHOTOS[p.id]||TRUSTED_PLAYER_PHOTOS[p.identity];
  if(trusted){
    PV.state.photos[p.id]=trusted;
    PV.state.photoMeta[p.id]={club:p.club,source:'trusted',v:12};
    PV.save?.();
    return trusted;
  }

  const cached=PV.state.photos[p.id],meta=PV.state.photoMeta[p.id];
  if(cached&&meta?.club===p.club&&meta?.v===12)return cached;
  delete PV.state.photos[p.id];
  delete PV.state.photoMeta[p.id];

  for(const q of playerNames(p)){
    try{
      const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=${encodeURIComponent(q)}`);
      if(!r.ok)continue;
      const j=await r.json();
      const candidates=(j?.player||j?.players||[]).filter(x=>String(x.strSport||'').toLowerCase()==='soccer');
      const exact=candidates.filter(x=>playerNames(p).some(n=>nameMatches(x.strPlayer,n)));
      const hit=exact.find(x=>teamMatches(x.strTeam,p.club))||candidates.find(x=>teamMatches(x.strTeam,p.club));
      const url=hit?.strCutout||hit?.strRender||hit?.strThumb||null;
      if(url){
        PV.state.photos[p.id]=url;
        PV.state.photoMeta[p.id]={club:p.club,team:hit?.strTeam||'',source:'thesportsdb',v:12};
        PV.save?.();
        return url;
      }
    }catch{}
  }

  // Preserve a previously trusted resolver as a last resort, but never keep stale cached art.
  try{
    const fallback=await oldPhotoFor?.(p);
    if(fallback){PV.state.photos[p.id]=fallback;PV.state.photoMeta[p.id]={club:p.club,source:'legacy-verified',v:12};PV.save?.();return fallback;}
  }catch{}
  return null;
};

const oldClubLogoFor=PV.clubLogoFor;
PV.clubLogoSync=club=>TRUSTED_CLUB_LOGOS[club]||PV.state.clubLogos?.[club]||null;
PV.clubLogoFor=async club=>{
  if(!club)return null;
  PV.state.clubLogos=PV.state.clubLogos||{};
  if(TRUSTED_CLUB_LOGOS[club])return TRUSTED_CLUB_LOGOS[club];
  if(PV.state.clubLogos[club])return PV.state.clubLogos[club];
  for(const q of [club,...(CLUB_ALIASES[club]||[])]){
    try{
      const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(q)}`);
      if(!r.ok)continue;
      const j=await r.json();
      const candidates=(j?.teams||[]).filter(t=>String(t.strSport||'').toLowerCase()==='soccer');
      const hit=candidates.find(t=>teamMatches(t.strTeam,club)||teamMatches(t.strTeamAlternate,club));
      const url=hit?.strBadge||hit?.strLogo||null;
      if(url){PV.state.clubLogos[club]=url;PV.save?.();return url;}
    }catch{}
  }
  try{return await oldClubLogoFor?.(club)||null}catch{return null}
};

const oldLeagueLogoFor=PV.leagueLogoFor;
PV.leagueLogoFor=async league=>{
  if(!league)return null;
  PV.state.leagueLogos=PV.state.leagueLogos||{};
  if(TRUSTED_LEAGUE_LOGOS[league])return TRUSTED_LEAGUE_LOGOS[league];
  if(PV.state.leagueLogos[league])return PV.state.leagueLogos[league];
  try{return await oldLeagueLogoFor?.(league)||null}catch{return null}
};

const oldHydrate=PV.hydrate;
PV.hydrate=root=>{
  oldHydrate?.(root);
  const scope=root||document;

  const clubNodes=[...scope.querySelectorAll('[data-club-badge]')];
  [...new Set(clubNodes.map(n=>n.dataset.clubBadge).filter(Boolean))].slice(0,48).forEach(async club=>{
    const url=await PV.clubLogoFor(club);if(!url)return;
    document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>{
      n.innerHTML=`${img(url,club,'pv12-badge-img')}<b>${esc(PV.clubAbbr?.(club)||club.slice(0,3).toUpperCase())}</b>`;
      const im=n.querySelector('img');if(im)im.onerror=()=>im.remove();
    });
  });

  const leagueNodes=[...scope.querySelectorAll('[data-league-badge]')];
  [...new Set(leagueNodes.map(n=>n.dataset.leagueBadge).filter(Boolean))].slice(0,32).forEach(async league=>{
    const url=await PV.leagueLogoFor(league);if(!url)return;
    document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>{
      n.innerHTML=`${img(url,league,'pv12-badge-img')}<b>${esc(String(league).split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())}</b>`;
      const im=n.querySelector('img');if(im)im.onerror=()=>im.remove();
    });
  });

  const ids=[...new Set([...scope.querySelectorAll('[data-photo]')].map(n=>n.dataset.photo).filter(Boolean))].slice(0,48);
  ids.forEach(async id=>{
    const p=PV.byId(id);if(!p)return;
    const url=await PV.photoFor(p);if(!url)return;
    document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>{
      n.innerHTML=`${img(url,p.name,'pv12-player-img')}${silhouette()}`;
      const im=n.querySelector('img');if(im)im.onerror=()=>im.remove();
    });
  });
};

window.PV12_ASSETS={TRUSTED_PLAYER_PHOTOS,TRUSTED_CLUB_LOGOS,TRUSTED_LEAGUE_LOGOS};
})();