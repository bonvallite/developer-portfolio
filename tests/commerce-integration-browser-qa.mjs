// Visual and functional QA for the standalone, fictional commerce systems lab.
// No production integration API, customer record, token or email is accessed.
// This is intentionally independent of the homepage and prior case-study route.
// 22 Nov: includes fictional ETA email/SMS timing and later Shopify tracking;
// no real customer message, phone number or store notification is accessed.
// Use exact role names for notification tabs; timeline descriptions also
// contain the term SMS and would otherwise match the same Playwright selector.
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


    // The owner's reported five-minute ETA email/SMS communication is a
    // separate store orchestration step, never an email from worker.js.
    // Verify the typed metafield journey, message gates and fictional copies.
    const messages=page.locator('.cie-communications');
    await messages.waitFor({state:'visible'});
    assert.equal(await messages.locator('.cie-communication-stage').count(),4,
      viewport.name+': four distinct order/communication stages');
    await messages.locator('.cie-communication-stage').nth(0).click();
    await messages.getByText('The Worker has not written delivery metadata yet.').waitFor();
    assert.equal(await messages.locator('.cie-communication-field').count(),0);
    await messages.locator('.cie-communication-stage').nth(1).click();
    await messages.locator('.cie-communication-field').getByText('custom.estimated_delivery_date_iso').waitFor();
    await messages.getByText('Waiting for the five-minute notice').waitFor();
    await messages.locator('.cie-communication-stage').nth(2).click();
    await messages.getByRole('button',{name:'ETA email'}).click();
    await messages.getByRole('heading',{name:'Your estimated delivery date'}).waitFor();
    assert.equal(await messages.locator('.cie-customer-email-tracking').count(),0,
      'No invented tracking link before fulfilment');
    await messages.getByRole('button',{name:'SMS',exact:true}).click();
    await messages.locator('.cie-sms-display').getByText(/Tracking details will follow after fulfilment/).waitFor();
    await messages.locator('.cie-communication-controls').getByRole('checkbox',{name:/Include reported SMS channel/}).uncheck();
    await messages.getByText('SMS disabled or not yet scheduled').waitFor();
    await messages.locator('.cie-communication-controls').getByRole('checkbox',{name:/Include reported SMS channel/}).check();
    await messages.locator('.cie-communication-stage').nth(3).click();
    await messages.getByRole('button',{name:'Shipping email'}).click();
    await messages.getByRole('heading',{name:'Your order is on the way'}).waitFor();
    await messages.getByText(/Tracking reference: DEMO-TRACK-041/).waitFor();
    await messages.locator('.cie-communication-controls').getByRole('checkbox',{name:/Tracking reference available/}).uncheck();
    await messages.getByText('Tracking link not yet available').waitFor();
    assert.equal(await messages.getByText(/Tracking reference: DEMO-TRACK-041/).count(),0,
      'No fabricated tracking number before carrier data exists');
    await messages.locator('.cie-communication-controls').getByRole('checkbox',{name:/GraphQL ETA metafield write succeeds/}).uncheck();
    await messages.getByText('The ETA write was not confirmed. No estimated date is shown.').waitFor();
    assert.equal(await messages.locator('.cie-communication-field').count(),0,
      'No metafields after failed GraphQL write');
    await messages.locator('.cie-communication-stage').nth(2).click();
    await messages.getByRole('button',{name:'ETA email'}).click();
    await messages.getByText('ETA write failed').first().waitFor();
    await messages.locator('.cie-communication-controls').getByRole('checkbox',{name:/GraphQL ETA metafield write succeeds/}).check();
    await messages.getByRole('heading',{name:'Your estimated delivery date'}).waitFor();
    assert.match(await messages.locator('.cie-customer-email').innerText(),/DEMO-W/,
      'Only fictional route identifiers shown');

    // Public-safe examples explain the order field types and that Worker
    // does not implement the reported store-side notification timing.
    await page.locator('.cie-code-tabs').getByRole('button',{name:'ETA order metafields'}).click();
    await page.locator('.cie-editor-body').getByText(/estimated_delivery_date_iso/).waitFor();
    await page.locator('.cie-code-tabs').getByRole('button',{name:'Customer message gating'}).click();
    await page.locator('.cie-editor-body').getByText(/minutes >= 5/).waitFor();

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
