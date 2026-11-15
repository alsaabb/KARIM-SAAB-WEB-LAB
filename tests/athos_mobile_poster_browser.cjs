const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const BASE='http://127.0.0.1:8765/dist/index.html';
const OUT='visual-review/video-poster-mobile';
const VID='zsYOR7WmvAQ';
const WIDE='<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#28352c"/><rect x="210" y="55" width="860" height="610" fill="#bd9969"/><text x="640" y="360" font-size="73" text-anchor="middle" fill="#171b15">ATHOS WIDE THUMBNAIL</text></svg>';
const TALL='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><rect width="720" height="1280" fill="#2c362b"/><text x="360" y="590" font-size="42" text-anchor="middle" fill="#f2dba9">APPROVED PORTRAIT POSTER</text></svg>';
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}) ,args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    for(const [lang,width] of [['ar',390],['en',390],['ar',1440]]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.route('https://i.ytimg.com/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:WIDE}));
      await page.route('https://www.youtube-nocookie.com/**',route=>route.abort());
      await page.goto(BASE+'#/'+lang+'/destination/mount-athos-greece',{waitUntil:'domcontentloaded'});
      await page.locator('#app > main.ks-athos .ks-athos-layout').waitFor({timeout:15000});
      await page.waitForFunction(()=>document.querySelector('.ks-athos-frame')?.classList.contains('ks-athos-landscape-thumbnail'),{timeout:10000});
      const snap=await page.evaluate(()=>{
        const q=s=>document.querySelector(s);
        const player=q('.ks-athos-frame'),img=q('.ks-athos-play img'),article=q('.ks-athos-full-text');
        const p=player.getBoundingClientRect(),image=img.getBoundingClientRect(),a=article.getBoundingClientRect();
        return {
          playerHeight:p.height,imageHeight:image.height,imageWidth:image.width,
          shownRatio:image.width/image.height,naturalRatio:img.naturalWidth/img.naturalHeight,
          articleGap:a.top-p.bottom,articleLength:article.textContent.length,
          goldButtons:document.querySelectorAll('.ks-athos-watch').length,
          obsoleteCircle:document.querySelectorAll('.ks-athos-gold').length,
          ctaText:q('.ks-athos-watch')?.innerText.trim(),
          watchOnYouTube:!!q('.ks-athos-direct a[href*="youtube.com"]'),
          iframeBefore:document.querySelectorAll('#ks-athos-player iframe').length,
          overflow:document.documentElement.scrollWidth>innerWidth+2,
          header:!!document.querySelector('#app header'),footer:!!document.querySelector('#app footer'),
          owner:player.classList.contains('ks-athos-owner-portrait')
        };
      });
      assert.equal(errors.length,0,'Browser JS errors: '+errors.join(';'));
      assert.ok(snap.header&&snap.footer,'Global header/footer must survive route');
      assert.ok(snap.articleLength>3900,'Owner-approved article was truncated');
      assert.equal(snap.goldButtons,1,'Use one integrated Watch Video control');
      assert.equal(snap.obsoleteCircle,0,'No giant play circle over source image');
      assert.equal(snap.iframeBefore,0,'Iframe must be lazy-on-click');
      assert.ok(Math.abs(snap.shownRatio-snap.naturalRatio)<0.04,'Never crop or stretch source YouTube thumbnail');
      assert.ok(snap.playerHeight<350,'No artificial 9:16 blurred bands around horizontal thumbnail');
      if(width===390)assert.ok(snap.articleGap>=-2&&snap.articleGap<70,'Article starts immediately beneath image on mobile');
      assert.ok(snap.watchOnYouTube,'Preserve direct YouTube fallback');
      assert.ok(!snap.overflow,'No horizontal phone overflow');
      assert.equal(snap.owner,false,'No unapproved Drive portrait poster may be used');
      await page.screenshot({path:OUT+'/'+lang+'-'+width+'-wide-source.png',fullPage:false});
      await page.locator('#ks-athos-play').click();
      const iframe=page.locator('#ks-athos-player iframe');await iframe.waitFor({timeout:5000});
      const playback=await page.evaluate(()=>{
        const f=document.querySelector('.ks-athos-frame'),r=f.getBoundingClientRect();
        return {ratio:r.width/r.height,source:f.querySelector('iframe')?.getAttribute('src'),playing:f.classList.contains('ks-athos-playing')};
      });
      assert.ok(Math.abs(playback.ratio-(9/16))<0.035,'Actual Shorts iframe must be 9:16 after click');
      assert.ok(playback.source.includes(VID),'YouTube ID must remain unchanged');
      assert.ok(playback.playing);
      console.log('ATHOS MOBILE/DESKTOP COVER PASS',lang,width,JSON.stringify(snap));
      await page.close();
    }
    // Owner-approved public portrait asset: use actual portrait aspect rather than changing the original artwork.
    const own=await browser.newPage({viewport:{width:390,height:900}});
    await own.route('**/data/destination-mount-athos-greece.json*',route=>{
      const d=JSON.parse(fs.readFileSync('dist/data/destination-mount-athos-greece.json','utf8'));
      d.poster.public_asset='assets/stories/mount-athos/owner-portrait.webp';d.poster.owner_poster_approved=true;
      route.fulfill({json:d});
    });
    await own.route('**/assets/stories/mount-athos/owner-portrait.webp',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:TALL}));
    await own.goto(BASE+'#/ar/destination/mount-athos-greece',{waitUntil:'domcontentloaded'});
    await own.locator('.ks-athos-frame.ks-athos-owner-portrait').waitFor({timeout:15000});
    const ownData=await own.evaluate(()=>{
      const p=document.querySelector('.ks-athos-play img');
      const r=p.getBoundingClientRect();
      return {src:p.getAttribute('src'),fit:getComputedStyle(p).objectFit,ratio:r.width/r.height};
    });
    assert.equal(ownData.src,'assets/stories/mount-athos/owner-portrait.webp');
    assert.equal(ownData.fit,'cover');
    assert.ok(Math.abs(ownData.ratio-9/16)<.04);
    await own.screenshot({path:OUT+'/ar-390-owner-approved-portrait.png',fullPage:false});
    await own.close();
    // Thumbnail failure: preserve readable text and clickable CTA; no fake images.
    const missing=await browser.newPage({viewport:{width:390,height:900}});
    await missing.route('https://i.ytimg.com/**',r=>r.abort());
    await missing.goto(BASE+'#/en/destination/mount-athos-greece',{waitUntil:'domcontentloaded'});
    await missing.locator('.ks-athos-frame.ks-athos-no-thumb').waitFor({timeout:15000});
    assert.ok(await missing.locator('.ks-athos-editorial:visible').count()>0);
    assert.equal(await missing.locator('.ks-athos-watch').count(),1);
    await missing.close();
  }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1;});
