/* KARIM SAAB — About Me editorial presentation V2.0.
   GitHub main/dist/data/about-master-v2.json is the current published index.
   Historical original Google Drive documents remain intact as source archives.
   Never present draft or index-only entries as approved long-form articles.
*/
(function(){
'use strict';
const master=window.KARIM_ABOUT_SOURCE;
if(!master || !Array.isArray(master.items))return;
const byRoute=Object.create(null);
master.items.forEach(x=>{byRoute[x.route]=x;});
const rootFolder=master.canonical_drive_folder_url;
const versionLink='https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/blob/main/dist/data/about-master-v2.json';
const isAr=()=>state.lang!=='en';
const L=(ar,en)=>isAr()?ar:en;
const h=(x)=>esc(String(x||''));
const label=x=>h(isAr()?x.title_ar:x.title_en);
const teaser=x=>h(isAr()?x.excerpt_ar:x.excerpt_en);
const local=(route)=>path(route);
function titleByRoute(r){const x=byRoute[r];return x?label(x):h(L('من أنا','About Me'));}
function status(x){
 const statuses={verified_media:['فيديو موثق','Archived video'],verified_article:['مقال معتمد','Approved article'],draft:['محتوى تمهيدي','Introductory content'],index_only:['عنوان أرشيفي','Index-only entry']};
 const t=statuses[x.source_status]||statuses.draft;
 return '<span class="ks-ab-status">'+h(L(t[0],t[1]))+'</span>';
}
function bread(segments){
 const items=[{name:L('الرئيسية','Home'),url:local('')},{name:L('من أنا','About Me'),url:local('about')}].concat(segments||[]);
 return '<nav class="ks-ab-breadcrumb" aria-label="'+L('مسار الصفحة','Breadcrumb')+'">'+items.map((x,i)=>x.url?'<a href="'+h(x.url)+'">'+h(x.name)+'</a>':'<strong>'+h(x.name)+'</strong>').join(' <span aria-hidden="true">›</span> ')+'</nav>';
}
function art(x){const kind=x.kind==='video'?'video':'symbol';return '<div class="ks-ab-art" data-kind="'+kind+'" role="img" aria-label="'+h(L('رسم رمزي للموضوع','Symbolic section illustration'))+'"><span class="ks-ab-art-symbol" aria-hidden="true">'+h(x.icon||'✦')+'</span></div>';}
function boxBody(x,body,head){return '<section class="ks-ab-panel">'+art(x)+'<div class="ks-ab-panel-body"><h2>'+h(head||L('عن هذا المحتوى','About this content'))+'</h2>'+body+'</div></section>';}
function cta(to,text,secondary){return '<a class="ks-ab-link'+(secondary?' secondary':'')+'" href="'+h(to)+'"'+(/^https:\/\//.test(to)?' target="_blank" rel="noopener noreferrer"':'')+'>'+h(text)+' <span aria-hidden="true">↗</span></a>';}
function docsPanel(x){
 let rows=[];
 if(x.source_document_url)rows.push(cta(x.source_document_url,L('ملف المحتوى الأصلي في Google Drive','Original content file on Google Drive'),true));
 if(x.source_folder_url)rows.push(cta(x.source_folder_url,L('مجلد هذا القسم في Google Drive','This section’s Google Drive folder'),true));
 return '<div class="ks-ab-actions">'+rows.join('')+'</div><p class="ks-ab-caption">'+h(L('قد يتطلب فتح الملفات الأصلية صلاحية وصول. لا يغيّر الموقع أذونات Google Drive.','Opening source files may require permission. The website does not change Google Drive access settings.'))+'</p>';
}
function provenance(){return '<aside class="ks-ab-provenance">'+h(L('المرجع المعتمد حاليًا: الإصدار V2 المنشور في موقع KARIM SAAB. ملفات Google Drive الأصلية محفوظة للأرشفة، وليست فهرسًا يتحكم بالموقع المنشور.','Current authority: the published KARIM SAAB V2 editorial index. Original Google Drive materials remain archival sources, not a competing live index.'))+' '+ '<a href="'+h(versionLink)+'" target="_blank" rel="noopener noreferrer">'+h(L('الفهرس المعتمد V2','Approved index V2'))+'</a></aside>';}
function tile(x){
 const desc=teaser(x);
 return '<a class="ks-ab-tile" href="'+h(local(x.route))+'"><span class="ks-ab-badgeicon" aria-hidden="true">'+h(x.icon)+'</span><span class="ks-ab-tilecopy"><strong>'+label(x)+'</strong><span class="ks-ab-desc">'+desc+'</span>'+status(x)+'</span><span class="ks-ab-arrow" aria-hidden="true">↗</span></a>';
}
function pageWrapper(title,desc,trail,content,icon){
 return '<main class="ks-about-main" dir="'+L('rtl','ltr')+'"><div class="ks-ab-container">'+bread(trail)+'<div class="ks-ab-kicker">KARIM SAAB / ABOUT ME · APPROVED SITE RELEASE</div><h1>'+h(title)+'</h1>'+(desc?'<p class="ks-ab-subtitle">'+h(desc)+'</p>':'')+content+provenance()+'</div></main>';
}
function aboutHome(){
 const primary=master.main_navigation.map(r=>byRoute[r]).filter(Boolean);
 const intro=L('صفحات عن الحياة والرحلات والعمل والمبادرات الإنسانية، مع روابط إلى الأصول المحفوظة في Google Drive. كل عنوان يعكس ما توفر في ملفه المرجعي دون إضافة وقائع غير موثقة.', 'Personal reflections, travel, business and humanitarian initiatives, linked to their originals on Google Drive. Entries reflect available source records without invented details.');
 return pageWrapper(L('من أنا','About Me'),intro,[],
 '<section class="ks-ab-rootcards">'+primary.map(tile).join('')+'</section><div class="ks-ab-actions">'+cta(rootFolder,L('فتح مكتبة «من أنا» الأصلية','Open original About Me library'),true)+'</div>', '✦');
}
function getTrail(x){
 if(x.route.startsWith('about/happiness/video/'))return [{name:L('خلّ السعادة عادة','Make Happiness a Habit'),url:local('about/happiness')},{name:L('الفيديو','Video')}];
 if(x.route.startsWith('content/community-')||['about/mosques','about/quran-circles','about/volunteering'].includes(x.route))return [{name:L('المبادرات الإنسانية','Humanitarian Initiatives'),url:local('about/volunteer-programs')},{name:isAr()?x.title_ar:x.title_en}];
 if(['content/founder','content/entities','content/philosophy','content/method','content/volunteer','content/bio'].includes(x.route))return [{name:L('المصادر والأرشيف التعريفي','Background Sources'),url:local('about/source-archive')},{name:isAr()?x.title_ar:x.title_en}];
 return [{name:isAr()?x.title_ar:x.title_en}];
}
function categoryPage(x){
 const children=(x.children||[]).map(r=>byRoute[r]).filter(Boolean);
 const copy='<p>'+teaser(x)+'</p>'+status(x);
 const listing=children.map(y=>'<li><span class="ks-ab-list-icon" aria-hidden="true">✓</span><a href="'+h(local(y.route))+'">'+label(y)+'</a></li>').join('');
 const content='<div class="ks-ab-grid">'+boxBody(x,copy,L('نبذة من ملف المصدر','Source overview'))+
 '<aside class="ks-ab-panel ks-ab-contents"><div class="ks-ab-panel-body"><h2>'+h(L('المحتويات المرتبطة','Related content'))+'</h2><ul>'+listing+'</ul></div></aside></div>'+
 (children.length?'<h2 class="ks-ab-section-title">'+h(L('استكشف محتويات القسم','Explore this section'))+'</h2><section class="ks-ab-tiles">'+children.map(tile).join('')+'</section>':'')+
 docsPanel(x);
 return pageWrapper(isAr()?x.title_ar:x.title_en,L('تصفح المحتوى المرتبط، ثم افتح التفاصيل أو الملف الأصلي من Google Drive.','Browse related content and open individual items or their source files on Google Drive.'),getTrail(x),content);
}
function videoPage(x){
 const videoURL=x.video_file_url,embedURL=x.video_file_id?'https://drive.google.com/file/d/'+encodeURIComponent(x.video_file_id)+'/preview':'';
 const media='<section class="ks-ab-panel"><div class="ks-ab-video-frame"><iframe loading="lazy" title="'+label(x)+'" src="'+h(embedURL)+'" allow="autoplay; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="ks-ab-panel-body"><h2>'+label(x)+'</h2><p>'+teaser(x)+'</p>'+status(x)+'</div></section>';
 const sidebar='<aside class="ks-ab-panel ks-ab-contents"><div class="ks-ab-panel-body"><h2>'+h(L('أصل الفيديو','Original video'))+'</h2><p>'+h(L('تم التحقق من الملف داخل مجلد «خلّ السعادة عادة» في Google Drive. لا يوجد تفريغ نصي معتمد، لذلك لم نختلق حوارًا أو مقالًا لهذا الفيديو.','This video was verified in the Make Happiness a Habit Drive folder. No approved transcript exists, so no dialogue or article has been fabricated.'))+'</p>'+status(x)+'</div></aside>';
 const actions='<div class="ks-ab-actions">'+cta(videoURL,L('شاهد الفيديو الأصلي في Google Drive','Watch original on Google Drive'))+cta(local('about/happiness'),L('العودة إلى القسم','Back to section'),true)+'</div><p class="ks-ab-caption">'+h(L('تشغيل الفيديو يعتمد على صلاحية المشاركة الفعلية في Google Drive.','Video playback depends on the file’s actual Google Drive sharing permissions.'))+'</p>';
 return pageWrapper(isAr()?x.title_ar:x.title_en,L('الفيديو الأصلي محفوظ داخل مكتبة «من أنا»؛ موقع KARIM SAAB واجهة مشاهدة وتنقل.','The original video remains in the About Me archive; KARIM SAAB is the viewing interface.'),getTrail(x),'<div class="ks-ab-grid">'+media+sidebar+'</div>'+actions+docsPanel(x));
}
function detailPage(x){
 const summary='<p>'+teaser(x)+'</p>'+status(x);
 const point='<div class="ks-ab-panel-body"><h2>'+h(L('النص المتوفر من المصدر','Available source text'))+'</h2><blockquote class="ks-ab-quote">'+teaser(x)+'</blockquote><p class="ks-ab-small">'+h(L('هذا هو النص المتاح في مستند المرجع حاليًا، وليس مقالًا طويلًا مكتملًا. يُستكمل النص فقط بعد اعتماد مواد أصلية إضافية.','This is the text currently present in the source document, not a complete long-form article. More text requires approved original material.'))+'</p>'+status(x)+'</div>';
 const content='<div class="ks-ab-grid">'+boxBody(x,summary,L('مقتطف من المحتوى','Content excerpt'))+'<aside class="ks-ab-panel ks-ab-contents">'+point+'</aside></div>'+docsPanel(x);
 return pageWrapper(isAr()?x.title_ar:x.title_en,L('المعلومة المعروضة مأخوذة من مستند الصفحة في Google Drive؛ ومحتوى الصفحة الكامل بقدر ما تسمح به الوثائق المتاحة.','Displayed material is derived from the page’s Google Drive document. Content is limited to what the source currently supports.'),getTrail(x),content);
}
function mount(){
 const r=(state.route||'').split('?')[0];
 if(r==='about'){
  const main=document.querySelector('#app > main');if(main)main.outerHTML=aboutHome();
 }else if(r==='about/health/depression-anxiety'||r==='about/health/depression-anxiety/full'){
  return; // Full verified health article is managed by the dedicated health module.
 }else if(byRoute[r]){
  const main=document.querySelector('#app > main');if(!main)return;
  const x=byRoute[r];main.outerHTML=x.kind==='video'?videoPage(x):x.kind==='category'?categoryPage(x):detailPage(x);
 }else return;
 const h1=document.querySelector('#app > main h1');if(h1)document.title=h1.textContent.trim()+' | KARIM SAAB';
 const meta=document.querySelector('meta[name="description"]');if(meta){const x=byRoute[r];meta.content=x?(isAr()?x.excerpt_ar:x.excerpt_en).slice(0,160):L('من أنا — أرشيف عبدالكريم بن إبراهيم الصعب','About Abdulkarim bin Ibrahim Al Saab archive');}
}
const previous=render;
window.removeEventListener('hashchange',previous);
render=function(){previous();mount();};
window.addEventListener('hashchange',render);
render();
})();
