# GSAP integration — JRV portfolio

**Updated:** 26 November 2026  
**Status:** Published to JRV production through PR #106 on 26 November 2026 (merge `7ec6d0c`).  
**Design system:** v1.15 published; v1.14 remains in release history.

## Official source and dependency versions

- Source: https://github.com/greensock/GSAP
- React integration: https://github.com/greensock/react
- Guides: https://gsap.com/docs/v3/ and https://gsap.com/resources/React/
- Exact direct dependency versions: `gsap@3.15.1`, `@gsap/react@2.1.2`.
- Licence: GreenSock Standard No Charge Licence, not MIT. Commercial website use is generally permitted under its terms; review the licence before building a competing visual animation product or redistributing it. Do not use GSAP 4 beta for this release.

## Scope of the first working example

`app/components/GsapHeroMotion.tsx` wraps the existing homepage hero copy. Only the eyebrow, one H1 and short lead text move upward by 12px during an approximately 0.65-second staggered entrance. The component deliberately avoids `opacity: 0` or hiding content: the complete copy and CTAs are server-rendered, readable before hydration, and accessible to keyboard users even if animations or JavaScript fail.

The component is client-only, uses the official `useGSAP()` hook to bind its work to a single React ref, registers the hook, and uses `gsap.matchMedia()` to respect `prefers-reduced-motion: no-preference`. GSAP context/media reverts transforms and listeners on unmount or a change to the motion preference. The homepage does **not** use `ScrollTrigger`, `ScrollSmoother`, additional global scroll listeners, external fonts, or marketing trackers. The separate shipping case study uses `ScrollTrigger` locally as explained below.

## Four existing diagrams that benefit from animation

The published v1.15 release extends the foundation with **four existing diagrams**, selected because motion reveals *causality* rather than adding decoration. All existing project headings, text, source/evidence boundaries, state controls and fictional demo rules remain visible and operable without JavaScript animation.

| Route | What animates | Why it improves understanding |
| --- | --- | --- |
| `/shipping-integration` | Three responsibility cards -> rate-decision arrows -> customer-facing outcome, once on scroll, plus a **Replay the rate decision** button | Explains how subscription, delivery-zone and Shopify checkout rules contribute to one final charge; it is not a live rate calculation |
| `/projects/commerce-integration-engineering` | Selected network node, event rail and inspector whenever a step changes, plus optional **Play flow / Pause flow** | Follows one of three fictional order/fulfilment/tracking paths and identifies which boundary is active |
| `/cartoncloud-integration` | Selected trace step and inspector, plus optional **Play trace / Pause trace** | A rejected signature or failed Shopify write explicitly stops progression; never plays through an invented success |
| `/projects/spend-and-save` | The manually selected configuration/storefront/Flow/confirmation layer and its explanatory code | Shows which subsystem owns the responsibility; does not change subtotal, rewards, committed edits or notifications |

### Source ownership and cleanup

`app/components/useDiagramStageMotion.ts` owns only the lightweight selected-stage pulse and detail transform. It receives a *stage key*, never permission to alter business state. The host React components keep `aria-pressed`, selected stage, disabled steps, fictional outcomes and recovery rules authoritative. The helper scopes its selectors to a local `ref`, uses `useGSAP()` with `revertOnUpdate`, and reverts on preference changes. It does not hide text or block focus.

`app/shipping-integration/ShippingFlowMotion.tsx` is a separate page-local client wrapper. It uses `ScrollTrigger.create({once:true})` to start a short staged reveal when the otherwise static diagram becomes visible; **Replay** reuses that same GSAP timeline. It does not replace native scrolling, pin sections, or load `ScrollSmoother`. The wrapper's children (and checkout disclaimer) are server-rendered; there is no initial `opacity:0`. The replay button is hidden by the existing route CSS for reduced-motion visitors.

