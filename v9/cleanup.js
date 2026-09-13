(function(){
'use strict';
const D=window.PACKVERSE_DATA;
// Early prototypes shipped fictional low-rated academy cards. Base packs now use real launch players only.
const keep=D.PLAYERS.filter(p=>p.special||!p.simulated||p.ovr>=75);
D.PLAYERS.splice(0,D.PLAYERS.length,...keep);
D.TOTW=D.PLAYERS.filter(p=>p.special);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();
})();