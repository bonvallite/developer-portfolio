import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import './cinematic-service.css';

// 20 November: this shared route now uses the cinematic JRV service design.
// All four indexed service pages keep their SEO canonical and data model.
// Shared server-rendered service layout. Each route supplies distinct, evidence-led
// copy and links to existing case studies. Do not add personal-name SEO or unverified
// outcomes. Contact CTA returns to the homepage's existing contact choices.
// Keep the privacy notice accessible from service pages, not just the homepage.
// Project and hiring enquiries use separate fixed mailto templates. Only
// consent-gated, allowlisted intent/source markers enter the click counter;
// no visitor-entered text, role descriptions or mailto URLs enter analytics.
// Cross-link the four existing service routes. Minimal WebPage JSON-LD repeats only
// visible route content and the explicit canonical path; never include identity claims.
export type ServiceContent = {
  path: string;
  label: string;
  heading: string;
  lead: string;
  audience: string;
  areas: { title: string; description: string }[];
  process: { title: string; description: string }[];
  evidence: { title: string; description: string; href: string }[];
};

export default function ServicePage({ content }: { content: ServiceContent }) {
  // Serialize JSON as inert script data, escaping HTML-significant characters.
  const webPageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.heading,
    description: content.lead,
    url: `https://www.jrvallite.com${content.path}`,
  }).replace(/</g, '\\u003c');
  const enquiry = 'mailto:hello@jrvallite.com?subject=' +
    encodeURIComponent('Shopify project enquiry | JRV') + '&body=' +
    encodeURIComponent('I viewed ' + content.heading + '.\n\nBusiness or company:\nChallenge:\nDesired outcome:\nTimeline:\n');
  // Static prompt only: unlike the homepage composer, neither mailto contains
  // visitor-entered information. The same message is used across service routes.
  const hiringEnquiry = 'mailto:hello@jrvallite.com?subject=' +
    encodeURIComponent('Shopify / ecommerce hiring enquiry | JRV') + '&body=' +
    encodeURIComponent('Company:\nRole title:\nResponsibilities:\nEmployment arrangement:\nNext step:\n');
  return (
    <main className="service-page jrv-svc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webPageSchema }} />
      <header className="container service-header"><span className="jrv-svc-wordmark">{'{JRV}'}</span>
        <Link href="/" className="service-back"><ArrowLeft size={17} /> Back to portfolio</Link>
        <a href={enquiry} className="button secondary" data-jrv-track="email" data-jrv-intent="project" data-jrv-source="service_page">Discuss a project <ArrowUpRight size={16} /></a>
      </header>
      <section className="container service-hero"><div className="jrv-svc-hero-grid" aria-hidden="true"/><div className="jrv-svc-hero-copy">
        <span className="overline">{content.label}</span>
        <h1>{content.heading}</h1>
        <p className="service-lead">{content.lead}</p>
        <p className="service-audience">{content.audience}</p>
        <div className="actions">
          <a href={enquiry} className="button primary" data-jrv-track="email" data-jrv-intent="project" data-jrv-source="service_page">Discuss a Shopify project <ArrowUpRight size={17} /></a>
          <a href={hiringEnquiry} className="button secondary" data-jrv-track="email" data-jrv-intent="hiring" data-jrv-source="service_page">Discuss a hiring role <ArrowUpRight size={17} /></a>
          <a href="#examples" className="jrv-svc-evidence-link">Review relevant work <ArrowRight size={17} /></a>
        </div></div>
        <div className="jrv-svc-hero-art" aria-label="Illustrative engineering process, from discovery to verification">
          <div className="jrv-svc-art-heading"><span>JRV / COMMERCE ENGINEERING</span><span>01 → 03</span></div>
          <div className="jrv-svc-art-body"><span className="overline">A CONNECTED APPROACH</span><h2>Clarity.<br/><em>Then action.</em></h2><div className="jrv-svc-art-steps"><div><b>01</b><strong>Understand</strong><small>Problem & scope</small></div><div><b>02</b><strong>Engineer</strong><small>Design & systems</small></div><div><b>03</b><strong>Verify</strong><small>Quality & evidence</small></div></div></div><div className="jrv-svc-art-footer">RESPONSIVE / RELIABLE / DOCUMENTED <CheckCircle2 size={16} aria-hidden="true"/></div>
        </div>
      </section>
      <section className="container section service-section" aria-labelledby="service-scope">
        <span className="overline">CAPABILITIES</span><h2 id="service-scope">What this work covers</h2>
        <div className="service-card-grid">{content.areas.map(area => <article key={area.title}><h3>{area.title}</h3><p>{area.description}</p></article>)}</div>
      </section>
      <section className="service-stripe">
        <div className="container section service-section" aria-labelledby="service-approach">
          <span className="overline">DELIVERY APPROACH</span><h2 id="service-approach">From requirements to verified changes</h2>
          <div className="service-card-grid">{content.process.map((step, index) => <article key={step.title}><span className="overline">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
        </div>
      </section>
      <section id="examples" className="container section service-section" aria-labelledby="service-evidence">
        <span className="overline">PROJECT EVIDENCE</span><h2 id="service-evidence">Related case studies and demonstrations</h2>
        <p className="service-disclaimer"><ShieldCheck size={18} aria-hidden="true"/> Public examples describe documented work or independent demonstrations. They do not expose confidential client configurations or promise specific commercial results.</p>
        <div className="service-card-grid">{content.evidence.map(item => <article key={item.href}><h3>{item.title}</h3><p>{item.description}</p><Link href={item.href}>Explore project <ArrowUpRight size={16} /></Link></article>)}</div>
      </section>
      <nav className="container section service-section" aria-label="Explore other Shopify services">
        <span className="overline">EXPLORE SERVICES</span>
        <h2>Related Shopify expertise</h2>
        <div className="service-card-grid">
          <Link href="/shopify-developer">Shopify development <ArrowUpRight size={16} /></Link>
          <Link href="/ecommerce-management">Ecommerce management <ArrowUpRight size={16} /></Link>
          <Link href="/shopify-cro">Conversion rate optimisation <ArrowUpRight size={16} /></Link>
          <Link href="/shopify-app-development">Custom apps and integrations <ArrowUpRight size={16} /></Link>
        </div>
      </nav>
      {/* Keep merchant enquiries and recruitment distinct at the decision point.
          These are fixed email templates, not submission forms or verified leads. */}
      <section className="container service-bottom-cta" aria-labelledby="jrv-svc-next-title">
        <span className="overline">YOUR NEXT STEP</span>
        <h2 id="jrv-svc-next-title">Choose the right conversation.</h2>
        <p>Whether you need a Shopify improvement or are building an ecommerce team, start with the requirement. Both options open a draft in your own email app.</p>
        <div className="jrv-svc-contact-routes">
          <article>
            <span className="overline">01 / MERCHANTS &amp; STORES</span>
            <h3>Have a project to solve?</h3>
            <p>Tell me about the storefront, integration, or conversion problem and what success would look like.</p>
            <a href={enquiry} className="button primary" data-jrv-track="email" data-jrv-intent="project" data-jrv-source="service_page">Send a project enquiry <ArrowUpRight size={17} aria-hidden="true" /></a>
          </article>
          <article>
            <span className="overline">02 / HIRING TEAMS</span>
            <h3>Hiring Shopify expertise?</h3>
            <p>Share the role, responsibilities, and employment arrangement, or review the experience and résumé first.</p>
            <a href={hiringEnquiry} className="button secondary" data-jrv-track="email" data-jrv-intent="hiring" data-jrv-source="service_page">Discuss a hiring role <ArrowUpRight size={17} aria-hidden="true" /></a>
            <Link href="/experience" className="jrv-svc-evidence-link">Review experience <ArrowRight size={16} aria-hidden="true" /></Link>
          </article>
        </div>
        <p className="jrv-svc-contact-note">No message is sent until you choose to send it. Please leave customer records and confidential credentials out of initial enquiries.</p>
      </section>
      <footer className="container service-footer"><Link href="/">Shopify Commerce Engineering <ArrowRight size={15} /></Link><Link href="/privacy">Privacy and analytics</Link></footer>
    </main>
  );
}
