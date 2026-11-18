// DOM side of the reward ladder demo. Independently authored, fictional values.
//
// Behaviour this module demonstrates for an app-owned cart in an OPEN ShadowRoot:
//   - find the cart by searching the document and nested open roots;
//   - mount the ladder once, right after an anchor element, and update in place;
//   - re-mount after the app re-renders, without ever creating a duplicate;
//   - hide the app's native progress strip only AFTER the ladder is in place,
//     and restore it the moment the ladder is removed or cannot be built;
//   - fail open on a missing anchor, drawer, invalid offer, or thrown error.
//
// All text is inserted with textContent, never innerHTML, so offer labels can
// never inject markup.
import { findAcrossOpenRoots } from "../examples/48-open-shadow-cart-enhancer.js";
import { rewardLadderView } from "./reward-ladder.mjs";

export const ROOT_ATTR = "data-reward-ladder";
export const HIDDEN_ATTR = "data-reward-ladder-hidden";
export const STYLE_ATTR = "data-reward-ladder-style";

// Hiding is done by this rule, not by inline styles. Removing the style element
// therefore un-hides the native strip even if every other cleanup step fails.
export const LADDER_CSS = `
[data-reward-ladder-hidden]{display:none !important}
[data-reward-ladder]{box-sizing:border-box;margin:12px 16px 0;padding:12px 14px;background:#f4f1ec;border-radius:10px;color:#1f1b14;font:14px/1.4 system-ui,sans-serif}
[data-reward-ladder] p{margin:0}
[data-reward-ladder] .rl-eyebrow{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#6b5728;font-weight:600}
[data-reward-ladder] .rl-headline{margin-top:5px}
[data-reward-ladder] .rl-strong{font-weight:700}
[data-reward-ladder] .rl-secondary{margin-top:6px;font-size:12px;color:#2f6b3f}
[data-reward-ladder] .rl-bar{position:relative;height:18px;margin:16px 9px 0}
[data-reward-ladder] .rl-track{position:absolute;left:0;right:0;top:6px;height:6px;border-radius:3px;background:#ddd6c6}
[data-reward-ladder] .rl-fill{position:absolute;left:0;top:6px;height:6px;border-radius:3px;background:#947a41}
[data-reward-ladder] .rl-marker{position:absolute;top:0;width:18px;height:18px;margin-left:-9px;box-sizing:border-box;border-radius:50%;background:#fff;border:2px solid #947a41}
[data-reward-ladder] .rl-marker[data-reached="true"]{background:#2f6b3f;border-color:#2f6b3f}
[data-reward-ladder] .rl-marker[data-reached="true"]::after{content:"";position:absolute;left:4px;top:1px;width:4px;height:8px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
[data-reward-ladder] .rl-labels{position:relative;height:30px;margin:5px 9px 0}
[data-reward-ladder] .rl-label{position:absolute;top:0;width:64px;text-align:center;transform:translateX(-50%);line-height:1.25}
[data-reward-ladder] .rl-label:last-child{transform:translateX(-100%);text-align:right}
[data-reward-ladder] .rl-amount{font-size:11px;font-weight:700}
[data-reward-ladder] .rl-caption{font-size:9.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5f564a}
[data-reward-ladder] .rl-terms{margin-top:8px;padding-top:8px;border-top:1px solid #e2dbc9;font-size:11px;color:#5f564a}
`;

function el(doc, tag, className, text) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderLadder(doc, view, terms) {
  const root = el(doc, "section");
  root.setAttribute(ROOT_ATTR, "");
  root.setAttribute("aria-label", "Rewards progress");

  root.append(el(doc, "p", "rl-eyebrow", "Rewards progress"));

  const headline = el(doc, "p", "rl-headline");
  headline.setAttribute("aria-live", "polite");
  for (const part of view.parts) headline.append(el(doc, "span", part.strong ? "rl-strong" : "", part.text));
  root.append(headline);

  if (view.secondary) root.append(el(doc, "p", "rl-secondary", view.secondary));

  const bar = el(doc, "div", "rl-bar");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Reward progress");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.setAttribute("aria-valuenow", String(Math.round(view.fillPercent)));
  bar.setAttribute("aria-valuetext", view.headline);
  bar.append(el(doc, "div", "rl-track"));
  const fill = el(doc, "div", "rl-fill");
  fill.style.width = `${view.fillPercent}%`;
  bar.append(fill);
  for (const marker of view.markers) {
    const dot = el(doc, "div", "rl-marker");
    dot.style.left = `${marker.position}%`;
    dot.setAttribute("data-reached", String(marker.reached));
    bar.append(dot);
  }
  root.append(bar);

  const labels = el(doc, "div", "rl-labels");
  labels.setAttribute("aria-hidden", "true");
  for (const marker of view.markers) {
    const label = el(doc, "div", "rl-label");
    label.style.left = `${marker.position}%`;
    label.append(el(doc, "div", "rl-amount", marker.thresholdLabel), el(doc, "div", "rl-caption", marker.label));
    labels.append(label);
  }
  root.append(labels);

  if (terms) root.append(el(doc, "p", "rl-terms", terms));
  return root;
}

