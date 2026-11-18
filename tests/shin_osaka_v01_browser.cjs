/* Owner-approved Shin-Osaka story: actual deployed files, not a fixture.
 * Tests AR/EN at 390px and 1440px, exact text, distinct WebP covers,
 * 9 unified share options, copy actions, source metadata and lazy 9:16 frame.
 */
'use strict';
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const fs = require('node:fs');
const story = require('../dist/data/story-v3-shin-osaka-greased-hands-victory-v01.json');
const index = require('../dist/data/story-publisher-v3-index.json');
const base = 'http://127.0.0.1:8765/dist/';
const pageStem = 'story-shin-osaka-greased-hands-victory.html';
function lines(lang) {return story['article_'+lang].split('\n').map(x=>x.trim()).filter(Boolean);}
(async()=>{
  assert.equal(index.entries.filter(x=>x.youtube_id==='gNyXpyaZMs4').length,1);
  const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
  const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}),
    args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for(const lang of ['ar','en']) {
      const other=lang==='ar'?'en':'ar';
      for(const width of [390,1440]) {
        const page=await browser.newPage({viewport:{width,height:900}});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.route('https://www.youtube-nocookie.com/**',r=>r.abort());
        await page.goto(base+'index.html#/'+lang+'/'+story.route,{waitUntil:'domcontentloaded'});
        const main=page.locator('#app > main.ks-story-v3[lang="'+lang+'"]');
        await main.waitFor({timeout:30000});
        const share=page.locator('.ks-happ-wrap > .ks-share-v1[data-kind="article"]');
        await share.waitFor({timeout:15000});
        assert.equal(await page.locator('.ks-share-v1').count(),1,'One unified share bar');
        assert.equal(await share.locator('[data-network]').count(),6,'Six direct share networks');
        assert.equal(await share.locator('[data-action="platform"]').count(),3,'Three manual-handoff platforms');
        assert.equal(await share.locator('.ks-share-v1-link svg').count(),9,'Nine visible icons');
        assert.equal(await share.locator('[data-action="copy"]').count(),1);
        assert.equal(await share.locator('[data-action="tags"]').count(),1);
        const text=await main.locator('.ks-sleeve-article > h1, .ks-sleeve-article > h2, .ks-sleeve-article > p, .ks-sleeve-article > blockquote > p').allTextContents();
        assert.deepEqual(text.map(s=>s.trim()),lines(lang),'Verbatim original approved article');
        const img=main.locator('.ks-sleeve-cover');
        await img.evaluate(async x=>{await x.decode();});
        const expected='/'+lang+'-cover-v01.webp';
        assert.ok((await img.getAttribute('src')).endsWith(expected));
        assert.ok(!(await img.getAttribute('src')).endsWith('/'+other+'-cover-v01.webp'));
        const geometry=await page.evaluate(()=>{
          const root=document.querySelector('#app > main.ks-story-v3');
          const player=root.querySelector('.ks-happ-player').getBoundingClientRect();
          const article=root.querySelector('.ks-sleeve-article').getBoundingClientRect();
          const image=root.querySelector('.ks-sleeve-cover');
          const share=root.querySelector('.ks-share-v1');
          return {gap:article.top-player.bottom,width:document.documentElement.scrollWidth,
            viewport:window.innerWidth,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,
            after:!!(root.querySelector('.ks-sleeve-article').compareDocumentPosition(share)&Node.DOCUMENT_POSITION_FOLLOWING),
            iframeBefore:root.querySelectorAll('iframe').length};
        });
        assert.equal(geometry.naturalWidth,760);
        assert.equal(geometry.naturalHeight,1350);
        assert.ok(geometry.width<=geometry.viewport+2,'No horizontal overflow');
        assert.ok(geometry.after,'Share toolbar follows full text');
        assert.equal(geometry.iframeBefore,0,'Do not load YouTube before click');
        if(width===390) assert.ok(geometry.gap>=-3 && geometry.gap<70,'Full text directly below mobile cover');
        const shareUrl=base+'share/'+lang+'/'+pageStem;
        for(const loc of await share.locator('[data-network]').all()){
          const href=await loc.getAttribute('href');
          assert.ok(href && href.includes(encodeURIComponent(shareUrl)),'Direct share must use item URL');
        }
        const preview=await browser.newPage();
        await preview.goto(shareUrl,{waitUntil:'domcontentloaded'});
        assert.equal(await preview.locator('html').getAttribute('lang'),lang);
        assert.ok((await preview.locator('meta[property="og:image"]').getAttribute('content')).endsWith(expected));
        assert.equal(await preview.locator('link[rel="canonical"]').getAttribute('href'),
          'https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/share/'+lang+'/'+pageStem);
        assert.equal(await preview.locator('link[hreflang="'+other+'"]').count(),1);
        await preview.close();
        assert.deepEqual(errors,[]);
        await main.locator('[data-v3-play]').click();
        const frame=main.locator('#ks-story-v3-player iframe');
        assert.ok((await frame.getAttribute('src')).includes('/embed/gNyXpyaZMs4'));
        const ratio=await main.locator('#ks-story-v3-player').evaluate(x=>x.getBoundingClientRect().width/x.getBoundingClientRect().height);
        assert.ok(Math.abs(ratio-9/16)<0.04,'Lazy player has 9:16 aspect');
        await page.close();
        console.log('PASS Shin-Osaka approved story',lang,width);
      }
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
