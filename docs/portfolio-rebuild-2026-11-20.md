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
- **Interactive journey:** a four-stage process explorer explains discovery, design, engineering and measurement without requiring a large animation framework.
- **Audience pathways:** dedicated employer and business routes; approved résumé and professional profile links remain accessible but are no longer dominant distractions from the main enquiry flow.
- **Direct enquiry:** a project/role composer builds a local mailto draft. An alternate copy-email button is available. It does not submit content to the website or store a visitor's brief. A restrained CTA dock appears on internal case-study and service pages.
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
- Browser QA on 1600×960, 1366×768, 768×1024 and 390×844: no horizontal overflow or JavaScript exceptions; hero, projects, service links, interaction tabs, direct enquiry and mobile navigation work.
- A fresh browser must make **no optional GTM/Clarity/Vercel Analytics requests** before accepting, or after rejecting consent.
- Verify heading hierarchy, canonical, metadata, sitemap and noindex on the intended downloads.
- Run Lighthouse / PageSpeed Insights on the release preview and production, separately for mobile and desktop. Target good Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1); do not report them as achieved without measurements.
- Visually review screenshots from browser QA before merging, then verify Vercel READY deployment and the current domain aliases.
- Confirm publication rights and permissions for all reused client-derived content before any public-privacy-compliance claim.

## Recovery

The snapshot branch points at the complete Git-tracked pre-rebuild commit. To undo a future release, make a recovery PR based on that commit or use Vercel's production rollback after checking deployment effects. A Git branch is not a substitute for a separately secured off-site backup of account settings, DNS, environment secrets, or client data.

## Editorial guardrails

Use Australian English, service-led SEO and the approved JRV identity. Do not invent testimonials, revenue improvements, customer counts, client logos, certifications or metrics. Preserve the user's explicitly requested professional links, résumé route and mailbox shortcut unless they direct otherwise.
