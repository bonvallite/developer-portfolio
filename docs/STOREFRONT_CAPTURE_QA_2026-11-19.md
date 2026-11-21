# Storefront homepage capture QA: 19 November 2026

**Source**: GitHub Actions run [44490966868](https://github.com/bonvallite/developer-portfolio/actions/runs/44490966868), artefact `storefront-captures-44490966868` (artifact ID `14513321853`).

**Result**: Playwright and Chromium installation succeeded; 22 of 24 first-viewport images captured. The run correctly reports failure due to two missing Skull Seeker captures. The artefact contains 22 PNGs plus `manifest.json`. No client production assets have been copied into the site.

**Method**: Visual review of a contact sheet generated from the downloaded GitHub Actions ZIP. This is a preliminary screening, not a pixel-level or browser-device validation. All screenshots are 1280x800 desktop or 390x844 mobile, not full-page captures. The capture process records an HTTP response and PNG file existence; this alone is insufficient to validate content.

| Store | Desktop | Mobile | Initial QA / next action |
| --- | --- | --- | --- |
| Peter Augustus | Captured | Captured | Both show a 30% off promotion overlay; recapture or obtain reviewed unobstructed homepage frames before portfolio publishing |
| Poseidon Animal Health | Captured | Captured | Recognisable public homepage; check full-size images before approval |
| Eve Curls | Captured | Captured | Recognisable homepage and responsive campaign hero; check full-size images before approval |
| Jace Industries | Captured | Captured | Recognisable homepage; check full-size images before approval |
| Colossal Diamond Tools | Captured | Captured | Recognisable homepage; check full-size images before approval |
| Rene Ruiz Collection | Captured | Captured | Recognisable sale homepage; check full-size images before approval |
| Urban August | Captured | Captured | Recognisable homepage; check full-size images before approval |
| Warehouse-Lighting | Captured | Captured | Recognisable homepage; check full-size images before approval |
| Skull Seeker | Failed: DNS | Failed: DNS | `www.skullseeker.com` returned `ERR_NAME_NOT_RESOLVED`; verify canonical public domain independently before changing URLs |
| OSOYOO | Captured | Captured | Recognisable homepage; check full-size images before approval |
| Axlrodd | Captured | Captured | Desktop hero appears mostly blank/dark; examine loading or delayed hero before approving, mobile needs individual QA |
| Tronus Footwear | Captured | Captured | Sign-up modal obscures homepage; recapture or select reviewed unobstructed frames |

## Publication gate

- **Not approved for public static asset publication yet.** All 22 images exist but require full-resolution image review, appropriate reuse rights, and confirmation that screenshots accurately represent the named sites.
- Do not label these captures as proof of individual design authorship, conversions or client endorsements.
- Retain the current third-party preview and live-link fallback until local assets are reviewed, optimised and introduced via a separate tested PR.
- Do not silently dismiss consent prompts, inject styles or alter third-party DOM in capture to create an apparently authentic screenshot.
- Capture workflow already correctly leaves an artefact even if one store fails. Preserve explicit failure status so missing screenshots remain visible.
- GitHub's uploaded artefact has seven-day retention. Download and securely archive any source images intended for later review.

**Next step**: Resolve Skull Seeker's public URL or exclude it with an explicit documented reason, recapture affected first screens without obscuring overlays where genuinely possible, and individually approve static assets before replacing mShots URLs.
