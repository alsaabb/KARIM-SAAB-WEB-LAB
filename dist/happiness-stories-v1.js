/* KARIM SAAB — bilingual Happiness Video + Article layout (approved V9 pattern).
 * Only two existing About > Happiness video routes are affected.
 * Full owner-supplied/polished essays live in data/happiness-stories-v1.json.
 * All HTML from content is escaped; article sharing is enabled for full translations.
 */
(function(){
  'use strict';
  var PREFIX='about/happiness/video/';
  var known=['happiness-not-for-sale','world-is-not-paradise'];
  var entries=null;
  var fetchError=false;
  function isAr(){return state.lang!=='en';}
  function tr(a,en){return isAr()?a:en;}
  function escH(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function route(to){return '#/'+(isAr()?'ar':'en')+'/'+to;}
  function currentStory(){
    var raw=(state.route||'').split('?')[0];
    if(!raw.startsWith(PREFIX))return null;
    var slug=raw.slice(PREFIX.length);
    if(known.indexOf(slug)<0||!entries)return null;
    return entries.find(function(e){return e.slug===slug;})||null;
  }
  function poster(story){
    var title=tr(story.title_ar,story.title_en);
    var src='assets/happiness/'+story.slug+'-youtube-poster.jpg';
    return '<button type="button" class="ks-happ-poster" data-happ-play aria-label="'+escH(tr('تشغيل فيديو: ','Play video: ')+title)+'">'+
      '<img class="ks-happ-cover" alt="'+escH(title)+'" src="'+escH(src)+'" decoding="async" data-happ-youtube-id="'+escH(story.youtube_id)+'">'+
      '<span class="ks-happ-poster-overlay"><span class="ks-happ-cta">'+tr('شاهد الفيديو','Watch video')+'</span></span></button>';
  }
  function article(story){
    var blocks=story.sections.map(function(section){
      var heading=tr(section.heading_ar,section.heading_en);
      var paragraphs=tr(section.paragraphs_ar,section.paragraphs_en);
      return '<section class="ks-happ-article-section"><h3>'+escH(heading)+'</h3>'+
        paragraphs.map(function(p){return '<p>'+escH(p)+'</p>';}).join('')+'</section>';
    }).join('');
    var citations=(story.sources||[]).map(function(s){
      return '<a href="'+escH(s.url)+'" rel="noopener noreferrer" target="_blank">'+escH(s.name)+'</a>';
    }).join(' · ');
    return '<article id="ks-happiness-article-pane" class="ks-happ-article-pane" lang="'+(isAr()?'ar':'en')+'" dir="'+(isAr()?'rtl':'ltr')+'" aria-label="'+tr('المقال الكامل','Full article')+'">'+
      '<div class="ks-happ-article-intro">'+
      '<span class="ks-happ-kicker">'+tr('مقالة مصاحبة للفيديو','ARTICLE ACCOMPANYING THE VIDEO')+'</span>'+
      '<h2>'+escH(tr(story.subtitle_ar,story.subtitle_en))+'</h2>'+
      '<p>'+escH(tr(story.excerpt_ar,story.excerpt_en))+'</p></div>'+
      blocks+
      (citations?'<div class="ks-happ-sources"><strong>'+tr('المصادر والمراجع:','Sources:')+'</strong> '+citations+'</div>':'')+
      '<p class="ks-happ-author">'+tr('بقلم: عبدالكريم بن إبراهيم الصعب','By Abdulkarim bin Ibrahim Al Saab')+'</p>'+
      '</article>';
  }
  function page(story){
    var title=tr(story.title_ar,story.title_en);
    var id=encodeURIComponent(story.youtube_id);
    var external='https://www.youtube.com/shorts/'+id;
    var drive='https://drive.google.com/file/d/'+encodeURIComponent(story.drive_file_id)+'/view';
    return '<main class="ks-happ" data-happiness-story="'+escH(story.slug)+'" dir="'+(isAr()?'rtl':'ltr')+'">'+
      '<div class="ks-happ-wrap">'+
       '<nav class="ks-happ-breadcrumb" aria-label="'+tr('مسار التصفح','Breadcrumb')+'">'+
        '<a href="'+route('about')+'">'+tr('من أنا','About Me')+'</a> / '+
        '<a href="'+route('about/happiness')+'">'+tr('خلّ السعادة عادة','Make Happiness a Habit')+'</a></nav>'+
       '<header class="ks-happ-head">'+
        '<small>KARIM SAAB | '+tr('قصة ومقال','VIDEO & ARTICLE')+'</small>'+
        '<h1>'+escH(title)+'</h1>'+
        '<p>'+escH(tr(story.subtitle_ar,story.subtitle_en))+'</p>'+
       '</header>'+
       '<div class="ks-happ-split">'+
        '<aside class="ks-happ-video-pane" id="ks-happiness-video-pane" aria-label="'+tr('فيديو القصة','Story video')+'">'+
         '<div class="ks-happ-player" id="ks-happ-player" data-orientation="vertical">'+poster(story)+'</div>'+
         '<p class="ks-happ-watch-link"><a href="'+external+'" target="_blank" rel="noopener noreferrer">'+tr('شاهده على YouTube','Watch on YouTube')+'</a>'+
          ' <span aria-hidden="true"> · </span> <a href="'+drive+'" rel="noopener noreferrer" target="_blank">'+tr('الفيديو الأصلي في Google Drive','Original video in Google Drive')+'</a>'+
          ' <span aria-hidden="true"> · </span> <a href="'+story.archive_folder_url+'" rel="noopener noreferrer" target="_blank">'+tr('مجلد القصة المعتمد','Approved story folder')+'</a></p>'+
        '</aside>'+
        article(story)+
       '</div>'+
       '<a class="ks-happ-back" href="'+route('about/happiness')+'">'+tr('العودة إلى خلّ السعادة عادة','Back to Make Happiness a Habit')+'</a>'+
      '</div></main>';
  }
  function bind(story){
    var main=document.querySelector('#app > main.ks-happ');
    if(!main)return;
    var img=main.querySelector('.ks-happ-cover');
    if(img && !img.dataset.happFallback){
      img.dataset.happFallback='1';
      var sources=['https://i.ytimg.com/vi/'+story.youtube_id+'/maxresdefault.jpg',
                   'https://i.ytimg.com/vi/'+story.youtube_id+'/sddefault.jpg',
                   'https://i.ytimg.com/vi/'+story.youtube_id+'/hqdefault.jpg'];
      var idx=0;
      function next(){
        if(idx<sources.length)img.src=sources[idx++];
      }
      img.addEventListener('error',next);
      img.addEventListener('load',function(){if(img.naturalWidth<=120)next();});
      if(img.complete&&img.naturalWidth<=120)next();
    }
    var cover=main.querySelector('.ks-happ-poster');
    if(cover && !cover.dataset.happBound){
      cover.dataset.happBound='1';
      cover.addEventListener('click',function(){
        var player=main.querySelector('#ks-happ-player');
        if(!player)return;
        var iframe=document.createElement('iframe');
        iframe.id='ks-happ-youtube-embed';
        iframe.src='https://www.youtube-nocookie.com/embed/'+story.youtube_id+'?autoplay=1&playsinline=1&rel=0';
        iframe.title=tr(story.title_ar,story.title_en);
        iframe.loading='eager';
        iframe.allow='autoplay; encrypted-media; gyroscope; accelerometer; picture-in-picture; web-share';
        iframe.allowFullscreen=true;
        iframe.referrerPolicy='strict-origin-when-cross-origin';
        player.replaceChildren(iframe);
      });
    }
  }
  function mount(){
    var story=currentStory();
    if(!story)return;
    var main=document.querySelector('#app > main');
    if(!main)return;
    if(!main.classList.contains('ks-happ')||main.dataset.happinessStory!==story.slug){
      main.outerHTML=page(story);
    }
    bind(story);
    document.title=tr(story.title_ar,story.title_en)+' | KARIM SAAB';
    var description=document.querySelector('meta[name="description"]');
    if(description)description.content=tr(story.excerpt_ar,story.excerpt_en);
  }
  function validated(raw){
    if(!raw||!Array.isArray(raw.entries)||raw.entries.length!==2)throw Error('Missing stories');
    raw.entries.forEach(function(s){
      if(!known.includes(s.slug)||!/^[A-Za-z0-9_-]{11}$/.test(s.youtube_id))throw Error('Invalid story');
      if(!Array.isArray(s.sections)||!s.sections.length||!s.sections.every(function(z){
        return z.heading_ar&&z.heading_en&&Array.isArray(z.paragraphs_ar)&&z.paragraphs_ar.length>0&&
        Array.isArray(z.paragraphs_en)&&z.paragraphs_en.length===z.paragraphs_ar.length&&z.paragraphs_en.every(Boolean);
      }))throw Error('Article requires a complete translation');
    });
    return raw.entries;
  }
  var previousRender=render;
  window.removeEventListener('hashchange',previousRender);
  render=function(){previousRender();mount();};
  window.addEventListener('hashchange',render);
  fetch('data/happiness-stories-v1.json?v=20261112-happiness-v1').then(function(r){
    if(!r.ok)throw Error('Cannot load happiness stories');
    return r.json();
  }).then(function(data){
    entries=validated(data);
    window.KARIM_HAPPINESS_STORIES=entries;
    mount();
  }).catch(function(error){fetchError=true;console.warn('Happiness article data unavailable; keeping previous page:',error.message);});
  render();
})();
