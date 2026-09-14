import fs from 'node:fs';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
for(const f of ['v18/assets.js','v17/assets.js','index.html','sw.js'])assert(fs.existsSync(f),`missing ${f}`);
const js=fs.readFileSync('v18/assets.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');new Function(js);
assert(html.includes('<script src="v18/assets.js"></script>'),'V0.18 Spanish identity layer is not loaded');
assert(sw.includes("packverse27-v18-spanish-identity")&&sw.includes('./v18/assets.js'),'V0.18 PWA cache wiring missing');
const expected={
  'CE Sabadell FC':'8921.png','Racing Santander':'5335.png','R. Oviedo':'1048.png','R. Valladolid CF':'250.png','Burgos CF':'9298.png','AD Ceuta FC':'7445.png','Real Sociedad B':'9381.png','Albacete BP':'237.png','SD Eibar':'278.png','UD Las Palmas':'275.png','Athletic Club':'77.png','Espanyol':'80.png','Rayo Vallecano':'87.png','Real Sociedad':'92.png','UD Almería':'267.png','Cádiz CF':'264.png','Sporting Gijón':'96.png'
};
for(const [club,file] of Object.entries(expected)){assert(js.includes(`'${club}':'https://crests.football-data.org/${file}'`),`verified deterministic Spanish crest missing ${club}`)}
assert(js.includes("'FC Andorra':'https://crests.football-data.org/andorra.svg'"),'FC Andorra deterministic crest missing');
assert(!js.includes("'Córdoba CF':'https://crests.football-data.org/259"),'dead Córdoba football-data asset was reintroduced');
assert(js.includes('verified and loadable deterministic crest URL or quiet fallback; never guessed identity'),'V0.18 identity policy missing');
assert(!/placeholder|best guess|guess or/i.test(js),'V0.18 deterministic registry contains guessed/placeholder identity');
console.log(`PackVerse V0.18 Spanish identity smoke OK · ${Object.keys(expected).length+1} high-priority verified/loadable Spanish mappings guarded · dead Córdoba mapping rejected`);
