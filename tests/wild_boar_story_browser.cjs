const {chromium}=require('playwright');
const fs=require('fs');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const BASE='http://127.0.0.1:8765/dist/index.html';
const OUT='visual-review/wild-boar';
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  async function testStory(lang,width,height,screenshot){
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://www.youtube-nocookie.com/**',r=>r.abort());
    await page.route('https://i.ytimg.com/**',r=>r.abort());
    await page.goto(BASE+'#/'+lang+'/story/wild-boar-greece',{waitUntil:'domcontentloaded'});
    const main=page.locator('#app > main.ks-wb');
    await main.waitFor({timeout:15000});
    const h=await main.locator('h1').innerText();
    if(lang==='ar'&&!h.includes('الخنزير البري'))throw Error('Missing approved Arabic title: '+h);
    if(lang==='en'&&!h.includes('Wild Boar'))throw Error('Missing approved English title: '+h);
    const paras=await main.locator('.ks-wb-article p').count();
    if(paras<20)throw Error('Truncated bilingual essay: '+lang+' '+paras);
    const ui=await page.evaluate(()=>({
      header:!!document.querySelector('#app header'),
      footer:!!document.querySelector('#app footer'),
      overflow:document.documentElement.scrollWidth>innerWidth+2,
      videoWidth:document.querySelector('.ks-wb-video-surface')?.getBoundingClientRect().width||0,
      videoHeight:document.querySelector('.ks-wb-video-surface')?.getBoundingClientRect().height||0,
      article:!!document.querySelector('#ks-wb-article'),
      share:!!document.querySelector('[data-ks-share="copy"]')
    }));
    if(!ui.header||!ui.footer||ui.overflow||!ui.article||!ui.share)throw Error('Layout regression '+JSON.stringify(ui));
    if(Math.abs(ui.videoWidth/ui.videoHeight-9/16)>.04)throw Error('Video not portrait '+JSON.stringify(ui));
    const ext=main.locator('a[href="https://www.youtube.com/shorts/SVdg9IxoS4k"]');
    if(await ext.count()<1)throw Error('Missing original YouTube fallback');
    await page.screenshot({path:OUT+'/'+screenshot,fullPage:true});
    await main.locator('[data-wb-play]').click();
    const iframe=main.locator('#ks-wb-player iframe');
    await iframe.waitFor({timeout:5000});
    const src=await iframe.getAttribute('src');
    if(!src.includes('SVdg9IxoS4k'))throw Error('Wrong video in iframe: '+src);
    if(errors.length)throw Error('Browser errors '+errors.join('\n'));
    console.log(lang,width,'x',height,'article paragraphs:',paras,'poster ratio:',(ui.videoWidth/ui.videoHeight).toFixed(2));
    await page.close();
  }
  try{
    // Verify the ACTUAL optimized owner poster (not a mock) on mobile in both languages.
    for(const lang of ['ar','en']){
      const current=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
      await current.route('https://i.ytimg.com/**',r=>r.abort());
      await current.goto(BASE+'#/'+lang+'/story/wild-boar-greece',{waitUntil:'domcontentloaded'});
      await current.locator('.ks-wb-play img[data-wb-poster]').waitFor({timeout:15000});
      await current.waitForFunction(()=>document.querySelector('[data-wb-poster]')?.dataset.wbActiveSource==='owner-approved-poster',
        {timeout:10000});
      const real=await current.evaluate(()=>{
        const img=document.querySelector('[data-wb-poster]'),button=img.closest('button');
        const bounds=button.getBoundingClientRect();
        return {src:img.getAttribute('src'),w:img.naturalWidth,h:img.naturalHeight,
          fit:getComputedStyle(img).objectFit,ratio:bounds.width/bounds.height,
          hasCaption:!!button.querySelector('.ks-wb-play-label'),
          hasDuplicatePlayIcon:!!button.querySelector('.ks-wb-gold-play'),
          portrait:button.classList.contains('ks-wb-owner-portrait')};
      });
      if(real.src!=='assets/stories/wild-boar-greece/poster.webp'||real.w!==941||real.h!==1672||
         real.fit!=='cover'||Math.abs(real.ratio-9/16)>.04||!real.portrait||
         !real.hasCaption||real.hasDuplicatePlayIcon)
        throw Error('Real owner poster regression '+lang+' '+JSON.stringify(real));
      await current.screenshot({path:OUT+'/'+lang+'-mobile-real-owner-poster.png',fullPage:false});
      await current.close();
    }
    // Regression for the owner-reported mobile black bars: a successful horizontal
    // thumbnail must fill the full portrait 9:16 surface with a blurred backdrop
    // while retaining the complete image as the main (uncropped) layer.
    const proof=await browser.newPage({viewport:{width:390,height:844}});
    // If the owner's hosted poster cannot load, the YouTube still remains a
    // safe horizontal fallback with blurred background instead of black bars.
    await proof.route('**/assets/stories/wild-boar-greece/poster.webp',r=>r.abort());
    await proof.route('https://i.ytimg.com/**',r=>r.fulfill({
      status:200,contentType:'image/webp',
      body:fs.readFileSync('dist/assets/journal-greece.webp')
    }));
    await proof.goto(BASE+'#/ar/story/wild-boar-greece',{waitUntil:'domcontentloaded'});
    const cover=proof.locator('.ks-wb-play img[data-wb-poster]');
    await cover.waitFor({timeout:15000});
    await proof.waitForFunction(()=>document.querySelector('.ks-wb-play')?.style.getPropertyValue('--wb-poster-image').includes('ytimg.com'),{timeout:10000});
    const posterState=await proof.evaluate(()=>{
      const play=document.querySelector('.ks-wb-play');
      const img=play.querySelector('img[data-wb-poster]');
      return {
        background:getComputedStyle(play,'::before').backgroundImage,
        imageFit:getComputedStyle(img).objectFit,
        width:img.naturalWidth,
        imageBackground:getComputedStyle(img).backgroundColor,
        aspect:play.getBoundingClientRect().width/play.getBoundingClientRect().height
      };
    });
    if(!posterState.background.includes('ytimg.com')||posterState.imageFit!=='contain'||posterState.width<=120||
       Math.abs(posterState.aspect-9/16)>.04)
       throw Error('Portrait backdrop regression '+JSON.stringify(posterState));
    await proof.screenshot({path:OUT+'/ar-mobile-thumbnail-filled.png',fullPage:false});
    await proof.close();

    // FUTURE OWNER POSTER: simulate a verified public copy. The real Drive image
    // remains private; no publication or permission change is done by this test.
    const owner=await browser.newPage({viewport:{width:390,height:844}});
    await owner.route('**/data/stories-road-v1.json*',r=>{
      const copy=JSON.parse(fs.readFileSync('dist/data/stories-road-v1.json','utf8'));
      copy.poster_status='approved_and_published';
      copy.poster_asset='assets/stories/wild-boar-greece/poster.webp';
      return r.fulfill({json:copy});
    });
    await owner.route('**/assets/stories/wild-boar-greece/poster.webp',r=>r.fulfill({
      status:200,contentType:'image/svg+xml',
      body:'<svg xmlns="http://www.w3.org/2000/svg" width="360" height="640" viewBox="0 0 360 640"><rect width="360" height="640" fill="#58472e"/><text x="180" y="310" text-anchor="middle" fill="#f3e2bd" font-size="21">APPROVED POSTER TEST</text></svg>'
    }));
    await owner.route('https://i.ytimg.com/**',r=>r.abort());
    await owner.goto(BASE+'#/ar/story/wild-boar-greece',{waitUntil:'domcontentloaded'});
    await owner.locator('.ks-wb-play img[data-wb-poster]').waitFor({timeout:15000});
    await owner.waitForFunction(()=>document.querySelector('[data-wb-poster]')?.dataset.wbActiveSource==='owner-approved-poster');
    const poster=await owner.evaluate(()=>{
      const img=document.querySelector('.ks-wb-play img[data-wb-poster]'),b=img.closest('button');
      const r=b.getBoundingClientRect();
      return {source:img.dataset.wbActiveSource,fit:getComputedStyle(img).objectFit,
        ratio:r.width/r.height,portrait:b.classList.contains('ks-wb-owner-portrait'),
        title:document.querySelector('main.ks-wb h1')?.textContent,
        buttonCount:b.querySelectorAll('.ks-wb-gold-play').length};
    });
    if(poster.source!=='owner-approved-poster'||poster.fit!=='cover'||!poster.portrait||
       Math.abs(poster.ratio-9/16)>.04||poster.buttonCount!==0)
      throw Error('Owner poster preferred incorrectly: '+JSON.stringify(poster));
    await owner.screenshot({path:OUT+'/ar-mobile-future-owner-poster.png',fullPage:false});
    await owner.goto(BASE+'#/ar/stories-road',{waitUntil:'domcontentloaded'});
    await owner.locator('[data-wb-card-poster]').waitFor({timeout:15000});
    await owner.waitForFunction(()=>document.querySelector('[data-wb-card-poster]')?.dataset.wbActiveSource==='owner-approved-poster');
    const cardPoster=await owner.locator('[data-wb-card-poster]').getAttribute('src');
    if(cardPoster!=='assets/stories/wild-boar-greece/poster.webp')
      throw Error('Story card must use the SAME approved owner poster: '+cardPoster);
    await owner.screenshot({path:OUT+'/ar-story-card-future-owner-poster.png',fullPage:false});
    await owner.close();

    await testStory('ar',1440,900,'ar-desktop.png');
    await testStory('ar',390,844,'ar-mobile.png');
    await testStory('en',390,844,'en-mobile.png');
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    await page.route('https://i.ytimg.com/**',r=>r.abort());
    await page.goto(BASE+'#/ar/stories-road',{waitUntil:'domcontentloaded'});
    const card=page.locator('[data-wb-index-card]');
    await card.waitFor({timeout:15000});
    if(await card.count()!==1)throw Error('Missing or duplicate index entry');
    await card.screenshot({path:OUT+'/story-index-card.png'});
    await card.click();
    await page.locator('#app > main.ks-wb').waitFor({timeout:15000});
    await page.close();
    console.log('Stories index card opens approved article; desktop/mobile source checks passed.');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
