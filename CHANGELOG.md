# Portfolio changelog

## 2026-11-23 - Correct post-release palette test for published engineering heading

- **Branch / release:** `main`, after published PR #100 merge `d8d2df7` and documentation release-record commit `3e31af9`. The approved interactive showcase is live and verified on `www.jrvallite.com`.
- **Affected files:** `tests/portfolio-palette.test.mjs`, `CHANGELOG.md`. The permanent `docs/JRV_DESIGN_SYSTEM.md` v1.11 remains the current published source of truth, with no token changes.
- **Why:** Post-release source documentation correctly renamed rule 12 from `Dedicated systems engineering flagship (draft only)` to `Published systems engineering flagship`. A unit test still required the former literal text and failed, although 198 other unit tests passed and the deployed runtime logic was unchanged.
- **Fix:** Update the test to require the **published** rule, v1.11 release record and approved PR #100 merge evidence. Keep palette token checks, all UI behaviours, and source files otherwise unchanged.
- **Validation:** Exact-commit GitHub Actions and production Vercel build **pending** after this corrective commit. Do not treat failed run `45081779549` as passed. Source of deployed feature `ae4e1b2` previously passed all unit/responsive CI and production commit `d8d2df7` passed source validation.
- **No Shopify theme, Cloudflare Worker, CartonCloud, notification, customer order or marketing platform changes.**


## 2026-11-23 - Publish Shopify App Engineering, ETA metafields and Shopify email/SMS fallback

