import fs from 'node:fs';
import './smoke-v12.mjs';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const files=['v13/cards.css','v13/assets.js','v13/card-ui.js'];
for(const f of files){assert(fs.existsSync(f),`missing ${f}`);if(f.endsWith('.js'))new Function(fs.readFileSync(f,'utf8'))}
const index=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('v13/cards.css','utf8'),ui=fs.readFileSync('v13/card-ui.js','utf8'),assets=fs.readFileSync('v13/assets.js','utf8');
for(const f of ['v13/cards.css','v13/assets.js','v13/card-ui.js'])assert(index.includes(f),`${f} is not loaded by index.html`);
for(const t of ['bronze-common','bronze-rare','silver-common','silver-rare','gold-common','gold-rare','totw'])assert(css.includes(`card-${t}`),`v13 has no explicit material for ${t}`);
assert(css.includes('grid-template-columns:repeat(6,minmax(0,1fr))'),'v13 stats are not the FC-style six-column row');
assert(css.includes('pv12-art-cutout')&&css.includes('pv12-art-official'),'v13 does not normalize both art source types');
assert(css.includes('@media(max-width:520px)')&&css.includes('repeat(2,minmax(0,1fr))'),'mobile Club no longer guarantees two readable cards per row');
assert(ui.includes('PV.card=')&&ui.includes('PV.fieldCard='),'canonical full/field renderers missing');
assert(ui.includes("contexts:['pack','club','picker','sbc','draft','xi']"),'renderer context audit incomplete');
assert(assets.includes("'PSG':524")&&assets.includes("'Real Madrid':86")&&assets.includes("'Premier League':'PL'"),'deterministic core identity registry missing');
const sw=fs.readFileSync('sw.js','utf8');for(const f of files)assert(sw.includes(`./${f}`),`service worker does not cache ${f}`);
console.log('PackVerse v0.13 card audit OK · 7/7 rarity materials · full + field renderer · mobile density · deterministic core identity assets');
