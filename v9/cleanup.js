(function(){
'use strict';
const D=window.PACKVERSE_DATA;
// Early prototypes shipped fictional low-rated academy cards. Base packs now use real launch players only.
const keep=D.PLAYERS.filter(p=>p.special||!p.simulated||p.ovr>=75);
D.PLAYERS.splice(0,D.PLAYERS.length,...keep);
// Rarity is not the same thing as OVR. Keep a healthier common/premium spread for low base cards.
for(const p of D.PLAYERS){
  if(p.special)continue;
  if(p.ovr<65){
    p.tier='bronze';
    p.rare=p.pac>=80||p.ovr>=64;
    p.cardType=`bronze-${p.rare?'rare':'common'}`;
    p.rarityLabel=`Bronce ${p.rare?'premium':'común'}`;
  } else if(p.ovr<75){
    p.tier='silver';
    p.rare=p.pac>=78||p.ovr>=70;
    p.cardType=`silver-${p.rare?'rare':'common'}`;
    p.rarityLabel=`Plata ${p.rare?'premium':'común'}`;
  }
}
D.TOTW=D.PLAYERS.filter(p=>p.special);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();
})();