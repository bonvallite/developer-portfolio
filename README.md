# Developer Portfolio | Bon Vallite

Practical e-commerce engineering, API integrations, automation, and storefront performance.

**LinkedIn:** https://www.linkedin.com/in/bonvallite/

**Google Developer profile:** https://g.dev/bonvallite

**Wikipedia contributions:** https://en.wikipedia.org/wiki/Special:Contributions/Bonvallite

 
## Cybersecurity training

**Cybersecurity: Foundation of CERT Operations** — a 12-hour *certificate of attendance* for **Foundations of CERT Operations**, 5–6 December 2023, through DICT Region XII & Mainland BARMM and its ICT Literacy and Competency Development Bureau. The course is summarised at [Professional development](./app/experience/page.tsx) (homepage card: `#certifications`, detailed section: `/experience#training`). It is not a professional cybersecurity certification. The signed original PDF is intentionally not committed to this public repository to protect the issuer's digital signature.

**Industry session — No Fiber, No Cyber: Safeguarding the World's Undersea Cables:** The portfolio also summarises an event announcement supplied by the owner for a U.S.–Philippines Joint Cybersecurity Working Group session with APTelecom, scheduled for Thursday 16 November, 2–4 p.m. Philippine Time in Ortigas. The invitation names Phillip Nervig and Eric Handa as speakers and John Garrity as moderator. The announcement does not specify the year or confirm the owner's attendance; do not represent it as a completed course or credential. See `/experience#undersea-cables-session`.




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

## Cold-chain shipping and subscription checkout

The [shipping integration case study](./app/shipping-integration/page.tsx) explains how developer-led troubleshooting aligned Recharge subscriptions, Zapiet zone rates and Shopify shipping rules across order thresholds and purchasing scenarios. The public account includes no customer records, production shipping configuration, proprietary code or unverified claims of zero recurrence. The homepage links to `/shipping-integration`.

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

## Editorial homepage storytelling demo

The public-safe [/editorial-homepage-demo](./app/editorial-homepage-demo/page.tsx) is a single, independent premium commerce homepage. It combines a story carousel, occasion-based browsing, fictional collection filtering, a local demo bag, an educational marbling slider, and a sample postcode interaction in a responsive design. It is not client theme code or a copy of the original brand. [Read the case study and author-supplied 28-day Core Web Vitals benchmark](./projects/editorial-homepage-demo/README.md). Production measurements are clearly separated from the unmeasured React prototype.
