'use client';
// Fictional, deterministic market preview. Never fetches Eve Curls storefront,
// customer information, currency rates, or private Shopify catalogues.
import { useState } from 'react';
import { ArrowUpRight, Globe2, Languages, Coins, PackageSearch, PanelsTopLeft, MapPin } from 'lucide-react';

type MarketCode = 'gb' | 'ch' | 'nl' | 'it' | 'fr' | 'es';
type Market = {
  code: MarketCode; country: string; flag: string; locale: string; currency: 'GBP' | 'CHF' | 'EUR';
  language: string; extraLanguages?: string; headline: string; subtitle: string; cta: string; offer: string;
  catalogue: string; route: string; products: readonly {name: string; price: number}[];
};

// Sample routes are on the reserved .invalid TLD: they cannot be mistaken for
// confirmed country domains. Amounts are fictitious, not currency conversions.
const markets: readonly Market[] = [
  {code:'gb',country:'United Kingdom',flag:'🇬🇧',locale:'en-GB',currency:'GBP',language:'English',
    headline:'Curls that feel like you.',subtitle:'A simple ritual for every curl pattern.',cta:'Explore the collection',offer:'Discover your curl routine',catalogue:'UK sample catalogue',route:'https://store.example.invalid/gb/',
    products:[{name:'Sample Curl Cream',price:22.9},{name:'Sample Curl Gel',price:18.5}]},
  {code:'ch',country:'Switzerland',flag:'🇨🇭',locale:'de-CH',currency:'CHF',language:'German',
    extraLanguages:'French and Italian can also be offered',headline:'Deine Locken. Dein Stil.',subtitle:'Pflege für deine natürliche Lockenstruktur.',cta:'Kollektion entdecken',offer:'Entdecke deine Lockenroutine',catalogue:'Swiss sample catalogue',route:'https://store.example.invalid/ch/',
    products:[{name:'Beispiel-Lockencreme',price:29.5},{name:'Beispiel-Lockengel',price:25.0}]},
  {code:'nl',country:'Netherlands',flag:'🇳🇱',locale:'nl-NL',currency:'EUR',language:'Dutch',
    headline:'Krullen op jouw manier.',subtitle:'Jouw routine, jouw natuurlijke krullen.',cta:'Bekijk de collectie',offer:'Ontdek jouw krullenroutine',catalogue:'NL sample catalogue',route:'https://store.example.invalid/nl/',
    products:[{name:'Voorbeeld Krullencrème',price:24.5},{name:'Voorbeeld Stylinggel',price:20.0}]},
  {code:'it',country:'Italy',flag:'🇮🇹',locale:'it-IT',currency:'EUR',language:'Italian',
    headline:'Ricci, a modo tuo.',subtitle:'Una routine semplice per i tuoi ricci.',cta:'Scopri la collezione',offer:'Trova la tua routine',catalogue:'IT sample catalogue',route:'https://store.example.invalid/it/',
    products:[{name:'Crema Ricci — Esempio',price:25.0},{name:'Gel Ricci — Esempio',price:21.0}]},
  {code:'fr',country:'France',flag:'🇫🇷',locale:'fr-FR',currency:'EUR',language:'French',
    headline:'Des boucles, à votre façon.',subtitle:'Une routine pensée pour vos boucles.',cta:'Découvrir la collection',offer:'Trouvez votre routine',catalogue:'FR sample catalogue',route:'https://store.example.invalid/fr/',
    products:[{name:'Crème Boucles — Exemple',price:26.0},{name:'Gel Boucles — Exemple',price:21.5}]},
  {code:'es',country:'Spain',flag:'🇪🇸',locale:'es-ES',currency:'EUR',language:'Spanish',
    headline:'Tus rizos, a tu manera.',subtitle:'Tu rutina para unos rizos naturales.',cta:'Explorar la colección',offer:'Descubre tu rutina',catalogue:'ES sample catalogue',route:'https://store.example.invalid/es/',
    products:[{name:'Crema de Rizos — Ejemplo',price:24.0},{name:'Gel de Rizos — Ejemplo',price:20.0}]},
];

