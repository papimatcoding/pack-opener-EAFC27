(function(){
'use strict';
const PV=window.PV4,D=PV.D,$=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
PV.state.freePackPoints=PV.state.freePackPoints||0;PV.state.freePackLevel=PV.state.freePackLevel||0;
PV.ui.club12=PV.ui.club12||{q:'',mode:'all',pos:'all',league:'all',sort:'ovr'};

function metricsFor(squad,slots){
  if(PV.metricsForSlots)return PV.metricsForSlots(squad,slots);
  const valid=[];for(const slot of slots){const p=PV.byId(squad?.[slot.id]);if(p&&PV.canPlay(p,slot.label)&&!valid.some(x=>x.p.identity===p.identity))valid.push({slot,p})}
  const clubs={},nations={},leagues={};valid.forEach(x=>{clubs[x.p.club]=(clubs[x.p.club]||0)+1;nations[x.p.nation]=(nations[x.p.nation]||0)+1;leagues[x.p.league]=(leagues[x.p.league]||0)+1});
  const th=(n,a,b,c)=>n>=c?3:n>=b?2:n>=a?1:0,per={};let raw=0;valid.forEach(({slot,p})=>{const c=th(clubs[p.club]||0,2,4,7),n=th(nations[p.nation]||0,2,5,8),l=th(leagues[p.league]||0,3,5,8),chem=Math.min(3,c+n+l);per[slot.id]=chem;raw+=chem});
  const rating=valid.length?Math.round(valid.reduce((s,x)=>s+x.p.ovr,0)/valid.length):0,chemistry=Math.round(raw/33*100);return{rating,chemistry,total:Math.min(199,rating+chemistry),raw,per,valid:valid.length};
}

/* ---------------- Club: explicit, regression-proof filters ---------------- */
PV.v12ClubFilter=(items,f=PV.ui.club12)=>{
  const q=String(f.q||'').trim().toLowerCase();let out=(items||PV.owned()).filter(({p})=>{
    if(q&&!`${p.name} ${p.club} ${p.league}`.toLowerCase().includes(q))return false;
    if(f.mode==='special'&&!p.special)return false;
    if(f.mode==='84'&&p.ovr<84)return false;
    if(['gold','silver','bronze'].includes(f.mode)&&p.tier!==f.mode)return false;
    if(f.pos!=='all'&&p.pos!==f.pos&&!p.alt?.includes(f.pos))return false;
    if(f.league!=='all'&&p.league!==f.league)return false;
    return true;
  });
  out.sort((a,b)=>f.sort==='name'?a.p.name.localeCompare(b.p.name):f.sort==='dupes'?b.count-a.count||b.p.ovr-a.p.ovr:f.sort==='special'?(+b.p.special)-(+a.p.special)||b.p.ovr-a.p.ovr:b.p.ovr-a.p.ovr||(+b.p.special)-(+a.p.special));return out;
};
function club12(){
  const f=PV.ui.club12,a=PV.v12ClubFilter(),owned=PV.owned(),specials=owned.filter(x=>x.p.special).length,high=owned.filter(x=>x.p.ovr>=84).length;
  const modes=[['all','TODO'],['special',`ESPECIALES ${specials}`],['84',`84+ ${high}`],['gold','ORO'],['silver','PLATA'],['bronze','BRONCE']];
  return `<div class="scroll pv12-club"><div class="pv12-club-sticky"><div class="club-tools"><label class="search">⌕<input id="club12Search" value="${PV.esc(f.q)}" placeholder="Jugador, club o liga"></label><button class="chip" data-club12-reset>RESET</button></div><div class="pv12-filter-chips">${modes.map(([k,t])=>`<button class="${f.mode===k?'active':''}" data-club12-mode="${k}">${t}</button>`).join('')}</div><div class="pv12-filter-row"><select id="club12Pos" class="select"><option value="all">Todas las posiciones</option>${['POR','DFC','LI','LD','MCD','MC','MCO','MI','MD','EI','ED','DC'].map(v=>`<option ${f.pos===v?'selected':''}>${v}</option>`).join('')}</select><select id="club12League" class="select"><option value="all">Todas las ligas</option>${D.LEAGUES.map(v=>`<option value="${PV.esc(v)}" ${f.league===v?'selected':''}>${PV.esc(v)}</option>`).join('')}</select><select id="club12Sort" class="select"><option value="ovr">Mayor GRL</option><option value="special" ${f.sort==='special'?'selected':''}>Especiales primero</option><option value="dupes" ${f.sort==='dupes'?'selected':''}>Duplicados</option><option value="name" ${f.sort==='name'?'selected':''}>Nombre</option></select></div><div class="club-summary"><span><b>${a.length}</b>mostradas</span><span><b>${PV.uniqueCount()}</b>únicas</span><span><b>${PV.dupeCount()}</b>duplicados</span><span><b>${specials}</b>especiales</span></div></div>${a.length?`<div class="card-grid pv12-club-grid">${a.map(x=>PV.card(x.p,{mini:true,count:x.count})).join('')}</div>`:'<div class="empty">No hay cartas con este filtro. Pulsa RESET para volver a ver todo el club.</div>'}</div>`;
}

/* ---------------- Pack presentation ---------------- */
function resultScreen(pack,pulls){
  const o=$('#overlay');o.className='overlay';const meter=pack.id==='basic'?`<span class="pv12-meter-mini">FREE ${PV.state.freePackPoints}/100</span>`:'';
  o.innerHTML=`<div class="results pv12-results"><div class="results-head"><div><span class="eyebrow">${PV.esc(pack.name)}</span><h2>Contenido</h2></div><div class="tags">${meter}<span class="chip">${pulls.length} ITEMS</span></div></div><div class="result-grid">${pulls.map(p=>PV.card(p,{mini:true,count:PV.state.collection[p.id],button:false})).join('')}</div><div class="results-actions"><button class="btn-ghost" data-close-results>AL CLUB</button><button class="btn" data-again="${pack.id}">OTRO PACK</button></div></div>`;PV.hydrate(o);
}
function packScene(pack){
  const o=$('#overlay');o.className=`opening pv12-pack-scene ${pack.specialOnly?'special':''}`;o.innerHTML=`<div class="pv12-stage-lines"></div><div class="pv12-pack-aura"></div><div class="pv12-pack"><span class="pv12-pack-edge"></span><b>${pack.specialOnly?'IF':'27'}</b><small>${PV.esc(pack.tag||'PACK')}</small><i></i></div>`;return o;
}
async function packAnimation(pack){const o=packScene(pack),card=o.querySelector('.pv12-pack');await sleep(380);card?.classList.add('ready');await sleep(620);card?.classList.add('open');await sleep(520);o.classList.add('burst');await sleep(280)}
function cinemaScene(best){
  const o=$('#overlay');o.className=`opening pv12-cinema ${best.special?'totw':''} ${best.ovr>=90?'elite':''}`;o.innerHTML=`<div class="pv12-cinema-bg"></div><div class="pv12-door left"></div><div class="pv12-door right"></div><div class="pv12-beam b1"></div><div class="pv12-beam b2"></div><div class="pv12-floor"></div><div id="pv12Reveal" class="pv12-reveal"></div><div class="pv12-skip">TOCA PARA ACELERAR</div>`;return o;
}
async function walkout(pack,pulls){
  const best=pulls[0],o=cinemaScene(best),r=$('#pv12Reveal'),started=Date.now();let fast=false;
  o.onclick=e=>{if(e.target.closest('[data-close-results],[data-again]'))return;if(Date.now()-started>2800)fast=true};
  const factor=best.special?1.18:best.ovr>=90?1.14:best.ovr>=87?1.07:1,wait=ms=>sleep(fast?Math.max(150,Math.min(240,ms*.22)):Math.round(ms*factor));
  const artPromise=PV.photoFor?.(best);const clubPromise=PV.clubLogoFor?.(best.club);
  r.innerHTML='<div class="pv12-pulsemark"><i></i><i></i><i></i></div>';await wait(900);
  r.innerHTML=`<div class="pv12-reveal-flag">${PV.flag(best.nation)}</div><small>${PV.esc(best.nation)}</small>`;await wait(1100);
  r.innerHTML=`<div class="pv12-reveal-pos">${best.pos}</div>`;await wait(950);
  const club=PV.clubLogoSync?.(best.club)||await clubPromise;r.innerHTML=`<div class="pv12-reveal-club">${club?`<img src="${PV.esc(club)}" alt="">`:PV.clubAbbr(best.club)}</div><small>${PV.esc(best.club)}</small>`;await wait(1150);
  const floor=Math.max(82,best.ovr-(best.ovr>=90?7:best.ovr>=87?6:4));for(let n=floor;n<=best.ovr;n++){r.innerHTML=`<div class="pv12-rating-step">${n}</div>`;await wait(n===best.ovr?720:260)}
  if(best.special){r.innerHTML='<div class="pv12-if-mark"><b>IF</b><span>TEAM OF THE WEEK</span></div>';await wait(900)}
  await artPromise;r.innerHTML=`<div class="pv12-final-card">${PV.card(best)}</div>`;PV.hydrate(r);try{navigator.vibrate?.(best.special?[50,35,80]:[35,25,45])}catch{}await wait(1500);resultScreen(pack,pulls);
}
function awardFreePackProgress(pulls){
  const pts=Math.max(5,Math.round(pulls.reduce((s,p)=>s+Math.max(1,p.ovr-57),0)*.38));PV.state.freePackPoints+=pts;let reward=null;
  while(PV.state.freePackPoints>=100){PV.state.freePackPoints-=100;PV.state.freePackLevel++;reward=PV.state.freePackLevel%3===0?'gold3':'silver5';PV.state.packTokens[reward]=(PV.state.packTokens[reward]||0)+1}
  return{pts,reward};
}
PV.openPack=async id=>{
  const pack=D.PACKS_V4.find(p=>p.id===id);if(!pack)return;const a=PV.packAccess(pack);if(!a.ok)return PV.toast(a.label==='MAÑANA'?'El Daily vuelve mañana':pack.tokenOnly?'Se consigue como recompensa':'No tienes coins suficientes');
  PV.consumePack(pack);const pulls=PV.makePack(pack);pulls.forEach(p=>PV.addPlayer(p));PV.state.xp+=Math.max(0,pulls[0].ovr-80)*5;const prog=pack.id==='basic'?awardFreePackProgress(pulls):null;PV.save();await packAnimation(pack);if(pulls[0].special||pulls[0].ovr>=85)await walkout(pack,pulls);else resultScreen(pack,pulls);if(prog?.reward)PV.toast(`Nivel de Free Packs · +1 ${D.PACKS_V4.find(p=>p.id===prog.reward)?.name}`);
};

/* ---------------- Draft Cup ---------------- */
const ROUND_DEFS=[
  {name:'OCTAVOS',rating:76,chem:58},{name:'CUARTOS',rating:79,chem:68},{name:'SEMIFINAL',rating:82,chem:80},{name:'FINAL',rating:85,chem:90}
];
const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
PV.v12DraftOpponent=(round,m,rand=Math.random)=>{const d=ROUND_DEFS[round]||ROUND_DEFS.at(-1),rating=clamp(72,92,Math.round(d.rating+(m.rating-82)*.14+(rand()-.5)*4)),chemistry=clamp(45,100,Math.round(d.chem+(m.chemistry-75)*.10+(rand()-.5)*10));return{name:d.name,rating,chemistry,total:rating+chemistry,power:rating+chemistry*.18}};
PV.v12DraftWinChance=(m,o)=>clamp(.20,.82,.50+((m.rating+m.chemistry*.18)-o.power)/28);
PV.v12DraftReward=wins=>[
  {coins:500,pack:null,label:'500 coins'},
  {coins:650,pack:'silver5',label:'650 coins + 5 Silver Players'},
  {coins:850,pack:'gold3',label:'850 coins + 3 Gold Players'},
  {coins:1100,pack:'premium',label:'1.100 coins + Premium Gold Players'},
  {coins:1600,pack:'80x5',label:'1.600 coins + 80+ x5'}
][clamp(0,4,wins)];
function draftSlots(d){return PV.FORMATIONS?.[d?.formation]||PV.FORMATIONS?.['4-3-3']||D.SLOTS}
function draftMetrics(d){return metricsFor(d?.picks||{},draftSlots(d))}
function formationChoices(){return Object.keys(PV.FORMATIONS||{}).sort(()=>Math.random()-.5).slice(0,3)}
PV.startDraft=()=>{PV.state.draft={stage:'formation',formation:null,formationChoices:formationChoices(),picks:{},started:Date.now(),history:[]};PV.save();PV.render()};
function draftPool(label,picks){const used=new Set(Object.values(picks||{}).map(id=>PV.byId(id)?.identity));return D.PLAYERS.filter(p=>p.ovr>=75&&PV.canPlay(p,label)&&!used.has(p.identity))}
function draftChoices(label,picks){
  let pool=draftPool(label,picks),out=[];const bands=[[75,82,.55],[83,86,.30],[87,89,.12],[90,99,.03]];
  for(let i=0;i<5&&pool.length;i++){
    let r=Math.random(),band=bands[0];for(const b of bands){r-=b[2];if(r<=0){band=b;break}}
    let candidates=pool.filter(p=>p.ovr>=band[0]&&p.ovr<=band[1]);if(!candidates.length)candidates=pool;
    candidates.sort((a,b)=>b.ovr-a.ovr);const idx=Math.floor(Math.pow(Math.random(),1.35)*candidates.length),p=candidates[idx];out.push(p);pool=pool.filter(x=>x.identity!==p.identity);
  }
  return out;
}
PV.openDraftPick=slotId=>{const d=PV.state.draft,slot=draftSlots(d).find(s=>s.id===slotId);if(!d||d.stage!=='picks'||!slot||d.picks[slotId])return;const a=draftChoices(slot.label,d.picks);PV.openSheet(`<span class="eyebrow">DRAFT PICK · ${slot.label}</span><h2 style="margin:4px 0 10px">Elige 1 de 5</h2><div class="draft-picks pv12-draft-picks">${a.map(p=>PV.card(p,{mini:true,button:false})).join('')}</div>`);[...$('#sheetBody').querySelectorAll('.mini-card')].forEach((c,i)=>c.onclick=()=>{d.picks[slotId]=a[i].id;if(Object.keys(d.picks).length===11)d.stage='ready';PV.save();PV.closeSheet();PV.render()})};
PV.finishDraft=()=>{const d=PV.state.draft;if(!d||Object.keys(d.picks||{}).length!==11)return;d.stage='tournament';d.round=0;d.wins=0;d.history=[];d.rewardGranted=false;PV.save();PV.render()};
function grantDraftReward(d){if(d.rewardGranted)return;const reward=PV.v12DraftReward(d.wins);PV.state.coins+=reward.coins;if(reward.pack)PV.state.packTokens[reward.pack]=(PV.state.packTokens[reward.pack]||0)+1;PV.state.draftCompletions++;PV.state.draftBest=Math.max(PV.state.draftBest||0,draftMetrics(d).total);PV.state.xp+=120+d.wins*35;d.reward=reward;d.rewardGranted=true;PV.save()}
PV.playDraftMatch=()=>{
  const d=PV.state.draft;if(!d||d.stage!=='tournament')return;const m=draftMetrics(d),opp=PV.v12DraftOpponent(d.round,m),chance=PV.v12DraftWinChance(m,opp),win=Math.random()<chance;let gf=Math.floor(Math.random()*3),ga=Math.floor(Math.random()*3),decider='';
  if(Math.random()<.14){gf=ga=1+Math.floor(Math.random()*2);decider='pen.'}if(win){if(!decider&&gf<=ga)gf=ga+1;d.wins++}else if(!decider&&ga<=gf)ga=gf+1;
  d.history.push({round:ROUND_DEFS[d.round].name,opp,win,gf,ga,decider,chance:Math.round(chance*100)});
  if(win&&d.round<ROUND_DEFS.length-1)d.round++;else{d.stage='finished';grantDraftReward(d)}PV.save();PV.render();
};
PV.resetDraft=()=>{PV.state.draft=null;PV.save();PV.render()};
function draftField(d){const slots=draftSlots(d),m=draftMetrics(d);return `<div class="pitch pv12-draft-pitch">${slots.map(s=>{const p=PV.byId(d.picks?.[s.id]),chem=m.per?.[s.id]||0;return `<button class="pv12-draft-slot ${p?'filled':'empty'}" style="left:${s.x}%;top:${s.y}%" data-draft-slot="${s.id}" ${p?'disabled':''}>${p?PV.fieldCard(p,chem):`<span>＋</span><b>${s.label}</b>`}</button>`}).join('')}</div>`}
function renderDraft12(){
  const d=PV.state.draft;if(!d)return `<div class="scroll pv12-draft"><div class="pv12-draft-hero"><span class="eyebrow">DRAFT CUP</span><h1>Construye. Compite. Cobra.</h1><p>Entrada gratis. 5 opciones por posición y un torneo de cuatro rondas con rivales progresivamente más fuertes.</p><button class="btn" data-start-draft>EMPEZAR DRAFT</button></div><div class="pv12-reward-table">${[['0 victorias','500 coins'],['1 victoria','Silver x5'],['2 victorias','Gold x3'],['3 victorias','Premium Gold'],['Campeón','80+ x5']].map(x=>`<span><b>${x[0]}</b><small>${x[1]}</small></span>`).join('')}</div></div>`;
  if(d.stage==='formation')return `<div class="scroll pv12-draft"><div class="section-head"><div><span class="eyebrow">PASO 1</span><h2>Elige formación</h2><p>La formación queda bloqueada durante este Draft.</p></div></div><div class="pv12-formations">${d.formationChoices.map(f=>`<button data-draft-formation="${f}"><b>${f}</b><small>${PV.FORMATIONS[f].map(s=>s.label).join(' · ')}</small></button>`).join('')}</div><button class="btn-ghost" data-reset-draft style="width:100%;margin-top:12px">CANCELAR</button></div>`;
  const m=draftMetrics(d);
  if(d.stage==='picks'||d.stage==='ready')return `<div class="scroll pv12-draft"><div class="draft-banner pv12-draft-banner"><div><span class="eyebrow">${d.formation}</span><h2>${d.stage==='ready'?'Plantilla lista':'Construye el XI'}</h2><p>${Object.keys(d.picks).length}/11 elecciones · toca una posición vacía.</p></div><div class="draft-score"><b>${m.total}</b><small>/199 · ${m.rating} GRL · ${m.chemistry} Q</small></div></div>${draftField(d)}${d.stage==='ready'?'<button class="btn pv12-cup-btn" data-finish-draft>JUGAR DRAFT CUP</button>':''}<button class="btn-ghost" data-reset-draft style="width:100%;margin-top:7px">ABANDONAR DRAFT</button></div>`;
  const history=d.history||[];
  if(d.stage==='tournament'){const opp=PV.v12DraftOpponent(d.round,m,()=>.5),round=ROUND_DEFS[d.round];return `<div class="scroll pv12-draft"><div class="pv12-cup-head"><div><span class="eyebrow">DRAFT CUP</span><h2>${round.name}</h2><p>${d.wins} victorias · ${m.rating} GRL · ${m.chemistry} química</p></div><b>${m.total}<small>/199</small></b></div><div class="pv12-bracket">${ROUND_DEFS.map((r,i)=>`<span class="${i<d.round?'done':i===d.round?'active':''}"><b>${r.name}</b><small>${i<d.round?'✓':i===d.round?'AHORA':'—'}</small></span>`).join('')}</div><div class="pv12-match"><div><small>TU DRAFT</small><b>${m.rating}</b><em>${m.chemistry} Q</em></div><strong>VS</strong><div><small>RIVAL EST.</small><b>${opp.rating}</b><em>${opp.chemistry} Q</em></div></div>${history.length?`<div class="pv12-history">${history.map(h=>`<span class="${h.win?'win':'loss'}"><b>${h.round}</b><em>${h.gf}-${h.ga}${h.decider?' '+h.decider:''}</em></span>`).join('')}</div>`:''}<button class="btn pv12-play-match" data-draft-play>SIMULAR PARTIDO</button></div>`}
  const reward=d.reward||PV.v12DraftReward(d.wins||0),last=history.at(-1);return `<div class="scroll pv12-draft"><div class="pv12-finish ${d.wins===4?'champ':''}"><span class="eyebrow">${d.wins===4?'CAMPEÓN':'DRAFT FINALIZADO'}</span><h1>${d.wins===4?'🏆 4/4':`${d.wins} victoria${d.wins===1?'':'s'}`}</h1><p>${last&&!last.win?`Eliminado en ${last.round}. `:''}Premio contenido: no hay jackpots absurdos por un Draft gratis.</p><div class="pv12-reward"><b>${reward.label}</b></div></div><div class="pv12-history full">${history.map(h=>`<span class="${h.win?'win':'loss'}"><b>${h.round}</b><em>${h.gf}-${h.ga}${h.decider?' '+h.decider:''}</em><small>${h.opp.rating} GRL · ${h.opp.chemistry} Q</small></span>`).join('')}</div><button class="btn" data-reset-draft style="width:100%;margin-top:12px">NUEVO DRAFT</button></div>`;
}

function decoratePacks(){const scroll=$('#screen .scroll');if(!scroll||scroll.querySelector('.pv12-free-meter'))return;const token=scroll.querySelector('.tokenbar'),meter=document.createElement('div');meter.className='pv12-free-meter';meter.innerHTML=`<span><b>FREE PACK PROGRESS</b><small>Abre sobres básicos → recicla → sube de nivel</small></span><strong>${PV.state.freePackPoints}/100</strong><i><b style="width:${PV.state.freePackPoints}%"></b></i>`;(token||scroll.firstElementChild)?.after(meter)}
function decorateHome(){const stats=$('#screen .stats');if(!stats||$('#screen .pv12-collection-progress'))return;const total=D.PLAYERS.length,own=PV.uniqueCount(),special=PV.owned().filter(x=>x.p.special).length,el=document.createElement('div');el.className='pv12-collection-progress';el.innerHTML=`<span><b>COLECCIÓN</b><small>${own}/${total} cartas · ${special} especiales</small></span><strong>${Math.round(own/Math.max(1,total)*100)}%</strong><i><b style="width:${Math.min(100,own/Math.max(1,total)*100)}%"></b></i>`;stats.after(el)}

const oldRender=PV.render;
PV.render=()=>{oldRender();if(PV.ui.screen==='club'){$('#screen').innerHTML=club12();PV.hydrate($('#screen'))}else if(PV.ui.screen==='draft'){$('#screen').innerHTML=renderDraft12();PV.hydrate($('#screen'))}else if(PV.ui.screen==='packs')decoratePacks();else if(PV.ui.screen==='home')decorateHome();document.querySelectorAll('[data-nav="academy"]').forEach(x=>x.remove())};

document.addEventListener('input',e=>{if(e.target.id!=='club12Search')return;PV.ui.club12.q=e.target.value;const pos=e.target.selectionStart;PV.render();requestAnimationFrame(()=>{const x=$('#club12Search');x?.focus();try{x?.setSelectionRange(pos,pos)}catch{}})});
document.addEventListener('change',e=>{if(e.target.id==='club12Pos')PV.ui.club12.pos=e.target.value;else if(e.target.id==='club12League')PV.ui.club12.league=e.target.value;else if(e.target.id==='club12Sort')PV.ui.club12.sort=e.target.value;else return;PV.render()});
document.addEventListener('click',e=>{
  const mode=e.target.closest('[data-club12-mode]');if(mode){PV.ui.club12.mode=mode.dataset.club12Mode;return PV.render()}
  if(e.target.closest('[data-club12-reset]')){PV.ui.club12={q:'',mode:'all',pos:'all',league:'all',sort:'ovr'};return PV.render()}
  const form=e.target.closest('[data-draft-formation]');if(form){const d=PV.state.draft;if(d?.stage==='formation'&&PV.FORMATIONS[form.dataset.draftFormation]){d.formation=form.dataset.draftFormation;d.stage='picks';d.picks={};PV.save();PV.render()}return}
  if(e.target.closest('[data-draft-play]'))return PV.playDraftMatch();
});

window.PV12_SMOKE={ROUND_DEFS,metricsFor,draftSlots,draftMetrics};
})();