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
  const title = html.split('<title>')[1]?.split('</title>')[0] || '';
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
console.log('Rendered flagship metadata and XML sitemap regression: PASSED');
