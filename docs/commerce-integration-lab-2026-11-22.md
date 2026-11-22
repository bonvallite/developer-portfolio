# Commerce integration engineering lab (draft / unpublished)

**Date:** 22 November 2026  
**Repository:** `bonvallite/developer-portfolio`  
**Feature branch:** `feature/commerce-integration-lab-20261122`  
**New route:** `/projects/commerce-integration-engineering`  
**Release decision:** Do not merge, link from homepage, publish, or retire `/cartoncloud-integration` without an additional owner review.

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

- Current homepage `app/page.tsx` is not modified.
- Current old case-study `app/cartoncloud-integration/*` is not modified.
- Existing service `app/shopify-app-development/page.tsx` is not modified.
- New route is intentionally excluded from `app/sitemap.ts` and has `robots: noindex, nofollow`? **Actual implementation:** `robots: {index:false,follow:false}`. Do not add sitemap or homepage links until approved.
- At approval, review canonical URLs and consider a permanent redirect from the previous route only after verifying search performance and replacement completeness.

## Validation contract

1. Review exact remote branch file contents after saving.
2. Run `npm test`, `npm run check:safety`, `node scripts/check-seo-publication.mjs`, `npx tsc --noEmit`, `npm run build`.
3. Run desktop/tablet/mobile visual and accessibility checks for new controls, reduced motion, page overflow, source-code tabs, keyboard support and screen readers.
4. Confirm no changes to root route, old case study, sitemap or production backend.
5. Record CI results as **pending** until actually obtained; never claim browser tests on source inspection alone.

## Open engineering caveats

- The synthetic date calculator intentionally omits the private zone table and real holiday service.
- The demo has a selectable closure date and fixed illustrative carton capacity; these are not merchant promises.
- In the reviewed private Worker, missing webhook secrets can allow a specific handler to continue, and repeated status callbacks can produce further status events; this demo describes the risk, not a production fix.
- Live customer email receipt, provider latency, retries and message deduplication are not independently certified.
