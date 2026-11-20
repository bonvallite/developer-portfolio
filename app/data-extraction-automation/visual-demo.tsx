'use client';

import { useMemo, useState } from 'react';
import './visual-demo.css';

// Independent fictional fixtures. This UI does not connect to a real API,
// execute employer scripts, infer actual revenue or reproduce customer data.
// Changing a source or period only switches these local sample records.
const sources = [
  { id: 'ga4', name: 'GA4', type: 'Python · Data API', detail: 'Paginated acquisition and engagement reports', file: 'ga4_acquisition_demo.csv',
    totals: ['48,260', '2.8%', '1,352'], labels: ['Sessions', 'Engagement rate', 'Illustrative conversions'],
    columns: ['date','channel','sessions','engagement_rate'], rows: [['2026-04-01','Organic Search','642','53.1%'],['2026-04-02','Direct','518','48.9%'],['2026-04-03','Paid Search','491','45.2%']], bars: [36,56,42,70,49,82,64,76] },
  { id: 'gsc', name: 'Search Console', type: 'Python · Search Analytics', detail: 'Search queries, pages and monthly trends', file: 'gsc_query_demo.csv',
    totals: ['24,910', '842', '3.4%'], labels: ['Impressions', 'Clicks', 'Illustrative CTR'],
    columns: ['query_group','clicks','impressions','ctr'], rows: [['non-brand: wagyu','124','3,950','3.1%'],['non-brand: butcher box','96','2,810','3.4%'],['brand: example','188','1,730','10.9%']], bars: [42,50,43,68,54,75,66,88] },
  { id: 'ads', name: 'Google Ads', type: 'JavaScript · Ads Scripts', detail: 'Campaign, search and creative export categories', file: 'google_ads_campaign_demo.csv',
    totals: ['$1,240', '3,620', '2.5%'], labels: ['Example spend', 'Example clicks', 'Example CTR'],
    columns: ['campaign','clicks','cost','ctr'], rows: [['Search | Non-brand','721','$314.00','3.2%'],['Shopping | Example','563','$286.00','2.8%'],['Search | Brand','305','$102.00','5.7%']], bars: [39,44,59,50,66,61,77,84] },
  { id: 'bing', name: 'Bing Webmaster', type: 'Python · JSON API', detail: 'Configured query and sitemap endpoint samples', file: 'bing_endpoint_demo.csv',
    totals: ['10', '7', '3'], labels: ['Sample endpoints', 'Example OK', 'Example review'],
    columns: ['endpoint','status','records','note'], rows: [['QueryStats','OK','42','Sample only'],['PageStats','OK','18','Sample only'],['CrawlErrors','REVIEW','0','Permission check']], bars: [72,59,78,65,51,71,57,80] },
  { id: 'klaviyo', name: 'Klaviyo', type: 'Aggregate export · illustrative', detail: 'Campaign and flow metrics in separate datasets', file: 'email_campaign_demo.csv',
    totals: ['12', '37.2%', '2.7%'], labels: ['Sample campaigns', 'Example open rate', 'Example click rate'],
    columns: ['campaign','sent','open_rate','click_rate'], rows: [['Spring update','1250','38.1%','2.9%'],['Product guide','980','35.5%','2.5%'],['Welcome series','760','44.3%','4.1%']], bars: [46,58,47,62,72,60,77,67] },
  { id: 'shopify', name: 'Shopify reports', type: 'Illustrative handover · not a verified GraphQL export', detail: 'Trading and order summaries from a separate reporting source', file: 'shopify_summary_demo.csv',
    totals: ['$8,420', '67', '$126'], labels: ['Sample sales', 'Sample orders', 'Example AOV'],
    columns: ['date','orders','gross_sales','refunds'], rows: [['2026-04-01','22','$2,710','$0'],['2026-04-02','17','$2,085','$70'],['2026-04-03','28','$3,625','$0']], bars: [52,68,45,73,61,82,65,91] },
] as const;

type SourceId = typeof sources[number]['id'];
const stages = [
  { name: 'Authorise', tag: '01 · ACCESS', text: 'Check permissions and credentials within each platform. No credentials are used in this demo.' },
  { name: 'Extract', tag: '02 · RETRIEVE', text: 'Run platform-specific requests or import existing exports. The original tools differ by source.' },
  { name: 'Validate', tag: '03 · QUALITY', text: 'Review dimensions, missing fields, paging, date coverage, and separate failure statuses.' },
  { name: 'Package', tag: '04 · HANDOVER', text: 'Prepare source-labelled CSVs and a manifest so evidence stays auditable.' },
] as const;
const periods = [
  { id: 'sample', label: 'Sample month', multiplier: 1 },
  { id: 'quarter', label: 'Sample quarter', multiplier: 1.18 },
  { id: 'year', label: 'Sample year', multiplier: 0.9 },
] as const;

