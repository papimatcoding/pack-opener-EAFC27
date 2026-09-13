(function(){
'use strict';
const PV=window.PV4,D=PV.D;
const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function quality(p){
  if(p.special)return{tier:'special',rare:true,cardType:'totw',rarityLabel:'Team of the Week'};
  const t=p.ovr>=75?'gold':p.ovr>=65?'silver':'bronze';
  const r=t==='gold'?(p.ovr>=82||p.pac>=90||p.price>=12000):t==='silver'?(p.ovr>=70||p.pac>=78):(p.ovr>=64||p.pac>=80);
  return{tier:t,rare:r,cardType:`${t}-${r?'rare':'common'}`,rarityLabel:`${t==='gold'?'Oro':t==='silver'?'Plata':'Bronce'} ${r?'premium':'común'}`};
}
function add(team,name,pos,ovr,pac,sho,pas,dri,def,phy,nation,alt=[]){
  const id=`ll2-${slug(name)}`;
  let p=D.PLAYERS.find(x=>!x.special&&(x.name===name||x.id===id||x.identity===slug(name)));
  const base={id:p?.id||id,identity:p?.identity||slug(name),name,searchName:name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club:team,league:'LALIGA HYPERMOTION',price:p?.price||Math.max(200,Math.round((ovr-54)*175)),target:p?.target||Math.max(150,Math.round((ovr-54)*130)),alt,simulated:false,special:false};
  Object.assign(base,quality(base));
  if(p)Object.assign(p,base);else D.PLAYERS.push(base);
}

// CE Sabadell FC — additional official FC 27 base cards.
add('CE Sabadell FC','Kaiser','DFC',65,56,34,46,45,63,73,'España',['MCD']);
add('CE Sabadell FC','Agustín Coscia','DC',65,68,64,54,64,27,66,'Argentina');
add('CE Sabadell FC','Eneko Aguilar','MC',64,71,60,64,64,61,65,'España',['MCD']);
add('CE Sabadell FC','Miguelete','MCO',64,75,59,61,67,34,58,'España',['DC','ED']);
add('CE Sabadell FC','Carlos Alemán','LD',63,71,39,55,58,58,60,'España',['DFC']);
add('CE Sabadell FC','José Ortega','POR',63,62,63,57,63,28,63,'España');
add('CE Sabadell FC','Quim Utgés','DC',62,71,60,56,63,28,60,'España');
add('CE Sabadell FC','Lluis Estebe','MC',60,66,57,60,63,57,56,'España',['MCD']);
add('CE Sabadell FC','Hudson Davis','DFC',60,56,30,47,48,59,64,'España');

// Albacete BP — lower rated real cards, useful for Bronze SBC progression.
add('Albacete BP','San Bartolomé','MCO',65,67,61,66,66,51,69,'España',['MC']);
add('Albacete BP','Soberón','DC',64,47,68,63,63,32,63,'España');
add('Albacete BP','Marcos Moreno','DC',63,69,63,52,59,25,68,'España');
add('Albacete BP','Capi','MCD',62,73,54,58,64,60,61,'España',['MC']);
add('Albacete BP','Dani Bernabéu','LI',62,79,47,56,65,54,50,'España',['MI']);
add('Albacete BP','Mario Ramos','POR',59,59,62,52,56,28,61,'España');
add('Albacete BP','Jota','LD',58,73,44,49,59,53,49,'España',['MD']);
add('Albacete BP','Antonio Velilla','DFC',58,72,25,43,54,57,67,'España');
add('Albacete BP','Alberto Morientes','DC',58,73,61,44,61,21,39,'España');

// AD Ceuta FC.
add('AD Ceuta FC','Capa','DFC',63,50,35,44,56,66,60,'España');
add('AD Ceuta FC','Alex Camacho','ED',62,68,62,59,64,32,60,'España',['MD']);
add('AD Ceuta FC','Nel Gonzalez','POR',62,61,62,60,64,26,65,'España');
add('AD Ceuta FC','Victor Corral','MC',61,62,49,62,61,60,52,'España',['MCD']);
add('AD Ceuta FC','Yeyo','DC',60,62,61,52,59,22,57,'España');
add('AD Ceuta FC','Adri Rueda','EI',60,76,53,57,62,27,49,'España',['MI']);
add('AD Ceuta FC','Pelayo García','MI',60,76,54,54,62,25,41,'España',['EI']);
add('AD Ceuta FC','Josema','MC',59,64,48,61,62,58,57,'España',['MCD']);

// CD Eldense.
add('CD Eldense','Jesús Clemente','LD',64,81,56,59,63,56,70,'España',['MD']);
add('CD Eldense','Julien Yanda','LI',63,78,37,61,64,58,59,'Francia',['MI']);
add('CD Eldense','Javier Olaizola','DFC',59,58,34,45,47,58,60,'España');

// Celta Fortuna.
add('Celta Fortuna','Jan Oliveras','LI',64,71,46,60,63,59,60,'España',['MI']);
add('Celta Fortuna','Andrés Antañón','MC',64,65,62,63,62,61,57,'España',['MCD']);
add('Celta Fortuna','Kike Ribes','DFC',64,63,30,49,52,63,67,'España');
add('Celta Fortuna','Aldrine Kibet','MI',63,77,55,59,63,33,57,'Kenia',['EI']);
add('Celta Fortuna','Caio Barone','POR',62,62,61,56,61,31,60,'Brasil');
add('Celta Fortuna','Marcos González','POR',62,61,61,59,61,32,61,'España');
add('Celta Fortuna','Capde','MCD',62,64,54,63,63,59,58,'España',['MC']);
add('Celta Fortuna','Hugo Busto','MCO',62,71,56,60,65,41,55,'España',['MC']);
add('Celta Fortuna','Seyni Mbaye Ndiaye','DFC',61,62,29,43,50,60,65,'Senegal');
add('Celta Fortuna','Ángel Dávila','DC',61,72,60,52,62,24,50,'España');

D.PLAYERS.forEach(p=>{if(!p.special)Object.assign(p,quality(p));p.target=p.target||Math.max(150,Math.round((p.price||500)*.72/100)*100)});
D.TOTW=D.PLAYERS.filter(p=>p.special);
D.LEAGUES=[...new Set(D.PLAYERS.map(p=>p.league))].sort();

const basic=D.PACKS_V4.find(p=>p.id==='basic');
if(basic){basic.count=6;basic.min=58;basic.max=74;basic.subtitle='Gratis siempre · 6 jugadores · mayoría bronce para SBC y colección';basic.oddsText='≈ 82% bronce · 18% plata';}
const oldMakePack=PV.makePack;
function weighted(pool){if(!pool.length)return null;const ws=pool.map(p=>Math.pow(Math.max(1,78-p.ovr),1.35)),sum=ws.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<pool.length;i++){r-=ws[i];if(r<=0)return pool[i]}return pool[pool.length-1]}
function ensureUnique(pack,out){
  if(pack.specialOnly||out.length<2)return out;
  const result=[],used=new Set();
  for(const first of out){
    let p=first;
    if(used.has(p.id)){
      for(let tries=0;tries<12&&used.has(p.id);tries++){
        const fresh=oldMakePack(pack)||[];p=fresh.find(x=>!used.has(x.id))||p;
      }
      if(used.has(p.id)){
        const pool=D.PLAYERS.filter(x=>!x.special&&x.ovr>=pack.min&&x.ovr<=pack.max&&!used.has(x.id));
        p=pool[Math.floor(Math.random()*pool.length)]||p;
      }
    }
    if(!used.has(p.id)){result.push(p);used.add(p.id)}
  }
  // A reward pack must keep its advertised item count whenever the data pool makes that possible.
  while(result.length<pack.count){const pool=D.PLAYERS.filter(x=>!x.special&&x.ovr>=pack.min&&x.ovr<=pack.max&&!used.has(x.id));if(!pool.length)break;const p=pool[Math.floor(Math.random()*pool.length)];result.push(p);used.add(p.id)}
  return result.sort((a,b)=>b.ovr-a.ovr||b.price-a.price);
}
PV.makePack=pack=>{
  if(pack?.id!=='basic')return ensureUnique(pack,oldMakePack(pack));
  const bronze=D.PLAYERS.filter(p=>!p.special&&p.tier==='bronze'&&p.ovr>=pack.min&&p.ovr<=pack.max);
  const silver=D.PLAYERS.filter(p=>!p.special&&p.tier==='silver'&&p.ovr<=pack.max),out=[];
  for(let i=0;i<pack.count;i++){
    const wantBronze=Math.random()<.82;let pool=(wantBronze?bronze:silver).filter(p=>!out.some(x=>x.id===p.id));
    if(!pool.length)pool=[...bronze,...silver].filter(p=>!out.some(x=>x.id===p.id));
    const p=weighted(pool);if(p)out.push(p);
  }
  return out.sort((a,b)=>b.ovr-a.ovr||b.pac-a.pac);
};

window.PV12_BRONZE_COUNT=D.PLAYERS.filter(p=>!p.special&&p.tier==='bronze').length;
})();