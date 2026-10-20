// Flag generic parcel events that may need review; fictional rules.
export function staleTrackingEvents(events, nowISO, maxHours = 48) {
  const now = Date.parse(nowISO);
  if (!Number.isFinite(now)) throw Error("Invalid current date");
  return events.filter(event => {
    const stamp = Date.parse(event.updatedAt);
    return Number.isFinite(stamp) && now - stamp > maxHours * 3600000 &&
      event.status !== "DELIVERED";
  });
}
