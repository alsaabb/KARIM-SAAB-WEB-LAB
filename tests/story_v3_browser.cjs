/* Browser fixture for V3 reusable renderer — no public demo story or route added. */
'use strict';
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const fs = require('node:fs');
const BASE = 'http://127.0.0.1:8765/dist/index.html';
const routeName = 'story/v3-fixture';
const youtubeId = 'AbCdEf12345';
const sourceFile = 'data/story-v3-fixture.json';
const titleAR = 'قصة اختبار فنية لقالب الموقع';
const titleEN = 'Browser Fixture for the New Template';
const story = {
  schema_version: '3.0', route: routeName, youtube_id: youtubeId,
  title_ar: titleAR, title_en: titleEN,
  seo_title_ar: titleAR + ' | KARIM SAAB', seo_title_en: titleEN + ' | KARIM SAAB',
  description_ar: 'قصة اختبار فنية محلية لا تنشر على الإنترنت',
  description_en: 'In-memory browser test only; no real publication',
  article_ar: titleAR + '\nبقلم صاحب القصة\n\nالفقرة الأولى المعتمدة في الاختبار.\n\nالفقرة الثانية تصف الرحلة فقط.',
  article_en: titleEN + '\nBy KARIM SAAB\n\nFirst approved fixture paragraph.\n\nSecond fixture paragraph for layout.',
  poster_asset_ar: 'assets/stories/reindeer-close-call-norway/ar-cover-v01.webp',
  poster_asset_en: 'assets/stories/reindeer-close-call-norway/en-cover-v01.webp',
  poster_width: 941, poster_height: 1672,
  poster_note_ar: 'هذه صورة توضيحية للاختبار فقط.',
  poster_note_en: 'Illustrative browser-test cover only.',
  tags: '#KARIM_SAAB #Test',
};
const index = {schema_version:'3.0',entries:[{
  route:routeName, source:sourceFile, youtube_id:youtubeId,
  title_ar:titleAR, title_en:titleEN,
  description_ar:story.description_ar,description_en:story.description_en,
  poster_asset_ar:story.poster_asset_ar,poster_asset_en:story.poster_asset_en,
  poster_width:941, poster_height:1672,
}]};
function articleLines(language){
  return story['article_'+language].split('\n').map(s=>s.trim()).filter(Boolean);
}
(async()=>{
  const path=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
  const browser=await chromium.launch({headless:true,...(path?{executablePath:path}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const language of ['ar','en']){
      for(const width of [390,1440]){
        const page=await browser.newPage({viewport:{width,height:900}});
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/data/story-publisher-v3-index.json*',handler=>handler.fulfill({status:200,contentType:'application/json',body:JSON.stringify(index)}));
        await page.route('**/data/story-v3-fixture.json*',handler=>handler.fulfill({status:200,contentType:'application/json',body:JSON.stringify(story)}));
        await page.route('https://www.youtube-nocookie.com/**',handler=>handler.abort());
        await page.goto(BASE+'#/'+language+'/'+routeName,{waitUntil:'domcontentloaded'});
        const main=page.locator('#app > main.ks-story-v3[lang="'+language+'"]');
        await main.waitFor({timeout:25000});
        const share=page.locator('.ks-happ-wrap > .ks-share-v1[data-kind="article"]');
        await share.waitFor({timeout:15000});
        assert.equal(await share.locator('[data-network]').count(),6);
        assert.equal(await share.locator('[data-action="platform"]').count(),3);
        assert.equal(await share.locator('.ks-share-v1-link svg').count(),9);
        assert.equal(await page.locator('.ks-share-v1').count(),1);
        const actual=await main.locator('.ks-sleeve-article > h1, .ks-sleeve-article > h2, .ks-sleeve-article > p, .ks-sleeve-article > blockquote > p').allTextContents();
        assert.deepEqual(actual.map(x=>x.trim()),articleLines(language));
        const cover=main.locator('.ks-sleeve-cover');
        await cover.evaluate(async image=>{await image.decode();});
        assert.ok((await cover.getAttribute('src')).endsWith(language+'-cover-v01.webp'));
        const geom=await page.evaluate(()=>{
          const root=document.querySelector('#app > main.ks-story-v3');
          const article=root.querySelector('.ks-sleeve-article').getBoundingClientRect();
          const player=root.querySelector('.ks-happ-player').getBoundingClientRect();
          const img=root.querySelector('.ks-sleeve-cover');
          const sharing=root.querySelector('.ks-share-v1');
          return {
            gap:article.top-player.bottom,
            width:document.documentElement.scrollWidth,
            viewport:window.innerWidth,
            naturalWidth:img.naturalWidth,
            naturalHeight:img.naturalHeight,
            sharingAfterArticle:!!(root.querySelector('.ks-sleeve-article').compareDocumentPosition(sharing)&Node.DOCUMENT_POSITION_FOLLOWING),
            iframeBefore:root.querySelectorAll('iframe').length,
          };
        });
        assert.equal(geom.naturalWidth,941);
        assert.equal(geom.naturalHeight,1672);
        assert.equal(geom.iframeBefore,0);
        assert.ok(geom.width<=geom.viewport+2,'No horizontal overflow');
        assert.ok(geom.sharingAfterArticle,'Sharing after complete article');
        if(width===390)assert.ok(geom.gap>=-3 && geom.gap<70,'Article directly below portrait on mobile');
        assert.deepEqual(errors,[]);
        await main.locator('[data-v3-play]').click();
        const iframe=main.locator('#ks-story-v3-player iframe');
        assert.ok((await iframe.getAttribute('src')).includes('/embed/'+youtubeId));
        const ratio=await main.locator('#ks-story-v3-player').evaluate(x=>x.getBoundingClientRect().width/x.getBoundingClientRect().height);
        assert.ok(Math.abs(ratio-9/16)<.04);
        await page.close();
        console.log('PASS V3 fixture',language,width);
      }
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
