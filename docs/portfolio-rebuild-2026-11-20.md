# JRV cinematic portfolio rebuild

**Date:** 20 November 2026  
**Repository:** bonvallite/developer-portfolio  
**Working branch:** redesign/2026-11-20-cinematic-portfolio  
**Source backup branch:** backup/2026-11-20-pre-cinematic-rebuild  
**Pre-rebuild commit:** cbb656e9d3c76472c5f25403cbc4a026981582c4  
**Pre-rebuild Vercel production deployment:** dpl_FftL7SMCNPiZ7TKWqZUedsNYdoPp

## Intent

Rebuild the public JRV commerce engineering portfolio as a wide, immersive, professionally credible, fast-loading site that converts two audiences: ecommerce businesses with defined projects, and employers recruiting Shopify development, ecommerce management, CRO and application/integration expertise. Do not publish employer credentials, raw customer data, private identifiers or fabricated performance claims.

## What changed

- **Homepage:** replaced the dense legacy homepage and remote-image-heavy opening with a server-rendered cinematic story and CSS-only system visual. The layout uses wide responsive containers, charcoal surfaces, muted gold accents and purposeful motion disabled for reduced-motion users.
- **Project evidence:** four prominent, carefully labelled case studies, each presenting a challenge, response and link to a real case-study or an independently developed fictional demo.
- **Service pages:** redesign the four SEO-indexed Shopify services with shared responsive hero artwork, engineering story and direct contextual enquiries; keep each service's original factual copy and canonical URL.
- **Interactive journey:** a four-stage process explorer explains discovery, design, engineering and measurement without requiring a large animation framework.
- **Audience pathways:** dedicated employer and business routes; approved résumé and professional profile links remain accessible but are no longer dominant distractions from the main enquiry flow.
- **Direct enquiry:** a project/role composer builds a local mailto draft. An alternate copy-email button is available. It does not submit content to the website or store a visitor's brief. A restrained CTA dock appears after scrolling on longer case-study pages only, avoiding overlap with service-page and homepage primary enquiry actions.
- **Performance posture:** removed the shared external Google Fonts stylesheet and the hidden screenshot preconnect. No heavy homepage hero imagery or video; system fonts and CSS illustrations provide the first-screen impact.
- **Privacy and consent:** Google Tag Manager, Microsoft Clarity and Vercel Analytics now load only after explicit opt-in. Visitors can reject optional analytics. Consent can be changed through the persistent privacy control.
- **Response headers:** no-referrer, nosniff, deny framing, and browser permissions restrictions. Indexed résumé and linked raw archive downloads get an X-Robots-Tag noindex policy; this is **not** access control.
- **Search:** service-led homepage title, description, self canonical and Open Graph metadata. WebSite structured data does not identify the portfolio owner as a Person or fabricate organisation credentials.
- **Validation:** updated source-level privacy tests, added page/CTA/security tests, and added full-page Chrome browser checks at four viewport sizes. All existing CI checks must pass before publication.

## Privacy and confidentiality audit: unresolved matters

**No website can be certified as having “zero leaks” solely from checking the homepage source or a successful build.** This review addresses obvious new risks and preserves known limits.

