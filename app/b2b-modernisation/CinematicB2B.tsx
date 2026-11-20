'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleHelp, FileCheck2,
  Layers3, LockKeyhole, Mail, PackageCheck, ShieldCheck, ShoppingBag,
  Store, UsersRound, Workflow
} from 'lucide-react';
import './cinematic.css';

// PUBLIC CASE STUDY GUARDRAILS
// This interface uses fictional product/catalogue prices and conceptual market names.
// Historic legacy figures are sourced from the adjusted order export; native figures
// are sourced from Shopify Analytics (is_b2b_order = true). Those accounting bases
// differ and may overlap: never add them as one revenue total.
// The alternative growth tab is modelled, not merchant revenue. July 2026 is the
// reported implementation month, not a verified cut-over date.
// Source: adjusted historical reporting export, SEG_Monthly (18 Nov 2026)
// and read-only ShopifyQL, Jan–Oct 2026. No client records, IDs, or real rates.

type Market = { name: string; label: string; catalogue: string; price: number; explanation: string };
const markets: Market[] = [
  {name:'Retail',label:'RETAIL',catalogue:'Catalogue 1',price:120,explanation:'Retail uses its normal pricing context. A company purchasing location is not required.'},
  {name:'Wholesale Tier 1',label:'B2B 01',catalogue:'Catalogue 2',price:112,explanation:'An entitled company location in the first B2B market receives its assigned catalogue prices.'},
  {name:'Wholesale Tier 2',label:'B2B 02',catalogue:'Catalogue 3',price:104,explanation:'The second B2B market supplies its own catalogue to eligible company locations.'},
  {name:'Wholesale Tier 3',label:'B2B 03',catalogue:'Catalogue 4',price:96,explanation:'The third B2B market supplies its own catalogue to eligible company locations.'}
];

const journey = [
  { label:'Apply', heading:'Shopify Form submitted', icon:FileCheck2, detail:'A business customer submits a wholesale access application through Shopify Forms. Submission does not automatically grant company pricing.' },
  { label:'Review', heading:'Manual team approval', icon:ShieldCheck, detail:'The assigned team checks the application, reviews eligibility, and makes a deliberate access decision.' },
  { label:'Assign', heading:'Company and market assigned', icon:UsersRound, detail:'The approved company location is linked to the relevant B2B market and its catalogue pricing context.' },
  { label:'Notify', heading:'Shopify welcome notification', icon:Mail, detail:'A branded Shopify Notifications email explains approval and provides the sign-in route. The email was customised with responsive HTML and conditional Liquid.' },
  { label:'Sign in', heading:'Native email-code sign-in', icon:LockKeyhole, detail:'The customer signs in using a one-time email code and selects the eligible company purchasing context where applicable.' },
  { label:'Purchase', heading:'Assigned catalogue price applies', icon:ShoppingBag, detail:'When purchasing for their approved company location, the customer sees the matching catalogue price and completes the usual Shopify checkout.' }
];

// The exact order-tag legacy cohort is narrower than the tag-or-customer-tag cohort.
// Monthly order values are retained after specified exclusions and refund snapshots.
// Native ShopifyQL net sales uses a different metric and cannot be summed with legacy.
const monthly = [
  {short:'Jan', full:'January', legacy:0, broader:0, native:0, orders:0},
  {short:'Feb', full:'February', legacy:0, broader:0, native:0, orders:0},
  {short:'Mar', full:'March', legacy:6114.69, broader:6114.69, native:825.04, orders:4},
  {short:'Apr', full:'April', legacy:0, broader:0, native:0, orders:0},
  {short:'May', full:'May', legacy:2540.58, broader:2833.08, native:0, orders:0},
  {short:'Jun', full:'June', legacy:1767.57, broader:2472.57, native:0, orders:0},
  {short:'Jul', full:'July', legacy:5000.16, broader:5747.16, native:6552.75, orders:4},
  {short:'Aug', full:'August', legacy:0, broader:0, native:1329.19, orders:14},
  {short:'Sep', full:'September', legacy:1167.12, broader:1167.12, native:3984.25, orders:7},
  {short:'Oct', full:'October', legacy:0, broader:0, native:1893.88, orders:4}
];

