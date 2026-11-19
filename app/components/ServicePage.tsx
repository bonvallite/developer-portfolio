import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

// Shared server-rendered service layout. Each route supplies distinct, evidence-led
// copy and links to existing case studies. Do not add personal-name SEO or unverified
// outcomes. Contact CTA returns to the homepage's existing contact choices.
// Keep the privacy notice accessible from service pages, not just the homepage.
// Cross-link the four existing service routes without introducing unverified schema claims.
export type ServiceContent = {
  label: string;
  heading: string;
  lead: string;
  audience: string;
  areas: { title: string; description: string }[];
  process: { title: string; description: string }[];
  evidence: { title: string; description: string; href: string }[];
};

export default function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <main className="service-page">
      <header className="container service-header">
        <Link href="/" className="service-back"><ArrowLeft size={17} /> Back to portfolio</Link>
        <Link href="/#contact" className="button secondary">Discuss a role or project <ArrowUpRight size={16} /></Link>
      </header>
      <section className="container service-hero">
        <span className="overline">{content.label}</span>
        <h1>{content.heading}</h1>
        <p className="service-lead">{content.lead}</p>
        <p className="service-audience">{content.audience}</p>
        <div className="actions">
          <Link href="/#contact" className="button primary">Discuss your requirements <ArrowUpRight size={17} /></Link>
          <a href="#examples" className="button secondary">Review relevant work <ArrowRight size={17} /></a>
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
        <p className="service-disclaimer">Public examples describe documented work or independent demonstrations. They do not expose confidential client configurations or promise specific commercial results.</p>
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
        <Link href="/#contact" className="button primary">Make an enquiry <ArrowUpRight size={17} /></Link>
      </section>
      <footer className="container service-footer"><Link href="/">Shopify Commerce Engineering <ArrowRight size={15} /></Link><Link href="/privacy">Privacy and analytics</Link></footer>
    </main>
  );
}
