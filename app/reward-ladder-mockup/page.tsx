"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { DEMO_OFFER_FIELDS, formatCents, parseOfferFields, rewardLadderView } from "../../lib/reward-ladder.mjs";
import type { OfferFields } from "../../lib/reward-ladder.mjs";
import { LADDER_CSS, renderLadder } from "../../lib/reward-ladder-mount.mjs";
import { APP_NATIVE_FREE_SHIPPING_CENTS } from "../../lib/reward-ladder-demo-app.mjs";
import { MOCK_PRODUCTS, MOCK_SCENARIOS, MOCK_SPEC, basketCents, scenarioQuantities } from "../../lib/reward-ladder-mockup.mjs";

// An interactive version of the reward ladder design mockup. Every shop, product,
// price, and offer value is fictional. The ladder itself is drawn by the same
// renderer the enhancer uses, so the mockup shows the real component, not a copy.

const OFFERS: { id: string; label: string; fields: OfferFields }[] = [
  { id: "default", label: "Example offer", fields: DEMO_OFFER_FIELDS },
  {
    id: "changed",
    label: "Change the offer",
    fields: { ...DEMO_OFFER_FIELDS, gift_one_threshold: 125, shipping_threshold: 175, gift_two_threshold: 275, gift_one_label: "Free Sample Tea Tin (100g)" },
  },
];
const WIDTHS = [360, 390, 480];

const box: CSSProperties = { border: "1px solid #4c4f55", borderRadius: 14, padding: 18 };
const muted: CSSProperties = { color: "#bbc0c7" };
const pill = (active: boolean): CSSProperties => ({
  padding: "9px 12px",
  borderRadius: 8,
  background: active ? "#e3bf8a" : "#171b20",
  color: active ? "#17120e" : "#e3bf8a",
  border: "1px solid #b18b5d",
  cursor: "pointer",
  font: "inherit",
  fontSize: 13,
  fontWeight: active ? 700 : 400,
});

