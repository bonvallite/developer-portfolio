// Create stable, non-secret event identifiers from already anonymous fields.
export function eventKey(source, type, externalId) {
  for (const v of [source,type,externalId]) if (!v || String(v).includes(":")) throw Error("Bad key segment");
  return [source,type,externalId].join(":");
}
// Never log a personal identifier in this key or use this as encryption.
