// One focused test per JavaScript example: each file must import on its own
// and behave as its header comment describes. Fixtures are fictional.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";

const ex = name => import(`../examples/${name}.js`);

test("every JavaScript example has a numbered test in this file", () => {
  const source = readFileSync(new URL(import.meta.url), "utf8");
  const files = readdirSync(new URL("../examples/", import.meta.url)).filter(f => f.endsWith(".js"));
  const untested = files.filter(f => !source.includes(`test("${f.slice(0, 2)} `));
  assert.deepEqual(untested, []);
});

test("01 converts mixed weight units to whole grams", async () => {
  const { toGrams, totalGrams } = await ex("01-weight-unit-normaliser");
  assert.equal(toGrams(1.5, "KILOGRAMS"), 1500);
  assert.equal(toGrams(1, "pounds"), 454);
  assert.equal(totalGrams([{ weight: 750, unit: "GRAMS", quantity: 2 }, { weight: 1, unit: "KILOGRAMS", quantity: 1 }]), 2500);
  assert.throws(() => toGrams(1, "STONE"));
  assert.throws(() => totalGrams([{ weight: 1, unit: "GRAMS", quantity: -1 }]));
});

test("02 accepts a valid HMAC and rejects tampering", async () => {
  const { verifyWebhook } = await ex("02-webhook-signature");
  const secret = randomBytes(16).toString("hex");
  const body = '{"id":"evt-1"}';
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifyWebhook(body, sig, secret), true);
  assert.equal(verifyWebhook(body + " ", sig, secret), false);
  assert.equal(verifyWebhook(body, "zz", secret), false);
  assert.equal(verifyWebhook(body, sig, ""), false);
});

test("03 processes concurrent duplicates once and allows retry after failure", async () => {
  const { makeEventHandler } = await ex("03-idempotent-event-handler");
  let runs = 0;
  const handle = makeEventHandler(async () => { runs++; await new Promise(r => setTimeout(r, 10)); });
  const results = await Promise.all([handle({ id: "a" }), handle({ id: "a" })]);
  assert.equal(runs, 1);
  assert.deepEqual(results.map(r => r.status).sort(), ["duplicate", "processed"]);
  assert.equal((await handle({ id: "a" })).status, "duplicate");

  let attempts = 0;
  const flaky = makeEventHandler(() => { if (++attempts === 1) throw Error("transient"); });
  await assert.rejects(flaky({ id: "b" }));
  assert.equal((await flaky({ id: "b" })).status, "processed");
  await assert.rejects(handle({}));
});

test("04 maps statuses and never moves a shipment backwards", async () => {
  const { normaliseStatus, nextStatus } = await ex("04-fulfilment-status-map");
  assert.equal(normaliseStatus("Moving"), "IN_TRANSIT");
  assert.equal(normaliseStatus("teleported"), "UNKNOWN");
  assert.equal(nextStatus("IN_TRANSIT", "CARRIER_PICKED_UP"), "IN_TRANSIT");
  assert.equal(nextStatus("IN_TRANSIT", "OUT_FOR_DELIVERY"), "OUT_FOR_DELIVERY");
  assert.equal(nextStatus("IN_TRANSIT", "DELAYED"), "DELAYED");
  assert.equal(nextStatus("DELAYED", "IN_TRANSIT"), "IN_TRANSIT");
  assert.equal(nextStatus("DELIVERED", "FAILURE"), "DELIVERED");
  assert.equal(nextStatus("IN_TRANSIT", "UNKNOWN"), "IN_TRANSIT");
  assert.equal(nextStatus(undefined, "CONFIRMED"), "CONFIRMED");
});

test("05 retries until success and rethrows the last error", async () => {
  const { retry } = await ex("05-retry-backoff");
  let calls = 0;
  assert.equal(await retry(async () => { if (++calls < 3) throw Error("x"); return "ok"; }, { baseMs: 1 }), "ok");
  assert.equal(calls, 3);
  await assert.rejects(retry(async () => { throw Error("always"); }, { attempts: 2, baseMs: 1 }), /always/);
});

