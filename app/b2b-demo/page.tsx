"use client";
// Public educational pricing simulator, not a live Shopify implementation.
// Its static explanation is server-rendered with the interactive interface so
// visitors and crawlers understand the fictional thresholds and calculation.
// Tier logic and validation remain in lib/b2b-simulator.mjs.
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
    <section aria-labelledby="how-b2b-demo-works" style={{ marginTop: 36, border: "1px solid #4c4f55", borderRadius: 16, padding: 26 }}>
      <h2 id="how-b2b-demo-works">How the weight-based calculation works</h2>
      <p style={{ color: "#bbc0c7", lineHeight: 1.75 }}>This small simulator makes the pricing decision transparent. Instead of discounting a single product independently, it combines the weight of every selected demo line. Each unit has a fictional weight and price; increasing quantities changes the total qualifying weight and the pre-discount basket subtotal.</p>
      <ol style={{ lineHeight: 1.8, paddingLeft: 24 }}>
        <li><strong>Calculate the basket.</strong> Multiply each sample product&apos;s weight and price by its quantity, then add the results. Weight is calculated in whole grams and prices in integer Australian cents to avoid avoidable floating-point errors.</li>
        <li><strong>Find the eligible tier.</strong> Select the highest fictional threshold the combined weight reaches. Below 5 kg, the standard tier has no discount. At 5 kg, 10 kg or 20 kg, the example applies 5%, 10% or 15% respectively to the basket subtotal.</li>
        <li><strong>Explain the result.</strong> Calculate the saving, round to the nearest cent, subtract it from the subtotal and show how much extra weight is needed to reach the next tier.</li>
      </ol>
      <p style={{ color: "#bbc0c7", lineHeight: 1.75 }}><strong>Worked example:</strong> Four units of Demo Cut A (0.75 kg each) and two units of Demo Cut B (1.2 kg each) weigh 5.4 kg together. Their fictional subtotal is $172.00. At the 5 kg tier, a 5% saving of $8.60 gives a total of $163.40. Change the inputs above to see the same calculation update instantly.</p>
    </section>
    <section aria-labelledby="b2b-demo-production-limits" style={{ marginTop: 30 }}>
      <h2 id="b2b-demo-production-limits">What a real Shopify B2B build needs</h2>
      <p style={{ color: "#bbc0c7", lineHeight: 1.75 }}>The page deliberately stops at a testable calculation. A production wholesale implementation must also verify the purchasing company, customer eligibility, approved catalogue and pricing context, product exclusions, stock and quantities, and where discounts are enforced. A visual estimate alone must not be treated as the final checkout price.</p>
      <p style={{ color: "#bbc0c7", lineHeight: 1.75 }}>This independent example does not connect to Shopify, change a customer's basket, reserve inventory or create an order. It does not model freight, taxes, subscription pricing or individual contract terms. For a separate architectural discussion of platform-native B2B company purchasing, Markets and Catalogues, see the <Link href="/b2b-modernisation" style={{ color: "#dfbd8d", textDecoration: "underline" }}>B2B modernisation case study</Link>. The two demonstrations illustrate related concepts, not an identical production pricing rule.</p>
    </section>
    <section style={{ marginTop: 28 }}>
      <h2>Fictional volume tiers</h2>
      <ul>{DEMO_TIERS.map(t => <li key={t.name}>{t.minimumGrams / 1000} kg+: {t.discountBps / 100}% off</li>)}</ul>
      <p style={{ color: "#bbc0c7", marginTop: 20 }}>Illustration only. Real Shopify B2B pricing requires server-side enforcement, customer eligibility checks and platform-supported catalogue or discount configuration.</p>
      <a href="https://github.com/bonvallite/developer-portfolio/tree/main/lib" target="_blank" rel="noreferrer" style={{ color: "#dfbd8d" }}>View source on GitHub ↗</a>
    </section>
  </main>;
}
