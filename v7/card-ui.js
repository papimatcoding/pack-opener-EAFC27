(function(){
'use strict';
const PV=window.PV4;
const stats=p=>[['RIT',p.pac],['TIR',p.sho],['PAS',p.pas],['REG',p.dri],['DEF',p.def],['FÍS',p.phy]];
const chemDots=n=>`<span class="pv7-chem">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
function silhouette(){return '<span class="pv7-silhouette" aria-hidden="true"><i></i><b></b></span>'}
function photo(p){const u=PV.state.photos[p.id];return `<div class="pv7-photo" data-photo="${p.id}">${u?`<img src="${PV.esc(u)}" alt="" loading="lazy" decoding="async">`:silhouette()}</div>`}
function club(p){const logo=PV.clubLogo?.(p.club);return logo?`<span class="pv7-club-logo"><img src="${logo}" alt="${PV.esc(p.club)}"></span>`:`<span class="pv7-club-logo text">${PV.clubAbbr(p.club)}</span>`}
function body(p,chem){return `<span class="pv7-frame" aria-hidden="true"></span><div class="pv7-rating"><b>${p.ovr}</b><small>${p.pos}</small></div><span class="pv7-quality">${p.special?'TOTW':p.rare?'PREM.':''}</span>${photo(p)}<div class="pv7-name">${PV.esc(p.name)}</div><div class="pv7-stats">${stats(p).map(([k,v])=>`<span><small>${k}</small><b>${v}</b></span>`).join('')}</div><div class="pv7-idrow"><span class="pv7-flag">${PV.flag(p.nation)}</span><span class="pv7-league">${PV.esc(p.league)}</span>${club(p)}${chem!==null?chemDots(chem):''}</div>`}
PV.card=(p,o={})=>{const count=o.count||0,chem=o.chem??null,cls=PV.cardClass(p),mini=!!o.mini;if(mini){const el=o.button===false?'div':'button',data=o.button===false?'':` data-player="${p.id}"`;return `<${el} class="mini-card pv6-mini pv7-card pv7-mini ${cls}"${data} aria-label="${PV.esc(p.name)} ${p.ovr}">${count>1?`<span class="dupe">x${count}</span>`:''}${body(p,chem)}</${el}>`}return `<article class="pv6-card pv7-card pv7-full ${cls}" aria-label="${PV.esc(p.name)} ${p.ovr}">${body(p,chem)}</article>`};
})();