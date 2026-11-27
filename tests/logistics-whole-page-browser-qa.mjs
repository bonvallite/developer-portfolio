
/** Whole-page navigation and local-only network boundary. Dedicated module
 * suites separately exercise the functional and animation branches. */
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts/logistics-whole-page-qa',{recursive:true});
try{
 for(const width of [1366,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:3100/'))external.push(new URL(r.url()).hostname);});
  const response=await page.goto('http://127.0.0.1:3100/projects/commerce-integration-engineering',{waitUntil:'load'});
  assert.equal(response?.status(),200);
  const nav=page.getByRole('navigation',{name:'Engineering studio chapters'});
  const links=nav.getByRole('link');
  assert.equal(await links.count(),9);
  for(const link of await links.all()){
   const href=await link.getAttribute('href');
   assert.ok(href?.startsWith('#'));assert.equal(await page.locator(href).count(),1);
  }
  assert.ok(await nav.isVisible());
  await nav.screenshot({path:'artifacts/logistics-whole-page-qa/'+width+'-index.png',animations:'disabled'});
  const destination=nav.getByRole('link',{name:/Incident recovery/});
  await destination.focus();await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash,'#recovery-lab');
  const lab=page.locator('.jrv-recovery');
  await lab.getByRole('button',{name:'Process next event'}).click();
  assert.match(await lab.getByRole('status').innerText(),/COMPLETE/);
  await lab.getByRole('button',{name:'Process next event'}).click();
  assert.match(await lab.getByRole('status').innerText(),/WAITING/);
  await lab.getByRole('button',{name:'Advance 30 seconds'}).click();
  assert.match(await lab.getByRole('status').innerText(),/COMPLETE/);
  assert.equal(await page.locator('h1').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3),'viewport overflow at '+width);
  assert.deepEqual(errors,[]);
  assert.deepEqual(external.filter(host=>/shopify|cartoncloud|nager|clarity|googletagmanager|vercel-insights/i.test(host)),[]);
  await context.close();
 }
}finally{await browser.close();}
