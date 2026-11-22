# JRV Design System

**Maintained document:** `docs/JRV_DESIGN_SYSTEM.md`  
**Version:** 1.2, established 22 November 2026; updated with first-screen audience journeys  
**Repository:** `bonvallite/developer-portfolio`  
**Release status:** Draft PR #96. This palette is not on the production `jrvallite.com` website until the PR is separately approved and published.

This is the permanent design reference for **future JRV portfolio UI, styling, branding, component, and favicon changes**. Update this document when the design system changes. Do not create a new date-stamped palette file as a substitute for updating this guide.

**Scope:** JRV portfolio only. Peter Augustus Shopify themes have a separate brand, private codebase, and `pa-theme-changelog`. Never apply JRV colours to those themes merely because they appear here.

## Canonical palette and source of truth

The `:root` CSS custom properties in `app/globals.css` are the **runtime source of truth**. The table below is the **human-readable source of truth**. Both must match in the same commit. `tests/portfolio-palette.test.mjs` checks the synchronisation.

| CSS token | HEX | Purpose |
| --- | --- | --- |
| `--jrv-bg` | `#0B1419` | Obsidian page background, dark text on primary actions |
| `--jrv-surface` | `#122B34` | Cards, surface panels, navigation and system diagrams |
| `--jrv-teal` | `#38C7BC` | Electric teal: system progress, technical highlights, hyperlinks |
| `--jrv-teal-light` | `#8CE3DA` | Light teal: secondary emphasis and hover states |
| `--jrv-ember` | `#F28C52` | Ember orange: primary CTAs, active decisions |
| `--jrv-ember-light` | `#FFB58B` | Light Ember: primary hover and elevated action states |
| `--jrv-fg` | `#EAF4F3` | Primary text on dark backgrounds |
| `--jrv-muted` | `#A9C1C3` | Secondary text and supporting details |
| `--jrv-border` | `#365B63` | Borders, dividers, secondary button outlines |
| `--jrv-focus` | `#F28C52` | Visible keyboard focus indicator |

**Supporting route-specific shades:** The cinematic homepage also uses approved hover Ember `#FFAB79`. The light editorial demo uses cool paper `#EDF6F4` and dark teal `#102B35`. These are scoped supporting values, not alternative primary brand colours. Reuse `var(--jrv-*)` where possible.

## Styling rules

1. **Backgrounds and typography:** Use Obsidian, deep teal panels and readable light text on dark pages. Avoid arbitrary gold/bronze as JRV brand accents.
2. **Navigation, systems, and evidence:** Use teal for technical connections, selected system states, progress and links.
3. **Conversion actions:** Use Ember for primary buttons and conspicuous decision actions. The documented light-Ember hover state is equally valid; do not treat pointer hover as a palette inconsistency.
4. **Keyboard and mobile:** Visible focus, text contrast, 44px touch targets where applicable, reduced motion, and responsive layouts take priority over decorative styling. Colour alone must not convey state.
5. **Operational status:** Real errors and warnings must remain distinguishable from healthy/success states. Do not recolour an error as positive teal just for uniformity.
6. **Intentional light contexts:** The standalone editorial storefront is a **light ecommerce design demonstration**, not a dark portfolio page. ATS résumé uses plain white print paper; Classic uses a deep-teal masthead and Ember trim. Keep both PDF and Word downloads readable. Do not recolour user-provided photography.
7. **Brand mark:** Keep the owner-approved 64×64 indexed `{JRV}` artwork. A palette edit must preserve the approved shape, pixel indices, and corner transparency; verify PNG checksums, 16px/32px appearance, and the rendered icon.
8. **Case-study endings and conversion:** After demonstrating a technical system, explain what the implementation must validate, then offer a direct project-enquiry path and a separate hiring/experience path. Use route-scoped Ember/Teal controls, visible focus and mobile-sized targets. Do not imply that fictional calculations demonstrate measured commercial results or submit personal details to a new form.
9. **Homepage audience routing:** Give ecommerce businesses and hiring teams clear, distinct first-screen paths. Link to existing direct-contact and experience routes, preserve visible case-study exploration and résumé choices, and avoid inventing outcomes, new forms, or visitor tracking. Both choices need a visible keyboard focus state and at least 44px touch height; on phones they should stack rather than clip.

## Maintained file map

