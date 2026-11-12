// Check poster visibility and mobile stacking on locally served preview branch.
// Usage: python3 -m http.server 8765 & npm install --no-save --no-package-lock playwright@1.56.1; node tests/after_sixty_poster_browser.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const base='http://127.0.0.1:8765/dist/index.html';
(async()=>{
  const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const width of [390,980,1440]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'#/ar/about/after-sixty/sixty-is-not-a-waiting-room',{waitUntil:'domcontentloaded',timeout:25000});
      await page.locator('#ks60-player .ks60-poster-image').waitFor({timeout:12000});
      await page.locator('#ks60-video-pane > .ks-share-v1[data-kind=video]').waitFor({timeout:12000});
      await page.locator('#ks60-article-pane > .ks-share-v1[data-kind=article]').waitFor({timeout:12000});
      const data=await page.evaluate(()=>{
        const $=s=>document.querySelector(s);
        const player=$('#ks60-player'),poster=$('#ks60-player .ks60-poster-image'),
          video=$('#ks60-video-pane'),article=$('#ks60-article-pane');
        const pr=player.getBoundingClientRect(),vr=video.getBoundingClientRect(),ar=article.getBoundingClientRect();
        return {
          fit:getComputedStyle(poster).objectFit,
          playerWidth:pr.width,playerHeight:pr.height,
          videoTop:vr.top,videoBottom:vr.bottom,articleTop:ar.top,articleLeft:ar.left,
          visibleBadge:!!$('.ks60-poster-badge'),
          isButton:!!$('.ks60-poster[data-start-play]'),
          icon:$('.ks60-poster-play')?.textContent,
          hasArticleShare:!!$('#ks60-article-pane .ks-share-v1')
        };
      });
      assert.equal(errors.length,0,'Unexpected JavaScript errors: '+errors);
      assert.equal(data.fit,'cover','Portrait poster must crop the wide video thumbnail to fill, not letterbox');
      assert.ok(data.playerWidth>=290,'Poster too small: '+data.playerWidth);
      assert.ok(Math.abs(data.playerHeight/data.playerWidth-(16/9))<0.05,'Portrait aspect ratio should be 9:16');
      assert.ok(data.visibleBadge&&data.isButton&&data.icon?.includes('▶'),'Full cover must be tappable with a visible play icon and video badge');
      assert.ok(data.hasArticleShare,'Article sharing cannot be removed');
      if(width<=1100)assert.ok(data.articleTop>=data.videoBottom-3,
        'On phone/tablet the article must appear BELOW the player rather than side-by-side: '+JSON.stringify(data));
      console.log('POSTER MOBILE CHECK OK',width,JSON.stringify(data));
      await page.close();
    }
    const page=await browser.newPage({viewport:{width:390,height:900},deviceScaleFactor:1});
    await page.goto(base+'#/ar/about/after-sixty',{waitUntil:'domcontentloaded',timeout:25000});
    await page.locator('.ks60-grid-single .ks60-thumb img').waitFor({timeout:12000});
    const listing=await page.evaluate(()=>{
      const box=document.querySelector('.ks60-grid-single .ks60-thumb').getBoundingClientRect();
      return {w:box.width,h:box.height,badge:!!document.querySelector('.ks60-card-video-badge'),
        clickable:!!document.querySelector('a.ks60-card[href*="about/after-sixty/"]')};
    });
    assert.ok(listing.h>listing.w*1.5,'Card preview must use a prominent portrait poster');
    assert.ok(listing.badge&&listing.clickable,'Cover should be a clickable video entry');
    console.log('LISTING POSTER CHECK OK',JSON.stringify(listing));
    await page.close();
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
