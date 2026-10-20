import test from "node:test";
import assert from "node:assert/strict";
import main from "../shopify-flow/run-code.js";

test("fictional wholesale tier qualifies at aggregate 5kg", () => {
  const result = main({ order: { customerEligible: true, lines: [
    { quantity: 2, gramsPerUnit: 1200 }, { quantity: 2, gramsPerUnit: 1300 }
  ] } });
  assert.equal(result.totalGrams, 5000);
  assert.equal(result.tier, "sample-5kg");
  assert.equal(result.eligible, true);
});
test("fictional 10kg threshold", () => {
  assert.equal(main({ order: { customerEligible: true, lines: [
    { quantity: 10, gramsPerUnit: 1000 }
  ] } }).tier, "sample-10kg");
});
test("reject missing and invalid input", () => {
  assert.equal(main({}).reason, "missing_order");
  assert.equal(main({ order: { customerEligible: true, lines: [
    { quantity: -1, gramsPerUnit: 1000 }
  ] } }).reason, "invalid_line");
});
test("non-wholesale customer never qualifies", () => {
  const result = main({ order: { customerEligible: false, lines: [
    { quantity: 20, gramsPerUnit: 1000 }
  ] } });
  assert.equal(result.eligible, false);
  assert.equal(result.reason, "not_wholesale");
});
