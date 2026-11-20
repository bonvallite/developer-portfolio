# Shopify Commerce Engineering | Developer Portfolio

Service-led portfolio covering Shopify development, ecommerce management, conversion rate optimisation, custom API integrations, and storefront performance. Public pages intentionally avoid personal-name SEO.

## Résumé backup and public PDF release

The original 2026 PDF is archived byte-for-byte at `backups/resumes/JRV-Resume-2026-Original.pdf` (Git blob `a7d4648238f748f625004890bb8aac4b5443915b`). It is not linked from the homepage, but this repository and its history are public and the archive may contain personal details and obsolete contact information. Once the approved American English revision is uploaded, the active public path must remain `public/JRV-Resume.pdf` so existing resume links continue working. Do not publish or state that the replacement is live until CI, Vercel production, and PDF content checks succeed.

## Current public identity and contact

The approved public wordmark is **JRV**, matching the approved **{JRV}** browser-tab favicon in `app/icon.svg`. Shopify Commerce Engineering describes the services, not a separate brand. Do not reintroduce the former EC. monogram or publish the owner's full personal name in page metadata. The public enquiry mailbox is **hello@jrvallite.com** for both role and project requests and for privacy enquiries. Keep the `mailto:` links in `app/page.tsx` and `app/privacy/page.tsx` aligned. Historical references, repository account details, and dated documentation are not rewritten retroactively.






## Professional profiles, résumé and mailbox access (restored 19 November 2026)

At the owner's request, the homepage contact section links to the original public LinkedIn, Google Developer and Wikipedia contribution profiles, and provides a separate authorised-mailbox login shortcut at `https://webmail.jrvallite.com/`. This is a **login link**, not the public contact destination. Enquiries continue to use `hello@jrvallite.com`.

The `/JRV-Resume.pdf` download is a neutral URL referring to the owner's originally published 2026 résumé, restored from historical Git object `a7d4648238f748f625004890bb8aac4b5443915b`. The original document may contain an older email address or other identifying information; it is not automatically updated by changing the website. Publication of the résumé and personal profile links changes the prior 18 November privacy cleanup. Keep page titles and metadata service-led; do not infer that the linked personal profiles are independent credentials or endorsements.

## Ecommerce API extraction case study

The [interactive ecommerce analytics case study](./app/data-extraction-automation/page.tsx) tells the original business brief through architecture, a cinematic CSS-only hero, a five-stage educational walkthrough, and an interactive Python code explorer. The public [sanitised source archive](./public/case-studies/ecommerce-analytics/sanitised-python-source-archive.md) includes all 17 owner-supplied Python files, with employer-specific domains, property IDs, brand filters and Windows user paths replaced by example values. It contains no tokens, credentials, raw client exports or customer records. Publishing sanitised code does not imply the scripts were independently run or every API export succeeded. The 30 planned GSC outputs include documentation-only notes, and some scripts use a rolling 365-day period rather than the required 12 full calendar months. Shopify GraphQL is a related skill, not a verified extraction method for this case. The [Python automation page](./app/python-automation/page.tsx) and [reusable workflow skill](./skills/python-automation-portfolio/SKILL.md) link to the case study. CSS motion respects reduced-motion preferences; no heavy hero bitmap, external analytics credentials or client-side API runtime is used.

## Portfolio analytics: Google Tag Manager

The Next.js root layout (`app/layout.tsx`) installs Google Tag Manager container **`GTM-KVJVH4VM`** sitewide, using the owner's supplied asynchronous `gtm.js` URL and `window.dataLayer` / `gtag('js', new Date())` initialisation **directly in a single explicit `<head>` section**. These two native script elements reproduce Google's manual head snippet, rather than using a Next.js `beforeInteractive` script queue, which preview HTML showed outside the head. The asynchronous external script and immediate inline initialiser are emitted on the initial HTML for every route. Do not repeat them in page components. The container ID is public and is not a secret. The repository's publication safety scanner has an exact-value exception for this ID only in `scripts/public-safety-allowlist.json`; all other GTM/GA4 IDs continue to be flagged.

**Avoid duplicate measurement:** Keep this as the sole GTM loader for the portfolio. Do not paste the same snippet into other pages, Vercel settings or additional snippets. The site also retains an independent Microsoft Clarity loader and Vercel Analytics. GTM container contents, Google Analytics destinations, triggers, and any separate tags must be reviewed in the Tag Manager workspace: installing the container does not itself prove a Google Analytics destination or conversion event is configured.

**Privacy and consent:** This tracking-only change does not implement a cookie banner or consent enforcement. Review the public privacy notice and applicable consent requirements before collecting visitor information. Validate the production document `<head>`, the single `gtm.js?id=GTM-KVJVH4VM` browser request, the Tag Assistant connection, and events in the intended Google destination after deployment.

## Portfolio analytics: Microsoft Clarity

The shared Next.js App Router layout (`app/layout.tsx`) loads Microsoft Clarity **once across all portfolio pages** from a native inline `<script id="microsoft-clarity">` inside the initial HTML `<head>`, using the owner's exact self-inserting asynchronous loader. The previous `next/script` `afterInteractive` instance in `<body>` has been removed to prevent duplicate page tracking. The public Clarity project ID is `zekmhvjftc`; it is not a secret. Vercel Analytics is retained independently. Do not also inject the same Clarity tag in Vercel settings, page components or other snippets, as that would duplicate tracking.

**Privacy and consent review:** Clarity can collect visitor interaction data. Confirm that the published site notice, consent configuration and any required regional privacy controls are appropriate before relying on session recordings. No consent manager, consent gating or privacy notice was implemented by this tracking-only change. Deployment status does not prove that recordings or consent behaviour are functioning. Verify the loaded `https://www.clarity.ms/tag/zekmhvjftc` request and new sessions in the intended Clarity project after production deployment.

## Site favicon

The favicon retains the owner's selected **option 6** `{JRV}` code monogram and its original 64 × 64 artwork. On **24 October 2026** its former cyan-on-navy colours were adjusted to the actual portfolio colours: **warm gold `#D9B47C` on charcoal `#0B0E12`**, with supporting bronze highlights. Only the indexed PNG's colour palette and corner transparency changed; the letterform and pixel positions remain unchanged. The original light outside-corner pixels now have transparent alpha, avoiding white corners in browser tabs. This was a colour-alignment refinement, not a new logo selection.

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

The old `/JRV-Resume.pdf` remains unchanged as backward-compatible legacy access and an identical Git backup is at `backups/resumes/JRV-Resume-2026-Original.pdf`. The new resume routes are `noindex` (not private) and may display expressly approved personal information. Verify all four downloadable formats following every change.


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
