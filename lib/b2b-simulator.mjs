/**
 * Fictional wholesale simulator. No Shopify/customer integrations.
 * All currency calculations use integer cents to avoid floating-point totals.
 */
export const DEMO_PRODUCTS = Object.freeze([
  { id: "sample-a", title: "Demo Cut A", weightGrams: 750, priceCents: 2250 },
  { id: "sample-b", title: "Demo Cut B", weightGrams: 1200, priceCents: 4100 },
  { id: "sample-c", title: "Demo Cut C", weightGrams: 500, priceCents: 1550 },
]);
export const DEMO_TIERS = Object.freeze([
  { minimumGrams: 0, discountBps: 0, name: "Standard" },
  { minimumGrams: 5000, discountBps: 500, name: "Volume 5 kg" },
  { minimumGrams: 10000, discountBps: 1000, name: "Volume 10 kg" },
  { minimumGrams: 20000, discountBps: 1500, name: "Volume 20 kg" },
]);

/** @param {number} value */
function nonNegativeInt(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

/**
 * @param {Array<{id:string, quantity:number}>} lines
 * @param {Array<{id:string, title:string, weightGrams:number, priceCents:number}>} products
 * @param {Array<{minimumGrams:number, discountBps:number, name:string}>} tiers
 */
export function calculateBasket(lines, products = DEMO_PRODUCTS, tiers = DEMO_TIERS) {
  if (!Array.isArray(lines) || !Array.isArray(products) || !Array.isArray(tiers) || !tiers.length) throw new TypeError("Invalid inputs");
  const catalogue = new Map();
  for (const product of products) {
    if (!product?.id || catalogue.has(product.id) || !nonNegativeInt(product.weightGrams) || !nonNegativeInt(product.priceCents)) throw new Error("Invalid catalogue");
    catalogue.set(product.id, product);
  }
  const sorted = [...tiers].sort((a, b) => a.minimumGrams - b.minimumGrams);
  if (sorted[0].minimumGrams !== 0 || sorted.some((t, i) =>
    !nonNegativeInt(t.minimumGrams) || !nonNegativeInt(t.discountBps) || t.discountBps > 10000 ||
    (i > 0 && t.minimumGrams === sorted[i-1].minimumGrams))) throw new Error("Invalid tiers");
  let weightGrams = 0;
  let subtotalCents = 0;
  const used = new Set();
  for (const line of lines) {
    if (!line || used.has(line.id) || !nonNegativeInt(line.quantity)) throw new Error("Invalid basket line");
    const product = catalogue.get(line.id);
    if (!product) throw new Error("Unknown product");
    used.add(line.id);
    weightGrams += product.weightGrams * line.quantity;
    subtotalCents += product.priceCents * line.quantity;
    if (!Number.isSafeInteger(weightGrams) || !Number.isSafeInteger(subtotalCents)) throw new Error("Basket exceeds safe numeric range");
  }
  const tier = [...sorted].reverse().find(t => weightGrams >= t.minimumGrams);
  const savingsCents = Math.round(subtotalCents * tier.discountBps / 10000);
  const nextTier = sorted.find(t => t.minimumGrams > weightGrams) ?? null;
  return { weightGrams, subtotalCents, savingsCents, totalCents: subtotalCents - savingsCents,
    tier, nextTier, remainingGrams: nextTier ? nextTier.minimumGrams - weightGrams : 0 };
}
