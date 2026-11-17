// Browser-like DOM regression for the exact bilingual routes published on GitHub Pages.
// npm install --no-save --no-package-lock jsdom@26 && node --test tests/share_dom.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const script=fs.readFileSync(path.resolve(__dirname,'../dist/bilingual-share-v1.js'),'utf8');

async function fixture(route,html,lang='ar') {
  const dom=new JSDOM('<!doctype html><html lang="'+lang+'"><body><div id="app">'+html+'</div></body></html>',{
    url:'https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/index.html#/'+lang+'/'+route,
    runScripts:'outside-only'
  });
  dom.window.fetch=async function(){return {ok:true};};
  dom.window.KARIM_ABOUT_SOURCE={items:[
    {route:'about/why-adventures',kind:'article',title_ar:'لماذا أعشق المغامرات؟',title_en:'Why I Love Adventures',
      excerpt_ar:'تجارب السفر',excerpt_en:'Travel experiences'}
  ]};
  dom.window.eval(script);
  await new Promise(resolve=>setTimeout(resolve,35));
  return dom;
}
async function check(route,markup,selector,lang='ar') {
  const dom=await fixture(route,'<main>'+markup+'</main>',lang);
  const panel=dom.window.document.querySelector(selector+' .ks-share-v1');
  assert.ok(panel,route+': sharing panel must appear under the content');
  assert.equal(panel.dataset.route,route);
  assert.equal(panel.dataset.lang,lang);
  assert.equal(panel.querySelectorAll('[data-network]').length,6);
  assert.equal(panel.querySelectorAll('[data-network] svg').length,6,'Each platform should have its recognizable icon');
  assert.ok(panel.querySelector('.ks-share-v1-tag-list').textContent.includes('#'));
  assert.ok(panel.querySelector('[data-action=copy]'));
  const x=panel.querySelector('[data-network=x]');
  assert.match(new URL(x.href).searchParams.get('url')||'',/share\/(?:ar|en)\//);
  dom.window.close();
}
test('Arabic and English Life After Sixty VIDEO+ARTICLE pages',async()=>{
  for(const lang of ['ar','en']) {
    await check('about/after-sixty/sixty-is-not-a-waiting-room',
      '<div class="ks60-wrap"><header><h1>الحياة بعد الستين</h1></header><div class="ks60-split"><aside class="ks60-video-pane" id="ks60-video-pane"><div class="ks60-player">Video</div></aside><article class="ks60-article-pane" id="ks60-article-pane"><p>Article</p></article></div></div>',
      '.ks60-wrap',lang);
  }
});
test('About Me video page / attached article',async()=>{
  await check('about/happiness/video/happiness-not-for-sale',
    '<div class="ks-ab-container"><section class="ks-va-section"><header class="ks-va-head"><h2>سعادة لا تشترى</h2></header><p class="ks-va-caption">Video summary</p></section></div>',
    '.ks-va-section');
});
test('Verified health article preview and full text',async()=>{
  await check('about/health/depression-anxiety',
    '<div class="ks-health-wrap"><section class="ks-health-cta"><h1>علاج الاكتئاب والقلق</h1></section></div>','.ks-health-wrap');
  await check('about/health/depression-anxiety/full',
    '<article class="ks-health-full"><h1>علاج الاكتئاب والقلق</h1><p>Medical article</p></article>','.ks-health-full','en');
});
test('About Me article',async()=>{
  await check('about/why-adventures',
    '<div class="ks-ab-container"><h1>لماذا أعشق المغامرات؟</h1><div class="ks-ab-grid"><article>Text</article></div></div>',
    '.ks-ab-container');
});
test('Journey and library article',async()=>{
  await check('journey/legacy-5','<article class="body-prose"><h2>فرنسا</h2><p>Journey</p></article>','.body-prose');
  await check('content/bio','<article class="source-feature"><h2>عبدالكريم الصعب</h2></article>','.source-feature','en');
});
test('Category page must not masquerade as article',async()=>{
  const dom=await fixture('about','<main><div class="ks-ab-container"><h1>من أنا</h1></div></main>');
  assert.equal(dom.window.document.querySelectorAll('.ks-share-v1').length,0);
  dom.window.close();
});
test('X share intent and Copy Link target the item, not homepage',async()=>{
  const dom=await fixture('journey/legacy-5','<main><article class="body-prose"><h2>فرنسا</h2></article></main>');
  const win=dom.window;
  const x=win.document.querySelector('[data-network=x]');
  const expected='https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/share/ar/journey-legacy-5.html';
  assert.equal(new URL(x.href).searchParams.get('url'),expected);
  let copied;
  Object.defineProperty(win.navigator,'clipboard',{value:{writeText:async v=>{copied=v;}}});
  Object.defineProperty(win,'isSecureContext',{value:true,configurable:true});
  win.document.querySelector('[data-action=copy]').click();
  await new Promise(resolve=>setTimeout(resolve,15));
  assert.equal(copied,expected);
  dom.window.close();
});

test('Video and complete article have separate share controls and public preview links',async()=>{
  for(const lang of ['ar','en']){
    const route='about/after-sixty/sixty-is-not-a-waiting-room';
    const markup='<main><div class="ks60-wrap">'+
       '<div class="ks60-split"><aside id="ks60-video-pane" class="ks60-video-pane"><div class="ks60-player">Video player</div></aside>'+
       '<article id="ks60-article-pane" class="ks60-article-pane"><h1>Life After Sixty</h1><p>Complete published article</p></article></div></div></main>';
    const dom=await fixture(route,markup,lang);
    const win=dom.window, doc=win.document;
    const video=doc.querySelector('#ks60-video-pane > .ks-share-v1');
    const article=doc.querySelector('#ks60-article-pane > .ks-share-v1');
    assert.ok(video,'Video panel must live under the video');
    assert.ok(article,'Article panel must live under the article');
    assert.equal(video.dataset.kind,'video');
    assert.equal(article.dataset.kind,'article');
    assert.equal(doc.querySelectorAll('.ks-share-v1').length,2);
    const link=p=>new URL(p.querySelector('[data-network=x]').href).searchParams.get('url');
    assert.ok(link(video).endsWith('-video.html'),link(video));
    assert.ok(link(article).endsWith('-article.html'),link(article));
    assert.notEqual(link(video),link(article));
    assert.match(article.querySelector('h3').textContent,lang==='ar'?/المقال/:/article/i);
    assert.match(video.querySelector('h3').textContent,lang==='ar'?/الفيديو/:/video/i);
    assert.ok(article.querySelector('.ks-share-v1-tag-list').textContent.includes(lang==='ar'?'#مقال':'#Article'));
    let copied=[];
    Object.defineProperty(win.navigator,'clipboard',{value:{writeText:async v=>copied.push(v)}});
    Object.defineProperty(win,'isSecureContext',{value:true,configurable:true});
    article.querySelector('[data-action=copy]').click();
    await new Promise(resolve=>setTimeout(resolve,20));
    assert.deepEqual(copied,[link(article)]);
    win.dispatchEvent(new win.HashChangeEvent('hashchange'));
    await new Promise(resolve=>setTimeout(resolve,25));
    assert.equal(doc.querySelectorAll('.ks-share-v1').length,2,'No duplicate share panels after route changes');
    dom.window.close();
  }
});
test('Do not advertise article sharing where there is no approved article',async()=>{
  const route='about/after-sixty/sixty-is-not-a-waiting-room';
  const dom=await fixture(route,
    '<main><div class="ks60-wrap"><aside id="ks60-video-pane"><div class="ks60-player"></div></aside>'+
    '<article id="ks60-article-pane"><p class="ks60-language-note">Translation pending</p></article></div></main>','en');
  assert.ok(dom.window.document.querySelector('#ks60-video-pane .ks-share-v1'));
  assert.equal(dom.window.document.querySelectorAll('#ks60-article-pane .ks-share-v1').length,0);
  dom.window.close();
});
test('Static social preview pages provide distinct bilingual OG metadata and redirect to content focus',()=>{
  for(const lang of ['ar','en'])for(const kind of ['video','article']){
    const filename=path.resolve(__dirname,'../dist/share/'+lang+'/after-sixty-sixty-is-not-a-waiting-room-'+kind+'.html');
    const content=fs.readFileSync(filename,'utf8');
    assert.match(content,new RegExp('focus='+kind));
    assert.match(content,new RegExp('og:type" content="'+(kind==='video'?'video.other':'article')+'"'));
    assert.match(content,new RegExp('lang="'+lang+'"'));
  }
});


test('Arctic and Health owner-approved video articles: approved 9-platform sharing appears BELOW full article',async()=>{
  for(const scenario of [
    {route:'story/arctic-survival-norway',poster:'ar-cover-v01.webp'},
    {route:'about/health/from-150kg-to-cycling-europe',poster:'maxresdefault.jpg'}
  ])for(const lang of ['ar','en']){
    const poster=scenario.route.startsWith('story/')?(lang==='ar'?'ar-cover-v01.webp':'en-cover-v01.webp'):scenario.poster;
    const title=lang==='ar'?'معاناة البقاء في القطب الشمالي':'Arctic Survival Struggle';
    const markup='<main class="ks-happ ks-sleeve">'+
      '<div class="ks-happ-wrap"><header class="ks-happ-head"><h1>'+title+'</h1></header>'+
      '<div class="ks-happ-split"><div class="ks-happ-video-pane"><img class="'+(scenario.route.startsWith('story/')?'ks-arctic-owner-cover':'ks-sleeve-cover')+'" src="https://example.test/'+poster+'"></div>'+
      '<article class="ks-sleeve-article"><h1>'+title+'</h1><p>Full original article</p></article></div>'+
      '<p>Watch on YouTube</p></div></main>';
    const dom=await fixture(scenario.route,markup,lang);
    const doc=dom.window.document;
    const panel=doc.querySelector('.ks-happ-wrap > .ks-share-v1');
    assert.ok(panel,scenario.route+' '+lang+' has a sharing toolbar after the article');
    assert.equal(panel.dataset.kind,'article');
    assert.equal(panel.dataset.lang,lang);
    assert.equal(doc.querySelectorAll('.ks-share-v1').length,1);
    assert.equal(doc.querySelector('.ks-happ-wrap').lastElementChild,panel);
    assert.equal(doc.querySelector('.ks-sleeve-article .ks-share-v1'),null,
      'Article text remains intact; sharing must be placed after the full article');
    const direct=['x','facebook','whatsapp','telegram','linkedin','pinterest'];
    const assisted=['instagram','snapchat','tiktok'];
    assert.deepEqual([...panel.querySelectorAll('[data-network]')].map(e=>e.dataset.network),direct);
    assert.deepEqual([...panel.querySelectorAll('[data-action=platform]')].map(e=>e.dataset.platform),assisted);
    assert.equal(panel.querySelectorAll('.ks-share-v1-link svg').length,9,'Each platform keeps its icon');
    const destination='https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/share/'+lang+'/'+scenario.route.replaceAll('/','-')+'.html';
    const sharedLink=new URL(panel.querySelector('[data-network=x]').href).searchParams.get('url');
    assert.equal(sharedLink,destination,'X shares the exact language-specific article, not the homepage');
    const pin=new URL(panel.querySelector('[data-network=pinterest]').href);
    assert.equal(pin.searchParams.get('url'),destination);
    assert.ok(pin.searchParams.get('media')?.endsWith('/'+poster),'Pinterest links to the approved language poster');
    assert.ok(panel.querySelector('[data-action=copy]'));
    const arctic=scenario.route.startsWith('story/');
    if(arctic) assert.ok(panel.querySelector('.ks-share-v1-tag-list').textContent.includes(lang==='ar'?'#القطب_الشمالي':'#ArcticSurvival'));
    // The copied URL must remain a single-language article URL.
    let copied='';
    Object.defineProperty(dom.window.navigator,'clipboard',{value:{writeText:async text=>{copied=text}}});
    Object.defineProperty(dom.window,'isSecureContext',{value:true,configurable:true});
    panel.querySelector('[data-action=copy]').click();
    await new Promise(resolve=>setTimeout(resolve,12));
    assert.equal(copied,destination);
    dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
    await new Promise(resolve=>setTimeout(resolve,12));
    assert.equal(doc.querySelectorAll('.ks-share-v1').length,1,'No duplicate icons after rerender');
    dom.window.close();
  }
});
