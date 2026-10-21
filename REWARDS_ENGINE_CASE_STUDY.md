# Configuration-led rewards: one source for many customer touchpoints

An independently authored **public portfolio demonstration**, inspired by general Shopify engineering practice. The implementation is **not an export of any employer's store**, promotion, workflow, theme or cart integration. All thresholds and rewards are fictional.

## One developer. One connected commerce experience.

**Role:** End-to-end e-commerce engineer — analytics, conversion strategy, UI/UX design, Shopify development, integration engineering, testing and documentation.

**The challenge:** A promotion is not one banner. It follows a customer from the homepage to a product card, collection page, seasonal landing page, cart and checkout. When each surface holds its own amounts, gift labels and terms, every campaign change becomes a checklist: update the header, update templates, update the cart, verify shipping, verify fulfilment, then hope no message was missed. Third-party cart technology adds another layer of complexity. Inconsistent messages weaken trust precisely when the shopper is deciding whether to add more.

**My approach:** I worked backwards from a commercial question — *how can we make the next meaningful reward visible at the moment of purchase, while making future campaigns easier to maintain?* — and designed a configuration-led rewards architecture. One structured offer provides the editorial truth; each storefront surface translates that data into the right experience for its context. Instead of hardcoding an amount or a product name into every banner, a merchandising edit can update all connected presentation surfaces.

**What I bring to the table:** I do not stop at spotting a conversion leak or designing a mock-up. I can trace the underlying technology, model the data, write the Liquid and JavaScript, integrate with a third-party React-rendered cart without replacing its transactional logic, coordinate Shopify Flow fulfilment rules, review analytics, test edge cases and leave maintainable documentation behind. This joins commercial judgement with implementation detail.

### Problem → solution → engineering capability

| Disconnected problem | Engineering solution | Capability shown |
| --- | --- | --- |
| Reward thresholds and wording repeated across pages | Define typed, editor-managed metaobject values; render shared content through Liquid | Shopify custom data, schema design, Liquid |
| Header, product-card promo placements, collections and campaign pages risk disagreeing | Reuse one offer reader and context-appropriate display blocks; confirm each placement is actually wired before claiming coverage | Online Store 2.0 sections, templates, HTML/CSS, responsive UI |
| Shoppers cannot see what a slightly larger basket would unlock | Calculate exact spend remaining and display a progressive reward rail | JavaScript state modelling, UX, conversion strategy |
| The visible cart is owned by a third-party React application | Enhance its open Shadow DOM with narrowly scoped styles, stable hooks, mutation handling and graceful fallback | Browser debugging, Shadow DOM, JavaScript, integration resilience |
| Cart reward messaging is mistaken for gift delivery | Keep shopper-facing qualification separate from authoritative order-level gift fulfilment | Shopify Flow, order lifecycle, idempotency safeguards |
| Shipping and reward wording may disagree with checkout | Validate discount, postcode and subscription rules independently; check consistency on every offer change | Cross-system troubleshooting, Shopify shipping and checkout reasoning |
| Campaign decisions are made without evidence | Review channel-level AOV, basket thresholds, conversion and reward costs; separate trends from causation | ShopifyQL, analytics interpretation, commercial analysis |
| Small changes are difficult to maintain safely | Use isolated development, documented change history, boundary tests and release checks | Git/GitHub, QA, regression testing, Vercel/CI practices |

### How the system is managed

1. **Define** a structured offer: enabled state, milestone values, reward copy, short messaging and terms. Typed fields reduce the chance of invalid updates.
2. **Change** the relevant amount or reward description once in the agreed editorial configuration.
3. **Read** the same values through reusable Liquid readers for supported theme surfaces and safe configuration passed to the cart enhancement.
4. **Render** each touchpoint appropriately: compact homepage/header messaging, product-card or collection callouts where integrated, seasonal landing content and an interactive cart-progress rail.
5. **Enforce and verify** gift and shipping eligibility using their separately owned Shopify Flow/discount rules. These rules are **not automatically rewritten by an editorial metaobject change** in this documented approach.
6. **Measure** the behaviour with Shopify Analytics. Track Online Store AOV, threshold attainment, order mix, conversion and gift contribution, and evaluate a post-release period before claiming uplift.

**Important implementation boundary:** The observed storefront implementation connects several theme messaging surfaces and a third-party minicart to centrally managed offer values. Additional product-card placements and checkout UI would require their own integration and verification. The minicart is the *pre-checkout* experience; it is not the Shopify checkout. A future fully synchronised system should add verified automated reconciliation for backend Flow and shipping rules, rather than claiming changing a metaobject alone currently changes fulfilment.

### End-to-end delivery, not isolated tasks

I approached the work as a complete problem-solving cycle: investigate customer and operational friction → assess the data → design the mock-up → identify technology ownership → structure the configuration → implement responsive Liquid/JavaScript interfaces → integrate safely with the app-rendered cart → validate fulfilment boundaries → document and test → measure outcomes.

