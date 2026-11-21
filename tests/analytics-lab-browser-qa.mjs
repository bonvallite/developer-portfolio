// 21 November 2026: Playwright visual and interaction review for the Python
// analytics studio. The only data are fictional local fixtures and already-
// published sanitised Python snippets. No analytics API or merchant connection.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.CASE_STUDY_BASE_URL || 'http://127.0.0.1:3100';
const dir = 'artifacts/analytics-lab-browser-qa';
const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of sizes) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, acceptDownloads: true,
      reducedMotion: viewport.name === 'mobile' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(base + '/analytics-lab', {
      waitUntil: 'domcontentloaded', timeout: 45000,
    });
    assert.equal(response?.status(), 200, viewport.name + ': HTTP 200');
    await page.getByRole('heading', { name: /From raw data to/ }).waitFor();
    assert.equal(await page.locator('h1').count(), 1, 'One descriptive H1');
    await page.getByText('17', { exact: true }).first().waitFor();

    const studio = page.locator('.al-engineering-studio');
    await studio.waitFor({ state: 'visible' });
    const stages = studio.locator('.al-studio-steps button');
    assert.equal(await stages.count(), 5, viewport.name + ': five technical stages');
    assert.equal(await stages.nth(2).getAttribute('aria-pressed'), 'true',
      viewport.name + ': extract is initially selected');
    await stages.nth(3).click();
    await studio.getByRole('heading', { name: 'Make failures visible.' }).waitFor();
    await studio.getByText('A validation trail and individual dataset statuses.').waitFor();
    await studio.getByRole('button', { name: /Next stage/ }).click();
    await studio.getByRole('heading', { name: 'Deliver data someone can audit.' }).waitFor();
    assert.equal(await studio.getByRole('button', { name: /Next stage/ }).isDisabled(),
      true, viewport.name + ': end-of-pipeline gating');
    await stages.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await stages.nth(1).getAttribute('aria-pressed'), 'true',
      viewport.name + ': keyboard activates engineering stage');
    await studio.getByRole('heading', { name: 'Treat access as a boundary.' }).waitFor();

    const examples = studio.getByRole('group', { name: 'Select Python implementation excerpt' });
    assert.equal(await examples.getByRole('button').count(), 4,
      viewport.name + ': four inspected source examples');
    await examples.getByRole('button', { name: /GA4 funnel events/ }).click();
    await studio.getByText('05_purchase_funnel.py').first().waitFor();
    assert.match(await studio.locator('.al-studio-source-window pre').innerText(), /FUNNEL_STEPS/);
    await studio.getByRole('columnheader', { name: 'view_item' }).waitFor();

    await examples.getByRole('button', { name: /GSC date chunks/ }).click();
    assert.match(await studio.locator('.al-studio-source-window pre').innerText(), /datetime\.timedelta\(days=29\)/);
    await studio.getByRole('columnheader', { name: 'query_group' }).waitFor();
    assert.equal(await examples.getByRole('button', { name: /GSC date chunks/ }).getAttribute('aria-pressed'),
      'true', viewport.name + ': code selection state');

    await examples.getByRole('button', { name: /Inspection retries/ }).click();
    assert.match(await studio.locator('.al-studio-source-window pre').innerText(), /inspect_with_retry/);
    await studio.getByRole('columnheader', { name: 'attempts' }).waitFor();
    await studio.getByText('Example records only. No client records or API results.').waitFor();

    await page.getByRole('group', { name: 'Analytics chart' })
      .getByRole('button', { name: 'Purchase funnel' }).click();
    assert.equal(await page.locator('.al-chart-row').count(), 4, 'Four fictional funnel stages');
    await page.getByText('Compare events, not people.').waitFor();
    await page.getByRole('group', { name: 'Analytics chart' })
      .getByRole('button', { name: 'Acquisition channels' }).click();
    assert.equal(await page.locator('.al-chart-row').count(), 4, 'Four fictional acquisition channels');
    await page.getByText('Do not confuse channel attribution with causation.').waitFor();

    await page.getByLabel('Shopify orders').fill('300');
    await page.getByLabel('GA4 purchases').fill('240');
    await page.getByText('20% of Shopify orders').waitFor();

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download synthetic CSV/ }).click();
    const file = await download;
    assert.equal(file.suggestedFilename(), 'jrv-synthetic-acquisition.csv');
    await file.delete();

    const archive = await page.request.get(base + '/case-studies/ecommerce-analytics/sanitised-python-source-archive.md');
    assert.equal(archive.status(), 200, 'Public sanitised source archive remains linked');
    assert.match(await archive.text(), /gsc_07_finish_19_21_24\.py/);

    // Reject optional analytics and capture the design without the cookie panel
    // masking hero, pipeline or dashboard. No tracking opt-in is needed for QA.
    const consent = page.locator('.jrv-consent');
    await consent.waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Reject optional' }).click();
    await consent.waitFor({ state: 'hidden' });

    await examples.getByRole('button', { name: /GA4 acquisition/ }).click();
    await stages.nth(2).click();
    await page.getByRole('group', { name: 'Analytics chart' })
      .getByRole('button', { name: 'Purchase funnel' }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3);
    assert.equal(overflow, false, viewport.name + ': no page-wide horizontal overflow');
    if (viewport.width <= 490) {
      const code = await studio.locator('.al-studio-source-window pre').evaluate(el => ({
        whitespace: getComputedStyle(el).whiteSpace,
        width: el.clientWidth,
        contentWidth: el.scrollWidth,
      }));
      assert.equal(code.whitespace, 'pre-wrap', 'Python code must wrap on narrow phones');
      assert.ok(code.contentWidth <= code.width + 3,
        'Python source content should be visible without sideways mobile scrolling');
    }
    assert.deepEqual(errors, [], viewport.name + ': no client runtime errors');
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.screenshot({
      path: dir + '/' + viewport.name + '.png',
      fullPage: true, animations: 'disabled',
    });
    console.log('Analytics studio ' + viewport.name + ' (' + viewport.width + 'x' + viewport.height + '): PASSED');
    await context.close();
  }
  console.log('Python analytics engineering studio browser QA PASSED');
} finally {
  await browser.close();
}
