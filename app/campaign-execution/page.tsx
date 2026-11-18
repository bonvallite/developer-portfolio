import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

// Independently written portfolio example using fictional scenarios only.
// No employer metrics, private campaign details, or proprietary implementation.
const stages = [
  { title: '01 / Discover and scope', detail: 'Define the customer segment, offer eligibility, success measures, campaign timeline and approval owners.', output: 'Requirements, risks and release checklist' },
  { title: '02 / Engineer the experience', detail: 'Plan responsive Shopify landing-page components, product discovery, offer messaging and accessible calls to action.', output: 'Theme component plan and UX acceptance criteria' },
  { title: '03 / Connect the systems', detail: 'Map consent-based email capture to an approved marketing flow, check discount rules and avoid duplicate or conflicting promotions.', output: 'Integration map and test scenarios' },
  { title: '04 / Validate before release', detail: 'Test mobile journeys, eligibility, basket behaviour, checkout continuity, analytics events and fallback behaviour.', output: 'QA evidence and go/no-go decision' },
  { title: '05 / Launch and observe', detail: 'Use a controlled release, monitor event quality and customer friction, and distinguish observed behaviour from attribution claims.', output: 'Launch log and issue triage' },
  { title: '06 / Learn and iterate', detail: 'Compare normalised trends, watch for post-launch fatigue and prepare a follow-up experiment with clear ownership.', output: 'Retrospective and prioritised backlog' },
];
const checks = ['Campaign approvals and offer eligibility', 'Responsive layout and CTA destinations', 'Consent and email flow hand-off', 'Pricing, discount stacking and checkout', 'Analytics event and attribution QA', 'Rollback and post-launch monitoring'];
export default function CampaignExecutionCaseStudy() {
  return <main>
    <header className="header container"><Link className="brand" href="/"><strong>JV.</strong><span>DEVELOPER PORTFOLIO</span></Link><nav aria-label="Page navigation"><Link href="/#work">Projects</Link><Link href="/experience">Experience</Link></nav></header>
    <section className="hero container" style={{paddingBottom:44}}>
      <div className="eyebrow"><span className="spark"/> CASE STUDY / SHOPIFY CAMPAIGN OPERATIONS</div>
      <h1>From campaign plan<br/><em>to reliable execution.</em></h1>
      <div className="hero-bottom"><p>A practical demonstration of how I connect Shopify storefront engineering, customer journeys, marketing integrations, analytics and operational QA. This is an independently written example, not a disclosure of a client's campaign.</p></div>
      <div className="hero-tags"><span>SHOPIFY</span><span>CAMPAIGN PLANNING</span><span>INTEGRATIONS</span><span>QUALITY ASSURANCE</span><span>ANALYTICS</span></div>
      <div className="actions" style={{marginTop:26}}><Link href="#process" className="button primary">Explore the delivery process <ArrowRight size={17}/></Link><Link href="/" className="button secondary"><ArrowLeft size={17}/> Back to portfolio</Link></div>
    </section>
    <section id="process" className="section container">
      <div className="section-head"><div><span className="overline">PLAN / BUILD / VALIDATE / LEARN</span><h2>Six stages of delivery<span className="dot">.</span></h2></div><p>Each stage produces a reviewable output rather than relying on a launch-day checklist alone.</p></div>
      <div className="quality-grid">{stages.map(stage=><article key={stage.title} style={{borderTop:'1px solid #73614c',padding:'22px 0'}}><span className="overline">{stage.title}</span><p>{stage.detail}</p><p><strong>Deliverable:</strong> {stage.output}</p></article>)}</div>
    </section>
    <section className="section container">
      <div className="section-head"><div><span className="overline">EXECUTION CONTROL</span><h2>Release-readiness checklist<span className="dot">.</span></h2></div></div>
      <div className="quality-grid">{checks.map(check=><article key={check} style={{display:'flex',gap:12,alignItems:'flex-start'}}><CheckCircle2 size={20} aria-hidden="true"/><p>{check}</p></article>)}</div>
      <p className="disclaimer">This checklist illustrates a recommended QA framework. It does not claim that every item was completed in any particular client release.</p>
    </section>
    <section className="section container">
      <div className="section-head"><div><span className="overline">ILLUSTRATIVE ANALYSIS</span><h2>What happens after day one?<span className="dot">.</span></h2></div></div>
      <p>A fictional launch might show an initial surge followed by weaker engagement. Rather than treating the spike as proof of technical causation, I would separate offer attractiveness, audience selection, discount economics, tracking reliability and storefront friction. The next step is a controlled follow-up test, not an unsupported uplift claim.</p>
      <p className="disclaimer">All scenarios on this page are fictional and educational. No actual order counts, revenue, customer records, campaign schedules, or private client code are reproduced.</p>
    </section>
  </main>;
}