test("06 rolls weekend and holiday arrivals forward", async () => {
  const { nextDeliveryDate } = await ex("06-business-day-delivery");
  assert.equal(nextDeliveryDate("2026-10-16", 1), "2026-10-19"); // Fri + 1 = Sat -> Mon
  assert.equal(nextDeliveryDate("2026-10-16", 1, ["2026-10-19"]), "2026-10-20");
  assert.throws(() => nextDeliveryDate("2026-10-16", 1.5));
});

test("07 parses scores and rejects invalid values", async () => {
  const { parsePositiveScore } = await ex("07-product-metafield-parser");
  assert.equal(parsePositiveScore({ value: "12" }), 12);
  assert.equal(parsePositiveScore({ value: "" }), null);
  assert.equal(parsePositiveScore({ value: "21" }), null);
  assert.equal(parsePositiveScore(null), null);
});

test("10 reports eligibility and remaining grams", async () => {
  const { cartWeightCheck } = await ex("10-cart-weight-eligibility");
  assert.deepEqual(cartWeightCheck([{ quantity: 2, grams: 1200 }], 5000), { totalGrams: 2400, eligible: false, remainingGrams: 2600 });
  assert.equal(cartWeightCheck([{ quantity: 5, grams: 1000 }], 5000).eligible, true);
  assert.throws(() => cartWeightCheck([{ quantity: 1, grams: 1.5 }], 5000));
});

test("11 suppresses repeat purchase events, including across reloads", async () => {
  const { createEventDeduper } = await ex("11-order-event-dedupe");
  const store = new Map();
  const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const accept = createEventDeduper(storage);
  assert.equal(accept({ eventId: "1001", eventName: "purchase" }), true);
  assert.equal(accept({ eventId: "1001", eventName: "purchase" }), false);
  assert.equal(createEventDeduper(storage)({ eventId: "1001", eventName: "purchase" }), false); // page reload
  const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
  assert.equal(createEventDeduper(blocked)({ eventId: "1", eventName: "purchase" }), true);
});

test("12 finds missing transactions on each side", async () => {
  const { reconcilePurchases } = await ex("12-purchase-reconciliation");
  const r = reconcilePurchases([{ id: "A", amount: 10 }, { id: "B", amount: 5 }], [{ id: "A", amount: 10 }, { id: "C", amount: 2 }]);
  assert.deepEqual(r, { missingInAnalytics: ["B"], missingInStore: ["C"], revenueDifference: 3 });
});

test("13 logs only allow-listed fields", async () => {
  const { safeWebhookLog } = await ex("13-safe-log-redaction");
  const log = safeWebhookLog({ kind: "order", id: "e1", email: "x@example.com", token: "t" });
  assert.deepEqual(Object.keys(log), ["kind", "eventId", "receivedAt"]);
});

test("14 strips sensitive and click-id parameters", async () => {
  const { removeSensitiveQueryParams } = await ex("14-query-parameter-cleaner");
  assert.equal(removeSensitiveQueryParams("/p?a=1&token=x&gclid=y&utm_source=z"), "/p?a=1&utm_source=z");
});

test("15 explains invalid tier tables", async () => {
  const { validateTiers } = await ex("15-discount-rule-validator");
  assert.deepEqual(validateTiers([{ minimumGrams: 0, discountBps: 0 }, { minimumGrams: 5000, discountBps: 500 }]), []);
  assert.ok(validateTiers([{ minimumGrams: 100, discountBps: 0 }]).some(e => /start at 0/.test(e)));
  assert.ok(validateTiers([{ minimumGrams: 0, discountBps: 500 }, { minimumGrams: 5000, discountBps: 100 }]).some(e => /less/.test(e)));
  assert.ok(validateTiers([{ minimumGrams: 0, discountBps: 0 }, { minimumGrams: 0, discountBps: 0 }]).some(e => /Duplicate/.test(e)));
  assert.deepEqual(validateTiers([]), ["At least one tier is required"]);
});

