/* PREVIEW ONLY — Happiness story, mapped to the approved Life After Sixty V9 visual pattern.
 * The YouTube Shorts URL is supplied by the owner. Its description/article text was NOT
 * available for verification at review time. Never synthesize article paragraphs.
 * Do not merge this branch or deploy to GitHub Pages before explicit owner approval.
 */
(function(){
 'use strict';
 var TARGET='about/happiness/video/world-is-not-paradise';
 var VIDEO_ID='e8YffqIamRI';
 var SHORT_URL='https://www.youtube.com/shorts/'+VIDEO_ID;
 var DRIVE_URL='https://drive.google.com/file/d/1h7wkXmYF42PkC3KEqi3KMGJguOQmcLMz/view';
 function isArabic(){return state.lang!=='en';}
 function t(a,e){return isArabic()?a:e;}
 function safe(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
 function locationOf(route){return '#/'+(isArabic()?'ar':'en')+'/'+route;}
 function preview(){
  var heading=t('الدنيا ليست جنة؟','The World Is Not Paradise?');
  var description=t('فيديو من سلسلة «خلّ السعادة عادة».','A video from the Make Happiness a Habit series.');
  return '<main class="ks-h11" dir="'+(isArabic()?'rtl':'ltr')+'" data-ks-h11-source="owner-supplied-youtube-link">'+
   '<div class="ks-h11-wrap">'+
    '<nav class="ks-h11-crumbs" aria-label="'+t('مسار الصفحة','Breadcrumb')+'">'+
     '<a href="'+locationOf('about')+'">'+t('من أنا','About Me')+'</a><span> / </span>'+
     '<a href="'+locationOf('about/happiness')+'">'+t('خلّ السعادة عادة','Make Happiness a Habit')+'</a></nav>'+
    '<header class="ks-h11-head"><p class="ks-h11-eyebrow">KARIM SAAB | '+t('قصة مصورة','VIDEO STORY')+'</p>'+
     '<h1>'+safe(heading)+'</h1><p>'+safe(description)+'</p></header>'+
    '<div class="ks-h11-split">'+
     '<aside class="ks-h11-video-pane" id="ks-h11-video-pane" aria-label="'+t('الفيديو','Video')+'">'+
      '<div class="ks-h11-player" id="ks-h11-player">'+
       '<button type="button" class="ks-h11-poster" data-ks-h11-play aria-label="'+t('شاهد الفيديو: ','Watch video: ')+safe(heading)+'">'+
        '<img class="ks-h11-cover" src="assets/happiness/world-is-not-paradise-youtube-poster.jpg" data-ks-h11-thumb alt="'+safe(heading)+'" decoding="async">'+
        '<span class="ks-h11-overlay"><span class="ks-h11-cta">'+t('شاهد الفيديو','Watch video')+'</span></span>'+
       '</button>'+
      '</div>'+
      '<p class="ks-h11-source-links">'+
       '<a href="'+SHORT_URL+'" target="_blank" rel="noopener noreferrer">'+t('مشاهدة في YouTube','Watch on YouTube')+'</a>'+
       ' <span aria-hidden="true"> · </span> '+
       '<a href="'+DRIVE_URL+'" target="_blank" rel="noopener noreferrer">'+t('ملف الفيديو السابق في Google Drive','Existing Drive video file')+'</a></p>'+
     '</aside>'+
     '<article class="ks-h11-article-pane" id="ks-h11-article-pane" aria-label="'+t('المقال','Article')+'">'+
      '<h2>'+t('المقال المصاحب للفيديو','Article accompanying the video')+'</h2>'+
      '<div class="ks-h11-pending" role="status">'+
       '<p>'+t('هذا نموذج مراجعة للتصميم. ذكر صاحب الفيديو أن المقال الكامل موجود في وصف YouTube، ولكن تعذّر التحقق من نص الوصف باستخدام أدوات الوصول الحالية.','This is a design review. The owner confirmed that the complete article is in the YouTube description, but the description could not be retrieved with the tools currently available.')+'</p>'+
       '<p>'+t('سيُدرج النص كاملًا هنا بعد الحصول على نسخة الوصف ومطابقتها، ثم تُضاف مشاركة المقال المستقلة. لن ننشئ نصًا غير موثّق.','Once the actual description is provided and verified, the full article and its separate share link can be added. No unverified text will be fabricated.')+'</p>'+
      '</div>'+
     '</article>'+
    '</div>'+
   '</div></main>';
 }
 function mount(){
  if((state.route||'').split('?')[0]!==TARGET)return;
  var main=document.querySelector('#app > main');
  if(!main)return;
  if(!main.classList.contains('ks-h11')){main.outerHTML=preview();main=document.querySelector('#app > main.ks-h11');}
  if(!main)return;
  var image=main.querySelector('[data-ks-h11-thumb]');
  if(image && !image.dataset.fallbackBound){
   image.dataset.fallbackBound='1';
   var formats=['sddefault','hqdefault'];var index=0;
   function fallback(){
    if(index<formats.length)image.src='https://i.ytimg.com/vi/'+VIDEO_ID+'/'+formats[index++]+'.jpg';
   }
   image.addEventListener('error',fallback);
   image.addEventListener('load',function(){if(image.naturalWidth<=120)fallback();});
   if(image.complete&&image.naturalWidth<=120)fallback();
  }
  var poster=main.querySelector('[data-ks-h11-play]');
  if(poster && !poster.dataset.bound){
   poster.dataset.bound='1';
   poster.addEventListener('click',function(){
    var player=main.querySelector('#ks-h11-player');if(!player)return;
    var iframe=document.createElement('iframe');
    iframe.title=t('الدنيا ليست جنة؟ — فيديو','The World Is Not Paradise? — Video');
    iframe.src='https://www.youtube-nocookie.com/embed/'+VIDEO_ID+'?rel=0&playsinline=1&autoplay=1';
    iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.setAttribute('loading','eager');
    player.replaceChildren(iframe);
   });
  }
  document.title=t('الدنيا ليست جنة؟','The World Is Not Paradise?')+' | KARIM SAAB';
  var meta=document.querySelector('meta[name="description"]');if(meta)meta.content=t('الدنيا ليست جنة؟ — فيديو من خلّ السعادة عادة.','The World Is Not Paradise? A Make Happiness a Habit video.');
 }
 var previous=render;
 window.removeEventListener('hashchange',previous);
 render=function(){previous();mount();};
 window.addEventListener('hashchange',render);
 render();
})();
