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
function youtubeURL(id,seek,autoplay){
 if(!/^[A-Za-z0-9_-]{11}$/.test(id||""))return "about:blank";
 var query="?rel=0&playsinline=1";
 if(seek>0)query+="&start="+Math.floor(seek);
 if(autoplay)query+="&autoplay=1";
 return "https://www.youtube-nocookie.com/embed/"+id+query;
}
function thumbnailURL(id,quality){
 if(!/^[A-Za-z0-9_-]{11}$/.test(id||""))return "assets/hero-desert.webp";
 return "https://i.ytimg.com/vi/"+id+"/"+quality+".jpg";
}
function thumbnailMarkup(id,cls,alt,extra){
 return '<img class="'+cls+'" src="'+thumbnailURL(id,"maxresdefault")+
  '" data-ks60-thumbnail data-video-id="'+escapeHTML(id)+'" alt="'+escapeHTML(alt||"")+'" '+(extra||"")+'>';
}
function bindThumbnails(scope){
 Array.from(scope.querySelectorAll("img[data-ks60-thumbnail]")).forEach(function(img){
  var id=img.dataset.videoId,quality=["maxresdefault","sddefault","hqdefault"],index=0;
  function next(){index++;img.src=index<quality.length?thumbnailURL(id,quality[index]):"assets/hero-desert.webp";}
  img.addEventListener("error",function(){if(index<=quality.length)next()});
  img.addEventListener("load",function(){if(img.naturalWidth<=120&&index<quality.length)next()});
  if(img.complete){if(!img.naturalWidth||img.naturalWidth<=120)next();}
 });
}
function playerPoster(ep){
 var title=ar()?ep.title_ar:ep.title_en;
 return '<button type="button" class="ks60-poster" data-start-play aria-label="'+escapeHTML(label("تشغيل فيديو: ","Play video: ")+title)+'">'+
  thumbnailMarkup(ep.youtube_id,"ks60-poster-blur","",'aria-hidden="true" decoding="async"')+
  thumbnailMarkup(ep.youtube_id,"ks60-poster-image",title,'decoding="async"')+
  '<span class="ks60-poster-overlay"><span class="ks60-poster-cta">'+label("شاهد الفيديو","Watch video")+'</span></span>'+
 '</button>';
}
function driveURL(ep){
 if(ep.drive_fallback_verified!==true||!/^[A-Za-z0-9_-]{15,}$/.test(ep.drive_video_file_id||""))return null;
 return "https://drive.google.com/file/d/"+ep.drive_video_file_id+"/preview";
}
function episodeURL(ep){return route("about/after-sixty/"+encodeURIComponent(ep.slug))}
function episodeCard(ep,categories){
 var categoryItem=categories.find(function(c){return c.id===ep.category_id});
 var thumb=ep.thumbnail_url||thumbnailURL(ep.youtube_id,"maxresdefault");
 var title=ar()?ep.title_ar:ep.title_en;
 var excerpt=ar()?ep.excerpt_ar:ep.excerpt_en;
 return '<a class="ks60-card" href="'+episodeURL(ep)+'" data-episode-card data-category="'+escapeHTML(ep.category_id)+'" data-text="'+escapeHTML([ep.title_ar,ep.title_en,ep.excerpt_ar,ep.excerpt_en].join(" ").toLocaleLowerCase())+'">'+
  '<div class="ks60-thumb"><img loading="lazy" data-ks60-thumbnail data-video-id="'+escapeHTML(ep.youtube_id)+'" alt="'+escapeHTML(title)+'" src="'+escapeHTML(thumb)+'"><span class="ks60-card-video-badge" aria-hidden="true">▶ '+label("شاهد الفيديو","Watch video")+'</span><span class="ks60-duration">'+timestamp(ep.duration_seconds)+'</span></div>'+
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
  '<div class="ks60-grid'+(data.episodes.length===1?' ks60-grid-single':'')+'" id="ks60-grid">'+data.episodes.map(function(ep){return episodeCard(ep,data.categories)}).join("")+
  '<div class="ks60-empty" id="ks60-empty" hidden>'+label("لا توجد حلقات مطابقة للبحث.","No episodes match these filters.")+'</div></div>');
}
function chapterButtons(ep){
 return '<details class="ks60-chapters" open aria-label="'+label("فصول الحلقة","Episode chapters")+'">'+
  '<summary><span>'+label("الفصول الزمنية","Video chapters")+'</span><span class="ks60-chapter-count">'+ep.chapters.length+'</span></summary>'+
  '<div class="ks60-chapter-list">'+ep.chapters.map(function(ch){
    return '<button type="button" data-chapter-target="'+escapeHTML(ch.id)+'"><span class="ks60-time">'+timestamp(ch.time_seconds)+'</span><span>'+escapeHTML(ar()?ch.title_ar:ch.title_en)+'</span></button>';
  }).join("")+'</div></details>';
}
function hasEnglishArticle(ep){
 if(!Array.isArray(ep.intro_en)||!Array.isArray(ep.intro)||ep.intro_en.length!==ep.intro.length||!ep.intro_en.every(Boolean)||!ep.pull_quote_en)return false;
 if(!Array.isArray(ep.chapters))return false;
 if(!ep.chapters.every(function(ch){
  return !!ch.title_en&&Array.isArray(ch.paragraphs_en)&&Array.isArray(ch.paragraphs)&&ch.paragraphs_en.length===ch.paragraphs.length&&ch.paragraphs_en.every(Boolean)&&(!ch.bullets||(Array.isArray(ch.bullets_en)&&ch.bullets_en.length===ch.bullets.length&&ch.bullets_en.every(function(b){return b&&b.label&&b.text})));
 }))return false;
 if(ep.conclusion&&(!ep.conclusion.title_en||!Array.isArray(ep.conclusion.paragraphs_en)||ep.conclusion.paragraphs_en.length!==ep.conclusion.paragraphs.length||!ep.conclusion.paragraphs_en.every(Boolean)))return false;
 if(ep.closing_message&&!ep.closing_message_en)return false;
 return true;
}
function articleHTML(ep){
 var isArabic=ar();
 if(!isArabic&&!hasEnglishArticle(ep)){
  return '<p class="ks60-language-note" role="status" lang="en" dir="ltr">An English edition is being prepared. The Arabic original remains available via the language switcher. This page will not display untranslated Arabic as English content.</p>';
 }
 var html=(isArabic?ep.intro:ep.intro_en).map(function(p){return '<p>'+escapeHTML(p)+'</p>'}).join("");
 var quote=isArabic?ep.pull_quote:ep.pull_quote_en;
 html+='<blockquote class="ks60-quote">'+(isArabic?'«':'“')+escapeHTML(quote)+(isArabic?'»':'”')+'</blockquote>';
 ep.chapters.forEach(function(ch){
  html+='<section class="ks60-section" id="ks60-'+escapeHTML(ch.id)+'">'+
   '<h2>'+escapeHTML(isArabic?ch.title_ar:ch.title_en)+' <button type="button" class="ks60-playtime" title="'+label("التشغيل من هذه الدقيقة","Play from timestamp")+'" data-seek="'+ch.time_seconds+'">▶ '+timestamp(ch.time_seconds)+'</button></h2>'+
   (isArabic?ch.paragraphs:ch.paragraphs_en).map(function(p){return '<p>'+escapeHTML(p)+'</p>'}).join("");
  var bullets=isArabic?ch.bullets:ch.bullets_en;
  if(bullets&&bullets.length)html+='<ul>'+bullets.map(function(b){return '<li><strong>'+escapeHTML(b.label)+':</strong> '+escapeHTML(b.text)+'</li>'}).join("")+'</ul>';
  html+='</section>';
 });
 if(ep.conclusion){
  html+='<section class="ks60-section ks60-conclusion" id="ks60-conclusion">'+
   '<h2>'+escapeHTML(isArabic?ep.conclusion.title_ar:ep.conclusion.title_en)+'</h2>'+
   (isArabic?ep.conclusion.paragraphs:ep.conclusion.paragraphs_en).map(function(p){return '<p>'+escapeHTML(p)+'</p>'}).join("")+'</section>';
 }
 if(ep.closing_message)html+='<p class="ks60-closing">'+escapeHTML(isArabic?ep.closing_message:ep.closing_message_en)+'</p>';
 if(isArabic&&ep.trailing_fragment)html+='<p>'+escapeHTML(ep.trailing_fragment)+'</p>';
 if(!ep.article_complete)html+='<p class="ks60-notice" role="note">'+escapeHTML(label(ep.editorial_note_ar||"المقال قيد المراجعة.",ep.editorial_note_en||"This article is under editorial review."))+'</p>';
 return html;
}
function episodePage(ep){
 var title=ar()?ep.title_ar:ep.title_en;
 var hasDrive=!!driveURL(ep);
 var format=ep.video_orientation==="vertical"?"vertical":"landscape";
 var shareBase="share/"+(ar()?"ar":"en")+"/after-sixty-"+encodeURIComponent(ep.slug);
 return wrapper(breadcrumb()+identity()+
 '<a class="ks60-back" href="'+route("about/after-sixty")+'">← '+label("عودة إلى مكتبة الحلقات","Back to episode library")+'</a>'+
 '<header class="ks60-episode-head"><div class="ks60-stat">'+label("الحلقة","Episode")+' #'+String(ep.number).padStart(2,"0")+'</div>'+
 '<h1>'+escapeHTML(title)+'</h1><p>'+label("مدة الفيديو: ","Video: ")+timestamp(ep.duration_seconds)+' · '+label("مدة القراءة: ","Reading: ")+ep.reading_minutes+' '+label("دقائق","min")+
 ' · <a href="'+shareBase+'-video.html" target="_blank" rel="noopener">'+label("مشاركة الفيديو","Share video")+'</a>'+' · <a href="'+shareBase+'-article.html" target="_blank" rel="noopener">'+label("مشاركة المقال","Share article")+'</a></p></header>'+
 '<div class="ks60-split">'+
 '<aside class="ks60-video-pane" id="ks60-video-pane" aria-label="'+label("مشغل فيديو الحلقة","Episode video player")+'">'+
 '<div class="ks60-player-wrap"><div class="ks60-player-stage">'+
 '<div class="ks60-player" data-orientation="'+format+'" id="ks60-player">'+playerPoster(ep)+'</div></div>'+
 '<div class="ks60-source-controls" role="group" aria-label="'+label("مصادر الفيديو","Video sources")+'"><strong>'+label("المصدر","Source")+':</strong>'+
 '<button type="button" class="ks60-source-button" data-source="youtube" aria-pressed="true">YouTube</button>'+
 '<button type="button" class="ks60-source-button" data-source="drive" aria-pressed="false" '+(hasDrive?'':'disabled title="'+label("رابط Drive غير معتمد بعد","Drive backup is not yet verified")+'"')+'>Google Drive</button></div>'+
 '<p class="ks60-tip">'+(hasDrive?label("يمكن التبديل إلى النسخة الاحتياطية المعتمدة في Google Drive.","Verified backup available from Google Drive."):label("نسخة Google Drive الاحتياطية ستتاح بعد التحقق من تطابق الفيديو وصلاحية عرضه.","Google Drive backup will be available after verifying the recording and its access."))+'</p>'+'<p class="ks60-external-watch"><a href="https://www.youtube.com/watch?v='+escapeHTML(ep.youtube_id)+'" target="_blank" rel="noopener noreferrer" aria-label="'+label("فتح الفيديو مباشرة في يوتيوب","Open video on YouTube")+'">'+label("إذا تعذّر التشغيل هنا، شاهد الفيديو على YouTube ↗","If playback fails here, watch directly on YouTube ↗")+'</a></p></div>'+
 chapterButtons(ep)+'</aside>'+
 '<article class="ks60-article-pane" id="ks60-article-pane" lang="'+(ar()?"ar":"en")+'" dir="'+(ar()?"rtl":"ltr")+'" aria-label="'+label("المقال","Article")+'">'+articleHTML(ep)+'</article>'+
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
 var player=main.querySelector("#ks60-player"),active="youtube",chapters=main.querySelector(".ks60-chapters");
 if(window.matchMedia("(max-width:760px)").matches&&chapters)chapters.open=false;
 bindThumbnails(main);
 function updateSources(){
  main.querySelectorAll("[data-source]").forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.source===active))});
 }
 function insertPlayer(url){
  var title=ar()?ep.title_ar:ep.title_en;
  player.innerHTML='<iframe id="ks60-frame" src="'+escapeHTML(url)+'" title="'+escapeHTML(title)+'" loading="eager" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
 }
 function playYoutube(seconds){
  active="youtube";updateSources();
  insertPlayer(youtubeURL(ep.youtube_id,Math.floor(seconds||0),true));
 }
 function chooseSource(src){
  if(src==="drive"){
   if(!driveURL(ep))return;
   active="drive";updateSources();insertPlayer(driveURL(ep));return;
  }
  if(active==="youtube")return;
  active="youtube";updateSources();player.innerHTML=playerPoster(ep);bindThumbnails(player);
 }
 main.addEventListener("click",function(e){
  var play=e.target.closest("[data-start-play]");
  if(play){playYoutube(0);return}
  var source=e.target.closest("[data-source]");
  if(source){chooseSource(source.dataset.source);return}
  var chapter=e.target.closest("[data-chapter-target]");
  if(chapter){
   var section=main.querySelector("#ks60-"+chapter.dataset.chapterTarget);
   if(section){
    if(chapters&&window.matchMedia("(max-width:760px)").matches)chapters.open=false;
    requestAnimationFrame(function(){section.scrollIntoView({behavior:"smooth",block:"start"})});
   }
   return;
  }
  var seek=e.target.closest("[data-seek]");
  if(seek){
   var seconds=Math.max(0,Math.min(Number(seek.dataset.seek)||0,Number(ep.duration_seconds)||9999));
   playYoutube(seconds);
   if(window.matchMedia("(max-width:760px)").matches)requestAnimationFrame(function(){player.scrollIntoView({behavior:"smooth",block:"start"})});
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
  else if(current==="about/after-sixty"){document.title=label("الحياة بعد الستين","Life After Sixty")+" | KARIM SAAB";bindThumbnails(rendered);bindListing(rendered,data)}
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