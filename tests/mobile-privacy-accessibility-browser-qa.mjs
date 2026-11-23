// First-visit consent overlay, focus and contact access at mobile/tablet/desktop.
// Requests to optional vendors are intercepted so this synthetic test cannot
// transmit analytics, messages, visitor-entered text or any lead to a provider.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.PRIVACY_LAYOUT_BASE_URL || 'http://127.0.0.1:3100';
const artifactDir = 'artifacts/privacy-accessibility-qa';
const consentKey = 'jrv-optional-analytics-consent-v1';
const sizes = [
  { name: 'small-mobile', width: 320, height: 700 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
];

await mkdir(artifactDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const size of sizes) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      reducedMotion: 'reduce',
    });
    const optionalRequests = [];
    await context.route(/googletagmanager\.com|clarity\.ms|vercel-insights\.com|\/_vercel\/insights/, route => {
      optionalRequests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + '/shopify-developer', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    assert.equal(response?.status(), 200, size.name + ': service route returns HTTP 200');
    const region = page.getByRole('region', { name: 'Your privacy. Your choice.' });
    await region.waitFor({ state: 'visible' });
    assert.equal(await region.getAttribute('aria-describedby'), 'jrv-consent-description');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), consentKey), null,
      size.name + ': first visit is unresolved');
    assert.deepEqual(optionalRequests, [], size.name + ': no optional vendor requests on initial page load');

    // The mobile panel must be a normal-flow sibling BEFORE the main content,
    // not fixed on top of hiring or project CTAs. Desktop retains the original
    // wide floating treatment, where space allows.
    const metrics = await page.evaluate(() => {
      const panel = document.querySelector('#jrv-consent-panel');
      const main = document.querySelector('main');
      const rect = panel.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const buttons = [...panel.querySelectorAll('.jrv-consent-actions button')].map(el => {
        const bounds = el.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      });
      return {
        position: getComputedStyle(panel).position,
        panelTop: rect.top, panelBottom: rect.bottom,
        left: rect.left, right: rect.right,
        mainTop: mainRect.top,
        viewportWidth: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        buttons,
      };
    });
    for (const button of metrics.buttons) {
      assert.ok(button.height >= 44 && button.width >= 44, size.name + ': readable consent button targets');
    }
    if (size.width <= 800) {
      assert.equal(metrics.position, 'relative', size.name + ': mobile consent is in normal flow');
      assert.ok(metrics.panelTop >= 0 && metrics.panelBottom <= metrics.mainTop + 2,
        size.name + ': notice must finish before main content begins');
      assert.ok(metrics.left >= 0 && metrics.right <= metrics.viewportWidth + 1,
        size.name + ': privacy notice fits within the device width');
    } else {
      assert.equal(metrics.position, 'fixed', size.name + ': desktop retains the fixed notice');
    }
    assert.ok(metrics.scrollWidth <= size.width + 2,
      size.name + ': no horizontal overflow on first visit');
    await page.screenshot({
      path: artifactDir + '/' + size.name + '-first-visit.png',
      animations: 'disabled',
    });

    // Escape dismisses the initial panel but NEVER records acceptance or
    // rejection. The small persistent control reopens it via keyboard, and
    // focus moves to the heading. Choosing Reject returns focus to settings.
    await region.getByRole('button', { name: 'Reject optional' }).focus();
    await page.keyboard.press('Escape');
    await region.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(key => localStorage.getItem(key), consentKey), null,
      size.name + ': Escape does not set a consent value');
    const settings = page.getByRole('button', { name: 'Change analytics privacy choices' });
    assert.equal(await settings.getAttribute('aria-expanded'), 'false');
    assert.equal(await settings.getAttribute('aria-controls'), 'jrv-consent-panel');
    await settings.focus();
    await page.keyboard.press('Enter');
    await region.waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.activeElement?.id === 'jrv-consent-title');
    assert.equal(await settings.getAttribute('aria-expanded'), 'true');
    await region.getByRole('button', { name: 'Reject optional' }).click();
    await region.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(key => localStorage.getItem(key), consentKey), 'rejected',
      size.name + ': rejection is stored only in browser localStorage');
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Change analytics privacy choices');
    assert.deepEqual(optionalRequests, [], size.name + ': no optional analytics requested after rejection');

    // A fixed small privacy-settings pill must not block a focused hiring CTA
    // in the contact section. The contact remains usable at narrow widths.
    const hiring = page.locator('.service-bottom-cta .jrv-svc-contact-routes a[data-jrv-intent="hiring"]');
    await hiring.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'nearest' }));
    const spatial = await page.evaluate(() => {
      const hiring = document.querySelector('.service-bottom-cta .jrv-svc-contact-routes a[data-jrv-intent="hiring"]');
      const settings = document.querySelector('.jrv-consent-settings');
      const h = hiring.getBoundingClientRect();
      const s = settings.getBoundingClientRect();
      const overlap = h.left < s.right && h.right > s.left && h.top < s.bottom && h.bottom > s.top;
      return { overlap, visible: h.top >= 0 && h.bottom <= innerHeight, hitHeight: h.height };
    });
    assert.equal(spatial.overlap, false, size.name + ': settings must not overlap hiring CTA');
    assert.ok(spatial.visible && spatial.hitHeight >= 44, size.name + ': hiring CTA remains accessible');
    if (size.width <= 800) {
      await page.locator('.service-bottom-cta').screenshot({
        path: artifactDir + '/' + size.name + '-contact-after-rejection.png',
        animations: 'disabled',
      });
    }

    await page.goto(base + '/?intent=hiring#contact', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.jrv2-lead-choice[aria-pressed="true"]')?.textContent?.includes('I am hiring'));
    assert.equal(await page.locator('#jrv-consent-panel').count(), 0,
      size.name + ': stored rejection must not reopen first-visit banner');
    assert.ok((await page.getByRole('link', { name: /Open email draft/ }).getAttribute('href'))?.includes('mailto:'),
      size.name + ': hiring draft remains usable');
    assert.deepEqual(optionalRequests, [], size.name + ': no optional trackers across the hiring route');
    assert.deepEqual(errors, [], size.name + ': no browser exceptions');
    console.log(size.name + ': first-visit privacy, keyboard, consent and contact QA passed');
    await context.close();
  }
  console.log('Mobile privacy and contact accessibility browser QA PASSED');
} finally {
  await browser.close();
}
