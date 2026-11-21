// Regression guard for the cinematic Ember & Teal JRV portfolio and its four flagship labs.
// Source checks complement (but do not replace) real rendered browser QA,
// Lighthouse measurement, confidentiality review or accessibility testing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const home = read('app/page.tsx');
const studio = read('app/components/CommerceWorkbench.tsx');
const studioCss = read('app/components/commerce-workbench.css');
const css = read('app/cinematic-home.css');
const globalCss = read('app/globals.css');
const journey = read('app/components/HomeJourney.tsx');
const leads = read('app/components/LeadComposer.tsx');
const dock = read('app/components/QuickContactDock.tsx');
const headers = read('next.config.ts');

test('cinematic homepage includes one service-led hero and clear navigation targets', () => {
  assert.match(home, /<h1 id="jrv2-title">/);
  assert.equal((home.match(/<h1/g) ?? []).length, 1, 'Exactly one homepage H1');
  for (const id of ['home','work','services','approach','hiring','about','contact']) {
    assert.ok(home.includes('id="' + id + '"'), 'Missing section #' + id);
  }
  assert.match(home, /Start a conversation/);
  assert.match(home, /Explore my work/);
  assert.match(home, /View résumé options/);
  assert.match(home, /<LeadComposer\s*\/>/);
  assert.match(home, /<HomeJourney\s*\/>/);
});

test('all four hiring and client service pages remain linked and routable', () => {
  for (const route of ['/shopify-developer','/ecommerce-management','/shopify-cro','/shopify-app-development']) {
    assert.ok(home.includes("href: '" + route + "'"), route + ' missing from service map');
    assert.ok(existsSync(new URL('../app' + route + '/page.tsx', import.meta.url)), route + ' page missing');
  }
});

test('selected evidence remains linked with honest fictional / verified distinctions', () => {
  for (const route of ['/projects/spend-and-save', '/analytics-lab', '/cartoncloud-integration', '/b2b-modernisation', '/experience', '/resume']) {
    assert.ok(home.includes(route), 'Case-study/hiring route missing ' + route);
  }
  assert.match(home, /fictional dashboard data/);
  assert.ok(existsSync(new URL('../app/analytics-lab/page.tsx', import.meta.url)), 'Interactive Python lab missing');
  assert.match(home, /Independent interactive demonstration/);
  assert.doesNotMatch(home, /client secret|real customer email|million in revenue/i);
});

test('homepage is fast-first and animates without large external hero payloads', () => {
  assert.match(home, /<CommerceWorkbench\s*\/>/);
  assert.match(studio, /jrv2-console jrv2-workbench/);
  assert.doesNotMatch(home, /<Image\b|<video\b|<iframe\b|<RotationArchive\b/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /max-width:720px/);
  assert.match(css, /max-width:490px/);
  assert.doesNotMatch(globalCss, /fonts\.googleapis\.com/);
  assert.doesNotMatch(home, /fonts\.googleapis\.com|google\.com\/s2\/favicons/);
  assert.doesNotMatch(studio, /fetch\(|sendBeacon\(|localStorage|sessionStorage|gtag\(/);
  assert.match(studioCss, /prefers-reduced-motion:reduce/);
});

test('project studio demonstrates four genuine, fictional client-side interactions', () => {
  for (const route of ['/projects/spend-and-save', '/analytics-lab', '/cartoncloud-integration', '/b2b-modernisation']) {
    assert.ok(studio.includes(route), 'Studio deep link missing: ' + route);
  }
  assert.match(studio, /useState<Demo>\('rewards'\)/);
  assert.match(studio, /aria-pressed=\{mode === project\.key\}/);
  assert.match(studio, /aria-valuenow=\{Math\.min\(basket, 300\)\}/);
  assert.match(studio, /setDataSource\(key\)/);
  assert.match(studio, /setEventStep\(index => \(index \+ 1\) % eventSteps\.length\)/);
  assert.match(studio, /const weight = cutA \* 750 \+ cutB \* 1200/);
  assert.match(studio, /const subtotal = cutA \* 2800 \+ cutB \* 3000/);
  assert.match(studio, /const saving = Math\.round\(subtotal \* discount \/ 100\)/);
  assert.match(studio, /FICTIONAL DATASET/);
  assert.match(studio, /NOT A LIVE STORE/);
  assert.match(studio, /aria-live="polite"/);
  assert.match(home, /jrv2-case-stack/);
  assert.match(studioCss, /--wb-orange:#f28c52/);
  assert.match(studioCss, /--wb-teal:#38c7bc/);
});

test('storytelling and lead capture are interactive without collecting visitor data', () => {
  assert.match(journey, /useState\(0\)/);
  assert.match(journey, /aria-pressed=\{index === activeIndex\}/);
  assert.match(leads, /useState<keyof typeof choices>/);
  assert.match(leads, /mailto:/);
  assert.match(leads, /navigator\.clipboard\.writeText/);
  assert.match(leads, /maxLength=\{600\}/);
  assert.doesNotMatch(leads, /fetch\(|localStorage|analytics\.track|gtag\(/);
  assert.match(dock, /handledRoutes\.has\(pathname\)/);
  assert.match(dock, /window\.scrollY > Math\.max\(560/);
  assert.match(dock, /mailto:hello@jrvallite\.com/);
});

// Guard that choosing another approach stage announces its heading only,
// rather than re-reading the entire decorative workflow to screen readers.
test('journey only announces its selected step heading when changed', () => {
  assert.match(journey, /<h3 aria-live="polite" aria-atomic="true">\{active\.title\}<\/h3>/);
  assert.doesNotMatch(journey, /<div className="jrv2-journey-display" aria-live=/);
});

test('common response headers reduce referrer, framing and device exposure', () => {
  assert.match(headers, /'Referrer-Policy', value: 'no-referrer'/);
  assert.match(headers, /'X-Content-Type-Options', value: 'nosniff'/);
  assert.match(headers, /'X-Frame-Options', value: 'DENY'/);
  assert.match(headers, /'Permissions-Policy'/);
  assert.match(headers, /source: '\/resume\/:path\*'/);
  assert.match(headers, /source: '\/case-studies\/ecommerce-analytics\/:path\*'/);
});
