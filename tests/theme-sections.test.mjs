// Render the theme sections with liquidjs, an open-source Liquid engine, using
// fictional data. liquidjs is not Shopify's renderer: Shopify-only tags and
// filters are stubbed below, so these tests check our logic, not the platform.
// Previewing in a development theme is still required.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Liquid } from "liquidjs";

const engine = new Liquid();
// {% schema %} and {% stylesheet %} produce no HTML output in Shopify either.
for (const name of ["schema", "stylesheet"]) {
  engine.registerTag(name, {
    parse(_token, remaining) {
      while (remaining.length) if (remaining.shift().name === `end${name}`) return;
      throw new Error(`unclosed ${name}`);
    },
    render() { return ""; },
  });
}
engine.registerFilter("handleize", v => String(v ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

const source = name => readFileSync(new URL(`../theme/sections/${name}.liquid`, import.meta.url), "utf8");
const schemaOf = text => JSON.parse(text.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)[1]);
const render = (name, context) => engine.parseAndRender(source(name), context).then(html => html.replace(/\s+/g, " ").trim());

// A metafield value as Liquid sees it: fields expose .value.
const badge = (label, tone, description) => ({ label: { value: label }, tone: { value: tone }, description: { value: description } });
const productWith = value => ({ metafields: { custom: { category_badge: { value } } } });

for (const name of ["product-category-badge", "campaign-phases"]) {
  test(`${name}: schema is valid JSON and declares every setting the template reads`, () => {
    const text = source(name);
    const schema = schemaOf(text);
    const sectionIds = new Set(schema.settings.map(s => s.id));
    const blockIds = new Set((schema.blocks ?? []).flatMap(b => b.settings.map(s => s.id)));
    for (const [, id] of text.matchAll(/section\.settings\.(\w+)/g)) assert.ok(sectionIds.has(id), `section setting ${id}`);
    for (const [, id] of text.matchAll(/(?:block|active)\.settings\.(\w+)/g)) assert.ok(blockIds.has(id), `block setting ${id}`);
  });
}

test("badge: renders label and escapes metaobject text", async () => {
  const html = await render("product-category-badge", {
    section: { settings: { show_description: true } },
    product: productWith(badge("Limited <b>run</b>", "positive", "Small batch")),
  });
  assert.match(html, /category-badge--positive/);
  assert.match(html, /Limited &lt;b&gt;run&lt;\/b&gt;/);
  assert.match(html, /Small batch/);
});

test("badge: unknown tones fall back to neutral instead of becoming a class", async () => {
  const html = await render("product-category-badge", {
    section: { settings: {} }, product: productWith(badge("New", "x\" onmouseover=\"alert(1)", "")),
  });
  assert.match(html, /category-badge--neutral/);
  assert.doesNotMatch(html, /onmouseover/);
});

test("badge: the section's product setting overrides the template product", async () => {
  const html = await render("product-category-badge", {
    section: { settings: { product: productWith(badge("Chosen", "neutral")) } },
    product: productWith(badge("Template", "neutral")),
  });
  assert.match(html, /Chosen/);
  assert.doesNotMatch(html, /Template/);
});

test("badge: ignores tags, and only explains an empty badge inside the theme editor", async () => {
  const product = { ...productWith(null), tags: ["badge:Bestseller"] };
  assert.equal(await render("product-category-badge", { section: { settings: {} }, product }), "");
  assert.match(await render("product-category-badge", { section: { settings: {} }, product, request: { design_mode: true } }), /No category badge/);
});

const phase = (label, start_date, end_date) => ({ settings: { label, start_date, end_date, headline: `${label} headline`, button_label: "Shop", button_link: "/collections/all" } });
const campaign = [phase("Early access", "2026-11-01", "2026-11-14"), phase("Main event", "2026-11-15", "2026-11-30"), phase("Evergreen")];
const preview = (date, blocks = campaign) => render("campaign-phases", { section: { settings: { preview_date: date }, blocks }, request: { design_mode: true } });

test("campaign: picks the phase whose inclusive window contains the date", async () => {
  assert.match(await preview("2026-11-01"), /Early access headline/);
  assert.match(await preview("2026-11-14"), /Early access headline/);
  assert.match(await preview("2026-11-15"), /Main event headline/);
  assert.match(await preview("2026-12-01"), /Evergreen headline/);
  assert.match(await preview("2026-10-01"), /Evergreen headline/);
});

test("campaign: block order decides overlaps, and no match shows an editor-only note", async () => {
  const overlapping = [phase("First", "2026-11-01", "2026-11-30"), phase("Second", "2026-11-10", "2026-11-20")];
  assert.match(await preview("2026-11-12", overlapping), /First headline/);
  assert.match(await preview("2026-12-01", overlapping), /No phase covers 2026-12-01/);
});

test("campaign: the live storefront ignores the preview date and uses today", async () => {
  const blocks = [phase("Past", "2000-01-01", "2000-12-31"), phase("Current", "2001-01-01", "2999-12-31")];
  const html = await render("campaign-phases", { section: { settings: { preview_date: "2000-06-01" }, blocks }, request: { design_mode: false } });
  assert.match(html, /Current headline/);
  assert.doesNotMatch(html, /editor-note/);
});
