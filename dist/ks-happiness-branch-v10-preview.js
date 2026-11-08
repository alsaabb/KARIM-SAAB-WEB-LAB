/* KARIM SAAB — V10 Happiness branch test — 2026-11-07.
 * Additive, reversible preview only; V09 files and original images unchanged.
 * Google Drive remains the media archive. No Drive permissions are changed.
 */
(function(){
'use strict';
const happinessVideos = [
  {slug:'happiness-not-for-sale', titleAr:'سعادة لاتشترى', titleEn:'Happiness Cannot Be Bought', id:'1-9HEiYT2r_oeexgCl0NfsvfmYZIdabUX'},
  {slug:'world-is-not-paradise', titleAr:'الدنيا ليست جنة ؟', titleEn:'The World Is Not Paradise?', id:'1h7wkXmYF42PkC3KEqi3KMGJguOQmcLMz'}
];
function hL(ar,en){return state.lang==='ar'?ar:en}
function hVideoTitle(v){return state.lang==='ar'?v.titleAr:v.titleEn}
function driveUrl(v){return 'https://drive.google.com/file/d/'+encodeURIComponent(v.id)+'/view'}
function embedUrl(v){return 'https://drive.google.com/file/d/'+encodeURIComponent(v.id)+'/preview'}
function videoRoute(v){return 'about/happiness/video/'+v.slug}
function previewCards(){
  return `<section class="ks-happiness-branches" aria-labelledby="ks-happiness-branches-heading">
  <div class="ks-happiness-branch-intro"><span class="eyebrow">KARIM SAAB / VIDEO STORIES</span>
   <h2 id="ks-happiness-branches-heading">${hL('فيديوهات خلّ السعادة عادة','Make Happiness a Habit — Videos')}</h2>
   <p>${hL('اختر عنوان الفيديو لفتح صفحته داخل الموقع. النسخ الأصلية محفوظة في Google Drive.','Select a title to open its own page on KARIM SAAB. Originals are stored in Google Drive.')}</p></div>
  <div class="ks-happiness-branch-grid">${happinessVideos.map((v,i)=>`<a class="ks-happiness-link-card" href="${path(videoRoute(v))}">
    <span class="ks-happiness-icon" aria-hidden="true">▶</span><span class="ks-happiness-card-copy"><small>${hL('الفيديو','VIDEO')} ${String(i+1).padStart(2,'0')}</small><strong>${esc(hVideoTitle(v))}</strong>${state.lang==='en'?`<small lang="ar" dir="rtl">${esc(v.titleAr)}</small>`:''}</span><span class="ks-happiness-link-arrow" aria-hidden="true">↗</span>
    </a>`).join('')}</div>
  <p class="ks-happiness-source-note">${hL('المشاهدة عبر Google Drive تخضع لصلاحيات مشاركة كل ملف.','Playback via Google Drive depends on each file’s sharing permissions.')}</p>
  </section>`
}
function videoPage(v){
 const title=esc(hVideoTitle(v));
 return `<main class="ks-happiness-video-page">
  ${pageHeader(title,hL('خلّ السعادة عادة — فيديو موثّق','Make Happiness a Habit — Archived Video'),'hero-desert.webp')}
  <section class="page-body"><div class="container ks-reading">
  <nav class="ks-happiness-crumbs" aria-label="${hL('مسار الصفحة','Breadcrumb')}"><a href="${path('about')}">${hL('من أنا','About Me')}</a><span aria-hidden="true"> / </span><a href="${path('about/happiness')}">${hL('خلّ السعادة عادة','Make Happiness a Habit')}</a></nav>
  <span class="eyebrow">KARIM SAAB / VIDEO STORY</span><h2>${title}</h2>
  <p>${hL('الفيديو الأصلي محفوظ ضمن أرشيف «خلّ السعادة عادة» في Google Drive.','The original video is kept in the Make Happiness a Habit archive on Google Drive.')}</p>
  <div class="ks-happiness-video-frame"><iframe title="${title}" src="${embedUrl(v)}" loading="lazy" allow="autoplay; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
  <p class="ks-happiness-access-note">${hL('إذا تعذّرت المشاهدة، افتح الملف في Google Drive. قد يحتاج الزائر إلى إذن وصول.','If playback is unavailable, open the original in Google Drive. Access permission may be required.')}</p>
  <div class="ks-happiness-actions"><a class="btn btn-gold" href="${driveUrl(v)}" target="_blank" rel="noopener noreferrer">${hL('شاهد الفيديو في Google Drive','Watch on Google Drive')} ↗</a><a class="btn btn-outline" href="${path('about/happiness')}">${hL('جميع فيديوهات القسم','All videos in this section')} ↩</a></div>
  </div></section></main>`;
}
function mountHappinessBranch(){
 const r=(state.route||'').split('?')[0];
 if(r==='about/happiness'){
  const reading=document.querySelector('#app > main .ks-reading');
  if(reading && !reading.querySelector('.ks-happiness-branches'))reading.insertAdjacentHTML('beforeend',previewCards());
 } else if(r.startsWith('about/happiness/video/')){
  const slug=r.slice('about/happiness/video/'.length);
  const vid=happinessVideos.find(v=>v.slug===slug);
  if(!vid)return;
  const main=document.querySelector('#app > main');
  if(main)main.outerHTML=videoPage(vid);
  document.title=hVideoTitle(vid)+' | KARIM SAAB';
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.content=hL('فيديو من أرشيف خلّ السعادة عادة — عبدالكريم الصعب.','Video from KARIM SAAB Make Happiness a Habit archive.');
 }
}
const beforeHappinessRender=render;
window.removeEventListener('hashchange',beforeHappinessRender);
render=function(){beforeHappinessRender();mountHappinessBranch();};
window.addEventListener('hashchange',render);
render();
})();
