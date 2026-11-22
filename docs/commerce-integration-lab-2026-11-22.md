> **Latest-main integration candidate · 22 November 2026:** The working branch is now `integration/commerce-systems-latest-main-20261122`, based on published `main` commit `90ea2d30ba0470828b451cb76fd8595df060e06b`. The preceding draft branch `feature/commerce-integration-lab-20261122` and PR #98 were independently tested but cannot be merged cleanly because `main` has 19 newer commits. All earlier branch names and claims below are retained as historical provenance, not as the current release state. **No production publication or merge is authorised.**

# Commerce integration engineering lab (draft / unpublished)

**Date:** 22 November 2026  
**Repository:** `bonvallite/developer-portfolio`  
**Feature branch:** `feature/commerce-integration-lab-20261122`  
**New route:** `/projects/commerce-integration-engineering`  
**Release decision:** The owner approved a **preview-branch-only homepage section and link** on 22 November 2026. Do not merge, publish to the production domain, or retire the original CartonCloud case study without an additional owner review.

## Purpose

Present end-to-end custom Shopify application and serverless integration engineering through a cinematic, interactive, browser-only case study. The page is scoped to the current JRV public brand and demonstrates the technology stack without copying employer-owned source.

## Visual design system

The feature uses the same current cinematic homepage palette, documented in `app/cinematic-home.css`, rather than establishing an unrelated identity:

| Token | Value | Function |
|---|---|---|
| Obsidian | `#0b1419` | Background |
| Electric teal | `#38c7bc` | Engineering, connections, focus |
| Ember orange | `#f28c52` | Highlight, CTAs, event focus |
| Paper | `#eaf4f3` | Primary text |
| Muted text | `#a9c1c3` | Secondary text |
| Panel | `#14242c` | Workbench surfaces |
| Stroke | `#355058` | Separators and controls |

The route uses `{JRV}` as the display wordmark, local system fonts, route-scoped CSS, no stock imagery, no external logo downloads and restrained CSS-only animation. A future authorized partner-logo treatment could use compliant official marks. Honour `prefers-reduced-motion`, keyboard interaction and mobile layouts.

## Architecture truth and source boundaries

Derived from the privately reviewed Worker bundle and supplied Shopify Dev Dashboard configuration:

1. Shopify `orders/create` webhook is received by the Worker, which calculates delivery dates and writes Shopify order metafields through the custom app's Admin API access.
2. Production is an operational handoff, **not** a separately demonstrated direct production API. After internal production, Shopify `fulfillments/create` prompts Worker shipment eligibility and CartonCloud REST consignment creation.
3. CartonCloud callback provides carrier status and may supply tracking number/link. The Worker maps status and uses the app's authenticated Admin API access to write fulfilment information, status events and order metafields. Native Shopify customer notifications may be requested; delivery to the inbox is not guaranteed by the demo.
4. Shopify non-embedded custom app authorisation has installed scopes and OAuth endpoints. The Worker uses Workers KV for temporary OAuth state with a 600-second expiry and offline token persistence. **KV is not presented as a webhook event queue or strong deduplication database.**

The real source calculates multiple state-specific dispatch dates, holidays, special SA production, shipping eligibility, shipment weight and cartons. The public lab is an independently authored limited teaching model and **cannot provide a customer shipping quote**.

## Interactive modules

- **ArchitectureLab:** three selectable event journeys, six system nodes, five selectable event steps, a detail inspector, and conceptual connector lines. Worker and app access are distinguished from direct network webhook paths.
- **CalculationLab:** fictional state-zone selection, Brisbane wall-clock order input, date calculation, physical-item quantity and weight sliders, a simulated closure, non-shipping item eligibility and carton arithmetic. Production postcode tables, rates and commercial rules are not copied.
- **EventLab:** five-step-ish displayed six-stage callback trace, carrier status mapper, missing tracking URL, repeated callback and invalid authentication scenarios. Exceptions are explained, not assumed solved.
- **OAuthLab:** app registration, signed state, KV TTL, callback verification, offline token persistence and authorised API requests.
- **CodeExplorer:** public-safe hand-authored example snippets for JavaScript routing, Web Crypto signing, Workers KV, date calculations, REST, GraphQL and carrier state mapping. No deployed request can originate from any example.

## Privacy and security

