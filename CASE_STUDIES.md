# Engineering case studies

These are **high-level, public-safe project summaries** informed by professional experience. They do not reproduce employer-owned source code, internal system diagrams, private business terms, credentials, or live customer data. Code in `../examples/` is independently authored and illustrative rather than an exact implementation.

## 1. Shopify theme and storefront engineering
**Problem class:** Maintaining responsive product, collection, navigation, FAQ, and cart experiences across changing themes.

**Approach:** Audit templates and Liquid sections; identify interaction, layout, accessibility, and performance regressions; prototype responsive components; validate mobile and desktop; document changes in source comments and a project change log.

**Demonstrations:** Product card (08), CSS grid (09), accessible FAQ (17), cart dialog focus (21), breadcrumb structured data (24), heading normalisation (37), and image fallback (40).

## 2. Weight-based wholesale pricing and automation
**Problem class:** Conventional quantity pricing does not directly express order-level aggregate weight requirements.

**Approach:** Model a weight aggregation and eligibility function, validate tier definitions, then reason about separate customer-facing and back-office actions. Apply authorisation and platform-native discount mechanisms in actual implementations.

**Demonstrations:** 01 (weight units), 10, 15, 32, 42 (GST invoice totals) and the [interactive simulator](./B2B_DEMO.md).

## 3. Fulfilment and order tracking
**Problem class:** Vendor status events need authentication, normalisation, reliable processing, and observability.

**Approach:** Verify webhook signatures over raw payloads, build idempotency boundaries with durable storage, normalise provider events to internal statuses without letting late events move a shipment backwards, add bounded retries and logging that omits customer details.

**Demonstrations:** 02, 03, 04, 05, 13, 33, 36. The examples are not a deployable production integration.

## 4. Delivery ETA modelling
**Problem class:** Movement through a carrier network and final-mile residential delivery can follow different calendars.

**Approach:** Model transit days and destination delivery constraints separately, use explicit holiday calendars and destination service eligibility, and word estimates without promises.

**Demonstrations:** 06, 19, 26, 39 and 41 (zone calculator with dispatch cut-off and zone delivery days).

**One source of truth for the delivery rule:** "Can a residential drop happen on this date?" is defined once, in 19. Earlier versions of this repository repeated the weekend check inside 06, so a change to one copy, such as adding holidays, could silently miss the other. Now 06 and 41 both call 19, and [a guard test](./tests/delivery-single-source.test.mjs) checks every start date in a year to confirm that neither ever produces a date 19 rejects. The same test feeds it a deliberately drifted copy of the rule, which only skips weekends, to show the guard fails when copies disagree.

## 5. Analytics and attribution troubleshooting
**Problem class:** Ecommerce platforms and event analytics may disagree on sessions, purchases, and revenue.

**Approach:** Compare transactions by anonymised identifier, inspect duplicate events, review event configuration, assess reporting filters, and separate genuine missing transactions from attribution gaps.

**Demonstrations:** 11 (purchase dedupe across reloads), 12, 27, 30.

## 6. Catalogue governance, SEO, and redirects
**Problem class:** Product changes can create broken links, inconsistent headings, incomplete sales-channel publication, and search discoverability gaps.

**Approach:** Audit without mutating live data; prepare replacement mapping; detect loops; review missing publishing channels; build SEO-safe metadata and site navigation.

**Demonstrations:** 07, 14, 16, 23, 24, 25, 29, 31, 37, 38.

## 7. Site speed and performance
**Problem class:** Unnecessary asset loading and duplicated enhancements may degrade real-world speed.

**Approach:** Prioritise only critical resources, set image dimensions, use responsive imagery, and evaluate Core Web Vitals against sensible thresholds with field evidence.

**Demonstrations:** 09, 18, 34, 35.

## 8. Marketing technology and audience measurement
**Problem class:** Event instrumentation, campaign URLs, and marketing analytics need consistent, privacy-conscious data.

**Approach:** Distinguish tracking hygiene from marketing outcomes, validate event names and deduplication, and avoid exposing identifiable visitors or private campaign strategy.

**Demonstrations:** 11, 12, 27, 30.

## 9. Editing a live store safely: read first, one change at a time, log everything
**Problem class:** Many store fixes have to be made in a live theme or live admin settings, where a mistake is visible to customers straight away and several small edits made together are hard to untangle.

