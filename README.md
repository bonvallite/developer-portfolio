# Shopify Commerce Engineering | Developer Portfolio

## 23 November 2026: mobile privacy and contact accessibility (published PR #103)

JRV v1.14 moves the first-visit consent notice into normal document flow above the page at screen widths up to 800px. It does not hide merchant or recruiter contact choices, while the persistent Privacy choices button stays reachable near the viewport bottom with a safe-area allowance. A labelled heading, Escape dismissal without consent, and keyboard focus restoration improve access when reopening preferences. Optional GTM, Clarity and Vercel Analytics still load only after explicit acceptance. No consent is inferred from Escape or navigation; no new tracker, lead form or client data is introduced. Existing JRV colours, 11 sites, published demos, email contact paths, canonicals and resume access are preserved.

After inspecting the first Chrome captures, the mobile settings pill is also hidden while the full consent notice is expanded, preventing a redundant floating control over the first-screen headlines. When the notice closes, the pill returns; the closing contact disclosure reserves clearance, and the optional case-study dock sits above it. Consent and vendor loading semantics are unchanged.

The change was **approved and merged through PR #103** as `ae92409`. It is documented in [Enquiry Journey](docs/ENQUIRY_JOURNEY.md) and the maintained [JRV Design System](docs/JRV_DESIGN_SYSTEM.md) v1.14. [GitHub Actions 45100658874](https://github.com/bonvallite/developer-portfolio/actions/runs/45100658874) passed source, build and full Chrome browser checks at 320px, 390px, 768px and 1366px, including keyboard focus and opt-in boundaries. Exact-head Vercel preview `dpl_FVu6qw5M86JCfTPshev6roeKcDTR` READY; production deployment `dpl_6HpFimqrgbTKW8tJi6oavZ1cnGWf` READY on www and apex; post-merge source validation `45103204365` passed. This does not validate third-party analytics retention, real lead conversion or legal compliance.

## 23 November 2026: hiring and merchant enquiry journey (published PR #102)

The published release separates merchant projects from hiring enquiries on the four shared Shopify service pages, adds two accessible contact-choice cards, and lets the Experience page route hiring teams into the existing homepage composer using only the fixed, non-identifying `?intent=hiring` marker. It also corrects outdated screenshot-service copy on Experience. No visitor-entered brief is placed in page URLs, no external form service is added, and no contact email is sent by the site. Click analytics remains consent gated; this work does not configure GTM or GA4.

Source tests and a dedicated desktop/mobile browser suite guard both journeys; see [Enquiry Journey](docs/ENQUIRY_JOURNEY.md). JRV Design System **v1.13 is published** without any colour-token or favicon changes. PR #102 merged as `ba78cd8`, and GitHub Actions `45096347418` passed both source and full browser QA before Vercel production `dpl_8biWWYLeNYHi4n7txq9KmuVdF47X` reached READY with both domains assigned. The v1.12 history is retained.

## 23 November 2026 portfolio hardening publication (PR #101)

The production hardening release was selectively integrated atop the published Shopify App Engineering release (`44fb23d`) and merged through PR #101 as `7ec0548`, rather than merging older Draft PR #99 wholesale. It removes all client-side WordPress mShots requests in favour of 21 locally hosted WebP captures and direct live-site links for missing captures, improves the cold-chain shipping integration case study with responsive diagrams and accessible navigation, adds an original first-party JRV-branded social sharing image, and runs every browser suite on every pull request. The 11 website links, four original selected-work cards, previous CartonCloud route, and newer Shopify App Engineering showcase remain unchanged. The maintained design system is now published as v1.12, with no colour-token change.

**Release verification:** Exact-commit GitHub Actions `45084247730` passed `validate` and full browser QA on `4aa0db4`. Vercel production deployment `dpl_6FQT6JQ68gHQYg1BxrhNNMByaBs4` reports READY with `www.jrvallite.com` and `jrvallite.com` aliases. External live-page HTTP verification and actual search indexing are separate from these platform checks. Historical `draft` labels below describe the earlier versions of PRs #96 and #99 and must not be mistaken for the current published gallery or published PR #100. Dated screenshots are not proof of current storefront appearance, endorsements, or client publication rights.

Service-led portfolio covering Shopify development, ecommerce management, conversion rate optimisation, custom API integrations, and storefront performance. Public pages intentionally avoid personal-name SEO.

