import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, Boxes, Workflow, RefreshCw, ShieldCheck } from 'lucide-react';

// Public-safe capability showcase, based on an owner-provided Shopify Dev Dashboard screenshot
// dated 27 October 2026 and the separately documented CartonCloud integration case study.
// The screenshot is a compressed derivative of the owner-supplied 27 October 2026 image,
// stored at public/portfolio/shopify-apps-dashboard.webp. The original has not been published.
// An app listing does not verify code ownership, deployed features, or production reliability.
// Keep client secrets, actual inventory, and private dashboard exports out of this page.
const apps = [
  { name: "Honey's Place Inventory Sync", area: 'Inventory integration', status: 'Listed in developer dashboard · 0 installs shown', detail: 'Client need: less manual inventory reconciliation and better stock visibility. Inventory synchronisation is the named project goal; actual connectors, automation rules, and deployment state remain unverified.' },
  { name: 'CartonCloud', area: 'Fulfilment and delivery', status: 'Listed in developer dashboard · 1 install shown', detail: 'Client need: reduce manual fulfilment hand-offs and improve delivery visibility. Documented custom Shopify–CartonCloud integration, supported by a Cloudflare Worker for consignment creation, fulfilment tracking, status events, and delivery-date updates.' },
  { name: 'IndexNowfor CDT', area: 'Platform tooling', status: 'Listed in developer dashboard · 0 installs shown', detail: 'Developer dashboard application. Its implementation and feature scope have not been established from the screenshot.' },
  { name: 'zipify', area: 'Platform tooling', status: 'Listed in developer dashboard · 0 installs shown', detail: 'Developer dashboard application. Its implementation and feature scope have not been established from the screenshot.' },
];
const outcomes = [
  { title: 'Connect disconnected systems', text: 'Design API integrations and event-driven data exchanges that reduce repetitive manual transfers.', icon: Workflow },
  { title: 'Improve inventory visibility', text: 'Build synchronisation patterns for inventory updates, reconciliations, and operational exceptions.', icon: Boxes },
  { title: 'Automate recurring tasks', text: 'Use webhooks and serverless functions to orchestrate repeatable processes, with logging and recovery paths.', icon: RefreshCw },
  { title: 'Keep humans in control', text: 'Document changes and design for permission boundaries, failed events, validation, and manual review.', icon: ShieldCheck },
];
export default function ShopifyAppsPage() {
  return <main className="container" style={{paddingTop:52,paddingBottom:90}}>
    <Link href="/" className="button secondary" style={{display:'inline-flex',marginBottom:40}}><ArrowLeft size={16}/> Back to portfolio</Link>
    <span className="overline">CUSTOM SHOPIFY APPS / API ENGINEERING</span>
    <h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:1.09,margin:'16px 0 24px'}}>Automating operations.<br/>Making room for higher-value work.</h1>
    <p style={{maxWidth:840,fontSize:'1.17rem',lineHeight:1.8}}>I build Shopify app and integration solutions that connect platforms, streamline inventory management and operational events, and reduce the manual effort behind recurring tasks. The goal is simple: let teams focus on decisions, customers, and the work that matters most.</p>
    {/* Evidence image is a compressed copy of the supplied dashboard screenshot.
        The listing is not evidence of app internals, production status or authorship. */}
    <section className="flow-feature" aria-label="Shopify developer dashboard evidence">
      <span className="overline">SOURCE EVIDENCE / 27 OCTOBER 2026</span>
      <h3>Shopify Dev Dashboard app listings</h3>
      <figure style={{margin:'20px 0',maxWidth:760}}><a href="/portfolio/shopify-apps-dashboard.webp" target="_blank" rel="noopener noreferrer" aria-label="Open Shopify Dev Dashboard screenshot"><Image src="/portfolio/shopify-apps-dashboard.webp" alt="Shopify Dev Dashboard apps list showing Honey's Place Inventory Sync, CartonCloud, IndexNowfor CDT and zipify" width={380} height={245} sizes="(max-width: 700px) 100vw, 760px" style={{width:'100%',height:'auto',borderRadius:12}}/></a><figcaption style={{marginTop:8,fontSize:13}}>Owner-supplied Shopify developer dashboard screenshot, 27 October 2026. Select to open the image.</figcaption></figure>
      <p>Evidence from a screenshot supplied by the developer. The visible dashboard listed four apps: Honey's Place Inventory Sync (0 installs), CartonCloud (1 install), IndexNowfor CDT (0 installs), and zipify (0 installs). The image above is a compressed copy of the screenshot alongside this transcription. App internals, ownership, and client outcomes require separate confirmation.</p>
    </section>
    <section className="section" aria-labelledby="apps-heading">
      <div className="section-head"><div><span className="overline">01 / APP PORTFOLIO</span><h2 id="apps-heading">Applications in my developer dashboard<span className="dot">.</span></h2></div></div>
      <div className="workspace-grid">{apps.map(app=><article key={app.name}><span className="overline">{app.area}</span><h3>{app.name}</h3><p>{app.detail}</p><small>{app.status}</small></article>)}</div>
      <p className="disclaimer">Source: owner-provided Shopify Dev Dashboard screenshot, 27 October 2026. Listings and install counts are snapshot values, not evidence of production usage or sole authorship. This page does not claim to publish or recreate the listed apps.</p>
    </section>
    <section className="section" aria-labelledby="value-heading"><div className="section-head"><div><span className="overline">02 / ENGINEERING APPROACH</span><h2 id="value-heading">From repetitive tasks to dependable workflows<span className="dot">.</span></h2></div></div><div className="quality-grid">{outcomes.map(item=><article key={item.title}><item.icon size={27}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="flow-feature"><span className="overline">TECHNICAL CASE STUDY / VERIFIED SCOPE</span><h3>Custom delivery app + Shopify–CartonCloud integration</h3><p>Explore the documented two-way architecture: Shopify fulfilment data to CartonCloud consignments, with tracking and delivery updates returning to Shopify through a Cloudflare Worker. The public case study separates the application itself from the integration and discloses testing limits.</p><Link href="/cartoncloud-integration" className="button secondary">Explore architecture and case study <ArrowUpRight size={17}/></Link></section>
    <p className="disclaimer">Public-safe portfolio content only. No production credentials, customer data, inventory quantities, proprietary client source code, or private app configuration are included. Features without corroborating technical evidence are described as potential capabilities rather than verified deployments.</p>
  </main>;
}
