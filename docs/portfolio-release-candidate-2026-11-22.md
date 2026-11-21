# JRV cinematic release candidate — 22 November 2026

**Repository:** `bonvallite/developer-portfolio`  
**Base:** `main` `ac519c363bb303249adc911d0600679857df4a8d`  
**Integration branch:** `integration/2026-11-22-cinematic-release`  
**Status:** Draft, **not merged to production**.

## Scope and exact provenance

This combines the reviewed project-specific Git blobs from existing source PRs. It is a validation snapshot, not new implementation work or a Shopify theme deployment.

| PR | Subject | Reviewed commit |
| --- | --- | --- |
| #83 | Homepage journey accessible live announcement and keyboard regression | `cee90ace0d9ad49d2d470beef837e8e984dd2051` |
| #92 | Shopify–CartonCloud failure-aware event studio and integration enquiries | `cc5a2b78c4e0a2ede34605fc22a3b0614050556c` |
| #93 | Python Analytics source explainer, fictional dashboard and client/hiring paths | `2dcbbadd3593e4b117ee03a79b913362a8cc5967` |
| #94 | Shopify B2B entitlement inspector and legible mobile contexts | `72b624f960e968d8941e5965c28e9c705aadec7b` |

The combined tree intentionally preserves all other files from main, including SEO/security checks, consent rules, existing interactive Spend & Save, résumé files and source-publication safety logic.

## Shared CI reconciliation

Instead of overwriting `.github/workflows/portfolio-ci.yml` with any PR's older copy, all individual browser checks are enabled for this integration branch: general case-study, homepage accessibility, Spend & Save, CartonCloud normal/failed event scenarios, Python Analytics Lab, B2B entitlement, and consent-first privacy tests. Existing unit, Python, TypeScript, build, SEO and public-safety checks are preserved. Desktop/tablet/mobile screenshots are collected from the relevant test artefact paths.

## Preview acceptance gates

- [ ] GitHub Actions are green **on the integration SHA** and actually run all seven browser test commands.
- [ ] An exact-commit Vercel preview is READY and displays all four changes together.
- [ ] Review all desktop, tablet and 390px phone screenshots, keyboard focus, mobile menu, reduced-motion and route navigation.
- [ ] Verify normal and failure simulation states, two-column fictional B2B options at phone width, Python synthetic CSV and contact links.
- [ ] Verify public source safety, fictional-data disclaimers, metadata, sitemap, production canonicals and consent opt-out.
- [ ] Measure actual page speed/Core Web Vitals before asserting a performance improvement.
- [ ] Review any personal contact details, private code history, customer/order records and third-party implementation rights before public publication.
- [ ] Obtain explicit release approval before merging to main or changing production aliases.

Automated browser checks do not independently certify spoken screen-reader announcements or real device interactions. Vercel preview availability does not prove measured performance. Do not release this draft if any check fails.

## Merge handling

The aggregate PR is offered as **one optional release target**; do not merge both the aggregate and individual PRs as duplicate changes. Preserve the individual PRs and their commit history for review. Release coordination and previous stop point are documented in issue #95.
