import test from "node:test";
import assert from "node:assert/strict";
import {
  DEMO_OFFER_FIELDS,
  parseOfferFields,
  qualifyingSubtotalCents,
  formatCents,
  ladderFillPercent,
  rewardLadderView,
} from "../lib/reward-ladder.mjs";

const parsed = parseOfferFields(DEMO_OFFER_FIELDS);
assert.equal(parsed.ok, true);
const config = parsed.config;

test("demo offer fields parse into integer cents", () => {
  assert.equal(config.tierOneCents, 10000);
  assert.equal(config.shippingCents, 15000);
  assert.equal(config.tierTwoCents, 25000);
  assert.equal(config.giftOne, "2 Free Sample Coffee Bags (250g)");
});

test("numeric strings are accepted because storefront fields often arrive as text", () => {
  const result = parseOfferFields({
    ...DEMO_OFFER_FIELDS,
    rewards_enabled: "true",
    gift_one_threshold: "120",
    shipping_threshold: " 160 ",
    gift_two_threshold: "260",
  });
  assert.equal(result.ok, true);
  assert.equal(result.config.tierOneCents, 12000);
  assert.equal(result.config.shippingCents, 16000);
});

test("parsing fails closed and never falls back to default values", () => {
  const cases = [
    [undefined, "missing_offer"],
    [null, "missing_offer"],
    [{ ...DEMO_OFFER_FIELDS, rewards_enabled: false }, "disabled"],
    [{ ...DEMO_OFFER_FIELDS, rewards_enabled: undefined }, "disabled"],
    [{ ...DEMO_OFFER_FIELDS, gift_one_threshold: "" }, "invalid_gift_one_threshold"],
    [{ ...DEMO_OFFER_FIELDS, shipping_threshold: 150.5 }, "invalid_shipping_threshold"],
    [{ ...DEMO_OFFER_FIELDS, gift_two_threshold: -5 }, "invalid_gift_two_threshold"],
    [{ ...DEMO_OFFER_FIELDS, gift_two_threshold: "abc" }, "invalid_gift_two_threshold"],
    [{ ...DEMO_OFFER_FIELDS, shipping_threshold: 90 }, "thresholds_not_ascending"],
    [{ ...DEMO_OFFER_FIELDS, gift_two_threshold: 150 }, "thresholds_not_ascending"],
    [{ ...DEMO_OFFER_FIELDS, gift_one_label: "   " }, "missing_gift_one_label"],
    [{ ...DEMO_OFFER_FIELDS, gift_two_label: undefined }, "missing_gift_two_label"],
    [{ ...DEMO_OFFER_FIELDS, terms: "x".repeat(241) }, "invalid_terms"],
  ];
  for (const [fields, reason] of cases) {
    assert.deepEqual(parseOfferFields(fields), { ok: false, reason });
  }
});

test("terms are optional and blank terms produce no terms line", () => {
  const { terms, ...rest } = DEMO_OFFER_FIELDS;
  assert.equal(parseOfferFields(rest).config.terms, "");
});

test("each milestone flips exactly at its threshold, one cent either side", () => {
  const stage = (cents) => rewardLadderView(cents, config).stage;
  assert.equal(stage(0), "tier_one_next");
  assert.equal(stage(9999), "tier_one_next");
  assert.equal(stage(10000), "shipping_next");
  assert.equal(stage(14999), "shipping_next");
  assert.equal(stage(15000), "tier_two_next");
  assert.equal(stage(24999), "tier_two_next");
  assert.equal(stage(25000), "complete");
  assert.equal(stage(99999), "complete");
});

test("markers are only reached at or above their real threshold", () => {
  const reached = (cents) => rewardLadderView(cents, config).markers.map((m) => m.reached);
  assert.deepEqual(reached(9999), [false, false, false]);
  assert.deepEqual(reached(10000), [true, false, false]);
  assert.deepEqual(reached(14999), [true, false, false]);
  assert.deepEqual(reached(15000), [true, true, false]);
  assert.deepEqual(reached(25000), [true, true, true]);
});

test("copy inserts configured labels verbatim, so labels that say Free are not doubled", () => {
  assert.equal(
    rewardLadderView(9999, config).headline,
    "Spend $0.01 more to get 2 Free Sample Coffee Bags (250g)",
  );
  assert.equal(rewardLadderView(10000, config).headline, "Spend $50.00 more for FREE SHIPPING");
  assert.equal(
    rewardLadderView(15000, config).headline,
    "Spend $100.00 more to add Free Sample Ceramic Mug",
  );
  assert.equal(rewardLadderView(25000, config).headline, "All rewards unlocked");
  for (const cents of [0, 9999, 10000, 15000, 25000]) {
    assert.doesNotMatch(rewardLadderView(cents, config).headline, /free Free/i);
  }
});

