/* KARIM SAAB — Health video article, source-preserving bilingual V1.0.
 * Reuses the approved Happiness video/article layout and the existing Health section.
 * Article Markdown is loaded verbatim from data/health-sleeve-v1.json.
 */
(function () {
  'use strict';
  var ROUTE='about/health/from-150kg-to-cycling-europe';
  var SOURCE='data/health-sleeve-v1.json?v=Cv8l-mLzG9g-v1';
  var item=null;
  function isAr(){return state.lang!=='en';}
  function L(a,e){return isAr()?a:e;}
  function safe(s){return String(s==null?'':s).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x];});}
  function formatted(s){return safe(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}
  function markdown(s){
    return String(s).split('\n').map(function(line){
      if(!line.trim())return '';
      if(line.startsWith('### '))return '<h3>'+formatted(line.slice(4))+'</h3>';
      if(line.startsWith('# '))return '<h1>'+formatted(line.slice(2))+'</h1>';
      if(line.startsWith('> '))return '<blockquote class="ks-sleeve-quote"><p>'+formatted(line.slice(2))+'</p></blockquote>';
      return '<p>'+formatted(line)+'</p>';
    }).join('\n');
  }
  function card(){
    if(!item)return;
    var cardTarget=document.querySelector('#app > main.ks-health-main .ks-health-wrap');
    if(cardTarget&&!cardTarget.querySelector('[data-sleeve-card]')){
      var card=document.createElement('a');
      card.className='ks-health-panel ks-health-article-card ks-sleeve-card';
      card.href=path(ROUTE);
      card.setAttribute('data-sleeve-card','1');
      card.innerHTML='<span class="ks-health-icon" aria-hidden="true">🚴</span><span style="flex:1"><strong>'+safe(L(item.title_ar,item.title_en))+'</strong><small>'+safe(L('قصتي من وزن 150 كيلوغرامًا إلى رحلة أوروبا بالدراجة بعد التكميم. فيديو ومقال كامل.','My journey from 150 kg to cycling across Europe after sleeve gastrectomy. Full video and article.'))+'</small></span><span class="ks-health-linkmark" aria-hidden="true">↗</span>';
      cardTarget.appendChild(card);
    }
    var tiles=document.querySelector('#app > main.ks-about-main .ks-ab-tiles');
    if(tiles&&!tiles.querySelector('[data-sleeve-card]')){
      var tile=document.createElement('a');
      tile.className='ks-ab-tile';
      tile.href=path(ROUTE);
      tile.setAttribute('data-sleeve-card','1');
      tile.innerHTML='<span class="ks-ab-badgeicon" aria-hidden="true">▶</span><span class="ks-ab-tilecopy"><strong>'+safe(L(item.title_ar,item.title_en))+'</strong><span class="ks-ab-desc">'+safe(L('فيديو ومقال كامل: من 150 كجم إلى ركوب الدراجة في أوروبا.','Full video and article: from 150 kg to cycling across Europe.'))+'</span><span class="ks-ab-status">'+L('مقال معتمد','Approved article')+'</span></span><span class="ks-ab-arrow" aria-hidden="true">↗</span>';
      tiles.appendChild(tile);
    }
  }
  function page(){
    var title=L(item.title_ar,item.title_en);
    var article=L(item.article_ar,item.article_en);
    var video='https://www.youtube.com/watch?v='+encodeURIComponent(item.youtube_id);
    var poster='https://i.ytimg.com/vi/'+encodeURIComponent(item.youtube_id)+'/maxresdefault.jpg';
    return '<main class="ks-happ ks-sleeve" data-sleeve-id="'+safe(item.youtube_id)+'" dir="'+L('rtl','ltr')+'">'+
      '<div class="ks-happ-wrap"><nav class="ks-happ-breadcrumb" aria-label="'+L('مسار التصفح','Breadcrumb')+'">'+
      '<a href="'+path('about')+'">'+L('من أنا','About Me')+'</a> / <a href="'+path('about/health')+'">'+L('ماذا تعرف عن صحتك؟','What Do You Know About Your Health?')+'</a></nav>'+
      '<header class="ks-happ-head"><small>KARIM SAAB | '+L('فيديو ومقال وثائقي','DOCUMENTARY VIDEO & ARTICLE')+'</small><h1>'+safe(title)+'</h1></header>'+
      '<div class="ks-happ-split"><div class="ks-happ-video-pane">'+
      '<div class="ks-happ-player" id="ks-sleeve-player"><button type="button" class="ks-sleeve-poster" data-sleeve-play aria-label="'+safe(L('تشغيل الفيديو','Play video'))+'">'+
      '<img class="ks-sleeve-cover" src="'+safe(poster)+'" alt="'+safe(title)+'" width="1280" height="720" decoding="async">'+
      '<span class="ks-sleeve-gold-play">▶ '+L('تشغيل الفيديو','Play video')+'</span></button></div></div>'+
      '<article id="ks-sleeve-article" class="ks-happ-article-pane ks-sleeve-article" lang="'+L('ar','en')+'" dir="'+L('rtl','ltr')+'">'+markdown(article)+'</article></div>'+
      '<p class="ks-happ-watch-link ks-sleeve-external"><a href="'+safe(video)+'" target="_blank" rel="noopener noreferrer">'+L('مشاهدة الفيديو مباشرة على YouTube','Watch directly on YouTube')+'</a></p>'+
      '<a class="ks-happ-back" href="'+path('about/health')+'">'+L('العودة إلى قسم الصحة','Back to Health')+'</a></div></main>';
  }
  function bind(){
    var root=document.querySelector('#app > main.ks-sleeve');
    if(!root)return;
    var thumb=root.querySelector('.ks-sleeve-cover');
    if(thumb&&!thumb.dataset.fallbackBound){
      thumb.dataset.fallbackBound='1';
      var srcs=['sddefault.jpg','hqdefault.jpg','mqdefault.jpg'];
      var index=0;
      function next(){
        if(index<srcs.length)thumb.src='https://i.ytimg.com/vi/'+item.youtube_id+'/'+srcs[index++];
        else {thumb.hidden=true;root.querySelector('.ks-sleeve-poster').classList.add('ks-sleeve-no-image');}
      }
      thumb.addEventListener('error',next);
      thumb.addEventListener('load',function(){if(thumb.naturalWidth<=120)next();});
      if(thumb.complete&&thumb.naturalWidth<=120)next();
    }
    var button=root.querySelector('[data-sleeve-play]');
    if(button&&!button.dataset.bound){
      button.dataset.bound='1';
      button.addEventListener('click',function(){
        var player=root.querySelector('#ks-sleeve-player');
        if(!player)return;
        var iframe=document.createElement('iframe');
        iframe.id='ks-sleeve-youtube-embed';
        iframe.src='https://www.youtube-nocookie.com/embed/'+item.youtube_id+'?autoplay=1&playsinline=1&rel=0';
        iframe.title=L(item.title_ar,item.title_en);
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
        iframe.allow='autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; web-share';
        iframe.allowFullscreen=true;
        iframe.referrerPolicy='strict-origin-when-cross-origin';
        player.classList.add('is-playing');
        player.replaceChildren(iframe);
      });
    }
  }
  function mount(){
    var route=(state.route||'').split('?')[0];
    if(route==='about/health'){card();return;}
    if(route!==ROUTE||!item)return;
    var old=document.querySelector('#app > main');
    if(!old)return;
    if(!old.classList.contains('ks-sleeve')||old.dataset.sleeveId!==item.youtube_id)old.outerHTML=page();
    bind();
    document.title=L(item.title_ar,item.title_en)+' | KARIM SAAB';
    var description=document.querySelector('meta[name="description"]');
    if(description)description.content=L(item.description_ar,item.description_en);
  }
  var previous=render;
  window.removeEventListener('hashchange',previous);
  render=function(){previous();mount();};
  window.addEventListener('hashchange',render);
  fetch(SOURCE).then(function(r){if(!r.ok)throw Error('Health source unavailable');return r.json();})
    .then(function(data){
      if(!/^[A-Za-z0-9_-]{11}$/.test(data.youtube_id)||data.youtube_id!=='Cv8l-mLzG9g'||!data.article_ar||!data.article_en)throw Error('Health article source incomplete');
      item=data;
      mount();
    }).catch(function(err){console.error('Approved health article could not load:',err.message);});
  render();
})();