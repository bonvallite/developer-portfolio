import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  createLadderEnhancer,
  LADDER_CSS,
  ROOT_ATTR,
  HIDDEN_ATTR,
  STYLE_ATTR,
} from "../lib/reward-ladder-mount.mjs";
import { DEMO_OFFER_FIELDS, parseOfferFields } from "../lib/reward-ladder.mjs";

// A stand-in for an app-owned cart. It lives inside an OPEN ShadowRoot and can
// be wiped and rebuilt at any time, exactly like a third-party app re-render.
const APP = `<div id="demo-cart" role="dialog"><header><h2>Your cart</h2></header><div data-native-progress>Spend $50.00 more for FREE SHIPPING</div><ul><li>Sample item</li></ul></div>`;

function setup({ offer = DEMO_OFFER_FIELDS, subtotal = 12000 } = {}) {
  const dom = new JSDOM("<!doctype html><body><div id='host'></div></body>");
  const { document, MutationObserver } = dom.window;
  const root = document.getElementById("host").attachShadow({ mode: "open" });
  root.innerHTML = APP;
  const state = { offer: parseOfferFields(offer), subtotal };
  const results = [];
  const enhancer = createLadderEnhancer({
    document,
    MutationObserver,
    drawerSelector: "#demo-cart",
    anchorSelector: "[data-native-progress]",
    nativeSelector: "[data-native-progress]",
    getOffer: () => state.offer,
    getSubtotalCents: () => state.subtotal,
    onResult: (result) => results.push(result),
  });
  return { document, root, state, enhancer, results };
}

const ladders = (root) => root.querySelectorAll(`[${ROOT_ATTR}]`);
const native = (root, selector = "[data-native-progress]") => root.querySelector(selector);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("mounts once, directly after the anchor, hides the native strip and injects one stylesheet", () => {
  const { root, enhancer } = setup();
  const result = enhancer.start();

  assert.deepEqual(result, { status: "mounted", stage: "shipping_next", roots: 1 });
  assert.equal(ladders(root).length, 1);
  assert.equal(native(root).nextElementSibling, ladders(root)[0]);
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), true);
  assert.equal(root.querySelectorAll(`[${STYLE_ATTR}]`).length, 1);
  assert.match(ladders(root)[0].querySelector(".rl-headline").textContent, /^Spend \$30\.00 more for FREE SHIPPING$/);
  enhancer.stop();
});

test("reconcile is idempotent: same node, no duplicate, no extra writes", () => {
  const { root, enhancer } = setup();
  enhancer.start();
  const first = ladders(root)[0];
  for (let i = 0; i < 5; i += 1) enhancer.reconcile();

  assert.equal(ladders(root).length, 1);
  assert.equal(ladders(root)[0], first);
  const stats = enhancer.getStats();
  assert.equal(stats.mounts, 1);
  assert.equal(stats.updates, 0);
  enhancer.stop();
});

test("a subtotal change updates the ladder in place instead of mounting another", () => {
  const { root, state, enhancer } = setup();
  enhancer.start();
  state.subtotal = 16000;
  enhancer.reconcile();

  assert.equal(ladders(root).length, 1);
  assert.match(ladders(root)[0].querySelector(".rl-headline").textContent, /Spend \$90\.00 more to add Free Sample Ceramic Mug/);
  assert.equal(enhancer.getStats().updates, 1);
  assert.equal(enhancer.getStats().mounts, 1);
  enhancer.stop();
});

test("when the app re-renders and wipes the ladder, the observer mounts it again exactly once", async () => {
  const { root, enhancer } = setup();
  enhancer.start();

  for (let i = 0; i < 5; i += 1) {
    root.innerHTML = APP;
    await tick();
    assert.equal(ladders(root).length, 1, `render ${i + 1} left ${ladders(root).length} ladders`);
    assert.equal(native(root).hasAttribute(HIDDEN_ATTR), true);
    assert.equal(root.querySelectorAll(`[${STYLE_ATTR}]`).length, 1);
  }
  assert.equal(enhancer.getStats().mounts, 6);
  enhancer.stop();
});

