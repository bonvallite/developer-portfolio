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
