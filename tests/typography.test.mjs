// Checks the self-hosted brand font snippet and the typography standard.
// The snippet renders under liquidjs with Shopify's file_url and {% style %}
// stubbed; the stylesheet is checked as text against the rules it documents.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Liquid } from "liquidjs";

const engine = new Liquid();
// {% style %} wraps its rendered contents in a <style> tag, as Shopify does.
engine.registerTag("style", {
  parse(_token, remaining) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remaining)
      .on("tag:endstyle", () => stream.stop())
      .on("template", tpl => this.tpls.push(tpl))
      .on("end", () => { throw new Error("unclosed style"); });
    stream.start();
  },
  * render(ctx, emitter) {
    emitter.write("<style>");
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write("</style>");
  },
});

const snippet = readFileSync(new URL("../theme/snippets/brand-fonts.liquid", import.meta.url), "utf8");
const css = readFileSync(new URL("../theme/assets/typography-standards.css", import.meta.url), "utf8");
const renderWith = fileUrl => {
  engine.registerFilter("file_url", name => fileUrl(name));
  return engine.parseAndRender(snippet).then(html => html.replace(/\s+/g, " ").trim());
};

test("brand font: preloads the WOFF2 from Shopify Files and swaps in without hiding text", async () => {
  const html = await renderWith(name => `https://cdn.example/files/${name}`);
  assert.match(html, /<link rel="preload" href="https:\/\/cdn.example\/files\/Brand_Serif_Light.woff2" as="font" type="font\/woff2" crossorigin>/);
  assert.match(html, /@font-face \{[^}]*font-family: "Brand Serif";[^}]*format\("woff2"\)[^}]*font-weight: 300;[^}]*font-display: swap;/);
  assert.doesNotMatch(html, /\.otf/);
});

test("brand font: a missing file outputs nothing, so headings fall back cleanly", async () => {
  assert.equal(await renderWith(() => ""), "");
});

const tokens = Object.fromEntries([...css.matchAll(/--(h\d)-font-size:\s*(\d+)px/g)].map(([, h, px]) => [h, +px]));
const lineHeights = [...css.matchAll(/line-height:\s*(\d+)px/g)].map(([, px]) => +px);

test("type scale: fixed sizes on a 4px grid, in descending order, with H2 and H3 the same size", () => {
  assert.deepEqual(Object.keys(tokens), ["h1", "h2", "h3", "h4", "h5", "h6"]);
  for (const [h, px] of Object.entries(tokens)) assert.equal(px % 4, 0, `${h} ${px}px`);
  assert.ok(tokens.h1 > tokens.h2 && tokens.h3 > tokens.h4 && tokens.h4 > tokens.h5);
  assert.equal(tokens.h2, tokens.h3);
  assert.equal(tokens.h5, tokens.h6);
  for (const px of lineHeights) assert.equal(px % 4, 0, `line height ${px}px`);
  assert.doesNotMatch(css, /clamp\(|vw\b/); // no fluid scaling
});

test("type scale: the Light serif is thickened in one place and never used below H2 size", () => {
  assert.match(css, /--display-stroke:\s*0\.6px/);
  assert.equal((css.match(/-webkit-text-stroke:\s*var\(--display-stroke\)/g) ?? []).length, 2);
  assert.match(css, /h2:is\(\.h3, \.h4, \.h5, \.h6\) \{[^}]*font-family: var\(--heading-font-family[^}]*-webkit-text-stroke: 0;/);
  assert.match(css, /h2\.section__heading[^{]*\{[^}]*font-size: var\(--h2-font-size\)/);
  assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ""), /!important/); // comments may mention it
});
