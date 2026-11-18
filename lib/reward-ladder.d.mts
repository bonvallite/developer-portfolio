export type OfferFields = {
  rewards_enabled?: boolean | string;
  gift_one_threshold?: number | string;
  shipping_threshold?: number | string;
  gift_two_threshold?: number | string;
  gift_one_label?: string;
  gift_two_label?: string;
  terms?: string;
};

export type RewardConfig = {
  tierOneCents: number;
  shippingCents: number;
  tierTwoCents: number;
  giftOne: string;
  giftTwo: string;
  terms: string;
};

export type ParsedOffer = { ok: true; config: RewardConfig } | { ok: false; reason: string };

export type SubtotalBasis = "after_line_discounts" | "after_all_discounts";

export type CartLike = {
  items: { final_line_price: number; gift_card?: boolean }[];
  items_subtotal_price?: number;
  total_price?: number;
};

export type LadderMarker = {
  kind: "gift" | "shipping" | "bonus";
  label: string;
  thresholdCents: number;
  thresholdLabel: string;
  reached: boolean;
  position: number;
};

export type LadderView = {
  stage: "tier_one_next" | "shipping_next" | "tier_two_next" | "complete";
  complete: boolean;
  remainingCents: number;
  fillPercent: number;
  markers: LadderMarker[];
  parts: { text: string; strong: boolean }[];
  headline: string;
  secondary: string;
};

export declare const DEMO_OFFER_FIELDS: Readonly<Required<OfferFields>>;
export declare const SUBTOTAL_BASES: readonly SubtotalBasis[];
export declare function parseOfferFields(fields: unknown): ParsedOffer;
export declare function qualifyingSubtotalCents(
  cart: CartLike,
  options?: { basis?: SubtotalBasis; excludeGiftCards?: boolean },
): number;
export declare function formatCents(cents: number): string;
export declare function ladderFillPercent(subtotalCents: number, thresholdsCents: number[]): number;
export declare function rewardLadderView(subtotalCents: number, config: RewardConfig): LadderView;
