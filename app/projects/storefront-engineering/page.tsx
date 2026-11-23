'use client';
/**
 * Public storefront-engineering case study, 24 November 2026.
 * UI is an original educational reconstruction, NOT exported Peter Augustus
 * theme code, actual Shopify menu data, or a live Figma embed.
 * Interactions are local React state only: no checkout, analytics, app APIs,
 * customer records, remote assets or third-party requests.
 * Real theme architecture was reviewed read-only; claims are scoped to inspected files.
 */
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Code2, Layers3, Menu, Package, Truck, X } from 'lucide-react';
import './storefront-engineering.css';

type Mode = 'homepage' | 'navigation' | 'product';
const steps = [
  {title:'Figma specifications',description:'Desktop and mobile layouts document component hierarchy, typography, spacing and interactive states.'},
  {title:'Liquid and section schema',description:'A reusable Online Store 2.0 section describes editable content, composition and data dependencies.'},
  {title:'JSON template composition',description:'The template selects sections and nested blocks without hard-coding every page into a single file.'},
  {title:'CSS and JavaScript',description:'Responsive styling, accessible controls and progressive enhancement connect the design to customer behaviour.'},
  {title:'Shopify data and operations',description:'Collections, product data and delivery eligibility populate interfaces; operational truth remains in authorised systems.'}
];
const mappings = [
  ['Hero / editorial campaign','pa-home-hero + index.json','Responsive media, scheduled campaign phases and editable slide content'],
  ['Mega navigation','header + pa-layout assets','Shop menu blocks, keyboard controls and mobile drawer'],
  ['Product details','pa-main-product + product.pa-build.json','Gallery, product education, purchase and information blocks'],
  ['Delivery checker','pa-home-delivery + shipping calculator','Postcode-based customer information, validated against configured zones']
];
export default function StorefrontEngineering(){
  const [mode,setMode]=useState<Mode>('homepage');
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [variant,setVariant]=useState('250 g');
  const [postcode,setPostcode]=useState('');
  const [checked,setChecked]=useState(false);
  return <main className="se-page">
    <div className="se-wrap">
      <nav className="se-top" aria-label="Case study"><Link href="/#work"><ArrowLeft size={17}/> Back to projects</Link><span>{'{JRV}'} / COMMERCE ENGINEERING</span></nav>
      <header className="se-hero">
        <span className="se-eyebrow">INTERACTIVE CASE STUDY / SHOPIFY THEME ENGINEERING</span>
        <h1>From premium theme to <em>bespoke storefront.</em></h1>
        <p>A technical walkthrough of Peter Augustus storefront customisation: mapping design decisions to Liquid components, Shopify templates, accessible interactions and operational integrations.</p>
        <div className="se-pills"><span>Shopify Liquid</span><span>Figma-led design</span><span>Online Store 2.0</span><span>Responsive UI</span></div>
        <p className="se-disclaimer">The live architecture informed this original demonstration. Screens, prices, products, and interactions below are fictional examples, not live store controls or measured conversion results.</p>
      </header>

      <section className="se-section" aria-labelledby="demo-heading">
        <div className="se-heading"><div><span className="se-eyebrow">01 / EXPLORE</span><h2 id="demo-heading">One theme. Multiple engineered journeys.</h2></div><p>Switch between simplified interface demonstrations. All interactions run locally in your browser.</p></div>
        <div className="se-tabs" role="group" aria-label="Demo view">
          {([['homepage','Homepage'],['navigation','Mega menu'],['product','Product page']] as const).map(([value,label])=><button key={value} type="button" aria-pressed={mode===value} className={mode===value?'selected':''} onClick={()=>{setMode(value);setOpen(false);}}>{label}</button>)}
        </div>
        <div className="se-stage">
          <div className="se-demo-bar"><span><span className="se-demo-dot"/> ORIGINAL DEMONSTRATION</span><button type="button" onClick={()=>setMobile(v=>!v)} aria-pressed={mobile}>{mobile?'Desktop preview':'Mobile preview'}</button></div>
          <div className={mobile?'se-shop se-shop-mobile':'se-shop'}>
            <div className="se-shop-header"><strong>CRAFT / COMMERCE</strong><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="se-navigation">{open?<X size={19}/>:<Menu size={19}/>}<span>{open?'Close':'Shop'}</span></button><span className="se-bag">BAG (0)</span></div>
            <div id="se-navigation" className={open?'se-menu se-menu-open':'se-menu'} hidden={!open}>
              <div><span className="se-eyebrow">SHOP BY RANGE</span><strong>Wagyu</strong><strong>Angus</strong><strong>Butcher boxes</strong></div>
              <div><span className="se-eyebrow">DISCOVER</span><strong>How to choose a cut</strong><strong>Delivery guide</strong><strong>Cooking inspiration</strong></div>
            </div>
            {mode==='homepage'&&<div className="se-shop-hero"><span>THE CRAFT OF GOOD FOOD</span><h3>Made for the moments that matter.</h3><p>An editorial homepage built with reusable sections, adjustable campaign content and responsive layouts.</p><div className="se-sample-cta">Explore collections <ArrowRight size={15}/></div></div>}
            {mode==='navigation'&&<div className="se-feature"><span className="se-eyebrow">NAVIGATION ARCHITECTURE</span><h3>A menu that stays part of the theme.</h3><p>Use the Shop button above to open the locally simulated mega menu. The inspected implementation retains theme header hooks while replacing the old third-party menu output.</p><button type="button" className="se-sample-button" onClick={()=>setOpen(v=>!v)}>{open?'Close menu':'Open menu'} <ArrowRight size={16}/></button></div>}
            {mode==='product'&&<div className="se-product"><div className="se-product-art"><span>ILLUSTRATIVE PRODUCT VISUAL</span><Package size={70}/></div><div className="se-product-info"><span className="se-eyebrow">EDUCATIONAL PRODUCT DEMO</span><h3>Butcher's selection</h3><p>Clear product information, portion choice and purchase guidance assembled from composable blocks.</p><fieldset><legend>Choose a portion</legend>{['250 g','500 g','1 kg'].map(v=><button type="button" key={v} aria-pressed={variant===v} onClick={()=>setVariant(v)}>{variant===v&&<Check size={13}/>} {v}</button>)}</fieldset><div className="se-sample-cta">Selected: {variant}</div></div></div>}
          </div>
        </div>
      </section>

      <section className="se-section" aria-labelledby="architecture-heading">
        <div className="se-heading"><div><span className="se-eyebrow">02 / ENGINEERING</span><h2 id="architecture-heading">From frame to functioning storefront.</h2></div><p>The layer-by-layer model connects visual intent with maintainable platform behaviour.</p></div>
        <ol className="se-architecture">{steps.map((step,i)=><li key={step.title}><span className="se-step">{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><ArrowRight size={18} aria-hidden="true"/></li>)}</ol>
      </section>
      <section className="se-section" aria-labelledby="mapping-heading">
        <span className="se-eyebrow">03 / IMPLEMENTATION MAPPING</span><h2 id="mapping-heading">What the source inspection confirmed.</h2>
        <div className="se-mapping">{mappings.map(([feature,source,behaviour])=><article key={feature}><div><Layers3 size={20}/><h3>{feature}</h3></div><code>{source}</code><p>{behaviour}</p></article>)}</div>
      </section>
      <section className="se-section se-delivery" aria-labelledby="boundary-heading">
        <Truck size={28}/><div><span className="se-eyebrow">04 / REAL-WORLD BOUNDARIES</span><h2 id="boundary-heading">A beautiful delivery checker still needs trusted rules.</h2><p>The production design connects a postcode field to store delivery logic. This example deliberately does not calculate delivery dates or claim postcode eligibility.</p><form onSubmit={e=>{e.preventDefault();setChecked(true);}}><label htmlFor="se-postcode">Try the demonstration input</label><div><input id="se-postcode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={postcode} onChange={e=>{setPostcode(e.target.value.replace(/\D/g,'').slice(0,4));setChecked(false);}} placeholder="4-digit postcode" required/><button type="submit">Inspect UI state</button></div></form>{checked&&<p role="status" className="se-result">Input received: {postcode}. This public demonstration cannot confirm a shipping zone, fee or delivery date.</p>}</div>
      </section>
      <section className="se-section se-conclusion"><span className="se-eyebrow">05 / WHAT THIS DEMONSTRATES</span><h2>Design fidelity meets engineering discipline.</h2><p>Reusable blocks, theme compatibility, responsive interactions and clear operational boundaries create a more maintainable storefront. The next engineering checks are keyboard access, performance budgets, delivery-rule parity and regression coverage; none is presented here as a completed live-store certification.</p><div className="se-actions"><Link href="/#contact">Discuss a Shopify project <ArrowRight size={18}/></Link><Link href="/?intent=hiring#contact">Hiring or collaboration <Code2 size={18}/></Link></div></section>
    </div>
  </main>;
}
