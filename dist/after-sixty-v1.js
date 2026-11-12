/* KARIM SAAB — Life After Sixty V1. Additive: wraps the existing hash router. */
(function(){
"use strict";
var dataCache=null,loading=null,renderToken=0,category="all";
var DATA_URL="data/after-sixty.json";
function escapeHTML(value){return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function ar(){return state.lang!=="en"}
function label(a,b){return ar()?a:b}
function route(x){return "#/"+(ar()?"ar":"en")+"/"+x}
function timestamp(seconds){seconds=Number(seconds)||0;return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}
function getData(){
 if(dataCache)return Promise.resolve(dataCache);
 if(!loading)loading=fetch(DATA_URL,{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(function(data){
  if(!data||!Array.isArray(data.episodes)||!Array.isArray(data.categories))throw new Error("Invalid episode manifest");
  dataCache=data;return data;
 }).catch(function(e){loading=null;throw e});
 return loading;
}
function breadcrumb(){
 return '<nav class="ks60-breadcrumb" aria-label="'+label("مسار التصفح","Breadcrumb")+'"><a href="'+route("about")+'">'+label("من أنا","About")+'</a> / <a href="'+route("about/after-sixty")+'">'+label("الحياة بعد الستين","Life After Sixty")+'</a></nav>';
}
function identity(){return '<p class="ks60-identity">عبد الكريم بن ابراهيم الصعب <span dir="ltr">| KARIM SAAB</span></p>'}
function wrapper(content){return '<main class="ks60" dir="'+(ar()?"rtl":"ltr")+'"><div class="ks60-wrap">'+content+'</div></main>'}
function youtubeURL(id,seek){
 if(!/^[A-Za-z0-9_-]{11}$/.test(id||""))return "about:blank";
 var query="?rel=0&playsinline=1";
 if(seek>0)query+="&start="+Math.floor(seek)+"&autoplay=1";
 return "https://www.youtube-nocookie.com/embed/"+id+query;
}
function driveURL(ep){
 if(ep.drive_fallback_verified!==true||!/^[A-Za-z0-9_-]{15,}$/.test(ep.drive_video_file_id||""))return null;
 return "https://drive.google.com/file/d/"+ep.drive_video_file_id+"/preview";
}
function episodeURL(ep){return route("about/after-sixty/"+encodeURIComponent(ep.slug))}
function episodeCard(ep,categories){
 var categoryItem=categories.find(function(c){return c.id===ep.category_id});
 var thumb=ep.thumbnail_url||"assets/hero-desert.webp";
 var title=ar()?ep.title_ar:ep.title_en;
 var excerpt=ar()?ep.excerpt_ar:ep.excerpt_en;
 return '<a class="ks60-card" href="'+episodeURL(ep)+'" data-episode-card data-category="'+escapeHTML(ep.category_id)+'" data-text="'+escapeHTML([ep.title_ar,ep.title_en,ep.excerpt_ar,ep.excerpt_en].join(" ").toLocaleLowerCase())+'">'+
  '<div class="ks60-thumb"><img loading="lazy" alt="'+escapeHTML(title)+'" src="'+escapeHTML(thumb)+'"><span class="ks60-duration">'+timestamp(ep.duration_seconds)+'</span></div>'+
  '<div class="ks60-cardbody"><div class="ks60-kicker"><span>'+label("الحلقة","Episode")+' #'+String(ep.number).padStart(2,"0")+'</span><span>'+escapeHTML(categoryItem?ar()?categoryItem.ar:categoryItem.en:"")+'</span></div>'+
  '<h2>'+escapeHTML(title)+'</h2><p class="ks60-excerpt">'+escapeHTML(excerpt)+'</p>'+
  '<div class="ks60-kicker" style="margin-top:13px">'+label("مدة القراءة","Reading time")+': '+escapeHTML(ep.reading_minutes)+' '+label("دقائق","min")+'</div></div></a>';
}
function listPage(data){
 category="all";
 return wrapper(breadcrumb()+identity()+
  '<h1>'+label("الحياة بعد الستين","Life After Sixty")+'</h1>'+
  '<p class="ks60-lead">'+label("ليست محطة انتظار، بل مساحة للتأمل والتعلم وتجديد الشغف. مكتبة وثائقية للفيديوهات والمقالات، تتسع مع كل تجربة جديدة.","A living documentary library of videos and articles on experience, purpose, travel, energy and the art of living fully.")+'</p>'+
  '<div class="ks60-stat"><span>'+label("الحلقات المنشورة في الفهرس","Episodes in the library")+'</span><strong>'+data.episodes.length+'</strong></div>'+
  '<div class="ks60-controls"><input class="ks60-search" id="ks60-find" type="search" autocomplete="off" placeholder="'+label("ابحث بعنوان أو موضوع الحلقة...","Search episodes...")+'" aria-label="'+label("بحث الحلقات","Search episodes")+'">'+
  '<div class="ks60-chips" role="group" aria-label="'+label("تصنيفات الحلقات","Episode categories")+'"><button type="button" class="ks60-chip" data-category-filter="all" aria-pressed="true">'+label("الكل","All")+'</button>'+
  data.categories.map(function(c){return '<button type="button" class="ks60-chip" data-category-filter="'+escapeHTML(c.id)+'" aria-pressed="false">'+escapeHTML(ar()?c.ar:c.en)+'</button>'}).join("")+'</div></div>'+
  '<div class="ks60-resultcount" id="ks60-results" aria-live="polite">'+label("عدد النتائج: ","Results: ")+data.episodes.length+'</div>'+
  '<div class="ks60-grid" id="ks60-grid">'+data.episodes.map(function(ep){return episodeCard(ep,data.categories)}).join("")+
  '<div class="ks60-empty" id="ks60-empty" hidden>'+label("لا توجد حلقات مطابقة للبحث.","No episodes match these filters.")+'</div></div>');
}
function chapterButtons(ep){
 return '<section class="ks60-chapters" aria-label="'+label("فصول الحلقة","Episode chapters")+'"><h2>'+label("الفصول الزمنية","Video chapters")+'</h2>'+ep.chapters.map(function(ch){
  return '<button type="button" data-chapter-target="'+escapeHTML(ch.id)+'"><span class="ks60-time">'+timestamp(ch.time_seconds)+'</span><span>'+escapeHTML(ar()?ch.title_ar:ch.title_en)+'</span></button>'
 }).join("")+'</section>';
}
function articleHTML(ep){
 var html=ep.intro.map(function(p){return '<p>'+escapeHTML(p)+'</p>'}).join("");
 html+='<blockquote class="ks60-quote">«'+escapeHTML(ep.pull_quote)+'»</blockquote>';
 ep.chapters.forEach(function(ch){
  html+='<section class="ks60-section" id="ks60-'+escapeHTML(ch.id)+'">'+
   '<h2>'+escapeHTML(ch.title_ar)+' <button type="button" class="ks60-playtime" title="'+label("التشغيل من هذه الدقيقة","Play from timestamp")+'" data-seek="'+ch.time_seconds+'">▶ '+timestamp(ch.time_seconds)+'</button></h2>'+
   (ch.paragraphs||[]).map(function(p){return '<p>'+escapeHTML(p)+'</p>'}).join("");
  if(ch.bullets&&ch.bullets.length)html+='<ul>'+ch.bullets.map(function(b){return '<li><strong>'+escapeHTML(b.label)+':</strong> '+escapeHTML(b.text)+'</li>'}).join("")+'</ul>';
  html+='</section>';
 });
 if(ep.trailing_fragment)html+='<p>'+escapeHTML(ep.trailing_fragment)+'</p>';
 if(!ep.article_complete)html+='<p class="ks60-notice" role="note">'+escapeHTML(label(ep.editorial_note_ar,ep.editorial_note_en))+'</p>';
 return html;
}
function episodePage(ep){
 var title=ar()?ep.title_ar:ep.title_en;
 var hasDrive=!!driveURL(ep);
 var shareLink="share/"+(ar()?"ar":"en")+"/after-sixty-"+encodeURIComponent(ep.slug)+".html";
 return wrapper(breadcrumb()+identity()+
 '<a class="ks60-back" href="'+route("about/after-sixty")+'">← '+label("عودة إلى مكتبة الحلقات","Back to episode library")+'</a>'+
 '<header class="ks60-episode-head"><div class="ks60-stat">'+label("الحلقة","Episode")+' #'+String(ep.number).padStart(2,"0")+'</div>'+
 '<h1>'+escapeHTML(title)+'</h1><p>'+label("مدة الفيديو: ","Video: ")+timestamp(ep.duration_seconds)+' · '+label("مدة القراءة: ","Reading: ")+ep.reading_minutes+' '+label("دقائق","min")+
 ' · <a href="'+shareLink+'" target="_blank" rel="noopener">'+label("رابط المشاركة","Share link")+'</a></p></header>'+
 '<div class="ks60-mobile-switch" role="tablist" aria-label="'+label("التبديل بين المشاهدة والقراءة","Video or article")+'">'+
 '<button type="button" role="tab" data-view="video" aria-selected="true">'+label("مشاهدة الفيديو","Watch video")+'</button>'+
 '<button type="button" role="tab" data-view="article" aria-selected="false">'+label("قراءة المقال","Read article")+'</button></div>'+
 '<div class="ks60-split">'+
 '<aside class="ks60-video-pane" id="ks60-video-pane"><div class="ks60-player-wrap">'+
 '<div class="ks60-source-controls"><strong>'+label("المصدر","Source")+':</strong>'+
 '<button type="button" class="ks60-source-button" data-source="youtube" aria-pressed="true">YouTube</button>'+
 '<button type="button" class="ks60-source-button" data-source="drive" aria-pressed="false" '+(hasDrive?'':'disabled title="'+label("رابط Drive غير معتمد بعد","Drive backup is not yet verified")+'"')+'>Google Drive</button></div>'+
 '<div class="ks60-player"><iframe id="ks60-frame" src="'+escapeHTML(youtubeURL(ep.youtube_id,0))+'" title="'+escapeHTML(title)+'" loading="lazy" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'+
 '<p class="ks60-tip">'+(hasDrive?label("يمكن التبديل إلى نسخة Google Drive الاحتياطية المعتمدة. قد تتطلب صلاحية عرض عامة.","You can switch to the approved Google Drive backup, provided its access permissions allow viewing."):label("نسخة Google Drive الاحتياطية غير مفعّلة حتى نتأكد من أنها نفس الحلقة وصلاحية عرضها.","Google Drive backup is not enabled until the matching video and public access are verified."))+'</p></div>'+
 chapterButtons(ep)+'</aside>'+
 '<article class="ks60-article-pane" id="ks60-article-pane" lang="ar" dir="rtl" aria-label="'+label("المقال","Article")+'">'+articleHTML(ep)+'</article>'+
 '</div>');
}
function bindListing(main,data){
 var input=main.querySelector("#ks60-find");
 var chips=Array.from(main.querySelectorAll("[data-category-filter]"));
 function filter(){
  var q=(input.value||"").trim().toLocaleLowerCase();
  var cards=Array.from(main.querySelectorAll("[data-episode-card]"));var count=0;
  cards.forEach(function(card){var show=(category==="all"||category===card.dataset.category)&&(!q||(card.dataset.text||"").includes(q));card.hidden=!show;if(show)count++});
  main.querySelector("#ks60-results").textContent=label("عدد النتائج: ","Results: ")+count;
  main.querySelector("#ks60-empty").hidden=count!==0;
 }
 input.addEventListener("input",filter);
 chips.forEach(function(btn){btn.addEventListener("click",function(){category=btn.dataset.categoryFilter;chips.forEach(function(item){item.setAttribute("aria-pressed",String(item===btn))});filter()})});
}
function bindEpisode(main,ep){
 main.dataset.mobileView="video";
 var frame=main.querySelector("#ks60-frame");var active="youtube";
 function chooseSource(src){
  if(src==="drive"&&!driveURL(ep))return;
  if(src===active)return;
  active=src;
  frame.src=src==="youtube"?youtubeURL(ep.youtube_id,0):driveURL(ep);
  main.querySelectorAll("[data-source]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.source===src))});
 }
 function switchView(view){
  main.dataset.mobileView=view;
  main.querySelectorAll("[data-view]").forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.view===view))});
 }
 main.addEventListener("click",function(e){
  var source=e.target.closest("[data-source]");if(source){chooseSource(source.dataset.source);return}
  var tab=e.target.closest("[data-view]");if(tab){switchView(tab.dataset.view);return}
  var ch=e.target.closest("[data-chapter-target]");if(ch){
   switchView("article");
   var section=document.getElementById("ks60-"+ch.dataset.chapterTarget);
   if(section)requestAnimationFrame(function(){section.scrollIntoView({behavior:"smooth",block:"start"})});
   return;
  }
  var seek=e.target.closest("[data-seek]");if(seek){
   var seconds=Math.max(0,Math.min(Number(seek.dataset.seek)||0,Number(ep.duration_seconds)||9999));
   if(active!=="youtube"){active="youtube";main.querySelectorAll("[data-source]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.source==="youtube"))})}
   frame.src=youtubeURL(ep.youtube_id,seconds);
   switchView("video");
   if(window.matchMedia("(max-width: 760px)").matches)requestAnimationFrame(function(){main.querySelector("#ks60-video-pane").scrollIntoView({behavior:"smooth",block:"start"})});
  }
 });
}
function mount(){
 var current=(state.route||"").split("?")[0];
 if(current!=="about/after-sixty"&&current.indexOf("about/after-sixty/")!==0)return;
 var main=document.querySelector("#app > main");if(!main)return;
 var token=++renderToken;
 main.outerHTML=wrapper(breadcrumb()+'<div class="ks60-loading" role="status">'+label("جارٍ تحميل مكتبة الحلقات...","Loading episode library...")+'</div>');
 getData().then(function(data){
  if(token!==renderToken||(state.route||"").split("?")[0]!==current)return;
  var ep=null;
  if(current!=="about/after-sixty"){
   var slug=current.slice("about/after-sixty/".length);
   ep=data.episodes.find(function(x){return x.slug===slug});
  }
  var html=current==="about/after-sixty"?listPage(data):ep?episodePage(ep):wrapper(breadcrumb()+'<div class="ks60-error">'+label("هذه الحلقة غير موجودة.","Episode not found.")+'</div>');
  var target=document.querySelector("#app > main");if(!target)return;target.outerHTML=html;
  var rendered=document.querySelector("#app > main.ks60");
  if(ep){document.title=(ar()?ep.title_ar:ep.title_en)+" | KARIM SAAB";bindEpisode(rendered,ep)}
  else if(current==="about/after-sixty"){document.title=label("الحياة بعد الستين","Life After Sixty")+" | KARIM SAAB";bindListing(rendered,data)}
  var m=document.querySelector('meta[name="description"]');if(m)m.setAttribute("content",ep?ar()?ep.excerpt_ar:ep.excerpt_en:label("الحياة بعد الستين: مكتبة حلقات وثائقية ومقالات عبد الكريم بن ابراهيم الصعب.","Life After Sixty: Documentary videos and articles by KARIM SAAB."));
 }).catch(function(){
  if(token!==renderToken)return;
  var target=document.querySelector("#app > main");
  if(target)target.outerHTML=wrapper(breadcrumb()+'<div class="ks60-error">'+label("تعذّر تحميل بيانات الحلقات، يرجى إعادة المحاولة.","Episode data could not be loaded. Please try again.")+'</div>');
 });
}
var previous=render;
window.removeEventListener("hashchange",previous);
render=function(){previous();mount()};
window.addEventListener("hashchange",render);
render();
})();