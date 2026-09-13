(function(){
'use strict';
const PV=window.PV4,$=s=>document.querySelector(s);
PV.nav=s=>{PV.ui.screen=s;PV.closeSheet();if(s==='academy'&&!PV.ui.quiz)PV.newQuiz();PV.render()};
function click(e){
 const nav=e.target.closest('[data-nav]');if(nav)return PV.nav(nav.dataset.nav);
 const pack=e.target.closest('[data-open-pack]');if(pack)return PV.openPack(pack.dataset.openPack);
 const player=e.target.closest('[data-player]');if(player)return PV.showPlayer(player.dataset.player);
 if(e.target.closest('[data-filters]'))return PV.showFilters();
 if(e.target.closest('[data-apply-filters]'))return PV.applyFilters();
 if(e.target.closest('[data-auto-xi]'))return PV.autoXI();
 if(e.target.closest('[data-clear-xi]'))return PV.clearXI();
 const slot=e.target.closest('[data-slot]');if(slot&&PV.ui.screen==='squad')return PV.openSquadPicker(slot.dataset.slot);
 if(e.target.closest('[data-start-draft]'))return PV.startDraft();
 const ds=e.target.closest('[data-draft-slot]');if(ds)return PV.openDraftPick(ds.dataset.draftSlot);
 if(e.target.closest('[data-finish-draft]'))return PV.finishDraft();
 if(e.target.closest('[data-reset-draft]'))return PV.resetDraft();
 const prev=e.target.closest('[data-preview-sbc]');if(prev)return PV.previewSbc(prev.dataset.previewSbc);
 const sub=e.target.closest('[data-submit-sbc]');if(sub)return PV.previewSbc(sub.dataset.submitSbc);
 const conf=e.target.closest('[data-confirm-sbc]');if(conf)return PV.doSbc(conf.dataset.confirmSbc);
 const ans=e.target.closest('[data-answer]');if(ans)return PV.answerQuiz(+ans.dataset.answer,ans);
 if(e.target.closest('[data-claim]'))return PV.claimAll();
 const obj=e.target.closest('[data-objective]');if(obj){const o=PV.OBJECTIVES.find(x=>x.id===obj.dataset.objective);if(o&&!PV.state.objectivesClaimed[o.id]&&o.get()>=o.goal){PV.state.objectivesClaimed[o.id]=1;PV.reward(o.reward);PV.render()}return}
 if(e.target.closest('[data-close-results]'))return PV.closeResults();
 const again=e.target.closest('[data-again]');if(again){const id=again.dataset.again;$('#overlay').className='overlay hidden';return PV.openPack(id)}
}
function input(e){if(e.target.id==='clubSearch'){PV.ui.filters.q=e.target.value;const pos=e.target.selectionStart;PV.render();requestAnimationFrame(()=>{const x=$('#clubSearch');x?.focus();try{x?.setSelectionRange(pos,pos)}catch{}})}if(e.target.id==='marketSearch'){PV.ui.marketQ=e.target.value;const pos=e.target.selectionStart;PV.render();requestAnimationFrame(()=>{const x=$('#marketSearch');x?.focus();try{x?.setSelectionRange(pos,pos)}catch{}})}}
function change(e){if(e.target.id==='marketSort'){PV.ui.marketSort=e.target.value;PV.render()}}
document.addEventListener('click',click);document.addEventListener('input',input);document.addEventListener('change',change);
$('#sheetClose').onclick=PV.closeSheet;$('#sheet').onclick=e=>{if(e.target.id==='sheet')PV.closeSheet()};
document.addEventListener('pv:state',()=>{const c=$('#coins'),l=$('#level');if(c)c.textContent=new Intl.NumberFormat('es-ES').format(PV.state.coins);if(l)l.textContent=PV.level()});
PV.render();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();