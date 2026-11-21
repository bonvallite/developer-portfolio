// Source regression for privacy-safe portfolio interaction event instrumentation.
// Rendered browser QA is separately required for behaviour and opt-out effects.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const telemetry = read('app/components/portfolio-intent-events.ts');
const consent = read('app/components/ConsentManager.tsx');

test('portfolio click telemetry is allowlisted and fails closed without consent', () => {
  assert.match(telemetry, /localStorage\.getItem\(PORTFOLIO_CONSENT_KEY\) !== 'accepted'/);
  for (const event of ['jrv_email_draft_click', 'jrv_resume_download_click', 'jrv_case_study_click']) {
    assert.ok(telemetry.includes(event), event + ' must be defined');
  }
  assert.match(telemetry, /if \(!event\) return false/);
  assert.match(telemetry, /trackingWindow\.dataLayer\.push\(event\)/);
  assert.doesNotMatch(telemetry, /fetch\(|sendBeacon\(|\.href\b|\.textContent\b|\.innerText\b|\.value\b|window\.location/);
});

test('global click delegation uses explicit markers, not automatically captured URLs', () => {
  assert.match(consent, /target\.closest\('a\[data-jrv-track\]'\)/);
  assert.match(consent, /document\.addEventListener\('click', onTrackedClick, true\)/);
  assert.match(consent, /document\.removeEventListener\('click', onTrackedClick, true\)/);
  assert.match(consent, /reportPortfolioClick\(link\)/);
});

test('all first-party contact and download paths use fixed event markers', () => {
  const lead = read('app/components/LeadComposer.tsx');
  const service = read('app/components/ServicePage.tsx');
  const dock = read('app/components/QuickContactDock.tsx');
  const home = read('app/page.tsx');
  const resumes = read('app/resume/page.tsx');
  const preview = read('app/resume/[design]/page.tsx');
  assert.match(lead, /data-jrv-track="email"/);
  assert.match(lead, /href=\{safeMailto\} onClick=\{openDraft\}/);
  assert.match(lead, /window\.location\.assign\(mailto\)/);
  assert.match(lead, /if \(event\.defaultPrevented \|\| !brief\.trim\(\)\) return/);
  assert.match(lead, /data-jrv-source="homepage_form"/);
  assert.match(service, /data-jrv-source="service_page"/);
  assert.match(dock, /data-jrv-source="case_dock"/);
  assert.match(home, /data-jrv-source="footer"/);
  assert.match(home, /data-jrv-track="case" data-jrv-case=\{item\.visual\}/);
  for (const file of [resumes, preview]) {
    assert.match(file, /data-jrv-track="resume"/);
    assert.match(file, /data-jrv-format="pdf"/);
    assert.match(file, /data-jrv-format="word"/);
  }
});

test('privacy notice explains click-only measures and third-party container limits', () => {
  const privacy = read('app/privacy/page.tsx');
  assert.match(privacy, /A click does not confirm that an email was sent/);
  assert.match(privacy, /vendor-controlled click settings require a separate privacy review/);
  assert.match(privacy, /The site&apos;s limited custom events/);
});
