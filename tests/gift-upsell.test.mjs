import test from 'node:test';
import assert from 'node:assert/strict';
import { GIFT_ITEM, createCart, setGift, setQuantity, enforceGiftRules, summarise, buildPackingReport, JOURNEY_NODES, JOURNEY_EDGES, JOURNEY_STEPS, LANGUAGES, CODE_SAMPLES, pathTo } from '../lib/gift-upsell.mjs';

const starter = () => createCart([{ id: 'ribeye', quantity: 1 }]);

test('ticking adds one gift line and unticking removes it', () => {
  const withGift = setGift(starter(), true);
  assert.deepEqual(withGift.find(l => l.id === GIFT_ITEM.id), { id: GIFT_ITEM.id, quantity: 1 });
  assert.equal(setGift(withGift, false).some(l => l.id === GIFT_ITEM.id), false);
});

test('a quantity above the limit is corrected and reported', () => {
  const { cart, corrections } = enforceGiftRules(setQuantity(setGift(starter(), true), GIFT_ITEM.id, 3));
  assert.equal(cart.find(l => l.id === GIFT_ITEM.id).quantity, 1);
  assert.deepEqual(corrections, ['capped']);
});

test('the gift line is removed when it is the only line left', () => {
  const alone = setQuantity(setGift(starter(), true), 'ribeye', 0);
  const { cart, corrections } = enforceGiftRules(alone);
  assert.equal(cart.length, 0);
  assert.deepEqual(corrections, ['removed-alone']);
});

test('a valid cart is left unchanged', () => {
  const cart = setGift(starter(), true);
  assert.equal(enforceGiftRules(cart).cart, cart);
  assert.deepEqual(enforceGiftRules(cart).corrections, []);
});

test('the add-on adds price but no shipping weight', () => {
  const before = summarise(starter());
  const after = summarise(setGift(starter(), true));
  assert.equal(after.subtotalCents - before.subtotalCents, GIFT_ITEM.priceCents);
  assert.equal(after.shippableWeightGrams, before.shippableWeightGrams);
  assert.equal(after.freeDeliveryRemainingCents, before.freeDeliveryRemainingCents - GIFT_ITEM.priceCents);
});

test('unknown ids and invalid quantities are ignored', () => {
  assert.deepEqual(createCart([{ id: 'nope', quantity: 2 }, { id: 'sausages', quantity: -1 }, { id: 'sausages', quantity: 'x' }]), []);
});

test('the packing report lists the gift line and totals it in the cut summary', () => {
  const report = buildPackingReport([
    { name: '#1001', cart: setGift(starter(), true) },
    { name: '#1002', cart: createCart([{ id: 'ribeye', quantity: 2 }, { id: 'sausages', quantity: 1 }]) }
  ]);
  assert.equal(report.totalOrders, 2);
  assert.equal(report.orders[0].hasGift, true);
  assert.equal(report.orders[1].hasGift, false);
  const gift = report.cutSummary.find(row => row.sku === GIFT_ITEM.sku);
  assert.equal(gift.quantity, 1);
  assert.equal(report.cutSummary.find(row => row.sku === 'RIB-2X300').quantity, 3);
});

const ids = new Set(JOURNEY_NODES.map(n => n.id));

test('every edge and step points at a real node', () => {
  for (const [from, to] of JOURNEY_EDGES) { assert.ok(ids.has(from), from); assert.ok(ids.has(to), to); }
  for (const step of JOURNEY_STEPS) assert.ok(ids.has(step), step);
  assert.equal(new Set(JOURNEY_STEPS).size, JOURNEY_NODES.length);
});

test('paths follow the order journey', () => {
  assert.deepEqual(pathTo('packing'), ['theme', 'runtime', 'cart', 'checkout', 'order', 'report', 'packing']);
  assert.deepEqual(pathTo('freight'), ['theme', 'runtime', 'cart', 'checkout', 'order', 'freight']);
  assert.deepEqual(pathTo('theme'), ['theme']);
  assert.deepEqual(pathTo('nope'), []);
});

test('every language has at least one complete sample and no store identifiers', () => {
  for (const language of LANGUAGES) assert.ok(CODE_SAMPLES.some(c => c.language === language), language);
  assert.equal(new Set(CODE_SAMPLES.map(c => c.id)).size, CODE_SAMPLES.length);
  for (const sample of CODE_SAMPLES) {
    assert.ok(LANGUAGES.includes(sample.language), sample.id);
    assert.ok(sample.code.length > 40 && sample.note && sample.label);
    assert.doesNotMatch(sample.code, /myshopify\.com|gid:\/\/shopify\/\w+\/\d{3,}/);
  }
});
