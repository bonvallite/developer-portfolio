/**
 * Self-contained, fictional gift packaging case study.
 * The iframe isolates the independently authored vanilla JS simulation and its
 * portfolio-aligned charcoal/gold CSS from
 * the portfolio app, while preserving the existing analytics and layouts.
 * No Shopify store, endpoint, customer information, or proprietary source is used.
 */
export const metadata = {
  title: 'Gift Packaging Reference Demo | Developer Portfolio',
  description: 'Interactive fictional minicart, cart, and checkout packaging demo.',
};

export default function GiftPackagingReferencePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0b0e12' }}>
      <iframe
        title="Fictional gift packaging cart demonstration"
        src="/gift-packaging-reference/index.html"
        style={{ width: '100%', minHeight: '1150px', border: 0, display: 'block' }}
        loading="eager"
      />
    </main>
  );
}