**For future design or colour changes:** Start with the maintained [JRV Design System](docs/JRV_DESIGN_SYSTEM.md). Read it before editing UI and update its palette, affected areas, and dated history whenever a design-system rule changes; keep the CSS tokens, inline comments and `CHANGELOG.md` in sync. The dated November palette note is evidence of the earlier rollout, not the living guide.

## Published storefronts and homepage previews (22 November 2026, draft)

The cinematic homepage now contains [Websites I've built and worked on](./app/page.tsx) at `/#websites`: **11 active public storefront references**, with direct links to every live homepage and a manually controlled gallery showing a desktop/mobile view of one selected site at a time. Peter Augustus, Eve Curls, Poseidon Animal Health and Jace Industries remain prominent examples; seven additional sites are included. The experience page retains the detailed Peter Augustus homepage case study plus the 10 other storefront references. The previously retired Skull Seeker URL stays excluded.

A real GitHub Actions capture artefact from **19 November 2026** (run `44490966868`) contains **22 successfully captured screenshots** for the active 11, with two additional failed captures for the retired Skull Seeker URL. These captures have been visually inspected as a contact sheet; some contain timed promotions or overlays and the Axlrodd desktop view is nearly empty. The import workflow excludes that incomplete image and produces smaller, dated WebP files for draft-only review. This does **not** establish client publication rights or prove that screenshots reflect current homepages. **The 21 source-checked, optimised WebP previews are now committed to the draft integration branch** as `public/portfolio/storefronts/` (asset commit `4a0d040b`). The single unsuitable Axlrodd desktop screenshot was excluded. The gallery prefers these dated local assets, falls back to lazy WordPress mShots where a local image is absent or fails, then offers a direct-live-site link. The one-time write-permission importer was removed after the import. Screenshot rights and visual suitability still require final owner approval before production. See [capture workflow and publication requirements](./docs/STOREFRONT_CAPTURE_WORKFLOW.md) for static asset approval, provenance and quality limits.

All gallery UI surfaces and the older experience-page cards now follow the maintained [JRV Design System](docs/JRV_DESIGN_SYSTEM.md) palette. No original client Liquid, customer data, financial uplift, endorsements or exclusive authorship claims are published. These changes remain on draft PR #96.

## 20 November 2026 cinematic rebuild and backup

The Git-tracked site was backed up **before editing** at branch [`backup/2026-11-20-pre-cinematic-rebuild`](https://github.com/bonvallite/developer-portfolio/tree/backup/2026-11-20-pre-cinematic-rebuild), commit `cbb656e9`. The preview rebuild lives on `redesign/2026-11-20-cinematic-portfolio` and must pass automated/visual QA before replacing production. The backup branch is public along with this repository; it is not a private archive or a backup of DNS and environment settings.

The [rebuild plan, confidentiality review and recovery instructions](./docs/portfolio-rebuild-2026-11-20.md) cover the wide CSS-first cinematic homepage, responsive project storytelling, direct enquiry composer, context-aware internal CTAs, service-led SEO and opt-in analytics. On long internal case-study routes a floating enquiry prompt appears only after scrolling; it is absent from pages with their own primary enquiry CTAs. The four canonical Shopify service routes now share a [cinematic server-rendered service page](./app/components/ServicePage.tsx) with responsive [service-page styling](./app/components/cinematic-service.css), visual process story and direct mailto enquiry CTA. Homepage and service-page screenshots are tested at desktop and mobile widths. No fictional dashboard is represented as actual client performance. A successful build does **not** certify zero data leaks, and public historical résumé/source material still requires a privacy and ownership review.

## Owner-approved retirement of the original résumé PDF (22 November 2026)

The original 2026 résumé previously existed at `public/JRV-Resume.pdf` and `backups/resumes/JRV-Resume-2026-Original.pdf` (Git blob `a7d4648238f748f625004890bb8aac4b5443915b`). With the owner's explicit approval, **both binaries are absent from the published main branch and draft integration tree**. The old URL `/JRV-Resume.pdf` permanently redirects to the résumé chooser at `/resume`, preserving old bookmarks without serving the original document. ATS-Friendly and Classic HTML previews, downloadable PDFs, and Word exports remain intentionally available, with noindex and private/no-store controls.

**Publication scope:** The owner-approved original-résumé retirement was already published through PR #97, production commit `ecf8e5ad`. The other cinematic and integration changes remain draft PR #96. The original may still be reachable in earlier commits, public backup branches, old Vercel deployments, search caches and downloaded copies. Current-tree deletion is not history erasure. Keep both approved résumé options and their contact details intact until any separate owner decision.

## Current public identity and contact

The approved public wordmark is **JRV**, matching the approved **{JRV}** browser-tab favicon in `app/icon.svg`. Shopify Commerce Engineering describes the services, not a separate brand. Do not reintroduce the former EC. monogram or publish the owner's full personal name in page metadata. The public enquiry mailbox is **hello@jrvallite.com** for both role and project requests and for privacy enquiries. Keep the `mailto:` links in `app/page.tsx` and `app/privacy/page.tsx` aligned. Historical references, repository account details, and dated documentation are not rewritten retroactively.






## Professional profiles, résumé and mailbox access (restored 19 November 2026)

At the owner's request, the public homepage footer links to the approved LinkedIn, Google Developer and Wikipedia contribution profiles, and provides a separate authorised-mailbox login shortcut at `https://webmail.jrvallite.com/`. This is a **login link**, not the public contact destination. Enquiries continue to use `hello@jrvallite.com`.

**Historical note (19 November):** The original 2026 résumé was then served at `/JRV-Resume.pdf`, restored from a historical Git object. On 22 November, the owner approved retiring its original binary from the public site through PR #97. The URL now redirects to `/resume`, but old Git objects, branches and caches may still retain the document. Keep titles and metadata service-led; do not infer that linked profiles are independent credentials or endorsements.

## Ecommerce API extraction case study

The [interactive ecommerce analytics case study](./app/data-extraction-automation/page.tsx) tells the original business brief through a cinematic CSS-only hero, a clickable six-source [pipeline visualisation and fictional reporting dashboard](./app/data-extraction-automation/visual-demo.tsx), a five-stage educational walkthrough, and an interactive Python code explorer. The new interactive mock-up changes source-specific sample data and processing stages, switches an illustrative chart period, and exports locally generated fictional CSV files. It does not call the platforms' APIs or use client/customer data. Its responsive visual styles live in [visual-demo.css](./app/data-extraction-automation/visual-demo.css). The public [sanitised source archive](./public/case-studies/ecommerce-analytics/sanitised-python-source-archive.md) includes all 17 owner-supplied Python files, with employer-specific domains, property IDs, brand filters and Windows user paths replaced by example values. It contains no tokens, credentials, raw client exports or customer records. Publishing sanitised code does not imply the scripts were independently run or every API export succeeded. The 30 planned GSC outputs include documentation-only notes, and some scripts use a rolling 365-day period rather than the required 12 full calendar months. Shopify GraphQL is a related skill, not a verified extraction method for this case. The [Python automation page](./app/python-automation/page.tsx) and [reusable workflow skill](./skills/python-automation-portfolio/SKILL.md) link to the case study. CSS motion respects reduced-motion preferences; no heavy hero bitmap, external analytics credentials or client-side API runtime is used.

## Optional analytics: explicit opt-in only

As part of the 20 November rebuild, `app/layout.tsx` no longer emits GTM, Microsoft Clarity or a Vercel Analytics component in the initial HTML. Instead [`ConsentManager.tsx`](./app/components/ConsentManager.tsx) offers **Reject optional** or **Allow analytics**, storing the visitor's preference only in local browser storage. Choosing to accept dynamically loads the single approved GTM container `GTM-KVJVH4VM`, Clarity project `zekmhvjftc`, and one Vercel Analytics component. Refusing analytics leaves those scripts unloaded. A later opt-out reloads the document, but does not erase vendor-held records or browser cookies created earlier.

The public GTM ID remains intentionally allowlisted; never publish other live account credentials or GTM/GA4 identifiers. Published GTM container contents and vendor retention still require a separate audit before privacy compliance claims. The [privacy notice](./app/privacy/page.tsx), [source-level tests](./tests/site-analytics.test.mjs), and [browser tests](./tests/homepage-browser-qa.mjs) should agree with this behaviour. The latter checks a fresh browser for optional requests before consent. Other third-party sites or downloaded source files remain separate risks.

## Shared JRV colour system (22 November 2026, draft)

The shared portfolio palette is **obsidian `#0B1419`**, **electric teal `#38C7BC`**, **ember orange `#F28C52`**, deep-teal surfaces and cool light text. `app/globals.css` defines the canonical tokens; teal conveys evidence and links, while ember highlights primary conversion actions and keyboard focus. The homepage, service pages, older case studies, interactive labs, résumé gallery and favicon now use the same brand family.

The editorial storefront deliberately remains a light ecommerce composition. ATS retains printable white paper, and Classic retains a teal masthead with Ember accents. These remain distinct demos instead of losing readability or turning every screen dark. Functional data, pricing examples, SEO, lead collection/consent rules and existing résumé paths are unchanged. See the **maintained [JRV Design System](docs/JRV_DESIGN_SYSTEM.md)** for canonical tokens and next-update instructions, the [dated palette QA record](docs/jrv-brand-palette-2026-11-22.md) for historical evidence, and the [Chrome route QA](./tests/portfolio-palette-browser-qa.mjs). The living document must change in the same PR as any changed token or brand rule. This visual release remains unpublished until PR #96 is reviewed and merged.

## Site favicon

The favicon retains the owner's selected **option 6** `{JRV}` code monogram and its original 64 × 64 artwork. On **24 October 2026**, the earlier favicon was recoloured gold-on-charcoal. On **22 November 2026**, the same approved artwork was recoloured again to **electric teal `#38C7BC` on obsidian `#0B1419`**, with cool-teal highlights. The 64 × 64 indexed PNG keeps exactly the same pixel index data and alpha bytes; only its palette and palette CRC changed. The letterform and geometry are preserved, with no new fonts, requests or competing favicon files. This update remains in draft PR #96 until approved for production.

`app/icon.svg` is the sole canonical Next.js App Router favicon convention file. It embeds a validated indexed 64 × 64 PNG inside a self-contained SVG wrapper, without external images, scripts or fonts. The original chosen PNG had previously replaced an incorrectly embedded JPEG. `app/layout.tsx` documents the automatic favicon registration; do not add `metadata.icons`, `app/favicon.ico` or a competing public favicon.

When changing the icon, preserve the approved design, revalidate PNG chunk checksums, update the XML and layout comments, verify the SVG response on the production domain, inspect 16 × 16 and 32 × 32 browser-tab and bookmark appearances (including cache refresh), and record the evidence and limitations in `CHANGELOG.md`.

## Cybersecurity training

**Cybersecurity: Foundation of CERT Operations** — a 12-hour *certificate of attendance* for **Foundations of CERT Operations**, 5–6 December 2023, through DICT Region XII & Mainland BARMM and its ICT Literacy and Competency Development Bureau. The course is summarised at [Professional development](./app/experience/page.tsx) (homepage card: `#certifications`, detailed section: `/experience#training`). It is not a professional cybersecurity certification. The signed original PDF is intentionally not committed to this public repository to protect the issuer's digital signature.

**Industry session — No Fiber, No Cyber: Safeguarding the World's Undersea Cables:** The portfolio also summarises an event announcement supplied by the owner for a U.S.–Philippines Joint Cybersecurity Working Group session with APTelecom, scheduled for Thursday 16 November, 2–4 p.m. Philippine Time in Ortigas. The invitation names Phillip Nervig and Eric Handa as speakers and John Garrity as moderator. The announcement does not specify the year or confirm the owner's attendance; do not represent it as a completed course or credential. See `/experience#undersea-cables-session`.




## Community involvement and healthy lifestyle

The [Beyond the Code](./app/page.tsx) homepage section introduces my self-reported volunteering with DEVCON, community outreach programmes, and medical missions, alongside running from fun runs to longer-distance events. These are personal interests rather than claimed professional accreditations or measured sporting results.

**Image publication:** All six owner-supplied original photographs have now been added to this repository as EXIF-stripped, optimised JPEGs under [`public/photos/`](./public/photos/) and are presented using Next.js `Image` components. The homepage features the laptop portrait, the About section uses the seated studio portrait, the Experience page shows the working portrait, and the personal section shows two running photos plus the medal. The original uploaded files are retained outside the public repository; no AI-generated substitutes or expiring external-image URLs are used. Source-specific alt text, image dimensions, responsive sizes and lazy loading are included; the homepage hero photo is prioritised.

## Engineering focus

- **Shopify theme engineering:** Liquid sections, responsive product detail pages, metafields and metaobjects, accessibility, SEO, and page performance.
- **B2B commerce:** Conceptual examples of volume-based pricing tiers, eligibility checks, catalogues, and notification flows using mock data.
- **API and fulfilment integrations:** Illustrative REST/GraphQL webhooks, idempotent event handling, tracking status normalisation, and retry strategies.
- **Delivery estimates:** Example date calculations distinguishing parcel movement from residential delivery days.
- **Analytics quality:** Event deduplication, ecommerce transaction validation, and reconciliation techniques.
- **Maintainable delivery:** Inline documentation, dated changelogs, validation evidence and practical release handovers.

## Documentation and change control

Documentation is an essential part of delivery. My [engineering standard](./ENGINEERING_STANDARDS.md) requires reading existing source and change history before editing, keeping inline explanations accurate, recording every change and verifying the saved result. Records include the date, target, affected files, change, reason, actual validation and pending checks. For Shopify theme work, this includes the private `pa-theme-changelog` and exact theme ID.

The portfolio presents this practice at [`/engineering-standards`](./app/engineering-standards/page.tsx), linked from the homepage quality and skills sections. The [contribution guidance](./CONTRIBUTING.md), [PR checklist](./.github/pull_request_template.md), [reusable change record](./ENGINEERING_STANDARDS.md#reusable-change-record) and [portfolio changelog](./CHANGELOG.md) make it usable for future work. The public record example is fictional. This documents a working standard; historical documentation completeness still requires an audit, and CI does not automatically certify comment accuracy.

## CTA and conversion-leak audit case study

The [conversion audit case study](./app/conversion-audit/page.tsx) describes a public-safe approach to diagnosing Shopify purchase-funnel friction: CTA functionality, product discovery, mobile UX, promotional eligibility messaging, cart-to-checkout continuity, event instrumentation and traffic-quality segmentation. The portfolio homepage links to `/conversion-audit`. This is a methodology-focused case study; internal conversion counts, private commercial results and employer source code are deliberately excluded. It does not assert a measured uplift or claim all recommendations shipped.

The expanded case study maps six journey stages from landing to purchase, explains the roles of Shopify Analytics, GA4, Microsoft Clarity, and source inspection, and distinguishes audit hypotheses from later developer-reported live QA. The [nine-slide public PDF](./public/portfolio/shopify-conversion-journey.pdf) is served at `/portfolio/shopify-conversion-journey.pdf`. This edition excludes internal commercial figures and private audit attachments. The original LinkedIn draft is not published verbatim. Keep the page, downloadable PDF, and evidence limitations aligned when updating this case study.

## Cold-chain shipping and subscription checkout

The [shipping integration case study](./app/shipping-integration/page.tsx) explains how developer-led troubleshooting aligned Recharge subscriptions, Zapiet zone rates and Shopify shipping rules across order thresholds and purchasing scenarios. The public account includes no customer records, production shipping configuration, proprietary code or unverified claims of zero recurrence. The homepage links to `/shipping-integration`.

## Custom Shopify delivery app and CartonCloud integration

I built both a **custom Cloudflare Worker delivery app** and its **Shopify–CartonCloud API integration**, linking Shopify fulfilment information to consignments and returning tracking events and estimated delivery-date information to Shopify. The [CartonCloud case study](./app/cartoncloud-integration/page.tsx) includes a responsive two-way architecture diagram with separate, clearly labelled app and integration contributions. See [technical documentation](./CARTONCLOUD_INTEGRATION.md) for implementation responsibilities, permission troubleshooting, historical testing and evidence limits. The public account contains no production Worker code, real order identifiers or private API credentials, and does not present successful API reads as complete delivery synchronisation.

## Shipping webhooks and chargeback evidence

The [chargeback evidence case study](./CHARGEBACK_EVIDENCE.md) explains how my custom Cloudflare and Shopify shipping integration connected consignments, tracking, and delivery events to dispute preparation. It distinguishes confirmed outcomes from causal claims and keeps customer records, order identifiers, private tracking links, and confidential commercial figures out of the public account.

## Project showcase (case studies, not employer source code)

### Shopify storefront improvements
Responsive components, content structuring, product discovery, and performance strategies.

### Third-party cart enhancement
A public-safe pattern for discovering an app-owned cart inside an open ShadowRoot, adding stable hooks after hydration, deriving reward states from fictional configuration, and keeping the app's native fallback available. No employer theme code, live promotion values, product names, store identifiers, or private app configuration are included.

### Weight-based B2B workflow
A sample architecture for pricing based on aggregate order weight, with synthetic products and thresholds. No production catalogues, discounts, or workflows are included.

### Fulfilment status integration
A sample event pipeline illustrating signature verification, deduplication, mapping, and error handling. No production endpoints, tokens, identifiers, or vendor payloads are included.

### Shipping and delivery modelling
A mock delivery calculator modelling dispatch, transport, regional eligibility, and final-mile delivery constraints. It does not reflect live fulfilment rules.

### Tracking and attribution auditing
Generic checks for event integrity and analytics comparisons using synthetic datasets.

## Security and publication policy

This repository is a **portfolio**, not a backup or mirror of an employer's production systems.

- Never commit passwords, API keys, Shopify access tokens, OAuth credentials, webhook secrets, service-account files, private certificates, or environment variables.
- Never commit customer/order data, personal information, real tracking identifiers, private dashboards, internal communications, or confidential pricing.
- Never copy company-owned themes, Cloudflare Workers, Shopify Flow exports, app configuration, or proprietary logic without permission from the owner.
- Publish independently written examples with mock input, placeholder domain names, and fictional business rules.
- Review source code *and Git history* before publishing. Deleting a secret from the latest commit does not remove it from prior commits.
- Use environment variables and a local ignored `.env` file for non-public values, and provide only a safe `.env.example`.
- Run secret and sensitive-content checks before every public push.

## About these examples

The topics reflect professional engineering experience. Any accompanying public example should be independently authored and should not be represented as the original client implementation. Full production code and private configuration are intentionally excluded.

## Public code library

Browse **49 independently authored, public-safe example files** in [examples/](./examples). The [portfolio index](./PORTFOLIO_INDEX.md) maps them to each engineering area and includes project cards. These demonstrate Liquid, HTML, CSS, JavaScript, API integration patterns, B2B weight calculations, tracking, delivery estimations, analytics, catalogue governance, and SEO. Each is a compact illustrative example rather than a complete deployed system. Every JavaScript example has a unit test in [tests/examples.test.mjs](./tests/examples.test.mjs).

Read [Engineering case studies](./CASE_STUDIES.md) for explanations of storefront work, B2B commerce, fulfilment integrations, shipping calendars, analytics, redirect management, performance, marketing technology, safe live-store editing, debugging a stale-tag badge, a performance baseline audit, store builds with tracking set-up, and safely enhancing an app-owned cart rendered in an open Shadow DOM.

**Publication note:** This is not an export of all historical work. The exact code and confidential implementations belonging to clients or employers are not included; additions require an independent permission and privacy review.

## Theme sections

Shopify Online Store 2.0 theme files in [theme/](./theme/README.md): a homepage template (hero slideshow, seasonal banner, and featured collection), a seasonal landing page that switches between Christmas, Boxing Day, and EOFY every year, a campaign landing template, and a category badge read from a metaobject reference. All have rendering tests and are labelled illustrative.

## Interactive B2B simulator

A standalone, fictional weight-based wholesale price calculator is now included at [`/b2b-demo`](./app/b2b-demo/page.tsx). See [B2B_DEMO.md](./B2B_DEMO.md) for the architecture, usage notes, and production boundaries. It includes Node.js unit tests and [GitHub Actions CI](./.github/workflows/portfolio-ci.yml). The route will be publicly usable once the portfolio's Next.js deployment successfully builds and publishes the latest commit.

## Shopify Flow and Liquid notifications

See [Shopify Flow portfolio examples](./shopify-flow/README.md) for a fictional aggregate-weight workflow, Run code action, internal email Liquid, and customer notification Liquid. These are original educational templates, not exported employer workflows or production-ready Shopify configurations. A standalone Node test suite checks the example Flow logic.

## Interactive HTML and CSS engineering lab

The [CSS engineering lab](./app/css-lab/page.tsx) introduces 14 compact concept notes and three interactive browser demonstrations, from box sizing to flex layouts and visibility. Eight original questions exercise the underlying principles. Code and explanations are maintained in [`lib/css-lab.mjs`](./lib/css-lab.mjs), automated checks in [`tests/css-lab.test.mjs`](./tests/css-lab.test.mjs), and architecture in [`docs/CSS_LAB.md`](./docs/CSS_LAB.md). This is educational practice, not a published copy of an employment assessment or evidence of a certification.

## Python automation

[projects/samsung-health-csv-merger](./projects/samsung-health-csv-merger) is a Python and Pandas command-line tool that merges many CSV exports into one file, skips a common extra title row, and reports files it could not read. [Its tests](./tests/python/test_merge_samsung_health.py) use small synthetic CSVs, so no personal data is involved, and run in CI. [projects/python-notebook-review](./projects/python-notebook-review) reviews Jupyter training notebooks, and [skills/python-automation-portfolio](./skills/python-automation-portfolio) is a reusable workflow for turning scripts into documented, privacy-safe projects. [projects/fictional-faq-retrieval](./projects/fictional-faq-retrieval) adds an independently authored, offline FAQ CLI using entirely fictional sources, deterministic retrieval, explicit abstention and source attribution. Its standard-library tests run in the same Python CI suite. See the [/python-automation](./app/python-automation/page.tsx) page on the site.

## Validation

```sh
npm install
npm test               # examples, theme sections, delivery rule guard, Flow, B2B simulator, Liquid structure
npm run check:safety   # scan tracked files for credentials, store IDs and contact details
npm run test:python    # Python tests (needs: pip install -r projects/samsung-health-csv-merger/requirements.txt)
npx tsc --noEmit && npm run build
```

[GitHub Actions](./.github/workflows/portfolio-ci.yml) runs the same checks on every push and pull request. The safety scan catches common credential formats but does not replace a human review of ownership and confidentiality.

## Eve Curls: international European Markets case study (October 2026)

The [Eve Curls international Shopify Markets case study](./app/eve-curls/page.tsx) outlines the developer's work on a multi-country European ecommerce approach operating within one Shopify ecosystem. Markets discussed: the UK, Switzerland, Netherlands, Italy, France and Spain. The portfolio covers market-level language and currency contexts, market-aware product catalogues, localised landing-page content, domain planning and common theme components with regional presentation overrides.

The [interactive preview](./app/eve-curls/MarketPreview.tsx) deliberately uses six fictional market configurations, translated example copy, illustrative products, fixed mock prices, percentage-discount examples, checkout/account labels and non-resolving `.invalid` example URLs. It does **not** query or expose any Eve Curls catalogue, theme, Shopify configuration, live domain route, currency conversion, tax calculation or real customer data. Switzerland is shown using a German-language sample, while French and Italian are noted as potential alternatives. The diagram at [public/portfolio/eve-curls-markets.svg](./public/portfolio/eve-curls-markets.svg) is independently authored.

Technical distinction: Shopify supports market-based theme customisations on a shared published theme; this should not be presented as separate simultaneously published themes within one shop. User-described project scope is not equivalent to an audited live market-by-market configuration or a measured commercial outcome.

### Six Shopify Markets configuration areas

The Eve Curls case study now maps the six configuration groups named in Shopify's Markets admin:

| Area | Experience illustrated | Production boundary |
| --- | --- | --- |
| Currency | GBP/CHF/EUR formatting and fixed fictional prices for each selected country | Real conversion, checkout settlement and refunds require the appropriate payment processor and live market settings. |
| Catalogs | Market-specific product names and availability/price illustrations | No actual published client catalogue or product records. |
| Discounts | Different example percentage offers, including a market with no offer | In Shopify, percentage reductions use the local price; fixed-value discounts are defined in the store's base currency and converted at checkout. Real market assignment, eligibility and stacking are not simulated. |
| Online Store / Theme | Country-specific hero and CTA content | Shopify publishes one theme, with per-market section/block overrides on Advanced or Plus; global typography, colours and Liquid templates are shared. |
| Checkout and accounts | Illustrative translated checkout/account labels | This preview does not simulate Shopify checkout. Plan-dependent per-market checkout and account customisations start on Advanced; certain checkout blocks are Plus-only. |
| Domain / language | Example `.invalid` URL paths and localised storefront copy | Not live Eve Curls domains or verified current market-language configuration. |

This is a **public-safe case study** of the developer's stated architectural scope, not a verified export of Eve Curls administration or an end-to-end checkout test. The market selector changes only in-memory React state; all displayed values are static fictional fixtures. It does not perform currency conversion, taxes, actual payments, Shopify discounts or account authentication.

Shopify documentation: [Managing markets](https://help.shopify.com/en/manual/markets/getting-started/managing-markets), [Markets customisation](https://help.shopify.com/en/manual/markets/customizations), [feature and plan requirements](https://help.shopify.com/en/manual/markets/getting-started/requirements-and-considerations), [discounts in Markets](https://help.shopify.com/en/manual/markets/discounts-and-gift-cards), and [market theme customisation](https://help.shopify.com/en/manual/markets/customizations/online-store).

## Editorial homepage storytelling demo

The public-safe [/editorial-homepage-demo](./app/editorial-homepage-demo/page.tsx) is a single, independent premium commerce homepage. It combines a story carousel, occasion-based browsing, fictional collection filtering, a local demo bag, an educational marbling slider, and a sample postcode interaction in a responsive design. It is not client theme code or a copy of the original brand. [Read the case study and author-supplied 28-day Core Web Vitals benchmark](./projects/editorial-homepage-demo/README.md). Production measurements are clearly separated from the unmeasured React prototype.

### Online résumé designs

Two owner-approved public designs share one canonical data module (`app/resume/resume-data.ts`) and use American English. The original-inspired teal Classic layout and modern editorial layout are available at `/resume/classic` and `/resume/modern`, with a comparison page at `/resume`.

PDF and editable DOCX endpoints are generated on demand: `/resume/classic/pdf`, `/resume/classic/word`, `/resume/modern/pdf`, and `/resume/modern/word`. Route generators live in `app/resume/resume-export.ts`; adjust the canonical data before modifying any generated format. The classic design approximates the original aesthetic; it is not a byte-identical copy of the prior document.

The retired `/JRV-Resume.pdf` URL now redirects to `/resume`; the original public binary and matching backup are absent from the published Git tree and this draft. Both new résumé routes stay `noindex` (not private), retain approved personal details and have distinct PDF/Word options. Verify all four downloadable formats, and remember old commits and backup branches remain public.


### Résumé downloads: primary actions and document properties

The public résumé chooser at `/resume` has two prominent direct PDF actions: **ATS-Friendly Résumé** (`/resume/modern/pdf`, for backwards compatibility) and **Classic Résumé** (`/resume/classic/pdf`). Browser previews and editable Word files remain available through secondary links.

The ATS export is a selectable-text, single-column document with standard section labels and no decorative PDF graphics. This improves automated parsing but cannot guarantee compatibility with every recruitment platform. The Classic format retains teal accents for direct applications.

The document's authorship metadata reflects the actual résumé owner, `Jomar Rhandy C. Vallite`; its generator metadata accurately identifies the site's custom `JRV Portfolio Resume Export`, not Microsoft Word, Adobe or an AI platform. In DOCX the core-properties author and last-modified-by fields identify the owner; application metadata describes the export service. No private local file paths or internal source names are embedded in exported document properties. Git history still records changes and should not be represented as deleted or rewritten.

The existing `resume-data.ts` remains the shared career data source. Verify PDF extracted-text order, Word ZIP/core-properties integrity, both HTTP content types, and `noindex` response metadata after updates.


### ATS-friendly URL and file naming

Use `/resume/ats` for the ATS-friendly HTML preview and `/resume/ats/pdf` or `/resume/ats/word` for direct downloads. Those files are named `JRV-Resume-ATS-Friendly-2026.pdf` and `.docx`, respectively. Existing `/resume/modern` paths remain aliases for compatibility, with the same content and filename. The classic URLs remain `/resume/classic`, `/resume/classic/pdf`, and `/resume/classic/word`.


## Resume visual refresh (20 November 2026)

Both `/resume/classic` and `/resume/ats` use a legible single-column printable layout and responsive width, with two clearly differentiated styles: restrained deep-teal Classic and minimal slate ATS. Their on-demand PDFs and Word documents share `resume-data.ts` and corresponding typography. The Classic PDF no longer draws a sidebar over body copy. Verify the GitHub CI build, PDF text extraction, DOCX structural integrity, and production routes before marking the release live.

## Classic résumé refinement (20 November 2026)

The Classic-only visual refresh introduces an ivory, teal and soft-gold document identity for `/resume/classic`. It covers the web preview, PDF masthead and Word typography without altering the ATS version, shared résumé facts, export paths, or `noindex` controls. Before shipping, review the actual page breaks and downloadable file renders in addition to automated checks.
