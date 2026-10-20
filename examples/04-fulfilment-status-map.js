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
