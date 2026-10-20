// Find simple cycles in a list of mock URL redirects before deployment.
export function detectRedirectLoops(redirects) {
  const next = new Map(redirects.map(({ from, to }) => [from, to]));
  const loops = [];
  for (const start of next.keys()) {
    const seen = new Set();
    let cursor = start;
    while (next.has(cursor)) {
      if (seen.has(cursor)) { loops.push(start); break; }
      seen.add(cursor);
      cursor = next.get(cursor);
    }
  }
  return loops;
}
