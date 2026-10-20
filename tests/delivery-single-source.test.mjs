// Guards the single source of truth for "can a residential drop happen on this
// date?" (examples/19-holiday-calendar.js). Every module that produces a
// delivery date must agree with it on every day of a year. See CASE_STUDIES.md,
// section 4. Holidays below are fictional dates chosen to hit edge cases.
import test from "node:test";
import assert from "node:assert/strict";
import { isDropOffDay } from "../examples/19-holiday-calendar.js";
import { nextDeliveryDate } from "../examples/06-business-day-delivery.js";
import { estimateDelivery } from "../examples/41-delivery-zone-calculator.js";

const HOLIDAYS = ["2026-01-01", "2026-01-26", "2026-04-03", "2026-04-06", "2026-12-25", "2026-12-28"];
const daysOf2026 = Array.from({ length: 365 }, (_, i) => new Date(Date.UTC(2026, 0, 1 + i, 12)).toISOString().slice(0, 10));

// Returns the dates a delivery-date function produced that the shared rule rejects.
function violations(produceDates) {
  return daysOf2026.flatMap(day => produceDates(day).filter(date => !isDropOffDay(date, HOLIDAYS)).map(date => `${day} -> ${date}`));
}

test("06 never lands on a weekend or holiday, for any start date or transit time", () => {
  assert.deepEqual(violations(day => [0, 1, 2, 3, 5].map(transit => nextDeliveryDate(day, transit, HOLIDAYS))), []);
});

test("41 never dispatches or delivers on a weekend or holiday, in any zone or order hour", () => {
  assert.deepEqual(violations(day => ["9150", "9250"].flatMap(postcode => [8, 13].flatMap(orderHour => {
    const result = estimateDelivery({ postcode, orderDate: day, orderHour, holidays: HOLIDAYS });
    return [result.dispatchDate, result.deliveryDate];
  }))), []);
});

test("the guard catches a copied rule that has drifted", () => {
  // The failure this design prevents: a second copy of the rule that someone
  // wrote before holidays were added, so it only skips weekends.
  const driftedCopy = (start, transit) => {
    const date = new Date(start + "T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + transit);
    while ([0, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
  };
  const found = violations(day => [driftedCopy(day, 1)]);
  // Thursday 24 December plus one day lands on the 25th, which the shared rule rejects.
  assert.ok(found.includes("2026-12-24 -> 2026-12-25"), found.join(", "));
});
