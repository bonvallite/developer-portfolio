// Public case-study safety and structure guard, 24 November 2026.
// Source checks are not a substitute for responsive browser and accessibility QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = 'app/projects/storefront-engineering/';
const page = readFileSync(root + 'page.tsx', 'utf8');
const css = readFileSync(root + 'storefront-engineering.css', 'utf8');
const layout = readFileSync(root + 'layout.tsx', 'utf8');
test('case study offers the three local interactive views', () => {
  for (const value of ['homepage','navigation','product']) assert.ok(page.includes(value));
  assert.match(page,/aria-expanded/);
  assert.match(page,/aria-pressed/);
  assert.match(page,/role="status"/);
});
test('public demonstration avoids private data and external integrations', () => {
  assert.doesNotMatch(page,/fetch\s*\(|localStorage|sessionStorage|api\.shopify|admin\.shopify|myshopify\.com|PA00\d{4}/);
  assert.match(page,/fictional examples/);
  assert.match(page,/cannot confirm a shipping zone/);
});
test('design system and responsive safeguards', () => {
  assert.match(css,/var\(--jrv-teal/);
  assert.match(css,/var\(--jrv-ember/);
  assert.match(css,/@media\(max-width:720px\)/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(layout,/canonical: '\/projects\/storefront-engineering'/);
});
