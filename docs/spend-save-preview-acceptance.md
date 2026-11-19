# Spend & Save preview acceptance checklist

> Public educational reconstruction. All products, order edits, and emails are simulated. No live Shopify checkout, gift fulfilment, or customer messages are triggered.

## Release candidate

- Branch: `feature/spend-save-storytelling-demo`
- Preview route: `/projects/spend-and-save`
- Required checks: GitHub Actions portfolio checks (tests, safety, TypeScript, build) and Vercel preview READY
- Do not merge until browser acceptance below is recorded.

## Shopper journey (desktop and mobile)

1. Load the preview directly and from the homepage showcase link. Confirm no missing assets, horizontal overflow, console errors, or inaccessible controls.
2. Start with an empty basket: no gifts unlocked; next reward A$150.
3. Add products to cross A$150: two Wagyu patties become **eligible**, but no gift line is inserted into the basket.
4. Cross A$200: free-shipping indicator becomes eligible. Explain that actual shipping rules are enforced separately at checkout.
5. Cross A$300: Angus Rib Fillet also becomes eligible. Progress bar stops at 100%.
6. Reset basket: subtotal, progress, and Flow state reset. Repeat using keyboard-only navigation and reduced-motion settings.

## Merchant configuration

1. Change first, shipping, and final thresholds in increasing order; verify progress and eligibility update consistently.
2. Try an out-of-order threshold; it must be rejected without breaking the page.
3. Restore defaults (A$150, A$200, A$300); Flow state must reset.
4. Confirm the copy says changes affect only the demonstration, not real metaobjects or Shopify checkout settings.

## Post-checkout Flow storyboard

1. With subtotal below A$150, simulate checkout: no gifts and no confirmation email.
2. With eligible subtotal, start the Flow sequence: no gift line appears before **Commit order edit**.
3. At **Commit order edit**, eligible complimentary gift lines become visible at A$0.
4. Only after **Send confirmation email** should the email preview appear. Verify that the copy clearly states no email was actually sent.
5. Confirm basket changes reset the Flow sequence, so stale simulated order gifts are never shown.

## Content and privacy

- All sample SKUs and product prices are illustrative, and no actual order IDs, credentials, Shopify tokens, customer information, or private theme code are published.
- The AOV calculator must say **hypothetical**, not report real uplift. Note gift costs, discounts, shipping subsidies, and contribution margin are excluded.
- Verify JRV branding and the public contact address; ensure existing portfolio projects, résumé, and navigation are unchanged.

## Verification record

| Item | Status | Notes |
| --- | --- | --- |
| Automated tests, security, TypeScript, and build | Passed on commit `00f24938` | GitHub Actions run 44632590478 |
| Vercel preview deployment | READY on commit `00f24938` | Deployment `dpl_GDws8b9C8SxdNdye6F82XmcFnmQi` |
| Desktop browser interaction | Pending manual verification | |
| Mobile browser interaction | Pending manual verification | |
| Keyboard and reduced-motion checks | Pending manual verification | |
| Release/merge | Not approved | Keep PR #72 unmerged |

This document is an acceptance plan, not evidence that manual checks passed.
