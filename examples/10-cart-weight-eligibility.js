// Mock cart eligibility check on aggregate weight. Uses whole grams, matching
// the per-unit `grams` on storefront cart lines and lib/b2b-simulator.mjs.
export function cartWeightCheck(cartLines, minimumGrams) {
  if (!Number.isSafeInteger(minimumGrams) || minimumGrams < 0) throw Error("Bad minimum");
  const totalGrams = cartLines.reduce((total, line) => {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 0 ||
        !Number.isSafeInteger(line.grams) || line.grams < 0) throw Error("Invalid line");
    return total + line.quantity * line.grams;
  }, 0);
  return { totalGrams, eligible: totalGrams >= minimumGrams,
    remainingGrams: Math.max(0, minimumGrams - totalGrams) }; // e.g. "Add 1.2 kg more"
}
