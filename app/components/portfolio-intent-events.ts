/**
 * Consent-gated, deliberately minimal click-intent telemetry for the public JRV
 * portfolio. These are click attempts, NOT confirmed email sends, résumé opens,
 * downloads, enquiries or qualified leads.
 *
 * Never read an href, form field, element text, page URL, referrer, or identifier
 * into the event: mailto URLs can contain visitor-entered project descriptions.
 * Only predefined marker values are accepted; unknown values are discarded.
 *
 * This only queues events for an already-consented GTM container. GA4 collection
 * additionally requires reviewed/published GTM tags; no vendor is called here.
 */
// Shared contract: ConsentManager.storageKey must use this exact string.
// It is deliberately not moved into server metadata or a cookie. Any rename
// requires migration and consent review before release.
export const PORTFOLIO_CONSENT_KEY = 'jrv-optional-analytics-consent-v1';

type EmailIntent = 'project' | 'hiring' | 'general';
type EmailSource = 'homepage_form' | 'service_page' | 'case_dock' | 'footer';
type ResumeDesign = 'ats' | 'classic';
type ResumeFormat = 'pdf' | 'word';
type FeaturedCase = 'rewards' | 'analytics' | 'integration' | 'b2b';

type PortfolioClickEvent =
  | { event: 'jrv_email_draft_click'; jrv_intent: EmailIntent; jrv_source: EmailSource }
  | { event: 'jrv_resume_download_click'; jrv_design: ResumeDesign; jrv_format: ResumeFormat }
  | { event: 'jrv_case_study_click'; jrv_case: FeaturedCase };

/**
 * Convert only explicit data-jrv-* attributes into a narrow, typed payload.
 * The allowlists are a privacy boundary, not just a TypeScript convenience:
 * NEVER add an href, URL path, label text, free-form role, or draft message.
 * New action types must be reviewed in this source and the privacy notice.
 */
function buildEvent(link: Element): PortfolioClickEvent | null {
  const kind = link.getAttribute('data-jrv-track');
  if (kind === 'email') {
    const intent = link.getAttribute('data-jrv-intent');
    const source = link.getAttribute('data-jrv-source');
    if (intent !== 'project' && intent !== 'hiring' && intent !== 'general') return null;
    if (source !== 'homepage_form' && source !== 'service_page' &&
      source !== 'case_dock' && source !== 'footer') return null;
    return { event: 'jrv_email_draft_click', jrv_intent: intent, jrv_source: source };
  }
  if (kind === 'resume') {
    const design = link.getAttribute('data-jrv-design');
    const format = link.getAttribute('data-jrv-format');
    if (design !== 'ats' && design !== 'classic') return null;
    if (format !== 'pdf' && format !== 'word') return null;
    return { event: 'jrv_resume_download_click', jrv_design: design, jrv_format: format };
  }
  if (kind === 'case') {
    const featuredCase = link.getAttribute('data-jrv-case');
    if (featuredCase !== 'rewards' && featuredCase !== 'analytics' &&
      featuredCase !== 'integration' && featuredCase !== 'b2b') return null;
    return { event: 'jrv_case_study_click', jrv_case: featuredCase };
  }
  return null;
}

/**
 * An attempted click is not proof that an email was sent or file downloaded.
 * Gate each event against browser consent at click time; returning false means
 * no local dataLayer event was enqueued. A true return only indicates local
 * enqueueing, NOT GA4 receipt or published GTM forwarding configuration.
 */
export function reportPortfolioClick(link: Element): boolean {
  if (typeof window === 'undefined') return false;
  // Read consent at the moment of each click; a stale React state or DOM marker
  // is never sufficient to authorise event collection.
  try {
    if (window.localStorage.getItem(PORTFOLIO_CONSENT_KEY) !== 'accepted') return false;
  } catch {
    return false;
  }

  const event = buildEvent(link);
  if (!event) return false;
  const trackingWindow = window as Window & { dataLayer?: unknown[] };
  // GTM reads the queue when the consent-only container starts. A queue is
  // never created for visitors without accepted consent.
  if (!Array.isArray(trackingWindow.dataLayer)) trackingWindow.dataLayer = [];
  trackingWindow.dataLayer.push(event);
  return true;
}
