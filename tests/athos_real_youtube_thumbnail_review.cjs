// OWNER REVIEW ONLY — uses the REAL YouTube thumbnail, never a synthetic fixture.
// Does not publish website or change content. Fail closed if network blocks real art.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const BASE='http://127.0.0.1:8765/dist/index.html';
const OUT='visual-review/athos-real-youtube';
const VIDEO='zsYOR7WmvAQ';
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}) ,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const [lang,width] of [['ar',390],['en',390],['ar',1440]]){
   const page=await browser.newPage({viewport:{width,height:1100},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(BASE+'#/'+lang+'/destination/mount-athos-greece',{waitUntil:'domcontentloaded',timeout:30000});
   const img=page.locator('.ks-athos-play img[data-ks-athos-thumb]');
   await img.waitFor({timeout:18000});
   // Read actual remote image from i.ytimg.com. No route.fulfill, SVG, mocks, or supplied screenshot.
   await page.waitForFunction(()=>{
    const p=document.querySelector('#ks-athos-player'),i=p?.querySelector('img');
    return !!(i&&i.complete&&i.naturalWidth>120&&i.naturalHeight>90&&
      !i.hidden&&p.classList.contains('ks-athos-landscape-thumbnail'));
   },{timeout:25000});
   const info=await page.evaluate(()=>{
    const box=document.querySelector('#ks-athos-player');
    const image=box.querySelector('img');const article=document.querySelector('.ks-athos-full-text');
    const x=image.getBoundingClientRect(),y=box.getBoundingClientRect(),a=article.getBoundingClientRect();
    return {
      imageURL:image.currentSrc,sourceURL:image.getAttribute('src'),
      naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,
      displayedRatio:x.width/x.height,naturalRatio:image.naturalWidth/image.naturalHeight,
      frameHeight:y.height,articleGap:a.top-y.bottom,articleTextLength:article.textContent.length,
      goldButtonCount:document.querySelectorAll('.ks-athos-watch').length,
      duplicateCircleCount:document.querySelectorAll('.ks-athos-gold').length,
      syntheticText:document.body.innerText.includes('ATHOS WIDE THUMBNAIL')||document.body.innerText.includes('APPROVED PORTRAIT POSTER'),
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      fullText:article.textContent.slice(0,100)
    };
   });
   assert.ok(info.imageURL.startsWith('https://i.ytimg.com/vi/'+VIDEO+'/'),'Only genuine YouTube thumbnail allowed in owner review');
   assert.ok(info.naturalWidth>120&&info.naturalHeight>90,'Genuine thumbnail must have loaded');
   assert.ok(Math.abs(info.displayedRatio-info.naturalRatio)<.05,'Preserve original thumbnail framing');
   assert.equal(info.duplicateCircleCount,0);
   assert.equal(info.goldButtonCount,1);
   assert.equal(info.syntheticText,false,'Never show synthetic fixture to owner');
   assert.ok(!info.overflow,'No mobile overflow');
   assert.ok(info.articleTextLength>3900,'Approved article must be complete');
   if(width===390) assert.ok(info.articleGap>=-2&&info.articleGap<=55,'Article must be immediately under image');
   assert.deepEqual(errors,[]);
   await page.screenshot({path:OUT+'/'+lang+'-'+width+'-REAL-YOUTUBE.png',fullPage:false,animations:'disabled'});
   console.log('GENUINE OWNER PREVIEW PASS',lang,width,JSON.stringify(info));
   await page.close();
  }
  fs.writeFileSync(OUT+'/SOURCE-README.txt',
   'These are actual browser screenshots of the review branch using genuine i.ytimg.com media for YouTube video zsYOR7WmvAQ. No image mocks or AI-generated posters were used. The website is not published by this test.\n');
 }finally{await browser.close()}
})().catch(e=>{console.error('REAL YOUTUBE PREVIEW NOT AVAILABLE:',e);process.exitCode=1;});