The maintainability benefit is immediate: connected **storefront copy and milestone displays** no longer require independently hardcoding every value. The business effect is the hypothesis to evaluate: clearer next-reward messaging may motivate a larger basket. Historical AOV trends on the real project were favourable before this particular cart-progress release; they are **not proof that the new ladder caused growth**.

**Portfolio positioning:** *I combine the analytical mindset of a conversion specialist, the visual judgement of a UI/UX designer and the implementation depth of a Shopify engineer. I can own the journey from problem discovery to a tested, maintainable solution — and I know how to distinguish an impressive interface from a commercially proven result.*

## Problem and goal

When promotional content is separately maintained in announcement bars, product collections, campaign landing pages, an app-owned minicart, checkout messaging, Shopify Flow and delivery discounts, values and claims can drift. That makes a campaign costly to maintain and can confuse shoppers. The design goal is one editorial configuration for every customer-facing message, while retaining authoritative enforcement in checkout, gift fulfilment and shipping logic.

## Data model (illustrative)

A single Shopify metaobject might expose:
- `enabled` — boolean
- `gift_threshold`, `shipping_threshold`, `bonus_threshold` — positive numbers, strictly ascending
- `gift_label`, `bonus_label`, `short_line`, `terms` — edited content
- `offer_link` — optional URL

The real demonstration does **not** query Shopify: [`lib/rewards-engine.mjs`](lib/rewards-engine.mjs) provides a fictional static object that the interactive page can edit locally.

```mermaid
flowchart TD
    A[Offer configuration] --> B[Liquid theme presentation]
    A --> C[JavaScript cart reward states]
    B --> D[Homepage announcement]
    B --> E[Collection and campaign pages]
    C --> F[React-owned minicart enhancement]
    G[Authoritative checkout and fulfilment rules] --> H[Gift additions after checkout]
    G --> I[Eligible shipping discount]
    A -. validated synchronisation needed .-> G
```

## Why distinct layers matter

**Liquid:** Reads storefront-visible structured data and renders theme-native content with explicit empty/disabled states. Do not scatter threshold literals across multiple section schemas.

**JavaScript:** Reads the current subtotal, derives unlocked milestones and next-reward messaging from configuration, and interpolates across uneven threshold distances without changing qualification logic.

**Third-party React cart:** Treat the cart as app-owned. For an *open* ShadowRoot, discover the existing drawer, attach scoped style/data hooks, observe relevant rerenders, and insert the progress enhancement idempotently. Keep quantity, subscription, totals and checkout operations with the app. Never attempt to cross a closed ShadowRoot.

**Shopify Flow:** Gift fulfilment is a different responsibility from storefront messaging. A post-checkout workflow should independently re-evaluate eligible orders, exclude gifts from spend as required, apply zero-priced gifts through authorised platform actions, and guard against duplicate execution. The exact trigger and actions depend on the real shop setup; they are **not implemented in the demo**.

**Delivery discounts and checkout:** The marketing milestone alone does not grant delivery eligibility. Shipping qualification must be implemented and enforced by the Shopify discount/rate rules for the applicable region, basket and subscription context. Checkout extensions are a distinct supported surface and cannot be assumed to share theme Liquid.

## Demo and test coverage

- [Interactive simulator](/rewards-engine) — independently authored Next.js presentation with editable synthetic offer, homepage, collection and minicart previews.
- [Reward engine](lib/rewards-engine.mjs) — pure JavaScript with offer validation, next milestone, remaining spend and visual progress.
- [Boundary tests](tests/rewards-engine.test.mjs) — exact thresholds, invalid/disabled configuration, changed values and negative spend.
- [Third-party cart development history](THIRD_PARTY_CART_HISTORY.md) — public-safe engineering lessons about Shadow DOM, hydration, scoped hooks, fallback and QA.

## From mock-up to maintainable operation

1. Map all consumer touchpoints and identify their owning technologies.
2. Model the reward offer as typed, editor-friendly structured content.
3. Prototype dynamic homepage, collection, campaign and cart copy.
4. Preserve app-owned React and checkout behaviour.
5. Keep editorial messaging and fulfilment decisions separate, with explicit synchronisation checks.
6. Test at the threshold boundaries; QA mobile, cart reopening, subscription changes, exclusions and failure fallback.
7. Use analytics to assess AOV, threshold attainment, qualifying orders, gift cost, net contribution and checkout completion. Do not claim uplift without an agreed baseline and attributable evidence.

## Publication boundaries

No real gift product identifiers, store or theme IDs, private Flow exports, client code, private customer/order data, credentials or unapproved commercial results are included. This demo does not change a live Shopify theme, order, delivery rate, or third-party cart.
