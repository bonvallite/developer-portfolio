# JRV shared colour system — 22 November 2026

**Target:** `bonvallite/developer-portfolio`, integrated draft PR #96. These are portfolio changes, **not** Shopify theme changes. Do not merge or deploy production until approved.

## Canonical brand tokens

| Purpose | Hex | Usage |
| --- | --- | --- |
| Obsidian | `#0B1419` | Dark page background and high-contrast anchors |
| Deep teal surface | `#122B34` | Cards, panels and system diagrams |
| Electric teal | `#38C7BC` | Navigation, system progress, evidence and linked headings |
| Light teal | `#8CE3DA` | Supporting emphasis and hover states |
| Ember orange | `#F28C52` | Primary calls to action, active decisions and keyboard focus |
| Light ember | `#FFB58B` | Primary hover and highlighted interfaces |
| Light foreground | `#EAF4F3` | Text over dark surfaces |
| Muted foreground | `#A9C1C3` | Secondary metadata |

The canonical values are declared as CSS custom properties in `app/globals.css`. Sitewide action colours are retained by route-scoped styles where appropriate. Distinct semantic danger/success states remain legible rather than turning every illustration into one colour.

## Coverage

The uniform palette is applied to the global navigation/footer, cinematic homepage, four indexed Shopify service routes, analytics extraction case study, CSS Lab, B2B demo, Python automation, privacy notice, Spend & Save baseline, cinematic B2B baseline and final presentation, and the Eve Curls architecture illustration. The modern Analytics Lab, CartonCloud studio, gift reward visual layer, contact consent widget and homepage project workbench already used the selected teal/ember treatment and are preserved.

The `/resume` gallery uses the common dark site colours and Ember action buttons, while ATS keeps its plain printed white-paper document and Classic retains its recognisable teal masthead with an Ember accent rule. The standalone editorial storefront is intentionally a lighter ecommerce composition, now with cool paper, dark-teal anchors and Ember interactions, rather than a full dark portfolio frame. Sample photographs are not recoloured, and no interactive demo's prices, numbers, state, API behaviour, SEO copy or filenames change.

The exact approved `{JRV}` 64×64 favicon artwork is retained: only its indexed PNG palette changes from legacy gold/charcoal to teal/obsidian. Its IDAT pixel index data and tRNS alpha transparency remain byte-identical to the prior version; all PNG chunk CRCs were verified.

## Validation and release gates

- A source regression checks canonical tokens, primary conversion styling, legacy-gold removal in active presentation files, unchanged résumé layouts and the favicon's PNG structure/palette.
- A local Chrome browser suite visits 19 representative routes at 1366px and 390px, checks one H1, overflow, runtime errors, privacy/no optional analytics before consent, and selected computed accent colours. It creates viewport screenshots for human review.
- Existing CI still exercises all four interactive studios, consent, SEO/public-safety tests, responsive behaviour, TypeScript, Next build, and synthetic performance samples.
- Review screenshots, browser-tab/favicon appearance at 16px/32px and both résumé PDF/Word renders after the final commit. Automated colour matching cannot certify aesthetic quality, legibility on actual devices or WCAG colour contrast on every component.
- The already-published original résumé PDF retirement hotfix (`main` `ecf8e5ad`) must be retained during PR #96 reconciliation, and no private or legacy résumé asset may be reintroduced.
- Explicit production-release approval and GTM/Clarity configuration review remain separate.

