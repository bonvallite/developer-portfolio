// Guard sitewide Microsoft Clarity and Google Tag Manager integrations against duplicate tags or changed IDs.
// Static checks cannot establish live network requests, recording behaviour, conversion tags or consent compliance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const publicAllowlist = JSON.parse(readFileSync(new URL('../scripts/public-safety-allowlist.json', import.meta.url), 'utf8')).allow;

test('portfolio analytics: Microsoft Clarity loads once after interactivity', () => {
  assert.match(layout, /import Script from 'next\/script';/);
  assert.match(layout, /<Script id="microsoft-clarity" strategy="afterInteractive">/);
  assert.match(layout, /https:\/\/www\.clarity\.ms\/tag\//);
  assert.match(layout, /\(window, document, "clarity", "script", "zekmhvjftc"\)/);
  assert.equal((layout.match(/id="microsoft-clarity"/g) ?? []).length, 1);
  assert.equal((layout.match(/zekmhvjftc/g) ?? []).length, 1);
  assert.match(layout, /<Analytics \/>/);
});

test('portfolio analytics: GTM loads once in the initial document head', () => {
  assert.match(layout, /<Script id="google-tag-datalayer" strategy="beforeInteractive">/);
  assert.match(layout, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(layout, /function gtag\(\)\{dataLayer\.push\(arguments\);\}/);
  assert.match(layout, /gtag\('js', new Date\(\)\);/);
  assert.match(layout, /id="google-tag-manager"\s+strategy="beforeInteractive"\s+src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-KVJVH4VM"/);
  assert.equal((layout.match(/GTM-KVJVH4VM/g) ?? []).length, 1);
  assert.equal((layout.match(/id="google-tag-manager"/g) ?? []).length, 1);
  assert.equal((layout.match(/id="google-tag-datalayer"/g) ?? []).length, 1);
  assert.match(layout, /<Script id="microsoft-clarity" strategy="afterInteractive">/);
  assert.match(layout, /<Analytics \/>/);
});

test('portfolio publication safety: only this intentionally public GTM ID is allowlisted', () => {
  assert.ok(publicAllowlist.includes('GTM-KVJVH4VM'));
  assert.deepEqual(publicAllowlist.filter((value) => value.startsWith('GTM-')), ['GTM-KVJVH4VM']);
});
