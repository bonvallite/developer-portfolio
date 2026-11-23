'use client';
/**
 * Public storefront-engineering case study, 24 November 2026.
 * UI is an original educational reconstruction, NOT exported client
 * theme code, actual Shopify menu data, or a live Figma embed.
 * Interactions are local React state only: no checkout, analytics, app APIs,
 * customer records, remote assets or third-party requests.
 * Patterns are educational; no proprietary file names or client claims are published.
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
  ['Editorial hero','sections/editorial-hero.liquid + templates/index.json','Editable campaigns, responsive media and two purposeful calls to action'],
  ['Mega navigation','sections/header.liquid + assets/navigation.js','Category discovery, mobile drawer and accessible menu controls'],
  ['Product details','sections/main-product.liquid + product template','Gallery, options, product education and purchase information'],
  ['Delivery guidance','sections/delivery-guide.liquid + rules service','Input validation, clear eligibility states and trusted fulfilment data']
];
// The code samples are original pseudocode demonstrating the interface boundary.
const codeSamples = {
  liquid: `{% schema %}
{ "name": "Editorial hero",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading" },
    { "type": "url", "id": "cta_link", "label": "Shop link" }
  ]
}
{% endschema %}`,
  css: `.editorial-hero { display: grid; gap: 2rem; }
@media (min-width: 48rem) {
  .editorial-hero { grid-template-columns: 1fr 1fr; }
}`,
  javascript: `const menu = document.querySelector('[data-menu]');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
});`
};
export default function StorefrontEngineering(){
  const [mode,setMode]=useState<Mode>('homepage');
  const [open,setOpen]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [variant,setVariant]=useState('Medium');
  const [postcode,setPostcode]=useState('');
  const [checked,setChecked]=useState(false);
  const [codeTab,setCodeTab]=useState<'liquid'|'css'|'javascript'>('liquid');
  return <main className="se-page">
    <div className="se-wrap">
      <nav className="se-top" aria-label="Case study"><Link href="/#work"><ArrowLeft size={17}/> Back to projects</Link><span>{'{JRV}'} / COMMERCE ENGINEERING</span></nav>
      <header className="se-hero">
        <span className="se-eyebrow">INTERACTIVE CASE STUDY / SHOPIFY THEME ENGINEERING</span>
        <h1>Designing journeys that <em>help people shop.</em></h1>
        <p>A brand-neutral, interactive commerce laboratory showcasing how I engineer the hero, information-rich sections, shopping journeys and product experiences in Shopify.</p>
        <div className="se-pills"><span>Shopify Liquid</span><span>Figma-led design</span><span>Online Store 2.0</span><span>Responsive UI</span></div>
        <p className="se-disclaimer">Original fictional storefront and source examples. No client branding, production product data, private theme code or measured sales claims.</p>
      </header>

      <section className="se-section" aria-labelledby="demo-heading">
        <div className="se-heading"><div><span className="se-eyebrow">01 / EXPLORE</span><h2 id="demo-heading">One theme. Multiple engineered journeys.</h2></div><p>Switch between simplified interface demonstrations. All interactions run locally in your browser.</p></div>
        <div className="se-tabs" role="group" aria-label="Demo view">
          {([['homepage','Homepage'],['navigation','Mega menu'],['product','Product page']] as const).map(([value,label])=><button key={value} type="button" aria-pressed={mode===value} className={mode===value?'selected':''} onClick={()=>{setMode(value);setOpen(false);}}>{label}</button>)}
        </div>
        <div className="se-stage">
          <div className="se-demo-bar"><span><span className="se-demo-dot"/> ORIGINAL DEMONSTRATION</span><button type="button" onClick={()=>setMobile(v=>!v)} aria-pressed={mobile}>{mobile?'Desktop preview':'Mobile preview'}</button></div>
          <div className={mobile?'se-shop se-shop-mobile':'se-shop'}>
            <div className="se-shop-header"><strong>FORM / GOODS</strong><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="se-navigation">{open?<X size={19}/>:<Menu size={19}/>}<span>{open?'Close':'Shop'}</span></button><span className="se-bag">BAG (0)</span></div>
            <div id="se-navigation" className={open?'se-menu se-menu-open':'se-menu'} hidden={!open}>
              <div><span className="se-eyebrow">SHOP BY RANGE</span><strong>New arrivals</strong><strong>Everyday essentials</strong><strong>Curated sets</strong></div>
              <div><span className="se-eyebrow">DISCOVER</span><strong>Buying guide</strong><strong>Delivery guide</strong><strong>Cooking inspiration</strong></div>
            </div>
            {mode==='homepage'&&<div className="se-shop-hero"><span>DESIGNED FOR EVERYDAY LIFE</span><h3>Find something worth keeping.</h3><p>Discover thoughtful essentials through clear storytelling, helpful guides and effortless shopping.</p><div className="se-sample-cta">Explore collections <ArrowRight size={15}/></div></div>}
            {mode==='navigation'&&<div className="se-feature"><span className="se-eyebrow">NAVIGATION ARCHITECTURE</span><h3>A menu that stays part of the theme.</h3><p>Use the Shop button above to open the locally simulated mega menu. The demonstration illustrates how custom navigation can preserve essential theme behaviours.</p><button type="button" className="se-sample-button" onClick={()=>setOpen(v=>!v)}>{open?'Close menu':'Open menu'} <ArrowRight size={16}/></button></div>}
            {mode==='product'&&<div className="se-product"><div className="se-product-art"><span>ILLUSTRATIVE PRODUCT VISUAL</span><Package size={70}/></div><div className="se-product-info"><span className="se-eyebrow">EDUCATIONAL PRODUCT DEMO</span><h3>Everyday collection</h3><p>Clear product information, option selection and purchase guidance assembled from composable blocks.</p><fieldset><legend>Choose an option</legend>{['Small','Medium','Large'].map(v=><button type="button" key={v} aria-pressed={variant===v} onClick={()=>setVariant(v)}>{variant===v&&<Check size={13}/>} {v}</button>)}</fieldset><div className="se-sample-cta">Selected: {variant}</div></div></div>}
          </div>
        </div>
      </section>

      {/* Fictional content-to-commerce sequence; no product catalogue or live API. */}
      <section className="se-section" aria-labelledby="journey-heading">
        <span className="se-eyebrow">02 / CONTENT TO COMMERCE</span>
        <h2 id="journey-heading">Information, shopping and product design work together.</h2>
        <div className="se-journey">
          {[
            ['01 / DISCOVER','Editorial hero','Present a clear proposition, responsive campaign media and direct paths into the catalogue.'],
            ['02 / UNDERSTAND','Information-first sections','Guides, comparison tables, FAQs and delivery explanations reduce uncertainty.'],
            ['03 / EXPLORE','Shopping and collections','Category navigation, merchandising, filters and quick product discovery.'],
            ['04 / DECIDE','Product experience','Media, variants, specifications, availability and clear purchase actions.']
          ].map(([number,title,description])=><article key={number}><span className="se-eyebrow">{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>
      <section className="se-section" aria-labelledby="code-heading">
        <span className="se-eyebrow">03 / BEHIND THE INTERFACE</span>
        <h2 id="code-heading">Explore how I build it.</h2>
        <p className="se-skills-intro">Switch between original, simplified Liquid, CSS and JavaScript examples. These demonstrate the design-to-code approach rather than exposing a client repository.</p>
        <div className="se-tabs" role="group" aria-label="Code language">
          {(['liquid','css','javascript'] as const).map(language=><button type="button" key={language} aria-pressed={codeTab===language} className={codeTab===language?'selected':''} onClick={()=>setCodeTab(language)}>{language==='javascript'?'JavaScript':language==='liquid'?'Liquid':'CSS'}</button>)}
        </div>
        <pre className="se-code"><code>{codeSamples[codeTab]}</code></pre>
      </section>
      <section className="se-section" aria-labelledby="architecture-heading">
        <div className="se-heading"><div><span className="se-eyebrow">04 / ENGINEERING</span><h2 id="architecture-heading">From frame to functioning storefront.</h2></div><p>The layer-by-layer model connects visual intent with maintainable platform behaviour.</p></div>
        <ol className="se-architecture">{steps.map((step,i)=><li key={step.title}><span className="se-step">{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><ArrowRight size={18} aria-hidden="true"/></li>)}</ol>
      </section>
      <section className="se-section" aria-labelledby="mapping-heading">
        <span className="se-eyebrow">05 / IMPLEMENTATION MAPPING</span><h2 id="mapping-heading">How I structure the implementation.</h2>
        <div className="se-mapping">{mappings.map(([feature,source,behaviour])=><article key={feature}><div><Layers3 size={20}/><h3>{feature}</h3></div><code>{source}</code><p>{behaviour}</p></article>)}</div>
      </section>
      <section className="se-section se-delivery" aria-labelledby="boundary-heading">
        <Truck size={28}/><div><span className="se-eyebrow">06 / REAL-WORLD BOUNDARIES</span><h2 id="boundary-heading">A beautiful delivery checker still needs trusted rules.</h2><p>A production design should connect postcode input to authorised shipping logic. This example deliberately does not calculate delivery dates or claim postcode eligibility.</p><form onSubmit={e=>{e.preventDefault();setChecked(true);}}><label htmlFor="se-postcode">Try the demonstration input</label><div><input id="se-postcode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={postcode} onChange={e=>{setPostcode(e.target.value.replace(/\D/g,'').slice(0,4));setChecked(false);}} placeholder="4-digit postcode" required/><button type="submit">Inspect UI state</button></div></form>{checked&&<p role="status" className="se-result">Input received: {postcode}. This public demonstration cannot confirm a shipping zone, fee or delivery date.</p>}</div>
      </section>
      {/* Skill cards describe observed implementation patterns, not invented outcomes. */}
      <section className="se-section" aria-labelledby="skills-heading">
        <span className="se-eyebrow">07 / ENGINEERING SKILLS</span>
        <h2 id="skills-heading">What I do, from design to delivery.</h2>
        <p className="se-skills-intro">I turn Figma designs and commercial requirements into maintainable Shopify experiences, then diagnose, document and improve the systems behind them.</p>
        <div className="se-skills">
          {[
            ['01','Figma to Shopify','Frontend engineering','Translate visual designs into responsive Liquid sections, editable settings, JSON templates and maintainable CSS.','Editable hero sections and design-to-code mapping'],
            ['02','Navigation and UX','Interaction design','Engineer mega menus, mobile navigation and keyboard interactions while preserving core theme behaviour.','Navigation structure, menu states and JavaScript'],
            ['03','Product page engineering','Conversion-focused development','Build modular galleries, portion selection, product education, purchase controls and reassurance content.','Modular product information and option controls'],
            ['04','Commerce integrations','Systems thinking','Connect customer-facing interfaces to delivery logic and order workflows without confusing UI with operational truth.','Delivery checker and post-checkout workflow boundaries'],
            ['05','Debugging and optimisation','Technical quality','Investigate JavaScript errors, mobile usability, accessibility and performance regressions; prioritise validation.','Performance, accessibility and regression test strategy'],
            ['06','Documentation and release control','Maintainability','Maintain inline explanations, change histories, review branches and verification records.','Inline documentation and GitHub review workflow']
          ].map(([number,title,skill,detail,proof])=><article key={number} className="se-skill-card"><span className="se-skill-number">{number} / {skill}</span><h3>{title}</h3><p>{detail}</p><div className="se-skill-proof"><strong>Engineering evidence</strong><span>{proof}</span></div></article>)}
        </div>
        <p className="se-skills-note">These are engineering capabilities demonstrated through original examples, not claims of client endorsement or measured commercial uplift.</p>
      </section>
      <section className="se-section se-conclusion"><span className="se-eyebrow">08 / WHAT THIS DEMONSTRATES</span><h2>Design fidelity meets engineering discipline.</h2><p>Reusable blocks, theme compatibility, responsive interactions and clear operational boundaries create a more maintainable storefront. The next engineering checks are keyboard access, performance budgets, delivery-rule parity and regression coverage; none is presented here as a completed live-store certification.</p><div className="se-actions"><Link href="/#contact">Discuss a Shopify project <ArrowRight size={18}/></Link><Link href="/?intent=hiring#contact">Hiring or collaboration <Code2 size={18}/></Link></div></section>
    </div>
  </main>;
}
