import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Workflow, ShieldCheck } from 'lucide-react';
const cases = [
  {
    "slug": "operations-reporting",
    "name": "Automated operations reporting",
    "category": "Scheduled automation",
    "problem": "Operational teams need consistent order summaries without manually exporting orders each day.",
    "trigger": "Scheduled time",
    "logic": "Fetch orders within a relative date window and filter out cancelled orders.",
    "action": "Format a report using Liquid and send an email summary.",
    "stack": [
      "Shopify Flow",
      "Order query",
      "Liquid",
      "Email"
    ],
    "notes": "The source exports include a weekday 24-hour report and a separate Sunday 72-hour report. Both use a maximum fetch of 100 records; pagination and report completeness were not verified.",
    "stages": [
      "Scheduled run",
      "Fetch orders for reporting window",
      "Exclude cancelled orders",
      "Render Liquid report",
      "Send operational email"
    ]
  },
  {
    "slug": "tiered-loyalty-rewards",
    "name": "Tiered loyalty reward fulfilment",
    "category": "Customer retention",
    "problem": "Different membership groups need tailored rewards applied consistently after payment.",
    "trigger": "Order paid",
    "logic": "Evaluate membership and order-related conditions across four separate tier workflows.",
    "action": "Add tier-specific gift line items to qualifying orders at no charge.",
    "stack": [
      "Shopify Flow",
      "Order paid",
      "Conditions",
      "Order line items"
    ],
    "notes": "The exports cover four distinct reward tiers. Some actions explicitly allow duplicate line items; the exports alone do not verify cross-flow deduplication or customer-facing outcomes.",
    "stages": [
      "Order paid",
      "Evaluate membership tier",
      "Check qualifying conditions",
      "Select tier-specific reward",
      "Add free gift line item"
    ]
  },
  {
    "slug": "gift-with-purchase",
    "name": "Gift-with-purchase order automation",
    "category": "Promotional operations",
    "problem": "Promotional gift rules can become error-prone when order thresholds and multiple reward levels are handled manually.",
    "trigger": "Order created",
    "logic": "Evaluate order conditions and threshold branches while checking processing state.",
    "action": "Add eligible free gift items and tag processed orders.",
    "stack": [
      "Shopify Flow",
      "Order created",
      "Conditions",
      "Free line items",
      "Order tags"
    ],
    "notes": "The source export contains multiple order-value branches, gift additions and processing tags. This visual is conceptual; the precise live thresholds and identifiers have been intentionally withheld.",
    "stages": [
      "Order created",
      "Check eligibility",
      "Evaluate reward branch",
      "Add gift line item",
      "Apply processing tag"
    ]
  }
];
export const metadata: Metadata = { title: 'Shopify Flow Case Studies | Jomar Vallite', description: 'Sanitised architecture walkthroughs of Shopify Flow operations reporting, loyalty rewards and promotional gift automation.' };
export default function FlowProjectsPage() {
 return <main className="flow-page"><div className="container flow-header"><Link href="/" className="flow-back"><ArrowLeft size={17}/> Back to portfolio</Link><span className="overline">SHOPIFY / WORKFLOW ENGINEERING</span><h1>Automations with<br/><em>purpose.</em></h1><p>Three architecture walkthroughs based on real Shopify Flow exports. Names, recipients, product identifiers and commercially sensitive rules have been generalised.</p></div><div className="container flow-list">{cases.map((item,i)=><article className="flow-case" id={item.slug} key={item.slug}><div className="flow-case-top"><span>0{i+1} / {item.category.toUpperCase()}</span><Workflow size={24}/></div><h2>{item.name}</h2><div className="flow-meta"><div><h3>Challenge</h3><p>{item.problem}</p></div><div><h3>Solution</h3><p><strong>Trigger:</strong> {item.trigger}<br/><strong>Logic:</strong> {item.logic}<br/><strong>Action:</strong> {item.action}</p></div></div><h3 className="flow-label">Architecture overview</h3><ol className="flow-pipeline">{item.stages.map((s,j)=><li key={s}><span>{String(j+1).padStart(2,'0')}</span><strong>{s}</strong></li>)}</ol><div className="chips">{item.stack.map(t=><span key={t}>{t}</span>)}</div><div className="flow-note"><ShieldCheck size={18}/><p><strong>Engineering note:</strong> {item.notes}</p></div></article>)}</div><footer className="container flow-footer"><Link href="/" className="button secondary">Return to portfolio <ArrowUpRight size={16}/></Link><p>Conceptual documentation only. No original Shopify Flow exports or private client configurations are published.</p></footer></main>;
}
