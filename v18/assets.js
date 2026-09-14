(function(){
'use strict';
const PV=window.PV4,D=PV?.D;if(!PV||!D)return;

// V0.18: deterministic current Spanish club identity. These are pinned only where the
// football-data crest payload/current 2026 fixture feed was verified. Explicit URL entries
// let us support the provider's non-numeric Andorra asset without inventing an ID.
const CLUB_ASSETS_V18={
  'CE Sabadell FC':'https://crests.football-data.org/8921.png',
  'Racing Santander':'https://crests.football-data.org/5335.png',
  'R. Oviedo':'https://crests.football-data.org/1048.png',
  'R. Valladolid CF':'https://crests.football-data.org/250.png',
  'Burgos CF':'https://crests.football-data.org/9298.png',
  'AD Ceuta FC':'https://crests.football-data.org/7445.png',
  'Real Sociedad B':'https://crests.football-data.org/9381.png',
  'Granada CF':'https://crests.football-data.org/83.png',
  'Albacete BP':'https://crests.football-data.org/237.png',
  'RCD Mallorca':'https://crests.football-data.org/89.png',
  'CD Tenerife':'https://crests.football-data.org/254.png',
  'CD Eldense':'https://crests.football-data.org/9677.png',
  'SD Eibar':'https://crests.football-data.org/278.png',
  'UD Las Palmas':'https://crests.football-data.org/275.png',
  'Girona FC':'https://crests.football-data.org/298.png',
  'Athletic Club':'https://crests.football-data.org/77.png',
  'Espanyol':'https://crests.football-data.org/80.png',
  'Rayo Vallecano':'https://crests.football-data.org/87.png',
  'Real Sociedad':'https://crests.football-data.org/92.png',
  'CD Leganés':'https://crests.football-data.org/745.png',
  'FC Andorra':'https://crests.football-data.org/andorra.svg'
};

PV.state.clubLogos=PV.state.clubLogos||{};
Object.entries(CLUB_ASSETS_V18).forEach(([club,url])=>PV.state.clubLogos[club]=url);
const oldSync=PV.clubLogoSync,oldFor=PV.clubLogoFor;
PV.clubLogoSync=club=>CLUB_ASSETS_V18[club]||oldSync?.(club)||PV.state.clubLogos?.[club]||null;
PV.clubLogoFor=async club=>CLUB_ASSETS_V18[club]||await oldFor?.(club)||null;

PV.assetCoverage18=()=>{
  const base=D.PLAYERS.filter(p=>!p.special),clubs=[...new Set(base.map(p=>p.club).filter(Boolean))];
  const deterministic=clubs.filter(c=>/^https:\/\/crests\.football-data\.org\//.test(PV.clubLogoSync?.(c)||PV.state.clubLogos?.[c]||''));
  const spanish=clubs.filter(c=>base.some(p=>p.club===c&&['LaLiga EA Sports','LALIGA EA SPORTS','LALIGA HYPERMOTION'].includes(p.league)));
  const deterministicSpanish=spanish.filter(c=>deterministic.includes(c));
  return{version:18,totalClubs:clubs.length,deterministicClubs:deterministic.length,deterministicPct:clubs.length?Math.round(deterministic.length/clubs.length*1000)/10:0,spanishClubs:spanish.length,deterministicSpanish:deterministicSpanish.length,spanishPct:spanish.length?Math.round(deterministicSpanish.length/spanish.length*1000)/10:0,remainingSpanish:spanish.filter(c=>!deterministicSpanish.includes(c)),policy:'verified deterministic crest URL or quiet fallback; never guessed identity'};
};
window.PV18_IDENTITY_AUDIT={version:18,spanishDeterministicAssets:CLUB_ASSETS_V18,coverage:PV.assetCoverage18};
PV.save?.();
})();