# Interactive reward ladder mockup

**Interactive route:** `/reward-ladder-mockup` on a deployed version of this portfolio.

An interactive version of the design mockup for the reward ladder. The shop, products, prices, and offer are **fictional**, and the design is independently produced. It is not a copy of any employer mockup or project.

## What you can do

- **Step through the five design states** (early cart, close to the first gift, gift unlocked, gift and shipping unlocked, all rewards unlocked). Each state is a real basket of fictional products.
- **Switch between today and proposed.** Today is a shipping-only strip. Proposed is the reward ladder.
- **Scrub the qualifying subtotal** with a slider to watch the message, the unlocked line, and the rail respond.
- **Change the cart width** (360, 390, and 480 pixels) to check the compact layout.
- **Change the offer** and watch every threshold, label, and message follow with no code change, or switch the offer off.
- **Click a design note** (eyebrow, headline, unlocked line, rail, labels, terms) to highlight that part, with its size, weight, and colour.

## One component, not a copy

The ladder in the mockup is drawn by the same renderer the working enhancer uses (`renderLadder` in [`lib/reward-ladder-mount.mjs`](lib/reward-ladder-mount.mjs)), and its state comes from the same engine ([`lib/reward-ladder.mjs`](lib/reward-ladder.mjs)). The mockup therefore shows the real component.

## How it is kept honest

[`lib/reward-ladder-mockup.mjs`](lib/reward-ladder-mockup.mjs) holds the scenarios and design notes, and its tests check that:

- each design state really produces the stage it is labelled with, using the default offer;
- state B is within $5 of the first gift and state A is well short;
- every design note points at a selector and values that exist in the shipped stylesheet, so the notes cannot drift from the build.

## Related

- [Plan](REWARD_LADDER_PLAN.md) (`/reward-ladder-plan`)
- [Interactive demo](REWARD_LADDER_DEMO.md) (`/reward-ladder-demo`), which shows the working behaviour: re-renders, anchor loss, fail-open and fail-closed rules

## Preview validation: 18 November 2026

Real desktop Chrome checks on the Vercel preview used commit `9c6a380e7f3e74cf4f60afe4ffa55ff8912ba6f9` and code tree `c7cb207b14832d8eac897d4fddc6313079c3c34a`.

- States A to E produced the expected reward stages, and the subtotal slider changed qualification correctly at $99, $100, $149, and $150.
- Today mode hid the ladder and Proposed mode restored it. Changing the offer updated its thresholds; disabling rewards removed the ladder.
- The 360, 390, and 480 px drawer-width controls worked, with no horizontal overflow inside the mockup cart.
- All six design-note toggles highlighted the corresponding parts, and quantity controls updated the basket.
- No application console errors were observed in these flows; browser-extension logs were excluded.

The full release checks passed: 155 JavaScript tests, 16 Python tests, the publication scan for 163 tracked files, TypeScript, and the production build. After the release corrections, the 48 Reward Ladder tests, TypeScript, and the build passed again. See the [publication review](REWARD_LADDER_DEMO.md#18-november-2026-publication-review) for the shared evidence and recovery plan.

This records preview QA only. Production has not been deployed at the time of this entry; the production release receipt and current status are maintained in [PR #35](https://github.com/bonvallite/developer-portfolio/pull/35).

## Limits

A mockup shows intent and does not grant rewards. The browser checks cover desktop Chrome and the mockup's drawer-width controls. They do not establish behaviour in an actual mobile browser viewport, on physical mobile devices, in other browsers, or with assistive technology. Screen-reader announcements and real store/checkout integration remain unverified.