test("16 suggests replacements or falls back to the collection", async () => {
  const { redirectSuggestions } = await ex("16-slug-redirect-generator");
  assert.deepEqual(redirectSuggestions(["/products/a-demo-old", "/products/b-demo-old"], ["/products/a-demo-new"], "/collections/all"), [
    { from: "/products/a-demo-old", to: "/products/a-demo-new" },
    { from: "/products/b-demo-old", to: "/collections/all" }]);
});

test("18 requires local paths and dimensions", async () => {
  const { imageProps } = await ex("18-image-performance-helper");
  assert.equal(imageProps("/img/a.jpg", "A", 10, 10).loading, "lazy");
  assert.throws(() => imageProps("//evil.example/a.jpg", "A", 10, 10));
  assert.throws(() => imageProps("/a.jpg", "A", 0, 10));
});

test("19 excludes weekends and listed holidays", async () => {
  const { isDropOffDay } = await ex("19-holiday-calendar");
  assert.equal(isDropOffDay("2026-10-19"), true);
  assert.equal(isDropOffDay("2026-10-18"), false);
  assert.equal(isDropOffDay("2026-12-25", ["2026-12-25"]), false);
});

test("20 collects pages and stops on a repeated cursor", async () => {
  const { collectPages } = await ex("20-graphql-pagination");
  const pages = [{ nodes: [1], pageInfo: { hasNextPage: true, endCursor: "c1" } }, { nodes: [2], pageInfo: { hasNextPage: false } }];
  let i = 0;
  assert.deepEqual(await collectPages(async () => pages[i++]), [1, 2]);
  await assert.rejects(collectPages(async () => ({ nodes: [], pageInfo: { hasNextPage: true, endCursor: null } })));
});

test("21 focuses the first control and restores focus", async () => {
  const { focusDialog } = await ex("21-cart-drawer-accessibility");
  const focused = [];
  const button = { focus: () => focused.push("button") };
  const restore = focusDialog({ querySelector: () => button, focus: () => focused.push("dialog") }, { focus: () => focused.push("trigger") });
  restore();
  assert.deepEqual(focused, ["button", "trigger"]);
});

test("22 normalises whitespace and length", async () => {
  const { normaliseSearch } = await ex("22-search-query-normaliser");
  assert.equal(normaliseSearch("  red   shoes "), "red shoes");
  assert.equal(normaliseSearch("x".repeat(200)).length, 120);
  assert.equal(normaliseSearch(null), "");
});

test("23 reports titles matching forbidden patterns", async () => {
  const { auditProductTitles } = await ex("23-product-title-audit");
  assert.deepEqual(auditProductTitles([{ id: 1, title: "Demo TEST item" }, { id: 2, title: "Fine" }], [/test/i]),
    [{ id: 1, title: "Demo TEST item", matchedRule: "test" }]);
});

test("24 builds a positioned BreadcrumbList", async () => {
  const { breadcrumbSchema } = await ex("24-breadcrumb-structured-data");
  const s = breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Shoes", url: "/collections/shoes" }]);
  assert.equal(s.itemListElement[1].position, 2);
  assert.equal(s.itemListElement[1].item, "https://example.com/collections/shoes");
  assert.throws(() => breadcrumbSchema([]));
});

test("25 lists products missing required channels", async () => {
  const { channelCoverage } = await ex("25-channel-coverage-audit");
  assert.deepEqual(channelCoverage([{ id: 1, channels: ["web"] }, { id: 2, channels: ["web", "pos"] }], ["web", "pos"]),
    [{ productId: 1, missingChannels: ["pos"] }]);
});

test("26 pads postcodes before matching zones", async () => {
  const { findShippingZone } = await ex("26-shipping-zone-matcher");
  assert.equal(findShippingZone(800, [{ name: "North", postcodes: ["0800"] }]), "North");
  assert.equal(findShippingZone("9999", []), null);
});

