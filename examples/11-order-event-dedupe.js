// Browser-side guard so a purchase event is not re-sent when a customer reloads
// the order confirmation page. Pass window.sessionStorage (or nothing for
// memory only). Not a substitute for server-side or GA4 transaction_id dedupe.
import { eventKey } from "./36-stable-event-keys.js";

export function createEventDeduper(storage) {
  const memory = new Set();
  const stored = key => { try { return storage?.getItem("sent:" + key) === "1"; } catch { return false; } };
  const remember = key => { try { storage?.setItem("sent:" + key, "1"); } catch { /* storage blocked */ } };
  return function accept({ eventId, eventName }) {
    if (!eventId || !eventName) throw Error("Event ID and name required");
    const key = eventKey("web", eventName, eventId);
    if (memory.has(key) || stored(key)) return false;
    memory.add(key);
    remember(key);
    return true;
  };
}
