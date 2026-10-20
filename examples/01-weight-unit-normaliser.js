// Normalise variant weights to whole grams before any weight-based rule runs.
// Shopify stores variant weight with a unit (GRAMS, KILOGRAMS, OUNCES, POUNDS);
// mixing units silently is the usual cause of wrong weight-tier results.
const GRAMS_PER_UNIT = { GRAMS: 1, KILOGRAMS: 1000, OUNCES: 28.349523125, POUNDS: 453.59237 };

export function toGrams(value, unit) {
  const factor = GRAMS_PER_UNIT[String(unit).toUpperCase()];
  if (!factor) throw Error("Unknown weight unit");
  if (!Number.isFinite(value) || value < 0) throw Error("Invalid weight");
  return Math.round(value * factor); // Round per unit, then multiply by quantity.
}

export function totalGrams(lines) {
  return lines.reduce((sum, line) => {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 0) throw Error("Invalid quantity");
    return sum + toGrams(line.weight, line.unit) * line.quantity;
  }, 0);
}
