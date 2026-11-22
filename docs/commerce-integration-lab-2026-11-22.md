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
