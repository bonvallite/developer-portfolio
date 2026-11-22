// JRV portfolio colour-system regression, 22 November 2026.
// Checks only public, active presentation code. It does not alter sample data,
// client demos, privacy permissions, or the functionality of résumé exports.
// A distinct light editorial canvas / paper résumé remains readable; their
// public-site accents still use the same teal-and-ember brand family.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const globalCss = read('app/globals.css');
const homeCss = read('app/cinematic-home.css');
const serviceCss = read('app/components/cinematic-service.css');
const resumeCss = read('app/resume/resume.css');
const editorialCss = read('app/editorial-homepage-demo/demo.module.css');
const icon = read('app/icon.svg');
const activeFiles = [
  'app/globals.css', 'app/cinematic-home.css',
  'app/components/cinematic-service.css',
  'app/data-extraction-automation/page.tsx',
  'app/data-extraction-automation/visual-demo.css',
  'app/css-lab/css-lab.module.css',
  'app/b2b-demo/page.tsx',
  'app/python-automation/page.tsx',
  'app/privacy/page.tsx',
  'app/projects/spend-and-save/spend-save-base.css',
  'app/b2b-modernisation/cinematic.css',
  'app/b2b-modernisation/b2b-showcase.css',
  'app/resume/resume.css',
  'app/resume/resume-export.ts',
  'app/editorial-homepage-demo/demo.module.css',
  'public/portfolio/eve-curls-markets.svg',
];
test('shared site has one documented obsidian teal and ember palette', () => {
  assert.match(globalCss, /--jrv-bg:#0b1419/);
  assert.match(globalCss, /--jrv-teal:#38c7bc/);
  assert.match(globalCss, /--jrv-ember:#f28c52/);
  assert.match(globalCss, /--jrv-fg:#eaf4f3/);
  assert.match(globalCss, /\.primary\{background:var\(--jrv-ember\);color:var\(--jrv-bg\)\}/);
  assert.match(serviceCss, /\.jrv-svc\{background:var\(--jrv-bg\);color:var\(--jrv-fg\)/);
  assert.match(serviceCss, /background:var\(--jrv-ember\)/);
  assert.match(homeCss, /--jrv-teal:#38c7bc/);
  assert.doesNotMatch(homeCss, /--jrv-gold:/);
});
test('previous brand gold is absent from the active site styles', () => {
  const retiredColours = /#(?:d9b47c|947a41|e2b33c|ddb981|e6bc80|dfba86|d7ac74|cfa06b|b99461)\b/i;
  for (const path of activeFiles) {
    const contents = read(path);
    assert.doesNotMatch(contents, retiredColours, path + ' still uses old JRV gold/bronze');
  }
});
test('illustrative editorial and résumé layouts retain independent reading surfaces', () => {
  assert.match(editorialCss, /--cream:#edf6f4/);
  assert.match(editorialCss, /--ember:#f28c52/);
  assert.match(editorialCss, /--forest:#102b35/);
  assert.match(resumeCss, /\.resume-paper\.paper-classic/);
  assert.match(resumeCss, /\.resume-paper\.paper-modern/);
  assert.match(resumeCss, /#f28c52/);
  assert.match(resumeCss, /#17636b/);
  assert.match(read('app/resume/resume-export.ts'), /subtle JRV ember rules/);
});
test('indexed favicon keeps approved 64px JRV artwork format and transparent palette', () => {
  assert.match(icon, /JRV developer portfolio favicon, electric teal on obsidian/);
  const base64 = icon.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)?.[1];
  assert.ok(base64, 'Favicon must embed a self-contained indexed PNG');
  const bytes = Buffer.from(base64, 'base64');
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const chunks = new Map();
  let position = 8;
  while (position < bytes.length) {
    const length = bytes.readUInt32BE(position);
    const type = bytes.toString('ascii', position + 4, position + 8);
    chunks.set(type, bytes.subarray(position + 8, position + 8 + length));
    position += 12 + length;
  }
  assert.equal(chunks.get('IHDR')?.readUInt32BE(0), 64);
  assert.equal(chunks.get('IHDR')?.readUInt32BE(4), 64);
  assert.equal(chunks.get('PLTE')?.length, 96);
  assert.equal(chunks.get('tRNS')?.length, 32);
  assert.ok(chunks.has('IDAT'), 'Approved icon artwork is still embedded');
  const colours = chunks.get('PLTE');
  assert.equal(colours.subarray(0, 3).toString('hex'), '0b1419');
  assert.equal(colours.subarray(10 * 3, 10 * 3 + 3).toString('hex'), '38c7bc');
  assert.notEqual(colours.subarray(10 * 3, 10 * 3 + 3).toString('hex'), 'd9b47c');
});

// A permanent design-system contract guards future changes. The dated palette
// note is historical; docs/JRV_DESIGN_SYSTEM.md must reflect the real :root.
test('living design system documents every canonical JRV CSS token and its value', () => {
  const guide = read('docs/JRV_DESIGN_SYSTEM.md');
  const rootTokens = globalCss.match(/:root\{([^}]*)\}/)?.[1] || '';
  const source = [...rootTokens.matchAll(/(--jrv-[a-z-]+):\s*(#[0-9a-f]{6})\b/gi)];
  assert.equal(source.length, 10, 'Update the living design system whenever token inventory changes');
  const names = new Set();
  const tick = String.fromCharCode(96);
  for (const [, name, hex] of source) {
    assert.ok(!names.has(name), name + ': duplicated CSS token');
    names.add(name);
    const pattern = new RegExp('\\|\\s*' + tick + name + tick +
      '\\s*\\|\\s*' + tick + '(#[A-Fa-f0-9]{6})' + tick + '\\s*\\|', 'g');
    const rows = [...guide.matchAll(pattern)];
    assert.equal(rows.length, 1, name + ': expected exactly one living design-system row');
    assert.equal(rows[0][1].toLowerCase(), hex.toLowerCase(),
      name + ': code ' + hex + ' differs from design-system document ' + rows[0][1]);
  }
  assert.match(guide, /## Required process for every future visual update/);
  assert.match(guide, /## Design-system history \(maintained\)/);
});
test('contributor instructions always point back to the living JRV design system', () => {
  for (const path of [
    'AGENTS.md', 'README.md', 'CONTRIBUTING.md',
    'ENGINEERING_STANDARDS.md', '.github/pull_request_template.md',
  ]) {
    assert.ok(read(path).includes('docs/JRV_DESIGN_SYSTEM.md'),
      path + ': missing maintained brand design-system reference');
  }
});
