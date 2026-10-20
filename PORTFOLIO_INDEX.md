# Portfolio index

How this repository maps to each area of Shopify and e-commerce engineering. All code here is independently written for the portfolio, using fictional data. **Status** is about what this repository shows, not a measure of experience: *Covered* has tested example code, *Partial* has limited code or documentation only, and *Not represented* means nothing is published yet.

| # | Area | Status | Where to look |
|---|---|---|---|
| 1 | Shopify theme development | Covered | [09 grid CSS](examples/09-responsive-product-grid.css), [17 FAQ](examples/17-accessible-faq.html), [21 cart dialog focus](examples/21-cart-drawer-accessibility.js), [18 images](examples/18-image-performance-helper.js) |
| 2 | Shopify Liquid components | Covered | [08 product card](examples/08-product-card.liquid), [40 metaobject image fallback](examples/40-metaobject-image-fallback.liquid), [Flow email templates](shopify-flow/) |
| 3 | Shopify Flow automation | Covered | [shopify-flow/](shopify-flow/README.md): Run code action, email Liquid, [patterns](shopify-flow/WORKFLOW_CATALOGUE.md) |
| 4 | B2B commerce and weight-based pricing | Covered | [Simulator](B2B_DEMO.md) (`/b2b-demo`), [01 units](examples/01-weight-unit-normaliser.js), [10 eligibility](examples/10-cart-weight-eligibility.js), [15 tier validation](examples/15-discount-rule-validator.js), [42 GST invoice](examples/42-b2b-gst-invoice.js) |
| 5 | API and webhook integrations | Covered | [02 HMAC](examples/02-webhook-signature.js), [03 idempotency](examples/03-idempotent-event-handler.js), [05 retry](examples/05-retry-backoff.js), [13 safe logging](examples/13-safe-log-redaction.js), [20 GraphQL pagination](examples/20-graphql-pagination.js) |
| 6 | Cloudflare Workers | Not represented | No Workers source was found in the sources reviewed for this portfolio |
| 7 | Fulfilment and tracking automation | Covered | [04 status mapping and ordering](examples/04-fulfilment-status-map.js), [33 stale parcels](examples/33-stale-tracking-events.js), [36 event keys](examples/36-stable-event-keys.js) |
| 8 | Delivery calculator engineering | Covered | [41 zone calculator](examples/41-delivery-zone-calculator.js), [06 transit](examples/06-business-day-delivery.js), [19 calendar](examples/19-holiday-calendar.js), [26 zones](examples/26-shipping-zone-matcher.js), [39 wording](examples/39-shipping-estimate-copy.js) |
| 9 | Metafields and metaobjects | Partial | [07 metafield parsing](examples/07-product-metafield-parser.js), [40 metaobject fallback](examples/40-metaobject-image-fallback.liquid) |
| 10 | Email templates and notifications | Covered | [Internal](shopify-flow/internal-order-email.liquid), [customer](shopify-flow/order-notification-email.liquid) and [digest](shopify-flow/sample-operations-email.liquid) templates |
| 11 | Inventory and order reporting | Partial | [Digest email](shopify-flow/sample-operations-email.liquid), [12 reconciliation](examples/12-purchase-reconciliation.js), [28 safe CSV](examples/28-safe-csv-escape.js) |
| 12 | Loyalty, rewards and promotions | Partial | Documentation only: [promotional line-item pattern](shopify-flow/WORKFLOW_CATALOGUE.md) |
| 13 | GA4, GTM and analytics | Covered | [11 purchase dedupe](examples/11-order-event-dedupe.js), [12 reconciliation](examples/12-purchase-reconciliation.js), [27 funnel](examples/27-analytics-funnel-report.js), [30 UTM](examples/30-utm-parameter-builder.js) |
| 14 | SEO and website performance | Covered | [24 breadcrumbs](examples/24-breadcrumb-structured-data.js), [16](examples/16-slug-redirect-generator.js) and [29](examples/29-redirect-loop-audit.js) redirects, [34 preload](examples/34-asset-preload-planner.js), [35 Core Web Vitals](examples/35-core-web-vitals-budget.js), [37 headings](examples/37-content-h4-normaliser.js) |
| 15 | Debugging, maintenance and audits | Partial | [23 titles](examples/23-product-title-audit.js), [25 channels](examples/25-channel-coverage-audit.js), [29 redirect loops](examples/29-redirect-loop-audit.js); no written debugging case studies yet |
| 16 | Developer tools and utilities | Covered | [14 URL cleaner](examples/14-query-parameter-cleaner.js), [22 search](examples/22-search-query-normaliser.js), [28 CSV](examples/28-safe-csv-escape.js), [publication safety scanner](scripts/check-public-safety.mjs) |

