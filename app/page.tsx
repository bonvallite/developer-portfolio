import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined,
  Code2, Layers3, MoveUpRight, Network, ShieldCheck,
  ShoppingBag, Sparkles, Workflow,
} from 'lucide-react';
import HomeJourney from './components/HomeJourney';
import CommerceWorkbench from './components/CommerceWorkbench';
import StorefrontShowcase from './experience/StorefrontShowcase';
import FeaturedSystemsLab from './components/FeaturedSystemsLab';
import { storefronts } from './data/storefronts';
import LeadComposer from './components/LeadComposer';
import './cinematic-home.css';
import './components/commerce-workbench.css';

// 2026-11-20 Ember & Teal iteration. Public copy is service-led and intentionally
// avoids personal-name SEO, private account identifiers and invented outcomes.
// Project descriptions distinguish demonstrated interfaces from verified work.
// Featured case-study links and the public footer email carry optional,
// consent-gated, fixed-value click markers without exposing URL or message data.
// The previous site remains recoverable at backup/2026-11-20-pre-cinematic-rebuild.
// 21 Nov visual upgrade: replace the static hero console with a working,
// accessible four-project studio. Existing case studies, canonical metadata,
// CTA routes, synthetic-data boundaries, and privacy settings are unchanged.
// 22 Nov 2026: restore all eleven public storefront references, homepage
// previews and a static link list. The existing image service is lazy,
// cached and has a visible fallback. References do not imply endorsement,
// exclusive design credit or measured outcomes.
// 21 Nov 2026 crawl: concise homepage description keeps Shopify, CRO, B2B
// and integration search intent while avoiding truncated search snippets.
// 22 Nov 2026 audience journey: replace generic hero proof badges with two
// direct client/hiring paths. They reuse existing homepage contact and
// experience routes, not a new form or visitor analytics. All four project
// demos, source-safe evidence and existing public SEO metadata remain intact.
// 24 Nov 2026: the selected-work footer now links to the fictional,\n// brand-neutral commerce experience lab without changing the four flagship\n// cards, eleven-site gallery, contact tracking or existing metadata.\n// 23 Nov 2026: approved PR #100 now publishes a separate, fictional-data
// Shopify app systems section after the preserved 11-site gallery. All four
// original case studies, homepage navigation and website previews remain.
export const metadata: Metadata = {
  title: 'Shopify Developer, Ecommerce Management & CRO',
  description: 'Shopify developer for ecommerce teams. Explore Liquid storefronts, CRO, B2B workflows, custom apps and API integration case studies.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://www.jrvallite.com/',
    title: 'Shopify Development & Ecommerce Engineering | JRV',
    description: 'Building considered Shopify experiences, connected workflows and conversion-focused commerce systems.',
  },
};

const services = [
  { number: '01', title: 'Shopify development', summary: 'Liquid, Online Store 2.0, responsive storefronts, collection and product-page experience, and maintainable theme systems.', href: '/shopify-developer', link: 'Explore development', icon: Code2 },
  { number: '02', title: 'Ecommerce management', summary: 'Product operations, B2B catalogues, merchandising, promotions, reporting and the daily details that keep a store moving.', href: '/ecommerce-management', link: 'Explore management', icon: ShoppingBag },
  { number: '03', title: 'Conversion optimisation', summary: 'Customer-journey diagnostics, analytics quality, discoverability, technical SEO and evidence-led prioritisation.', href: '/shopify-cro', link: 'Explore CRO', icon: ChartNoAxesCombined },
  { number: '04', title: 'Custom apps & integrations', summary: 'APIs, webhooks, serverless processing, Shopify Flow and operational systems designed for reliable handover.', href: '/shopify-app-development', link: 'Explore integrations', icon: Network },
];

