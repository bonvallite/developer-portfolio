// Rendered production-build SEO regression for the featured interactive labs.
// Runs with Node against the local Next.js server, without third-party crawlers.
// Source-only checks are insufficient: client pages require metadata from their
// server layouts, and the sitemap must contain the published canonical routes.
// Test the locally built Next.js site, not a Vercel preview: the platform
// deliberately adds noindex to previews, irrespective of production metadata.
// Generated résumé attachments are public but must not enter shared caches.
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

// Branded Open Graph preview is generated locally using the maintained JRV palette.
const socialHtml = await readPage('/');
const socialUrl = attr(findTag(socialHtml, 'meta', 'property', 'og:image') || '', 'content');
assert.match(socialUrl, /^https:\/\/www\.jrvallite\.com\/opengraph-image(?:\?.*)?$/,
  'Homepage must expose a first-party Open Graph social image');
const socialCard = await fetch(base + '/opengraph-image');
assert.equal(socialCard.status, 200, 'Generated Open Graph social card route');
assert.match(socialCard.headers.get('content-type') || '', /^image\/png/i,
  'Generated social card must return a PNG');
const xml = await readPage('/sitemap.xml');
for (const check of checks) {
  assert.ok(xml.includes('<loc>https://www.jrvallite.com' + check.path + '</loc>'),
    check.label + ': missing XML sitemap entry');
}
assert.equal(xml.includes('<loc>https://www.jrvallite.com/resume</loc>'), false,
  'Resume is noindex and must stay out of the sitemap');

// 22 Nov 2026: The PR remains draft, but its final production build is
// staged with distinct indexable metadata and a curated sitemap entry.
// Vercel preview builds must instead stay noindex and omit this URL.
// This local Next.js CI build intentionally runs without VERCEL_ENV=preview.
// Preserve all 11 site previews and the original integration case study.
const integratedHome = await readPage('/');
assert.ok(integratedHome.includes('id="systems-lab"'),
  'New server-rendered systems engineering section must appear on homepage');
assert.ok(integratedHome.includes('href="/projects/commerce-integration-engineering"'),
  'Homepage must link to engineering lab');
assert.ok(integratedHome.includes('href="/cartoncloud-integration"'),
  'Original CartonCloud case study must remain linked');
assert.ok(integratedHome.includes('id="websites"'),
  'Approved eleven-website gallery must remain on homepage');
assert.equal((integratedHome.match(/class="jrv2-case-heading"/g) || []).length, 4,
  'All four original selected-work cards must remain');
const integratedLab = await readPage('/projects/commerce-integration-engineering');
const engineeringRobots = attr(findTag(integratedLab, 'meta', 'name', 'robots') || '', 'content');
assert.doesNotMatch(engineeringRobots, /noindex/i,
  'Production-ready local build must allow indexing (Vercel preview differs)');
const engineeringTitle = (integratedLab.split('<title>')[1]?.split('</title>')[0] || '').replaceAll('&amp;', '&');
const engineeringDescription = attr(findTag(integratedLab, 'meta', 'name', 'description') || '', 'content');
const engineeringCanonical = attr(findTag(integratedLab, 'link', 'rel', 'canonical') || '', 'href');
const engineeringOpenGraph = attr(findTag(integratedLab, 'meta', 'property', 'og:url') || '', 'content');
assert.equal(engineeringTitle, 'Custom Shopify App Engineering | Cloudflare Workers | JRV',
  'New app engineering case title must remain focused and distinct');
assert.ok(engineeringTitle.length >= 30 && engineeringTitle.length <= 60,
  'App engineering title must fit normal search snippet budgets');
assert.ok(engineeringDescription.length >= 70 && engineeringDescription.length <= 160,
  'App engineering description must remain informative but concise');
for (const term of ['Shopify app', 'Cloudflare Workers', 'Workers KV', 'fulfilment', 'last-mile']) {
  assert.ok(engineeringDescription.toLowerCase().includes(term.toLowerCase()),
    'Missing targeted app-development concept: ' + term);
}
assert.equal(engineeringCanonical,
  'https://www.jrvallite.com/projects/commerce-integration-engineering',
  'App engineering case study must be self-canonical');
assert.equal(engineeringOpenGraph, engineeringCanonical,
  'App engineering OG URL must match canonical');
