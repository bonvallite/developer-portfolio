
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-metafield-qa',{recursive:true});
try{
 for(const width of [1366,390]){
 const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
 const lab=page.locator('.jrv-meta');
 assert.equal(await lab.locator('.jrv-meta-list button').count(),29);
 await lab.getByLabel('Search metafields').fill('delivery_window_start_iso');
 assert.equal(await lab.locator('.jrv-meta-list button').count(),1);
 assert.match(await lab.locator('[data-meta-detail]').innerText(),/2026-12-03/);
 await lab.getByLabel('ETA write accepted').uncheck();
 assert.match(await lab.locator('[data-meta-detail]').innerText(),/Rejected/);
 await lab.getByRole('button',{name:'Delivered',exact:true}).click();
 assert.match(await lab.locator('.jrv-meta-preview').innerText(),/Delivered/);
 await lab.getByLabel('Selected tracking write accepted').uncheck();
 assert.match(await lab.locator('.jrv-meta-preview').innerText(),/Out for delivery/);
 await lab.getByLabel('Search metafields').fill('');
 await lab.getByLabel('Field group').selectOption('Tracking and status');
 assert.equal(await lab.locator('.jrv-meta-list button').count(),7);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
 await lab.locator('[data-meta-detail]').screenshot({path:'artifacts/logistics-metafield-qa/'+width+'.png',animations:'disabled'});
 assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
