(function(){
'use strict';
const PV=window.PV4;
const stats=p=>[['RIT',p.pac],['TIR',p.sho],['PAS',p.pas],['REG',p.dri],['DEF',p.def],['FÍS',p.phy]];
const chemDots=n=>`<span class="pv-chem">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
PV.card=(p,o={})=>{
  const cls=PV.cardClass(p),count=o.count||0,chem=o.chem??null,photo=PV.state.photos[p.id];
  const ph=photo?`<img src="${PV.esc(photo)}" alt="" loading="lazy">`:`<div class="pv-fallback">${PV.ini(p.name)}</div>`;
  const statMarkup=stats(p).map(([k,v])=>`<span><b>${v}</b><small>${k}</small></span>`).join('');
  if(o.mini){
    const el=o.button===false?'div':'button',data=o.button===false?'':` data-player="${p.id}"`;
    return `<${el} class="mini-card ${cls}"${data}>${count>1?`<span class="dupe">x${count}</span>`:''}<span class="card-edge"></span><div class="m-head"><div><b class="m-ovr">${p.ovr}</b><small class="m-pos">${p.pos}</small></div><div class="m-id"><span>${PV.flag(p.nation)}</span><span class="m-club">${PV.clubAbbr(p.club)}</span></div></div><div class="m-photo" data-photo="${p.id}">${ph}</div><div class="m-name">${PV.esc(p.name)}</div><div class="m-stats">${statMarkup}</div><div class="m-foot"><span>${p.special?'TOTW':p.rare?'PREMIUM':'COMÚN'}</span>${chem!==null?chemDots(chem):`<span>${PV.esc(p.league)}</span>`}</div></${el}>`;
  }
  return `<article class="pv-card ${cls}"><span class="card-edge"></span><div class="pv-head"><div><div class="pv-rating">${p.ovr}</div><div class="pv-pos">${p.pos}</div></div><div class="pv-id"><span>${PV.flag(p.nation)}</span><span class="pv-club">${PV.clubAbbr(p.club)}</span></div></div><div class="pv-photo" data-photo="${p.id}">${ph}</div><div class="pv-name">${PV.esc(p.name)}</div><div class="pv-stats">${statMarkup}</div><div class="pv-foot"><span>${p.special?'TEAM OF THE WEEK':PV.esc(p.rarityLabel)}</span>${chem!==null?chemDots(chem):`<span>${PV.esc(p.league)}</span>`}</div></article>`;
};
})();
