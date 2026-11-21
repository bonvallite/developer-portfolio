// 21 November 2026 regression for a public-safe Shopify–CartonCloud story.
// The event studio is an explanatory React simulation. Source tests guard the
// failure-state gates and evidence language; browser tests cover interactions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const page = read('app/cartoncloud-integration/page.tsx');
const studio = read('app/cartoncloud-integration/IntegrationLab.tsx');
const studioCss = read('app/cartoncloud-integration/integration-lab.css');
const routeCss = read('app/cartoncloud-integration/cartoncloud-showcase.css');

test('CartonCloud case study separates application and integration evidence', () => {
  assert.match(page, /cc-contributions/);
  assert.match(page, /I built the application layer\./);
  assert.match(page, /I built the integration paths\./);
  assert.match(page, /Successful API reads do not establish successful consignment creation/);
  assert.match(page, /not proof of universal tracking or delivery-date synchronisation/);
  assert.match(page, /CaseStudyContext/);
  assert.match(page, /cartoncloud-showcase\.css/);
  assert.match(page, /<IntegrationLab\s*\/>/);
  assert.match(page, /id="event-studio"|href="#event-studio"/);
  assert.match(page, /\/#work/);
  assert.match(page, /CARTONCLOUD_INTEGRATION\.md/);
});

test('event studio stops at invalid sender or failed Shopify write', () => {
  assert.match(studio, /type Scenario = 'normal' \| 'invalid' \| 'writeFailed'/);
  assert.match(studio, /scenario === 'invalid' \? 1 : scenario === 'writeFailed' \? 4 : null/);
  assert.match(studio, /const blocked = stopAt !== null && step === stopAt/);
  assert.match(studio, /disabled=\{futureBlocked\}/);
  assert.match(studio, /const canAdvance = !blocked && step < stages\.length - 1/);
  assert.match(studio, /setMode\(option\.key\)/);
  assert.match(studio, /setStep\(stopAt === null \? index : Math\.min\(index, stopAt\)\)/);
  assert.match(studio, /Inspect safe recovery/);
  assert.match(studio, /No downstream write or success notification is represented/);
  assert.match(studio, /not a live API trace/i);
  assert.match(studio, /aria-pressed=\{scenario === option\.key\}/);
  assert.match(studio, /aria-live="polite" aria-atomic="true"/);
});

test('public illustrations do not connect to merchant systems or introduce media dependencies', () => {
  assert.doesNotMatch(studio, /fetch\(|navigator\.sendBeacon|XMLHttpRequest|gtag\(|localStorage|sessionStorage/);
  assert.doesNotMatch(studio, /api\.shopify\.com|cartoncloud\.com\/api|authorization:\s*['"]/i);
  assert.match(studio, /No credentials, shop names, order identifiers/);
  assert.match(studioCss, /#38c7bc/i);
  assert.match(studioCss, /#f28c52/i);
  assert.match(routeCss, /--cc-ink:#0b1419/);
  assert.match(studioCss, /prefers-reduced-motion:reduce/);
  assert.match(routeCss, /max-width:490px/);
  assert.doesNotMatch(studioCss + routeCss, /https?:\/\/|url\(/);
});
