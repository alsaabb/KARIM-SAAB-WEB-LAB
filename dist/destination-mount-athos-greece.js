/* KARIM SAAB — Mount Athos bilingual exact-text presentation. Review only. */
(function(){
'use strict';
var ROUTE='destination/mount-athos-greece',LIST='destinations',ID='zsYOR7WmvAQ';
var source=null,pending=null,epoch=0;
function ar(){return state.lang!=='en'}
function tr(a,b){return ar()?a:b}
function enc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function href(s){return '#/'+(ar()?'ar':'en')+'/'+s}
function shareUrl(){return 'https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/share/'+(ar()?'ar':'en')+'/destination-mount-athos-greece.html'}
function title(){return source.langs[ar()?'ar':'en'].full_text.split('\n')[0].replace(/^(?:العنوان: |Title: )/,'')}
function text(){return source.langs[ar()?'ar':'en'].full_text}
function approvedPoster(){
 var p=source&&source.poster,asset=p&&p.public_asset;
 return p&&p.owner_poster_approved===true&&typeof asset==='string'&&/^assets\/stories\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpe?g|avif)$/i.test(asset)?asset:null;
}
function share(kind){
 var u=kind==='video'?'https://www.youtube.com/watch?v='+ID:shareUrl();
 var t=title(),message=encodeURIComponent(t+' '+u);
 var links=[
 ['X','https://twitter.com/intent/tweet?text='+message],
 ['Facebook','https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u)],
 ['WhatsApp','https://api.whatsapp.com/send?text='+message],
 ['Telegram','https://t.me/share/url?url='+encodeURIComponent(u)+'&text='+encodeURIComponent(t)],
 ['LinkedIn','https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(u)]
 ];
 return '<div class="ks-athos-share"><strong>'+tr(kind==='video'?'شارك الفيديو':'شارك المقال',kind==='video'?'Share Video':'Share Article')+'</strong><div class="ks-athos-share-controls">'+
 links.map(function(x){return '<a href="'+enc(x[1])+'" target="_blank" rel="noopener noreferrer" aria-label="'+enc(x[0])+'">'+enc(x[0])+'</a>'}).join('')+
 '<button type="button" data-ks-athos-copy="'+kind+'">'+tr('نسخ الرابط','Copy link')+'</button></div></div>';
}
function video(){
 var owner=approvedPoster(),src=owner||'https://i.ytimg.com/vi/'+ID+'/maxresdefault.jpg';
 return '<div class="ks-athos-frame" id="ks-athos-player"><button type="button" id="ks-athos-play" class="ks-athos-play" aria-label="'+tr('شاهد الفيديو','Watch video')+'">'+
 '<img data-ks-athos-thumb data-ks-athos-owner="'+(owner?'true':'false')+'" src="'+enc(src)+'" alt="'+enc(title())+'" decoding="async">'+
 '<span class="ks-athos-editorial" hidden>'+enc(tr('جبل آثوس · اليونان','MOUNT ATHOS · GREECE'))+'</span>'+
 '<span class="ks-athos-watch"><span aria-hidden="true">▶</span> '+tr('شاهد الفيديو','Watch video')+'</span></button></div>';
}
function story(){
 return '<main class="ks-athos" dir="'+(ar()?'rtl':'ltr')+'" lang="'+(ar()?'ar':'en')+'"><div class="ks-athos-container">'+
 '<nav class="ks-athos-crumb"><a href="'+href(LIST)+'">'+tr('الوجهات','Destinations')+'</a> / '+tr('جبل آثوس، اليونان','Mount Athos, Greece')+'</nav>'+
 '<span class="ks-athos-kicker">KARIM SAAB · GREECE</span><h1>'+enc(title())+'</h1>'+
 '<div class="ks-athos-layout"><aside><div class="ks-athos-sticky">'+video()+'</div></aside>'+
 '<article class="ks-athos-article"><div class="ks-athos-full-text" role="document">'+enc(text())+'</div>'+share('article')+
 '<p class="ks-athos-direct"><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v='+ID+'">'+tr('مشاهدة الفيديو على YouTube','Watch on YouTube')+'</a></p>'+share('video')+'</article></div>'+
 '<p><a class="ks-athos-back" href="'+href(LIST)+'">'+tr('العودة إلى الوجهات','Back to Destinations')+'</a></p></div></main>';
}
function card(){
 return '<a href="'+href(ROUTE)+'" data-ks-athos-card class="ks-athos-card"><div class="ks-athos-card-image"><img src="https://i.ytimg.com/vi/'+ID+'/hqdefault.jpg" alt="'+enc(title())+'" loading="lazy"></div>'+
 '<div class="ks-athos-card-content"><small>GREECE · MOUNT ATHOS</small><h3>'+enc(title())+'</h3><p>'+tr('اقرأ المقال وشاهد الفيديو','Read the article and watch the video')+'</p></div></a>';
}
function list(){
 return '<main class="ks-athos-list" dir="'+(ar()?'rtl':'ltr')+'" lang="'+(ar()?'ar':'en')+'"><div class="ks-athos-container"><span class="ks-athos-kicker">KARIM SAAB · DESTINATIONS</span><h1>'+tr('الوجهات','Destinations')+'</h1><div class="ks-athos-cards">'+card()+'</div></div></main>';
}
function bind(){
 document.querySelector('#ks-athos-play')?.addEventListener('click',function(){
  var surface=document.querySelector('#ks-athos-player');if(!surface)return;
  var frame=document.createElement('iframe');
  frame.src='https://www.youtube-nocookie.com/embed/'+ID+'?autoplay=1&playsinline=1';
  frame.title=title();frame.allow='autoplay;encrypted-media;picture-in-picture';frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  surface.classList.remove('ks-athos-owner-portrait','ks-athos-landscape-thumbnail');
  surface.classList.add('ks-athos-playing');
  surface.replaceChildren(frame);
 });
 var img=document.querySelector('[data-ks-athos-thumb]');if(img){
  var urls=(img.dataset.ksAthosOwner==='true'?['maxresdefault.jpg']:[]).concat(['sddefault.jpg','hqdefault.jpg']);
  var index=0;
  function fallback(){
   img.dataset.ksAthosOwner='false';
   if(index<urls.length){img.src='https://i.ytimg.com/vi/'+ID+'/'+urls[index++];}
   else{
    img.hidden=true;
    var copy=img.parentElement.querySelector('.ks-athos-editorial');
    if(copy)copy.hidden=false;
    img.closest('.ks-athos-frame')?.classList.add('ks-athos-no-thumb');
   }
  }
  function loaded(){
   if(img.naturalWidth<=120||img.naturalHeight<=90){fallback();return;}
   var ratio=img.naturalWidth/img.naturalHeight;
   var ownerPortrait=img.dataset.ksAthosOwner==='true' && ratio>0.48 && ratio<0.69;
   if(img.dataset.ksAthosOwner==='true'&&!ownerPortrait){fallback();return;}
   var surface=img.closest('.ks-athos-frame');
   if(surface){
    surface.classList.toggle('ks-athos-owner-portrait',ownerPortrait);
    surface.classList.toggle('ks-athos-landscape-thumbnail',!ownerPortrait);
    surface.classList.remove('ks-athos-no-thumb');
   }
  }
  img.addEventListener('error',fallback);
  img.addEventListener('load',loaded);
  if(img.complete&&img.naturalWidth>0)loaded();
 }
 document.querySelectorAll('[data-ks-athos-copy]').forEach(function(b){b.addEventListener('click',function(){
  var url=b.dataset.ksAthosCopy==='video'?'https://www.youtube.com/watch?v='+ID:shareUrl();
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){b.textContent=tr('تم النسخ','Copied')}).catch(function(){b.textContent=url});
  else b.textContent=url;
 })});
}
function after(){
 var r=(state.route||'').split('?')[0];if(r!==ROUTE&&r!==LIST)return;
 var main=document.querySelector('#app > main');if(!main)return;
 if(!source){
  var token=++epoch;
  if(!pending)pending=fetch('data/destination-mount-athos-greece.json?v=20261115-review')
   .then(function(x){if(!x.ok)throw Error('content unavailable');return x.json()})
   .then(function(d){if(d.youtube_id!==ID||!d.langs.ar.full_text||!d.langs.en.full_text)throw Error('invalid content');source=d;return d});
  pending.then(function(){if(token===epoch)after()}).catch(function(){if(token===epoch&&r===ROUTE)main.innerHTML='<p>'+tr('تعذر تحميل المقال','Article unavailable')+'</p>'});
  return;
 }
 if(r===ROUTE){
  main.outerHTML=story();document.title=title()+' | KARIM SAAB';bind();
 }else if(!main.querySelector('[data-ks-athos-card]')){
  var grid=main.querySelector('.ks-card-grid,.ks-dest-grid,.destinations-grid');
  if(grid)grid.insertAdjacentHTML('afterbegin',card());else main.outerHTML=list();
 }
}
var previous=render;window.removeEventListener('hashchange',previous);
render=function(){previous();after()};
window.addEventListener('hashchange',render);render();
})();