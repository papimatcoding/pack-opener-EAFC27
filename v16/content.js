(function(){
'use strict';
const PV=window.PV4,D=PV?.D;
if(!PV||!D)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const slug=s=>norm(s).replace(/ /g,'-');
function quality(p){const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze',r=t==='gold'?(p.ovr>=82||p.pac>=90||p.price>=12000):t==='silver'?(p.ovr>=72||p.pac>=84):(p.ovr>=63||p.pac>=80);return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`};}
// Five historical TOTW records existed without a normal card, which made image reuse impossible.
// Create a real-player base version and correct the two transfers that changed after that TOTW dataset.
const SPECIAL_BASES={
  'Roberto Fernández':{club:'Espanyol',league:'LaLiga EA Sports'},
  'Yassir Zabiri':{club:'Racing Santander',league:'LaLiga EA Sports'},
  'Zian Flemming':{club:'Ipswich Town',league:'Premier League'},
  'Igor Jesus':{club:'Nottingham Forest',league:'Premier League'},
  'Leif Davis':{club:'Ipswich Town',league:'Premier League'}
};
function ensureBase(name,current){
  let base=D.PLAYERS.find(p=>!p.special&&norm(p.name)===norm(name));
  const special=D.PLAYERS.find(p=>p.special&&norm(p.name)===norm(name));
  if(!base&&special){
    const down=v=>Math.max(1,Math.min(99,(v||0)-3));
    base={...special,id:slug(name),identity:special.identity||slug(name),searchName:name,ovr:Math.max(60,special.ovr-3),pac:down(special.pac),sho:down(special.sho),pas:down(special.pas),dri:down(special.dri),def:down(special.def),phy:down(special.phy),price:Math.max(900,Math.round((special.price||5000)/2.25/100)*100),target:Math.max(700,Math.round((special.target||3500)/2.25/100)*100),special:false,simulated:false};
    Object.assign(base,quality(base));D.PLAYERS.push(base);
  }
  if(base){base.club=current.club;base.league=current.league;base.verifiedCurrentClub=true;Object.assign(base,quality(base));}
  if(special){special.club=current.club;special.league=current.league;special.verifiedCurrentClub=true;}
  return base;
}
Object.entries(SPECIAL_BASES).forEach(([name,current])=>ensureBase(name,current));
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
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league).filter(Boolean))].sort();
D.TOTW=D.PLAYERS.filter(p=>p.special);
window.PV16_CONTENT_AUDIT={version:16,specialsSyncedToBase:synced,specialsTotal:D.TOTW.length,createdBaseCards:Object.keys(SPECIAL_BASES),rule:'Every IF reuses current base identity/club/league/nation and artwork'};
})();
