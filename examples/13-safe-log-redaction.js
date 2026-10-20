// Defence in depth: prefer allow-listed structured logs to untrusted payload dumps.
export function safeWebhookLog(event) {
  return { kind: String(event?.kind ?? "unknown").slice(0, 80),
    eventId: String(event?.id ?? "").slice(0, 80),
    receivedAt: new Date().toISOString() };
}
// Never log HTTP Authorization headers, secrets, raw customer payloads, or tokens.
