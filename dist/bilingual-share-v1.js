/* KARIM SAAB | bilingual contextual sharing. Additive: no route or article replacement. */
(function () {
  'use strict';
  var supported = ['x','facebook','whatsapp','telegram','linkedin','pinterest'];
  var glyphs = {"x":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z\"/></svg>","facebook":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z\"/></svg>","whatsapp":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"/></svg>","telegram":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z\"/></svg>","linkedin":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 1 1 0-4.122 2.06 2.06 0 0 1 0 4.122zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.201 0 22.222 0h.003z\"/></svg>","pinterest":"<svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z\"/></svg>"};
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
    else if (/health|depression|anxiety|الاكتئاب|القلق|صحة/.test(text)) add('#التثقيف_الصحي','#HealthEducation');
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
      return main.querySelector('.ks60-split') ? main.querySelector('.ks60-wrap') : null;
    }
    if (route.startsWith('about/happiness/video/')) {
      return main.querySelector('.ks-va-section') || main.querySelector('.ks-ab-container,.ks-reading');
    }
    if (route==='about/health/depression-anxiety/full')
      return main.querySelector('.ks-health-full');
    if (route==='about/health/depression-anxiety')
      return main.querySelector('.ks-health-wrap') || main;
    if (route.startsWith('content/')) {
      // Detailed library articles, not the library category or unpublished indexes.
      return main.querySelector('.source-feature') || (main.querySelector('.ks-ab-grid') ? main.querySelector('.ks-ab-container') : null);
    }
    if (route.startsWith('journey/')||route.startsWith('entry/')) return main.querySelector('.body-prose');
    if (route.startsWith('guide/')) return main.querySelector('.ks-reading');
    if (route.startsWith('story/')) return main.querySelector('.body-prose');
    if (/\/video\//.test(route)) return main.querySelector('.ks-va-section,.ks-ab-container,.ks-reading,.body-prose,article');
    // About Me article pages are rendered by another module, and need explicit support.
    var source=window.KARIM_ABOUT_SOURCE;
    if (source && Array.isArray(source.items)) {
      var item=source.items.find(function(x){return x.route===route;});
      if (item && item.kind==='article') return main.querySelector('.ks-ab-grid') ? main.querySelector('.ks-ab-container') : main.querySelector('.ks-reading');
    }
    return null; // Ignore section listings, homepage, and utility pages.
  }
  function sharePage(r,kind) {
    var slug=r.route.replace(/\//g,'-');
    if (r.route.startsWith('about/after-sixty/')) {
      slug='after-sixty-'+r.route.slice('about/after-sixty/'.length)+'-'+kind;
    }
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

  // Render a kind-specific share panel: video and article are distinct publications.
  function addShare(target, r, main, kind) {
    if (!target) return;
    var old=target.querySelector(':scope > .ks-share-v1');
    if (old && old.dataset.route===r.route && old.dataset.lang===r.lang && old.dataset.kind===kind) return;
    if (old) old.remove();
    var lang=r.lang==='ar', m=meta(r.route,r.lang,main), hashtags=makeTags(r.route,r.lang,m.ar,m.en);
    var typeTags=kind==='video' ? {ar:'#فيديو',en:'#Video'} : {ar:'#مقال',en:'#Article'};
    hashtags.ar.push(typeTags.ar);hashtags.en.push(typeTags.en);
    var namePrefix=lang?(kind==='video'?'فيديو: ':'مقال: '):(kind==='video'?'Video: ':'Article: ');
    m.title=namePrefix+m.title;
    var h=lang?(kind==='video'?'شارك هذا الفيديو':'شارك هذا المقال'):(kind==='video'?'Share this video':'Share this article');
    var nativeAvailable=typeof navigator.share==='function';
    var box=document.createElement('section');
    box.className='ks-share-v1';box.dataset.route=r.route;box.dataset.lang=r.lang;box.dataset.kind=kind;
    box.setAttribute('aria-label',h);
    box.innerHTML='<div class="ks-share-v1-head"><div><span class="ks-share-v1-eyebrow">KARIM SAAB · '+(kind==='video'?'VIDEO':'ARTICLE')+'</span><h3>'+h+'</h3></div><p>'+
      (lang?(kind==='video'?'شارك رابط الفيديو نفسه.':'شارك رابط المقال نفسه.'):(kind==='video'?'Share the video link.':'Share the article link.'))+'</p></div>'+
      '<div class="ks-share-v1-buttons" role="group" aria-label="'+h+'">'+
      supported.map(function(network){
        return '<a class="ks-share-v1-link ks-share-v1-'+network+'" data-network="'+network+'" target="_blank" rel="noopener noreferrer" aria-label="'+(lang?'المشاركة عبر ':'Share on ')+names[network]+'" title="'+names[network]+'"><span aria-hidden="true">'+glyphs[network]+'</span><small>'+names[network]+'</small></a>';
      }).join('')+
      '<button class="ks-share-v1-copy" type="button" data-action="copy" aria-label="'+(lang?'نسخ رابط '+(kind==='video'?'الفيديو':'المقال'):'Copy '+kind+' link')+'"><span aria-hidden="true">🔗</span><small>'+(lang?'نسخ الرابط':'Copy link')+'</small></button>'+
      (nativeAvailable?'<button class="ks-share-v1-copy" type="button" data-action="native"><span aria-hidden="true">↗</span><small>'+(lang?'مشاركة الجهاز':'Device share')+'</small></button>':'')+'</div>'+
      '<div class="ks-share-v1-tags"><div class="ks-share-v1-tags-head"><strong>'+(lang?'وسوم مرتبطة بالموضوع':'Relevant topic hashtags')+'</strong><button type="button" data-action="tags">'+(lang?'نسخ الوسوم':'Copy hashtags')+'</button></div>'+
      '<div class="ks-share-v1-tag-list" dir="auto">'+hashtags.ar.map(function(t){return '<span lang="ar" dir="rtl">'+esc(t)+'</span>';}).join('')+
      hashtags.en.map(function(t){return '<span lang="en" dir="ltr">'+esc(t)+'</span>';}).join('')+'</div></div>'+
      '<p class="ks-share-v1-status" role="status" aria-live="polite"></p>';
    target.appendChild(box);
    var dual=r.route.startsWith('about/after-sixty/');
    var base=location.href.split('#')[0];
    // A deep link also works if the static social-preview page is unavailable.
    var canonical=base+'#/'+r.lang+'/'+r.route+(dual?'?focus='+kind:'');
    var imageNode=main.querySelector('.source-hero-photo img,.detail-media,.ks60-player img,.ks-va-section img');
    var imageUrl=imageNode&&imageNode.src||'';
    var hashText=hashtags[r.lang].join(' ');
    function updateLinks(){
      box.querySelectorAll('[data-network]').forEach(function(a){a.href=linkFor(a.dataset.network,canonical,m,hashText,imageUrl);});
    }
    function status(msg){var p=box.querySelector('.ks-share-v1-status');if(p)p.textContent=msg;}
    updateLinks();
    var candidate=sharePage(r,kind),cacheKey=r.lang+'/'+r.route+'/'+kind;
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
  var lastFocus='';
  function mount() {
    var r=current(),main=document.querySelector('#app > main');
    if(!main||!r.route)return;
    if(r.route.startsWith('about/after-sixty/')) {
      var videoPane=main.querySelector('#ks60-video-pane');
      var articlePane=main.querySelector('#ks60-article-pane');
      if(!videoPane || !articlePane)return; // Wait for asynchronous episode rendering.
      addShare(videoPane,r,main,'video');
      // Do not claim there is a full published article when it is still under review.
      if(!articlePane.querySelector('.ks60-language-note,.ks60-notice')) addShare(articlePane,r,main,'article');
      var focus=/(?:^|[?&])focus=(article|video)(?:&|$)/.exec(location.hash.split('?')[1]||'');
      if(focus && lastFocus!==location.hash){
        var focusTarget=focus[1]==='article'?articlePane:videoPane;
        if(focusTarget && typeof focusTarget.scrollIntoView==='function'){
          lastFocus=location.hash;
          focusTarget.scrollIntoView({behavior:'auto',block:'start'});
        }
      }
      return;
    }
    var target=locate(r.route,main);
    if(!target)return;
    var isVideo=/\/video\//.test(r.route) || (main.querySelector('.ks-va-section,.ks-ab-video') && !/^about\/health\//.test(r.route));
    addShare(target,r,main,isVideo?'video':'article');
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