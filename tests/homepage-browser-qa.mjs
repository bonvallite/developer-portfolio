// End-to-end browser QA for the JRV cinematic Ember & Teal homepage rebuild.
// Runs against a locally built Next.js app; no live client APIs or credentials.
// Screenshots are review artefacts, not evidence of real performance metrics.
// The project studio must genuinely respond to visitor actions at every size.
// Restored website previews are selected without triggering live-site navigation
// or requiring a third-party thumbnail to load successfully.
// The privacy preferences control must have a 44px touch target and report its
// expanded state; reopening/rejecting must not enable analytics.
// The goal-led hero routes are native links to existing contact and experience
// pages. Validate both at four sizes and never submit user information.
// 22 Nov latest-main showcase integration: keep the 11-site gallery and four
// original projects while adding a distinct, separately linked systems lab.
// This check reads a local Next.js server and uses no external provider data.
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
    await page.getByRole('heading', { name: /I build Shopify stores/ }).waitFor();
    await page.locator('.jrv2-journey-tab').first().waitFor({ state: 'visible' });
    assert.equal(await page.locator('h1').count(), 1, 'One homepage H1');
    assert.equal(await page.locator('.jrv2-case').count(), 4, 'Four case-study stories');

    // Separate flagship: don't replace the original CartonCloud case study
    // or the newer published storefront gallery to add the app-development lab.
    const systems = page.locator('#systems-lab');
    assert.equal(await systems.count(), 1, size.name + ': systems section present once');
    assert.equal(await systems.locator('h2').count(), 1, size.name + ': section title');
    assert.equal(await systems.locator('.jrv2-flagship-node').count(), 3,
      size.name + ': Shopify / Worker / CartonCloud conceptual diagram');
    assert.equal(await systems.getByRole('link', { name: /Explore the interactive case study/ }).getAttribute('href'),
      '/projects/commerce-integration-engineering', 'New lab CTA points to draft route');
    assert.equal(await systems.getByRole('link', { name: /Earlier integration case study/ }).getAttribute('href'),
      '/cartoncloud-integration', 'Legacy case study remains directly accessible');
    assert.equal(await page.locator('.jrv2-case a[href="/cartoncloud-integration"]').count(), 1,
      size.name + ': original CartonCloud Selected Work card retained');
    assert.equal(await page.locator('nav[aria-label="Primary navigation"] a[href="#systems-lab"]').count(), 1,
      size.name + ': desktop navigation reaches systems section');
    assert.equal(await page.locator('nav[aria-label="Mobile navigation"] a[href="#systems-lab"]').count(), 1,
      size.name + ': mobile navigation reaches systems section');
    const newRouteResponse = await page.request.get(baseURL + '/projects/commerce-integration-engineering');
    assert.equal(newRouteResponse.status(), 200, size.name + ': engineering route returns HTTP 200');

    // Website references are present without waiting on remote image delivery.
    const showcase = page.locator('#websites .cinematic-showcase');
    const liveSites = page.locator('#websites .jrv2-websites-links a');
    assert.equal(await liveSites.count(), 11, size.name + ': eleven published homepage links');
    assert.equal(await showcase.count(), 1, size.name + ': restored desktop/mobile preview gallery');
    const choices = showcase.locator('.cinematic-showcase-index button');
    assert.equal(await choices.count(), 11, size.name + ': all approved sites selectable');
    await showcase.getByRole('button', { name: 'Show Eve Curls' }).click();
    assert.equal((await showcase.locator('.cinematic-showcase-current').innerText()).trim(), 'Eve Curls');
    assert.equal(await showcase.locator('.storefront-device').count(), 2,
      size.name + ': one desktop/mobile device pair per selected storefront');
    await showcase.getByRole('button', { name: 'Show Peter Augustus' }).click();
    assert.equal((await showcase.locator('.cinematic-showcase-current').innerText()).trim(), 'Peter Augustus');
    const siteTarget = await liveSites.first().boundingBox();
    assert.ok(siteTarget && siteTarget.height >= 44,
      size.name + ': published website CTA provides an accessible touch target');
    assert.ok((await liveSites.first().getAttribute('href'))?.startsWith('https://www.peteraugustus.com.au/'));

    assert.equal(await page.locator('.jrv2-service').count(), 4, 'Four linked services');
    assert.ok(await page.locator('.jrv2-hero-actions a').count() >= 2, 'Prominent hero actions');
    // Two purposeful visitor journeys begin before the selected project list:
    // owners can reach direct contact, while hiring teams reach experience.
    const goalPaths = page.getByRole('navigation', { name: 'Choose how to work together' });
    assert.equal(await goalPaths.locator('a').count(), 2,
      size.name + ': exactly two first-screen visitor paths');
    const clientRoute = goalPaths.getByRole('link', { name: /Discuss a Shopify challenge/ });
    const hiringRoute = goalPaths.getByRole('link', { name: /Review Shopify experience/ });
    assert.equal(await clientRoute.getAttribute('href'), '#contact',
      size.name + ': ecommerce team route leads to contact');
    assert.equal(await hiringRoute.getAttribute('href'), '/experience',
      size.name + ': hiring route leads to experience');
    for (const link of [clientRoute, hiringRoute]) {
      const target = await link.boundingBox();
      assert.ok(target && target.height >= 44,
        size.name + ': first-screen audience link must be touch accessible');
    }
    assert.equal(await page.locator('.jrv2-console').count(), 1, 'Visual commerce engine');

    const consent = page.locator('.jrv-consent');
    await consent.waitFor({ state: 'visible' });
    // No optional third-party tracking may start in a fresh browser before consent.
    assert.deepEqual(trackingRequests, [], size.name + ': optional tracking requested before consent');
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });
    assert.deepEqual(trackingRequests, [], size.name + ': tracking requested after rejection');
    // Prevent a regression to the old 9px phone label and small hit target.
    const settings = page.getByRole('button', { name: 'Change analytics privacy choices' });
    const settingsMetrics = await settings.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height,
        font: Number.parseFloat(window.getComputedStyle(el).fontSize),
        visible: rect.left >= 0 && rect.top >= 0 &&
          rect.right <= window.innerWidth && rect.bottom <= window.innerHeight };
    });
    assert.ok(settingsMetrics.width >= 44 && settingsMetrics.height >= 44,
      size.name + ': settings must provide a minimum 44px target');
    assert.ok(settingsMetrics.font >= 12 && settingsMetrics.visible,
      size.name + ': settings label must remain legible and on-screen');
    assert.equal(await settings.getAttribute('aria-expanded'), 'false');
    await settings.focus();
    await page.keyboard.press('Enter');
    await consent.waitFor({ state: 'visible' });
    assert.equal(await settings.getAttribute('aria-expanded'), 'true');
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });
    assert.equal(await settings.getAttribute('aria-expanded'), 'false');
    assert.deepEqual(trackingRequests, [], size.name + ': re-rejection never requests analytics');

    // Interactive project studio is real local UI, not four decorative cards.
    // Verify every mode, keyboard selection, and a deterministic fictional
    // result without contacting Shopify, warehouse systems, or analytics.
    const studio = page.locator('.jrv2-workbench');
    assert.equal(await studio.count(), 1, size.name + ': interactive studio present');
    assert.equal(await studio.locator('.jrv2-workbench-tab').count(), 4,
      size.name + ': four visible project modes');
    // A previous narrow-screen screenshot showed mode labels extending beyond
    // their buttons despite the page having no horizontal scrollbar.
    const tabBounds = await studio.locator('.jrv2-workbench-tab').evaluateAll(buttons =>
      buttons.map(button => {
        const box = button.getBoundingClientRect();
        const label = button.querySelector('span')?.getBoundingClientRect();
        return { left: box.left, right: box.right, labelLeft: label?.left,
          labelRight: label?.right };
      })
    );
    for (const bounds of tabBounds) {
      assert.ok(bounds.labelLeft !== undefined && bounds.labelRight !== undefined &&
        bounds.labelLeft >= bounds.left - 1 && bounds.labelRight <= bounds.right + 1,
        size.name + ': project mode label escapes its own button');
    }
    // The redesigned headline should not dominate the entire first screen.
    if (size.width >= 970) {
      const headlineLines = await page.locator('#jrv2-title').evaluate(heading => {
        const styles = window.getComputedStyle(heading);
        return heading.getBoundingClientRect().height / parseFloat(styles.lineHeight);
      });
      assert.ok(headlineLines <= 3.2, size.name + ': desktop headline is excessively tall');
    }

    assert.equal(await studio.locator('.jrv2-workbench-copy h2[aria-live="polite"]').count(), 1,
      size.name + ': focused screen reader announcement');
    assert.equal(await studio.getByRole('button', { name: 'REWARDS' }).getAttribute('aria-pressed'),
      'true', size.name + ': reward preview starts selected');
    assert.equal(await studio.getByRole('progressbar').getAttribute('aria-valuenow'), '175');
    await studio.getByRole('button', { name: 'Add $50' }).click();
    assert.equal(await studio.getByRole('progressbar').getAttribute('aria-valuenow'), '225');
    await studio.getByText('Add $75 to reach additional gift.').waitFor();
    await studio.getByRole('button', { name: 'Reset' }).click();
    assert.equal(await studio.getByRole('progressbar').getAttribute('aria-valuenow'), '175');

    await studio.getByRole('button', { name: 'DATA LAB' }).click();
    await studio.getByRole('button', { name: 'GA4' }).click();
    await studio.getByText('Sessions / sample week').waitFor();
    assert.equal(await studio.getByRole('button', { name: 'GA4' }).getAttribute('aria-pressed'),
      'true');
    assert.match(await studio.getByRole('img').getAttribute('aria-label') || '',
      /Fictional sessions over seven periods/);

    await studio.getByRole('button', { name: 'WEBHOOKS' }).click();
    await studio.getByRole('button', { name: 'Advance event' }).click();
    await studio.getByRole('button', { name: 'Advance event' }).click();
    await studio.getByText('Simulated step 3 of 4: Tracking event mapped.').waitFor();
    await studio.getByRole('button', { name: 'Reset' }).click();
    await studio.getByText('Simulated step 1 of 4: Order event prepared.').waitFor();

    const wholesale = studio.getByRole('button', { name: 'WHOLESALE' });
    await wholesale.focus();
    await page.keyboard.press('Enter');
    assert.equal(await wholesale.getAttribute('aria-pressed'), 'true',
      size.name + ': keyboard activates wholesale preview');
    await studio.getByText('5.40 kg', { exact: true }).waitFor();
    await studio.getByText('$163.40', { exact: true }).waitFor();
    await studio.getByRole('button', { name: 'Add one Demo Cut A' }).click();
    await studio.getByText('6.15 kg', { exact: true }).waitFor();
    await studio.getByText('$190.00', { exact: true }).waitFor();
    assert.equal(await studio.locator('.jrv2-workbench-footer a').getAttribute('href'),
      '/b2b-modernisation');

    await studio.getByRole('button', { name: 'REWARDS' }).click();
    assert.equal(await studio.getByRole('progressbar').getAttribute('aria-valuenow'), '175');

    // Only the selected heading is a live announcement. Keyboard activation
    // remains available on every viewport without reading the whole diagram.
    const journeyTabs = page.locator('.jrv2-journey-tab');
    const journeyLiveRegions = page.locator('.jrv2-journey [aria-live]');
    assert.equal(await journeyLiveRegions.count(), 1, size.name + ': one journey live region');
    assert.equal(await journeyLiveRegions.first().evaluate(element => element.tagName), 'H3',
      size.name + ': selected step heading owns the live announcement');
    assert.equal(await journeyLiveRegions.first().getAttribute('aria-live'), 'polite');
    assert.equal(await journeyLiveRegions.first().getAttribute('aria-atomic'), 'true');

    await journeyTabs.nth(1).focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Make complex feel clear.' }).waitFor();
    assert.equal(await journeyTabs.nth(1).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.jrv2-journey-tab.is-active').count(), 1);
    await journeyTabs.nth(2).focus();
    await page.keyboard.press('Space');
    await page.getByRole('heading', { name: 'Build for the real world.' }).waitFor();
    assert.equal(await journeyTabs.nth(2).getAttribute('aria-pressed'), 'true');
    assert.equal(await journeyLiveRegions.first().textContent(), 'Build for the real world.');

    await page.getByRole('button', { name: 'I am hiring' }).click();
    await page.locator('#jrv2-project-brief').fill('Fictional browser QA test only.');
    const emailHref = await page.getByRole('link', { name: /Open email draft/ }).getAttribute('href');
    assert.ok(emailHref?.startsWith('mailto:hello@jrvallite.com?'), 'No third-party lead form');
    // Optional text is intentionally absent from the DOM href so automatic
    // vendor link-click listeners cannot read a visitor's typed brief there.
    assert.equal(emailHref?.includes('Fictional%20browser%20QA%20test%20only.'), false,
      'Visitor-entered brief must not appear in the mailto anchor href');
    assert.ok(emailHref?.includes('Company%3A'), 'Static role enquiry template remains available');

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
    // The prior interaction checks scroll to the contact section. Reset the
    // viewport before a full-page capture so sticky navigation is rendered at
    // the page top, not superimposed over contact content in the artefact.
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(120);
    await page.screenshot({ path: output + '/' + size.name + '.png', fullPage: true, animations: 'disabled' });
    assert.deepEqual(failures, [], size.name + ': JavaScript exceptions');
    // The four SEO landing pages share a newly styled server component.
    // Audit their actual routes rather than treating homepage links as proof.
    if (size.name === 'wide' || size.name === 'mobile') {
      const routes = [
        '/shopify-developer', '/ecommerce-management',
        '/shopify-cro', '/shopify-app-development',
      ];
      for (const route of routes) {
        const serviceResponse = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
        assert.equal(serviceResponse?.status(), 200, route + ': HTTP 200');
        await page.locator('.jrv-svc-hero-art').waitFor({ state: 'visible' });
        assert.equal(await page.locator('.service-hero h1').count(), 1, route + ': H1');
        assert.equal(await page.locator('.jrv-quick-dock').count(), 0, route + ': no competing floating CTA');
        const serviceHref = await page.locator('.service-hero .button.primary').getAttribute('href');
        assert.ok(serviceHref?.startsWith('mailto:hello@jrvallite.com?'), route + ': direct enquiry');
        assert.ok(await page.locator('#examples .service-card-grid a').count() >= 1, route + ': project evidence');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3), false, route + ': horizontal overflow');
        assert.deepEqual(trackingRequests, [], route + ': no requests after rejection');
        if (route === '/shopify-developer') {
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: output + '/service-' + size.name + '.png', fullPage: true, animations: 'disabled' });
        }
      }
    }
    summary.push(size.name + ' ' + size.width + 'x' + size.height + ': passed');

    await context.close();
  }
  console.log('Cinematic homepage browser QA PASSED:\n' + summary.join('\n'));
} finally {
  await browser.close();
}
