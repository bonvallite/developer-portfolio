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

// 21 Nov post-release crawl: seven titles and five descriptions exceeded
// the crawler's suggested snippet lengths. Assert on rendered HTML rather
// than source literals so the root Next.js branding suffix is counted.
// Noindex résumé pages intentionally stay out of search and the sitemap.
const auditedSnippets = [
  ['/', 'Shopify Developer, Ecommerce Management & CRO', ['Shopify', 'CRO', 'B2B']],
  ['/b2b-modernisation', 'Shopify B2B Modernisation | Markets & Catalogues', ['Shopify', 'B2B', 'Catalogues']],
  ['/cartoncloud-integration', 'Shopify CartonCloud Integration & Delivery App', ['Shopify', 'CartonCloud', 'fulfilment']],
  ['/data-extraction-automation', 'Ecommerce Data Engineering | Python & APIs', ['ecommerce', 'Python', 'API']],
  ['/eve-curls', 'Shopify Markets | European Localisation Case Study', ['Shopify', 'European', 'fictional']],
  ['/python-automation', 'Python Automation for Ecommerce & Data Workflows', ['Python', 'CSV', 'ecommerce']],
  ['/shipping-integration', 'Shopify Cold-Chain Shipping & Subscriptions', ['Shopify', 'Recharge', 'Zapiet']],
  ['/shopify-flow', 'Shopify Flow: Rewards & Operations Automation', ['Shopify', 'loyalty', 'automation']],
  ['/shopify-developer', 'Shopify Developer | Liquid, Themes & B2B', ['Shopify', 'Liquid', 'B2B']],
];
const seenRenderedTitles = new Set();
const seenRenderedDescriptions = new Set();
for (const [path, expectedBaseTitle, requiredDescriptionTerms] of auditedSnippets) {
  const html = await readPage(path);
  const renderedTitle = (html.split('<title>')[1]?.split('</title>')[0] || '').replaceAll('&amp;', '&');
  const description = attr(findTag(html, 'meta', 'name', 'description') || '', 'content');
  const canonical = attr(findTag(html, 'link', 'rel', 'canonical') || '', 'href');
  const expectedTitle = expectedBaseTitle + (path === '/' ? '' : ' | JRV');
  assert.equal(renderedTitle, expectedTitle, path + ': unexpected title or brand suffix');
  assert.ok(renderedTitle.length >= 30 && renderedTitle.length <= 60,
    path + ': rendered title should be 30–60 characters, got ' + renderedTitle.length);
  assert.ok(description.length >= 70 && description.length <= 160,
    path + ': rendered description should be 70–160 characters, got ' + description.length);
  // Next.js may serialise the homepage canonical with or without the final
  // slash; comparing parsed URLs checks identity without rewriting metadata.
  assert.equal(new URL(canonical).href, new URL('https://www.jrvallite.com' + path).href,
    path + ': canonical changed');
  assert.ok(!seenRenderedTitles.has(renderedTitle), path + ': duplicated title');
  assert.ok(!seenRenderedDescriptions.has(description), path + ': duplicated description');
  seenRenderedTitles.add(renderedTitle);
  seenRenderedDescriptions.add(description);
  for (const term of requiredDescriptionTerms) {
    assert.ok(description.toLowerCase().includes(term.toLowerCase()),
      path + ': search-intent keyword missing from description: ' + term);
  }
  if (path === '/shopify-developer') {
    const ogDescription = attr(findTag(html, 'meta', 'property', 'og:description') || '', 'content');
    assert.equal(ogDescription, description, 'Shopify service description must match Open Graph');
  }
}
for (const path of ['/resume', '/resume/ats', '/resume/classic']) {
  const html = await readPage(path);
  const robots = attr(findTag(html, 'meta', 'name', 'robots') || '', 'content');
  assert.match(robots, /noindex/, path + ': public résumé privacy noindex must remain');
  assert.ok(!xml.includes('<loc>https://www.jrvallite.com' + path + '</loc>'),
    path + ': intentionally noindex résumé route appeared in sitemap');
}

console.log('Rendered metadata, concise SEO snippets and XML sitemap regression: PASSED');
