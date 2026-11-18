# Stage 6 — Organic hiring search launch and measurement

Date: 2026-11-18
Status: Prepared only. Do not submit URLs for indexing or declare SEO launch complete until the reviewed code is deployed to production.
Canonical host: https://www.jrvallite.com

## Release prerequisites
- [x] GitHub Actions passed for pre-documentation commit `4669201b` (SEO source checks, publication safety, JS and Python tests, TypeScript and Next.js build).
- [ ] Obtain READY Vercel preview for the exact final branch commit and verify its Git SHA.
- [ ] Inspect desktop and mobile layout, keyboard focus and contact journey on the exact preview.
- [ ] Inspect rendered title, description, H1, canonical, Open Graph and response codes on homepage and four service pages.
- [ ] Confirm robots.txt allows indexing and sitemap.xml contains each real canonical URL.
- [ ] Verify former name-based résumé URL returns 404/410 after deployment, not a still-public legacy asset.
- [ ] Review profile links, personal email and photographs for identity association. No absolute invisibility guarantee.
- [ ] Merge/deploy only after all release gates and the pull-request approval process pass.
- [ ] Record production deployment ID and commit.

## Google Search Console launch
1. Confirm or create the **Domain** property for jrvallite.com using DNS verification. A domain property covers both www and apex; do not share DNS secrets or transfer account ownership.
2. After production deploy, submit `https://www.jrvallite.com/sitemap.xml` in Search Console.
3. Inspect these canonical URLs with URL Inspection:
   - https://www.jrvallite.com/
   - https://www.jrvallite.com/shopify-developer
   - https://www.jrvallite.com/ecommerce-management
   - https://www.jrvallite.com/shopify-cro
   - https://www.jrvallite.com/shopify-app-development
4. Request indexing where appropriate only after verifying status 200, an indexable robots directive, and correct self canonical.
5. Track discovered / crawled / indexed pages, impressions, clicks, CTR and average position. Expect indexing to take time; submission is not a ranking or indexing guarantee.
6. For outdated personal-name snippets, ensure original identifying content is removed from the live page first. Use Search Console's relevant temporary removal or refresh workflows where supported, then monitor recrawls. Do not block useful service pages with noindex simply to hide historic text.

## Hiring-intent keyword themes
- Shopify developer; Shopify Liquid developer; Shopify theme development
- Ecommerce manager; Shopify ecommerce store manager; ecommerce operations
- Shopify CRO specialist; Shopify conversion rate optimisation; ecommerce conversion audit
- Custom Shopify app developer; Shopify API integration; Shopify webhooks
- Shopify B2B development; Shopify Flow automation; Shopify Markets

Use natural, helpful content. Do not manufacture years of experience, client attribution, app marketplace publication or conversion improvements.

## Search measurement plan
Record a baseline on production launch date and review around day 30, 60 and 90.

| Dimension | Measure | Where |
| --- | --- | --- |
| Visibility | Organic clicks, impressions, CTR, position | Search Console Performance |
| Landing page demand | Queries and country/device by page | Search Console Performance |
| Index health | Submitted, crawled, indexed service routes | Search Console Pages + URL Inspection |
| Visitor engagement | Organic landing pages and engagement | GA4 (if configured correctly) |
| Hiring leads | Valid enquiries from portfolio contact links | Approved analytics/event tracking |
| Conversion quality | Enquiries qualified as roles/projects | User-maintained lead log |

Avoid collecting private enquiry content in analytics. For mailto and external contact links, track only the click type or destination category if consent and legal requirements are met; a click is not proof of an enquiry.

## Reporting format
Every review should note exact reporting dates, the previous comparison period, page-level organic results, which queries brought hiring-intent traffic, indexed status, and any meaningful enquiries. Differentiate observed outcomes from assumptions, and do not claim SEO improvement without comparable data.

## Blockers at preparation time
- Vercel API did not return a deployment for exact commit `4669201b`, although earlier branch previews were READY.
- Production and preview HTML fetches were not accessible to the available reader.
- Site domain and repository account remain potentially attributable to the owner.

## Latest execution blocker (2026-11-18)
- PR head `d4fae7d23e38039317c96c20407faa37aa638d90` passed GitHub Actions but has not been tied to an exact Vercel preview.
- Manual Git-source preview deployment request was rejected by Vercel with HTTP 402 `api-deployments-free-per-day` (daily API deployment limit). An authenticated CLI fallback was not available in the execution environment.
- No Search Console submission, verification change, indexing request, merge, or live-site deployment was performed.
- Resume the checklist only when the exact preview and rendered-route verification can be completed, keeping the site indexable for skills rather than trying to erase the domain identity.
