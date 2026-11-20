# Portfolio changelog

## 2026-11-20 - Back up and rebuild the cinematic JRV portfolio on a protected branch

- **Scope:** `bonvallite/developer-portfolio`; backup `backup/2026-11-20-pre-cinematic-rebuild` at `cbb656e9`; proposed branch `redesign/2026-11-20-cinematic-portfolio`. Production unchanged until review.
- **Affected files:** `app/components/ServicePage.tsx`, `app/components/cinematic-service.css`, `app/page.tsx`, `app/cinematic-home.css`, `app/components/HomeJourney.tsx`, `app/components/LeadComposer.tsx`, `app/components/QuickContactDock.tsx`, `app/components/ConsentManager.tsx`, `app/components/consent-manager.css`, `app/layout.tsx`, `app/globals.css`, `app/privacy/page.tsx`, `next.config.ts`, `tests/site-analytics.test.mjs`, `tests/cinematic-home.test.mjs`, `tests/homepage-browser-qa.mjs`, `scripts/check-seo-publication.mjs`, `.github/workflows/portfolio-ci.yml`, `docs/portfolio-rebuild-2026-11-20.md`, `docs/analytics-consent-audit-2026-11-19.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Replace the crowded homepage with a wider JRV cinematic storefront-to-systems narrative, four project stories, four redesigned indexed service landing pages, interactive approach, employer and client pathways and direct enquiry composer with copy-email fallback. Add contextual project CTA on internal routes. Replace initial GTM/Clarity/Vercel tracking with explicit consent, remove the render-blocking Google Fonts stylesheet and unused remote screenshot preconnect, and apply privacy and frame-protection response headers. Add homepage and privacy regression tests and browser screenshot QA.
- **Reason:** Improve clarity, professional credibility, lead conversion, performance posture, responsive accessibility and data minimisation without publishing client data or fake growth figures.
- **Validation:** Backup branch verified; initial PR #81 standard checks and Chrome QA passed. A subsequent service-page and screenshot-capture refinement requires fresh CI and visual review before merge. Private assets, public Git history, live third-party tags and real Core Web Vitals remain independently unverified; see audit document. No public zero-leaks guarantee.

## 2026-11-20 - Add visible architecture diagram and functional analytics dashboard demo

- **Repository and branch:** `bonvallite/developer-portfolio`, `feature/analytics-visual-demo-20261120`, based on latest `main` at branch creation.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/data-extraction-automation/visual-demo.tsx`, `app/data-extraction-automation/visual-demo.css`, `tests/case-study-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, `README.md`, `CHANGELOG.md`.
- **Change:** Add clearly visible, clickable architecture diagram covering six platforms and four processing stages, plus a realistic responsive fictional reporting dashboard with source-specific KPI cards, trend bars, CSV tables, a sample-period selector, and a client-side fictional CSV download. Promote “Try interactive demo” as the hero CTA. Keep the existing architecture explanation, walkthrough, and 17-file code explorer.
- **Why:** The published case study only had a static text-heavy platform diagram and code explorer; users could not find a tangible reporting mock-up or testable end-to-end visual flow.
- **Privacy and fidelity:** All dashboard data and exports are explicit fictional local fixtures. No live tokens, customer metrics, employer APIs, or claims of verified exports. The Shopify sample is a separate illustrative reporting handover, not verified GraphQL extraction.
- **Validation:** Added browser assertions for all six source nodes, pipeline stages, data switching, period selection and fictional CSV download across desktop, tablet and mobile. GitHub Actions and Vercel preview validation required before release.

## 2026-11-20 - Classic résumé editorial layout refinement
- **Repository and branch:** `bonvallite/developer-portfolio`, `design/classic-resume-refinement-20261120`.
- **Affected files:** `app/resume/resume.css`, `app/resume/resume-export.ts`, `README.md`, `CHANGELOG.md`.
- **Why:** The Classic résumé's full-width dark header and generic content treatment were visually heavy and insufficiently polished for direct employer presentation.
- **Changes:** Replaced its HTML preview's solid teal masthead with ivory paper, a restrained teal ribbon, serif name, subtle gold rule, better contact hierarchy, role/dates separation, and section dividers. Aligned Classic PDF's first-page masthead with white-paper typography and teal accents, and gave Classic Word a serif title and understated section rules. ATS format and approved career content remain unchanged.
- **Validation:** Source reviewed before editing; GitHub Actions checks, live deployment and rendered PDF/Word visual validation to be verified before claiming release complete.


## 2026-11-20 - Add analytics case study to the XML sitemap

- **Repository and branch:** `bonvallite/developer-portfolio`, `fix/analytics-case-study-sitemap-20261120` (from latest `main`).
- **Files:** `app/sitemap.ts`, `scripts/check-seo-publication.mjs`, `app/data-extraction-automation/page.tsx`, and `CHANGELOG.md`.
- **Change:** Add the publicly released `/data-extraction-automation` page to the sitemap; introduce a regression check for its sitemap inclusion and self-referencing canonical. Correct case-study inline comments to reflect the published sanitised code archive and its limitations.
- **Reason:** The deployed case study has valid metadata and a canonical but was missing from sitemap discovery. Avoid overwriting newer changes.
- **Validation:** Source inspection confirmed the missing route and valid canonical. CI and Vercel preview checks are required before merge; no production files changed in this branch.

## 2026-11-20 - Resume presentation and export overhaul
- **Target:** `bonvallite/developer-portfolio`; branch `design/resume-editorial-refresh-20261120`.
- **Affected:** `app/resume/page.tsx`, `app/resume/resume.css`, `app/resume/resume-export.ts`, `README.md`, `CHANGELOG.md`.
- **Why:** Both résumé variants lacked considered typography and spacing; Classic PDF placed a decorative sidebar across the body text region, and mobile previews were forced to a wide desktop minimum.
- **Change:** Rebuilt HTML preview spacing and responsive layout, established distinct deep-teal Classic and restrained ATS visual identities, replaced PDF's overlapping sidebar with a full-width editorial header, added safe continuation-page headers and folios, improved Word typography, preserved readable bullet markers in generated PDF text, and clarified résumé chooser copy. All versions retain the existing approved shared career data.
- **Validation:** Source inspected; automated tests, type checking, production build and live-route verification pending.


## 2026-11-20 - Complete ATS-friendly download URL and filename

- **Files:** `app/resume/page.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `scripts/check-seo-publication.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Canonical public ATS paths are `/resume/ats`, `/resume/ats/pdf`, and `/resume/ats/word`; both files download as `JRV-Resume-ATS-Friendly-2026` with the appropriate extension. Legacy `/resume/modern` and its download URLs remain valid but now use the same ATS-friendly export and filename.
- **Reason:** Remove ambiguous “Modern” filenames while preserving existing bookmarks and limiting the chooser to two unambiguous PDF download actions.
- **Validation:** Check GitHub CI, all old and new HTTP routes, download content types, PDF author and creator properties and DOCX core-properties, and Vercel production aliases. `scripts/check-seo-publication.mjs` explicitly validates only permitted `classic|modern|ats` variants.


## 2026-11-20 - Simplify résumé downloads and attribute document metadata accurately

- **Affected files:** `app/resume/page.tsx`, `app/resume/resume.css`, `app/resume/resume-export.ts`, `app/resume/layout.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `README.md`, `CHANGELOG.md`.
- **Purpose:** Give employers two unambiguous primary PDF buttons: ATS-Friendly Resume and Classic Resume. Keep browser previews and editable Word options as secondary actions.
- **ATS file:** Conventional single-column, real text and standard headings. Removed PDF decorative rule, header ornaments and heading bars from the ATS variant. Keep the Classic teal variant distinct.
- **Document properties:** PDF Info now includes the user's approved name as Author and uses the truthful JRV Portfolio Resume Export service as Creator/Producer. DOCX package contains a core-properties Author and Last Modified By set to the owner, descriptive Title, Subject and Keywords, and an application property describing the actual export service. Do not invent a named human editor, Microsoft Word, Adobe or another tool as document producer.
- **Privacy:** No new AI-platform provenance strings or source paths included in downloadable documents. This is not a claim that an AI-assisted drafting process never occurred; the repository revision history is unchanged. Continue `noindex, noarchive` on public download files and résumé pages.
- **Compatibility:** Existing paths `/resume/modern/pdf`, `/resume/classic/pdf`, and Word/preview variants remain valid. Legacy `public/JRV-Resume.pdf` and original archived backup remain untouched.
- **Validation:** GitHub source and tests, TypeScript and production build, live export response status, file signatures, PDF metadata and text content, and DOCX metadata checks required before marking production complete. ATS-friendliness is a design objective, not a guarantee from every ATS provider.


