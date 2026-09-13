(function(){
'use strict';
const PV=window.PV4,D=PV.D,oldMake=PV.makePack;
function weighted(pool){const ws=pool.map(p=>Math.pow(Math.max(1,96-p.ovr),2.1)),sum=ws.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<pool.length;i++){r-=ws[i];if(r<=0)return pool[i]}return pool[pool.length-1]}
PV.makePack=pack=>{if(pack.id!=='basic')return oldMake(pack);const pool=D.PLAYERS.filter(p=>!p.special&&p.ovr>=pack.min&&p.ovr<=pack.max),clubs=[...new Set(pool.map(p=>p.club))],out=[],used=new Set();for(let i=0;i<pack.count;i++){let candidates=clubs.filter(c=>!used.has(c));if(!candidates.length)candidates=clubs;const club=candidates[Math.floor(Math.random()*candidates.length)],cp=pool.filter(p=>p.club===club&&!out.some(x=>x.id===p.id)),p=weighted(cp.length?cp:pool.filter(p=>!out.some(x=>x.id===p.id)));if(p){out.push(p);used.add(p.club)}}return out.sort((a,b)=>b.ovr-a.ovr||b.price-a.price)};
})();