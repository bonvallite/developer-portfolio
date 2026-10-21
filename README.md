# Developer Portfolio | Bon Vallite

Practical e-commerce engineering, API integrations, automation, and storefront performance.

**LinkedIn:** https://www.linkedin.com/in/bonvallite/

## Engineering focus

- **Shopify theme engineering:** Liquid sections, responsive product detail pages, metafields and metaobjects, accessibility, SEO, and page performance.
- **B2B commerce:** Conceptual examples of volume-based pricing tiers, eligibility checks, catalogues, and notification flows using mock data.
- **API and fulfilment integrations:** Illustrative REST/GraphQL webhooks, idempotent event handling, tracking status normalisation, and retry strategies.
- **Delivery estimates:** Example date calculations distinguishing parcel movement from residential delivery days.
- **Analytics quality:** Event deduplication, ecommerce transaction validation, and reconciliation techniques.

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

Browse **48 independently authored, public-safe example files** in [examples/](./examples). The [portfolio index](./PORTFOLIO_INDEX.md) maps them to each engineering area and includes project cards. These demonstrate Liquid, HTML, CSS, JavaScript, API integration patterns, B2B weight calculations, tracking, delivery estimations, analytics, catalogue governance, and SEO. Each is a compact illustrative example rather than a complete deployed system. Every JavaScript example has a unit test in [tests/examples.test.mjs](./tests/examples.test.mjs).

Read [Engineering case studies](./CASE_STUDIES.md) for explanations of storefront work, B2B commerce, fulfilment integrations, shipping calendars, analytics, redirect management, performance, marketing technology, safe live-store editing, debugging a stale-tag badge, a performance baseline audit, store builds with tracking set-up, and safely enhancing an app-owned cart rendered in an open Shadow DOM.

**Publication note:** This is not an export of all historical work. The exact code and confidential implementations belonging to clients or employers are not included; additions require an independent permission and privacy review.

## Theme sections

Shopify Online Store 2.0 theme files in [theme/](./theme/README.md): a homepage template (hero slideshow, seasonal banner, and featured collection), a seasonal landing page that switches between Christmas, Boxing Day, and EOFY every year, a campaign landing template, and a category badge read from a metaobject reference. All have rendering tests and are labelled illustrative.

## Interactive B2B simulator

A standalone, fictional weight-based wholesale price calculator is now included at [`/b2b-demo`](./app/b2b-demo/page.tsx). See [B2B_DEMO.md](./B2B_DEMO.md) for the architecture, usage notes, and production boundaries. It includes Node.js unit tests and [GitHub Actions CI](./.github/workflows/portfolio-ci.yml). The route will be publicly usable once the portfolio's Next.js deployment successfully builds and publishes the latest commit.

## Shopify Flow and Liquid notifications

See [Shopify Flow portfolio examples](./shopify-flow/README.md) for a fictional aggregate-weight workflow, Run code action, internal email Liquid, and customer notification Liquid. These are original educational templates, not exported employer workflows or production-ready Shopify configurations. A standalone Node test suite checks the example Flow logic.

## Validation

```sh
npm install
npm test               # examples, theme sections, delivery rule guard, Flow, B2B simulator, Liquid structure
npm run check:safety   # scan tracked files for credentials, store IDs and contact details
npx tsc --noEmit && npm run build
```

[GitHub Actions](./.github/workflows/portfolio-ci.yml) runs the same checks on every push and pull request. The safety scan catches common credential formats but does not replace a human review of ownership and confidentiality.
