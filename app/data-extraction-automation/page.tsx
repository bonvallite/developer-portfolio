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

// Owner-provided source excerpt rendered as text, never executed on Vercel.
// Keep credentials and employer data out of public examples.
const monthlyKeywordCode = "def fetch_monthly_keywords():\n    monthly = {}\n    for r in get_daily_query():\n        month = r[\"keys\"][0][:7]\n        q = r[\"keys\"][1]\n        key = (q, month)\n        clicks = r.get(\"clicks\", 0)\n        impr = r.get(\"impressions\", 0)\n        pos = r.get(\"position\", 0.0)\n        if key not in monthly:\n            monthly[key] = {\"clicks\": 0, \"impr\": 0, \"pos_impr_sum\": 0.0}\n        monthly[key][\"clicks\"] += clicks\n        monthly[key][\"impr\"] += impr\n        monthly[key][\"pos_impr_sum\"] += pos * max(impr, 1)\n\n    by_query = {}\n    for (q, month), d in monthly.items():\n        avg_pos = round(d[\"pos_impr_sum\"] / max(d[\"impr\"], 1), 2)\n        ctr = round(d[\"clicks\"] / d[\"impr\"], 6) if d[\"impr\"] > 0 else 0.0\n        by_query.setdefault(q, []).append((month, d[\"clicks\"], d[\"impr\"], ctr, avg_pos))\n\n    out = []\n    for q, series in sorted(by_query.items()):\n        series.sort(key=lambda item: item[0])\n        prev_pos = None\n        for month, clicks, impr, ctr, avg_pos in series:\n            pos_delta = round(prev_pos - avg_pos, 2) if prev_pos is not None else \"\"\n            out.append([month, q, clicks, impr, ctr, avg_pos, prev_pos if prev_pos is not None else \"\", pos_delta])\n            prev_pos = avg_pos\n    return out";

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
    {/* Read-only excerpt from the supplied GSC script. No tokens or private data.
        get_daily_query() is defined elsewhere in the owner's source. */}
    <section className="flow-feature" id="python-code">
      <span className="overline">REAL PYTHON / MONTHLY SEO INTELLIGENCE</span>
      <h2>Inside the reporting logic.</h2>
      <p>This selected function from my Google Search Console script aggregates daily query metrics into monthly trends, calculates impression-weighted search positions and compares observed periods.</p>
      <div style={{border:'1px solid #6a573f',borderRadius:12,overflow:'hidden',background:'#0b0e12'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12,padding:'12px 18px',background:'#1b1e23',borderBottom:'1px solid #3d3931'}}>
          <strong style={{fontSize:13,color:'#d9b47c'}}>monthly_keyword_trends.py</strong>
          <span style={{fontSize:12,color:'#a4a6ae'}}>Python · Source excerpt · Read-only</span>
        </div>
        <pre style={{margin:0,padding:'22px 20px',overflowX:'auto',fontSize:12,lineHeight:1.8,color:'#e6e5e1',tabSize:4}}><code>{monthlyKeywordCode}</code></pre>
      </div>
      <p style={{fontSize:13}}>This is an excerpt of real aggregation logic, not a live API execution. The complete script supplies <code>get_daily_query()</code>. Missing calendar months and Search Console API coverage still require validation.</p>
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
