# JRV Enquiry Journey

**Updated:** 23 November 2026  
**Status:** Published JRV v1.13. PR #102 merged as `ba78cd8` on 23 November 2026; Vercel production `dpl_8biWWYLeNYHi4n7txq9KmuVdF47X` READY on www and apex.  
**Applies to:** `bonvallite/developer-portfolio`, not Peter Augustus Shopify themes

## Problem and decision

The four public Shopify service pages are used by two audiences. Merchants want to discuss store, conversion, B2B or integration work; employers and recruiters want to discuss a role. Previously, the shared service-page CTAs all opened a generic Shopify *project* draft even where the copy explicitly addressed hiring teams. This is a mismatched journey, not proof of lost leads or conversion uplift.

## Entrypoints and outcomes

| Entrypoint | Visitor goal | Action | Outcome |
| --- | --- | --- | --- |
| Four service-page hero sections | Project work | **Discuss a Shopify project** | Native email app with fixed project subject, challenge, desired outcome and timeline questions |
| Four service-page hero sections | Hiring | **Discuss a hiring role** | Native email app with fixed hiring subject and role, responsibilities, arrangement and next-step questions |
| Four service-page closing cards | Either | Choose project or hiring | Same static templates as above; evidence and experience remain available |
| `/experience` early and final CTAs | Hiring | **Discuss a hiring role** | Homepage `/?intent=hiring#contact`, showing the existing composer with **I am hiring** selected |
| Homepage contact composer | Any | Choose project or hiring | Locally composed email draft, with optional visitor text added only during an explicit email-app handoff |

Only `intent=hiring` preselects the recruitment template; missing or unknown values use the existing project default. Query strings contain no visitor message, personal details, client IDs or arbitrary project scope. The root canonical remains `https://www.jrvallite.com/`.

## Privacy and accessibility boundaries

The site does **not** send messages itself, post forms, or confirm that someone sent an enquiry. The visitor must choose to send the draft in their own email client. The static service-page mailto templates include only public labels. The homepage composer keeps optional text in local React state and never inserts typed text into its DOM href. Existing consent checks gate only predefined click-intent categories; `service_page` is the already-allowlisted source for service-page actions. These signals are click attempts, not leads, and GTM/GA4 forwarding remains unverified.

Contact choices are links, remain keyboard-operable and have visible focus outlines. On narrow screens the two closing cards stack vertically, while touch targets remain at least 44 pixels. Browser automation checks 1366px and 390px widths, the correct email subjects and labels, harmless-query fallback, no accidental optional analytics calls, and absence of layout overflow. To inspect the full contact experience, visual captures reject optional analytics first and screenshot the entire contact sections. The original v1.13 release had a fixed pre-consent privacy panel that could cover lower mobile content. A v1.14 accessibility candidate instead places that notice in normal mobile document flow above the page, so project and hiring contact cards are not hidden behind it. The settings control stays persistent and can reopen the panel; no optional analytics start unless explicitly accepted. Initial screenshot QA found the redundant fixed Privacy choices pill still covering mobile headlines while the notice itself was open. The v1.14 candidate hides the pill only while the consent notice is expanded, then restores it on closing; mobile contact disclosures and the case-study dock also gain safe clearance. This is still a review-stage change and does not alter the published v1.13 behaviour. Real email delivery, third-party vendor configuration, spoken screen-reader behaviour, and client conversion outcomes require separate review.

## Published release verification

- **PR and commit:** PR #102 merged on 23 November 2026 as `ba78cd8ae6688e06411d965428deef490899ba84`; reviewed source `b8fdc07277d84f6ca70d6703ab4f7172d5f2bf07`.
- **GitHub CI:** [Run 45096347418](https://github.com/bonvallite/developer-portfolio/actions/runs/45096347418) passed source safety, unit/Python, TypeScript, Next.js build, rendered SEO, all previously published browser suites, and dedicated 1366px/390px hiring and merchant paths. The subsequent merge commit passed source validation in run 45097176393; its browser job is intentionally PR-only.
- **Vercel:** Exact-head preview `dpl_2T9NHfJC7CW4Bff2W5jgDog6kJt5` READY, production `dpl_8biWWYLeNYHi4n7txq9KmuVdF47X` READY with `www.jrvallite.com` and `jrvallite.com` aliases.
- **Limitations:** Vercel readiness and local browser testing do not prove external email delivery, successful receipt of an enquiry, accessibility in every assistive technology, or new organic search indexing. The previously observed pre-consent mobile privacy overlay is separately documented for UX review. No production Shopify themes, Workers, customer records, GTM or GA4 were changed by this release.
