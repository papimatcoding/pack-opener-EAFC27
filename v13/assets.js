(function(){
'use strict';
const PV=window.PV4;
const CLUB_IDS={
  'Real Madrid':86,'FC Barcelona':81,'Atlético de Madrid':78,'Arsenal':57,'Manchester City':65,'Manchester United':66,'Liverpool':64,'Chelsea':61,'Tottenham':73,'Newcastle':67,
  'Bayern München':5,'FC Bayern München':5,'Borussia Dortmund':4,'RB Leipzig':721,'Eintracht Frankfurt':19,
  'Inter':108,'AC Milan':98,'Napoli':113,'Roma':100,'PSG':524
};
const LEAGUE_CODES={'Premier League':'PL','LaLiga EA Sports':'PD','LALIGA EA SPORTS':'PD','Bundesliga':'BL1','Serie A':'SA','Ligue 1':'FL1','Liga Portugal':'PPL'};
const crest=id=>`https://crests.football-data.org/${id}.png`;
const emblem=code=>`https://crests.football-data.org/${code}.png`;
const oldClubSync=PV.clubLogoSync,oldClubFor=PV.clubLogoFor,oldLeagueFor=PV.leagueLogoFor;
PV.state.clubLogos=PV.state.clubLogos||{};PV.state.leagueLogos=PV.state.leagueLogos||{};
Object.entries(CLUB_IDS).forEach(([name,id])=>PV.state.clubLogos[name]=crest(id));
Object.entries(LEAGUE_CODES).forEach(([name,code])=>PV.state.leagueLogos[name]=emblem(code));
PV.clubLogoSync=club=>CLUB_IDS[club]?crest(CLUB_IDS[club]):oldClubSync?.(club)||PV.state.clubLogos[club]||null;
PV.clubLogoFor=async club=>CLUB_IDS[club]?crest(CLUB_IDS[club]):oldClubFor?.(club)||null;
PV.leagueLogoFor=async league=>LEAGUE_CODES[league]?emblem(LEAGUE_CODES[league]):oldLeagueFor?.(league)||null;
// Never leave an empty identity slot: remote CDN/API images degrade to a deterministic text badge.
if(!window.__PV13_IDENTITY_ERROR_FALLBACK__){
  window.__PV13_IDENTITY_ERROR_FALLBACK__=true;
  document.addEventListener('error',e=>{
    const img=e.target;if(!(img instanceof HTMLImageElement))return;
    const host=img.closest?.('[data-club-badge],[data-league-badge]');if(!host)return;
    const club=host.dataset.clubBadge,league=host.dataset.leagueBadge,label=club?PV.clubAbbr(club):String(league||'L').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
    host.innerHTML=`<b>${PV.esc(label)}</b>`;
  },true);
}
PV.save?.();
window.PV13_IDENTITY_AUDIT={pinnedClubs:Object.keys(CLUB_IDS).length,pinnedLeagues:Object.keys(LEAGUE_CODES).length,source:'football-data.org crest CDN + existing verified assets',errorFallback:true};
})();