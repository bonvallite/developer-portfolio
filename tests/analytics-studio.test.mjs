// 21 November 2026: source-level guards for the public Python analytics lab.
// The technical inspector draws on an existing sanitised 17-file Python
// archive. All displayed CSV rows, charts and reconciliation values remain
// fictional. Source checks complement full browser tests, not replace them.
// The contact section is static, uses a mailto URI, and adds no new lead API.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const page = read('app/analytics-lab/page.tsx');
const studio = read('app/analytics-lab/AnalyticsPipelineStudio.tsx');
const css = read('app/analytics-lab/analytics-studio.css');
const archive = read('public/case-studies/ecommerce-analytics/sanitised-python-source-archive.md');

test('Python lab connects a technical inspector to the existing interactive dashboard', () => {
  assert.match(page, /<AnalyticsPipelineStudio \/>/);
  assert.match(page, /analytics-studio\.css/);
  assert.match(page, /id="pipeline"/);
  assert.match(page, /id="dashboard"/);
  assert.match(page, /setView\('funnel'\)/);
  assert.match(page, /setView\('channels'\)/);
  assert.match(page, /getRewardProgress|const funnel=/);
  assert.match(page, /Shopify orders/);
  assert.match(page, /GA4 purchases/);
  assert.match(page, /Download synthetic CSV/);
  assert.match(page, /Compare events, not people/);
  assert.match(page, /not unique-user, time-ordered conversions/);
  assert.match(page, /No personal data, real client performance exports/);
});

test('closing analytics enquiry has distinct project and hiring destinations without a lead form', () => {
  assert.match(page, /id="analytics-contact"/);
  assert.match(page, /aria-labelledby="al-contact-title"/);
  assert.match(page, /mailto:hello@jrvallite\\.com\\?subject=Ecommerce%20analytics%20and%20CRO%20project%20%7C%20JRV/);
  assert.match(page, /Hiring\\? Review experience/);
  assert.match(page, /href="\\/experience"/);
  assert.match(page, /does not collect or submit your enquiry/);
  assert.match(css, /\\.al-contact-actions/);
  assert.match(css, /\\.al-contact\\{grid-template-columns:1fr\\}/);
  assert.doesNotMatch(page, /<form|action=\\{?['"]?https?:|onSubmit=|XMLHttpRequest|sendBeacon\\(/);
});

test('five-stage workflow and real source archive references are demonstrable', () => {
  assert.match(studio, /useState\(2\)/);
  assert.match(studio, /aria-pressed=\{step === i\}/);
  assert.match(studio, /aria-pressed=\{example === item\.key\}/);
  assert.match(studio, /aria-live="polite" aria-atomic="true"/);
  assert.match(studio, /const stages = \[/);
  assert.match(studio, /const examples = \[/);
  for (const file of [
    '01_daily_acquisition.py',
    '05_purchase_funnel.py',
    'gsc_03_export_all_30_full.py',
    'gsc_07_finish_19_21_24.py',
  ]) {
    assert.ok(studio.includes(file), 'Code inspector must link reviewed file: ' + file);
    assert.ok(archive.includes('## ' + file), 'Published archive must ground the file: ' + file);
  }
  assert.match(studio, /offset \+= len\(response\.rows\)/);
  assert.match(studio, /FUNNEL_STEPS = \[/);
  assert.match(studio, /cur = start_dt/);
  assert.match(studio, /def inspect_with_retry/);
  assert.match(studio, /not a Python runtime or data connector/);
  assert.match(studio, /Adapted, sanitised excerpts/);
  assert.match(studio, /Example records only/);
  assert.match(studio, /\/data-extraction-automation#source-lab/);
  assert.match(studio, /17-file source archive/);
});

test('route styles are responsive, keyboard-visible and do not load external media', () => {
  assert.match(css, /#38c7bc/i);
  assert.match(css, /#f28c52/i);
  assert.match(css, /max-width:490px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /al-studio-table-scroll/);
  assert.doesNotMatch(css, /https?:\/\/|url\(/i);
  assert.doesNotMatch(studio, /fetch\(|sendBeacon\(|XMLHttpRequest|navigator\.clipboard|localStorage|sessionStorage|gtag\(/);
  assert.doesNotMatch(studio, /api\\.shopify\\.com|BEGIN PRIVATE KEY|Bearer [A-Za-z0-9]/i);
});
