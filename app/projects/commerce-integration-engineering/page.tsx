import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft, ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, Braces, CheckCircle2,
  Cloud, Code2, Database, GitBranch, LockKeyhole, Radio, ShieldCheck, ShoppingBag, Truck
} from 'lucide-react';
import { ArchitectureLab, CalculationLab, EventLab, OAuthLab } from './SystemsLab';
import CodeExplorer from './CodeExplorer';
import LifecycleStudio from './LifecycleStudio';
import LifecycleTour from './LifecycleTour';
import WorkerFunctionLab from './WorkerFunctionLab';
import MetafieldExplorer from './MetafieldExplorer';
import SecurityLab from './SecurityLab';
import ApiPlayground from './ApiPlayground';
import FreightJourney from './FreightJourney';
import NotificationStudio from './NotificationStudio';
import RecoveryLab from './RecoveryLab';
import { LastMileLab, ShopifyWritebackLab } from './AdvancedLabs';
import CustomerCommunicationLab from './CustomerCommunicationLab';
import './engineering-lab.css';

// 23 Nov 2026: Owner-approved PR #100 is published. Production is indexable;
// Vercel previews remain noindex and are excluded from the preview sitemap.
// This environment-aware metadata was verified in the production release.
// Keep a distinct canonical and description from /cartoncloud-integration;
// the older case study stays available and never redirects automatically.
// All interactive demos use fictional data and no live provider API calls.
// This published teaching case also shows typed order metafields and a fictional
// customer communication timeline. The five-minute ETA notice is merchant-
// reported; Shopify selects email when present or SMS when no email but a
// mobile number exists. Neither timing nor sending is a Worker function.
const isVercelPreview = process.env.VERCEL_ENV === 'preview';
const title = 'Custom Shopify App Engineering | Cloudflare Workers';
const description = 'Interactive Shopify app engineering: Cloudflare Workers, Workers KV, fulfilment tracking, last-mile delivery, and simulated email/SMS workflows.';
export const metadata: Metadata = {
  title,
  description,
  robots: { index: !isVercelPreview, follow: !isVercelPreview },
  alternates: { canonical: '/projects/commerce-integration-engineering' },
  openGraph: {
    title,
    description,
    url: 'https://www.jrvallite.com/projects/commerce-integration-engineering',
    type: 'article'
  }
};

const capabilities = [
  { icon: Cloud, label: 'Cloudflare Workers', description: 'JavaScript serverless runtime' },
  { icon: Database, label: 'Workers KV', description: 'OAuth state and offline token persistence' },
  { icon: ShoppingBag, label: 'Custom Shopify App', description: 'App identity, OAuth and API permissions' },
  { icon: Radio, label: 'Event-driven APIs', description: 'REST, GraphQL and verified webhooks' }
];

