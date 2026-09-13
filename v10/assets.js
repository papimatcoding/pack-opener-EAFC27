(function(){
'use strict';
const PV=window.PV4;
const OFFICIAL_CLUB_LOGOS={
  'CE Sabadell FC':'https://drop-assets.ea.com/images/aIrhRNIaKr0UWY3sbwxHo/1fa8ec800517b3804005ad84e26c4d80/l15021.png',
  'Bayern München':'https://drop-assets.ea.com/images/3p0dv1pGWIH6lGAKZssZKH/4f70d2c5a3c147f3e006c863e85e4993/l21.png',
  'FC Bayern München':'https://drop-assets.ea.com/images/3p0dv1pGWIH6lGAKZssZKH/4f70d2c5a3c147f3e006c863e85e4993/l21.png',
  'Inter':'https://intermilan.bynder.com/transform/9fced07f-27f9-4a98-a6cb-e083b3fd291d/Logo_Inter_Sito_4k?format=webp&io=transform%3Afill%2Cwidth%3A700&quality=100'
};
const OFFICIAL_PLAYER_PHOTOS={
  'edgar-gonzalez':'https://www.cesabadellfc.com/wp-content/uploads/2026/07/051-Edgar-819x1024.jpg',
  'ces-edgar-gonzalez':'https://www.cesabadellfc.com/wp-content/uploads/2026/07/051-Edgar-819x1024.jpg'
};
const teamCountry={'Bayern München':'Germany','FC Bayern München':'Germany','Inter':'Italy','Real Madrid':'Spain','FC Barcelona':'Spain','Atlético de Madrid':'Spain','Arsenal':'England','Liverpool':'England','Chelsea':'England','Manchester City':'England','Manchester United':'England','PSG':'France'};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b(fc|cf|sad|club|football|futbol|calcio|munchen|muenchen)\b/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const oldClubLogoFor=PV.clubLogoFor;
const oldClubLogoSync=PV.clubLogoSync;
// One-time purge: v9 could still have cached wrong basketball/Inter City badges and stale player photos.
if(PV.state.assetMatchVersion!==10){
  PV.state.clubLogos={};
  PV.state.photos={};
  PV.state.assetMatchVersion=10;
  PV.save?.();
}
PV.clubLogoSync=club=>OFFICIAL_CLUB_LOGOS[club]||oldClubLogoSync?.(club)||PV.state.clubLogos?.[club]||null;
PV.clubLogoFor=async club=>{
  if(!club)return null;
  if(OFFICIAL_CLUB_LOGOS[club])return OFFICIAL_CLUB_LOGOS[club];
  PV.state.clubLogos=PV.state.clubLogos||{};
  if(PV.state.clubLogos[club])return PV.state.clubLogos[club];
  // Fallback remains TheSportsDB, but only for football teams and with country/league sanity checks.
  try{
    const aliases={
      'Inter':['Inter Milan','Internazionale'],
      'Bayern München':['FC Bayern Munich','Bayern Munich'],
      'FC Bayern München':['FC Bayern Munich','Bayern Munich']
    };
    for(const q of [club,...(aliases[club]||[])]){
      const r=await fetch(`https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(q)}`),j=await r.json();
      const candidates=(j?.teams||[]).filter(t=>String(t.strSport||'').toLowerCase()==='soccer');
      const want=norm(club),country=teamCountry[club];
      const t=candidates.find(x=>{
        const names=[x.strTeam,x.strTeamAlternate].map(norm).filter(Boolean);
        const nameOK=names.some(n=>n===want||n.includes(want)||want.includes(n));
        const countryOK=!country||String(x.strCountry||'').toLowerCase()===country.toLowerCase();
        return nameOK&&countryOK;
      });
      const url=t?.strBadge||t?.strLogo||null;
      if(url){PV.state.clubLogos[club]=url;PV.save();return url}
    }
  }catch{}
  return null;
};
const oldPhotoFor=PV.photoFor;
PV.photoFor=async p=>{
  if(!p)return null;
  const trusted=OFFICIAL_PLAYER_PHOTOS[p.id]||OFFICIAL_PLAYER_PHOTOS[p.identity];
  if(trusted){PV.state.photos[p.id]=trusted;PV.save?.();return trusted}
  return oldPhotoFor?.(p)||null;
};
// Android renders the regional England tag emoji as a plain black flag on some devices.
// Use deterministic inline SVG flags for England/Scotland instead.
const oldFlag=PV.flag;
PV.flag=n=>{
  if(n==='Inglaterra')return '<span class="pv10-flag-svg england" aria-label="Inglaterra"><svg viewBox="0 0 60 36" role="img"><rect width="60" height="36" fill="#fff"/><rect x="25" width="10" height="36" fill="#c8102e"/><rect y="13" width="60" height="10" fill="#c8102e"/></svg></span>';
  if(n==='Escocia')return '<span class="pv10-flag-svg scotland" aria-label="Escocia"><svg viewBox="0 0 60 36" role="img"><rect width="60" height="36" fill="#0065bd"/><path d="M0 0L60 36M60 0L0 36" stroke="#fff" stroke-width="6"/></svg></span>';
  return oldFlag(n);
};
// Inter official brand image is a wide hero asset; crop its centred crest inside card badges.
const oldHydrate=PV.hydrate;
PV.hydrate=root=>{
  oldHydrate?.(root);
  const scope=root||document;
  scope.querySelectorAll('[data-club-badge="Inter"] img').forEach(img=>img.classList.add('pv10-inter-official'));
};
window.PV10_OFFICIAL_ASSETS=OFFICIAL_CLUB_LOGOS;
})();