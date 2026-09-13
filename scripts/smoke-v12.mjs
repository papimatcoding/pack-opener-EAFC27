import fs from 'node:fs';
import vm from 'node:vm';

const ORDER=[
  'js/data.js','v4/content.js','v4/core.js','v5/rules.js','v6/content.js','v7/content.js','v8/content.js','v9/content.js','v9/cleanup.js','v8/rules.js','v12/content.js',
  'v4/ui.js','v5/card-ui.js','v6/card-ui.js','v7/card-ui.js','v8/assets.js','v9/assets.js','v10/assets.js','v11/assets.js','v12/assets.js','v8/card-ui.js','v9/card-ui.js',
  'v4/game.js','v5/game-polish.js','v6/game.js','v6/systems.js','v8/systems.js','v6/cleanup.js','v12/game.js','v12/runtime.js'
];
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
for(const f of ORDER){assert(fs.existsSync(f),`missing runtime file ${f}`);new Function(fs.readFileSync(f,'utf8'))}

let seed=0x27fc2026;
const seeded=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const math=Object.create(Math);math.random=seeded;
const store={};
const classList={add(){},remove(){},toggle(){},contains(){return false}};
const node=()=>({innerHTML:'',className:'',style:{},dataset:{},classList,querySelector(){return null},querySelectorAll(){return[]},closest(){return null},after(){},append(){},appendChild(){},remove(){},setAttribute(){},addEventListener(){},focus(){},setSelectionRange(){}});
const document={querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},dispatchEvent(){},createElement(){return node()}};
class IO{observe(){}unobserve(){}disconnect(){}}
const ctx={window:{},document,localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v)},CustomEvent:function(){},IntersectionObserver:IO,Intl,structuredClone,console,setTimeout,clearTimeout,Math:math,CSS:{escape:s=>String(s)},navigator:{vibrate(){}},location:{protocol:'https:'},fetch:async()=>({ok:true,json:async()=>({player:[],teams:[],countries:[]})})};
ctx.window.window=ctx.window;ctx.window.document=document;ctx.window.IntersectionObserver=IO;
vm.createContext(ctx);
for(const f of ORDER)vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const D=ctx.window.PACKVERSE_DATA,PV=ctx.window.PV4;

console.log('— Dataset / card smoke');
assert(D.PLAYERS.length>=235,`expected expanded pool >=235, got ${D.PLAYERS.length}`);
assert(new Set(D.PLAYERS.map(p=>p.id)).size===D.PLAYERS.length,'duplicate card IDs');
assert(D.PLAYERS.every(p=>p.name&&p.club&&p.league&&p.cardType),'incomplete card metadata');
assert(D.PLAYERS.every(p=>['bronze','silver','gold','special'].includes(p.tier)),'unknown card tier');
const malesOnly=['Alexia Putellas','Aitana Bonmatí','Khadija Shaw','Caroline Graham Hansen'];for(const n of malesOnly)assert(!D.PLAYERS.some(p=>p.name===n),`female card active in male-only pool: ${n}`);
const bronze=D.PLAYERS.filter(p=>!p.special&&p.tier==='bronze');
assert(bronze.length>=35,`bronze pool still too small: ${bronze.length}`);
for(const pos of ['POR','DFC','LI','LD','MC','MCD','DC'])assert(bronze.some(p=>p.pos===pos||p.alt?.includes(pos)),`bronze pool missing SBC position ${pos}`);
const cardTypes=new Set(D.PLAYERS.map(p=>p.cardType));for(const t of ['bronze-common','bronze-rare','silver-common','silver-rare','gold-common','gold-rare','totw'])assert(cardTypes.has(t),`missing visual card type ${t}`);
const sampleBronze=bronze[0],sampleTotw=D.PLAYERS.find(p=>p.special);assert(PV.fieldCard(sampleBronze,2).includes(`card-${sampleBronze.cardType}`),'XI/Draft field card lost bronze rarity');assert(PV.fieldCard(sampleTotw,3).includes('card-totw'),'XI/Draft field card lost TOTW rarity');

console.log('— Pack economy smoke');
const basic=D.PACKS_V4.find(p=>p.id==='basic');assert(basic&&basic.free&&basic.count===6&&basic.min<=58,'free basic pack v12 config missing');
let bronzePulls=0,totalPulls=0;
for(let i=0;i<350;i++){const pulls=PV.makePack(basic);assert(pulls.length===6,'basic pack count regression');assert(new Set(pulls.map(p=>p.id)).size===pulls.length,'same card twice inside one basic pack');assert(pulls.every(p=>!p.special&&p.ovr>=basic.min&&p.ovr<=basic.max),'basic pack contains invalid card');bronzePulls+=pulls.filter(p=>p.tier==='bronze').length;totalPulls+=pulls.length}
const bronzeRate=bronzePulls/totalPulls;assert(bronzeRate>.72&&bronzeRate<.91,`basic bronze rate out of intended range: ${(bronzeRate*100).toFixed(1)}%`);
for(const pack of D.PACKS_V4){if(pack.id==='basic')continue;for(let i=0;i<20;i++){const pulls=PV.makePack(pack);assert(pulls.length===pack.count,`${pack.id} count mismatch`);assert(new Set(pulls.map(p=>p.id)).size===pulls.length||pack.specialOnly,`${pack.id} duplicate in same pack`);if(pack.specialOnly)assert(pulls.every(p=>p.special),`${pack.id} did not return special`)}}