**Approach:** A deliberately slow routine, used for every change, however small:
1. **Read first.** Before editing, read the template, section, snippet, or setting that renders the problem, and find every other place that reads the same data, for example with a code search for the metafield key or tag. Note what the page shows now, with a screenshot.
2. **Work on a copy.** Duplicate the live theme, or use a development theme, and make the change there. Preview it on the affected pages at mobile and desktop widths.
3. **One change at a time.** Each change has one purpose. If a second problem turns up, it goes on the list, not into the current edit.
4. **Log the change.** Record it before publishing, using the template below.
5. **Publish, then verify.** Check the same pages again on the live store, compare them with the "before" notes, and keep the previous theme version ready to republish.

```text
Date and time:
Where:            (theme name, file, or admin setting)
Why:              (problem, and how it was confirmed)
Change:           (what was edited, old value -> new value)
Checked before:   (pages and devices previewed)
Checked after:    (pages and devices verified live)
How to undo:      (previous theme version, or the old value)
```

**Why it works:** A single, logged change can be traced and reversed in minutes. A batch of unlogged edits turns every later problem into an investigation.

**Demonstrations:** This is a process, so there is no code for it. Examples 23, 25, 29, and 43 follow the same read-only principle: they report, and a person decides what to change.

## 10. Diagnosing a badge that came from stale tags
**Problem class:** A product shows a badge, such as "Bestseller" or "New", that merchandisers believe they removed. Editing the badge in the admin appears to change nothing.

This write-up is generalised: it describes the diagnosis method with fictional names, not a specific store.

**Diagnosis:**
1. **Find what renders the badge.** Searching the theme code for the badge markup showed two sources: newer code read a product metafield, and older code still checked for a `badge:` product tag.
2. **Compare the two sources.** For an affected product, the metafield had been updated but an old `badge:Bestseller` tag was still on the product. The tag check ran first, so the stale tag won.
3. **Measure the scope before fixing.** A read-only audit (example 43) compares tags with the metafield for every product and sorts products into: tag disagrees with metafield, tag without metafield, several badge tags, and tags that are now redundant.

**Fix:**
- Make the metafield the only source. The [category badge section](./theme/README.md) reads a metaobject reference and deliberately ignores tags.
- Copy any badge that existed only as a tag into the metafield, so nothing disappears unexpectedly.
- Remove the tag check from the theme, then remove the `badge:` tags, one change at a time and logged as in section 9.
- Re-run the audit. Only once it reports nothing is the tag logic safe to delete permanently.

**Lesson:** Two sources for one fact will eventually disagree. When migrating from tags to metafields, retire the old source on purpose instead of leaving it as a fallback.

**Demonstrations:** 43 (audit) and the [category badge section](./theme/sections/product-category-badge.liquid).

## 11. Auditing and hardening this portfolio repository
**Problem class:** A public portfolio grows quickly through many small commits. Nobody had checked whether its automated checks actually ran, whether its history contained anything that shouldn't be public, or whether its examples did what their comments said.

Unlike sections 1 to 10, this one describes work on this repository, so every figure below can be checked against its public commits, pull requests, and GitHub Actions runs. The work was done with an AI coding assistant (Claude Code), with each change reviewed and approved through pull requests.

**Approach:**
1. **Audit before changing anything.** Inventory every file, read the full Git history, and run each CI step locally. No edits until the findings were reviewed.
2. **Scan the history, not just the current files.** Every version of every file in every commit was checked for credential formats, store and analytics identifiers, webhook URLs, and contact details. Nothing secret was found. The review also covered content that pattern matching cannot catch: a few descriptions identified a specific vendor and specific internal workflows, so they were generalised in later pull requests.
3. **Find out why CI was red.** The workflow ran `npm test`, but `package.json` had no `test` script, so every run on `main` failed before reaching a single test (20 runs at the time of writing). The tests themselves passed when run directly. Vercel kept deploying regardless, because deployment did not depend on CI.
4. **Make tests prove something.** A test was added for every example. Each new test was then checked by breaking the code on purpose: the idempotency test fails against the original handler, which ran duplicate events twice when they arrived together, and each of four deliberate breaks in the theme sections makes the matching test fail.
5. **Automate the publication check.** A small, dependency-free scanner (`npm run check:safety`) now runs in CI. Its first run flagged a hardcoded secret in a test fixture. The secret was harmless, but the fix was to generate a random one at runtime rather than weaken the rule.
6. **Stack small pull requests.** Fixes, additions, and content changes went into separate, reviewable pull requests, each based on the one before, so no change reached `main` without review.

**What the evidence shows:**
- CI failed on every run on `main` before the fix, and passes on the pull request branches.
- The test count went from 11 to 72, covering every JavaScript example, the theme sections, and the delivery rule.
- One concurrency bug was found and fixed (example 03), with a test that reproduces it.
- Two of the audit's own mistakes were caught by its checks: the coverage test found an example count off by one, and calculating the real badge contrast ratios corrected an inaccurate accessibility claim.

