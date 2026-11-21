// Stage 5 publication guard. Runs without network access or credentials.
// Checks source-level SEO, canonical URLs, internal routes, and known name-based
// exposure. This is not a substitute for checking rendered HTML or indexing.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');
const routes = ['/shopify-developer','/ecommerce-management','/shopify-cro','/shopify-app-development'];
const toFile = (route) => route === '/' ? 'app/page.tsx' : 'app' + route + '/page.tsx';
const allRoutes = [];
function walk(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const path = dir + '/' + entry.name;
    if (entry.isDirectory()) walk(path);
    else if (entry.name === 'page.tsx') allRoutes.push(path);
  }
}
walk('app');

const homepage = read('app/page.tsx');
const sitemap = read('app/sitemap.ts');
const robots = read('app/robots.ts');
const layout = read('app/layout.tsx');
assert.equal(allRoutes.length >= 17, true, 'Expected existing case-study and new service routes');
assert.match(layout, /metadataBase: new URL\('https:\/\/www\.jrvallite\.com'\)/);
assert.doesNotMatch(layout, /alternates:\s*\{\s*canonical:/, 'Root canonical must not point every page to home');
assert.match(homepage, /canonical:\s*'\/'/);
assert.match(robots, /sitemap\.xml/);

// The published analytics engineering case study must stay indexable and in
// the sitemap after future SEO or portfolio changes.
const analyticsCaseStudy = read('app/data-extraction-automation/page.tsx');
assert.ok(sitemap.includes("'/data-extraction-automation'"), 'Analytics case study absent from sitemap');
assert.ok(analyticsCaseStudy.includes("canonical: '/data-extraction-automation'"), 'Analytics case study canonical mismatch');
assert.match(analyticsCaseStudy, /export const metadata/);

for (const route of routes) {
  const source = read(toFile(route));
  assert.match(source, /export const metadata/);
  assert.match(source, /title:/);
  assert.match(source, /description:/);
  assert.ok(source.includes("canonical: '" + route + "'"), route + ' canonical mismatch');
  assert.ok(source.includes("https://www.jrvallite.com" + route), route + ' Open Graph URL missing');
  assert.ok(sitemap.includes("'" + route + "'"), route + ' absent from sitemap');
  // The cinematic homepage renders service links from a typed data array;
  // verify either the data declaration or a direct JSX link.
  assert.ok(homepage.includes("href: '" + route + "'") || homepage.includes('href="' + route + '"'), route + ' not linked from homepage');
  assert.match(source, /ServicePage content=\{content\}/);
}

// Build identifier rules from fragments instead of a searchable personal-name literal.
const given = ['Jo', 'mar'].join('');
const family = ['Val', 'lite'].join('');
const oldResume = new RegExp(given + '-' + family + '-Resume\\.pdf', 'i');
const personalNames = new RegExp('(?:' + given + '|JR)[\\s_-]+' + family, 'i');
for (const file of allRoutes) {
  const source = read(file);
  // A client-only page gets SEO metadata from its adjacent server layout.
  const route = file === 'app/page.tsx' ? '/' : '/' + file.slice('app/'.length, -'/page.tsx'.length);
  const layoutPath = route === '/' ? 'app/page.tsx' : file.slice(0, -'page.tsx'.length) + 'layout.tsx';
  const seoSource = existsSync(join(root, layoutPath)) ? read(layoutPath) : source;
  // A route added separately on main can be deliberately absent from this SEO
  // release's curated sitemap. Check indexed routes strictly, but still scan
  // every route below for sensitive names, removed assets and broken links.
  const listedForIndexing = route === '/' || sitemap.includes("'" + route + "'");
  if (listedForIndexing) {
    assert.ok(seoSource.includes("canonical: '" + route + "'") || (route === '/experience' && seoSource.includes("canonical:'/experience'")), file + ' missing self canonical');
  }
  assert.doesNotMatch(source, personalNames, file + ' contains personal-name content');
  assert.doesNotMatch(source, oldResume, file + ' references removed resume');
  for (const match of source.matchAll(/(?:href|src)=["'](\/[^"'?#]*)/g)) {
    const target = match[1];
    if (target === '/') continue;
    // The two explicit resume designs use a Next.js dynamic segment, but
    // only these fixed, owner-approved variants are valid public targets.
    // Check their real route files and handler exports instead of bypassing
    // internal-link checks for arbitrary dynamic URLs.
    const resume = target.match(/^\/resume\/(classic|modern|ats)(?:\/(pdf|word))?$/);
    if (resume) {
      const expected = resume[2] ? 'app/resume/[design]/[format]/route.ts' : 'app/resume/[design]/page.tsx';
      assert.ok(existsSync(join(root, expected)), file + ' links to missing path ' + target);
      const handler = read(expected);
      assert.ok(resume[2] ? handler.includes('export async function GET') : handler.includes('generateStaticParams'), file + ' resume route missing implementation ' + target);
      continue;
    }
    const expected = target.includes('.') ? 'public' + target : 'app' + target + '/page.tsx';
    assert.ok(existsSync(join(root, expected)), file + ' links to missing path ' + target);
  }
}
assert.equal(existsSync(join(root, 'public/' + given + '-' + family + '-Resume.pdf')), false, 'Removed resume still public');
console.log('SEO source checks passed for ' + allRoutes.length + ' routes, ' + routes.length + ' service pages, metadata and internal link targets.');
