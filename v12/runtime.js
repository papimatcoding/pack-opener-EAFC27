(function(){
'use strict';
const PV=window.PV4;
const DEF=[{name:'OCTAVOS',rating:76,chem:58},{name:'CUARTOS',rating:79,chem:68},{name:'SEMIFINAL',rating:82,chem:80},{name:'FINAL',rating:85,chem:90}],clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
// Opponents are deterministic from the draft metrics + round. What the player sees is what gets simulated.
PV.v12DraftOpponent=(round,m)=>{const d=DEF[round]||DEF.at(-1),seed=((m.rating||0)*17+(m.chemistry||0)*11+round*29)%19-9,rating=clamp(72,92,Math.round(d.rating+(m.rating-82)*.14+seed*.11)),chemistry=clamp(45,100,Math.round(d.chem+(m.chemistry-75)*.10-seed*.17));return{name:d.name,rating,chemistry,total:rating+chemistry,power:rating+chemistry*.18}};
PV.v12DraftOpponentCurve=m=>DEF.map((_,i)=>PV.v12DraftOpponent(i,m));

// Starter SBCs must form a real free-play ladder instead of asking for a difficult XI before the player owns enough cards.
const bronze=PV.SBC_MANUAL?.find(x=>x.id==='bronze-links');
if(bronze){bronze.name='Primer XI de bronce';bronze.desc='Un DCP sencillo para convertir duplicados del Sobre Básico en platas.';bronze.reward='silver5';bronze.req={rating:60,chem:10,tier:'bronze',nations:2}}
const silver=PV.SBC_MANUAL?.find(x=>x.id==='silver-squad');
if(silver){silver.name='Ascenso de plata';silver.desc='Recicla un XI de platas repetidas para empezar a generar oro.';silver.reward='gold3';silver.req={rating:67,chem:18,tier:'silver',leagues:2}}

window.PV12_RUNTIME={draftOpponentStable:true,rounds:DEF.map(x=>x.name),starterSbcBalanced:true};
})();