// Four flagship case studies: rewards, analytics, integrations and B2B.
const cases = [
  {
    id: '01', tag: 'AUTOMATION / CUSTOMER EXPERIENCE', title: 'A smarter way to reward every order.',
    intro: 'Spend & Save: a clear customer-facing milestone journey, with a separate post-checkout fulfilment workflow.',
    challenge: 'Give shoppers meaningful progress without promising a cart gift that has not been added yet.',
    response: 'An interactive ladder demo explains how cart visuals, rules and Shopify Flow work together.',
    href: '/projects/spend-and-save', link: 'Explore the reward journey', icon: Layers3,
    visual: 'rewards', note: 'Conceptual rules and a fictional demonstration',
    stack: ['Liquid', 'JavaScript', 'Shopify Flow'],
  },
  {
    id: '02', tag: 'DATA / PYTHON / JAVASCRIPT', title: 'From scattered metrics to clearer decisions.',
    intro: 'A Python analytics pipeline, interactive funnel, module explorer and synthetic acquisition dashboard.',
    challenge: 'Multiple platforms define and export different underlying records.',
    response: 'Source-specific retrieval patterns, structured CSV outputs and a transparent record of limitations.',
    href: '/analytics-lab', link: 'Try the Python analytics lab', icon: ChartNoAxesCombined,
    visual: 'analytics', note: 'Real engineering patterns, fictional dashboard data',
    stack: ['Python', 'GA4', 'Data validation'],
  },
  {
    id: '03', tag: 'INTEGRATIONS / SERVERLESS', title: 'Commerce does not stop at checkout.',
    intro: 'Shopify operational flows connected to delivery estimates, warehouse signals and tracking status.',
    challenge: 'Systems need to exchange updates reliably, without duplicate events or brittle manual steps.',
    response: 'A documented architecture for authentication, webhook processing and recoverable synchronisation.',
    href: '/cartoncloud-integration', link: 'Explore the integration', icon: Workflow,
    visual: 'integration', note: 'Architectural case study; no production secrets',
    stack: ['Cloudflare Workers', 'Webhooks', 'Shopify APIs'],
  },
  {
    id: '04', tag: 'B2B / STOREFRONT SYSTEMS', title: 'Wholesale buying, without the guesswork.',
    intro: 'Explore a modern B2B purchasing experience with understandable pricing tiers and weight-based logic.',
    challenge: 'Business buying decisions often involve catalogue rules and complex quantity requirements.',
    response: 'A fictional-data experience designed to make purchasing rules easier to navigate and validate.',
    href: '/b2b-modernisation', link: 'See the B2B experience', icon: ShoppingBag,
    visual: 'b2b', note: 'Independent interactive demonstration',
    stack: ['Shopify B2B', 'Catalogues', 'UI engineering'],
  },
] as const;

const tenets = [
  ['01', 'Think commercially', 'An elegant screen matters, but so do merchandising, operational reality and the path to a decision.'],
  ['02', 'Engineer carefully', 'Readable systems, accessible interactions, fallback states and documented dependencies make improvements sustainable.'],
  ['03', 'Respect the evidence', 'Measured outcomes and fictional demonstrations stay separate. No client records or invented success metrics.'],
] as const;

// WebSite schema documents the public brand and professional service themes,
// not the owner's private identity or an unverified corporate organisation.
const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'JRV | Shopify Commerce Engineering',
  url: 'https://www.jrvallite.com/',
  description: 'Shopify development, ecommerce management, conversion optimisation and custom commerce integrations.',
}).replace(/</g, '\\u003c');

