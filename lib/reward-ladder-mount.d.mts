import type { LadderView, ParsedOffer } from "./reward-ladder.mjs";

export declare const ROOT_ATTR: string;
export declare const HIDDEN_ATTR: string;
export declare const STYLE_ATTR: string;
export declare const LADDER_CSS: string;

export type EnhancerResult =
  | { status: "mounted"; stage: LadderView["stage"]; roots: number }
  | { status: "inactive"; reason: string }
  | { status: "no-drawer" }
  | { status: "no-anchor" }
  | { status: "error"; reason: string };

export type EnhancerStats = { mounts: number; updates: number; teardowns: number; reconciles: number };

export type EnhancerOptions = {
  document: Document;
  drawerSelector: string;
  anchorSelector: string;
  nativeSelector: string;
  getOffer: () => ParsedOffer;
  getSubtotalCents: () => number;
  onResult?: (result: EnhancerResult, stats: EnhancerStats) => void;
  css?: string;
  MutationObserver?: typeof MutationObserver;
};

export declare function renderLadder(doc: Document, view: LadderView, terms: string): HTMLElement;

export declare function createLadderEnhancer(options: EnhancerOptions): {
  start: () => EnhancerResult;
  stop: () => void;
  reconcile: () => EnhancerResult;
  getStats: () => EnhancerStats;
};
