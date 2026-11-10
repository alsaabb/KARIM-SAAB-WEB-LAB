/* KARIM SAAB Video Articles V1.0 — source-driven and non-fabricated.
   The transcript and article are displayed only when approved in the Google Drive master.
   Existing video source and routing remain unchanged.
 */
(function(){
 'use strict';
 const master=window.KARIM_VIDEO_ARTICLES_SOURCE;
 if(!master || !Array.isArray(master.videos))return;
 const ar=()=>state.lang==='ar';
 const L=(a,e)=>ar()?a:e;
 const safe=x=>esc(String(x==null?'':x));
 const originalMaster='https://drive.google.com/file/d/1lm_1Z5r5R3C21QxIb3ZIZtWlXG8sStl_/view';
 const t=(x)=>safe(ar()?x.title_ar:x.title_en);
 const caption=(x)=>safe(ar()?x.caption_ar:x.caption_en);
 function panels(x){
  const transcriptOK=x.transcript_status==='approved'&&typeof x.transcript_ar==='string'&&x.transcript_ar.trim();
  const articleOK=x.article_status==='approved'&&Array.isArray(x.article_paragraphs_ar)&&x.article_paragraphs_ar.length>0;
  const article=articleOK ? x.article_paragraphs_ar.map(p=>'<p>'+safe(p)+'</p>').join('') : '<p>'+L('المقال الكامل قيد التوثيق. لن ننسب للمقطع كلامًا لم يُطابق بالصوت والصورة.','The full article is awaiting verification against the actual recording. No unsupported quotations will be attributed to the speaker.')+'</p>';
  const transcript=transcriptOK?'<pre class="ks-va-transcript">'+safe(x.transcript_ar)+'</pre>': '<p>'+L(x.transcript_status==='requires_review_mismatch'?'يوجد تفريغ آلي أولي تحت المراجعة، لكن محتواه لا يتطابق بوضوح مع عنوان الملف. لم يُعتمد للنشر.':'لا يوجد تفريغ نصي معتمد لهذا الفيديو حاليًا.','No verified transcript is available for publication. Automated recognition is being reviewed.')+'</p>';
  const tags=(x.tags||[]).map(tag=>'<span class="ks-va-tag">'+safe(tag)+'</span>').join('');
  return '<section class="ks-va-section" id="ks-va-article" aria-label="'+L('معلومات المقال والتفريغ','Article and transcript information')+'">'+
   '<header class="ks-va-head"><div><small>KARIM SAAB / VIDEO ARTICLES V1.0</small><h2>'+t(x)+'</h2><p class="ks-va-author">'+L('بقلم وتقديم: عبدالكريم بن إبراهيم الصعب','By Abdulkarim bin Ibrahim Al Saab')+'</p><p class="ks-va-caption">'+caption(x)+'</p></div></header>'+
   '<div class="ks-va-toggle-row"><button type="button" class="ks-va-toggle" data-va-target="article" aria-expanded="false" aria-controls="ks-va-article-panel">'+L('اقرأ المقال الكامل','Read full article')+(articleOK?'':' · '+L('قيد التوثيق','Pending'))+'</button>'+
   '<button type="button" class="ks-va-toggle" data-va-target="transcript" aria-expanded="false" aria-controls="ks-va-transcript-panel">'+L('التفريغ النصي للفيديو','Video transcript')+(transcriptOK?'':' · '+L('قيد المراجعة','Pending'))+'</button></div>'+
   '<div id="ks-va-article-panel" class="ks-va-panel" hidden>'+article+'</div><div id="ks-va-transcript-panel" class="ks-va-panel" hidden>'+transcript+'</div>'+
   '<div class="ks-va-tags" aria-label="'+L('وسوم المحتوى','Content tags')+'">'+tags+'</div>'+
   '<p class="ks-va-provenance">'+L('الفيديو الأصلي محفوظ في Google Drive. المحتوى لا يُنشر إلا بعد مراجعة التفريغ واعتماد المقال.','Original video is archived on Google Drive. Transcripts and related articles require verification and approval before publication.')+ ' <a href="'+originalMaster+'" target="_blank" rel="noopener noreferrer">'+L('الفهرس التحريري','Editorial source manifest')+' ↗</a></p></section>';
 }
 function mount(){
  const route=(state.route||'').split('?')[0];
  const x=master.videos.find(v=>v.route===route);
  if(!x)return;
  const main=document.querySelector('#app > main');
  if(!main||main.querySelector('#ks-va-article'))return;
  const source=main.querySelector('.ks-ab-provenance');
  const element=document.createElement('div');element.innerHTML=panels(x);
  const section=element.firstElementChild;
  if(source)source.before(section);else main.appendChild(section);
  section.addEventListener('click',function(e){
    const button=e.target.closest('[data-va-target]');
    if(!button)return;
    const key=button.dataset.vaTarget;
    const panel=section.querySelector('#ks-va-'+key+'-panel');
    if(!panel)return;
    const opening=panel.hidden;
    panel.hidden=!opening;button.setAttribute('aria-expanded',String(opening));
  });
 }
 const prior=render;
 window.removeEventListener('hashchange',prior);
 render=function(){prior();mount();};
 window.addEventListener('hashchange',render);
 render();
})();