Synthetic values only. No production Worker hostname, store domain, Shopify IDs, actual orders, carrier tracking references, credentials, private code, identifiable customer information, delivery postcode tables, public API credentials or employer configuration are included. Example tracking link uses the non-routable `example.invalid` hostname and is displayed solely as JSON.

The feature has no `fetch` calls in browser components. Optional site-wide analytics remain subject to the existing shared consent implementation. The public-safe scan is a static guard, **not** a security certification.

## Integration and migration contract

- **Current state (22 November):** The homepage is modified only on the draft feature branch to add a featured systems engineering section, navigation anchors and a footer link. The four existing project cards and four-mode hero studio are retained. Production main is unchanged.
- Current old case-study `app/cartoncloud-integration/*` is not modified.
- Existing service `app/shopify-app-development/page.tsx` is not modified.
- The new route remains excluded from the sitemap and has robots index:false, follow:false. It is now linked from the **preview branch homepage only**. Review metadata, sitemap inclusion and canonical strategy as a publication gate before any merge.
- At approval, review canonical URLs and consider a permanent redirect from the previous route only after verifying search performance and replacement completeness.

## Validation contract

1. Review exact remote branch file contents after saving.
2. Run `npm test`, `npm run check:safety`, `node scripts/check-seo-publication.mjs`, `npx tsc --noEmit`, `npm run build`.
3. Run desktop/tablet/mobile visual and accessibility checks for new controls, reduced motion, page overflow, source-code tabs, keyboard support and screen readers.
4. Confirm only the approved feature-branch homepage section, navigation and footer changes, with no unrelated homepage modifications, original case-study changes, sitemap changes or production-backend changes.
5. Record CI results as **pending** until actually obtained; never claim browser tests on source inspection alone.

## Open engineering caveats

- The synthetic date calculator intentionally omits the private zone table and real holiday service.
- The demo has a selectable closure date and fixed illustrative carton capacity; these are not merchant promises.
- In the reviewed private Worker, missing webhook secrets can allow a specific handler to continue, and repeated status callbacks can produce further status events; this demo describes the risk, not a production fix.
- Live customer email receipt, provider latency, retries and message deduplication are not independently certified.

## Verified validation evidence (22 November 2026)

- **Github Actions workflow run:** https://github.com/bonvallite/developer-portfolio/actions/runs/44996672711
- **Verified test commit:** `9ca6756906c6e2f3de05894360866bac79a99e5d`
- **Source checks:** publication safety, SEO source guard, npm unit tests, Python tests, TypeScript typecheck, Next.js build, rendered SEO and sitemap: all passed.
- **Browser checks:** generic case-study QA and dedicated commerce integration lab QA passed. The latter exercised three integrations, state/closure and weight calculations, mocked failed webhook behaviour, masked KV/OAuth flow, code tabs and responsive overflow at 1440x900, 768x1024 and 390x844. Screenshot artifact was uploaded.
- **Still pending:** owner visual review of the new preview-only homepage integration, final canonical migration decision, and live third-party production end-to-end verification. The successful browser simulation does not certify production delivery operations.
- **Publication:** no main merge and no production deployment. The new homepage section and link exist only in the feature-branch preview. The case-study route remains noindex for draft review.

## 22 November 2026: zone-aware last-mile and app write-back refinements

**Owner request:** Extend the existing unpublished case study, without linking it from the homepage or changing any production service.

**New files and code:** `app/projects/commerce-integration-engineering/AdvancedLabs.tsx` contains two isolated client-only UI components. Updates to `page.tsx`, `engineering-lab.css`, `lib/commerce-integration-demo.mjs`, its `.d.mts` declaration, unit tests and Playwright browser QA bring both capabilities into the same route.

### Destination-specific last-mile comparison

- Three **invented Queensland subzones**, labelled as examples, each share a one-day transit lead but use different delivery calendars: weekdays, Wednesday-only, and Monday/Thursday.
- User changes fictional Brisbane order time, chooses a route, and can inject a fictional 26 November closure.
- The model returns `transitReadyISO`, `lastMileISO`, `deliveryWeekdays`, `routeWaitDays`, `leadDays` and `deliveryMode`.
- The last-mile waiting period is **already included** in the final estimated date; no arbitrary extra day is added.
- NSW/VIC special dispatch-day rules and SA production scheduling intentionally do not fabricate a separate transit-ready stage. These stay in the existing calculation lab.
- Example zone labels and `DEMO-` identifiers are never an assertion that any specific real postcode is on that delivery route. Do not copy the private postcode mapping table.

