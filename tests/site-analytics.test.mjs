// 20 November 2026: optional analytics must never run before user opt-in.
// This is a source-level regression guard; browser network QA and vendor tag
// review remain necessary before claiming compliance or zero data exposure.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const layout = read('../app/layout.tsx');
const manager = read('../app/components/ConsentManager.tsx');
const privacy = read('../app/privacy/page.tsx');
const allow = JSON.parse(read('../scripts/public-safety-allowlist.json')).allow;

test('third-party analytics scripts are not present in the server-rendered root layout', () => {
  assert.doesNotMatch(layout, /googletagmanager\.com|clarity\.ms\/tag|dangerouslySetInnerHTML|<Analytics\s*\/>/);
  assert.doesNotMatch(layout, /preconnect.*wordpress|s\.wordpress\.com/);
  assert.match(layout, /<ConsentManager\s*\/>/);
  assert.match(layout, /<QuickContactDock\s*\/>/);
});

test('optional GTM, Clarity and Vercel Analytics are only activated with explicit acceptance', () => {
  assert.match(manager, /useState<Choice>\('loading'\)/);
  assert.match(manager, /choice === 'accepted'\) enableExternalAnalytics\(\)/);
  assert.match(manager, /choice === 'accepted' && <Analytics \/>/);
  assert.match(manager, /localStorage\.setItem\(storageKey, value\)/);
  assert.match(manager, /choose\('rejected'\)/);
  assert.match(manager, /choose\('accepted'\)/);
  assert.match(manager, /if \(choice === 'accepted' && value === 'rejected'\)/);
  assert.match(manager, /window\.location\.reload\(\)/);
  assert.match(manager, /googletagmanager\.com\/gtm\.js\?id=GTM-KVJVH4VM/);
  assert.match(manager, /clarity\.ms\/tag\/zekmhvjftc/);
  assert.equal((manager.match(/GTM-KVJVH4VM/g) ?? []).length, 1);
  assert.equal((manager.match(/zekmhvjftc/g) ?? []).length, 1);
});

test('consent documentation reflects the actual opt-in architecture', () => {
  assert.match(privacy, /By default, optional analytics are off/);
  assert.match(privacy, /local storage/);
  assert.match(privacy, /Withdrawing consent reloads the page/);
  assert.match(privacy, /does not guarantee deletion/);
});

test('only the intentionally public GTM ID is allowlisted', () => {
  assert.ok(allow.includes('GTM-KVJVH4VM'));
  assert.deepEqual(allow.filter(value => value.startsWith('GTM-')), ['GTM-KVJVH4VM']);
});
