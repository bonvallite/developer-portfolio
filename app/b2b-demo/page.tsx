"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateBasket, DEMO_PRODUCTS, DEMO_TIERS } from "../../lib/b2b-simulator.mjs";

const money = (cents: number) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);

export default function B2BDemo() {
  const [quantities, setQuantities] = useState<Record<string, number>>({ "sample-a": 2, "sample-b": 1, "sample-c": 0 });
  const result = useMemo(() => calculateBasket(DEMO_PRODUCTS.map(p => ({ id: p.id, quantity: quantities[p.id] ?? 0 }))), [quantities]);
  return <main style={{ maxWidth: 980, margin: "0 auto", padding: "3rem 1.5rem", minHeight: "100vh" }}>
    <Link href="/" style={{ color: "#dfbd8d" }}>← Back to portfolio</Link>
    <p style={{ color: "#dfbd8d", marginTop: "2.5rem", letterSpacing: 2 }}>INTERACTIVE ENGINEERING DEMO</p>
    <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.15, margin: "1rem 0" }}>B2B weight-based pricing</h1>
    <p style={{ color: "#bbc0c7", maxWidth: 700 }}>Change quantities to see how an order-level weight threshold determines a volume discount. All products, prices and thresholds are fictional. No account, checkout, or live Shopify connection is used.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 30 }}>
      {DEMO_PRODUCTS.map(p => <section key={p.id} style={{ border: "1px solid #4c4f55", padding: 22, borderRadius: 14 }}>
        <h2 style={{ fontSize: 20 }}>{p.title}</h2>
        <p>{p.weightGrams / 1000} kg / unit · {money(p.priceCents)}</p>
        <label htmlFor={p.id}>Quantity</label>
        <input id={p.id} type="number" min={0} max={10000} step={1} value={quantities[p.id] ?? 0}
          onChange={e => { const v = Number(e.target.value); setQuantities(prev => ({ ...prev, [p.id]: Number.isSafeInteger(v) && v >= 0 ? Math.min(v, 10000) : 0 })); }}
          style={{ display: "block", width: "100%", padding: 12, marginTop: 8, borderRadius: 8, background: "#171b20", color: "white", border: "1px solid #81838a" }}/>
      </section>)}
    </div>
    <section aria-live="polite" style={{ border: "1px solid #b18b5d", borderRadius: 16, padding: 26, marginTop: 30 }}>
      <h2>Order summary</h2>
      <p>Total order weight: <strong>{(result.weightGrams / 1000).toFixed(2)} kg</strong></p>
      <p>Current pricing tier: <strong>{result.tier.name} ({result.tier.discountBps / 100}% off)</strong></p>
      <p>Subtotal: {money(result.subtotalCents)}</p><p>Volume saving: {money(result.savingsCents)}</p>
      <p style={{ fontSize: 30, color: "#e3bf8a" }}>Total: {money(result.totalCents)}</p>
      <p>{result.nextTier ? `Add ${(result.remainingGrams / 1000).toFixed(2)} kg to reach ${result.nextTier.name}.` : "Highest fictional tier reached."}</p>
    </section>
    <section style={{ marginTop: 28 }}>
      <h2>Fictional volume tiers</h2>
      <ul>{DEMO_TIERS.map(t => <li key={t.name}>{t.minimumGrams / 1000} kg+: {t.discountBps / 100}% off</li>)}</ul>
      <p style={{ color: "#bbc0c7", marginTop: 20 }}>Illustration only. Real Shopify B2B pricing requires server-side enforcement, customer eligibility checks and platform-supported catalogue or discount configuration.</p>
      <a href="https://github.com/bonvallite/developer-portfolio/tree/main/lib" target="_blank" rel="noreferrer" style={{ color: "#dfbd8d" }}>View source on GitHub ↗</a>
    </section>
  </main>;
}
