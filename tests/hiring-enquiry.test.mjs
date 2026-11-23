// Contract checks for distinct merchant and hiring contact journeys.
// These are source assertions, not evidence of real email delivery or a
// qualified lead. Browser QA verifies activation and mobile layout separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const service = read('app/components/ServicePage.tsx');
const css = read('app/components/cinematic-service.css');
const composer = read('app/components/LeadComposer.tsx');
const experience = read('app/experience/page.tsx');

test('all four service routes preserve specific canonicals and the shared enquiry journey', () => {
  for (const route of ['shopify-developer','ecommerce-management','shopify-cro','shopify-app-development']) {
    const source = read('app/' + route + '/page.tsx');
    assert.ok(source.includes("canonical: '/" + route + "'"), route + ': canonical missing');
    assert.match(source, /<ServicePage content=\{content\} \/>/);
  }
  assert.equal((service.match(/data-jrv-intent="hiring"/g) || []).length, 2);
  assert.equal((service.match(/data-jrv-intent="project"/g) || []).length, 3);
  assert.match(service, /data-jrv-source="service_page"/);
  assert.match(service, /const hiringEnquiry = 'mailto:hello@jrvallite.com/);
  assert.match(service, /Role title:/);
  assert.match(service, /Employment arrangement:/);
  assert.match(service, /Discuss a hiring role/);
  assert.match(service, /Discuss a Shopify project/);
  assert.match(service, /jrv-svc-contact-routes/);
  assert.match(service, /href="#examples"/);
  assert.doesNotMatch(service, /fetch\(|sendBeacon\(|gtag\(/);
});

test('hiring links reach an existing client-side composer without placing a brief in URLs', () => {
  assert.ok(experience.includes('href="/?intent=hiring#contact"'));
  assert.match(experience, /FOR HIRING TEAMS \/ NEXT STEP/);
  assert.match(composer, /new URLSearchParams\(window\.location\.search\)\.get\('intent'\) === 'hiring'/);
  assert.match(composer, /setIntent\('role'\)/);
  assert.match(composer, /intent === 'role' \? 'Tell me about the role\.'/);
  assert.match(composer, /href=\{safeMailto\}/);
  assert.match(composer, /selected\.questions \+ \(brief\.trim\(\)/);
  assert.doesNotMatch(composer, /localStorage|fetch\(|sendBeacon\(|gtag\(/);
  assert.doesNotMatch(experience, /previews are supplied by a third-party screenshot service/i);
});

test('new hiring and project options retain the maintained JRV palette and responsive targets', () => {
  assert.match(css, /jrv-svc-contact-routes\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /jrv-svc-contact-routes\{grid-template-columns:1fr\}/);
  assert.match(css, /min-height:48px/);
  assert.match(css, /var\(--jrv-surface\)/);
  assert.match(css, /var\(--jrv-teal-light\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
