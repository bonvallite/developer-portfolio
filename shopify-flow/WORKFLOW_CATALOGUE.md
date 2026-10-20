# Shopify Flow engineering catalogue

This is a **sanitised capability summary** based on a review of 15 supplied Shopify Flow exports. It is not an export of live workflows, a claim of authorship of every workflow, or evidence that each workflow is currently enabled. Original files are **not** published.

| Area | Export count | General capability |
|---|---:|---|
| Collabs messages | 3 | Triggers, conditions, first-sale and gift follow-up messages |
| Operational reporting | 4 | Scheduled fetches of products/orders and Liquid-formatted digest emails |
| Gifts and loyalty | 5 | Order trigger, eligibility conditions, line item actions and tags |
| B2B company onboarding | 1 | Company-location trigger, administrative changes and notifications |
| Discount code policy | 1 | Discount-created trigger, conditions and an Admin API operation |
| Cancelled order administration | 1 | Cancellation trigger and order tagging |

## Engineering patterns represented

**Scheduling and reporting:** Time-based trigger → query/fetch → Liquid-formatted summary → internal email. Live business recipients, time schedules, order queries, and full original message bodies are deliberately withheld.

**Gift fulfilment:** Order trigger → tier and eligibility checks → guard against duplicates → optional zero-priced line item and order tagging. Live spend thresholds, variant IDs and offer terms are deliberately withheld.

**B2B onboarding:** New company location → eligibility decision → constrained administrative updates → internal notification. The original configuration includes commercially sensitive payment and checkout settings; no live values are reproduced.

**Discount governance:** Discount creation → conditions → API operation. Production API mutations and private rule predicates are excluded.

**Order lifecycle:** Cancellation trigger → add an operational tag. Real tag conventions remain private.

**Partner communications:** Event trigger and condition → message action. Partner identifiers, personalisation variables and copy are excluded.

## Portfolio examples
- [Example aggregate-weight evaluation](./run-code.js)
- [Example internal email](./internal-order-email.liquid)
- [Example customer order message](./order-notification-email.liquid)
- [Example daily operations email](./sample-operations-email.liquid)
- [Example synthetic reporting data](./sample-report-data.json)

## Review limitations
The exports describe configured workflow nodes, but do not prove enabled status, production execution, deliverability, or that the workflows were personally authored by the portfolio owner. Additional validation requires Shopify Flow run history and permitted access to the original store.

Do **not** publish the raw .flow files or email bodies without explicit owner approval and a separate security and intellectual-property review.
