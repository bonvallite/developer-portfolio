# Stage 10: Structured data and search presentation audit

Date: 19 November 2026

## Scope

Reviewed source for `app/layout.tsx`, `app/page.tsx`, `app/components/ServicePage.tsx` and the four Shopify service routes. This is a source-level review, not a live rich-results test.

## Findings

- The root metadata is service-led and sets `metadataBase` to the canonical www host. It intentionally does not set a root canonical or sitewide Open Graph URL.
- The homepage defines its own canonical and Open Graph URL.
- Each of the four service routes already defines its own title, description, canonical and Open Graph URL.
- The shared service layout provides visible service scope, process, project evidence, and cross-links.
- No JSON-LD structured data was found in the reviewed homepage or shared service layout.
- Existing comments expressly discourage personal-name SEO and unverified claims.

## Recommended next implementation

Introduce only verifiable, minimal `WebPage` structured data with route-specific `name`, `description`, and `url` based on existing visible content and metadata. If a shared helper is used, ensure each route supplies its own canonical URL and that output is JSON-escaped safely.

Do not add `Person`, `LocalBusiness`, `AggregateRating`, `Review`, `FAQPage`, `Product`, or fabricated credentials, addresses, prices, testimonials, or commercial outcomes. Do not imply Google rich-result eligibility.

## Validation before release

1. Check all four rendered pages for exactly one intended JSON-LD block each.
2. Parse the JSON-LD and confirm absolute URLs use `https://www.jrvallite.com`.
3. Confirm schema text agrees with the visible page and does not contain a personal name.
4. Run existing tests, TypeScript checks, safety checks and a production build.
5. Verify preview deployment and inspect rendered output before merging.

No runtime code or SEO metadata is changed in this audit-only commit.