### Custom Shopify app write-back console

The simulation models, but never executes, the behaviour verified in the private Worker bundle:

1. CartonCloud callback arrives and is authenticated by the Cloudflare-hosted Worker.
2. The Worker retrieves an offline Shopify app token from Workers KV and finds an eligible Shopify order/fulfilment.
3. `fulfillmentTrackingInfoUpdate` writes available carrier number/link and may supply `notifyCustomer`.
4. `fulfillmentEventCreate` records a mapped fulfilment status when eligible.
5. `metafieldsSet` updates order delivery status, raw status, event status, status timestamp, delivery timestamp on delivered, tracking number and URL when available.
6. Shopify may process a **native** notification request; a mutation's success does **not** prove email receipt.

The app registration is an OAuth identity and permission layer for the Worker, **not a separately verified incoming app server**. A customer email panel is illustrative copy, not a screenshot or template from a real merchant. No customer email is sent.

Scenarios: success, missing tracking URL, same-number callback replay, rejected authentication, and Shopify GraphQL validation failure. The replay case can still write fulfilment status events and metafields, so it must not be presented as fully idempotent.

### Visual and safety boundaries

All styles remain scoped to `.cie-page`; no modifications to the homepage, original case study, sitemap, production Worker, connected app or third-party providers. No actual tokens, URLs, postcodes from private route lists, customers or fulfilment records. Example tracking references are invented. No browser network requests.

### Validation for refinement

Updated regression tests cover zone comparison, last-mile closure dates, NSW/VIC overrides, SA special schedules and the write-back console's state transitions and failure scenarios. **New CI results pending**, until the new branch commit has run. Existing first-version successful CI is not evidence for this refinement.

## 22 November 2026: approved preview homepage feature

The user requested the next phase after confirming that the independent systems case study did not yet appear in the homepage. This authorises a homepage link and its own featured section on the **draft feature branch only**. It does not approve merging, publishing, or retiring the previous CartonCloud page.

### Files and purpose

