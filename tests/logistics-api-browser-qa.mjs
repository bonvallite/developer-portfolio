
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-api-qa',{recursive:true});
try{
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-api');
  const execute=async expected=>{await lab.getByRole('button',{name:'Execute locally'}).click();await lab.getByRole('status').getByText(expected,{exact:false}).waitFor();};
  await execute('HTTP 200 · ACCEPTED');
  assert.match(await lab.locator('[data-api-result] pre').innerText(),/2026-12-04/);
  await lab.getByLabel('Editable JSON body').fill('{');
  await execute('HTTP 400 · NOT ACCEPTED');
  await lab.getByLabel('API operation').selectOption('meta');
  await lab.getByLabel('Response scenario').selectOption('user');
  await execute('HTTP 200 · NOT ACCEPTED');
  assert.match(await lab.locator('[data-api-result] pre').innerText(),/userErrors/);
  await lab.getByLabel('Response scenario').selectOption('none');
  await execute('HTTP 200 · ACCEPTED');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await lab.locator('.jrv-api-workspace').screenshot({path:'artifacts/logistics-api-qa/'+width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
