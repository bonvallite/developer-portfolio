/**
 * Gift upsell: one module behind the /gift-upsell page.
 *
 * Independently authored for this portfolio and generalised from a storefront
 * release. Not employer or client production source, theme code, app
 * configuration or a checkout integration. The brand, products, SKUs, prices,
 * weights and thresholds are invented, and code samples are short illustrative
 * excerpts written for this page.
 *
 * Sections:
 * 1. Cart model and rules. The add-on is an ordinary, physical cart line with
 *    zero shipping weight, so payment, order lines, packing lists and reports
 *    carry it without extra configuration and weight-based carton rules are
 *    unchanged. Two rules: at most one per order, and removed when no other
 *    line is left (nobody pays for an empty gift box).
 * 2. Packing report, built from placed demo orders exactly as the unchanged
 *    nightly email would list them.
 * 3. Architecture journey for the diagram and its step-through.
 * 4. Code samples in each language the release used.
 */

/* ---------- 1 and 2: cart model, rules and packing report ---------- */

export const GIFT_ITEM = Object.freeze({
  id: 'gift-packaging',
  title: 'Gift packaging',
  sku: 'GIFT-PACK',
  priceCents: 600,
  weightGrams: 0,
  maxPerOrder: 1
});

export const DEMO_PRODUCTS = Object.freeze([
  Object.freeze({ id: 'ribeye', title: 'Dry-aged ribeye, 2 x 300g', sku: 'RIB-2X300', priceCents: 6400, weightGrams: 600 }),
  Object.freeze({ id: 'sausages', title: 'Pork and fennel sausages, 500g', sku: 'SAUS-500', priceCents: 1450, weightGrams: 500 })
]);

/** Fictional threshold. In this demo the add-on counts towards it. */
export const DEMO_FREE_DELIVERY_CENTS = 15000;

const CATALOGUE = new Map([...DEMO_PRODUCTS, GIFT_ITEM].map(item => [item.id, item]));

const cleanQuantity = value => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Builds a cart from {id, quantity} pairs. Unknown ids and non-positive
 * quantities are dropped; duplicate ids are merged.
 * @param {{id:string, quantity:number}[]} lines
 */
export function createCart(lines = []) {
  const merged = new Map();
  for (const line of lines) {
    if (!CATALOGUE.has(line?.id)) continue;
    const quantity = cleanQuantity(line.quantity);
    if (quantity) merged.set(line.id, (merged.get(line.id) || 0) + quantity);
  }
  return Object.freeze([...merged].map(([id, quantity]) => Object.freeze({ id, quantity })));
}

/** Returns a new cart with one line set to a quantity (0 removes it). */
export function setQuantity(cart, id, quantity) {
  const others = cart.filter(line => line.id !== id);
  const exists = cart.some(line => line.id === id);
  const next = exists
    ? cart.map(line => (line.id === id ? { id, quantity } : line))
    : [...others, { id, quantity }];
  return createCart(next);
}

/** Ticking the tick box adds one gift line; unticking removes it. */
export function setGift(cart, wanted) {
  return setQuantity(cart, GIFT_ITEM.id, wanted ? 1 : 0);
}

/**
 * Applies the two add-on rules and reports what changed, so the UI can tell
 * the customer instead of silently editing their cart.
 * @returns {{cart: ReadonlyArray<{id:string, quantity:number}>, corrections: string[]}}
 */
export function enforceGiftRules(cart) {
  const gift = cart.find(line => line.id === GIFT_ITEM.id);
  if (!gift) return { cart, corrections: [] };
  const hasOtherLines = cart.some(line => line.id !== GIFT_ITEM.id);
  if (!hasOtherLines) {
    return { cart: setQuantity(cart, GIFT_ITEM.id, 0), corrections: ['removed-alone'] };
  }
  if (gift.quantity > GIFT_ITEM.maxPerOrder) {
    return { cart: setQuantity(cart, GIFT_ITEM.id, GIFT_ITEM.maxPerOrder), corrections: ['capped'] };
  }
  return { cart, corrections: [] };
}

