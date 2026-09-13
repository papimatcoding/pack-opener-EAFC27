(function(){
'use strict';
const PV=window.PV4;
const DEF=[{name:'OCTAVOS',rating:76,chem:58},{name:'CUARTOS',rating:79,chem:68},{name:'SEMIFINAL',rating:82,chem:80},{name:'FINAL',rating:85,chem:90}],clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
// Opponents are deterministic from the draft metrics + round. What the player sees is what gets simulated.
PV.v12DraftOpponent=(round,m)=>{const d=DEF[round]||DEF.at(-1),seed=((m.rating||0)*17+(m.chemistry||0)*11+round*29)%19-9,rating=clamp(72,92,Math.round(d.rating+(m.rating-82)*.14+seed*.11)),chemistry=clamp(45,100,Math.round(d.chem+(m.chemistry-75)*.10-seed*.17));return{name:d.name,rating,chemistry,total:rating+chemistry,power:rating+chemistry*.18}};
// Keep the full 4-round curve progressive even for extreme squads.
PV.v12DraftOpponentCurve=m=>DEF.map((_,i)=>PV.v12DraftOpponent(i,m));
window.PV12_RUNTIME={draftOpponentStable:true,rounds:DEF.map(x=>x.name)};
})();