## Project cards

Every card follows the same outline. **Evidence** lists only what this repository can show (tests, builds); none of these cards claims production results.

### B2B weight-based pricing simulator
- **Objective:** show how order-level aggregate weight can drive a volume discount.
- **Problem:** quantity-based price breaks don't express "at least 10 kg across any mix of products".
- **Technologies:** TypeScript, React, Next.js, JavaScript (ES modules), Node test runner.
- **Approach:** a pure function (`lib/b2b-simulator.mjs`) validates the catalogue, basket and tiers, then sums grams and cents as integers and picks the highest qualifying tier. The UI at `/b2b-demo` only displays the result. Supporting examples normalise weight units (01), report how much more weight qualifies (10), validate tier tables (15) and total GST-exclusive invoices (42).
- **Challenges:** floating-point money (solved with integer cents and basis points), mixed weight units, and duplicate basket lines.
- **Setup:** `npm install`, `npm test`, `npm run dev`, then open `/b2b-demo`.
- **Evidence:** unit tests for boundaries, invalid input and immutability, plus a production build in CI.
- **Limitations:** frontend only. Real pricing must be enforced server-side with Shopify B2B catalogues or discount functions.

### Shopify Flow Run code and notifications
- **Objective:** classify wholesale orders by aggregate weight inside Flow and notify staff.
- **Technologies:** Shopify Flow Run code (JavaScript), Liquid.
- **Approach:** a defensive `main(input)` returns a structured `{ eligible, totalGrams, tier, reason }` for later Flow steps; Liquid templates render internal and customer messages.
- **Setup:** `node --test tests/flow-run-code.test.mjs`. In Flow, map the input query fields first.
- **Evidence:** 4 unit tests, and the Liquid structure check in CI.
- **Limitations:** not an importable workflow. Variable bindings are placeholders that must be verified in the Flow editor.

### Webhook and fulfilment event pipeline
- **Objective:** process carrier and platform events safely and exactly once.
- **Technologies:** Node.js (`crypto`), JavaScript.
- **Approach:** verify the HMAC over the raw body (02), share one in-flight run per event id (03), retry with capped backoff (05), normalise statuses and ignore out-of-order regressions (04), log allow-listed fields only (13), and flag stale parcels (33).
- **Challenges:** concurrent duplicate deliveries, and late webhooks moving a delivered parcel back to "in transit".
- **Evidence:** unit tests, including one that fails against the earlier handler, which ran duplicate concurrent events twice.
- **Limitations:** in-memory state. Production needs durable atomic storage and the provider's real signature format.

### Delivery estimate calculator
- **Objective:** produce a conservative delivery date from postcode, order time and calendars.
- **Technologies:** JavaScript.
- **Approach:** dispatch cut-off, then calendar-day transit, then weekend and holiday roll-forward, then zone-specific delivery weekdays (41, reusing 06 and 19). Wording that never promises a date (39).
- **Evidence:** unit tests covering cut-off, a weekend, a holiday on the arrival day, unknown postcodes and invalid input.
- **Limitations:** fictional zones and times. The caller must convert to the warehouse time zone first, and real courier ETAs vary.

### Analytics data integrity
- **Objective:** stop double-counted purchases and explain gaps between store orders and analytics.
- **Approach:** browser guard against re-sent purchase events on reload (11, with event keys from 36), order-versus-analytics reconciliation (12), a funnel report (27) and consistent UTM building (30).
- **Evidence:** unit tests.
- **Limitations:** no GA4 or GTM configuration is published, and GA4's own `transaction_id` deduplication still applies.

## Validation

```sh
npm test               # examples, Flow Run code, B2B simulator, Liquid structure
npm run check:safety   # credential, store-identifier and contact-detail scan
npx tsc --noEmit && npm run build
```

GitHub Actions runs all of these on every push to `main` and on every pull request.
