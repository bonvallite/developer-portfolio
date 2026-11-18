export type MockProduct = { id: string; name: string; detail: string; priceCents: number };
export type MockScenario = {
  id: string;
  title: string;
  note: string;
  stage: "tier_one_next" | "shipping_next" | "tier_two_next" | "complete";
  quantities: Record<string, number>;
};
export type MockSpec = { id: string; label: string; selector: string; detail: string; tokens: string[] };

export declare const MOCK_PRODUCTS: readonly MockProduct[];
export declare const MOCK_SCENARIOS: readonly MockScenario[];
export declare const MOCK_SPEC: readonly MockSpec[];
export declare function emptyQuantities(): Record<string, number>;
export declare function scenarioQuantities(id: string): Record<string, number>;
export declare function basketCents(quantities: Record<string, number>): number;