const formatMoney = (value: number, m: Market) =>
  new Intl.NumberFormat(m.locale,{style:'currency',currency:m.currency}).format(value);

export default function MarketPreview() {
  const [selected, setSelected] = useState<MarketCode>('gb');
  const market = markets.find(m => m.code === selected) ?? markets[0];
  return <div className="markets-demo">
    <div className="markets-demo-toolbar">
      <div><span className="overline">INTERACTIVE / FICTITIOUS STOREFRONT</span><h3>Change market. See the entire experience adapt.</h3></div>
      <div className="markets-market-control"><label htmlFor="market-country">Preview a market</label>
      <select id="market-country" value={selected} onChange={e=>setSelected(e.target.value as MarketCode)}>
        {markets.map(m=><option value={m.code} key={m.code}>{m.flag} {m.country}</option>)}
      </select></div>
    </div>
    <div className="markets-selector" role="group" aria-label="Choose a sample regional market">
      {markets.map(m=><button type="button" aria-pressed={selected===m.code} className={selected===m.code?'is-active':''} onClick={()=>setSelected(m.code)} key={m.code}><span aria-hidden="true">{m.flag}</span>{m.country}</button>)}
    </div>
    <div className="markets-preview-layout">
      <section className="markets-browser" aria-label={'Fictional storefront preview for '+market.country}>
        <div className="markets-browser-bar"><span className="markets-browser-dots" aria-hidden="true">● ● ●</span><span title="Example address, not a live website">{market.route}</span><Globe2 size={17}/></div>
        <div className="markets-store-bar"><strong>CURL STUDIO <small>DEMO</small></strong><span>{market.flag} {market.country} · {market.currency}</span></div>
        <div className="markets-store-hero" key={market.code}>
          <div><span className="markets-store-eyebrow">{market.offer}</span><h4>{market.headline}</h4><p>{market.subtitle}</p><span className="markets-fake-cta">{market.cta} <ArrowUpRight size={17}/></span></div>
          <div className="markets-curl-art" aria-hidden="true"><span>〰</span><span>〰</span></div>
        </div>
        <div className="markets-product-list">
          {market.products.map((p,i)=><article key={p.name}><span className="markets-product-mark" aria-hidden="true">{i===0?'◒':'◓'}</span><div><strong>{p.name}</strong><small>{market.catalogue}</small></div><span>{formatMoney(p.price,market)}</span></article>)}
        </div>
      </section>
      <aside className="markets-inspector" aria-live="polite">
        <h4>What changed?</h4>
        <div><MapPin size={20}/><span><strong>Market and location</strong><small>{market.country} · regional experience selected</small></span></div>
        <div><Languages size={20}/><span><strong>Language</strong><small>{market.language}{market.extraLanguages?' · '+market.extraLanguages:''}</small></span></div>
        <div><Coins size={20}/><span><strong>Local currency</strong><small>{market.currency} · fictional fixed example prices</small></span></div>
        <div><PackageSearch size={20}/><span><strong>Market catalogue</strong><small>{market.catalogue} · invented sample assortment</small></span></div>
        <div><PanelsTopLeft size={20}/><span><strong>Regional landing page</strong><small>Market-adapted headlines, promotions and hero content</small></span></div>
        <div><Globe2 size={20}/><span><strong>Domain and route</strong><small>Example URL only · not an Eve Curls domain</small></span></div>
      </aside>
    </div>
    <p className="markets-demo-disclaimer">This browser-like preview is independently created, uses invented products and prices, and makes no requests to Shopify. The domains, copy, catalogues, regional overrides and prices shown here are examples, not verified Eve Curls production configuration. No exchange rates or tax calculations are implied.</p>
  </div>;
}
