// Browser-side illustrative event deduplication; not a substitute for server-side controls.
export function createEventDeduper() {
  const seen = new Set();
  return function accept({ eventId, eventName }) {
    if (!eventId || !eventName) throw Error("Event ID and name required");
    const key = eventName + ":" + eventId;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}