- **Release:** User approved publishing the previously reviewed Draft PR #100 to production on 23 November 2026. PR #100 is now **merged** into `main` as `d8d2df7c9a6ddaf9551a7e2d2f8c3d052b6fe287`, source commit `ae4e1b29635ef5e8d838909f1e6ab1c72480508b`. Previous entries below describe genuine historical preview/draft milestones; their status is superseded by this release.
- **Deployment:** Vercel project `developer-portfolio` production deployment `dpl_31QnTs1A9tFqJ1gxdtiGLyqTUT45` (`developer-portfolio-q6bxewjft-my-dojo.vercel.app`) reached READY from merge commit `d8d2df7`. Authenticated HTTP 200 checks on live `https://www.jrvallite.com/`, `/projects/commerce-integration-engineering`, `/cartoncloud-integration`, and `/sitemap.xml`.
- **Verified scope:** Homepage still has the eleven website previews, four original case-study cards and a distinct Systems section/link. The new page provides fictional, interactive architecture, last-mile ETA, typed Shopify order metafields, reported five-minute customer notification, Shopify email-first/SMS-if-email-absent fallback, late carrier tracking and illustrative app write-back. No real orders, customer contacts, private Worker code, secrets, CartonCloud calls, notification sends, or Shopify theme changes.
- **SEO:** The new production page renders `index, follow`, distinct title/description, and the self canonical `https://www.jrvallite.com/projects/commerce-integration-engineering`. The 23-URL production sitemap includes both the new route and original CartonCloud case study; the original canonical and URL remain unchanged. Vercel preview builds continue to use noindex and exclude the new case study. Indexability is not proof search engines have indexed the route.
- **Validation:** Exact feature-source CI including desktop/tablet/mobile browser checks passed in [run 45075036701](https://github.com/bonvallite/developer-portfolio/actions/runs/45075036701). Post-merge GitHub `main` validation passed in [run 45081426570](https://github.com/bonvallite/developer-portfolio/actions/runs/45081426570). Vercel production READY and HTTP/canonical/robots/sitemap checks succeeded. Actual live email/SMS delivery, individual customer outcomes, client endorsements and real third-party operations were **not** tested.
- **Documentation-only release follow-up:** `docs/JRV_DESIGN_SYSTEM.md` 1.11, `docs/commerce-integration-lab-2026-11-22.md`, `CHANGELOG.md`, `AGENTS.md` and affected `app/page.tsx`, `app/components/FeaturedSystemsLab.tsx`, `app/projects/commerce-integration-engineering/{page.tsx,CustomerCommunicationLab.tsx}` source comments updated to distinguish the now-published feature from historical draft notes. No runtime logic, palette tokens, SEO policy or integrations changed.
- **Future changes:** Continue reading the permanent JRV design guide, changelog, source and inline comments before editing. Preserve user-approved palette, privacy and test requirements.


## 2026-11-23 - Correct Shopify native email/SMS fallback in post-order ETA demo

- **Branch/PR:** `integration/commerce-systems-latest-main-20261122`, Draft PR #100; no merge or live `jrvallite.com` deployment.
- **Files:** `app/projects/commerce-integration-engineering/CustomerCommunicationLab.tsx`, `page.tsx`, `CodeExplorer.tsx`, `engineering-lab.css`, `app/components/FeaturedSystemsLab.tsx`, `lib/commerce-integration-demo.{mjs,d.mts}`, `tests/commerce-integration-demo.test.mjs`, `tests/commerce-integration-browser-qa.mjs`, `docs/commerce-integration-lab-2026-11-22.md`, `docs/JRV_DESIGN_SYSTEM.md`, `CHANGELOG.md`.
- **User clarification:** The store uses Shopify to send customer notifications: **when an order has an email address, use email; if no email exists but a mobile number is available, Shopify sends SMS instead**. Do not involve Klaviyo. The original demo wrongly portrayed SMS as a separately enabled, parallel channel; remove that interaction and correct all current documentation.
- **What changed:** Demo controls now select whether an order has an email address and/or a mobile number. The derived recipient route is `email`, `sms` (only when email is absent), or `none`. Two message-stage tabs show either the email or SMS automatically; email has priority when both contacts exist, and no recipient or message is assumed when both are missing. Preserve the four event stages, typed `custom.*` Shopify order metafields, five-minute *reported* ETA notice and later fulfilment/tracking. New code explorer explicitly models this Shopify routing rather than a separate SMS provider.
- **Accuracy boundaries:** Worker source verifies ETA calculation, typed Shopify metafield writes and later fulfilment/tracking update API calls. The merchant identifies Shopify's notification channel fallback. The exact five-minute notification configuration, template, opt-in and actual delivery receipts remain uninspected; do not claim the Worker itself sends SMS or email or that Shopify delivered a notification. No external messaging system is connected or called.
- **Testing:** Replaced unit and real-browser selectors to assert email priority, SMS-only-when-no-email, no contact destination, missing tracking, failed ETA persistence and the original source-safe code demo. New exact-head CI and Vercel preview verification **pending**; previous successful runs certify earlier code only.
- **UI/accessibility:** Existing JRV Obsidian/Teal/Ember palette, responsive timeline, email and SMS mock-ups preserved. Added scoped status styling with live channel-selection feedback; no root token, icon, gallery, sitemap or SEO policy change.
- **Release:** Draft-only; no Shopify theme, Worker, fulfilment, order, Shopify notification settings, SMS, Klaviyo or production website was changed.


## 2026-11-22 - Fix ambiguous SMS browser selector in new notification demo

- **Branch:** `integration/commerce-systems-latest-main-20261122`, Draft PR #100; published `main` and `jrvallite.com` unchanged.
- **Affected files:** `tests/commerce-integration-browser-qa.mjs`, `docs/commerce-integration-lab-2026-11-22.md`, `CHANGELOG.md`.
- **Why:** The first exact-head CI for source `565b75b` passed all source, public-safety, JavaScript unit, Python, TypeScript, Next.js, and rendered SEO checks. The browser suite failed specifically at the SMS tab interaction because the role selector `getByRole('button',{name:'SMS'})` matched both the SMS tab and a timeline step whose accessible name mentioned SMS. The GitHub Actions log reports a Playwright strict-mode ambiguity, not a failed app operation.
- **Change:** Use an exact accessible name for the SMS tab (`name:'SMS', exact:true`) and document this regression rule inline. No customer communication logic, visual styling, Shopify notification, production Worker or external API behaviour changed.
- **Validation:** Corrected source commit `aecd1ff527e5f92edf77e3a15b4a90fdbbc8621e` passed both GitHub Actions validation and browser QA jobs in [run 45029976900](https://github.com/bonvallite/developer-portfolio/actions/runs/45029976900). The 1440px desktop, 768px tablet and 390px mobile engineering-lab interactions completed, including ETA save and failure gates, reported five-minute notice, SMS tab, shipping confirmation and missing tracking. Screenshot artefact `14757561997` was downloaded; visually inspected desktop and mobile full-page captures and close-up new sections. The earlier `565b75b` browser runs remain correctly recorded as failed due to the non-exact selector.
- **Release:** Draft only, no production merge.


## 2026-11-22 - Showcase post-order ETA email, SMS and later shipping confirmation (draft only)

- **Repository / branch:** `bonvallite/developer-portfolio`, `integration/commerce-systems-latest-main-20261122`, Draft PR #100; `main` and `jrvallite.com` unchanged. No Peter Augustus Shopify theme, Cloudflare Worker or Shopify notification configuration edited.
- **Affected files:** New `app/projects/commerce-integration-engineering/CustomerCommunicationLab.tsx`; updated `app/projects/commerce-integration-engineering/{page.tsx,engineering-lab.css,CodeExplorer.tsx}`, `app/components/FeaturedSystemsLab.tsx`, `lib/commerce-integration-demo.{mjs,d.mts}`, `tests/commerce-integration-{demo.test,browser-qa}.mjs`, `docs/commerce-integration-lab-2026-11-22.md`, `docs/JRV_DESIGN_SYSTEM.md`, and `CHANGELOG.md`.
- **Why:** The earlier lab represented carrier callbacks and Shopify tracking notification decisions but omitted the customer-facing path after an order is paid: the Worker calculates a destination ETA, stores it in the Shopify order, and the merchant reports a five-minute email/SMS communication before carrier tracking is available.
- **Verified implementation boundary:** From inspected private `worker.js`: `orders/create` route reads order timestamp and destination, calculates an ETA, and uses app-authorised Shopify `metafieldsSet` to write typed `custom.estimated_delivery_date`, `custom.estimated_delivery_date_iso`, `custom.delivery_day_name`, `custom.delivery_zone`, `custom.delivery_postcode`, `custom.delivery_breakdown` and related fields. Fulfilment and later CartonCloud callbacks use separate REST/GraphQL paths; `fulfillmentTrackingInfoUpdate` may request a **native Shopify notification**. These are order metafields, not separate Shopify metaobjects. The Worker does **not** implement or prove the five-minute timer, a delivered email, an SMS provider, opt-in or message receipt.
- **Experience added:** Four selectable stages (order-created, metafield save, reported five-minute ETA notice, later fulfilment/tracking), fictional order and zone controls, typed order data inspector, distinct ETA email / shipping email / SMS visual previews, a missing-tracking option and a failed-ETA-write guard. The shipping email uses a sanitised version of the owner-provided customer-facing example without copying actual order identifiers, postcode, tracking number, contact details or assets.
- **Documentation and SEO:** Updated component-level comments, scoped CSS notes, source code-explorer explanations, project description and maintained JRV guide v1.9. Kept separate self canonical and environment-aware preview noindex/indexable-on-approved-publication behaviour; no new route, favicon, palette tokens or external requests.
- **Validation:** Added pure JS assertions and Chromium desktop/tablet/mobile tests for stage transitions, email/SMS timing semantics, no premature tracking, and failed metafield writes. Full exact-head CI, screenshots and Vercel preview verification **pending** until the new commit runs. Do not reuse earlier green commit as proof.
- **Release gate:** PR remains draft, unmerged; future production release needs explicit owner approval and source verification of actual Shopify notification template, store-side delay and SMS integration before presenting those as independently confirmed delivery behaviour.


## 2026-11-22 - Stage production SEO for custom Shopify app case study (draft only)

- **Branch and release:** `integration/commerce-systems-latest-main-20261122`, Draft PR #100; published `main` and `jrvallite.com` untouched. Existing `/cartoncloud-integration` remains published, indexable, independently canonicalised and linked; no redirect.
- **Files:** `app/projects/commerce-integration-engineering/page.tsx`, `app/sitemap.ts`, `scripts/check-seo-publication.mjs`, `tests/seo-rendered-metadata.mjs`, `docs/commerce-integration-lab-2026-11-22.md`, `docs/JRV_DESIGN_SYSTEM.md`, and `CHANGELOG.md`.
- **Purpose:** Distinguish the new interactive **custom Shopify app / Cloudflare Workers engineering** case study from the original **Shopify–CartonCloud integration** story. Stage a concise 51-character base title (plus site suffix), an honest 141-character metadata description, self canonical, matching Open Graph and separate sitemap listing on an eventual approved production build.
- **Preview protection:** `VERCEL_ENV === 'preview'` makes the new page `noindex,nofollow` and **omits the route from the preview sitemap**. The locally built production-equivalent candidate includes the route and allows indexing only when actually published. Platform preview protection remains an additional defence, not the sole mechanism.
- **Tests added:** Source guards verify per-environment indexing, canonical alignment, preservation of the older integration route; rendered Next.js tests verify distinct page titles/descriptions, explicit indexable metadata, both self canonicals/OG URLs, both sitemap entries in production-equivalent local build, and existing 11-gallery/four-card coverage.
- **Visual identity:** No CSS, logo, site palette or homepage layout changes. Maintained JRV design guide v1.8 clarifies the preview-versus-production route-policy exception; previous 1.7 remains historical.
- **Validation verified:** Exact SEO source commit `8634961303c29fe3c9ce3019c2b04b304a8a409d` passed both GitHub Actions runs [45028014444](https://github.com/bonvallite/developer-portfolio/actions/runs/45028014444) (push) and [45028021908](https://github.com/bonvallite/developer-portfolio/actions/runs/45028021908) (PR), including Node/Python, public safety, TypeScript, Next.js, local rendered metadata/sitemap, and Chrome desktop/tablet/mobile QA. Vercel preview `developer-portfolio-o9ihlf03r-my-dojo.vercel.app` is READY; authenticated HTTP checks confirmed `noindex,nofollow`, `x-robots-tag:noindex`, correct canonical/OG URL, original case study HTTP 200, and preview sitemap with 22 entries excluding the new route. **Production remains unchanged** until an explicitly authorised merge.
- **Rollback gate:** Before any release, confirm current main has not advanced, PR is clean, tests pass, and both case-study pages provide different user value. Restoring `noindex` and removing the new sitemap route is a small reversible source change if publication is deferred.


## 2026-11-22 - Reconcile Shopify systems lab with published 11-site portfolio (draft integration)

- **Source and branch:** Current published `main` at `90ea2d30ba0470828b451cb76fd8595df060e06b`; new preview-only `integration/commerce-systems-latest-main-20261122`. Existing draft PR #98 remains separate, unmerged, and non-mergeable due to mainline divergence. Do not modify `main` or the production Vercel domain without further approval.
- **New standalone route:** `app/projects/commerce-integration-engineering/{page.tsx,SystemsLab.tsx,CodeExplorer.tsx,AdvancedLabs.tsx,engineering-lab.css}`; `lib/commerce-integration-demo.{mjs,d.mts}`; `tests/commerce-integration-{demo.test,browser-qa}.mjs`; and `docs/commerce-integration-lab-2026-11-22.md`. Public-safe fiction only, no real API calls or client information.
- **New homepage flagship:** `app/components/FeaturedSystemsLab.tsx`, `app/components/featured-systems-lab.css`; integrate under `app/page.tsx` **after** the already-published 11-site desktop/mobile gallery and **before** Expertise. Add concise Systems navigation links and a footer link. The original four selected-work cards, current gallery and original CartonCloud case study remain.
- **Reconciled checks:** Retain latest-main `.github/workflows/portfolio-ci.yml` and existing test suites while adding candidate-branch CI and the dedicated commerce-lab desktop/tablet/mobile browser step. Extend `tests/homepage-browser-qa.mjs`, `tests/seo-rendered-metadata.mjs` and `tests/portfolio-palette.test.mjs` to verify the 11-site gallery, all four original projects, separate system diagram, two case-study CTAs, draft `noindex` and sitemap exclusion.
- **Palette and documentation:** The permanent `docs/JRV_DESIGN_SYSTEM.md` v1.7 draft entry describes the new route and canonical CSS-token reuse (Obsidian `#0B1419`, Electric Teal `#38C7BC`, Ember `#F28C52`) with responsive/reduced-motion requirements. Update the `AGENTS.md` release rule to reflect that PR #96 is already published, not still draft. Retain source comments and prior history.
- **Why:** The original feature branch was 19 commits behind `main`; copying its old homepage/workflow would have overwritten published design and 11-storefront gallery enhancements. A fresh exact-main integration candidate avoids those conflicts.
- **Validation:** Exact application integration commit `afee9c51822c9ac22fad32f7785e9f827403471c` passed GitHub Actions [run 45026760172](https://github.com/bonvallite/developer-portfolio/actions/runs/45026760172): SEO/privacy and publication safety, Node/Python, TypeScript, production build, rendered metadata/sitemap, homepage 11-site/gallery tests, all current flagship browser suites, the new engineering-lab desktop/tablet/mobile interactions, local synthetic performance and palette QA. Screenshot artefacts (including homepage wide/mobile and engineering desktop/mobile) were generated and reviewed; no obvious layout/brand regression found. Vercel preview `developer-portfolio-9u0010ugi-my-dojo.vercel.app` READY. Release **still draft**.
- **SEO/release boundary:** New route remains `noindex,nofollow` and excluded from the sitemap, with self-canonical. Existing `/cartoncloud-integration` stays published and indexable. No retirement, redirect, third-party integration change, Shopify theme change or production publication in this commit.


## 2026-11-22 - Publish cinematic portfolio, 11-site gallery and maintained JRV palette

- **Release:** Owner authorised the final release review; integrated PR #96 merged into `main` as `2c95f43c`, publishing to `www.jrvallite.com` and `jrvallite.com`. Vercel production deployment `dpl_2MmaXk9YgwnKr5dVAxQS8e5henky` reported READY with both custom-domain aliases assigned.
- **Scope:** All 11 live storefront references and 21 dated optimised homepage captures, selected desktop/mobile gallery, existing direct-homepage links, four cinematic engineering case studies, and canonical JRV Obsidian `#0B1419`, Electric Teal `#38C7BC`, Ember `#F28C52` palette. Excluded the incomplete Axlrodd desktop image.
- **Validation:** Final source commit `9b68f13b` passed GitHub Actions `44997913434`, including build, type, public-safety and desktop/mobile browser checks. Production merge `2c95f43c` compiled successfully in Vercel; the deployment was READY and the custom domains assigned. No independent HTTP fetch through this assistant's environment was available.
- **Publication limitations:** Public screenshot rights beyond owner acceptance, external GTM/Clarity account configurations, field performance, historic document copies and spoken screen-reader interaction were not independently certified. The production site had existing consent-gated GTM/Clarity logic before this PR; the release did not introduce the vendors.
- **Post-release documentation:** Updated `docs/JRV_DESIGN_SYSTEM.md` to v1.6, `docs/portfolio-release-candidate-2026-11-22.md` and this changelog to reflect publication; no runtime code, inline behaviour, screenshot assets, tokens or live Shopify themes were changed by this documentation commit. Older draft changelog entries remain as dated snapshots.

## 2026-11-22 - Complete draft homepage visual review and correct gallery provenance wording

- **Repository and release:** `bonvallite/developer-portfolio`, draft PR #96, branch `integration/2026-11-22-cinematic-release`; production `main` remains unchanged.
- **Files:** `app/page.tsx`, `app/data/storefronts.ts`, `tests/cinematic-home.test.mjs`, `docs/JRV_DESIGN_SYSTEM.md` (v1.5), `docs/portfolio-release-candidate-2026-11-22.md` and `CHANGELOG.md`.
- **Why:** User-facing copy and the store registry comment incorrectly implied preview images came only from an external thumbnail service. The draft actually prioritises 21 locally hosted, checksum-verified 19 November 2026 WebP captures with remote-thumbnail and live-site fallbacks.
- **What changed:** Corrected dated screenshot disclosures and inline comments, added a source regression, and recorded visual review. No changes to portfolio palette tokens, screenshot pixels, external sites, gallery behaviour, tracking, Shopify themes, or live Vercel deployment.
- **Validation before the copy change:** CI run `44995892908` passed at `d5b9b936`; inspected its 1366px desktop and 390px mobile homepage screenshots for the 11-site index and Peter Augustus preview pair, and the four flagship desktop/mobile project palette captures. CI screenshots do not establish image publication rights or production performance. **The new exact-head CI and preview must still pass.**
- **Release gate:** Draft only; client-screenshot rights/attribution, optional analytics configuration, final accessibility/privacy review, and explicit owner approval are outstanding.

## 2026-11-22 - Verify imported website previews, lock project palettes and remove temporary write workflow

- **Repository/branch:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, draft PR #96. No Shopify theme change or production publication.
- **Assets imported:** GitHub Actions `44995532587` completed successfully and created asset commit `4a0d040b` from public capture run `44490966868`. The tree now has 21 optimised desktop/mobile WebP previews (about 285 KB combined with manifest) and `public/portfolio/storefronts/capture-provenance.json`. The captured Axlrodd desktop screen was incomplete and remains excluded.
- **Files affected by cleanup:** Removed `.github/workflows/import-storefront-captures.yml` (temporary `contents:write` privilege). Updated `tests/cinematic-home.test.mjs`, `tests/portfolio-palette.test.mjs`, `app/experience/StorefrontShowcase.tsx`, `README.md`, `docs/JRV_DESIGN_SYSTEM.md`, `docs/STOREFRONT_CAPTURE_WORKFLOW.md`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **Why:** Preserve real homepage previews with known provenance while leaving no elevated-write importer in the portfolio release. Prevent future changes silently deleting/corrupting the screenshot archive or dropping the JRV Obsidian `#0B1419`, Teal `#38C7BC`, Ember `#F28C52` palette from any of the four flagship projects.
- **Inline documentation:** Updated the gallery source comments and dated-capture text, living design-system file map/history (v1.4), README, screenshot workflow and release record. Old entries remain as historical records.
- **Validation:** Verified GitHub importer success and 22 expected repo entries (21 WebP + provenance), provenance source run and SHA-256 file values, exclusion of invalid Axlrodd desktop, and Vercel exact image responses: Peter Augustus/Eve Curls/Tronus return `200 image/webp`, the excluded image `404` as expected. Added source regression to verify all 21 image byte hashes and no temporary workflow, plus canonical project colour assertions. New exact-head GitHub CI, responsive screenshots, Vercel preview and external screenshot publication-rights review remain required before a production release.
- **Publication scope:** PR #96 remains draft; current `main` retains the published original-résumé PDF retirement. No portfolio release is authorised by this cleanup.

## 2026-11-22 - Stage provenance-checked local website screenshots with safe fallbacks

- **Repository/branch:** `bonvallite/developer-portfolio`, draft `integration/2026-11-22-cinematic-release`, PR #96. No production publication or Shopify theme edit.
- **Files:** `app/data/storefronts.ts`, `app/experience/StorefrontPreview.tsx`, `scripts/optimise-storefront-captures.py` (new), `.github/workflows/import-storefront-captures.yml` (new, temporary), `tests/cinematic-home.test.mjs`, `README.md`, `docs/JRV_DESIGN_SYSTEM.md`, `docs/STOREFRONT_CAPTURE_WORKFLOW.md`, `docs/portfolio-release-candidate-2026-11-22.md` and `CHANGELOG.md`.
- **Why:** Third-party WordPress mShots can return placeholders, stale previews or blocked responses. Prefer genuine compressed local screenshot assets from the already inspected 19 Nov GitHub Actions archive and retain fallback behaviour for missing images.
- **Behaviour:** Derive approved filenames from the single 11-site registry; prefer local WebP, downgrade once to WordPress mShots on failure, then display the direct live-site link. The incomplete Axlrodd desktop capture is not used. No fabricated screenshots, new tracking, personalised code, Shopify API calls or additional font downloads.
- **Controlled asset staging:** A temporary scoped workflow runs only when its file is introduced/updated on the draft integration branch, downloads pinned run `44490966868`, validates manifest, dates, store identities, PNG signatures and sizes, compresses 21 images, and tries to commit only `public/portfolio/storefronts/` without force-push. It must be removed after review; do not retain a permanent contents-write workflow in the public release.
- **Documentation:** Updated relevant source comments, living design-system version 1.4 and history, README, screenshot workflow and release gates. Keep published files out of production until external rights and visual review are approved.
- **Validation:** Verified the original archived 22 successful site captures and two retired-site failures, selected acceptable imagery from a contact sheet, excluded near-empty desktop state, and prepared runtime/source checks for local-to-remote-to-live fallbacks. Import job, exact-head GitHub CI and preview asset responses remain pending.
- **Release:** PR #96 remains draft; existing original-résumé privacy retirement and main are unchanged.

## 2026-11-22 - Restore the 11-site storefront homepage gallery and unify project framing

- **Repo and branch:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, draft PR #96. No Shopify theme or production edit.
- **Files:** `app/data/storefronts.ts` (new), `app/page.tsx`, `app/experience/page.tsx`, `app/cinematic-home.css`, `app/globals.css`, `tests/cinematic-home.test.mjs`, `tests/homepage-browser-qa.mjs`, `tests/portfolio-palette.test.mjs`, `README.md`, `docs/JRV_DESIGN_SYSTEM.md`, `docs/STOREFRONT_CAPTURE_WORKFLOW.md`, `docs/portfolio-release-candidate-2026-11-22.md` and `CHANGELOG.md`.
- **Problem and result:** The cinematic rebuild prioritised four engineering demonstrations but no longer showed the list of published websites and their homepage previews on the homepage. Restored an interactive 11-site desktop/mobile gallery and all 11 direct website links after selected work, with a new primary-navigation shortcut. The experience page still has Peter Augustus' dedicated custom-homepage case study and the other ten references; the retired Skull Seeker website remains excluded.
- **Visual and source documentation:** Reused the existing accessible StorefrontShowcase and lazy screenshot component with live-site fallback. Updated gallery surfaces, older experience cards and legacy flow-page background to the documented Obsidian/Teal/Ember palette; all flagship project demos remain in the established colour system. Updated CSS/JSX comments, the living design system (version 1.3 and dated history), README, capture provenance, and release note. Preserved the existing palette hex values.
- **Capture provenance and limits:** Recovered run `44490966868` archive (22 successful images for 11 active stores). A visual contact-sheet check found actual desktop/mobile homepages but also timed promotions, overlays and an incomplete loading view. These snapshots are **not** claimed as publication-approved static assets or independent authorship/attribution evidence; the public gallery continues using cached mShots thumbnails and explicit fallbacks.
- **Validation:** Audited the exact branch source and original gallery, all 11 approved names/links, capture manifest, existing theme CSS, responsive homepage tests and current design-system rules. Added checks for shared site registry, gallery access, 11 linked homepages, source capture parity, selected preview frames, navigation and responsive/colour behaviour. Exact-head GitHub Actions, Vercel preview and manual mobile/desktop review must still pass before release.
- **Release gate:** Keep PR #96 draft. Do not erase published résumé privacy hotfix, misstate SEO/CRO results or introduce client code. Publication rights, third-party thumbnail reliability and GTM/Clarity audit remain open.

## 2026-11-22 - Put distinct Shopify client and hiring routes on the homepage first screen

- **Repository and branch:** `bonvallite/developer-portfolio`, draft PR #96 at `integration/2026-11-22-cinematic-release`. No changes to the Peter Augustus Shopify theme or live portfolio.
- **Files:** `app/page.tsx`, `app/cinematic-home.css`, `tests/cinematic-home.test.mjs`, `tests/homepage-browser-qa.mjs`, `docs/JRV_DESIGN_SYSTEM.md`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **What/why:** The first-screen introduction explained Shopify engineering but its generic proof badges did not help two important audiences quickly choose a relevant next action. Clarified the storefront/operations remit and named Liquid/JavaScript, B2B, Python and Cloudflare. Replaced three generic noninteractive badges with two accessible direct paths to existing contact and professional experience destinations, while preserving the working project studio, selected work and résumé buttons.
- **Inline/documentation:** Updated homepage and route CSS comments, source/browser test headers, and the maintained design guide to version 1.2 with the distinct first-screen journeys documented in its decision history. All canonical colour tokens remain unchanged; the route styles reuse existing JRV tokens and colours.
- **Privacy, SEO and evidence:** No visitor input, new lead form, event beacon, external imagery, private source, fabricated results, structured-data change, or additional analytics. All existing fictional-demo disclosures and technical evidence remain. Original résumé retirement is preserved.
- **Validation:** Reviewed the original hero, site-wide CTA and consent rules, four-viewport homepage QA, existing source guards, design guide and release history. Added source checks and four-viewport tests for first-screen client/hiring links, destinations, keyboard/touch reach and layout overflow. A new exact-commit CI run, Vercel preview and screenshot inspection remain required before marking visual QA complete.
- **Release:** Draft/unmerged, no production push or deployment promotion.

## 2026-11-22 - Fix escaped source assertions in conversion-ending regression

- **Repository and branch:** `bonvallite/developer-portfolio`, draft `integration/2026-11-22-cinematic-release`, PR #96. No production or Shopify theme changes.
- **Files:** `tests/spend-save-presentation.test.mjs`, `CHANGELOG.md`.
- **Change and reason:** The just-added source assertions used over-escaped regular expressions. Replace only those assertions with exact-string checks for the three engineering boundaries, fixed mailto and hiring links, disclosure, absence of forms/network calls, and scoped responsive CTA styles. Leave original reward/Flow tests intact.
- **Validation:** Reviewed the exact committed test source and checked test structure and expected strings; an exact-commit GitHub run must pass before reporting the feature as validated. No runtime or CSS changes were made.
- **Release:** Draft only; published résumé privacy hotfix and production remain unchanged.

## 2026-11-22 - Give the Spend & Save engineering story a clear conversion ending

- **Repository/branch:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, draft PR #96. Not a Shopify theme change and no production publication.
- **Files:** `app/projects/spend-and-save/page.tsx`, `app/projects/spend-and-save/spend-save-visual.css`, `tests/spend-save-presentation.test.mjs`, `tests/spend-save-visual-browser-qa.mjs`, `docs/JRV_DESIGN_SYSTEM.md`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **What and why:** The original case study taught cart reward progression, metaobject rules, post-checkout Shopify Flow and a hypothetical AOV calculation, but ended with only a generic email link. Added a three-boundary summary and two distinct contact/hiring paths to help technical readers understand how the skill applies to a real role or Shopify project. Primary uses a fixed-subject mailto and secondary links to existing `/experience`. The footer returns to homepage contact choices.
- **Visual and inline documentation:** Added route-scoped two-column Ember/Teal layout, single-column tablet/mobile adaptation, minimum 48px calls to action, existing focus behaviour and reduced-motion respect. Updated JSX/CSS/test comments. Updated living design-system guidance to version 1.1 and appended its dated history; no changes to canonical colour tokens.
- **Security and evidence:** Fictional prices and modelled uplift remain clearly disclosed. No customer information, client credentials, form submission, extra tracking, app API requests, fulfilment edits or changes to actual order/email behaviour. Preserved previously approved original-résumé retirement.
- **Validation:** Reviewed current source comments, reward rules and step-gating tests, the existing 1440px/tablet/390px Playwright flow, the maintained design guide and the exact integration branch head. Added assertions for the closing message, separate project/hiring links, no lead form, touch targets and responsive overflow. Fresh GitHub CI and preview inspection must pass on the new commit before calling visual QA complete.
- **Release boundary:** PR #96 remains draft and unmerged, and production stays unchanged. Wider GTM/Clarity, source-publication and assistive-technology checks remain open.

## 2026-11-22 - Establish the permanent JRV design-system document and update contract

- **Repository/branch:** `bonvallite/developer-portfolio`, draft `integration/2026-11-22-cinematic-release` (PR #96). No production release or Shopify theme changes.
- **New files:** `docs/JRV_DESIGN_SYSTEM.md` (living, maintained reference for ten `--jrv-*` palette tokens, visual roles, scoped exceptions, file ownership, update process and dated decision history); `AGENTS.md` (future contributor/code assistant instructions).
- **Updated files:** `README.md`, `CONTRIBUTING.md`, `ENGINEERING_STANDARDS.md`, `.github/pull_request_template.md`, `app/globals.css`, `docs/jrv-brand-palette-2026-11-22.md`, `tests/portfolio-palette.test.mjs`, and `CHANGELOG.md`.
- **What/why:** Make brand colours discoverable and consistently maintained in future portfolio changes instead of relying on a dated November release note. The runtime CSS tokens remain authoritative for rendering; a permanent human reference now lists matching HEX values and describes when and how future changes must update the guide, inline comments, project changelog, browser QA and PR checklist.
- **Inline and written documentation:** Updated `app/globals.css` header to name the maintained source and ownership. Kept historical palette snapshot as evidence and linked its living successor. Added links and change-control requirements to contributor/engineering/PR instructions; no page design, résumé binaries, consent rules or runtime behaviour were changed.
- **Validation performed:** Read existing dated palette guide, all ten `:root` CSS tokens, active palette tests, README, engineering/contribution standards, PR template and release status. Checked all ten documented HEX codes against the existing runtime declarations, added unit tests to compare the complete token table with `app/globals.css`, and required documentation links in all contributor entry points. An exact-commit GitHub Actions run and preview check are required after commit; automated tests cannot certify the prose or contrast.
- **Release boundary:** The design guide and process changes remain on draft PR #96, pending the broader portfolio release approval; published `main` and the original-résumé retirement stay untouched.

## 2026-11-22 - Recognise the JRV hover shade in mobile-colour browser QA

- **Repository/branch:** `bonvallite/developer-portfolio`, draft PR #96 `integration/2026-11-22-cinematic-release`, no Shopify theme or production edits.
- **Files:** `tests/portfolio-palette-browser-qa.mjs`, `docs/jrv-brand-palette-2026-11-22.md`, and `CHANGELOG.md`.
- **What and why:** The first exact-head palette CI run passed standard validation and all 19 desktop routes, then its mobile Shopify CRO CTA assertion received `rgb(255,181,139)` instead of default Ember `rgb(242,140,82)`. The existing service CSS intentionally uses `#FFB58B` on hover; Chromium's mouse can overlap the CTA even at phone viewport width. Accept documented default/hover Ember variants (including homepage `#FFAB79`) while still rejecting arbitrary colours.
- **Inline documentation and validation:** Added nearby test comments and updated palette guide to distinguish default from pointer-hover state. Reviewed the current CSS declarations for service/homepage/CSS Lab, GitHub Actions exact failing line, and preserved no-tracking, overflow, H1 and screenshot tests. A fresh exact-commit GitHub run and Vercel preview remain required to confirm all 19 routes on desktop and mobile.
- **Release:** PR remains draft and unmerged; main and the retired original résumé stay unchanged.

## 2026-11-22 - Unify JRV site-wide palette and preserve the released résumé hotfix

- **Repository/branch:** `bonvallite/developer-portfolio`, draft PR #96 at `integration/2026-11-22-cinematic-release`. Reconciled with `main` `ecf8e5ad05fd2a9186b9b01111ffc1df28bb0ae9` as the second merge parent; no live portfolio colour change yet.
- **Presentation files:** `app/globals.css`, `app/cinematic-home.css`, `app/components/cinematic-service.css`, `app/data-extraction-automation/page.tsx`, `app/data-extraction-automation/visual-demo.css`, `app/css-lab/css-lab.module.css`, `app/b2b-demo/page.tsx`, `app/python-automation/page.tsx`, `app/privacy/page.tsx`, `app/projects/spend-and-save/spend-save-base.css`, `app/b2b-modernisation/cinematic.css`, `app/b2b-modernisation/b2b-showcase.css`, `app/resume/resume.css`, `app/resume/resume-export.ts`, `app/editorial-homepage-demo/demo.module.css`, `public/portfolio/eve-curls-markets.svg`, `app/icon.svg`.
- **Tests/documentation:** Added `tests/portfolio-palette.test.mjs`, `tests/portfolio-palette-browser-qa.mjs`, and `docs/jrv-brand-palette-2026-11-22.md`. Updated `.github/workflows/portfolio-ci.yml`, `README.md`, `docs/portfolio-release-candidate-2026-11-22.md` and this changelog.
- **Changes:** Replace previous gold/bronze on older site routes, diagrams and components with shared obsidian `#0B1419`, electric teal `#38C7BC`, ember `#F28C52`, accessible cool light text and deep-teal surfaces. The lightweight editorial demo remains light; ATS/Classic retain their separate printable layouts and readable dark-teal elements. No fictional values, business logic, consent, routing or operational secrets changed.
- **Favicon:** Recoloured only the indexed PNG palette of the approved 64×64 JRV favicon; CRC checks passed, IDAT pixels and tRNS alpha were byte-identical. Preserved the existing JRV monogram and transparent corners.
- **Documentation:** Updated relevant CSS and source comments, public README current/historical notes and the design guide, keeping dated historical records accurate.
- **Validation:** Audited legacy theme colour sources, normalised presentation values, checked icon format/palette CRC, retained prior client-only simulations, added Node palette and 19-route desktop/mobile browser assertions and CI screenshot artefacts. Full fresh GitHub CI, responsive screenshots and Vercel final preview must pass before declaring the visual change ready.
- **Release controls:** Live legacy résumé retirement from PR #97 is retained and cannot be undone through this draft. Do not merge or publish PR #96 before consent vendor, accessibility and external rights reviews.

## 2026-11-22 - Owner-approved production hotfix: retire original résumé PDF only

- **Repository and branch:** `bonvallite/developer-portfolio`, `hotfix/2026-11-22-retire-original-resume`, derived from `main` `ac519c363bb303249adc911d0600679857df4a8d`. This narrow hotfix is separate from draft integrated portfolio PR #96 and does not include its feature changes.
- **Affected files:** Remove `public/JRV-Resume.pdf` and `backups/resumes/JRV-Resume-2026-Original.pdf` (both historic blob `a7d4648238f748f625004890bb8aac4b5443915b`). Update `next.config.ts`, `README.md`, `scripts/check-seo-publication.mjs`, `tests/seo-rendered-metadata.mjs` and `CHANGELOG.md`.
- **What and why:** The owner explicitly approved retiring the older original PDF from the public website and current Git branch while retaining ATS-Friendly and Classic online/PDF/Word versions. Make `/JRV-Resume.pdf` redirect permanently to `/resume` to preserve old bookmarks without serving the older contact information.
- **Inline documentation:** Added Next.js route comments; clarified README current/public scope; added source and rendered redirect tests. Preserved existing history and source conventions.
- **Validation:** Reviewed both original binary path SHA values in GitHub directory metadata and confirmed the production main base. This hotfix uses the exact inspected redirect/README/source-guard changes with a main-compatible rendered regression, leaving the current generated résumé code untouched. GitHub CI, Vercel preview and final production verification must be completed on the hotfix commit before marking the live website updated.
- **Limitations:** Deleting files from new/current main commits does not erase earlier public Git history, backup branches, old Vercel deployments, search caches or downloaded copies. ATS and Classic still contain explicitly published personal details and are noindex, not private. This is not a Shopify theme change or an approval to release the pending full portfolio redesign.

## 2026-11-22 - Retire original résumé PDF from current draft on owner's approval

- **Target:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, draft PR #96. Production main and Shopify themes unchanged.
- **Affected files:** Delete `public/JRV-Resume.pdf` and `backups/resumes/JRV-Resume-2026-Original.pdf`. Update `next.config.ts`, `README.md`, `scripts/check-seo-publication.mjs`, `tests/seo-rendered-metadata.mjs`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **What and why:** With explicit owner approval, remove both copies of the older original 2026 PDF (matching blob `a7d4648238f748f625004890bb8aac4b5443915b`) from the current draft Git tree because it may expose obsolete contact information. Redirect existing `/JRV-Resume.pdf` bookmarks permanently to the `/resume` chooser rather than returning the original document. Preserve ATS-Friendly and Classic HTML, PDF and Word alternatives.
- **Documentation:** Add Next.js redirect comment, replace outdated current-status README guidance while retaining dated historical context, expand source/rendered SEO tests and release-review notes.
- **Validation:** Checked both legacy file paths and identical blob hashes using the GitHub directory metadata, verified exact draft branch head and maintained approved résumé paths. Added source checks for binary absence and configured redirect, and HTTP GET/HEAD checks that the old path redirects to the chooser while both new options stay linked. Fresh GitHub CI and Vercel preview are required before a release claim.
- **Limitations:** This does **not** erase old Git objects, backup branches, previous deployments, caches or downloads. Live `jrvallite.com` remains unchanged until a separately approved production release. Optional GTM/Clarity settings remain a separate decision.
- **Release boundary:** Do not merge or publish PR #96 without final approval; do not touch private backups or unrelated source files.

## 2026-11-22 - Harden generated résumé caches and test public crawler controls

- **Target:** `bonvallite/developer-portfolio`, draft `integration/2026-11-22-cinematic-release` PR #96; Shopify theme and production untouched.
- **Affected files:** `app/resume/[design]/[format]/route.ts`, `tests/seo-rendered-metadata.mjs`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **Change:** Keep both ATS and Classic résumé formats and legacy compatibility path available, but avoid shared/browser caching of dynamically generated PDF and Word files by returning `Cache-Control: private, no-store`. Align handler robots directives with noindex/nofollow/noarchive. Expand local rendered-SEO regression to inspect HTTP response headers and download format metadata, preserving indexability of the homepage and case studies and noindex for résumé routes and attachments.
- **Reason:** The generated downloads contain explicitly public contact details but previously permitted public caching for 3600 seconds. Preview deployments are broadly noindex for platform reasons, so local app-level tests are required to catch incorrect production SEO rules.
- **Documentation:** Updated route handler's explanatory comments, rendered test comments and release guide; preserved historic README and binary documents.
- **Validation:** Audited exact branch's route handler, Next.js headers, sitemap, robots, rendered SEO test, and fetched actual Vercel preview HTTP headers. Confirmed public and backed-up legacy files have identical Git blob hashes. Applied checked patches only to four text files. Fresh GitHub Actions source/build/rendered tests and the final-commit preview must pass; owner approval is still needed before removing any historic résumé assets or changing vendor analytics.
- **Release boundary:** PR #96 remains draft and unmerged; no production alias changes. `noindex` and cache controls are discoverability/storage signals, not access restrictions.

## 2026-11-22 - Move Spend & Save baseline CSS out of client page for stable first paint

- **Repository and branch:** `bonvallite/developer-portfolio`, draft `integration/2026-11-22-cinematic-release` PR #96. No Shopify theme edits or production deployment.
- **Files:** `app/projects/spend-and-save/page.tsx`, new `app/projects/spend-and-save/spend-save-base.css`, `app/projects/spend-and-save/spend-save-visual.css`, new `tests/spend-save-css-loading.test.mjs`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **What and why:** Synthetic Chromium layout-shift readings flagged Spend & Save (desktop 0.5883, phone 0.2308). A long globally applied layout stylesheet was previously rendered after the content inside a client component. Move its exact declarations to a static, earlier CSS import and retain the existing JRV visual overrides. This aims to prevent late baseline-style application and improve first-paint stability without touching the reward logic.
- **Inline documentation:** Updated component header and import note, baseline CSS header, visual override comments, and source regression tests. The release guide records the measured baseline and caveats.
- **Validation:** Inspected the original page JSX, inline CSS block, route visual styles, reward/Flow test coverage and exact integration branch head. Preserved the complete baseline CSS verbatim and verified there was no dynamic interpolation; added assertions for import order, no legacy global JSX style block and unchanged simulated reward steps. Fresh Next build, GitHub browser QA, and synthetic desktop/mobile layout-shift comparison are required before declaring a fix.
- **Release:** Draft PR only, no production merge/alias. Real-user CLS, code rights, public résumé/analytics decisions and a manual assistive-technology check are still outstanding.

## 2026-11-22 - Add reproducible local navigation report and disclose publication gates

- **Repository and branch:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, draft PR #96. No Shopify theme changes, Vercel promotion, or production publication.
- **Affected files:** `tests/performance-lab-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **Change and reason:** Generate a fixed, reproducible JSON sample of Chrome navigation, paint, layout-shift, and same-origin resource timings at desktop and phone widths for five representative portfolio routes. Keep the test on GitHub's local Next.js server and retain its report in CI artefacts. Browser checks fail for HTTP errors, missing H1, visible horizontal overflow, JS page errors, or optional tracking requested without consent. This provides directional lab evidence without inventing real-user or CDN performance claims.
- **Documentation:** The test file explains synthetic measurement limits and data minimisation; the CI comments document its conditional execution and artefact; the release guide describes field-vs-lab limitations, the public backup résumé and accessible résumé contact data, and unverified optional GTM/Clarity vendor settings. No previously published data or analytics controls changed.
- **Validation performed:** Reviewed current GitHub Actions, Playwright browser conventions, the existing consent architecture, the public résumé backup and release notes. Checked the new JavaScript syntax with Node 22 locally. Created exact-branch Git blobs and added the report to the existing CI screenshot upload stage. A fresh GitHub Actions run is required to verify the actual lab measurements and release-candidate tests.
- **Release boundary:** PR #96 stays draft and unmerged. A branch push may trigger a Vercel preview; that is not production. Owner decisions on public résumé material, optional analytics configuration, third-party code rights, and actual live performance remain open.

## 2026-11-22 - Fix mobile consent-control size and align privacy palette

- **Target:** `bonvallite/developer-portfolio`, integration branch `integration/2026-11-22-cinematic-release`, draft PR #96. No Shopify theme edit or production release.
- **Affected files:** `app/components/consent-manager.css`, `app/components/ConsentManager.tsx`, `tests/homepage-browser-qa.mjs`, `tests/site-analytics.test.mjs`, `docs/portfolio-release-candidate-2026-11-22.md`, and `CHANGELOG.md`.
- **Change:** Make the persistent Privacy choices tab at least 44px high with 12px text and visible focus at every viewport; update consent styling to JRV obsidian/teal/ember and expose the panel's `aria-expanded` state. Does not change opt-in logic, rejection, or tracking vendor configuration.
- **Reason:** Real GitHub 390px screenshots show a difficult-to-read 9px setting with a smaller-than-recommended touch target.
- **Documentation:** Updated CSS/component comments, test comments, and the release-candidate notes; preserved all historical documentation.
- **Validation:** Reviewed existing code, screenshot archive and unit/browser tests. Added static target/ARIA checks and browser checks for computed size, viewport placement, keyboard reopening and re-rejection with no optional tracking. Fresh GitHub Actions and Vercel visual preview must be validated on the new SHA. Manual assistive technology checks and publisher privacy review remain open.
- **Release boundary:** PR #96 remains draft and unmerged; production and custom aliases unchanged. The existing public backup résumé privacy-review item is intentionally not edited.

## 2026-11-22 - Assemble combined JRV release candidate and reconcile browser checks

- **Target:** `bonvallite/developer-portfolio`, `integration/2026-11-22-cinematic-release`, derived from main `ac519c363bb303249adc911d0600679857df4a8d`. Draft only, no production publication.
- **Affected files:** 21 code/test/documentation files copied exactly from PRs #83, #92, #93 and #94; `.github/workflows/portfolio-ci.yml`; `CHANGELOG.md`; `docs/portfolio-release-candidate-2026-11-22.md`.
- **What and why:** Verify all four cinematic portfolio updates in a single integrated build before publication. The source PRs individually pass but change the same CI workflow and changelog; this release candidate unites browser checks without overwriting unrelated main code.
- **Inline documentation:** Existing comments remain intact in the exact source blobs. Added explanatory comments in the shared CI job, and release-candidate notes with exact SHA provenance, limitations and manual acceptance criteria.
- **Validation:** Checked latest main, source PR file lists and blob SHAs, unique non-overlapping source paths, preserved validation/safety steps and screenshot paths. Fresh GitHub Actions and exact-commit Vercel integrated preview are pending.
- **Release:** Keep all original PRs open and this candidate unmerged until CI, visual, responsive, privacy, accessibility and performance reviews pass and final publication is approved. No private Shopify theme or Worker code edited.

## 2026-11-21 - Preserve focused homepage screen-reader announcements after homepage redesign

- **Target:** Public portfolio repository `bonvallite/developer-portfolio`; branch `fix/home-journey-screen-reader-announcements`, PR #83. No Shopify theme files changed.
- **Affected files:** `app/components/HomeJourney.tsx`, `tests/cinematic-home.test.mjs`, `tests/homepage-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, and `CHANGELOG.md`.
- **Change:** Integrate the existing PR #83 accessibility fix with the latest `main` homepage, preserving its newer four-mode interactive project studio and existing SEO/privacy checks. Move the journey's polite atomic announcement from the entire display to its selected H3, while leaving the descriptive and diagram content readable normally. Add source and Enter/Space browser regression checks at four viewport widths; include accessibility-fix PRs in the existing browser QA job.
- **Why:** The previous parent live region could repeatedly announce an entire decorative workflow on a step change, and PR #83's earlier code conflicted with subsequently merged homepage and CI improvements.
- **Inline documentation:** Updated `HomeJourney.tsx` and both affected test comments to explain live announcement ownership and how keyboard behaviour is verified. Updated the CI job comment to reflect the newly included branch family.
- **Validation:** Reviewed the original PR #83 diff, current main sources, test coverage and CI workflow. Inspected exact file replacements against current main before constructing the merge; the refreshed GitHub Actions checks are pending until the new PR head is published. Prior PR #83 commit `aec1540` passed its GitHub validation and desktop/tablet/mobile browser checks before `main` advanced, but that evidence does not validate the new merged head.
- **Open checks:** Require fresh green GitHub Actions results and saved screenshots on the new head. Actual NVDA/VoiceOver speech needs manual testing; a source test alone cannot certify screen-reader output. No new Vercel API call or production deployment is requested during the daily quota restriction. Vercel Git integration could independently attempt a preview on push.
- **Release and recovery:** Keep this PR unmerged until revalidation and review. Revert via the PR branch history; production `main` and domain aliases are unchanged by this branch operation.

## 2026-11-21 - Improve CartonCloud enquiry pathways and remove remaining gold labels

- **Repository/branch:** `bonvallite/developer-portfolio`, draft PR #92 `feature/cartoncloud-event-studio-20261121`. No Shopify theme changes.
- **Files:** `app/cartoncloud-integration/page.tsx`, `app/cartoncloud-integration/cartoncloud-showcase.css`, `tests/cartoncloud-event-studio-browser-qa.mjs`, `tests/cartoncloud-story.test.mjs`, `CARTONCLOUD_INTEGRATION.md`, and `CHANGELOG.md`.
- **Change and reason:** Close the engineering case study with a relevant integration enquiry and a separate hiring pathway, rather than prioritising only further reading. Preserve the technical documentation and other-projects links. Use a fixed `mailto:` subject, readable 48px primary links, one-column tablet/phone presentation and clearly qualified claims. Replace legacy gold Tailwind labels with teal evidence styling and ember colouring for open verification, consistent with the cinematic JRV identity.
- **Documentation:** Updated nearby page/stylesheet comments, source and responsive browser tests, and public integration documentation. No form, CRM, analytics tag, external API, new runtime dependency, client order, or private Worker data was introduced.
- **Validation:** Inspected current PR and target sources, relevant CSS, browser/source assertions and documentation. Constructed changes against the verified original branch head; reviewed static preservation checks for the integration studio, evidence boundaries and other links. Added browser tests for the exact mailto/hiring destinations, action height, responsive grid and existing link retention, plus source safety checks. Fresh CI, screenshots and final-commit preview remain pending; prior green CI applies only to the preceding SHA.
- **Release/recovery:** Retain this draft and do not merge or manually invoke Vercel. GitHub-connected pushes might independently attempt a preview. Manual visual and assistive-technology checks remain open. Revert through PR history if validation fails.

## 2026-11-21 - Add project and hiring enquiry pathways to Python Analytics Lab

- **Target / branch:** `bonvallite/developer-portfolio`, `feature/python-analytics-story-studio-20261121`, draft PR #93. No Shopify theme or live portfolio release.
- **Affected files:** `app/analytics-lab/page.tsx`, `app/analytics-lab/analytics-studio.css`, `tests/analytics-lab-browser-qa.mjs`, `tests/analytics-studio.test.mjs`, `CHANGELOG.md`.
- **What changed:** Add a purpose-built, two-audience end-of-story enquiry panel: a fixed `mailto:hello@jrvallite.com` analytics/CRO project enquiry, a direct internal `/experience` hiring path, and an illustrative three-step definition/validation/handover summary. Use route-only teal/ember/obsidian styling with 48px minimum link targets, responsive one-column mobile layout, and clear fictional-evidence boundaries. Preserve existing archive links, CSV download, reconciliation, privacy note, and other-projects footer link.
- **Why:** The lab previously finished with technical reading links and an "Other projects" footer, leaving employers and prospective clients without a dedicated, obvious next step.
- **Inline documentation:** Update React's file and panel comments and CSS scope/constraints; document contact safety and responsive assertions in both browser and source tests.
- **Validation performed:** Inspected the current PR #93, page, route/legacy CSS, source and Playwright tests, existing documentation, and changelog. Prepared exact, unique replacements and static preservation checks on the verified branch head. Re-read the saved tests, corrected the browser grid parser to match whitespace, and simplified source assertions to literal link/route checks before relying on CI. New GitHub Actions tests, screenshots, and any release preview are pending the final commit; previous successful CI cannot validate a new SHA.
- **Security and disclosure:** No form, tracking listener, external script, CRM, analytics API, client data, or new dependency. The email link is a browser `mailto:` action and does not claim delivery or lead collection. The three-step pathway is illustrative, not a verified project outcome.
- **Release / recovery:** Keep PR #93 draft and unmerged. Do not call Vercel until the deployment allowance and final-commit preview plan permit it. Revert via PR commit if checks fail; current `main` and production aliases remain unchanged. Github-connected pushes may independently request a Vercel preview.

## 2026-11-21 - Improve mobile B2B demonstration context controls

- **Target / branch:** Public JRV portfolio, `bonvallite/developer-portfolio`, `feature/b2b-entitlement-story-20261121` (PR #94). No Shopify theme changes or deployment.
- **Affected files:** `app/b2b-modernisation/b2b-showcase.css`, `tests/b2b-entitlement-story-browser-qa.mjs`, `docs/b2b-portfolio-story-2026-11-21.md`, `CHANGELOG.md`.
- **What changed:** Replace tiny 8px context-switch text with 12px and 44px-high interactive targets; reflow the four fictional retail/B2B contexts into a two-by-two grid at phone widths of 480px and below. Improve caption legibility and add browser assertions for computed sizes, overflow, grid shape and Space-key activation.
- **Why:** Improve the visual consistency, readability, and motor accessibility of the B2B hero on narrow phones without changing shared pricing or entitlement state.
- **Inline documentation:** Explain the min-size decision and responsive rule in route-scoped CSS; explain actual runtime assertions in the Playwright test and update the source-linked project documentation.
- **Validation:** Inspected the existing component, legacy and overriding styles, test suite, source notes, and current branch. Constructed changes against the exact branch head with unique patch markers and static preservation assertions. Re-read the saved browser suite and corrected its CSS grid-column parser to match whitespace instead of a literal backslash sequence before accepting the result. Fresh GitHub Actions browser/CI checks remain pending until the new commit runs; the old green run applies only to the prior SHA.
- **Release boundary:** Keep PR #94 as draft and unmerged. Vercel previews and production remain on hold until the external deployment quota allows a final-commit preview. The GitHub integration may independently attempt previews on branch updates. Manual device/assistive-technology validation and comparison to CI screenshots remain open.

## 2026-11-20 - Back up and rebuild the cinematic JRV portfolio on a protected branch

- **Scope:** `bonvallite/developer-portfolio`; backup `backup/2026-11-20-pre-cinematic-rebuild` at `cbb656e9`; proposed branch `redesign/2026-11-20-cinematic-portfolio`. Production unchanged until review.
- **Affected files:** `app/components/ServicePage.tsx`, `app/components/cinematic-service.css`, `app/page.tsx`, `app/cinematic-home.css`, `app/components/HomeJourney.tsx`, `app/components/LeadComposer.tsx`, `app/components/QuickContactDock.tsx`, `app/components/ConsentManager.tsx`, `app/components/consent-manager.css`, `app/layout.tsx`, `app/globals.css`, `app/privacy/page.tsx`, `next.config.ts`, `tests/site-analytics.test.mjs`, `tests/cinematic-home.test.mjs`, `tests/homepage-browser-qa.mjs`, `scripts/check-seo-publication.mjs`, `.github/workflows/portfolio-ci.yml`, `docs/portfolio-rebuild-2026-11-20.md`, `docs/analytics-consent-audit-2026-11-19.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Replace the crowded homepage with a wider JRV cinematic storefront-to-systems narrative, four project stories, four redesigned indexed service landing pages, interactive approach, employer and client pathways and direct enquiry composer with copy-email fallback. Add a scroll-triggered contextual project CTA only on long case studies, never over homepage or service hero actions. Replace initial GTM/Clarity/Vercel tracking with explicit consent, remove the render-blocking Google Fonts stylesheet and unused remote screenshot preconnect, and apply privacy and frame-protection response headers. Add homepage and privacy regression tests and browser screenshot QA.
- **Reason:** Improve clarity, professional credibility, lead conversion, performance posture, responsive accessibility and data minimisation without publishing client data or fake growth figures.
- **Validation:** Backup branch verified; initial PR #81 standard checks and Chrome QA passed. A subsequent service-page and screenshot-capture refinement requires fresh CI and visual review before merge. Private assets, public Git history, live third-party tags and real Core Web Vitals remain independently unverified; see audit document. No public zero-leaks guarantee.

## 2026-11-20 - Add visible architecture diagram and functional analytics dashboard demo

- **Repository and branch:** `bonvallite/developer-portfolio`, `feature/analytics-visual-demo-20261120`, based on latest `main` at branch creation.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/data-extraction-automation/visual-demo.tsx`, `app/data-extraction-automation/visual-demo.css`, `tests/case-study-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, `README.md`, `CHANGELOG.md`.
- **Change:** Add clearly visible, clickable architecture diagram covering six platforms and four processing stages, plus a realistic responsive fictional reporting dashboard with source-specific KPI cards, trend bars, CSV tables, a sample-period selector, and a client-side fictional CSV download. Promote “Try interactive demo” as the hero CTA. Keep the existing architecture explanation, walkthrough, and 17-file code explorer.
- **Why:** The published case study only had a static text-heavy platform diagram and code explorer; users could not find a tangible reporting mock-up or testable end-to-end visual flow.
- **Privacy and fidelity:** All dashboard data and exports are explicit fictional local fixtures. No live tokens, customer metrics, employer APIs, or claims of verified exports. The Shopify sample is a separate illustrative reporting handover, not verified GraphQL extraction.
- **Validation:** Added browser assertions for all six source nodes, pipeline stages, data switching, period selection and fictional CSV download across desktop, tablet and mobile. GitHub Actions and Vercel preview validation required before release.

## 2026-11-20 - Classic résumé editorial layout refinement
- **Repository and branch:** `bonvallite/developer-portfolio`, `design/classic-resume-refinement-20261120`.
- **Affected files:** `app/resume/resume.css`, `app/resume/resume-export.ts`, `README.md`, `CHANGELOG.md`.
- **Why:** The Classic résumé's full-width dark header and generic content treatment were visually heavy and insufficiently polished for direct employer presentation.
- **Changes:** Replaced its HTML preview's solid teal masthead with ivory paper, a restrained teal ribbon, serif name, subtle gold rule, better contact hierarchy, role/dates separation, and section dividers. Aligned Classic PDF's first-page masthead with white-paper typography and teal accents, and gave Classic Word a serif title and understated section rules. ATS format and approved career content remain unchanged.
- **Validation:** Source reviewed before editing; GitHub Actions checks, live deployment and rendered PDF/Word visual validation to be verified before claiming release complete.


## 2026-11-20 - Add analytics case study to the XML sitemap

- **Repository and branch:** `bonvallite/developer-portfolio`, `fix/analytics-case-study-sitemap-20261120` (from latest `main`).
- **Files:** `app/sitemap.ts`, `scripts/check-seo-publication.mjs`, `app/data-extraction-automation/page.tsx`, and `CHANGELOG.md`.
- **Change:** Add the publicly released `/data-extraction-automation` page to the sitemap; introduce a regression check for its sitemap inclusion and self-referencing canonical. Correct case-study inline comments to reflect the published sanitised code archive and its limitations.
- **Reason:** The deployed case study has valid metadata and a canonical but was missing from sitemap discovery. Avoid overwriting newer changes.
- **Validation:** Source inspection confirmed the missing route and valid canonical. CI and Vercel preview checks are required before merge; no production files changed in this branch.

## 2026-11-20 - Resume presentation and export overhaul
- **Target:** `bonvallite/developer-portfolio`; branch `design/resume-editorial-refresh-20261120`.
- **Affected:** `app/resume/page.tsx`, `app/resume/resume.css`, `app/resume/resume-export.ts`, `README.md`, `CHANGELOG.md`.
- **Why:** Both résumé variants lacked considered typography and spacing; Classic PDF placed a decorative sidebar across the body text region, and mobile previews were forced to a wide desktop minimum.
- **Change:** Rebuilt HTML preview spacing and responsive layout, established distinct deep-teal Classic and restrained ATS visual identities, replaced PDF's overlapping sidebar with a full-width editorial header, added safe continuation-page headers and folios, improved Word typography, preserved readable bullet markers in generated PDF text, and clarified résumé chooser copy. All versions retain the existing approved shared career data.
- **Validation:** Source inspected; automated tests, type checking, production build and live-route verification pending.


## 2026-11-20 - Complete ATS-friendly download URL and filename

- **Files:** `app/resume/page.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `scripts/check-seo-publication.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Canonical public ATS paths are `/resume/ats`, `/resume/ats/pdf`, and `/resume/ats/word`; both files download as `JRV-Resume-ATS-Friendly-2026` with the appropriate extension. Legacy `/resume/modern` and its download URLs remain valid but now use the same ATS-friendly export and filename.
- **Reason:** Remove ambiguous “Modern” filenames while preserving existing bookmarks and limiting the chooser to two unambiguous PDF download actions.
- **Validation:** Check GitHub CI, all old and new HTTP routes, download content types, PDF author and creator properties and DOCX core-properties, and Vercel production aliases. `scripts/check-seo-publication.mjs` explicitly validates only permitted `classic|modern|ats` variants.


## 2026-11-20 - Simplify résumé downloads and attribute document metadata accurately

- **Affected files:** `app/resume/page.tsx`, `app/resume/resume.css`, `app/resume/resume-export.ts`, `app/resume/layout.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `README.md`, `CHANGELOG.md`.
- **Purpose:** Give employers two unambiguous primary PDF buttons: ATS-Friendly Resume and Classic Resume. Keep browser previews and editable Word options as secondary actions.
- **ATS file:** Conventional single-column, real text and standard headings. Removed PDF decorative rule, header ornaments and heading bars from the ATS variant. Keep the Classic teal variant distinct.
- **Document properties:** PDF Info now includes the user's approved name as Author and uses the truthful JRV Portfolio Resume Export service as Creator/Producer. DOCX package contains a core-properties Author and Last Modified By set to the owner, descriptive Title, Subject and Keywords, and an application property describing the actual export service. Do not invent a named human editor, Microsoft Word, Adobe or another tool as document producer.
- **Privacy:** No new AI-platform provenance strings or source paths included in downloadable documents. This is not a claim that an AI-assisted drafting process never occurred; the repository revision history is unchanged. Continue `noindex, noarchive` on public download files and résumé pages.
- **Compatibility:** Existing paths `/resume/modern/pdf`, `/resume/classic/pdf`, and Word/preview variants remain valid. Legacy `public/JRV-Resume.pdf` and original archived backup remain untouched.
- **Validation:** GitHub source and tests, TypeScript and production build, live export response status, file signatures, PDF metadata and text content, and DOCX metadata checks required before marking production complete. ATS-friendliness is a design objective, not a guarantee from every ATS provider.


## 2026-11-20 - Publish classic and modern resume options (American English)

- **Files:** `app/resume/resume-data.ts`, `app/resume/resume-export.ts`, `app/resume/resume.css`, `app/resume/layout.tsx`, `app/resume/page.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Add two accessible on-site resume layouts (original-inspired Classic / modern editorial), generate public PDF and editable DOCX downloads on demand from one shared career-data module, and update portfolio navigation to present both choices.
- **Content:** American English; independent Shopify role January 2019–February 2026; Peter Augustus February 2026–present; owner-approved public email and telephone.
- **Privacy:** Resume preview routes have explicit `noindex` metadata and downloadable files emit `X-Robots-Tag: noindex, noarchive`. This is a discoverability signal, not access control. Public-facing search metadata remains skills-led.
- **Preservation:** The original `public/JRV-Resume.pdf` and separately archived `backups/resumes/JRV-Resume-2026-Original.pdf` remain unchanged for recovery and old links. New downloads are served under `/resume/{classic|modern}/{pdf|word}`.
- **Validation:** Require GitHub CI (publication-safety scan, tests, TypeScript and production build) and live HTTP, PDF/DOCX format and correct-content checks before claiming release.


## 2026-11-20 - Archive original résumé before approved US English revision

- **Target:** `bonvallite/developer-portfolio`, branch `backup/resume-original-before-us-2026`.
- **Files:** `backups/resumes/JRV-Resume-2026-Original.pdf`, `CHANGELOG.md`, `README.md`.
- **Change:** Preserved the exact 323,929-byte original public résumé at `backups/resumes/JRV-Resume-2026-Original.pdf` by reusing existing Git blob `a7d4648238f748f625004890bb8aac4b5443915b`. The active `public/JRV-Resume.pdf` remains unchanged until the approved 2026 American English two-page PDF can be uploaded and verified.
- **Why:** Maintain an explicitly named recovery copy in addition to Git history before replacing the public download.
- **Privacy:** The archived original can contain identifying and out-of-date contact details. This backup is in the public repository, not linked from the website; GitHub repository access can still expose it.
- **Validation:** Verified original file path, blob SHA and file size from latest main Git tree, then created the archive path using that same blob with no content modifications. Website and production PDF replacement remain pending.


## 2026-11-19 - Reconcile case study with current production homepage and professional links

- **Target:** `bonvallite/developer-portfolio`, PR #39; `main` commit `2456b99b564b906dde2de29c5a9bd94e9abacf26`.
- **Files:** `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Preserved newer homepage rotation, restored JRV identity, professional links and résumé, new B2B pages, while adding the analytics case study to the latest project evidence layout. Reconciled both changelog histories.
- **Reason:** Avoid overwriting unrelated work during release.
- **Validation:** Full CI required on reconciled branch. No theme files or customer records changed.

## 2026-11-19 - Complete local-browser QA for analytics case study

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, PR #39. No production merge or manual Vercel deployment.
- **Affected files:** `tests/case-study-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, `app/data-extraction-automation/interactive-lab.tsx`, `CHANGELOG.md`.
- **Change:** Added Playwright Chrome QA on a locally served Next.js build for desktop (1440×900), tablet (768×1024), and mobile (390×844). Checks route/structured output, the cinematic hero, absence of horizontal overflow, interactive lesson and code-tab controls, 17-file archive display, archive URL response and JavaScript page errors. Uploaded full-page screenshots as a seven-day GitHub Actions artifact.
- **Fix identified by browser QA:** Corrected the lesson tuple's positional mapping: `[stage, heading, description, deliverable]`. Previously the component displayed the description as the heading and omitted the deliverable.
- **CI configuration:** Replaced unsupported Playwright browser installation on Ubuntu 26.04 with an Ubuntu 24.04 runner and the runner-provided Chrome browser. Browser checks are restricted to this feature branch's pull requests to limit unrelated CI work.
- **Validation:** GitHub Actions run [#44529578132](https://github.com/bonvallite/developer-portfolio/actions/runs/44529578132) passed baseline SEO/privacy, publication safety, JavaScript/Python tests, TypeScript, production build and all three browser viewport checks. GitHub artifact `case-study-browser-qa` contains `desktop-full.png`, `tablet-full.png`, and `mobile-full.png`; downloaded and visually reviewed. External Vercel preview exists for merge commit `ef8bf211`, but the current post-QA changes were tested locally in GitHub, not deployed to production.

## 2026-11-19 - Merge analytics pipeline case study with current homepage work

- **Target:** `bonvallite/developer-portfolio`, `feature/google-analytics-api-portfolio-20261119`, PR #39.
- **Scope:** homepage selected-work case study card and matching project-evidence mapping; experience page link; case-study route and interactive lab; sanitised Python archive; README and Python portfolio documentation.
- **Resolution:** Retain current `main` homepage rotation/gallery, project storytelling and experience storefront showcases; introduce only the analytics project and source-safe links. Reconcile the two changelog branches without dropping either history.
- **Validation:** Source-level merge conflict review, no private data added. GitHub Actions must rerun on reconciled commit; release remains draft and unmerged.

## 2026-11-19 - Restore portfolio CI trigger and confirm merge blocker

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39.
- **Affected files:** `.github/workflows/portfolio-ci.yml`, `CHANGELOG.md`.
- **Change:** Restored the standard `main`-only push trigger while retaining the existing `pull_request` trigger. The temporary feature-branch push trigger had been used to obtain a complete GitHub Actions validation run.
- **Reason:** Keep normal CI conventions and avoid ongoing duplicate branch push workflows after successful verification.
- **Validation:** GitHub Actions run #44520783303 passed the safety, SEO, JavaScript unit, Python unit, TypeScript and Next.js build checks on commit `0e753407`. Archive readback contains 17 Python files and a targeted scan found no personal Windows paths, email addresses, or known employer identifiers. GitHub PR API currently reports `mergeable_state: dirty`, so this branch is **not merge-ready**; conflicts against `main` still require resolution. No production merge was performed.

## 2026-11-19 - Publish sanitised Python source and interactive cinematic case study (GitHub only)

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39, no approved production merge.
- **Affected files:** `public/case-studies/ecommerce-analytics/sanitised-python-source-archive.md`, `app/data-extraction-automation/interactive-lab.tsx`, `app/data-extraction-automation/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the full content of 17 owner-uploaded Python scripts in a public, sanitised Markdown archive; added a five-stage educational walkthrough, selectable Python code examples and explanations, and a CSS-only cinematic pipeline visual. Linked the archive from the interactive case study and documented the important limits.
- **Why:** Communicate the real engineering process from business requirements to API-based delivery, and make substantial Python work inspectable without publishing private client identifiers or raw datasets. Keep the page lightweight and accessible.
- **Documentation:** Added source-provenance and confidentiality comments in the code; updated README to reflect that the sanitised scripts are now publicly available rather than withheld.
- **Sanitisation:** Replaced the GA4 property ID, Search Console site/property, employer brand search expressions and Windows user paths with example values. No OAuth client secrets, access tokens or raw customer data were uploaded. The source is educational and not configured to run against live systems as provided.
- **Validation:** Confirmed GitHub content readback for the case-study page, interactive component and archive; scanned those files for known private identifiers; confirmed 17 Python sections in the source archive. TypeScript, npm tests, public-safety script, production build and browser QA remain **unverified** in this session. GitHub commits can automatically trigger Vercel previews even though no direct Vercel operation was requested.
- **Release:** Draft PR only; no merge to main.

## 2026-11-19 - Rebuild extraction case study as problem-to-solution story (GitHub only)

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39. No merge or manual Vercel action.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `CHANGELOG.md`.
- **Change:** Replaced the text-heavy case study with a five-stage editorial narrative, platform favicon/source architecture, lightweight native HTML interactive code disclosures, output catalogue, clear CTA links and responsive dark/gold styling. Updated GA4 statements using the 10 source-reviewed Python modules. Added Bing as a documented extraction platform, with Shopify/Klaviyo kept distinct from verified API scripts.
- **Reason:** Show how an original 12-month business reporting brief became a documented multi-platform data engineering workflow, without consuming client-side UI resources or publishing client data.
- **Inline documentation:** Records public-safe code provenance, external favicon loading, source limits, and distinction between Shopify GraphQL / Bash skills and unverified involvement in this particular extraction.
- **Validation:** GitHub source inspection and type-oriented static review before write. Full local tests, safety scanner, TypeScript compilation, browser QA and any Vercel build have not been run here. Feature branch only. Note that automatic Vercel integration may still create a preview from GitHub commits.

## 2026-11-19 - Clarify 12-month cross-platform extraction purpose

- **Target:** `bonvallite/developer-portfolio`, review branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/page.tsx`, `CHANGELOG.md`.
- **Change:** Repositioned the case study as a 12-month, multi-dataset workflow covering GA4, Search Console and Google Ads, and revised the featured project description. Documented distinct platform methods and dataset types rather than implying a single Python script implements all three.
- **Reason:** Explain the business purpose of extracting detailed underlying data rather than screenshots or dashboard summaries.
- **Documentation:** Updated inline comments separating independently inspected GSC Python and Ads JavaScript sources from user-reported GA4 API configuration. Preserved confidentiality and limitations.
- **Validation:** Source and saved content checked; latest Vercel preview build and CI must be confirmed before release. No production merge.


## 2026-11-19 - Display Python ranking calculation on Vercel case study

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `CHANGELOG.md`.
- **Change:** Embedded a read-only, formatted excerpt from the owner-supplied Search Console Python `fetch_monthly_keywords()` function, with a mobile-scrollable code panel and explanation of impression-weighted search position and observed-period changes.
- **Reason:** Let prospective employers and clients inspect real Python logic, alongside the business purpose of the resulting SEO dataset.
- **Inline documentation:** Added component comments identifying the provenance, read-only display and dependency on the private `get_daily_query()` helper. The portfolio does not run the script or connect to Google accounts.
- **Safety and validation:** Source-specific identifiers, private data and credentials omitted. GitHub file retrieval and updated commit must be checked; full automated tests, browser/mobile QA and Vercel build remain separately verifiable.
- **Release:** Feature branch only, no production merge.


## 2026-11-19 - Showcase ecommerce API extraction and data value

- **Target:** `bonvallite/developer-portfolio`, review branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/page.tsx`, `app/python-automation/page.tsx`, `app/experience/page.tsx`, `skills/python-automation-portfolio/SKILL.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a public-safe case study of Python Google Search Console API exports and JavaScript Google Ads reporting scripts; described authentication, pagination, CSV exports, data limitations and value for ecommerce SEO, paid media and conversion measurement. Linked it from projects, skills, Python and experience sections; extended reusable documentation.
- **Reason:** Make demonstrated scripting, technical depth and the practical value of resulting datasets visible to potential employers and clients.
- **Inline documentation:** Added context and confidentiality notes in the case study and homepage, and kept reusable skill and README aligned.
- **Validation:** Reviewed source descriptions and repository contents prior to writes; code execution, CI, safety scan, Next.js build and Vercel preview verification must be reported after remote checks. Do not infer successful business exports or production release.
- **Release:** Review branch only; no merge or production deployment authorised.


## 2026-11-19 - Restore owner-requested résumé, professional profiles and webmail shortcut
- **Target:** `bonvallite/developer-portfolio`, `fix/restore-jrv-professional-links-webmail-resume` based on `main`.
- **Affected files:** `app/page.tsx`, `app/experience/page.tsx`, `public/JRV-Resume.pdf` (restored unchanged from historical Git blob), `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Reason:** The 18 November privacy-led cleanup intentionally removed these links and the original name-specific résumé PDF. The site owner explicitly requested their return.
- **Change:** Restore the archived résumé under a neutral filename; display résumé links in homepage navigation, contact and Experience; restore previously used LinkedIn, Google Developer and Wikipedia destinations; add an authorised-user webmail login at `https://webmail.jrvallite.com/`, separate from public email enquiries to `hello@jrvallite.com`.
- **Privacy:** Public profile links and the historic résumé may still identify the portfolio owner. The original document's details have not been rewritten, and its internal email may be out of date. Preserve name-free SEO metadata and existing sensitive-information guards.
- **Validation:** Compared source against historical commit `caf282f`, confirmed historic PDF Git blob `a7d4648` and verified the newly restored path points to that exact 323,929-byte blob in Git tree `5a9eb8b`. Confirmed the four contact/profile destinations, separate webmail shortcut and retained domain email in source. CI and Vercel deployment checks to follow.



## 2026-11-19 - Cinematic Shopify B2B modernisation case study
- **Branch:** `feature/cinematic-b2b-final-mainline-20261119`, based on current `main` to preserve later portfolio/SEO fixes.
- **Files:** `app/b2b-modernisation/page.tsx`, `app/b2b-modernisation/CinematicB2B.tsx`, `app/b2b-modernisation/cinematic.css`, `app/page.tsx`, `tests/b2b-cinematic.test.mjs`, `CHANGELOG.md`.
- **Change:** Five cinematic charcoal-and-gold chapters: before/after, contextual Markets/Catalogues, fictional price laboratory and eligibility switch, six-step buyer workflow, and historical business impact. Added a homepage case study link.
- **Reporting:** Legacy exact `wholesale`, `wg_wholesale`, `WholesalePA1` order tags are deduplicated and use exported eligible order values less refund snapshots; broader customer-tag evidence is optional. Shopify native B2B net sales is a separate accounting definition, never summed with legacy. July go-live is user-reported, not independently dated. A$10,000 incremental monthly scenario is explicitly hypothetical.
- **Commercial comparison:** AOV and returning customer rate figures are supplied as distinct customer cohort data and kept separate from native B2B ShopifyQL history. No verified causal conversion, revenue, or app-saving claims.
- **Docs and accessibility:** Existing global theme stays unchanged. Route CSS is scoped, responsive, keyboard-focused, reduced-motion aware; interaction comments explain limitations. No new packages, credentials, private customer identities, or real merchant catalogue prices.
- **Verification:** Automated checks cover chapters, data boundaries, SEO and reduced motion; GitHub publication safety, test suites, TypeScript and Next.js production build must pass before merge/release. Vercel publication is subject to platform deployment quota.


## 2026-11-19 - Correct public wordmark to JRV
- **Target:** `bonvallite/developer-portfolio`, branch `fix/replace-ec-wordmark-with-jrv-20261119`.
- **Affected files:** `app/page.tsx`, `app/layout.tsx`, `app/cartoncloud-integration/page.tsx`, `app/conversion-audit/page.tsx`, `app/RotationArchive.tsx`, `README.md`, `CHANGELOG.md`.
- **Change and reason:** Replaced the mistaken EC. wordmark with user-confirmed JRV throughout visible navigation and archive elements. Aligned footer and site metadata with JRV while retaining Shopify Commerce Engineering as a descriptive service label. Preserved the original `{JRV}` favicon and public contact email `hello@jrvallite.com`.
- **Validation:** Reviewed each affected source file and its comments before editing; CI and deployment verification to follow the commit.


## 2026-11-19 - EC. public branding, {JRV} favicon and domain email
- **Target:** `bonvallite/developer-portfolio`, branch `fix/brand-ec-jrv-favicon-contact-email-20261119`, Next.js/Vercel portfolio.
- **Affected files:** `app/page.tsx`, `app/privacy/page.tsx`, `app/layout.tsx`, `README.md`, `scripts/public-safety-allowlist.json`, `CHANGELOG.md`.
- **Change:** Confirmed EC. is the public website wordmark; retained the original approved {JRV} gold-on-charcoal browser favicon unchanged in `app/icon.svg`. Replaced three homepage role/project mailto destinations and one privacy enquiry mailto destination from the retired personal Gmail address to `hello@jrvallite.com`. Updated nearby source comments and current-brand documentation.
- **Reason:** Keep the visible company-style identity and contact address consistent, while preserving the separately approved favicon and privacy-led SEO.
- **Validation:** Audited public Next.js routes, root layout, existing favicon and contact links; verified the four old mailto destinations before replacement. Initial GitHub safety scan flagged the new public domain email; the exact-match safety allowlist was updated to the newly approved address. GitHub Actions, build and live Vercel verification recorded separately following commit.
- **Release:** Changes staged for PR; do not claim production until Vercel confirms the matching commit as READY.


## 2026-11-19 - Rebase homepage discovery link onto current production source

- **Target:** `bonvallite/developer-portfolio`, feature branch `feat/gift-packaging-homepage-link-current-20261119`, based on `main` commit `8c8828c`.
- **Affected files:** `app/page.tsx`, `CHANGELOG.md`.
- **Change:** Added a selected-work homepage callout linking to the existing independent fictional `/gift-packaging-reference` demo, preserving newer homepage changes made after the original PR #40 branch.
- **Reason:** Make the published gift packaging demonstration discoverable to employers and clients without overwriting 17 newer commits on `main`.
- **Inline documentation:** Comment beside the callout explains its independent authorship and lack of merchant checkout/payment access.
- **Validation:** Exact insertion anchor and internal link confirmed by source inspection. GitHub Actions, Next.js build, safety checks, Vercel preview and browser/mobile navigation to be verified after push.
- **Release/recovery:** Review branch only; revert this scoped commit to remove the homepage link while retaining the independent demo route.


## 2026-11-18 - Align Fieldstone gift packaging demo with portfolio palette

- **Target:** `bonvallite/developer-portfolio`, review branch `feat/fieldstone-gift-packaging-20261118`, Vercel preview only.
- **Affected files:** `public/gift-packaging-reference/index.html`, `app/gift-packaging-reference/page.tsx`, `CHANGELOG.md`.
- **Change:** Updated the isolated demo's palette and typography to match the public portfolio: charcoal `#0B0E12`, warm gold `#D9B47C`, cream-white text, muted greys, DM Sans, and Space Grotesk. Styled tabs, gift card, buttons, panels, drawer, controls, focus states, and mobile layouts. Matched the Next.js iframe page backdrop to avoid a light surround.
- **Reason:** The previous cream/white and brown theme was visually inconsistent with the portfolio.
- **Inline documentation:** Updated the embedded stylesheet ownership comments and Next.js iframe documentation. No cart logic, merchant integration, or live Shopify theme was changed.
- **Validation:** Source-only CSS/palette and page wrapper review before commit; full browser desktop/mobile QA and Vercel preview validation are pending. Existing prototype validation limitations still apply.
- **Release/recovery:** Draft PR #38 only; revert this style-only commit to restore the original demo appearance.


## 2026-11-18 - Add independent Fieldstone gift packaging cart demonstration

- **Target:** Public Next.js developer portfolio, feature branch `feat/fieldstone-gift-packaging-20261118`, Vercel preview only.
- **Affected files:** `app/gift-packaging-reference/page.tsx`, `public/gift-packaging-reference/index.html`, `CHANGELOG.md`.
- **Change:** Added a standalone, fictional six-view gift packaging demonstration with shared in-memory cart state, optional priced packaging, quantity limit of one, removal when the last ordinary product is removed, simulated checkout and example order email. The Next.js route isolates the demo in an iframe; no live Shopify endpoints are called.
- **Reason:** Present the complete customer-facing cart journey as an interactive technical portfolio example without exposing private merchant implementation.
- **Inline documentation:** The page explains sandbox isolation; the HTML script documents its owned cart state and lack of network requests.
- **Validation performed:** Standalone JavaScript syntax validated with `node --check`; ZIP integrity verified. Full Next.js test suite, public safety scan, TypeScript check, build, browser desktop/390px QA, and Vercel preview readiness remain pending.
- **Release/recovery:** Proposed feature branch only, not merged; revert this feature commit to remove the new route and static asset.


Entries record changes from 22 October 2026 onwards. Earlier repository history remains available in Git commits and pull requests.

## 2026-11-16 - Relocate Microsoft Clarity to document head without duplicate tracking

- **Target:** `bonvallite/developer-portfolio`, Vercel `developer-portfolio` (team `my-dojo`, project `prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`), feature branch `fix/clarity-head-single-install-20261116`, public portfolio domain `www.jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Relocated the existing Microsoft Clarity loader for public project `zekmhvjftc` from `next/script` with `afterInteractive` in the layout body into exactly one server-rendered native inline `<script>` in the shared document `<head>`, retaining the exact owner-provided asynchronous loader. Removed the old instance and its now-unused import. Kept GTM `GTM-KVJVH4VM` and Vercel Analytics intact.
- **Reason:** The owner requested the Clarity snippet again, after specifically asking about `<head>` placement. It was already installed; relocation rather than duplicate insertion meets that placement preference while avoiding two trackers.
- **Inline documentation:** Updated comments beside the script to describe the single owner, external async loader, duplicate risks and visitor consent dependency; revised README and site-analytics assertions to cover head placement and no duplicate Clarity instance.
- **Privacy:** No consent-management or visitor privacy notice was added. Verify applicable consent and the Clarity workspace configuration separately. Clarity may also be configured through GTM, which is outside the repository audit.
- **Validation:** GitHub PR #33 completed successfully. CI run `43886662462` passed the publication safety scan, JavaScript and Python tests, TypeScript checks, and Next.js production build. Vercel preview and production deployment returned `READY`. Authenticated HTTP checks returned 200 on both the production deployment URL and `https://www.jrvallite.com/`. Both rendered HTML responses contain exactly one native `<script id="microsoft-clarity">` in `<head>`, the correct project ID and async loader, no duplicate Clarity script element in `<body>`, and the existing GTM container. Browser network capture and the Clarity dashboard have not been checked; data arrival and consent behaviour therefore remain unverified.
- **Release and recovery:** Merged pull request #33 as commit `445032e8d5a184bdb39decf6f654b386731c3438`. Vercel production deployment `dpl_EWw5rLVQcdjfFweQc94zqvPjd9Ck` is READY. Revert the scoped head relocation to restore the previous body `afterInteractive` behaviour without touching GTM or Vercel Analytics.

## 2026-11-16 - Add Google Tag Manager to portfolio document head

- **Target:** `bonvallite/developer-portfolio` Next.js root layout, Vercel `developer-portfolio` (`prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`), team `my-dojo`, feature branch `feat/gtm-kvjvh4vm-20261116`, intended production domain `jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `scripts/public-safety-allowlist.json`, `README.md`, `CHANGELOG.md`.
- **Change:** Installed the owner's Google Tag Manager container `GTM-KVJVH4VM` once for all routes, preserving their provided asynchronous `gtm.js` URL and `dataLayer` / `gtag('js', new Date())` initialisation. Initially tried Next.js `beforeInteractive`, but preview HTML showed only a GTM preload in `<head>` and its script execution queue in `<body>`. Corrected the implementation to two native HTML script elements immediately within the explicit shared root `<head>`, matching Google's manual placement requirement.
- **Reason:** Enable the requested sitewide Google tag without repeated per-page insertion, while preserving existing independent Clarity and Vercel Analytics integrations.
- **Inline documentation:** Updated root layout comments to explain direct `<head>` placement, the preview-discovered `beforeInteractive` limitation, duplication avoidance and privacy dependencies. Expanded site analytics tests, README instructions and the allowlist explanatory JSON comment.
- **Privacy/scope:** Does not add a consent manager or modify GTM's published workspace, its tags, triggers, destinations, or conversion configuration. Verify notice and consent obligations separately. Google no longer requires a separate `noscript` iframe in the new manual snippet provided.
- **Safety and validation:** The first CI scan flagged the public GTM ID. A narrowly scoped exact-string allowlist entry for `GTM-KVJVH4VM` fixed this without relaxing other rules. The final GitHub Actions CI run `43884589048` passed the publication scan, JavaScript tests, Python tests, TypeScript checks, and Next.js production build. The final Vercel preview returned HTTP 200 and showed one actual async `gtm.js` script and inline `dataLayer` initialiser inside the server-rendered `<head>`. The production build also returned READY. An authenticated live URL fetch of `https://www.jrvallite.com/` returned HTTP 200 with those same two head elements, one external GTM loader, and the expected ID. `https://jrvallite.com/` returned an existing HTTP 308 redirect to the www domain. Google Tag Assistant, downstream measurement, and consent behaviour have not been browser-tested.
- **Release:** Pull request #32 merged to `main` as commit `e0dbcf6eae8d5b642dde0f59f8538139b00ff527`. The production deployment `dpl_EtxckU1Z6hqq5gRCo5Z9dinshapT` reached READY and was verified through its deployment URL and the live www domain.
- **Recovery:** Revert only the GTM `<head>` script elements and related documentation/tests and narrow public-ID allowlist entry; retain Clarity and Vercel Analytics.

## 2026-11-16 - Sitewide Microsoft Clarity installation

- **Target:** `bonvallite/developer-portfolio` (Next.js), feature branch `feat/microsoft-clarity-zekmhvjftc-20261116`, Vercel project `developer-portfolio`, team `my-dojo`, intended public portfolio domains `jrvallite.com` and `www.jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Added the owner's supplied Microsoft Clarity loader and public project ID `zekmhvjftc` using Next.js `Script` with `afterInteractive` from the shared root layout. Existing Vercel Analytics remains present. Added a small regression test for one script instance, the correct tag URL and project ID.
- **Reason:** Enable sitewide behaviour analytics for the developer portfolio without duplicating script injection across pages or blocking initial HTML.
- **Inline documentation and dependencies:** The root layout comments identify the loader's sitewide scope, public ID, and privacy/consent requirement. The README documents the loading strategy, how to avoid duplicate tags, and post-deployment verification.
- **Privacy boundary:** This change does not add a consent-management system, gate tracking on consent, or publish a privacy notice. Review the published notice and jurisdiction-specific consent requirements before interpreting visitor recordings.
- **Validation:** Source-level assertions and CI test added; verify GitHub Actions, Vercel preview/production build, live network request, and Clarity dashboard independently. Do not treat successful source writes as proof that tracking is active.
- **Recovery:** Revert the scoped layout, test and documentation changes if the tracker must be disabled; preserve the pre-change Vercel Analytics component.

## 2026-10-24 - Conversion journey case study and public carousel

- **Target:** `bonvallite/developer-portfolio`, Vercel `developer-portfolio` production, team `my-dojo`.
- **Affected files:** `app/conversion-audit/page.tsx`, `app/page.tsx`, `public/portfolio/shopify-conversion-journey.pdf`, `README.md`, `CHANGELOG.md`.
- **Change:** Expanded the existing conversion case study with the six-stage journey, Shopify Analytics, GA4, Clarity, source inspection, delivered improvements, developer-reported QA, and explicit open measurement items. Added a public nine-slide portrait PDF and a stable download link. Refreshed the homepage project summary.
- **Reason:** Show the progression from diagnosis to implementation and production validation for Shopify owners and hiring teams.
- **Publication:** Created a separate public PDF excluding internal conversion figures, traffic counts, and private audit attachments. No proprietary code, production IDs, or customer information added. Reported operational QA is distinct from portfolio checks and measured commercial uplift.
- **Inline documentation:** Added source comments documenting public PDF ownership, evidence provenance, backend rule boundaries, and alignment of the homepage, case study, and download.
- **Validation:** 104 JavaScript tests and 16 Python tests passed. Publication scan passed for 143 tracked files. TypeScript, Next.js production build, and Git whitespace checks passed. Built homepage, case-study route, and PDF returned HTTP 200. Case-study HTML contains the six-stage journey and download link, and served PDF bytes match the local nine-page public asset. PDF text bounds, internal-figure exclusions, and all rendered slides passed review. Browser/mobile visual checks remain pending because the browser binary download failed. Production status and remote saved-source checks follow publication.
- **Publication verification:** All five saved GitHub blobs match the intended files. Implementation commit `239c739e2fc592d722c17a87cdfdd3a0c9c9ddb0` deployed to production as `READY` in 43 seconds. Live case-study and PDF endpoints returned HTTP 200, and the PDF bytes match the checked asset. Cloud-browser desktop inspection confirmed the updated content and working journey anchor. Mobile visual checks remain pending. This documentation follow-up does not change the deployed UI or PDF.
- **Recovery:** Pre-change main commit `caf282f5114f8b5598be1917e99262181b2bd209`. Revert this scoped change to restore the prior case study.

## 2026-10-24 — Interactive CSS engineering lab

- **Target:** Personal `bonvallite/developer-portfolio` repository, `feature/interactive-css-lab-20261024`, preview route `/css-lab`.
- **Affected files:** `app/css-lab/page.tsx`, `app/css-lab/css-lab.module.css`, `lib/css-lab.mjs`, `tests/css-lab.test.mjs`, `docs/CSS_LAB.md`, `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Authored a responsive, interactive HTML/CSS concept guide with 14 original explanatory notes, three browser experiments, and an eight-question self-test. Linked it from the portfolio homepage and added tests and architecture notes.
- **Reason:** Demonstrate front-end CSS understanding, responsive interface construction, and maintainable React UI state without reproducing an employment assessment.
- **Security:** No company-owned code, original assessment questions, user input uploads, external fonts or credentials are published.
- **Validation:** Unit, safety, type, build, and preview checks pending; do not infer production release from successful GitHub file writes.
- **Release:** Feature branch, review before production. Existing main not modified by these commits.

## 2026-10-23 — Downloadable resume PDF

- **Target:** `bonvallite/developer-portfolio`, `main`, connected to the Vercel `developer-portfolio` production project.
- **Affected files:** `public/Jomar-Vallite-Resume.pdf` (new), `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the owner's updated two-page 2026 resume as a static PDF at `/Jomar-Vallite-Resume.pdf`. Linked it from the homepage header navigation, the contact buttons and the top of the Experience page, and added it to the README. All links open in a new tab with `noopener noreferrer`.
- **Reason:** Give recruiters and clients a direct, stable resume download from both the live portfolio and the GitHub repository.
- **Content and privacy:** The PDF is the owner's own resume, prepared and approved by the owner. Its contact details (email, the WhatsApp number already linked in the contact section, GitHub, LinkedIn and portfolio URLs) were already public on this site. It names the owner's current employer and past clients as normal resume content; it contains no source code, credentials, customer data or store identifiers.
- **Maintenance:** To update the resume, replace `public/Jomar-Vallite-Resume.pdf` in place so every existing link keeps working.
- **Validation:** Recorded in the associated commit and deployment check.

## 2026-10-22 — Custom delivery app and CartonCloud integration portfolio

- **Target:** `bonvallite/developer-portfolio`, refresh branch `feature/cartoncloud-app-integration-refresh-20261022`, existing Next.js/Vercel portfolio.
- **Affected files:** `app/cartoncloud-integration/page.tsx`, `app/page.tsx`, `CARTONCLOUD_INTEGRATION.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a dedicated case study and technical write-up that clearly distinguish the custom Cloudflare Worker delivery app built by the developer from the Shopify–CartonCloud API integration built by the same developer. Included a mobile-responsive conceptual architecture diagram with bidirectional data exchange and a separately described return path to Shopify order metafields, delivery estimates and fulfilment events. Added the project to the existing homepage and README; documented responsibilities and evidence boundaries in inline source comments.
- **Reason:** Present both custom app development and cross-platform API integration skills without misrepresenting a Shopify App Store listing, directly connecting unrelated services, or publishing employer source or private order data.
- **Validation:** Original PR #20's preceding version passed a GitHub Actions run and Vercel preview. That PR later could not merge because of conflicts with newer `main`; this refresh was recreated from the current main with file-by-file updates rather than overwriting intervening work. The refreshed branch's CI, safety checks and preview must pass before publication. No public production outcome is assumed by this entry.
- **Scope:** Portfolio documentation and UI only, not a Shopify theme, CartonCloud configuration, live Worker, customer orders or production integration.

## 2026-10-22 — Documentation as an engineering standard

- **Target:** `bonvallite/developer-portfolio`, Next.js portfolio for the existing Vercel project.
- **Affected files:** `ENGINEERING_STANDARDS.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `CHANGELOG.md`, `README.md`, `PORTFOLIO_INDEX.md`, `app/page.tsx`, `app/engineering-standards/page.tsx`, `app/globals.css`.
- **Change:** Added a public engineering-standard page, linked it from the homepage quality and skills sections, and documented the read-first, inline-documentation, changelog, validation and handover process. Added a reusable change record and PR checklist. Updated inline source comments for the new presentation and its dependencies.
- **Reason:** Make maintainability and traceability visible as essential parts of delivery, and give future changes an explicit documentation standard.
- **Validation:** Publication scan passed for 122 tracked files; 101 JavaScript tests and five Python tests passed; TypeScript checking, Next.js production build and Git whitespace checks passed. The built homepage and new route returned HTTP 200. Chromium checks at 1440px and 390px confirmed six standard cards, no horizontal overflow, a working homepage-to-standard link and no page exceptions or server errors. Desktop and mobile renders were visually reviewed. React review confirmed a static server component, stable list keys, decorative icon labels, semantic headings and scoped responsive CSS. Remote CI and release evidence are recorded in the associated pull request and deployment.
- **Scope:** The public example is fictional. Production Shopify theme source and private audit records are kept in their private systems. This entry does not certify the completeness of historical theme documentation.

## 2026-10-22 — Google Developer profile contact link

- **Target:** `bonvallite/developer-portfolio`, `main` branch, Vercel `developer-portfolio` project.
- **Affected files:** `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Added `https://g.dev/bonvallite` to the portfolio contact buttons alongside the existing GitHub, LinkedIn and email links; documented the link and inline external-link safeguards.
- **Reason:** Make the owner's public Google Developer profile accessible from the portfolio.
- **Validation:** Confirmed the original contact markup, added a unique HTTPS URL with `target="_blank"` and `rel="noopener noreferrer"`, and preserved the existing contact links. Remote saved-file check and deployment status are separate follow-up checks, not a claim of a completed browser test.
- **Release:** Committed to `main`; Vercel production deployment status to be confirmed.

## 2026-10-22 — Wikipedia contributor profile

- **Target:** `bonvallite/developer-portfolio` on `main`, connected to the Vercel portfolio project.
- **Affected files:** `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a Wikipedia contributor button linking to the public `Special:Contributions/Bonvallite` page, beside the Google Developer profile button. Existing social and contact links were preserved.
- **Reason:** Surface Wikipedia editing contributions as part of the portfolio's public professional presence, without asserting editor status, edit counts or article authorship beyond the linked history.
- **Inline documentation:** Existing contact-section comment documents public external destinations, independent ownership, and safe new-tab link attributes.
- **Validation:** Checked source before editing, used the supplied HTTPS URL and `noopener noreferrer`. Saved-file verification and deployed-site testing to be recorded separately; no build or browser test claimed at this stage.
- **Release:** Main branch commit; production deployment verification pending.

## 2026-10-22 — Cybersecurity: Foundation of CERT Operations attendance training

- **Target:** `bonvallite/developer-portfolio`, `main` branch, Vercel `developer-portfolio` (production).
- **Affected files:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a responsive homepage cybersecurity training card and a detailed Experience-page record for the 12-hour Foundations of CERT Operations course attended 5–6 December 2023. The public heading uses the owner's requested title “Cybersecurity: Foundation of CERT Operations”. Clearly identified the evidence as a certificate of attendance, not an accredited professional certification; provided the organiser, training dates and evidence limitations.
- **Why:** Include verifiable professional development in cybersecurity without overstating the credential.
- **Documentation:** Updated inline JSX comments describing evidence provenance and public-document privacy, maintained responsive CSS commentary, and updated the README. The signed 2023 source PDF is deliberately not distributed publicly because it contains an issuer's digital signature.
- **Validation:** Inspected the supplied single-page certificate and the existing repository changelog, code, CSS comments, and conventions. Re-fetched all five committed files and confirmed both the homepage and Experience sections, supporting CSS, readme entry, and changelog were saved; verified the title, course name, December 2023 dates, 12-hour duration, issuer and attendance wording. Vercel's production build was building at the time of this record; this does not claim a completed TypeScript/build/browser test.
- **Pending checks:** Confirm Vercel production deployment reaches READY, then verify `/#certifications` and `/experience#training` at desktop and mobile sizes. Browser/mobile rendering remains unverified.
- **Release:** Changes committed directly on `main` to trigger the project's Git-linked production deployment; final deployment status must be checked.


## 2026-10-22 — Undersea cable cybersecurity session portfolio entry

- **Target:** `bonvallite/developer-portfolio`, `main`, connected to the Vercel `developer-portfolio` production project.
- **Files:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a second cybersecurity/professional-development card, linked to `/experience#undersea-cables-session`, for “No Fiber, No Cyber: Safeguarding the World's Undersea Cables”. Summarised the U.S.–Philippines Joint Cybersecurity Working Group and APTelecom announcement, Ortigas location, Thursday 16 November (2–4 p.m. Philippine Time), undersea cable security/maintenance focus, speakers Phillip Nervig and Eric Handa, and moderator John Garrity. Reworded the section intro so the announcement is not mislabelled as formal training.
- **Why:** Include the owner's requested cybersecurity industry-session reference alongside the separately supported CERT training.
- **Evidence and limitations:** Input was an invitation/announcement, **not evidence that the owner attended**. The year was absent from the source (Thursday 16 November aligns with 2023, but this inferred year is intentionally not presented as verified). No certificate or attendance claim is made.
- **Inline documentation:** Updated home and Experience JSX comments on evidence boundaries; updated shared CSS comment and documented card spacing; updated README.
- **Validation:** Reviewed existing source, comments, engineering standards and prior changelog before editing. Checked exact provided names, title, time and location against user-supplied announcement. Remote re-read of saved files and deployment checks pending at the moment of this entry; no build or browser test is asserted.
- **Release:** Saved on `main`; verify Git-linked Vercel production deployment, page rendering and GitHub checks.


## 2026-10-22 — Final deployment and source verification

- **Target:** Vercel `developer-portfolio` production, GitHub `bonvallite/developer-portfolio` `main`.
- **Scope:** Verify the Google Developer and Wikipedia links, DICT Foundations of CERT Operations attendance card, and undersea cable security session entry shipped in the recent commits.
- **Files checked:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Source verification:** Re-fetched all five saved files. Confirmed both profile links, the CERT training card/details, the undersea cable event/details, responsive card styles, explanatory JSX/CSS comments, and written records are present. The event remains explicitly invitation-based and does not claim attendance.
- **Deployment verification:** Vercel reported the latest production deployment of commit `618894a1e9cfc09284dfda967a709f19c77accf9` as `READY`. GitHub's Vercel status check for that commit reported `success`.
- **Limitations:** Live authenticated HTML retrieval failed with a Vercel 403 access error at the deployment alias/protection bypass; a separate public web fetch also could not access those routes. Therefore actual browser rendering, link clicks, mobile layouts, and runtime errors are **not independently verified**. No local TypeScript/test/build run was performed during this final pass. Production readiness is based on Vercel's deployment status, not a visual QA claim.
- **Release:** This documentation-only change is committed to `main`, triggering another Vercel production deployment. Check the newest deployment's status separately; the prior known-good build is the commit above.


## 2026-10-22 — Community involvement and running section

- **Target:** `bonvallite/developer-portfolio`, Git-linked Vercel production site.
- **Affected files:** `app/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a responsive Beyond the Code homepage section documenting self-reported volunteering with DEVCON, community outreach and medical missions, plus an active running lifestyle. The accompanying original photos were provided by the owner but are **not yet published** because permanent binary asset upload to the connected repository was unavailable in this session.
- **Why:** Present the owner's community contribution and work–life balance without inventing volunteer roles, specific race outcomes or unverified sporting achievements.
- **Inline documentation:** The homepage comment separates owner-provided claims from photographic evidence. The CSS comment documents responsive layout and deliberately absent photo URLs.
- **Validation:** Inspected existing source, README, changelog and CSS before editing; preserved original sections and inserted new markup/styles. Saved-file re-read, Vercel build results and browser QA to be checked separately. No image upload, asset deployment or visual QA is claimed.
- **Pending:** Upload all six user-supplied original photographs to durable project image hosting, display them across hero, About and personal-interest sections with responsive sizing and accessible alt text, then test desktop and mobile. Do not use expiring Canva preview URLs as permanent site assets.

## 2026-10-22 — Publish six original portfolio photographs

- **Target:** `bonvallite/developer-portfolio`, Git-linked Vercel production site.
- **Affected files:** `public/photos/jomar-studio-portrait.jpg`, `public/photos/jomar-working-laptop.jpg`, `public/photos/jomar-with-laptop.jpg`, `public/photos/jomar-running-event.jpg`, `public/photos/jomar-road-running.jpg`, `public/photos/jomar-running-medal.jpg`, `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, and `CHANGELOG.md`.
- **Change:** Uploaded all six user-provided photographs as size-optimised, metadata-stripped first-party JPEG assets. Integrated portraits into the homepage hero, About, and Experience, plus running and medal photography into Beyond the Code. Added responsive styling, alt text, explicit dimensions and lazy loading outside the primary hero.
- **Why:** Show the owner's genuine professional and personal photography in place of absent images or AI-generated substitutes, while limiting bandwidth and layout shift.
- **Documentation:** Reconciled outdated README image-upload blocker; updated inline JSX comments and CSS comments describing purpose, asset provenance, responsive crops and image dependencies.
- **Validation:** Compared staged image dimensions and SHA-256 digests against generated web derivatives. Uploaded and received a unique Git blob SHA for each image. Verified all six `Image` source paths are present in the code and that the exact six blob paths are included in the commit tree; re-read and external build verification are to be checked after deployment.
- **Remaining QA:** Check actual deployment status, browser image loads, 390px and desktop crops, and any layout overflow. Do not claim these tests before execution.


## 2026-10-22 — Photo publication verification

- **Target:** Production Vercel `developer-portfolio`; deployed photo integration commit `04be2aa39138c9dc8a6eea26b50c9c5a7c9895d8`.
- **Files:** `public/photos/` (all six image files), `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Saved-source validation:** Re-read all six GitHub image paths and confirmed their blob SHAs match the committed asset references. Confirmed the current `main` branch points to the photo integration commit. Verified each optimised source image opens and has no EXIF metadata.
- **Production HTTP validation:** Vercel reported photo integration commit `READY`. Public `/` and `/experience` returned HTTP 200 with the expected alt text and photo references. Each of the six `/photos/*.jpg` endpoints returned HTTP 200 with `image/jpeg` and the expected file byte length. Next.js's `/_next/image` optimisation returned HTTP 200 and `image/jpeg` for the hero image.
- **Outstanding:** Actual browser screenshots, interactive image-lightbox checks (none added), and desktop/mobile visual crop inspection have **not** been performed. Responsive CSS and image `sizes` have been reviewed in source, not yet visually certified.
- **Documentation and release:** Added this follow-up evidence to avoid claiming visual checks that were not carried out. This documentation-only commit may trigger a further Vercel Git-linked production deployment.

## 2026-10-23 — Selected JRV code favicon

- **Target:** `bonvallite/developer-portfolio`, Next.js App Router, GitHub `main`, connected Vercel `developer-portfolio` production project.
- **Affected files:** `app/icon.svg` (new), `app/layout.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the user's chosen option 6, the bright cyan `{JRV}` code monogram on a dark-blue rounded square, as a self-contained 64 × 64 raster-derived SVG favicon at `app/icon.svg`. Next.js automatically links this file as the site icon. No `app/favicon.ico` previously existed.
- **Reason:** Personalise the browser tab and bookmarks with the approved developer identity without depending on an external image service.
- **Inline documentation:** Added a Next.js file-convention comment beside `metadata` in `app/layout.tsx` to prevent conflicting icon declarations. Added asset provenance, sizing, update guidance and testing expectations in the README.
- **Validation performed:** Confirmed the image asset's original pixels and the selected logo visually; created a compressed, square derivative. Rendered a local SVG-embedded image to confirm the approach works, then confirmed GitHub accepted `app/icon.svg`, and re-read it to check the committed file. Checked that `app/favicon.ico`, `app/icon.png`, and `public/favicon.ico` were absent before adding the new icon.
- **Remaining validation:** Confirm the latest Vercel Git-linked production deployment reaches `READY` with successful check; check that the homepage links to the icon and that `/icon.svg` returns valid SVG. Actual browser 16 × 16 and 32 × 32 favicons across browsers remain pending unless separately verified.
- **Release and rollback:** Committed to `main` for automatic Vercel production deployment. Revert these commits to restore the previous no-custom-favicon state.
 

## 2026-10-23 — Favicon encoded-image correction

- **Target:** `bonvallite/developer-portfolio`, Next.js App Router, `main` branch, Vercel `developer-portfolio`.
- **Files:** `app/icon.svg`, `README.md`, `CHANGELOG.md`; previous `app/layout.tsx` inline documentation remains applicable.
- **Correction:** The first SVG favicon committed on 23 October embedded a malformed JPEG and could not be decoded reliably. Replaced its embedded image with a verified 64 × 64 pixel palette-optimised PNG derivative of the actual selected cyan `{JRV}` icon, keeping the same `app/icon.svg` path, accessible title and self-contained SVG metadata.
- **Why:** A successful Git deployment alone does not prove image bytes are valid or that a browser will render a favicon.
- **Validation:** Decoded and visually inspected the replacement PNG, re-fetched the exact GitHub-saved `app/icon.svg` file, extracted its `data:image/png;base64` payload and verified it decoded as the intended `{JRV}` logo. The image is self-contained with no external dependency. The source code comment and README remain aligned with the change.
- **Pending:** Check Vercel production deployment for the corrected commit and HTTP responses of `/icon.svg` and homepage; check actual Chrome/Edge tab display and cache refresh. Do not claim browser confirmation until actually exercised.
- **Release and recovery:** Corrective commit `b14e6eaf6c18d6e2f914e5b71a4ee766c866d5f5`, followed by documentation commits on `main`. Roll back to earlier no-custom-icon commit if required.

## 2026-10-24 — Brand-aligned JRV favicon palette

- **Target:** `bonvallite/developer-portfolio` (Next.js App Router), GitHub `main`, Vercel project `developer-portfolio` (ID `prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`).
- **Affected files:** `app/icon.svg`, `app/layout.tsx`, `README.md`, `CHANGELOG.md`. No Shopify theme files changed.
- **Change:** Retained the owner-approved option 6 `{JRV}` monogram and its original indexed 64 × 64 pixel positions. Recoloured only the embedded PNG palette from bright cyan/navy to warm portfolio gold `#D9B47C`, bronze highlights and charcoal `#0B0E12`. Added an indexed PNG `tRNS` transparency chunk to remove the former near-white outside corners while preserving the rounded logo. Maintained the existing `app/icon.svg` Next.js automatic favicon route and accessible title.
- **Reason:** Align the favicon with the site's charcoal and gold design system without replacing the approved graphic or adding another favicon source.
- **Inline documentation:** Added an SVG XML comment describing palette provenance, corner alpha and automatic file convention. Updated the adjacent `app/layout.tsx` comment, README favicon documentation, and validation instructions. No outdated cyan-colour claim remains in the current README.
- **Validation actually performed:** Read the existing repository favicon changelog, README, layout comments, CSS brand palette and icon source. Decoded the original indexed PNG palette, generated and visually inspected a gold recolour, preserved the original compressed image data, verified CRC-32 checksums of each generated PNG chunk (`IHDR`, `PLTE`, `tRNS`, `IDAT`, `IEND`), and confirmed the output stays 64 × 64 with no external asset dependencies. GitHub commits accepted the SVG and documentation edits.
- **Saved-source and production verification:** Re-fetched `app/icon.svg`, `app/layout.tsx`, `README.md` and `CHANGELOG.md` from GitHub and confirmed all changes and inline documentation persisted. Vercel reported the favicon-source commit `8af75e066dcca35c5584dea25674aa71359d5d00` as production `READY`. Vercel's authenticated fetch returned HTTP 200 for both the live homepage and `/icon.svg`. The homepage emitted a `rel="icon"` link to `/icon.svg?35f78a7650c66e23`, and the icon response contained the expected gold-and-charcoal SVG source with transparent corner PNG data. This validates deployment and routing, not visual browser-tab rendering.
- **Pending visual QA:** Inspect the favicon in actual Chrome/Edge tabs and bookmarks at 16 × 16 and 32 × 32 on light/dark browser UI, including cache-refresh behaviour. The 64 × 64 original and recoloured artwork were visually compared; physical/browser favicon tests were not performed.
- **Release and recovery:** GitHub `main` triggers production deployment automatically. Previous cyan/navy icon may be restored from its pre-change Git commit; new colour change is limited to the favicon and its documentation.
