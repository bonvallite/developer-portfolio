import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, ChartNoAxesCombined,
  CircleCheck, Code2, Layers3, MoveUpRight, Network, ShieldCheck,
  ShoppingBag, Sparkles, Workflow,
} from 'lucide-react';
import HomeJourney from './components/HomeJourney';
import LeadComposer from './components/LeadComposer';
import './cinematic-home.css';

// 2026-11-20 Ember & Teal iteration. Public copy is service-led and intentionally
// avoids personal-name SEO, private account identifiers and invented outcomes.
// Project descriptions distinguish demonstrated interfaces from verified work.
// Featured case-study links and the public footer email carry optional,
// consent-gated, fixed-value click markers without exposing URL or message data.
// The previous site remains recoverable at backup/2026-11-20-pre-cinematic-rebuild.
export const metadata: Metadata = {
  title: 'Shopify Developer, Ecommerce Management & CRO',
  description: 'Shopify development, ecommerce operations, conversion optimisation and custom integrations. Explore responsive storefronts, B2B workflows, APIs and interactive technical case studies.',
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
  },
  {
    id: '02', tag: 'DATA / PYTHON / JAVASCRIPT', title: 'From scattered metrics to clearer decisions.',
    intro: 'A Python analytics pipeline, interactive funnel, module explorer and synthetic acquisition dashboard.',
    challenge: 'Multiple platforms define and export different underlying records.',
    response: 'Source-specific retrieval patterns, structured CSV outputs and a transparent record of limitations.',
    href: '/analytics-lab', link: 'Try the Python analytics lab', icon: ChartNoAxesCombined,
    visual: 'analytics', note: 'Real engineering patterns, fictional dashboard data',
  },
  {
    id: '03', tag: 'INTEGRATIONS / SERVERLESS', title: 'Commerce does not stop at checkout.',
    intro: 'Shopify operational flows connected to delivery estimates, warehouse signals and tracking status.',
    challenge: 'Systems need to exchange updates reliably, without duplicate events or brittle manual steps.',
    response: 'A documented architecture for authentication, webhook processing and recoverable synchronisation.',
    href: '/cartoncloud-integration', link: 'Explore the integration', icon: Workflow,
    visual: 'integration', note: 'Architectural case study; no production secrets',
  },
  {
    id: '04', tag: 'B2B / STOREFRONT SYSTEMS', title: 'Wholesale buying, without the guesswork.',
    intro: 'Explore a modern B2B purchasing experience with understandable pricing tiers and weight-based logic.',
    challenge: 'Business buying decisions often involve catalogue rules and complex quantity requirements.',
    response: 'A fictional-data experience designed to make purchasing rules easier to navigate and validate.',
    href: '/b2b-modernisation', link: 'See the B2B experience', icon: ShoppingBag,
    visual: 'b2b', note: 'Independent interactive demonstration',
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
          <a href="#work">Selected work</a><a href="#services">Expertise</a><a href="#approach">Approach</a>
          <Link href="/experience">Experience</Link><Link href="/resume">Résumé</Link>
        </nav>
        <a href="#contact" className="jrv2-header-cta">Start a conversation <ArrowUpRight size={15} aria-hidden="true" /></a>
        <details className="jrv2-mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><a href="#work">Selected work</a><a href="#services">Expertise</a><a href="#approach">Approach</a><Link href="/experience">Experience</Link><Link href="/resume">Résumé</Link><a href="#contact">Get in touch</a></nav></details>
      </div>
    </header>

    <div id="main-content">
      <section className="jrv2-hero" id="home" aria-labelledby="jrv2-title">
        <div className="jrv2-hero-grid" aria-hidden="true" />
        <div className="jrv2-wrap jrv2-hero-inner">
          <div className="jrv2-hero-copy">
            <div className="jrv2-eyebrow"><span className="jrv2-pulse" aria-hidden="true" /> 9 YEARS OF SHOPIFY & ECOMMERCE EXPERIENCE</div>
            <h1 id="jrv2-title">I build Shopify stores.<br/><span>And the systems behind them.</span></h1>
            <p className="jrv2-hero-lead">Senior Shopify Developer & eCommerce Manager, combining technical engineering, operations and commercial thinking.</p>
            <p className="jrv2-hero-support">Storefront development. Custom integrations. B2B systems. Analytics and conversion thinking. One connected approach.</p>
            <div className="jrv2-hero-actions"><a className="jrv2-cta jrv2-cta-primary" href="#work">Explore my work <ArrowUpRight size={17} aria-hidden="true"/></a><a className="jrv2-cta jrv2-cta-ghost" href="/resume">View résumé options <ArrowRight size={17} aria-hidden="true"/></a></div>
            <div className="jrv2-hero-proof"><span><CircleCheck size={16} aria-hidden="true"/> Documented case studies</span><span><CircleCheck size={16} aria-hidden="true"/> Interactive demos</span><span><CircleCheck size={16} aria-hidden="true"/> Evidence-led practice</span></div>
          </div>
          <div className="jrv2-hero-showcase" aria-label="Illustration of a connected Shopify commerce system">
            <div className="jrv2-console">
              <div className="jrv2-console-top"><span className="jrv2-console-dots" aria-hidden="true"><i/><i/><i/></span><b>JRV / SYSTEM VIEW</b><span>01 — 04</span></div>
              <div className="jrv2-console-body">
                <div className="jrv2-console-label">THE COMMERCE ENGINE</div>
                <h2>Connected by<br/><em>design.</em></h2>
                <div className="jrv2-console-nodes">
                  <div><Code2 size={17} aria-hidden="true"/><span>STOREFRONT</span><b>EXPERIENCE</b></div>
                  <i className="jrv2-node-connector" aria-hidden="true"/>
                  <div><Workflow size={17} aria-hidden="true"/><span>AUTOMATION</span><b>WORKFLOWS</b></div>
                  <i className="jrv2-node-connector" aria-hidden="true"/>
                  <div><ChartNoAxesCombined size={17} aria-hidden="true"/><span>ANALYTICS</span><b>DECISIONS</b></div>
                </div>
                <div className="jrv2-console-code"><span>THE METHOD</span><div>01 <b>Understand</b> the problem</div><div>02 <b>Design</b> the system</div><div>03 <b>Build</b> with care</div><div>04 <b>Review</b> the evidence</div></div>
              </div>
              <div className="jrv2-console-bottom"><span>INTERACTIVE WORK / REAL-WORLD CONSTRAINTS</span><span>● <b>DOCUMENTED</b></span></div>
            </div>
            <span className="jrv2-hero-orbit jrv2-hero-orbit-one" aria-hidden="true"/><span className="jrv2-hero-orbit jrv2-hero-orbit-two" aria-hidden="true"/>
          </div>
        </div>
        <div className="jrv2-wrap jrv2-scroll-note"><span>SCROLL TO EXPLORE</span><span aria-hidden="true">↓</span></div>
      </section>

      <div className="jrv2-capability-strip" aria-label="Core skills and technologies"><div className="jrv2-wrap"><span>SHOPIFY & LIQUID</span><i/><span>JAVASCRIPT</span><i/><span>API ENGINEERING</span><i/><span>B2B COMMERCE</span><i/><span>TECHNICAL SEO</span><i/><span>CONVERSION OPTIMISATION</span></div></div>

      <section className="jrv2-section jrv2-work" id="work" aria-labelledby="jrv2-work-title">
        <div className="jrv2-wrap">
          <div className="jrv2-section-head"><div><span className="jrv2-overline">01 / SELECTED WORK</span><h2 id="jrv2-work-title">Proof in the <em>process.</em></h2></div><p>Not a gallery of pretty screens. Explore the problems, architecture, design choices and working demonstrations behind the projects.</p></div>
          <div className="jrv2-case-grid">
            {cases.map((item, index) => <article className={'jrv2-case jrv2-case-' + (index+1)} key={item.id}>
              <div className="jrv2-case-heading"><span>{item.id} / {item.tag}</span><item.icon size={22} strokeWidth={1.5} aria-hidden="true"/></div>
              <CaseVisual mode={item.visual}/>
              <div className="jrv2-case-content">
                <h3>{item.title}</h3><p className="jrv2-case-lede">{item.intro}</p>
                <div className="jrv2-case-story"><div><span>THE CHALLENGE</span><p>{item.challenge}</p></div><div><span>THE RESPONSE</span><p>{item.response}</p></div></div>
                <div className="jrv2-case-bottom"><span className="jrv2-case-note">{item.note}</span><Link href={item.href} className="jrv2-case-link" data-jrv-track="case" data-jrv-case={item.visual}>{item.link} <MoveUpRight size={16} aria-hidden="true"/></Link></div>
              </div>
            </article>)}
          </div>
          <div className="jrv2-work-after"><p>See responsive storefront concepts, documented integrations and more technical evidence in the full portfolio.</p><Link href="/experience">Explore the project archive <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
        </div>
      </section>

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
      <div className="jrv2-footer-top"><div><a className="jrv2-wordmark" href="#home" aria-label="JRV, back to top"><span>{'{JRV}'}</span></a><p>Commerce engineering for thoughtful Shopify experiences and reliable operations.</p></div><div className="jrv2-footer-links"><div><strong>EXPLORE</strong><Link href="/experience">Experience</Link><Link href="/editorial-homepage-demo">Storefront demo</Link><Link href="/data-extraction-automation">Data engineering</Link><Link href="/shopify-flow">Shopify Flow</Link></div><div><strong>CONNECT</strong><a href="mailto:hello@jrvallite.com" data-jrv-track="email" data-jrv-intent="general" data-jrv-source="footer">Email</a><Link href="/resume">Résumé designs</Link><a href="https://www.linkedin.com/in/bonvallite/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://g.dev/bonvallite" target="_blank" rel="noopener noreferrer">Google Developer</a><a href="https://en.wikipedia.org/wiki/Special:Contributions/Bonvallite" target="_blank" rel="noopener noreferrer">Wikipedia contributions</a></div><div><strong>ACCOUNT / LEGAL</strong><Link href="/privacy">Privacy & analytics</Link><Link href="/experience#training">Professional training</Link><a href="https://webmail.jrvallite.com/" target="_blank" rel="noopener noreferrer nofollow">Webmail login</a></div></div></div>
      <div className="jrv2-footer-bottom"><span>© {new Date().getFullYear()} JRV / SHOPIFY COMMERCE ENGINEERING</span><span>NO CLIENT DATA IN THE DEMOS</span><a href="#home">BACK TO TOP ↑</a></div>
    </div></footer>
  </main>;
}