function CaseVisual({ mode }: { mode: typeof cases[number]['visual'] }) {
  return <div className={'jrv2-case-visual jrv2-case-visual-' + mode} aria-hidden="true">
    {mode === 'rewards' && <div className="jrv2-visual-rewards"><div className="jrv2-ui-meta">CART REWARD PROGRESSION <span>VISUAL DEMO</span></div><div className="jrv2-reward-line"><i/><i/><i/></div><div className="jrv2-reward-steps"><span>$150</span><span>$200</span><span>$300</span></div><div className="jrv2-ui-foot">MILESTONES → ORDER AUTOMATION</div></div>}
    {mode === 'analytics' && <div className="jrv2-visual-analytics"><div className="jrv2-ui-meta">REPORTING PIPELINE <span>CSV / MANIFEST</span></div><div className="jrv2-micro-bars">{[30,48,41,72,55,78,66,91,70,86].map((height,index)=><i key={index} style={{height:height+'%'}} />)}</div><div className="jrv2-ui-foot">DATA SOURCES → CHECKS → HANDOVER</div></div>}
    {mode === 'integration' && <div className="jrv2-visual-integration"><div className="jrv2-ui-meta">SYSTEM INTEGRATION <span>EVENT-DRIVEN</span></div><div className="jrv2-system-link"><span>SHOPIFY</span><i/><span>WORKER</span><i/><span>WAREHOUSE</span></div><div className="jrv2-ui-foot">WEBHOOKS / STATUS / RETRIES</div></div>}
    {mode === 'b2b' && <div className="jrv2-visual-b2b"><div className="jrv2-ui-meta">B2B PURCHASE JOURNEY <span>FICTIONAL</span></div><div className="jrv2-tier-stack"><span><b>01</b> CATALOGUE</span><span><b>02</b> WEIGHT RULES</span><span><b>03</b> CHECKOUT</span></div><div className="jrv2-ui-foot">BUSINESS BUYING / CLEARER RULES</div></div>}
  </div>;
}

