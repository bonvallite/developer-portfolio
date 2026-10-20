// Generic storefront search helper, not a client search implementation.
export function normaliseSearch(value) {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").slice(0, 120);
}
