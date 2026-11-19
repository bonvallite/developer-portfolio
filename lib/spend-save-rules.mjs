/**
 * Public, dependency-free model for the Spend & Save educational demo.
 * It never calls Shopify or modifies a basket/order. A real Shopify Flow
 * requires verified variant IDs, order-edit permissions and idempotency.
 */
export const DEFAULT_THRESHOLDS = Object.freeze({ first: 150, shipping: 200, final: 300 });

export function validateThresholds(t = DEFAULT_THRESHOLDS) {
  if (!t || !['first','shipping','final'].every(k => Number.isFinite(t[k]) && t[k] > 0)) {
    throw new RangeError('All reward thresholds must be positive finite numbers');
  }
  if (!(t.first < t.shipping && t.shipping < t.final)) {
    throw new RangeError('Thresholds must increase from first gift to shipping to final gift');
  }
  return t;
}

export function getRewardProgress(subtotal, thresholds = DEFAULT_THRESHOLDS) {
  validateThresholds(thresholds);
  if (!Number.isFinite(subtotal) || subtotal < 0) throw new RangeError('Subtotal must be non-negative and finite');
  const stages = [thresholds.first, thresholds.shipping, thresholds.final];
  const next = stages.find(value => subtotal < value) ?? null;
  return {
    next,
    remaining: next === null ? 0 : Math.max(0, next - subtotal),
    percentage: Math.min(100, subtotal / thresholds.final * 100),
    firstGiftUnlocked: subtotal >= thresholds.first,
    freeShippingUnlocked: subtotal >= thresholds.shipping,
    finalGiftUnlocked: subtotal >= thresholds.final,
  };
}

/**
 * Illustrative, post-checkout eligibility only. Not a Shopify order-edit API.
 * Return gift descriptions, never mutate the original order or cart.
 */
export function getEligibleGifts(subtotal, thresholds = DEFAULT_THRESHOLDS) {
  const progress = getRewardProgress(subtotal, thresholds);
  return [
    ...(progress.firstGiftUnlocked ? [{ sku: 'DEMO-PATTIES', quantity: 2, price: 0 }] : []),
    ...(progress.finalGiftUnlocked ? [{ sku: 'DEMO-RIB-FILLET', quantity: 1, price: 0 }] : []),
  ];
}

/**
 * Model an idempotent, successful post-checkout edit.
 * 'processed' means the gift edit was previously committed.
 * Email is permitted only after a successful commit with eligible gifts.
 */
export function simulateFlow({ subtotal, paid, processed = false, commitSucceeded = true, thresholds = DEFAULT_THRESHOLDS }) {
  const gifts = getEligibleGifts(subtotal, thresholds);
  if (!paid) return { status: 'not-paid', gifts: [], email: false };
  if (processed) return { status: 'already-processed', gifts: [], email: false };
  if (!gifts.length) return { status: 'not-eligible', gifts: [], email: false };
  if (!commitSucceeded) return { status: 'edit-failed', gifts: [], email: false };
  return { status: 'fulfilled', gifts, email: true };
}
