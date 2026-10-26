"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateBasket, DEMO_PRODUCTS, DEMO_TIERS } from "../../lib/b2b-simulator.mjs";

// Public-safe portfolio model of a multi-segment Shopify B2B architecture.
// Segment names describe the commercial pattern; products, prices and pricing
// thresholds in the interactive calculator are fictional and independent.
const SEGMENTS = [
  {
    name: "Retail",
    label: "Consumer market",
    audience: "Direct-to-consumer shoppers",
    catalogue: "Retail catalogue",
    storefront: "Retail storefront context",
    solution: "Consumer product range, retail promotions and checkout, with wholesale-only products excluded from the retail market."
  },
  {
    name: "Wholesale Entry",
    label: "B2B market",
    audience: "Smaller venues and new trade accounts",
    catalogue: "Entry catalogue",
    storefront: "Wholesale Entry context",
    solution: "Trade-ready assortment and business pricing for lower-volume buyers without exposing B2B-only products to retail."
  },
  {
    name: "Wholesale Growth",
    label: "B2B market",
    audience: "Growing hospitality and trade businesses",
    catalogue: "Growth catalogue",
    storefront: "Wholesale Growth context",
    solution: "Expanded wholesale product access, segment-specific merchandising and business rules for growing accounts."
  },
  {
    name: "Wholesale Premium",
    label: "B2B market",
    audience: "High-volume and strategic buyers",
    catalogue: "Premium catalogue",
    storefront: "Wholesale Premium context",
    solution: "Premium account treatment, tailored catalogue access and higher-volume commercial workflows."
  }
] as const;

const ARCHITECTURE = [
  "Customer or company login",
  "Company location eligibility",
  "Shopify Market context",
  "Segment catalogue",
  "Contextual storefront",
  "Pricing, Flow and checkout rules"
] as const;

const money = (cents: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);

