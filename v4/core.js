(function(){
'use strict';
const D=window.PACKVERSE_DATA;
const KEY='packverse27_v4';
const DEF={coins:25000,xp:0,packsOpened:0,basicPacksOpened:0,collection:{},bestPull:null,watchlist:[],squad:{},photos:{},lastDaily:null,packTokens:{},quizStreak:0,quizBest:0,quizCorrect:0,draft:null,draftCompletions:0,draftBest:0,sbcCompletions:{},sbcCardsSubmitted:0,objectivesClaimed:{}};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}if(!raw){try{const old=JSON.parse(localStorage.getItem('packverse27_v3')||'null');if(old)raw={...old,coins:Math.min(old.coins??25000,25000)}}catch{}}return Object.assign(clone(DEF),raw||{})}
const PV=window.PV4={D,state:load()};
PV.today=()=>new Date().toISOString().slice(0,10);
PV.save=()=>{localStorage.setItem(KEY,JSON.stringify(PV.state));document.dispatchEvent(new CustomEvent('pv:state'))};
PV.byId=id=>D.PLAYERS.find(p=>p.id===id);
PV.fmt=n=>n>=1e6?(n/1e6).toFixed(n>=2e6?1:2)+'M':n>=1000?Math.round(n/1000)+'K':new Intl.NumberFormat('es-ES').format(n||0);
PV.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
PV.ini=n=>String(n).split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
PV.clubAbbr=c=>String(c||'FC').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase();
PV.flag=n=>({'Francia':'🇫🇷','Noruega':'🇳🇴','Bélgica':'🇧🇪','Inglaterra':'🏴','Italia':'🇮🇹','Eslovenia':'🇸🇮','España':'🇪🇸','Portugal':'🇵🇹','Jamaica':'🇯🇲','Brasil':'🇧🇷','Argentina':'🇦🇷','Georgia':'🇬🇪','Ecuador':'🇪🇨','Países Bajos':'🇳🇱','Marruecos':'🇲🇦','Japón':'🇯🇵','Alemania':'🇩🇪','Zambia':'🇿🇲','Malaui':'🇲🇼','Suecia':'🇸🇪','Estados Unidos':'🇺🇸','Croacia':'🇭🇷','Hungría':'🇭🇺','Turquía':'🇹🇷','Colombia':'🇨🇴','Rumanía':'🇷🇴','Gambia':'🇬🇲','Escocia':'🏴','Ghana':'🇬🇭','Senegal':'🇸🇳'}[n]||'🌐');
PV.owned=()=>Object.entries(PV.state.collection).map(([id,count])=>({p:PV.byId(id),count})).filter(x=>x.p&&x.count>0);
PV.uniqueCount=()=>PV.owned().length;
PV.dupeCount=()=>PV.owned().reduce((s,x)=>s+Math.max(0,x.count-1),0);
PV.clubValue=()=>PV.owned().reduce((s,x)=>s+x.p.price*x.count,0);
PV.best=()=>PV.byId(PV.state.bestPull);
PV.addPlayer=(p,count=1)=>{PV.state.collection[p.id]=(PV.state.collection[p.id]||0)+count;const b=PV.best();if(!b||p.ovr>b.ovr||(p.ovr===b.ovr&&p.price>b.price))PV.state.bestPull=p.id};
PV.removeOne=id=>{if(!PV.state.collection[id])return false;PV.state.collection[id]--;if(PV.state.collection[id]<=0)delete PV.state.collection[id];return true};
PV.level=()=>Math.floor(PV.state.xp/1000)+1;
PV.canPlay=(p,label)=>p&&[p.pos,...(p.alt||[])].includes(label);
PV.identityUsed=(squad,id,except)=>{const p=PV.byId(id);if(!p)return false;return Object.entries(squad||{}).some(([slot,x])=>slot!==except&&PV.byId(x)?.identity===p.identity)};
function threshold(n,a,b,c){return n>=c?3:n>=b?2:n>=a?1:0}
PV.squadMetrics=squad=>{const valid=[];for(const slot of D.SLOTS){const id=squad?.[slot.id],p=PV.byId(id);if(p&&PV.canPlay(p,slot.label)&&!valid.some(x=>x.p.identity===p.identity))valid.push({slot,p})}const clubs={},nations={},leagues={};valid.forEach(x=>{clubs[x.p.club]=(clubs[x.p.club]||0)+1;nations[x.p.nation]=(nations[x.p.nation]||0)+1;leagues[x.p.league]=(leagues[x.p.league]||0)+1});const per={};let raw=0;valid.forEach(({slot,p})=>{const c=threshold(clubs[p.club]||0,2,4,7),n=threshold(nations[p.nation]||0,2,5,8),l=threshold(leagues[p.league]||0,3,5,8),chem=Math.min(3,c+n+l);per[slot.id]=chem;raw+=chem});const rating=Math.min(99,Math.round(valid.reduce((s,x)=>s+x.p.ovr,0)/11));const chemistry=Math.min(100,Math.round(raw/33*100));return{rating,chemistry,total:Math.min(199,rating+chemistry),raw,per,valid:valid.length,clubs,nations,leagues}}
PV.photoFor=async p=>{if(PV.state.photos[p.id])return PV.state.photos[p.id];if(p.simulated&&!p.searchName)return null;try{const q=encodeURIComponent(p.searchName||p.name),r=await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${q}`),j=await r.json(),a=j?.player?.[0],url=a?.strCutout||a?.strThumb||null;if(url){PV.state.photos[p.id]=url;localStorage.setItem(KEY,JSON.stringify(PV.state));return url}}catch{}return null};
PV.cardClass=p=>`card-${p.cardType||'gold-common'}`;
function weighted(pool){const weights=pool.map(p=>{let w=Math.pow(Math.max(2,96-p.ovr),2.3);if(p.special)w*=.16;if(p.ovr>=89)w*=.2;return w}),sum=weights.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<pool.length;i++){r-=weights[i];if(r<=0)return pool[i]}return pool[pool.length-1]}
PV.makePack=pack=>{if(pack.specialOnly)return [D.TOTW[Math.floor(Math.random()*D.TOTW.length)]];const normal=D.PLAYERS.filter(p=>!p.special&&p.ovr>=pack.min&&p.ovr<=pack.max);const out=[];for(let i=0;i<pack.count;i++){let p=weighted(normal),guard=0;while(out.some(x=>x.id===p.id)&&guard++<25)p=weighted(normal);out.push(p)}if(pack.min>=75&&Math.random()<.018&&D.TOTW.length){out[0]=D.TOTW[Math.floor(Math.random()*D.TOTW.length)]}return out.sort((a,b)=>b.ovr-a.ovr||b.price-a.price)};
PV.packAccess=pack=>{const tok=PV.state.packTokens[pack.id]||0;if(tok)return{ok:true,token:true,label:`TOKEN x${tok}`};if(pack.tokenOnly)return{ok:false,label:'RECOMPENSA'};if(pack.daily&&PV.state.lastDaily===PV.today())return{ok:false,label:'MAÑANA'};if(pack.free||pack.daily)return{ok:true,label:'GRATIS'};if(PV.state.coins<pack.cost)return{ok:false,label:PV.fmt(pack.cost)+' coins'};return{ok:true,label:PV.fmt(pack.cost)+' coins'}};
PV.consumePack=pack=>{const tok=PV.state.packTokens[pack.id]||0;if(tok)PV.state.packTokens[pack.id]--;else if(pack.daily)PV.state.lastDaily=PV.today();else if(!pack.free)PV.state.coins-=pack.cost;PV.state.packsOpened++;if(pack.id==='basic')PV.state.basicPacksOpened++;PV.state.xp+=pack.id==='basic'?10:40};
PV.reward=(r,quiet=false)=>{if(!r)return;let msg='';if(r.coins){PV.state.coins+=r.coins;msg+=`+${PV.fmt(r.coins)} coins`}if(r.pack){PV.state.packTokens[r.pack]=(PV.state.packTokens[r.pack]||0)+1;msg+=(msg?' · ':'')+`+1 ${D.PACKS_V4.find(p=>p.id===r.pack)?.name||r.pack}`}if(r.player){const p=PV.byId(r.player);if(p){PV.addPlayer(p);msg+=(msg?' · ':'')+p.name}}if(r.xp)PV.state.xp+=r.xp;PV.save();if(!quiet&&msg)PV.toast?.(msg)};
PV.OBJECTIVES=[
{id:'basic10',name:'Cantera',desc:'Abre 10 sobres básicos gratis',get:()=>PV.state.basicPacksOpened,goal:10,reward:{coins:1500,xp:100}},
{id:'dupes5',name:'Banco de duplicados',desc:'Ten 5 duplicados en el club',get:()=>PV.dupeCount(),goal:5,reward:{pack:'silver5',xp:100}},
{id:'draft1',name:'Primer Draft',desc:'Completa un Draft gratuito',get:()=>PV.state.draftCompletions,goal:1,reward:{pack:'80x5',xp:150}},
{id:'draft140',name:'Draft competitivo',desc:'Consigue 140/199 o más',get:()=>PV.state.draftBest,goal:140,reward:{pack:'82x3',xp:200}},
{id:'draft160',name:'Draft monstruoso',desc:'Consigue 160/199 o más',get:()=>PV.state.draftBest,goal:160,reward:{pack:'totw',xp:300}},
{id:'sbc1',name:'Primer reciclaje',desc:'Completa 1 SBC',get:()=>Object.values(PV.state.sbcCompletions).reduce((a,b)=>a+b,0),goal:1,reward:{coins:2000,xp:100}},
{id:'sbc3',name:'Artesano',desc:'Completa 3 SBC',get:()=>Object.values(PV.state.sbcCompletions).reduce((a,b)=>a+b,0),goal:3,reward:{pack:'84x3',xp:250}},
{id:'submit20',name:'Reciclador',desc:'Entrega 20 duplicados en SBC',get:()=>PV.state.sbcCardsSubmitted,goal:20,reward:{pack:'totw',xp:300}},
{id:'chem70',name:'Conexiones',desc:'Alcanza 70 de química',get:()=>PV.squadMetrics(PV.state.squad).chemistry,goal:70,reward:{pack:'80x5',xp:200}}
];
PV.claimAll=()=>{let did=false;PV.OBJECTIVES.forEach(o=>{if(!PV.state.objectivesClaimed[o.id]&&o.get()>=o.goal){PV.state.objectivesClaimed[o.id]=1;PV.reward(o.reward,true);did=true}});PV.save();PV.toast?.(did?'Recompensas cobradas':'No hay objetivos listos')};
PV.SBCS=[
{id:'bronze',name:'Bronze Dupe Upgrade',desc:'Convierte morralla repetida en plata.',count:5,tier:'bronze',avg:0,high:0,highOvr:0,reward:'silver5'},
{id:'silver',name:'Silver Dupe Upgrade',desc:'Cinco platas duplicadas → oro.',count:5,tier:'silver',avg:0,high:0,highOvr:0,reward:'gold3'},
{id:'gold',name:'Gold Dupe Upgrade',desc:'Seis oros repetidos para un 80+ x5.',count:6,tier:'gold',avg:0,high:0,highOvr:0,reward:'80x5'},
{id:'rare',name:'Rare Gold Recycler',desc:'Ocho oros, tres premium como mínimo.',count:8,tier:'gold',avg:0,rare:3,high:0,highOvr:0,reward:'82x3'},
{id:'totwforge',name:'TOTW Lab Forge',desc:'SBC serio para cazar una especial.',count:10,tier:null,avg:83,rare:0,high:2,highOvr:85,reward:'totw'}
];
PV.dupeUnits=()=>{const a=[];PV.owned().forEach(({p,count})=>{for(let i=1;i<count;i++)a.push({p,id:p.id})});return a};
PV.solveSbc=ch=>{let pool=PV.dupeUnits().filter(x=>!ch.tier||x.p.tier===ch.tier);if(pool.length<ch.count)return null;pool.sort((a,b)=>a.p.price-b.p.price||a.p.ovr-b.p.ovr);let sel=[];if(ch.high){const hi=pool.filter(x=>x.p.ovr>=ch.highOvr).sort((a,b)=>a.p.price-b.p.price).slice(0,ch.high);if(hi.length<ch.high)return null;sel.push(...hi);hi.forEach(x=>pool.splice(pool.indexOf(x),1))}if(ch.rare){const rr=pool.filter(x=>x.p.rare).sort((a,b)=>a.p.price-b.p.price).slice(0,ch.rare);if(rr.length<ch.rare)return null;sel.push(...rr);rr.forEach(x=>pool.splice(pool.indexOf(x),1))}while(sel.length<ch.count&&pool.length)sel.push(pool.shift());const avg=()=>sel.reduce((s,x)=>s+x.p.ovr,0)/sel.length;if(ch.avg&&avg()<ch.avg){const all=PV.dupeUnits().filter(x=>!sel.includes(x)&&(!ch.tier||x.p.tier===ch.tier)).sort((a,b)=>b.p.ovr-a.p.ovr);while(avg()<ch.avg&&all.length){let low=sel.reduce((m,x,i,a)=>x.p.ovr<a[m].p.ovr?i:m,0),up=all.shift();if(up.p.ovr<=sel[low].p.ovr)break;sel[low]=up}}return sel.length===ch.count&&(!ch.avg||avg()>=ch.avg)?sel:null};
PV.submitSbc=ch=>{const sol=PV.solveSbc(ch);if(!sol)return false;sol.forEach(x=>PV.removeOne(x.id));PV.state.sbcCardsSubmitted+=sol.length;PV.state.sbcCompletions[ch.id]=(PV.state.sbcCompletions[ch.id]||0)+1;PV.state.packTokens[ch.reward]=(PV.state.packTokens[ch.reward]||0)+1;PV.state.xp+=120;PV.save();return true};
PV.draftReward=total=>total>=170?'totw':total>=155?'84x3':total>=140?'82x3':total>=125?'80x5':'premium';
})();