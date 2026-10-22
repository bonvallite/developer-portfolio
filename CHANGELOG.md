# Portfolio changelog

Entries record changes from 22 October 2026 onwards. Earlier repository history remains available in Git commits and pull requests.

## 2026-10-22 — CartonCloud custom integration case study

- **Target:** `bonvallite/developer-portfolio`, public Next.js portfolio connected to Vercel.
- **Affected files:** `app/cartoncloud-integration/page.tsx`, `app/page.tsx`, `CARTONCLOUD_INTEGRATION.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a responsive CartonCloud serverless integration case study, a conceptual order-to-consignment-to-tracking diagram, structured evidence and QA boundaries, technical documentation, and a featured project link.
- **Reason:** Demonstrate custom Shopify API, fulfilment, serverless and delivery-date engineering without exposing employer source code or customer identifiers.
- **Validation:** GitHub file creation and content updates were confirmed. Production build, TypeScript, automated tests, publication scan and live Vercel deployment remain pending; no claims of completed production QA. Screenshot reviewed manually and omitted from publication because it contains real order identifiers.
- **Scope:** Portfolio only; no Shopify theme or production integration files changed.

## 2026-10-22 — Documentation as an engineering standard

- **Target:** `bonvallite/developer-portfolio`, Next.js portfolio for the existing Vercel project.
- **Affected files:** `ENGINEERING_STANDARDS.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `CHANGELOG.md`, `README.md`, `PORTFOLIO_INDEX.md`, `app/page.tsx`, `app/engineering-standards/page.tsx`, `app/globals.css`.
- **Change:** Added a public engineering-standard page, linked it from the homepage quality and skills sections, and documented the read-first, inline-documentation, changelog, validation and handover process. Added a reusable change record and PR checklist. Updated inline source comments for the new presentation and its dependencies.
- **Reason:** Make maintainability and traceability visible as essential parts of delivery, and give future changes an explicit documentation standard.
- **Validation:** Publication scan passed for 122 tracked files; 101 JavaScript tests and five Python tests passed; TypeScript checking, Next.js production build and Git whitespace checks passed. The built homepage and new route returned HTTP 200. Chromium checks at 1440px and 390px confirmed six standard cards, no horizontal overflow, a working homepage-to-standard link and no page exceptions or server errors. Desktop and mobile renders were visually reviewed. React review confirmed a static server component, stable list keys, decorative icon labels, semantic headings and scoped responsive CSS. Remote CI and release evidence are recorded in the associated pull request and deployment.
- **Scope:** The public example is fictional. Production Shopify theme source and private audit records are kept in their private systems. This entry does not certify the completeness of historical theme documentation.
