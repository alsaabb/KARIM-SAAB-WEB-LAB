/* KARIM SAAB — Reindeer Close Call Norway: owner-approved bilingual documentary (AI cover illustration).
 * Uses the existing Health/Happiness portrait video+article template.
 * Full owner text and both original cover artworks are owner-approved. Do not edit article words.
 */
(function(){
'use strict';
var ROUTE='story/reindeer-close-call-norway',INDEX='stories-road',ID='i72sAiafvDw';
var DATA='data/reindeer-norway-v1.json?v=i72sAiafvDw-v1',item=null,pending=null;
function ar(){return state.lang!=='en'}
function tr(a,b){return ar()?a:b}
function safe(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function href(x){return '#/'+(ar()?'ar':'en')+'/'+x}
function routeNow(){return (state.route||'').split('?')[0]}
function cover(){return item[ar()?'poster_asset_ar':'poster_asset_en']}
function title(){return item[ar()?'title_ar':'title_en']}
function body(){return item[ar()?'article_ar':'article_en']}
function lang(){return ar()?'ar':'en'}
function articleHtml(txt){
  var rows=String(txt).split('\n').filter(function(x){return x.trim().length});
  return rows.map(function(x,i){
    var value=safe(x);
    if(i===0)return '<h1>'+value+'</h1>';
    if(i===1)return '<p class="ks-reindeer-byline ks-arctic-byline">'+value+'</p>';
    if(/^كلمة وتعقيب عبد الكريم بن ابراهيم الصعب:$/.test(x)||/^معلومة معرفية عن غزلان الرنّة/.test(x)||x==='Arctic Wildlife Insight:'||x==='Personal Reflection by KARIM SAAB:')return '<h2>'+value+'</h2>';
    if(x.charAt(0)==='«'||x.charAt(0)==='"'||x.charAt(0)==='“')return '<blockquote class="ks-sleeve-quote"><p>'+value+'</p></blockquote>';
    return '<p>'+value+'</p>';
  }).join('\n');
}
function card(){
  var grid=document.querySelector('#app > main .ks-card-grid');
  if(!grid||grid.querySelector('[data-reindeer-card]'))return;
  var el=document.createElement('a');
  el.className='ks-simple-card ks-reindeer-card ks-arctic-card';
  el.href=href(ROUTE);
  el.setAttribute('data-reindeer-card','1');
  el.innerHTML='<div class="ks-reindeer-card-cover ks-reindeer-card ks-arctic-card-cover"><img src="'+safe(cover())+'" width="941" height="1672" loading="lazy" decoding="async" alt="'+safe(title())+'"></div>'+
     '<span class="eyebrow">'+tr('النرويج · الرنّة · وثائقي','NORWAY · REINDEER · DOCUMENTARY')+'</span>'+
     '<h3>'+safe(title())+'</h3>'+
     '<p>'+safe(item[ar()?'description_ar':'description_en'])+'</p>'+
     '<strong class="ks-reindeer-card-cta ks-reindeer-card ks-arctic-card-cta">'+tr('شاهد الفيديو واقرأ المقال كاملًا','Watch the video and read the full article')+' ↗</strong>';
  grid.insertBefore(el,grid.firstChild);
}
function attachNorway(){
  // Norway destination record is a historical cycling index, not this documented car journey.
  // Add a clearly independent documentary story link without rewriting its 2019 source.
  var container=document.querySelector('#app > main .page-body .container');
  if(!container||container.querySelector('[data-reindeer-norway-feature]'))return;
  var node=document.createElement('section');
  node.className='ks-reindeer-norway-feature';
  node.setAttribute('data-reindeer-norway-feature','1');
  node.innerHTML='<h2>'+tr('قصص وثائقية من النرويج','Norway documentary stories')+'</h2>'+
    '<p>'+tr('قصة قيادة شتوية مستقلة عن أرشيف رحلة الدراجة.','A winter driving account separate from the historical cycling trip.')+'</p>'+
    '<div class="ks-card-grid"></div>';
  container.appendChild(node);
  var grid=node.querySelector('.ks-card-grid');
  var cardEl=document.createElement('a');
  cardEl.className='ks-simple-card ks-reindeer-card ks-arctic-card';
  cardEl.setAttribute('href',href(ROUTE));
  cardEl.setAttribute('data-reindeer-card','1');
  cardEl.innerHTML='<div class="ks-reindeer-card-cover ks-arctic-card-cover"><img src="'+safe(cover())+'" width="941" height="1672" decoding="async" loading="lazy" alt="'+safe(title())+'"></div>'+
    '<span class="eyebrow">NORWAY · REINDEER · DOCUMENTARY</span><h3>'+safe(title())+'</h3>'+
    '<p>'+safe(item[ar()?'description_ar':'description_en'])+'</p>';
  grid.appendChild(cardEl);
}
function page(){
  var video='https://www.youtube.com/watch?v='+ID;
  return '<main class="ks-happ ks-sleeve ks-arctic ks-reindeer" data-reindeer-id="'+ID+'" lang="'+lang()+'" dir="'+tr('rtl','ltr')+'">'+
    '<div class="ks-happ-wrap"><nav class="ks-happ-breadcrumb" aria-label="'+tr('مسار التصفح','Breadcrumb')+'">'+
    '<a href="'+href(INDEX)+'">'+tr('حكايات من الطريق','Stories from the Road')+'</a> / '+tr('النرويج · طريق جليدي','Norway · Icy highway')+'</nav>'+
    '<header class="ks-happ-head"><small>KARIM SAAB | '+tr('فيديو ومقال وثائقي','DOCUMENTARY VIDEO & ARTICLE')+'</small><h1>'+safe(title())+'</h1></header>'+
    '<div class="ks-happ-split"><div class="ks-happ-video-pane">'+
    '<div class="ks-happ-player" id="ks-reindeer-player"><button type="button" class="ks-sleeve-poster ks-sleeve-owner-portrait" data-reindeer-play aria-label="'+tr('تشغيل الفيديو','Play video')+'">'+
    '<img class="ks-sleeve-cover ks-reindeer-owner-cover" src="'+safe(cover())+'" width="941" height="1672" alt="'+safe(title())+'" decoding="async">'+
    '<span class="ks-sleeve-gold-play">▶ '+tr('تشغيل الفيديو','Play video')+'</span></button></div></div>'+
    '<article id="ks-reindeer-article" class="ks-happ-article-pane ks-sleeve-article" lang="'+lang()+'" dir="'+tr('rtl','ltr')+'">'+
    articleHtml(body())+
    '<section class="ks-reindeer-tags ks-arctic-tags" aria-label="'+tr('الوسوم','Tags')+'"><strong>'+tr('الوسوم','Tags')+':</strong> '+safe(item.tags)+'</section></article></div>'+
    '<p class="ks-happ-watch-link ks-sleeve-external"><a href="'+video+'" target="_blank" rel="noopener noreferrer">'+tr('مشاهدة الفيديو مباشرة على YouTube','Watch directly on YouTube')+'</a></p>'+
    '<p class="ks-reindeer-disclosure">'+tr('الغلاف تصميم توضيحي بالذكاء الاصطناعي، وليس لقطة فوتوغرافية أصلية من الحادثة.','Cover artwork is an AI-assisted illustration, not an original photograph of the incident.')+'</p>'+ 
    '<a class="ks-happ-back" href="'+href(INDEX)+'">'+tr('العودة إلى حكايات من الطريق','Back to Stories from the Road')+'</a></div></main>';
}
function bind(){
  var root=document.querySelector('#app > main.ks-reindeer');if(!root)return;
  var img=root.querySelector('.ks-reindeer-owner-cover');
  if(img&&!img.dataset.bound){
    img.dataset.bound='1';
    img.addEventListener('error',function(){img.hidden=true;root.querySelector('[data-reindeer-play]').classList.add('ks-sleeve-no-image')});
  }
  var button=root.querySelector('[data-reindeer-play]');
  if(button&&!button.dataset.bound){
    button.dataset.bound='1';
    button.addEventListener('click',function(){
      var player=root.querySelector('#ks-reindeer-player');if(!player)return;
      var iframe=document.createElement('iframe');
      iframe.src='https://www.youtube-nocookie.com/embed/'+ID+'?autoplay=1&playsinline=1&rel=0';
      iframe.title=title();
      iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
      iframe.allow='autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; web-share';
      iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
      player.classList.add('is-playing');
      player.replaceChildren(iframe);
    });
  }
}
function mount(){
  var current=routeNow();
  if(!item)return;
  if(current===INDEX){card();return}
  if(current==='journey/legacy-11'){attachNorway();return}
  if(current!==ROUTE)return;
  var main=document.querySelector('#app > main');if(!main)return;
  if(!main.classList.contains('ks-reindeer')||main.getAttribute('lang')!==lang())main.outerHTML=page();
  bind();
  document.title=item[ar()?'seo_title_ar':'seo_title_en'];
  var meta=document.querySelector('meta[name="description"]');
  if(meta)meta.content=item[ar()?'description_ar':'description_en'];
}
function load(){
  if(pending)return pending;
  pending=fetch(DATA).then(function(r){if(!r.ok)throw Error('Approved Norway reindeer article unavailable');return r.json()})
    .then(function(x){
      if(x.youtube_id!==ID||x.route!==ROUTE||!x.article_ar||!x.article_en||
         !x.poster_asset_ar||!x.poster_asset_en||x.poster_status!=='approved_and_published')
        throw Error('Approved Norway reindeer record is incomplete');
      item=x;mount();return x;
    }).catch(function(e){console.error('Arctic article failed to load:',e.message);throw e});
  return pending;
}
var previous=render;
window.removeEventListener('hashchange',previous);
render=function(){previous();mount();};
window.addEventListener('hashchange',render);
load().catch(function(){});
render();
})();