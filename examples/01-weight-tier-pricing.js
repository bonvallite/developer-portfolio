// Example-only tier pricing using fictional thresholds; not production pricing.
export function weightTierPrice(items, tiers) {
  const kilograms = items.reduce((sum, x) => sum + x.quantity * x.weightKg, 0);
  if (!items.every(x => x.quantity >= 0 && x.weightKg >= 0)) throw Error("Invalid items");
  const tier = [...tiers].sort((a,b) => b.minKg - a.minKg).find(t => kilograms >= t.minKg);
  const subtotal = items.reduce((sum, x) => sum + x.quantity * x.unitPrice, 0);
  return { kilograms, subtotal, discountPercent: tier?.discountPercent ?? 0,
    total: Math.round(subtotal * (1 - (tier?.discountPercent ?? 0) / 100) * 100) / 100 };
}
