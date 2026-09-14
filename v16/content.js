(function(){
'use strict';
const PV=window.PV4,D=PV?.D;
if(!PV||!D)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const basePlayers=D.PLAYERS.filter(p=>!p.special);
function baseFor(p){
  if(!p?.special)return p||null;
  return basePlayers.find(b=>p.identity&&b.identity===p.identity)||basePlayers.find(b=>norm(b.name)===norm(p.name))||null;
}
let synced=0;
for(const p of D.PLAYERS.filter(x=>x.special)){
  const b=baseFor(p);if(!b)continue;
  p.baseCardId=b.id;
  p.searchName=b.searchName||b.name;
  p.club=b.club;
  p.league=b.league;
  p.nation=b.nation;
  p.verifiedCurrentClub=b.verifiedCurrentClub===true;
  synced++;
}
D.TOTW=D.PLAYERS.filter(p=>p.special);
window.PV16_CONTENT_AUDIT={version:16,specialsSyncedToBase:synced,rule:'IF shares current identity/club/league/nation and artwork with base card'};
})();
