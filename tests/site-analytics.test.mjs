// Guard sitewide Microsoft Clarity and Google Tag Manager integrations against duplicate tags or changed IDs.
// Source checks cannot establish live script requests, recordings, downstream tags or consent compliance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const publicAllowlist = JSON.parse(readFileSync(new URL('../scripts/public-safety-allowlist.json', import.meta.url), 'utf8')).allow;

test('portfolio analytics: Clarity is installed only once in the shared document head', () => {
  const head = layout.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, 'the root layout must include a head section');
  assert.match(head, /id="microsoft-clarity"/);
  assert.match(head, /dangerouslySetInnerHTML/);
  assert.match(head, /https:\/\/www\.clarity\.ms\/tag\//);
  assert.match(head, /\(window, document, "clarity", "script", "zekmhvjftc"\)/);
  assert.equal((layout.match(/id="microsoft-clarity"/g) ?? []).length, 1);
  assert.equal((layout.match(/zekmhvjftc/g) ?? []).length, 1);
  assert.doesNotMatch(layout, /<Script id="microsoft-clarity"/);
  assert.match(layout, /<Analytics \/>/);
});

test('portfolio analytics: GTM is directly inside the head, once per root layout', () => {
  const head = layout.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, 'root layout must include the GTM head section');
  assert.match(head, /<script async src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-KVJVH4VM" \/>/);
  assert.match(head, /dangerouslySetInnerHTML/);
  assert.match(head, /window\.dataLayer = window\.dataLayer \|\| \[\];/);
  assert.match(head, /function gtag\(\)\{dataLayer\.push\(arguments\);\}/);
  assert.match(head, /gtag\('js', new Date\(\)\);/);
  assert.equal((layout.match(/GTM-KVJVH4VM/g) ?? []).length, 1);
  assert.equal((head.match(/<script\b/g) ?? []).length, 3);
  assert.match(head, /id="microsoft-clarity"/);
  assert.match(layout, /<Analytics \/>/);
});

test('portfolio publication safety: only this intentionally public GTM ID is allowlisted', () => {
  assert.ok(publicAllowlist.includes('GTM-KVJVH4VM'));
  assert.deepEqual(publicAllowlist.filter((value) => value.startsWith('GTM-')), ['GTM-KVJVH4VM']);
});
