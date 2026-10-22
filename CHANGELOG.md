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

## 2026-10-22 — Cybersecurity: Foundation of CERT Operations attendance training

- **Target:** `bonvallite/developer-portfolio`, `main` branch, Vercel `developer-portfolio` (production).
- **Affected files:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a responsive homepage cybersecurity training card and a detailed Experience-page record for the 12-hour Foundations of CERT Operations course attended 5–6 December 2023. The public heading uses the owner's requested title “Cybersecurity: Foundation of CERT Operations”. Clearly identified the evidence as a certificate of attendance, not an accredited professional certification; provided the organiser, training dates and evidence limitations.
- **Why:** Include verifiable professional development in cybersecurity without overstating the credential.
- **Documentation:** Updated inline JSX comments describing evidence provenance and public-document privacy, maintained responsive CSS commentary, and updated the README. The signed 2023 source PDF is deliberately not distributed publicly because it contains an issuer's digital signature.
- **Validation:** Inspected the supplied single-page certificate and the existing repository changelog, code, CSS comments, and conventions. Checked that the source changed with the intended course name, date, 12-hour duration, organiser, and attendance wording; this entry does not assert a completed TypeScript/build/browser test.
- **Pending checks:** Re-fetch committed files, review Vercel's production build and verify `/#certifications` and `/experience#training` at desktop/mobile sizes. Keep deployment status aligned with actual Vercel results.
- **Release:** Changes committed directly on `main` to trigger the project's Git-linked production deployment; final deployment status must be checked.
