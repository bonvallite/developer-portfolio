// End-to-end browser QA for the JRV cinematic homepage rebuild.
// Runs against a locally built Next.js app; no live client APIs or credentials.
// Screenshots are review artefacts, not evidence of real performance metrics.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.HOMEPAGE_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/homepage-browser-qa';
const viewports = [
  { name: 'wide', width: 1600, height: 960 },
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const summary = [];

try {
  for (const size of viewports) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      reducedMotion: size.name === 'mobile' ? 'reduce' : 'no-preference',
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const failures = [];
    const trackingRequests = [];
    page.on('pageerror', err => failures.push(err.message));
    page.on('request', req => {
      if (/googletagmanager\.com|clarity\.ms\/tag|vercel-insights\.com|\/_vercel\/insights/.test(req.url())) {
        trackingRequests.push(req.url());
      }
    });

    const response = await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    assert.equal(response?.status(), 200, size.name + ': homepage HTTP 200');
    await page.getByRole('heading', { name: /Build better commerce/ }).waitFor();
    await page.locator('.jrv2-journey-tab').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('h1').count(), 1, 'One homepage H1');
    assert.equal(await page.locator('.jrv2-case').count(), 4, 'Four case-study stories');
    assert.equal(await page.locator('.jrv2-service').count(), 4, 'Four linked services');
    assert.ok(await page.locator('.jrv2-hero-actions a').count() >= 2, 'Prominent hero actions');
    assert.equal(await page.locator('.jrv2-console').count(), 1, 'Visual commerce engine');

    const consent = page.locator('.jrv-consent');
    await consent.waitFor({ state: 'visible' });
    // No optional third-party tracking may start in a fresh browser before consent.
    assert.deepEqual(trackingRequests, [], size.name + ': optional tracking requested before consent');
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });
    assert.deepEqual(trackingRequests, [], size.name + ': tracking requested after rejection');

    await page.locator('.jrv2-journey-tab').nth(1).click();
    await page.getByText('Make complex feel clear.').waitFor();
    assert.equal(await page.locator('.jrv2-journey-tab.is-active').count(), 1);

    await page.getByRole('button', { name: 'I am hiring' }).click();
    await page.locator('#jrv2-project-brief').fill('Fictional browser QA test only.');
    const emailHref = await page.getByRole('link', { name: /Open email draft/ }).getAttribute('href');
    assert.ok(emailHref?.startsWith('mailto:hello@jrvallite.com?'), 'No third-party lead form');
    assert.ok(emailHref?.includes('Fictional%20browser%20QA%20test%20only.'), 'Enquiry stays in local email draft');

    if (size.width < 970) {
      const menu = page.locator('.jrv2-mobile-menu');
      await menu.locator('summary').click();
      assert.equal(await menu.getAttribute('open'), '', 'Mobile navigation opens');
      await menu.locator('summary').click();
    }

    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3);
    assert.equal(horizontalOverflow, false, size.name + ': horizontal overflow');

    // Keep user-facing screenshots at their initial interactive state.
    await page.locator('.jrv2-journey-tab').first().click();
    await page.getByRole('button', { name: 'I have a Shopify project' }).click();
    await page.locator('#jrv2-project-brief').fill('');
    await page.screenshot({ path: output + '/' + size.name + '.png', fullPage: true, animations: 'disabled' });
    assert.deepEqual(failures, [], size.name + ': JavaScript exceptions');
    summary.push(size.name + ' ' + size.width + 'x' + size.height + ': passed');

    await context.close();
  }
  console.log('Cinematic homepage browser QA PASSED:\n' + summary.join('\n'));
} finally {
  await browser.close();
}
