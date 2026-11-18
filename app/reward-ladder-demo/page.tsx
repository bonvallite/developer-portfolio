"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import Link from "next/link";
import {
  DEMO_OFFER_FIELDS,
  SUBTOTAL_BASES,
  formatCents,
  parseOfferFields,
  qualifyingSubtotalCents,
  rewardLadderView,
} from "../../lib/reward-ladder.mjs";
import type { CartLike, ParsedOffer, SubtotalBasis } from "../../lib/reward-ladder.mjs";
import { createLadderEnhancer } from "../../lib/reward-ladder-mount.mjs";
import { APP_SELECTORS, renderApp } from "../../lib/reward-ladder-demo-app.mjs";
import type { AppLine, AppModel } from "../../lib/reward-ladder-demo-app.mjs";
import type { EnhancerResult, EnhancerStats } from "../../lib/reward-ladder-mount.mjs";

// Everything on this page is fictional: shop, products, prices, offer and the
// "third-party app". The app cart is plain DOM inside an OPEN ShadowRoot that
// the page can wipe and rebuild, which is how a real app re-render behaves.

type Product = { id: string; name: string; detail: string; priceCents: number };
const PRODUCTS: readonly Product[] = [
  { id: "beans", name: "Sample coffee beans", detail: "250g bag", priceCents: 1800 },
  { id: "tea", name: "Sample loose-leaf tea", detail: "100g tin", priceCents: 1450 },
  { id: "dripper", name: "Sample pour-over dripper", detail: "Ceramic, 1 to 2 cups", priceCents: 4200 },
];
const GIFT_CARD = { name: "Sample gift card", detail: "Digital, $25", priceCents: 2500 };
const CART_DISCOUNT_CENTS = 1500;

type OfferForm = {
  rewards_enabled: boolean;
  gift_one_threshold: string;
  shipping_threshold: string;
  gift_two_threshold: string;
  gift_one_label: string;
  gift_two_label: string;
  terms: string;
};

const DEFAULT_FORM: OfferForm = {
  rewards_enabled: DEMO_OFFER_FIELDS.rewards_enabled === true,
  gift_one_threshold: String(DEMO_OFFER_FIELDS.gift_one_threshold),
  shipping_threshold: String(DEMO_OFFER_FIELDS.shipping_threshold),
  gift_two_threshold: String(DEMO_OFFER_FIELDS.gift_two_threshold),
  gift_one_label: DEMO_OFFER_FIELDS.gift_one_label,
  gift_two_label: DEMO_OFFER_FIELDS.gift_two_label,
  terms: DEMO_OFFER_FIELDS.terms,
};

const box: CSSProperties = { border: "1px solid #4c4f55", borderRadius: 14, padding: 20 };
const muted: CSSProperties = { color: "#bbc0c7" };
const input: CSSProperties = { display: "block", width: "100%", padding: 10, marginTop: 6, borderRadius: 8, background: "#171b20", color: "white", border: "1px solid #81838a" };
const button: CSSProperties = { padding: "9px 12px", borderRadius: 8, background: "#171b20", color: "#e3bf8a", border: "1px solid #b18b5d", cursor: "pointer", font: "inherit", fontSize: 13 };
const label: CSSProperties = { display: "block", fontSize: 13, color: "#bbc0c7" };

const STATUS_COPY: Record<string, string> = {
  mounted: "Ladder mounted. The app's own strip is hidden.",
  inactive: "No ladder, by design. The offer is off or invalid, so the app's own strip stays visible.",
  "no-drawer": "No cart on the page. Nothing is mounted or hidden.",
  "no-anchor": "The app changed its markup. The ladder was removed and the app's strip stays visible.",
  error: "Building the ladder failed. It was removed and the app's strip stays visible.",
};

