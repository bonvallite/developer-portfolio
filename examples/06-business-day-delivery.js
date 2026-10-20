// UTC-only mock residential delivery calendar; not a courier ETA.
export function nextDeliveryDate(startISO, transitDays, unavailable = []) {
  if (!Number.isInteger(transitDays) || transitDays < 0) throw Error("Invalid days");
  const date = new Date(startISO + "T12:00:00Z");
  if (Number.isNaN(date.getTime())) throw Error("Invalid date");
  date.setUTCDate(date.getUTCDate() + transitDays); // Parcels move every calendar day.
  while ([0, 6].includes(date.getUTCDay()) || unavailable.includes(date.toISOString().slice(0,10))) {
    date.setUTCDate(date.getUTCDate() + 1); // No residential drop on blocked dates.
  }
  return date.toISOString().slice(0, 10);
}
