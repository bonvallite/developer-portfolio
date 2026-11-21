# Portfolio click-intent analytics | 21 November 2026

## Purpose and scope

Measure interest in the JRV portfolio with consented **click indicators**, without
changing the enquiry journey or collecting visitor-entered briefs. Clicks are
not confirmed messages, applications, completed downloads, qualified leads or
purchases. No lead database, server API, cookie or third-party script is added.

A delegated click listener in app/components/ConsentManager.tsx reads fixed
data-jrv-* markers on existing email, résumé and featured project links. The
allowlist and consent gate live in app/components/portfolio-intent-events.ts.

## Privacy boundaries

- Every click re-checks the stored optional-analytics choice. Only an exact
  accepted choice permits a data-layer event. Missing, rejected, unresolved
  and blocked browser storage fail closed.
- The emitter accepts only known event names and enum values. It does not read
  or forward link hrefs, page URLs, referrers, email addresses, message subjects,
  form input, visitor-entered project briefs, link text or résumé content.
- It pushes fixed fields to the existing consent-gated GTM dataLayer and
  makes no network requests itself. No GTM-to-GA4 forwarding is guaranteed.
- The homepage contact composer keeps any visitor-entered brief out of the
  anchor's DOM href. It inserts that text only when handing a draft to the
  user's email application. This reduces exposure through automatic link-URL
  capture without preventing the normal email-draft journey.
- WARNING: the GA4 stream has enhanced outbound-click and file-download
  measurement enabled. Third-party click tags and vendor scripts may capture
  additional link/browser information. Inspect published GTM and GA4 settings
  before claiming that upstream processing is free of personal information.

## Fixed event contract

| Event | Dimensions | Interpretation |
| --- | --- | --- |
| jrv_email_draft_click | jrv_intent: project, hiring, general; jrv_source: homepage_form, service_page, case_dock, footer | Visitor clicked an email link |
| jrv_resume_download_click | jrv_design: ats, classic; jrv_format: pdf, word | Visitor clicked a download link |
| jrv_case_study_click | jrv_case: rewards, analytics, integration, b2b | Visitor clicked a featured case study |

No free-form values, dynamic paths or identifiable content are permitted.

## GTM/GA4 configuration remains a separate release gate

The code queues events only after consent. To make events visible in GA4, the
account owner must first inspect existing tags, GTM variables, outbound-link
auto tracking and consent settings for PII leakage. Then map a Custom Event
trigger matching exactly the three event names to a reviewed GA4 event tag
that forwards only whitelisted fixed dimensions. Avoid forwarding Click URL,
page_location containing mailto data or typed enquiry fields.

Confirm GA4 DebugView captures each accepted click once, captures nothing
before consent or after rejection, and does not double count any legacy
click tags. These are **interest indicators**, not qualified leads or purchases.
Do not mark generate_lead, qualify_lead, or purchase based on a simple mailto
click. GA4 custom dimensions and key-event definitions need a separate review.

## Validation, release and limits

Run existing SEO/safety, TypeScript, unit/Python and production build checks.
Run local desktop/mobile Playwright tests with analytics scripts stubbed to
verify the full consent lifecycle, exact event payloads, rejected unknown
markers, and absence of fictional brief text. Live GTM container audit,
provider retention and actual downstream GA4 delivery are not proven by
those tests. Keep the Ember & Teal design, résumé exports, contact behaviour
and public fictional case studies unchanged.

Tracked in GitHub issue #84.