test("27 computes step and overall conversion", async () => {
  const { funnelReport } = await ex("27-analytics-funnel-report");
  const r = funnelReport([{ name: "view", count: 100 }, { name: "cart", count: 20 }, { name: "buy", count: 5 }]);
  assert.equal(r[2].stepRate, 0.25);
  assert.equal(r[2].startingRate, 0.05);
  assert.equal(funnelReport([{ name: "a", count: 0 }, { name: "b", count: 0 }])[1].stepRate, null);
});

test("28 quotes cells and neutralises formulas", async () => {
  const { csvCell, csvRow } = await ex("28-safe-csv-escape");
  assert.equal(csvCell('say "hi"'), '"say ""hi"""');
  assert.equal(csvCell("=SUM(A1)"), `"'=SUM(A1)"`);
  assert.equal(csvRow([1, null]), '"1",""');
});

test("29 detects redirect cycles", async () => {
  const { detectRedirectLoops } = await ex("29-redirect-loop-audit");
  assert.ok(detectRedirectLoops([{ from: "/a", to: "/b" }, { from: "/b", to: "/a" }]).length > 0);
  assert.deepEqual(detectRedirectLoops([{ from: "/a", to: "/b" }]), []);
});

test("30 keeps only UTM parameters", async () => {
  const { buildCampaignUrl } = await ex("30-utm-parameter-builder");
  assert.equal(buildCampaignUrl("https://shop.example/", { utm_source: "news", utm_medium: "", other: "x" }),
    "https://shop.example/?utm_source=news");
});

test("31 separates description content from markup", async () => {
  const { descriptionSections } = await ex("31-product-description-format");
  assert.deepEqual(descriptionSections({ introduction: " Hi ", highlights: ["a", ""], specifications: [{ label: "W", value: "1kg" }, { label: "X" }] }),
    { introduction: "Hi", highlights: ["a"], specifications: [{ label: "W", value: "1kg" }] });
});

test("32 enforces min, max and step", async () => {
  const { validQuantity } = await ex("32-quantity-validation");
  assert.equal(validQuantity("3"), true);
  assert.equal(validQuantity(0), false);
  assert.equal(validQuantity(5, { min: 2, step: 3 }), true);
  assert.equal(validQuantity(6, { min: 2, step: 3 }), false);
});

test("33 flags stale undelivered parcels", async () => {
  const { staleTrackingEvents } = await ex("33-stale-tracking-events");
  const events = [{ updatedAt: "2026-10-01T00:00:00Z", status: "IN_TRANSIT" }, { updatedAt: "2026-10-01T00:00:00Z", status: "DELIVERED" },
    { updatedAt: "2026-10-04T00:00:00Z", status: "IN_TRANSIT" }];
  assert.equal(staleTrackingEvents(events, "2026-10-04T12:00:00Z").length, 1);
});

test("34 preloads only an above-fold hero", async () => {
  const { heroPreload } = await ex("34-asset-preload-planner");
  assert.equal(heroPreload([{ src: "/a.jpg", isHero: true, isAboveFold: true }]).fetchpriority, "high");
  assert.equal(heroPreload([{ src: "/a.jpg", isHero: true, isAboveFold: false }]), null);
});

test("35 applies the 'good' Core Web Vitals thresholds", async () => {
  const { vitalBudget } = await ex("35-core-web-vitals-budget");
  assert.deepEqual(vitalBudget({ lcpMs: 2500, inpMs: 250, cls: 0.05 }), { lcp: true, inp: false, cls: true });
});

test("36 joins segments and rejects ambiguous ones", async () => {
  const { eventKey } = await ex("36-stable-event-keys");
  assert.equal(eventKey("web", "purchase", "1"), "web:purchase:1");
  assert.throws(() => eventKey("web", "a:b", "1"));
});