test("the observer settles: its own mutations do not trigger an endless loop", async () => {
  const { enhancer } = setup();
  enhancer.start();
  await tick();
  const settled = enhancer.getStats().reconciles;
  await tick();
  await tick();
  assert.equal(enhancer.getStats().reconciles, settled);
  enhancer.stop();
});

test("a stray duplicate ladder is removed", () => {
  const { root, enhancer } = setup();
  enhancer.start();
  const copy = ladders(root)[0].cloneNode(true);
  root.querySelector("ul").before(copy);
  assert.equal(ladders(root).length, 2);

  enhancer.reconcile();
  assert.equal(ladders(root).length, 1);
  enhancer.stop();
});

test("fail open: if the anchor disappears, the ladder is removed and nothing stays hidden", async () => {
  const { root, enhancer, results } = setup();
  enhancer.start();

  root.innerHTML = APP.replace("data-native-progress", "data-changed-markup");
  await tick();

  assert.equal(ladders(root).length, 0);
  assert.equal(root.querySelectorAll(`[${HIDDEN_ATTR}]`).length, 0);
  assert.equal(native(root, "[data-changed-markup]").hasAttribute(HIDDEN_ATTR), false);
  assert.equal(results.at(-1).status, "no-anchor");
  enhancer.stop();
});

test("fail open: a missing drawer leaves nothing behind, and a late hydration mounts it", async () => {
  const { root, enhancer, results } = setup();
  enhancer.start();

  root.innerHTML = "";
  await tick();
  assert.equal(ladders(root).length, 0);
  assert.equal(results.at(-1).status, "no-drawer");

  root.innerHTML = APP;
  await tick();
  assert.equal(ladders(root).length, 1);
  assert.equal(results.at(-1).status, "mounted");
  enhancer.stop();
});

test("fail closed: an invalid or disabled offer renders no ladder and keeps the native strip", () => {
  const { root, state, enhancer } = setup({ offer: { ...DEMO_OFFER_FIELDS, gift_one_label: "" } });
  const result = enhancer.start();

  assert.deepEqual(result, { status: "inactive", reason: "missing_gift_one_label" });
  assert.equal(ladders(root).length, 0);
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), false);

  state.offer = parseOfferFields(DEMO_OFFER_FIELDS);
  assert.equal(enhancer.reconcile().status, "mounted");

  state.offer = parseOfferFields({ ...DEMO_OFFER_FIELDS, rewards_enabled: false });
  assert.deepEqual(enhancer.reconcile(), { status: "inactive", reason: "disabled" });
  assert.equal(ladders(root).length, 0);
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), false);
  enhancer.stop();
});

test("fail open: if building the ladder throws, the native strip is restored", () => {
  const { root, state, enhancer } = setup();
  enhancer.start();
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), true);

  state.subtotal = -1;
  const result = enhancer.reconcile();

  assert.equal(result.status, "error");
  assert.equal(ladders(root).length, 0);
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), false);
  enhancer.stop();
});

test("offer labels are inserted as text, so markup in a label stays inert", () => {
  const hostile = '<img src=x onerror="alert(1)"> Free Sample';
  const { root, enhancer } = setup({ offer: { ...DEMO_OFFER_FIELDS, gift_one_label: hostile }, subtotal: 100 });
  enhancer.start();

  const ladder = ladders(root)[0];
  assert.equal(ladder.querySelector("img"), null);
  assert.ok(ladder.textContent.includes("<img src=x"));
  enhancer.stop();
});

test("stop() restores the native strip and ignores later app renders", async () => {
  const { root, enhancer } = setup();
  enhancer.start();
  enhancer.stop();

  assert.equal(ladders(root).length, 0);
  assert.equal(native(root).hasAttribute(HIDDEN_ATTR), false);

  root.innerHTML = APP;
  await tick();
  assert.equal(ladders(root).length, 0);
});

test("hiding is stylesheet-driven, so removing the stylesheet alone un-hides the native strip", () => {
  assert.match(LADDER_CSS, /\[data-reward-ladder-hidden\]\{display:none !important\}/);
});

test("onResult reports changes, not every observer tick", async () => {
  const { enhancer, results } = setup();
  enhancer.start();
  await tick();
  await tick();
  assert.ok(results.length <= 2, `expected at most 2 reports, got ${results.length}`);
  enhancer.stop();
});
