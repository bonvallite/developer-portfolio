# Shopify and CartonCloud: custom delivery synchronisation app

**Project type:** Commerce and logistics API integration  
**Stack:** Shopify REST Admin API, CartonCloud, Cloudflare Workers, webhooks, JavaScript, OAuth, order metafields  
**Publication:** Public-safe engineering case study; not the employer-owned source code.

## Business problem

Order and fulfilment information lived in Shopify, while shipment movement and delivery milestones lived in CartonCloud. Keeping tracking details, fulfilment events and estimated delivery dates aligned required bridging two different platforms. The aim was to reduce fragmented order visibility and support consistent customer-facing delivery updates.

## My contribution

I designed and built a custom serverless integration using a Cloudflare Worker to coordinate Shopify fulfilment-order lookups, CartonCloud consignment processing, tracking-state handling and order-level estimated-delivery-date updates. The integration explored mapping provider events to Shopify fulfilment events and using order metafields to make delivery estimates accessible to downstream operations and notifications.

This is a project account, not a claim that a Shopify App Store listing, embedded app UI, or fully independent CartonCloud implementation was developed.

## Architecture

```text
Shopify orders / fulfilment orders
           |
           v
Custom Cloudflare Worker integration
  - authorised Admin API requests
  - order / consignment correlation
  - status and date mapping
  - event processing / diagnostics
           |
           v
CartonCloud consignments and shipment milestones
           |
           v
Worker update path -> Shopify tracking / fulfilment events
                   -> estimated delivery-date order metafields
```

The architecture is deliberately simplified. Exact triggers, webhook secrets, request payloads, retry implementation, operational thresholds and private schema keys are not published.

## Development challenges

- **Authorisation:** Shopify OAuth and fulfilment-related API permissions needed troubleshooting during historical testing.
- **Data mapping:** Warehouse delivery events and Shopify fulfilment events use different state vocabularies and relationships.
- **Repeat events:** Safe idempotency and retry design is important to avoid duplicate consignments and conflicting status changes. This case study does not independently certify production durability.
- **Delivery dates:** Estimates belong to order context and need to reflect changes in delivery movement without presenting forecasts as guarantees.
- **Observability:** Distinguish accepted REST reads, completed Shopify writes and successful end-to-end propagation.

## Evidence boundaries

- **August 2026:** Previous integration testing exercised sample fulfilment and tracking operations. A manual retry successfully wrote an estimated delivery date to one Shopify order. Additional authorisation and deployment issues were investigated.
- **21 October 2026:** A user-provided Shopify app log screenshot shows four successful `GET` requests to versioned REST fulfilment-order resources, plus a seven-day activity graph. The visible requests do not prove successful writes or identify the originating runtime.
- **Not established:** An independently verified zero-error rate, complete synchronisation for every order, a measured business uplift or ongoing production health.

The screenshot itself is excluded because it shows production order identifiers and the private store domain. The portfolio uses explanatory text instead of raw logs or customer records.

## Production quality and handover checklist

1. Confirm current Shopify app scopes and access to all intended fulfilment orders.
2. Trace webhook receipt through consignment correlation and Shopify write confirmation.
3. Verify deduplication, safe retries, non-regressing status transitions and actionable error logs.
4. Compare Shopify order metafields, tracking information and CartonCloud shipment events across a representative order sample.
5. Check timezone, date formatting and customer-facing ETA wording.
6. Document the currently deployed Worker version, integration ownership and rollback procedure in the private operational runbook.

## Public showcase

See [the CartonCloud case study](/cartoncloud-integration) in the deployed Next.js portfolio. All diagrams and terminology are independently reconstructed from the project description; no private implementation or live customer data is supplied.