function csvCell(value: string) {
  return '"' + value.replace(/"/g, '""') + '"';
}

export default function VisualDemo() {
  const [selected, setSelected] = useState<SourceId>('ga4');
  const [stage, setStage] = useState(0);
  const [period, setPeriod] = useState<typeof periods[number]['id']>('sample');
  const current = sources.find(s => s.id === selected) ?? sources[0];
  const selectedPeriod = periods.find(p => p.id === period) ?? periods[0];

  // Scale only the fictional chart bars; never imply that these are measured
  // historical totals. Source-specific metric labels remain clearly illustrative.
  const heights = useMemo(() => current.bars.map(v => Math.min(95, Math.round(v * selectedPeriod.multiplier))), [current, selectedPeriod]);

  function downloadCsv() {
    const text = [current.columns, ...current.rows].map(row => row.map(v => csvCell(String(v))).join(',')).join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fictional_' + current.file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return <section id="visual-demo" className="pa-demo case-shell case-section" aria-labelledby="pa-demo-heading">
    <p className="case-kicker">03 / INTERACTIVE VISUAL DEMONSTRATION</p>
    <div className="pa-demo-heading">
      <div>
        <h2 id="pa-demo-heading">Explore the architecture. Test the reporting handover.</h2>
        <p className="case-section-intro">Select a source to trace its journey through extraction, checks and CSV delivery. Then inspect a working dashboard mock-up with fictional records. Nothing here connects to customer accounts.</p>
      </div>
      <span className="pa-demo-status">LOCAL DEMO · FICTIONAL DATA</span>
    </div>
    <div className="pa-demo-frame">
      <div className="pa-demo-toolbar"><span className="pa-demo-dots" aria-hidden="true"><i/><i/><i/></span><strong>REPORTING ARCHITECTURE</strong><span className="pa-demo-toolbar-note">Interactive system map</span></div>
      <div className="pa-demo-diagram">
        <div className="pa-demo-sources">
          <p className="pa-demo-eyebrow">A · DATA SOURCES</p>
          <div className="pa-demo-source-grid" role="group" aria-label="Choose a reporting source">
            {sources.map(s => <button type="button" key={s.id} className={'pa-demo-source' + (selected === s.id ? ' is-selected' : '')} aria-pressed={selected === s.id} onClick={() => { setSelected(s.id); setStage(0); }}><span className="pa-demo-source-mark" aria-hidden="true">{s.name.slice(0,2).toUpperCase()}</span><span>{s.name}</span></button>)}
          </div>
        </div>
        <div className="pa-demo-diagram-arrow" aria-hidden="true"><span/></div>
        <div className="pa-demo-process">
          <p className="pa-demo-eyebrow">B · SOURCE-SPECIFIC PROCESSING</p>
          <div className="pa-demo-steps">
            {stages.map((s,i) => <button key={s.name} className={'pa-demo-step' + (stage===i ? ' is-selected' : '')} type="button" aria-pressed={stage===i} onClick={() => setStage(i)}>
              <span>{s.tag}</span><strong>{s.name}</strong>
            </button>)}
          </div>
        </div>
        <div className="pa-demo-diagram-arrow" aria-hidden="true"><span/></div>
        <div className="pa-demo-destination">
          <p className="pa-demo-eyebrow">C · DOCUMENTED OUTPUT</p>
          <div className="pa-demo-file-icon" aria-hidden="true">CSV</div>
          <strong>CSV + manifest</strong>
          <span>Separate folders by source</span>
          <span>Coverage &amp; error notes</span>
        </div>
      </div>
      <div className="pa-demo-inspector" aria-live="polite">
        <div><span className="pa-demo-eyebrow">SELECTED SOURCE</span><h3>{current.name}</h3><p>{current.type} · {current.detail}</p></div>
        <div><span className="pa-demo-eyebrow">CURRENT STEP</span><h3>{stages[stage].name}</h3><p>{stages[stage].text}</p></div>
        <button type="button" onClick={() => setStage(s => (s + 1) % stages.length)}>Next stage <span aria-hidden="true">→</span></button>
      </div>
    </div>

    <div className="pa-demo-dashboard" aria-label="Interactive fictional analytics dashboard">
      <div className="pa-demo-dashboard-head">
        <div><span className="pa-demo-eyebrow">WORKING REPORT MOCK-UP</span><h3>Commerce intelligence workspace</h3><p>Dashboard preview · selected data source: <strong>{current.name}</strong></p></div>
        <label className="pa-demo-filter">Sample period
          <select value={period} onChange={e => setPeriod(e.target.value as typeof period)} aria-label="Choose fictional report period">
            {periods.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </label>
      </div>
      <div className="pa-demo-kpis">{current.totals.map((total,i) => <div key={current.labels[i]} className="pa-demo-kpi"><span>{current.labels[i]}</span><strong>{total}</strong><small>FICTIONAL EXAMPLE</small></div>)}</div>
      <div className="pa-demo-dashboard-grid">
        <div className="pa-demo-panel"><div className="pa-demo-panel-head"><strong>Sample reporting trend</strong><span>8 illustrative points</span></div><div className="pa-demo-chart" role="img" aria-label={'Fictional eight-point bar chart for ' + current.name}>{heights.map((height,i) => <div className="pa-demo-chart-col" key={i}><div style={{height:height+'%'}}/><span>{'W'+(i+1)}</span></div>)}</div><p className="pa-demo-chart-foot">Switching the period alters the illustrative chart only. KPI totals and CSV rows are fixed fictional fixtures, not aggregated reporting.</p></div>
        <div className="pa-demo-panel pa-demo-table-panel"><div className="pa-demo-panel-head"><strong>CSV output preview</strong><span>{current.file}</span></div><div className="pa-demo-table-scroll"><table><thead><tr>{current.columns.map(x=><th key={x}>{x.replace(/_/g,' ')}</th>)}</tr></thead><tbody>{current.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div><button className="pa-demo-export" type="button" onClick={downloadCsv}>Download fictional CSV <span aria-hidden="true">↓</span></button></div>
      </div>
    </div>
    <p className="pa-demo-disclosure"><strong>Prototype, not an integrated dashboard.</strong> All figures and exports are invented for interaction testing. Source buttons, stages, period selector, and CSV download work locally. This does not run GA4, Search Console, Ads, Bing, Klaviyo or Shopify APIs, reconcile real metrics, or establish extraction success.</p>
  </section>;
}
