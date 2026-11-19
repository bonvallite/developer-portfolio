---
name: python-automation-portfolio
description: Create, audit, document and showcase safe Python automation projects, Jupyter notebooks, CSV ingestion scripts and AI prototypes. Use when turning Python exercises or practical scripts into tested, reproducible GitHub portfolio projects or Vercel portfolio descriptions, especially ecommerce Google Search Console and Google Ads API exports, Samsung Health CSV merging and notebook-based AI demonstrations.
---

# Python Automation Portfolio

## Workflow
1. Inspect source notebooks, CSV schemas and scripts without executing untrusted cells.
2. Summarise functionality, dependencies, known defects, input and output requirements. Distinguish code inspection from execution.
3. Strip credentials, personal data, health records, employer-owned code, order information and internal URLs. Replace examples with synthetic fixtures.
4. Produce a standalone script with arguments, error reporting and provenance. Explain heterogeneous CSV concatenation does not align observations.
5. Write installation steps, limitations, validation records and a .gitignore.
6. Test with synthetic valid, malformed and title-row CSVs.
7. Inspect GitHub/Vercel destinations before writing. Publishing a skill to GitHub does not install it on Vercel.
8. Present Vercel skills as public portfolio case studies, not private-data processing services.

See scripts/merge_health.py (kept identical to projects/samsung-health-csv-merger/merge_samsung_health.py; a test checks this) and references/portfolio-checklist.md.
## Ecommerce analytics API extraction case study

When documenting Google Search Console, Google Ads, GA4 or Shopify data-extraction work:
1. Record the actual language and platform for each reviewed script; do not imply that one platform's code was inspected when it was not. The reviewed GSC workflow uses Python and Search Console API requests; Google Ads reporting was implemented with JavaScript. GA4 and Shopify measurement reconciliation is a separate analytical activity.
2. Describe OAuth credential refresh, reusable functions, API pagination, cached request results, structured CSV output, indexing inspection samples and dated reporting windows only where shown by the source.
3. Explain why exports matter: organic demand, non-branded discovery, product and collection visibility, devices, locations where the platform supports them, paid conversion signals, and reconciliation of tracked purchases with actual orders.
4. Distinguish a planned export list from successful extracts. Search Console may omit anonymised/low-volume queries; pagination does not ensure complete coverage. Label API-unavailable outputs, empty results and failures separately.
5. Audit full-month versus rolling-date boundaries, monthly position deltas, per-URL inspection retries, reconciled totals and the difference between URL scheme and an HTTPS security assessment.
6. Publish only independent demonstrations, generalised methodology and synthetic data. Never publish employer-owned scripts, raw customer exports, OAuth tokens, client account identifiers or private analytics data without permission.
7. Link the portfolio case study at /data-extraction-automation and keep claims consistent with code-review evidence. Do not claim production monitoring, measured sales uplift or verified full API extraction unless evidenced.
