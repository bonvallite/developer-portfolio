import test from "node:test";
import assert from "node:assert/strict";
import { lexicographicPermutations } from "../lib/lexicographic-permutations.mjs";

test("lexicographic permutations: three sorted distinct characters", () => {
  assert.deepEqual(lexicographicPermutations("abc"), ["abc", "acb", "bac", "bca", "cab", "cba"]);
});

test("lexicographic permutations: unsorted input is sorted first", () => {
  assert.deepEqual(lexicographicPermutations("cba"), lexicographicPermutations("abc"));
});

test("lexicographic permutations: repeated letters retain position-based duplicates", () => {
  assert.deepEqual(lexicographicPermutations("aab"), ["aab", "aab", "aba", "aba", "baa", "baa"]);
});

test("lexicographic permutations: seven distinct letters generate 5,040 sorted lines", () => {
  const result = lexicographicPermutations("bcehitz");
  assert.equal(result.length, 5040);
  assert.equal(new Set(result).size, 5040);
  assert.equal(result[0], "bcehitz");
  assert.equal(result.at(-1), "ztihecb");
  assert.deepEqual(result, [...result].sort());
});

test("lexicographic permutations: validates input size and character set", () => {
  for (const input of ["", "abcdefgh", "Abc", "a b", "a1", "x\n"]) {
    assert.throws(() => lexicographicPermutations(input), /1 to 7 lowercase/);
  }
});
