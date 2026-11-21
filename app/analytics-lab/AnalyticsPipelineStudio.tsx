'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BookOpenText, Braces, CheckCircle2, Code2,
  Database, FileCheck2, ShieldCheck,
} from 'lucide-react';

// A public educational inspector, not a Python runtime or data connector.
// Stage selection changes the explanation only. The four source examples are
// shortened, sanitised/adapted excerpts grounded in the owner's published
// 17-file source archive. Output tables are entirely fictional and do not
// claim that these particular CSVs were produced by an authenticated run.
// No credentials, private IDs, customer records or network requests.
const stages = [
  {
    tag: '01 / DEFINE',
    title: 'Start with the reporting contract.',
    label: 'Brief',
    short: 'Agree the questions',
    description: 'Specify source, fields, grain and time windows before extraction. The historical brief asked for twelve complete months and the current month separately, rather than dashboard screenshots.',
    deliverable: 'A source-and-field inventory with source-specific definitions.',
    risk: 'Rolling 365-day data and twelve completed calendar months are not equivalent.',
  },
  {
    tag: '02 / AUTHORISE',
    title: 'Treat access as a boundary.',
    label: 'Authorise',
    short: 'Check permissions',
    description: 'GA4 and Search Console use different scopes, clients and property identifiers. Real credentials must be held outside source control and used only in an authorised runtime.',
    deliverable: 'Permission checks and independently configured, read-only clients.',
    risk: 'This browser demo has no credentials and never opens a platform connection.',
  },
  {
    tag: '03 / EXTRACT',
    title: 'Retrieve more than the first page.',
    label: 'Extract',
    short: 'Paginate or chunk',
    description: 'The GA4 modules use response row counts and request offsets. High-volume Search Console queries can be divided into shorter date windows, with source coverage limitations recorded.',
    deliverable: 'Source-labelled rows and explicit date-window coverage.',
    risk: 'A successful API response does not guarantee a complete dataset.',
  },
  {
    tag: '04 / VALIDATE',
    title: 'Make failures visible.',
    label: 'Validate',
    short: 'Inspect the evidence',
    description: 'Review missing dimensions, compatible query combinations, duplicate dates, incomplete response pages, and bounded inspection retries. Preserve errors rather than silently substituting zeros.',
    deliverable: 'A validation trail and individual dataset statuses.',
    risk: 'GA4 event totals should not be presented as a sequenced user funnel.',
  },
  {
    tag: '05 / HANDOVER',
    title: 'Deliver data someone can audit.',
    label: 'Package',
    short: 'Export and explain',
    description: 'Export CSVs with stable headers, explain column meanings, and provide a manifest identifying complete outputs, exceptions and documentation-only datasets.',
    deliverable: 'Analyst-ready, source-specific files with documented limitations.',
    risk: 'A prepared schema is not proof that every planned export succeeded.',
  },
] as const;

