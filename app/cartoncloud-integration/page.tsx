import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownUp, Boxes, CheckCircle2, Clock3,
  Cloud, Database, GitBranch, ShieldCheck, Truck, Workflow, AlertTriangle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Custom Shopify delivery app and CartonCloud integration | Developer portfolio',
  description: 'I built both a Cloudflare Worker delivery app and the Shopify–CartonCloud integration that handles fulfilment information, tracking and estimated delivery dates.',
};

// Public-safe conceptual diagram of two distinct contributions: the custom
// serverless application and the API integration workflows it orchestrates.
// The bidirectional arrows represent logical data exchange, not direct network
// connections or a copy of the employer's production architecture.
// Delivery results return to Shopify through the app and integration.
const architecture = [
  { icon: Boxes, label: 'COMMERCE PLATFORM', title: 'Shopify orders', detail: 'Order and fulfilment information', highlight: false },
  { icon: Cloud, label: 'CUSTOM APP I BUILT', title: 'Cloudflare Worker delivery app', detail: 'API authentication · Orchestration · Delivery-date handling · Diagnostics', highlight: true },
  { icon: GitBranch, label: 'INTEGRATION I BUILT', title: 'Shopify–CartonCloud integration', detail: 'API requests · Webhook processing · Consignment and tracking synchronisation', highlight: true },
  { icon: Truck, label: 'LOGISTICS PLATFORM', title: 'CartonCloud', detail: 'Consignments · Tracking milestones · Delivery events', highlight: false },
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
        <h1>I built the app.<br/><em>I built the integration.</em></h1>
        <div className="hero-bottom">
          <p>I designed and developed both the custom Cloudflare Worker delivery app and the Shopify–CartonCloud API integration. Together, they coordinate Shopify fulfilment information, logistics consignments, tracking events and estimated delivery-date updates.</p>
          <a href="https://github.com/bonvallite/developer-portfolio/blob/main/CARTONCLOUD_INTEGRATION.md" className="button secondary" target="_blank" rel="noopener noreferrer">Technical write-up <ArrowUpRight size={17}/></a>
        </div>
        <div className="hero-tags"><span>SHOPIFY APIS</span><span>CLOUDFLARE WORKERS</span><span>REST / WEBHOOKS</span><span>OAUTH SCOPES</span><span>ORDER METAFIELDS</span><span>CUSTOM APP DEVELOPMENT</span></div>
      </section>

      {/* Public education and prospective-client showcase. All scenarios below are
          illustrative; they are not live system captures or measured outcomes.
          Keep these explanations aligned with CARTONCLOUD_INTEGRATION.md. */}
      <section className="section container" style={{paddingTop:20}}>
        <span className="overline">PUBLIC SHOWCASE / FOR STUDENTS & CLIENTS</span>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 mb-5">From checkout to doorstep.</h2>
        <p className="text-[#adb1b8] leading-8 max-w-4xl">A real-world software engineering case study: how a custom serverless application bridges an ecommerce platform and a logistics system. Explore the business challenge, the technical decisions and the limits of the available validation evidence.</p>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <article className="border border-[#494237] rounded-xl bg-[#181b20] p-7">
            <span className="overline">FOR STUDENTS</span><h3 className="text-2xl mt-3 mb-3">Learn how integrations work</h3>
            <p className="text-[#bfc1c6] leading-7 text-sm">Follow order-created webhooks, REST/GraphQL APIs, OAuth authentication, serverless execution, delivery-rule calculations and status mapping. See why error handling and verification matter as much as writing code.</p>
            <a href="#learning-path" className="inline-flex items-center gap-2 text-[#d9b47c] mt-5">View the learning path <ArrowRight size={16}/></a>
          </article>
          <article className="border border-[#494237] rounded-xl bg-[#181b20] p-7">
            <span className="overline">FOR FUTURE CLIENTS</span><h3 className="text-2xl mt-3 mb-3">Understand the business value</h3>
            <p className="text-[#bfc1c6] leading-7 text-sm">See how operational pain points are translated into an integration design: fewer disconnected records, structured delivery updates, traceable status changes and a path for diagnosing failures. Quantified savings require production measurement.</p>
            <a href="#client-journey" className="inline-flex items-center gap-2 text-[#d9b47c] mt-5">Explore the delivery approach <ArrowRight size={16}/></a>
          </article>
        </div>
      </section>
      <section id="learning-path" className="stripe"><div className="section container">
        <span className="overline">CLASSROOM WALKTHROUGH / FOUR STEPS</span>
        <h2 className="text-4xl font-semibold mt-5 mb-8">What happens when an order is placed?</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            ['01 / EVENT','Shopify emits an order or fulfilment event','An authenticated webhook carries relevant order data to the application.'],
            ['02 / COMPUTE','The Worker applies business rules','The app can calculate postcode-based delivery estimates and prepare consignment data.'],
            ['03 / CONNECT','APIs exchange logistics information','The integration communicates with CartonCloud and translates provider statuses into Shopify events.'],
            ['04 / RECORD','Shopify stores customer-facing updates','Order metafields and fulfilment events provide structured tracking and estimated-date records.']
          ].map(([step,title,body])=><article key={step} className="border-l-2 border-[#d9b47c] bg-[#191c21] p-7"><span className="overline">{step}</span><h3 className="text-xl mt-3 mb-3">{title}</h3><p className="text-sm text-[#bfc1c6] leading-7">{body}</p></article>)}
        </div>
        <p className="disclaimer">Teaching illustration, not a guarantee that all steps complete for every live order. Credentials and customer payloads are intentionally omitted.</p>
      </div></section>
      <section id="client-journey" className="section container">
        <span className="overline">CLIENT PERSPECTIVE / PROBLEM TO SOLUTION</span>
        <h2 className="text-4xl font-semibold mt-5 mb-8">Engineering grounded in operations.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <article className="border border-[#474137] p-7 rounded-lg"><span className="overline">DISCOVER</span><h3 className="text-xl mt-3 mb-3">Map the process</h3><p className="text-[#bfc1c6] text-sm leading-7">Identify where order IDs, consignment IDs, dispatch schedules and tracking updates diverge.</p></article>
          <article className="border border-[#474137] p-7 rounded-lg"><span className="overline">BUILD</span><h3 className="text-xl mt-3 mb-3">Connect the systems</h3><p className="text-[#bfc1c6] text-sm leading-7">Design authenticated webhooks, API mapping, delivery estimates and safe status transitions.</p></article>
          <article className="border border-[#474137] p-7 rounded-lg"><span className="overline">VERIFY</span><h3 className="text-xl mt-3 mb-3">Prove the result</h3><p className="text-[#bfc1c6] text-sm leading-7">Test fulfilment scenarios, inspect logs and exceptions, and validate order-level outcomes before claiming success.</p></article>
        </div>
        <p className="disclaimer">This publicly shareable case study is educational and illustrative. It does not reproduce employer-owned Worker source, secret configuration, customer records or internal endpoints.</p>
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
          <span className="overline">02 / WHAT I BUILT</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 mb-4">The app. The integration. The delivery data.</h2>
          <p className="max-w-3xl text-[#aeb0b8] leading-8 mb-10">Two distinct development contributions working as one system. The app orchestrates the operations; the custom integration handles communication and data mapping between Shopify and CartonCloud.</p>
          <div className="mx-auto max-w-3xl" aria-label="Conceptual Shopify and CartonCloud custom app and integration architecture">
            {architecture.map((stage, i) => <div key={stage.title}>
              <div className={stage.highlight
                ? 'border-2 border-[#d9b47c] bg-[#22201c] rounded-xl px-5 py-6 sm:px-9'
                : 'border border-[#494b4a] bg-[#202329] rounded-xl px-5 py-6 sm:px-9'}>
                <div className="flex flex-wrap items-start gap-4 sm:gap-6">
                  <stage.icon size={33} className="shrink-0 text-[#d9b47c]" aria-hidden="true"/>
                  <div className="min-w-0 flex-1">
                    <span className="overline">{stage.label}</span>
                    <h3 className="text-xl sm:text-2xl mt-2 mb-2">{stage.title}</h3>
                    <p className="text-sm leading-7 text-[#c2c4c9]">{stage.detail}</p>
                  </div>
                </div>
              </div>
              {i < architecture.length - 1 && <div className="flex items-center justify-center gap-3 py-3 text-[#d9b47c]"><ArrowDownUp size={25} aria-hidden="true"/><span className="text-xs tracking-wide text-[#b6b8bf]">Two-way data exchange</span></div>}
            </div>)}
            <div className="mt-5 border-l-4 border-[#d9b47c] bg-[#16191d] px-5 py-6 sm:px-8">
              <div className="flex items-center gap-3 text-[#d9b47c]"><Database size={23} aria-hidden="true"/><strong>Results written back to Shopify</strong></div>
              <p className="text-sm leading-7 text-[#c2c4c9] mt-3">The same app and integration provide the return path for tracking information, fulfilment events and estimated delivery dates stored in order metafields.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <article className="border-l-2 border-[#d9b47c] bg-[#181b20] p-6"><span className="overline">01 / CUSTOM APPLICATION</span><h3 className="text-lg mt-3 mb-2">I built the serverless app</h3><p className="text-sm leading-7 text-[#c2c3c8]">The Cloudflare Worker application coordinates authenticated requests, webhook handling, delivery-date logic, error investigation and Shopify order updates.</p></article>
            <article className="border-l-2 border-[#d9b47c] bg-[#181b20] p-6"><span className="overline">02 / CUSTOM INTEGRATION</span><h3 className="text-lg mt-3 mb-2">I built the API connection</h3><p className="text-sm leading-7 text-[#c2c3c8]">The Shopify–CartonCloud integration maps fulfilment information to consignments, exchanges tracking events and synchronises delivery data between platforms.</p></article>
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
            <div><h3 className="text-2xl mb-4">What I delivered</h3><p className="text-[#afb1b9] leading-8">Both a custom serverless delivery app and the Shopify–CartonCloud integration it operates, including order/fulfilment lookups, tracking-state handling and delivery-date update paths. This reduced the need to treat the two platforms as isolated sources when investigating orders. No quantified time saving is claimed.</p></div>
            <div><h3 className="text-2xl mb-4">What reliable operation still demands</h3><p className="text-[#afb1b9] leading-8">Permission validation, durable idempotency, bounded retries, observable write failures and sampling across dispatch, transit and delivered orders. The project is described as implemented and tested in part; current full-production synchronisation has not been freshly verified.</p></div>
          </div>
          <div className="actions mt-10"><Link className="button primary" href="/#work">Explore other projects <ArrowRight size={17}/></Link><a className="button secondary" target="_blank" rel="noopener noreferrer" href="https://github.com/bonvallite/developer-portfolio/blob/main/CARTONCLOUD_INTEGRATION.md">Read technical documentation <ArrowUpRight size={17}/></a></div>
          <p className="disclaimer">Portfolio documentation only. This page does not provide credentials, production Worker code, tracking URLs, raw customer records or employer-owned configuration.</p>
        </div>
      </section>
    </main>
  );
}
