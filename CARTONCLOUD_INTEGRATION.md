# Shopify and CartonCloud: custom delivery synchronisation app

**Project type:** Commerce and logistics API integration  
**Stack:** Shopify REST Admin API, CartonCloud, Cloudflare Workers, webhooks, JavaScript, OAuth, order metafields  
**Publication:** Public-safe engineering case study; not the employer-owned source code.

## Business problem

Order and fulfilment information lived in Shopify, while shipment movement and delivery milestones lived in CartonCloud. Keeping tracking details, fulfilment events and estimated delivery dates aligned required bridging two different platforms. The aim was to reduce fragmented order visibility and support consistent customer-facing delivery updates.

## My contribution: I built both the app and the integration

I designed and developed two connected parts of the solution:

### 1. The custom delivery app I built

I implemented the serverless application layer using a Cloudflare Worker. It coordinates Shopify Admin API calls and fulfilment-order lookups, authentication, event processing, tracking-state handling, delivery-date updates, error investigation and order metafield writes. The application owns the orchestration responsibilities, rather than being simply a configuration change inside an existing Shopify theme.

### 2. The Shopify–CartonCloud integration I built

I also developed the integration workflows linking Shopify fulfilment information to CartonCloud consignments and returning shipment tracking, delivery events and estimated delivery-date information to Shopify. This involves mapping the data and behaviours of two different platforms into a consistent order workflow.

**Scope clarification:** These are two parts of one custom technical solution, not a claim of two separately published commercial products or an independently authored CartonCloud platform. The app is not claimed to be a Shopify App Store listing or embedded administration interface.

## Conceptual architecture

```text
          Shopify orders and fulfilment information
                           ↕
                CUSTOM APP I BUILT
           Cloudflare Worker application
      Authentication · Orchestration · ETA handling
                           ↕
             INTEGRATION I BUILT
             Shopify–CartonCloud APIs
      Webhooks · Consignments · Tracking events
                           ↕
                     CartonCloud
            Consignments and delivery milestones

  RETURN PATH (through the same app and integration)
  -> Shopify tracking and fulfilment events
  -> Shopify order metafields and estimated delivery dates
```

Arrows describe logical exchange rather than production network boundaries. The integration is implemented and coordinated by the custom app. Exact triggers, webhook secrets, request payloads, retry implementation, operational thresholds and private schema keys are not published.

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

See [the CartonCloud case study](./app/cartoncloud-integration/page.tsx) in the Next.js portfolio, subject to deployment validation. All diagrams and terminology are independently reconstructed from the project description; no private implementation or live customer data is supplied.
