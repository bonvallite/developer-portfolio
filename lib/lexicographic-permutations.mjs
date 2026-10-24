// Independent JavaScript counterpart to the C backtracking exercise.
// Each input index is used at most once per output; duplicates remain positional.
export function lexicographicPermutations(input) {
  if (typeof input !== "string" || !/^[a-z]{1,7}$/.test(input)) {
    throw new Error("Enter 1 to 7 lowercase letters, without spaces.");
  }
  const chars = [...input].sort();
  const used = new Array(chars.length).fill(false);
  const running = [];
  const results = [];
  function visit(depth) {
    if (depth === chars.length) {
      results.push(running.join(""));
      return;
    }
    for (let i = 0; i < chars.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      running[depth] = chars[i];
      visit(depth + 1);
      used[i] = false; // Backtracking must undo the index selection.
    }
  }
  visit(0);
  return results;
}