export default function Home() {
  return <main className="jrv2-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    <a href="#main-content" className="jrv2-skip">Skip to main content</a>
    <div className="jrv2-topline"><div className="jrv2-wrap"><span>JRV / COMMERCE ENGINEERING</span><span>SHOPIFY · SYSTEMS · EXPERIENCE</span></div></div>
    <header className="jrv2-header">
      <div className="jrv2-wrap jrv2-header-inner">
        <a href="#home" className="jrv2-wordmark" aria-label="JRV portfolio, back to top"><span>{'{JRV}'}</span><small>SHOPIFY COMMERCE ENGINEERING</small></a>
        <nav aria-label="Primary navigation" className="jrv2-main-nav">
          <a href="#work">Projects</a><a href="#websites">Websites</a><a href="#systems-lab">Systems</a><a href="#services">Expertise</a><a href="#approach">Approach</a>
          <Link href="/experience">Experience</Link><Link href="/resume">Résumé</Link>
        </nav>
        <a href="#contact" className="jrv2-header-cta">Start a conversation <ArrowUpRight size={15} aria-hidden="true" /></a>
        <details className="jrv2-mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><a href="#work">Projects</a><a href="#websites">Websites</a><a href="#systems-lab">Systems</a><a href="#services">Expertise</a><a href="#approach">Approach</a><Link href="/experience">Experience</Link><Link href="/resume">Résumé</Link><a href="#contact">Get in touch</a></nav></details>
      </div>
    </header>

    <div id="main-content">
      <section className="jrv2-hero" id="home" aria-labelledby="jrv2-title">
        <div className="jrv2-hero-grid" aria-hidden="true" />
        <div className="jrv2-wrap jrv2-hero-inner">
          <div className="jrv2-hero-copy">
            <div className="jrv2-eyebrow"><span className="jrv2-pulse" aria-hidden="true" /> 9 YEARS OF SHOPIFY & ECOMMERCE EXPERIENCE</div>
            <h1 id="jrv2-title">I build Shopify stores.<br/><span>And the systems behind them.</span></h1>
            <p className="jrv2-hero-lead">Shopify development and ecommerce management, from conversion-focused storefronts to the systems that keep orders moving.</p>
            <p className="jrv2-hero-support">Liquid and JavaScript. B2B buying. Python analytics. Custom apps, APIs and Cloudflare Workers. Explore working demonstrations and documented engineering decisions.</p>
            <div className="jrv2-hero-actions"><a className="jrv2-cta jrv2-cta-primary" href="#work">Explore my work <ArrowUpRight size={17} aria-hidden="true"/></a><a className="jrv2-cta jrv2-cta-ghost" href="/resume">View résumé options <ArrowRight size={17} aria-hidden="true"/></a></div>
            {/* Choose a visitor goal immediately, without competing lead forms.
                Project enquiries use the existing consent-safe homepage contact;
                hiring teams can inspect public experience and case evidence. */}
            <nav className="jrv2-hero-paths" aria-label="Choose how to work together">
              <a href="#contact" className="jrv2-hero-path">
                <BriefcaseBusiness size={22} aria-hidden="true" />
                <span className="jrv2-hero-path-text"><small>ECOMMERCE TEAMS</small><strong>Discuss a Shopify challenge</strong><span>Storefronts · CRO · B2B · automation</span></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <Link href="/experience" className="jrv2-hero-path">
                <Sparkles size={22} aria-hidden="true" />
                <span className="jrv2-hero-path-text"><small>HIRING TEAMS</small><strong>Review Shopify experience</strong><span>Technical work · practical responsibilities</span></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </nav>
          </div>
          <div className="jrv2-hero-showcase" id="studio" aria-label="Explore four interactive portfolio project previews">
            <CommerceWorkbench />
            <span className="jrv2-hero-orbit jrv2-hero-orbit-one" aria-hidden="true"/><span className="jrv2-hero-orbit jrv2-hero-orbit-two" aria-hidden="true"/>
          </div>
        </div>
        <div className="jrv2-wrap jrv2-scroll-note"><span>SCROLL TO EXPLORE</span><span aria-hidden="true">↓</span></div>
      </section>

      <div className="jrv2-capability-strip" aria-label="Core skills and technologies"><div className="jrv2-wrap"><span>SHOPIFY & LIQUID</span><i/><span>JAVASCRIPT</span><i/><span>API ENGINEERING</span><i/><span>B2B COMMERCE</span><i/><span>TECHNICAL SEO</span><i/><span>CONVERSION OPTIMISATION</span></div></div>

      <section className="jrv2-section jrv2-work" id="work" aria-labelledby="jrv2-work-title">
        <div className="jrv2-wrap">
          <div className="jrv2-section-head"><div><span className="jrv2-overline">01 / SELECTED WORK</span><h2 id="jrv2-work-title">Proof in the <em>process.</em></h2></div><p>Try the four working previews in the studio above, then explore the problems, architecture, implementation choices, and demonstrations behind each project.</p></div>
          <div className="jrv2-case-grid">
            {cases.map((item, index) => <article className={'jrv2-case jrv2-case-' + (index+1)} key={item.id}>
              <div className="jrv2-case-heading"><span>{item.id} / {item.tag}</span><item.icon size={22} strokeWidth={1.5} aria-hidden="true"/></div>
              <CaseVisual mode={item.visual}/>
              <div className="jrv2-case-content">
                <h3>{item.title}</h3><p className="jrv2-case-lede">{item.intro}</p>
                <div className="jrv2-case-stack" aria-label="Project technologies"><span>TECH STACK</span>{item.stack.map(technology => <b key={technology}>{technology}</b>)}</div>
                <div className="jrv2-case-story"><div><span>THE CHALLENGE</span><p>{item.challenge}</p></div><div><span>THE RESPONSE</span><p>{item.response}</p></div></div>
                <div className="jrv2-case-bottom"><span className="jrv2-case-note">{item.note}</span><Link href={item.href} className="jrv2-case-link" data-jrv-track="case" data-jrv-case={item.visual}>{item.link} <MoveUpRight size={16} aria-hidden="true"/></Link></div>
              </div>
            </article>)}
          </div>
          <div className="jrv2-work-after"><p>Explore an original brand-neutral Shopify storefront laboratory, from editorial hero and educational sections to product discovery, navigation and code.</p><Link href="/projects/storefront-engineering#technical-lab">Explore the commerce experience lab <ArrowUpRight size={17} aria-hidden="true"/></Link><Link href="/experience">Explore the project archive <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
        </div>
      </section>


      {/* 24 Nov 2026: additive, brand-neutral Shopify lab showcase.
          This section does not alter existing project cards or site gallery.
          The demonstration is fictional; the CTA jumps to the technical navigation in the separate case study. */}
      <section className="jrv2-section jrv2-lab-feature" aria-labelledby="jrv2-lab-title">
        <div className="jrv2-wrap jrv2-lab-layout">
          <div className="jrv2-lab-copy">
            <span className="jrv2-overline">FEATURED / SHOPIFY ENGINEERING LAB</span>
            <h2 id="jrv2-lab-title">The experience behind <em>the storefront.</em></h2>
            <p>Explore how a Shopify shopping experience comes together, from editorial hero and product education to navigation, product options, and the code that connects them.</p>
            <div className="jrv2-lab-tags" aria-label="Demonstrated skills"><span>Liquid</span><span>CSS</span><span>JavaScript</span><span>Online Store 2.0</span></div>
            <Link className="jrv2-lab-cta" href="/projects/storefront-engineering#technical-lab">Explore diagrams, workflows and code <ArrowUpRight size={18} aria-hidden="true"/></Link>
            <p className="jrv2-lab-disclaimer">Original fictional demonstration. No merchant data or live checkout.</p>
          </div>
          <div className="jrv2-lab-preview" aria-label="Illustration of the storefront engineering process">
            <div className="jrv2-lab-preview-top"><span>COMMERCE EXPERIENCE LAB</span><span>01 / 04</span></div>
            <div className="jrv2-lab-preview-hero"><span>EDITORIAL EXPERIENCE</span><strong>Discover. Understand. Shop.</strong><p>From visual storytelling to confident product decisions.</p></div>
            <div className="jrv2-lab-preview-grid"><div><Code2 size={21} aria-hidden="true"/><strong>Behind the code</strong><small>Liquid · CSS · JS</small></div><div><Workflow size={21} aria-hidden="true"/><strong>Interactive workflow</strong><small>Architecture · Journey</small></div></div>
          </div>
        </div>
      </section>

      {/* Public storefront references are separate from the four fictional
          interactive engineering labs. One active desktop/mobile pair at a
          time uses locally hosted 19 Nov 2026 WebPs, with direct live-site
          links when captures are missing or fail. Keep the 11-link index. */}
      <section className="jrv2-section jrv2-websites" id="websites" aria-labelledby="jrv2-websites-title">
        <div className="jrv2-wrap">
          <div className="jrv2-section-head"><div>
            <span className="jrv2-overline">01B / PUBLISHED STOREFRONTS</span>
            <h2 id="jrv2-websites-title">Websites I've built <em>and worked on.</em></h2>
          </div><p>Eleven public storefronts I have helped build, manage or improve. Browse desktop and mobile homepage previews, then explore the live sites.</p></div>
          <StorefrontShowcase stores={storefronts}/>
          <div className="jrv2-websites-list" aria-labelledby="jrv2-websites-index-title">
            <div className="jrv2-websites-index-head">
              <h3 id="jrv2-websites-index-title">All 11 websites</h3>
              <span>VISIT THE PUBLISHED HOMEPAGES</span>
            </div>
            <div className="jrv2-websites-links">
              {storefronts.map(([name, url], index) =>
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={'Visit ' + name + ' homepage in a new tab'}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{name}</strong>
                  <ArrowUpRight size={16} aria-hidden="true"/>
                </a>)}
            </div>
          </div>
          <div className="jrv2-websites-after">
            <p>These are self-reported contributions, not client endorsements or claims of exclusive authorship. Homepage previews were captured on 19 November 2026 and may show promotions or overlays. The gallery uses locally hosted captures only, with direct live-site links when a preview is unavailable; current homepages may look different.</p>
            <Link href="/experience#storefronts">See the experience and homepage case study <ArrowUpRight size={16} aria-hidden="true"/></Link>
          </div>
        </div>
      </section>

      {/* Keep all eleven published homepage previews above the new engineering
          flagship. The published engineering project is a separate addition, not a
          replacement for the earlier CartonCloud case study or selected work. */}
      <FeaturedSystemsLab />

      <section className="jrv2-section jrv2-services" id="services" aria-labelledby="jrv2-services-title">
        <div className="jrv2-wrap">
          <div className="jrv2-section-head"><div><span className="jrv2-overline">02 / EXPERTISE</span><h2 id="jrv2-services-title">Built for the <em>whole journey.</em></h2></div><p>Hire for a defined challenge or a broader commerce engineering role. Each area is backed by technical work you can examine.</p></div>
          <div className="jrv2-services-grid">{services.map(s=><article key={s.number} className="jrv2-service"><div className="jrv2-service-top"><span>{s.number} / SERVICE</span><s.icon size={26} strokeWidth={1.5} aria-hidden="true" /></div><h3>{s.title}</h3><p>{s.summary}</p><Link href={s.href}>{s.link} <ArrowUpRight size={17} aria-hidden="true" /></Link></article>)}</div>
          <div className="jrv2-service-bridge"><span>NEED HELP DECIDING WHERE TO START?</span><a href="#contact">Share your challenge <ArrowRight size={17} aria-hidden="true"/></a></div>
        </div>
      </section>

      <section className="jrv2-section jrv2-approach" id="approach" aria-labelledby="jrv2-approach-title">
        <div className="jrv2-wrap">
          <div className="jrv2-section-head"><div><span className="jrv2-overline">03 / A CONNECTED APPROACH</span><h2 id="jrv2-approach-title">Good engineering<br/>has a <em>story.</em></h2></div><p>Every effective Shopify improvement has a before, a decision, an implementation and an outcome worth checking.</p></div>
          <HomeJourney />
        </div>
      </section>

      <section className="jrv2-section jrv2-principles" id="engineering-quality" aria-labelledby="jrv2-principles-title">
        <div className="jrv2-wrap"><div className="jrv2-section-head"><div><span className="jrv2-overline">04 / HOW I WORK</span><h2 id="jrv2-principles-title">Details make the <em>difference.</em></h2></div><p>Performance, accessibility, privacy and reliability are engineering decisions, not decoration added at the end.</p></div>
          <div className="jrv2-tenets">{tenets.map(item=><article key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></article>)}</div>
          <div className="jrv2-evidence-ribbon"><ShieldCheck size={24} aria-hidden="true"/><p>Source-safe case studies, fictional demonstration data, regression checks and honest limitations.</p><Link href="/engineering-standards">Review engineering standards <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
        </div>
      </section>

      <section className="jrv2-section jrv2-audience" id="hiring" aria-labelledby="jrv2-audience-title">
        <div className="jrv2-wrap"><div className="jrv2-audience-header"><span className="jrv2-overline">05 / TWO WAYS TO WORK TOGETHER</span><h2 id="jrv2-audience-title">The right expertise.<br/><em>For the right challenge.</em></h2></div>
          <div className="jrv2-audience-grid">
            <article id="client-enquiries"><div className="jrv2-audience-label"><BriefcaseBusiness size={21} aria-hidden="true"/> ECOMMERCE BUSINESSES</div><h3>Have a store challenge?</h3><p>Need theme improvements, a more effective buying journey, custom app work, B2B logic or clearer analytics? Begin with the requirement.</p><a href="#contact">Discuss your project <ArrowUpRight size={18} aria-hidden="true"/></a></article>
            <article><div className="jrv2-audience-label"><Sparkles size={21} aria-hidden="true"/> EMPLOYERS & RECRUITERS</div><h3>Building your team?</h3><p>Looking for Shopify development, ecommerce management, CRO or integrations expertise? Review the experience and see the technical examples.</p><Link href="/resume">Explore résumé designs <ArrowUpRight size={18} aria-hidden="true"/></Link><Link href="/experience" className="jrv2-audience-secondary">Professional experience <ArrowRight size={16} aria-hidden="true"/></Link></article>
          </div>
        </div>
      </section>

      <section className="jrv2-section jrv2-about" id="about" aria-labelledby="jrv2-about-title">
        <div className="jrv2-wrap jrv2-about-layout"><div><span className="jrv2-overline">06 / ABOUT THE PRACTICE</span><h2 id="jrv2-about-title">Technical depth.<br/><em>Commercial perspective.</em></h2></div><div><p>I work across the layers of ecommerce that customers see and the systems that keep a business running. That means storefront design, B2B logic, fulfilment automation, analytics diagnostics and ongoing improvement.</p><p>The aim is straightforward: reduce unnecessary complexity, build useful experiences and leave the next person with something they can maintain.</p><Link href="/experience" className="jrv2-text-link">Explore responsibilities and experience <ArrowUpRight size={17} aria-hidden="true"/></Link><div className="jrv2-about-tags" id="skills"><span>LIQUID</span><span>TYPESCRIPT</span><span>REACT</span><span>SHOPIFY FLOW</span><span>APIS / WEBHOOKS</span><span>ANALYTICS</span></div></div></div>
      </section>

      <section className="jrv2-contact-section" id="contact" aria-labelledby="jrv2-contact-title"><div className="jrv2-wrap">
        <div className="jrv2-contact-heading"><span className="jrv2-overline">07 / YOUR NEXT MOVE</span><h2 id="jrv2-contact-title">Let's make your next<br/><em>move matter.</em></h2><p>From targeted Shopify improvements to bigger commerce systems, start with a practical conversation.</p></div>
        <LeadComposer />
      </div></section>
    </div>
    <footer className="jrv2-footer"><div className="jrv2-wrap">
      <div className="jrv2-footer-top"><div><a className="jrv2-wordmark" href="#home" aria-label="JRV, back to top"><span>{'{JRV}'}</span></a><p>Commerce engineering for thoughtful Shopify experiences and reliable operations.</p></div><div className="jrv2-footer-links"><div><strong>EXPLORE</strong><Link href="/experience">Experience</Link><Link href="/projects/commerce-integration-engineering">Systems engineering lab</Link><Link href="/editorial-homepage-demo">Storefront demo</Link><Link href="/data-extraction-automation">Data engineering</Link><Link href="/shopify-flow">Shopify Flow</Link></div><div><strong>CONNECT</strong><a href="mailto:hello@jrvallite.com" data-jrv-track="email" data-jrv-intent="general" data-jrv-source="footer">Email</a><Link href="/resume">Résumé designs</Link><a href="https://www.linkedin.com/in/bonvallite/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://g.dev/bonvallite" target="_blank" rel="noopener noreferrer">Google Developer</a><a href="https://en.wikipedia.org/wiki/Special:Contributions/Bonvallite" target="_blank" rel="noopener noreferrer">Wikipedia contributions</a></div><div><strong>ACCOUNT / LEGAL</strong><Link href="/privacy">Privacy & analytics</Link><Link href="/experience#training">Professional training</Link><a href="https://webmail.jrvallite.com/" target="_blank" rel="noopener noreferrer nofollow">Webmail login</a></div></div></div>
      <div className="jrv2-footer-bottom"><span>© {new Date().getFullYear()} JRV / SHOPIFY COMMERCE ENGINEERING</span><span>NO CLIENT DATA IN THE DEMOS</span><a href="#home">BACK TO TOP ↑</a></div>
    </div></footer>
  </main>;
}
