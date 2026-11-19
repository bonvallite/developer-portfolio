# Portfolio analytics and consent audit

Date: 19 November 2026
Scope: source-level review of `app/layout.tsx` and `app/privacy/page.tsx`.
Status: investigation; no vendor configuration or consent changes made.

## Confirmed from source

- Google Tag Manager container `GTM-KVJVH4VM` is loaded in the root head.
- A `dataLayer` initializer and `gtag('js', new Date())` are present.
- Microsoft Clarity project `zekmhvjftc` is loaded from the root head.
- `@vercel/analytics/next` is rendered sitewide.
- The public `/privacy` notice names these tools and discloses limitations.

## Unverified / must not assume

- Published GTM tags, triggers, consent settings, and any additional vendor tags.
- Whether Clarity is also deployed via GTM.
- Consent mode behaviour, regional consent requirements and actual user choices.
- Cookies, IP handling, retention periods, cross-border processing, and vendor account settings.
- Actual network requests on mobile and desktop before and after consent.
- Whether privacy notice wording satisfies applicable legal obligations.

## Recommended validation

1. Export the published GTM container and inventory every tag, trigger and consent requirement.
2. Run a fresh-browser network inspection before interacting with the site and after any available consent action.
3. Verify whether Clarity and GA4 initialise once, and whether Vercel Analytics sends expected events.
4. Confirm applicable consent requirements with an appropriate privacy adviser before changing tag loading.
5. Document vendor account retention settings and update the privacy notice with verified facts.
6. Add measurement for role and project enquiry clicks only after the consent approach is verified; never include email body text or personal information in event payloads.

## Release gate

Do not assert compliance, install additional trackers, or silently disable existing analytics. Any consent-management change requires a separate tested implementation and review of regional requirements.
