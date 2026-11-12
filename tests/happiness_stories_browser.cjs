/* Real-Chromium acceptance tests for two bilingual Happiness stories.
 * Source texts supplied by the owner. Protects After Sixty V9, article pairing, and independent shares.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const executablePath=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const base='http://127.0.0.1:8765/dist/index.html';
(async()=>{
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  fs.mkdirSync('review-screenshots/happiness-bilingual',{recursive:true});
  for(const slug of ['happiness-not-for-sale','world-is-not-paradise']){
   for(const lang of ['ar','en']){
    for(const width of [390,980,1440]){
     const page=await browser.newPage({viewport:{width,height:940},deviceScaleFactor:1});
     const errors=[];
     page.on('pageerror',e=>errors.push(e.message));
     const hash='#/'+lang+'/about/happiness/video/'+slug;
     await page.goto(base+hash,{waitUntil:'domcontentloaded',timeout:25000});
     await page.locator('main.ks-happ[data-happiness-story="'+slug+'"]').waitFor({timeout:13000});
     await page.locator('#ks-happiness-video-pane > .ks-share-v1[data-kind=video]').waitFor({timeout:12000});
     await page.locator('#ks-happiness-article-pane > .ks-share-v1[data-kind=article]').waitFor({timeout:12000});
     await page.waitForFunction(()=>{const x=document.querySelector('.ks-happ-cover');return x&&x.complete&&x.naturalWidth>300},null,{timeout:10000});
     const data=await page.evaluate(()=>{
      const $=s=>document.querySelector(s),player=$('.ks-happ-player').getBoundingClientRect(),
       video=$('.ks-happ-video-pane').getBoundingClientRect(),article=$('.ks-happ-article-pane').getBoundingClientRect(),
       cta=$('.ks-happ-cta').getBoundingClientRect(),image=$('.ks-happ-cover');
      const shares=[...document.querySelectorAll('main.ks-happ .ks-share-v1')];
      return {playerWidth:player.width,playerHeight:player.height,playerCenter:player.left+player.width/2,
       videoBottom:video.bottom,articleTop:article.top,ctaCenter:cta.left+cta.width/2,
       ctaText:$('.ks-happ-cta').textContent.trim(),imageWidth:image.naturalWidth,
       imageHeight:image.naturalHeight,objectFit:getComputedStyle(image).objectFit,
       articleText:$('.ks-happ-article-pane').innerText,articleParagraphs:document.querySelectorAll('.ks-happ-article-section p').length,
       hasFakePending:!!$('.ks-va-section,.ks-happ-pending'),shareKinds:shares.map(x=>x.dataset.kind),
       shareVideoCopy:$('.ks-happ-video-pane .ks-share-v1-copy[data-action=copy]')?.getAttribute('aria-label'),
       shareArticleCopy:$('.ks-happ-article-pane .ks-share-v1-copy[data-action=copy]')?.getAttribute('aria-label'),
       articleDir:$('.ks-happ-article-pane').dir,
       youtubeLink:$('.ks-happ-watch-link a').getAttribute('href'),
       prevDrive:$('.ks-happ-watch-link a:nth-of-type(2)').getAttribute('href'),
       duplicateIcons:document.querySelectorAll('.ks-happ-poster-play,.ks-happ-poster-badge').length};
     });
     assert.deepEqual(errors,[],'Unexpected JS errors on '+hash);
     assert.ok(data.playerWidth>=300,'Poster should fill phone');
     assert.ok(Math.abs(data.playerHeight/data.playerWidth-16/9)<.04,'Poster aspect ratio 9:16');
     assert.ok(data.imageWidth>=480&&data.imageHeight>=300,'Authentic YouTube poster must load');
     assert.equal(data.objectFit,'cover');
     assert.ok(Math.abs(data.ctaCenter-data.playerCenter)<4,'CTA must be centered on cover');
     assert.equal(data.ctaText,lang==='ar'?'شاهد الفيديو':'Watch video');
     assert.equal(data.duplicateIcons,0);
     assert.equal(data.hasFakePending,false,'Do not show untranslated/draft placeholder');
     assert.ok(data.articleParagraphs>=10,'Article should be complete');
     assert.deepEqual(data.shareKinds,['video','article'],'Separate video and article sharing, exactly once');
     assert.equal(data.articleDir,lang==='ar'?'rtl':'ltr');
     assert.ok(data.shareVideoCopy&&(lang==='ar'?data.shareVideoCopy.includes('الفيديو'):data.shareVideoCopy.includes('video')));
     assert.ok(data.shareArticleCopy&&(lang==='ar'?data.shareArticleCopy.includes('المقال'):data.shareArticleCopy.includes('article')));
     if(width<=1100)assert.ok(data.articleTop>=data.videoBottom-4,'On mobile/tablet article must be below video');
     if(slug==='world-is-not-paradise'){
      assert.ok(data.articleText.includes('117'),'Document corrected historical population estimate');
      assert.ok(!data.articleText.includes('109'),'Do not repeat outdated unsourced 109b estimate');
     }else{
      assert.ok(data.articleText.includes(lang==='ar'?'دراجتي':'bicycle'),'Bike should appear in rescue story');
      assert.ok(!data.articleText.includes('غرّزت سيارتي'),'Owner was not the driver / car owner');
     }
     const expectedId=slug==='world-is-not-paradise'?'e8YffqIamRI':'fk3fYq2lljM';
     assert.ok(data.youtubeLink.endsWith('/'+expectedId));
     await page.waitForFunction((x)=>{
      const v=document.querySelector('.ks-happ-video-pane .ks-share-v1 [data-network=whatsapp]');
      const a=document.querySelector('.ks-happ-article-pane .ks-share-v1 [data-network=whatsapp]');
      return v&&a&&decodeURIComponent(v.href).includes('happiness-'+x+'-video.html')&&decodeURIComponent(a.href).includes('happiness-'+x+'-article.html');
     },slug,{timeout:10000});
     if(width===390||width===1440)await page.screenshot({path:'review-screenshots/happiness-bilingual/'+slug+'-'+lang+'-'+width+'.png',fullPage:true,animations:'disabled'});
     await page.locator('button.ks-happ-poster').click();
     const iframe=page.locator('#ks-happ-youtube-embed');
     await iframe.waitFor({state:'attached'});
     const src=await iframe.getAttribute('src');
     assert.ok(src.includes('/embed/'+expectedId+'?'),'Poster should play the correct video');
     console.log('HAPPINESS BILINGUAL PASS',slug,lang,width,data.articleParagraphs);
     await page.close();
    }
   }
  }
  const page=await browser.newPage({viewport:{width:390,height:940}});
  await page.goto(base+'#/ar/about/after-sixty/sixty-is-not-a-waiting-room',{waitUntil:'domcontentloaded'});
  await page.locator('.ks60-poster-cta').waitFor({timeout:15000});
  assert.equal(await page.locator('.ks60-poster-cta').textContent(),'شاهد الفيديو');
  assert.equal(await page.locator('main.ks-happ').count(),0);
  console.log('AFTER-SIXTY V9 REGRESSION PASS');
  await page.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