In the two event studios, playback is **opt-in** through Play/Pause buttons and advances existing local React step state at a measured cadence. During automatic playback, fast-updating headings and status regions set `aria-live="off"` to avoid repeated screen-reader announcements; manually selected stages return to polite announcements. It stops on scenario changes, manual selection, the final stage or a trust/write failure. It has no API requests, timers beyond the active user-selected walkthrough, data collection or customer notification. In reduced-motion mode, the Play/Pause control is hidden but the Next and manual step controls remain available. Spend & Save intentionally has **no autoplay**, because its selected layer is an inspector, not an evidence of order completion.

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
6. Only register plugins that are actually used. `ScrollTrigger` is imported by the shipping architecture route and the draft lifecycle tour. Review bundle/performance costs before introducing Flip, DrawSVG, MotionPath, SplitText or ScrollSmoother; avoid scroll hijacking or pinning on this portfolio.
7. Keep source comments, `docs/JRV_DESIGN_SYSTEM.md`, and `CHANGELOG.md` aligned whenever the animation behaviour changes.

## Verification and release gate

- `tests/gsap-integration.test.mjs` safeguards pins, server-visible content and cleanup.
- `tests/gsap-hero-browser-qa.mjs` opens local Next.js pages in real Chrome at 390px with reduced motion and 1366px with full motion, checks the H1, links, layout, console exceptions, and transform cleanup.
- `tests/gsap-diagrams.test.mjs` checks SSR visibility, scoped motion, replay, reduced motion and fiction/failure safety. `tests/gsap-diagrams-browser-qa.mjs` visits all four routes with desktop and mobile reduced-motion contexts and tests real flow controls, invalid webhook stops and no client exceptions. CI retains all pre-existing browser suites and uploads diagram screenshots.
- Existing JRV SEO, safety, privacy, portfolio and desktop/mobile browser suites must pass.
- **Released evidence:** Approved PR #106 merged as `7ec6d0c3bc74142b091859b96675b162bcfc1933` from source `1c91d931cefe2672db5eb54fc2461a2a19e8f4a5`. [GitHub Actions 45782301947](https://github.com/bonvallite/developer-portfolio/actions/runs/45782301947) passed `validate` and the complete Chrome browser suite; the corresponding Vercel preview `dpl_4VysrqHHS8Bi4G4h45Gi9WVTQguF` was READY. Production deployment `dpl_3vENrX4TXaUPDbVqMj9K3sXWGsnk` confirmed READY on www and apex. These tests confirm the reviewed implementation, not production integrations or every assistive technology.
- The deployment changes only this Next.js portfolio. Shopify themes, Cloudflare Workers, customer notifications, real order data and analytics configuration are unchanged.

## Possible later work

After reviewing the four diagrams and foundation, separate PRs may explore richer SVG route tracing or Flip motion for fictional B2B UI transitions. Do not add animation across all products indiscriminately: prioritise relationships a static diagram cannot explain as clearly. The interactive case studies remain illustrative, not live system traces.

## 27 November 2026 — lifecycle studio candidate

Adds scoped MotionPathPlugin packet travel on the existing systems engineering route. React owns trace navigation; motion follows the selected edge and reverts on changes. No scroll pinning or new dependency. See [Lifecycle studio](LOGISTICS_LIFECYCLE_STUDIO.md) for scope and pending verification.

Phase 2 candidate: the read-only architecture tour uses scoped ScrollTrigger chapter observers on desktop and MotionPathPlugin with matchMedia cleanup. CSS sticky positioning preserves native scroll; mobile and reduced-motion retain chapter buttons and static descriptions. Shared SVG markers are instance-specific. Dedicated lifecycle browser QA is included.

Phase 3 candidate: WorkerFunctionLab uses scoped useGSAP and matchMedia to highlight the validated local execution result and connection lines after explicit Run. It never executes a function from animation or scroll. Reduced motion and normal JSON inspection remain available.

Phase 4 candidate: MetafieldExplorer uses scoped useGSAP and matchMedia for a short detail-panel transition after field or scenario selection. The snapshot model owns all simulated write outcomes; animation cannot perform a mutation. Reduced motion preserves all field and stage controls.

Phase 5 candidate: SecurityLab animates only selected completed local security trace steps with scoped useGSAP, MotionPathPlugin and matchMedia. Cryptographic execution is initiated explicitly and independent of GSAP; stale asynchronous results are ignored after scenario changes. Reduced motion retains all inputs, trace controls and results.
