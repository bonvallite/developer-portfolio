import test from "node:test";
import assert from "node:assert/strict";
import { DEMO_OFFER, validateOffer, calculateRewardState } from "../lib/rewards-engine.mjs";

test("default synthetic configuration is valid and never mutates", () => {
  assert.equal(validateOffer(DEMO_OFFER), true);
  assert.equal(Object.isFrozen(DEMO_OFFER), true);
});

test("milestones unlock at exact values, not when the visual bar is close", () => {
  for (const [subtotal, count] of [[0,0],[124.99,0],[125,1],[224.99,1],[225,2],[324.99,2],[325,3],[999,3]]) {
    const result = calculateRewardState(DEMO_OFFER, subtotal);
    assert.equal(result.unlockedCount,count,"subtotal "+subtotal);
  }
});

test("next reward and remaining spend are derived from one config", () => {
  const a = calculateRewardState(DEMO_OFFER,200);
  assert.equal(a.next.id,"shipping");
  assert.equal(a.remaining,25);
  const changed = {...DEMO_OFFER, shippingThreshold:240};
  assert.equal(calculateRewardState(changed,200).remaining,40);
});

test("progress segments stay visually balanced for uneven thresholds", () => {
  for (const [amount, expected] of [[125,100/3],[225,200/3],[325,100]]) {
    assert.ok(Math.abs(calculateRewardState(DEMO_OFFER,amount).progressPercent-expected)<0.00001);
  }
});

test("invalid configuration fails safely and does not advertise a gift", () => {
  for (const invalid of [{...DEMO_OFFER,giftThreshold:325}, {...DEMO_OFFER,shippingThreshold:NaN}, {...DEMO_OFFER,bonusLabel:""}]) {
    const result = calculateRewardState(invalid,999);
    assert.equal(result.valid,false);
    assert.equal(result.milestones.length,0);
  }
});

test("disabled offer never renders reward milestones", () => {
  const result = calculateRewardState({...DEMO_OFFER,enabled:false},400);
  assert.equal(result.valid,true);
  assert.equal(result.enabled,false);
  assert.equal(result.milestones.length,0);
});

test("negative and nonnumeric amounts do not unlock rewards", () => {
  assert.equal(calculateRewardState(DEMO_OFFER,-5).unlockedCount,0);
  assert.equal(calculateRewardState(DEMO_OFFER,NaN).unlockedCount,0);
});
