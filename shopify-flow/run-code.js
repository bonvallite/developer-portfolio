/**
 * Illustrative Shopify Flow Run code action.
 * Map to your actual Flow input schema; this file is NOT a workflow export.
 * All thresholds are fictional and are not client pricing rules.
 *
 * Expected input example:
 * { "order": { "id": "gid://shopify/Order/EXAMPLE", "customerEligible": true,
 *   "lines": [{ "quantity": 2, "gramsPerUnit": 1200 }] } }
 *
 * Output shape: { eligible, totalGrams, tier, reason }
 */
export default function main(input) {
  const order = input?.order;
  if (!order || !Array.isArray(order.lines)) {
    return { eligible: false, totalGrams: 0, tier: "none", reason: "missing_order" };
  }
  let totalGrams = 0;
  for (const line of order.lines) {
    const quantity = line?.quantity;
    const grams = line?.gramsPerUnit;
    if (!Number.isSafeInteger(quantity) || quantity < 0 ||
        !Number.isSafeInteger(grams) || grams < 0) {
      return { eligible: false, totalGrams: 0, tier: "none", reason: "invalid_line" };
    }
    totalGrams += grams * quantity;
    if (!Number.isSafeInteger(totalGrams)) {
      return { eligible: false, totalGrams: 0, tier: "none", reason: "overflow" };
    }
  }
  if (order.customerEligible !== true) {
    return { eligible: false, totalGrams, tier: "none", reason: "not_wholesale" };
  }
  const tier = totalGrams >= 10000 ? "sample-10kg" :
    totalGrams >= 5000 ? "sample-5kg" : "none";
  return { eligible: tier !== "none", totalGrams, tier,
    reason: tier === "none" ? "below_threshold" : "qualified" };
}
