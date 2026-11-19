# Stage 13: Live sitemap and indexing-readiness audit

Date: 19 November 2026

## Verified on production

- `https://www.jrvallite.com/robots.txt` returns HTTP 200, allows public pages, excludes `/api/`, and references the canonical sitemap.
- `https://www.jrvallite.com/sitemap.xml` returns HTTP 200 and lists 18 absolute URLs on the www host.
- All 18 sitemap URLs returned HTTP 200 when fetched from the live site.
- All 18 rendered pages declare self-referencing canonical URLs. The homepage canonical normalises to the bare domain without a trailing slash.
- The four primary Shopify service routes are included in the sitemap.

## Limits

These checks establish basic crawl readiness, not Google indexing, ranking, or search traffic. No Search Console data for `jrvallite.com` was available in the checked materials. Existing exports for Peter Augustus are not evidence of this portfolio's performance.

## Next steps

1. Verify the `sc-domain:jrvallite.com` property in Google Search Console, if not already verified.
2. Submit `https://www.jrvallite.com/sitemap.xml`.
3. Inspect indexing and Google-selected canonical for the four service pages.
4. Export GSC page and query performance over an agreed window. Compare impressions, clicks, CTR and average position; prioritise only evidenced opportunities.
5. Avoid unnecessary title or description changes before establishing a baseline.

No runtime files, robots rules, sitemap paths or production metadata were modified in this audit.
