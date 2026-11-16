// Guard the site's single Microsoft Clarity integration against duplicate tags or a changed project ID.
// This static check cannot validate real network requests, recording behaviour or consent policy.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');

test('portfolio analytics: Microsoft Clarity loads once after interactivity', () => {
  assert.match(layout, /import Script from 'next\/script';/);
  assert.match(layout, /<Script id="microsoft-clarity" strategy="afterInteractive">/);
  assert.match(layout, /https:\/\/www\.clarity\.ms\/tag\//);
  assert.match(layout, /\(window, document, "clarity", "script", "zekmhvjftc"\)/);
  assert.equal((layout.match(/id="microsoft-clarity"/g) ?? []).length, 1);
  assert.equal((layout.match(/zekmhvjftc/g) ?? []).length, 1);
  assert.match(layout, /<Analytics \/>/);
});
