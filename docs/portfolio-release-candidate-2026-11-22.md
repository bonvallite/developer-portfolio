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

## Verified résumé discoverability and cache policy (22 November 2026, pre-retirement baseline)

- Both currently published résumé formats remain directly accessible at `/resume/ats` and `/resume/classic`, including downloadable PDF and editable Word versions. The original legacy PDF remains accessible under `/JRV-Resume.pdf` for backward compatibility. The repository contains an identical original file in `backups/resumes/`; the public site and public Git tree are **not private storage**.
- Direct checks on the previous ready Vercel preview returned HTTP 200 and `X-Robots-Tag: noindex` for the résumé HTML routes and downloads. The site's Next.js configuration also applies noindex to the legacy PDF. Existing generated PDF/Word handlers returned `Cache-Control: public, max-age=3600`, even though the files contain career identity and contact details. These generated responses are now configured `private, no-store` while retaining the same routes, content, and attachment filenames. The binary backup and legacy static PDF were **not altered**.
- The local rendered-SEO regression now checks that the home page, case studies and privacy page do **not** emit app-level noindex, while all résumé routes and file handlers do; it also checks PDF/Word MIME types, attachment disposition and private/no-store cache headers. Vercel deliberately adds `noindex` to preview deployments, which is separate from production indexing. Neither noindex nor no-store removes old Git history, search caches, direct links or copies of downloaded files.
- The existing README explicitly says the legacy PDF is retained for old links, pending an approved updated replacement. Do not delete or redirect it, or claim complete privacy removal, without reviewing existing links and obtaining owner approval. No identifying résumé text or downloadable file content was changed in this release candidate.

## Owner-approved original résumé retirement (22 November 2026)

The owner has explicitly authorised retiring the original legacy 2026 PDF from the current public website and GitHub branch while keeping **both** ATS-Friendly and Classic designs available. Draft PR #96 deletes the identical old copies at `public/JRV-Resume.pdf` and `backups/resumes/JRV-Resume-2026-Original.pdf`. Older links to `/JRV-Resume.pdf` now receive a permanent redirect to `/resume`, where users can choose either approved format. The new PDF/Word generators, source data, private no-store cache rules, noindex metadata, and download paths remain unchanged.

The original résumé retirement is already live through PR #97. The prior paragraphs above describe its pre-retirement state; the broader portfolio release remains draft. Historical Git commits, older public branches, previous Vercel deployments, third-party copies and downloaded files are **not erased**. The new source guard checks the absence of both original binaries in the current tree and the redirect configuration; rendered SEO tests verify GET/HEAD redirects and retained links to both ATS and Classic formats.

Required before release: successful exact-commit CI, READY Vercel preview, HTTP redirect (not PDF) for the old route, both updated résumé downloads, and normal site QA. Analytics vendor/container configuration remains a separate publication review.

## Published main reconciliation and palette review (22 November 2026)

