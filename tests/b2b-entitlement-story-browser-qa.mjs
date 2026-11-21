// 21 November 2026: real browser testing of the JRV fictional B2B showcase.
// Never connects to Shopify, company accounts, catalogues or checkout. Tests
// verify that hero market selection, architecture, entitlement and price lab
// respond to one shared React state; also capture three viewport screenshots.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.CASE_STUDY_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/b2b-entitlement-story-qa';
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
      deviceScaleFactor: 1,
      reducedMotion: viewport.name === 'mobile' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(baseURL + '/b2b-modernisation', {
      waitUntil: 'domcontentloaded', timeout: 45000,
    });
    assert.equal(response?.status(), 200, viewport.name + ': B2B page HTTP 200');
    assert.equal(await page.locator('h1').count(), 1, 'Exactly one H1');

    const hero = page.getByRole('group', { name: 'Interactive fictional company catalogue pricing preview' });
    const heroControls = hero.getByRole('group', { name: 'Choose hero pricing context' });
    assert.equal(await heroControls.getByRole('button').count(), 4,
      viewport.name + ': four selectable fictional markets');
    const inspector = page.getByLabel('Interactive Shopify B2B architecture inspector');
    await inspector.waitFor({ state: 'visible' });
    assert.equal(await inspector.locator('.cb2b-system-stages button').count(), 4,
      viewport.name + ': four accessible architecture stages');

    // Hero selection controls the same state that drives catalogue resolution,
    // sample pricing and the new inspector. No company ID or API is involved.
    await heroControls.getByRole('button', { name: 'B2B 02' }).click();
    assert.equal(await heroControls.getByRole('button', { name: 'B2B 02' }).getAttribute('aria-pressed'),
      'true', viewport.name + ': selected hero market');
    await hero.getByText('A$104.00').first().waitFor();
    await inspector.getByText('Illustratively entitled buyer').waitFor();
    await inspector.getByText('Wholesale Tier 2 selected with fictional company entitlement. Catalogue 3 provides the example price.').waitFor();
    await inspector.getByText('A$1,248.00').waitFor();
    await page.locator('.cb2b-order-summary').getByText('A$1,248.00').waitFor();

    // A wholesale selection alone is not an entitlement; both inspector
    // and original pricing lab must visibly revert to fictional retail.
    await inspector.getByRole('button', { name: 'No company access (demo)' }).click();
    await hero.getByText('Not approved').waitFor();
    await hero.getByText('A$120.00').first().waitFor();
    await inspector.getByText('Buyer without approved company access').waitFor();
    await inspector.getByText('A$0.00').waitFor();
    await page.getByText('Retail fallback · demo', { exact: true }).waitFor();
    assert.equal(await page.locator('.cb2b-eligibility input').isChecked(), false,
      viewport.name + ': original price-lab checkbox shares eligibility state');
    await inspector.getByRole('button', { name: 'Approved location (demo)' }).click();
    await inspector.getByText('Illustratively entitled buyer').waitFor();
    await inspector.getByText('A$192.00').waitFor();

    const inspectorStages = inspector.locator('.cb2b-system-stages button');
    await inspectorStages.nth(0).click();
    await inspector.getByRole('heading', { name: 'An application is not an approval.' }).waitFor();
    await inspector.getByText('Do not assign company pricing here.', { exact: false }).waitFor();
    await inspectorStages.nth(3).focus();
    await page.keyboard.press('Enter');
    assert.equal(await inspectorStages.nth(3).getAttribute('aria-pressed'), 'true',
      viewport.name + ': keyboard can select checkout boundary');
    await inspector.getByRole('heading', { name: 'Checkout must confirm the final amount.' }).waitFor();

    // Quantity lives in the existing slider; changing it updates the new
    // technical inspector instead of an independent, misleading sample.
    const qty = page.locator('#cb2b-quantity');
    await qty.focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await qty.inputValue(), '13');
    await inspector.getByText('A$1,352.00').waitFor();
    await inspector.getByText('A$208.00').waitFor();
    await page.locator('.cb2b-order-summary').getByText('A$1,352.00').waitFor();

    // Preserve old educational journey, separate evidence series and
    // explicit hypothetical growth disclosure without asserting causal uplift.
    await page.getByRole('group', { name: 'B2B buyer journey steps' }).getByRole('button', { name: /Assign/ }).click();
    await page.getByText('Company and market assigned').waitFor();
    await page.getByRole('group', { name: 'Historical sales view' }).getByRole('button', { name: 'Modelled growth' }).click();
    await page.getByText('Illustrative growth after July').waitFor();
    await page.getByText('hypothetical, not actual sales.', { exact: false }).waitFor();

    // Leave optional analytics off. The screenshot should show the portfolio,
    // not an obstructing cookie panel.
    const consent = page.locator('.jrv-consent');
    await consent.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3);
    assert.equal(overflow, false, viewport.name + ': no horizontal overflow');
    assert.deepEqual(errors, [], viewport.name + ': no JS exceptions');

    // Preserve both an engaged B2B context and the original first-screen
    // hierarchy in the browser capture.
    await inspectorStages.nth(2).click();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.screenshot({
      path: output + '/' + viewport.name + '.png',
      fullPage: true, animations: 'disabled',
    });
    console.log('B2B entitlement studio ' + viewport.name + ' (' +
      viewport.width + 'x' + viewport.height + '): PASSED');
    await context.close();
  }
  console.log('B2B entitlement storytelling browser QA PASSED');
} finally {
  await browser.close();
}
