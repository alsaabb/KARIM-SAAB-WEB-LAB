/* KARIM SAAB shared navigation/footer proposal. Preview branch only. */
(function(){
'use strict';
const groups=[
 {test:r=>r==='products'||r.startsWith('shop/'),ar:'منتجاتي',en:'My Products',cta:'products'},
 {test:r=>r==='journeys'||r.startsWith('journey/')||r.startsWith('adventures/')||r==='stories-road',ar:'مغامراتي',en:'My Adventures',cta:'journeys'},
 {test:r=>r==='books'||r.startsWith('book/'),ar:'كتبي',en:'My Books',cta:'books'},
 {test:r=>r==='stories'||r.startsWith('story/')||r==='travel-guides'||r.startsWith('guide/'),ar:'القصص والمقالات',en:'Stories & Articles',cta:'stories'},
 {test:r=>r==='about'||r.startsWith('about/'),ar:'عن KARIM SAAB',en:'About KARIM SAAB',cta:'about'},
 {test:r=>r==='contact'||r==='links',ar:'تواصل',en:'Connect',cta:'links'}
];
function safeSocial(){return typeof SOCIAL_PROFILES!=='undefined'?SOCIAL_PROFILES.filter(s=>s&&s.url&&/^https:\/\//.test(s.url)&&s.id!=='pinterest'):[]}
function customize(){
 const r=state.route||'', ar=state.lang==='ar';
 const group=groups.find(g=>g.test(r))||{ar:'الرئيسية',en:'Home',cta:''};
 const head=document.querySelector('.site-header'), foot=document.querySelector('footer.footer');
 if(!head||!foot)return;
 head.classList.add('ks-shared-header');foot.classList.add('ks-shared-footer');
 head.dataset.section=group.cta||'home';foot.dataset.section=group.cta||'home';
 let h=head.querySelector('.ks-section-strip');
 if(!h){h=document.createElement('div');h.className='ks-section-strip';head.appendChild(h)}
 h.textContent=(ar?group.ar:group.en)+' · KARIM SAAB';
 const nav=foot.querySelector('.footer-social-list');
 if(nav){nav.innerHTML=safeSocial().map(s=>'<a class="ks-social-chip" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(s.name)+'"><span aria-hidden="true">'+esc(s.monogram||'•')+'</span><span>'+esc(s.name)+'</span></a>').join('');}
 let section=foot.querySelector('.ks-footer-section');
 if(!section){section=document.createElement('div');section.className='ks-footer-section';foot.querySelector('.container')?.prepend(section)}
 const label=ar?group.ar:group.en, go=ar?'استكشف القسم':'Explore section';
 section.innerHTML='<div><span class="ks-footer-kicker">KARIM SAAB</span><strong>'+esc(label)+'</strong></div><a href="'+path(group.cta)+'">'+go+' ↗</a>';
 // Mark legacy stock/illustrative assets for review without altering approved imagery.
 document.querySelectorAll('main img').forEach(img=>{
  if(/(?:journal-desert|journal-greece|journal-mountains|hero-desert|hero-europe|perfume-japan-concept)\.webp/.test(img.getAttribute('src')||'')){
   img.dataset.assetReview='illustrative';
  }
 });
}
const prior=render;
window.removeEventListener('hashchange',prior);
render=function(){prior();customize()};
window.addEventListener('hashchange',render);
render();
})();
