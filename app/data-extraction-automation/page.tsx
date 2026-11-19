import Link from 'next/link';
import type { Metadata } from 'next';

// Public-safe case study only. Do not embed employer-owned scripts, OAuth files,
// Search Console properties, advertising account identifiers or raw exports.
// Reported capabilities describe source-review findings, not a live API demo.
export const metadata: Metadata = {
  title: 'Google Search Console & Ads API Automation | Ecommerce Analytics',
  description: 'Python and JavaScript API extraction workflows for SEO, advertising and ecommerce reporting, including pagination, OAuth, CSV exports and measurement limitations.',
  alternates: { canonical: '/data-extraction-automation' },
};

const sources = [
  { name: 'Google Search Console', language: 'Python', implementation: 'OAuth credentials and token refresh, reusable Search Analytics requests, paginated CSV exports, query/page/device breakdowns and URL inspection sampling.', value: 'Understand organic discoverability, branded versus non-branded demand, page and collection visibility, device differences, keyword movement and indexing priorities.' },
  { name: 'Google Ads', language: 'JavaScript', implementation: 'Programmatic Google Ads reporting through scripted requests and structured exports for campaign and conversion analysis.', value: 'Compare spend, paid-search demand and conversion signals to inform campaign optimisation and budget allocation.' },
  { name: 'GA4 and Shopify', language: 'Measurement review', implementation: 'Cross-platform funnel and reporting reconciliation, including diagnosing differences between ecommerce orders and analytics purchase events.', value: 'Identify tracking gaps and separate traffic growth from revenue-generating visits before prioritising CRO work.' },
];

export default function DataExtractionAutomationPage() {
  return <main className="container" style={{maxWidth:960,paddingTop:72,paddingBottom:100}}>
    <Link href="/" style={{textDecoration:'underline'}}>← Back to portfolio</Link>
    <p className="overline" style={{marginTop:48}}>CASE STUDY / PYTHON / JAVASCRIPT / ECOMMERCE DATA</p>
    <h1>From API extracts to ecommerce decisions.</h1>
    <p>Built and reviewed scripted reporting workflows that turn SEO and advertising platform data into reusable datasets. The objective is not simply to download metrics: it is to help teams understand which searches and channels attract customers, where measurement is incomplete and what deserves optimisation effort.</p>
    <section className="flow-feature">
      <span className="overline">DELIVERY APPROACH</span>
      <h2>Authenticate → extract → organise → validate → analyse</h2>
      <p>Python and JavaScript workflows retrieve structured platform results, paginate where supported and export records for detailed analysis. Reused extraction functions and cached result sets reduce repeated requests. CSV outputs support further joins, trend comparisons and stakeholder reporting.</p>
    </section>
    {sources.map((source) => <section key={source.name} className="flow-feature">
      <span className="overline">{source.language.toUpperCase()}</span>
      <h2>{source.name}</h2>
      <h3>What I implemented or investigated</h3><p>{source.implementation}</p>
      <h3>Why the resulting data matters</h3><p>{source.value}</p>
    </section>)}
    <section className="flow-feature">
      <span className="overline">SEARCH CONSOLE / REPORTING DESIGN</span>
      <h2>Thirty planned outputs, with explicit coverage limits.</h2>
      <p>The reviewed Search Console script organises 30 reporting outputs, including performance trends, pages, queries, devices, search intent segments, monthly keyword positions and a sample of up to 250 high-impression URLs for URL inspection. Some outputs are API-limit explanations rather than extracted datasets and must not be counted as successful data pulls.</p>
      <p>Daily and monthly comparisons should use clearly specified reporting windows. Search Console query exports are not guaranteed to contain every anonymised or low-frequency query; pagination does not remove API coverage limits. Indexing checks should be described as sampled diagnostics.</p>
    </section>
    <section className="flow-feature">
      <span className="overline">ENGINEERING / VALIDATION</span>
      <h2>Practical reliability improvements.</h2>
      <p>The code review identified opportunities for explicit success/empty/error statuses, retry behaviour for URL inspections, missing-month handling, fixed full-month date boundaries, API-to-summary reconciliation and accurate labelling of HTTPS checks. These are recommended improvements, not claims that they have all been deployed.</p>
    </section>
    <p style={{fontSize:13,opacity:.8}}>Evidence boundary: This is a high-level description of reviewed work, not a public execution of client scripts. No private analytics exports, customer records, client account identifiers, credentials or production source are included. No revenue uplift, complete dataset coverage or GA4 extraction-script validation is claimed.</p>
    <p><Link href="/python-automation" style={{color:'#ddb682',textDecoration:'underline'}}>See related Python automation work →</Link></p>
  </main>;
}
