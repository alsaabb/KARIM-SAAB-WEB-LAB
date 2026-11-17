/* KARIM SAAB — Arctic Survival Norway: approved bilingual documentary.
 * Uses the existing Health/Happiness portrait video+article template.
 * Text and posters are owner-approved; preserve all original lines and pixels.
 */
(function(){
'use strict';
var ROUTE='story/arctic-survival-norway',INDEX='stories-road',ID='kERPnPj3XAA';
var DATA='data/arctic-survival-v1.json?v=kERPnPj3XAA-v1',item=null,pending=null;
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
    if(i===1)return '<p class="ks-arctic-byline">'+value+'</p>';
    if(/^كلمة وتعقيب عبد الكريم بن ابراهيم الصعب:$/.test(x)||x==='Reflection by KARIM SAAB:')return '<h2>'+value+'</h2>';
    if(x.charAt(0)==='«'||x.charAt(0)==='"')return '<blockquote class="ks-sleeve-quote"><p>'+value+'</p></blockquote>';
    return '<p>'+value+'</p>';
  }).join('\n');
}
function card(){
  var grid=document.querySelector('#app > main .ks-card-grid');
  if(!grid||grid.querySelector('[data-arctic-card]'))return;
  var el=document.createElement('a');
  el.className='ks-simple-card ks-arctic-card';
  el.href=href(ROUTE);
  el.setAttribute('data-arctic-card','1');
  el.innerHTML='<div class="ks-arctic-card-cover"><img src="'+safe(cover())+'" width="857" height="1536" loading="lazy" decoding="async" alt="'+safe(title())+'"></div>'+
     '<span class="eyebrow">'+tr('النرويج · القطب الشمالي · وثائقي','NORWAY · ARCTIC · DOCUMENTARY')+'</span>'+
     '<h3>'+safe(title())+'</h3>'+
     '<p>'+safe(item[ar()?'description_ar':'description_en'])+'</p>'+
     '<strong class="ks-arctic-card-cta">'+tr('شاهد الفيديو واقرأ المقال كاملًا','Watch the video and read the full article')+' ↗</strong>';
  grid.insertBefore(el,grid.firstChild);
}
function page(){
  var video='https://www.youtube.com/watch?v='+ID;
  return '<main class="ks-happ ks-sleeve ks-arctic" data-arctic-id="'+ID+'" lang="'+lang()+'" dir="'+tr('rtl','ltr')+'">'+
    '<div class="ks-happ-wrap"><nav class="ks-happ-breadcrumb" aria-label="'+tr('مسار التصفح','Breadcrumb')+'">'+
    '<a href="'+href(INDEX)+'">'+tr('حكايات من الطريق','Stories from the Road')+'</a> / '+tr('النرويج · القطب الشمالي','Norway · Arctic Circle')+'</nav>'+
    '<header class="ks-happ-head"><small>KARIM SAAB | '+tr('فيديو ومقال وثائقي','DOCUMENTARY VIDEO & ARTICLE')+'</small><h1>'+safe(title())+'</h1></header>'+
    '<div class="ks-happ-split"><div class="ks-happ-video-pane">'+
    '<div class="ks-happ-player" id="ks-arctic-player"><button type="button" class="ks-sleeve-poster ks-sleeve-owner-portrait" data-arctic-play aria-label="'+tr('تشغيل الفيديو','Play video')+'">'+
    '<img class="ks-sleeve-cover ks-arctic-owner-cover" src="'+safe(cover())+'" width="857" height="1536" alt="'+safe(title())+'" decoding="async">'+
    '<span class="ks-sleeve-gold-play">▶ '+tr('تشغيل الفيديو','Play video')+'</span></button></div></div>'+
    '<article id="ks-arctic-article" class="ks-happ-article-pane ks-sleeve-article" lang="'+lang()+'" dir="'+tr('rtl','ltr')+'">'+
    articleHtml(body())+
    '<section class="ks-arctic-tags" aria-label="'+tr('الوسوم','Tags')+'"><strong>'+tr('الوسوم','Tags')+':</strong> '+safe(item.tags)+'</section></article></div>'+
    '<p class="ks-happ-watch-link ks-sleeve-external"><a href="'+video+'" target="_blank" rel="noopener noreferrer">'+tr('مشاهدة الفيديو مباشرة على YouTube','Watch directly on YouTube')+'</a></p>'+
    '<a class="ks-happ-back" href="'+href(INDEX)+'">'+tr('العودة إلى حكايات من الطريق','Back to Stories from the Road')+'</a></div></main>';
}
function bind(){
  var root=document.querySelector('#app > main.ks-arctic');if(!root)return;
  var img=root.querySelector('.ks-arctic-owner-cover');
  if(img&&!img.dataset.bound){
    img.dataset.bound='1';
    img.addEventListener('error',function(){img.hidden=true;root.querySelector('[data-arctic-play]').classList.add('ks-sleeve-no-image')});
  }
  var button=root.querySelector('[data-arctic-play]');
  if(button&&!button.dataset.bound){
    button.dataset.bound='1';
    button.addEventListener('click',function(){
      var player=root.querySelector('#ks-arctic-player');if(!player)return;
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
  if(current!==ROUTE)return;
  var main=document.querySelector('#app > main');if(!main)return;
  if(!main.classList.contains('ks-arctic')||main.getAttribute('lang')!==lang())main.outerHTML=page();
  bind();
  document.title=item[ar()?'seo_title_ar':'seo_title_en'];
  var meta=document.querySelector('meta[name="description"]');
  if(meta)meta.content=item[ar()?'description_ar':'description_en'];
}
function load(){
  if(pending)return pending;
  pending=fetch(DATA).then(function(r){if(!r.ok)throw Error('Approved Arctic article unavailable');return r.json()})
    .then(function(x){
      if(x.youtube_id!==ID||x.route!==ROUTE||!x.article_ar||!x.article_en||
         !x.poster_asset_ar||!x.poster_asset_en||x.poster_status!=='approved_and_published')
        throw Error('Approved Arctic record is incomplete');
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