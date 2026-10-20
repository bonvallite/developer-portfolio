// Mock cart eligibility check based on aggregate fulfilment weight.
export function cartMeetsMinimum(cartLines, minimumKg) {
  if (!Number.isFinite(minimumKg) || minimumKg < 0) throw Error("Bad minimum");
  return cartLines.reduce((total, line) => {
    if (line.quantity < 0 || line.grams < 0) throw Error("Invalid line");
    return total + line.quantity * line.grams;
  }, 0) >= minimumKg * 1000;
}
