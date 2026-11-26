# GSAP integration — JRV portfolio

**Updated:** 26 November 2026  
**Status:** Draft feature branch. No production deployment.  
**Design system:** v1.15 candidate; published v1.14 remains active.

## Official source and dependency versions

- Source: https://github.com/greensock/GSAP
- React integration: https://github.com/greensock/react
- Guides: https://gsap.com/docs/v3/ and https://gsap.com/resources/React/
- Exact direct dependency versions: `gsap@3.15.1`, `@gsap/react@2.1.2`.
- Licence: GreenSock Standard No Charge Licence, not MIT. Commercial website use is generally permitted under its terms; review the licence before building a competing visual animation product or redistributing it. Do not use GSAP 4 beta for this release.

## Scope of the first working example

`app/components/GsapHeroMotion.tsx` wraps the existing homepage hero copy. Only the eyebrow, one H1 and short lead text move upward by 12px during an approximately 0.65-second staggered entrance. The component deliberately avoids `opacity: 0` or hiding content: the complete copy and CTAs are server-rendered, readable before hydration, and accessible to keyboard users even if animations or JavaScript fail.

The component is client-only, uses the official `useGSAP()` hook to bind its work to a single React ref, registers the hook, and uses `gsap.matchMedia()` to respect `prefers-reduced-motion: no-preference`. GSAP context/media reverts transforms and listeners on unmount or a change to the motion preference. No `ScrollTrigger`, `ScrollSmoother`, additional global scroll listener, external font, or marketing tracker is introduced.

## Installation and build conventions

The GitHub repository currently contains `package.json` but **does not track a `package-lock.json`**. Existing GitHub Actions and Vercel workflows use npm installation; this targeted change adds pinned direct dependencies in `package.json` without also introducing an unrelated full dependency-lock migration.

For local work:

```bash
npm install
npm test
npx tsc --noEmit
npm run build
```

The dependencies will be downloaded from npm during GitHub CI/Vercel preview builds. Do not commit a newly generated lockfile until the team adopts a lockfile policy. Direct version pinning is not a substitute for fully reproducible transitive dependencies.

## Maintenance and accessibility rules

1. Maintain exactly one public hero H1, and preserve `jrv2-hero-copy` for existing responsive styles and browser QA.
2. Never hide critical content until hydration. GSAP is enhancement only, not a dependency for navigation, SEO, or email links.
3. Use `useGSAP()` and scoped selectors; add `contextSafe()` if future user-event handlers create tweens after mounting.
4. Use `gsap.matchMedia()` for reduced motion. Respect users who change preferences during a session.
5. Keep animations decorative, lightweight, and local. Do not block native scrolling, keyboard focus, analytics consent choices, or the independent interactive labs.
6. Only register plugins that are actually used. Review bundle/performance costs before introducing ScrollTrigger, Flip, DrawSVG, MotionPath, SplitText or ScrollSmoother.
7. Keep source comments, `docs/JRV_DESIGN_SYSTEM.md`, and `CHANGELOG.md` aligned whenever the animation behaviour changes.

## Verification and release gate

- `tests/gsap-integration.test.mjs` safeguards pins, server-visible content and cleanup.
- `tests/gsap-hero-browser-qa.mjs` opens local Next.js pages in real Chrome at 390px with reduced motion and 1366px with full motion, checks the H1, links, layout, console exceptions, and transform cleanup.
- Existing JRV SEO, safety, privacy, portfolio and desktop/mobile browser suites must pass.
- Verify GitHub exact-commit CI and Vercel Preview for the draft branch, and review screenshots before approval.
- No production deployment, Shopify theme, Worker, customer notification or analytics configuration is included.

## Possible later work

After reviewing the foundation, separate PRs can explore ScrollTrigger workflow storytelling in the Shopify App Engineering case study and Flip animation for fictional B2B interface transitions. Do not implement those changes merely because the library is installed.
