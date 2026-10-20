// Fictional delivery-zone calculator: dispatch cut-off, carrier transit, then
// the zone's residential delivery weekdays. Postcode ranges, cut-off and
// transit times are invented and are not any business's live rules.
import { isDropOffDay } from "./19-holiday-calendar.js";
import { nextDeliveryDate } from "./06-business-day-delivery.js";

export const SAMPLE_ZONES = Object.freeze([
  { name: "Metro (fictional)", from: 9100, to: 9199, transitDays: 1, deliveryWeekdays: [1, 2, 3, 4, 5] },
  { name: "Regional (fictional)", from: 9200, to: 9299, transitDays: 3, deliveryWeekdays: [2, 4] },
]);

export function findZone(postcode, zones = SAMPLE_ZONES) {
  if (!/^\d{4}$/.test(String(postcode))) return null;
  const code = Number(postcode);
  return zones.find(zone => code >= zone.from && code <= zone.to) ?? null;
}

// orderDate is the warehouse-local date (YYYY-MM-DD) and orderHour its local
// hour (0-23). Converting from UTC into the warehouse time zone is the caller's job.
export function estimateDelivery({ postcode, orderDate, orderHour, cutoffHour = 12, holidays = [] }, zones = SAMPLE_ZONES) {
  const zone = findZone(postcode, zones);
  if (!zone) return { deliverable: false, reason: "unknown_postcode" };
  if (!Number.isInteger(orderHour) || orderHour < 0 || orderHour > 23) throw Error("Invalid hour");
  const day = new Date(orderDate + "T12:00:00Z");
  if (Number.isNaN(day.getTime())) throw Error("Invalid date");
  const iso = () => day.toISOString().slice(0, 10);

  // Dispatch the same working day before cut-off, otherwise the next working day.
  if (orderHour >= cutoffHour || !isDropOffDay(iso(), holidays)) {
    do day.setUTCDate(day.getUTCDate() + 1); while (!isDropOffDay(iso(), holidays));
  }
  const dispatchDate = iso();

  // Transit and weekday/holiday roll-forward reuse example 06, then wait for
  // the next weekday this zone actually receives residential drops.
  const arrival = new Date(nextDeliveryDate(dispatchDate, zone.transitDays, holidays) + "T12:00:00Z");
  while (!zone.deliveryWeekdays.includes(arrival.getUTCDay()) ||
         !isDropOffDay(arrival.toISOString().slice(0, 10), holidays)) {
    arrival.setUTCDate(arrival.getUTCDate() + 1);
  }
  return { deliverable: true, zone: zone.name, dispatchDate, deliveryDate: arrival.toISOString().slice(0, 10) };
}
