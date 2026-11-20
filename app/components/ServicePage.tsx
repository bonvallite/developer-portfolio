import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import './cinematic-service.css';

// 20 November: this shared route now uses the cinematic JRV service design.
// All four indexed service pages keep their SEO canonical and data model.
// Shared server-rendered service layout. Each route supplies distinct, evidence-led
// copy and links to existing case studies. Do not add personal-name SEO or unverified
// outcomes. Contact CTA returns to the homepage's existing contact choices.
// Keep the privacy notice accessible from service pages, not just the homepage.
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
  return (
    <main className="service-page jrv-svc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webPageSchema }} />
      <header className="container service-header"><span className="jrv-svc-wordmark">{'{JRV}'}</span>
        <Link href="/" className="service-back"><ArrowLeft size={17} /> Back to portfolio</Link>
        <a href={enquiry} className="button secondary">Discuss a project <ArrowUpRight size={16} /></a>
      </header>
      <section className="container service-hero"><div className="jrv-svc-hero-grid" aria-hidden="true"/><div className="jrv-svc-hero-copy">
        <span className="overline">{content.label}</span>
        <h1>{content.heading}</h1>
        <p className="service-lead">{content.lead}</p>
        <p className="service-audience">{content.audience}</p>
        <div className="actions">
          <a href={enquiry} className="button primary">Start a conversation <ArrowUpRight size={17} /></a>
          <a href="#examples" className="button secondary">Review relevant work <ArrowRight size={17} /></a>
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
      <section className="container service-bottom-cta">
        <h2>Looking for Shopify expertise?</h2>
        <p>Share the role, store challenge, desired outcome, and any relevant technical constraints to start a practical discussion.</p>
        <a href={enquiry} className="button primary">Make an enquiry <ArrowUpRight size={17} /></a>
      </section>
      <footer className="container service-footer"><Link href="/">Shopify Commerce Engineering <ArrowRight size={15} /></Link><Link href="/privacy">Privacy and analytics</Link></footer>
    </main>
  );
}
