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

for (const route of routes) {
  const source = read(toFile(route));
  assert.match(source, /export const metadata/);
  assert.match(source, /title:/);
  assert.match(source, /description:/);
  assert.ok(source.includes("canonical: '" + route + "'"), route + ' canonical mismatch');
  assert.ok(source.includes("https://www.jrvallite.com" + route), route + ' Open Graph URL missing');
  assert.ok(sitemap.includes("'" + route + "'"), route + ' absent from sitemap');
  assert.ok(homepage.includes('href="' + route + '"'), route + ' not linked from homepage');
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
  assert.ok(seoSource.includes("canonical: '" + route + "'") || (route === '/experience' && seoSource.includes("canonical:'/experience'")), file + ' missing self canonical');
  assert.ok(route === '/' || sitemap.includes("'" + route + "'"), file + ' absent from sitemap');
  assert.doesNotMatch(source, personalNames, file + ' contains personal-name content');
  assert.doesNotMatch(source, oldResume, file + ' references removed resume');
  for (const match of source.matchAll(/(?:href|src)=["'](\/[^"'?#]*)/g)) {
    const target = match[1];
    if (target === '/') continue;
    const expected = target.includes('.') ? 'public' + target : 'app' + target + '/page.tsx';
    assert.ok(existsSync(join(root, expected)), file + ' links to missing path ' + target);
  }
}
assert.equal(existsSync(join(root, 'public/' + given + '-' + family + '-Resume.pdf')), false, 'Removed resume still public');
console.log('SEO source checks passed for ' + allRoutes.length + ' routes, ' + routes.length + ' service pages, metadata and internal link targets.');
