import test from "node:test";
import assert from "node:assert/strict";
import { LADDER_CSS } from "../lib/reward-ladder-mount.mjs";
import { DEMO_OFFER_FIELDS, parseOfferFields, rewardLadderView } from "../lib/reward-ladder.mjs";
import {
  MOCK_PRODUCTS,
  MOCK_SCENARIOS,
  MOCK_SPEC,
  basketCents,
  emptyQuantities,
  scenarioQuantities,
} from "../lib/reward-ladder-mockup.mjs";

const config = parseOfferFields(DEMO_OFFER_FIELDS).config;
const stage = (cents) => rewardLadderView(cents, config).stage;

test("each design scenario produces the stage it claims, with the default offer", () => {
  for (const scenario of MOCK_SCENARIOS) {
    const cents = basketCents(scenarioQuantities(scenario.id));
    assert.equal(stage(cents), scenario.stage, `scenario ${scenario.id} (${cents} cents) is not ${scenario.stage}`);
  }
});

test("the scenarios walk the ladder in order, A to E", () => {
  assert.deepEqual(MOCK_SCENARIOS.map((s) => s.id), ["A", "B", "C", "D", "E"]);
  assert.deepEqual(MOCK_SCENARIOS.map((s) => s.stage), ["tier_one_next", "tier_one_next", "shipping_next", "tier_two_next", "complete"]);
  const totals = MOCK_SCENARIOS.map((s) => basketCents(scenarioQuantities(s.id)));
  const sorted = [...totals].sort((a, b) => a - b);
  assert.deepEqual(totals, sorted);
});

test("scenario B is genuinely close to the first gift and A is clearly not", () => {
  const remaining = (id) => rewardLadderView(basketCents(scenarioQuantities(id)), config).remainingCents;
  assert.ok(remaining("B") <= 500, "B should be within $5 of the first gift");
  assert.ok(remaining("A") >= 3000, "A should be well short");
});

test("basket totals are exact integer cents and reject bad quantities", () => {
  assert.equal(basketCents(emptyQuantities()), 0);
  assert.equal(basketCents({ beans: 2, tea: 1 }), 5050);
  assert.throws(() => basketCents({ beans: -1 }), TypeError);
  assert.throws(() => basketCents({ beans: 1.5 }), TypeError);
  assert.throws(() => scenarioQuantities("Z"), RangeError);
});

test("products are fictional and priced in whole cents", () => {
  for (const product of MOCK_PRODUCTS) {
    assert.ok(Number.isInteger(product.priceCents) && product.priceCents > 0);
    assert.match(product.name, /^Sample /);
  }
});

test("every design note points at a real selector and real tokens in the shipped stylesheet", () => {
  assert.ok(MOCK_SPEC.length >= 6);
  for (const spec of MOCK_SPEC) {
    assert.ok(LADDER_CSS.includes(spec.selector), `${spec.id}: selector ${spec.selector} not in the stylesheet`);
    for (const token of spec.tokens) assert.ok(LADDER_CSS.includes(token), `${spec.id}: token ${token} not in the stylesheet`);
  }
});
