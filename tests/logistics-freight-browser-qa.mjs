
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-freight-qa',{recursive:true});
try{
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-freight');
  await lab.getByRole('button',{name:/Pack and allocate cartons/}).click();
  assert.equal(await lab.locator('[data-freight-count]').innerText(),'3');
  assert.equal(await lab.locator('[data-freight-carton]').count(),3);
  await lab.getByRole('button',{name:/Delivered/}).click();
  assert.equal(await lab.locator('[data-freight-truck]').count(),1);
  assert.match(await lab.locator('.jrv-freight-inspector pre').innerText(),/fulfillmentEventCreate/);
  await lab.locator('.jrv-freight-scene').screenshot({path:'artifacts/logistics-freight-qa/'+width+'.png',animations:'disabled'});
  await lab.getByLabel('Carrier scenario').selectOption('carrier');
  await lab.getByRole('button',{name:/Request chilled consignment/}).click();
  assert.match(await lab.getByRole('status').innerText(),/FAILED/);
  assert.equal(await lab.locator('[data-freight-truck]').count(),0);
  await lab.getByLabel('Delivery method').selectOption('pickup');
  await lab.getByRole('button',{name:/Held for store pickup/}).click();
  assert.match(await lab.getByRole('status').innerText(),/SKIPPED/);
  assert.equal(await lab.locator('[data-freight-carton]').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
