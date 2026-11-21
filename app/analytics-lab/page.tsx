'use client';
/**
 * Public-safe eCommerce analytics engineering lab.
 * All metrics are synthetic; transformations run in-browser with no API requests.
 * Real GA4/GSC Python source is documented separately, never executed on this page.
 */
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,BarChart3,Database,FileDown,GitBranch,ShieldCheck} from 'lucide-react';
import './analytics-lab.css';

const modules=[
  {file:'01_daily_acquisition.py',label:'Acquisition',detail:'Query sessions, users, transactions and revenue by source, medium and campaign.'},
  {file:'02_device_conversion.py',label:'Devices',detail:'Compare mobile and desktop sessions and conversion behaviour.'},
  {file:'04_landing_pages.py',label:'Landing pages',detail:'Identify entry pages associated with engaged visits and purchases.'},
  {file:'05_purchase_funnel.py',label:'Purchase funnel',detail:'Inspect view, add-to-cart, checkout and purchase stages for drop-off.'},
  {file:'08_new_vs_returning.py',label:'Customer mix',detail:'Separate new and returning user reporting while respecting GA4 definitions.'},
  {file:'gsc_03_export_all_30_full.py',label:'Search Console',detail:'Export search performance dimensions and monitor coverage and extraction limits.'}
] as const;
const funnel=[{name:'Product views',count:12000},{name:'Add to cart',count:1800},{name:'Begin checkout',count:640},{name:'Purchases',count:210}];
const channels=[{name:'Organic Search',sessions:4000,purchases:80},{name:'Paid Search',sessions:3100,purchases:42},{name:'Direct',sessions:2200,purchases:62},{name:'Email',sessions:700,purchases:26}];
const format=(n:number)=>new Intl.NumberFormat('en-AU',{maximumFractionDigits:1}).format(n);
export default function AnalyticsLab(){
 const [active,setActive]=useState(0);
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
   <section className="al-hero"><span>INTERACTIVE CASE STUDY / SYNTHETIC DATA</span><h1>From raw data to <em>better commerce decisions.</em></h1><p>Explore an educational reconstruction of a Python-powered Shopify, GA4 and Search Console reporting pipeline. The dashboard is interactive; its metrics are entirely fictional.</p><div className="al-actions"><a href="#pipeline">Explore the pipeline <ArrowRight size={16}/></a><a href="#dashboard">Try the dashboard <BarChart3 size={16}/></a></div></section>
   <section id="pipeline" className="al-section"><span className="al-kicker">01 / ARCHITECTURE</span><h2>Trace the reporting pipeline.</h2><div className="al-pipeline" aria-label="Analytics extraction pipeline">{['Shopify / GA4 / GSC','Python API extraction','Validation & CSV exports','Analysis & CRO decisions'].map((s,i)=><div key={s}><small>0{i+1}</small><strong>{s}</strong>{i<3&&<span aria-hidden="true">→</span>}</div>)}</div><p className="al-muted">Real APIs require authorised credentials and careful reconciliation of source-specific definitions. This page never contacts those services.</p></section>
   <section className="al-section"><span className="al-kicker">02 / CODE EXPLORER</span><h2>What each Python module answers.</h2><div className="al-explorer"><div className="al-module-list" role="group" aria-label="Python modules">{modules.map((m,i)=><button type="button" aria-pressed={active===i} className={active===i?'is-active':''} onClick={()=>setActive(i)} key={m.file}><Database size={15}/>{m.label}</button>)}</div><div className="al-module-detail" aria-live="polite"><small>SELECTED SCRIPT / SANITISED SOURCE INDEX</small><h3>{modules[active].file}</h3><p>{modules[active].detail}</p><div className="al-code"><span>EXTRACT</span> → <span>VALIDATE</span> → <span>EXPORT CSV</span></div><Link href="/python-automation">Review the Python portfolio and source limitations <ArrowRight size={15}/></Link></div></div></section>
   <section id="dashboard" className="al-section"><span className="al-kicker">03 / INTERACTIVE DASHBOARD</span><h2>Explore the customer journey.</h2><div className="al-tabs" role="group" aria-label="Analytics chart"><button type="button" aria-pressed={view==='funnel'} onClick={()=>setView('funnel')}>Purchase funnel</button><button type="button" aria-pressed={view==='channels'} onClick={()=>setView('channels')}>Acquisition channels</button></div><div className="al-chart" aria-label={view==='funnel'?'Synthetic purchase funnel':'Synthetic channel sessions and purchases'}>{view==='funnel'?funnel.map((d,i)=><div className="al-chart-row" key={d.name}><span>{d.name}</span><div className="al-track"><i style={{width:(d.count/funnel[0].count*100)+'%'}}/></div><strong>{format(d.count)}</strong>{i>0&&<small>{format(d.count/funnel[i-1].count*100)}% of previous stage</small>}</div>):channels.map(d=><div className="al-chart-row" key={d.name}><span>{d.name}</span><div className="al-track"><i style={{width:(d.sessions/4000*100)+'%'}}/></div><strong>{format(d.sessions)} sessions</strong><small>{format(d.purchases/d.sessions*100)}% purchase rate</small></div>)}</div><button className="al-download" type="button" onClick={download}><FileDown size={17}/> Download synthetic CSV</button></section>
   <section className="al-section"><span className="al-kicker">04 / DATA QUALITY</span><h2>Reconcile different purchase counts.</h2><p className="al-muted">Change the fictional counts to explore the reporting gap. GA4 and Shopify may differ because of consent, attribution, timing, event delivery and measurement definitions. This calculator does not diagnose the cause.</p><div className="al-reconcile"><label>Shopify orders <input type="number" min="1" max="100000" value={shopify} onChange={e=>setShopify(Math.max(1,Math.min(100000,Number(e.target.value)||1)))}/></label><label>GA4 purchases <input type="number" min="0" max="100000" value={ga4} onChange={e=>setGa4(Math.max(0,Math.min(100000,Number(e.target.value)||0)))}/></label><div className="al-gap" aria-live="polite"><small>SHOPIFY MINUS GA4</small><strong>{format(gap)}</strong><span>{format(percent)}% of Shopify orders</span></div></div><p className="al-muted">Compare like-for-like date ranges, currencies, purchase event definitions and time zones before interpreting the difference.</p></section>
   <footer className="al-footer"><ShieldCheck size={19}/><p>No personal data, real client performance exports, access tokens or production identifiers are included. This is a demonstration, not a live reporting service.</p><Link href="/#work">Other projects <ArrowRight size={15}/></Link></footer>
  </div>
 </main>;
}
