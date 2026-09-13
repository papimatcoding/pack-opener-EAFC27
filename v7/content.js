(function(){
'use strict';
const PV=window.PV4,D=PV.D;
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze',r=t==='gold'?(p.ovr>=82||p.pac>=90):t==='silver'?(p.ovr>=68||p.pac>=76):(p.ovr>=63||p.pac>=76);return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`}}
function upsert(name,pos,ovr,pac,sho,pas,dri,def,phy,nation,alt=[]){let p=D.PLAYERS.find(x=>x.name===name||x.identity===slug(name));const base={id:p?.id||`ces-${slug(name)}`,identity:p?.identity||`ces-${slug(name)}`,name,searchName:name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club:'CE Sabadell FC',league:'LALIGA HYPERMOTION',price:p?.price||Math.max(350,Math.round((ovr-58)*220)),target:p?.target||Math.max(300,Math.round((ovr-58)*180)),alt,simulated:false,special:false};Object.assign(base,quality(base));if(p)Object.assign(p,base);else D.PLAYERS.push(base)}
upsert('Pere Pons','MC',73,58,63,71,71,69,69,'España',['MCD']);
upsert('Nicholas Gioacchini','DC',70,81,70,57,70,29,72,'Estados Unidos',['EI','ED']);
upsert('Pipa','LD',68,78,57,63,68,64,68,'España',['MD']);
upsert('Edgar González','DFC',67,63,52,59,58,65,79,'España',['MCD']);
upsert('López-Pinto','MI',67,75,69,64,67,29,65,'España',['EI','MCO']);
upsert('Diego Fuoli','POR',67,66,66,65,67,39,64,'España',[]);
upsert('Quadri Liameed','MCD',67,76,55,58,64,63,72,'Nigeria',['MC','MCO']);
upsert('Urri','MC',67,66,59,69,69,62,63,'España',['MCD']);
upsert('Miki Codina','LI',67,75,53,59,60,64,68,'España',['DFC']);
upsert('Arthur Bonaldo','DFC',66,61,36,51,52,65,70,'Brasil',['MCD']);
upsert('Joel Priego','MD',66,75,62,60,66,37,59,'España',['MI','ED']);
upsert('Yanis Rahmani','EI',65,82,63,59,67,31,58,'Argelia',['MI','ED']);
upsert('Gastón Valles','DC',65,68,64,55,62,32,71,'Uruguay',['EI','ED']);
upsert('Ton Ripoll','LD',65,76,51,58,63,60,64,'España',['LI','MD']);
upsert('Genar Fornés','LI',65,73,33,56,58,61,66,'España',['DFC']);
upsert('Xavi Moreno','ED',64,75,57,60,64,25,54,'España',['MD']);
upsert('Nikolay Obolskii','DC',64,53,63,55,61,26,69,'Rusia',[]);
upsert('Català','DFC',63,55,43,51,54,62,66,'España',[]);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();D.TOTW=D.PLAYERS.filter(p=>p.special);
const oldFlag=PV.flag;PV.flag=n=>({'Argelia':'🇩🇿','Uruguay':'🇺🇾','Rusia':'🇷🇺','Nigeria':'🇳🇬','Estados Unidos':'🇺🇸'}[n]||oldFlag(n));
PV.clubLogo=club=>club==='CE Sabadell FC'?'https://drop-assets.ea.com/images/aIrhRNIaKr0UWY3sbwxHo/1fa8ec800517b3804005ad84e26c4d80/l15021.png':null;
})();