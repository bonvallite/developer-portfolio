// Regression guard for the cinematic Ember & Teal JRV portfolio and its four flagship labs.
// Source checks complement (but do not replace) real rendered browser QA,
// Lighthouse measurement, confidentiality review or accessibility testing.
// Audience shortcuts must be clear, direct and consent-safe on the first
// screen, without removing either the project studio or résumé route.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

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

test('first-screen visitor paths make Shopify project and hiring goals explicit', () => {
  for (const fragment of [
    'aria-label="Choose how to work together"',
    'className="jrv2-hero-paths"',
    '<a href="#contact" className="jrv2-hero-path">',
    '<Link href="/experience" className="jrv2-hero-path">',
    'ECOMMERCE TEAMS', 'HIRING TEAMS',
    'Discuss a Shopify challenge', 'Review Shopify experience',
    'Cloudflare Workers', 'Python analytics', 'Custom apps',
  ]) {
    assert.ok(home.includes(fragment), 'Homepage hero missing audience or capability: ' + fragment);
  }
  assert.ok(home.indexOf('jrv2-hero-paths') < home.indexOf('id="work"'),
    'First-screen audience paths must precede selected work');
  for (const forbidden of ['jrv2-hero-proof', '<form', 'fetch(', 'sendBeacon(']) {
    assert.ok(!home.includes(forbidden), 'Unexpected hero decoration or data submission: ' + forbidden);
  }
  for (const fragment of [
    '.jrv2-hero-paths{', '.jrv2-hero-path{',
    'grid-template-columns:minmax(0,1fr)',
    'min-height:75px', '.jrv2-hero-path:hover',
  ]) {
    assert.ok(css.includes(fragment), 'Missing responsive or interactive path CSS: ' + fragment);
  }
});

test('published storefronts are visible on the cinematic homepage and shared with experience', () => {
  const list = read('app/data/storefronts.ts');
  const experience = read('app/experience/page.tsx');
  const gallery = read('app/experience/StorefrontShowcase.tsx');
  const image = read('app/experience/StorefrontPreview.tsx');
  const captures = read('scripts/capture-storefronts.mjs');
  const entries = [...list.matchAll(/^\s*\['([^']+)',\s*'(https:\/\/[^']+)'\],?$/gm)];
  assert.equal(entries.length, 11, 'Eleven owner-approved live storefronts');
  assert.equal(new Set(entries.map(x => x[1])).size, 11, 'Storefront names unique');
  assert.equal(new Set(entries.map(x => x[2])).size, 11, 'Storefront URLs unique');
  for (const [, name, url] of entries) {
    assert.ok(captures.includes("'" + name + "'"), name + ': capture workflow missing');
    assert.ok(home.includes('storefronts.map(([name, url], index)'), name + ': public homepage list missing');
    assert.match(url, /^https:\/\//);
  }
  assert.ok(!list.includes("['Skull Seeker'"), 'Retired site must stay excluded');
  assert.ok(home.includes('id="websites"') && home.includes('<StorefrontShowcase stores={storefronts}/>'));
  assert.ok(home.includes('href="#websites"'));
  assert.ok(home.includes('All 11 websites'));
  assert.ok(home.includes('href="/experience#storefronts"'));
  assert.ok(experience.includes('id="storefronts"'));
  assert.ok(experience.includes('<StorefrontShowcase stores={secondaryStorefronts}/>'));
  assert.ok(experience.includes('StorefrontPreview name="Peter Augustus"'));
  assert.ok(gallery.includes('StorefrontPreview name={name} url={url}'));
  assert.ok(image.includes('loading="lazy"') && image.includes('onError={recoverImage}') && image.includes('approvedStaticStorefrontShot'));
  assert.ok(image.includes('View live site'), 'Screenshot errors must preserve navigation');
  assert.ok(image.includes("previous === 'static' ? 'remote' : 'failed'"), 'Local to cached to live-site fallback');
  assert.ok(list.includes("slug === 'axlrodd' && device === 'desktop'"), 'Exclude incomplete captured desktop view');
  assert.ok(css.includes('.jrv2-websites-links{'));
  assert.ok(css.includes('grid-template-columns:minmax(0,1fr)'));
  assert.ok(globalCss.includes('.cinematic-showcase'));
  assert.ok(globalCss.includes('background:var(--jrv-surface)'));
});

test('all 21 imported public homepage captures match archived source checksums', () => {
  // The importer was temporary and must not survive into the release branch.
  assert.ok(!existsSync(new URL('../.github/workflows/import-storefront-captures.yml', import.meta.url)),
    'Do not retain the temporary contents-write capture workflow');
  const provenance = JSON.parse(read('public/portfolio/storefronts/capture-provenance.json'));
  assert.equal(provenance.sourceRun, 44490966868, 'Screenshots must come from the known public capture run');
  assert.equal(provenance.assets.length, 21, 'Only reviewed screenshot positions should be published');
  assert.match(provenance.excluded, /axlrodd-desktop/);
  const filenames = new Set();
  for (const image of provenance.assets) {
    assert.match(image.filename, /^[a-z0-9-]+-(?:desktop|mobile)\.webp$/);
    assert.ok(!filenames.has(image.filename), 'Duplicate homepage preview file');
    filenames.add(image.filename);
    const file = readFileSync(new URL('../public/portfolio/storefronts/' + image.filename, import.meta.url));
    assert.equal(file.length, image.size, image.filename + ': unexpected image size');
    assert.equal(createHash('sha256').update(file).digest('hex'), image.sha256,
      image.filename + ': changed screenshot requires provenance/visual review');
  }
  assert.ok(!filenames.has('axlrodd-desktop.webp'), 'Incomplete Axlrodd desktop capture must remain excluded');
});