export default function CommerceIntegrationEngineering() {
  return (
    <main className="cie-page">
      <a className="cie-skip" href="#cie-content">Skip to case study</a>
      <div className="cie-background-grain" aria-hidden="true" />
      <header className="cie-header cie-shell">
        <Link href="/" className="cie-brand" aria-label="JRV home">
          <span className="cie-brand-mark">{'{JRV}'}</span>
          <span className="cie-brand-caption">COMMERCE SYSTEMS ENGINEERING</span>
        </Link>
        <nav aria-label="Case study navigation">
          <a href="#lifecycle-tour">Lifecycle tour</a>
          <a href="#lifecycle-studio">Lifecycle studio</a>
          <a href="#worker-functions">Worker functions</a>
          <a href="#metafields">Metafields</a>
          <a href="#security-lab">Security</a>
          <a href="#api-playground">API playground</a>
          <a href="#freight-journey">Cold-chain freight</a>
          <a href="#notification-studio">Liquid notifications</a>
          <a href="#recovery-lab">Recovery</a>
          <a href="#architecture">Architecture</a>
          <a href="#calculator">Calculations</a>
          <a href="#writeback">App write-back</a>
          <a href="#communications">Customer messages</a>
          <a href="#code">Code</a>
          <Link href="/cartoncloud-integration" className="cie-back-small">Earlier case study <ArrowUpRight size={14} /></Link>
        </nav>
      </header>
      <div id="cie-content">
        <section className="cie-hero cie-shell" aria-labelledby="cie-title">
          <div className="cie-hero-copy">
            <p className="cie-kicker"><span className="cie-live-dot" aria-hidden="true" /> A SYSTEMS ENGINEERING CASE STUDY <span> / 01</span></p>
            <h1 id="cie-title">Beyond the<br />storefront.<br /><em>Into the systems.</em></h1>
            <p className="cie-hero-lead">One developer. A custom Shopify app. A Cloudflare serverless backend. A connected order-to-delivery experience.</p>
            <p className="cie-hero-sub">An interactive exploration of how authenticated APIs, Workers KV, logistics events and calculated delivery rules turn separate platforms into a coordinated commerce workflow.</p>
            <div className="cie-actions">
              <a href="#architecture" className="cie-button cie-button-primary">Explore the architecture <ArrowDownRight size={17} /></a>
              <a href="#calculator" className="cie-button cie-button-outline">Run the Worker lab <ArrowRight size={17} /></a>
            </div>
            <p className="cie-hero-footnote"><ShieldCheck size={15} /> Public-safe engineering reconstruction. Every interactive event is simulated.</p>
          </div>
          <div className="cie-hero-visual" aria-label="Decorative representation of a Cloudflare Worker processing order events">
            <div className="cie-orbit cie-orbit-one" aria-hidden="true" />
            <div className="cie-orbit cie-orbit-two" aria-hidden="true" />
            <div className="cie-console">
              <div className="cie-console-bar"><span className="cie-window-dots" aria-hidden="true"><i /><i /><i /></span><span>cloudflare / worker.js</span><span className="cie-console-status">● edge active</span></div>
              <div className="cie-console-head"><span>EVENT ROUTER</span><Cloud size={24} aria-hidden="true" /></div>
              <div className="cie-console-lines" aria-hidden="true">
                <div><b>01</b><span className="cie-code-blue">POST</span> /order-event <i>202</i></div>
                <div><b>02</b><span className="cie-code-purple">KV</span> oauth_state <i>TTL</i></div>
                <div><b>03</b><span className="cie-code-orange">REST</span> consignment <i>201</i></div>
                <div><b>04</b><span className="cie-code-blue">GQL</span> metafieldsSet <i>200</i></div>
                <div><b>05</b><span className="cie-code-purple">EVENT</span> delivered <i>↗</i></div>
              </div>
              <div className="cie-console-footer"><span><span className="cie-signal" /> FOUR PLATFORMS, ONE EVENT LAYER</span><span>SIMULATION</span></div>
            </div>
            <span className="cie-float-tag cie-float-a"><ShoppingBag size={16} /> SHOPIFY APP</span>
            <span className="cie-float-tag cie-float-b"><Database size={16} /> WORKERS KV</span>
            <span className="cie-float-tag cie-float-c"><Truck size={16} /> LOGISTICS</span>
          </div>
        </section>
        <section className="cie-proof-bar" aria-label="Technologies used">
          <div className="cie-shell cie-proof-grid">
            <span><b>01</b> CUSTOM APP</span>
            <span><b>02</b> SERVERLESS JS</span>
            <span><b>03</b> WORKERS KV</span>
            <span><b>04</b> REST + GRAPHQL</span>
            <span><b>05</b> EVENT PROCESSING</span>
          </div>
        </section>
        {/* 27 Nov 2026: local event-driven studio extends, rather than replaces,
            the existing public architecture, calculations and communication labs. */}
        {/* Native scroll-driven chapter view; the following studio remains independently controlled. */}
        <section id="lifecycle-tour" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">14 CHAPTERS / ARCHITECTURE TOUR</p><h2>Follow the event.<br/><em>Close the loop.</em></h2><p>Explore the entire simulated delivery lifecycle, including the custom app return path, physical freight, carrier scans and Shopify notification previews.</p></div>
          <LifecycleTour />
        </section>
        <section id="lifecycle-studio" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">NEW / CLOSED-LOOP SYSTEMS LAB</p><h2>One order.<br/><em>Every system boundary.</em></h2><p>Run an independently reconstructed delivery lifecycle. Inspect inputs, calculated dates, carton allocation, failures, carrier scans and native notification previews. All operations remain in your browser.</p></div>
          <LifecycleStudio />
        </section>
        {/* Executable public-safe examples complement the existing code explorer;
            no external execution, private source or provider requests. */}
        <section id="worker-functions" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">WORKER / INTERNAL ENGINEERING</p><h2>Inspect the function.<br/><em>Execute the decision.</em></h2><p>Explore eleven independently authored functions, change the JSON input and compare actual local outputs with edge cases.</p></div>
          <WorkerFunctionLab />
        </section>
        {/* Documented keys with a reconstructed typed local model, not a merchant schema export. */}
        <section id="metafields" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">SHOPIFY / DATA CONTRACT</p><h2>Twenty-nine keys.<br/><em>One order record.</em></h2><p>Inspect how calculated delivery values and later carrier milestones become typed order metafields, with explicit previous, attempted and stored values.</p></div>
          <MetafieldExplorer />
        </section>
        {/* Actual local Web Crypto; all provider authentication exchanges remain mocked. */}
        <section id="security-lab" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">SECURITY / TRUST BOUNDARIES</p><h2>Verify first.<br/><em>Execute only when authorised.</em></h2><p>Test HMAC verification, app installation state, expiry, carrier authentication and administrative authorisation using public teaching fixtures.</p></div>
          <SecurityLab />
        </section>
        {/* Local allowlisted transport; no production routes or arbitrary network requests. */}
        <section id="api-playground" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">API / DEVELOPER WORKBENCH</p><h2>Send the example.<br/><em>Inspect the contract.</em></h2><p>Execute local webhook, REST and GraphQL handlers, inspect computed responses, and distinguish transport errors from mutation errors.</p></div>
          <ApiPlayground />
        </section>
        {/* Schematic physical freight and its digital trace; no live GPS or sensors. */}
        <section id="freight-journey" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">OPERATIONS / COLD-CHAIN FREIGHT</p><h2>From packing bench.<br/><em>To the customer's door.</em></h2><p>Calculate illustrative cartons, inspect the warehouse handoff and animate the carrier milestones that feed back into Shopify.</p></div>
          <FreightJourney />
        </section>
        {/* Fixed local LiquidJS templates; no merchant templates, real messages or scheduling. */}
        <section id="notification-studio" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">COMMUNICATIONS / LIQUID ENGINEERING</p><h2>Stored data.<br/><em>A customer-facing message.</em></h2><p>Render fictional order notices from typed metafields, conditional delivery windows, holiday impacts and later tracking milestones.</p></div>
          <NotificationStudio />
        </section>
        {/* Proposed reliability patterns in a serial, fictional in-memory model. */}
        <section id="recovery-lab" className="cie-section cie-shell">
          <div className="cie-section-header"><p className="cie-kicker">RELIABILITY / INCIDENT ENGINEERING</p><h2>When events fail.<br/><em>Recover without repeating.</em></h2><p>Explore duplicate detection, stale milestones, checkpointed retries, dead-letter incidents and administrative recovery in a proposed local reliability model.</p></div>
          <RecoveryLab />
        </section>
        <section id="architecture" className="cie-section cie-shell">
          <div className="cie-section-header">
            <p className="cie-kicker">01 / ARCHITECTURE</p>
            <h2>Not a straight line.<br /><em>A living integration.</em></h2>
            <p>Explore the three verified Worker entry paths and see where the custom Shopify app, Cloudflare, Workers KV, production and CartonCloud fit. Production is an operational handoff, not a claimed direct production API.</p>
          </div>
          <ArchitectureLab />
        </section>
        <section className="cie-section cie-section-banded" id="calculator">
          <div className="cie-shell">
            <div className="cie-section-header">
              <p className="cie-kicker">02 / RULES ENGINE</p>
              <h2>Real logic.<br /><em>Testable decisions.</em></h2>
              <p>Change a fictional order date, delivery zone and shipment weight. See the estimated dispatch, delivery date and cartons computed in your browser from an independently reconstructed rule model.</p>
            </div>
            <CalculationLab />
          </div>
        </section>
        <section className="cie-section cie-shell" id="last-mile">
          <div className="cie-section-header">
            <p className="cie-kicker">02B / LAST-MILE INTELLIGENCE</p>
            <h2>One dispatch.<br /><em>Different delivery days.</em></h2>
            <p>Transit is not the whole story. Compare three fictional Queensland postcode zones with identical transit time but different last-mile route calendars, then inspect how each final estimated date is selected.</p>
          </div>
          <LastMileLab />
        </section>
        <section className="cie-section cie-section-banded" id="writeback">
          <div className="cie-shell">
            <div className="cie-section-header">
              <p className="cie-kicker">03 / SHOPIFY APPLICATION WRITE-BACK</p>
              <h2>The app doesn't just connect.<br /><em>It updates the order.</em></h2>
              <p>Follow a CartonCloud callback through the Cloudflare-hosted Shopify app backend, authorised Shopify Admin API operations, fulfilment tracking, order metafields, and the native customer notification decision. Compare missing links, callback replays and failures. The early delivery ETA is a separate order-created path, shown next.</p>
            </div>
            <ShopifyWritebackLab />
          </div>
        </section>
        {/* 22 Nov 2026: The owner-supplied customer message demonstrates a
            separate ETA-to-notification handoff that was absent from the
            previous diagrams. The Worker saves typed custom.* order metafields
            on orders/create; the reported five-minute email/SMS delay is a
            store configuration not implemented in the reviewed Worker source.
            Tracking and native Shopify update requests occur later. */}
        <section className="cie-section cie-shell" id="communications">
          <div className="cie-section-header">
            <p className="cie-kicker">03B / ETA → CUSTOMER COMMUNICATION</p>
            <h2>The date arrives first.<br /><em>The tracking link comes later.</em></h2>
            <p>Show how postcode-based delivery dates move from Cloudflare Workers to Shopify order metafields and into customer notifications. The merchant reports Shopify sends email when available, falling back to SMS only when the order has no email but has a mobile number. The five-minute notice is a store-side configuration, not a Worker sending function, and tracking arrives later.</p>
          </div>
          <CustomerCommunicationLab />
        </section>
        <section className="cie-section cie-shell" id="event-trace">
          <div className="cie-section-header">
            <p className="cie-kicker">04 / EVENT INTELLIGENCE</p>
            <h2>Watch the update.<br /><em>Inspect the failure.</em></h2>
            <p>Follow CartonCloud status callbacks into Shopify. Compare a normal milestone with missing tracking data, a replay and a rejected signature, without touching any real customer record.</p>
          </div>
          <EventLab />
        </section>
        <section className="cie-section cie-section-banded" id="auth">
          <div className="cie-shell">
            <div className="cie-section-header">
              <p className="cie-kicker">05 / CUSTOM APPLICATION</p>
              <h2>The app is the bridge.<br /><em>KV keeps the connection.</em></h2>
              <p>A non-embedded Shopify app grants authenticated Admin API access. The Cloudflare Worker hosts its OAuth routes; Workers KV persists temporary state and the offline token used for subsequent requests.</p>
            </div>
            <OAuthLab />
          </div>
        </section>
        <section className="cie-section cie-shell" id="code">
          <div className="cie-section-header">
            <p className="cie-kicker">06 / ENGINEERING NOTES</p>
            <h2>Readable code.<br /><em>Defensible decisions.</em></h2>
            <p>Explore hand-written educational JavaScript for the patterns behind the system. These snippets are intentionally reconstructed, not copies of production source.</p>
          </div>
          <CodeExplorer />
        </section>
        <section className="cie-section cie-section-banded" id="ownership">
          <div className="cie-shell">
            <div className="cie-section-header">
              <p className="cie-kicker">07 / RESPONSIBILITY & BOUNDARIES</p>
              <h2>Built end to end.<br /><em>Explained without exposing it.</em></h2>
            </div>
            <div className="cie-capability-grid">
              {capabilities.map(({ icon: Icon, label, description }) => (
                <article className="cie-capability" key={label}><Icon size={26} aria-hidden="true" /><h3>{label}</h3><p>{description}</p></article>
              ))}
            </div>
            <div className="cie-disclosure">
              <div><LockKeyhole size={25} /><strong>Public-safe by design</strong></div>
              <p>No production credentials, Worker URLs, real tracking numbers, customer data, complete postcode tables or employer-owned Worker source are published. UI inputs, event logs and outputs stay local to your browser. Example closure dates are fictional and are not public-holiday advice.</p>
              <p>Demonstration behaviour is not evidence of production uptime, guaranteed delivery accuracy or duplicate-event prevention. Customer notification outcomes require independent verification.</p>
            </div>
          </div>
        </section>
      </div>
      <footer className="cie-footer">
        <div className="cie-shell cie-footer-inner">
          <div><span className="cie-brand-mark">{'{JRV}'}</span><p>Commerce is more than a storefront.</p></div>
          <div><Link href="/cartoncloud-integration">Earlier case study <ArrowUpRight size={14}/></Link><Link href="/">Portfolio home <ArrowRight size={14}/></Link></div>
        </div>
      </footer>
    </main>
  );
}
