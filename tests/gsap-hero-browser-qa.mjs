// First GSAP integration: real client hydration at mobile/desktop widths.
// This QA never accepts analytics, clicks contact links or sends an email.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.HOMEPAGE_BASE_URL || 'http://127.0.0.1:3100';
const dir = 'artifacts/gsap-hero-qa';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const preset of [
    { name: 'mobile-reduced', width: 390, height: 844, motion: 'reduce' },
    { name: 'desktop-animated', width: 1366, height: 768, motion: 'no-preference' },
  ]) {
    const context = await browser.newContext({
      viewport: { width: preset.width, height: preset.height },
      reducedMotion: preset.motion,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    assert.equal(response?.status(), 200, preset.name + ': homepage returns 200');
    const hero = page.locator('.jrv2-hero-copy');
    const heading = hero.locator('#jrv2-title');
    await heading.waitFor({ state: 'visible' });
    assert.equal(await heading.count(), 1, 'one visible H1');
    assert.match(await heading.innerText(), /I build Shopify stores/);
    assert.equal(await hero.locator('a[href="#contact"]').count(), 1, 'project contact link retained');
    assert.equal(await hero.locator('a[href="/experience"]').count(), 1, 'hiring link retained');

    // Allow React hydration and the 650ms staggered transform to settle.
    // No opacity/display hiding is allowed for static, reduced-motion users.
    await page.waitForTimeout(1100);
    const state = await page.evaluate(() => {
      const heading = document.querySelector('#jrv2-title');
      const scope = document.querySelector('.jrv2-hero-copy');
      return {
        hidden: getComputedStyle(heading).visibility === 'hidden',
        opacity: getComputedStyle(heading).opacity,
        transformInline: heading.style.transform,
        scrollWidth: document.documentElement.scrollWidth,
        width: window.innerWidth,
        rootTag: scope?.tagName,
      };
    });
    assert.equal(state.rootTag, 'DIV');
    assert.equal(state.hidden, false, 'hero never hidden');
    assert.equal(Number(state.opacity), 1, 'heading remains opaque');
    assert.ok(!state.transformInline || state.transformInline === 'none',
      'GSAP clears temporary transform after animation or never adds it for reduced motion');
    assert.ok(state.scrollWidth <= state.width + 2, preset.name + ': no horizontal overflow');
    assert.deepEqual(errors, [], preset.name + ': no browser exceptions');
    await hero.screenshot({ path: dir + '/' + preset.name + '-hero.png', animations: 'disabled' });
    await context.close();
    console.log(preset.name + ': GSAP hero progressive enhancement passed');
  }
  console.log('GSAP hero browser QA PASSED');
} finally {
  await browser.close();
}
