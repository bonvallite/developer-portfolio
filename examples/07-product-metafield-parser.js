// Validate a generic optional metafield without exposing store data.
export function parsePositiveScore(metafield, max = 20) {
  if (!metafield || metafield.value == null || metafield.value === "") return null;
  const score = Number(metafield.value);
  if (!Number.isFinite(score) || score < 0 || score > max) return null;
  return score;
}
