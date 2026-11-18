import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '2026 Commerce Engineering Work | Jomar Vallite',
  description: 'A public-safe overview of Shopify engineering, fulfilment integrations, analytics quality and technical operations work in 2026.',
};

// The summaries below describe work areas, not measured commercial uplift.
// Do not insert employer order data, source code, shipping rules or credentials.
// Link only to maintained, public-safe case studies and independently authored demos.
const highlights = [
  {
    heading: 'Shopify storefront and customer journeys',
    summary: 'Responsive theme components, product discovery, structured product information, promotional pages, and mobile conversion diagnostics.',
    href: '/conversion-audit',
    action: 'Review conversion case study',
  },
  {
    heading: 'Custom delivery app and fulfilment connectivity',
    summary: 'Cloudflare Worker application architecture, Shopify API and webhook integration, fulfilment-status handling, delivery estimates, and operational troubleshooting.',
    href: '/cartoncloud-integration',
    action: 'Explore integration architecture',
  },
  {
    heading: 'Wholesale and B2B workflows',
    summary: 'Catalogue segmentation and aggregate-weight purchasing concepts, illustrated with a separate fictional and testable simulator.',
    href: '/b2b-demo',
    action: 'Try the independent demo',
  },
  {
    heading: 'Measurement integrity and performance',
    summary: 'Shopify-to-GA4 reconciliation, event instrumentation reviews, funnel diagnostics, JavaScript error investigation, and prioritised technical recommendations.',
    href: '/experience',
    action: 'View professional experience',
  },
];

export default function CommerceWork2026Page() {
  return <main className="flow-page">
    <section className="container flow-header">
      <Link href="/" className="flow-back"><ArrowLeft size={17}/> Back to portfolio</Link>
      <span className="overline">SELECTED WORK / 2026</span>
      <h1>Commerce engineering,<br/><em>from storefront to fulfilment.</em></h1>
      <p>A concise overview of technical responsibilities across ecommerce development, integration reliability, commercial operations and decision-support analytics. Each example links to a more detailed case study or independent demonstration.</p>
    </section>
    <section className="container section">
      <span className="overline">AREAS OF PRACTICE</span>
      <h2 className="experience-title">Four connected disciplines</h2>
      <div className="experience-grid">
        {highlights.map(item => <article key={item.heading}>
          <h3>{item.heading}</h3>
          <p>{item.summary}</p>
          <Link href={item.href}>{item.action} <ArrowUpRight size={15}/></Link>
        </article>)}
      </div>
    </section>
    <section className="container section">
      <span className="overline">HOW I WORK</span>
      <h2 className="experience-title">Evidence before claims</h2>
      <p>I define the customer or operational problem, inspect existing code and documentation, prioritise by impact and risk, implement scoped changes, and document validation and remaining uncertainties. Findings, shipped changes, and measurable outcomes are treated as different stages.</p>
      <p>This public overview intentionally omits private client repositories, commercial figures, customer information, production delivery rules and proprietary system configurations. The linked demos are illustrative, not replicas of a client's live environment.</p>
      <div className="actions" style={{marginTop:24}}>
        <Link href="/engineering-standards" className="button secondary">Engineering standards <ArrowUpRight size={17}/></Link>
        <a href="https://github.com/bonvallite/developer-portfolio" className="button secondary" target="_blank" rel="noopener noreferrer">Browse public source <ArrowUpRight size={17}/></a>
      </div>
    </section>
  </main>;
}
