# Shopify Flow engineering patterns

A **generalised summary of automation patterns** from professional Shopify Flow work. It describes approaches, not any business's workflows: no workflow exports, triggers configured for a specific store, schedules, recipients, thresholds, tags, variant IDs or message copy are published, and none are reproduced here.

## Patterns

**Scheduled operational reporting.** Time-based trigger → fetch recent orders or products → format a summary in Liquid → send an internal email. Design points: keep the query window explicit, cap result counts, and leave customer personal data out of internal digests. See the [fictional digest email](./sample-operations-email.liquid) and its [synthetic data](./sample-report-data.json).

**Promotional line-item automation.** Order trigger → eligibility and tier conditions → guard against adding the same item twice → add a zero-priced line item and tag the order. Design points: idempotency on retries, and keeping the real offer rules in platform discount configuration instead of hidden in workflow conditions.

**B2B account onboarding.** New company or location → eligibility check → constrained administrative updates → internal notification. Design points: least-privilege actions and a human review step before any payment or checkout setting changes.

**Discount governance.** Discount created → policy conditions → Admin API action. Design points: making policy checks explicit and auditable instead of relying on manual review.

**Order lifecycle tagging.** Order event (for example cancellation) → operational tag for downstream reporting.

**Event-driven customer messaging.** Commerce event → condition → message action, with personalisation limited to fields the customer already provided.

## Portfolio examples
- [Aggregate-weight Run code action](./run-code.js) with [tests](../tests/flow-run-code.test.mjs)
- [Internal email](./internal-order-email.liquid)
- [Customer order message](./order-notification-email.liquid)
- [Daily operations digest](./sample-operations-email.liquid)

## Limits of this summary
It is not evidence that any particular workflow ran in production or how it performed. Original workflow files are private to their owner and should only be published with explicit permission after a security and IP review.
