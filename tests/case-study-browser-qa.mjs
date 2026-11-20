// Browser QA for the public analytics case study.
// Runs against a local Next.js server. No analytics credentials or Vercel deployment.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.CASE_STUDY_BASE_URL || 'http://127.0.0.1:3100';
const output = 'artifacts/case-study-browser-qa';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: viewport.name === 'mobile' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(baseURL + '/data-extraction-automation', {
      waitUntil: 'domcontentloaded', timeout: 45000,
    });
    assert.equal(response?.status(), 200, viewport.name + ': page must return HTTP 200');
    await page.locator('.lab-nav button').first().waitFor({ state: 'visible' });
    await page.waitForLoadState('load', { timeout: 12000 }).catch(() => {});
    assert.match(await page.locator('h1').first().innerText(), /One complex reporting request/);
    assert.equal(await page.locator('.case-platform').count(), 6, 'Platform cards');
    assert.equal(await page.locator('.case-cinema').count(), 1, 'Cinematic CSS hero');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 3);
    assert.equal(overflow, false, viewport.name + ': horizontal overflow');

    // The visual demonstration must be on the rendered page, not just in code.
    await page.getByRole('heading', { name: /Explore the architecture. Test the reporting handover./ }).waitFor();
    assert.equal(await page.locator('.pa-demo-source').count(), 6, 'Clickable source nodes');
    assert.equal(await page.locator('.pa-demo-step').count(), 4, 'Selectable pipeline stages');
    assert.equal(await page.locator('.pa-demo-kpi').count(), 3, 'Three fictional KPI cards');
    await page.getByRole('button', { name: /Search Console/i }).click();
    await page.getByText('gsc_query_demo.csv').waitFor();
    assert.equal(await page.locator('.pa-demo-source.is-selected').count(), 1, 'Exactly one source selected');
    await page.getByRole('button', { name: /03 · QUALITY Validate/i }).click();
    await page.getByRole('heading', { name: 'Validate' }).waitFor();
    await page.locator('.pa-demo-filter select').selectOption('quarter');
    assert.equal(await page.locator('.pa-demo-filter select').inputValue(), 'quarter');
    const csvDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download fictional CSV/ }).click();
    const file = await csvDownload;
    assert.match(file.suggestedFilename(), /^fictional_gsc_query_demo\.csv$/);
    await file.delete();
    // Retain existing walkthrough, archive, client-error and width checks.
    await page.locator('.lab-nav button').nth(1).click();
    await page.getByText('Authorise each platform', { exact: true }).waitFor();
    assert.equal(await page.locator('.lab-nav button').nth(1).getAttribute('aria-pressed'), 'true');
    await page.locator('.lab-controls button').last().click();
    await page.getByText('Paginate and split high-volume queries', { exact: true }).waitFor();
    await page.locator('.lab-codetabs button').nth(2).click();
    assert.match(await page.locator('.lab-code pre').innerText(), /inspect_with_retry/);
    assert.equal(await page.locator('.lab-codetabs button').nth(2).getAttribute('aria-pressed'), 'true');
    const toggle = page.locator('.lab-list-toggle');
    await toggle.click();
    assert.equal(await page.locator('.lab-file-list li').count(), 17, 'Source file list');
    await toggle.click();
    assert.equal(await page.locator('.lab-file-list li').count(), 0, 'Source list collapse');

    const archive = await page.request.get(baseURL + '/case-studies/ecommerce-analytics/sanitised-python-source-archive.md');
    assert.equal(archive.status(), 200, 'Sanitised archive');
    assert.match(await archive.text(), /gsc_07_finish_19_21_24\.py/);
    await page.screenshot({ path: output + '/' + viewport.name + '-full.png', fullPage: true, animations: 'disabled' });
    assert.deepEqual(errors, [], viewport.name + ': JavaScript runtime errors');
    results.push(viewport.name + ' (' + viewport.width + 'x' + viewport.height + '): passed');
    await context.close();
  }
  console.log('Case-study browser QA PASSED:\n' + results.join('\n'));
} finally {
  await browser.close();
}