Production `main` already includes owner-approved original résumé retirement (`ecf8e5ad`, PR #97). This integrated draft merges that production commit as a second parent so the original PDF and public backup remain removed and legacy bookmarks redirect to `/resume`. Earlier sections describe the pre-retirement baseline; the privacy hotfix is now live, but the broader portfolio changes remain draft.

The [colour guide](./jrv-brand-palette-2026-11-22.md) records the unified obsidian, electric teal, Ember and light foreground system, including the 64px indexed favicon palette change. The original PNG pixel data and transparency are preserved. Added source tests to prevent legacy brand gold and a local Chrome browser suite for **19 routes at 1366px and 390px** to check computed accents, H1s, responsive overflow, JS errors, and no optional analytics before consent, with screenshots.

Do not interpret automated colours as a complete contrast/accessibility certificate, real-user speed, or a substitute for manual visual and 16px/32px favicon checks. External analytics vendor audits, publication rights, and explicit approval to release PR #96 remain open.

## Conversion storytelling, Spend & Save (22 November 2026)

The original interactive reward case study successfully demonstrated fictional shopper, merchant, and Flow boundaries but ended with only a generic email link. An end-of-story panel now connects the customer-facing progress experience to merchant-controlled configuration, checkout shipping responsibility, a safely committed order edit, and conditional customer notification. It offers **two distinct next steps**: a fixed-subject `mailto:hello@jrvallite.com` for project enquiries and `/experience` for hiring. The footer leads to existing homepage contact choices. This is a **navigation and storytelling change**, not a lead-capture form, Shopify theme edit, analytics feature, or actual performance claim.

The styles reuse JRV Ember/Teal values, remain scoped to `/projects/spend-and-save`, and collapse to one column at phone widths. Unit/browser assertions check the three implementation boundaries, fixed links, 44px-plus touch target, fictional-data disclosure, and no horizontal overflow. The existing tests for gift calculation, post-checkout Flow gates and email preview remain intact. The living design guide documents the repeatable conversion-ending pattern.

**Pending:** Validate the exact new GitHub commit, review end-of-page desktop/tablet/mobile screenshots, confirm production-ready preview and source/rights decisions before separately approving draft PR #96. No new enquiries are stored or sent by the site.

## Homepage audience journey and first-screen routes (22 November 2026)

The homepage already had a real interactive four-project studio, case-study links, and a contact composer, but its intent split appeared only in the later hiring section. The hero now explains the commercial/technical Shopify remit in clear language and replaces generic proof badges with two immediate, native-link audience paths: **ECOMMERCE TEAMS → /#contact** and **HIRING TEAMS → /experience**. Existing **Explore my work** and **View résumé options** buttons remain. Visitors can still inspect all four flagship examples and their original fictional-data disclosures.

The first-screen path cards are CSS-only, aligned to maintained JRV Obsidian/Teal/Ember colours and stacked at phone widths. They add no image, new JavaScript state, event collection, form or external request. Source and desktop/tablet/mobile browser tests confirm the targets, usable touch height, responsive overflow and normal homepage studio/consent behaviour. The living design guide records the repeatable routing pattern and affected files.

**Pending:** exact-commit GitHub Actions, Vercel preview and visual screenshot review before claiming success. This feature is in draft PR #96 and not approved for production.

## Restore 11 published storefronts, homepage previews and route palette (22 November 2026)

The current cinematic homepage contained four interactive case studies but omitted the website archive. It now displays `/#websites` directly after technical projects: an 11-site user-controlled gallery, one active desktop/mobile homepage preview pair, a full 11-link public homepage index and a link to `/experience#storefronts`. The existing experience page continues to feature Peter Augustus separately with the other ten sites in its gallery. The owner-retired Skull Seeker site remains excluded; site roles are described as self-reported contributions rather than endorsements or exclusive builds.

**Capture provenance:** Recovered 19 November 2026 GitHub Actions capture run `44490966868`: 22 successful image files for 11 sites and two failed Skull Seeker attempts. A contact-sheet review found genuine homepages plus promotions, overlays and an incomplete loading state. An exact-source, draft-only workflow is prepared to import 21 optimised public WebP captures from the dated artefact, leaving out the incomplete Axlrodd desktop image. The gallery prefers a successful local copy but still falls back to mShots and then a live link. Static images must not be treated as committed or publication-approved until the import run and rights review are verified. Before a final production release, obtain an approved-quality, appropriately licensed static set or explicitly accept the limitations of cached third-party thumbnails.

**Visual consistency:** The gallery, published-site buttons, experience cards and legacy `.flow-page` backgrounds now use the maintained Obsidian `#0B1419`, Teal `#38C7BC` and Ember `#F28C52` system. The four flagship studios already use those colours. The lighter editorial storefront and printable résumés stay readable exceptions. No new visual identity values, tracking vendor, lead form or private client theme code were added.

**QA gates:** Test unique URL count, 11 visible homepage links, 10 secondary experience sites, both preview device frames, carousel keyboard/button selection, fallbacks, 44px touch targets and horizontal overflow at four viewport sizes. Inspect GitHub exact-head CI and Vercel preview; do not publish until the separate rights/privacy release review is approved.

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
