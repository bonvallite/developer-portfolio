// Browser regression for the public-safe synthetic Python analytics lab.
// Uses the same local Next.js server as other case-study QA. No real APIs.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.CASE_STUDY_BASE_URL||'http://127.0.0.1:3100';
const dir='artifacts/analytics-lab-browser-qa';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const v of [{name:'desktop',width:1440,height:900},{name:'tablet',width:768,height:1024},{name:'mobile',width:390,height:844}]){
  const context=await browser.newContext({viewport:{width:v.width,height:v.height},acceptDownloads:true,reducedMotion:v.name==='mobile'?'reduce':'no-preference'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/analytics-lab',{waitUntil:'domcontentloaded',timeout:45000});
  assert.equal(response?.status(),200,v.name+': HTTP 200');
  await page.getByRole('heading',{name:/From raw data to/}).waitFor();
  await page.getByRole('button',{name:'Purchase funnel'}).click();
  assert.equal(await page.locator('.al-chart-row').count(),4,'four funnel stages');
  await page.getByRole('button',{name:'Acquisition channels'}).click();
  assert.equal(await page.locator('.al-chart-row').count(),4,'four acquisition channels');
  await page.getByRole('button',{name:/Search Console/}).click();
  await page.getByText('gsc_03_export_all_30_full.py').waitFor();
  await page.getByLabel('Shopify orders').fill('300');
  await page.getByLabel('GA4 purchases').fill('240');
  await page.getByText('20% of Shopify orders').waitFor();
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:/Download synthetic CSV/}).click();
  const file=await download;
  assert.equal(file.suggestedFilename(),'jrv-synthetic-acquisition.csv');
  await file.delete();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3);
  assert.equal(overflow,false,v.name+': horizontal overflow');
  assert.deepEqual(errors,[],v.name+': runtime errors');
  await page.screenshot({path:dir+'/'+v.name+'.png',fullPage:true,animations:'disabled'});
  await context.close();
  console.log('Analytics lab '+v.name+' passed');
 }
}finally{await browser.close()}
