// Node.js example; verify against raw request body before parsing JSON.
import { createHmac, timingSafeEqual } from "node:crypto";
export function verifyWebhook(rawBody, signatureHex, secret) {
  if (!secret || !/^[a-f0-9]{64}$/i.test(signatureHex ?? "")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signatureHex, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}
// Production platforms may require a different header format or Base64 encoding.
