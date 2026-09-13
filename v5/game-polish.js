(function(){
'use strict';
const PV=window.PV4,D=PV.D,$=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
function resultScreen(pack,pulls){const o=$('#overlay');o.className='overlay';o.innerHTML=`<div class="results"><div class="results-head"><div><span class="eyebrow">${PV.esc(pack.name)}</span><h2>Contenido</h2></div><span class="chip">${pulls.length} ITEMS</span></div><div class="result-grid">${pulls.map(p=>PV.card(p,{mini:true,count:PV.state.collection[p.id],button:false})).join('')}</div><div class="results-actions"><button class="btn-ghost" data-close-results>AL CLUB</button><button class="btn" data-again="${pack.id}">OTRO PACK</button></div></div>`;PV.hydrate(o)}
function stageMarkup(){return `<div class="cinema-bg"></div><div class="gate gate-l"></div><div class="gate gate-r"></div><div class="beam beam-l"></div><div class="beam beam-r"></div><div class="floor-ring"></div><div id="cinemaReveal" class="cinema-reveal"></div><div class="skip-clean">TOCA PARA ACELERAR</div>`}
async function revealWalkout(pack,pulls){
 const best=pulls[0],special=!!best.special,elite=best.ovr>=90,high=best.ovr>=87,o=$('#overlay');o.className=`opening cinematic ${special?'totw':''} ${elite?'elite':''}`;o.innerHTML=stageMarkup();const r=$('#cinemaReveal');let fast=false,start=Date.now();o.onclick=e=>{if(e.target.closest('[data-close-results],[data-again]'))return;if(Date.now()-start>1700)fast=true};
 const scale=special?1.15:elite?1.12:high?1.0:.88,wait=ms=>sleep(fast?Math.min(95,ms):Math.round(ms*scale));
 r.innerHTML='<div class="reveal-mark"></div>';await wait(520);
 r.innerHTML=`<div class="reveal-token flag-token">${PV.flag(best.nation)}</div>`;await wait(700);
 r.innerHTML=`<div class="reveal-token text-token">${best.pos}</div>`;await wait(650);
 r.innerHTML=`<div class="reveal-token club-token">${PV.clubAbbr(best.club)}</div>`;await wait(700);
 const floor=Math.max(82,best.ovr-(elite?7:5));
 for(let n=floor;n<=best.ovr;n++){r.innerHTML=`<div class="rating-step">${n}</div>`;await wait(n===best.ovr?470:145)}
 if(special){r.innerHTML=`<div class="if-stamp"><span>IF</span><small>TEAM OF THE WEEK</small></div>`;await wait(650)}
 r.innerHTML=`<div class="walkout-card">${PV.card(best)}</div>`;PV.hydrate(r);try{navigator.vibrate?.(special?[45,30,70]:[35,25,45])}catch{}await wait(1050);resultScreen(pack,pulls)
}
PV.openPack=async id=>{
 const pack=D.PACKS_V4.find(p=>p.id===id);if(!pack)return;const a=PV.packAccess(pack);if(!a.ok)return PV.toast(a.label==='MAÑANA'?'El Daily vuelve mañana':pack.tokenOnly?'Se consigue como recompensa':'No tienes coins suficientes');
 PV.consumePack(pack);const pulls=PV.makePack(pack);pulls.forEach(PV.addPlayer);PV.state.xp+=Math.max(0,pulls[0].ovr-80)*5;PV.save();
 const best=pulls[0];if(best.special||best.ovr>=85)await revealWalkout(pack,pulls);else{const o=$('#overlay');o.className='overlay';o.innerHTML='<div class="pack-flash"></div>';await sleep(140);resultScreen(pack,pulls)}
};
})();
