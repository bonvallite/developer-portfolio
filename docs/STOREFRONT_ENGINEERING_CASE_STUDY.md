# Brand-neutral Shopify storefront engineering lab

**Updated:** 24 November 2026
**Status:** Draft, unpublished
**Route:** `/projects/storefront-engineering`

## Purpose
An original fictional storefront demonstrates the full content-to-commerce journey: hero, information-led content, shopping discovery, product details, delivery guidance and technical implementation.

## Interactive experience
- Hero and responsive storefront shell, plus a local mega-menu state.
- Product options are fictional and do not add items to any cart.
- Discovery-to-purchase journey: discover, understand, explore, decide.
- Behind-the-interface tabbed examples of Liquid schema, CSS and JavaScript. All examples are newly authored educational samples, not production theme code.
- Postcode input validates only the four-digit format. It never claims delivery eligibility.
- Six engineering skills connect interface design to reusable theme architecture, accessibility, integrations, debugging and release practices.

## Brand and privacy boundaries
No real merchant name, logo, products, campaign assets, customer records, proprietary file paths, Figma frame references, actual pricing, performance claims, internal order data, credentials or production shipping zones appear in the public page. This is a portfolio lab, not a live merchant or a fully working checkout.

## Architecture and maintenance
Page: `app/projects/storefront-engineering/page.tsx`.
Metadata: `app/projects/storefront-engineering/layout.tsx`.
Styles: `app/projects/storefront-engineering/storefront-engineering.css`.
Source checks: `tests/storefront-engineering-source.test.mjs`.

Reuse the maintained `--jrv-*` palette. Avoid new colour tokens or external image services. Keyboard, responsive and reduced-motion requirements apply. No Shopify theme was edited.

## Validation required
Run `npm test`, `npm run check:safety`, `npm run build`, and desktop/mobile browser QA at 320, 390, 768 and 1366 pixels. Check tab selection, menu disclosure, focus visibility, input feedback, SEO and source-safety boundaries. GitHub commits alone do not establish that these checks passed.

## 24 November 2026: homepage discovery and test alignment
The homepage selected-work footer now links to this lab without replacing existing case studies or storefront gallery entries. Source assertions check the brand-neutral page, tabbed code samples and information-led section. Build, CI and visual QA remain pending.

## 24 November 2026: interactive architecture and journey diagrams
Added a five-node keyboard-selectable architecture diagram and a five-stage customer shopping workflow. Both are fictional educational models using local React state, `aria-pressed`, JRV design tokens and responsive CSS. The diagram is not an extracted client architecture, and the purchase stage does not initiate checkout. Source assertions cover presence of diagrams and selection states. Runtime/browser/build validation pending.

## 24 November 2026: component-to-code explorer
Visitors can select editorial hero, navigation or product panel, switch between original Liquid/CSS/JavaScript examples and inspect a synchronised local preview. The navigation disclosure has `aria-expanded` and the product selector uses a native labelled select. The examples are educational, not executable storefront source; no cart or checkout is connected. Responsive CSS stacks the preview below code at narrow widths. Source tests updated; runtime/build/browser QA pending.

## 24 November 2026: additive homepage feature
A new full-width featured section links to the lab from the homepage after Selected Work, with a static fictional preview, technology labels and CTA. Existing case cards, their order and the eleven-site gallery are preserved. Styles live in `app/cinematic-home.css` and use JRV tokens. Build and browser QA pending.

## 24 November 2026: technical-first discovery
The `#technical-lab` entry contains four native jump links, targeting `#architecture-diagram`, `#shopping-workflow`, `#code-explorer`, and `#storefront-demo` in that order. Architecture, workflow and code now precede the storefront demo. The homepage feature and existing lab link point to the navigation. Responsive CSS uses existing JRV tokens and visible keyboard focus. Source checks verify anchor targets, order and homepage link. Previous commit `1da5b550` passed CI workflow #542 and Vercel; the revised layout requires fresh checks and direct visual review. Existing case studies and gallery are unchanged.
