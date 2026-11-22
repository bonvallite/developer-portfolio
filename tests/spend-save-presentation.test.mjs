// Source-level regression for the Spend & Save presentation and disclosure.
// The live simulator is separately exercised in Playwright across viewports.
// This portfolio never executes merchant order edits or sends customer emails.
// The final enquiry must explain engineering scope without promising results,
// and route to a fixed mailto or a public hiring page (never to a data form).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const page = read('app/projects/spend-and-save/page.tsx');
const inspector = read('app/projects/spend-and-save/SpendSaveSystemMap.tsx');
const styles = read('app/projects/spend-and-save/spend-save-visual.css');

test('Spend and Save keeps the original tested local reward rules and Flow gates', () => {
  assert.match(page, /getRewardProgress\(total, thresholds\)/);
  assert.match(page, /getEligibleGifts\(total, thresholds\)/);
  assert.match(page, /stage >= 4 && eligible/);
  assert.match(page, /stage === flowStages\.length - 1 && eligible/);
  assert.match(page, /Gift lines appear only after the simulated order edit is committed/);
  assert.match(page, /No email was actually sent/);
  assert.ok(existsSync(new URL('../lib/spend-save-rules.mjs', import.meta.url)));
});

test('interactive map reflects shopper and Flow state without live integration', () => {
  assert.match(page, /<SpendSaveSystemMap subtotal=\{total\} thresholds=\{thresholds\}/);
  assert.match(page, /flowStage=\{stage\} orderEditCommitted=\{orderEditCommitted\} notificationReady=\{flowDone\}/);
  assert.match(page, /ss-hero-journey/);
  assert.match(page, /One offer\. Three perspectives\./);
  assert.match(inspector, /useState<StageKey>\('storefront'\)/);
  assert.match(inspector, /aria-pressed=\{selected === item\.key\}/);
  assert.match(inspector, /aria-live="polite" aria-atomic="true"/);
  assert.match(inspector, /Flow run or proof that an order edit succeeded/);
  assert.match(inspector, /notificationReady/);
  assert.match(inspector, /if \(!result\.ok\) return/);
  assert.doesNotMatch(inspector, /fetch\(|sendBeacon\(|localStorage|window\.location|gtag\(/);
  assert.match(inspector, /No real email is sent/);
});

test('Ember and Teal styling is local, responsive and motion-conscious', () => {
  assert.match(page, /className="ss-page ss-cinematic"/);
  assert.match(page, /import '\.\/spend-save-visual\.css'/);
  assert.match(styles, /#38c7bc/i);
  assert.match(styles, /#f28c52/i);
  assert.match(styles, /ss-system-detail/);
  assert.match(styles, /max-width:620px/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(styles, /https?:\/\/|url\(/);
});

test('the final reward case study links the engineering narrative to project and hiring next steps', () => {
  assert.ok(page.includes('id="reward-enquiry" className="ss-engage"'));
  assert.ok(page.includes('id="ss-engage-title"'));
  assert.ok(page.includes('The engineering earns the trust'));
  for (const boundary of ['01 / SHOPPER', '02 / MERCHANT', '03 / AUTOMATION']) {
    assert.ok(page.includes(boundary), 'Missing implementation boundary: ' + boundary);
  }
  assert.ok(page.includes('mailto:hello@jrvallite.com?subject=Shopify%20rewards%20and%20Flow%20project%20%7C%20JRV'));
  assert.ok(page.includes('href="/experience">Hiring? Review experience'));
  assert.ok(page.includes('No enquiry is collected here'));
  assert.ok(page.includes('not proof of measured uplift'));
  for (const forbidden of ['<form', 'fetch(', 'sendBeacon(']) {
    assert.ok(!page.includes(forbidden), 'Unexpected network or form hook: ' + forbidden);
  }
  for (const selector of [
    '.ss-cinematic .ss-engage{',
    '.ss-cinematic .ss-engage-primary{',
    'grid-template-columns:minmax(0,1fr)',
    '.ss-cinematic .ss-engage-actions a{width:100%',
  ]) {
    assert.ok(styles.includes(selector), 'Missing accessible/responsive panel styling: ' + selector);
  }
});