- app/page.tsx: import and render FeaturedSystemsLab after the Selected Work grid, add a Systems lab anchor to desktop and mobile menus, and add a new footer project link. Preserve all four studio modes and original case studies.
- app/components/FeaturedSystemsLab.tsx (new): premium editorial header, proof of technology, direct CTA to the interactive systems case study, separate CTA to the original CartonCloud case study, and a conceptual event diagram.
- app/components/featured-systems-lab.css (new): route-scoped cinematic design using JRV obsidian (#0b1419), teal (#38c7bc), ember (#f28c52), mobile-stacked diagram, decorative motion and reduced-motion support.
- tests/homepage-browser-qa.mjs: verify the feature section, original case study, dual links, all four existing projects, both navigation anchors, and the new route.
- .github/workflows/portfolio-ci.yml: run the full homepage browser QA on this feature branch as well as the commerce-lab test. The existing consent, source-safety, build and type checks remain active.
- docs/commerce-integration-lab-2026-11-22.md and CHANGELOG.md: record preview-only publication boundaries and validation status.

### Architecture fidelity and safety

The homepage illustration shows Shopify order events reaching Cloudflare Workers, which hosts the non-embedded app backend and uses Workers KV for OAuth persistence. The Worker makes CartonCloud consignment requests, receives tracking callbacks, and uses app-authorised Shopify Admin API calls for fulfilment and order write-back. A native customer notification may be requested but is not guaranteed. It does not invent a separate app server or make live provider calls. All material is conceptual and client/customer data is omitted.

### Release and validation

The new project remains noindex and outside the sitemap while under review. The original CartonCloud case study and the four working homepage previews remain visible alongside the new featured section. No production changes are authorised. The full code and visual regression tests are pending a fresh run on the new commit; prior green CI applies only to earlier commits. Before a future production merge, decide on noindex removal, sitemap publication, canonical URLs and whether to preserve or redirect the original case study.

## 22 November 2026: preview deployment audit and SEO safety regression

Audited Vercel preview build for feature commit `ef8896f88010ed36d31f74fec7f01e531f3eb00b`. Vercel reports **READY** for the `developer-portfolio` Next.js project, with a successful compilation, Next.js lint and type checks and 34 static pages including the homepage and engineering route. The build output reports about **113 kB first-load JavaScript** for the homepage and **123 kB** for the new engineering route (Next.js build estimates, not measured browser Core Web Vitals).

Inspected current branch sources and confirmed homepage has the new featured section, two navigation anchors, the dedicated case-study CTA, the previous integration case-study link, and all four original selected-work cards. The sitemap still omits the new route and its metadata specifies `index: false` while the project is a draft.

**Corrections for this QA commit:** Updated the new route's inline documentation to reflect the already-approved preview homepage link without implying permission to index or publish. Extended `tests/seo-rendered-metadata.mjs` to assert the rendered homepage contains the featured section and both case-study links, that the original four cards remain intact, that the draft engineering page emits a `noindex` robots meta tag and that its URL is absent from the XML sitemap.

**Unverified items / blockers:** GitHub Actions did not return a run for the previous integrated homepage commit through the available connector. Closing and reopening Draft PR #98 did not produce a new run in the visible results. The Vercel-protected preview's authenticated content-fetch operation timed out. These missing results do not justify claiming that the new Playwright desktop/tablet/mobile interaction suite, accessibility audit, or rendered SEO checks have passed at this commit. No production merge is authorised.

## 22 November 2026: authenticated preview HTTP checks

After the prior protected-page fetch timed out, subsequent Vercel-authenticated requests succeeded. Verified on deployment `developer-portfolio-5mzmlinxh-my-dojo.vercel.app` at source commit `814d802`:

| Preview route | HTTP | Verified content and metadata |
|---|---|---|
| `/` | 200 | One featured `#systems-lab` section; navigation and CTAs to new engineering page and original CartonCloud page; all four original project cards remain; homepage is indexable |
| `/projects/commerce-integration-engineering` | 200 | All major interactive lab sections appear in server HTML; `noindex,nofollow`; canonical `https://www.jrvallite.com/projects/commerce-integration-engineering` |
| `/cartoncloud-integration` | 200 | Original case study and own canonical remain; existing page is indexable |
| `/sitemap.xml` | 200 | 22 routes; contains original case study; **excludes** draft engineering page |
| `/robots.txt` | 200 | Published sitemap and existing robot rules present |

Preview response headers include `x-frame-options: DENY`, `x-content-type-options: nosniff` and `referrer-policy: no-referrer` on the new case study. These are HTTP-level checks only: JavaScript hydration, interactions, screenshots, Core Web Vitals, WCAG and end-to-end provider behaviour require separate evidence.

**GitHub Actions remediation attempt:** The final documentation commit was made through the GitHub Contents API rather than a low-level ref update, to test whether the normal push event restores automated PR checks. The result must be verified from GitHub Actions; a Vercel build alone does not imply browser QA passed. The PR remains draft and `main` and production are untouched.

## 22 November 2026: make the draft branch independently CI-testable

GitHub Actions has not reported a new run on PR #98 since low-level Git-ref commits started updating the draft. A normal GitHub Contents API documentation push also did not yield a run because the workflow's `push.branches` filter only allowed `main`, and the PR synchronize event has not appeared. We are adding a **narrowly scoped feature-branch push trigger** without changing the main-branch trigger or production deployment logic.

On `feature/commerce-integration-lab-20261122`, run both the normal validation job (SEO source guard, safety scan, Node and Python tests, TypeScript, Next.js build and rendered-SEO checks) and existing Chrome/Playwright browser job (homepage, case-study, commerce-lab and screenshots). The browser-job and step conditions accept both the original pull-request event and this one explicit feature-branch push event.

This is a **preview-only test workflow change**. Do not use GitHub Actions success on another commit as proof of this branch's readiness. It is not permission to merge, publish the draft SEO route or promote any Vercel deployment.

## 22 November 2026: complete validation and screenshot review (pass)

**Validated code commit:** `3b70540b592e81a36a321e3b0a7efed8fc720986`  
**GitHub Actions:** https://github.com/bonvallite/developer-portfolio/actions/runs/45025686267  
**Outcome:** Both `validate` and `case-study-browser-qa` jobs **PASSED**.

The previously missing workflow trigger was solved by adding `feature/commerce-integration-lab-20261122` to the `push.branches` list and allowing the full browser job and its homepage and commerce-lab steps to run on that specific feature-branch push. The main branch and original PR-trigger path were retained. The run verified:

- SEO publication and privacy source checks, public-safety scan, Node unit tests, Python tests, TypeScript, Next.js build and rendered metadata/sitemap tests all **passed**.
- General case-study Chromium interaction checks: **desktop 1440×900, tablet 768×1024, mobile 390×844 passed**.
- Homepage Chromium checks: **wide 1600×960, desktop 1366×768, tablet 768×1024, mobile 390×844 passed**. The browser tests cover the separate featured system section, links to old and new case studies, unchanged four-mode studio and project cards, navigation, consent behaviour and horizontal layout.
- Dedicated commerce-engineering browser checks: **desktop 1440×900, tablet 768×1024, mobile 390×844 passed**. Verified fictional last-mile zone comparisons, shipping and delivery estimations, calculation resets, blocked webhook authentication, shipping metadata, notification request semantics, OAuth/Workers KV stages and public-safe code explorer behaviour.
- Screenshot artefacts uploaded in one `case-study-browser-qa` archive (12 PNGs across homepage, general case studies and commerce lab; about 25 MB compressed). Reviewed desktop and mobile image contact sheets. Consistent JRV obsidian/teal/ember styling; no obvious layout regression. The preview includes the expected consent panel on first visit.
- Vercel Next.js feature-branch deployment for the verified commit is **READY** at `https://developer-portfolio-mgxsg2x8j-my-dojo.vercel.app/`.
- Authenticated HTTP verification for the immediately preceding application commit additionally confirmed the homepage and both case studies return 200, the new route serves `noindex,nofollow`, and the 22-entry sitemap excludes it while retaining the earlier case study.

**Release decision:** This is a successfully tested **draft preview**, not production. PR #98 remains unmerged. No changes to `jrvallite.com`, the private Cloudflare Worker, Shopify theme, CartonCloud or customer records. Owner may separately approve a production publication after checking preview and choosing when to remove noindex and add the new route to the sitemap. A successful synthetic demo does not establish live provider delivery guarantees.

## Latest-main integration reconciliation (22 November 2026)

- **Base:** `main` `90ea2d30`, containing the already-published eleven-storefront homepage gallery, its 21 provenance-checked screenshots, four refreshed flagship case studies, current JRV design system v1.6 and up-to-date privacy/SEO test coverage.
- **Isolated candidate:** `integration/commerce-systems-latest-main-20261122`. The new Shopify systems route, architecture labs, last-mile simulator, app write-back console and fictional data model are transplanted from the tested PR #98 without copying obsolete homepage/CI/changelog files.
- **Homepage reconciliation:** Insert `FeaturedSystemsLab` **after the published `#websites` gallery and before Expertise**, preserving the four existing case-study cards, four-mode workbench, all eleven homepage links, mobile/desktop gallery and owner-approved résumé, email, professional links and navigation. Include a new compact Systems navigation anchor and footer case-study link.
- **Brand governance:** Maintain `docs/JRV_DESIGN_SYSTEM.md` version 1.7 as a draft extension from the published 1.6 guide. Use the canonical Obsidian `#0B1419`, Electric Teal `#38C7BC` and Ember `#F28C52` via `var(--jrv-*)` where possible; keep the same responsive, reduced-motion behaviour. No root tokens or favicon bytes change.
- **CI reconciliation:** Preserve the newer main workflow, all existing browser suites and the full latest-main Node/Python/TypeScript/SEO/public-safety checks. Add the dedicated fictional commerce-lab browser suite and a narrowly scoped candidate branch push trigger. Verify homepage and route on wide/desktop/tablet/mobile, with published gallery and 11-site index retained.
- **SEO release gate:** The new route retains `robots: {index:false,follow:false}`, self canonical and is excluded from the public sitemap on this candidate. Existing `/cartoncloud-integration` remains linked, indexable, separately canonicalised and unredirected. Before any **authorised** merge, decide whether to index both meaningfully distinct cases or redirect one; either approach requires separate validation.
- **Safety:** This is a public-safe educational interface, not a live CartonCloud, Shopify, Cloudflare or customer notification endpoint. No actual merchant data, secrets, production shipping postcode tables, employee PII or private Worker source.
- **Validation status:** Integration test result **pending** until GitHub Actions confirms exact new branch commit. Prior successful PR #98 CI is historical evidence for the previous base and cannot certify the current main reconciliation.
