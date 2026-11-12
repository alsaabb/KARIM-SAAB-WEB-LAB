const {chromium}=require('playwright');
const fs=require('node:fs');
const {execSync}=require('node:child_process');
const assert=require('node:assert/strict');
const base='https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/index.html';
const candidates=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'];
const executablePath=candidates.find(x=>fs.existsSync(x));
(async()=>{
  const opts={headless:true,args:['--no-sandbox','--disable-dev-shm-usage']};
  if(executablePath)opts.executablePath=executablePath;
  const browser=await chromium.launch(opts);
  try{
    const cases=[
      {route:'#/ar/',selector:'#app > main'},
      {route:'#/ar/about/health/depression-anxiety/full',selector:'.ks-health-full .ks-share-v1'},
      {route:'#/ar/about/happiness/video/happiness-not-for-sale',selector:'.ks-share-v1'},
      {route:'#/ar/about/after-sixty/sixty-is-not-a-waiting-room',selector:'.ks60-split + .ks-share-v1, .ks60-wrap > .ks-share-v1'}
    ];
    for(const c of cases){
      const page=await browser.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(String(e).slice(0,350)));
      let response=await page.goto(base+c.route,{waitUntil:'domcontentloaded',timeout:45000});
      assert.equal(response.status(),200,c.route+' should have HTTP 200');
      await page.locator(c.selector).first().waitFor({state:'attached',timeout:20000});
      const h1=await page.locator('main h1').first().textContent().catch(()=>'');
      console.log('BROWSER OK',c.route,'heading:',JSON.stringify(h1),'pageErrors:',errors.length,errors.join(' || '));
      assert.equal(errors.length,0,c.route+': unexpected JavaScript page errors');
      await page.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error('BROWSER FAILED',e);process.exitCode=1;});