/** Totals for display. Weight is what a carton or freight rule would see. */
export function summarise(cart) {
  const lines = cart.map(line => {
    const item = CATALOGUE.get(line.id);
    return { ...item, quantity: line.quantity, lineCents: item.priceCents * line.quantity };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);
  return {
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalCents,
    shippableWeightGrams: lines.reduce((sum, line) => sum + line.weightGrams * line.quantity, 0),
    giftAdded: lines.some(line => line.id === GIFT_ITEM.id),
    freeDeliveryRemainingCents: Math.max(0, DEMO_FREE_DELIVERY_CENTS - subtotalCents)
  };
}

/**
 * The nightly packing report as the packing team reads it, built from placed
 * orders. Unchanged report logic is the point: the gift line needs no special
 * handling, it simply appears in each order's lines and as its own row in the
 * cut summary, which doubles as the count of gift boxes to prepare.
 * @param {{name:string, cart: ReadonlyArray<{id:string, quantity:number}>}[]} orders
 */
export function buildPackingReport(orders) {
  const totals = new Map();
  const rows = orders.map(order => {
    const lines = summarise(order.cart).lines.map(line => ({
      title: line.title, sku: line.sku, quantity: line.quantity, isGift: line.id === GIFT_ITEM.id
    }));
    for (const line of lines) {
      const current = totals.get(line.sku) || { title: line.title, sku: line.sku, quantity: 0, isGift: line.isGift };
      current.quantity += line.quantity;
      totals.set(line.sku, current);
    }
    return { name: order.name, lines, hasGift: lines.some(line => line.isGift) };
  });
  const cutSummary = [...totals.values()].sort((a, b) => a.title.localeCompare(b.title));
  return { orders: rows, cutSummary, totalOrders: rows.length };
}

/* ---------- 3: architecture journey ---------- */

export const JOURNEY_NODES = Object.freeze([
  { id: 'theme', label: 'Theme config', x: 40, y: 50, detail: 'A small Liquid snippet prints inert JSON (variant, price and wording) and loads one deferred script. Nothing is output for wholesale customers or when the product is unavailable.' },
  { id: 'runtime', label: 'Browser runtime', x: 280, y: 50, detail: 'Finds the app-owned cart drawer across open shadow roots, loads its stylesheet into that root, builds the tile above the subtotal, rebuilds it after app rerenders and removes itself on any error.' },
  { id: 'cart', label: 'Cart API', x: 520, y: 50, detail: 'Ticking adds one line through /cart/add.js and unticking sets it to 0 through /cart/update.js. Two rules run after every change: at most one per order, and never on its own.' },
  { id: 'checkout', label: 'Checkout', x: 760, y: 50, detail: 'The gift packaging shows as an ordinary line with its own price. No checkout extension is needed, which matters on plans that cannot customise checkout.' },
  { id: 'order', label: 'Order', x: 760, y: 240, detail: 'It is a paid, taxed order line, so it appears on the order page, the packing slip and every existing export without new fields.' },
  { id: 'report', label: 'Nightly report', x: 520, y: 240, detail: 'The existing report automation lists it in the order and as a row in the cut summary. Nothing in the automation was changed.' },
  { id: 'packing', label: 'Packing team', x: 280, y: 240, detail: 'Packs the gift box, ribbon, insulated bag and reusable gel ice pack with the rest of the order, because the line sits in the same fulfilment group.' },
  { id: 'freight', label: 'Freight booking', x: 760, y: 400, detail: 'Carton counts are worked out from weight. The line is physical but weighs 0 g, so the booking is unchanged.' }
].map(Object.freeze));

export const JOURNEY_EDGES = Object.freeze([
  ['theme', 'runtime'], ['runtime', 'cart'], ['cart', 'checkout'], ['checkout', 'order'],
  ['order', 'report'], ['report', 'packing'], ['order', 'freight']
].map(Object.freeze));

/** Walk-through order for the "follow a gift order" stepper. */
export const JOURNEY_STEPS = Object.freeze(['theme', 'runtime', 'cart', 'checkout', 'order', 'report', 'packing', 'freight']);

/**
 * Node ids on the path from the first node to nodeId, following edges in
 * order (breadth first). Used to highlight the route a gift order takes.
 * @param {string} nodeId
 * @returns {string[]} empty when the node is unknown or unreachable
 */
export function pathTo(nodeId) {
  const start = JOURNEY_NODES[0].id;
  if (!JOURNEY_NODES.some(n => n.id === nodeId)) return [];
  const previous = new Map([[start, null]]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    if (current === nodeId) break;
    for (const [from, to] of JOURNEY_EDGES) {
      if (from === current && !previous.has(to)) { previous.set(to, current); queue.push(to); }
    }
  }
  if (!previous.has(nodeId)) return [];
  const path = [];
  for (let node = nodeId; node !== null; node = previous.get(node)) path.unshift(node);
  return path;
}

/* ---------- 4: code samples by language ---------- */

export const LANGUAGES = Object.freeze(['Liquid', 'CSS', 'JavaScript', 'JSON', 'GraphQL', 'Python']);

export const CODE_SAMPLES = Object.freeze([
  {
    id: 'config',
    language: 'Liquid',
    label: 'Theme config snippet',
    note: 'The cart drawer lives in a shadow root Liquid cannot reach, so the theme hands the browser plain data instead of markup. Wholesale customers get nothing.',
    code: `{%- liquid
  assign gift = all_products['gift-packaging'].selected_or_first_available_variant
  assign show = true
  if customer.b2b? or gift == blank or gift.available == false
    assign show = false
  endif
-%}
{%- if show -%}
  <script id="gift-config" type="application/json">
    {
      "variant_id": {{ gift.id | json }},
      "price": {{ gift.price | money_without_trailing_zeros | strip_html | json }},
      "label": {{ 'gift.label' | t | json }}
    }
  </script>
  <script src="{{ 'gift-upsell.js' | asset_url }}" defer></script>
{%- endif -%}`
  },
  {
    id: 'tile-css',
    language: 'CSS',
    label: 'Tile and pop-up',
    note: 'Sizes are in px because the theme set its root font size to 10px, which shrank rem values to 62.5%. The added state thickens the border with an inset shadow so nothing shifts.',
    code: `.gift-tile {
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 6px 12px 6px 16px;
  border: 1px solid var(--gold, #947a41);
  border-radius: 5px;
}
.gift-tile--added { box-shadow: inset 0 0 0 1px var(--gold, #947a41); }

.gift-tip {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  width: 260px;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 4px);
  transition: opacity 200ms ease, transform 200ms ease, visibility 0s linear 200ms;
}
.gift-info.is-open .gift-tip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
  transition: opacity 150ms ease, transform 150ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .gift-tip { transition: none; }
}`
  },
  {
    id: 'discover',
    language: 'JavaScript',
    label: 'Find the app-owned drawer',
    note: 'Breadth-first search through open shadow roots. A closed root is respected, never bypassed.',
    code: `function findDrawer(selector = '#cart-drawer') {
  const queue = [document];
  const seen = new Set();
  while (queue.length) {
    const root = queue.shift();
    if (!root?.querySelector || seen.has(root)) continue;
    seen.add(root);
    const hit = root.querySelector(selector);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) queue.push(el.shadowRoot);
    }
  }
  return null;
}`
  },
  {
    id: 'rules',
    language: 'JavaScript',
    label: 'Cart rules',
    note: 'Pure and unit tested (see tests/gift-upsell.test.mjs). The page announces every correction rather than changing the cart silently.',
    code: `export function enforceGiftRules(cart) {
  const gift = cart.find(line => line.id === GIFT_ITEM.id);
  if (!gift) return { cart, corrections: [] };
  if (!cart.some(line => line.id !== GIFT_ITEM.id)) {
    return { cart: setQuantity(cart, GIFT_ITEM.id, 0), corrections: ['removed-alone'] };
  }
  if (gift.quantity > GIFT_ITEM.maxPerOrder) {
    return { cart: setQuantity(cart, GIFT_ITEM.id, 1), corrections: ['capped'] };
  }
  return { cart, corrections: [] };
}`
  },
  {
    id: 'failsafe',
    language: 'JavaScript',
    label: 'Fail-safe sync',
    note: 'Runs after the app rerenders. Any failure removes the enhancement and leaves the third-party cart exactly as it was.',
    code: `async function sync() {
  try {
    const cart = await fetch('/cart.js').then(r => r.json());
    const drawer = findDrawer();
    if (drawer) renderTile(drawer, cart); // rebuilt after every app rerender
  } catch (error) {
    removeTile();
    console.warn('Gift upsell hidden; the cart keeps working.', error);
  }
}

new MutationObserver(() => scheduleSync(120))
  .observe(findDrawer(), { childList: true, subtree: true });`
  },
  {
    id: 'locale',
    language: 'JSON',
    label: 'Translation strings',
    note: 'Wording lives in the theme locale file, so the tile, the pop-up and the screen reader announcements can be edited without touching code.',
    code: `{
  "gift": {
    "label": "Pack as a gift box",
    "added": "Gift box added",
    "info_label": "What's included with gift box packaging",
    "info": "Arrives in a gift box with a ribbon, plus an insulated bag and a reusable gel ice pack.",
    "added_status": "Gift box packaging added to your cart",
    "removed_status": "Gift box packaging removed from your cart",
    "error": "We couldn't update the gift box. Please try again."
  }
}`
  },
  {
    id: 'product',
    language: 'GraphQL',
    label: 'Create the add-on product',
    note: 'Physical (so it ships with the order) but 0 g (so it never adds a carton), untracked stock, and unlisted so it never appears in search or collections.',
    code: `mutation CreateGiftPackaging($input: ProductSetInput!) {
  productSet(input: $input, synchronous: true) {
    product { id handle status }
    userErrors { field message }
  }
}

# variables
{
  "input": {
    "title": "Gift packaging",
    "handle": "gift-packaging",
    "status": "UNLISTED",
    "productOptions": [{ "name": "Title", "values": [{ "name": "Default Title" }] }],
    "variants": [{
      "optionValues": [{ "optionName": "Title", "name": "Default Title" }],
      "price": "6.00",
      "sku": "GIFT-PACK",
      "taxable": true,
      "inventoryItem": {
        "tracked": false,
        "requiresShipping": true,
        "measurement": { "weight": { "value": 0, "unit": "KILOGRAMS" } }
      }
    }]
  }
}`
  },
  {
    id: 'checksum',
    language: 'Python',
    label: 'Verify before you save',
    note: 'Theme files are saved whole, so every edit started by rebuilding the live file locally and proving it matched before changing a single line.',
    code: `import hashlib
from pathlib import Path

def md5(path: str) -> str:
    return hashlib.md5(Path(path).read_bytes()).hexdigest()

def safe_insert(path: str, live_md5: str, anchor: str, block: str) -> str:
    """Insert block after anchor, but only if the local copy is exact."""
    if md5(path) != live_md5:
        raise SystemExit("Local copy differs from the live file. Stop.")
    text = Path(path).read_text(encoding="utf-8")
    if text.count(anchor) != 1:
        raise SystemExit("Anchor is missing or not unique. Stop.")
    Path(path).write_text(text.replace(anchor, anchor + block), encoding="utf-8")
    return md5(path)  # compare with the file after saving`
  }
].map(Object.freeze));
