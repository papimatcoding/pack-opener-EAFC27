(function(){
'use strict';
const PV=window.PV4,D=PV.D;
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze',r=t==='gold'?(p.ovr>=82||p.pac>=90):t==='silver'?(p.ovr>=68||p.pac>=76):(p.ovr>=63||p.pac>=76);return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`}}
function add(team,name,pos,ovr,pac,sho,pas,dri,def,phy,nation,alt=[]){let p=D.PLAYERS.find(x=>!x.special&&(x.name===name||x.identity===slug(name)));const base={id:p?.id||`ll2-${slug(name)}`,identity:p?.identity||slug(name),name,searchName:name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club:team,league:'LALIGA HYPERMOTION',price:p?.price||Math.max(350,Math.round((ovr-57)*250)),target:p?.target||Math.max(300,Math.round((ovr-57)*195)),alt,simulated:false,special:false};Object.assign(base,quality(base));if(p)Object.assign(p,base);else D.PLAYERS.push(base)}
// Albacete BP — EA FC 27
add('Albacete BP','Rober','ED',73,80,62,71,77,32,48,'España',['MD']);
add('Albacete BP','Puertas','MD',72,69,71,71,73,43,69,'España',['ED','DC']);
add('Albacete BP','Vallejo','DFC',72,62,42,55,63,72,63,'España');
add('Albacete BP','Agus Medina','MC',70,66,69,67,69,66,77,'España',['MCD']);
add('Albacete BP','Corpas','MD',70,83,64,67,69,59,65,'España',['ED']);
// Córdoba CF
add('Córdoba CF','Carracedo','ED',72,79,64,70,73,32,65,'España',['MD']);
add('Córdoba CF','Isma Ruiz','MCD',71,53,59,65,67,69,76,'España',['MC']);
add('Córdoba CF','Juan Gutiérrez','DFC',70,72,32,47,49,68,84,'España');
add('Córdoba CF','Iker Álvarez','POR',69,69,67,69,70,38,66,'Andorra');
add('Córdoba CF','Álex Martín','DFC',69,66,42,50,53,68,73,'España');
// Burgos CF
add('Burgos CF','José Gragera','MCD',71,59,50,66,64,71,76,'España',['MC']);
add('Burgos CF','David González','MD',70,68,67,68,69,55,71,'España',['ED']);
add('Burgos CF','Cantero','POR',70,70,69,68,70,60,71,'España');
add('Burgos CF','Curro Sánchez','MCO',70,74,69,68,72,40,57,'España',['ED']);
add('Burgos CF','Ethan','MC',68,67,60,65,68,64,70,'España',['MCD']);
// AD Ceuta FC
add('AD Ceuta FC','Matos','LI',69,78,61,64,68,61,56,'España',['MI']);
add('AD Ceuta FC','Cedric Teguia','MD',69,83,64,61,72,53,76,'Camerún',['ED']);
add('AD Ceuta FC','Kenneth Mamah','MD',68,81,61,63,67,59,70,'Nigeria',['ED']);
add('AD Ceuta FC','Kialy Abdoul Koné','MI',68,81,64,58,69,47,70,'Costa de Marfil',['EI']);
add('AD Ceuta FC','Guille Vallejo','POR',68,67,68,64,67,48,68,'España');
// CD Castellón
add('CD Castellón','Alberto Jiménez','DFC',72,60,56,59,60,69,88,'España',['MCD']);
add('CD Castellón','Iñigo Córdoba','MI',72,81,70,67,73,62,74,'España',['EI']);
add('CD Castellón','Jérémy Mellot','LD',72,80,43,63,70,66,82,'Francia',['MD']);
add('CD Castellón','Amir Saipi','POR',71,71,69,68,72,30,72,'Suiza');
add('CD Castellón','Lucas Alcázar','LI',70,83,36,62,70,63,66,'España',['MI']);
// CD Eldense
add('CD Eldense','Fidel','MD',68,59,67,69,69,38,51,'España',['ED','MCO']);
add('CD Eldense','Justin Smith','MCD',68,61,41,59,60,67,73,'Canadá',['DFC']);
add('CD Eldense','Floris Smand','DFC',68,62,30,49,55,67,75,'Países Bajos');
add('CD Eldense','Ramón Vila','POR',67,70,63,63,70,48,63,'España');
add('CD Eldense','Javi Martínez','MC',67,64,63,64,68,62,74,'España',['MCO']);
// FC Andorra
add('FC Andorra','Pau López','POR',77,76,76,77,77,48,77,'España');
add('FC Andorra','Gael Alonso','DFC',68,62,43,55,57,68,71,'España');
add('FC Andorra','Josep Cerdà','EI',68,76,64,63,69,31,63,'España',['MI']);
add('FC Andorra','Jordi Cano','MI',68,72,71,61,71,22,58,'España',['EI']);
add('FC Andorra','Nacho Quintana','MCO',67,75,64,65,69,51,69,'España',['MC']);
add('FC Andorra','Sergio Molina','MC',67,58,61,64,64,68,72,'España',['MCD']);
// Celta Fortuna
add('Celta Fortuna','Hugo González','MD',68,68,67,66,68,36,54,'España',['ED']);
add('Celta Fortuna','Hugo Burcio','MCD',67,63,48,60,62,65,70,'España',['MC']);
add('Celta Fortuna','Pablo Meixús','DFC',66,58,33,49,50,65,70,'España');
add('Celta Fortuna','Álvaro Marín','DC',66,65,65,54,61,29,71,'España');
add('Celta Fortuna','Joel López','LI',66,74,50,60,64,61,63,'España',['MI']);
// Real Oviedo
add('R. Oviedo','Aarón Escandell','POR',78,78,77,73,80,52,75,'España');
add('R. Oviedo','David Costas','DFC',74,67,46,66,71,74,76,'España');
add('R. Oviedo','Ilyas Chaira','EI',74,79,73,69,74,40,63,'Marruecos',['MI','DC']);
add('R. Oviedo','Alberto Reina','MCO',73,68,69,73,74,67,70,'España',['MC']);
// Sporting Gijón
add('Sporting Gijón','Juan Ferney Otero','DC',74,88,73,72,74,31,81,'Colombia',['ED']);
add('Sporting Gijón','Gelabert','MCO',74,74,68,72,75,51,70,'España',['MC']);
add('Sporting Gijón','Guille Rosas','LD',73,79,57,72,74,66,81,'España',['MD']);
add('Sporting Gijón','Àlex Corredera','MC',73,64,64,73,74,61,80,'España',['MCD']);
add('Sporting Gijón','Rubén Yáñez','POR',73,73,69,64,78,46,69,'España');
// CD Tenerife
add('CD Tenerife','Mauro Pittón','MC',72,78,59,70,72,67,72,'Argentina',['MCD']);
add('CD Tenerife','Enric Gallego','DC',70,54,71,58,63,25,74,'España');
add('CD Tenerife','Nacho Gil','MD',69,78,64,65,71,44,52,'España',['ED']);
add('CD Tenerife','Dani Martín','POR',68,67,67,66,69,47,67,'España');
add('CD Tenerife','Jesús Alvarez','MCD',68,65,54,60,65,67,75,'España',['MC']);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();D.TOTW=D.PLAYERS.filter(p=>p.special);
const oldFlag=PV.flag;PV.flag=n=>({'Andorra':'🇦🇩','Camerún':'🇨🇲','Costa de Marfil':'🇨🇮','Suiza':'🇨🇭','Canadá':'🇨🇦','Países Bajos':'🇳🇱','Colombia':'🇨🇴'}[n]||oldFlag(n));
window.PV9_HYPERMOTION_TEAMS=[...new Set(D.PLAYERS.filter(p=>p.league==='LALIGA HYPERMOTION').map(p=>p.club))].sort();
})();