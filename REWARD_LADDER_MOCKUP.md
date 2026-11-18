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

## Limits

A mockup shows intent. It does not grant rewards, and it has not been checked on real devices or assistive technology. The pages were checked by building them and inspecting the rendered output, not in a real browser.
