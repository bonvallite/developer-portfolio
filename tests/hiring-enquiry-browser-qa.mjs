// Responsive merchant and hiring CTA regression against the local Next.js app.
// Never open mailto links, send email, accept optional analytics or submit text.
// Source of truth: the publicly documented fixed templates, not lead counts.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.HOMEPAGE_BASE_URL || 'http://127.0.0.1:3100';
const directory = 'artifacts/hiring-enquiry-browser-qa';
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];
const services = ['/shopify-developer','/ecommerce-management','/shopify-cro','/shopify-app-development'];
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const size of viewports) {
    const context = await browser.newContext({ viewport: size, reducedMotion: size.name === 'mobile' ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    const pageErrors = [], thirdPartyAnalytics = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('request', request => {
      if (/googletagmanager\.com|clarity\.ms\/tag|vercel-insights\.com|\/_vercel\/insights/.test(request.url())) thirdPartyAnalytics.push(request.url());
    });
    for (const service of services) {
      const response = await page.goto(base + service, { waitUntil: 'domcontentloaded', timeout: 45000 });
      assert.equal(response?.status(), 200, size.name + ' ' + service + ': HTTP 200');
      await page.locator('.service-hero h1').waitFor({ state: 'visible' });
      const actions = page.locator('.service-hero .actions');
      const project = actions.getByRole('link', { name: /Discuss a Shopify project/ });
      const hiring = actions.getByRole('link', { name: /Discuss a hiring role/ });
      assert.equal(await project.count(), 1, service + ': one project CTA in hero');
      assert.equal(await hiring.count(), 1, service + ': one hiring CTA in hero');
      assert.equal(await project.getAttribute('data-jrv-intent'), 'project');
      assert.equal(await hiring.getAttribute('data-jrv-intent'), 'hiring');
      assert.equal(await hiring.getAttribute('data-jrv-source'), 'service_page');
      const projectHref = await project.getAttribute('href');
      const hiringHref = await hiring.getAttribute('href');
      assert.match(projectHref || '', /^mailto:hello@jrvallite\.com\?subject=/);
      assert.match(hiringHref || '', /^mailto:hello@jrvallite\.com\?subject=/);
      assert.notEqual(projectHref, hiringHref, service + ': hiring and project templates differ');
      assert.ok(decodeURIComponent(hiringHref || '').includes('Role title:'), 'Hiring draft has role prompts');
      assert.ok(decodeURIComponent(projectHref || '').includes('Challenge:'), 'Project draft has scope prompts');
      const section = page.locator('.service-bottom-cta');
      assert.equal(await section.locator('.jrv-svc-contact-routes article').count(), 2,
        service + ': two distinct closing paths');
      assert.equal(await section.locator('a[data-jrv-intent="hiring"]').count(), 1);
      assert.equal(await section.locator('a[data-jrv-intent="project"]').count(), 1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(overflow <= 2, size.name + ' ' + service + ': no horizontal overflow (' + overflow + 'px)');
      if (service === '/shopify-developer') {
        await section.scrollIntoViewIfNeeded();
        await page.screenshot({ path: directory + '/' + size.name + '-contact-choices.png' });
      }
    }

    // The experience route preserves the résumé and adds a contextual hiring
    // route; its fixed query marker selects the correct composer state.
    let response = await page.goto(base + '/experience', { waitUntil: 'domcontentloaded', timeout: 45000 });
    assert.equal(response?.status(), 200);
    const hireFromExperience = page.locator('.flow-header').getByRole('link', { name: /Discuss a hiring role/ });
    assert.equal(await hireFromExperience.getAttribute('href'), '/?intent=hiring#contact');
    assert.equal(await page.locator('a[href="/?intent=hiring#contact"]').count(), 2,
      'Experience has both a first-screen and closing hiring path');
    await hireFromExperience.click();
    await page.waitForURL(/\?intent=hiring#contact$/);
    await page.waitForFunction(() => document.querySelector('.jrv2-lead-choice[aria-pressed="true"]')?.textContent?.includes('I am hiring'));
    assert.equal(await page.getByRole('button', { name: 'I am hiring' }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: 'I have a Shopify project' }).getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('a[data-jrv-track="email"][data-jrv-source="homepage_form"]').getAttribute('data-jrv-intent'), 'hiring');
    await page.locator('#jrv2-project-brief').fill('Fictional hiring requirements for QA only');
    const draftHref = await page.getByRole('link', { name: /Open email draft/ }).getAttribute('href');
    assert.ok(decodeURIComponent(draftHref || '').includes('Role and responsibilities:'), 'Hiring email template selected');
    assert.equal((draftHref || '').includes('Fictional hiring requirements'), false,
      'Optional typed text must never be exposed in the DOM href');
    assert.equal(await page.evaluate(() => Array.isArray(window.dataLayer)), false,
      'No optional events without analytics consent');
    await page.screenshot({ path: directory + '/' + size.name + '-hiring-composer.png' });

    await page.goto(base + '/?intent=unexpected#contact', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('.jrv2-lead-choice[aria-pressed="true"]')?.textContent?.includes('I have a Shopify project'));
    assert.equal(await page.getByRole('button', { name: 'I am hiring' }).getAttribute('aria-pressed'), 'false',
      'Unknown query values may not preselect the hiring intent');
    assert.deepEqual(thirdPartyAnalytics, [], 'No optional analytics requested without consent');
    assert.deepEqual(pageErrors, [], 'Pages do not throw browser errors');
    await context.close();
    console.log(size.name + ': service and experience hiring paths passed');
  }
  console.log('Hiring/enquiry journey browser QA PASSED');
} finally {
  await browser.close();
}