console.log('— Club visibility smoke');
const base84=D.PLAYERS.find(p=>!p.special&&p.ovr>=84),special=D.PLAYERS.find(p=>p.special);assert(base84&&special,'need 84+ and special fixtures');
const fixture=[{p:sampleBronze,count:2},{p:base84,count:1},{p:special,count:1}];
assert(PV.v12ClubFilter(fixture,{q:'',mode:'84',pos:'all',league:'all',sort:'ovr'}).some(x=>x.p.id===base84.id),'84+ Club tab hides an 84+ card');
assert(PV.v12ClubFilter(fixture,{q:'',mode:'special',pos:'all',league:'all',sort:'ovr'}).some(x=>x.p.id===special.id),'Special Club tab hides a special card');
assert(PV.v12ClubFilter(fixture,{q:'',mode:'all',pos:'all',league:'all',sort:'ovr'}).length===3,'Club All view loses cards');

console.log('— Squad / chemistry smoke');
assert(PV.FORMATIONS&&Object.keys(PV.FORMATIONS).length>=6,'formation pool regressed');for(const [name,slots] of Object.entries(PV.FORMATIONS))assert(slots.length===11,`${name} is not an XI`);
const slots=PV.FORMATIONS['4-3-3'],sq={};for(const slot of slots){const p=D.PLAYERS.find(p=>!p.special&&PV.canPlay(p,slot.label)&&!Object.values(sq).some(id=>PV.byId(id)?.identity===p.identity));if(p)sq[slot.id]=p.id}
const met=PV.metricsForSlots(sq,slots);assert(met.valid===11,`could not build 11-player chemistry fixture (${met.valid})`);assert(met.rating<=99&&met.chemistry<=100&&met.total<=199,'squad metrics exceed 99/100/199 limits');

console.log('— Draft Cup smoke');
const draftM={rating:84,chemistry:86,total:170};const curve=PV.v12DraftOpponentCurve(draftM);assert(curve.length===4,'Draft Cup must have four rounds');for(let i=1;i<curve.length;i++)assert(curve[i].power>curve[i-1].power,`Draft opponent does not get harder from round ${i} to ${i+1}`);
for(const o of curve){const c=PV.v12DraftWinChance(draftM,o);assert(c>=.20&&c<=.82,'Draft win chance outside safe bounds')}
const rewards=[0,1,2,3,4].map(PV.v12DraftReward);assert(rewards[0].coins===500&&rewards[4].pack==='80x5','Draft reward curve changed unexpectedly');assert(!rewards.some(r=>['totw','elite','84x3'].includes(r.pack)),'free Draft reward is too generous');
const sameA=PV.v12DraftOpponent(2,draftM),sameB=PV.v12DraftOpponent(2,draftM);assert(JSON.stringify(sameA)===JSON.stringify(sameB),'displayed Draft opponent differs from simulated opponent');

console.log('— SBC smoke');
assert(PV.dupeCount()===0,'fresh profile should have zero dupes');const systemSrc=fs.readFileSync('v8/systems.js','utf8');assert(systemSrc.includes('usedIdentity')&&systemSrc.includes('new Set(ids).size!==ids.length'),'SBC same-player law missing');
for(const p of bronze.slice(0,12)){PV.state.collection[p.id]=2}assert(PV.dupeCount()>=11,'could not create bronze duplicate bank');
const manual=PV.SBC_MANUAL?.find(x=>x.req?.tier==='bronze');assert(manual,'manual bronze SBC missing');

console.log('— Asset / visual smoke');
const asset=fs.readFileSync('v12/assets.js','utf8'),css=fs.readFileSync('v12/styles.css','utf8'),game=fs.readFileSync('v12/game.js','utf8');
assert(asset.includes('exactName(x.strPlayer,p)&&exactClub(x.strTeam,p.club)'),'photo matching is not strict name + current club');assert(asset.includes('strCutout')&&!asset.includes('strThumb'),'inconsistent thumbnail art fallback reintroduced');assert(asset.includes('transientError')&&asset.includes('1900'),'photo loader no longer protects against rate limits');
assert(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))')&&css.includes('grid-template-rows:repeat(3,1fr)'),'card stats are not FUT-like 2×3');assert(css.includes('object-position:center 12%'),'player portraits are not normalized to one crop');assert(css.includes('.pv12-draft-slot .pv8-field-card'),'Draft pitch is not using the real card skin');
assert(game.includes('Date.now()-started>2800')&&game.includes('await wait(1500)'),'walkout became skippable/fast again');assert(game.includes('data-club12-mode')&&game.includes('pv12-filter-chips'),'Club special/84 quick-filter UI hooks missing');

console.log(`PackVerse v0.12 AI smoke OK · ${D.PLAYERS.length} cards · ${bronze.length} bronzes · basic bronze ${(bronzeRate*100).toFixed(1)}% · ${D.TOTW.length} specials`);
