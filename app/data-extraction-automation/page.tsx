import Link from 'next/link';
import type { Metadata } from 'next';

// Public-safe case study only. Do not embed employer-owned scripts, OAuth files,
// Search Console properties, advertising account identifiers or raw exports.
// Reported capabilities describe source-review findings, not a live API demo.
export const metadata: Metadata = {
  title: '12-Month GA4, Search Console & Google Ads Data Extraction',
  description: '12-month reporting workflow across GA4, Search Console and Google Ads, with distinct datasets for acquisition, organic search, paid campaigns and conversions.',
  alternates: { canonical: '/data-extraction-automation' },
};

// Owner-provided source excerpt rendered as text, never executed on Vercel.
// Keep credentials and employer data out of public examples.
const monthlyKeywordCode = "def fetch_monthly_keywords():\n    monthly = {}\n    for r in get_daily_query():\n        month = r[\"keys\"][0][:7]\n        q = r[\"keys\"][1]\n        key = (q, month)\n        clicks = r.get(\"clicks\", 0)\n        impr = r.get(\"impressions\", 0)\n        pos = r.get(\"position\", 0.0)\n        if key not in monthly:\n            monthly[key] = {\"clicks\": 0, \"impr\": 0, \"pos_impr_sum\": 0.0}\n        monthly[key][\"clicks\"] += clicks\n        monthly[key][\"impr\"] += impr\n        monthly[key][\"pos_impr_sum\"] += pos * max(impr, 1)\n\n    by_query = {}\n    for (q, month), d in monthly.items():\n        avg_pos = round(d[\"pos_impr_sum\"] / max(d[\"impr\"], 1), 2)\n        ctr = round(d[\"clicks\"] / d[\"impr\"], 6) if d[\"impr\"] > 0 else 0.0\n        by_query.setdefault(q, []).append((month, d[\"clicks\"], d[\"impr\"], ctr, avg_pos))\n\n    out = []\n    for q, series in sorted(by_query.items()):\n        series.sort(key=lambda item: item[0])\n        prev_pos = None\n        for month, clicks, impr, ctr, avg_pos in series:\n            pos_delta = round(prev_pos - avg_pos, 2) if prev_pos is not None else \"\"\n            out.append([month, q, clicks, impr, ctr, avg_pos, prev_pos if prev_pos is not None else \"\", pos_delta])\n            prev_pos = avg_pos\n    return out";

// Three data sources serve distinct questions. GSC Python and Google Ads JavaScript
// were source-reviewed; GA4 Google Cloud API authentication was owner-reported.
// Do not imply all three connectors run from one Python script or are fully validated.
const sources = [
  { name: 'Google Search Console', language: 'Python', implementation: 'OAuth credentials and token refresh, reusable Search Analytics requests, paginated CSV exports, query/page/device breakdowns and URL inspection sampling.', value: 'Understand organic discoverability, branded versus non-branded demand, page and collection visibility, device differences, keyword movement and indexing priorities.' },
  { name: 'Google Ads', language: 'JavaScript / GAQL', implementation: 'Google Ads Scripts define 20 reporting categories with 24 CSV output targets spanning campaigns, ad groups, creative assets, keywords, search terms, devices, locations, conversions and budgets.', value: 'Evaluate paid traffic quality, advertising cost, conversion value and campaign efficiency for budgeting and optimisation.' },
  { name: 'Google Analytics 4 (GA4)', language: 'Google Cloud API / reporting', implementation: 'Configured GA4 API access and authentication through Google Cloud for a 12-month reporting workflow. GA4 extraction source code was not provided for independent review.', value: 'Study acquisition channels, traffic, device behaviour and ecommerce events; compare tracked conversions with Shopify orders while respecting attribution differences.' },
];

export default function DataExtractionAutomationPage() {
  return <main className="container" style={{maxWidth:960,paddingTop:72,paddingBottom:100}}>
    <Link href="/" style={{textDecoration:'underline'}}>← Back to portfolio</Link>
    <p className="overline" style={{marginTop:48}}>CASE STUDY / PYTHON / JAVASCRIPT / ECOMMERCE DATA</p>
    <h1>12 months of ecommerce data. Three Google platforms.</h1>
    <p>Developed a 12-month reporting workflow across Google Analytics 4 (GA4), Google Search Console and Google Ads. It is designed to extract multiple separate datasets, not just summary dashboard screenshots, so ecommerce teams can examine traffic, organic discovery, campaign spend, conversion signals and measurement gaps over time.</p>
    <section className="flow-feature">
      <span className="overline">DELIVERY APPROACH</span>
      <h2>Authenticate → extract 12-month data → export distinct datasets → analyse</h2>
      <p>The reporting approach combines Python API work (including Search Console), Google Cloud API access for GA4, and JavaScript Google Ads Scripts. Each source has its own dimensions and output datasets, for example daily organic queries and pages, advertising campaigns and search terms, and GA4 acquisition and ecommerce measurements. CSV exports make the underlying records available for monthly trends, cross-platform comparisons and deeper business reporting. Successful execution and complete dataset coverage must be validated separately.</p>
    </section>
    {sources.map((source) => <section key={source.name} className="flow-feature">
      <span className="overline">{source.language.toUpperCase()}</span>
      <h2>{source.name}</h2>
      <h3>What I implemented or investigated</h3><p>{source.implementation}</p>
      <h3>Why the resulting data matters</h3><p>{source.value}</p>
    </section>)}
    <section className="flow-feature">
      <span className="overline">SEARCH CONSOLE / REPORTING DESIGN</span>
      <h2>Thirty planned Search Console outputs, with explicit coverage limits.</h2>
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
    <p style={{fontSize:13,opacity:.8}}>Evidence boundary: This is a high-level description of reviewed work, not a public execution of client scripts. No private analytics exports, customer records, client account identifiers, credentials or production source are included. No revenue uplift, confirmed completion of all planned datasets or independent validation of the GA4 extraction script is claimed.</p>
    <p><Link href="/python-automation" style={{color:'#ddb682',textDecoration:'underline'}}>See related Python automation work →</Link></p>
  </main>;
}