**Lesson:** A green build badge, or a passing local test run, says nothing until you confirm CI actually reaches the tests. Checking the checks came first.

**Demonstrations:** [the CI workflow](./.github/workflows/portfolio-ci.yml), [the publication safety scanner](./scripts/check-public-safety.mjs), [the example tests](./tests/examples.test.mjs), and the repository's pull requests.

## 12. Performance baseline audit for a Shopify storefront
**Problem class:** A store felt slow and had collected apps, tracking tags, and fonts over several years. Before changing anything, the team needed a written baseline to measure fixes against.

Generalised from my own audit notes. The store, its apps, and all metric values are left out. The document recorded the starting point only, so no results are claimed here.

**Approach:**
1. **Record a baseline.** Desktop Lighthouse lab metrics (LCP, TBT, and CLS), plus a mobile run covering main-thread work, JavaScript execution, render-blocking resources, and image delivery.
2. **Break LCP into its phases** (time to first byte, resource load delay, load duration, and render delay) to find which phase to fix, not just that LCP was slow.
3. **List every third-party script, font source, preconnect, and theme app embed**, the last one by one from `settings_data.json`.

**Findings, by category:**
- **LCP:** the hero slideshow image was the LCP element on every page, and it was lazy-loaded by a hardcoded attribute through `data-src`, with no fetch priority. Load delay and render delay accounted for almost all of the LCP time. The hero images were also uploaded as PNG.
- **Duplicate tracking:** a tag manager container and a session-recording script each loaded twice, and an advertising pixel showed signs of firing twice.
- **Blocking time:** besides the duplicates, large app bundles shipped mostly unused code, and the platform's own pixel manager was the heaviest single script.
- **Render-blocking CSS:** an app loaded stylesheets that coverage analysis showed were completely unused.
- **Fonts:** four separate sources served typefaces, and none of them set `font-display`, so text waited for web fonts.
- **Housekeeping:** apps that had been uninstalled had left theme files, embed entries, and admin pages behind.

**Recommended fixes and follow-ups recorded:** load the first hero image eagerly with high priority, deduplicate tags, add two missing preconnects, review one embed whose purpose was unclear, and confirm whether a split test was still running. Cleaning up the leftover files was kept separate from the performance changes, following section 9.

**Demonstrations:** the [LCP-safe hero image snippet](./theme/snippets/hero-image.liquid), and three read-only audit tools built for these checks: 44 (scripts loaded twice), 45 (`font-display` and font hosts), and 46 (app embeds, including ones left behind by uninstalled apps). Also 34 and 35.

## 13. Store builds and tracking set-up
**Problem class:** Launching or onboarding a store means building a large catalogue and its navigation quickly, then connecting analytics and shopping channels without double counting.

Generalised from my own dated work logs for two client stores (2022 and 2023). Client names, suppliers, and the pricing formula are left out. The logs record the work, not results.

**Build (first store):**
- Bulk-uploaded a supplier catalogue of over a thousand products with SKUs and images, then built about 50 collections, the category and mega menus, and homepage collection blocks.
- Customised the theme's fonts, colours, and footer, and fixed the contact form and legal pages.
- Rebuilt shipping as weight bands derived from supplier costs so that free shipping could be offered, then recalculated product prices to match.
- Set up the supplier's data feed, where a permissions issue on the supplier's side blocked progress. The log doesn't record how that was resolved.

**Onboarding and tracking (second store):**
- Audited the store, then installed and customised a premium theme.
- Set up a GTM data layer and connected it to GA4, configured Google Merchant Center shopping feeds and debugged the product feed, and configured the Meta pixel and catalogue for a social shop.
- Wrote headlines and descriptions for every collection, and planned a collection structure and announcement-bar messages.

**What I would do differently today:** order-status-page scripts are now deprecated for checkout tracking. Example 47 shows the current approach, a custom pixel that sends a GA4 purchase with a transaction ID so that duplicates can be removed.

**Demonstrations:** 47 (GA4 purchase pixel), 11 and 36 (purchase deduplication), 30 (UTM links), and 01, 10, and 26 (weights and zones).

## Publication boundaries
- Employer-owned code, live themes, Shopify Flow exports, proprietary rules, private API contracts, and actual tracking datasets are intentionally **not** published.
- Real account, order, product, theme, or vendor identifiers and domain-specific internal rules are excluded.
- Where permission exists, an authorised source-level contribution can be documented separately after owner review.
- These examples are not proof that identical code was deployed or audited in any company system.
