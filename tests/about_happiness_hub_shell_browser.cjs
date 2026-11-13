const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const chrome=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
const root='http://127.0.0.1:8765/dist/index.html';
const about=[
 'about','about/happiness','about/happiness/video/happiness-not-for-sale',
 'about/happiness/video/world-is-not-paradise','about/after-sixty',
 'about/after-sixty/sixty-is-not-a-waiting-room','about/health',
 'about/health/depression-anxiety','about/health/depression-anxiety/full',
 'about/why-adventures','about/business','about/volunteer-programs',
 'about/volunteering','about/mosques','about/quran-circles','about/source-archive',
 'content/founder','content/community-wells'
];
const titleArabic=['سعادة لا تُشترى','الدنيا ليست جنة؟'];
const titleEnglish=['Happiness Cannot Be Bought','The World Is Not Paradise'];
const hrefSlugs=['happiness-not-for-sale','world-is-not-paradise'];
async function go(page,lang,r){
 await page.goto(root+'#/'+lang+'/'+r,{waitUntil:'domcontentloaded',timeout:25000});
 await page.locator('#app > header.site-header').waitFor({timeout:15000});
}
(async()=>{
 const b=await chromium.launch({headless:true,...(chrome?{executablePath:chrome}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  fs.mkdirSync('review-screenshots/about-v2',{recursive:true});
  for(const lang of ['ar','en']){
    for(const width of [390,980,1440]){
      const page=await b.newPage({viewport:{width,height:940},deviceScaleFactor:1});
      const runtimeErrors=[];
      page.on('pageerror',e=>runtimeErrors.push(e.message));
      await go(page,lang,'about/happiness');
      await page.locator('main.ks-about-hub[data-ks-about-home=v2]').waitFor({timeout:18000});
      await page.waitForFunction(()=>{
        const images=Array.from(document.querySelectorAll('.ks-hub-poster img'));
        return images.length===2 && images.every(im=>im.complete&&im.naturalWidth>600);
      },null,{timeout:15000});
      const result=await page.evaluate(()=>{
        const sel=x=>document.querySelector(x);
        const cards=Array.from(document.querySelectorAll('.ks-hub-card'));
        const main=sel('main.ks-about-hub');
        return {
          mainDir:main.dir,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,
          hubTitle:sel('.ks-hub-hero h1').textContent.trim(),
          cardNames:cards.map(x=>x.querySelector('h2').textContent.trim()),
          descriptions:cards.map(x=>x.querySelector('p').textContent.trim()),
          cardPosterSizes:cards.map(x=>{const img=x.querySelector('img');return {w:img.naturalWidth,h:img.naturalHeight}}),
          cardPosters:cards.map(x=>x.querySelector('.ks-hub-poster').getAttribute('href')),
          cardRead:cards.map(x=>x.querySelector('.ks-hub-read').getAttribute('href')),
          videoShareLinks:cards.map(x=>x.querySelector('.ks-hub-share a:first-child').getAttribute('href')),
          articleShareLinks:cards.map(x=>x.querySelector('.ks-hub-share a:nth-child(2)').getAttribute('href')),
          archiveLinks:cards.map(x=>x.querySelector('.ks-hub-share a:nth-child(3)').getAttribute('href')),
          ctaText:cards.map(x=>x.querySelector('.ks-hub-cta').textContent.trim()),
          panelCount:document.querySelectorAll('#app > header.site-header .ks-about-section-nav').length,
          footerCount:document.querySelectorAll('#app > footer.footer .ks-about-footer-nav').length,
          headerCount:document.querySelectorAll('#app > header.site-header').length,
          globalFooterCount:document.querySelectorAll('#app > footer.footer').length,
          sectionLinks:document.querySelectorAll('.ks-about-section-nav .ks-about-link').length,
          active:document.querySelector('.ks-about-section-nav a[aria-current=page]')?.getAttribute('href'),
          socialX:Array.from(document.querySelectorAll('.footer-social-list a')).map(x=>x.getAttribute('href')).filter(x=>x.includes('x.com/')),
          heroSrcs:Array.from(document.querySelectorAll('.ks-hub-poster img')).map(x=>x.getAttribute('src'))
        };
      });
      assert.deepEqual(runtimeErrors,[]);
      assert.equal(result.mainDir,lang==='ar'?'rtl':'ltr');
      assert.ok(result.bodyWidth<=result.viewport+4,'Page should not overflow horizontally on phone');
      assert.equal(result.hubTitle,lang==='ar'?'خلّ السعادة عادة':'Make Happiness a Habit');
      assert.deepEqual(result.cardNames,lang==='ar'?titleArabic:titleEnglish);
      assert.equal(result.cardNames.length,2);
      assert.deepEqual(result.cardPosters,hrefSlugs.map(slug=>'#/'+lang+'/about/happiness/video/'+slug+'?focus=video'));
      assert.deepEqual(result.cardRead,hrefSlugs.map(slug=>'#/'+lang+'/about/happiness/video/'+slug+'?focus=article'));
      assert.deepEqual(result.ctaText,lang==='ar'?['شاهد الفيديو','شاهد الفيديو']:['Watch video','Watch video']);
      assert.ok(result.descriptions.every(x=>x.length>45));
      assert.ok(result.cardPosterSizes.every(x=>x.w>=600));
      assert.deepEqual(result.heroSrcs,hrefSlugs.map(slug=>'assets/happiness/'+slug+'-youtube-poster.jpg'));
      assert.equal(result.headerCount,1);
      assert.equal(result.globalFooterCount,1);
      assert.equal(result.panelCount,1);
      assert.equal(result.footerCount,1);
      assert.equal(result.sectionLinks,8);
      assert.equal(result.active,'#/'+lang+'/about/happiness');
      assert.ok(result.socialX.includes('https://x.com/alsaabb1'));
      assert.ok(result.socialX.includes('https://x.com/karim_saab'));
      result.videoShareLinks.forEach((x,i)=>assert.equal(x,'share/'+lang+'/happiness-'+hrefSlugs[i]+'-video.html'));
      result.articleShareLinks.forEach((x,i)=>assert.equal(x,'share/'+lang+'/happiness-'+hrefSlugs[i]+'-article.html'));
      assert.deepEqual(result.archiveLinks,[
        'https://drive.google.com/drive/folders/1JTGn0DMXQM0zEypKgIwyG9avHFYS5tNY',
        'https://drive.google.com/drive/folders/1TJtoT0AeqC--rV9cGaZLw14ZgguSpMrJ'
      ]);
      if(width!==980) await page.screenshot({path:'review-screenshots/about-v2/happiness-home-'+lang+'-'+width+'.png',fullPage:true,animations:'disabled'});
      // Clicking article route must preserve video and article V9 layouts.
      await page.locator('.ks-hub-read').first().click();
      await page.locator('main.ks-happ').waitFor({timeout:15000});
      await page.locator('#ks-happiness-article-pane > .ks-share-v1[data-kind=article]').waitFor({timeout:13000});
      assert.equal(await page.locator('#app > header.site-header .ks-about-section-nav').count(),1);
      assert.equal(await page.locator('#app > footer.footer .ks-about-footer-nav').count(),1);
      if(width===390)await page.screenshot({path:'review-screenshots/about-v2/happiness-article-'+lang+'-390.png',fullPage:true,animations:'disabled'});
      console.log('HUB + STORY + SHELL PASS',lang,width,JSON.stringify({panelCount:result.panelCount,footerCount:result.footerCount,posters:result.heroSrcs}));
      await page.close();
    }
    const page=await b.newPage({viewport:{width:390,height:850}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    for(const r of about){
      await go(page,lang,r);
      await page.locator('.ks-about-section-nav .ks-about-link').first().waitFor({timeout:15000});
      assert.equal(await page.locator('#app > header.site-header').count(),1,'Header missing/duplicate '+lang+' '+r);
      assert.equal(await page.locator('#app > footer.footer').count(),1,'Footer missing/duplicate '+lang+' '+r);
      assert.equal(await page.locator('.ks-about-section-nav').count(),1,'About nav missing/duplicate '+lang+' '+r);
      assert.equal(await page.locator('.ks-about-footer-nav').count(),1,'About footer nav missing/duplicate '+lang+' '+r);
      const links=await page.locator('.ks-about-section-nav .ks-about-link').count();
      assert.equal(links,8);
      const active=await page.locator('.ks-about-section-nav [aria-current=page]').count();
      assert.equal(active,1,'Expected one active tab for '+r);
      if(r==='about/after-sixty/sixty-is-not-a-waiting-room'){
        await page.locator('.ks60-poster-cta').waitFor({timeout:15000});
        assert.equal((await page.locator('.ks60-poster-cta').textContent()).trim(),lang==='ar'?'شاهد الفيديو':'Watch video');
      }
      if(r.startsWith('about/happiness/video/')){
        await page.locator('main.ks-happ').waitFor({timeout:15000});
        assert.equal(await page.locator('.ks-happ-article-pane').count(),1);
      }
      console.log('ABOUT ROUTE SHELL PASS',lang,r);
    }
    assert.deepEqual(errors,[],'JavaScript errors on About route checks');
    await go(page,lang,'journeys');
    assert.equal(await page.locator('.ks-about-section-nav').count(),0,'Outside About should not have About nav');
    assert.equal(await page.locator('.ks-about-footer-nav').count(),0);
    await page.close();
  }
  console.log('ALL ABOUT UNIFIED SHELL AND HAPPINESS HUB V2 TESTS PASSED');
 }finally{await b.close();}
})().catch(err=>{console.error(err);process.exitCode=1});
