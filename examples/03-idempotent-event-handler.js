// Illustrative in-memory idempotency; production needs durable atomic storage
// (for example a unique constraint or conditional write keyed by event id).
// Concurrent deliveries of the same id share one in-flight run, so a webhook
// retry that arrives mid-processing cannot trigger the work twice.
export function makeEventHandler(processEvent) {
  const done = new Set();
  const inFlight = new Map();
  return async event => {
    const id = event?.id;
    if (!id) throw Error("Event id required");
    if (done.has(id)) return { status: "duplicate" };
    if (inFlight.has(id)) { await inFlight.get(id); return { status: "duplicate" }; }
    const work = Promise.resolve().then(() => processEvent(event));
    inFlight.set(id, work);
    try {
      await work;
      done.add(id); // Only after success, so a failed event can be retried.
      return { status: "processed" };
    } finally {
      inFlight.delete(id);
    }
  };
}