// options:
//   document, drawerSelector, anchorSelector, nativeSelector  (required)
//   getOffer()          -> parseOfferFields() result
//   getSubtotalCents()  -> integer cents
//   onResult(result, stats) optional, called only when something changed
//   css, MutationObserver  optional overrides
export function createLadderEnhancer(options) {
  const { document: doc, drawerSelector, anchorSelector, nativeSelector, getOffer, getSubtotalCents, onResult } = options;
  const Observer = options.MutationObserver ?? doc.defaultView?.MutationObserver ?? globalThis.MutationObserver;
  const stats = { mounts: 0, updates: 0, teardowns: 0, reconciles: 0 };
  let observer = null;
  let mountedRoot = null;
  let pending = false;
  let lastReport = "";

  const ownedNodes = (root) => Array.from(root.querySelectorAll(`[${ROOT_ATTR}]`));

  function teardown() {
    const root = mountedRoot;
    mountedRoot = null;
    if (!root) return false;
    let changed = false;
    for (const node of root.querySelectorAll(`[${ROOT_ATTR}], [${STYLE_ATTR}]`)) {
      node.remove();
      changed = true;
    }
    for (const node of root.querySelectorAll(`[${HIDDEN_ATTR}]`)) {
      node.removeAttribute(HIDDEN_ATTR);
      changed = true;
    }
    if (changed) stats.teardowns += 1;
    return changed;
  }

  function ensureStyle(root) {
    if (root.querySelector(`[${STYLE_ATTR}]`)) return;
    const style = doc.createElement("style");
    style.setAttribute(STYLE_ATTR, "");
    style.textContent = options.css ?? LADDER_CSS;
    (root.head ?? root).append(style);
  }

  function run() {
    const offer = getOffer();
    if (!offer || offer.ok !== true) {
      teardown();
      return { status: "inactive", reason: offer?.reason ?? "missing_offer" };
    }

    const drawer = findAcrossOpenRoots(doc, drawerSelector);
    if (!drawer) {
      teardown();
      return { status: "no-drawer" };
    }

    const root = drawer.getRootNode();
    if (mountedRoot && mountedRoot !== root) teardown();

    const anchor = drawer.querySelector(anchorSelector);
    if (!anchor) {
      mountedRoot = root;
      teardown();
      return { status: "no-anchor" };
    }

    const view = rewardLadderView(getSubtotalCents(), offer.config);
    const signature = JSON.stringify([view, offer.config.terms]);
    const build = () => {
      const node = renderLadder(doc, view, offer.config.terms);
      node.setAttribute("data-signature", signature);
      return node;
    };

    mountedRoot = root;
    ensureStyle(root);

    const [first, ...extras] = ownedNodes(root);
    for (const extra of extras) extra.remove();

    let node = first;
    if (!node) {
      node = build();
      anchor.insertAdjacentElement("afterend", node);
      stats.mounts += 1;
    } else {
      if (node.previousElementSibling !== anchor) anchor.insertAdjacentElement("afterend", node);
      if (node.getAttribute("data-signature") !== signature) {
        const fresh = build();
        node.replaceWith(fresh);
        node = fresh;
        stats.updates += 1;
      }
    }

    // Only now, with the ladder in place, is the native strip hidden.
    for (const native of drawer.querySelectorAll(nativeSelector)) native.setAttribute(HIDDEN_ATTR, "");

    return { status: "mounted", stage: view.stage, roots: ownedNodes(root).length };
  }

  function collectRoots() {
    const roots = [doc];
    const seen = new Set(roots);
    for (let i = 0; i < roots.length; i += 1) {
      for (const element of roots[i].querySelectorAll("*")) {
        if (element.shadowRoot && !seen.has(element.shadowRoot)) {
          seen.add(element.shadowRoot);
          roots.push(element.shadowRoot);
        }
      }
    }
    return roots;
  }

  function watch() {
    if (!observer) return;
    for (const root of collectRoots()) observer.observe(root, { childList: true, subtree: true });
  }

  function reconcile() {
    stats.reconciles += 1;
    let result;
    try {
      result = run();
    } catch (error) {
      try {
        teardown();
      } catch {
        // The native strip stays visible if removal itself fails.
      }
      result = { status: "error", reason: error instanceof Error ? error.message : String(error) };
    }
    watch();

    // Report only real changes so a UI that re-renders on every report cannot
    // feed its own mutations back into this observer.
    const report = JSON.stringify([result, stats.mounts, stats.updates, stats.teardowns]);
    if (report !== lastReport) {
      lastReport = report;
      onResult?.(result, { ...stats });
    }
    return result;
  }

  function schedule() {
    if (pending) return;
    pending = true;
    Promise.resolve().then(() => {
      pending = false;
      if (observer) reconcile();
    });
  }

  function start() {
    if (!observer) observer = new Observer(schedule);
    return reconcile();
  }

  function stop() {
    observer?.disconnect();
    observer = null;
    teardown();
  }

  return { start, stop, reconcile, getStats: () => ({ ...stats }) };
}
