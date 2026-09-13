(function(){
'use strict';
const PV=window.PV4,D=PV.D;
const esc=PV.esc;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();

/*
 * v0.11 asset policy
 * ------------------
 * 1) Current-team player photos are opt-in/verified only. A silhouette is better than an old shirt.
 * 2) Known ambiguous club badges are pinned; fallbacks must match football + club + league/country.
 * 3) League logos resolve for every live league, with official LALIGA assets pinned.
 * 4) Every flag uses the same SVG-image wrapper; no platform emoji rendering.
 */

const OFFICIAL_CLUB_LOGOS={...(window.PV10_OFFICIAL_ASSETS||{})};

// Official LALIGA pressroom assets. Horizontal marks are intentionally used; CSS reserves a wider league slot.
const OFFICIAL_LEAGUE_LOGOS={
  'LALIGA HYPERMOTION':'https://assets.laliga.com/assets/logos/LALIGA_HYPERMOTION_RGB_h_color/LALIGA_HYPERMOTION_RGB_h_color.png',
  'LaLiga EA Sports':'https://assets.laliga.com/assets/logos/LALIGA_EA_SPORTS_RGB_h_color/LALIGA_EA_SPORTS_RGB_h_color.png',
  'LALIGA EA SPORTS':'https://assets.laliga.com/assets/logos/LALIGA_EA_SPORTS_RGB_h_color/LALIGA_EA_SPORTS_RGB_h_color.png'
};

// 2026/27 CE Sabadell player portraits from the club's official history/roster domain.
const SAB='https://historia.cesabadellfc.com/public/jugadores/';
const OFFICIAL_PLAYER_PHOTOS={
  'diego fuoli':SAB+'gjugadores_1444.jpg',
  'ton ripoll':SAB+'gjugadores_4156.jpg',
  'miki codina':SAB+'gjugadores_4786.jpg',
  'arthur bonaldo':SAB+'gjugadores_4161.jpg',
  'catala':SAB+'gjugadores_4792.jpg',
  'genar fornes':SAB+'gjugadores_4401.jpg',
  'pipa':SAB+'gjugadores_4793.jpg',
  'edgar gonzalez':SAB+'gjugadores_4804.jpg',
  'urri':SAB+'gjugadores_4160.jpg',
  'lopez pinto':SAB+'gjugadores_4406.jpg',
  'quadri liameed':SAB+'gjugadores_4404.jpg',
  'pere pons':SAB+'gjugadores_4796.jpg',
  'joel priego':SAB+'gjugadores_4405.jpg',
  'yanis rahmani':SAB+'gjugadores_4795.jpg',
  'gaston valles':SAB+'gjugadores_4790.jpg',
  'xavi moreno':SAB+'gjugadores_4487.jpg',
  'nikolay obolskii':SAB+'gjugadores_4805.jpg',
  'nicholas gioacchini':SAB+'gjugadores_4809.jpg'
};

const FLAG_CODES={
  'España':'es','Francia':'fr','Portugal':'pt','Alemania':'de','Italia':'it','Inglaterra':'gb-eng','Escocia':'gb-sct','Gales':'gb-wls','Irlanda':'ie','Irlanda del Norte':'gb-nir',
  'Países Bajos':'nl','Bélgica':'be','Noruega':'no','Suecia':'se','Dinamarca':'dk','Finlandia':'fi','Islandia':'is','Suiza':'ch','Austria':'at','Polonia':'pl','Croacia':'hr','Eslovenia':'si','Serbia':'rs','Bosnia y Herzegovina':'ba','Eslovaquia':'sk','República Checa':'cz','Chequia':'cz','Hungría':'hu','Rumanía':'ro','Ucrania':'ua','Grecia':'gr','Turquía':'tr','Georgia':'ge','Rusia':'ru','Andorra':'ad',
  'Brasil':'br','Argentina':'ar','Uruguay':'uy','Colombia':'co','Ecuador':'ec','Chile':'cl','Paraguay':'py','Perú':'pe','Venezuela':'ve','México':'mx','Estados Unidos':'us','Canadá':'ca','Jamaica':'jm','Costa Rica':'cr','Panamá':'pa',
  'Marruecos':'ma','Argelia':'dz','Túnez':'tn','Egipto':'eg','Senegal':'sn','Ghana':'gh','Nigeria':'ng','Camerún':'cm','Costa de Marfil':'ci','Mali':'ml','Malí':'ml','Guinea':'gn','Gambia':'gm','Zambia':'zm','Malaui':'mw','Sudáfrica':'za',
  'Japón':'jp','Corea del Sur':'kr','Australia':'au','Nueva Zelanda':'nz','Arabia Saudí':'sa','Arabia Saudita':'sa','Irán':'ir','Israel':'il','Qatar':'qa'
};

const LEAGUE_META={
  'LALIGA HYPERMOTION':{country:'Spain',aliases:['Spanish Segunda Division','LaLiga 2','LaLiga Hypermotion','Segunda División']},
  'LaLiga EA Sports':{country:'Spain',aliases:['Spanish La Liga','La Liga','LaLiga EA Sports']},
  'LALIGA EA SPORTS':{country:'Spain',aliases:['Spanish La Liga','La Liga','LaLiga EA Sports']},
  'Premier League':{country:'England',aliases:['English Premier League','Premier League']},
  'Bundesliga':{country:'Germany',aliases:['German Bundesliga','Bundesliga']},
  'Serie A':{country:'Italy',aliases:['Italian Serie A','Serie A']},
  'Ligue 1':{country:'France',aliases:['French Ligue 1','Ligue 1']},
  'MLS':{country:'United States',aliases:['American Major League Soccer','Major League Soccer','MLS']},
  'Saudi Pro League':{country:'Saudi Arabia',aliases:['Saudi Pro League','Saudi Professional League']},
  'Süper Lig':{country:'Turkey',aliases:['Turkish Super Lig','Super Lig','Süper Lig']},
  'Scottish Premiership':{country:'Scotland',aliases:['Scottish Premier League','Scottish Premiership']},
  'Belgian Pro League':{country:'Belgium',aliases:['Belgian Pro League','Jupiler Pro League']},
  'Liga Portugal':{country:'Portugal',aliases:['Portuguese Primeira Liga','Primeira Liga','Liga Portugal']},
  'Liga Profesional':{country:'Argentina',aliases:['Argentine Primera Division','Liga Profesional Argentina','Primera Division']}
};

const CLUB_ALIASES={
  'CE Sabadell FC':['Sabadell','CE Sabadell'],
  'Bayern München':['FC Bayern Munich','Bayern Munich','FC Bayern München'],
  'FC Bayern München':['FC Bayern Munich','Bayern Munich','FC Bayern München'],
  'Inter':['Inter Milan','Internazionale','FC Internazionale Milano'],
  'PSG':['Paris Saint-Germain','Paris SG'],
  'R. Valladolid CF':['Real Valladolid','Valladolid'],
  'R. Oviedo':['Real Oviedo','Oviedo'],
  'Sporting Gijón':['Sporting Gijon','Real Sporting','Sporting de Gijón'],
  'UD Almería':['Almeria','UD Almeria'],
  'Cádiz CF':['Cadiz','Cádiz'],
  'CD Leganés':['Leganes','Leganés'],
  'RCD Mallorca':['Mallorca','RCD Mallorca'],
  'Real Sociedad B':['Real Sociedad II','Real Sociedad B'],
  'Albacete BP':['Albacete Balompie','Albacete'],
  'Córdoba CF':['Cordoba','Córdoba'],
  'AD Ceuta FC':['Ceuta','AD Ceuta'],
  'CD Castellón':['Castellon','Castellón']
};

function namesForClub(club){return [club,...(CLUB_ALIASES[club]||[])].map(norm).filter(Boolean)}
function expectedLeague(club){return D.PLAYERS.find(p=>p.club===club)?.league||null}
function leagueOK(apiLeague,want){if(!want)return true;const meta=LEAGUE_META[want],a=norm(apiLeague);if(!a)return false;const aliases=[want,...(meta?.aliases||[])].map(norm);return aliases.some(x=>a===x||a.includes(x)||x.includes(a))}
function teamNameOK(team,club){const names=[team?.strTeam,team?.strTeamAlternate].map(norm).filter(Boolean),want=namesForClub(club);return names.some(n=>want.some(w=>n===w||n.includes(w)||w.includes(n)))}

// Remove every third-party player-photo cache from older builds. Club/league badges are also revalidated.
if(PV.state.assetPolicyVersion!==11){
  PV.state.photos={};PV.state.clubLogos={};PV.state.leagueLogos={...OFFICIAL_LEAGUE_LOGOS};
  PV.state.assetPolicyVersion=11;PV.save?.();
}else{
  PV.state.leagueLogos={...(PV.state.leagueLogos||{}),...OFFICIAL_LEAGUE_LOGOS};
}

PV.flag=n=>{
  const code=FLAG_CODES[n];
  if(!code)return `<span class="pv11-flag pv11-flag-missing" title="${esc(n)}" aria-label="${esc(n)}">•</span>`;
  return `<span class="pv11-flag" title="${esc(n)}" aria-label="${esc(n)}"><img src="https://flagcdn.com/${code}.svg" alt="${esc(n)}" loading="lazy" decoding="async"></span>`;
};

// Player art is now verified-only. No name-only API fallback: old shirts are worse than silhouettes.
PV.photoFor=async p=>{
  if(!p)return null;
  const url=OFFICIAL_PLAYER_PHOTOS[norm(p.name)]||null;
  if(url){PV.state.photos[p.id]=url;PV.save?.();return url}
  delete PV.state.photos[p.id];
  return null;
};

PV.clubLogoSync=club=>OFFICIAL_CLUB_LOGOS[club]||PV.state.clubLogos?.[club]||null;
PV.clubLogoFor=async club=>{
  if(!club)return null;
  if(OFFICIAL_CLUB_LOGOS[club])return OFFICIAL_CLUB_LOGOS[club];
  PV.state.clubLogos=PV.state.clubLogos||{};
  if(PV.state.clubLogos[club])return PV.state.clubLogos[club];
  const league=expectedLeague(club),meta=LEAGUE_META[league];
  for(const q of [club,...(CLUB_ALIASES[club]||[])]){
    try{
      const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(q)}`),j=await r.json();
      const candidates=(j?.teams||[]).filter(t=>String(t.strSport||'').toLowerCase()==='soccer');
      const hit=candidates.find(t=>teamNameOK(t,club)&&leagueOK(t.strLeague,league)&&(!meta?.country||!t.strCountry||norm(t.strCountry)===norm(meta.country)));
      const url=hit?.strBadge||hit?.strLogo||null;
      if(url){PV.state.clubLogos[club]=url;PV.save?.();return url}
    }catch{}
  }
  return null;
};

PV.leagueLogoFor=async league=>{
  if(!league)return null;
  if(OFFICIAL_LEAGUE_LOGOS[league])return OFFICIAL_LEAGUE_LOGOS[league];
  PV.state.leagueLogos=PV.state.leagueLogos||{};
  if(PV.state.leagueLogos[league])return PV.state.leagueLogos[league];
  const meta=LEAGUE_META[league];
  if(!meta)return null;
  try{
    const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/search_all_leagues.php?c=${encodeURIComponent(meta.country)}&s=Soccer`),j=await r.json();
    const leagues=j?.countries||j?.leagues||[];
    const wants=[league,...meta.aliases].map(norm);
    const hit=leagues.find(l=>{
      const names=[l.strLeague,l.strLeagueAlternate].map(norm).filter(Boolean);
      return names.some(n=>wants.some(w=>n===w||n.includes(w)||w.includes(n)));
    });
    const url=hit?.strBadge||hit?.strLogo||null;
    if(url){PV.state.leagueLogos[league]=url;PV.save?.();return url}
  }catch{}
  return null;
};

// Final hydration pass: no arbitrary 3-item league cap on desktop galleries.
const oldHydrate=PV.hydrate;
PV.hydrate=root=>{
  oldHydrate?.(root);
  const scope=root||document;
  const clubNodes=[...scope.querySelectorAll('[data-club-badge]')];
  [...new Set(clubNodes.map(n=>n.dataset.clubBadge))].slice(0,30).forEach(async club=>{
    const url=await PV.clubLogoFor(club);if(!url)return;
    document.querySelectorAll(`[data-club-badge="${CSS.escape(club)}"]`).forEach(n=>n.innerHTML=`<img src="${esc(url)}" alt="${esc(club)}" loading="lazy" decoding="async">`);
  });
  const leagueNodes=[...scope.querySelectorAll('[data-league-badge]')];
  [...new Set(leagueNodes.map(n=>n.dataset.leagueBadge))].slice(0,20).forEach(async league=>{
    const url=await PV.leagueLogoFor(league);if(!url)return;
    document.querySelectorAll(`[data-league-badge="${CSS.escape(league)}"]`).forEach(n=>n.innerHTML=`<img src="${esc(url)}" alt="${esc(league)}" loading="lazy" decoding="async">`);
  });
  const photoIds=[...new Set([...scope.querySelectorAll('[data-photo]')].map(n=>n.dataset.photo))].slice(0,36);
  photoIds.forEach(async id=>{
    const p=PV.byId(id);if(!p)return;const url=await PV.photoFor(p);if(!url)return;
    document.querySelectorAll(`[data-photo="${CSS.escape(id)}"]`).forEach(n=>n.innerHTML=`<img src="${esc(url)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`);
  });
};

window.PV11_ASSETS={OFFICIAL_PLAYER_PHOTOS,OFFICIAL_LEAGUE_LOGOS,FLAG_CODES};
})();