| Area | Relevant source and review point |
| --- | --- |
| Global visual tokens, base navigation and footer | `app/globals.css` |
| Cinematic homepage and shared component accents | `app/page.tsx`, `app/cinematic-home.css`, `app/components/commerce-workbench.css`, `app/components/consent-manager.css`; verify the client/hiring first-screen paths |
| Shopify service routes | `app/components/cinematic-service.css` |
| Analytics, B2B, and CartonCloud case studies | `app/analytics-lab/*.css`, `app/b2b-modernisation/*.css`, `app/cartoncloud-integration/*.css` |
| Spend & Save and data pipeline | `app/projects/spend-and-save/page.tsx`, `app/projects/spend-and-save/*.css`, `app/data-extraction-automation/*`; inspect the project/hiring closing panel |
| CSS Lab and editorial storefront | `app/css-lab/css-lab.module.css`, `app/editorial-homepage-demo/demo.module.css` |
| Résumé gallery and exported documents | `app/resume/resume.css`, `app/resume/resume-export.ts` |
| Favicon and diagrams | `app/icon.svg`, `public/portfolio/eve-curls-markets.svg` |
| Automated checks | `tests/portfolio-palette.test.mjs`, `tests/portfolio-palette-browser-qa.mjs`, CI in `.github/workflows/portfolio-ci.yml` |
| Documentation | This guide, `README.md`, `CONTRIBUTING.md`, `ENGINEERING_STANDARDS.md`, `CHANGELOG.md` |

This map is not exhaustive. Always inspect the actual affected files and comments.

## Required process for every future visual update

1. **Read before editing:** This living guide, the current `CHANGELOG.md`, the affected CSS/JSX/SVG, existing inline comments, and current release status.
2. **Apply the shared palette:** Reuse existing tokens. If changing a canonical token or adding one, update `app/globals.css` and its matching table row **in the same commit**. If changing a scoped exception or usage rule, update its explanation here.
3. **Update documentation as part of the change:** Amend relevant rules and file-map entries here, add a dated entry under **Design-system history**, update affected inline code comments, and add a dated repository `CHANGELOG.md` entry describing the reason, affected files, validation, and release status. Preserve old records.
4. **Check functionality and accessibility:** Run `npm test`, `node scripts/check-public-safety.mjs`, `npx tsc --noEmit`, and `npm run build`. For UI changes, run the existing GitHub Chrome desktop/mobile browser suite, review screenshots, and check focus, hover, contrast and reduced motion.
5. **Publish only after approval:** A READY Vercel preview is not a live release. Confirm the intended branch, keep the approved original-résumé retirement intact, and obtain explicit approval before merging or changing production.

**Automatic drift protection:** `npm test` verifies each `--jrv-*` CSS token against the matching documented HEX code below and verifies that developer guidance links to this file. A colour change to `app/globals.css` without a corresponding update here fails the test. Human review remains necessary for visual quality and use of route-scoped exceptions.

## Design-system history (maintained)

| Date | Version | Decision and affected areas | PR / verification / release |
| --- | --- | --- | --- |
| 22 November 2026 | 1.0 | Establish Obsidian / Electric Teal / Ember; document ten canonical CSS tokens, allowed light contexts, favicon and contribution policy. | Draft PR #96, initial palette commit `c6950c48`, responsive CI `ff7e05de`. Not published. |
| 22 November 2026 | 1.1 | Establish a shared conversion-story ending: scope and evidence boundaries, direct project enquiry, and a separate hiring path. First use on Spend & Save, without new brand tokens or visitor tracking. | Draft PR #96; exact-commit source and responsive browser checks required. Not published. |
| 22 November 2026 | 1.2 | Replace generic hero proof badges with first-screen goal-led client and hiring links; sharpen Shopify, B2B, Python and Cloudflare capability copy. No new site-wide colour tokens. | Draft PR #96; exact-commit GitHub and mobile/desktop checks pending. Not published. |

**Next design-system change:** add a new row with the actual date, version, affected tokens/routes, reason and PR/commit. Update the current table, source comments and `CHANGELOG.md` as needed. Never overwrite the historical row.

## References

- [Dated palette implementation and QA record](jrv-brand-palette-2026-11-22.md), retained as historical evidence rather than the maintained guide.
- [Engineering standards](../ENGINEERING_STANDARDS.md), [contribution guidance](../CONTRIBUTING.md), and [release coordination](portfolio-release-candidate-2026-11-22.md).
