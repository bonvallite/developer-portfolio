import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createLadderEnhancer, ROOT_ATTR, HIDDEN_ATTR, STYLE_ATTR } from "../lib/reward-ladder-mount.mjs";
import { APP_SELECTORS, renderApp } from "../lib/reward-ladder-demo-app.mjs";
import { DEMO_OFFER_FIELDS, parseOfferFields } from "../lib/reward-ladder.mjs";

// Drives the same simulated app the interactive page uses, so the page's
// selectors and its "wipe everything on every render" behaviour are covered.

const LINES = [
  { id: "beans", name: "Sample coffee beans", detail: "250g bag", qty: 2, priceCents: 1800, fixed: false },
  { id: "card", name: "Sample gift card", detail: "Digital, $25", qty: 1, priceCents: 2500, fixed: true },
];

function model(overrides = {}) {
  return { lines: LINES, payableCents: 6100, qualifyingCents: 12000, variant: "standard", drawerOpen: true, tick: 0, ...overrides };
}

function setup(offerFields = DEMO_OFFER_FIELDS) {
  const dom = new JSDOM("<!doctype html><body><div id='host'></div></body>");
  const { document, MutationObserver } = dom.window;
  const root = document.getElementById("host").attachShadow({ mode: "open" });
  const state = { offer: parseOfferFields(offerFields), subtotal: 12000 };
  const results = [];
  const enhancer = createLadderEnhancer({
    document,
    MutationObserver,
    ...APP_SELECTORS,
    getOffer: () => state.offer,
    getSubtotalCents: () => state.subtotal,
    onResult: (result) => results.push(result),
  });
  return { root, state, enhancer, results };
}

const ladders = (root) => root.querySelectorAll(`[${ROOT_ATTR}]`);
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test("the simulated app renders steppers for editable lines and none for the fixed gift card line", () => {
  const { root } = setup();
  renderApp(root, model());

  assert.equal(root.querySelectorAll("[data-line][data-delta]").length, 2);
  assert.equal(root.querySelectorAll('[data-line="card"]').length, 0);
  assert.match(root.querySelector("h2").textContent, /Your cart \(3\)/);
  assert.equal(root.querySelector("#demo-app-cart").getAttribute("role"), "dialog");
});

test("the enhancer finds the simulated app, mounts one ladder after the native strip and hides it", async () => {
  const { root, enhancer } = setup();
  enhancer.start();
  renderApp(root, model());
  await tick();

  const native = root.querySelector("[data-app-progress]");
  assert.equal(ladders(root).length, 1);
  assert.equal(native.nextElementSibling, ladders(root)[0]);
  assert.equal(native.hasAttribute(HIDDEN_ATTR), true);
  assert.equal(root.querySelectorAll(`[${STYLE_ATTR}]`).length, 1);
  enhancer.stop();
});

test("every app render wipes the ladder and the enhancer restores exactly one", async () => {
  const { root, state, enhancer } = setup();
  enhancer.start();
  renderApp(root, model());
  await tick();

  state.subtotal = 16000;
  for (let tickCount = 1; tickCount <= 4; tickCount += 1) {
    renderApp(root, model({ tick: tickCount, qualifyingCents: 16000 }));
    await tick();
    assert.equal(ladders(root).length, 1);
    assert.match(root.querySelector(".rl-headline").textContent, /Spend \$90\.00 more to add Free Sample Ceramic Mug/);
    assert.equal(root.querySelector("[data-app-progress]").hasAttribute(HIDDEN_ATTR), true);
  }
  enhancer.stop();
});

test("when the app changes its markup the ladder steps aside and the app strip stays visible", async () => {
  const { root, results, enhancer } = setup();
  enhancer.start();
  renderApp(root, model());
  await tick();

  renderApp(root, model({ variant: "changed" }));
  await tick();
  assert.equal(ladders(root).length, 0);
  assert.equal(root.querySelectorAll(`[${HIDDEN_ATTR}]`).length, 0);
  assert.ok(root.querySelector(".app-progress-v2"));
  assert.equal(results.at(-1).status, "no-anchor");

  renderApp(root, model({ variant: "standard" }));
  await tick();
  assert.equal(ladders(root).length, 1);
  enhancer.stop();
});

test("closing and reopening the drawer leaves nothing behind and remounts cleanly", async () => {
  const { root, results, enhancer } = setup();
  enhancer.start();
  renderApp(root, model());
  await tick();

  renderApp(root, model({ drawerOpen: false }));
  await tick();
  assert.equal(root.children.length, 0);
  assert.equal(results.at(-1).status, "no-drawer");

  renderApp(root, model());
  await tick();
  assert.equal(ladders(root).length, 1);
  enhancer.stop();
});

test("the app's own strip uses its own hard-coded amount, which is why the offer fields drive the ladder instead", async () => {
  const { root, enhancer } = setup({ ...DEMO_OFFER_FIELDS, shipping_threshold: 175, gift_two_threshold: 275 });
  enhancer.start();
  renderApp(root, model({ qualifyingCents: 12000 }));
  await tick();

  assert.match(root.querySelector("[data-app-progress]").textContent, /Spend \$30\.00 more for FREE SHIPPING/);
  assert.match(root.querySelector(".rl-headline").textContent, /Spend \$55\.00 more for FREE SHIPPING/);
  enhancer.stop();
});

test("a disabled offer leaves the simulated app completely untouched", async () => {
  const { root, enhancer } = setup({ ...DEMO_OFFER_FIELDS, rewards_enabled: false });
  enhancer.start();
  renderApp(root, model());
  await tick();

  assert.equal(ladders(root).length, 0);
  assert.equal(root.querySelectorAll(`[${HIDDEN_ATTR}], [${STYLE_ATTR}]`).length, 0);
  enhancer.stop();
});
