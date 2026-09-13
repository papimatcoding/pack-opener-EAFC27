(function(){
'use strict';
const PV=window.PV4,D=PV.D;
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze',r=t==='gold'?(p.ovr>=82||p.pac>=90):t==='silver'?(p.ovr>=68||p.pac>=76):(p.ovr>=63||p.pac>=76);return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`}}
function add(team,name,pos,ovr,pac,sho,pas,dri,def,phy,nation,alt=[]){let p=D.PLAYERS.find(x=>!x.special&&(x.name===name||x.identity===slug(name)));const base={id:p?.id||`ll2-${slug(name)}`,identity:p?.identity||slug(name),name,searchName:name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club:team,league:'LALIGA HYPERMOTION',price:p?.price||Math.max(400,Math.round((ovr-58)*260)),target:p?.target||Math.max(300,Math.round((ovr-58)*210)),alt,simulated:false,special:false};Object.assign(base,quality(base));if(p)Object.assign(p,base);else D.PLAYERS.push(base)}
// Girona FC
add('Girona FC','Azzedine Ounahi','MC',79,77,73,78,82,68,72,'Marruecos',['MCO']);
add('Girona FC','Viktor Tsygankov','ED',78,78,77,77,78,43,61,'Ucrania',['MD','MCO']);
add('Girona FC','Paulo Gazzaniga','POR',77,77,76,78,78,57,75,'Argentina');
add('Girona FC','Arnau Martínez','LD',77,78,55,72,72,75,72,'España',['DFC']);
add('Girona FC','Fran Beltrán','MC',77,55,67,76,76,75,69,'España',['MCD']);
// RCD Mallorca
add('RCD Mallorca','Sergi Darder','MC',78,69,72,80,79,69,73,'España',['MCO']);
add('RCD Mallorca','Raíllo','DFC',78,35,37,60,61,80,82,'España');
add('RCD Mallorca','Samú Costa','MCD',78,63,66,69,70,77,80,'Portugal',['MC']);
add('RCD Mallorca','Martin Valjent','DFC',77,58,36,59,64,78,83,'Eslovaquia');
add('RCD Mallorca','Jan Virgili','EI',76,86,67,69,79,39,51,'España',['MI','ED']);
add('RCD Mallorca','Arnau Tenas','POR',75,74,70,81,77,52,74,'España');
add('RCD Mallorca','Manu Morlanes','MCD',75,64,64,74,73,71,67,'España',['MC']);
// UD Las Palmas
add('UD Las Palmas','Kirian','MCD',74,53,75,74,74,70,73,'España',['MC']);
add('UD Las Palmas','Manu Fuster','MCO',74,74,73,77,75,58,59,'España',['MI']);
add('UD Las Palmas','Dinko Horkaš','POR',74,73,72,70,78,48,72,'Croacia');
add('UD Las Palmas','Iván Jaime','MI',74,74,74,71,76,45,63,'España',['MCO','EI']);
// UD Almería
add('UD Almería','Arribas','MCO',77,84,76,74,79,43,64,'España',['ED']);
add('UD Almería','Embarba','EI',75,75,76,76,75,42,64,'España',['MI','ED']);
add('UD Almería','Álex Muñoz','LI',74,78,70,67,67,69,84,'España',['DFC']);
add('UD Almería','Brian Cipenga','EI',73,88,67,65,76,33,67,'R. D. Congo',['MI']);
// R. Valladolid CF
add('R. Valladolid CF','Julien Ponceau','MI',71,70,62,68,72,55,60,'Francia',['MC','MCO']);
add('R. Valladolid CF','Chacón','MCO',70,77,66,68,71,26,49,'España',['ED']);
add('R. Valladolid CF','Miguel Rubio','DFC',70,37,29,48,45,69,73,'España');
add('R. Valladolid CF','Iván Alejo','LD',69,78,66,65,67,65,75,'España',['MD']);
// SD Eibar
add('SD Eibar','Nolaskoain','MCD',72,54,62,61,64,71,80,'España',['DFC']);
add('SD Eibar','Magunagoitia','POR',72,72,71,68,73,27,69,'España');
add('SD Eibar','Sergio Álvarez','MCD',70,52,65,64,64,67,77,'España',['MC']);
add('SD Eibar','Imanol','LI',70,68,47,67,66,67,62,'España');
add('SD Eibar','Javi Martón','DC',70,62,72,56,66,25,74,'España');
// Cádiz CF
add('Cádiz CF','Izeta','DC',71,67,72,62,67,26,75,'España');
add('Cádiz CF','Suso','ED',71,64,70,74,72,32,52,'España',['MCO']);
add('Cádiz CF','Javi Castro','DFC',71,63,32,48,63,71,75,'España');
add('Cádiz CF','Damián Rodríguez','MCD',71,70,59,67,69,68,72,'España',['MC']);
// CD Leganés
add('CD Leganés','Álvaro Tejero','LD',73,76,66,73,72,66,67,'España',['MD']);
add('CD Leganés','Juan Soriano','POR',73,71,71,66,79,37,70,'España');
add('CD Leganés','Dani Rodríguez','MI',72,67,68,73,71,60,59,'España',['MC']);
add('CD Leganés','Yassine Kechta','MC',72,56,60,72,74,63,63,'Francia',['MCD']);
add('CD Leganés','Raúl Fernández','POR',71,71,73,67,71,38,73,'España');
// Granada CF
add('Granada CF','Gumbau','MC',73,40,70,75,69,72,70,'España',['MCD']);
add('Granada CF','Rubén Alcaraz','MC',72,44,68,73,70,69,83,'España',['MCD']);
add('Granada CF','Manu Lama','DFC',72,63,48,56,63,71,78,'España');
add('Granada CF','José Arnáiz','EI',71,80,70,70,71,40,53,'España',['MI','DC']);
// Real Sociedad B
add('Real Sociedad B','Aitor Fraga','POR',69,67,69,64,69,30,69,'España');
add('Real Sociedad B','Job Nguono Ochieng','EI',68,87,67,59,67,26,69,'Kenia',['MI']);
add('Real Sociedad B','Kazunari Kita','DFC',68,67,41,58,55,68,70,'Japón');
add('Real Sociedad B','Jon Balda','LI',67,65,57,64,66,64,66,'España');
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();D.TOTW=D.PLAYERS.filter(p=>p.special);
const oldFlag=PV.flag;PV.flag=n=>({'Ucrania':'🇺🇦','Eslovaquia':'🇸🇰','R. D. Congo':'🇨🇩','Kenia':'🇰🇪'}[n]||oldFlag(n));
window.PV8_HYPERMOTION_TEAMS=['CE Sabadell FC','Girona FC','RCD Mallorca','UD Las Palmas','UD Almería','R. Valladolid CF','SD Eibar','Cádiz CF','CD Leganés','Granada CF','Real Sociedad B'];
})();