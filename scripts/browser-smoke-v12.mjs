import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn,execFileSync} from 'node:child_process';

const ROOT=process.cwd(),PORT=4173,CDP_PORT=9222,OUT=path.join(ROOT,'.smoke-artifacts');
fs.mkdirSync(OUT,{recursive:true});
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{let u=decodeURIComponent(new URL(req.url,`http://127.0.0.1:${PORT}`).pathname);if(u==='/')u='/index.html';const file=path.resolve(ROOT,'.'+u);if(!file.startsWith(ROOT)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('not found')}res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');fs.createReadStream(file).pipe(res)}catch(e){res.writeHead(500);res.end(String(e))}});
await new Promise(r=>server.listen(PORT,'127.0.0.1',r));

const chrome=process.env.CHROME_BIN||['google-chrome','google-chrome-stable','chromium','chromium-browser'].find(x=>{try{execFileSync('which',[x],{stdio:'ignore'});return true}catch{return false}});
if(!chrome)throw new Error('Chromium/Chrome not found on runner');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'pv12-chrome-'));
const proc=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',`--remote-debugging-port=${CDP_PORT}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:['ignore','pipe','pipe']});
let chromeErr='';proc.stderr.on('data',d=>chromeErr+=d.toString());
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function poll(url,tries=80){for(let i=0;i<tries;i++){try{const r=await fetch(url);if(r.ok)return await r.json()}catch{}await delay(100)}throw new Error(`CDP did not start: ${chromeErr.slice(-1000)}`)}
await poll(`http://127.0.0.1:${CDP_PORT}/json/version`);
const target=await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?${encodeURIComponent(`http://127.0.0.1:${PORT}/`)}`,{method:'PUT'}).then(r=>r.json());
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});
let seq=0;const waits=new Map(),exceptions=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&waits.has(m.id)){const {r,j}=waits.get(m.id);waits.delete(m.id);m.error?j(new Error(JSON.stringify(m.error))):r(m.result)}if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception')};
const send=(method,params={})=>new Promise((r,j)=>{const id=++seq;waits.set(id,{r,j});ws.send(JSON.stringify({id,method,params}))});
await send('Page.enable');await send('Runtime.enable');
const evalJS=async expression=>{const x=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(x.exceptionDetails)throw new Error(`Browser eval failed: ${x.exceptionDetails.text}`);return x.result?.value};
async function viewport(width,height,mobile){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile,screenWidth:width,screenHeight:height});await send('Page.reload',{ignoreCache:true});await delay(900);for(let i=0;i<30;i++){if(await evalJS('document.readyState'))break;await delay(100)}}
async function shot(name){const x=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});fs.writeFileSync(path.join(OUT,name),Buffer.from(x.data,'base64'))}
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const seed=`(()=>{const PV=window.PV4,D=PV.D;PV.state.collection={};PV.state.photos={};PV.state.photoMissesV12={};const cards=[D.PLAYERS.find(p=>p.tier==='bronze'),D.PLAYERS.find(p=>!p.special&&p.ovr>=84),D.PLAYERS.find(p=>p.special),D.PLAYERS.find(p=>p.cardType==='gold-rare'),D.PLAYERS.find(p=>p.cardType==='silver-rare')].filter(Boolean);cards.forEach((p,i)=>PV.addPlayer(p,i===0?2:1));PV.save();PV.nav('club');return cards.map(p=>({id:p.id,name:p.name,ovr:p.ovr,special:p.special,cardType:p.cardType}))})()`;
const layoutAudit=`(()=>{const cards=[...document.querySelectorAll('.pv7-card')],c=cards[0];if(!c)return{cards:0};const R=s=>{const e=c.querySelector(s),r=e?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}:null},photo=R('.pv7-photo'),name=R('.pv7-name'),stats=R('.pv7-stats'),ids=R('.pv7-idrow'),screen=document.querySelector('.screen'),shell=document.querySelector('.app-shell');return{cards:cards.length,photo,name,stats,ids,photoNameGap:name&&photo?name.top-photo.bottom:null,nameStatsGap:stats&&name?stats.top-name.bottom:null,statsIdGap:ids&&stats?ids.top-stats.bottom:null,screen:{clientWidth:screen?.clientWidth,scrollWidth:screen?.scrollWidth,clientHeight:screen?.clientHeight,scrollHeight:screen?.scrollHeight},shell:{width:shell?.getBoundingClientRect().width,height:shell?.getBoundingClientRect().height},navWidth:document.querySelector('.bottom-nav')?.getBoundingClientRect().width}})()`;

// Mobile club.
await viewport(390,844,true);const seeded=await evalJS(seed);assert(seeded.length>=4,'could not seed representative cards');await delay(250);let audit=await evalJS(layoutAudit);assert(audit.cards>=4,'mobile Club did not render cards');assert(audit.photoNameGap>=0,`mobile player art overlaps name: ${audit.photoNameGap}`);assert(audit.nameStatsGap>=0,`mobile name overlaps stats: ${audit.nameStatsGap}`);assert(audit.statsIdGap>=0,`mobile stats overlap identity row: ${audit.statsIdGap}`);assert(audit.screen.scrollWidth<=audit.screen.clientWidth+2,`mobile horizontal overflow ${audit.screen.scrollWidth}/${audit.screen.clientWidth}`);await shot('mobile-club.png');
let specialCount=await evalJS(`(()=>{const PV=window.PV4;PV.ui.club12.mode='special';PV.render();return document.querySelectorAll('.pv12-club-grid .pv7-card').length})()`);assert(specialCount>=1,'real browser Special filter empty');let highCount=await evalJS(`(()=>{const PV=window.PV4;PV.ui.club12.mode='84';PV.render();return document.querySelectorAll('.pv12-club-grid .pv7-card').length})()`);assert(highCount>=1,'real browser 84+ filter empty');

// Mobile Draft full field using real field-card skin.
const draftAudit=await evalJS(`(()=>{const PV=window.PV4,D=PV.D;PV.nav('draft');PV.startDraft();const d=PV.state.draft;d.formation='4-3-3';d.stage='picks';d.picks={};const used=new Set();for(const s of PV.FORMATIONS['4-3-3']){const p=D.PLAYERS.find(p=>p.ovr>=75&&PV.canPlay(p,s.label)&&!used.has(p.identity));if(p){d.picks[s.id]=p.id;used.add(p.identity)}}d.stage=Object.keys(d.picks).length===11?'ready':'picks';PV.save();PV.render();const field=document.querySelector('.pv12-draft-pitch'),cards=[...document.querySelectorAll('.pv12-draft-slot .pv8-field-card')];return{count:cards.length,fieldHeight:field?.getBoundingClientRect().height,overflow:field?field.scrollHeight-field.clientHeight:999,skins:[...new Set(cards.map(x=>[...x.classList].find(c=>c.startsWith('card-'))))]}})()`);assert(draftAudit.count===11,`Draft browser field has ${draftAudit.count}/11 cards`);assert(draftAudit.skins.every(Boolean),'Draft field lost rarity skin');assert(draftAudit.overflow<=2,'Draft field vertically overflows');await shot('mobile-draft.png');

// Desktop Companion.
await viewport(1440,900,false);await evalJS(seed);await delay(250);audit=await evalJS(layoutAudit);assert(audit.cards>=4,'desktop Club did not render cards');assert(audit.photoNameGap>=0,`desktop player art overlaps name: ${audit.photoNameGap}`);assert(audit.nameStatsGap>=0,`desktop name overlaps stats: ${audit.nameStatsGap}`);assert(audit.statsIdGap>=0,`desktop stats overlap identity row: ${audit.statsIdGap}`);assert(audit.shell.width>1000,`desktop shell is still phone width: ${audit.shell.width}`);assert(audit.screen.scrollWidth<=audit.screen.clientWidth+2,`desktop horizontal overflow ${audit.screen.scrollWidth}/${audit.screen.clientWidth}`);assert(audit.navWidth<140,'desktop navigation did not become sidebar');await shot('desktop-club.png');

assert(exceptions.length===0,`browser runtime exceptions: ${exceptions.join(' | ')}`);
const report={chrome,seeded,audit,draftAudit,specialCount,highCount,exceptions};fs.writeFileSync(path.join(OUT,'browser-report.json'),JSON.stringify(report,null,2));
console.log(`PackVerse v0.12 Chromium smoke OK · mobile + desktop · ${draftAudit.count}/11 Draft cards · gaps ${audit.photoNameGap.toFixed(1)}/${audit.nameStatsGap.toFixed(1)}/${audit.statsIdGap.toFixed(1)}px`);
ws.close();proc.kill('SIGTERM');server.close();
