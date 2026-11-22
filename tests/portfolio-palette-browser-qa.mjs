// JRV palette QA for all public sitemap routes and approved resume views.
// Runs only on a local built Next.js site. No screenshots are captured from
// private client systems. The light editorial storefront and printable résumé
// designs keep separate reading surfaces but share JRV accent colours.
// Screenshots are visual review artefacts, not measured Core Web Vitals.
// Validated primary actions have an Ember default and an approved light-Ember
// hover; do not mistake legitimate pointer hover for a mismatched brand colour.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const urlBase = process.env.JRV_PALETTE_BASE_URL || 'http://127.0.0.1:3100';
const root = 'artifacts/portfolio-palette-qa';
const cases = [
  { path: '/', slug: 'home', primary: '.jrv2-cta-primary' },
  { path: '/shopify-developer', slug: 'shopify-developer', primary: '.jrv-svc .service-hero .button.primary' },
  { path: '/shopify-cro', slug: 'shopify-cro', primary: '.jrv-svc .service-hero .button.primary' },
  { path: '/shopify-app-development', slug: 'shopify-app', primary: '.jrv-svc .service-hero .button.primary' },
  { path: '/ecommerce-management', slug: 'ecommerce-management', primary: '.jrv-svc .service-hero .button.primary' },
  { path: '/data-extraction-automation', slug: 'data-extraction', teal: 'h1 span' },
  { path: '/css-lab', slug: 'css-lab', primary: '[class*="heroCta"]' },
  { path: '/b2b-demo', slug: 'b2b-demo' },
  { path: '/python-automation', slug: 'python-automation' },
  { path: '/privacy', slug: 'privacy' },
  { path: '/resume', slug: 'resume', primary: '.resume-action:not(.ghost)' },
  { path: '/resume/ats', slug: 'resume-ats' },
  { path: '/resume/classic', slug: 'resume-classic' },
  { path: '/editorial-homepage-demo', slug: 'editorial-homepage' },
  { path: '/eve-curls', slug: 'eve-curls' },
  { path: '/projects/spend-and-save', slug: 'spend-save' },
  { path: '/analytics-lab', slug: 'analytics-lab' },
  { path: '/cartoncloud-integration', slug: 'cartoncloud' },
  { path: '/b2b-modernisation', slug: 'b2b' },
  // These six sitemap pages were not in the previous palette browser sweep.
  { path: '/experience', slug: 'experience' },
  { path: '/conversion-audit', slug: 'conversion-audit' },
  { path: '/shipping-integration', slug: 'shipping-integration' },
  { path: '/shopify-flow', slug: 'shopify-flow' },
  { path: '/chilled-delivery-demo', slug: 'chilled-delivery' },
  { path: '/engineering-standards', slug: 'engineering-standards' },
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];
await mkdir(root, { recursive: true });
const browserInstance = await chromium.launch({ channel: 'chrome', headless: true });
let captures = 0;
try {
  for (const viewport of viewports) {
    const context = await browserInstance.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: 'reduce',
      locale: 'en-AU',
    });
    try {
      const page = await context.newPage();
      let pageErrors = [];
      let tracking = 0;
      page.on('pageerror', err => pageErrors.push(err.message));
      page.on('request', req => {
        if (/googletagmanager\.com|clarity\.ms|vercel-insights\.com|\/_vercel\/insights/i.test(req.url())) tracking++;
      });
      for (const item of cases) {
        pageErrors = [];
        const response = await page.goto(urlBase + item.path, { waitUntil: 'load', timeout: 45000 });
        assert.equal(response?.status(), 200, viewport.name + item.path + ': HTTP 200');
        const banner = page.getByRole('button', { name: 'Reject optional' });
        if (await banner.isVisible()) await banner.click(); // Keep all samples consent-free.
        const layout = await page.evaluate(() => {
          const styles = getComputedStyle(document.documentElement);
          return {
            teal: styles.getPropertyValue('--jrv-teal').trim(),
            ember: styles.getPropertyValue('--jrv-ember').trim(),
            bg: styles.getPropertyValue('--jrv-bg').trim(),
            hasH1: document.querySelectorAll('h1').length === 1,
            overflow: document.documentElement.scrollWidth > window.innerWidth + 3,
          };
        });
        assert.equal(layout.teal, '#38c7bc', item.path + ': JRV teal token');
        assert.equal(layout.ember, '#f28c52', item.path + ': JRV ember token');
        assert.equal(layout.bg, '#0b1419', item.path + ': JRV obsidian token');
        assert.equal(layout.hasH1, true, item.path + ': one page H1');
        assert.equal(layout.overflow, false, viewport.name + item.path + ': horizontal overflow');
        if (item.primary) {
          const element = page.locator(item.primary).first();
          await element.waitFor({ state: 'attached' });
          // Browser QA uses a real pointer even in a 390px viewport. Its
          // position can overlap an action after navigation, legitimately
          // selecting the documented light-ember hover state. Both are JRV.
          const background = await element.evaluate(el => getComputedStyle(el).backgroundColor);
          const approvedEmberStates = [
            'rgb(242, 140, 82)', // #F28C52: primary action
            'rgb(255, 181, 139)', // #FFB58B: service/CSS Lab hover
            'rgb(255, 171, 121)', // #FFAB79: homepage hover
          ];
          assert.ok(approvedEmberStates.includes(background),
            item.path + ': CTA colour ' + background + ' is not default/hover JRV ember');
        }
        if (item.teal) {
          const element = page.locator(item.teal).first();
          await element.waitFor({ state: 'attached' });
          assert.equal(await element.evaluate(el => getComputedStyle(el).color),
            'rgb(56, 199, 188)', item.path + ': emphasis uses JRV teal');
        }
        if (item.path === '/shipping-integration') {
          const title = page.locator('.shipping-story-hero h1');
          await title.waitFor({ state: 'visible' });
          const sizePx = await title.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
          assert.ok(sizePx >= 39, 'Shipping integration hero must remain readable, not a raw text wall');
          assert.equal(await page.locator('.shipping-story-system').count(), 3,
            'Shipping diagram must show the three system responsibilities');
          assert.equal(await page.locator('.shipping-story-scenarios article').count(), 4,
            'Shipping validation scenarios must remain accessible');
        }
        if (item.path === '/editorial-homepage-demo') {
          const demo = page.locator('[class*="site"]').first();
          assert.equal(await demo.evaluate(el => getComputedStyle(el).getPropertyValue('--ember').trim()),
            '#f28c52', 'Light editorial composition uses JRV ember');
        }
        assert.deepEqual(pageErrors, [], item.path + ': no JavaScript page errors');
        assert.equal(tracking, 0, item.path + ': optional analytics still excluded');
        await page.screenshot({ path: root + '/' + item.slug + '-' + viewport.name + '.png',
          fullPage: false, animations: 'disabled' });
        captures++;
        console.log('Palette QA ' + viewport.name + ' ' + item.path + ': passed');
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browserInstance.close();
}
assert.equal(captures, cases.length * viewports.length);
console.log('JRV palette desktop and mobile QA passed; captures=' + captures);
