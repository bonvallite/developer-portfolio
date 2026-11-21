import Link from 'next/link';
import CaseStudyContext from '../components/CaseStudyContext';
import IntegrationLab from './IntegrationLab';
import './cartoncloud-showcase.css';
import type { Metadata } from 'next';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Clock3,
  Cloud, Database, GitBranch, ShieldCheck, Truck, Workflow, AlertTriangle
} from 'lucide-react';

// 21 Nov crawl: keep CartonCloud, Shopify and delivery-app intent within
// the rendered title budget, and describe integration scope without promising
// complete order sync or measured delivery accuracy.
export const metadata: Metadata = {
  title: 'Shopify CartonCloud Integration & Delivery App',
  description: 'Explore a Shopify and CartonCloud API integration using Cloudflare Workers for fulfilment, tracking and delivery estimates, with validation limits.',
  alternates: { canonical: '/cartoncloud-integration' },
};

// 21 Nov 2026: separate app and API-integration work remains explicit in the
// two contribution panels. The new interactive diagram models a hypothetical
// workflow and failure gates, not a real production network trace.
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
    <main className="cc-page">
      <header className="header container">
        <Link className="brand" href="/"><strong>JRV</strong><span>SHOPIFY COMMERCE ENGINEERING</span></Link>
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

      <section className="section container cc-challenges" style={{paddingTop:35}}>
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
          <div className="cc-contributions" aria-label="The two development contributions">
            <article>
              <div className="cc-contribution-index"><span>01 / SERVERLESS APPLICATION</span><Cloud size={28} aria-hidden="true"/></div>
              <h3>I built the application layer.</h3>
              <p>The custom Cloudflare Worker coordinates the authorised request lifecycle, webhook handling, delivery-date logic, and Shopify order update paths.</p>
              <div className="cc-contribution-terms"><span>Authentication</span><span>Routing</span><span>Diagnostics</span></div>
              <p className="cc-contribution-boundary">Application design and selective testing are documented. This is not a claim that every live shipment has been validated.</p>
            </article>
            <article>
              <div className="cc-contribution-index"><span>02 / API INTEGRATION</span><Truck size={28} aria-hidden="true"/></div>
              <h3>I built the integration paths.</h3>
              <p>The Shopify–CartonCloud connection maps authorised fulfilment context to consignments and translates logistics updates into Shopify-facing data.</p>
              <div className="cc-contribution-terms"><span>REST + webhooks</span><span>Event mapping</span><span>Order metafields</span></div>
              <p className="cc-contribution-boundary">Verified API reads are not proof of universal tracking or delivery-date synchronisation.</p>
            </article>
          </div>
          <div className="cc-explore-prompt">
            <span>LEARN BY EXPLORING THE SYSTEM</span>
            <p>Instead of a static diagram, step through a simulated event, reject an invalid webhook, or investigate a failed Shopify write.</p>
            <a href="#event-studio">Explore the interactive event studio <ArrowRight size={17} aria-hidden="true"/></a>
          </div>
          <p className="disclaimer">Illustrative architecture only. The event studio does not reproduce production payloads, secrets, client order identifiers, or a live Worker trace.</p>
        </div>
      </section>

            {/* Interactive, fictional event studio is isolated from merchant systems.
          It explicitly blocks later success in invalid-signature/write-failure modes. */}
      <IntegrationLab/>

      <section className="section container">
        <div className="section-head"><div><span className="overline">04 / ENGINEERING CONTRIBUTION</span><h2>Built beyond the storefront<span className="dot">.</span></h2></div></div>
        <div className="quality-grid">{engineering.map(item => <article key={item.title}><item.icon size={26}/><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>

      <section className="section container" style={{paddingTop:0}}>
        <div className="section-head"><div><span className="overline">05 / EVIDENCE & QA</span><h2>What the logs actually prove<span className="dot">.</span></h2></div></div>
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
          <span className="overline">06 / RESULT & LEARNINGS</span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mt-5 mb-6">A maintainable integration pattern.</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div><h3 className="text-2xl mb-4">What I delivered</h3><p className="text-[#afb1b9] leading-8">Both a custom serverless delivery app and the Shopify–CartonCloud integration it operates, including order/fulfilment lookups, tracking-state handling and delivery-date update paths. This reduced the need to treat the two platforms as isolated sources when investigating orders. No quantified time saving is claimed.</p></div>
            <div><h3 className="text-2xl mb-4">What reliable operation still demands</h3><p className="text-[#afb1b9] leading-8">Permission validation, durable idempotency, bounded retries, observable write failures and sampling across dispatch, transit and delivered orders. The project is described as implemented and tested in part; current full-production synchronisation has not been freshly verified.</p></div>
          </div>
          <div className="actions mt-10"><Link className="button primary" href="/#work">Explore other projects <ArrowRight size={17}/></Link><a className="button secondary" target="_blank" rel="noopener noreferrer" href="https://github.com/bonvallite/developer-portfolio/blob/main/CARTONCLOUD_INTEGRATION.md">Read technical documentation <ArrowUpRight size={17}/></a></div>
          <p className="disclaimer">Portfolio documentation only. This page does not provide credentials, production Worker code, tracking URLs, raw customer records or employer-owned configuration.</p>
        </div>
      </section>
    <CaseStudyContext summary="A custom Cloudflare Worker application and Shopify–CartonCloud integration connecting fulfilment events, tracking status and estimated delivery information." evidenceLimit="Described implementation and partial testing are not proof of full present-day production synchronisation, quantified savings or flawless event delivery." services={[{"title":"Custom Shopify apps and APIs","href":"/shopify-app-development","description":"OAuth, webhooks, serverless orchestration and fulfilment system integrations."},{"title":"Shopify developer","href":"/shopify-developer","description":"Storefront features that depend on reliable order and delivery integration data."}]} />
    </main>
  );
}
