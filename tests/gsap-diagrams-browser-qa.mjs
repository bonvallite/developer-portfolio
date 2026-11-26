// Real-Chrome project diagram QA for explicit playback, failure stops,
// responsive rendering, and motion preferences. All events remain fictional.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.DIAGRAM_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/gsap-diagram-qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const sample of [
    { name: 'desktop', width: 1366, height: 768, motion: 'no-preference' },
    { name: 'mobile-reduced', width: 390, height: 844, motion: 'reduce' },
  ]) {
    const context = await browser.newContext({
      viewport: { width: sample.width, height: sample.height },
      reducedMotion: sample.motion,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    async function visit(path) {
      const response = await page.goto(base + path, {
        waitUntil: 'domcontentloaded', timeout: 45000,
      });
      assert.equal(response?.status(), 200, path + ' responds HTTP 200');
      assert.equal(await page.locator('h1').count(), 1, 'One case-study H1');
    }

    // Shipping is a static SSR diagram with a visible optional replay.
    await visit('/shipping-integration');
    const shipping = page.locator('.shipping-story-architecture');
    assert.equal(await shipping.locator('.shipping-story-system').count(), 3);
    assert.equal(await shipping.locator('.shipping-story-result').count(), 1);
    assert.match(await shipping.innerText(), /Conceptual responsibility map/);
    const replay = shipping.getByRole('button', { name: 'Replay the rate decision' });
    assert.equal(await replay.isVisible(), sample.motion === 'no-preference');
    if (sample.motion === 'no-preference') {
      await replay.click();
      // This verifies actual transform activity, not just an installed npm package.
      await page.waitForFunction(() => {
        const card = document.querySelector('.shipping-story-system');
        return !!card && getComputedStyle(card).transform !== 'none';
      }, null, { timeout: 1800 });
    }
    await shipping.screenshot({ path: output + '/' + sample.name + '-shipping.png', animations: 'disabled' });

    // The Shopify systems architecture highlights its selected event on Next
    // or on an explicitly started/pauseable fictional walkthrough.
    await visit('/projects/commerce-integration-engineering');
    const engineering = page.locator('.cie-arch-lab');
    const playFlow = engineering.locator('.cie-play-button');
    assert.equal(await playFlow.isVisible(), sample.motion === 'no-preference');
    if (sample.motion === 'no-preference') {
      await playFlow.click();
      await page.waitForFunction(() =>
        document.querySelectorAll('.cie-event-track-item')[1]?.getAttribute('aria-pressed') === 'true',
      null, { timeout: 3500 });
      await playFlow.click();
      assert.equal(await playFlow.getAttribute('aria-pressed'), 'false');
    } else {
      await engineering.locator('.cie-event-track-item').nth(1).click();
    }
    assert.equal(await engineering.locator('.cie-event-track-item[aria-pressed="true"]').count(), 1);
    await engineering.screenshot({ path: output + '/' + sample.name + '-engineering.png', animations: 'disabled' });

    // A rejected webhook must STOP at signature verification. Auto-play must
    // not traverse the four disabled downstream nodes or claim a write.
    await visit('/cartoncloud-integration');
    const studio = page.locator('.jrv-integration-lab');
    await studio.getByRole('button', { name: 'Invalid webhook' }).click();
    const playTrace = studio.locator('button.is-play');
    assert.equal(await playTrace.isVisible(), sample.motion === 'no-preference');
    if (sample.motion === 'no-preference') {
      await playTrace.click();
      await page.waitForFunction(() =>
        document.querySelectorAll('.jrv-integration-lab__timeline button')[1]?.getAttribute('aria-pressed') === 'true',
      null, { timeout: 3500 });
      await page.waitForFunction(() =>
        document.querySelector('.jrv-integration-lab__actions button.is-play')?.getAttribute('aria-pressed') === 'false',
      null, { timeout: 3500 });
    } else {
      await studio.getByRole('button', { name: /Next stage/ }).click();
    }
    assert.equal(await studio.locator('.jrv-integration-lab__timeline button.is-stopped').count(), 1);
    assert.equal(await studio.locator('.jrv-integration-lab__timeline button:disabled').count(), 4);
    assert.match(await studio.locator('.jrv-integration-lab__detail').innerText(), /No real API write or notification occurred/);
    await studio.screenshot({ path: output + '/' + sample.name + '-cartoncloud.png', animations: 'disabled' });

    // Spend & Save remains an interactive but fictional state inspector.
    await visit('/projects/spend-and-save');
    const spend = page.locator('.ss-system');
    await spend.locator('.ss-system-node').first().click();
    assert.equal(await spend.locator('.ss-system-node[aria-pressed="true"]').count(), 1);
    assert.match(await spend.locator('.ss-system-explainer').innerText(), /One offer. Consistent rules/);
    await spend.screenshot({ path: output + '/' + sample.name + '-spend-save.png', animations: 'disabled' });

    assert.ok(await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth + 3), 'No mobile overflow');
    assert.deepEqual(errors, [], 'No client JS exceptions');
    await context.close();
    console.log(sample.name + ': project diagram playback/keyboard QA passed');
  }
  console.log('GSAP PROJECT DIAGRAM BROWSER QA PASSED');
} finally {
  await browser.close();
}
