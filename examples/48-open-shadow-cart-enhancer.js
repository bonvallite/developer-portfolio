// Illustrative pattern for enhancing a third-party cart without taking over its
// cart or checkout behaviour. Uses fictional configuration only.
//
// The key idea is to discover a cart rendered in an OPEN ShadowRoot, add stable
// hooks after the app hydrates, keep reward thresholds configuration-driven,
// and preserve the app's native fallback unless the custom UI rendered.
//
// This is independently authored portfolio code, not production client source.

export function findAcrossOpenRoots(root, selector) {
  if (!root || typeof selector !== "string" || !selector) return null;

  const queue = [root];
  const seen = new Set();

  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);

    if (typeof current.querySelector === "function") {
      const found = current.querySelector(selector);
      if (found) return found;
    }

    if (typeof current.querySelectorAll === "function") {
      for (const element of current.querySelectorAll("*")) {
        if (element?.shadowRoot && !seen.has(element.shadowRoot)) {
          queue.push(element.shadowRoot);
        }
      }
    }
  }

  return null;
}

function validText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRewardConfig(config) {
  if (!config || !Number.isInteger(config.tierOneCents) ||
      !Number.isInteger(config.shippingCents) ||
      !Number.isInteger(config.tierTwoCents)) {
    throw new TypeError("Reward thresholds must be integer cents");
  }

  if (!(config.tierOneCents > 0 &&
        config.shippingCents > config.tierOneCents &&
        config.tierTwoCents > config.shippingCents)) {
    throw new RangeError("Reward thresholds must be positive and ascending");
  }

  if (!validText(config.giftOne) || !validText(config.giftTwo)) {
    throw new TypeError("Reward labels are required");
  }
}

export function rewardState(subtotalCents, config) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new TypeError("Subtotal must be a non-negative integer number of cents");
  }
  validateRewardConfig(config);

  if (subtotalCents < config.tierOneCents) {
    return {
      stage: "tier_one_next",
      remainingCents: config.tierOneCents - subtotalCents,
      unlocked: [],
    };
  }

  if (subtotalCents < config.shippingCents) {
    return {
      stage: "shipping_next",
      remainingCents: config.shippingCents - subtotalCents,
      unlocked: [config.giftOne],
    };
  }

  if (subtotalCents < config.tierTwoCents) {
    return {
      stage: "tier_two_next",
      remainingCents: config.tierTwoCents - subtotalCents,
      unlocked: [config.giftOne, "free shipping"],
    };
  }

  return {
    stage: "complete",
    remainingCents: 0,
    unlocked: [config.giftOne, "free shipping", config.giftTwo],
  };
}

export function addStableCartHooks(drawer) {
  if (!drawer || typeof drawer.querySelector !== "function") {
    return { title: false, subtotal: false, totals: 0 };
  }

  const title = drawer.querySelector("header h2");
  const subtotal = drawer.querySelector("footer .cart-subtotal");
  const totals = subtotal?.querySelectorAll?.("[data-money]") ?? [];

  title?.setAttribute?.("data-portfolio-cart-title", "");
  subtotal?.setAttribute?.("data-portfolio-cart-subtotal", "");
  for (const total of totals) total?.setAttribute?.("data-portfolio-cart-total", "");

  return { title: Boolean(title), subtotal: Boolean(subtotal), totals: totals.length };
}

export function shouldHideNativeFallback(customUiRendered) {
  return customUiRendered === true;
}
