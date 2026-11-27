
/** Local synthetic regression: block external JS bundles to observe initial
 * server markup and the synchronous visibility bootstrap before hydration.
 * Compare normal first and returning visits, and never opt in or send data. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const url='http://127.0.0.1:3100/projects/commerce-integration-engineering';
const consentKey='jrv-optional-analytics-consent-v1';
try{
 for(const width of [320,390,768]){
  for(const returning of [false,true]){
   const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
   if(returning)await ctx.addInitScript(key=>localStorage.setItem(key,'rejected'),consentKey);
   await ctx.route(/\/_next\/static\/.*\.js(?:\?.*)?$/,r=>r.abort());
   const page=await ctx.newPage();
   await page.goto(url,{waitUntil:'load'});
   const panel=page.locator('#jrv-consent-panel');
   assert.equal(await panel.count(),1,'SSR notice exists');
   assert.equal(await panel.isVisible(),!returning,'Initial visibility respects stored decision before hydration');
   assert.equal(await page.evaluate(()=>Boolean(window.dataLayer)),false);
   if(!returning)assert.ok(await page.evaluate(()=>document.querySelector('#jrv-consent-panel').getBoundingClientRect().bottom<=document.querySelector('main').getBoundingClientRect().top+2));
   await ctx.close();
  }
 }
 for(const returning of [false,true]){
   const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   await ctx.addInitScript(({key,returning})=>{
     if(returning)localStorage.setItem(key,'rejected');
     window.__consentShift={sum:0,sources:[]};
     new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){
      window.__consentShift.sum+=e.value;window.__consentShift.sources.push({value:e.value,tags:e.sources.map(s=>s.node?.nodeName||null)});
     }}).observe({type:'layout-shift',buffered:true});
   },{key:consentKey,returning});
   const page=await ctx.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(/googletagmanager\.com|clarity\.ms|vercel-insights\.com|\/_vercel\/insights/i.test(r.url()))requests.push('optional vendor');});
   await page.goto(url,{waitUntil:'load'});
   if(returning)await page.locator('#jrv-consent-panel').waitFor({state:'detached'});
   else await page.getByRole('button',{name:'Reject optional'}).waitFor({state:'visible'});
   await page.waitForTimeout(1200);
   const shift=await page.evaluate(()=>window.__consentShift);
   console.log('Consent first-paint sample: '+JSON.stringify({returning,...shift}));
   assert.ok(shift.sum<=.1,'Local mobile layout-shift target exceeded: '+shift.sum);
   assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
   await ctx.close();
 }
}finally{await browser.close();}