1. The public Git repository has a legacy original résumé under \`backups/resumes/\`, and existing Git history and today's source snapshot still contain it. The filename, origin commit and stored binary must be reviewed for personal details and moved to private storage if confidentiality is required. Deleting a file from the current branch does not erase its history, forks or caches.
2. Current résumé previews/downloads intentionally include approved employment identity and contact details. Pages are marked noindex; direct URLs and third-party sites can still expose that information.
3. The publicly accessible sanitised Python source archive is not customer data, but anonymisation alone does not prove ownership or permission to publish employer-derived source. Review authorisation and any hidden source strings.
4. Public code examples and case studies may mention real client/platform names as professional references. Confirm what may be publicly attributed and separate approved references from private system details.
5. Optional GTM can inject tags configured in a separate account. The deployed GTM configuration, Clarity retention, cookie deletion and third-party image providers need independent verification. Consent controls prevent **initial optional script loading** in the reviewed source, not automatic deletion of externally held data.
6. The mailto enquiry depends on the visitor's email application and does not provide server-side lead retention. The copy-email fallback reduces friction but cannot guarantee an enquiry is sent.
7. The media, resume PDF/Word document internals, third-party scripts, server functions, metadata, EXIF, historical deployments and repository history require full privacy and legal review before anyone states that the site has zero client or personal information exposure.

## Acceptance criteria

- Standard GitHub Actions: source-level SEO, safety scan, JS and Python unit tests, TypeScript, Next.js build.
- Browser QA on 1600×960, 1366×768, 768×1024 and 390×844: no horizontal overflow or JavaScript exceptions; hero, projects, service links, interaction tabs, direct enquiry and mobile navigation work. For all four service routes, confirm H1, evidence links, direct mailto and no horizontal overflow on wide and mobile screens; capture representative service screenshots.
- A fresh browser must make **no optional GTM/Clarity/Vercel Analytics requests** before accepting, or after rejecting consent.
- Verify heading hierarchy, canonical, metadata, sitemap and noindex on the intended downloads.
- Run Lighthouse / PageSpeed Insights on the release preview and production, separately for mobile and desktop. Target good Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1); do not report them as achieved without measurements.
- Visually review screenshots from browser QA before merging, then verify Vercel READY deployment and the current domain aliases.
- Confirm publication rights and permissions for all reused client-derived content before any public-privacy-compliance claim.

## Recovery

The snapshot branch points at the complete Git-tracked pre-rebuild commit. To undo a future release, make a recovery PR based on that commit or use Vercel's production rollback after checking deployment effects. A Git branch is not a substitute for a separately secured off-site backup of account settings, DNS, environment secrets, or client data.

## Editorial guardrails

Use Australian English, service-led SEO and the approved JRV identity. Do not invent testimonials, revenue improvements, customer counts, client logos, certifications or metrics. Preserve the user's explicitly requested professional links, résumé route and mailbox shortcut unless they direct otherwise.

## Ember & Teal design iteration (20 November 2026)

Working branch: `feature/ember-teal-interactive-portfolio` (derived from the cinematic redesign branch, not production). Homepage headline now foregrounds nine years of Shopify and ecommerce experience and a combined developer/manager role. The primary action leads to selected work, and the secondary action leads to the résumé route. Route-scoped CSS adopts obsidian, electric teal and ember orange with an editorial hero scale and updated focus accents. Existing case studies, privacy controls, consent flow, and reduced-motion behaviour are preserved.

**Validation status:** Source changes committed through GitHub; automated tests, browser rendering, contrast audit and Vercel preview have not yet been verified. No production release. The interactive B2B simulator, project diagrams and real footage remain planned work and must not be represented as deployed. Check actual demo architecture and publication rights before adding project footage or outcomes.

## Stage 2: Interactive B2B laboratory (20 November 2026)

Updated `app/b2b-modernisation/CinematicB2B.tsx` and `app/b2b-modernisation/cinematic.css` on `feature/ember-teal-interactive-portfolio`. Existing market selector, company eligibility simulation, six-step buying journey, and evidence-bound historical chart are preserved. Added an accessible 1–50 unit range input and live fictional subtotal and retail-comparison savings, calculated from the currently applied catalogue context. The route-scoped CSS adds Ember & Teal treatment, responsive subtotal layout, and focus-visible styles. These calculations are explanatory UI only; Shopify enforces real company entitlement and checkout prices.

**Validation:** GitHub accepted both file commits. Automated tests, TypeScript, production build, browser accessibility checks, and Vercel preview have not yet been run or confirmed. Do not merge or publish before those checks. No customer records, production prices or confidential source were added.

## Stage 3: Linked B2B architecture diagram (20 November 2026)

Updated `app/b2b-modernisation/CinematicB2B.tsx` and `app/b2b-modernisation/cinematic.css` to show a selected-context three-node architecture (buyer identity, eligibility, applied catalogue). Diagram derives directly from the existing market/eligibility state and reflects retail fallback in the fictional demo. Responsive CSS stacks nodes on narrow screens, while decorative arrows animate only when reduced-motion is not requested. Inline source documentation explains state sharing and the Shopify entitlement boundary.

**Validation status:** GitHub accepted the source and CSS commits; no automated build, browser QA or production release has been verified. Confirm colour contrast and mobile arrow rendering during preview review.

## Stage 5: Interactive Shopify–CartonCloud walkthrough (20 November 2026)

Created `app/cartoncloud-integration/IntegrationLab.tsx` and `integration-lab.css`, then embedded the client component in `app/cartoncloud-integration/page.tsx`. The isolated educational demonstration provides six selectable processing stages, an optional simulated failure state, reset/next controls, and stage descriptions. Styling follows Ember & Teal with responsive single-column mobile layout, focus indicators and reduced-motion handling. All event data is fictional and local; the page does not contact Shopify, CartonCloud or the production Worker. The server-rendered case study metadata and evidence limitations are preserved.

**Validation status:** GitHub commits accepted. TypeScript, automated tests, build, visual QA and Vercel preview have not been run or confirmed; no production deployment.

## Stage 6: Python Analytics & CRO Lab (20 November 2026)

Created `app/analytics-lab/page.tsx` and `app/analytics-lab/analytics-lab.css`. The client-side educational project provides an illustrated Shopify/GA4/GSC → Python → CSV → CRO pipeline, six selectable source-module explanations, synthetic purchase funnel and acquisition comparisons, editable Shopify–GA4 purchase-count reconciliation, and a browser-generated synthetic CSV download. No production API calls or confidential datasets. Updated `app/page.tsx` to feature `/analytics-lab` and repaired an escaped newline in the flagship case-study source comment. All charts are intentionally illustrative, not actual client results. The previously published sanitised Python source archive remains unchanged.

**Validation:** GitHub commits confirmed. TypeScript, automated tests, browser QA, download verification and Vercel preview have not been run or verified. No merge or production release.

## Stage 8 CI test regression (20 November 2026)

GitHub Actions PR #82 validate job failed with 132 of 134 Node tests passing. The two failures in `tests/cinematic-home.test.mjs` asserted superseded hero CTA copy (`Let's talk about your project`, `Explore selected work`) and the superseded `/data-extraction-automation#visual-demo` link. Updated those assertions to the approved `Explore my work`, `Download CV`, and `/analytics-lab` destinations; added a filesystem assertion for the Python lab route. Source changes were intentionally limited to the test and its inline documentation. SEO and public safety scans had passed in the failed run; Python tests, TypeScript and browser QA had not run. Await a fresh CI result; Vercel READY alone does not clear the release.

## Stage 9 browser QA expansion (20 November 2026)

PR #82 validation job passed SEO, public-safety, JavaScript, Python, TypeScript and Next.js production build checks. Browser QA was skipped because the workflow's branch allow-list excluded `feature/ember-teal-interactive-portfolio`. Updated `.github/workflows/portfolio-ci.yml` to include this branch for existing case-study and cinematic homepage browser checks, and added `tests/analytics-lab-browser-qa.mjs` to exercise the new Python lab on desktop, tablet and mobile. The new test checks chart switching, module selection, reconciliation calculations, synthetic CSV download, overflow and runtime errors; screenshots are retained as CI artefacts. Validation of the new browser job is pending a fresh CI run. Production remains unchanged.
