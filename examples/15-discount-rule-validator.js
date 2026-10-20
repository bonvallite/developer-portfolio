// Fictional tier definitions, validation prevents overlapping thresholds.
export function validateTiers(tiers) {
  if (!Array.isArray(tiers) || !tiers.length) return false;
  const thresholds = new Set();
  return tiers.every(t => {
    if (!Number.isFinite(t.minKg) || t.minKg < 0 ||
        !Number.isFinite(t.discountPercent) || t.discountPercent < 0 ||
        t.discountPercent > 100 || thresholds.has(t.minKg)) return false;
    thresholds.add(t.minKg);
    return true;
  });
}
