// Privacy layout and keyboard contract for the JRV portfolio.
// Consent remains opt-in; these checks do not validate external vendor settings,
// legal compliance, actual network tags or real-world lead conversion.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const manager = read('app/components/ConsentManager.tsx');
const layout = read('app/layout.tsx');
const styles = read('app/components/consent-manager.css');
const notice = read('app/privacy/page.tsx');

test('mobile privacy notice appears before main and is no longer a fixed overlay', () => {
  assert.match(layout, /<ConsentManager\s*\/>\s*\{children\}/);
  assert.match(styles, /@media\(max-width:800px\)\{body\{padding-bottom:/);
  assert.match(styles, /\.jrv-consent\{position:relative;z-index:2;flex-direction:column/);
  assert.match(styles, /max-width:720px;margin:12px auto 0/);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(styles, /@media\(max-width:350px\)\{\.jrv-consent-actions\{flex-direction:column\}/);
  assert.match(styles, /min-height:48px/);
  assert.match(styles, /\.jrv-consent-settings\{position:fixed/);
  assert.doesNotMatch(styles, /@media\(max-width:800px\)\{\.jrv-consent\{[^}]*position:fixed/);
});

test('panel has accessible heading and restores focus only after intentional reopening', () => {
  assert.match(manager, /aria-labelledby="jrv-consent-title"/);
  assert.match(manager, /aria-describedby="jrv-consent-description"/);
  assert.match(manager, /tabIndex=\{-1\}/);
  assert.match(manager, /headingRef\.current\?\.focus\(\)/);
  assert.match(manager, /settingsRef\.current\?\.focus\(\)/);
  assert.match(manager, /aria-controls="jrv-consent-panel"/);
  assert.match(manager, /aria-expanded=\{open\}/);
  assert.match(manager, /if \(event\.key === 'Escape'\)/);
  assert.match(manager, /dismissWithoutConsent\(\)/);
});

test('dismissal never opts visitors in and prior privacy controls remain intact', () => {
  assert.match(manager, /const \[choice, setChoice\] = useState<Choice>\('loading'\)/);
  assert.match(manager, /setOpen\(stored === 'unresolved'\)/);
  assert.match(manager, /if \(choice === 'accepted'\) enableExternalAnalytics\(\)/);
  assert.match(manager, /if \(choice === 'accepted' && value === 'rejected'\)/);
  const start = manager.indexOf('function dismissWithoutConsent()');
  const end = manager.indexOf('function choose(', start);
  const dismiss = manager.slice(start, end);
  assert.match(dismiss, /setOpen\(false\)/);
  assert.doesNotMatch(dismiss, /setChoice|setItem|enableExternalAnalytics|location\.reload/);
  assert.match(manager, /reportPortfolioClick\(link\)/);
  assert.doesNotMatch(manager, /fetch\(|sendBeacon\(/);
  assert.match(notice, /Escape dismisses the panel without consenting/);
});
