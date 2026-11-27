
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-recovery-qa',{recursive:true});
try{
 for(const width of [1366,390]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:width===390?'reduce':'no-preference'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'domcontentloaded'});
  const lab=page.locator('.jrv-recovery');
  const next=lab.getByRole('button',{name:'Process next event'}),advance=lab.getByRole('button',{name:'Advance 30 seconds'});
  await next.click();await next.click();
  assert.match(await lab.getByRole('status').innerText(),/WAITING/);assert.ok(await next.isDisabled());
  await advance.click();assert.match(await lab.getByRole('status').innerText(),/COMPLETE/);
  await lab.getByLabel('Incident scenario').selectOption('exhausted');await next.click();await next.click();
  for(let i=0;i<3;i++)await advance.click();
  assert.match(await lab.getByRole('status').innerText(),/DEAD/);
  await lab.getByRole('button',{name:'Restore upstream'}).click();
  await lab.getByRole('button',{name:'Administrative replay'}).click();
  assert.match(await lab.getByRole('status').innerText(),/COMPLETE/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3));
  await lab.locator('.jrv-recovery-grid').first().screenshot({path:'artifacts/logistics-recovery-qa/'+width+'.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}
