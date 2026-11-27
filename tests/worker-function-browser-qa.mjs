
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/worker-function-qa',{recursive:true});
try{
 for(const viewport of [{width:1366,height:850},{width:390,height:844}]){
  const context=await browser.newContext({viewport,reducedMotion:viewport.width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-function-lab');
  await lab.getByRole('button',{name:/normalisePostcode/}).click();
  await lab.getByRole('button',{name:'Run function',exact:true}).click();
  assert.match(await lab.locator('[data-function-result] pre').innerText(),/0800/);
  await lab.getByRole('button',{name:'Load edge case'}).click();
  await lab.getByRole('button',{name:'Run function',exact:true}).click();
  assert.match(await lab.getByRole('status').innerText(),/validation error/);
  await lab.getByRole('button',{name:/inspectWriteResponse/}).click();
  await lab.getByRole('button',{name:'Load edge case'}).click();
  await lab.getByRole('button',{name:'Run function',exact:true}).click();
  assert.match(await lab.locator('[data-function-result] pre').innerText(),/MUTATION_USER_ERRORS/);
  await lab.getByLabel('Editable JSON input').fill('{');
  await lab.getByRole('button',{name:'Run function',exact:true}).click();
  assert.match(await lab.getByRole('status').innerText(),/validation error/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await lab.locator('.jrv-function-main').screenshot({path:'artifacts/worker-function-qa/'+viewport.width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
