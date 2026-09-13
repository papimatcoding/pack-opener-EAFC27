(function(){
'use strict';
const PV=window.PV4,D=PV.D;

function firstInformOVR(base){
  if(base>=86)return Math.min(99,base+1);
  if(base>=84)return 86;
  if(base===83)return 85;
  if(base>=81)return 84;
  if(base===80)return 83;
  if(base>=78)return 82;
  if(base>=75)return 81;
  return 80;
}
PV.nextTOTWOverall=(baseOVR,previousInformOVR=null)=>previousInformOVR?Math.min(99,previousInformOVR+1):firstInformOVR(baseOVR);

function statBoost(base,ovrDelta,key){
  const attacking=['DC','EI','ED','MI','MD','MCO'].includes(base.pos);
  const midfield=['MC','MCD'].includes(base.pos);
  const defending=['DFC','LI','LD'].includes(base.pos);
  const priority=(attacking&&['pac','sho','dri'].includes(key))||(midfield&&['pas','dri','def'].includes(key))||(defending&&['pac','def','phy'].includes(key));
  return Math.max(1,ovrDelta)+(priority?1:0);
}

for(const sp of D.PLAYERS.filter(p=>p.special)){
  const base=D.PLAYERS.find(p=>!p.special&&p.identity===sp.identity);
  sp.ifIndex=sp.ifIndex||1;
  sp.cardType='totw';sp.tier='special';sp.rare=true;sp.rarityLabel='Team of the Week';
  if(!base)continue;
  const newOvr=PV.nextTOTWOverall(base.ovr,null),delta=newOvr-base.ovr;
  sp.ovr=newOvr;
  for(const k of ['pac','sho','pas','dri','def','phy'])sp[k]=Math.min(99,base[k]+statBoost(base,delta,k));
}
D.TOTW=D.PLAYERS.filter(p=>p.special);

const RULES={
  daily:{bands:[[75,79,.76],[80,82,.195],[83,84,.04],[85,86,.0042],[87,99,.0008]],specialChance:.001,oddsText:'85+ ≈ 3% · 87+ < 0,5%'},
  premium:{bands:[[75,79,.68],[80,82,.245],[83,84,.06],[85,86,.013],[87,99,.002]],specialChance:.012,oddsText:'85+ ≈ 17% por pack'},
  '80x5':{bands:[[80,82,.68],[83,84,.23],[85,86,.075],[87,99,.015]],specialChance:.018,oddsText:'85+ ≈ 38% por pack'},
  '82x3':{bands:[[82,82,.40],[83,84,.42],[85,86,.15],[87,99,.03]],specialChance:.025,oddsText:'87+ ≈ 9% por pack'},
  '84x3':{bands:[[84,84,.58],[85,86,.33],[87,88,.075],[89,99,.015]],specialChance:.035,oddsText:'87+ ≈ 25% por pack'},
  elite:{bands:[[85,86,.58],[87,88,.29],[89,90,.105],[91,99,.025]],specialChance:.06,oddsText:'89+ ≈ 67% por pack'}
};
for(const p of D.PACKS_V4){
  const r=RULES[p.id];if(r){p.oddsText=r.oddsText;p.rule=r;}
  if(p.id==='daily')p.subtitle='6 jugadores oro · recompensa diaria equilibrada';
  if(p.id==='premium')p.subtitle='12 jugadores oro · progresión principal';
  if(r)p.subtitle+=` · ${r.oddsText}`;
}

function weighted(pool){
  const ws=pool.map(p=>Math.pow(Math.max(1,96-p.ovr),2.15)),sum=ws.reduce((a,b)=>a+b,0);let r=Math.random()*sum;
  for(let i=0;i<pool.length;i++){r-=ws[i];if(r<=0)return pool[i]}return pool[pool.length-1];
}
function chooseFromRule(pack,rule){
  let r=Math.random(),chosen=rule.bands[0];
  for(const b of rule.bands){r-=b[2];if(r<=0){chosen=b;break}}
  let pool=D.PLAYERS.filter(p=>!p.special&&p.ovr>=Math.max(pack.min,chosen[0])&&p.ovr<=Math.min(pack.max,chosen[1]));
  if(!pool.length)pool=D.PLAYERS.filter(p=>!p.special&&p.ovr>=pack.min&&p.ovr<=pack.max);
  return weighted(pool);
}
function specialPick(){return weighted(D.TOTW)}
PV.makePack=pack=>{
  if(pack.specialOnly)return [specialPick()];
  if(pack.id==='basic'){
    const pool=D.PLAYERS.filter(p=>!p.special&&p.ovr>=pack.min&&p.ovr<=pack.max),out=[];
    for(let i=0;i<pack.count;i++){let p=weighted(pool),g=0;while(out.some(x=>x.id===p.id)&&g++<20)p=weighted(pool);out.push(p)}
    return out.sort((a,b)=>b.ovr-a.ovr);
  }
  const rule=RULES[pack.id],out=[];
  for(let i=0;i<pack.count;i++){
    let p=rule?chooseFromRule(pack,rule):weighted(D.PLAYERS.filter(x=>!x.special&&x.ovr>=pack.min&&x.ovr<=pack.max)),g=0;
    while(out.some(x=>x.id===p.id)&&g++<25)p=rule?chooseFromRule(pack,rule):p;
    out.push(p);
  }
  if(rule?.specialChance&&Math.random()<rule.specialChance)out[0]=specialPick();
  return out.sort((a,b)=>b.ovr-a.ovr||b.price-a.price);
};
})();
