
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
Run npm test, npm run check:safety, npx tsc --noEmit, npm run build, then review the exact-head Vercel preview on desktop/mobile and reduced motion. Pending: repeat/out-of-order callback handling and retry, actual production source reconciliation in a restricted environment. Do not merge without checks and owner review.

## Phase 2 — 14-chapter tour

The first increment passed both jobs of GitHub Actions 45947771464 at d0186e0. This candidate adds a read-only tour derived from the same normal-path event trace; desktop ScrollTrigger observes chapter boundaries without pinning, and manual selection works on all layouts. The studio and tour share one topology with unique SVG markers. Successful app writes illuminate the return leg; failed writes never do. Physical handover and scan steps are distinct mock events. New unit and dedicated Chrome checks are added; exact-head verification remains pending.

## Phase 3 — executable Worker function inspector

Eleven independently authored examples execute on explicit Run with editable JSON, normal and edge fixtures, result validation and explanatory code excerpts. The scheduling, carton and status examples reuse the existing public model; the other functions validate and normalise inputs. No arbitrary code execution, real authentication, real postcode eligibility determination, private identifiers, external requests or notification sends. The GraphQL response example checks HTTP, errors, userErrors and presence of data, not actual stored state. GSAP highlights the local result pipeline only; reduced motion retains all controls. New unit and Chrome tests cover execution, invalid inputs and mobile layout. Phase 2 source/build checks passed in run 45948599782; its browser job was still running at the start of this increment. Exact-head Phase 3 validation pending.

## Phase 4 — documented metafield explorer

The independent snapshot model covers the supplied 22 ETA and seven tracking keys; six type examples are corroborated by the earlier public communication model, and all other types are marked illustrative. The actual merchant definitions and conditional writes are not independently verified. Delivery dates come from the shared schedule engine; no tariff is available, so delivery_fee stays unset. Tracking timestamps and identifiers are fictional. Previous, attempted and stored values are separated, and a rejected selected carrier write retains the prior assumed-success milestone. ETA and tracking acceptance are independent. GraphQL variables use string values, placeholder owner IDs and omit unset fields; they are not sent. The Liquid access expression and customer view are illustrative, not verified store templates. Five regression groups and dedicated browser QA are added; Phase 3 source/build passed in run 45949064306, browser checks were still running at the start. Exact-head verification pending.

## Phase 5 — executable security laboratory

The standalone security model executes real Web Crypto HMAC-SHA256 signing and verification with a deliberately public fixture key, including a byte-level tamper test. The 16 choices across four flows model accepted/rejected webhooks, OAuth callback HMAC, state and cookie matching, virtual 600-second expiry, replay before code exchange, example scope verification, masked offline grant, Basic and Bearer header comparison. OAuth/KV are in-memory examples: no actual install, cookie, token exchange, distributed storage, production scopes, persistent replay protection or network request occurs. The earlier lifecycle authentication remains a simulated flag. GSAP animates completed selected steps only. Four test groups and dedicated desktop/mobile browser QA are added. Phase 3 passed both jobs in run 45949064306; Phase 4 source/build passed in run 45949490767 with browser QA still running when work began. Exact-head verification pending.

## Phase 6 — API workbench

Eleven allowlisted fictional operations cover health, install, callback, order ETA, fulfilment, carrier tracking, admin retry, consignment creation and three GraphQL examples. The transport is in-process only. Shared scheduling, shipment, status, security and metafield helpers produce actual local results. Method, authentication, malformed JSON, business validation, upstream failure, GraphQL errors and userErrors are distinguished; mock write outputs do not persist or send messages. GET installation/callback are separate educational fixtures, not a shared real OAuth session. GraphQL documents are fixed illustrative examples and validation covers a subset of variables, not the complete provider schema. Request copy exports local JSON, not executable cURL. GSAP animates results and trace cards; reduced motion preserves all controls. Phase 4 passed both jobs in run 45949490767; Phase 5 source/build passed in run 45949948535, browser QA still running at start. Exact-head tests and preview remain pending.

## Phase 7 — physical cold-chain freight journey

Nine normal-path stages are projected from the existing local lifecycle trace. The independent view calculates an illustrative 20 kg weight split and shares regional profiles, carrier status events and app write-back data. Pickup, local (intended), gift-card and zero-weight paths stop without external freight; carrier rejection stops before handover. The SVG illustrates production, cartons, refrigerated vehicle, depot, transit, last mile and customer, without geographic routing, temperature telemetry, packing guarantees or proof of delivery. GSAP animates carton assembly, truck position and scan feedback; manual selection and static position remain available with reduced motion. Five regression groups and desktop/mobile browser tests added. Phase 5 passed both jobs in run 45949948535; Phase 6 source/build passed in run 45950402425 with browser QA running at start. Exact-head verification pending.

## Phase 8 — dynamic Liquid notifications and freight type fix

Phase 7 run 45950692426 failed TypeScript with three implicit-any event callbacks in FreightJourney; this candidate explicitly types those callbacks. Browser QA was skipped for that failed run and must be repeated. Phase 6 source/build passed in 45950402425; browser QA still running at start. The notification studio uses the repository's existing LiquidJS library to render fixed text templates from the shared local metafield snapshot. Six stages, typed boolean conversion, conditional dates/holidays/tracking, email-first/SMS fallback, virtual five-minute delay, disabled notification and failed selected tracking write are modelled. No actual Shopify template, arbitrary template evaluation, provider request, cookie, real recipient, delivery or scheduling. React renders the resulting text without HTML injection. Earlier native communication lab is preserved. Four regression groups and browser QA added. Exact-head verification pending.
