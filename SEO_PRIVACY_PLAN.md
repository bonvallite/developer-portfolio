# Service-led SEO and public-name minimisation

Date: 2026-11-18
Branch: seo/shopify-hiring-positioning
Domain: https://www.jrvallite.com

## Intent
Position the site for Shopify developer, ecommerce manager, conversion rate optimisation (CRO), custom Shopify application and API integration hiring searches. Do not optimise public content for the owner's name.

## Applied
- Use service-led title, description, keywords, canonical URL and Open Graph metadata.
- Reframe homepage hero, service tags and contact invitation.
- Remove exact personal-name text from homepage and experience page, including image alternative text and footer.
- Remove name-specific résumé navigation and the public PDF. Existing external copies, previews and search snippets may persist.
- Provide crawlable robots and a curated sitemap without blocking indexation of useful service content.

## Outstanding privacy and SEO checks
- Search the entire repository, public asset names, PDF contents, social previews, build output and external profiles for further identity references. Do not assume this change fully anonymises the website.
- Review personal photos and personal-interest sections before deciding whether to retain them.
- Audit every subpage for metadata, canonical URLs and service-led headings.
- Confirm www is the actual canonical production host, or adjust metadata and sitemap.
- Validate build, test and safety checks prior to merging.
- After deployment, verify rendered HTML, robots.txt, sitemap.xml, status of removed PDF and Search Console indexing. Request removal of stale search results if required.
- Note that jrvallite.com and links to personal accounts can still associate the site with its owner.


## Staged delivery roadmap (commenced 2026-11-18)

### Stage 1 — Audit and identity minimisation (IN PROGRESS)
- [x] Identify homepage and experience-page personal-name metadata and visible references.
- [x] Move proposed metadata, homepage copy and public PDF removal into draft PR #37.
- [x] Add robots and sitemap routes for review.
- [ ] Scan all routes, filenames, binaries, JSON-LD, OG images and linked profiles for residual personal identifiers.
- [ ] Inspect production host redirects and confirm whether the canonical host uses www.
- [ ] Verify that old PDF requests return 404/410 after release, and plan cache/search removals.
- [ ] Audit the sitemap entries against existing routes.
**Gate:** Privacy and URL inventory completed and reviewed.

### Stage 2 — Homepage search intent and recruitment conversion (NOT STARTED)
- [ ] Align main heading, title, intro, navigation and contact sections with Shopify development, ecommerce management and CRO.
- [ ] Add clearly labelled enquiry paths for employers and potential clients.
- [ ] Retain evidence-based positioning; avoid implying unverified Shopify App Store releases.
**Gate:** Homepage metadata, copy and mobile contact journey reviewed.

### Stage 3 — Services and search landing pages (NOT STARTED)
- [ ] /shopify-developer: themes, Liquid, storefront performance and B2B.
- [ ] /ecommerce-management: catalogue, operations, promotions, reporting and integrations.
- [ ] /shopify-cro: conversion funnels, GA4, Clarity, testing and optimisation process.
- [ ] /shopify-app-development: demonstrable custom apps, Shopify APIs, webhooks and serverless integrations.
- [ ] Connect each page to documented case studies and contact route.
**Gate:** Unique helpful content and sitemap/canonical coverage checked.

### Stage 4 — Technical evidence, case studies and content authority (NOT STARTED)
- [ ] Improve descriptive headings, concise outcomes, internal links and technical screenshots.
- [ ] Use accurate Project/SoftwareApplication/Service structured data only when supported.
- [ ] Audit privacy and remove unapproved client details.
**Gate:** Case study claims and public publication safety verified.

### Stage 5 — Validation and controlled deployment (NOT STARTED)
- [ ] Run npm install, npm test, node scripts/check-public-safety.mjs, npx tsc --noEmit and npm run build.
- [ ] Review robots.txt, sitemap.xml, canonical tags, descriptions, OG metadata, HTTP redirects and mobile performance in preview.
- [ ] Merge only after checks pass and the draft PR is approved; verify Vercel production release.
**Gate:** All tests pass, deployment verified, and no identity leaks introduced.

### Stage 6 — Search Console, indexing and measurement (NOT STARTED)
- [ ] Submit sitemap and inspect service-page indexing.
- [ ] Request refresh/removal for outdated snippets and assets where applicable.
- [ ] Monitor queries, landing pages, organic enquiries and hiring-related conversion events.
- [ ] Review SEO performance after approximately 30, 60 and 90 days.
**Gate:** Search indexing and enquiry metrics recorded with actionable follow-ups.

## Stage 1 initial source review (2026-11-18)
- Confirmed root metadata, homepage, experience-page metadata, robots and sitemap files on SEO branch.
- Root layout canonical, OG URL and sitemap currently assume https://www.jrvallite.com; actual canonical production host needs verification.
- Existing homepage references personal-profile links, personal photos and named asset paths. Removing exact visible name text is not equivalent to fully anonymising the website.
- The sitemap uses an explicitly curated list; each route must be confirmed before release.
- GitHub draft PR #37 remains unmerged. No automated validation or deployment has been verified.

## Stage 1 continuation: repository and domain audit (2026-11-18)
- [x] Verified Vercel domain settings: `jrvallite.com` redirects with HTTP 308 to verified primary `www.jrvallite.com`. Canonical host selection confirmed in configuration; live HTTP fetch could not be independently verified.
- [x] Audited the recursive GitHub branch tree: 154 tracked blobs; 12 case-study/detail route pages plus homepage; all explicitly listed sitemap routes have corresponding page.tsx source.
- [x] Removed additional personal-name SEO title references in `app/engineering-standards/page.tsx`, `app/eve-curls/page.tsx`, and `app/shopify-flow/page.tsx`.
- [x] Corrected an important canonical inheritance risk: sitewide `alternates.canonical='/'` removed from root layout and applied to homepage only. Each future service/detail page requires its own self-referencing canonical.
- [ ] Six personal-name filenames still exist under `public/photos/` (running, studio, laptop images). These may be visible to search engines even after changing alt text; review/rename or remove with exact reference updates.
- [ ] Several page links to `github.com/bonvallite`, GitHub project paths and `g.dev/bonvallite` still expose an identifiable personal handle. Decide whether to keep technical proof links or replace with a neutral public showcase account.
- [ ] Existing `README.md` and project documentation mention the owner's name and outdated public résumé URL; these are public GitHub content, separate from production site metadata.
- [ ] Name-specific résumé was deleted from the branch, but external search caches, older deployments and repository history may persist.
- [ ] Full asset-content / embedded EXIF / PDF metadata audit not yet completed.
- [ ] Public site pages could not be fetched by web tooling, and direct Git clone was blocked by runtime DNS. Do not claim rendered-site verification.
- [ ] No npm test, safety scan, tsc or production build executed. Latest checked commit had no GitHub workflow runs reported; Vercel check was pending.

**Stage 1 release gate remains BLOCKED** pending the privacy decisions, full asset audit, build/test verification and public HTTP checks.