assert.ok(xml.includes('<loc>' + engineeringCanonical + '</loc>'),
  'New engineering study must enter production sitemap on publication');
const originalCaseHtml = await readPage('/cartoncloud-integration');
const originalCaseTitle = (originalCaseHtml.split('<title>')[1]?.split('</title>')[0] || '').replaceAll('&amp;', '&');
const originalCaseCanonical = attr(findTag(originalCaseHtml, 'link', 'rel', 'canonical') || '', 'href');
assert.notEqual(engineeringTitle, originalCaseTitle,
  'App engineering and CartonCloud integration pages must have distinct titles');
assert.equal(originalCaseCanonical, 'https://www.jrvallite.com/cartoncloud-integration',
  'The original integration route must retain its canonical');
assert.ok(xml.includes('<loc>' + originalCaseCanonical + '</loc>'),
  'Original integration story must remain indexed in production sitemap');

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


// Release-specific crawler-header guard: public service and portfolio pages
// must stay indexable at source. Vercel adds noindex on *preview* deployments;
// this local Next.js build is the correct place to assess app-level headers.
for (const path of ['/', '/privacy', '/analytics-lab', '/projects/spend-and-save',
  '/b2b-modernisation', '/cartoncloud-integration',
  '/projects/commerce-integration-engineering']) {
  const response = await fetch(base + path, { method: 'HEAD' });
  assert.equal(response.status, 200, path + ': indexable route HEAD status');
  assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i,
    path + ': indexable route incorrectly emits noindex');
}

// Résumé pages and attachments are intentionally accessible for hiring, but
// must request noindex. Content remains public and is not protected by this.
// Generated PDF/Word responses should not be stored in shared edge caches.
for (const path of ['/resume', '/resume/ats', '/resume/classic']) {
  const response = await fetch(base + path, { method: 'HEAD' });
  assert.equal(response.status, 200, path + ': résumé HEAD status');
  assert.match(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i,
    path + ': missing X-Robots-Tag noindex');
}
for (const format of ['pdf', 'word']) {
  for (const design of ['ats', 'classic']) {
    const path = '/resume/' + design + '/' + format;
    const response = await fetch(base + path, { method: 'HEAD' });
    assert.equal(response.status, 200, path + ': generated document HEAD status');
    assert.match(response.headers.get('x-robots-tag') || '', /\bnoindex\b/i,
      path + ': generated document missing noindex');
    assert.match(response.headers.get('x-robots-tag') || '', /\bnoarchive\b/i,
      path + ': generated document missing noarchive');
    assert.match(response.headers.get('cache-control') || '', /\bprivate\b/i,
      path + ': generated document permits shared caching');
    assert.match(response.headers.get('cache-control') || '', /\bno-store\b/i,
      path + ': generated document permits browser caching');
    assert.match(response.headers.get('content-disposition') || '', /\battachment\b/i,
      path + ': generated document is not offered as a download');
    assert.match(response.headers.get('content-type') || '',
      format === 'pdf' ? /^application\/pdf/i : /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/i,
      path + ': wrong document MIME type');
  }
}
// The owner retired the original 2026 PDF binary from the current tree.
// Preserve old bookmarks via a permanent redirect, never the old document.
for (const method of ['HEAD', 'GET']) {
  const response = await fetch(base + '/JRV-Resume.pdf', { method, redirect: 'manual' });
  assert.equal(response.status, 308, 'Original résumé must redirect, not serve a PDF');
  assert.equal(new URL(response.headers.get('location') || '/', base).pathname, '/resume',
    'Retired PDF bookmark must open the approved résumé chooser');
  assert.doesNotMatch(response.headers.get('content-type') || '', /^application\/pdf/i,
    'Retired PDF URL must not serve a PDF');
}
const chooser = await fetch(base + '/resume');
assert.equal(chooser.status, 200, 'ATS/Classic résumé chooser must remain accessible');
const chooserHtml = await chooser.text();
for (const route of ['/resume/ats/pdf', '/resume/classic/pdf']) {
  assert.ok(chooserHtml.includes('href="' + route + '"'),
    'Approved résumé choice missing: ' + route);
}

console.log('Rendered metadata, original résumé retirement redirect, both approved downloads, crawler headers and sitemap regression: PASSED');
