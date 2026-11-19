# Verified storefront screenshot workflow

This manual workflow captures public homepage viewports for 11 active storefronts (10 in the experience reference grid, plus the featured Peter Augustus site) on `/experience`. It does **not** publish images or change production.

## Runner compatibility

The first run on 19 November 2026 (run 44488642173) failed before capture: `ubuntu-latest` resolved to Ubuntu 26.04, while Playwright 1.56.1 rejected Chromium dependency installation on that OS. The workflow now explicitly uses `ubuntu-24.04` with the same pinned Playwright release. Re-run the workflow to confirm browser installation and actual captures; a passing Vercel build does not test GitHub Actions browser installation.

## Run

Open **Actions → Capture storefront homepage previews → Run workflow**, select `all` or an individual store, and run. Download the resulting `storefront-captures-<run-id>` artefact. Each site is captured at desktop 1280×800 and mobile 390×844. The `manifest.json` lists failures and observed page metadata.

The local equivalent is:

```bash
npm install --no-save --package-lock=false --ignore-scripts playwright@1.56.1
npx playwright install chromium
CAPTURE_STORE=all node scripts/capture-storefronts.mjs
```

Review every PNG for correct site, visible homepage, correct mobile rendering, cookie pop-ups, bot challenges, and confidential information. A successful HTTP response and a PNG do not establish image validity. Failed captures must not be published as authentic screenshots.

## Publishing approval gate

1. Confirm that the screenshots are legitimate, have an appropriate right to be displayed and accurately represent the sites and the contributor's involvement.
2. Optimise reviewed PNGs into WebP or AVIF, retaining the source screenshots separately for audit.
3. Add approved final assets under `public/portfolio/storefronts/<slug>-desktop.webp` and `<slug>-mobile.webp`.
4. Update `app/experience/StorefrontPreview.tsx` to use those static paths only after both device assets for a store are approved and present. Preserve the fallback link if either image is unavailable.
5. Run tests, safety checks, type check and build, then use the normal PR and Vercel preview review process.

The public page currently uses third-party WordPress mShots previews and displays a live-link fallback when a thumbnail request fails. This manual workflow is a proposed way to replace those dynamic previews; static files have **not** been published by this change.

## Capture limitations

Marketing popups, localisation, bot protection, personalisation and cookie consent banners may affect captured screens. The workflow is not an archival screenshot service, a UX audit, or evidence of quantified results. Never attempt to bypass a site's access restrictions or reuse private client screenshots without permission.

## Retired storefront maintenance (19 November 2026)

Skull Seeker (`https://www.skullseeker.com/`) has been retired per the portfolio owner's direction after a DNS resolution failure in run `44490966868`. It is excluded from `/experience`, the screenshot script and the manual GitHub Actions store selector. The present capture target is **11 sites / 22 images**, including Peter Augustus. Historical audit records and prior artefacts remain unchanged and may mention the former entry.
