# Shipping webhooks and chargeback evidence

Reviewed 21 October 2026.

This case study explains how a custom shipping integration can make chargeback evidence easier to assemble and reconcile. It is generalised from professional work on a Shopify store. Customer records, order identifiers, dispute amounts, private tracking links, vendor payloads, and employer-owned source code are excluded.

## Problem

Fulfilment, payment, courier tracking, proof of delivery, and customer communications can live in separate systems. A store order marked fulfilled establishes that goods were processed for shipment; it does not establish delivery. When a dispute arrives, staff need to connect the transaction to the shipment and its delivery evidence without overstating what any one record proves.

## Contribution

I developed a custom integration using Cloudflare Workers and Shopify APIs to synchronise courier tracking references and shipment status updates with Shopify fulfilments. I also reviewed chargeback records, reconciled delivery evidence, and prepared response narratives that separated confirmed facts from missing evidence.

The public examples in this repository illustrate related engineering patterns. They are independently authored demonstrations, not the original production implementation.

## How the integration supports a response

| Integration capability | Evidence value | Important limit |
| --- | --- | --- |
| Match a courier consignment to a Shopify order and fulfilment | Connects the purchase to a specific shipment | Incorrect reference matching breaks the evidence chain |
| Synchronise tracking numbers and links | Gives staff a route to the carrier record and delivery proof | Preserve an export of the proof; a link can expire or require authentication |
| Write carrier status events into Shopify | Adds a delivery history alongside the order | Fulfilled and delivered are different states |
| Record event time and processing time | Helps reconcile delivery chronology and synchronisation | A modification or receipt time must not be presented as the physical delivery time |
| Support customer shipping notifications | Can provide a communication history when logs are retained | Requesting a notification does not prove delivery, opening, or acknowledgement |
| Inspect API errors and re-query the fulfilment | Helps detect rejected or incomplete updates | HTTP success alone does not establish that a requested event was saved |

## Outcome and attribution

A review of live order-level dispute statuses confirmed successful disputes with courier-linked delivery events in Shopify. Other reviewed cases had different outcomes or remained under review at the review date.

The evidence supports a measured conclusion: the integration strengthened the delivery records available for chargeback responses. It does not establish that the webhook caused an issuer to decide in the merchant's favour. The final submitted evidence, issuer reasoning, and payout credits were not all available for verification.

A saved response draft is also distinct from a submitted response. Current dispute status must be checked separately rather than inferred from the existence of a prepared document.

No store-wide win rate, recovered revenue, or reduction in fraud is claimed. Private case details and commercial figures are intentionally omitted.

## Reviewing the evidence

1. Check the current dispute category and status.
2. Reconcile the order, successful payment, billing and shipping addresses, fulfilment, consignment, and carrier proof.
3. Compare carrier delivery time with the Shopify event time and the time the event was saved.
4. Collect the original delivery proof and relevant customer communications.
5. For an unauthorised-payment allegation, include payment verification and acknowledgement evidence where available. Delivery alone does not establish cardholder authorisation.
6. For a recurring payment, retain subscription consent, payment authority, renewal linkage, and cancellation history alongside delivery evidence.
7. Verify submission separately and record the eventual outcome without treating pending cases as wins.

## Engineering lessons

- Keep source-event time, webhook receipt time, and processing time distinct. If a source timestamp is missing, record the uncertainty rather than silently representing a fallback as a delivery time.
- Reconcile inconsistent courier and platform dates before making an exact delivery claim.
- Preserve carrier proof separately from mutable tracking URLs.
- Separate tracking updates from lifecycle events so that a tracking number does not substitute for a delivered status.
- Validate provider authentication, reference matching, retry behaviour, duplicate handling, and late-event ordering for the actual integration. The presence of a demonstration in this repository does not establish that a production safeguard was deployed.
- Treat courier and Shopify records as linked views of the same source event, rather than independent confirmation of delivery.

## Related portfolio examples

- [Webhook signature verification](./examples/02-webhook-signature.js)
- [Idempotent event handling](./examples/03-idempotent-event-handler.js)
- [Fulfilment status mapping and ordering](./examples/04-fulfilment-status-map.js)
- [Retry backoff](./examples/05-retry-backoff.js)
- [Safe log redaction](./examples/13-safe-log-redaction.js)
- [Stale tracking events](./examples/33-stale-tracking-events.js)
- [Stable event keys](./examples/36-stable-event-keys.js)

## Reference

[Shopify guidance on responding to chargebacks](https://help.shopify.com/en/manual/payments/chargebacks/chargeback-process) describes delivery confirmation, payment verification, customer communications, and other evidence relevant to a response. The card issuer makes the final decision.

## Publication record

21 October 2026: Added this documentation-only case study following a review of shipping evidence and dispute statuses. Validation covered the factual boundaries, publication privacy rules, and links to existing repository examples. No production source, case files, customer data, or private tracking records were published.
