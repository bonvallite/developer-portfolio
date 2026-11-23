# Storefront engineering case study

**Date:** 24 November 2026
**Status:** Draft feature branch, not a production release
**Route:** `/projects/storefront-engineering`

## Purpose
Explain the engineering work behind a Figma-led Shopify Online Store 2.0 customisation, using an original educational interface. The public demonstration is not a copy of client theme files.

## Source audit and scope
A read-only inspection of Peter Augustus theme 139265507536 confirmed `templates/index.json`, `sections/pa-home-hero.liquid`, `sections/header.liquid`, `assets/pa-layout.js`, `assets/pa-layout.css`, `templates/product.pa-build.json`, `sections/pa-main-product.liquid` and `sections/pa-home-delivery.liquid`. The homepage template contains fifteen ordered sections. The header source documents its use of original theme header hooks and the replacement of prior Globo menu output. The PDP template contains nested gallery, beef-education, purchase and information blocks.

These findings are architectural observations, not a full accessibility, production-performance or business-results certification.

## Public demonstration
- Homepage: static fictional editorial hero, no remote image or video.
- Mega menu: interactive open/close state with a simplified two-column structure.
- PDP: locally selected fictional portion size, no cart or pricing API.
- Delivery: four-digit input and explicit non-eligibility response. No postcode, rate or date claims.
- Architecture: five stages and four inspected file-family mappings.

## Privacy and ownership
No production theme source, actual customer records, credentials, unpublished assets, internal Figma URLs, pricing tables, revenue metrics, webhooks, shipping zones or order details are embedded. No new analytics calls, third-party images or checkout actions. The public project credits the technical work without claiming sole design ownership or endorsement.

## Follow-up verification
Run `npm test`, `npm run check:safety`, `npm run build` and the repository's browser QA. Review keyboard interaction, 320/390/768/1366px layouts, reduced-motion behaviour, SEO metadata, visual fidelity, contact routes and privacy boundaries. Only then consider a production merge.

## Maintenance
Styles use the existing `--jrv-*` palette; any future token changes must be made in `app/globals.css` and recorded in `docs/JRV_DESIGN_SYSTEM.md`. This page does not change Peter Augustus themes or `pa-theme-changelog`.
