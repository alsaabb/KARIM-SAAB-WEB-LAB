/* KARIM SAAB Arctic survival — browser QA. Iframe creation ≠ proof of playback. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const data=JSON.parse(fs.readFileSync('dist/data/arctic-survival-v1.json','utf8'));
const OUT='visual-review/arctic-survival';
const BASE='http://127.0.0.1:8765/dist/index.html';
const browserBinary=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
function sourceLines(str){return str.split('\n').filter(x=>x.trim()).map(x=>x.trim())}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await chromium.launch({headless:true,...(browserBinary?{executablePath:browserBinary}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const [lang,width] of [['ar',390],['en',390],['ar',1440],['en',1440]]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.route('https://www.youtube-nocookie.com/**',r=>r.abort());
      await page.goto(BASE+'#/'+lang+'/'+data.route,{waitUntil:'domcontentloaded'});
      await page.locator('#app > main.ks-arctic .ks-sleeve-article').waitFor({timeout:25000});
      await page.locator('.ks-happ-wrap > .ks-share-v1[data-kind="article"]').waitFor({timeout:15000});
      const share=page.locator('.ks-happ-wrap > .ks-share-v1[data-kind="article"]');
      assert.equal(await share.locator('[data-network]').count(),6,'Six real share-intent platforms');
      assert.equal(await share.locator('[data-action=platform]').count(),3,'Three honest copy-link platform handoffs');
      assert.equal(await share.locator('.ks-share-v1-link svg').count(),9,'Recognizable icons for all nine services');
      assert.equal(await page.locator('.ks-share-v1').count(),1,'No duplicate sharing bars');
      const shareURL=await share.locator('[data-network=x]').getAttribute('href');
      const target=new URL(shareURL).searchParams.get('url');
      assert.equal(target,new URL('share/'+lang+'/story-arctic-survival-norway.html',BASE).href,
        'Shared permalink points to this exact language article');
      const pinURL=new URL(await share.locator('[data-network=pinterest]').getAttribute('href'));
      assert.ok(pinURL.searchParams.get('media').endsWith(data['poster_asset_'+lang]),'Pinterest gets the language-specific original owner poster');
      const placement=await page.evaluate(()=>{
        const article=document.querySelector('.ks-sleeve-article');
        const panel=document.querySelector('.ks-happ-wrap > .ks-share-v1');
        const wrap=document.querySelector('.ks-happ-wrap');
        return {afterArticle:!!(article.compareDocumentPosition(panel)&Node.DOCUMENT_POSITION_FOLLOWING),
          last:wrap.lastElementChild===panel,insideArticle:!!article.querySelector('.ks-share-v1')};
      });
      assert.ok(placement.afterArticle&&placement.last&&!placement.insideArticle,'Sharing follows entire approved article, never the poster');
      const cover=page.locator('.ks-arctic-owner-cover');
      await cover.evaluate(async img=>{await img.decode()});
      const actual=await page.locator('.ks-sleeve-article > h1, .ks-sleeve-article > h2, .ks-sleeve-article > p, .ks-sleeve-article > blockquote > p').allTextContents();
      assert.deepEqual(actual.map(s=>s.trim()),sourceLines(data['article_'+lang]),'Full exact approved '+lang+' article');
      const geometry=await page.evaluate(()=>{
        const root=document.querySelector('#app > main.ks-arctic');
        const img=root.querySelector('.ks-arctic-owner-cover');
        const image=img.getBoundingClientRect();
        const player=root.querySelector('#ks-arctic-player').getBoundingClientRect();
        const article=root.querySelector('.ks-sleeve-article').getBoundingClientRect();
        return {
          src:img.getAttribute('src'),naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,
          displayRatio:image.width/image.height,lang:root.getAttribute('lang'),dir:root.getAttribute('dir'),
          gap:article.top-player.bottom,articleTop:article.top,playerBottom:player.bottom,
          hasHeader:!!document.querySelector('#app header'),hasFooter:!!document.querySelector('#app footer'),
          overflow:document.documentElement.scrollWidth>window.innerWidth+2,
          goldButtons:root.querySelectorAll('.ks-sleeve-gold-play').length,
          iframes:root.querySelectorAll('iframe').length,
          watchLink:!!root.querySelector('a[href="https://www.youtube.com/watch?v=kERPnPj3XAA"]'),
          tags:root.querySelector('.ks-arctic-tags').innerText
        };
      });
      assert.equal(geometry.lang,lang);
      assert.equal(geometry.dir,lang==='ar'?'rtl':'ltr');
      assert.equal(geometry.src,data['poster_asset_'+lang],'Selected genuine poster, language-specific');
      assert.equal(geometry.naturalWidth,857,'The supplied original portrait pixels');
      assert.equal(geometry.naturalHeight,1536,'The supplied original portrait pixels');
      assert.ok(Math.abs(geometry.displayRatio-(857/1536))<.02,'Poster displayed without distortion');
      assert.ok(geometry.hasHeader&&geometry.hasFooter,'Original site chrome preserved');
      assert.equal(geometry.overflow,false,'No horizontal overflow');
      assert.equal(geometry.goldButtons,1,'One gold play control');
      assert.equal(geometry.iframes,0,'Lazy video iframe before click');
      assert.equal(geometry.watchLink,true,'Direct YouTube fallback link');
      assert.ok(geometry.tags.includes('Arctic documentary'),'Approved tags visible');
      if(width===390)assert.ok(geometry.gap>=-3&&geometry.gap<70,'Entire article starts directly below portrait on mobile');
      assert.deepEqual(errors,[],'No JavaScript page errors');
      await page.screenshot({path:OUT+'/'+lang+'-'+width+'.png',fullPage:false});
      await page.locator('[data-arctic-play]').click();
      const src=await page.locator('#ks-arctic-player iframe').getAttribute('src');
      assert.ok(src.includes('/embed/kERPnPj3XAA'),'Correct lazy iframe video ID');
      const ratio=await page.locator('#ks-arctic-player').evaluate(e=>e.getBoundingClientRect().width/e.getBoundingClientRect().height);
      assert.ok(Math.abs(ratio-9/16)<.03,'Player must be 9:16 portrait');
      console.log('PASS',lang,width,'poster original and full article',actual.length,'lines');
      await page.close();
    }
    const nav=await browser.newPage({viewport:{width:390,height:844}});
    await nav.goto(BASE+'#/ar/stories-road',{waitUntil:'domcontentloaded'});
    await nav.locator('[data-arctic-card]').waitFor({timeout:20000});
    assert.equal(await nav.locator('[data-arctic-card]').count(),1,'Exactly one Arctic card');
    assert.equal(await nav.locator('[data-arctic-card] img').getAttribute('src'),data.poster_asset_ar);
    await nav.locator('[data-arctic-card]').click();
    await nav.locator('.ks-sleeve-article[lang="ar"]').waitFor({timeout:20000});
    await nav.evaluate(r=>{location.hash='#/en/'+r},data.route);
    await nav.locator('.ks-sleeve-article[lang="en"]').waitFor({timeout:20000});
    assert.equal(await nav.locator('.ks-arctic-owner-cover').getAttribute('src'),data.poster_asset_en);
    assert.equal(await nav.locator('.ks-sleeve-article > h1').innerText(),data.title_en);
    await nav.locator('.ks-happ-wrap > .ks-share-v1[data-lang="en"]').waitFor({timeout:15000});
    assert.equal(await nav.locator('.ks-share-v1').count(),1,'Language switch must render exactly one share toolbar');
    const newLink=new URL(await nav.locator('.ks-share-v1 [data-network=x]').getAttribute('href')).searchParams.get('url');
    assert.ok(newLink.endsWith('/share/en/story-arctic-survival-norway.html'),'Share URL updates to English when language switches');
    await nav.close();
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
