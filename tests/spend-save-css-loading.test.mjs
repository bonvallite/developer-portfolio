// Protect the Spend & Save case-study's first-paint CSS loading arrangement.
// The old client-rendered, bottom-of-body global style block could arrive
// after content and cause an avoidable initial layout shift. The production
// reward simulator and fictional post-checkout states must stay intact.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const page = read('../app/projects/spend-and-save/page.tsx');
const base = read('../app/projects/spend-and-save/spend-save-base.css');
const visual = read('../app/projects/spend-and-save/spend-save-visual.css');

test('Spend & Save imports its static baseline before the cinematic overrides', () => {
  const baselineImport = page.indexOf("import './spend-save-base.css';");
  const cinematicImport = page.indexOf("import './spend-save-visual.css';");
  assert.ok(baselineImport >= 0 && cinematicImport > baselineImport);
  assert.doesNotMatch(page, /<style jsx global>/);
  assert.ok(base.includes('.ss-page{background:'));
  assert.ok(base.includes('.ss-shopper{display:grid'));
  assert.ok(base.includes('@media(max-width:'));
  assert.ok(visual.includes('.ss-page.ss-cinematic{'));
});

test('CSS migration does not alter the simulated rewards or Flow lifecycle', () => {
  assert.ok(page.includes('getRewardProgress(total, thresholds)'));
  assert.ok(page.includes('getEligibleGifts(total, thresholds)'));
  assert.ok(page.includes("const [basket, setBasket] = useState<string[]>([])"));
  assert.ok(page.includes('orderEditCommitted'));
  assert.ok(page.includes('flowStages.length - 1'));
  assert.ok(page.includes('<SpendSaveSystemMap'));
  assert.ok(page.includes('No real orders, emails or Shopify changes occur'));
});
