'use client';
/**
 * Public-safe eCommerce analytics engineering lab.
 * All metrics are synthetic; transformations run in-browser with no API requests.
 * GA4/GSC source is published separately as a 17-file sanitised archive;
 * the new inspector uses adapted excerpts, never executed in the browser.
 * The redesigned hero and studio are visual-only; existing dashboard maths,
 * CSV download, reconciliation limits, metadata and privacy stay unchanged.
 * The final enquiry panel uses fixed mailto links and internal navigation only:
 * no form submission, personal message capture or new tracking is introduced.
 */
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,BarChart3,FileDown,ShieldCheck,Code2,CheckCircle2} from 'lucide-react';
import './analytics-lab.css';
import './analytics-studio.css';
import AnalyticsPipelineStudio from './AnalyticsPipelineStudio';

const funnel=[{name:'Product views',count:12000},{name:'Add to cart',count:1800},{name:'Begin checkout',count:640},{name:'Purchases',count:210}];
const channels=[{name:'Organic Search',sessions:4000,purchases:80},{name:'Paid Search',sessions:3100,purchases:42},{name:'Direct',sessions:2200,purchases:62},{name:'Email',sessions:700,purchases:26}];
const format=(n:number)=>new Intl.NumberFormat('en-AU',{maximumFractionDigits:1}).format(n);
export default function AnalyticsLab(){
 const [view,setView]=useState<'funnel'|'channels'>('funnel');
 const [shopify,setShopify]=useState(240);
 const [ga4,setGa4]=useState(210);
 const gap=shopify-ga4;
 const percent=shopify>0?gap/shopify*100:0;
 const csv='source,sessions,purchases,conversion_rate_percent\n'+channels.map(c=>[c.name,c.sessions,c.purchases,(c.purchases/c.sessions*100).toFixed(2)].join(',')).join('\n')+'\n';
 const download=()=>{const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='jrv-synthetic-acquisition.csv';a.click();URL.revokeObjectURL(url)};
 return <main className="al-page">
  <div className="al-wrap">
   <header className="al-nav"><Link href="/#work"><ArrowLeft size={16}/> Back to selected work</Link><span>{'{JRV}'} / PYTHON & ANALYTICS</span></header>
   <section className="al-hero">
    <div className="al-hero-grid">
      <div className="al-hero-copy">
        <span>PUBLIC-SAFE ENGINEERING / PYTHON · GA4 · SEARCH CONSOLE</span>
        <h1>From raw data to <em>better commerce decisions.</em></h1>
        <p>Explore the engineering behind a multi-source ecommerce reporting workflow. Inspect adapted Python code, trace validation decisions, and interrogate an interactive dashboard. All displayed metrics and records are fictional.</p>
        <div className="al-actions">
          <a href="#pipeline">Explore the Python engineering <ArrowRight size={16} aria-hidden="true"/></a>
          <a href="#dashboard">Try the fictional dashboard <BarChart3 size={16} aria-hidden="true"/></a>
        </div>
        <div className="al-hero-tags" aria-label="Technical capabilities">
          <span>API EXTRACTION</span><span>PYTHON</span><span>DATA VALIDATION</span><span>CSV DELIVERY</span>
        </div>
      </div>
      <div className="al-hero-proof" aria-label="Public source archive overview">
        <div className="al-hero-proof-top"><span className="al-hero-led" aria-hidden="true"/><strong>ENGINEERING / SOURCE ARCHIVE</strong><span>SAMPLE VIEW</span></div>
        <div className="al-hero-proof-body">
          <div className="al-hero-proof-stat"><strong>17</strong><span>sanitised Python files<br/>documented in the archive</span></div>
          <ol className="al-hero-proof-chain">
            <li><span>01</span><strong>Extract</strong><small>GA4 / GSC</small></li>
            <li><span>02</span><strong>Validate</strong><small>Pages & coverage</small></li>
            <li><span>03</span><strong>Package</strong><small>CSV + manifest</small></li>
          </ol>
          <div className="al-hero-proof-status"><CheckCircle2 size={18} aria-hidden="true"/><span><strong>Browsable engineering evidence</strong> · No live analytics API calls</span></div>
        </div>
      </div>
    </div>
   </section>
   <section id="pipeline" className="al-section al-pipeline-section">
     <span className="al-kicker">01 / THE ENGINEERING STORY</span>
     <h2>Show the decisions behind the scripts.</h2>
     <p className="al-section-lead">Move through the reporting contract, access, extraction, validation, and handover. Then inspect the Python patterns in the public, sanitised archive, alongside clearly fictional CSV examples.</p>
     <AnalyticsPipelineStudio />
   </section>
   <section id="dashboard" className="al-section"><span className="al-kicker">02 / INTERACTIVE DASHBOARD</span><h2>Explore the customer journey.</h2><div className="al-tabs" role="group" aria-label="Analytics chart"><button type="button" aria-pressed={view==='funnel'} onClick={()=>setView('funnel')}>Purchase funnel</button><button type="button" aria-pressed={view==='channels'} onClick={()=>setView('channels')}>Acquisition channels</button></div><div className="al-chart" aria-label={view==='funnel'?'Synthetic purchase funnel':'Synthetic channel sessions and purchases'}>{view==='funnel'?funnel.map((d,i)=><div className="al-chart-row" key={d.name}><span>{d.name}</span><div className="al-track"><i style={{width:(d.count/funnel[0].count*100)+'%'}}/></div><strong>{format(d.count)}</strong>{i>0&&<small>{format(d.count/funnel[i-1].count*100)}% of previous stage</small>}</div>):channels.map(d=><div className="al-chart-row" key={d.name}><span>{d.name}</span><div className="al-track"><i style={{width:(d.sessions/4000*100)+'%'}}/></div><strong>{format(d.sessions)} sessions</strong><small>{format(d.purchases/d.sessions*100)}% purchase rate</small></div>)}</div>
    <div className="al-chart-interpretation" aria-live="polite">
      <Code2 size={18} aria-hidden="true"/>
      <div>
        <strong>{view === 'funnel' ? 'Compare events, not people.' : 'Do not confuse channel attribution with causation.'}</strong>
        <p>{view === 'funnel'
          ? 'The four volumes represent illustrative event counts. Their ratios are not unique-user, time-ordered conversions and cannot establish individual drop-off.'
          : 'Sessions and purchases are fictional. Before reallocating spend, reconcile channel definitions, conversion windows, consent, and purchase-event quality.'}</p>
      </div>
    </div>
    <button className="al-download" type="button" onClick={download}><FileDown size={17} aria-hidden="true"/> Download synthetic CSV</button>
   </section>
   <section className="al-section"><span className="al-kicker">03 / DATA QUALITY</span><h2>Reconcile different purchase counts.</h2><p className="al-muted">Change the fictional counts to explore the reporting gap. GA4 and Shopify may differ because of consent, attribution, timing, event delivery and measurement definitions. This calculator does not diagnose the cause.</p><div className="al-reconcile"><label>Shopify orders <input type="number" min="1" max="100000" value={shopify} onChange={e=>setShopify(Math.max(1,Math.min(100000,Number(e.target.value)||1)))}/></label><label>GA4 purchases <input type="number" min="0" max="100000" value={ga4} onChange={e=>setGa4(Math.max(0,Math.min(100000,Number(e.target.value)||0)))}/></label><div className="al-gap" aria-live="polite"><small>SHOPIFY MINUS GA4</small><strong>{format(gap)}</strong><span>{format(percent)}% of Shopify orders</span></div></div><p className="al-muted">Compare like-for-like date ranges, currencies, purchase event definitions and time zones before interpreting the difference.</p></section>
   <section className="al-section al-lessons">
     <span className="al-kicker">04 / WHAT THE ENGINEERING ENABLES</span>
     <h2>From extraction to commercial questions.</h2>
     <div className="al-lessons-grid">
       <article><span>01 / ACQUISITION</span><h3>Find what attracts useful traffic.</h3><p>Match source, medium, campaigns and landing pages to consistent reporting definitions before comparing marketing performance.</p></article>
       <article><span>02 / CONVERSION</span><h3>Identify where to investigate friction.</h3><p>Compare device and purchase-event volumes, then validate instrumentation before making a CRO claim or testing a change.</p></article>
       <article><span>03 / DATA CONFIDENCE</span><h3>Explain discrepancies instead of hiding them.</h3><p>Document time windows, definitions, consent, missing rows and unsuccessful API requests so analysis remains auditable.</p></article>
     </div>
     <div className="al-lessons-actions"><Link href="/data-extraction-automation#source-lab">Examine the detailed extraction case study <ArrowRight size={16} aria-hidden="true"/></Link><Link href="/python-automation">See other Python projects <ArrowRight size={16} aria-hidden="true"/></Link></div>
   </section>
   {/* The final step invites a conversation without creating a lead form.
       Enquiries open the visitor's email client; the hiring link is internal. */}
   <section id="analytics-contact" className="al-contact" aria-labelledby="al-contact-title">
     <div className="al-contact-copy">
       <span className="al-kicker">05 / WORK TOGETHER</span>
       <h2 id="al-contact-title">Make the numbers useful. <em>Keep the evidence honest.</em></h2>
       <p>Need dependable ecommerce reporting, analytics QA, or a clearer view of conversion friction? Discuss a practical workflow that connects data quality with decisions.</p>
       <div className="al-contact-actions">
         <a className="al-contact-primary" href="mailto:hello@jrvallite.com?subject=Ecommerce%20analytics%20and%20CRO%20project%20%7C%20JRV">Discuss an analytics project <ArrowRight size={17} aria-hidden="true"/></a>
         <Link className="al-contact-secondary" href="/experience">Hiring? Review experience <ArrowRight size={17} aria-hidden="true"/></Link>
       </div>
       <p className="al-contact-note">Email opens in your own mail application. This page does not collect or submit your enquiry.</p>
     </div>
     <div className="al-contact-path" aria-label="Example engagement pathway">
       <span>FROM BRIEF TO BETTER DECISIONS</span>
       <ol>
         <li><strong>01 / DEFINE</strong><p>Agree on business questions, reporting windows, and definitions.</p></li>
         <li><strong>02 / VALIDATE</strong><p>Check source coverage, discrepancies, and data quality.</p></li>
         <li><strong>03 / HAND OVER</strong><p>Document repeatable outputs and what the evidence cannot prove.</p></li>
       </ol>
       <small>Illustrative approach, not a claim of measured client results.</small>
     </div>
   </section>
   <footer className="al-footer"><ShieldCheck size={19}/><p>No personal data, real client performance exports, access tokens or production identifiers are included. This is a demonstration, not a live reporting service.</p><Link href="/#work">Other projects <ArrowRight size={15}/></Link></footer>
  </div>
 </main>;
}
