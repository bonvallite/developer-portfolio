import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Globe2, Languages, Coins, PackageSearch, PanelsTopLeft, Waypoints, ShieldCheck, BadgePercent, CreditCard } from 'lucide-react';
import MarketPreview from './MarketPreview';

export const metadata: Metadata = {
  title: 'Eve Curls | Shopify Markets & European Localisation | Jomar Vallite',
  description: 'International Shopify Markets architecture case study covering six European markets, regional languages, currencies, catalogues, domains, theme customisations and a fictional interactive demo.',
};

const markets = [
  {flag:'🇬🇧',country:'United Kingdom',language:'English',currency:'GBP'},
  {flag:'🇨🇭',country:'Switzerland',language:'German, French, Italian',currency:'CHF'},
  {flag:'🇳🇱',country:'Netherlands',language:'Dutch',currency:'EUR'},
  {flag:'🇮🇹',country:'Italy',language:'Italian',currency:'EUR'},
  {flag:'🇫🇷',country:'France',language:'French',currency:'EUR'},
  {flag:'🇪🇸',country:'Spain',language:'Spanish',currency:'EUR'},
];

const layers = [
  {icon:Coins,title:'Currency',body:'Assign GBP, CHF or EUR to the relevant market. Price display and local-currency checkout depend on the store\'s payment processor, currency configuration and applicable exchange rules.'},
  {icon:PackageSearch,title:'Catalogs',body:'Structure market-specific product availability and prices through Shopify Catalogs. Inherited settings and deliberate market overrides help maintain one manageable assortment.'},
  {icon:BadgePercent,title:'Discounts',body:'Choose which markets a promotion applies to. Percentage discounts use local prices; fixed-value offers defined in the store currency are converted at checkout.'},
  {icon:PanelsTopLeft,title:'Online Store / Theme',body:'Use one published theme with market-specific section content, banners, block visibility and regional landing-page messages where the plan supports overrides.'},
  {icon:CreditCard,title:'Checkout and accounts',body:'Review localised checkout and customer account journeys. Market-specific checkout and account customisations require Shopify Advanced or Plus; deeper checkout block options can be Plus-only.'},
  {icon:Languages,title:'Domain / language',body:'Coordinate market domains or subfolders, country and language selection, translated content and international SEO so customers reach their intended regional experience.'},
];

export default function EveCurlsMarketsCaseStudy() {
  return <main className="flow-page">
    <div className="container flow-header markets-case-hero">
      <Link href="/experience" className="flow-back"><ArrowLeft size={17}/> Back to experience</Link>
      <div className="markets-case-kicker"><span className="overline">EVE CURLS / INTERNATIONAL SHOPIFY ENGINEERING</span><span className="markets-case-chip"><Globe2 size={15}/> 6 regional markets</span></div>
      <h1>One commerce ecosystem.<br/><em>Six local experiences.</em></h1>
      <p>A case study of how I approached an international Shopify storefront for Eve Curls, coordinating European markets, local languages, currencies, product catalogues, regional domains, discounts, checkout and account experiences, and market-specific page content from a single account.</p>
      <div className="markets-case-actions"><a className="button secondary" href="https://www.evecurls.com/" target="_blank" rel="noopener noreferrer">Visit Eve Curls <ArrowUpRight size={17}/></a><a className="button primary" href="#interactive-market-demo">Try market preview <ArrowUpRight size={17}/></a></div>
    </div>
    <section className="container markets-architecture">
      <Image src="/portfolio/eve-curls-markets.svg" width={1200} height={630} alt="Conceptual diagram of one Shopify account supporting the United Kingdom, Switzerland, Netherlands, Italy, France and Spain with localised experiences" sizes="(max-width: 1180px) 100vw, 1120px" className="markets-architecture-image" unoptimized />
      <p>Architecture illustration. Country nodes show the intended localisation dimensions, not exported account settings.</p>
    </section>
    <section className="container section markets-case-section">
      <span className="overline">01 / THE CHALLENGE</span><h2>International growth without fragmented stores.</h2>
      <p className="markets-case-intro">The European market is not one uniform audience. Customers in Switzerland, the United Kingdom, the Netherlands, Italy, France and Spain expect relevant languages, currencies and shopping experiences. A generic storefront risks mismatched product offerings, confusing prices, inappropriate campaigns and weak local relevance.</p>
      <div className="markets-country-grid">{markets.map(m=><article key={m.country}><span aria-hidden="true">{m.flag}</span><div><strong>{m.country}</strong><small>{m.language} · {m.currency}</small></div></article>)}</div>
    </section>
    <section className="container section markets-case-section">
      <span className="overline">02 / THE SOLUTION</span><h2>Six market settings. One manageable Shopify architecture.</h2>
      <p className="markets-case-intro">My work centred on making the experience adaptable by location while keeping market management, storefront engineering and merchandising in one Shopify ecosystem. The approach uses country or regional market rules with inherited defaults and deliberate overrides across six related configuration areas, rather than duplicating every component and operational process.</p>
      <div className="markets-layer-grid">{layers.map(layer=><article key={layer.title}><layer.icon size={28} strokeWidth={1.6}/><h3>{layer.title}</h3><p>{layer.body}</p></article>)}</div>
      <div className="markets-architecture-note"><Waypoints size={26}/><p><strong>Implementation distinction:</strong> Markets inherit defaults until a specific setting is overridden. Shopify publishes one online-store theme at a time; per-market theme and checkout/account customisations require Advanced or Plus, and global colours, typography and Liquid templates are not independently editable for each market. Region-specific checkout block customisations can be Plus-only. All market configurations shown in this case study are illustrative, not a disclosure of the Eve Curls admin.</p></div>
    </section>
    <section className="container section markets-case-section" id="interactive-market-demo">
      <span className="overline">03 / INTERACTIVE ENGINEERING DEMO</span><h2>See localisation in action.</h2>
      <p className="markets-case-intro">Switch between six countries and watch the sample storefront adapt its currency display, sample product catalogue, fictional percentage discount, theme content, illustrative checkout/account wording, and domain/language route. This is a live React interface, not a static screenshot and not connected to Eve Curls.</p>
      <MarketPreview />
    </section>
    <section className="container section markets-case-section">
      <span className="overline">04 / WHAT THIS WORK DEMONSTRATES</span><h2>Systems thinking beyond theme customisation.</h2>
      <div className="markets-outcomes">
        <article><Globe2 size={29}/><h3>Regional customer experience</h3><p>Coordinate language, local currency presentation, product discovery and promotions around a customer\'s selected market.</p></article>
        <article><Waypoints size={29}/><h3>Maintainable architecture</h3><p>Centralise shared storefront behaviour and use explicit regional overrides only where they add value.</p></article>
        <article><ShieldCheck size={29}/><h3>Cross-market quality assurance</h3><p>Validate currency displays, translations, catalogues, discount eligibility, checkout/account language, URLs, landing-page variants and mobile layouts across representative market contexts.</p></article>
      </div>
      <p className="markets-evidence">Experience summary supplied by the developer. The six countries and six configuration areas represent the scope described for this case study; the public demo does not verify which configurations are currently active on the production shop. No revenue, conversion improvement, or deployment count is claimed. This page contains no client exports, API secrets, private commercial pricing, or customer records.</p>
      <div className="markets-case-actions"><Link className="button secondary" href="/experience"><ArrowLeft size={17}/> Back to experience</Link><Link className="button secondary" href="/#work">More case studies <ArrowUpRight size={17}/></Link></div>
    </section>
  </main>;
}
