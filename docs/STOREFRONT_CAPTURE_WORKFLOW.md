# Verified storefront screenshot workflow

This manual workflow captures public homepage viewports for 11 active storefronts (10 in the experience reference grid, plus the featured Peter Augustus site). The same full 11-site list is presented on the cinematic homepage at `/#websites`. It does **not** publish images or change production.

## Runner compatibility

The first run on 19 November 2026 (run 44488642173) failed before capture: `ubuntu-latest` resolved to Ubuntu 26.04, while Playwright 1.56.1 rejected Chromium dependency installation on that OS. The workflow now explicitly uses `ubuntu-24.04` with the same pinned Playwright release. Runner compatibility was recovered in later runs. A passing Vercel build alone does not test GitHub Actions browser installation.

## Recovered capture evidence (19 November 2026)

GitHub Actions run **`44490966868`** produced the downloadable artefact `storefront-captures-44490966868` (about 6.3 MB). Its `manifest.json` contains 24 attempted image captures: **22 marked successful across the 11 active websites**, and two failures for the retired Skull Seeker URL (DNS resolution error). The 22 files are PNGs at **1280 × 800 desktop** and **390 × 844 mobile**; capture times were between 08:59 and 09:00 UTC on 19 November 2026.

The recovered screenshots were reviewed together: several correctly show homepage heroes and navigation, while some also show timed Black Friday promotions, cookie/signup overlays, and one nearly empty dark desktop loading state. This confirms **provenance, not publication-quality approval**. Do not automatically copy all 22 into `public/` or claim that every screenshot is an exact current representation. Keep the gallery's live-site fallback for missing or problematic thumbnails.

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

The homepage and experience page now **prefer approved local WebP screenshot paths**, falling back to WordPress mShots when a local file is not present or cannot load, and finally to the direct live-site link. Axlrodd's nearly empty recovered desktop capture remains excluded; its desktop preview is sourced from the live thumbnail service. This is a draft-branch feature and local images are not considered published until the separate asset-import run and PR review succeed.

## Bounded draft-only WebP import

The short-lived `.github/workflows/import-storefront-captures.yml` runs only when its own workflow file is introduced or changed on the draft integration branch. It fetches the already-recorded 19 November `44490966868` artefact using an ephemeral GitHub Actions token with read-artifact and draft-branch write permissions. `scripts/optimise-storefront-captures.py` verifies the original 11-site capture registry, unique manifest records, PNG file signatures, expected viewport sizes, source date and filenames; it produces 21 WebP files (all except the incomplete Axlrodd desktop screenshot) plus a public provenance JSON. The workflow attempts only a non-forced draft-branch commit under `public/portfolio/storefronts/`.

After successful import and review, **remove the temporary write-permission workflow** before production merge. If the artefact expires or the repository denies Actions write permission, the import fails without touching `main`, and the gallery's WordPress fallback still works. The original PNGs remain available in the saved capture archive.

## Capture limitations

Marketing popups, localisation, bot protection, personalisation and cookie consent banners may affect captured screens. The workflow is not an archival screenshot service, a UX audit, or evidence of quantified results. Never attempt to bypass a site's access restrictions or reuse private client screenshots without permission.

## Retired storefront maintenance (19 November 2026)

Skull Seeker (`https://www.skullseeker.com/`) has been retired per the portfolio owner's direction after a DNS resolution failure in run `44490966868`. It is excluded from `/experience`, the screenshot script and the manual GitHub Actions store selector. The present capture target is **11 sites / 22 images**, including Peter Augustus. Historical audit records and prior artefacts remain unchanged and may mention the former entry.
