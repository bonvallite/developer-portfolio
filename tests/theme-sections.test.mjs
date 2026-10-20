// Render the theme sections with liquidjs, an open-source Liquid engine, using
// fictional data. liquidjs is not Shopify's renderer: Shopify-only tags and
// filters are stubbed below, so these tests check our logic, not the platform.
// Previewing in a development theme is still required.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { Liquid } from "liquidjs";

// {% render 'name' %} resolves to theme/snippets/name.liquid, as in a theme.
const engine = new Liquid({ root: new URL("../theme/snippets/", import.meta.url).pathname, extname: ".liquid" });
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
// Shopify's image_url returns a CDN URL; the stub keeps the requested width visible.
engine.registerFilter("image_url", (image, ...args) => `${image.src}?width=${args.find(a => Array.isArray(a) && a[0] === "width")?.[1]}`);
engine.registerFilter("money", cents => `$${(cents / 100).toFixed(2)}`);
engine.registerFilter("handleize", v => String(v ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

const source = name => readFileSync(new URL(`../theme/sections/${name}.liquid`, import.meta.url), "utf8");
const schemaOf = text => JSON.parse(text.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/)[1]);
const render = (name, context) => engine.parseAndRender(source(name), context).then(html => html.replace(/\s+/g, " ").trim());

// A metafield value as Liquid sees it: fields expose .value.
const badge = (label, tone, description) => ({ label: { value: label }, tone: { value: tone }, description: { value: description } });
const productWith = value => ({ metafields: { custom: { category_badge: { value } } } });

for (const name of ["product-category-badge", "campaign-phases", "hero-slideshow", "featured-collection"]) {
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

const hero = context => engine.parseAndRender(readFileSync(new URL("../theme/snippets/hero-image.liquid", import.meta.url), "utf8"), context)
  .then(html => html.replace(/\s+/g, " ").trim());
const image = { src: "/demo/hero.png", width: 1600, height: 900, alt: "Demo hero" };

test("hero image: the first slide loads eagerly with high priority and a real src", async () => {
  const html = await hero({ image, index: 0 });
  assert.match(html, /loading="eager" fetchpriority="high"/);
  assert.match(html, / src="\/demo\/hero.png\?width=1200"/);
  assert.doesNotMatch(html, /data-src|loading="lazy"/);
  assert.match(html, /width="1600" height="900"/);
  // srcset stops at the original width instead of asking the CDN to upscale.
  assert.match(html, /srcset="[^"]*1600w"/);
  assert.doesNotMatch(html, /2000w/);
});

test("hero image: later slides stay lazy, and no image renders nothing", async () => {
  const html = await hero({ image, index: 2, alt: "Slide <3>" });
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.doesNotMatch(html, /fetchpriority/);
  assert.match(html, /alt="Slide &lt;3&gt;"/);
  assert.equal(await hero({ index: 0 }), "");
});

for (const file of readdirSync(new URL("../theme/templates/", import.meta.url)).filter(f => f.endsWith(".json"))) {
  test(`template ${file}: every section, block, and setting it uses exists, in a valid order`, () => {
    const template = JSON.parse(readFileSync(new URL(`../theme/templates/${file}`, import.meta.url), "utf8"));
    assert.deepEqual(template.order, Object.keys(template.sections));
    for (const section of Object.values(template.sections)) {
      const schema = schemaOf(source(section.type));
      const sectionIds = new Set(schema.settings.map(st => st.id));
      for (const key of Object.keys(section.settings ?? {})) assert.ok(sectionIds.has(key), `${section.type} setting ${key}`);
      const blocks = section.blocks ?? {};
      assert.deepEqual([...(section.block_order ?? [])].sort(), Object.keys(blocks).sort());
      for (const block of Object.values(blocks)) {
        const definition = schema.blocks?.find(b => b.type === block.type);
        assert.ok(definition, `${section.type} block type ${block.type}`);
        const ids = new Set(definition.settings.map(st => st.id));
        for (const key of Object.keys(block.settings)) assert.ok(ids.has(key), `${section.type} block setting ${key}`);
      }
    }
  });
}

test("campaign: MM-DD phases repeat every year and can wrap over New Year", async () => {
  const seasonal = JSON.parse(readFileSync(new URL("../theme/templates/page.seasonal-landing.json", import.meta.url), "utf8")).sections.season;
  const blocks = seasonal.block_order.map(id => seasonal.blocks[id]);
  const at = async date => (await preview(date, blocks)).match(/data-phase="([^"]+)"/)?.[1];
  assert.equal(await at("2026-12-01"), "christmas");
  assert.equal(await at("2031-12-24"), "christmas");       // a different year, same season
  assert.equal(await at("2026-12-25"), "evergreen");       // the gap between seasons
  assert.equal(await at("2026-12-30"), "boxing-day-to-new-year");
  assert.equal(await at("2027-01-02"), "boxing-day-to-new-year"); // wrapped into the next year
  assert.equal(await at("2027-01-03"), "evergreen");
  assert.equal(await at("2027-06-15"), "end-of-financial-year");
});

const slide = (heading, extra = {}) => ({ settings: { image: { src: `/demo/${heading}.png`, width: 1600, height: 900 }, heading, ...extra } });

test("hero slideshow: only the first slide's image is high priority, with one h1", async () => {
  const html = await render("hero-slideshow", { section: { settings: { label: "Featured" }, blocks: [slide("First", { button_label: "Shop", button_link: "/collections/all" }), slide("Second <b>")] } });
  assert.equal(html.match(/fetchpriority="high"/g).length, 1);
  assert.match(html, /<img[^>]*src="\/demo\/First.png[^"]*"[^>]*loading="eager"/);
  assert.equal(html.match(/loading="lazy"/g).length, 1); // the second slide
  assert.equal(html.match(/<h1/g).length, 1);
  assert.match(html, /<h2 class="hero-slideshow__heading">Second &lt;b&gt;<\/h2>/);
  assert.match(html, /href="\/collections\/all">Shop<\/a>/);
  assert.doesNotMatch(html, /<script/);
});

test("hero slideshow: no slides renders an editor-only note", async () => {
  assert.equal(await render("hero-slideshow", { section: { settings: {}, blocks: [] } }), "");
  assert.match(await render("hero-slideshow", { section: { settings: {}, blocks: [] }, request: { design_mode: true } }), /Add a slide/);
});

test("featured collection: respects the limit and lazy-loads product images", async () => {
  const products = Array.from({ length: 5 }, (_, i) => ({ title: `Demo ${i}`, url: `/products/demo-${i}`, price: 1000 + i,
    featured_image: { src: `/demo/p${i}.png`, width: 600, height: 600 } }));
  const html = await render("featured-collection", { section: { settings: { heading: "Featured", collection: { products, url: "/collections/demo" }, limit: 4 } } });
  assert.equal(html.match(/<li/g).length, 4);
  assert.equal(html.match(/loading="lazy"/g).length, 4);
  assert.match(html, /\$10\.00/);
  assert.match(await render("featured-collection", { section: { settings: { collection: { products: [] } } }, request: { design_mode: true } }), /Choose a collection/);
});
