
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-notification-qa',{recursive:true});
try{
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-notice');
  assert.match(await lab.locator('.jrv-notice-message').innerText(),/Estimated delivery window:/);
  await lab.getByLabel('Email available',{exact:true}).uncheck();
  assert.match(await lab.getByRole('status').innerText(),/SMS/);
  await lab.getByLabel('Mobile available',{exact:true}).uncheck();
  assert.match(await lab.getByRole('status').innerText(),/NO_CONTACT_CHANNEL/);
  await lab.getByLabel('Email available',{exact:true}).check();
  await lab.getByRole('button',{name:'Delivered',exact:true}).click();
  assert.match(await lab.locator('.jrv-notice-message').innerText(),/Shipment status: Delivered/);
  await lab.getByLabel('Selected tracking write accepted').uncheck();
  assert.match(await lab.getByRole('status').innerText(),/SELECTED_STATUS_WRITE_REJECTED/);
  await lab.getByLabel('Selected tracking write accepted').check();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await lab.locator('.jrv-notice-grid').screenshot({path:'artifacts/logistics-notification-qa/'+width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
