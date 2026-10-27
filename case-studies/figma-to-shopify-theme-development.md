# Figma to Shopify Theme Development

**Case study:** Peter Augustus Craft Butcher  
**Discipline:** Shopify Online Store 2.0, theme engineering, design-to-code implementation  
**Design reference:** [Peter Butcher – Projects, Figma designs (node 35:1666)](https://www.figma.com/design/p1nQmV8caeOoDIxBi9M9ft/Peter-Butcher---Projects?node-id=35-1666)

## Overview

I translate Figma layouts into responsive, maintainable Shopify storefront experiences, from homepages and collection templates to product pages, promotional campaigns, and dedicated landing pages. My approach connects visual design with real Shopify commerce requirements, rather than merely reproducing a static mock-up.

## What the supplied Figma design demonstrates

The reviewed Figma design contains a desktop homepage variant organised into named modules, including:

- Announcement bar and header
- Hero content, calls to action, and brand/trust seals
- Product discovery grid with reusable product cards
- Weekly-deals promotional section
- Side-by-side Wagyu marbling comparison
- Brand provenance and educational content

These are **design reference elements**, not independent proof that each element is already deployed in the live theme. Implementation status, mobile parity, and production results must be verified separately.

## How I convert designs into Shopify

1. **Audit the design:** Examine section structure, typography, spacing, imagery, assets, interactions, and desktop/mobile requirements. Identify where designs need an implementation decision.
2. **Map designs to Shopify:** Decide whether each feature belongs in a theme section, section block, snippet, template, metafield, metaobject, or a Shopify-native feature.
3. **Build reusable storefront components:** Implement semantic HTML, accessible CSS, Liquid rendering, and focused JavaScript. Preserve Theme Editor flexibility with section schema settings and sensible defaults.
4. **Connect live commerce data:** Use product and collection objects, catalogue availability, dynamic pricing, inventory state, merchandising settings, and navigation rather than hard-coded mock data.
5. **Support responsive experiences:** Adapt layout, imagery, controls, and content hierarchy for desktop, tablet, and mobile, including touch interactions where appropriate.
6. **Validate before release:** Compare the rendered implementation with Figma, test keyboard access and interactions, check cart/collection behaviour, and assess loading performance, SEO, and layout stability.
7. **Document and release safely:** Review existing theme code and documentation before edits. Keep inline documentation current and record all applicable theme changes, reasons, affected files, and validation in `pa-theme-changelog`.

## Types of pages I develop

| Shopify experience | Typical implementation |
| --- | --- |
| Homepage | Editorial hero, featured ranges, product cards, offers, trust content, and brand storytelling |
| Collection page | Collection-led templates, merchandising grids, filtering/sorting, and responsive product cards |
| Product page | Product information, variants, media, subscriptions or purchase options where applicable, and cart interaction |
| Campaign or landing page | Reusable, configurable promotional sections and campaign-specific content |
| Brand or educational page | Provenance, comparison modules, rich content, and conversion paths |

## Engineering priorities

**Design fidelity + merchant usability + storefront performance.** I aim for a close visual match without sacrificing accessibility, maintainability, real Shopify data, or Core Web Vitals.

**Technologies:** Figma, Shopify Liquid, JSON templates, Shopify Online Store 2.0 sections and blocks, HTML, CSS, JavaScript, GitHub, and performance/QA tools.

## Evidence and boundaries

This document describes my Figma-to-Shopify implementation capability using an actual Peter Augustus Figma project as a **design reference**. It does not claim the entire referenced Figma file is implemented, pixel-perfect, approved, or published. Before presenting a particular page as a completed before-and-after project, include screenshots of the live implementation and verified acceptance results.

**Portfolio positioning:** *I bridge design and commerce engineering, converting Figma concepts into configurable Shopify experiences that support marketing, merchandising, and growth.*
