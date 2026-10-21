import Link from 'next/link';

export const metadata = {
  title: 'Cold-chain shipping and subscription checkout | Developer portfolio',
  description: 'A public-safe engineering case study on coordinating Shopify shipping rules, Recharge subscriptions and Zapiet zone rates.',
};

export default function ShippingIntegrationCaseStudy() {
  return <main className="container" style={{maxWidth:900,paddingTop:72,paddingBottom:100}}>
    <Link href="/" style={{textDecoration:'underline'}}>← Back to portfolio</Link>
    <p className="overline" style={{marginTop:48}}>ENGINEERING CASE STUDY / SHOPIFY INTEGRATIONS</p>
    <h1>Making cold-chain shipping work across subscriptions and checkout.</h1>
    <p>Cold-chain ecommerce requires dependable shipping logic across geographical delivery zones, order thresholds and subscription purchasing. When several applications participate in checkout, each may influence shipping eligibility or pricing.</p>
    <h2>The integration challenge</h2>
    <p>Recharge managed subscriptions, Zapiet supplied zone-based delivery rates and Shopify provided shipping profiles and checkout rules. Their overlapping responsibilities produced risks including duplicated shipping charges, unexpected fees and unavailable delivery options for carts combining subscription and one-time items.</p>
    <h2>Developer-led approach</h2>
    <ol>
      <li>Trace each system's responsibility in rate selection and checkout, rather than patching visible symptoms in isolation.</li>
      <li>Reconcile eligibility across below-threshold, above-threshold, subscription-only, one-time and mixed-cart scenarios.</li>
      <li>Coordinate the shipping configurations so rates and discounts are applied consistently while retaining cold-chain zone restrictions.</li>
      <li>Validate against completed order records and investigate apparent anomalies at the original-rate, discounted-rate and final-charged-rate levels.</li>
    </ol>
    <h2>Outcome and evidence</h2>
    <p>After the configuration work, sampled orders showed expected outcomes for paid below-threshold delivery, qualifying free delivery, first subscription orders and recurring subscription orders. An apparent shipping exception was explained by Shopify retaining an original rate while applying a full shipping discount. No repeat of the original duplicate-charge failure was confirmed in the examined sample.</p>
    <p><strong>Evidence boundary:</strong> The sample was not an exhaustive audit of all historical orders, support tickets or mixed-cart combinations. This case study therefore does not claim a measured financial uplift or proven zero recurrence across the entire business.</p>
    <h2>Engineering lessons</h2>
    <p>Cross-platform commerce issues require systems thinking: understanding how separate checkout services interact, creating a scenario matrix, distinguishing displayed rates from amounts customers actually pay, and documenting validated business rules.</p>
    <p style={{marginTop:40,fontSize:14,opacity:.8}}>This public-safe case study contains no customer data, internal rate tables, production configuration or proprietary source code.</p>
  </main>;
}
