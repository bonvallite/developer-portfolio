// Visual, keyboard and state-machine regression for the public CartonCloud
// showcase. Only fictional examples are interacted with. Never submit
// merchant webhooks, call Shopify/CartonCloud, or send tracking data.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.INTEGRATION_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/cartoncloud-event-studio-qa';
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
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(baseURL + '/cartoncloud-integration', {
      waitUntil: 'domcontentloaded', timeout: 45000,
    });
    assert.equal(response?.status(), 200, viewport.name + ': case study must return HTTP 200');
    const studio = page.locator('.jrv-integration-lab');
    await studio.waitFor({ state: 'visible' });
    assert.equal(await page.locator('h1').count(), 1, 'A single case-study heading');
    assert.equal(await page.getByRole('link', { name: 'Experience', exact: true }).isVisible(), true,
      viewport.name + ': professional experience navigation must remain visible');
    assert.equal(await page.locator('.cc-contributions article').count(), 2,
      'Separate, clearly described app and API integration contributions');
    assert.equal(await studio.locator('.jrv-integration-lab__systems li').count(), 4,
      'Four conceptual system boundaries');
    assert.equal(await studio.locator('.jrv-integration-lab__timeline button').count(), 6,
      'Six processing stages');
    assert.equal(await studio.getByRole('button', { name: 'Normal path' }).getAttribute('aria-pressed'), 'true');
    await studio.getByRole('heading', { name: 'Shopify event received' }).waitFor();

    // Keyboard entry must activate the alternate path, not just mouse clicks.
    const invalid = studio.getByRole('button', { name: 'Invalid webhook' });
    await invalid.focus();
    await page.keyboard.press('Enter');
    assert.equal(await invalid.getAttribute('aria-pressed'), 'true',
      viewport.name + ': keyboard scenario selection works');
    await studio.getByRole('button', { name: 'Next stage' }).click();
    await studio.getByRole('heading', { name: 'Verification rejected the event' }).waitFor();
    assert.equal(await studio.locator('.jrv-integration-lab__timeline button:disabled').count(), 4,
      viewport.name + ': invalid sender blocks downstream processing');
    await studio.getByRole('button', { name: 'Inspect safe recovery' }).click();
    await studio.getByText('Do not replay an unverified payload', { exact: false }).waitFor();
    assert.equal(await studio.getByText('No downstream write or success notification is represented.').count(), 1);

    // Failed Shopify writes are not allowed to advance into false success.
    await studio.getByRole('button', { name: 'Write rejected' }).click();
    for (let i = 0; i < 4; i++) await studio.getByRole('button', { name: 'Next stage' }).click();
    await studio.getByRole('heading', { name: 'Shopify write did not succeed' }).waitFor();
    assert.equal(await studio.locator('.jrv-integration-lab__timeline button:disabled').count(), 1,
      viewport.name + ': failed write blocks diagnostics-as-success');
    await studio.getByRole('button', { name: 'Inspect safe recovery' }).click();
    await studio.getByText('Use bounded, authorised retry only when safe', { exact: false }).waitFor();

    // Return to normal and navigate the diagram directly to its final step.
    await studio.getByRole('button', { name: 'Normal path' }).click();
    const last = studio.locator('.jrv-integration-lab__timeline button').last();
    await last.click();
    await studio.getByRole('heading', { name: 'Observe and recover' }).waitFor();
    await studio.getByText('ILLUSTRATIVE PATH COMPLETE').waitFor();
    await studio.getByRole('button', { name: 'Reset trace' }).click();
    await studio.getByRole('heading', { name: 'Shopify event received' }).waitFor();

    // Keep the privacy opt-out; the screenshots should showcase the actual
    // page instead of a cookie panel obscuring the integration diagram.
    const consent = page.locator('.jrv-consent');
    await consent.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3),
      false, viewport.name + ': no horizontal overflow');
    assert.deepEqual(errors, [], viewport.name + ': no client JavaScript errors');
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.screenshot({
      path: output + '/' + viewport.name + '.png',
      fullPage: true,
      animations: 'disabled',
    });
    console.log(viewport.name + ' ' + viewport.width + 'x' + viewport.height +
      ': normal event, blocked failures, recovery and responsive layout PASSED');
    await context.close();
  }
  console.log('CartonCloud event studio browser QA PASSED');
} finally {
  await browser.close();
}
