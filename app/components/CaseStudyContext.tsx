import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Public case-study evidence navigation. Links are to service pages on this site,
// not to personally identifying profiles. Summaries must describe documented
// capabilities only; they do not imply measured commercial improvement.
type ServiceLink = { title: string; href: string; description: string };
type Props = {
  summary: string;
  evidenceLimit: string;
  services: ServiceLink[];
};

export default function CaseStudyContext({ summary, evidenceLimit, services }: Props) {
  return (
    <section className="container section case-context" aria-label="Case study evidence and related Shopify services">
      <span className="overline">CASE STUDY / TECHNICAL EVIDENCE</span>
      <h2>What this project demonstrates</h2>
      <p>{summary}</p>
      <p className="case-context-limit"><strong>Evidence boundary:</strong> {evidenceLimit}</p>
      <h3>Related Shopify expertise</h3>
      <div className="case-context-grid">
        {services.map(item => <article key={item.href}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <Link href={item.href}>Explore this service <ArrowUpRight size={15} /></Link>
        </article>)}
      </div>
      <Link className="button secondary" href="/#contact">Discuss a Shopify role or project <ArrowUpRight size={16} /></Link>
    </section>
  );
}
