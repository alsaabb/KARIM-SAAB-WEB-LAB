/* KARIM SAAB • About Me section shell and the approved Happiness landing page V2.
 * Keeps the existing global header/footer; adds context only to About routes.
 * Does not change other sections, previously approved article routes, video files,
 * social accounts or Google Drive permissions.
 */
(function(){
 'use strict';
 var DATA_URL='data/happiness-stories-v1.json?v=20261113-about-hub-v2';
 var allowed=['happiness-not-for-sale','world-is-not-paradise'];
 var data=null,loading=null,loadFailed=false,requestSerial=0;
 var navItems=[
  {route:'about',ar:'من أنا',en:'About Me'},
  {route:'about/happiness',ar:'خلّ السعادة عادة',en:'Make Happiness a Habit'},
  {route:'about/after-sixty',ar:'الحياة بعد الستين',en:'Life After Sixty'},
  {route:'about/health',ar:'صحتك',en:'Your Health'},
  {route:'about/why-adventures',ar:'لماذا أحب المغامرات',en:'Why I Love Adventure'},
  {route:'about/business',ar:'رحلتي في الأعمال',en:'My Business Journey'},
  {route:'about/volunteer-programs',ar:'العمل التطوعي',en:'Volunteering'},
  {route:'about/source-archive',ar:'الأرشيف التعريفي',en:'Background Archive'}
 ];
 var aboutContentRoutes=new Set(['content/founder','content/entities','content/philosophy','content/method','content/volunteer','content/bio','content/community-wells','content/community-iftar-eg','content/community-iftar-srilanka','content/community-orphans']);
 function ar(){return state.lang!=='en'}
 function tr(a,en){return ar()?a:en}
 function escH(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]})}
 function route(r){return '#/'+(ar()?'ar':'en')+'/'+r}
 function current(){return (state.route||'').split('?')[0]}
 function partOfAbout(r){return r==='about'||r.indexOf('about/')===0||aboutContentRoutes.has(r)}
 function activePart(r){
  if(r.indexOf('about/happiness')===0)return 'about/happiness';
  if(r.indexOf('about/after-sixty')===0)return 'about/after-sixty';
  if(r.indexOf('about/health')===0)return 'about/health';
  if(r.indexOf('about/volunteer')===0||r==='about/mosques'||r==='about/quran-circles'||r.indexOf('content/community-')===0)return 'about/volunteer-programs';
  if(r==='about/source-archive'||aboutContentRoutes.has(r))return 'about/source-archive';
  return r;
 }
 function sectionLinks(r){
  var active=activePart(r);
  return navItems.map(function(x){
    var selected=active===x.route;
    return '<a href="'+route(x.route)+'" class="ks-about-link'+(selected?' is-current':'')+'"'+(selected?' aria-current="page"':'')+'>'+escH(tr(x.ar,x.en))+'</a>';
  }).join('');
 }
 function ensureShell(){
  var r=current(),header=document.querySelector('#app > header.site-header'),foot=document.querySelector('#app > footer.footer');
  if(!header||!foot||!partOfAbout(r))return;
  header.classList.add('ks-about-header');
  foot.classList.add('ks-about-footer');
  var nav=header.querySelector(':scope > nav.ks-about-section-nav');
  if(!nav){
    nav=document.createElement('nav');
    nav.className='ks-about-section-nav';
    nav.setAttribute('aria-label',tr('التنقل بين صفحات من أنا','About Me section navigation'));
    var strip=header.querySelector(':scope > .ks-section-strip');
    if(strip)strip.insertAdjacentElement('afterend',nav);
    else header.appendChild(nav);
  }
  nav.setAttribute('aria-label',tr('التنقل بين صفحات من أنا','About Me section navigation'));
  nav.innerHTML='<div class="ks-about-nav-track">'+sectionLinks(r)+'</div>';
  var container=foot.querySelector(':scope > .container');
  if(!container)return;
  var block=container.querySelector(':scope > .ks-about-footer-nav');
  if(!block){
    block=document.createElement('nav');
    block.className='ks-about-footer-nav';
    var section=container.querySelector(':scope > .ks-footer-section');
    if(section)section.insertAdjacentElement('afterend',block);
    else container.prepend(block);
  }
  block.setAttribute('aria-label',tr('روابط صفحات من أنا','About Me page links'));
  block.innerHTML='<div class="ks-about-footer-head"><span>KARIM SAAB / ABOUT ME</span><strong>'+
    tr('اكتشف صفحات «من أنا»','Explore About Me')+'</strong><p>'+
    tr('مقالات وتجارب إنسانية وحياة ومغامرة، ضمن هوية الموقع الرئيسية.','Articles, personal reflections, adventures and life experiences within the main KARIM SAAB website.')+
    '</p></div><div class="ks-about-footer-links">'+sectionLinks(r)+'</div>';
 }
 function validate(raw){
  if(!raw||!Array.isArray(raw.entries))throw Error('Missing Happiness manifest');
  var items=allowed.map(function(slug){return raw.entries.find(function(e){return e.slug===slug;})});
  if(items.some(function(e){return !e||!e.title_ar||!e.title_en||!e.excerpt_ar||!e.excerpt_en||!/^[\w-]{11}$/.test(e.youtube_id)||!Array.isArray(e.sections)||e.sections.length<2;})){
    throw Error('Happiness list content must be from approved bilingual stories');
  }
  return items;
 }
 function getStories(){
  if(data)return Promise.resolve(data);
  if(loadFailed)return Promise.reject(Error('Approved manifest unavailable'));
  if(loading)return loading;
  loading=fetch(DATA_URL).then(function(resp){if(!resp.ok)throw Error('Could not fetch approved Happiness manifest');return resp.json()})
   .then(function(raw){data=validate(raw);return data})
   .catch(function(err){loadFailed=true;console.warn('Keeping verified archive preview; Happiness hub data missing',err);throw err;});
  return loading;
 }
 function storyCard(story,i){
  var label=escH(tr(story.title_ar,story.title_en));
  var sub=escH(tr(story.subtitle_ar,story.subtitle_en));
  var excerpt=escH(tr(story.excerpt_ar,story.excerpt_en));
  var page=route(story.route),preview='assets/happiness/'+story.slug+'-youtube-poster.jpg';
  var lang=ar()?'ar':'en';
  var videoShare='share/'+lang+'/happiness-'+story.slug+'-video.html';
  var articleShare='share/'+lang+'/happiness-'+story.slug+'-article.html';
  return '<article class="ks-hub-card" data-story="'+story.slug+'">'+
    '<a class="ks-hub-poster" href="'+page+'?focus=video" aria-label="'+escH(tr('شاهد فيديو: ','Watch video: ')+tr(story.title_ar,story.title_en))+'">'+
     '<img src="'+preview+'" loading="lazy" decoding="async" width="440" height="780" alt="'+label+'">'+
     '<span class="ks-hub-poster-shade"><span class="ks-hub-cta">'+tr('شاهد الفيديو','Watch video')+'</span></span></a>'+
    '<div class="ks-hub-card-body">'+
     '<div class="ks-hub-number">0'+(i+1)+' <span aria-hidden="true">/</span> '+tr('فيديو ومقال','VIDEO & ARTICLE')+'</div>'+
     '<h2><a href="'+page+'">'+label+'</a></h2>'+
     '<h3>'+sub+'</h3>'+
     '<p>'+excerpt+'</p>'+
     '<a class="ks-hub-read" href="'+page+'?focus=article">'+tr('شاهد الفيديو واقرأ المقال','Watch the video & read the article')+' <span aria-hidden="true">↗</span></a>'+
     '<div class="ks-hub-share"><a href="'+videoShare+'">'+tr('مشاركة الفيديو','Share video')+'</a><a href="'+articleShare+'">'+tr('مشاركة المقال','Share article')+'</a>'+
     '<a href="'+escH(story.archive_folder_url)+'" target="_blank" rel="noopener noreferrer">'+tr('مجلد القصة','Story folder')+'</a></div>'+
    '</div></article>';
 }
 function home(stories){
  var cards=stories.map(storyCard).join('');
  return '<main class="ks-about-hub" data-ks-about-home="v2" dir="'+(ar()?'rtl':'ltr')+'">'+
   '<div class="ks-hub-width">'+
    '<nav class="ks-hub-breadcrumb" aria-label="'+tr('مسار التصفح','Breadcrumb')+'">'+
    '<a href="'+route('')+'">'+tr('الرئيسية','Home')+'</a> / <a href="'+route('about')+'">'+tr('من أنا','About Me')+'</a> / <span aria-current="page">'+tr('خلّ السعادة عادة','Make Happiness a Habit')+'</span></nav>'+
    '<header class="ks-hub-hero">'+
     '<span class="ks-hub-kicker">KARIM SAAB · MAKE HAPPINESS A HABIT</span>'+
     '<h1>'+tr('خلّ السعادة عادة','Make Happiness a Habit')+'</h1>'+
     '<p>'+tr('قصتان من الحياة، تجمعان بين عطاء لا يحتاج إلى ترجمة، وتأمل يذكّرنا بأن العمر أغلى من الخصومات. شاهد الفيديو، واقرأ المقال كاملًا بالعربية أو الإنجليزية.','Two true-life stories: a moment of kindness that needs no translation, and a reflection on why life is too precious for grudges. Watch each video and read the full article in Arabic or English.')+'</p>'+
    '</header>'+
    '<section class="ks-hub-stories" aria-labelledby="ks-hub-stories-title">'+
      '<div class="ks-hub-section-top"><span>'+tr('قصص وتجارب من الحياة','REAL-LIFE STORIES & REFLECTIONS')+'</span><h2 id="ks-hub-stories-title">'+tr('اختر القصة التي تود اكتشافها','Choose a story to explore')+'</h2></div>'+
      '<div class="ks-hub-grid">'+cards+'</div>'+
    '</section>'+
    '<div class="ks-hub-endnote"><p>'+tr('تُعرض النصوص والصور الأصلية المعتمدة داخل الموقع، وتبقى الملفات الأصلية محفوظة في أرشيف Google Drive.','The approved articles and original thumbnails are published here. The archived original files remain safely stored on Google Drive.')+'</p>'+
      '<a href="'+route('about')+'">'+tr('العودة إلى «من أنا»','Back to About Me')+'</a></div>'+
   '</div></main>';
 }
 function mount(){
  ensureShell();
  if(current()!=='about/happiness')return;
  var serial=++requestSerial,language=state.lang;
  getStories().then(function(stories){
    if(serial!==requestSerial||current()!=='about/happiness'||state.lang!==language)return;
    var main=document.querySelector('#app > main');
    if(!main)return;
    if(!main.classList.contains('ks-about-hub'))main.outerHTML=home(stories);
    document.title=tr('خلّ السعادة عادة','Make Happiness a Habit')+' | KARIM SAAB';
    var meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content=tr('خلّ السعادة عادة — سعادة لا تُشترى والدنيا ليست جنة؟ فيديوهات ومقالات بالعربية والإنجليزية من عبدالكريم الصعب.','Make Happiness a Habit: Happiness Cannot Be Bought and The World Is Not Paradise. Bilingual video stories by KARIM SAAB.');
  }).catch(function(){/* Keep existing original section visible if data is unavailable. */});
 }
 var previous=render;
 window.removeEventListener('hashchange',previous);
 render=function(){previous();mount()};
 window.addEventListener('hashchange',render);
 render();
})();
