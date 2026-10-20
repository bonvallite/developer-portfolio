// Remove common attribution identifiers from diagnostic URLs before sharing.
export function removeSensitiveQueryParams(value) {
  const url = new URL(value, "https://example.invalid");
  for (const key of [...url.searchParams.keys()]) {
    if (/token|secret|key|auth|code|email|session|gclid|fbclid/i.test(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.pathname + url.search;
}
// Review the remaining path/query manually; filtering cannot guarantee anonymity.
