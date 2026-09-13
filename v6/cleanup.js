(function(){
'use strict';
const PV=window.PV4;
const oldFlag=PV.flag;
PV.flag=n=>({'Corea del Sur':'🇰🇷','Nigeria':'🇳🇬'}[n]||oldFlag(n));
const render=PV.render;
PV.render=()=>{
  render();
  document.querySelectorAll('[data-nav="academy"]').forEach(x=>x.remove());
  document.querySelectorAll('.profile > div').forEach(x=>{if(x.textContent?.toUpperCase().includes('QUIZ'))x.remove()});
};
})();