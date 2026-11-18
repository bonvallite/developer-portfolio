// Data for the interactive reward ladder mockup. Independently authored; every
// product, price, and offer value is fictional. Kept out of the page so tests
// can prove each design state really produces the stage it claims to show.

export const MOCK_PRODUCTS = Object.freeze([
  { id: "beans", name: "Sample coffee beans", detail: "250g bag", priceCents: 1800 },
  { id: "tea", name: "Sample loose-leaf tea", detail: "100g tin", priceCents: 1450 },
  { id: "dripper", name: "Sample pour-over dripper", detail: "Ceramic, 1 to 2 cups", priceCents: 4200 },
  { id: "grinder", name: "Sample hand grinder", detail: "Stainless steel", priceCents: 6500 },
]);

// Each scenario is a design state from the mockup, expressed as a basket. With the
// default demo offer these land in a different stage each.
export const MOCK_SCENARIOS = Object.freeze([
  { id: "A", title: "Early cart", note: "Points at the nearest reward", stage: "tier_one_next", quantities: { beans: 2, tea: 1 } },
  { id: "B", title: "Close to the first gift", note: "Short, specific, one clear step", stage: "tier_one_next", quantities: { dripper: 2, tea: 1 } },
  { id: "C", title: "Gift unlocked", note: "Next target moves to free shipping", stage: "shipping_next", quantities: { dripper: 2, beans: 2 } },
  { id: "D", title: "Gift and shipping unlocked", note: "Next target is the bonus gift", stage: "tier_two_next", quantities: { grinder: 2, dripper: 1, beans: 1 } },
  { id: "E", title: "All rewards unlocked", note: "Confirmation only, no ask", stage: "complete", quantities: { grinder: 3, dripper: 1, beans: 1 } },
]);

export function emptyQuantities() {
  return Object.fromEntries(MOCK_PRODUCTS.map((p) => [p.id, 0]));
}

export function scenarioQuantities(id) {
  const scenario = MOCK_SCENARIOS.find((s) => s.id === id);
  if (!scenario) throw new RangeError(`Unknown scenario ${id}`);
  return { ...emptyQuantities(), ...scenario.quantities };
}

export function basketCents(quantities) {
  let total = 0;
  for (const product of MOCK_PRODUCTS) {
    const qty = quantities[product.id] ?? 0;
    if (!Number.isInteger(qty) || qty < 0) throw new TypeError("Quantities must be non-negative integers");
    total += product.priceCents * qty;
  }
  return total;
}

// Design notes shown beside the mockup. Every token must also appear in the
// shipped stylesheet (checked by tests), so the spec cannot drift from the build.
export const MOCK_SPEC = Object.freeze([
  { id: "eyebrow", label: "Eyebrow", selector: ".rl-eyebrow", detail: "10px, weight 600, uppercase, 0.14em tracking. Warm gold-brown on the card surface.", tokens: ["10px", ".14em", "#6b5728"] },
  { id: "headline", label: "Headline", selector: ".rl-headline", detail: "14px on a 1.4 line height. The amount and the reward are strong; the rest is regular weight. Announced politely to screen readers as the basket changes.", tokens: ["font:14px/1.4", "font-weight:700"] },
  { id: "secondary", label: "Unlocked line", selector: ".rl-secondary", detail: "12px in green, shown only once something is unlocked. Summarises what the customer already has.", tokens: ["12px", "#2f6b3f"] },
  { id: "rail", label: "Progress rail", selector: ".rl-bar", detail: "A 6px rail with markers at equal thirds, however far apart the real thresholds are. A reached marker is a filled 18px circle with a white check.", tokens: ["height:6px", "#ddd6c6", "#947a41", "width:18px"] },
  { id: "labels", label: "Milestone labels", selector: ".rl-labels", detail: "Amount at 11px bold over a 9.5px uppercase caption. The last label is right-aligned so it never overflows the card.", tokens: ["11px", "9.5px", ".08em", "text-align:right"] },
  { id: "terms", label: "Terms line", selector: ".rl-terms", detail: "11px muted text under a thin divider. One line from the offer configuration, omitted if blank.", tokens: ["11px", "#5f564a", "#e2dbc9"] },
]);
