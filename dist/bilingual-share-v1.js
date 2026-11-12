/* KARIM SAAB | bilingual contextual sharing. Additive: no route or article replacement. */
(function () {
  'use strict';
  var supported = ['x','facebook','whatsapp','telegram','linkedin','pinterest'];
  var glyphs = {x:'𝕏',facebook:'f',whatsapp:'WA',telegram:'✈',linkedin:'in',pinterest:'P'};
  var names = {x:'X',facebook:'Facebook',whatsapp:'WhatsApp',telegram:'Telegram',linkedin:'LinkedIn',pinterest:'Pinterest'};
  var resolved = Object.create(null);
  var scheduled = false;

  function current() {
    var hash = location.hash.replace(/^#\/?/,'').split('?')[0].replace(/\/$/,'');
    var parts = hash.split('/');
    var lang = parts[0] === 'en' ? 'en' : 'ar';
    return {lang:lang,route:(parts[0]==='ar'||parts[0]==='en'?parts.slice(1):parts).join('/')};
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function safeTag(s) {
    var words = String(s||'').normalize('NFKC').replace(/[\u064b-\u065f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);
    return words.length ? '#' + words.slice(0,4).join('_') : '';
  }
  function makeTags(route, lang, titleAR, titleEN) {
    var ar = ['#عبدالكريم_الصعب'], en = ['#KarimSaab'];
    var text = (route + ' ' + titleAR + ' ' + titleEN).toLowerCase();
    function add(a,b) { ar.push(a); en.push(b); }
    if (/after-sixty|الستين|sixty/.test(text)) add('#الحياة_بعد_الستين','#LifeAfter60');
    else if (/happiness|سعاد|السعادة/.test(text)) add('#خل_السعادة_عادة','#MakeHappinessAHabit');
    else if (/hiking|جبال|تسلق|mountain|camping|تخييم/.test(text)) add('#الهايكنج_والتخييم','#HikingAndCamping');
    else if (/cycling|دراج|bicycle|bike/.test(text)) add('#رحلات_بالدراجة','#BicycleTravel');
    else if (/video|فيديو|فيلم|film/.test(text)) add('#الأفلام_والقصص','#VideoStories');
    else if (/book|كتاب|كتب/.test(text)) add('#كتب_عبدالكريم_الصعب','#KarimSaabBooks');
    else if (/journey|travel|trip|رحل|فرنسا|اليونان|دولة/.test(text)) add('#مغامرات_السفر','#TravelAdventures');
    else add('#قصص_وتجارب','#StoriesAndExperiences');
    var uniqueAR=safeTag(titleAR), uniqueEN=safeTag(titleEN);
    if(uniqueAR)ar.push(uniqueAR);
    if(uniqueEN)en.push(uniqueEN);
    add('#من_قلب_التجربة','#FromExperience');
    function dedup(a) { return Array.from(new Set(a.filter(Boolean))).slice(0,5); }
    return {ar:dedup(ar),en:dedup(en)};
  }
  function meta(route,lang,main) {
    var lib=window.KARIM_LIBRARY||{};
    var ref=route.startsWith('content/') ? lib[decodeURIComponent(route.slice(8))] : null;
    var fromVideo=window.KARIM_VIDEO_ARTICLES_SOURCE && Array.isArray(window.KARIM_VIDEO_ARTICLES_SOURCE.videos)
      ? window.KARIM_VIDEO_ARTICLES_SOURCE.videos.find(function(v){return v.route===route;}) : null;
    var trip=(typeof journeys!=='undefined' && route.startsWith('journey/'))
      ? journeys.find(function(x){return x.slug===route.slice(8);}) : null;
    var about=window.KARIM_ABOUT_SOURCE && Array.isArray(window.KARIM_ABOUT_SOURCE.items) ?
      window.KARIM_ABOUT_SOURCE.items.find(function(x){return x.route===route;}) : null;
    var ar=ref&&ref.ar || fromVideo&&fromVideo.title_ar || about&&about.title_ar || trip&&trip.title&&trip.title[0] || '';
    var en=ref&&ref.en || fromVideo&&fromVideo.title_en || about&&about.title_en || trip&&trip.title&&trip.title[1] || '';
    var heading=main.querySelector('.ks-va-head h2,.ks60-episode-head h1,.source-feature h2,.body-prose h2,.ks-reading h2,h1,h2');
    var shown=heading&&heading.textContent.trim() || document.title.split('|')[0].trim();
    if(!ar && lang==='ar')ar=shown;
    if(!en && lang==='en')en=shown;
    var desc=ref && (lang==='ar'?ref.summary_ar:ref.summary_en) ||
      fromVideo && (lang==='ar'?fromVideo.caption_ar:fromVideo.caption_en) || about && (lang==='ar'?about.excerpt_ar:about.excerpt_en) || '';
    if(!desc) {
      var node=main.querySelector('.ks-va-caption,.source-intro,.journey-reading-note,.ks60-article-pane p,.body-prose p,.ks-reading p');
      desc=node&&node.textContent.trim()||'';
    }
    return {title:lang==='ar'?(ar||shown):(en||shown), ar:ar, en:en, desc:desc.slice(0,230)};
  }
  function locate(route,main) {
    // Match the real, published hash routes, not just the legacy short slugs.
    if (route.startsWith('about/after-sixty/')) {
      // Both the video player and full article must precede the share section.
      return main.querySelector('.ks60-wrap:has(.ks60-split)');
    }
    if (route.startsWith('about/happiness/video/')) {
      return main.querySelector('.ks-va-section,.ks-ab-container,.ks-reading');
    }
    if (route==='about/health/depression-anxiety/full')
      return main.querySelector('.ks-health-full');
    if (route==='about/health/depression-anxiety')
      return main.querySelector('.ks-health-article,.ks-health-detail,.ks-health-main,.ks-health-hero,.ks-health-cta') || main;
    if (route.startsWith('content/')) {
      // Detailed library articles, not the library category or unpublished indexes.
      return main.querySelector('.source-feature') || main.querySelector('.ks-ab-container:has(.ks-ab-grid)');
    }
    if (route.startsWith('journey/')||route.startsWith('entry/')) return main.querySelector('.body-prose');
    if (route.startsWith('guide/')) return main.querySelector('.ks-reading');
    if (route.startsWith('story/')) return main.querySelector('.body-prose');
    if (/\/video\//.test(route)) return main.querySelector('.ks-va-section,.ks-ab-container,.ks-reading,.body-prose,article');
    // About Me article pages are rendered by another module, and need explicit support.
    var source=window.KARIM_ABOUT_SOURCE;
    if (source && Array.isArray(source.items)) {
      var item=source.items.find(function(x){return x.route===route;});
      if (item && item.kind==='article') return main.querySelector('.ks-ab-container:has(.ks-ab-grid)') || main.querySelector('.ks-reading');
    }
    return null; // Ignore section listings, homepage, and utility pages.
  }
  function sharePage(r) {
    var slug=r.route.replace(/\//g,'-');
    return new URL('share/'+r.lang+'/'+slug+'.html',new URL('./',location.href.split('#')[0])).href;
  }
  function linkFor(network,url,m,tags,img) {
    var u=encodeURIComponent(url);
    var title=m.title + (tags?' '+tags:'');
    switch(network) {
      case 'x': return 'https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+u;
      case 'facebook': return 'https://www.facebook.com/sharer/sharer.php?u='+u;
      case 'whatsapp': return 'https://api.whatsapp.com/send?text='+encodeURIComponent(title+'\n'+url);
      case 'telegram': return 'https://t.me/share/url?url='+u+'&text='+encodeURIComponent(title);
      case 'linkedin': return 'https://www.linkedin.com/sharing/share-offsite/?url='+u;
      case 'pinterest': return 'https://www.pinterest.com/pin/create/button/?url='+u+(img?'&media='+encodeURIComponent(img):'')+'&description='+encodeURIComponent(title);
      default:return url;
    }
  }
  function copy(s) {
    if(navigator.clipboard&&window.isSecureContext) return navigator.clipboard.writeText(s);
    var x=document.createElement('textarea');x.value=s;x.style.position='fixed';x.style.left='-9999px';
    document.body.appendChild(x);x.select();
    var ok=document.execCommand('copy');x.remove();
    return ok ? Promise.resolve() : Promise.reject(new Error('Copy failed'));
  }
  function mount() {
    var r=current(), main=document.querySelector('#app > main');
    if(!main||!r.route) return;
    var target=locate(r.route,main);
    if(!target) return;
    var old=target.querySelector(':scope > .ks-share-v1');
    if(old&&old.dataset.route===r.route&&old.dataset.lang===r.lang)return;
    if(old)old.remove();
    var m=meta(r.route,r.lang,main), hashtags=makeTags(r.route,r.lang,m.ar,m.en), lang=r.lang==='ar';
    var itemIsVideo=!!(main.querySelector('video,.ks-va-section,.ks60-player,.ks-ab-video,iframe[src*="youtube"]') || /\/video\//.test(r.route) || /^about\/after-sixty\//.test(r.route));
    var h=lang?(itemIsVideo?'شارك هذا الفيديو':'شارك هذا المقال'):(itemIsVideo?'Share this video':'Share this article');
    var nativeAvailable=typeof navigator.share==='function';
    var box=document.createElement('section');
    box.className='ks-share-v1';box.dataset.route=r.route;box.dataset.lang=r.lang;box.setAttribute('aria-label',h);
    box.innerHTML='<div class="ks-share-v1-head"><div><span class="ks-share-v1-eyebrow">KARIM SAAB · SHARE</span><h3>'+h+'</h3></div><p>'+ (lang?'شارك المادة مباشرة أو انسخ رابطها مع الوسوم المناسبة.':'Share this item or copy its link with relevant hashtags.')+'</p></div>'+
      '<div class="ks-share-v1-buttons" role="group" aria-label="'+h+'">'+
      supported.map(function(network){
        return '<a class="ks-share-v1-link ks-share-v1-'+network+'" data-network="'+network+'" target="_blank" rel="noopener noreferrer" aria-label="'+(lang?'المشاركة عبر ':'Share on ')+names[network]+'" title="'+names[network]+'"><span aria-hidden="true">'+glyphs[network]+'</span><small>'+names[network]+'</small></a>';
      }).join('')+
      '<button class="ks-share-v1-copy" type="button" data-action="copy" aria-label="'+(lang?'نسخ رابط المادة':'Copy item link')+'"><span aria-hidden="true">🔗</span><small>'+(lang?'نسخ الرابط':'Copy link')+'</small></button>'+
      (nativeAvailable?'<button class="ks-share-v1-copy" type="button" data-action="native"><span aria-hidden="true">↗</span><small>'+(lang?'مشاركة الجهاز':'Device share')+'</small></button>':'')+'</div>'+
      '<div class="ks-share-v1-tags"><div class="ks-share-v1-tags-head"><strong>'+(lang?'وسوم مرتبطة بالموضوع':'Relevant topic hashtags')+'</strong><button type="button" data-action="tags">'+(lang?'نسخ الوسوم':'Copy hashtags')+'</button></div>'+
      '<div class="ks-share-v1-tag-list" dir="auto">'+hashtags.ar.map(function(t){return '<span lang="ar" dir="rtl">'+esc(t)+'</span>';}).join('')+
      hashtags.en.map(function(t){return '<span lang="en" dir="ltr">'+esc(t)+'</span>';}).join('')+'</div></div>'+
      '<p class="ks-share-v1-status" role="status" aria-live="polite"></p>';
    target.appendChild(box);

    var itemHashUrl=location.href.split('#')[0]+'#/'+r.lang+'/'+r.route, canonical=itemHashUrl;
    var imgNode=main.querySelector('.source-hero-photo img,.detail-media,.ks60-player img,.ks-va-section img');
    var imageUrl=imgNode&&imgNode.src||'';
    var hashText=hashtags[r.lang].join(' ');
    function updateLinks() {
      box.querySelectorAll('[data-network]').forEach(function(a){
        a.href=linkFor(a.dataset.network,canonical,m,hashText,imageUrl);
      });
    }
    function status(s) { var el=box.querySelector('.ks-share-v1-status');if(el)el.textContent=s; }
    updateLinks();
    var candidate=sharePage(r), cacheKey=r.lang+'/'+r.route;
    if(resolved[cacheKey]===true){canonical=candidate;updateLinks();}
    else if(resolved[cacheKey]!==false){
      fetch(candidate,{method:'HEAD'}).then(function(resp){
        resolved[cacheKey]=resp.ok;
        if(resp.ok&&box.isConnected){canonical=candidate;updateLinks();}
      }).catch(function(){resolved[cacheKey]=false;});
    }
    box.addEventListener('click',function(e){
      var btn=e.target.closest('[data-action]');if(!btn)return;
      var action=btn.dataset.action;
      if(action==='copy'||action==='tags'){
        var value=action==='copy'?canonical:hashtags.ar.concat(hashtags.en).join(' ');
        copy(value).then(function(){status(lang?'تم النسخ بنجاح':'Copied successfully');})
          .catch(function(){status(lang?'تعذر النسخ الآلي، استخدم زر المشاركة.':'Copy unavailable; use a share button.');});
      }else if(action==='native'&&nativeAvailable){
        navigator.share({title:m.title,text:hashText,url:canonical}).catch(function(){});
      }
    });
  }
  function schedule() {
    if(scheduled)return;
    scheduled=true;
    Promise.resolve().then(function(){scheduled=false;mount();});
  }
  var host=document.getElementById('app');
  if(host) new MutationObserver(schedule).observe(host,{childList:true,subtree:true});
  window.addEventListener('hashchange',schedule);
  schedule();
})();