test("37 converts headings while keeping attributes and children", async () => {
  const { normaliseHeadingElements } = await ex("37-content-h4-normaliser");
  // Minimal DOM stand-in: appendChild moves a node out of its old parent, as in a browser.
  const el = tag => ({ tag, attrs: {}, children: [],
    get firstChild() { return this.children[0]; },
    setAttribute(name, value) { this.attrs[name] = value; },
    appendChild(child) { if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1); child.parent = this; this.children.push(child); } });
  const h2 = Object.assign(el("h2"), { attributes: [{ name: "id", value: "x" }], replaceWith(node) { this.replacedBy = node; } });
  const text = {};
  h2.appendChild(text);
  normaliseHeadingElements({ ownerDocument: { createElement: el }, querySelectorAll: () => [h2] });
  assert.equal(h2.replacedBy.tag, "h4");
  assert.deepEqual(h2.replacedBy.attrs, { id: "x" });
  assert.equal(h2.replacedBy.children[0], text);
  assert.equal(h2.children.length, 0);
});

test("38 filters by category and price range", async () => {
  const { filterProducts } = await ex("38-category-filtering");
  const items = [{ category: "a", price: 5 }, { category: "a", price: 15 }, { category: "b", price: 5 }];
  assert.equal(filterProducts(items, { category: "a", maxPrice: 10 }).length, 1);
  assert.equal(filterProducts(items).length, 3);
});

test("39 never promises a delivery date", async () => {
  const { estimateLabel } = await ex("39-shipping-estimate-copy");
  assert.equal(estimateLabel("20 Oct"), "Estimated delivery: 20 Oct");
  assert.equal(estimateLabel(null), "Delivery estimate available at checkout");
});

test("41 applies cut-off, transit and zone delivery days", async () => {
  const { estimateDelivery } = await ex("41-delivery-zone-calculator");
  // Friday 16 Oct 2026, before cut-off: dispatch Fri, +1 day lands Sat, delivered Mon.
  assert.deepEqual(estimateDelivery({ postcode: "9150", orderDate: "2026-10-16", orderHour: 9 }),
    { deliverable: true, zone: "Metro (fictional)", dispatchDate: "2026-10-16", deliveryDate: "2026-10-19" });
  // After cut-off: dispatch Monday.
  assert.equal(estimateDelivery({ postcode: "9150", orderDate: "2026-10-16", orderHour: 15 }).dispatchDate, "2026-10-19");
  // Regional zone only receives Tue/Thu drops: Mon dispatch + 3 days = Thu.
  assert.equal(estimateDelivery({ postcode: "9250", orderDate: "2026-10-19", orderHour: 9 }).deliveryDate, "2026-10-22");
  // A holiday on the arrival day pushes the regional drop to the next Tuesday.
  assert.equal(estimateDelivery({ postcode: "9250", orderDate: "2026-10-19", orderHour: 9, holidays: ["2026-10-22"] }).deliveryDate, "2026-10-27");
  assert.deepEqual(estimateDelivery({ postcode: "12", orderDate: "2026-10-19", orderHour: 9 }), { deliverable: false, reason: "unknown_postcode" });
  assert.throws(() => estimateDelivery({ postcode: "9150", orderDate: "2026-10-19", orderHour: 24 }));
});

test("42 adds GST to taxable lines only, rounding once", async () => {
  const { invoiceTotals } = await ex("42-b2b-gst-invoice");
  assert.deepEqual(invoiceTotals([{ unitCents: 2250, quantity: 2 }, { unitCents: 999, quantity: 1, gstFree: true }]),
    { subtotalCents: 5499, taxableCents: 4500, gstCents: 450, totalCents: 5949 });
  assert.equal(invoiceTotals([{ unitCents: 5, quantity: 1 }]).gstCents, 1); // 0.5c rounds up
  assert.throws(() => invoiceTotals([{ unitCents: 1.5, quantity: 1 }]));
  assert.deepEqual(invoiceTotals([]), { subtotalCents: 0, taxableCents: 0, gstCents: 0, totalCents: 0 });
});

