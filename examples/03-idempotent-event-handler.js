// Illustrative in-memory idempotency; production needs durable atomic storage.
export function makeEventHandler(processEvent) {
  const seen = new Set();
  return async event => {
    if (!event?.id) throw Error("Event id required");
    if (seen.has(event.id)) return { status: "duplicate" };
    await processEvent(event);
    seen.add(event.id);
    return { status: "processed" };
  };
}
