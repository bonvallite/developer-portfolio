# Editorial storefront homepage: interactive portfolio demo

**Status:** independently written, public-safe demonstration (22 October 2026)

## What this demonstrates

A **single homepage** showing how a conventional Shopify Online Store 2.0 theme can be elevated with editorial design thinking and accessible, interactive UX. The creative brief reflects experience translating Figma layouts into production Shopify theme components, but this demo is an original Next.js/React interpretation, **not** a copy of a live client's site, design file, theme source, product catalogue or branding.

The concept brand is **Ember & Grain**. All copy, products, prices, reviews (none included), sample service locations, and behaviour are fictional. Photographic backgrounds refer to public Unsplash-hosted images and are *not* from the client's website. If an image cannot load, its container keeps a gradient/background colour. The portfolio demo does not make commercial transactions.

## Explore the demo

- Route: [/editorial-homepage-demo](../../app/editorial-homepage-demo/page.tsx) (on the portfolio's deployed domain)
- Source: [React/TypeScript homepage](../../app/editorial-homepage-demo/page.tsx)
- Styles: [responsive, scoped CSS module](../../app/editorial-homepage-demo/demo.module.css)

Only the homepage is implemented. There are no customer accounts, product detail pages, checkout, live catalogue APIs, or extra store pages.

## Interaction map

| Area | Behaviour | Production boundary |
| --- | --- | --- |
| Storytelling hero | Three manually selectable story panels; accessible buttons, stable dimensions | Mock headlines and stock photography |
| Shop by occasion | Four visual panels filter the collection and scroll to discovery | All groupings are invented |
| Product browse | Filter tabs, sample prices, quick add | No Shopify Admin or Storefront API |
| Demo bag | Add, remove, quantity changes and demo subtotal; keyboard focus containment, Escape close and focus restoration | No checkout, fulfilment, payments or local persistence |
| Marbling explorer | Accessible range input, semantic score descriptions | Educational illustration, not product grading data |
| Delivery reassurance | Four sample postcode responses; validation and live announcements | No real delivery eligibility, prices, service promises or logistics logic |
| Responsive navigation | Mobile menu and in-page anchors | No copied theme navigation schema |

## Design and engineering approach

**Problem:** an off-the-shelf storefront can feel transactional when products, navigation, brand story and purchase reassurance compete for attention. Heavy interactions or layout-shifting assets can also undermine the mobile experience.

**Solution:** a bespoke editorial layer with an immersive, fixed-height storytelling hero; clear mobile-first browsing paths; art-directed product cards; purposeful interaction; large but controlled image regions; responsive layouts; stable card geometry; keyboard-friendly native controls; and reduced-motion support. Design, conversion journey and performance requirements are considered together.

**Architecture:** one client-side React component handles local UI state, and one CSS Module scopes all presentation to the route. Data is defined in small typed arrays. No tracking identifiers, secrets, credentials, third-party scripts, Shopify tokens, API endpoints, or client resources are required. This is intentionally a standalone React demonstration, not a release-ready Shopify Liquid section.

For an actual Shopify implementation, editable section blocks and structured metafields/metaobjects would make story panels and merchandising content maintainable without hardcoding. This paragraph describes a recommended pattern, **not** a claim that the prototype uses that production architecture.

## Core Web Vitals: supplied production benchmark

On 22 October 2026, the author supplied the following **28-day real-user field measurements** for a production storefront. They are presented anonymously and **are not performance results for this React demo**. The assessment was reported as **Passed** on both device groups.

| Field metric | Mobile | Desktop |
| --- | ---: | ---: |
| Largest Contentful Paint (LCP) | 1.8 s | 1.8 s |
| Interaction to Next Paint (INP) | 153 ms | 80 ms |
| Cumulative Layout Shift (CLS) | 0.01 | 0.02 |
| First Contentful Paint (FCP) | 1.6 s | 1.4 s |
| Time to First Byte (TTFB) | 0.5 s | 0.4 s |
| Core Web Vitals assessment | Passed | Passed |

**Evidence and claim limitations:** these values were supplied by the project author rather than independently re-measured for this portfolio build. They are not proof of a pre/post improvement, a head-to-head comparison with Canopy, an audit of this demo, or a causal attribution to a particular frontend change. The desktop figures were described as the latest 28-day period.

## Quality-assurance checklist

- [ ] Open the live demo at 360px, 390px, 768px and desktop widths; check scrolling and absence of horizontal overflow.
- [ ] Verify all three hero controls and their text updates.
- [ ] Test each occasion panel and all five collection tabs.
- [ ] Add two products, change quantities, remove both and confirm the subtotal.
- [ ] Enter invalid postcodes and all four fictional valid postcode examples.
- [ ] Navigate with keyboard and check visible focus on controls.
- [ ] Enable reduced motion and verify animation is disabled.
- [ ] Run repository safety guard, TypeScript, existing tests and a Next.js production build.
- [ ] Run Lighthouse **on the actual deployed demo** before making claims about its performance.

## Publication and ownership safeguards

This showcase deliberately avoids the client's trading name, URL, branding, logos, imagery, theme code, Figma files, product data, shipping conditions, metaobject definitions, conversion figures or private internal configuration. **Do not replace the fictional assets with production content without an explicit ownership and publication review.** Real-world styling and results are described only in general terms.

No existing Shopify theme was edited as part of this demo. Shopify-theme-specific change log obligations remain applicable to any later actual theme edits.