type HistoryMode = 'legacy' | 'native' | 'scenario';
type BuyerGroup = 'new' | 'returning';
const aov = {
  new: { retail:252.83, b2b:739.40 },
  returning: { retail:241.87, b2b:839.38 }
};
const formatMoney = (n:number) => 'A$' + n.toLocaleString('en-AU',{minimumFractionDigits:2,maximumFractionDigits:2});

export default function CinematicB2B(){
  const [marketIndex,setMarketIndex]=useState(0);
  const [eligible,setEligible]=useState(true);
  const [quantity,setQuantity]=useState(12);
  const [journeyStep,setJourneyStep]=useState(0);
  const [historyMode,setHistoryMode]=useState<HistoryMode>('legacy');
  const [includeCustomerTags,setIncludeCustomerTags]=useState(false);
  const [selectedMonth,setSelectedMonth]=useState(6);
  const [buyerGroup,setBuyerGroup]=useState<BuyerGroup>('new');

  const requested = markets[marketIndex];
  const qualifies = marketIndex===0 || eligible;
  const applied = qualifies ? requested : markets[0];
  // Fictional subtotal and savings are derived from the selected context, never from a client catalogue.
  const retailSubtotal = markets[0].price * quantity;
  const simulatedSubtotal = applied.price * quantity;
  const simulatedSavings = retailSubtotal - simulatedSubtotal;
  const historyValue = (i:number) => {
    const m=monthly[i];
    if(historyMode==='legacy')return includeCustomerTags?m.broader:m.legacy;
    if(historyMode==='native')return m.native;
    return i<=6?m.native:monthly[6].native+(i-6)*10000;
  };
  const values=monthly.map((_,i)=>historyValue(i));
  const maxValue=Math.max(1,...values);
  const chosen=monthly[selectedMonth];
  const shownAov=aov[buyerGroup];
  const CurrentIcon=journey[journeyStep].icon;

  const historyTitle=historyMode==='legacy'?'Legacy Wholesale / Wholesale Gorilla':historyMode==='native'?'Native Shopify B2B net sales':'Illustrative growth after July';
  const historySub=historyMode==='legacy'?'Exported eligible order value less refund snapshots':historyMode==='native'?'Shopify Analytics: native B2B net sales':'July actual baseline + A$10,000 each subsequent month';
  const historyDescription=historyMode==='legacy'
    ? 'Order-tag evidence includes exact wholesale, wg_wholesale, or WholesalePA1 tags; overlapping tags count once. ' + (includeCustomerTags?'The broader customer-tag cohort is also included.':'Only order-tag evidence is selected.') + ' Do not add this series to native net sales.'
    : historyMode==='native'
      ? chosen.orders+' native B2B orders in '+chosen.full+' 2026. This is net sales, not order-total-minus-refunds. Native B2B activity also appears in March, before the reported July migration.'
      : selectedMonth<=6
        ? 'Actual native B2B net sales remain unchanged through the July baseline.'
        : 'Illustrative only. The amount shown is not an actual Shopify sales result, and must not be described as realised growth.';

  return <main className="cb2b" id="b2b-top">
    <div className="cb2b-topbar">
      <Link href="/" className="cb2b-back"><ArrowLeft size={16}/> Back to portfolio</Link>
      <span>SELECTED WORK <span className="cb2b-separator">/</span> COMMERCE ENGINEERING</span>
    </div>

    <header className="cb2b-hero">
      <div className="cb2b-wrap cb2b-hero-grid">
        <div className="cb2b-hero-copy">
          <p className="cb2b-kicker"><span className="cb2b-dot"/>SHOPIFY ADVANCED · B2B MODERNISATION</p>
          <h1>Wholesale pricing, without the <em>extra layer.</em></h1>
          <p className="cb2b-lede">From app-dependent wholesale pricing to a more controlled, native Shopify B2B experience. One storefront. Distinct buying contexts. Catalogue-led pricing.</p>
          <div className="cb2b-hero-cta">
            <a href="#challenge" className="cb2b-btn cb2b-btn-primary">Explore the transformation <ArrowRight size={16}/></a>
            <a href="#price-lab" className="cb2b-btn cb2b-btn-ghost">Try the price laboratory <ArrowUpRight size={16}/></a>
          </div>
          <div className="cb2b-hero-tags"><span>MARKETS</span><span>CATALOGUES</span><span>COMPANY ACCOUNTS</span></div>
        </div>
        <div className="cb2b-hero-art" aria-hidden="true">
          <span className="cb2b-orbit cb2b-orbit-one"/><span className="cb2b-orbit cb2b-orbit-two"/>
          <div className="cb2b-float-card">
            <small>ONE STOREFRONT / FOUR CONTEXTS</small>
            <strong>Market-led<br/>pricing</strong>
            <div>Customer eligibility <b>Verified</b></div>
            <div>Price source <b>Catalogue</b></div>
            <div>Governance <b>Native Shopify</b></div>
          </div>
        </div>
      </div>
    </header>

    <div className="cb2b-metrics cb2b-wrap" aria-label="Architecture summary">
      <div><strong>01</strong><span>CONNECTED STOREFRONT</span></div>
      <div><strong>03</strong><span>B2B BUYING TIERS</span></div>
      <div><strong>04</strong><span>ILLUSTRATED PRICING CONTEXTS</span></div>
    </div>

    <nav className="cb2b-chapters" aria-label="Case study chapters">
      <a href="#challenge"><span>01</span> The challenge</a>
      <a href="#transformation"><span>02</span> The transformation</a>
      <a href="#price-lab"><span>03</span> Price laboratory</a>
      <a href="#buying-journey"><span>04</span> Buying journey</a>
      <a href="#business-impact"><span>05</span> Business impact</a>
    </nav>

    <section id="challenge" className="cb2b-section cb2b-wrap" aria-labelledby="challenge-title">
      <p className="cb2b-kicker">CHAPTER 01 / THE CHALLENGE</p>
      <h2 id="challenge-title">When wholesale rules sit <em>outside</em> the store.</h2>
      <p className="cb2b-section-lede">Wholesale buying already existed. The opportunity was to make eligibility, catalogue access, and price governance clearer instead of depending on an additional wholesale pricing layer.</p>
      <div className="cb2b-before-after">
        <article className="cb2b-box">
          <div className="cb2b-box-title"><Workflow size={17}/> BEFORE / APP-DEPENDENT</div>
          <div className="cb2b-process-node">Shopify storefront</div><span className="cb2b-down">↓</span>
          <div className="cb2b-process-node cb2b-process-warm">Third-party wholesale pricing app</div><span className="cb2b-down">↓</span>
          <div className="cb2b-process-node">Adjusted wholesale buying experience</div>
          <p className="cb2b-takeaway">Additional integration and administration layer between merchant price governance and the customer.</p>
        </article>
        <article className="cb2b-box cb2b-box-gold">
          <div className="cb2b-box-title"><Layers3 size={17}/> AFTER / NATIVE PRICE CONTROL</div>
          <div className="cb2b-process-node">One Shopify storefront</div><span className="cb2b-down">↓</span>
          <div className="cb2b-process-node cb2b-process-warm">Eligible company location + B2B market</div><span className="cb2b-down">↓</span>
          <div className="cb2b-process-node">Assigned catalogue prices</div>
          <p className="cb2b-takeaway">Pricing context is governed through native Shopify Markets and Catalogues, reducing reliance on a separate pricing app.</p>
        </article>
      </div>
      <p className="cb2b-note"><ShieldCheck size={17}/> The change was architectural, not simply a new discount rule. App licence savings and administration time savings are not claimed without verified evidence.</p>
    </section>

    <section id="transformation" className="cb2b-section cb2b-section-contrast" aria-labelledby="transformation-title">
      <div className="cb2b-wrap">
        <p className="cb2b-kicker">CHAPTER 02 / THE TRANSFORMATION</p>
        <h2 id="transformation-title">One storefront. Four buying contexts.</h2>
        <p className="cb2b-section-lede">Explore the separation of retail and three B2B purchasing contexts. Select a market to see the matching catalogue and how eligibility is defined.</p>
        <div className="cb2b-architecture">
          <div className="cb2b-arch-root"><Store size={20}/> ONE SHOPIFY STOREFRONT</div>
          <div className="cb2b-connector" aria-hidden="true"/>
          <div className="cb2b-market-grid" role="group" aria-label="Explore markets and catalogues">
            {markets.map((m,i)=><button key={m.name} type="button" className={'cb2b-market-card '+(marketIndex===i?'is-active':'')} onClick={()=>setMarketIndex(i)} aria-pressed={marketIndex===i}>
              <span>{m.label}</span><strong>{m.name}</strong><small>{m.catalogue}</small>
            </button>)}
          </div>
          <div className="cb2b-arch-explainer" aria-live="polite"><div><strong>{requested.name} · {requested.catalogue}</strong><p>{requested.explanation}</p></div><span>Native price control</span></div>
        </div>
        <div className="cb2b-footnotes">
          <div><Check size={16}/><span>Retail remains distinct from the three B2B buying tiers.</span></div>
          <div><Check size={16}/><span>Shopify Advanced supports three active B2B market catalogue assignments in this design.</span></div>
          <div><Check size={16}/><span>Company location and signed-in purchasing context determine entitlement.</span></div>
        </div>
        <p className="cb2b-small-note">Retail seasonal campaigns remain a separate merchandising layer, not an extra wholesale catalogue or B2B tier.</p>
      </div>
    </section>

    <section id="price-lab" className="cb2b-section cb2b-wrap" aria-labelledby="price-title">
      <p className="cb2b-kicker">CHAPTER 03 / THE PRICE LABORATORY</p>
      <h2 id="price-title">See where the price <em>comes from.</em></h2>
      <p className="cb2b-section-lede">Choose a market, then change company eligibility. The same fictional product responds to the buying context. No client pricing or confidential catalogue settings are used. Adjust the sample quantity to see the illustrative subtotal and retail comparison.</p>
      <div className="cb2b-lab">
        <div className="cb2b-lab-controls">
          <p className="cb2b-control-label">SELECT THE BUYING CONTEXT</p>
          <div className="cb2b-market-options" role="group" aria-label="Pricing context">
            {markets.map((m,i)=><button key={m.name} type="button" onClick={()=>setMarketIndex(i)} aria-pressed={marketIndex===i}><strong>{m.name}</strong><small>{m.catalogue}</small></button>)}
          </div>
          <label className="cb2b-eligibility"><input type="checkbox" checked={eligible} onChange={e=>setEligible(e.target.checked)}/><span>Signed in and purchasing for an eligible company location</span></label>
          <label className="cb2b-quantity-control" htmlFor="cb2b-quantity">Sample order quantity <strong>{quantity} units</strong></label>
          <input id="cb2b-quantity" className="cb2b-quantity-range" type="range" min="1" max="50" step="1" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/>
          <div className="cb2b-rules" aria-live="polite">
            <p><span>01</span>{eligible?'Company purchasing eligibility can be checked':'No eligible company purchasing context'}</p>
            <p><span>02</span>{qualifies?requested.name+' market selected':'Wholesale context not available'}</p>
            <p><span>03</span>Price source: {applied.catalogue}</p>
          </div>
          <p className="cb2b-small-note">Illustrative logic: in a real store, access is enforced by Shopify, not JavaScript in this portfolio demo.</p>
        </div>
        <div className="cb2b-lab-product">
          <div className="cb2b-product-top"><span>STOREFRONT PREVIEW</span><span>FICTIONAL SKU</span></div>
          <div className="cb2b-product-visual" aria-hidden="true"><span className="cb2b-cup"/></div>
          <h3>Sample Ceramic Cup</h3>
          <p>One product · Four pricing contexts</p>
          <div className="cb2b-product-price"><strong>{formatMoney(applied.price)}</strong><span>{applied.name}<br/>{applied.catalogue}</span></div>
          <div className="cb2b-order-summary" aria-live="polite"><div><span>Illustrative subtotal · {quantity} units</span><strong>{formatMoney(simulatedSubtotal)}</strong></div><div><span>Compared with retail</span><strong>{formatMoney(simulatedSavings)} saved</strong></div></div>
          <span className="cb2b-product-badge">{!qualifies?'Retail fallback · demo':marketIndex===0?'Retail price':'Eligible company price'}</span>
          <p className="cb2b-product-explain" aria-live="polite">{!qualifies?'A wholesale market selection alone is not an entitlement. Without eligible company purchasing context, the demonstration displays retail pricing.':marketIndex===0?'The retail catalogue supplies the normal product price.':'The matched company market supplies the fictional trade price from '+applied.catalogue+'; no additional cart-pricing application is involved.'}</p>
        </div>
      </div>
    </section>

    <section id="buying-journey" className="cb2b-section cb2b-section-contrast" aria-labelledby="journey-title">
      <div className="cb2b-wrap">
        <p className="cb2b-kicker">CHAPTER 04 / THE BUYING JOURNEY</p>
        <h2 id="journey-title">From application to the right price.</h2>
        <p className="cb2b-section-lede">Six stages connect the customer-facing experience and the back-office approval process. Select a step for the full explanation.</p>
        <div className="cb2b-steps" role="group" aria-label="B2B buyer journey steps">
          {journey.map((step,i)=>{const Icon=step.icon;return <button type="button" key={step.label} onClick={()=>setJourneyStep(i)} aria-pressed={journeyStep===i}><small>{String(i+1).padStart(2,'0')}</small><Icon size={21} aria-hidden="true"/><strong>{step.label}</strong></button>})}
        </div>
        <div className="cb2b-step-detail" aria-live="polite"><div className="cb2b-step-icon"><CurrentIcon size={30} aria-hidden="true"/></div><div><strong>{journey[journeyStep].heading}</strong><p>{journey[journeyStep].detail}</p></div></div>
        <div className="cb2b-journey-footer"><span><Mail size={17}/> Custom Shopify Notifications email with Liquid personalisation</span><span><LockKeyhole size={17}/> Native one-time email code, not a separate login app</span></div>
      </div>
    </section>

    <section id="business-impact" className="cb2b-section cb2b-wrap" aria-labelledby="impact-title">
      <p className="cb2b-kicker">CHAPTER 05 / BUSINESS IMPACT</p>
      <h2 id="impact-title">Historical context. Evidence-led outcomes.</h2>
      <p className="cb2b-section-lede">Wholesale orders existed before the reported July 2026 implementation. Explore legacy order-tag evidence, native Shopify B2B net sales, and a clearly separate growth scenario.</p>
      <div className="cb2b-history">
        <div className="cb2b-history-head">
          <div><p className="cb2b-control-label">JANUARY–OCTOBER 2026</p><h3>{historyTitle}</h3><span>{historySub}</span></div>
          <div className="cb2b-history-tabs" role="group" aria-label="Historical sales view">
            {([{key:'legacy',text:'Legacy wholesale'},{key:'native',text:'Native B2B'},{key:'scenario',text:'Modelled growth'}] as const).map(tab=><button type="button" key={tab.key} onClick={()=>setHistoryMode(tab.key)} aria-pressed={historyMode===tab.key}>{tab.text}</button>)}
          </div>
        </div>
        <div className="cb2b-bar-grid" role="group" aria-label="Select reporting month">
          {monthly.map((m,i)=><button type="button" className={'cb2b-bar-month '+(i===6?'is-launch ':'')+(selectedMonth===i?'is-chosen':'')} key={m.short} aria-pressed={selectedMonth===i} aria-label={m.full+' 2026, '+formatMoney(values[i])+(i===6?', reported implementation month':'')} onClick={()=>setSelectedMonth(i)}>
            <span className="cb2b-bar-track"><span className="cb2b-bar-fill" style={{height:(values[i]===0?0:Math.max(3,values[i]/maxValue*100))+'%'}}/></span><span className="cb2b-bar-label">{m.short}{i===6?' ✦':''}</span>
          </button>)}
        </div>
        <div className="cb2b-history-detail" aria-live="polite">
          <div><small>{chosen.full.toUpperCase()} 2026 {selectedMonth===6?'· REPORTED IMPLEMENTATION MONTH':''}</small><strong>{formatMoney(values[selectedMonth])}</strong></div>
          <p>{historyDescription}</p>
        </div>
        <label className={'cb2b-wholesale-toggle '+(historyMode!=='legacy'?'is-disabled':'')}><input type="checkbox" checked={includeCustomerTags} disabled={historyMode!=='legacy'} onChange={e=>setIncludeCustomerTags(e.target.checked)}/> Include broader customer wholesale-tag evidence</label>
        <p className="cb2b-small-note">Legacy wholesale uses eligible order totals less recorded refund snapshots. Native B2B uses Shopify Analytics net sales; these measures may overlap and must not be added together. Growth after July in the scenario view is hypothetical, not actual sales.</p>
      </div>

      <div className="cb2b-impact-grid">
        <div className="cb2b-compare">
          <div className="cb2b-compare-row cb2b-compare-head"><b>CUSTOMER VALUE</b><b>RETAIL</b><b>B2B</b></div>
          {[
            ['Customers','1,302','22'],['Returning customers','418','10'],['Returning customer rate','32.1%','45.5%'],
            ['Orders from returning customers','46.8%','51.5%'],['Sales from returning customers','45.8%','55.6%'],
            ['New-customer AOV','A$252.83','A$739.40'],['Returning-customer AOV','A$241.87','A$839.38']
          ].map(r=><div className="cb2b-compare-row" key={r[0]}><span>{r[0]}</span><span>{r[1]}</span><strong>{r[2]}</strong></div>)}
        </div>
        <div className="cb2b-customer-value">
          <div className="cb2b-aov-head"><div><small>REPORTED RETAIL AOV</small><strong>~A$270</strong></div><div><small>REPORTED B2B AOV</small><strong>~A$850</strong></div></div>
          <div className="cb2b-aov-tabs" role="group" aria-label="Order value by customer status">
            <button type="button" aria-pressed={buyerGroup==='new'} onClick={()=>setBuyerGroup('new')}>New buyers</button>
            <button type="button" aria-pressed={buyerGroup==='returning'} onClick={()=>setBuyerGroup('returning')}>Returning buyers</button>
          </div>
          <div className="cb2b-aov-insight" aria-live="polite"><strong>{(shownAov.b2b/shownAov.retail).toFixed(2)}×</strong><span>B2B AOV ({formatMoney(shownAov.b2b)}) compared with retail ({formatMoney(shownAov.retail)}) for {buyerGroup} buyers.</span></div>
          <p className="cb2b-small-note">The approximate overall AOV estimates and segmented figures were supplied separately. Their source populations and periods require reconciliation before being treated as a single dataset.</p>
        </div>
      </div>

      <div className="cb2b-outcomes">
        <article><Layers3 size={23}/><span>01 / DELIVERED</span><h3>Native catalogue price control</h3><p>One Shopify storefront with distinct retail and wholesale buying contexts governed by company eligibility and market catalogues.</p></article>
        <article><PackageCheck size={23}/><span>02 / OBSERVED</span><h3>Higher-value B2B relationships</h3><p>Supplied customer cohorts show higher B2B AOV and returning-customer rates. Recorded native sales fluctuate by month.</p></article>
        <article><CircleHelp size={23}/><span>03 / TO VALIDATE</span><h3>Incremental business impact</h3><p>Reconcile order cohorts and exact launch date, then test conversion, repeat purchase, margin, pricing issues, and retired-app costs.</p></article>
      </div>
      <p className="cb2b-evidence">Evidence boundary: no causal sales uplift, app-cost saving, or improvement in conversion is asserted. The July milestone is user-reported, and the modelled +A$10,000 monthly series is never labelled as actual revenue. Aggregated source records contain no customer identities.</p>
    </section>

    <footer className="cb2b-footer">
      <div className="cb2b-wrap cb2b-footer-grid"><div><p className="cb2b-kicker">THE RESULT</p><h2>Less pricing complexity.<br/><em>More ownership.</em></h2><p>Business eligibility, market assignment, catalogue pricing, and a clearer customer journey working as one commerce system.</p></div><div className="cb2b-footer-actions"><a href="mailto:hello@jrvallite.com?subject=Shopify%20B2B%20project" className="cb2b-btn cb2b-btn-primary">Discuss a Shopify project <ArrowUpRight size={16}/></a><Link href="/experience" className="cb2b-btn cb2b-btn-ghost">Explore more work <ArrowRight size={16}/></Link><Link href="/b2b-demo" className="cb2b-related-link">Try the separate fictional weight-tier demonstration</Link></div></div>
    </footer>
  </main>;
}
