import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Boxes, CheckCircle2, Clock3,
  Cloud, Database, GitBranch, ShieldCheck, Truck, Workflow, AlertTriangle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shopify and CartonCloud delivery synchronisation | Developer portfolio',
  description: 'A public-safe technical case study of a custom Shopify and CartonCloud integration, using a Cloudflare Worker to coordinate fulfilment, tracking and delivery-date data.',
};

// Conceptual presentation of an actual integration project. Labels and data
// are deliberately generalised: this is not a production topology, log export,
// live monitoring tool or a reproduction of employer-owned implementation.
const stages = [
  { icon: Boxes, title: 'Shopify orders', description: 'Orders, fulfilment records and fulfilment-order lookups' },
  { icon: Cloud, title: 'Serverless integration', description: 'Worker orchestration, API authentication and event handling' },
  { icon: Truck, title: 'CartonCloud', description: 'Consignment processing, movement and delivery milestones' },
  { icon: Database, title: 'Shopify updates', description: 'Tracking events, order metafields and estimated delivery dates' }
];
const engineering = [
  { title: 'API orchestration', description: 'Connect commerce fulfilments to a warehouse system using authenticated REST calls and a serverless integration layer.', icon: GitBranch },
  { title: 'Data normalisation', description: 'Translate provider-specific tracking and delivery states into a consistent set of Shopify-facing fields and events.', icon: Database },
  { title: 'Resilience and diagnostics', description: 'Investigate access scopes, webhook sequencing, retries and replay safety. These are engineering concerns, not all independently verified production guarantees.', icon: ShieldCheck },
  { title: 'Delivery transparency', description: 'Keep estimated delivery information associated with the order so support and notification workflows can reference the same intended record.', icon: Clock3 },
];
const checks = [
  { label: '21 October 2026', title: 'Shopify API requests observed', description: 'The supplied app log screenshot shows four successful GET requests for fulfilment-order resources. This confirms those requests were accepted, not that a full delivery update succeeded.' },
  { label: 'August 2026', title: 'Order-level integration testing', description: 'Previous tests exercised tracking and fulfilment paths, and a manual retry wrote a delivery-date metafield on a test order. This is not proof of complete automatic coverage.' },
  { label: 'Open verification', title: 'End-to-end delivery-date reliability', description: 'A fresh audit of CartonCloud events, Shopify writes, error logs, failed retries and a representative order sample is needed before asserting every order is correctly synchronised.' },
];

