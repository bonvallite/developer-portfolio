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