test("changing the offer fields changes the copy and thresholds without code changes", () => {
  const changed = parseOfferFields({
    ...DEMO_OFFER_FIELDS,
    gift_one_threshold: 175,
    shipping_threshold: 200,
    gift_two_threshold: 300,
    gift_one_label: "Free Sample Tea Tin (100g)",
  }).config;
  const view = rewardLadderView(17000, changed);
  assert.equal(view.stage, "tier_one_next");
  assert.equal(view.headline, "Spend $5.00 more to get Free Sample Tea Tin (100g)");
  assert.equal(view.markers[0].thresholdLabel, "$175");
});

test("secondary line summarises what is already unlocked", () => {
  assert.equal(rewardLadderView(5000, config).secondary, "");
  assert.equal(rewardLadderView(10000, config).secondary, "Unlocked: your gift");
  assert.equal(rewardLadderView(15000, config).secondary, "Unlocked: your gift and free shipping");
  assert.equal(
    rewardLadderView(25000, config).secondary,
    "2 Free Sample Coffee Bags (250g), FREE SHIPPING and Free Sample Ceramic Mug",
  );
});

test("progress is drawn in equal segments regardless of threshold distance", () => {
  const thresholds = [10000, 15000, 25000];
  assert.equal(ladderFillPercent(0, thresholds), 0);
  assert.equal(ladderFillPercent(5000, thresholds), 16.67);
  assert.equal(ladderFillPercent(12500, thresholds), 50);
  assert.equal(ladderFillPercent(20000, thresholds), 83.33);
  assert.equal(ladderFillPercent(25000, thresholds), 100);
  assert.equal(ladderFillPercent(1000000, thresholds), 100);
});

test("the bar never touches a marker that has not been reached", () => {
  const view = (cents) => rewardLadderView(cents, config);
  for (const cents of [9999, 14999, 24999]) {
    const v = view(cents);
    const next = v.markers.find((m) => !m.reached);
    assert.ok(v.fillPercent < next.position, `${cents} drew onto an unreached marker`);
  }
  assert.equal(view(25000).fillPercent, 100);
});

test("a zero-width segment cannot divide by zero", () => {
  assert.doesNotThrow(() => ladderFillPercent(100, [100, 100, 200]));
});

test("subtotal basis: line discounts, cart discounts and gift cards", () => {
  const cart = {
    items: [
      { final_line_price: 8000, gift_card: false },
      { final_line_price: 4000, gift_card: false },
      { final_line_price: 2500, gift_card: true },
    ],
    items_subtotal_price: 14500,
    total_price: 13000,
  };
  assert.equal(qualifyingSubtotalCents(cart), 12000);
  assert.equal(qualifyingSubtotalCents(cart, { excludeGiftCards: false }), 14500);
  assert.equal(qualifyingSubtotalCents(cart, { basis: "after_all_discounts" }), 10500);
  assert.equal(
    qualifyingSubtotalCents(cart, { basis: "after_all_discounts", excludeGiftCards: false }),
    13000,
  );
  assert.equal(
    qualifyingSubtotalCents({ items: [{ final_line_price: 2500, gift_card: true }], items_subtotal_price: 2500, total_price: 2500 }),
    0,
  );
});

test("a discount larger than the basket never produces a negative subtotal", () => {
  const cart = { items: [{ final_line_price: 1000 }], items_subtotal_price: 1000, total_price: 0 };
  assert.equal(qualifyingSubtotalCents(cart, { basis: "after_all_discounts" }), 0);
});

test("subtotal inputs are validated", () => {
  assert.throws(() => qualifyingSubtotalCents(null), TypeError);
  assert.throws(() => qualifyingSubtotalCents({ items: [{ final_line_price: 1.5 }] }), TypeError);
  assert.throws(() => qualifyingSubtotalCents({ items: [{ final_line_price: -1 }] }), TypeError);
  assert.throws(() => qualifyingSubtotalCents({ items: [] }, { basis: "mystery" }), RangeError);
  assert.throws(
    () => qualifyingSubtotalCents({ items: [{ final_line_price: 100 }] }, { basis: "after_all_discounts" }),
    TypeError,
  );
});

test("money formatting is deterministic", () => {
  assert.equal(formatCents(1), "$0.01");
  assert.equal(formatCents(10000), "$100.00");
  assert.equal(formatCents(123456789), "$1,234,567.89");
  assert.throws(() => formatCents(-1), TypeError);
});

test("the engine never mutates its inputs", () => {
  const before = JSON.stringify(config);
  rewardLadderView(12345, config);
  assert.equal(JSON.stringify(config), before);
  assert.equal(Object.isFrozen(DEMO_OFFER_FIELDS), true);
});
