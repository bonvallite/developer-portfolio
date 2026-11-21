// Browser regression for portfolio interest events against a local Next.js build.
// Uses only fictional interaction text. Third-party scripts are stubbed and no
// production analytics requests, messages or résumé files are transmitted.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.PORTFOLIO_EVENTS_BASE_URL || 'http://127.0.0.1:3100';
const testSizes = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];
const consentKey = 'jrv-optional-analytics-consent-v1';
const eventNames = new Set([
  'jrv_email_draft_click', 'jrv_resume_download_click', 'jrv_case_study_click',
]);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const size of testSizes) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height } });
    // Intercept optional provider requests to avoid sending test activity off-box.
    const thirdPartyRequests = [];
    await context.route(/googletagmanager\.com|clarity\.ms|vercel-insights\.com|\/_vercel\/insights/, route => {
      thirdPartyRequests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.locator('.jrv-consent').waitFor({ state: 'visible' });
    // Browser click events still reach the site event delegate, but navigation,
    // PDF downloads and external mailto handlers are suppressed in this test.
    const stopTrackedNavigation = () => {
      document.addEventListener('click', event => {
        if (event.target instanceof Element && event.target.closest('a[data-jrv-track]')) {
          event.preventDefault();
        }
      }, true);
    };
    await page.evaluate(stopTrackedNavigation);
    await page.getByRole('button', { name: 'I am hiring' }).click();
    const fictionalBrief = 'Fictional QA brief: never log this visitor-entered text.';
    await page.locator('#jrv2-project-brief').fill(fictionalBrief);
    const draft = page.getByRole('link', { name: /Open email draft/ });
    const visibleHref = await draft.getAttribute('href');
    assert.equal(visibleHref?.includes(encodeURIComponent(fictionalBrief)), false,
      size.name + ': typed brief must not be present in a click-tracked link URL');

    // A click before accepting and another after rejecting create no event.
    await draft.click();
    assert.equal(await page.evaluate(() => Array.isArray(window.dataLayer)), false,
      size.name + ': pre-consent should not create a GTM queue');
    assert.deepEqual(thirdPartyRequests, [], size.name + ': no optional network before consent');
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await draft.click();
    assert.equal(await page.evaluate(() => Array.isArray(window.dataLayer)), false,
      size.name + ': rejected consent should not create a GTM queue');
    assert.deepEqual(thirdPartyRequests, [], size.name + ': no optional network after rejection');

    await page.getByRole('button', { name: 'Change analytics privacy choices' }).click();
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await page.waitForFunction(() => Array.isArray(window.dataLayer));

    await draft.click();
    const hiringPayload = await page.evaluate(() => window.dataLayer
      .find(entry => entry?.event === 'jrv_email_draft_click'));
    assert.deepEqual(hiringPayload, {
      event: 'jrv_email_draft_click',
      jrv_intent: 'hiring',
      jrv_source: 'homepage_form',
    }, size.name + ': hiring click contains only fixed-category fields');
    assert.equal(JSON.stringify(hiringPayload).includes(fictionalBrief), false,
      size.name + ': draft text was never captured');

    await page.getByRole('button', { name: 'I have a Shopify project' }).click();
    await draft.click();
    const allowed = await page.evaluate(() => window.dataLayer.filter(item => item?.event?.startsWith('jrv_')));
    assert.deepEqual(allowed.at(-1), {
      event: 'jrv_email_draft_click',
      jrv_intent: 'project',
      jrv_source: 'homepage_form',
    }, size.name + ': project intent changed correctly');
    assert.equal(JSON.stringify(allowed).includes(fictionalBrief), false,
      size.name + ': no visitor text in any custom event');

    await page.locator('.jrv2-case-link').first().click();
    const casePayload = await page.evaluate(() => window.dataLayer
      .filter(item => item?.event === 'jrv_case_study_click').at(-1));
    assert.deepEqual(casePayload, {
      event: 'jrv_case_study_click',
      jrv_case: 'rewards',
    }, size.name + ': featured project click only carries a safe identifier');

    // The résumé page has two designs and two formats, all tracked as clicks.
    await page.goto(baseURL + '/resume', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForFunction(() => Array.isArray(window.dataLayer));
    await page.evaluate(stopTrackedNavigation);
    await page.getByRole('link', { name: /Download ATS-Friendly Résumé/ }).click();
    const resumePayload = await page.evaluate(() => window.dataLayer
      .filter(item => item?.event === 'jrv_resume_download_click').at(-1));
    assert.deepEqual(resumePayload, {
      event: 'jrv_resume_download_click',
      jrv_design: 'ats',
      jrv_format: 'pdf',
    }, size.name + ': résumé click only carries approved design and format');

    const countBeforeInvalid = await page.evaluate(() => window.dataLayer
      .filter(item => item?.event?.startsWith('jrv_')).length);
    await page.evaluate(() => {
      const link = document.querySelector('a[data-jrv-track="resume"]');
      link.setAttribute('data-jrv-design', 'unapproved-value');
      link.click();
    });
    const countAfterInvalid = await page.evaluate(() => window.dataLayer
      .filter(item => item?.event?.startsWith('jrv_')).length);
    assert.equal(countAfterInvalid, countBeforeInvalid,
      size.name + ': invalid dynamic marker must never be forwarded');

    // Withdrawing consent reloads the page. No new custom events are permitted
    // after the stored choice becomes rejected.
    await page.getByRole('button', { name: 'Change analytics privacy choices' }).click();
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await page.waitForFunction(key => window.localStorage.getItem(key) === 'rejected', consentKey);
    await page.goto(baseURL + '/resume', { waitUntil: 'domcontentloaded' });
    await page.evaluate(stopTrackedNavigation);
    await page.getByRole('link', { name: /Download Classic Résumé/ }).click();
    assert.equal(await page.evaluate(() => Array.isArray(window.dataLayer)), false,
      size.name + ': no new GTM queue after consent withdrawal');

    const eventPayloads = allowed.filter(item => eventNames.has(item.event));
    assert.ok(eventPayloads.length >= 2, size.name + ': intended events were queued');
    assert.deepEqual(errors, [], size.name + ': no JavaScript exceptions');
    console.log(size.name + ' ' + size.width + 'x' + size.height + ': click consent and privacy QA passed');
    await context.close();
  }
  console.log('Portfolio intent analytics browser QA PASSED');
} finally {
  await browser.close();
}
