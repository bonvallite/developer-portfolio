# B2B portfolio architecture and visual review · 21 November 2026

## Goal

Explain the architectural move from an additional wholesale pricing application to Shopify's company-based B2B buying contexts without confusing the visual demo with live authorisation. Focus on a memorable, interactive portfolio narrative and engineering evidence, not new merchant operations.

**Route:** `/b2b-modernisation` in the personal JRV portfolio. No Shopify theme is edited.

## Experience and shared state

- The hero has four clickable fictional contexts: retail, wholesale tier 1, 2 and 3. It shows the example unit price, entitlement and catalogue, not a real client product.
- The existing `CinematicB2B.tsx` controls still own `marketIndex`, `eligible` and `quantity`. The architecture inspector is **controlled by those props** and has no independent account-access state.
- Example wholesale unit prices in the original simulator are A$112, A$104 and A$96, versus the fictional A$120 retail price. The existing 12-unit basket and quantity slider remain connected.
- An unapproved wholesale context **reverts to retail pricing in the demonstration**. A real Shopify storefront may restrict company purchasing or display entitlement differently; the portfolio cannot override platform-enforced prices.
- The inspector has four selectable engineering stages: application, company location verification, catalogue resolution and checkout authority. Each contains clearly marked illustrative pseudocode, an evidence boundary, and an on-page fictional context switch.
- The existing application-to-purchase journey and historical reporting sections remain intact.

## Technical and confidentiality boundaries

This source must not claim a real user was approved, a Shopify catalogue was changed, a checkout was recalculated, or any merchant pricing rules were exported. A user-selected checkbox or chip does not grant actual B2B eligibility. Application review and company-location authorisation are merchant/platform responsibilities.

All new prices, products and entitlement scenarios are fictional. The pre-existing historical section uses documented aggregated source data and differs in scope from these examples; **legacy order-tag and native Shopify B2B metrics may overlap and must never be added together**. This PR adds no new client-revenue claims and does not change historical series or their caveats.

The `B2BEntitlementInspector.tsx` source is standalone React and client-side. It does not call the Shopify API, execute source snippets, touch inventory, create checkout sessions, use local storage, or load additional analytics. `b2b-showcase.css` overrides the original gold styling *only* within the B2B route to use the approved JRV teal, orange and obsidian look.

## Validation and preview process

1. Run source publication safety, SEO checks, the original B2B suite, Node and Python tests, TypeScript and Next production build.
2. In GitHub Actions browser QA, load the B2B route at desktop 1440px, tablet 768px and mobile 390px.
3. Select wholesale tier 2 in the hero; verify the original price laboratory and inspector both display its fictional A$104 unit price and A$1,248 subtotal at 12 units.
4. Disable fictional company entitlement; verify retail example price returns to A$120 and the original price-lab checkbox is unchecked.
5. Restore eligibility; verify A$192 fictional saving at 12 units, then change quantity with a keyboard arrow and verify the recalculation appears everywhere.
6. Inspect accessible system stages and the six-step buyer journey, confirm evidence/disclosure copy, reject optional analytics, and verify no horizontal overflow or JavaScript exceptions.
7. Save three full-page screenshots as GitHub Actions artifacts.

GitHub is the current review/release source of truth. **Do not call Vercel or merge into production until the daily Vercel deployment allowance resets and final-commit preview QA is authorised.** If build, source safety, or browser QA fails, fix the branch and rerun its checks before considering release.
