// Rendered production-build SEO regression for the featured interactive labs.
// Runs with Node against the local Next.js server, without third-party crawlers.
// Source-only checks are insufficient: client pages require metadata from their
// server layouts, and the sitemap must contain the published canonical routes.
import assert from 'node:assert/strict';

const base = process.env.SEO_TEST_BASE_URL || 'http://127.0.0.1:3100';

async function readPage(path) {
  for (let attempt = 0; attempt < 30; attempt++) {
    let response;
    try {
      response = await fetch(base + path);
    } catch (error) {
      if (attempt === 29) throw error;
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    assert.equal(response.status, 200, path + ' must return HTTP 200');
    return response.text();
  }
  throw new Error('Local Next.js server unavailable');
}

const attr = (tag, name) => tag.match(new RegExp('(?:^|\\s)' + name + '="([^"]*)"'))?.[1] || '';
function findTag(html, tagName, name, value) {
  return (html.match(new RegExp('<' + tagName + '\\b[^>]*>', 'g')) || [])
    .find(tag => attr(tag, name) === value);
}

const checks = [
  { path: '/analytics-lab', title: 'Shopify Analytics Lab', label: 'Python analytics lab' },
  { path: '/projects/spend-and-save', title: 'Shopify Spend & Save Rewards', label: 'Spend & Save demo' },
  { path: '/b2b-modernisation', title: 'Shopify B2B Modernisation', label: 'B2B modernisation' },
];
const titles = new Set();
const descriptions = new Set();
for (const check of checks) {
  const html = await readPage(check.path);
  const title = (html.split('<title>')[1]?.split('</title>')[0] || '').replaceAll('&amp;', '&');
  const description = attr(findTag(html, 'meta', 'name', 'description') || '', 'content');
  const canonical = attr(findTag(html, 'link', 'rel', 'canonical') || '', 'href');
  const openGraphUrl = attr(findTag(html, 'meta', 'property', 'og:url') || '', 'content');
  assert.ok(title.includes(check.title), check.label + ': wrong rendered title');
  assert.ok(description.length >= 70, check.label + ': missing meaningful rendered description');
  assert.equal(canonical, 'https://www.jrvallite.com' + check.path,
    check.label + ': wrong canonical URL');
  if (check.path !== '/b2b-modernisation') {
    assert.equal(openGraphUrl, canonical, check.label + ': wrong OG URL');
  }
  assert.equal(titles.has(title), false, check.label + ': duplicate rendered title');
  assert.equal(descriptions.has(description), false, check.label + ': duplicate rendered description');
  titles.add(title);
  descriptions.add(description);
}

const xml = await readPage('/sitemap.xml');
for (const check of checks) {
  assert.ok(xml.includes('<loc>https://www.jrvallite.com' + check.path + '</loc>'),
    check.label + ': missing XML sitemap entry');
}
assert.equal(xml.includes('<loc>https://www.jrvallite.com/resume</loc>'), false,
  'Resume is noindex and must stay out of the sitemap');
// Audit 21 Nov: the CSS lab was in the sitemap but lacked an internal link,
// while the weight-based B2B demo had insufficient server-visible context.
// Guard rendered HTML so crawl visibility cannot regress silently.
const experienceHtml = await readPage('/experience');
assert.ok(experienceHtml.includes('href="/css-lab"'),
  'The experience page must link directly to the CSS learning lab');
const cssLabHtml = await readPage('/css-lab');
assert.ok(cssLabHtml.includes('CSS, beyond the'), 'CSS lab heading must render on the server');
const b2bHtml = await readPage('/b2b-demo');
for (const phrase of [
  'How the weight-based calculation works',
  'What a real Shopify B2B build needs',
  'Worked example:',
  '5.4 kg',
  'The page deliberately stops at a testable calculation',
]) {
  assert.ok(b2bHtml.includes(phrase), '/b2b-demo must render explanation: ' + phrase);
}
assert.ok(b2bHtml.includes('href="/b2b-modernisation"'),
  'B2B demo must link to its distinct architecture case study');

console.log('Rendered flagship metadata and XML sitemap regression: PASSED');
