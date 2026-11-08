/* KARIM SAAB — October 27, 2026. Additive, reversible release enhancements.
 * No existing route or page is replaced. No orders are accepted.
 * Only owner-confirmed book titles and existing journey index entries are used.
 */
'use strict';
(function(){
const BILINGUAL=(ar,en)=>state.lang==='ar'?ar:en;
const bookReady=[
 {ar:'كنت 150 كجم ثم ولدت من جديد',en:'I Weighed 150 kg — A New Beginning',cover:'assets/books/150kg-author.webp',route:'content/book-150kg'},
 {ar:'كتاب اليابان',en:'The Japan Journal',cover:'assets/books/japan-journal-author.webp',route:'books'},
 {ar:'شيل الماء على الماء',en:'Carrying Water on Water',cover:'assets/books/shiel-author.webp',route:'content/book-shiel'},
 {ar:'كيف وُلدت English؟ وما معنى England؟',en:'How Was English Born? What Does England Mean?',cover:'assets/books/english-origins-author.webp',route:'content/book-english-origins'}
];
function icon(svgPath){return `<svg class="ready-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPath}</svg>`}
const pictograms=[
 ['family',icon('<circle cx="8" cy="6" r="2"/><circle cx="17" cy="8" r="1.8"/><path d="M4 20v-7a4 4 0 0 1 8 0v7M14 20v-6a3 3 0 0 1 6 0v6"/>'),'أب','Father'],
 ['business',icon('<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M10 13v2h4v-2"/>'),'رجل أعمال','Businessman'],
 ['adventure',icon('<path d="m2 20 7-10 4 6 3-4 6 8H2Z"/><path d="m7 13 2 2 2-2"/>'),'مغامر','Adventurer'],
 ['cycling',icon('<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 4 9 5 0-5-9H9M9 5h4"/>'),'راكب دراجة','Cyclist'],
 ['hiking',icon('<circle cx="13" cy="4" r="2"/><path d="m8 21 3-7 3 2 2 5M11 14l-1-6 5 3 2 3M7 10l-3 5M18 8l2 13"/>'),'رحّالة','Explorer'],
 ['inspire',icon('<circle cx="12" cy="12" r="9"/><path d="m12 6 3 6-3 6-3-6 3-6ZM12 3v3M12 18v3"/>'),'مُلهم','Motivator']
];
function addHero(){
 const hero=document.querySelector('main .hero');if(!hero)return;
 hero.classList.add('ready-cinematic');
 const btns=hero.querySelector('.hero-buttons');
 if(btns)btns.insertAdjacentHTML('afterend',`<div class="ready-roles" aria-label="${BILINGUAL('أدواري وشغفي','Roles and passions')}">${pictograms.map(([k,s,a,e])=>`<span class="ready-role" title="${BILINGUAL(a,e)}">${s}<span>${BILINGUAL(a,e)}</span></span>`).join('')}</div>`);
 const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='THINK  •  EXPLORE  •  CREATE  •  SHARE';
 const bottom=hero.querySelector('.hero-label');if(bottom)bottom.textContent=BILINGUAL('رحلات حقيقية • صور الغلاف توضيحية إلى أن نعتمد صورتي الأصلية','Real journeys • Header imagery is illustrative pending approval of my original photo');
}
const navTiles=[
 {ar:'من أنا',en:'About Me',to:'about',image:'assets/journal-desert.webp'},
 {ar:'مغامراتي',en:'Adventures',to:'journeys',image:'assets/cycling.webp'},
 {ar:'حكايات الطريق',en:'Stories from the Road',to:'stories-road',image:'assets/hiking.webp'},
 {ar:'كتبي',en:'My Books',to:'books',image:'assets/books/japan-journal-author.webp'},
 {ar:'تسوّق',en:'Shop',to:'products',image:'assets/perfume-japan-concept.webp'}
];
function tiles(){return `<section class="ready-feature-strip" aria-label="${BILINGUAL('استكشف أقسام الموقع','Explore site sections')}">${navTiles.map(t=>`<a href="${path(t.to)}" class="ready-feature-tile" style="--tile:url('${t.image}')"><span>${BILINGUAL(t.ar,t.en)}</span><small>${BILINGUAL('استكشف القسم','Explore')} ↗</small></a>`).join('')}</section>`}
const mapPins=[
 {x:49.5,y:35,ar:'أوروبا',en:'Europe',route:'journey/legacy-5'},
 {x:51.5,y:25,ar:'شمال أوروبا',en:'Northern Europe',route:'journey/legacy-11'},
 {x:58,y:44,ar:'السعودية',en:'Saudi Arabia',route:'journey/legacy-19'},
 {x:84.2,y:38,ar:'اليابان',en:'Japan',route:'journey/legacy-13'}
];
const continentPaths=[
 'M103 104 159 57 237 72 280 116 251 146 222 162 196 216 149 221 119 186 85 173Z',
 'M222 237 272 259 302 317 277 365 253 424 233 409 217 362 190 326Z',
 'M436 130 480 97 520 99 549 137 525 169 484 164 460 184 433 166Z',
 'M464 190 524 171 561 207 551 265 526 314 502 365 482 330 469 266Z',
 'M545 93 605 54 697 62 796 89 864 128 905 177 858 229 803 240 747 210 713 257 660 223 609 191 560 187Z',
 'M796 303 873 297 908 344 877 371 819 369 791 341Z',
 'M376 270 397 261 400 282 380 297Z'
];
function worldMap(){const bySlug=journeys.filter(j=>j.slug!=='legacy-14');let chips=bySlug.filter((j,i,a)=>a.findIndex(k=>k.region?.[1]===j.region?.[1])===i).map(j=>`<a href="${path('journey/'+j.slug)}">${esc(j.region[state.lang==='ar'?0:1])} <span aria-hidden="true">↗</span></a>`).join('');return `<section class="ready-map-section"><div class="container"><div class="ready-map-intro"><div><span class="ready-eyebrow">JOURNEYS AROUND THE WORLD</span><h2>${BILINGUAL('رحلاتي حول العالم','Journeys Around the World')}</h2><p>${BILINGUAL('من الأرشيف الموثّق: اختر دولة أو وجهة لاكتشاف رحلتها.','From the journey index: choose a region or destination to read its story.')}</p></div><a href="${path('journeys')}" class="ready-map-all">${BILINGUAL('كل الرحلات','All journeys')} ↗</a></div><div class="ready-map-visual"><svg class="ready-world" viewBox="0 0 1000 480" role="img" aria-label="${BILINGUAL('رسم توضيحي تقريبي لقارات العالم','Illustrative outline of world continents')}"><defs><radialGradient id="readyMapGradient"><stop stop-color="#294d5a"/><stop offset="1" stop-color="#102332"/></radialGradient></defs><rect width="1000" height="480" fill="url(#readyMapGradient)"/><g class="ready-graticule">${[100,200,300,400].map(y=>`<path d="M0 ${y}H1000"/>`).join('')}${[125,250,375,500,625,750,875].map(x=>`<path d="M${x} 0V480"/>`).join('')}</g><g class="ready-land">${continentPaths.map(p=>`<path d="${p}"/>`).join('')}</g></svg>${mapPins.map((p,i)=>`<a class="ready-map-pin" href="${path(p.route)}" style="left:${p.x}%;top:${p.y}%" title="${BILINGUAL(p.ar,p.en)}" aria-label="${BILINGUAL(p.ar,p.en)}"><span class="ready-map-dot">✦</span><span class="ready-pin-label">${BILINGUAL(p.ar,p.en)}</span></a>`).join('')}</div><div class="ready-region-links">${chips}</div><p class="ready-map-disclaimer">${BILINGUAL('الخريطة تقريبية وتوضيحية، ولا تمثل مسارات الدراجات أو مواقعها الدقيقة. عرضنا فقط المناطق التي لها روابط في أرشيف المغامرات.','Stylized approximate map, not a recording of routes or exact locations. Only regions with existing archive links are displayed.')}</p></div></section>`}
function archivalStories(){return `<section class="ready-stories-section"><div class="container"><div class="ready-section-line"><div><span class="ready-eyebrow">DOCUMENTARY & STORIES</span><h2>${BILINGUAL('مختارات من الأفلام وحكايات الطريق','Selected Films & Stories')}</h2></div><a href="${path('stories-road')}">${BILINGUAL('كل الحكايات','All stories')} ↗</a></div><div class="ready-media-grid"><a class="ready-media-card" href="${path('journey/legacy-5')}"><img loading="lazy" src="assets/journal-mountains.webp" alt="${BILINGUAL('صورة توضيحية وليست صورة الرحلة','Illustrative image, not a journey photograph')}"><div><span class="ready-media-type">FRANCE</span><strong>${BILINGUAL('بداية الحكاية من باريس','A Journey Beginning in Paris')}</strong><small>${BILINGUAL('رحلة بالدراجة موثّقة في الأرشيف','Documented cycling story')}</small></div></a><a class="ready-media-card" href="${path('stories-road')}"><img loading="lazy" src="assets/journal-desert.webp" alt="${BILINGUAL('مشهد توضيحي للصحراء','Illustrative desert scene')}"><div><span class="ready-media-type">STORIES FROM THE ROAD</span><strong>${BILINGUAL('حكايات من الطريق','Stories from the Road')}</strong><small>${BILINGUAL('المواقف والتجارب المتاحة للقراءة','Stories currently available to read')}</small></div></a></div></div></section>`}
function booksSection(){return `<section class="ready-books-section" id="ready-books"><div class="container"><div class="ready-section-line"><div><span class="ready-eyebrow">KARIM SAAB BOOKS & GIFTS</span><h2>${BILINGUAL('أربعة كتب مكتملة — الورقي والإلكتروني','Four Completed Books — Print & Digital')}</h2><p>${BILINGUAL('أكد المؤلف اكتمال الكتب وتوفّر النسخ الورقية. الأسعار والطلب الإلكتروني قيد التجهيز.','The author confirms the books are complete and printed copies are available. Prices and online checkout are not yet configured.')}</p></div><a href="${path('books')}">${BILINGUAL('مكتبة المؤلف','Author’s library')} ↗</a></div><div class="ready-book-grid">${bookReady.map((b,i)=>`<a href="${path(b.route)}" class="ready-book-card"><div class="ready-book-cover"><img src="${b.cover}" loading="lazy" alt="${BILINGUAL('غلاف كتاب','Book cover')}: ${esc(BILINGUAL(b.ar,b.en))}"></div><div class="ready-book-details"><strong>${esc(BILINGUAL(b.ar,b.en))}</strong><span>${BILINGUAL('نسختان ورقية وإلكترونية — البيع قريبًا','Print & digital — checkout coming later')}</span><small>${BILINGUAL('اقرأ عن الكتاب','About this book')} ↗</small></div></a>`).join('')}</div><p class="ready-books-note">${BILINGUAL('تُضاف الباقات الترويجية والدفع والشحن بعد اعتماد الأسعار وربط منصة المتجر. لا توجد أزرار شراء فعّالة حاليًا.','Bundles, payment and shipping follow when real prices and an ecommerce platform are configured. No checkout is live.')}</p></div></section>`}
function injectReady(){const main=document.querySelector('#app > main');if(!main)return;const r=state.route||'';if(r===''){addHero();const hero=main.querySelector('.hero');if(hero){hero.insertAdjacentHTML('afterend',tiles()+worldMap()+archivalStories());}}
 if(r==='products'||r==='books') {const pane=main.querySelector('.page-body');if(pane)pane.insertAdjacentHTML('afterbegin',booksSection());}
 // Older single-HTML preview embeds the same approved images in an in-memory map.
 // This is limited to presentation assets; the public ZIP continues to use normal files.
 if(window.EMBED_ASSETS){
   main.querySelectorAll('.ready-feature-tile').forEach(el=>{const css=el.getAttribute('style')||'';const match=css.match(/assets\/([\w-]+\.webp)/);if(match&&window.EMBED_ASSETS[match[1]])el.style.setProperty('--tile','url("'+window.EMBED_ASSETS[match[1]]+'")')});
   main.querySelectorAll('.ready-media-card img,.ready-book-card img').forEach(img=>{const file=img.getAttribute('src').split('/').pop();if(window.EMBED_ASSETS[file])img.src=window.EMBED_ASSETS[file]});
 }
}
const previous=render;
window.removeEventListener('hashchange',previous);
render=function(){previous();injectReady()};
window.addEventListener('hashchange',render);
render();
})();
