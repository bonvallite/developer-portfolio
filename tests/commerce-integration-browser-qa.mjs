// Visual and functional QA for the standalone, fictional commerce systems lab.
// No production integration API, customer record, token or email is accessed.
// This is intentionally independent of the homepage and prior case-study route.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.COMMERCE_LAB_BASE_URL || 'http://127.0.0.1:3100';
const path = '/projects/commerce-integration-engineering';
const output = 'artifacts/commerce-integration-lab';
const viewports = [
  { name:'desktop', width:1440, height:900 },
  { name:'tablet', width:768, height:1024 },
  { name:'mobile', width:390, height:844 }
];
await mkdir(output,{recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport:{width:viewport.width,height:viewport.height},
      reducedMotion:viewport.name==='mobile'?'reduce':'no-preference'
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error=>errors.push(error.message));
    const response = await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:45000});
    assert.equal(response?.status(),200,viewport.name+' route returns 200');
    const consent = page.locator('.jrv-consent');
    if(await consent.isVisible()){
      await page.getByRole('button',{name:'Reject optional'}).click();
    }
    await page.locator('.cie-network').waitFor({state:'visible'});
    assert.equal(await page.locator('h1').count(),1,'One H1');
    assert.equal(await page.locator('.cie-node').count(),6,'Six diagram nodes');
    assert.equal(await page.locator('.cie-tab').count(),3,'Three event journeys');
    await page.locator('.cie-tab').nth(2).click();
    await page.getByRole('heading',{name:'Carrier emits tracking milestone'}).waitFor();
    await page.locator('.cie-event-track-item').nth(3).click();
    await page.getByRole('heading',{name:'Custom app authorises updates'}).waitFor();

    await page.locator('#cie-zone').selectOption('sa');
    await page.locator('.cie-result-highlight').getByText('Tue, 1 Dec 2026').waitFor();
    await page.getByRole('checkbox',{name:'Inject fictional closure on 26 Nov 2026'}).check();
    await page.locator('.cie-result-highlight').getByText('Tue, 8 Dec 2026').waitFor();
    await page.getByRole('checkbox',{name:'Try non-shipping items only'}).check();
    await page.locator('.cie-weight-breakdown').getByText(/Digital\/non-shipping items/).waitFor();

    await page.locator('.cie-trace-choices button').last().click();
    await page.locator('.cie-trace-alert').getByText(/Invalid authentication should stop/).waitFor();
    assert.equal(await page.locator('.cie-event-stepper button:not(:disabled)').count(),2,
      'Invalid authentication blocks downstream stages');
    await page.locator('.cie-oauth-rail button').nth(3).click();
    await page.locator('.cie-kv-window').getByText(/access_token/).waitFor();
    await page.locator('.cie-code-tabs button').nth(2).click();
    await page.locator('.cie-editor-body').getByText(/TOKEN_STORE/).waitFor();


    // Both new features must work without accessing Shopify or CartonCloud.
    const zoneOptions=page.locator('.cie-mile-option');
    assert.equal(await zoneOptions.count(),3,'Three fictional Queensland subzones');
    await zoneOptions.nth(1).click();
    await page.locator('.cie-mile-date').getByText('Wed, 25 Nov 2026').waitFor();
    await zoneOptions.nth(2).click();
    await page.locator('.cie-mile-date').getByText('Thu, 26 Nov 2026').waitFor();
    await page.locator('.cie-lastmile').getByRole('checkbox',{name:/Fictional closure/}).check();
    await page.locator('.cie-mile-date').getByText('Mon, 30 Nov 2026').waitFor();
    await page.locator('.cie-lastmile').getByText(/already included/).waitFor();

    const writeback=page.locator('.cie-writeback');
    await writeback.locator('#cie-write-status').selectOption('DELIVERED');
    for(let i=0;i<6;i++) await writeback.getByRole('button',{name:/Start simulation|Next write-back step/}).click();
    await writeback.locator('.cie-writeback-fields').getByText('delivered_at').waitFor();
    await writeback.getByText('Requested via Shopify').waitFor();
    await writeback.getByText('Not proof of email delivery').waitFor();

    await writeback.locator('#cie-write-scenario').selectOption('no-url');
    for(let i=0;i<6;i++) await writeback.getByRole('button',{name:/Start simulation|Next write-back step/}).click();
    await writeback.getByText('Not supplied',{exact:true}).waitFor();

    await writeback.locator('#cie-write-scenario').selectOption('rejected');
    await writeback.getByRole('button',{name:'Start simulation'}).click();
    assert.equal(await writeback.getByRole('button',{name:/Next write-back step/}).isDisabled(),true);
    await writeback.getByText(/No order update simulated yet/).waitFor();

    await writeback.locator('#cie-write-scenario').selectOption('api-error');
    for(let i=0;i<3;i++) await writeback.getByRole('button',{name:/Start simulation|Next write-back step/}).click();
    await writeback.getByText('USER_ERRORS').waitFor();
    await writeback.getByText('Not requested',{exact:true}).waitFor();

    await writeback.locator('#cie-write-scenario').selectOption('replay');
    for(let i=0;i<5;i++) await writeback.getByRole('button',{name:/Start simulation|Next write-back step/}).click();
    await writeback.locator('.cie-writeback-fields').getByText('delivery_status_raw').waitFor();
    await writeback.getByText(/does not guarantee complete webhook deduplication/).first().waitFor();

    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3),
      false,viewport.name+' no horizontal overflow');
    assert.deepEqual(errors,[],viewport.name+' no browser JS errors');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:output+'/'+viewport.name+'.png',fullPage:true,animations:'disabled'});
    console.log(viewport.name+': architecture, calculation, auth, status, code and responsive QA PASSED');
    await context.close();
  }
} finally {
  await browser.close();
}
