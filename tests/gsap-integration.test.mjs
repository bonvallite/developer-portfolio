// Source contract for the first JRV GSAP enhancement.
// These checks supplement, not replace, Next.js/TS and real Chrome QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const pkg = JSON.parse(read('package.json'));
const home = read('app/page.tsx');
const component = read('app/components/GsapHeroMotion.tsx');
const css = read('app/cinematic-home.css');
const guide = read('docs/GSAP_INTEGRATION.md');

test('official stable GSAP dependencies are pinned rather than beta', () => {
  assert.equal(pkg.dependencies.gsap, '3.15.1');
  assert.equal(pkg.dependencies['@gsap/react'], '2.1.2');
});

test('hero preserves rendered markup while motion is client-scoped and cleaned up', () => {
  assert.match(home, /import GsapHeroMotion from '\.\/components\/GsapHeroMotion'/);
  assert.match(home, /<GsapHeroMotion>/);
  assert.match(home, /<\/GsapHeroMotion>/);
  assert.equal((home.match(/<h1 id="jrv2-title">/g) || []).length, 1);
  assert.match(component, /^'use client';/);
  assert.match(component, /gsap\.registerPlugin\(useGSAP\)/);
  assert.match(component, /useGSAP\(\(\) =>/);
  assert.match(component, /\{ scope \}/);
  assert.match(component, /gsap\.matchMedia\(\)/);
  assert.match(component, /prefers-reduced-motion: no-preference/);
  assert.match(component, /querySelectorAll<HTMLElement>/);
  assert.match(component, /clearProps: 'transform'/);
  assert.match(component, /return \(\) => media\.revert\(\)/);
  assert.match(component, /className="jrv2-hero-copy"/);
});

test('progressive animation adds no content hiding or visitor data channel', () => {
  // Comments may explain why ScrollTrigger is deliberately not installed;
  // only executable imports/registrations must be absent in this first phase.
  assert.doesNotMatch(component, /opacity\s*:|visibility\s*:|display\s*:|localStorage|fetch\(|sendBeacon|gtag\(|dataLayer|setTimeout/);
  assert.doesNotMatch(component, /import[^\n]*ScrollTrigger|registerPlugin\s*\(\s*ScrollTrigger/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /client-only GSAP v3 entrance/);
  assert.match(guide, /No production deployment/);
  assert.match(guide, /useGSAP/);
});
