export type DemoProduct = { id: string; title: string; weightGrams: number; priceCents: number };
export type DemoTier = { minimumGrams: number; discountBps: number; name: string };
export type BasketLine = { id: string; quantity: number };
export declare const DEMO_PRODUCTS: readonly DemoProduct[];
export declare const DEMO_TIERS: readonly DemoTier[];
export declare function calculateBasket(
  lines: BasketLine[],
  products?: readonly DemoProduct[],
  tiers?: readonly DemoTier[],
): {
  weightGrams: number; subtotalCents: number; savingsCents: number; totalCents: number;
  tier: DemoTier; nextTier: DemoTier | null; remainingGrams: number;
};
