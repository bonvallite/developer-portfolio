# JRV Enquiry Journey

**Updated:** 23 November 2026  
**Status:** Draft release candidate, not production-verified  
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

Contact choices are links, remain keyboard-operable and have visible focus outlines. On narrow screens the two closing cards stack vertically, while touch targets remain at least 44 pixels. Browser automation checks 1366px and 390px widths, the correct email subjects and labels, harmless-query fallback, no accidental optional analytics calls, and absence of layout overflow. To inspect the full contact experience, visual captures reject optional analytics first and screenshot the entire contact sections. The existing pre-consent privacy panel can overlap lower mobile content until the visitor makes a choice; this is a separate privacy-UX review item, not justification to change opt-in semantics. Real email delivery, third-party vendor configuration, spoken screen-reader behaviour, and client conversion outcomes require separate review.

## Release criteria

- Source, Python, TypeScript, privacy, SEO and Next.js build checks pass for the exact integration commit.
- Dedicated hiring browser QA and existing full browser suites pass with Chrome screenshots reviewed.
- Vercel preview reaches READY and the source commit matches the PR.
- No existing routes, résumés, website gallery, contact options or canonical/robots directives regress.
- The JRV v1.13 design-system candidate and `CHANGELOG.md` record the change; production remains v1.12 until an explicitly approved merge.