const examples = [
  {
    key: 'acquisition',
    title: 'GA4 acquisition',
    file: '01_daily_acquisition.py',
    question: 'How did sessions, users, transactions and revenue vary by source and campaign?',
    code: [
      'offset = 0',
      'while True:',
      '    request = RunReportRequest(',
      '        property=f"properties/{property_id}",',
      '        dimensions=dimensions,',
      '        metrics=metrics,',
      '        date_ranges=date_ranges,',
      '        limit=PAGE_SIZE,',
      '        offset=offset,',
      '    )',
      '    response = client.run_report(request)',
      '    offset += len(response.rows)',
      '    if not response.rows or offset >= response.row_count:',
      '        break',
    ],
    note: 'Offset pagination continues until the response row count is exhausted. Access and metric definitions still need independent validation.',
    columns: ['date', 'source', 'sessions', 'orders'],
    rows: [
      ['2026-04-01', 'Organic Search', '642', '8'],
      ['2026-04-02', 'Direct', '518', '11'],
      ['2026-04-03', 'Paid Search', '491', '5'],
    ],
  },
  {
    key: 'funnel',
    title: 'GA4 funnel events',
    file: '05_purchase_funnel.py',
    question: 'How many times did the key commerce events occur on each day?',
    code: [
      'FUNNEL_STEPS = [',
      '    "view_item", "add_to_cart",',
      '    "begin_checkout", "purchase"',
      ']',
      'headers = ["date"] + FUNNEL_STEPS',
      'rows = [',
      '    [d] + [daily_funnel[d][step] for step in FUNNEL_STEPS]',
      '    for d in sorted(daily_funnel.keys())',
      ']',
    ],
    note: 'These are event totals per date. They are not deduplicated users or a verified sequence of individual customers.',
    columns: ['date', 'view_item', 'add_to_cart', 'purchase'],
    rows: [
      ['2026-04-01', '1,220', '174', '19'],
      ['2026-04-02', '1,350', '188', '23'],
      ['2026-04-03', '1,105', '161', '17'],
    ],
  },
  {
    key: 'search',
    title: 'GSC date chunks',
    file: 'gsc_03_export_all_30_full.py',
    question: 'How can a large query-and-page report be split into manageable requests?',
    code: [
      'cur = start_dt',
      'while cur <= end_dt:',
      '    c_end = min(cur + datetime.timedelta(days=29), end_dt)',
      '    for r in query_rows(',
      '        service, SITE_URL,',
      '        cur.strftime("%Y-%m-%d"),',
      '        c_end.strftime("%Y-%m-%d"),',
      '        ["date", "query", "page"], "web"',
      '    ):',
      '        out.append([r["keys"][0], r["keys"][1], r["keys"][2]]',
      '                   + metric_cols(r))',
      '    cur = c_end + datetime.timedelta(days=1)',
    ],
    note: 'Thirty-day chunks support extraction management, but Search Console may still limit returned query coverage.',
    columns: ['date', 'query_group', 'clicks', 'impressions'],
    rows: [
      ['2026-04-01', 'non-brand example', '124', '3,950'],
      ['2026-04-02', 'product guide', '96', '2,810'],
      ['2026-04-03', 'brand example', '188', '1,730'],
    ],
  },
  {
    key: 'recovery',
    title: 'Inspection retries',
    file: 'gsc_07_finish_19_21_24.py',
    question: 'What happens when a Search Console URL inspection request fails?',
    code: [
      'def inspect_with_retry(service, url, retries=2):',
      '    for attempt in range(retries + 1):',
      '        try:',
      '            resp = service.urlInspection().index().inspect(',
      '                body={"inspectionUrl": url, "siteUrl": SITE_URL}',
      '            ).execute()',
      '            return resp.get("inspectionResult", {})',
      '        except Exception as exc:',
      '            if attempt < retries:',
      '                time.sleep(1.5)',
      '            else:',
      '                return {}, str(exc)',
    ],
    note: 'Bounded retries separate an error from a successful inspection. The example output is not a real URL index status.',
    columns: ['example_url', 'attempts', 'result', 'coverage'],
    rows: [
      ['/product-example', '1', 'sample OK', 'illustrative'],
      ['/collection-example', '3', 'sample error', 'unverified'],
      ['/about-example', '2', 'sample OK', 'illustrative'],
    ],
  },
] as const;

const archive = '/case-studies/ecommerce-analytics/sanitised-python-source-archive.md';