## 2026-11-20 - Publish classic and modern resume options (American English)

- **Files:** `app/resume/resume-data.ts`, `app/resume/resume-export.ts`, `app/resume/resume.css`, `app/resume/layout.tsx`, `app/resume/page.tsx`, `app/resume/[design]/page.tsx`, `app/resume/[design]/[format]/route.ts`, `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Add two accessible on-site resume layouts (original-inspired Classic / modern editorial), generate public PDF and editable DOCX downloads on demand from one shared career-data module, and update portfolio navigation to present both choices.
- **Content:** American English; independent Shopify role January 2019–February 2026; Peter Augustus February 2026–present; owner-approved public email and telephone.
- **Privacy:** Resume preview routes have explicit `noindex` metadata and downloadable files emit `X-Robots-Tag: noindex, noarchive`. This is a discoverability signal, not access control. Public-facing search metadata remains skills-led.
- **Preservation:** The original `public/JRV-Resume.pdf` and separately archived `backups/resumes/JRV-Resume-2026-Original.pdf` remain unchanged for recovery and old links. New downloads are served under `/resume/{classic|modern}/{pdf|word}`.
- **Validation:** Require GitHub CI (publication-safety scan, tests, TypeScript and production build) and live HTTP, PDF/DOCX format and correct-content checks before claiming release.


## 2026-11-20 - Archive original résumé before approved US English revision

- **Target:** `bonvallite/developer-portfolio`, branch `backup/resume-original-before-us-2026`.
- **Files:** `backups/resumes/JRV-Resume-2026-Original.pdf`, `CHANGELOG.md`, `README.md`.
- **Change:** Preserved the exact 323,929-byte original public résumé at `backups/resumes/JRV-Resume-2026-Original.pdf` by reusing existing Git blob `a7d4648238f748f625004890bb8aac4b5443915b`. The active `public/JRV-Resume.pdf` remains unchanged until the approved 2026 American English two-page PDF can be uploaded and verified.
- **Why:** Maintain an explicitly named recovery copy in addition to Git history before replacing the public download.
- **Privacy:** The archived original can contain identifying and out-of-date contact details. This backup is in the public repository, not linked from the website; GitHub repository access can still expose it.
- **Validation:** Verified original file path, blob SHA and file size from latest main Git tree, then created the archive path using that same blob with no content modifications. Website and production PDF replacement remain pending.


## 2026-11-19 - Reconcile case study with current production homepage and professional links

- **Target:** `bonvallite/developer-portfolio`, PR #39; `main` commit `2456b99b564b906dde2de29c5a9bd94e9abacf26`.
- **Files:** `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Preserved newer homepage rotation, restored JRV identity, professional links and résumé, new B2B pages, while adding the analytics case study to the latest project evidence layout. Reconciled both changelog histories.
- **Reason:** Avoid overwriting unrelated work during release.
- **Validation:** Full CI required on reconciled branch. No theme files or customer records changed.

