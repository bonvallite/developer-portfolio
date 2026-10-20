// UTC-only mock residential delivery calendar; not a courier ETA.
// Parcels move every calendar day, but drop-off follows example 19's calendar.
import { isDropOffDay } from "./19-holiday-calendar.js";

export function nextDeliveryDate(startISO, transitDays, unavailable = []) {
  if (!Number.isInteger(transitDays) || transitDays < 0) throw Error("Invalid days");
  const date = new Date(startISO + "T12:00:00Z");
  if (Number.isNaN(date.getTime())) throw Error("Invalid date");
  date.setUTCDate(date.getUTCDate() + transitDays);
  while (!isDropOffDay(date.toISOString().slice(0, 10), unavailable)) {
    date.setUTCDate(date.getUTCDate() + 1); // No residential drop on blocked dates.
  }
  return date.toISOString().slice(0, 10);
}
