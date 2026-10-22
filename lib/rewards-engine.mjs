/**
 * Fictional, independent portfolio demonstration of a configuration-led reward programme.
 * No production Shopify thresholds, product IDs, app selectors or workflow exports are used.
 * The browser consumes the same configuration object for every mock storefront surface.
 * Eligibility is informational only: it never grants gifts or changes shipping rates.
 */
export const DEMO_OFFER = Object.freeze({
  enabled: true,
  name: "The Chef's Rewards",
  giftThreshold: 125,
  giftLabel: "Complimentary pantry seasoning",
  shippingThreshold: 225,
  bonusThreshold: 325,
  bonusLabel: "Chef's recipe collection",
  terms: "Shipping is subject to postcode and service eligibility. Rewards are fulfilled after purchase."
});

export function validateOffer(offer) {
  if (!offer || typeof offer !== "object") return false;
  const values = [offer.giftThreshold, offer.shippingThreshold, offer.bonusThreshold];
  return typeof offer.enabled === "boolean" &&
    values.every(v => typeof v === "number" && Number.isFinite(v) && v > 0) &&
    values[0] < values[1] && values[1] < values[2] &&
    [offer.name, offer.giftLabel, offer.bonusLabel, offer.terms]
      .every(v => typeof v === "string" && v.trim().length > 0);
}

/**
 * Three equally sized visual stages are interpolated against the real monetary
 * thresholds. The visual percentage never determines reward entitlement.
 */
export function calculateRewardState(offer, subtotal) {
  if (!validateOffer(offer)) return { valid: false, enabled: false, milestones: [], progressPercent: 0, next: null };
  if (!offer.enabled) return { valid: true, enabled: false, milestones: [], progressPercent: 0, next: null };
  const amount = Number.isFinite(subtotal) ? Math.max(0, subtotal) : 0;
  const milestones = [
    { id: "gift", threshold: offer.giftThreshold, label: offer.giftLabel, unlocked: amount >= offer.giftThreshold },
    { id: "shipping", threshold: offer.shippingThreshold, label: "Eligible free shipping", unlocked: amount >= offer.shippingThreshold },
    { id: "bonus", threshold: offer.bonusThreshold, label: offer.bonusLabel, unlocked: amount >= offer.bonusThreshold }
  ];
  const next = milestones.find(m => !m.unlocked) ?? null;
  let previous = 0;
  let progressPercent = 100;
  for (let index = 0; index < milestones.length; index++) {
    const limit = milestones[index].threshold;
    if (amount < limit) {
      progressPercent = (index + (amount - previous) / (limit - previous)) * (100 / milestones.length);
      break;
    }
    previous = limit;
  }
  return {
    valid: true,
    enabled: true,
    amount,
    milestones,
    next,
    remaining: next ? Math.max(0, next.threshold - amount) : 0,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    unlockedCount: milestones.filter(m => m.unlocked).length
  };
}

export function formatAUD(amount) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amount);
}
