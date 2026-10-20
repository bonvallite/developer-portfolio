import test from "node:test";
import assert from "node:assert/strict";
import { calculateBasket, DEMO_PRODUCTS, DEMO_TIERS } from "../lib/b2b-simulator.mjs";

test("zero basket stays on standard tier", () => {
  const x = calculateBasket([]);
  assert.equal(x.totalCents, 0);
  assert.equal(x.remainingGrams, 5000);
});
test("aggregate weight triggers discount across different products", () => {
  const x = calculateBasket([{ id: "sample-a", quantity: 4 }, { id: "sample-b", quantity: 2 }]);
  assert.equal(x.weightGrams, 5400);
  assert.equal(x.tier.name, "Volume 5 kg");
  assert.equal(x.subtotalCents, 17200);
  assert.equal(x.savingsCents, 860);
  assert.equal(x.totalCents, 16340);
});
test("threshold applies exactly at 10 kg", () => {
  const x = calculateBasket([{ id: "sample-c", quantity: 20 }]);
  assert.equal(x.tier.discountBps, 1000);
  assert.equal(x.remainingGrams, 10000);
});
test("highest tier has no next tier", () => {
  const x = calculateBasket([{ id: "sample-c", quantity: 40 }]);
  assert.equal(x.tier.name, "Volume 20 kg");
  assert.equal(x.nextTier, null);
});
test("reject duplicate cart entries and unknown product IDs", () => {
  assert.throws(() => calculateBasket([{ id: "sample-a", quantity: 1 }, { id: "sample-a", quantity: 2 }]));
  assert.throws(() => calculateBasket([{ id: "unknown", quantity: 1 }]));
});
test("reject invalid quantities and tier configurations", () => {
  assert.throws(() => calculateBasket([{ id: "sample-a", quantity: -1 }]));
  assert.throws(() => calculateBasket([{ id: "sample-a", quantity: 0.5 }]));
  assert.throws(() => calculateBasket([], DEMO_PRODUCTS, [{ minimumGrams: 100, discountBps: 1, name: "Bad" }]));
  assert.throws(() => calculateBasket([], DEMO_PRODUCTS, [{ minimumGrams: 0, discountBps: 10001, name: "Bad" }]));
});
test("never mutates tiers or products", () => {
  calculateBasket([{ id: "sample-a", quantity: 1 }]);
  assert.equal(DEMO_TIERS[0].name, "Standard");
  assert.equal(DEMO_PRODUCTS[0].id, "sample-a");
});
