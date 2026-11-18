// Type declarations for lib/gift-upsell.mjs (fictional portfolio demo).
export interface CatalogueItem {
  id: string;
  title: string;
  sku: string;
  priceCents: number;
  weightGrams: number;
}
export interface GiftItem extends CatalogueItem {
  maxPerOrder: number;
}
export interface CartLine {
  id: string;
  quantity: number;
}
export type Cart = ReadonlyArray<Readonly<CartLine>>;
export interface SummaryLine extends CatalogueItem {
  quantity: number;
  lineCents: number;
}
export interface CartSummary {
  lines: SummaryLine[];
  itemCount: number;
  subtotalCents: number;
  shippableWeightGrams: number;
  giftAdded: boolean;
  freeDeliveryRemainingCents: number;
}
export declare const GIFT_ITEM: Readonly<GiftItem>;
export declare const DEMO_PRODUCTS: ReadonlyArray<Readonly<CatalogueItem>>;
export declare const DEMO_FREE_DELIVERY_CENTS: number;
export declare function createCart(lines?: ReadonlyArray<CartLine>): Cart;
export declare function setQuantity(cart: Cart, id: string, quantity: number): Cart;
export declare function setGift(cart: Cart, wanted: boolean): Cart;
export declare function enforceGiftRules(cart: Cart): { cart: Cart; corrections: Array<"capped" | "removed-alone"> };
export declare function summarise(cart: Cart): CartSummary;
export interface ReportLine {
  title: string;
  sku: string;
  quantity: number;
  isGift: boolean;
}
export interface PackingReport {
  orders: Array<{ name: string; lines: ReportLine[]; hasGift: boolean }>;
  cutSummary: ReportLine[];
  totalOrders: number;
}
export declare function buildPackingReport(orders: ReadonlyArray<{ name: string; cart: Cart }>): PackingReport;
export interface JourneyNode { id: string; label: string; x: number; y: number; detail: string }
export interface CodeSample { id: string; language: string; label: string; note: string; code: string }
export declare const JOURNEY_NODES: ReadonlyArray<Readonly<JourneyNode>>;
export declare const JOURNEY_EDGES: ReadonlyArray<readonly [string, string]>;
export declare const JOURNEY_STEPS: ReadonlyArray<string>;
export declare function pathTo(nodeId: string): string[];
export declare const LANGUAGES: ReadonlyArray<string>;
export declare const CODE_SAMPLES: ReadonlyArray<Readonly<CodeSample>>;
