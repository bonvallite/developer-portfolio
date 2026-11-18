// A fictional third-party cart used by the interactive demo and its tests.
// It renders plain DOM into a ShadowRoot and replaces everything on every
// render, the way a real app re-render would. Independently authored, fictional.
import { formatCents } from "./reward-ladder.mjs";

// The app's own strip has its own hard-coded amount, as real apps often do.
export const APP_NATIVE_FREE_SHIPPING_CENTS = 15000;

export const APP_SELECTORS = Object.freeze({
  drawerSelector: "#demo-app-cart",
  anchorSelector: "[data-app-progress]",
  nativeSelector: "[data-app-progress]",
});

const APP_CSS = `
:host{display:block}
*{box-sizing:border-box}
.app-drawer{font:14px/1.4 system-ui,sans-serif;color:#1f1b14;background:#fff;border:1px solid #d9d2c0;border-radius:12px;overflow:hidden}
.app-drawer header{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #e8e2d4}
.app-drawer h2{margin:0;font:600 20px/1.2 Georgia,serif;letter-spacing:.03em;text-transform:uppercase}
.app-progress,.app-progress-v2{margin:12px 16px 0;padding:10px 12px;border-radius:8px;background:#f1ede4;text-align:center;font-size:13px}
.app-track{height:6px;margin-top:8px;border-radius:3px;background:#ddd6c6;overflow:hidden}
.app-track i{display:block;height:100%;background:#947a41}
.app-lines{list-style:none;margin:12px 0 0;padding:0 16px}
.line{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #eee8da}
.line strong{display:block;font-size:13px}
.line span.detail{display:block;font-size:12px;color:#5f564a}
.qty{display:inline-flex;align-items:center;border:1px solid #cfc7b3;border-radius:8px}
.qty button{width:36px;height:36px;border:0;background:transparent;font-size:16px;cursor:pointer;color:#1f1b14}
.qty span{min-width:22px;text-align:center}
.price{font-weight:600;min-width:62px;text-align:right}
.empty{padding:18px 0;color:#5f564a}
.app-drawer footer{padding:14px 16px 16px}
.row{display:flex;justify-content:space-between;font-weight:600}
.checkout{width:100%;height:44px;margin-top:12px;border:0;border-radius:8px;background:#86703a;color:#fff;font:700 14px system-ui,sans-serif}
`;

export function renderApp(root, model) {
  if (!model.drawerOpen) {
    root.innerHTML = "";
    return;
  }
  const count = model.lines.reduce((sum, l) => sum + l.qty, 0);
  const remaining = Math.max(APP_NATIVE_FREE_SHIPPING_CENTS - model.qualifyingCents, 0);
  const fill = Math.min((model.qualifyingCents / APP_NATIVE_FREE_SHIPPING_CENTS) * 100, 100).toFixed(1);
  const nativeAttr = model.variant === "standard" ? " data-app-progress" : "";
  const nativeClass = model.variant === "standard" ? "app-progress" : "app-progress-v2";
  const native =
    remaining > 0
      ? `Spend <b>${formatCents(remaining)}</b> more for <b>FREE SHIPPING</b>`
      : "<b>You have free shipping</b>";
  const lines = model.lines.length
    ? model.lines
        .map((l) => {
          const stepper = l.fixed
            ? `<span class="detail">Not editable</span>`
            : `<div class="qty"><button type="button" data-line="${l.id}" data-delta="-1" aria-label="Decrease ${l.name}">\u2212</button><span>${l.qty}</span><button type="button" data-line="${l.id}" data-delta="1" aria-label="Increase ${l.name}">+</button></div>`;
          return `<li class="line"><div><strong>${l.name}</strong><span class="detail">${l.detail}</span></div>${stepper}<span class="price">${formatCents(l.priceCents * l.qty)}</span></li>`;
        })
        .join("")
    : `<li class="empty">Your cart is empty.</li>`;

  root.innerHTML = `<style>${APP_CSS}</style>
<div id="demo-app-cart" class="app-drawer" role="dialog" aria-label="Sample app cart">
  <header><h2>Your cart (${count})</h2></header>
  <div class="${nativeClass}"${nativeAttr}>${native}<div class="app-track"><i style="width:${fill}%"></i></div></div>
  <ul class="app-lines">${lines}</ul>
  <footer><div class="row"><span>Subtotal</span><span>${formatCents(model.payableCents)}</span></div><button type="button" class="checkout">Checkout</button></footer>
</div>`;
}
