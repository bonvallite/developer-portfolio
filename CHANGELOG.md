# Portfolio changelog

Entries record changes from 22 October 2026 onwards. Earlier repository history remains available in Git commits and pull requests.

## 2026-10-22 — Documentation as an engineering standard

- **Target:** `bonvallite/developer-portfolio`, Next.js portfolio for the existing Vercel project.
- **Affected files:** `ENGINEERING_STANDARDS.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `CHANGELOG.md`, `README.md`, `PORTFOLIO_INDEX.md`, `app/page.tsx`, `app/engineering-standards/page.tsx`, `app/globals.css`.
- **Change:** Added a public engineering-standard page, linked it from the homepage quality and skills sections, and documented the read-first, inline-documentation, changelog, validation and handover process. Added a reusable change record and PR checklist. Updated inline source comments for the new presentation and its dependencies.
- **Reason:** Make maintainability and traceability visible as essential parts of delivery, and give future changes an explicit documentation standard.
- **Validation:** Publication scan passed for 122 tracked files; 101 JavaScript tests and five Python tests passed; TypeScript checking, Next.js production build and Git whitespace checks passed. The built homepage and new route returned HTTP 200. Chromium checks at 1440px and 390px confirmed six standard cards, no horizontal overflow, a working homepage-to-standard link and no page exceptions or server errors. Desktop and mobile renders were visually reviewed. React review confirmed a static server component, stable list keys, decorative icon labels, semantic headings and scoped responsive CSS. Remote CI and release evidence are recorded in the associated pull request and deployment.
- **Scope:** The public example is fictional. Production Shopify theme source and private audit records are kept in their private systems. This entry does not certify the completeness of historical theme documentation.

## 2026-10-22 — Google Developer profile contact link

- **Target:** `bonvallite/developer-portfolio`, `main` branch, Vercel `developer-portfolio` project.
- **Affected files:** `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Added `https://g.dev/bonvallite` to the portfolio contact buttons alongside the existing GitHub, LinkedIn and email links; documented the link and inline external-link safeguards.
- **Reason:** Make the owner's public Google Developer profile accessible from the portfolio.
- **Validation:** Confirmed the original contact markup, added a unique HTTPS URL with `target="_blank"` and `rel="noopener noreferrer"`, and preserved the existing contact links. Remote saved-file check and deployment status are separate follow-up checks, not a claim of a completed browser test.
- **Release:** Committed to `main`; Vercel production deployment status to be confirmed.

## 2026-10-22 — Wikipedia contributor profile

- **Target:** `bonvallite/developer-portfolio` on `main`, connected to the Vercel portfolio project.
- **Affected files:** `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a Wikipedia contributor button linking to the public `Special:Contributions/Bonvallite` page, beside the Google Developer profile button. Existing social and contact links were preserved.
- **Reason:** Surface Wikipedia editing contributions as part of the portfolio's public professional presence, without asserting editor status, edit counts or article authorship beyond the linked history.
- **Inline documentation:** Existing contact-section comment documents public external destinations, independent ownership, and safe new-tab link attributes.
- **Validation:** Checked source before editing, used the supplied HTTPS URL and `noopener noreferrer`. Saved-file verification and deployed-site testing to be recorded separately; no build or browser test claimed at this stage.
- **Release:** Main branch commit; production deployment verification pending.
