// Example-only status normalisation; source statuses vary across providers.
const statuses = {
  created: "CONFIRMED", collected: "CARRIER_PICKED_UP",
  moving: "IN_TRANSIT", van: "OUT_FOR_DELIVERY",
  complete: "DELIVERED", missed: "ATTEMPTED_DELIVERY",
  held: "DELAYED", failed: "FAILURE"
};
export function normaliseStatus(value) {
  return statuses[String(value).toLowerCase()] ?? "UNKNOWN";
}

// Carrier webhooks can arrive out of order. Happy-path statuses only move
// forward, exceptions (attempted, delayed, failure) always surface, UNKNOWN is
// ignored and DELIVERED is terminal. Production code should also compare the
// carrier's event timestamps rather than relying on arrival order alone.
const progression = ["CONFIRMED", "CARRIER_PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];
export function nextStatus(current, incoming) {
  if (current === "DELIVERED" || incoming === "UNKNOWN") return current ?? incoming;
  const from = progression.indexOf(current);
  const to = progression.indexOf(incoming);
  if (to === -1 || from === -1) return incoming;
  return to > from ? incoming : current;
}
