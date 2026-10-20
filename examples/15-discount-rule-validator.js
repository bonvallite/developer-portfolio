// Validate fictional weight tiers in the shape lib/b2b-simulator.mjs uses:
// { minimumGrams, discountBps } where 100 basis points = 1%.
// Returns readable errors so a settings screen can explain what to fix.
export function validateTiers(tiers) {
  if (!Array.isArray(tiers) || !tiers.length) return ["At least one tier is required"];
  const errors = [];
  const sorted = [...tiers].sort((a, b) => a.minimumGrams - b.minimumGrams);
  if (sorted[0].minimumGrams !== 0) errors.push("Lowest tier must start at 0 g");
  sorted.forEach((tier, i) => {
    if (!Number.isSafeInteger(tier.minimumGrams) || tier.minimumGrams < 0) errors.push(`Tier ${i + 1}: invalid minimumGrams`);
    if (!Number.isSafeInteger(tier.discountBps) || tier.discountBps < 0 || tier.discountBps > 10000) errors.push(`Tier ${i + 1}: discountBps must be 0-10000`);
    const previous = sorted[i - 1];
    if (previous && tier.minimumGrams === previous.minimumGrams) errors.push(`Duplicate threshold ${tier.minimumGrams} g`);
    if (previous && tier.discountBps < previous.discountBps) errors.push(`Tier at ${tier.minimumGrams} g discounts less than a lighter tier`);
  });
  return errors;
}
