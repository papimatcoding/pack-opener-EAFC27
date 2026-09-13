(function(){
'use strict';
const D=window.PACKVERSE_DATA;
const leagueMap={
'Real Madrid':'LaLiga EA Sports','FC Barcelona':'LaLiga EA Sports','Atlético de Madrid':'LaLiga EA Sports','Athletic Club':'LaLiga EA Sports','Real Sociedad':'LaLiga EA Sports','Villarreal':'LaLiga EA Sports','Espanyol':'LaLiga EA Sports','Rayo Vallecano':'LaLiga EA Sports','Osasuna':'LaLiga EA Sports','CE Sabadell':'Primera Federación',
'Manchester City':'Premier League','Arsenal':'Premier League','Liverpool':'Premier League','Chelsea':'Premier League','Manchester United':'Premier League','Newcastle United':'Premier League','Aston Villa':'Premier League','Sunderland':'Premier League','Ipswich Town':'Premier League','Nottingham Forest':'Premier League',
'PSG':'Ligue 1','OL Lyonnes':'D1 Arkema','Lorient':'Ligue 1','Bayern München':'Bundesliga','Borussia Dortmund':'Bundesliga','RB Leipzig':'Bundesliga','Eintracht Frankfurt':'Bundesliga','Union Berlin':'Bundesliga','Inter':'Serie A','AC Milan':'Serie A','Napoli':'Serie A','Roma':'Serie A','Parma':'Serie A',
'Orlando Pride':'NWSL','Gotham FC':'NWSL','Bay FC':'NWSL','Inter Miami':'MLS','Al Hilal':'Saudi Pro League','Al Ahli':'Saudi Pro League','Al Ittihad':'Saudi Pro League','Galatasaray':'Süper Lig','Celtic':'Scottish Premiership','Club Brugge':'Belgian Pro League','Genk':'Belgian Pro League','Rosario Central':'Liga Profesional','Santa Clara':'Liga Portugal','Casa Pia':'Liga Portugal','Malmö FF':'Allsvenskan','Racing Santander':'LaLiga Hypermotion'};
const alt={EI:['MI'],ED:['MD'],MI:['EI'],MD:['ED'],DC:['MCO'],MCO:['MC','DC'],MC:['MCO','MCD'],MCD:['MC'],LI:[],LD:[],DFC:[],POR:[]};
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){if(p.special)return {tier:'special',rare:true,cardType:'totw',rarityLabel:'Team of the Week'};const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze';const r=t==='gold'?(p.ovr>=82||p.pac>=90||p.price>=12000):t==='silver'?(p.ovr>=72||p.pac>=84):(p.ovr>=63||p.pac>=80);return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`}}
function enrich(p){p.league=p.league||leagueMap[p.club]||'Liga Internacional';p.alt=p.alt||alt[p.pos]||[];p.identity=p.identity||slug(p.searchName||p.name);Object.assign(p,quality(p));return p}
D.PLAYERS.forEach(enrich);
const P=(name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,price,extra={})=>enrich(Object.assign({id:slug(name),name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,price,target:Math.max(200,Math.round(price*.72/100)*100),simulated:true},extra));
const academy=[
P('Iker Salas','MC',64,67,58,65,66,60,63,'España','CE Sabadell',350),P('Nil Puig','DFC',63,62,35,52,56,64,68,'España','CE Sabadell',300),P('Marc Domènech','DC',64,73,64,51,63,28,66,'España','CE Sabadell',400),P('Arnau Vives','LD',62,76,40,55,63,60,65,'España','CE Sabadell',300),P('Pol Roca','POR',61,61,60,56,63,41,64,'España','CE Sabadell',250),
P('Tariq Mensah','ED',64,84,58,55,67,27,54,'Ghana','Sunderland',650),P('Tom Cooper','DFC',63,65,31,48,51,64,72,'Inglaterra','Ipswich Town',350),P('Liam Hart','MC',64,68,57,65,64,58,61,'Inglaterra','Nottingham Forest',400),P('Milo Grant','EI',63,82,57,54,66,25,56,'Inglaterra','Arsenal',600),P('Theo Marsh','MCD',62,61,45,61,58,65,69,'Inglaterra','Chelsea',300),
P('Hugo Martin','MC',69,72,62,70,71,63,65,'Francia','Lorient',900),P('Noé Laurent','EI',70,86,65,64,74,31,59,'Francia','Lorient',1800),P('Malik Touré','DFC',68,73,34,55,59,70,76,'Francia','PSG',900),P('Jonas Keller','DFC',71,77,38,60,62,72,78,'Alemania','RB Leipzig',1900),P('Finn Adler','MC',70,72,62,71,72,64,69,'Alemania','Union Berlin',1100),
P('Matteo Ricci','MCO',72,75,70,74,77,42,61,'Italia','Parma',2100),P('Luca Serra','DFC',70,67,35,58,60,72,77,'Italia','Roma',1100),P('Tiago Vale','ED',71,87,66,65,75,30,58,'Portugal','Santa Clara',2200),P('Rui Matos','MCD',69,66,55,69,67,70,73,'Portugal','Casa Pia',900),P('Adrián Sanz','EI',73,89,70,66,77,31,61,'España','Racing Santander',3500),
P('Lucas Vidal','MC',72,72,65,73,74,64,67,'España','Espanyol',1900),P('Iván Zurdo','DFC',70,71,38,57,61,72,75,'España','Osasuna',1100),P('Mamadou Ba','DC',74,86,74,59,72,33,79,'Senegal','Genk',4800),P('Elias Berg','MI',73,88,67,68,75,39,63,'Suecia','Malmö FF',3900),P('Kerem Aydin','MCO',74,79,71,74,78,43,60,'Turquía','Galatasaray',4400),P('Jamie Knox','LD',72,85,58,68,73,69,68,'Escocia','Celtic',2500)
];
D.PLAYERS.push(...academy);
function special(baseName,boost=3,priceMult=2.15){const b=D.PLAYERS.find(p=>p.name===baseName);if(!b)return null;const plus=v=>Math.min(99,v+boost+(v<78?1:0));return enrich({...b,id:'totw-'+b.id,name:b.name,searchName:b.name,identity:b.identity,ovr:Math.min(99,b.ovr+boost),pac:plus(b.pac),sho:plus(b.sho),pas:plus(b.pas),dri:plus(b.dri),def:plus(b.def),phy:plus(b.phy),price:Math.round(b.price*priceMult/100)*100,target:Math.round(b.target*priceMult/100)*100,special:true,simulated:true,rarityLabel:'Team of the Week'})}
const totw=[special('Kylian Mbappé',2,1.9),special('Bukayo Saka',2,2.1),special('Bruno Guimarães',2,2.3),special('David Raya',2,2.2),special('Erling Haaland',2,1.9),special('Rayan Cherki',2,2.25),special('Anthony Elanga',3,2.4)];
const extraTotw=[P('Roberto Fernández','DC',83,81,84,67,78,41,82,'España','Espanyol',32000,{special:true,searchName:'Roberto Fernández',rarityLabel:'Team of the Week'}),P('Yassir Zabiri','DC',82,84,82,65,79,32,76,'Marruecos','Lorient',22000,{special:true,searchName:'Yassir Zabiri',rarityLabel:'Team of the Week'}),P('Zian Flemming','MCO',82,73,83,79,81,56,79,'Países Bajos','Burnley',18000,{special:true,searchName:'Zian Flemming',league:'Premier League',rarityLabel:'Team of the Week'}),P('Igor Jesus','DC',82,84,82,68,78,40,81,'Brasil','Nottingham Forest',21000,{special:true,searchName:'Igor Jesus',rarityLabel:'Team of the Week'}),P('Leif Davis','LI',81,86,67,82,80,76,74,'Inglaterra','Ipswich Town',17000,{special:true,searchName:'Leif Davis',rarityLabel:'Team of the Week'})];
D.PLAYERS.push(...totw.filter(Boolean),...extraTotw);
D.PLAYERS.forEach((p,i)=>{p.rank=i+1;p.target=p.target||Math.max(200,Math.round(p.price*.72/100)*100)});
D.PACKS_V4=[
{id:'basic',name:'Sobre Básico',subtitle:'Gratis siempre · bronces y platas para construir tu club',cost:0,count:5,min:60,max:74,tag:'FREE',free:true,quick:true},
{id:'daily',name:'Daily Gold Pack',subtitle:'Gratis una vez al día · 6 jugadores oro',cost:0,count:6,min:75,max:91,tag:'DAILY',daily:true},
{id:'premium',name:'Premium Gold Players',subtitle:'12 jugadores oro · mejor opción general',cost:7500,count:12,min:75,max:91,tag:'12 PLAYERS'},
{id:'80x5',name:'80+ x5',subtitle:'Cinco jugadores 80+ · recompensa habitual',cost:15000,count:5,min:80,max:93,tag:'80+'},
{id:'82x3',name:'82+ x3',subtitle:'Tres cartas 82+ · buen salto de club',cost:22000,count:3,min:82,max:93,tag:'82+'},
{id:'84x3',name:'84+ x3',subtitle:'Tres cartas 84+ · zona walkout',cost:30000,count:3,min:84,max:93,tag:'84+'},
{id:'totw',name:'TOTW Lab Pack',subtitle:'Garantiza 1 especial de TOTW Lab 01',cost:0,count:1,min:81,max:93,tag:'TOTW',tokenOnly:true,specialOnly:true},
{id:'elite',name:'Elite 85+ x10',subtitle:'Recompensa premium · diez 85+',cost:75000,count:10,min:85,max:93,tag:'85+ x10'}];
D.SLOTS=[{id:'LW',label:'EI',x:18,y:15},{id:'ST',label:'DC',x:50,y:10},{id:'RW',label:'ED',x:82,y:15},{id:'LCM',label:'MC',x:27,y:41},{id:'CM',label:'MC',x:50,y:49},{id:'RCM',label:'MC',x:73,y:41},{id:'LB',label:'LI',x:13,y:72},{id:'LCB',label:'DFC',x:37,y:67},{id:'RCB',label:'DFC',x:63,y:67},{id:'RB',label:'LD',x:87,y:72},{id:'GK',label:'POR',x:50,y:88}];
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();
D.TOTW=D.PLAYERS.filter(p=>p.special);
})();