## 2026-11-19 - Complete local-browser QA for analytics case study

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, PR #39. No production merge or manual Vercel deployment.
- **Affected files:** `tests/case-study-browser-qa.mjs`, `.github/workflows/portfolio-ci.yml`, `app/data-extraction-automation/interactive-lab.tsx`, `CHANGELOG.md`.
- **Change:** Added Playwright Chrome QA on a locally served Next.js build for desktop (1440×900), tablet (768×1024), and mobile (390×844). Checks route/structured output, the cinematic hero, absence of horizontal overflow, interactive lesson and code-tab controls, 17-file archive display, archive URL response and JavaScript page errors. Uploaded full-page screenshots as a seven-day GitHub Actions artifact.
- **Fix identified by browser QA:** Corrected the lesson tuple's positional mapping: `[stage, heading, description, deliverable]`. Previously the component displayed the description as the heading and omitted the deliverable.
- **CI configuration:** Replaced unsupported Playwright browser installation on Ubuntu 26.04 with an Ubuntu 24.04 runner and the runner-provided Chrome browser. Browser checks are restricted to this feature branch's pull requests to limit unrelated CI work.
- **Validation:** GitHub Actions run [#44529578132](https://github.com/bonvallite/developer-portfolio/actions/runs/44529578132) passed baseline SEO/privacy, publication safety, JavaScript/Python tests, TypeScript, production build and all three browser viewport checks. GitHub artifact `case-study-browser-qa` contains `desktop-full.png`, `tablet-full.png`, and `mobile-full.png`; downloaded and visually reviewed. External Vercel preview exists for merge commit `ef8bf211`, but the current post-QA changes were tested locally in GitHub, not deployed to production.

## 2026-11-19 - Merge analytics pipeline case study with current homepage work

- **Target:** `bonvallite/developer-portfolio`, `feature/google-analytics-api-portfolio-20261119`, PR #39.
- **Scope:** homepage selected-work case study card and matching project-evidence mapping; experience page link; case-study route and interactive lab; sanitised Python archive; README and Python portfolio documentation.
- **Resolution:** Retain current `main` homepage rotation/gallery, project storytelling and experience storefront showcases; introduce only the analytics project and source-safe links. Reconcile the two changelog branches without dropping either history.
- **Validation:** Source-level merge conflict review, no private data added. GitHub Actions must rerun on reconciled commit; release remains draft and unmerged.

## 2026-11-19 - Restore portfolio CI trigger and confirm merge blocker

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39.
- **Affected files:** `.github/workflows/portfolio-ci.yml`, `CHANGELOG.md`.
- **Change:** Restored the standard `main`-only push trigger while retaining the existing `pull_request` trigger. The temporary feature-branch push trigger had been used to obtain a complete GitHub Actions validation run.
- **Reason:** Keep normal CI conventions and avoid ongoing duplicate branch push workflows after successful verification.
- **Validation:** GitHub Actions run #44520783303 passed the safety, SEO, JavaScript unit, Python unit, TypeScript and Next.js build checks on commit `0e753407`. Archive readback contains 17 Python files and a targeted scan found no personal Windows paths, email addresses, or known employer identifiers. GitHub PR API currently reports `mergeable_state: dirty`, so this branch is **not merge-ready**; conflicts against `main` still require resolution. No production merge was performed.

## 2026-11-19 - Publish sanitised Python source and interactive cinematic case study (GitHub only)

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39, no approved production merge.
- **Affected files:** `public/case-studies/ecommerce-analytics/sanitised-python-source-archive.md`, `app/data-extraction-automation/interactive-lab.tsx`, `app/data-extraction-automation/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the full content of 17 owner-uploaded Python scripts in a public, sanitised Markdown archive; added a five-stage educational walkthrough, selectable Python code examples and explanations, and a CSS-only cinematic pipeline visual. Linked the archive from the interactive case study and documented the important limits.
- **Why:** Communicate the real engineering process from business requirements to API-based delivery, and make substantial Python work inspectable without publishing private client identifiers or raw datasets. Keep the page lightweight and accessible.
- **Documentation:** Added source-provenance and confidentiality comments in the code; updated README to reflect that the sanitised scripts are now publicly available rather than withheld.
- **Sanitisation:** Replaced the GA4 property ID, Search Console site/property, employer brand search expressions and Windows user paths with example values. No OAuth client secrets, access tokens or raw customer data were uploaded. The source is educational and not configured to run against live systems as provided.
- **Validation:** Confirmed GitHub content readback for the case-study page, interactive component and archive; scanned those files for known private identifiers; confirmed 17 Python sections in the source archive. TypeScript, npm tests, public-safety script, production build and browser QA remain **unverified** in this session. GitHub commits can automatically trigger Vercel previews even though no direct Vercel operation was requested.
- **Release:** Draft PR only; no merge to main.

## 2026-11-19 - Rebuild extraction case study as problem-to-solution story (GitHub only)

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, draft PR #39. No merge or manual Vercel action.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `CHANGELOG.md`.
- **Change:** Replaced the text-heavy case study with a five-stage editorial narrative, platform favicon/source architecture, lightweight native HTML interactive code disclosures, output catalogue, clear CTA links and responsive dark/gold styling. Updated GA4 statements using the 10 source-reviewed Python modules. Added Bing as a documented extraction platform, with Shopify/Klaviyo kept distinct from verified API scripts.
- **Reason:** Show how an original 12-month business reporting brief became a documented multi-platform data engineering workflow, without consuming client-side UI resources or publishing client data.
- **Inline documentation:** Records public-safe code provenance, external favicon loading, source limits, and distinction between Shopify GraphQL / Bash skills and unverified involvement in this particular extraction.
- **Validation:** GitHub source inspection and type-oriented static review before write. Full local tests, safety scanner, TypeScript compilation, browser QA and any Vercel build have not been run here. Feature branch only. Note that automatic Vercel integration may still create a preview from GitHub commits.

## 2026-11-19 - Clarify 12-month cross-platform extraction purpose

- **Target:** `bonvallite/developer-portfolio`, review branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/page.tsx`, `CHANGELOG.md`.
- **Change:** Repositioned the case study as a 12-month, multi-dataset workflow covering GA4, Search Console and Google Ads, and revised the featured project description. Documented distinct platform methods and dataset types rather than implying a single Python script implements all three.
- **Reason:** Explain the business purpose of extracting detailed underlying data rather than screenshots or dashboard summaries.
- **Documentation:** Updated inline comments separating independently inspected GSC Python and Ads JavaScript sources from user-reported GA4 API configuration. Preserved confidentiality and limitations.
- **Validation:** Source and saved content checked; latest Vercel preview build and CI must be confirmed before release. No production merge.


## 2026-11-19 - Display Python ranking calculation on Vercel case study

- **Target:** `bonvallite/developer-portfolio`, branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `CHANGELOG.md`.
- **Change:** Embedded a read-only, formatted excerpt from the owner-supplied Search Console Python `fetch_monthly_keywords()` function, with a mobile-scrollable code panel and explanation of impression-weighted search position and observed-period changes.
- **Reason:** Let prospective employers and clients inspect real Python logic, alongside the business purpose of the resulting SEO dataset.
- **Inline documentation:** Added component comments identifying the provenance, read-only display and dependency on the private `get_daily_query()` helper. The portfolio does not run the script or connect to Google accounts.
- **Safety and validation:** Source-specific identifiers, private data and credentials omitted. GitHub file retrieval and updated commit must be checked; full automated tests, browser/mobile QA and Vercel build remain separately verifiable.
- **Release:** Feature branch only, no production merge.


## 2026-11-19 - Showcase ecommerce API extraction and data value

- **Target:** `bonvallite/developer-portfolio`, review branch `feature/google-analytics-api-portfolio-20261119`, Vercel preview only.
- **Affected files:** `app/data-extraction-automation/page.tsx`, `app/page.tsx`, `app/python-automation/page.tsx`, `app/experience/page.tsx`, `skills/python-automation-portfolio/SKILL.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a public-safe case study of Python Google Search Console API exports and JavaScript Google Ads reporting scripts; described authentication, pagination, CSV exports, data limitations and value for ecommerce SEO, paid media and conversion measurement. Linked it from projects, skills, Python and experience sections; extended reusable documentation.
- **Reason:** Make demonstrated scripting, technical depth and the practical value of resulting datasets visible to potential employers and clients.
- **Inline documentation:** Added context and confidentiality notes in the case study and homepage, and kept reusable skill and README aligned.
- **Validation:** Reviewed source descriptions and repository contents prior to writes; code execution, CI, safety scan, Next.js build and Vercel preview verification must be reported after remote checks. Do not infer successful business exports or production release.
- **Release:** Review branch only; no merge or production deployment authorised.


## 2026-11-19 - Restore owner-requested résumé, professional profiles and webmail shortcut
- **Target:** `bonvallite/developer-portfolio`, `fix/restore-jrv-professional-links-webmail-resume` based on `main`.
- **Affected files:** `app/page.tsx`, `app/experience/page.tsx`, `public/JRV-Resume.pdf` (restored unchanged from historical Git blob), `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Reason:** The 18 November privacy-led cleanup intentionally removed these links and the original name-specific résumé PDF. The site owner explicitly requested their return.
- **Change:** Restore the archived résumé under a neutral filename; display résumé links in homepage navigation, contact and Experience; restore previously used LinkedIn, Google Developer and Wikipedia destinations; add an authorised-user webmail login at `https://webmail.jrvallite.com/`, separate from public email enquiries to `hello@jrvallite.com`.
- **Privacy:** Public profile links and the historic résumé may still identify the portfolio owner. The original document's details have not been rewritten, and its internal email may be out of date. Preserve name-free SEO metadata and existing sensitive-information guards.
- **Validation:** Compared source against historical commit `caf282f`, confirmed historic PDF Git blob `a7d4648` and verified the newly restored path points to that exact 323,929-byte blob in Git tree `5a9eb8b`. Confirmed the four contact/profile destinations, separate webmail shortcut and retained domain email in source. CI and Vercel deployment checks to follow.



## 2026-11-19 - Cinematic Shopify B2B modernisation case study
- **Branch:** `feature/cinematic-b2b-final-mainline-20261119`, based on current `main` to preserve later portfolio/SEO fixes.
- **Files:** `app/b2b-modernisation/page.tsx`, `app/b2b-modernisation/CinematicB2B.tsx`, `app/b2b-modernisation/cinematic.css`, `app/page.tsx`, `tests/b2b-cinematic.test.mjs`, `CHANGELOG.md`.
- **Change:** Five cinematic charcoal-and-gold chapters: before/after, contextual Markets/Catalogues, fictional price laboratory and eligibility switch, six-step buyer workflow, and historical business impact. Added a homepage case study link.
- **Reporting:** Legacy exact `wholesale`, `wg_wholesale`, `WholesalePA1` order tags are deduplicated and use exported eligible order values less refund snapshots; broader customer-tag evidence is optional. Shopify native B2B net sales is a separate accounting definition, never summed with legacy. July go-live is user-reported, not independently dated. A$10,000 incremental monthly scenario is explicitly hypothetical.
- **Commercial comparison:** AOV and returning customer rate figures are supplied as distinct customer cohort data and kept separate from native B2B ShopifyQL history. No verified causal conversion, revenue, or app-saving claims.
- **Docs and accessibility:** Existing global theme stays unchanged. Route CSS is scoped, responsive, keyboard-focused, reduced-motion aware; interaction comments explain limitations. No new packages, credentials, private customer identities, or real merchant catalogue prices.
- **Verification:** Automated checks cover chapters, data boundaries, SEO and reduced motion; GitHub publication safety, test suites, TypeScript and Next.js production build must pass before merge/release. Vercel publication is subject to platform deployment quota.


## 2026-11-19 - Correct public wordmark to JRV
- **Target:** `bonvallite/developer-portfolio`, branch `fix/replace-ec-wordmark-with-jrv-20261119`.
- **Affected files:** `app/page.tsx`, `app/layout.tsx`, `app/cartoncloud-integration/page.tsx`, `app/conversion-audit/page.tsx`, `app/RotationArchive.tsx`, `README.md`, `CHANGELOG.md`.
- **Change and reason:** Replaced the mistaken EC. wordmark with user-confirmed JRV throughout visible navigation and archive elements. Aligned footer and site metadata with JRV while retaining Shopify Commerce Engineering as a descriptive service label. Preserved the original `{JRV}` favicon and public contact email `hello@jrvallite.com`.
- **Validation:** Reviewed each affected source file and its comments before editing; CI and deployment verification to follow the commit.


## 2026-11-19 - EC. public branding, {JRV} favicon and domain email
- **Target:** `bonvallite/developer-portfolio`, branch `fix/brand-ec-jrv-favicon-contact-email-20261119`, Next.js/Vercel portfolio.
- **Affected files:** `app/page.tsx`, `app/privacy/page.tsx`, `app/layout.tsx`, `README.md`, `scripts/public-safety-allowlist.json`, `CHANGELOG.md`.
- **Change:** Confirmed EC. is the public website wordmark; retained the original approved {JRV} gold-on-charcoal browser favicon unchanged in `app/icon.svg`. Replaced three homepage role/project mailto destinations and one privacy enquiry mailto destination from the retired personal Gmail address to `hello@jrvallite.com`. Updated nearby source comments and current-brand documentation.
- **Reason:** Keep the visible company-style identity and contact address consistent, while preserving the separately approved favicon and privacy-led SEO.
- **Validation:** Audited public Next.js routes, root layout, existing favicon and contact links; verified the four old mailto destinations before replacement. Initial GitHub safety scan flagged the new public domain email; the exact-match safety allowlist was updated to the newly approved address. GitHub Actions, build and live Vercel verification recorded separately following commit.
- **Release:** Changes staged for PR; do not claim production until Vercel confirms the matching commit as READY.


## 2026-11-19 - Rebase homepage discovery link onto current production source

- **Target:** `bonvallite/developer-portfolio`, feature branch `feat/gift-packaging-homepage-link-current-20261119`, based on `main` commit `8c8828c`.
- **Affected files:** `app/page.tsx`, `CHANGELOG.md`.
- **Change:** Added a selected-work homepage callout linking to the existing independent fictional `/gift-packaging-reference` demo, preserving newer homepage changes made after the original PR #40 branch.
- **Reason:** Make the published gift packaging demonstration discoverable to employers and clients without overwriting 17 newer commits on `main`.
- **Inline documentation:** Comment beside the callout explains its independent authorship and lack of merchant checkout/payment access.
- **Validation:** Exact insertion anchor and internal link confirmed by source inspection. GitHub Actions, Next.js build, safety checks, Vercel preview and browser/mobile navigation to be verified after push.
- **Release/recovery:** Review branch only; revert this scoped commit to remove the homepage link while retaining the independent demo route.


## 2026-11-18 - Align Fieldstone gift packaging demo with portfolio palette

- **Target:** `bonvallite/developer-portfolio`, review branch `feat/fieldstone-gift-packaging-20261118`, Vercel preview only.
- **Affected files:** `public/gift-packaging-reference/index.html`, `app/gift-packaging-reference/page.tsx`, `CHANGELOG.md`.
- **Change:** Updated the isolated demo's palette and typography to match the public portfolio: charcoal `#0B0E12`, warm gold `#D9B47C`, cream-white text, muted greys, DM Sans, and Space Grotesk. Styled tabs, gift card, buttons, panels, drawer, controls, focus states, and mobile layouts. Matched the Next.js iframe page backdrop to avoid a light surround.
- **Reason:** The previous cream/white and brown theme was visually inconsistent with the portfolio.
- **Inline documentation:** Updated the embedded stylesheet ownership comments and Next.js iframe documentation. No cart logic, merchant integration, or live Shopify theme was changed.
- **Validation:** Source-only CSS/palette and page wrapper review before commit; full browser desktop/mobile QA and Vercel preview validation are pending. Existing prototype validation limitations still apply.
- **Release/recovery:** Draft PR #38 only; revert this style-only commit to restore the original demo appearance.


## 2026-11-18 - Add independent Fieldstone gift packaging cart demonstration

- **Target:** Public Next.js developer portfolio, feature branch `feat/fieldstone-gift-packaging-20261118`, Vercel preview only.
- **Affected files:** `app/gift-packaging-reference/page.tsx`, `public/gift-packaging-reference/index.html`, `CHANGELOG.md`.
- **Change:** Added a standalone, fictional six-view gift packaging demonstration with shared in-memory cart state, optional priced packaging, quantity limit of one, removal when the last ordinary product is removed, simulated checkout and example order email. The Next.js route isolates the demo in an iframe; no live Shopify endpoints are called.
- **Reason:** Present the complete customer-facing cart journey as an interactive technical portfolio example without exposing private merchant implementation.
- **Inline documentation:** The page explains sandbox isolation; the HTML script documents its owned cart state and lack of network requests.
- **Validation performed:** Standalone JavaScript syntax validated with `node --check`; ZIP integrity verified. Full Next.js test suite, public safety scan, TypeScript check, build, browser desktop/390px QA, and Vercel preview readiness remain pending.
- **Release/recovery:** Proposed feature branch only, not merged; revert this feature commit to remove the new route and static asset.


Entries record changes from 22 October 2026 onwards. Earlier repository history remains available in Git commits and pull requests.

## 2026-11-16 - Relocate Microsoft Clarity to document head without duplicate tracking

- **Target:** `bonvallite/developer-portfolio`, Vercel `developer-portfolio` (team `my-dojo`, project `prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`), feature branch `fix/clarity-head-single-install-20261116`, public portfolio domain `www.jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Relocated the existing Microsoft Clarity loader for public project `zekmhvjftc` from `next/script` with `afterInteractive` in the layout body into exactly one server-rendered native inline `<script>` in the shared document `<head>`, retaining the exact owner-provided asynchronous loader. Removed the old instance and its now-unused import. Kept GTM `GTM-KVJVH4VM` and Vercel Analytics intact.
- **Reason:** The owner requested the Clarity snippet again, after specifically asking about `<head>` placement. It was already installed; relocation rather than duplicate insertion meets that placement preference while avoiding two trackers.
- **Inline documentation:** Updated comments beside the script to describe the single owner, external async loader, duplicate risks and visitor consent dependency; revised README and site-analytics assertions to cover head placement and no duplicate Clarity instance.
- **Privacy:** No consent-management or visitor privacy notice was added. Verify applicable consent and the Clarity workspace configuration separately. Clarity may also be configured through GTM, which is outside the repository audit.
- **Validation:** GitHub PR #33 completed successfully. CI run `43886662462` passed the publication safety scan, JavaScript and Python tests, TypeScript checks, and Next.js production build. Vercel preview and production deployment returned `READY`. Authenticated HTTP checks returned 200 on both the production deployment URL and `https://www.jrvallite.com/`. Both rendered HTML responses contain exactly one native `<script id="microsoft-clarity">` in `<head>`, the correct project ID and async loader, no duplicate Clarity script element in `<body>`, and the existing GTM container. Browser network capture and the Clarity dashboard have not been checked; data arrival and consent behaviour therefore remain unverified.
- **Release and recovery:** Merged pull request #33 as commit `445032e8d5a184bdb39decf6f654b386731c3438`. Vercel production deployment `dpl_EWw5rLVQcdjfFweQc94zqvPjd9Ck` is READY. Revert the scoped head relocation to restore the previous body `afterInteractive` behaviour without touching GTM or Vercel Analytics.

## 2026-11-16 - Add Google Tag Manager to portfolio document head

- **Target:** `bonvallite/developer-portfolio` Next.js root layout, Vercel `developer-portfolio` (`prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`), team `my-dojo`, feature branch `feat/gtm-kvjvh4vm-20261116`, intended production domain `jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `scripts/public-safety-allowlist.json`, `README.md`, `CHANGELOG.md`.
- **Change:** Installed the owner's Google Tag Manager container `GTM-KVJVH4VM` once for all routes, preserving their provided asynchronous `gtm.js` URL and `dataLayer` / `gtag('js', new Date())` initialisation. Initially tried Next.js `beforeInteractive`, but preview HTML showed only a GTM preload in `<head>` and its script execution queue in `<body>`. Corrected the implementation to two native HTML script elements immediately within the explicit shared root `<head>`, matching Google's manual placement requirement.
- **Reason:** Enable the requested sitewide Google tag without repeated per-page insertion, while preserving existing independent Clarity and Vercel Analytics integrations.
- **Inline documentation:** Updated root layout comments to explain direct `<head>` placement, the preview-discovered `beforeInteractive` limitation, duplication avoidance and privacy dependencies. Expanded site analytics tests, README instructions and the allowlist explanatory JSON comment.
- **Privacy/scope:** Does not add a consent manager or modify GTM's published workspace, its tags, triggers, destinations, or conversion configuration. Verify notice and consent obligations separately. Google no longer requires a separate `noscript` iframe in the new manual snippet provided.
- **Safety and validation:** The first CI scan flagged the public GTM ID. A narrowly scoped exact-string allowlist entry for `GTM-KVJVH4VM` fixed this without relaxing other rules. The final GitHub Actions CI run `43884589048` passed the publication scan, JavaScript tests, Python tests, TypeScript checks, and Next.js production build. The final Vercel preview returned HTTP 200 and showed one actual async `gtm.js` script and inline `dataLayer` initialiser inside the server-rendered `<head>`. The production build also returned READY. An authenticated live URL fetch of `https://www.jrvallite.com/` returned HTTP 200 with those same two head elements, one external GTM loader, and the expected ID. `https://jrvallite.com/` returned an existing HTTP 308 redirect to the www domain. Google Tag Assistant, downstream measurement, and consent behaviour have not been browser-tested.
- **Release:** Pull request #32 merged to `main` as commit `e0dbcf6eae8d5b642dde0f59f8538139b00ff527`. The production deployment `dpl_EtxckU1Z6hqq5gRCo5Z9dinshapT` reached READY and was verified through its deployment URL and the live www domain.
- **Recovery:** Revert only the GTM `<head>` script elements and related documentation/tests and narrow public-ID allowlist entry; retain Clarity and Vercel Analytics.

## 2026-11-16 - Sitewide Microsoft Clarity installation

- **Target:** `bonvallite/developer-portfolio` (Next.js), feature branch `feat/microsoft-clarity-zekmhvjftc-20261116`, Vercel project `developer-portfolio`, team `my-dojo`, intended public portfolio domains `jrvallite.com` and `www.jrvallite.com`.
- **Affected files:** `app/layout.tsx`, `tests/site-analytics.test.mjs`, `README.md`, `CHANGELOG.md`.
- **Change:** Added the owner's supplied Microsoft Clarity loader and public project ID `zekmhvjftc` using Next.js `Script` with `afterInteractive` from the shared root layout. Existing Vercel Analytics remains present. Added a small regression test for one script instance, the correct tag URL and project ID.
- **Reason:** Enable sitewide behaviour analytics for the developer portfolio without duplicating script injection across pages or blocking initial HTML.
- **Inline documentation and dependencies:** The root layout comments identify the loader's sitewide scope, public ID, and privacy/consent requirement. The README documents the loading strategy, how to avoid duplicate tags, and post-deployment verification.
- **Privacy boundary:** This change does not add a consent-management system, gate tracking on consent, or publish a privacy notice. Review the published notice and jurisdiction-specific consent requirements before interpreting visitor recordings.
- **Validation:** Source-level assertions and CI test added; verify GitHub Actions, Vercel preview/production build, live network request, and Clarity dashboard independently. Do not treat successful source writes as proof that tracking is active.
- **Recovery:** Revert the scoped layout, test and documentation changes if the tracker must be disabled; preserve the pre-change Vercel Analytics component.

## 2026-10-24 - Conversion journey case study and public carousel

- **Target:** `bonvallite/developer-portfolio`, Vercel `developer-portfolio` production, team `my-dojo`.
- **Affected files:** `app/conversion-audit/page.tsx`, `app/page.tsx`, `public/portfolio/shopify-conversion-journey.pdf`, `README.md`, `CHANGELOG.md`.
- **Change:** Expanded the existing conversion case study with the six-stage journey, Shopify Analytics, GA4, Clarity, source inspection, delivered improvements, developer-reported QA, and explicit open measurement items. Added a public nine-slide portrait PDF and a stable download link. Refreshed the homepage project summary.
- **Reason:** Show the progression from diagnosis to implementation and production validation for Shopify owners and hiring teams.
- **Publication:** Created a separate public PDF excluding internal conversion figures, traffic counts, and private audit attachments. No proprietary code, production IDs, or customer information added. Reported operational QA is distinct from portfolio checks and measured commercial uplift.
- **Inline documentation:** Added source comments documenting public PDF ownership, evidence provenance, backend rule boundaries, and alignment of the homepage, case study, and download.
- **Validation:** 104 JavaScript tests and 16 Python tests passed. Publication scan passed for 143 tracked files. TypeScript, Next.js production build, and Git whitespace checks passed. Built homepage, case-study route, and PDF returned HTTP 200. Case-study HTML contains the six-stage journey and download link, and served PDF bytes match the local nine-page public asset. PDF text bounds, internal-figure exclusions, and all rendered slides passed review. Browser/mobile visual checks remain pending because the browser binary download failed. Production status and remote saved-source checks follow publication.
- **Publication verification:** All five saved GitHub blobs match the intended files. Implementation commit `239c739e2fc592d722c17a87cdfdd3a0c9c9ddb0` deployed to production as `READY` in 43 seconds. Live case-study and PDF endpoints returned HTTP 200, and the PDF bytes match the checked asset. Cloud-browser desktop inspection confirmed the updated content and working journey anchor. Mobile visual checks remain pending. This documentation follow-up does not change the deployed UI or PDF.
- **Recovery:** Pre-change main commit `caf282f5114f8b5598be1917e99262181b2bd209`. Revert this scoped change to restore the prior case study.

## 2026-10-24 — Interactive CSS engineering lab

- **Target:** Personal `bonvallite/developer-portfolio` repository, `feature/interactive-css-lab-20261024`, preview route `/css-lab`.
- **Affected files:** `app/css-lab/page.tsx`, `app/css-lab/css-lab.module.css`, `lib/css-lab.mjs`, `tests/css-lab.test.mjs`, `docs/CSS_LAB.md`, `app/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Authored a responsive, interactive HTML/CSS concept guide with 14 original explanatory notes, three browser experiments, and an eight-question self-test. Linked it from the portfolio homepage and added tests and architecture notes.
- **Reason:** Demonstrate front-end CSS understanding, responsive interface construction, and maintainable React UI state without reproducing an employment assessment.
- **Security:** No company-owned code, original assessment questions, user input uploads, external fonts or credentials are published.
- **Validation:** Unit, safety, type, build, and preview checks pending; do not infer production release from successful GitHub file writes.
- **Release:** Feature branch, review before production. Existing main not modified by these commits.

## 2026-10-23 — Downloadable resume PDF

- **Target:** `bonvallite/developer-portfolio`, `main`, connected to the Vercel `developer-portfolio` production project.
- **Affected files:** `public/Jomar-Vallite-Resume.pdf` (new), `app/page.tsx`, `app/experience/page.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the owner's updated two-page 2026 resume as a static PDF at `/Jomar-Vallite-Resume.pdf`. Linked it from the homepage header navigation, the contact buttons and the top of the Experience page, and added it to the README. All links open in a new tab with `noopener noreferrer`.
- **Reason:** Give recruiters and clients a direct, stable resume download from both the live portfolio and the GitHub repository.
- **Content and privacy:** The PDF is the owner's own resume, prepared and approved by the owner. Its contact details (email, the WhatsApp number already linked in the contact section, GitHub, LinkedIn and portfolio URLs) were already public on this site. It names the owner's current employer and past clients as normal resume content; it contains no source code, credentials, customer data or store identifiers.
- **Maintenance:** To update the resume, replace `public/Jomar-Vallite-Resume.pdf` in place so every existing link keeps working.
- **Validation:** Recorded in the associated commit and deployment check.

## 2026-10-22 — Custom delivery app and CartonCloud integration portfolio

- **Target:** `bonvallite/developer-portfolio`, refresh branch `feature/cartoncloud-app-integration-refresh-20261022`, existing Next.js/Vercel portfolio.
- **Affected files:** `app/cartoncloud-integration/page.tsx`, `app/page.tsx`, `CARTONCLOUD_INTEGRATION.md`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a dedicated case study and technical write-up that clearly distinguish the custom Cloudflare Worker delivery app built by the developer from the Shopify–CartonCloud API integration built by the same developer. Included a mobile-responsive conceptual architecture diagram with bidirectional data exchange and a separately described return path to Shopify order metafields, delivery estimates and fulfilment events. Added the project to the existing homepage and README; documented responsibilities and evidence boundaries in inline source comments.
- **Reason:** Present both custom app development and cross-platform API integration skills without misrepresenting a Shopify App Store listing, directly connecting unrelated services, or publishing employer source or private order data.
- **Validation:** Original PR #20's preceding version passed a GitHub Actions run and Vercel preview. That PR later could not merge because of conflicts with newer `main`; this refresh was recreated from the current main with file-by-file updates rather than overwriting intervening work. The refreshed branch's CI, safety checks and preview must pass before publication. No public production outcome is assumed by this entry.
- **Scope:** Portfolio documentation and UI only, not a Shopify theme, CartonCloud configuration, live Worker, customer orders or production integration.

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
- **Validation:** Inspected the supplied single-page certificate and the existing repository changelog, code, CSS comments, and conventions. Re-fetched all five committed files and confirmed both the homepage and Experience sections, supporting CSS, readme entry, and changelog were saved; verified the title, course name, December 2023 dates, 12-hour duration, issuer and attendance wording. Vercel's production build was building at the time of this record; this does not claim a completed TypeScript/build/browser test.
- **Pending checks:** Confirm Vercel production deployment reaches READY, then verify `/#certifications` and `/experience#training` at desktop and mobile sizes. Browser/mobile rendering remains unverified.
- **Release:** Changes committed directly on `main` to trigger the project's Git-linked production deployment; final deployment status must be checked.


## 2026-10-22 — Undersea cable cybersecurity session portfolio entry

- **Target:** `bonvallite/developer-portfolio`, `main`, connected to the Vercel `developer-portfolio` production project.
- **Files:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a second cybersecurity/professional-development card, linked to `/experience#undersea-cables-session`, for “No Fiber, No Cyber: Safeguarding the World's Undersea Cables”. Summarised the U.S.–Philippines Joint Cybersecurity Working Group and APTelecom announcement, Ortigas location, Thursday 16 November (2–4 p.m. Philippine Time), undersea cable security/maintenance focus, speakers Phillip Nervig and Eric Handa, and moderator John Garrity. Reworded the section intro so the announcement is not mislabelled as formal training.
- **Why:** Include the owner's requested cybersecurity industry-session reference alongside the separately supported CERT training.
- **Evidence and limitations:** Input was an invitation/announcement, **not evidence that the owner attended**. The year was absent from the source (Thursday 16 November aligns with 2023, but this inferred year is intentionally not presented as verified). No certificate or attendance claim is made.
- **Inline documentation:** Updated home and Experience JSX comments on evidence boundaries; updated shared CSS comment and documented card spacing; updated README.
- **Validation:** Reviewed existing source, comments, engineering standards and prior changelog before editing. Checked exact provided names, title, time and location against user-supplied announcement. Remote re-read of saved files and deployment checks pending at the moment of this entry; no build or browser test is asserted.
- **Release:** Saved on `main`; verify Git-linked Vercel production deployment, page rendering and GitHub checks.


## 2026-10-22 — Final deployment and source verification

- **Target:** Vercel `developer-portfolio` production, GitHub `bonvallite/developer-portfolio` `main`.
- **Scope:** Verify the Google Developer and Wikipedia links, DICT Foundations of CERT Operations attendance card, and undersea cable security session entry shipped in the recent commits.
- **Files checked:** `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Source verification:** Re-fetched all five saved files. Confirmed both profile links, the CERT training card/details, the undersea cable event/details, responsive card styles, explanatory JSX/CSS comments, and written records are present. The event remains explicitly invitation-based and does not claim attendance.
- **Deployment verification:** Vercel reported the latest production deployment of commit `618894a1e9cfc09284dfda967a709f19c77accf9` as `READY`. GitHub's Vercel status check for that commit reported `success`.
- **Limitations:** Live authenticated HTML retrieval failed with a Vercel 403 access error at the deployment alias/protection bypass; a separate public web fetch also could not access those routes. Therefore actual browser rendering, link clicks, mobile layouts, and runtime errors are **not independently verified**. No local TypeScript/test/build run was performed during this final pass. Production readiness is based on Vercel's deployment status, not a visual QA claim.
- **Release:** This documentation-only change is committed to `main`, triggering another Vercel production deployment. Check the newest deployment's status separately; the prior known-good build is the commit above.


## 2026-10-22 — Community involvement and running section

- **Target:** `bonvallite/developer-portfolio`, Git-linked Vercel production site.
- **Affected files:** `app/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Change:** Added a responsive Beyond the Code homepage section documenting self-reported volunteering with DEVCON, community outreach and medical missions, plus an active running lifestyle. The accompanying original photos were provided by the owner but are **not yet published** because permanent binary asset upload to the connected repository was unavailable in this session.
- **Why:** Present the owner's community contribution and work–life balance without inventing volunteer roles, specific race outcomes or unverified sporting achievements.
- **Inline documentation:** The homepage comment separates owner-provided claims from photographic evidence. The CSS comment documents responsive layout and deliberately absent photo URLs.
- **Validation:** Inspected existing source, README, changelog and CSS before editing; preserved original sections and inserted new markup/styles. Saved-file re-read, Vercel build results and browser QA to be checked separately. No image upload, asset deployment or visual QA is claimed.
- **Pending:** Upload all six user-supplied original photographs to durable project image hosting, display them across hero, About and personal-interest sections with responsive sizing and accessible alt text, then test desktop and mobile. Do not use expiring Canva preview URLs as permanent site assets.

## 2026-10-22 — Publish six original portfolio photographs

- **Target:** `bonvallite/developer-portfolio`, Git-linked Vercel production site.
- **Affected files:** `public/photos/jomar-studio-portrait.jpg`, `public/photos/jomar-working-laptop.jpg`, `public/photos/jomar-with-laptop.jpg`, `public/photos/jomar-running-event.jpg`, `public/photos/jomar-road-running.jpg`, `public/photos/jomar-running-medal.jpg`, `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, and `CHANGELOG.md`.
- **Change:** Uploaded all six user-provided photographs as size-optimised, metadata-stripped first-party JPEG assets. Integrated portraits into the homepage hero, About, and Experience, plus running and medal photography into Beyond the Code. Added responsive styling, alt text, explicit dimensions and lazy loading outside the primary hero.
- **Why:** Show the owner's genuine professional and personal photography in place of absent images or AI-generated substitutes, while limiting bandwidth and layout shift.
- **Documentation:** Reconciled outdated README image-upload blocker; updated inline JSX comments and CSS comments describing purpose, asset provenance, responsive crops and image dependencies.
- **Validation:** Compared staged image dimensions and SHA-256 digests against generated web derivatives. Uploaded and received a unique Git blob SHA for each image. Verified all six `Image` source paths are present in the code and that the exact six blob paths are included in the commit tree; re-read and external build verification are to be checked after deployment.
- **Remaining QA:** Check actual deployment status, browser image loads, 390px and desktop crops, and any layout overflow. Do not claim these tests before execution.


## 2026-10-22 — Photo publication verification

- **Target:** Production Vercel `developer-portfolio`; deployed photo integration commit `04be2aa39138c9dc8a6eea26b50c9c5a7c9895d8`.
- **Files:** `public/photos/` (all six image files), `app/page.tsx`, `app/experience/page.tsx`, `app/globals.css`, `README.md`, `CHANGELOG.md`.
- **Saved-source validation:** Re-read all six GitHub image paths and confirmed their blob SHAs match the committed asset references. Confirmed the current `main` branch points to the photo integration commit. Verified each optimised source image opens and has no EXIF metadata.
- **Production HTTP validation:** Vercel reported photo integration commit `READY`. Public `/` and `/experience` returned HTTP 200 with the expected alt text and photo references. Each of the six `/photos/*.jpg` endpoints returned HTTP 200 with `image/jpeg` and the expected file byte length. Next.js's `/_next/image` optimisation returned HTTP 200 and `image/jpeg` for the hero image.
- **Outstanding:** Actual browser screenshots, interactive image-lightbox checks (none added), and desktop/mobile visual crop inspection have **not** been performed. Responsive CSS and image `sizes` have been reviewed in source, not yet visually certified.
- **Documentation and release:** Added this follow-up evidence to avoid claiming visual checks that were not carried out. This documentation-only commit may trigger a further Vercel Git-linked production deployment.

## 2026-10-23 — Selected JRV code favicon

- **Target:** `bonvallite/developer-portfolio`, Next.js App Router, GitHub `main`, connected Vercel `developer-portfolio` production project.
- **Affected files:** `app/icon.svg` (new), `app/layout.tsx`, `README.md`, `CHANGELOG.md`.
- **Change:** Published the user's chosen option 6, the bright cyan `{JRV}` code monogram on a dark-blue rounded square, as a self-contained 64 × 64 raster-derived SVG favicon at `app/icon.svg`. Next.js automatically links this file as the site icon. No `app/favicon.ico` previously existed.
- **Reason:** Personalise the browser tab and bookmarks with the approved developer identity without depending on an external image service.
- **Inline documentation:** Added a Next.js file-convention comment beside `metadata` in `app/layout.tsx` to prevent conflicting icon declarations. Added asset provenance, sizing, update guidance and testing expectations in the README.
- **Validation performed:** Confirmed the image asset's original pixels and the selected logo visually; created a compressed, square derivative. Rendered a local SVG-embedded image to confirm the approach works, then confirmed GitHub accepted `app/icon.svg`, and re-read it to check the committed file. Checked that `app/favicon.ico`, `app/icon.png`, and `public/favicon.ico` were absent before adding the new icon.
- **Remaining validation:** Confirm the latest Vercel Git-linked production deployment reaches `READY` with successful check; check that the homepage links to the icon and that `/icon.svg` returns valid SVG. Actual browser 16 × 16 and 32 × 32 favicons across browsers remain pending unless separately verified.
- **Release and rollback:** Committed to `main` for automatic Vercel production deployment. Revert these commits to restore the previous no-custom-favicon state.
 

## 2026-10-23 — Favicon encoded-image correction

- **Target:** `bonvallite/developer-portfolio`, Next.js App Router, `main` branch, Vercel `developer-portfolio`.
- **Files:** `app/icon.svg`, `README.md`, `CHANGELOG.md`; previous `app/layout.tsx` inline documentation remains applicable.
- **Correction:** The first SVG favicon committed on 23 October embedded a malformed JPEG and could not be decoded reliably. Replaced its embedded image with a verified 64 × 64 pixel palette-optimised PNG derivative of the actual selected cyan `{JRV}` icon, keeping the same `app/icon.svg` path, accessible title and self-contained SVG metadata.
- **Why:** A successful Git deployment alone does not prove image bytes are valid or that a browser will render a favicon.
- **Validation:** Decoded and visually inspected the replacement PNG, re-fetched the exact GitHub-saved `app/icon.svg` file, extracted its `data:image/png;base64` payload and verified it decoded as the intended `{JRV}` logo. The image is self-contained with no external dependency. The source code comment and README remain aligned with the change.
- **Pending:** Check Vercel production deployment for the corrected commit and HTTP responses of `/icon.svg` and homepage; check actual Chrome/Edge tab display and cache refresh. Do not claim browser confirmation until actually exercised.
- **Release and recovery:** Corrective commit `b14e6eaf6c18d6e2f914e5b71a4ee766c866d5f5`, followed by documentation commits on `main`. Roll back to earlier no-custom-icon commit if required.

## 2026-10-24 — Brand-aligned JRV favicon palette

- **Target:** `bonvallite/developer-portfolio` (Next.js App Router), GitHub `main`, Vercel project `developer-portfolio` (ID `prj_sAyVySdCHlqUTAasaGh1FyYkk8MY`).
- **Affected files:** `app/icon.svg`, `app/layout.tsx`, `README.md`, `CHANGELOG.md`. No Shopify theme files changed.
- **Change:** Retained the owner-approved option 6 `{JRV}` monogram and its original indexed 64 × 64 pixel positions. Recoloured only the embedded PNG palette from bright cyan/navy to warm portfolio gold `#D9B47C`, bronze highlights and charcoal `#0B0E12`. Added an indexed PNG `tRNS` transparency chunk to remove the former near-white outside corners while preserving the rounded logo. Maintained the existing `app/icon.svg` Next.js automatic favicon route and accessible title.
- **Reason:** Align the favicon with the site's charcoal and gold design system without replacing the approved graphic or adding another favicon source.
- **Inline documentation:** Added an SVG XML comment describing palette provenance, corner alpha and automatic file convention. Updated the adjacent `app/layout.tsx` comment, README favicon documentation, and validation instructions. No outdated cyan-colour claim remains in the current README.
- **Validation actually performed:** Read the existing repository favicon changelog, README, layout comments, CSS brand palette and icon source. Decoded the original indexed PNG palette, generated and visually inspected a gold recolour, preserved the original compressed image data, verified CRC-32 checksums of each generated PNG chunk (`IHDR`, `PLTE`, `tRNS`, `IDAT`, `IEND`), and confirmed the output stays 64 × 64 with no external asset dependencies. GitHub commits accepted the SVG and documentation edits.
- **Saved-source and production verification:** Re-fetched `app/icon.svg`, `app/layout.tsx`, `README.md` and `CHANGELOG.md` from GitHub and confirmed all changes and inline documentation persisted. Vercel reported the favicon-source commit `8af75e066dcca35c5584dea25674aa71359d5d00` as production `READY`. Vercel's authenticated fetch returned HTTP 200 for both the live homepage and `/icon.svg`. The homepage emitted a `rel="icon"` link to `/icon.svg?35f78a7650c66e23`, and the icon response contained the expected gold-and-charcoal SVG source with transparent corner PNG data. This validates deployment and routing, not visual browser-tab rendering.
- **Pending visual QA:** Inspect the favicon in actual Chrome/Edge tabs and bookmarks at 16 × 16 and 32 × 32 on light/dark browser UI, including cache-refresh behaviour. The 64 × 64 original and recoloured artwork were visually compared; physical/browser favicon tests were not performed.
- **Release and recovery:** GitHub `main` triggers production deployment automatically. Previous cyan/navy icon may be restored from its pre-change Git commit; new colour change is limited to the favicon and its documentation.
