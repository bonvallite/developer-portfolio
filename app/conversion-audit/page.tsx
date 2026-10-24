import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BarChart3, CheckCircle2, MousePointerClick, ShoppingCart, ShieldCheck } from 'lucide-react';

// Public narrative only: summarise the owner's audit and later reported QA without
// client metrics or private source. GA4 hypotheses and revenue uplift remain open.
// The static PDF is a redacted public edition, not the original internal audit.
const journey = [
  ['Landing page', 'Match the visitor’s intent and delivery eligibility.'],
  ['Product discovery', 'Check mobile visibility, product cards, and offer clarity.'],
  ['Add to cart', 'Verify the cart action succeeds and measurement reflects it.'],
  ['Minicart', 'Check reward messaging, quantity changes, and cart updates.'],
  ['Checkout', 'Validate shipping for subscriptions and one-time purchases.'],
  ['Purchase', 'Reconcile completion signals and monitor post-release results.'],
];

const phases = [
  { title: 'Map the purchase journey', detail: 'Review homepage and campaign entry points, collection discovery, product detail pages, basket behaviour and checkout hand-off. Document where calls to action do not match user intent.' },
  { title: 'Audit CTAs and friction', detail: 'Check links and anchor targets, action wording, mobile tap targets, duplicate buttons, offer clarity, product-card rendering errors and whether shopping actions remain visible in long-form content.' },
  { title: 'Triangulate analytics', detail: 'Compare Shopify funnel stages with GA4 event coverage and data quality. Segment by device and traffic source before assuming a low conversion rate is caused by the interface.' },
  { title: 'Prioritise and validate', detail: 'Address broken actions first, then reduce friction, improve reassurance and test responsive layouts. Verify event signals and compare like-for-like periods after release.' },
];
const findings = [
  ['CTA functionality', 'Some promotional or editorial actions can lead to missing anchors or unhelpful destinations.', 'Replace inert destinations with a working collection, product or cart action and verify the end-to-end interaction.'],
  ['Product discovery', 'Repeated CTAs, dense mobile layouts and inconsistent card rendering can slow selection.', 'Simplify hierarchy, improve scanning and resolve template errors before changing conversion messaging.'],
  ['Incentive clarity', 'Gift and shipping messaging can drift out of sync with actual eligibility rules.', 'Use a single approved source for thresholds and clearly distinguish automatic gifts from discount-code offers.'],
  ['Checkout progression', 'Basket additions do not guarantee completion; fulfilment and checkout reassurance matter.', 'Review the basket-to-checkout transition, delivery expectations, errors and the placement of reassurance content.'],
  ['Measurement reliability', 'Shopify and GA4 can disagree due to event setup, attribution, consent and traffic quality.', 'Audit purchase identifiers, duplicate tags, missing events and suspicious sessions before interpreting funnel changes.'],
];

