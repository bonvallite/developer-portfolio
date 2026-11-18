// Reward ladder engine for the interactive cart demo. Pure functions, no DOM.
//
// Independently authored portfolio code. All offer values, labels and prices
// are fictional. Nothing here reproduces a client theme, app configuration,
// promotion, or product catalogue.
//
// Design rules this module demonstrates:
//   1. Offer data lives in configuration fields, never in the logic.
//   2. Parsing FAILS CLOSED: a disabled, blank, or malformed offer produces no
//      ladder at all. There are deliberately no fallback amounts or gift names.
//   3. Qualification uses exact thresholds in integer cents. The progress bar
//      is only a visual, drawn in equal segments between milestones.
//   4. Copy frames insert the configured labels verbatim, so a label that
//      already says "Free" never turns into "a free Free ...".
//   5. The subtotal basis is ONE function, so it can be matched to whatever
//      rule the fulfilment automation really uses.
import { rewardState } from "../examples/48-open-shadow-cart-enhancer.js";

export const DEMO_OFFER_FIELDS = Object.freeze({
  rewards_enabled: true,
  gift_one_threshold: 100,
  shipping_threshold: 150,
  gift_two_threshold: 250,
  gift_one_label: "2 Free Sample Coffee Bags (250g)",
  gift_two_label: "Free Sample Ceramic Mug",
  terms: "Rewards are added when your order is packed. Gift card only orders are excluded.",
});

export const SUBTOTAL_BASES = Object.freeze(["after_line_discounts", "after_all_discounts"]);

const THRESHOLD_FIELDS = [
  ["gift_one_threshold", "tierOneCents"],
  ["shipping_threshold", "shippingCents"],
  ["gift_two_threshold", "tierTwoCents"],
];

function fail(reason) {
  return { ok: false, reason };
}

function wholeDollars(value) {
  let n = value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^\d{1,7}$/.test(trimmed)) return null;
    n = Number(trimmed);
  }
  return Number.isInteger(n) && n > 0 && n <= 1000000 ? n : null;
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

// Turns raw offer fields (as a storefront would receive them) into a validated
// config in integer cents, or a reason the ladder must not render.
export function parseOfferFields(fields) {
  if (!fields || typeof fields !== "object") return fail("missing_offer");

  const enabled = fields.rewards_enabled;
  if (enabled !== true && enabled !== "true") return fail("disabled");

  const config = {};
  for (const [field, key] of THRESHOLD_FIELDS) {
    const dollars = wholeDollars(fields[field]);
    if (dollars === null) return fail(`invalid_${field}`);
    config[key] = dollars * 100;
  }
  if (!(config.tierOneCents < config.shippingCents && config.shippingCents < config.tierTwoCents)) {
    return fail("thresholds_not_ascending");
  }

  const giftOne = cleanText(fields.gift_one_label, 120);
  if (!giftOne) return fail("missing_gift_one_label");
  const giftTwo = cleanText(fields.gift_two_label, 120);
  if (!giftTwo) return fail("missing_gift_two_label");
  config.giftOne = giftOne;
  config.giftTwo = giftTwo;

  const rawTerms = fields.terms;
  if (rawTerms === undefined || rawTerms === null || rawTerms === "") {
    config.terms = "";
  } else {
    const terms = cleanText(rawTerms, 240);
    if (!terms) return fail("invalid_terms");
    config.terms = terms;
  }

  return { ok: true, config };
}

function nonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative integer number of cents`);
  }
  return value;
}

// The one place that decides what "the cart total" means for qualification.
// Field names follow the public Shopify cart JSON shape (cents):
//   items[].final_line_price, items[].gift_card,
//   items_subtotal_price (after line discounts), total_price (after all).
//
// after_line_discounts : sum of line prices after line-level discounts.
// after_all_discounts  : the above, minus any cart-level discount.
//
// Simplification: a cart-level discount is not apportioned across lines, so
// the whole discount is deducted even if gift cards are excluded.
export function qualifyingSubtotalCents(cart, { basis = "after_line_discounts", excludeGiftCards = true } = {}) {
  if (!cart || !Array.isArray(cart.items)) throw new TypeError("Cart items are required");
  if (!SUBTOTAL_BASES.includes(basis)) throw new RangeError("Unknown subtotal basis");

  let itemsCents = 0;
  for (const item of cart.items) {
    const line = nonNegativeInteger(item?.final_line_price, "Line price");
    if (excludeGiftCards && item.gift_card === true) continue;
    itemsCents += line;
  }
  if (basis === "after_line_discounts") return itemsCents;

  const before = nonNegativeInteger(cart.items_subtotal_price, "Items subtotal");
  const after = nonNegativeInteger(cart.total_price, "Cart total");
  const cartLevelDiscount = Math.max(0, before - after);
  return Math.max(0, itemsCents - cartLevelDiscount);
}

export function formatCents(cents) {
  nonNegativeInteger(cents, "Amount");
  const whole = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${whole}.${String(cents % 100).padStart(2, "0")}`;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

// Visual progress only. Each milestone owns an equal share of the bar, however
// far apart the real thresholds are. Qualification never reads this value.
export function ladderFillPercent(subtotalCents, thresholdsCents) {
  nonNegativeInteger(subtotalCents, "Subtotal");
  const stops = [0, ...thresholdsCents];
  const segment = 100 / thresholdsCents.length;
  for (let i = 0; i < thresholdsCents.length; i++) {
    if (subtotalCents < stops[i + 1]) {
      const span = stops[i + 1] - stops[i];
      const within = span > 0 ? (Math.max(subtotalCents, stops[i]) - stops[i]) / span : 0;
      // Rounding must never draw the bar onto a marker that is not yet reached.
      return Math.min(round2((i + within) * segment), round2((i + 1) * segment - 0.01));
    }
  }
  return 100;
}

const KINDS = [
  ["gift", "Gift", "your gift"],
  ["shipping", "Shipping", "free shipping"],
  ["bonus", "Bonus", "your bonus gift"],
];

function joinList(items) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0];
}

// Everything a renderer needs for one subtotal, as plain data.
export function rewardLadderView(subtotalCents, config) {
  const state = rewardState(subtotalCents, config);
  const thresholds = [config.tierOneCents, config.shippingCents, config.tierTwoCents];

  const markers = KINDS.map(([kind, label], i) => ({
    kind,
    label,
    thresholdCents: thresholds[i],
    thresholdLabel: `$${thresholds[i] / 100}`,
    reached: subtotalCents >= thresholds[i],
    position: round2(((i + 1) / thresholds.length) * 100),
  }));

  const remaining = formatCents(state.remainingCents);
  let parts;
  if (state.stage === "tier_one_next") {
    parts = [["Spend ", false], [remaining, true], [" more to get ", false], [config.giftOne, true]];
  } else if (state.stage === "shipping_next") {
    parts = [["Spend ", false], [remaining, true], [" more for ", false], ["FREE SHIPPING", true]];
  } else if (state.stage === "tier_two_next") {
    parts = [["Spend ", false], [remaining, true], [" more to add ", false], [config.giftTwo, true]];
  } else {
    parts = [["All rewards unlocked", true]];
  }
  parts = parts.map(([text, strong]) => ({ text, strong }));

  let secondary = "";
  if (state.stage === "complete") {
    secondary = `${config.giftOne}, FREE SHIPPING and ${config.giftTwo}`;
  } else {
    const unlocked = markers.filter((m, i) => m.reached).map((m) => KINDS.find(([k]) => k === m.kind)[2]);
    if (unlocked.length > 0) secondary = `Unlocked: ${joinList(unlocked)}`;
  }

  return {
    stage: state.stage,
    complete: state.stage === "complete",
    remainingCents: state.remainingCents,
    fillPercent: ladderFillPercent(subtotalCents, thresholds),
    markers,
    parts,
    headline: parts.map((p) => p.text).join(""),
    secondary,
  };
}
