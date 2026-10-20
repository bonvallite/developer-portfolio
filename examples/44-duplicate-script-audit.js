// Read-only: find scripts a page loads more than once, such as a tag manager
// container or a session-recording script added by both the theme and an app.
// Input: resource URLs, e.g. from performance.getEntriesByType("resource") in
// DevTools or a HAR export. Cache-busting query strings are ignored, but a
// container id (?id=) is kept so two different containers are not merged.
export function duplicateScripts(urls) {
  const counts = new Map();
  for (const raw of urls) {
    let url;
    try { url = new URL(raw); } catch { continue; }
    const id = url.searchParams.get("id");
    const key = url.host + url.pathname + (id ? `?id=${id}` : "");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, count]) => count > 1)
    .map(([script, count]) => ({ script, count }))
    .sort((a, b) => b.count - a.count);
}