test("43 reports products whose badge tags disagree with the metafield", async () => {
  const { auditBadgeSources } = await ex("43-badge-source-audit");
  const report = auditBadgeSources([
    { id: "p1", tags: ["Badge:Bestseller", "summer"], badgeLabel: "New" },
    { id: "p2", tags: ["badge:New"], badgeLabel: null },
    { id: "p3", tags: ["badge:new"], badgeLabel: "New" },
    { id: "p4", tags: ["badge:New", "badge:Sale"], badgeLabel: "Sale" },
    { id: "p5", tags: ["summer"], badgeLabel: "New" },
  ]);
  assert.deepEqual(report.map(r => [r.id, r.issues]), [
    ["p1", ["tag_disagrees_with_metafield"]],
    ["p2", ["tag_without_metafield"]],
    ["p3", ["redundant_tag"]],
    ["p4", ["multiple_badge_tags"]],
  ]);
  assert.deepEqual(report[0].fromTags, ["Bestseller"]);
});

test("44 groups repeated scripts but keeps different containers apart", async () => {
  const { duplicateScripts } = await ex("44-duplicate-script-audit");
  assert.deepEqual(duplicateScripts([
    "https://tags.example/gtm.js?id=GT-AAAA", "https://tags.example/gtm.js?id=GT-AAAA&l=dataLayer",
    "https://tags.example/gtm.js?id=GT-BBBB",
    "https://rec.example/record.js?v=1", "https://rec.example/record.js?v=2", "https://rec.example/record.js",
    "not a url",
  ]), [{ script: "rec.example/record.js", count: 3 }, { script: "tags.example/gtm.js?id=GT-AAAA", count: 2 }]);
});

test("45 finds font-face rules without font-display and counts font hosts", async () => {
  const { fontFacesMissingDisplay, fontHosts } = await ex("45-font-loading-audit");
  const css = `@font-face { font-family: "Demo Sans"; src: url(a.woff2); }
    @font-face { font-family: Demo Serif; src: url(b.woff2); font-display: swap; }`;
  assert.deepEqual(fontFacesMissingDisplay(css), ["Demo Sans"]);
  assert.deepEqual(fontHosts(["https://a.example/f.woff2", "https://a.example/g.woff2", "https://b.example/x.ttf", "https://b.example/app.js"]),
    ["a.example", "b.example"]);
});

test("46 lists app embeds and flags ones left behind by uninstalled apps", async () => {
  const { auditAppEmbeds } = await ex("46-app-embed-audit");
  const settings = { current: { blocks: {
    "1": { type: "shopify://apps/demo-reviews/blocks/stars/abc", disabled: false },
    "2": { type: "shopify://apps/old-popup/blocks/popup/def", disabled: true },
    "3": { type: "@app" },
  } } };
  assert.deepEqual(auditAppEmbeds(settings, ["demo-reviews"]), [
    { id: "1", app: "demo-reviews", embed: "stars", enabled: true, orphaned: false },
    { id: "2", app: "old-popup", embed: "popup", enabled: false, orphaned: true },
  ]);
  assert.deepEqual(auditAppEmbeds({ current: "Default" }), []);
});

test("47 maps checkout_completed to a GA4 purchase and skips events without an order id", async () => {
  const { toGa4Purchase, register } = await ex("47-ga4-purchase-pixel");
  const checkout = { order: { id: "9001" }, currencyCode: "AUD", totalPrice: { amount: 55 }, totalTax: { amount: 5 },
    shippingLine: { price: { amount: 10 } }, lineItems: [{ title: "Demo item", quantity: 2, variant: { sku: "DEMO-1", price: { amount: 22.5 } } }] };
  assert.deepEqual(toGa4Purchase(checkout).ecommerce, { transaction_id: "9001", value: 55, tax: 5, shipping: 10, currency: "AUD",
    items: [{ item_id: "DEMO-1", item_name: "Demo item", price: 22.5, quantity: 2 }] });
  assert.equal(toGa4Purchase({ ...checkout, order: null }), null);

  let handler;
  const dataLayer = [];
  register({ subscribe: (name, fn) => { assert.equal(name, "checkout_completed"); handler = fn; } }, dataLayer);
  handler({ data: { checkout } });
  handler({ data: { checkout: { lineItems: [] } } });
  assert.deepEqual(dataLayer.map(entry => entry.event ?? "clear"), ["clear", "purchase"]);
});