export default function RewardLadderDemo() {
  const [form, setForm] = useState<OfferForm>(DEFAULT_FORM);
  const [quantities, setQuantities] = useState<Record<string, number>>({ beans: 2, tea: 1, dripper: 0 });
  const [giftCard, setGiftCard] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [basis, setBasis] = useState<SubtotalBasis>("after_line_discounts");
  const [override, setOverride] = useState<number | null>(null);
  const [variant, setVariant] = useState<"standard" | "changed">("standard");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<EnhancerResult | null>(null);
  const [stats, setStats] = useState<EnhancerStats | null>(null);
  const [appRenders, setAppRenders] = useState(0);

  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ShadowRoot | null>(null);
  const enhancerRef = useRef<ReturnType<typeof createLadderEnhancer> | null>(null);

  const parsed: ParsedOffer = useMemo(() => parseOfferFields(form), [form]);

  const cart: CartLike = useMemo(() => {
    const items = PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0).map((p) => ({
      final_line_price: p.priceCents * quantities[p.id],
      gift_card: false,
    }));
    if (giftCard) items.push({ final_line_price: GIFT_CARD.priceCents, gift_card: true });
    const itemsTotal = items.reduce((sum, i) => sum + i.final_line_price, 0);
    return {
      items,
      items_subtotal_price: itemsTotal,
      total_price: Math.max(0, itemsTotal - (discount ? CART_DISCOUNT_CENTS : 0)),
    };
  }, [quantities, giftCard, discount]);

  const basketQualifying = qualifyingSubtotalCents(cart, { basis, excludeGiftCards: true });
  const qualifying = override ?? basketQualifying;

  const model: AppModel = useMemo(() => {
    const lines: AppLine[] = PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0).map((p) => ({
      id: p.id,
      name: p.name,
      detail: p.detail,
      qty: quantities[p.id],
      priceCents: p.priceCents,
      fixed: false,
    }));
    if (giftCard) lines.push({ id: "card", ...GIFT_CARD, qty: 1, fixed: true });
    return { lines, payableCents: cart.total_price ?? 0, qualifyingCents: qualifying, variant, drawerOpen, tick };
  }, [quantities, giftCard, cart, qualifying, variant, drawerOpen, tick]);

  // The enhancer reads the newest offer and subtotal through this ref.
  const latest = useRef<{ offer: ParsedOffer; subtotal: number }>({ offer: parsed, subtotal: qualifying });
  latest.current = { offer: parsed, subtotal: qualifying };

  const onAppClick = useCallback((event: Event) => {
    const target = (event.target as Element | null)?.closest?.("[data-line][data-delta]");
    if (!target) return;
    const id = target.getAttribute("data-line") ?? "";
    const delta = Number(target.getAttribute("data-delta"));
    setQuantities((q) => ({ ...q, [id]: Math.min(20, Math.max(0, (q[id] ?? 0) + delta)) }));
  }, []);

  // Mount: create the open ShadowRoot and start the enhancer.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    rootRef.current = root;
    root.addEventListener("click", onAppClick);
    const enhancer = createLadderEnhancer({
      document,
      ...APP_SELECTORS,
      getOffer: () => latest.current.offer,
      getSubtotalCents: () => latest.current.subtotal,
      onResult: (res, s) => {
        setResult(res);
        setStats(s);
      },
    });
    enhancerRef.current = enhancer;
    enhancer.start();
    return () => {
      enhancer.stop();
      root.removeEventListener("click", onAppClick);
      root.innerHTML = "";
      enhancerRef.current = null;
    };
  }, [onAppClick]);

  // The "app" re-renders whenever its own state changes, wiping the shadow tree.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    renderApp(root, model);
    setAppRenders((n) => n + 1);
  }, [model]);

  // Offer edits do not touch the app, so ask the enhancer to reconcile directly.
  useEffect(() => {
    enhancerRef.current?.reconcile();
  }, [parsed, qualifying]);

  const view = parsed.ok ? rewardLadderView(qualifying, parsed.config) : null;
  const setField = (key: keyof OfferForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const boundaries = parsed.ok
    ? [
        { text: "First gift minus 1 cent", cents: parsed.config.tierOneCents - 1 },
        { text: "First gift exactly", cents: parsed.config.tierOneCents },
        { text: "Shipping minus 1 cent", cents: parsed.config.shippingCents - 1 },
        { text: "Shipping exactly", cents: parsed.config.shippingCents },
        { text: "Bonus minus 1 cent", cents: parsed.config.tierTwoCents - 1 },
        { text: "Bonus exactly", cents: parsed.config.tierTwoCents },
      ]
    : [];

  const statusKey = result?.status ?? "no-drawer";
  const reason = result && "reason" in result ? ` (${result.reason})` : "";

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem 1.5rem", minHeight: "100vh" }}>
      <Link href="/" style={{ color: "#dfbd8d" }}>← Back to portfolio</Link>
      <span style={{ color: "#81838a" }}> | </span>
      <Link href="/reward-ladder-plan" style={{ color: "#dfbd8d" }}>Read the plan</Link>
      <span style={{ color: "#81838a" }}> | </span>
      <Link href="/reward-ladder-mockup" style={{ color: "#dfbd8d" }}>Design mockup</Link>
      <p style={{ color: "#dfbd8d", marginTop: "2.5rem", letterSpacing: 2 }}>INTERACTIVE ENGINEERING DEMO</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.15, margin: "1rem 0" }}>Reward ladder for an app-owned cart</h1>
      <p style={{ ...muted, maxWidth: 760 }}>
        The cart on the right is a fictional third-party app rendered inside an open Shadow DOM. The ladder is an enhancement layered on top: it reads offer fields, mounts once, survives the app re-rendering, and gets out of the way when anything is wrong. Edit the offer, change the basket, then break the app on purpose. All values are fictional and nothing connects to a store.
      </p>

      {/* Cap the minimum track at the available width so phone-sized viewports
          keep the controls and Shadow DOM cart inside the page padding. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24, marginTop: 28, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 20 }}>
          <section style={box}>
            <h2 style={{ fontSize: 20 }}>1. Offer fields</h2>
            <p style={muted}>What a store would publish as configuration. Clear a field to see the ladder fail closed.</p>
            <label style={{ ...label, marginTop: 12 }}>
              <input type="checkbox" checked={form.rewards_enabled} onChange={setField("rewards_enabled")} /> Rewards enabled
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
              <div><label htmlFor="t1" style={label}>First gift ($)</label><input id="t1" inputMode="numeric" style={input} value={form.gift_one_threshold} onChange={setField("gift_one_threshold")} /></div>
              <div><label htmlFor="t2" style={label}>Shipping ($)</label><input id="t2" inputMode="numeric" style={input} value={form.shipping_threshold} onChange={setField("shipping_threshold")} /></div>
              <div><label htmlFor="t3" style={label}>Bonus ($)</label><input id="t3" inputMode="numeric" style={input} value={form.gift_two_threshold} onChange={setField("gift_two_threshold")} /></div>
            </div>
            <label htmlFor="g1" style={{ ...label, marginTop: 12 }}>First gift label</label>
            <input id="g1" style={input} value={form.gift_one_label} onChange={setField("gift_one_label")} />
            <label htmlFor="g2" style={{ ...label, marginTop: 12 }}>Bonus gift label</label>
            <input id="g2" style={input} value={form.gift_two_label} onChange={setField("gift_two_label")} />
            <label htmlFor="terms" style={{ ...label, marginTop: 12 }}>Terms line</label>
            <input id="terms" style={input} value={form.terms} onChange={setField("terms")} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              <button type="button" style={button} onClick={() => setForm(DEFAULT_FORM)}>Reset offer</button>
              <button type="button" style={button} onClick={() => setForm({ ...DEFAULT_FORM, gift_one_threshold: "125", shipping_threshold: "175", gift_two_threshold: "275", gift_one_label: "Free Sample Tea Tin (100g)" })}>Change the offer</button>
              <button type="button" style={button} onClick={() => setForm({ ...DEFAULT_FORM, gift_one_label: "" })}>Blank a label</button>
              <button type="button" style={button} onClick={() => setForm({ ...DEFAULT_FORM, rewards_enabled: false })}>Switch offer off</button>
            </div>
          </section>

          <section style={box}>
            <h2 style={{ fontSize: 20 }}>2. What counts toward qualification</h2>
            <p style={muted}>One function decides the basis. It should match whatever rule the fulfilment automation really uses.</p>
            <label htmlFor="basis" style={{ ...label, marginTop: 12 }}>Subtotal basis</label>
            <select id="basis" style={input} value={basis} onChange={(e) => setBasis(e.target.value as SubtotalBasis)}>
              {SUBTOTAL_BASES.map((b) => <option key={b} value={b}>{b === "after_line_discounts" ? "After line discounts" : "After all discounts"}</option>)}
            </select>
            <label style={{ ...label, marginTop: 12 }}><input type="checkbox" checked={discount} onChange={(e) => setDiscount(e.target.checked)} /> Cart discount code ({formatCents(CART_DISCOUNT_CENTS)} off)</label>
            <label style={{ ...label, marginTop: 8 }}><input type="checkbox" checked={giftCard} onChange={(e) => setGiftCard(e.target.checked)} /> Add a gift card line ({formatCents(GIFT_CARD.priceCents)}, excluded from qualification)</label>
            <p style={{ marginTop: 14 }}>Qualifying subtotal: <strong>{formatCents(basketQualifying)}</strong>{override !== null && <span style={muted}> (overridden below)</span>}</p>
            <p style={{ ...muted, fontSize: 13, marginBottom: 6 }}>Boundary testing, in exact cents:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {boundaries.map((b) => <button key={b.text} type="button" style={button} onClick={() => setOverride(b.cents)}>{b.text}</button>)}
              <button type="button" style={{ ...button, color: "white" }} onClick={() => setOverride(null)} disabled={override === null}>Use the basket</button>
            </div>
          </section>

          <section style={box}>
            <h2 style={{ fontSize: 20 }}>3. Break the app</h2>
            <p style={muted}>These simulate what a third-party app does without warning.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <button type="button" style={button} onClick={() => setTick((n) => n + 1)}>Re-render the app drawer</button>
              <button type="button" style={button} onClick={() => setVariant((v) => (v === "standard" ? "changed" : "standard"))}>{variant === "standard" ? "Change the app markup" : "Restore the app markup"}</button>
              <button type="button" style={button} onClick={() => setDrawerOpen((o) => !o)}>{drawerOpen ? "Close the drawer" : "Open the drawer"}</button>
            </div>
          </section>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <section style={{ ...box, padding: 16 }} aria-label="Simulated app cart">
            <p style={{ ...muted, fontSize: 13, margin: "0 0 10px" }}>Simulated app cart (open Shadow DOM)</p>
            <div ref={hostRef} id="demo-app-host" style={{ maxWidth: 390, margin: "0 auto", minHeight: 80 }} />
          </section>

          <section style={box} aria-live="polite">
            <h2 style={{ fontSize: 20 }}>Enhancer status</h2>
            <p style={{ margin: "8px 0" }}><strong>{statusKey}</strong>{reason}</p>
            <p style={muted}>{STATUS_COPY[statusKey]}</p>
            <ul style={{ ...muted, fontSize: 14, paddingLeft: 18, marginTop: 10 }}>
              <li>Ladders in the cart: <strong style={{ color: "white" }}>{result?.status === "mounted" ? result.roots : 0}</strong> (never more than one)</li>
              <li>Times mounted: {stats?.mounts ?? 0}, updated in place: {stats?.updates ?? 0}, removed: {stats?.teardowns ?? 0}</li>
              <li>App renders so far: {appRenders}</li>
            </ul>
          </section>

          <section style={box}>
            <h2 style={{ fontSize: 20 }}>Inspector</h2>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#bbc0c7", margin: "10px 0 0" }}>{JSON.stringify(
              parsed.ok && view
                ? { offer: "valid", qualifyingCents: qualifying, stage: view.stage, remaining: formatCents(view.remainingCents), fillPercent: view.fillPercent, headline: view.headline }
                : { offer: "rejected", reason: parsed.ok ? null : parsed.reason, rendered: false },
              null,
              2,
            )}</pre>
          </section>
        </div>
      </div>

      <section style={{ marginTop: 32 }}>
        <h2>How it works</h2>
        <ul style={{ ...muted, lineHeight: 1.7 }}>
          <li><strong style={{ color: "white" }}>Fail closed on data.</strong> A disabled, blank, or malformed offer renders nothing. There are no fallback amounts or gift names.</li>
          <li><strong style={{ color: "white" }}>Fail open on structure.</strong> The app&apos;s own strip is hidden only after the ladder is in place, and restored whenever the ladder is removed.</li>
          <li><strong style={{ color: "white" }}>Exact qualification, equal-segment visuals.</strong> Milestones use real thresholds in cents. The bar is drawn in equal thirds and never touches an unreached marker.</li>
          <li><strong style={{ color: "white" }}>Idempotent mount.</strong> Re-renders, repeated reconciles and stray duplicates all converge on exactly one ladder.</li>
        </ul>
        <p style={{ ...muted, marginTop: 16 }}>Illustration only. A production version needs the vendor&apos;s supported extension surface where one exists, accessibility testing on real devices, and a subtotal basis verified against the rule that actually grants rewards.</p>
        {/* This release stays on its reviewed feature branch while the PR is
            unmerged, so its public source link must follow that same branch. */}
        <a href="https://github.com/bonvallite/developer-portfolio/tree/feature/reward-ladder-demo/lib" target="_blank" rel="noopener noreferrer" style={{ color: "#dfbd8d" }}>View source on GitHub ↗</a>
      </section>
    </main>
  );
}
