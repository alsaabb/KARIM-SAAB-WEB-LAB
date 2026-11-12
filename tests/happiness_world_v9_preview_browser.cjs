const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const base='http://127.0.0.1:8765/dist/index.html';
async function verify(){
 const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  fs.mkdirSync('review-screenshots/happiness-world-v9',{recursive:true});
  for(const lang of ['ar','en']){
   for(const width of [390,980,1440]){
    const page=await browser.newPage({viewport:{width,height:940},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'#/'+lang+'/about/happiness/video/world-is-not-paradise',{waitUntil:'domcontentloaded',timeout:25000});
    await page.locator('main.ks-h11 .ks-h11-poster').waitFor({timeout:15000});
    await page.locator('.ks-h11-video-pane .ks-share-v1[data-kind="video"]').waitFor({timeout:15000});
    await page.waitForFunction(()=>{let img=document.querySelector('.ks-h11-cover');return img&&img.complete&&img.naturalWidth>300},null,{timeout:12000});
    const data=await page.evaluate(()=>{
     const $=s=>document.querySelector(s);
     const player=$('.ks-h11-player').getBoundingClientRect(),
           article=$('.ks-h11-article-pane').getBoundingClientRect(),
           video=$('.ks-h11-video-pane').getBoundingClientRect(),
           cta=$('.ks-h11-cta').getBoundingClientRect(),
           cover=$('.ks-h11-cover');
     return {playerW:player.width,playerH:player.height,videoBottom:video.bottom,
       articleTop:article.top,coverWidth:cover.naturalWidth,coverHeight:cover.naturalHeight,
       imgFit:getComputedStyle(cover).objectFit,
       ctaText:$('.ks-h11-cta').textContent.trim(),
       ctaCenter:cta.left+cta.width/2,playerCenter:player.left+player.width/2,
       articlePending:!!$('.ks-h11-pending'),
       videoShares:document.querySelectorAll('.ks-share-v1[data-kind="video"]').length,
       articleShares:document.querySelectorAll('.ks-share-v1[data-kind="article"]').length,
       youtubeLink:$('.ks-h11-source-links a').href,
       driveLink:$('.ks-h11-source-links a:nth-of-type(2)').href,
       playSymbols:document.querySelectorAll('.ks-h11-poster-play,.ks-h11-video-badge').length};
    });
    assert.deepEqual(errors,[],'JS errors '+errors.join(','));
    assert.ok(data.playerW>=300,'Poster too small');
    assert.ok(Math.abs(data.playerH/data.playerW-16/9)<0.03,'Poster should be portrait');
    assert.ok(data.coverWidth>300&&data.coverHeight>200,'Poster JPEG did not load');
    assert.equal(data.imgFit,'cover');
    assert.equal(data.ctaText,lang==='ar'?'شاهد الفيديو':'Watch video');
    assert.ok(Math.abs(data.ctaCenter-data.playerCenter)<3,'CTA not centered');
    assert.equal(data.playSymbols,0,'No duplicate play symbols');
    assert.equal(data.articlePending,true,'Never fabricate article text from an unavailable YouTube description');
    assert.equal(data.videoShares,1,'Video must have exactly one share bar');
    assert.equal(data.articleShares,0,'Do not enable article share before verified article exists');
    assert.equal(data.youtubeLink,'https://www.youtube.com/shorts/e8YffqIamRI');
    assert.ok(data.driveLink.includes('/1h7wkXmYF42PkC3KEqi3KMGJguOQmcLMz/'));
    if(width<=1100)assert.ok(data.articleTop>=data.videoBottom-3,'Article should be below video on phones and tablets');
    await page.screenshot({path:'review-screenshots/happiness-world-v9/'+lang+'-'+width+'-before-play.png',fullPage:true,animations:'disabled'});
    await page.locator('button.ks-h11-poster').click();
    const url=await page.locator('#ks-h11-player iframe').getAttribute('src');
    assert.ok(url.includes('www.youtube-nocookie.com/embed/e8YffqIamRI?'),'Clicking anywhere on poster should open YouTube embed');
    console.log('WORLD V9 PREVIEW OK',lang,width,JSON.stringify(data));
    await page.close();
   }
  }
  const page=await browser.newPage({viewport:{width:390,height:940}});
  await page.goto(base+'#/ar/about/after-sixty/sixty-is-not-a-waiting-room',{waitUntil:'domcontentloaded'});
  await page.locator('.ks60-poster-cta').waitFor({timeout:15000});
  assert.equal(await page.locator('.ks60-poster-cta').textContent(),'شاهد الفيديو');
  assert.equal(await page.locator('main.ks-h11').count(),0);
  console.log('AFTER SIXTY V9 UNCHANGED OK');
  await page.close();
 }finally{await browser.close();}
}
verify().catch(e=>{console.error(e);process.exitCode=1});