export default function CartonCloudIntegrationCaseStudy() {
  return (
    <main>
      <header className="header container">
        <Link className="brand" href="/"><strong>JV.</strong><span>DEVELOPER PORTFOLIO</span></Link>
        <nav aria-label="Page navigation"><Link href="/#work">Projects</Link><Link href="/experience">Experience</Link></nav>
      </header>
      <section className="hero container" style={{paddingBottom:70}}>
        <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-[#d8b27c]"><ArrowLeft size={16}/> Back to selected work</Link>
        <div className="eyebrow mt-12"><span className="spark"/> CUSTOM APP / SHOPIFY + CARTONCLOUD</div>
        <h1>Connecting orders<br/><em>to delivery reality.</em></h1>
        <div className="hero-bottom">
          <p>Designed and built a custom serverless integration to connect Shopify fulfilment information with CartonCloud consignments, tracking and delivery-date updates. The challenge was to keep order information aligned across two independently operated systems.</p>
          <a href="https://github.com/bonvallite/developer-portfolio/blob/main/CARTONCLOUD_INTEGRATION.md" className="button secondary" target="_blank" rel="noopener noreferrer">Technical write-up <ArrowUpRight size={17}/></a>
        </div>
        <div className="hero-tags"><span>SHOPIFY APIS</span><span>CLOUDFLARE WORKERS</span><span>REST / WEBHOOKS</span><span>OAUTH SCOPES</span><span>ORDER METAFIELDS</span></div>
      </section>

      <section className="section container" style={{paddingTop:35}}>
        <div className="section-head"><div><span className="overline">01 / THE PROBLEM</span><h2>Two platforms. One customer expectation<span className="dot">.</span></h2></div></div>
        <p className="text-[#acafb8] text-base leading-8 max-w-4xl">Shopify records the order and communicates with customers; CartonCloud manages the physical consignment lifecycle. Without a dependable bridge, shipment movement, tracking state and estimated delivery dates can become fragmented. Manual checking introduces delays and makes a consistent customer-facing delivery experience harder to maintain.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          <article className="border border-[#3d3931] bg-[#171a1f] p-7"><span className="overline">CHALLENGE 01</span><h3 className="text-xl mt-3">Disconnected records</h3><p className="text-[#aeb0b8] leading-7 text-sm mt-2">Fulfilment and consignment data sit in different systems, each with its own identifiers and event vocabulary.</p></article>
          <article className="border border-[#3d3931] bg-[#171a1f] p-7"><span className="overline">CHALLENGE 02</span><h3 className="text-xl mt-3">Changing ETAs</h3><p className="text-[#aeb0b8] leading-7 text-sm mt-2">Delivery estimates and tracking milestones need structured, recoverable updates at the order level.</p></article>
          <article className="border border-[#3d3931] bg-[#171a1f] p-7"><span className="overline">CHALLENGE 03</span><h3 className="text-xl mt-3">Failure recovery</h3><p className="text-[#aeb0b8] leading-7 text-sm mt-2">Webhook retries, API authorisation and partially processed updates require explicit diagnostics and controls.</p></article>
        </div>
      </section>

      <section className="stripe">
        <div className="section container">
          <span className="overline">02 / INTEGRATION ARCHITECTURE</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 mb-4">Event-driven by design.</h2>
          <p className="max-w-3xl text-[#aeb0b8] leading-8 mb-10">A simplified illustration of the intended two-way workflow. Arrows show the logical information path; the layout is not a literal export of a production system.</p>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-3 list-none p-0 m-0">
            {stages.map((stage, i) => <li className="relative bg-[#202329] border border-[#6c5538] p-6 min-h-[218px]" key={stage.title}>
              <div className="flex items-center justify-between text-[#d9b47c]"><span className="text-xs tracking-[.16em]">STEP 0{i + 1}</span><stage.icon size={29}/></div>
              <h3 className="text-xl mt-8 mb-3">{stage.title}</h3>
              <p className="text-sm text-[#b0b2bc] leading-6">{stage.description}</p>
              {i < stages.length - 1 && <ArrowRight aria-hidden="true" size={18} className="hidden md:block absolute -right-4 top-1/2 z-10 text-[#d9b47c] bg-[#202329] rounded-full"/>}
            </li>)}
          </ol>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="border-l-2 border-[#d9b47c] bg-[#181b20] p-5"><p className="text-xs tracking-wider text-[#d9b47c]">OUTBOUND</p><p className="mt-2 text-sm leading-7 text-[#c2c3c8]">Shopify fulfilment context is used to locate or create the corresponding CartonCloud consignment.</p></div>
            <div className="border-l-2 border-[#d9b47c] bg-[#181b20] p-5"><p className="text-xs tracking-wider text-[#d9b47c]">INBOUND</p><p className="mt-2 text-sm leading-7 text-[#c2c3c8]">Carrier milestones inform tracking, fulfilment events and estimated delivery fields associated with the Shopify order.</p></div>
          </div>
          <p className="disclaimer">Conceptual visual only. No internal architecture diagram, payload, real order reference or secret is reproduced.</p>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><div><span className="overline">03 / ENGINEERING CONTRIBUTION</span><h2>Built beyond the storefront<span className="dot">.</span></h2></div></div>
        <div className="quality-grid">{engineering.map(item => <article key={item.title}><item.icon size={26}/><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>

      <section className="section container" style={{paddingTop:0}}>
        <div className="section-head"><div><span className="overline">04 / EVIDENCE & QA</span><h2>What the logs actually prove<span className="dot">.</span></h2></div></div>
        <div className="border border-[#42433f] bg-[#151a1b] rounded-lg overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#333b3a] px-6 py-5"><div className="flex items-center gap-3 text-[#d9b47c]"><Workflow size={21}/><strong>Integration validation timeline</strong></div><span className="text-xs text-[#979da2]">Public-safe evidence summary, not a live log feed</span></div>
          {checks.map((check,i) => <div key={check.title} className="grid md:grid-cols-[175px_1fr] gap-3 px-6 py-6 border-b border-[#303638] last:border-b-0">
            <div className="flex items-start gap-2 text-sm text-[#d9b47c]">{i === 2 ? <AlertTriangle size={18} className="shrink-0 mt-1"/> : <CheckCircle2 size={18} className="shrink-0 mt-1"/>}<span>{check.label}</span></div>
            <div><h3 className="text-lg mb-2">{check.title}</h3><p className="text-[#abb0b6] text-sm leading-7">{check.description}</p></div>
          </div>)}
        </div>
        <p className="disclaimer">The original app-log screenshot was deliberately not published because it contains production store and order identifiers. Successful API reads do not establish successful consignment creation, delivery writes or zero-error operation.</p>
      </section>

      <section className="stripe">
        <div className="section container">
          <span className="overline">05 / RESULT & LEARNINGS</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 mb-6">A maintainable integration pattern.</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div><h3 className="text-2xl mb-4">What I delivered</h3><p className="text-[#afb1b9] leading-8">A custom Shopify-to-warehouse application layer with order/fulfilment lookups, tracking-state handling and delivery-date update paths. This reduced the need to treat the two platforms as isolated sources when investigating orders. No quantified time saving is claimed.</p></div>
            <div><h3 className="text-2xl mb-4">What reliable operation still demands</h3><p className="text-[#afb1b9] leading-8">Permission validation, durable idempotency, bounded retries, observable write failures and sampling across dispatch, transit and delivered orders. The project is described as implemented and tested in part; current full-production synchronisation has not been freshly verified.</p></div>
          </div>
          <div className="actions mt-10"><Link className="button primary" href="/#work">Explore other projects <ArrowRight size={17}/></Link><a className="button secondary" target="_blank" rel="noopener noreferrer" href="https://github.com/bonvallite/developer-portfolio/blob/main/CARTONCLOUD_INTEGRATION.md">Read technical documentation <ArrowUpRight size={17}/></a></div>
          <p className="disclaimer">Portfolio documentation only. This page does not provide credentials, production Worker code, tracking URLs, raw customer records or employer-owned configuration.</p>
        </div>
      </section>
    </main>
  );
}