export default function B2BDemo() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "sample-a": 2,
    "sample-b": 1,
    "sample-c": 0
  });

  const result = useMemo(
    () =>
      calculateBasket(
        DEMO_PRODUCTS.map((product) => ({
          id: product.id,
          quantity: quantities[product.id] ?? 0
        }))
      ),
    [quantities]
  );

  const cardStyle = {
    border: "1px solid #4c4f55",
    padding: 22,
    borderRadius: 14,
    background: "#11151a"
  } as const;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 5rem", minHeight: "100vh" }}>
      <Link href="/" style={{ color: "#dfbd8d" }}>← Back to portfolio</Link>

      <p style={{ color: "#dfbd8d", marginTop: "2.5rem", letterSpacing: 2 }}>SHOPIFY B2B / MULTI-SEGMENT COMMERCE</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)", lineHeight: 1.08, margin: "1rem 0" }}>
        B2B architecture built for different business segments.
      </h1>
      <p style={{ color: "#bbc0c7", maxWidth: 820, fontSize: 18, lineHeight: 1.7 }}>
        A single Shopify store can serve very different audiences when Markets, catalogues, company-location eligibility,
        contextual storefronts and business rules are designed as one system. This public-safe case study shows the pattern
        across Retail, Wholesale Entry, Growth and Premium experiences without exposing live customer data or private pricing.
      </p>

      <section style={{ marginTop: 44 }}>
        <p style={{ color: "#dfbd8d", letterSpacing: 1.5 }}>MARKET SEGMENTATION</p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", marginBottom: 20 }}>One commerce ecosystem, multiple business solutions.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))", gap: 16 }}>
          {SEGMENTS.map((segment) => (
            <article key={segment.name} style={cardStyle}>
              <p style={{ color: "#dfbd8d", margin: 0, fontSize: 13, letterSpacing: 1.2 }}>{segment.label.toUpperCase()}</p>
              <h3 style={{ fontSize: 22, margin: "10px 0 14px" }}>{segment.name}</h3>
              <p><strong>Audience:</strong> {segment.audience}</p>
              <p><strong>Access:</strong> {segment.catalogue}</p>
              <p><strong>Front end:</strong> {segment.storefront}</p>
              <p style={{ color: "#bbc0c7", lineHeight: 1.6 }}>{segment.solution}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 44 }}>
        <p style={{ color: "#dfbd8d", letterSpacing: 1.5 }}>ARCHITECTURE</p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}>How the buyer context resolves.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 20 }}>
          {ARCHITECTURE.map((layer, index) => (
            <div key={layer} style={{ ...cardStyle, padding: 18, minHeight: 118 }}>
              <span style={{ color: "#dfbd8d", fontSize: 12 }}>0{index + 1}</span>
              <p style={{ marginBottom: 0, lineHeight: 1.5 }}><strong>{layer}</strong></p>
            </div>
          ))}
        </div>
        <p style={{ color: "#bbc0c7", marginTop: 18, lineHeight: 1.7 }}>
          The important design decision is separation of concerns: the Online Store channel can support authenticated B2B discovery,
          while the Retail market catalogue remains the gatekeeper for what a retail shopper can actually access. Wholesale catalogues
          then determine the products and commercial context available to each eligible company location.
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <p style={{ color: "#dfbd8d", letterSpacing: 1.5 }}>BUSINESS VALUE</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          <article style={cardStyle}>
            <h3>Segment-specific merchandising</h3>
            <p style={{ color: "#bbc0c7", lineHeight: 1.6 }}>Different buyers can receive different product ranges, navigation emphasis and account messaging without maintaining separate stores.</p>
          </article>
          <article style={cardStyle}>
            <h3>Controlled product visibility</h3>
            <p style={{ color: "#bbc0c7", lineHeight: 1.6 }}>Wholesale-only products can be made discoverable for B2B buyers while remaining unavailable in the retail market context.</p>
          </article>
          <article style={cardStyle}>
            <h3>Commercial rules by audience</h3>
            <p style={{ color: "#bbc0c7", lineHeight: 1.6 }}>Catalogue pricing, eligibility, order-weight logic, payment terms and automation can be layered according to the business segment.</p>
          </article>
        </div>
      </section>

      <section style={{ marginTop: 54, borderTop: "1px solid #353a40", paddingTop: 42 }}>
        <p style={{ color: "#dfbd8d", letterSpacing: 1.5 }}>INTERACTIVE RULE DEMO</p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}>One rule inside the wider architecture: order-weight pricing.</h2>
        <p style={{ color: "#bbc0c7", maxWidth: 760, lineHeight: 1.7 }}>
          Change quantities to see how a fictional order-level weight threshold can determine a volume discount.
          All products, prices and thresholds below are synthetic. No account, checkout or live Shopify connection is used.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 30 }}>
          {DEMO_PRODUCTS.map((product) => (
            <section key={product.id} style={cardStyle}>
              <h3 style={{ fontSize: 20 }}>{product.title}</h3>
              <p>{product.weightGrams / 1000} kg / unit · {money(product.priceCents)}</p>
              <label htmlFor={product.id}>Quantity</label>
              <input
                id={product.id}
                type="number"
                min={0}
                max={10000}
                step={1}
                value={quantities[product.id] ?? 0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setQuantities((previous) => ({
                    ...previous,
                    [product.id]: Number.isSafeInteger(value) && value >= 0 ? Math.min(value, 10000) : 0
                  }));
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                  borderRadius: 8,
                  background: "#171b20",
                  color: "white",
                  border: "1px solid #81838a"
                }}
              />
            </section>
          ))}
        </div>

        <section aria-live="polite" style={{ border: "1px solid #b18b5d", borderRadius: 16, padding: 26, marginTop: 30 }}>
          <h3>Order summary</h3>
          <p>Total order weight: <strong>{(result.weightGrams / 1000).toFixed(2)} kg</strong></p>
          <p>Current pricing tier: <strong>{result.tier.name} ({result.tier.discountBps / 100}% off)</strong></p>
          <p>Subtotal: {money(result.subtotalCents)}</p>
          <p>Volume saving: {money(result.savingsCents)}</p>
          <p style={{ fontSize: 30, color: "#e3bf8a" }}>Total: {money(result.totalCents)}</p>
          <p>{result.nextTier ? `Add ${(result.remainingGrams / 1000).toFixed(2)} kg to reach ${result.nextTier.name}.` : "Highest fictional tier reached."}</p>
        </section>

        <div style={{ marginTop: 28 }}>
          <h3>Fictional volume tiers</h3>
          <ul>{DEMO_TIERS.map((tier) => <li key={tier.name}>{tier.minimumGrams / 1000} kg+: {tier.discountBps / 100}% off</li>)}</ul>
        </div>
      </section>

      <section style={{ marginTop: 44, paddingTop: 28, borderTop: "1px solid #353a40" }}>
        <h2>Public portfolio boundary</h2>
        <p style={{ color: "#bbc0c7", lineHeight: 1.7 }}>
          This page demonstrates the architecture and engineering approach, not a client export. Real company assignments,
          catalogue membership, discount values, payment terms, product records, customer data and employer-owned code are excluded.
          Production B2B pricing and checkout behaviour require platform-authorised server-side controls and account eligibility checks.
        </p>
        <a
          href="https://github.com/bonvallite/developer-portfolio/blob/main/B2B_DEMO.md"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#dfbd8d" }}
        >
          Read the architecture notes on GitHub ↗
        </a>
      </section>
    </main>
  );
}