export default function RewardLadderMockup() {
  const [mode, setMode] = useState<"proposed" | "today">("proposed");
  const [quantities, setQuantities] = useState<Record<string, number>>(scenarioQuantities("A"));
  const [scenario, setScenario] = useState<string | null>("A");
  const [override, setOverride] = useState<number | null>(null);
  const [width, setWidth] = useState(390);
  const [offerId, setOfferId] = useState("default");
  const [enabled, setEnabled] = useState(true);
  const [part, setPart] = useState<string | null>(null);

  const ladderRef = useRef<HTMLDivElement>(null);

  const fields = useMemo<OfferFields>(() => {
    const base = OFFERS.find((o) => o.id === offerId)?.fields ?? DEMO_OFFER_FIELDS;
    return { ...base, rewards_enabled: enabled };
  }, [offerId, enabled]);
  const parsed = useMemo(() => parseOfferFields(fields), [fields]);
  const config = parsed.ok ? parsed.config : null;

  const basket = basketCents(quantities);
  const subtotal = override ?? basket;
  const view = useMemo(() => (config ? rewardLadderView(subtotal, config) : null), [config, subtotal]);
  const showLadder = mode === "proposed" && view !== null && config !== null;

  // Draw the real component into the drawer whenever its inputs change.
  useEffect(() => {
    const container = ladderRef.current;
    if (!container) return;
    if (showLadder && view && config) container.replaceChildren(renderLadder(document, view, config.terms));
    else container.replaceChildren();
  }, [showLadder, view, config]);

  const spec = MOCK_SPEC.find((s) => s.id === part) ?? null;
  const highlight = spec ? `[data-reward-ladder] ${spec.selector}{outline:2px dashed #e3bf8a;outline-offset:3px}` : "";

  const items = MOCK_PRODUCTS.filter((p) => (quantities[p.id] ?? 0) > 0);
  const count = items.reduce((sum, p) => sum + quantities[p.id], 0);
  const maxDollars = config ? Math.ceil(config.tierTwoCents / 100) + 50 : 300;

  const nativeRemaining = Math.max(APP_NATIVE_FREE_SHIPPING_CENTS - subtotal, 0);
  const nativeFill = Math.min((subtotal / APP_NATIVE_FREE_SHIPPING_CENTS) * 100, 100);

  const pickScenario = (id: string) => {
    setQuantities(scenarioQuantities(id));
    setScenario(id);
    setOverride(null);
  };
  const changeQty = (id: string, delta: number) => {
    setQuantities((q) => ({ ...q, [id]: Math.min(20, Math.max(0, (q[id] ?? 0) + delta)) }));
    setScenario(null);
    setOverride(null);
  };

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem 1.5rem", minHeight: "100vh" }}>
      <style>{LADDER_CSS}</style>
      <style>{highlight}</style>
      <Link href="/" style={{ color: "#dfbd8d" }}>← Back to portfolio</Link>
      <span style={{ color: "#81838a" }}> | </span>
      <Link href="/reward-ladder-plan" style={{ color: "#dfbd8d" }}>Read the plan</Link>
      <span style={{ color: "#81838a" }}> | </span>
      <Link href="/reward-ladder-demo" style={{ color: "#dfbd8d" }}>Interactive demo</Link>
      <p style={{ color: "#dfbd8d", marginTop: "2.5rem", letterSpacing: 2 }}>INTERACTIVE DESIGN MOCKUP</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.15, margin: "1rem 0" }}>The reward ladder, as designed</h1>
      <p style={{ ...muted, maxWidth: 760 }}>
        Step through the five design states, scrub the subtotal, switch between today&apos;s shipping-only strip and the proposed ladder, and click a design note to highlight that part. The ladder is drawn by the same renderer as the working component. Shop, products, and offer are fictional.
      </p>

      {/* The cart widths are upper bounds; narrow phones must still fit both
          grid tracks within the page padding rather than clip the preview. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 24, marginTop: 28, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 18 }}>
          <section style={box} aria-labelledby="states-h">
            <h2 id="states-h" style={{ fontSize: 19, margin: 0 }}>Design states</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {MOCK_SCENARIOS.map((s) => (
                <button key={s.id} type="button" style={pill(scenario === s.id)} aria-pressed={scenario === s.id} onClick={() => pickScenario(s.id)}>
                  {s.id}. {s.title}
                </button>
              ))}
            </div>
            <p style={{ ...muted, fontSize: 13, margin: "12px 0 0", minHeight: 20 }}>
              {MOCK_SCENARIOS.find((s) => s.id === scenario)?.note ?? "Custom basket. Use the steppers in the cart or the scrubber below."}
            </p>
          </section>

          <section style={box} aria-labelledby="view-h">
            <h2 id="view-h" style={{ fontSize: 19, margin: 0 }}>View</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <button type="button" style={pill(mode === "today")} aria-pressed={mode === "today"} onClick={() => setMode("today")}>Today: shipping only</button>
              <button type="button" style={pill(mode === "proposed")} aria-pressed={mode === "proposed"} onClick={() => setMode("proposed")}>Proposed: reward ladder</button>
            </div>
            <label htmlFor="scrub" style={{ display: "block", marginTop: 16, fontSize: 13, ...muted }}>
              Qualifying subtotal: <strong style={{ color: "white" }}>{formatCents(subtotal)}</strong>{override !== null && " (scrubbed)"}
            </label>
            <input
              id="scrub"
              type="range"
              min={0}
              max={maxDollars}
              step={1}
              value={Math.min(maxDollars, Math.round(subtotal / 100))}
              onChange={(e) => { setOverride(Number(e.target.value) * 100); setScenario(null); }}
              style={{ width: "100%", marginTop: 8 }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {WIDTHS.map((w) => <button key={w} type="button" style={pill(width === w)} aria-pressed={width === w} onClick={() => setWidth(w)}>{w}px</button>)}
              <button type="button" style={pill(false)} onClick={() => setOverride(null)} disabled={override === null}>Use the basket</button>
            </div>
          </section>

          <section style={box} aria-labelledby="offer-h">
            <h2 id="offer-h" style={{ fontSize: 19, margin: 0 }}>The offer is configuration</h2>
            <p style={{ ...muted, fontSize: 13, margin: "8px 0 0" }}>Change the offer and every threshold, label, and message follows with no code change. Switch it off and the ladder disappears.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {OFFERS.map((o) => <button key={o.id} type="button" style={pill(offerId === o.id)} aria-pressed={offerId === o.id} onClick={() => setOfferId(o.id)}>{o.label}</button>)}
            </div>
            <label style={{ display: "block", marginTop: 12, fontSize: 13, ...muted }}>
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Rewards enabled
            </label>
          </section>

          <section style={box} aria-labelledby="spec-h">
            <h2 id="spec-h" style={{ fontSize: 19, margin: 0 }}>Design notes</h2>
            <p style={{ ...muted, fontSize: 13, margin: "8px 0 0" }}>Pick a part to highlight it in the cart.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {MOCK_SPEC.map((s) => <button key={s.id} type="button" style={pill(part === s.id)} aria-pressed={part === s.id} onClick={() => setPart(part === s.id ? null : s.id)}>{s.label}</button>)}
            </div>
            <p style={{ ...muted, fontSize: 14, lineHeight: 1.7, margin: "12px 0 0", minHeight: 48 }}>{spec ? spec.detail : "Nothing selected."}</p>
          </section>
        </div>

        <section aria-label="Mockup cart" style={{ background: "#e9e5dc", borderRadius: 14, padding: 24, display: "flex", justifyContent: "center", position: "sticky", top: 16 }}>
          <div style={{ width, maxWidth: "100%", background: "#fff", color: "#1f1b14", border: "1px solid #d9d2c0", borderRadius: 12, overflow: "hidden", font: "14px/1.4 system-ui, sans-serif", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 10px 20px", borderBottom: "1px solid #e8e2d4" }}>
              <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 22, letterSpacing: "0.03em", textTransform: "uppercase" }}>Your cart ({count})</h2>
              <button type="button" aria-label="Close cart" style={{ width: 44, height: 44, border: 0, background: "transparent", fontSize: 20, cursor: "pointer", color: "#1f1b14" }}>×</button>
            </div>

            {mode === "today" || !showLadder ? (
              <div style={{ padding: "12px 16px 12px", borderBottom: "1px solid #e8e2d4" }}>
                <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: "#4a4437" }}>
                  {nativeRemaining > 0 ? <>Spend <b>{formatCents(nativeRemaining)}</b> more for <b>FREE SHIPPING</b></> : <b>You have free shipping</b>}
                </p>
                <div style={{ height: 6, marginTop: 10, borderRadius: 3, background: "#ddd6c6", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${nativeFill}%`, background: "#947a41" }} />
                </div>
                {mode === "proposed" && !showLadder && (
                  <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 12, color: "#5f564a" }}>
                    The offer is off or invalid, so the ladder does not render and the app&apos;s own strip stays.
                  </p>
                )}
              </div>
            ) : null}
            <div ref={ladderRef} />

            <ul style={{ listStyle: "none", margin: 0, padding: "10px 20px 0" }}>
              {items.length === 0 && <li style={{ padding: "18px 0", color: "#5f564a" }}>Your cart is empty.</li>}
              {items.map((p) => (
                <li key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee8da" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: 13 }}>{p.name}</strong>
                    <span style={{ fontSize: 12, color: "#5f564a" }}>{p.detail}</span>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cfc7b3", borderRadius: 8 }}>
                    <button type="button" aria-label={`Decrease ${p.name}`} onClick={() => changeQty(p.id, -1)} style={{ width: 36, height: 36, border: 0, background: "transparent", fontSize: 16, cursor: "pointer", color: "#1f1b14" }}>−</button>
                    <span style={{ minWidth: 22, textAlign: "center" }}>{quantities[p.id]}</span>
                    <button type="button" aria-label={`Increase ${p.name}`} onClick={() => changeQty(p.id, 1)} style={{ width: 36, height: 36, border: 0, background: "transparent", fontSize: 16, cursor: "pointer", color: "#1f1b14" }}>+</button>
                  </div>
                  <span style={{ fontWeight: 600, minWidth: 62, textAlign: "right" }}>{formatCents(p.priceCents * quantities[p.id])}</span>
                </li>
              ))}
            </ul>

            <div style={{ padding: "14px 20px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                <span>Subtotal</span><span>{formatCents(basket)}</span>
              </div>
              {override !== null && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#5f564a" }}>Previewing a qualifying subtotal of {formatCents(override)}.</p>}
              <button type="button" style={{ width: "100%", height: 46, marginTop: 12, border: 0, borderRadius: 8, background: "#86703a", color: "#fff", font: "700 14px system-ui, sans-serif" }}>Checkout</button>
            </div>
          </div>
        </section>
      </div>

      <p style={{ ...muted, fontSize: 13, marginTop: 28, maxWidth: 820 }}>
        A mockup shows intent. It does not grant rewards, and the working behaviour (re-renders, anchor loss, fail-open and fail-closed rules) is in the <Link href="/reward-ladder-demo" style={{ color: "#dfbd8d" }}>interactive demo</Link>. Shop, products, prices, and offer are fictional.
      </p>
    </main>
  );
}
