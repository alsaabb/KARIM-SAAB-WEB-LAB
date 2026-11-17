/* KARIM SAAB V3 — reusable bilingual documentary renderer.
 * Index is an approved public-content registry, not a publishing permission.
 * No external data, private Drive URLs, or automatic YouTube upload.
 */
(function(){
  'use strict';
  var INDEX_PATH='data/story-publisher-v3-index.json';
  var entries=[],byRoute=Object.create(null),records=Object.create(null);
  var loading=Object.create(null);
  function escapeHTML(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function isArabic(){return state.lang!=='en'}
  function lang(){return isArabic()?'ar':'en'}
  function t(a,b){return isArabic()?a:b}
  function current(){return String(state.route||'').split('?')[0]}
  function url(route){return '#/'+lang()+'/'+route}
  function field(data,name){return data[name+'_'+lang()]}
  function articleHTML(text){
    var lines=String(text||'').split('\n').filter(function(x){return x.trim()});
    return lines.map(function(line,i){
      var safe=escapeHTML(line);
      if(i===0)return '<h1>'+safe+'</h1>';
      if(i===1)return '<p class="ks-story-v3-byline">'+safe+'</p>';
      if((line.endsWith(':')||line.endsWith('：')) && line.length<130)return '<h2>'+safe+'</h2>';
      if(line.startsWith('«')||line.startsWith('“'))return '<blockquote class="ks-sleeve-quote"><p>'+safe+'</p></blockquote>';
      return '<p>'+safe+'</p>';
    }).join('\n');
  }
  function addCards(){
    var grid=document.querySelector('#app > main .ks-card-grid');
    if(!grid)return;
    entries.forEach(function(entry){
      if(grid.querySelector('[data-v3-story="'+entry.route+'"]'))return;
      var a=document.createElement('a');
      a.className='ks-simple-card ks-story-v3-card';
      a.dataset.v3Story=entry.route;
      a.href=url(entry.route);
      a.innerHTML='<img src="'+escapeHTML(field(entry,'poster_asset'))+'" width="'+entry.poster_width+'" height="'+entry.poster_height+'" loading="lazy" decoding="async" alt="'+escapeHTML(field(entry,'title'))+'">'+
        '<span class="eyebrow">'+t('قصة وثائقية','DOCUMENTARY STORY')+'</span><h3>'+escapeHTML(field(entry,'title'))+'</h3><p>'+escapeHTML(field(entry,'description'))+'</p>';
      grid.appendChild(a);
    });
  }
  function page(data){
    var id=data.youtube_id;
    var title=field(data,'title'),body=field(data,'article');
    var cover=field(data,'poster_asset'),note=field(data,'poster_note');
    var video='https://www.youtube.com/watch?v='+id;
    return '<main class="ks-happ ks-sleeve ks-arctic ks-story-v3" data-v3-route="'+escapeHTML(data.route)+'" lang="'+lang()+'" dir="'+t('rtl','ltr')+'">'+
      '<div class="ks-happ-wrap"><nav class="ks-happ-breadcrumb"><a href="'+url('stories-road')+'">'+t('حكايات من الطريق','Stories from the Road')+'</a></nav>'+
      '<header class="ks-happ-head"><small>KARIM SAAB · '+t('فيديو ومقال وثائقي','DOCUMENTARY VIDEO & ARTICLE')+'</small><h1>'+escapeHTML(title)+'</h1></header>'+
      '<div class="ks-happ-split"><div class="ks-happ-video-pane"><div class="ks-happ-player" id="ks-story-v3-player">'+
      '<button type="button" class="ks-sleeve-poster ks-sleeve-owner-portrait" data-v3-play aria-label="'+t('تشغيل الفيديو','Play video')+'">'+
      '<img class="ks-sleeve-cover" src="'+escapeHTML(cover)+'" width="'+data.poster_width+'" height="'+data.poster_height+'" alt="'+escapeHTML(title)+'" decoding="async">'+
      '<span class="ks-sleeve-gold-play">▶ '+t('تشغيل الفيديو','Play video')+'</span></button></div></div>'+
      '<article class="ks-happ-article-pane ks-sleeve-article" lang="'+lang()+'" dir="'+t('rtl','ltr')+'">'+
      articleHTML(body)+'<section class="ks-story-v3-tags"><strong>'+t('الوسوم','Tags')+':</strong> '+escapeHTML(data.tags)+'</section></article></div>'+
      '<p class="ks-happ-watch-link ks-sleeve-external"><a href="'+video+'" target="_blank" rel="noopener noreferrer">'+t('مشاهدة الفيديو على YouTube','Watch on YouTube')+'</a></p>'+
      (note?'<p class="ks-story-v3-disclosure">'+escapeHTML(note)+'</p>':'')+
      '<a class="ks-happ-back" href="'+url('stories-road')+'">'+t('حكايات من الطريق','Stories from the Road')+'</a></div></main>';
  }
  function mountStory(data){
    var main=document.querySelector('#app > main');
    if(!main)return;
    if(!main.classList.contains('ks-story-v3') ||
       main.getAttribute('lang')!==lang() ||
       main.dataset.v3Route!==data.route){
      main.outerHTML=page(data);
    }
    var root=document.querySelector('#app > main.ks-story-v3');
    if(!root)return;
    var button=root.querySelector('[data-v3-play]');
    if(button && !button.dataset.bound){
      button.dataset.bound='1';
      button.addEventListener('click',function(){
        var player=root.querySelector('#ks-story-v3-player');
        if(!player||player.classList.contains('is-playing'))return;
        var iframe=document.createElement('iframe');
        iframe.src='https://www.youtube-nocookie.com/embed/'+data.youtube_id+'?autoplay=1&playsinline=1&rel=0';
        iframe.title=field(data,'title');
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
        iframe.allow='autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; web-share';
        iframe.allowFullscreen=true;
        iframe.referrerPolicy='strict-origin-when-cross-origin';
        player.classList.add('is-playing');
        player.replaceChildren(iframe);
      });
    }
    document.title=field(data,'seo_title');
    var description=document.querySelector('meta[name="description"]');
    if(description)description.content=field(data,'description');
  }
  function loadStory(entry){
    var route=entry.route;
    if(records[route]){mountStory(records[route]);return;}
    if(loading[route])return;
    loading[route]=fetch(entry.source).then(function(response){
      if(!response.ok)throw Error('V3 source unavailable: '+route);
      return response.json();
    }).then(function(data){
      if(data.route!==route||data.youtube_id!==entry.youtube_id)throw Error('V3 source mismatch: '+route);
      records[route]=data;
      if(current()===route)mountStory(data);
    }).catch(function(error){console.error(error.message)}).finally(function(){delete loading[route]});
  }
  function mount(){
    var route=current();
    if(route==='stories-road'){addCards();return;}
    if(byRoute[route])loadStory(byRoute[route]);
  }
  if(typeof render!=='function'||typeof state==='undefined')return;
  var previous=render;
  window.removeEventListener('hashchange',previous);
  render=function(){previous();mount();};
  window.addEventListener('hashchange',render);
  fetch(INDEX_PATH).then(function(response){
    if(!response.ok)throw Error('V3 index unavailable');
    return response.json();
  }).then(function(index){
    if(index.schema_version!=='3.0'||!Array.isArray(index.entries))throw Error('Invalid V3 index');
    entries=index.entries;
    entries.forEach(function(entry){byRoute[entry.route]=entry;});
    mount();
  }).catch(function(error){console.error('V3 registry:',error.message)});
})();