export default function AnalyticsPipelineStudio() {
  const [step, setStep] = useState(2);
  const [example, setExample] = useState<(typeof examples)[number]['key']>('acquisition');
  const currentStage = stages[step];
  const currentExample = examples.find(item => item.key === example) ?? examples[0];

  return (
    <section className="al-engineering-studio" aria-label="Interactive Python reporting engineering studio">
      <div className="al-studio-chrome">
        <span className="al-studio-dots" aria-hidden="true"><i/><i/><i/></span>
        <strong>JRV / PYTHON ENGINEERING STUDIO</strong>
        <span>REVIEWED PATTERNS · NO LIVE APIS</span>
      </div>

      <div className="al-studio-intro">
        <div>
          <span>TRACE THE WORKFLOW / FIVE DECISIONS</span>
          <h3>From an ambiguous brief to auditable reporting.</h3>
          <p>Select a stage to inspect the engineering decision, its expected output, and the limitation that needs checking.</p>
        </div>
        <div className="al-studio-count"><strong>17</strong><span>SANITISED PYTHON FILES IN THE PUBLIC ARCHIVE</span></div>
      </div>

      <div className="al-studio-steps" role="group" aria-label="Python reporting stages">
        {stages.map((item, i) => (
          <button key={item.tag} type="button" aria-pressed={step === i}
            className={(step === i ? 'is-selected ' : '') + (i < step ? 'is-reviewed' : '')}
            onClick={() => setStep(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
            <small>{item.short}</small>
          </button>
        ))}
      </div>
      <div className="al-studio-stage-detail">
        <div>
          <span className="al-studio-eyebrow">{currentStage.tag}</span>
          <h4 aria-live="polite" aria-atomic="true">{currentStage.title}</h4>
          <p>{currentStage.description}</p>
          <div className="al-studio-deliverable"><FileCheck2 size={19} aria-hidden="true"/>
            <span><strong>Deliverable</strong>{currentStage.deliverable}</span></div>
          <div className="al-studio-limits"><ShieldCheck size={18} aria-hidden="true"/>
            <span><strong>What to verify:</strong> {currentStage.risk}</span></div>
        </div>
        <div className="al-studio-stage-nav">
          <span>{step + 1} / {stages.length}</span>
          <div>
            <button type="button" disabled={step === 0} onClick={() => setStep(i => Math.max(0, i - 1))}>Previous</button>
            <button type="button" disabled={step === stages.length - 1} onClick={() => setStep(i => Math.min(stages.length - 1, i + 1))}>Next stage <ArrowRight size={15} aria-hidden="true"/></button>
          </div>
        </div>
      </div>

      <div className="al-studio-source-head">
        <div><span>EXPLORE THE IMPLEMENTATION</span><h3>Read the Python. Understand the trade-off.</h3>
          <p>Adapted, sanitised excerpts from the published source archive. The preview records below are fictional examples, not outputs from these scripts.</p>
        </div>
        <Link href={archive} target="_blank" rel="noopener noreferrer">
          Read the 17-file archive <BookOpenText size={16} aria-hidden="true"/>
        </Link>
      </div>
      <div className="al-studio-workspace">
        <div className="al-studio-example-tabs" role="group" aria-label="Select Python implementation excerpt">
          {examples.map(item => <button key={item.key} type="button"
            aria-pressed={example === item.key}
            className={example === item.key ? 'is-active' : ''}
            onClick={() => setExample(item.key)}>
            <span>{item.title}</span><small>{item.file}</small>
          </button>)}
        </div>
        <div className="al-studio-source-window">
          <div className="al-studio-source-title">
            <span><Code2 size={16} aria-hidden="true"/>{currentExample.file}</span><span>SANITISED PYTHON</span>
          </div>
          <pre tabIndex={0} aria-label={'Adapted source excerpt for ' + currentExample.file}>
            <code>{currentExample.code.join('\n')}</code>
          </pre>
          <div className="al-studio-code-note"><Braces size={18} aria-hidden="true"/><p>{currentExample.note}</p></div>
        </div>
        <div className="al-studio-output">
          <div className="al-studio-output-head">
            <span><Database size={16} aria-hidden="true"/> FICTIONAL OUTPUT PREVIEW</span><span>CSV SHAPE</span>
          </div>
          <p className="al-studio-question">{currentExample.question}</p>
          <div className="al-studio-table-scroll">
            <table>
              <thead><tr>{currentExample.columns.map(col => <th key={col} scope="col">{col}</th>)}</tr></thead>
              <tbody>{currentExample.rows.map((row, idx) => <tr key={idx}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="al-studio-output-foot"><CheckCircle2 size={16} aria-hidden="true"/><span>Example records only. No client records or API results.</span></div>
        </div>
      </div>
      <div className="al-studio-bottom">
        <span>DATA-GROUNDED ENGINEERING · FICTIONAL RESULTS · NO CREDENTIALS</span>
        <Link href="/data-extraction-automation#source-lab">View the full extraction case study <ArrowRight size={16} aria-hidden="true"/></Link>
      </div>
    </section>
  );
}
