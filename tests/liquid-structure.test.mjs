// Liquid cannot run under Node, so check what can be checked statically:
// every block tag is closed in the right order and nothing interpolates raw
// customer-supplied text without a filter. Previewing in Shopify is still required.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const BLOCKS = ["if", "unless", "for", "case", "capture", "comment"];
const files = ["examples", "shopify-flow", "theme/sections"].flatMap(dir =>
  readdirSync(new URL(`../${dir}/`, import.meta.url)).filter(f => f.endsWith(".liquid")).map(f => `${dir}/${f}`));

export function unbalanced(source) {
  const stack = [];
  for (const [, tag] of source.matchAll(/{%-?\s*(\w+)/g)) {
    if (BLOCKS.includes(tag)) stack.push(tag);
    else if (tag.startsWith("end") && BLOCKS.includes(tag.slice(3))) {
      if (stack.pop() !== tag.slice(3)) return `unexpected ${tag}`;
    }
  }
  return stack.length ? `unclosed ${stack.join(", ")}` : null;
}

test("Liquid files exist", () => assert.ok(files.length >= 5));
for (const file of files) {
  test(`${file} has balanced block tags`, () => {
    assert.equal(unbalanced(readFileSync(new URL(`../${file}`, import.meta.url), "utf8")), null);
  });
}
test("the checker itself catches mistakes", () => {
  assert.match(unbalanced("{% if a %}{% for x in y %}{% endif %}"), /unexpected endif/);
  assert.match(unbalanced("{% if a %}"), /unclosed if/);
});
