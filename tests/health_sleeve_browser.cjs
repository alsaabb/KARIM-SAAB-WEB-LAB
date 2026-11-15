/* Read-only Chromium acceptance checks for owner-approved health video/articles.
 * The SVG bytes below are TEST FIXTURES only, never site poster assets.
 * Iframe element creation is not proof that YouTube streams on a real device.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const browserBinary=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const article=JSON.parse(fs.readFileSync('dist/data/health-sleeve-v1.json','utf8'));
const route=article.route;
const BASE='http://127.0.0.1:8765/dist/index.html';
const OUT='visual-review/health-sleeve';
const WIDE='<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#423a23"/><text x="640" y="360" font-size="55" text-anchor="middle" fill="white">TEST WIDE THUMBNAIL</text></svg>';
const PORTRAIT='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><rect width="720" height="1280" fill="#38462e"/><text x="360" y="620" font-size="46" text-anchor="middle" fill="white">TEST PORTRAIT POSTER</text></svg>';
function sentences(md){
  return md.split('\n').filter(x=>x.trim()).map(x=>x.replace(/^#{1,3} /,'').replace(/^> /,'').replace(/\*\*/g,'').trim());
}
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await chromium.launch({headless:true,...(browserBinary?{executablePath:browserBinary}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const [lang,width] of [['ar',390],['en',390],['ar',1440],['en',1440]]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.route('https://i.ytimg.com/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:WIDE}));
      await page.route('https://www.youtube-nocookie.com/**',r=>r.abort());
      await page.goto(BASE+'#/'+lang+'/'+route,{waitUntil:'domcontentloaded'});
      await page.locator('#app > main.ks-sleeve .ks-sleeve-article').waitFor({timeout:20000});
      const actual=await page.locator('.ks-sleeve-article > h1, .ks-sleeve-article > h3, .ks-sleeve-article > p, .ks-sleeve-article > blockquote > p').allTextContents();
      assert.deepEqual(actual.map(x=>x.trim()),sentences(article['article_'+lang]),'The published '+lang+' article must preserve every original line verbatim');
      const meta=await page.evaluate(()=>{
        const root=document.querySelector('#app > main.ks-sleeve');
        const poster=root.querySelector('.ks-sleeve-poster'),image=poster.querySelector('img');
        const player=root.querySelector('#ks-sleeve-player');
        const text=root.querySelector('.ks-sleeve-article');
        const p=player.getBoundingClientRect(),a=text.getBoundingClientRect(),im=image.getBoundingClientRect();
        return {
          language:text.getAttribute('lang'),direction:text.getAttribute('dir'),
          gap:a.top-p.bottom,shownRatio:im.width/im.height,naturalRatio:image.naturalWidth/image.naturalHeight,
          playerHeight:p.height,buttons:root.querySelectorAll('.ks-sleeve-gold-play').length,
          iframeBefore:root.querySelectorAll('iframe').length,
          source:image.getAttribute('src'),header:!!document.querySelector('#app header'),
          footer:!!document.querySelector('#app footer'),
          overflow:document.documentElement.scrollWidth>window.innerWidth+2,
          fallback:!!root.querySelector('a[href="https://www.youtube.com/watch?v=Cv8l-mLzG9g"]')
        };
      });
      assert.equal(meta.language,lang);
      assert.equal(meta.direction,lang==='ar'?'rtl':'ltr');
      assert.ok(meta.header&&meta.footer,'Preserve global header/footer');
      assert.ok(!meta.overflow,'No viewport overflow');
      assert.equal(meta.buttons,1,'One gold Watch button');
      assert.equal(meta.iframeBefore,0,'No YouTube iframe before click');
      assert.ok(meta.fallback,'Provide direct YouTube URL');
      assert.ok(Math.abs(meta.shownRatio-meta.naturalRatio)<0.035,'Show source image without cropping');
      assert.ok(meta.source.includes('Cv8l-mLzG9g'),'Use actual YouTube thumbnail');
      if(width===390){
        assert.ok(meta.playerHeight<350,'No tall blurred bars around landscape preview');
        assert.ok(meta.gap>=-2&&meta.gap<65,'Full article begins immediately below video on mobile');
      }
      assert.equal(errors.length,0,'Browser console exception: '+errors.join('; '));
      await page.screenshot({path:OUT+'/'+lang+'-'+width+'.png',fullPage:false});
      await page.locator('[data-sleeve-play]').click();
      const iframe=page.locator('#ks-sleeve-player iframe');
      await iframe.waitFor({timeout:5000});
      const played=await page.evaluate(()=>{
        const p=document.querySelector('#ks-sleeve-player');let r=p.getBoundingClientRect();
        return {ratio:r.width/r.height,src:p.querySelector('iframe')?.src,sandbox:p.querySelector('iframe')?.getAttribute('sandbox')};
      });
      assert.ok(Math.abs(played.ratio-9/16)<0.03,'Embed must be portrait 9:16');
      assert.ok(played.src.includes('Cv8l-mLzG9g'),'Correct video ID');
      assert.ok(played.sandbox.includes('allow-scripts'),'Required iframe sandbox');
      console.log('PASS',lang,width,'exact article lines',actual.length,'portrait iframe');
      await page.close();
    }
    const nav=await browser.newPage({viewport:{width:390,height:844}});
    await nav.route('https://i.ytimg.com/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:WIDE}));
    await nav.goto(BASE+'#/ar/about/health',{waitUntil:'domcontentloaded'});
    await nav.locator('[data-sleeve-card]').waitFor({timeout:15000});
    assert.equal(await nav.locator('[data-sleeve-card]').count(),1,'One video/article card in Health');
    await nav.locator('[data-sleeve-card]').click();
    await nav.locator('.ks-sleeve-article[lang="ar"]').waitFor({timeout:15000});
    await nav.evaluate(r=>{location.hash='#/en/'+r},route);
    await nav.locator('.ks-sleeve-article[lang="en"]').waitFor({timeout:15000});
    assert.equal(await nav.locator('.ks-sleeve-article > h1').innerText(),article.title_en,'Language switching should show English only');
    await nav.close();
    const owner=await browser.newPage({viewport:{width:390,height:900}});
    await owner.route('**/data/health-sleeve-v1.json*',r=>{
      const copy={...article,poster_status:'approved_and_published',poster_asset:'assets/stories/sleeve/owner.webp'};
      r.fulfill({json:copy});
    });
    await owner.route('**/assets/stories/sleeve/owner.webp',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:PORTRAIT}));
    await owner.route('https://i.ytimg.com/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:WIDE}));
    await owner.goto(BASE+'#/ar/'+route,{waitUntil:'domcontentloaded'});
    await owner.locator('.ks-sleeve-owner-portrait img').waitFor({timeout:15000});
    let img=await owner.evaluate(()=>{
      let x=document.querySelector('.ks-sleeve-cover'),r=x.getBoundingClientRect();
      return {src:x.getAttribute('src'),ratio:r.width/r.height,fit:getComputedStyle(x).objectFit};
    });
    assert.equal(img.src,'assets/stories/sleeve/owner.webp');
    assert.ok(Math.abs(img.ratio-9/16)<0.04);
    assert.equal(img.fit,'cover');
    await owner.screenshot({path:OUT+'/owner-poster-fixture-390.png'});
    await owner.close();
    const empty=await browser.newPage({viewport:{width:390,height:900}});
    await empty.route('https://i.ytimg.com/**',r=>r.abort());
    await empty.goto(BASE+'#/ar/'+route,{waitUntil:'domcontentloaded'});
    await empty.locator('.ks-sleeve-no-image').waitFor({timeout:15000});
    assert.equal(await empty.locator('.ks-sleeve-gold-play').count(),1);
    assert.ok(await empty.locator('.ks-sleeve-article > p').count()>0);
    await empty.close();
  }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
