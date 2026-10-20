// Read-only font checks for a performance audit. Regular expressions are
// enough for an audit report; this is not a full CSS parser.

// @font-face rules without font-display leave text invisible while web fonts load.
export function fontFacesMissingDisplay(cssText) {
  return [...String(cssText).matchAll(/@font-face\s*{([^}]*)}/gi)]
    .map(([, body]) => body)
    .filter(body => !/font-display\s*:/i.test(body))
    .map(body => (body.match(/font-family\s*:\s*([^;]+)/i)?.[1] ?? "(unnamed)").trim().replace(/^["']|["']$/g, ""));
}

// Each extra host serving font files is another connection and another
// stylesheet to wait for. Several hosts usually means fonts were added by
// different apps over time.
export function fontHosts(urls) {
  const hosts = new Set();
  for (const raw of urls) {
    try {
      const url = new URL(raw);
      if (/\.(woff2?|ttf|otf)$/i.test(url.pathname)) hosts.add(url.host);
    } catch { /* skip malformed entries */ }
  }
  return [...hosts].sort();
}
