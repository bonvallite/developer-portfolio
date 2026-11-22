'use client';
/**
 * Public educational Spend & Save case study.
 * All products, order events, email delivery and Flow execution are simulated.
 * The customer-facing cart NEVER adds gifts. The after-checkout Flow simulation
 * adds complimentary order lines only after a successful order-edit step.
 * No credentials, customer records or live Shopify theme source are used.
 * 21 Nov 2026: the hero sequence and interactive architecture inspector
 * explain the cross-system dependencies without claiming to run real Flow.
 * Shopper, merchant and engineering are three distinct interactive views.
 * spend-save-base.css now loads the original, unchanged global layout at build
 * time instead of injecting a large style block after the component's content.
 * spend-save-visual.css overrides legacy warm-gold illustration colours with
 * the JRV teal/ember identity; tested eligibility and fulfilment stay intact.
 * 22 Nov: an end-of-story conversion panel connects the fictional shopper,
 * merchant and Flow boundaries to two direct next steps (project or hiring).
 * No lead form, real integration, visitor-data capture or new tracking calls.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import SpendSaveSystemMap from './SpendSaveSystemMap';
import './spend-save-base.css';
import './spend-save-visual.css';
import { getRewardProgress, getEligibleGifts, validateThresholds } from '../../../lib/spend-save-rules.mjs';
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, ShoppingBag, Workflow, Database, Code2, Mail, RotateCcw, Sparkles } from 'lucide-react';

type Product = { id: string; name: string; price: number; description: string };
const products: Product[] = [
  { id: 'wagyu', name: 'Wagyu Steak', price: 85, description: 'Rich marbling · premium selection' },
  { id: 'angus', name: 'Angus Rib Fillet', price: 65, description: 'Classic cut · butcher prepared' },
  { id: 'sausages', name: 'Gourmet Sausages', price: 30, description: 'Small batch · family favourite' },
  { id: 'box', name: 'Butcher Selection', price: 120, description: 'A curated collection of cuts' },
];
const money = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
const flowStages = ['Order paid', 'Read active metaobject', 'Check thresholds and duplicates', 'Add free gift lines', 'Commit order edit', 'Send confirmation email'];
// These descriptions explain a fictional, step-driven order-edit lifecycle.
// The success email is gated behind the simulated commit; no network calls occur.
const flowDescriptions = [
  'The demonstration receives a paid-order event. Cart progress alone cannot trigger a gift order edit.',
  'Read the active promotional configuration from an authorised source. This simulation uses local thresholds.',
  'Check qualifying spend, gift eligibility and whether the order has already been processed.',
  'Prepare eligible complimentary variants and quantities. These are not yet visible on the order.',
  'Commit the order edit successfully before showing complimentary order lines.',
  'Only after a successful commit, display the customer confirmation email preview. No message is sent.'
];
export default function SpendSaveCaseStudy() {
  const [basket, setBasket] = useState<string[]>([]);
  const [thresholds, setThresholds] = useState({ first: 150, shipping: 200, final: 300 });
  const [tab, setTab] = useState<'shopper'|'merchant'|'engineering'>('shopper');
  const [stage, setStage] = useState(-1);
  const [baseline, setBaseline] = useState(140);
  const [uplift, setUplift] = useState(12);
  const [orders, setOrders] = useState(100);
  const total = useMemo(() => basket.reduce((sum, id) => sum + (products.find(p => p.id === id)?.price ?? 0), 0), [basket]);
  const milestones = [
    { value: thresholds.first, title: '2 × Wagyu Burger Patties', detail: 'Complimentary after checkout' },
    { value: thresholds.shipping, title: 'Free shipping', detail: 'Applied at checkout if eligible' },
    { value: thresholds.final, title: 'Angus Rib Fillet gift', detail: 'Complimentary after checkout' },
  ];
  // The shopper UI and post-checkout preview use the same tested eligibility model.
  const rewardProgress = getRewardProgress(total, thresholds);
  const next = rewardProgress.next;
  const eligible = rewardProgress.firstGiftUnlocked;
  const eligibleGifts = getEligibleGifts(total, thresholds);
  // Gifts are visible only after commit; email only after notification.
  const flowDone = stage === flowStages.length - 1 && eligible;
  const orderEditCommitted = stage >= 4 && eligible;
  const setThreshold = (key: keyof typeof thresholds, value: number) => {
    if (Number.isFinite(value) && value > 0 && value <= 10000) {
      const proposed = { ...thresholds, [key]: value };
      // Reject contradictory tier ordering in this merchant demonstration.
      try { validateThresholds(proposed); } catch { return; }
      setThresholds(proposed);
      setStage(-1);
    }
  };
  const add = (id: string) => { setBasket(prev => [...prev,id]); setStage(-1); };
  return <main className="ss-page ss-cinematic">
    <div className="ss-container">
      <header className="ss-nav"><Link href="/#work"><ArrowLeft size={17}/> Back to projects</Link><span>JRV / COMMERCE ENGINEERING</span></header>
      <section className="ss-hero">
        <div className="ss-kicker"><Sparkles size={15}/> INTERACTIVE CASE STUDY · SHOPIFY / CRO / FLOW</div>
        <h1>Turn the next reward into <em>a reason to explore.</em></h1>
        <p>A premium Spend & Save journey, from the first cart milestone to automated post-checkout gifting and a customer confirmation email. Explore both the shopper experience and the engineering behind it.</p>
        <div className="ss-actions"><a className="ss-primary" href="#demo">Try the experience <ArrowRight size={17}/></a><a className="ss-secondary" href="#architecture">Explore the architecture <Code2 size={17}/></a></div>
        <ol className="ss-hero-journey" aria-label="How the reward promotion works">
          <li><span>01 / STOREFRONT</span><strong>Make rewards visible</strong><small>Liquid and JavaScript explain the next milestone.</small></li>
          <li><span>02 / CHECKOUT</span><strong>Confirm the purchase</strong><small>Shipping eligibility is checked separately.</small></li>
          <li><span>03 / SHOPIFY FLOW</span><strong>Fulfil eligible gifts</strong><small>The order edit happens only after payment.</small></li>
          <li><span>04 / CUSTOMER</span><strong>Explain the result</strong><small>Confirmation follows a successful edit.</small></li>
        </ol>
        <div className="ss-note">Independent, interactive educational reconstruction. Product prices, order details and workflow execution are simulated. No real orders, emails or Shopify changes occur.</div>
      </section>
      <section className="ss-chapters" aria-label="Case study journey">
        <article><span>01 / ATTRACT</span><h2>Show the value</h2><p>Clear milestones make rewards visible without cluttering the basket.</p></article>
        <article><span>02 / ENCOURAGE</span><h2>Build momentum</h2><p>Show the amount remaining to the next milestone as products are added.</p></article>
        <article><span>03 / FULFIL</span><h2>Automate after checkout</h2><p>Flow adds qualifying gifts to the order and confirms the update by email.</p></article>
      </section>
      <section id="demo" className="ss-demo">
        <div className="ss-section-title"><span>THE EXPERIENCE</span><h2>One offer. Three perspectives.</h2><p>Switch between shopper, merchant and engineering perspectives. The same reward thresholds power every view.</p></div>
        <div className="ss-tabs" role="tablist" aria-label="Experience mode">
          {(['shopper','merchant','engineering'] as const).map(t => <button key={t} type="button" role="tab" aria-selected={tab===t} onClick={()=>setTab(t)}>{t==='shopper'?'01 Shopper':t==='merchant'?'02 Merchant':'03 Engineering'}</button>)}
        </div>
        {tab==='shopper' && <div className="ss-shopper">
          <div className="ss-product-panel">
            <div className="ss-panel-kicker">PETER AUGUSTUS / DEMONSTRATION</div><h3>Curate your basket.</h3><p>Choose products to discover your next reward. These are illustrative products and prices.</p>
            <div className="ss-products">{products.map((p,i)=><article key={p.id} className="ss-product"><div className={'ss-product-art ss-art-'+i} aria-hidden="true"><span>{String(i+1).padStart(2,'0')}</span><ShoppingBag size={38} strokeWidth={1}/></div><div><h4>{p.name}</h4><p>{p.description}</p><div className="ss-product-buy"><strong>{money(p.price)}</strong><button type="button" onClick={()=>add(p.id)} aria-label={'Add '+p.name+' to demonstration basket'}>Add +</button></div></div></article>)}</div>
          </div>
          <aside className="ss-cart"><div className="ss-cart-top"><div><span>YOUR BASKET</span><h3>Spend & Save</h3></div><ShoppingBag size={25}/></div>
            <p className="ss-reward-message" aria-live="polite">{next ? 'Just '+money(next-total)+' away from your next reward.' : 'Every reward unlocked. Enjoy the extras.'}</p>
            <div className="ss-track" role="progressbar" aria-label="Spend and Save progress" aria-valuemin={0} aria-valuemax={thresholds.final} aria-valuenow={Math.min(total,thresholds.final)}><div style={{width:rewardProgress.percentage+'%'}}/></div>
            <div className="ss-milestones">{milestones.map(m=><div className="ss-milestone" key={m.title}><CheckCircle2 size={19} className={total>=m.value?'ss-unlocked':''}/><div><strong>{m.title}</strong><small>{m.detail}</small></div><span>{money(m.value)}</span></div>)}</div>
            <div className="ss-cart-total"><span>Basket subtotal</span><strong>{money(total)}</strong></div><p className="ss-cart-notice">Gifts are not added to the basket. Eligible gifts are added to the order after checkout through Shopify Flow.</p>
            <button type="button" className="ss-primary ss-full" onClick={()=>{setStage(eligible?0:-2);document.getElementById('fulfilment')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}}>Simulate checkout <ArrowRight size={16}/></button>
            <button type="button" className="ss-reset" onClick={()=>{setBasket([]);setStage(-1);}}><RotateCcw size={14}/> Reset basket</button>
          </aside>
        </div>}
        {tab==='merchant' && <div className="ss-merchant"><div><div className="ss-panel-kicker">SIMULATED SHOPIFY METAOBJECT</div><h3>Change once. Update every placement.</h3><p>Merchant-owned configuration: <code>pa_gwp_offer / current</code>. These inputs affect the demonstration only.</p></div><div className="ss-fields">{([['first','First gift threshold'],['shipping','Free shipping threshold'],['final','Final gift threshold']] as const).map(([key,label])=><label key={key}>{label}<span>AUD</span><input type="number" min="1" max="10000" value={thresholds[key]} onChange={e=>setThreshold(key,Number(e.target.value))}/></label>)}</div><p className="ss-note">The current reference values are A$150 / A$200 / A$300. Shipping discounts must also be configured in Shopify checkout rules. Gift variants need explicit references for reliable order edits.</p><button type="button" className="ss-secondary" onClick={()=>{setThresholds({first:150,shipping:200,final:300});setStage(-1);}}>Restore reference values</button></div>}
        {tab==='engineering' && <div className="ss-engineering"><div><Database/><h3>Metaobject</h3><p>Enabled status, threshold amounts, gift labels and terms.</p></div><div><Code2/><h3>Liquid + CSS + JS</h3><p>Render milestones, style transitions and calculate cart progress. Never add gift lines.</p></div><div><Workflow/><h3>Shopify Flow</h3><p>After payment, validate eligibility, edit the order and notify the customer.</p></div></div>}
      </section>
      <section id="fulfilment" className="ss-fulfilment"><div className="ss-section-title"><span>AFTER CHECKOUT</span><h2>The reward arrives through automation.</h2><p>The mini-cart creates anticipation. Shopify Flow performs the order edit after the customer pays.</p></div>
        <div className="ss-flow-grid"><div className="ss-flow-steps"><div className="ss-panel-kicker">SIMULATED WORKFLOW</div>{flowStages.map((s,i)=><div key={s} className={'ss-flow-step '+(stage>=i?'ss-active':'')}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong>{stage>=i&&<CheckCircle2 size={18}/>}</div>)}<button type="button" className="ss-primary ss-full" disabled={!eligible} onClick={()=>setStage(s=>Math.min(flowStages.length-1,Math.max(-1,s)+1))}>{stage<0?'Start Flow simulation':stage>=flowStages.length-1?'Flow complete':'Run next step'} <ArrowRight size={16}/></button>{!eligible&&<p className="ss-note">Add enough products to reach the first gift threshold, then simulate checkout.</p>}</div>
        <div className="ss-order"><div className="ss-panel-kicker">DEMONSTRATION ORDER · NOT A REAL ORDER</div>{stage>=0&&<div className="ss-stage-explainer" aria-live="polite"><span>WORKFLOW STAGE {String(stage+1).padStart(2,'0')} / {flowStages.length}</span><strong>{flowStages[stage]}</strong><p>{flowDescriptions[stage]}</p></div>}<h3>Order #DEMO-001</h3><div className="ss-order-row"><span>Purchased products ({basket.length})</span><strong>{money(total)}</strong></div>{orderEditCommitted&&eligibleGifts.length>0&&<><div className="ss-order-row ss-gift"><span>2 × Wagyu Burger Patties</span><strong>FREE</strong></div>{rewardProgress.finalGiftUnlocked&&<div className="ss-order-row ss-gift"><span>Angus Rib Fillet gift</span><strong>FREE</strong></div>}</>}<div className="ss-order-row"><span>Shipping</span><strong>{rewardProgress.freeShippingUnlocked?'Free (illustrative)':'Calculated at checkout'}</strong></div><div className="ss-order-row ss-total"><span>Amount paid for products</span><strong>{money(total)}</strong></div><p className="ss-note">{flowDone?'Simulated order edit complete. Customer email preview is now available.':stage===-2?'No gift qualifies at this subtotal. The workflow ends without an order edit.':'Gift lines appear only after the simulated order edit is committed.'}</p>{flowDone&&<div className="ss-email"><Mail size={21}/><div><span>CUSTOMER EMAIL · PREVIEW ONLY</span><h4>Your complimentary gifts are confirmed</h4><p>Thank you for your order. Your complimentary {rewardProgress.finalGiftUnlocked?'Wagyu patties and Angus Rib Fillet':'Wagyu patties'} have been added to your order at no additional charge.</p><small>No email was actually sent.</small></div></div>}</div></div>
      </section>
      <section id="architecture" className="ss-architecture">
        <div className="ss-section-title"><span>BEHIND THE EXPERIENCE / LIVE SYSTEM MAP</span><h2>Inspect the boundaries, not just the interface.</h2><p>Choose a layer to see its purpose, illustrative logic and live fictional state from the basket and Flow simulation above.</p></div>
        <SpendSaveSystemMap subtotal={total} thresholds={thresholds}
          flowStage={stage} orderEditCommitted={orderEditCommitted} notificationReady={flowDone}/>
        <p className="ss-note">The illustrated shipping benefit must be enforced at checkout, independently of post-checkout Flow. Product eligibility, order-edit permissions and actual gift references require merchant-side verification.</p>
      </section>
      <section className="ss-opportunity"><div className="ss-section-title"><span>THE COMMERCIAL QUESTION</span><h2>What could an AOV improvement mean?</h2><p>Explore hypothetical outcomes. This is a planning model, not a measured sales result.</p></div><div className="ss-calc"><label>Monthly orders <strong>{orders}</strong><input type="range" min="50" max="1000" step="50" value={orders} onChange={e=>setOrders(Number(e.target.value))}/></label><label>Baseline AOV <strong>{money(baseline)}</strong><input type="range" min="50" max="300" step="10" value={baseline} onChange={e=>setBaseline(Number(e.target.value))}/></label><label>Hypothetical uplift <strong>{uplift}%</strong><input type="range" min="0" max="30" value={uplift} onChange={e=>setUplift(Number(e.target.value))}/></label><div className="ss-results"><div><span>MODELLED AOV</span><strong>{money(baseline*(1+uplift/100))}</strong></div><div><span>MODELLED EXTRA REVENUE / MONTH</span><strong>{money(orders*baseline*uplift/100)}</strong></div></div></div><p className="ss-note">Assumes order volume remains constant. Excludes gift costs, shipping subsidies, discounts, returns and margin. A proper CRO assessment also measures contribution profit.</p></section>
      {/* An end-of-story decision, not a new checkout or lead-capture workflow.
          This case study only models rewards; every production dependency still
          needs merchant-side verification, and emails are opened by the visitor. */}
      <section id="reward-enquiry" className="ss-engage" aria-labelledby="ss-engage-title">
        <div className="ss-engage-copy">
          <span className="ss-engage-kicker">AFTER THE DEMO / NEXT STEP</span>
          <h2 id="ss-engage-title">The reward is visible. <em>The engineering earns the trust.</em></h2>
          <p>A progress bar explains the offer, but a dependable rewards programme also needs merchant-owned rules, checkout shipping logic, paid-order validation, safe gift order edits, and a confirmation only after a successful commit.</p>
          <div className="ss-engage-actions">
            <a className="ss-engage-primary" href="mailto:hello@jrvallite.com?subject=Shopify%20rewards%20and%20Flow%20project%20%7C%20JRV">Discuss a rewards workflow <ArrowRight size={17} aria-hidden="true"/></a>
            <Link className="ss-engage-secondary" href="/experience">Hiring? Review experience <ArrowRight size={17} aria-hidden="true"/></Link>
          </div>
          <p className="ss-engage-note">Email opens in your own mail application. No enquiry is collected here. The amounts and workflow shown above are fictional, not proof of measured uplift.</p>
        </div>
        <aside className="ss-engage-insight" aria-labelledby="ss-engage-insight-title">
          <span>WHAT THE IMPLEMENTATION MUST CONNECT</span>
          <h3 id="ss-engage-insight-title">Three boundaries. One clear experience.</h3>
          <ol>
            <li><strong>01 / SHOPPER</strong><p>Explain cart eligibility without claiming gifts have already been added.</p></li>
            <li><strong>02 / MERCHANT</strong><p>Keep reward rules editable and enforce shipping benefits through checkout.</p></li>
            <li><strong>03 / AUTOMATION</strong><p>Validate paid orders, commit eligible gifts, and then permit confirmation.</p></li>
          </ol>
          <small>The studio is an educational simulation. Actual Shopify Flow permissions, duplicate prevention and gift references need implementation-specific testing.</small>
        </aside>
      </section>
      <footer className="ss-footer"><Link href="/#work"><ArrowLeft size={16}/> All projects</Link><Link href="/#contact">More contact options <ArrowRight size={16}/></Link></footer>
    </div>
    {/* Original baseline styles now load from static CSS before first paint. */}
  </main>;
}
