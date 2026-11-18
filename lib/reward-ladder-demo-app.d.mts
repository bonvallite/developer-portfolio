export type AppLine = {
  id: string;
  name: string;
  detail: string;
  qty: number;
  priceCents: number;
  fixed: boolean;
};

export type AppModel = {
  lines: AppLine[];
  payableCents: number;
  qualifyingCents: number;
  variant: "standard" | "changed";
  drawerOpen: boolean;
  tick: number;
};

export declare const APP_NATIVE_FREE_SHIPPING_CENTS: number;
export declare const APP_SELECTORS: Readonly<{
  drawerSelector: string;
  anchorSelector: string;
  nativeSelector: string;
}>;
export declare function renderApp(root: ShadowRoot, model: AppModel): void;