export default function ConversionAuditCaseStudy() {
  return <main>
    <header className="header container"><Link className="brand" href="/"><strong>JV.</strong><span>DEVELOPER PORTFOLIO</span></Link><nav aria-label="Page navigation"><Link href="/#work">Projects</Link><Link href="/experience">Experience</Link></nav></header>
    <section className="hero container" style={{paddingBottom:48}}>
      <div className="eyebrow"><span className="spark"/> CASE STUDY / ECOMMERCE OPTIMISATION</div>
      <h1>Finding conversion<br/><em>leaks across the funnel.</em></h1>
      <div className="hero-bottom"><p>An example-led account of how I audit calls to action, purchase friction and analytics quality across Shopify storefront journeys. It describes professional methodology without sharing an employer's confidential data or source code.</p></div>
      <div className="hero-tags"><span>SHOPIFY ANALYTICS</span><span>GA4</span><span>MICROSOFT CLARITY</span><span>CRO</span><span>PRODUCTION QA</span></div>
      <div className="actions" style={{marginTop:28}}><a href="/portfolio/shopify-conversion-journey.pdf" className="button primary" target="_blank" rel="noopener noreferrer">Read the 9-slide PDF <ArrowUpRight size={16}/></a><Link href="#journey" className="button secondary">Follow the audit journey</Link></div>
    </section>
    <section id="journey" className="section container" style={{paddingTop:30}} aria-labelledby="journey-title">
      <div className="section-head"><div><span className="overline">THE BUYING JOURNEY</span><h2 id="journey-title">From landing to purchase<span className="dot">.</span></h2></div></div>
      <ol className="quality-grid" style={{listStyle:'none',padding:0}}>{journey.map(([title,detail],i)=><li key={title} style={{borderTop:'1px solid #73614c',padding:'22px 0'}}><span className="overline">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{detail}</p></li>)}</ol>
      <p className="disclaimer">This maps the audit scope. It is not a chart of measured drop-off rates.</p>
    </section>
    <section className="section container" aria-labelledby="evidence-title">
      <div className="section-head"><div><span className="overline">EVIDENCE AND DIAGNOSIS</span><h2 id="evidence-title">Different tools, clearer questions<span className="dot">.</span></h2></div></div>
      <div className="quality-grid">
        <article><h3>Shopify Analytics</h3><p>Compare cart, checkout, and purchase progression. Separate traffic growth from changes in the reported conversion rate.</p></article>
        <article><h3>Google Analytics 4</h3><p>Segment by acquisition source, geography, and device. Investigate suppressed cart events and possible duplicate measurement before interpreting funnel changes.</p></article>
        <article><h3>Microsoft Clarity</h3><p>Use recordings and heatmaps to investigate navigation, scrolling, and shopping interactions. The source audit does not quantify individual Clarity observations.</p></article>
        <article><h3>Source inspection</h3><p>Trace missing product sections, event listeners, and promotion dependencies in the implementation to turn an observation into a testable diagnosis.</p></article>
      </div>
    </section>
    <section className="section container" style={{paddingTop:30}}>
      <div className="section-head"><div><span className="overline">01 / THE CHALLENGE</span><h2>More traffic is not enough<span className="dot">.</span></h2></div></div>
      <p style={{maxWidth:800}}>An ecommerce funnel may lose customers because a CTA is broken, an offer is unclear, the mobile layout distracts from the next step or analytics incorrectly classify sessions. A conversion audit must distinguish real shopper friction from instrumentation problems and low-quality traffic.</p>
      <div className="quality-grid" style={{marginTop:30}}>
        <article><MousePointerClick size={28}/><h3>Discoverability</h3><p>Make the next relevant purchase action clear without repeating competing CTAs.</p></article>
        <article><ShoppingCart size={28}/><h3>Continuity</h3><p>Keep product selection, basket actions and checkout expectations consistent.</p></article>
        <article><BarChart3 size={28}/><h3>Measurement</h3><p>Verify event completeness and segment traffic before assigning causes to drops.</p></article>
        <article><ShieldCheck size={28}/><h3>Validation</h3><p>Test implementation across device sizes and monitor meaningful post-change signals.</p></article>
      </div>
    </section>
    <section className="section container"><div className="section-head"><div><span className="overline">02 / AUDIT FRAMEWORK</span><h2>From diagnosis to validation<span className="dot">.</span></h2></div></div>
      <div className="quality-grid">{phases.map((p,i)=><article key={p.title}><span className="overline">STEP {String(i+1).padStart(2,'0')}</span><h3>{p.title}</h3><p>{p.detail}</p></article>)}</div>
    </section>
    <section className="section container"><div className="section-head"><div><span className="overline">03 / PATTERNS AND REMEDIATIONS</span><h2>Fix what blocks buying<span className="dot">.</span></h2></div></div>
      <div className="projects">{findings.map(([title,issue,action])=><article className="project" key={title}><div className="project-top"><span>CONVERSION LEAK</span><CheckCircle2 size={22}/></div><h3>{title}</h3><p>{issue}</p><p><strong>Response:</strong> {action}</p></article>)}</div>
    </section>
    <section className="section container"><div className="section-head"><div><span className="overline">04 / WHAT THE WORK DEMONSTRATES</span><h2>Engineering meets customer behaviour<span className="dot">.</span></h2></div></div>
      <p style={{maxWidth:850}}>The work combines technical debugging, responsive design, content hierarchy, ecommerce rules and measurement auditing. Examples of remediations include restoring functional add-to-cart actions, improving contextual shopping links, reducing mobile CTA clutter, correcting promotion copy and checking instrumentation. These are documented types of work, not a claim that every recommendation was deployed or that a particular uplift was proven.</p>
      <p className="disclaimer">Public-safe summary only. No client funnel counts, revenue, screenshots, credentials, proprietary implementation files or unreleased campaign configurations are reproduced. No outcome percentage is attributed to these changes without controlled measurement.</p>
      {/* These outcomes reflect the owner's later implementation and live QA report,
          not a fresh store test performed by this portfolio or its CI workflow. */}
      <h3>Changes delivered and checks reported</h3>
      <p style={{maxWidth:850}}>The implementation work refined the landing experience and mobile spacing, connected promotional progress messaging to centrally managed metaobjects, improved the Recharge minicart, and resolved shipping for mixed subscription and one-time carts. Presentation configuration does not itself enforce gift fulfilment or shipping eligibility.</p>
      <p style={{maxWidth:850}}>The developer reported passed live checks on 23 October 2026 for add to cart, quantity controls, item removal, drawer behaviour, discounted products, and the mobile minicart. One-time, subscription-only, and mixed-cart checkout scenarios passed, with regional rates and the free-shipping threshold checked.</p>
      <h3>What still needs measurement</h3>
      <p style={{maxWidth:850}}>The audit left GA4 event validation and other acquisition and tracking actions open. Post-release conversion, revenue per session, and mobile checkout completion still require comparable measurement. Functional QA establishes tested behaviour, not a measured revenue uplift.</p>
      <p className="disclaimer">Evidence: owner-supplied Conversion Journey Audit dated 24 October 2026 and later implementation and Phase 4.4 QA reports. Internal attachments are not published. The downloadable PDF uses the same public evidence boundaries.</p>
      <div className="actions" style={{marginTop:24}}><Link href="/#work" className="button secondary"><ArrowLeft size={16}/> Back to projects</Link><a href="https://github.com/bonvallite/developer-portfolio" className="button secondary" target="_blank" rel="noopener noreferrer">GitHub portfolio <ArrowUpRight size={16}/></a></div>
    </section>
  </main>;
}
