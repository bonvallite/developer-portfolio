// Build redirect suggestions only; review manually before applying to a shop.
export function redirectSuggestions(retired, replacements, collectionPath) {
  const live = new Set(replacements);
  return retired.map(path => ({
    from: path,
    to: live.has(path.replace("-demo-old", "-demo-new"))
      ? path.replace("-demo-old", "-demo-new") : collectionPath
  })).filter(row => row.from !== row.to);
}
