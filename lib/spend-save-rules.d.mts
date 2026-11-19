/**
 * TypeScript contract for the public, dependency-free Spend & Save model.
 * Keep this in sync with spend-save-rules.mjs and its Node regression tests.
 */
export type RewardThresholds = { first: number; shipping: number; final: number };
export type GiftLine = { sku: string; quantity: number; price: 0 };
export type RewardProgress = {
  next: number | null;
  remaining: number;
  percentage: number;
  firstGiftUnlocked: boolean;
  freeShippingUnlocked: boolean;
  finalGiftUnlocked: boolean;
};
export const DEFAULT_THRESHOLDS: Readonly<RewardThresholds>;
export function validateThresholds(thresholds?: RewardThresholds): RewardThresholds;
export function getRewardProgress(subtotal: number, thresholds?: RewardThresholds): RewardProgress;
export function getEligibleGifts(subtotal: number, thresholds?: RewardThresholds): GiftLine[];
export function simulateFlow(input: {
  subtotal: number;
  paid: boolean;
  processed?: boolean;
  commitSucceeded?: boolean;
  thresholds?: RewardThresholds;
}): {
  status: 'not-paid' | 'already-processed' | 'not-eligible' | 'edit-failed' | 'fulfilled';
  gifts: GiftLine[];
  email: boolean;
};
