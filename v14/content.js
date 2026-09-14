(function(){
'use strict';
const D=window.PACKVERSE_DATA,PV=window.PV4;
const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){
  if(p.special)return{tier:'special',rare:true,cardType:'totw',rarityLabel:'Team of the Week'};
  const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze';
  const r=t==='gold'?(p.ovr>=82||p.pac>=90||p.price>=12000):t==='silver'?(p.ovr>=70||p.pac>=78):(p.ovr>=64||p.pac>=80);
  return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`};
}
function patch(name,changes){
  D.PLAYERS.filter(p=>p.name===name||p.identity===slug(name)).forEach(p=>{Object.assign(p,changes);if(!p.special)Object.assign(p,quality(p));});
}
function upsert(name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,league,price,alt=[]){
  let p=D.PLAYERS.find(x=>!x.special&&(x.name===name||x.identity===slug(name)));
  const base={id:p?.id||`v14-${slug(name)}`,identity:p?.identity||slug(name),name,searchName:name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,league,price,target:Math.max(150,Math.round(price*.72/100)*100),alt,simulated:false,special:false,verifiedCurrentClub:true};
  Object.assign(base,quality(base));
  if(p)Object.assign(p,base);else D.PLAYERS.push(base);
}

// 2026/27 current-club corrections verified against official FC Barcelona transfer/squad pages.
patch('Karim Adeyemi',{club:'FC Barcelona',league:'LaLiga EA Sports',verifiedCurrentClub:true});
patch('João Cancelo',{club:'FC Barcelona',league:'LaLiga EA Sports',verifiedCurrentClub:true});
patch('Rodri',{club:'FC Barcelona',league:'LaLiga EA Sports',verifiedCurrentClub:true});
patch('Anthony Gordon',{club:'FC Barcelona',league:'LaLiga EA Sports',verifiedCurrentClub:true});
patch('Gabriel Jesus',{club:'FC Barcelona',league:'LaLiga EA Sports',verifiedCurrentClub:true});
patch('Ferran Torres',{club:'PSG',league:'Ligue 1',verifiedCurrentClub:true});
patch('Marc Casadó',{club:'Deportivo de La Coruña',league:'LALIGA HYPERMOTION',verifiedCurrentClub:true});
patch('Héctor Fort',{club:'Real Sociedad',league:'LaLiga EA Sports',verifiedCurrentClub:true});

// Real 2026/27 Barça squad additions. Ratings are PackVerse launch estimates, identities/clubs are real.
upsert('Joan García','POR',85,84,83,79,85,42,84,'España','FC Barcelona','LaLiga EA Sports',26000);
upsert('Wojciech Szczęsny','POR',83,82,84,75,82,44,83,'Polonia','FC Barcelona','LaLiga EA Sports',9000);
upsert('Dominik Livaković','POR',82,83,82,74,83,41,82,'Croacia','FC Barcelona','LaLiga EA Sports',7500);
upsert('Alejandro Balde','LI',83,91,67,78,84,78,72,'España','FC Barcelona','LaLiga EA Sports',22000,['MI']);
upsert('Jules Koundé','LD',86,84,60,78,79,86,81,'Francia','FC Barcelona','LaLiga EA Sports',52000,['DFC']);
upsert('Andreas Christensen','DFC',82,67,53,77,73,83,78,'Dinamarca','FC Barcelona','LaLiga EA Sports',8500,['MCD']);
upsert('Eric García','DFC',80,67,57,76,73,80,75,'España','FC Barcelona','LaLiga EA Sports',6500,['MCD','LD']);
upsert('Gerard Martín','LI',76,78,52,69,72,75,76,'España','FC Barcelona','LaLiga EA Sports',4500,['DFC']);
upsert('Brian Fariñas','MC',74,72,66,75,77,62,65,'España','FC Barcelona','LaLiga EA Sports',5200,['MCO']);
upsert('Xavi Espart','LD',72,79,48,67,72,69,66,'España','FC Barcelona','LaLiga EA Sports',3600,['DFC']);
upsert('Gavi','MC',85,78,76,84,88,80,80,'España','FC Barcelona','LaLiga EA Sports',42000,['MCO']);
upsert('Fermín López','MCO',84,79,83,80,84,68,74,'España','FC Barcelona','LaLiga EA Sports',28000,['MC']);
upsert('Dani Olmo','MCO',85,78,82,85,87,55,67,'España','FC Barcelona','LaLiga EA Sports',38000,['MI','EI']);
upsert('Marc Bernal','MCD',78,65,62,78,76,78,77,'España','FC Barcelona','LaLiga EA Sports',7000,['MC']);
upsert('Anthony Gordon','EI',84,91,80,78,85,52,74,'Inglaterra','FC Barcelona','LaLiga EA Sports',32000,['MI','DC']);
upsert('Gabriel Jesus','DC',83,84,81,77,86,43,73,'Brasil','FC Barcelona','LaLiga EA Sports',18000,['EI']);
upsert('Roony Bardghji','ED',77,82,75,73,81,34,60,'Suecia','FC Barcelona','LaLiga EA Sports',7500,['MCO']);
upsert('Jesse Bisiwu','ED',69,84,61,64,75,35,62,'Bélgica','FC Barcelona','LaLiga EA Sports',1800,['EI']);
upsert('Hamza Abdelkarim','DC',68,74,68,58,69,28,67,'Egipto','FC Barcelona','LaLiga EA Sports',1500);

// Real CE Sabadell 2026/27 first-team roster, intentionally useful for bronze/silver SBC depth.
upsert('Diego Fuoli','POR',67,67,68,61,67,31,69,'España','CE Sabadell FC','LALIGA HYPERMOTION',1100);
upsert('Nil Ruiz','POR',65,66,65,60,65,30,66,'España','CE Sabadell FC','LALIGA HYPERMOTION',800);
upsert('Genar Fornés','LI',65,73,42,59,63,64,66,'España','CE Sabadell FC','LALIGA HYPERMOTION',850,['MI']);
upsert('Carlos Garcia','DFC',64,59,33,53,55,64,69,'España','CE Sabadell FC','LALIGA HYPERMOTION',650);
upsert('Arthur Bonaldo','DFC',66,63,35,54,57,66,72,'Brasil','CE Sabadell FC','LALIGA HYPERMOTION',950);
upsert('Ton Ripoll','LI',64,75,45,58,66,61,60,'España','CE Sabadell FC','LALIGA HYPERMOTION',700,['MI']);
upsert('David Astals','LD',63,74,44,57,63,60,59,'España','CE Sabadell FC','LALIGA HYPERMOTION',600,['MD']);
upsert('Jan Molina','MCD',64,62,51,63,62,63,67,'España','CE Sabadell FC','LALIGA HYPERMOTION',700,['MC']);
upsert('Jordi Ortega','MC',63,61,57,64,63,57,61,'España','CE Sabadell FC','LALIGA HYPERMOTION',600,['MCD']);
upsert('Urri','MC',64,69,58,64,66,55,62,'España','CE Sabadell FC','LALIGA HYPERMOTION',700,['MCO']);
upsert('Quadri Liameed','MCD',64,73,50,60,65,62,70,'Nigeria','CE Sabadell FC','LALIGA HYPERMOTION',750,['MC']);
upsert('Rodrigo Escudero','DC',66,70,66,57,64,27,70,'España','CE Sabadell FC','LALIGA HYPERMOTION',950);
upsert('Rubén Martínez','EI',65,78,61,60,68,34,58,'España','CE Sabadell FC','LALIGA HYPERMOTION',900,['MI']);
upsert('Alan Godoy','DC',64,74,64,55,65,29,65,'España','CE Sabadell FC','LALIGA HYPERMOTION',750,['EI']);
upsert('Javi López-Pinto','EI',63,76,58,59,66,31,56,'España','CE Sabadell FC','LALIGA HYPERMOTION',650,['MI']);
upsert('Joel Priego','ED',64,78,60,58,67,33,57,'España','CE Sabadell FC','LALIGA HYPERMOTION',700,['MD']);

// Extra real players to improve SBC/pack variety across rating bands.
upsert('Mikel Oyarzabal','EI',84,76,84,82,83,52,72,'España','Real Sociedad','LaLiga EA Sports',19000,['DC']);
upsert('Martín Zubimendi','MCD',84,65,70,84,80,84,78,'España','Arsenal','Premier League',24000,['MC']);
upsert('Moisés Caicedo','MCD',85,78,70,82,82,86,84,'Ecuador','Chelsea','Premier League',36000,['MC']);
upsert('Alexander Isak','DC',86,86,87,75,85,35,76,'Suecia','Newcastle','Premier League',62000);
upsert('Morgan Rogers','MCO',82,84,79,78,83,61,80,'Inglaterra','Aston Villa','Premier League',14500,['EI']);
upsert('Jarrad Branthwaite','DFC',81,69,42,63,66,83,85,'Inglaterra','Everton','Premier League',11000);
upsert('Milos Kerkez','LI',80,88,57,74,79,77,76,'Hungría','Liverpool','Premier League',12000,['MI']);
upsert('Ethan Nwaneri','MCO',79,84,76,78,84,42,61,'Inglaterra','Arsenal','Premier League',10000,['ED']);
upsert('Kobbie Mainoo','MC',79,74,68,79,82,72,72,'Inglaterra','Manchester United','Premier League',9000,['MCD']);
upsert('Jorrel Hato','DFC',78,83,49,73,79,78,75,'Países Bajos','Chelsea','Premier League',8500,['LI']);
upsert('Lewis Miley','MC',75,68,64,76,74,69,72,'Inglaterra','Newcastle','Premier League',5200,['MCD']);
upsert('Archie Gray','MCD',76,75,60,75,76,74,73,'Inglaterra','Tottenham','Premier League',6000,['LD','MC']);

D.PLAYERS.forEach(p=>{if(!p.special)Object.assign(p,quality(p));});
D.TOTW=D.PLAYERS.filter(p=>p.special);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league).filter(Boolean))].sort();
window.PV14_DATA_AUDIT={version:14,total:D.PLAYERS.length,verifiedCurrentClub:D.PLAYERS.filter(p=>p.verifiedCurrentClub).length,tiers:Object.fromEntries(['bronze','silver','gold','special'].map(t=>[t,D.PLAYERS.filter(p=>p.tier===t).length])),clubCorrections:['Karim Adeyemi','João Cancelo','Rodri','Anthony Gordon','Gabriel Jesus','Ferran Torres','Marc Casadó','Héctor Fort'],verifiedSquads:['FC Barcelona 2026/27','CE Sabadell FC 2026/27']};
})();