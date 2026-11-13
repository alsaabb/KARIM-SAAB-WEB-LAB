/* KARIM SAAB — Stories from the Road: approved bilingual Wild Boar in Greece.
 * Source of article copy: owner-approved Google Docs, 2026-11-13.
 * Additive to the existing router and shared header/footer. */
(function(){
  'use strict';
  var STORY='story/wild-boar-greece',INDEX='stories-road',VIDEO='SVdg9IxoS4k',data=null,promise=null,token=0;
  function ar(){return state.lang!=='en'}
  function tr(a,b){return ar()?a:b}
  function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function link(r){return '#/'+(ar()?'ar':'en')+'/'+r}
  function article(){return data.langs[ar()?'ar':'en']}
  function routeNow(){return (state.route||'').split('?')[0]}
  function videoPoster(kind){
    var lang=article(),src='https://i.ytimg.com/vi/'+VIDEO+'/maxresdefault.jpg';
    return '<div class="ks-wb-video-surface" id="ks-wb-player">'+
      '<button type="button" class="ks-wb-play" data-wb-play aria-label="'+esc(tr('تشغيل فيديو المواجهة','Play encounter video'))+'">'+
       '<img data-wb-poster alt="'+esc(lang.title)+'" src="'+src+'" loading="'+(kind==='card'?'lazy':'eager')+'">'+
       '<span class="ks-wb-fallback-copy" aria-hidden="true">'+esc(tr('مواجهة في الظلام · الخنزير البري في اليونان','ENCOUNTER IN THE DARK · WILD BOAR IN GREECE'))+'</span>'+
       '<span class="ks-wb-gold-play" aria-hidden="true">▶</span>'+
       '<span class="ks-wb-play-label">'+esc(tr('شاهد المواجهة','Watch the encounter'))+'</span>'+
      '</button></div>'
  }
  function imageFallback(img){
    if(!img||img.dataset.wbFallback)return;
    img.dataset.wbFallback='1';
    var urls=['https://i.ytimg.com/vi/'+VIDEO+'/sddefault.jpg','https://i.ytimg.com/vi/'+VIDEO+'/hqdefault.jpg'];var idx=0;
    function next(){if(idx<urls.length){img.src=urls[idx++]}else{img.hidden=true;img.closest('.ks-wb-play,.ks-wb-card-poster')?.classList.add('ks-wb-no-thumb')}}
    img.addEventListener('error',next);
    // Reuse the verified, successfully loaded YouTube thumbnail as a soft background.
    // This fills the vertical player without cropping the horizontal source artwork.
    function applyBackdrop(){
      if(img.naturalWidth<=120){next();return}
      var play=img.closest('.ks-wb-play');
      if(play)play.style.setProperty('--wb-poster-image','url("'+img.currentSrc+'")');
    }
    img.addEventListener('load',applyBackdrop);
    if(img.complete)applyBackdrop();
  }
  function buildStory(){
    var a=article();
    var paragraphs=a.sections.map(function(item){
      return item.type==='heading'?'<h2>'+esc(item.text)+'</h2>':'<p>'+esc(item.text)+'</p>'
    }).join('');
    var hashes=a.hashtags.map(function(x){return '<span>'+esc(x)+'</span>'}).join(' ');
    var source='https://www.youtube.com/shorts/'+VIDEO;
    return '<main class="ks-wb" data-wb-route="'+esc(STORY)+'" lang="'+(ar()?'ar':'en')+'" dir="'+(ar()?'rtl':'ltr')+'">'+
       '<div class="ks-wb-shell">'+
         '<nav class="ks-wb-crumb" aria-label="'+esc(tr('مسار التصفح','Breadcrumb'))+'"><a href="'+link(INDEX)+'">'+esc(tr('حكايات من الطريق','Stories from the Road'))+'</a><span aria-hidden="true"> / </span>'+esc(tr('مواجهة في الظلام','Encounter in the Dark'))+'</nav>'+
         '<header class="ks-wb-head"><span class="ks-wb-kicker">KARIM SAAB · REAL ADVENTURE</span><h1>'+esc(a.title)+'</h1><p>'+esc(a.byline)+'</p></header>'+
         '<div class="ks-wb-layout"><aside class="ks-wb-video-pane">'+
            '<div class="ks-wb-sticky">'+videoPoster('hero')+
             '<div class="ks-wb-video-links"><a href="'+source+'" target="_blank" rel="noopener noreferrer">'+esc(tr('فتح الفيديو الأصلي على YouTube','Open original video on YouTube'))+' ↗</a>'+
             '<span>'+esc(tr('الفيديو رأسي 9:16 — غلاف من YouTube','Portrait video 9:16 — YouTube thumbnail'))+'</span></div></div>'+
           '</aside><article class="ks-wb-article" id="ks-wb-article"><div class="ks-wb-article-label">'+esc(tr('القصة الكاملة','THE FULL STORY'))+'</div>'+
             paragraphs+
             '<div class="ks-wb-source-link"><a href="'+source+'" target="_blank" rel="noopener noreferrer">'+esc(tr('شاهد لحظة المواجهة الموثقة','Watch the recorded encounter'))+' ↗</a></div>'+
             '<div class="ks-wb-hashtags" aria-label="'+esc(tr('وسوم القصة','Story hashtags'))+'">'+hashes+'</div></article></div>'+
         '<div class="ks-wb-back"><a href="'+link(INDEX)+'">'+esc(tr('العودة إلى حكايات من الطريق','Back to Stories from the Road'))+' ↗</a></div>'+
       '</div>'+
       (typeof finalTags==='function'?'<div class="container">'+finalTags()+'</div>':'')+
       (typeof shareUI==='function'?shareUI():'')+
      '</main>'
  }
  function bindStory(main){
    imageFallback(main.querySelector('[data-wb-poster]'));
    var play=main.querySelector('[data-wb-play]');
    if(play)play.addEventListener('click',function(){
      var player=main.querySelector('#ks-wb-player');if(!player)return;
      var iframe=document.createElement('iframe');
      iframe.src='https://www.youtube-nocookie.com/embed/'+VIDEO+'?autoplay=1&playsinline=1&rel=0';
      iframe.title=article().title;
      iframe.allow='autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; web-share';
      iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.loading='eager';
      player.replaceChildren(iframe);
    });
    if(typeof bindShare==='function')bindShare();
  }
  function card(){
    var a=article();
    return '<a class="ks-simple-card ks-wb-card" data-wb-index-card href="'+link(STORY)+'">'+
      '<div class="ks-wb-card-poster"><img data-wb-card-poster src="https://i.ytimg.com/vi/'+VIDEO+'/hqdefault.jpg" alt="'+esc(a.title)+'" loading="lazy"><span class="ks-wb-card-fallback">'+esc(tr('غابات اليونان · مواجهة الخنزير البري','GREECE · WILD BOAR ENCOUNTER'))+'</span></div>'+
      '<span class="eyebrow">'+esc(tr('اليونان · مغامرة حقيقية بالدراجة','GREECE · REAL CYCLING ADVENTURE'))+'</span>'+
      '<h3>'+esc(a.title)+'</h3><p>'+esc(a.sections[1].text)+'</p>'+
      '<span class="ks-wb-card-cta">'+esc(tr('شاهد الفيديو واقرأ القصة كاملة','Watch the video and read the full story'))+' ↗</span></a>'
  }
  function show(){
    var requested=routeNow(),serial=++token;
    if(requested!==STORY && requested!==INDEX)return;
    if(!data){load().then(function(){if(serial===token&&routeNow()===requested)show()}).catch(function(){
      if(requested===STORY){var main=document.querySelector('#app > main');if(main)main.outerHTML='<main class="ks-wb ks-wb-failure" role="alert">'+esc(tr('تعذّر تحميل المقال. يمكنك مشاهدة الفيديو مباشرة على YouTube.','Article could not load. Open the video directly on YouTube.'))+' <a href="https://www.youtube.com/shorts/'+VIDEO+'" rel="noopener noreferrer" target="_blank">YouTube ↗</a></main>'}
    });return}
    var main=document.querySelector('#app > main');if(!main)return;
    if(requested===INDEX){
      var grid=main.querySelector('.ks-card-grid');
      if(grid&&!grid.querySelector('[data-wb-index-card]')){
        grid.insertAdjacentHTML('afterbegin',card());
        imageFallback(grid.querySelector('[data-wb-card-poster]'));
      }
    }else{
      main.outerHTML=buildStory();
      var fresh=document.querySelector('#app > main.ks-wb');if(fresh)bindStory(fresh);
      document.title=article().title+' | KARIM SAAB';
      var meta=document.querySelector('meta[name="description"]');
      if(meta)meta.content=article().sections[1].text.slice(0,160);
    }
  }
  function load(){
    if(promise)return promise;
    promise=fetch('data/stories-road-v1.json?v=20261113-wb-v1').then(function(r){if(!r.ok)throw Error('Story data not available');return r.json()})
    .then(function(x){
      if(x.slug!=='wild-boar-greece'||x.youtube_id!==VIDEO||!x.langs||!x.langs.ar||!x.langs.en)throw Error('Invalid approved story');
      ['ar','en'].forEach(function(lang){if(!x.langs[lang].sections||x.langs[lang].sections.length<15)throw Error('Incomplete article')});
      data=x;return x
    });
    return promise
  }
  var previous=render;
  window.removeEventListener('hashchange',previous);
  render=function(){previous();show()};
  window.addEventListener('hashchange',render);
  render();
})();
