
# Closed-loop logistics studio — draft 27 November 2026

Public-safe extension of the existing Shopify App Engineering flagship. The source is independently reconstructed from architectural concepts and existing public demo helpers. No employer source, complete postcode configuration, real orders, production URLs, keys, warehouse IDs, carrier messages or uploaded internal documents are included.

## Architecture
Shopify order and fulfilment webhooks enter a Worker; the Worker uses custom app OAuth access for Shopify writes, queries a holiday adapter, and exchanges consignments and scans with the carrier. Shopify renders its own native customer messages. The physical fleet is distinct from network traffic.

## Implementation
- Pure local lifecycle engine emits ordered inputs, outputs and explicit success/skip/failure states. Existing independent ETA/shipment/status functions are reused; the new long-haul profile computes Friday dispatch and a 4–5 business-day window.
- GSAP MotionPathPlugin animates the selected network edge; React state owns playback. No business logic depends on animation. Reduced-motion users retain manual navigation and static labels. No pinning or scroll interception in this increment.
- Scenario controls: signature rejection, postcode mismatch, static holiday fallback fixture, write rejection, carrier unavailable, and non-carrier methods. The holiday adapter is a fixture, not a live cache or API. Signature and OAuth behaviour are modelled, not cryptographic verification in this module.
- The inspector shows local JSON inputs/outputs, and the ETA preview follows reported email-first/SMS fallback. It does not send a message.
- Local delivery bypass reflects intended business separation, not verified production gatekeeper behaviour. The older public model has illustrative zone fixtures and carrier status aliases; no production parity is asserted. Only a subset of fields is emitted by this first increment.

## Verification and follow-up
Run npm test, npm run check:safety, npx tsc --noEmit, npm run build, then review the exact-head Vercel preview on desktop/mobile and reduced motion. Pending: deeper OAuth visualisation, editable payloads, repeat/out-of-order callback handling and retry, actual production source reconciliation in a restricted environment. Do not merge without checks and owner review.

## Phase 2 — 14-chapter tour

The first increment passed both jobs of GitHub Actions 45947771464 at d0186e0. This candidate adds a read-only tour derived from the same normal-path event trace; desktop ScrollTrigger observes chapter boundaries without pinning, and manual selection works on all layouts. The studio and tour share one topology with unique SVG markers. Successful app writes illuminate the return leg; failed writes never do. Physical handover and scan steps are distinct mock events. New unit and dedicated Chrome checks are added; exact-head verification remains pending.

## Phase 3 — executable Worker function inspector

Eleven independently authored examples execute on explicit Run with editable JSON, normal and edge fixtures, result validation and explanatory code excerpts. The scheduling, carton and status examples reuse the existing public model; the other functions validate and normalise inputs. No arbitrary code execution, real authentication, real postcode eligibility determination, private identifiers, external requests or notification sends. The GraphQL response example checks HTTP, errors, userErrors and presence of data, not actual stored state. GSAP highlights the local result pipeline only; reduced motion retains all controls. New unit and Chrome tests cover execution, invalid inputs and mobile layout. Phase 2 source/build checks passed in run 45948599782; its browser job was still running at the start of this increment. Exact-head Phase 3 validation pending.

## Phase 4 — documented metafield explorer

The independent snapshot model covers the supplied 22 ETA and seven tracking keys; six type examples are corroborated by the earlier public communication model, and all other types are marked illustrative. The actual merchant definitions and conditional writes are not independently verified. Delivery dates come from the shared schedule engine; no tariff is available, so delivery_fee stays unset. Tracking timestamps and identifiers are fictional. Previous, attempted and stored values are separated, and a rejected selected carrier write retains the prior assumed-success milestone. ETA and tracking acceptance are independent. GraphQL variables use string values, placeholder owner IDs and omit unset fields; they are not sent. The Liquid access expression and customer view are illustrative, not verified store templates. Five regression groups and dedicated browser QA are added; Phase 3 source/build passed in run 45949064306, browser checks were still running at the start. Exact-head verification pending.
