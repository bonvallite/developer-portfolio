// 21 November 2026 regression for the JRV public-safe B2B portfolio.
// Source-level checks defend the original entitlement logic and the new
// interconnected hero and architecture views. Browser QA exercises real state.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const page = read('app/b2b-modernisation/CinematicB2B.tsx');
const inspector = read('app/b2b-modernisation/B2BEntitlementInspector.tsx');
const css = read('app/b2b-modernisation/b2b-showcase.css');
const original = read('app/b2b-modernisation/cinematic.css');

test('hero, architecture, and sample price lab share the exact fictional state', () => {
  assert.match(page, /const \[marketIndex,setMarketIndex\]=useState\(0\)/);
  assert.match(page, /const \[eligible,setEligible\]=useState\(true\)/);
  assert.match(page, /const \[quantity,setQuantity\]=useState\(12\)/);
  assert.match(page, /const qualifies = marketIndex===0 \|\| eligible/);
  assert.match(page, /const applied = qualifies \? requested : markets\[0\]/);
  assert.match(page, /const simulatedSubtotal = applied\.price \* quantity/);
  assert.match(page, /Choose hero pricing context/);
  assert.match(page, /aria-pressed=\{marketIndex===index\}/);
  assert.match(page, /<B2BEntitlementInspector marketIndex=\{marketIndex\} requested=\{requested\}/);
  assert.match(page, /applied=\{applied\} eligible=\{eligible\} quantity=\{quantity\}/);
  assert.match(page, /retailUnitPrice=\{markets\[0\]\.price\} onEligibilityChange=\{setEligible\}/);
  assert.match(page, /Retail fallback · demo/);
});

test('the architecture makes authorisation and checkout boundaries explicit', () => {
  assert.match(inspector, /useState<StepKey>\('catalogue'\)/);
  assert.match(inspector, /aria-pressed=\{step === item\.key\}/);
  assert.match(inspector, /aria-pressed=\{eligible\}/);
  assert.match(inspector, /aria-pressed=\{!eligible\}/);
  assert.match(inspector, /onEligibilityChange\(true\)/);
  assert.match(inspector, /onEligibilityChange\(false\)/);
  assert.match(inspector, /aria-live="polite" aria-atomic="true"/);
  assert.match(inspector, /An application is not an approval/);
  assert.match(inspector, /cannot grant that entitlement/);
  assert.match(inspector, /Actual Shopify access and price visibility may behave differently/);
  assert.match(inspector, /not a quote or a verified Shopify checkout result/);
  assert.match(inspector, /pseudocode, not a real Liquid snippet/);
  assert.match(inspector, /no network calls|No network calls/i);
  assert.doesNotMatch(inspector, /fetch\(|XMLHttpRequest|sendBeacon\(|gtag\(|localStorage|sessionStorage/);
});

test('historical evidence and buyer journey are retained without inventing new results', () => {
  for (const id of ['challenge', 'transformation', 'price-lab', 'buying-journey', 'business-impact']) {
    assert.ok(page.includes('id="' + id + '"'), 'Original chapter missing: ' + id);
  }
  assert.match(page, /The exact order-tag legacy cohort is narrower/);
  assert.match(page, /native:6552\.75/);
  assert.match(page, /legacy:6114\.69/);
  assert.match(page, /must not be added together/);
  assert.match(page, /exact launch date/);
  assert.match(page, /No client pricing or confidential catalogue settings are used/);
  assert.match(page, /onClick=\{\(\)=>setHistoryMode\(tab\.key\)\}/);
  assert.match(page, /setBuyerGroup\('returning'\)/);
});

test('visual upgrade is scoped, accessible, responsive and safe to publish', () => {
  assert.match(page, /b2b-showcase\.css/);
  assert.match(css, /--c-gold:#38c7bc/);
  assert.match(css, /#f28c52/i);
  assert.match(css, /max-width:480px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /focus-visible|outline/);
  assert.match(css, /cb2b-system-code pre/);
  assert.match(original, /cb2b-lab-product/);
  assert.doesNotMatch(css, /https?:\/\/|url\(/);
  assert.doesNotMatch(inspector, /(?:sk_live|shpat_|github_pat_)/);
});
