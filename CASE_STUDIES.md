# Engineering case studies

These are **high-level, public-safe project summaries** informed by professional experience. They do not reproduce employer-owned source code, internal system diagrams, private business terms, credentials, or live customer data. Code in `../examples/` is independently authored and illustrative rather than an exact implementation.

## 1. Shopify theme and storefront engineering
**Problem class:** Maintaining responsive product, collection, navigation, FAQ, and cart experiences across changing themes.

**Approach:** Audit templates and Liquid sections; identify interaction, layout, accessibility, and performance regressions; prototype responsive components; validate mobile and desktop; document changes in source comments and a project change log.

**Demonstrations:** Product card (08), CSS grid (09), accessible FAQ (17), cart dialog focus (21), breadcrumb structured data (24), heading normalisation (37), and image fallback (40).

## 2. Weight-based wholesale pricing and automation
**Problem class:** Conventional quantity pricing does not directly express order-level aggregate weight requirements.

**Approach:** Model a weight aggregation and eligibility function, validate tier definitions, then reason about separate customer-facing and back-office actions. Apply authorisation and platform-native discount mechanisms in actual implementations.

**Demonstrations:** 01, 10, 15, 32.

## 3. Fulfilment and order tracking
**Problem class:** Vendor status events need authentication, normalisation, reliable processing, and observability.

**Approach:** Verify webhook signatures over raw payloads, build idempotency boundaries with durable storage, normalise provider events to internal statuses, add bounded retries and logging that omits customer details.

**Demonstrations:** 02, 03, 04, 05, 13, 33, 36. The examples are not a deployable production integration.

## 4. Delivery ETA modelling
**Problem class:** Movement through a carrier network and final-mile residential delivery can follow different calendars.

**Approach:** Model transit days and destination delivery constraints separately, use explicit holiday calendars and destination service eligibility, and word estimates without promises.

**Demonstrations:** 06, 19, 26, 39.

## 5. Analytics and attribution troubleshooting
**Problem class:** Ecommerce platforms and event analytics may disagree on sessions, purchases, and revenue.

**Approach:** Compare transactions by anonymised identifier, inspect duplicate events, review event configuration, assess reporting filters, and separate genuine missing transactions from attribution gaps.

**Demonstrations:** 11, 12, 27, 30.

## 6. Catalogue governance, SEO, and redirects
**Problem class:** Product changes can create broken links, inconsistent headings, incomplete sales-channel publication, and search discoverability gaps.

**Approach:** Audit without mutating live data; prepare replacement mapping; detect loops; review missing publishing channels; build SEO-safe metadata and site navigation.

**Demonstrations:** 07, 14, 16, 23, 24, 25, 29, 31, 37, 38.

## 7. Site speed and performance
**Problem class:** Unnecessary asset loading and duplicated enhancements may degrade real-world speed.

**Approach:** Prioritise only critical resources, set image dimensions, use responsive imagery, and evaluate Core Web Vitals against sensible thresholds with field evidence.

**Demonstrations:** 09, 18, 34, 35.

## 8. Marketing technology and audience measurement
**Problem class:** Event instrumentation, campaign URLs, and marketing analytics need consistent, privacy-conscious data.

**Approach:** Distinguish tracking hygiene from marketing outcomes, validate event names and deduplication, and avoid exposing identifiable visitors or private campaign strategy.

**Demonstrations:** 11, 12, 27, 30.

## Publication boundaries
- Employer-owned code, live themes, Shopify Flow exports, proprietary rules, private API contracts, and actual tracking datasets are intentionally **not** published.
- Real account, order, product, theme, or vendor identifiers and domain-specific internal rules are excluded.
- Where permission exists, an authorised source-level contribution can be documented separately after owner review.
- These examples are not proof that identical code was deployed or audited in any company system.
