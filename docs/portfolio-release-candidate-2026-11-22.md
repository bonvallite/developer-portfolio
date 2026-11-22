# JRV cinematic release candidate — 22 November 2026

**Repository:** `bonvallite/developer-portfolio`  
**Base:** `main` `ac519c363bb303249adc911d0600679857df4a8d`  
**Integration branch:** `integration/2026-11-22-cinematic-release`  
**Status:** Draft, **not merged to production**.

## Scope and exact provenance

This combines the reviewed project-specific Git blobs from existing source PRs. It is a validation snapshot, not new implementation work or a Shopify theme deployment.

| PR | Subject | Reviewed commit |
| --- | --- | --- |
| #83 | Homepage journey accessible live announcement and keyboard regression | `cee90ace0d9ad49d2d470beef837e8e984dd2051` |
| #92 | Shopify–CartonCloud failure-aware event studio and integration enquiries | `cc5a2b78c4e0a2ede34605fc22a3b0614050556c` |
| #93 | Python Analytics source explainer, fictional dashboard and client/hiring paths | `2dcbbadd3593e4b117ee03a79b913362a8cc5967` |
| #94 | Shopify B2B entitlement inspector and legible mobile contexts | `72b624f960e968d8941e5965c28e9c705aadec7b` |

The combined tree intentionally preserves all other files from main, including SEO/security checks, consent rules, existing interactive Spend & Save, résumé files and source-publication safety logic.

## Shared CI reconciliation

Instead of overwriting `.github/workflows/portfolio-ci.yml` with any PR's older copy, all individual browser checks are enabled for this integration branch: general case-study, homepage accessibility, Spend & Save, CartonCloud normal/failed event scenarios, Python Analytics Lab, B2B entitlement, and consent-first privacy tests. Existing unit, Python, TypeScript, build, SEO and public-safety checks are preserved. Desktop/tablet/mobile screenshots are collected from the relevant test artefact paths.

## Mobile privacy settings correction (22 November 2026)

The full-page 390px screenshot showed a persistent `Privacy choices` button with 9px text and a sub-44px hit target. Its route-independent CSS now uses 12px text, a 44px minimum height, a visible focus ring, a small viewport inset and JRV teal/ember/obsidian colours. The control exposes `aria-expanded` when the optional preferences panel is shown. The existing consent state, opt-in requirement, vendor loading rules, and rejection behaviour remain unchanged.

Unit and browser tests now verify the styles, actual computed target size, viewport containment, keyboard opening, ARIA expansion, re-rejection and absence of tracking requests after rejection. Screenshots and the Vercel preview generated for the previous `a05ed676` commit must not be treated as visual proof of this updated control. A fresh CI run and new exact-head preview are required.

## Synthetic performance lab (22 November 2026)

The integrated PR now includes `tests/performance-lab-browser-qa.mjs` and a local-only CI step. It measures one page navigation in **Chrome on the GitHub Actions runner**, at desktop (1366 x 768) and phone (390 x 844) sizes, for the homepage, CartonCloud integration, Python Analytics Lab, Shopify B2B, and Spend & Save. A structured JSON report is uploaded alongside existing browser screenshots. The browser keeps reduced-motion on and never grants analytics consent; checks also fail on unexpected browser errors, horizontal overflow, or optional tracking before consent.

Measurements include navigation response time, DOMContentLoaded, load-event duration, first contentful paint when supported, last observed largest contentful paint, observed layout shifts, and same-origin encoded asset bytes. **These are unthrottled loopback lab samples, not Vercel CDN timings, Lighthouse scores, production mobile field data, p75 values, or definitive Core Web Vitals.** A live PageSpeed/Lighthouse audit or approved consent-based real-user telemetry is still necessary before claiming a speed improvement. The Vercel metrics endpoint has not provided usable results for this review, and no Speed Insights library was added because it would introduce new visitor measurements requiring separate approval.

## Public résumé and optional analytics release review

- The public repository currently includes `backups/resumes/JRV-Resume-2026-Original.pdf`. Removing it from the current tree does not remove older commits or external copies. The original PDF has not been modified or removed.
- The site's online résumé/source data intentionally includes personal identification and contact details. `noindex` requests on résumé routes reduce indexing but do not make the pages private. Confirm which contact details, if any, are permitted to remain publicly accessible, while preserving both intended résumé versions.
- `ConsentManager.tsx` currently conditionally loads Google Tag Manager, Microsoft Clarity, and Vercel Analytics **after opt-in**. The actual Tag Manager container rules and Clarity configuration have not been independently verified against the owner's intended Google Analytics setup. Do not certify vendor privacy settings from the source code alone.
- The automated source scan is a regression guard, not a repository-history, binary-document, embedded metadata, employer-rights, or third-party tag audit. A privacy/publication decision is required before marking the release complete.

No content, customer records, business credentials, résumé files, or analytics vendor settings were changed as part of these reviews.

## Spend & Save first-paint CSS correction (22 November 2026)

The first synthetic Chrome lab report for the integrated candidate recorded an **initial layout-shift observation of 0.5883 at 1366px and 0.2308 at 390px** on `/projects/spend-and-save`, while the other four tested routes recorded zero. These are one-run, unthrottled, local lab observations, not field CLS or Core Web Vitals.

The Spend & Save page still emitted a large legacy `<style jsx global>` block **after all its page content** inside a client component. That creates an avoidable risk of initial content painting before the final layout CSS takes effect. The complete legacy CSS was moved **unchanged** into `spend-save-base.css`, imported before `spend-save-visual.css`. Product data, reward calculations, shopper/merchant/engineering tabs, Flow sequencing, simulated order edits and email previews were not changed. Route comments and a new source regression test explain and protect the order.

The next exact-commit GitHub performance lab must compare the desktop/mobile shift readings with the original 0.5883/0.2308 values. If they remain elevated, investigate other first-render changes and collect element-level layout-shift attribution. **Do not claim that the issue is resolved based on a CSS refactor alone.** The final Vercel preview and standard browser QA must also pass. Do not confuse loopback timing with live-site speeds.

## Preview acceptance gates

- [ ] GitHub Actions are green **on the integration SHA** and actually run all seven browser test commands.
- [ ] An exact-commit Vercel preview is READY and displays all four changes together.
- [ ] Review all desktop, tablet and 390px phone screenshots, keyboard focus, mobile menu, reduced-motion and route navigation.
- [ ] Verify normal and failure simulation states, two-column fictional B2B options at phone width, Python synthetic CSV and contact links.
- [ ] Verify public source safety, fictional-data disclaimers, metadata, sitemap, production canonicals and consent opt-out.
- [ ] Review the new synthetic local performance report from the exact GitHub commit; obtain a separate live Lighthouse/PageSpeed or approved field measurement before asserting any speed improvement.
- [ ] Review any personal contact details, private code history, customer/order records and third-party implementation rights before public publication.
- [ ] Obtain explicit release approval before merging to main or changing production aliases.

Automated browser checks do not independently certify spoken screen-reader announcements or real device interactions. Vercel preview availability does not prove measured performance. Do not release this draft if any check fails.

## Merge handling

The aggregate PR is offered as **one optional release target**; do not merge both the aggregate and individual PRs as duplicate changes. Preserve the individual PRs and their commit history for review. Release coordination and previous stop point are documented in issue #95.
