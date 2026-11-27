
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-security-qa',{recursive:true});
try{
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-security');
  const execute=async expected=>{await lab.getByRole('button',{name:'Execute security test'}).click();await lab.getByRole('status').getByText(expected,{exact:false}).waitFor();};
  await execute('ACCEPTED · HTTP 200');
  await lab.getByLabel('Security scenario').selectOption('tampered');
  await execute('REJECTED · HTTP 401');
  await lab.getByLabel('Authentication flow').selectOption('oauth');
  await lab.getByLabel('Security scenario').selectOption('expired');
  await execute('REJECTED · HTTP 403');
  assert.match(await lab.getByRole('status').innerText(),/STATE_EXPIRED/);
  await lab.getByLabel('Security scenario').selectOption('valid');
  await execute('ACCEPTED · HTTP 200');
  assert.match(await lab.getByRole('status').innerText(),/Yes \(local model\)/);
  await lab.getByRole('button',{name:/Verify state, cookie and TTL/}).click();
  assert.match(await lab.locator('[data-security-output]').innerText(),/ttlSeconds/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await lab.locator('.jrv-security-grid').screenshot({path:'artifacts/logistics-security-qa/'+width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
