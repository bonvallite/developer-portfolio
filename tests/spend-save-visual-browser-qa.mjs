// Public Spend & Save cinematic case-study browser QA.
// Uses fictional basket amounts, local React-only state and no merchant APIs,
// credentials, email delivery, Shopify checkout or Google Analytics events.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.SPEND_SAVE_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/spend-save-visual-browser-qa';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: viewport.name === 'mobile' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const response = await page.goto(baseURL + '/projects/spend-and-save', {
      waitUntil: 'domcontentloaded', timeout: 45000,
    });
    assert.equal(response?.status(), 200, viewport.name + ': portfolio route returns 200');
    await page.locator('.ss-system').waitFor({ state: 'visible' });
    assert.equal(await page.locator('h1').count(), 1, 'One clear case-study H1');
    assert.equal(await page.locator('.ss-hero-journey li').count(), 4,
      viewport.name + ': four distinct stages in the visual hero');
    assert.equal(await page.locator('.ss-system-node').count(), 4,
      viewport.name + ': four selectable architecture stages');
    assert.equal(await page.locator('.ss-system-node[aria-pressed="true"]').count(), 1);

    const map = page.locator('.ss-system');
    await map.locator('.ss-system-node').first().click();
    await map.getByRole('heading', { name: 'One offer. Consistent rules.' }).waitFor();
    await map.getByText('Example thresholds: A$150 gift, A$200 shipping, A$300 final gift.').waitFor();

    await map.locator('.ss-system-node').nth(1).click();
    await map.getByRole('heading', { name: 'Show eligibility. Never insert gifts.' }).waitFor();
    await map.getByText('A$0 is below the first illustrative gift threshold. No gift qualifies yet.').waitFor();

    // The existing shopper continues to use shared, dependency-free public rules.
    const addWagyu = page.getByRole('button', {
      name: 'Add Wagyu Steak to demonstration basket',
    });
    await addWagyu.click();
    await addWagyu.click();
    await page.locator('.ss-cart-total').getByText('A$170').waitFor();
    await map.getByText('A$170 qualifies for the first illustrative gift. Gifts are still absent from the basket.').waitFor();
    assert.equal(await page.locator('.ss-order-row.ss-gift').count(), 0,
      viewport.name + ': the cart cannot directly add complimentary order lines');

    await map.locator('.ss-system-node').nth(2).click();
    await map.getByRole('heading', { name: 'Validate, edit, and commit.' }).waitFor();
    await map.getByText('Awaiting the fictional paid-order event. No gift lines have been added.').waitFor();
    await page.getByRole('button', { name: /Start Flow simulation/ }).click();
    await map.getByText('Simulated workflow step 1 is active. Gift lines are not committed yet.').waitFor();
    // Four next steps end at the order-edit commit (stage 5 of 6).
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /Run next step/ }).click();
    await map.getByText('The simulated order edit is committed; its gift lines can now appear.').waitFor();
    assert.equal(await page.locator('.ss-order-row.ss-gift').count(), 1,
      viewport.name + ': only the first-tier fictional gift appears');
    assert.equal(await page.locator('.ss-email').count(), 0,
      viewport.name + ': no success email before the last step');

    await map.locator('.ss-system-node').nth(3).click();
    await map.getByRole('heading', { name: 'Notify only when the edit succeeds.' }).waitFor();
    await map.getByText('The confirmation remains unavailable until the simulated gift order edit succeeds.').waitFor();
    await page.getByRole('button', { name: /Run next step/ }).click();
    await map.getByText('A confirmation preview is available. No real email has been sent.').waitFor();
    await page.locator('.ss-email').waitFor({ state: 'visible' });
    assert.match(await page.locator('.ss-email').innerText(), /No email was actually sent/);

    // A fictional merchant rule edit changes the map's live values. It does
    // not publish anything to Shopify or update an actual store metaobject.
    await page.getByRole('tab', { name: /02 Merchant/ }).click();
    const firstThreshold = page.getByRole('spinbutton', { name: /First gift threshold/ });
    await firstThreshold.fill('160');
    await map.locator('.ss-system-node').first().click();
    await map.getByText('Example thresholds: A$160 gift, A$200 shipping, A$300 final gift.').waitFor();

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3),
      false, viewport.name + ': no horizontal overflow');
    assert.deepEqual(errors, [], viewport.name + ': no JavaScript errors');

    // Full-page capture after interaction, with the architecture insight
    // open and the viewport reset to the first screen.
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.screenshot({
      path: output + '/' + viewport.name + '.png',
      fullPage: true, animations: 'disabled',
    });
    console.log(viewport.name + ' ' + viewport.width + 'x' + viewport.height +
      ': basket, Flow gate, live map, responsiveness PASSED');
    await context.close();
  }
  console.log('Spend and Save architecture visual browser QA PASSED');
} finally {
  await browser.close();
}
