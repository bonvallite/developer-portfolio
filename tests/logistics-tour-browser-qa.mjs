
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-tour-qa',{recursive:true});
try{
 for(const sample of [{width:1366,height:850,reducedMotion:'no-preference'},{width:390,height:844,reducedMotion:'reduce'}]){
  const context=await browser.newContext({viewport:{width:sample.width,height:sample.height},reducedMotion:sample.reducedMotion});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const r=await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  assert.equal(r?.status(),200);
  const tour=page.locator('.jrv-tour');
  assert.equal(await tour.locator('[data-tour-chapter]').count(),14);
  if(sample.reducedMotion==='no-preference'){
    const chapter=tour.locator('[data-tour-chapter="11"]');
    await chapter.evaluate(e=>{const y=e.getBoundingClientRect().top+window.scrollY-window.innerHeight*.50;window.scrollTo(0,y);});
    await page.waitForFunction(()=>document.querySelector('[data-tour-chapter="11"] button')?.getAttribute('aria-pressed')==='true',null,{timeout:5000});
    await page.waitForFunction(()=>document.querySelector('.jrv-tour [data-packet]')?.getAttribute('transform')||document.querySelector('.jrv-tour [data-packet]')?.getAttribute('style')?.includes('transform'),null,{timeout:3000});
  }
  await tour.getByRole('button',{name:'Inspect chapter 7',exact:true}).click();
  assert.equal(await tour.locator('[data-edge="app-shopify"]').getAttribute('class'),'jrv-life-edge active');
  const studio=page.locator('.jrv-lifecycle');
  await studio.getByLabel('Scenario').selectOption('signature');
  await studio.getByRole('button',{name:'Next event'}).click();
  assert.ok(await studio.getByRole('button',{name:'Next event'}).isDisabled());
  assert.match(await studio.locator('.jrv-life-inspector').innerText(),/FAILED/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await tour.locator('.jrv-tour-visual').screenshot({path:'artifacts/logistics-tour-qa/'+sample.width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
