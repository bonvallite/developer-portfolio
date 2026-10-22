'use client';
// Fictional, deterministic market preview. Never fetches Eve Curls storefront,
// customer information, currency rates, or private Shopify catalogues.
import { useState } from 'react';
import { ArrowUpRight, Globe2, Languages, Coins, PackageSearch, PanelsTopLeft, BadgePercent, CreditCard } from 'lucide-react';

type MarketCode = 'gb' | 'ch' | 'nl' | 'it' | 'fr' | 'es';
type Market = {
  code: MarketCode; country: string; flag: string; locale: string; currency: 'GBP' | 'CHF' | 'EUR';
  language: string; extraLanguages?: string; headline: string; subtitle: string; cta: string; offer: string;
  catalogue: string; route: string; discountPercent: number; checkoutLabel: string; accountLabel: string;
  products: readonly {name: string; price: number}[];
};

// Sample routes are on the reserved .invalid TLD: they cannot be mistaken for
// confirmed country domains. Amounts and per-market percentage discounts are
// fictitious, not currency conversions. Checkout/account labels demonstrate
// locale-aware copy only: Shopify checkout and accounts are not embedded here.
const markets: readonly Market[] = [
  {code:'gb',country:'United Kingdom',flag:'🇬🇧',locale:'en-GB',currency:'GBP',language:'English',
    headline:'Curls that feel like you.',subtitle:'A simple ritual for every curl pattern.',cta:'Explore the collection',offer:'Discover your curl routine',discountPercent:10,checkoutLabel:'Checkout',accountLabel:'Your account',catalogue:'UK sample catalogue',route:'https://store.example.invalid/gb/',
    products:[{name:'Sample Curl Cream',price:22.9},{name:'Sample Curl Gel',price:18.5}]},
  {code:'ch',country:'Switzerland',flag:'🇨🇭',locale:'de-CH',currency:'CHF',language:'German',
    extraLanguages:'French and Italian can also be offered',headline:'Deine Locken. Dein Stil.',subtitle:'Pflege für deine natürliche Lockenstruktur.',cta:'Kollektion entdecken',offer:'Entdecke deine Lockenroutine',discountPercent:0,checkoutLabel:'Kasse',accountLabel:'Kundenkonto',catalogue:'Swiss sample catalogue',route:'https://store.example.invalid/ch/',
    products:[{name:'Beispiel-Lockencreme',price:29.5},{name:'Beispiel-Lockengel',price:25.0}]},
  {code:'nl',country:'Netherlands',flag:'🇳🇱',locale:'nl-NL',currency:'EUR',language:'Dutch',
    headline:'Krullen op jouw manier.',subtitle:'Jouw routine, jouw natuurlijke krullen.',cta:'Bekijk de collectie',offer:'Ontdek jouw krullenroutine',discountPercent:12,checkoutLabel:'Afrekenen',accountLabel:'Mijn account',catalogue:'NL sample catalogue',route:'https://store.example.invalid/nl/',
    products:[{name:'Voorbeeld Krullencrème',price:24.5},{name:'Voorbeeld Stylinggel',price:20.0}]},
  {code:'it',country:'Italy',flag:'🇮🇹',locale:'it-IT',currency:'EUR',language:'Italian',
    headline:'Ricci, a modo tuo.',subtitle:'Una routine semplice per i tuoi ricci.',cta:'Scopri la collezione',offer:'Trova la tua routine',discountPercent:8,checkoutLabel:'Pagamento',accountLabel:'Il mio account',catalogue:'IT sample catalogue',route:'https://store.example.invalid/it/',
    products:[{name:'Crema Ricci — Esempio',price:25.0},{name:'Gel Ricci — Esempio',price:21.0}]},
  {code:'fr',country:'France',flag:'🇫🇷',locale:'fr-FR',currency:'EUR',language:'French',
    headline:'Des boucles, à votre façon.',subtitle:'Une routine pensée pour vos boucles.',cta:'Découvrir la collection',offer:'Trouvez votre routine',discountPercent:15,checkoutLabel:'Paiement',accountLabel:'Mon compte',catalogue:'FR sample catalogue',route:'https://store.example.invalid/fr/',
    products:[{name:'Crème Boucles — Exemple',price:26.0},{name:'Gel Boucles — Exemple',price:21.5}]},
  {code:'es',country:'Spain',flag:'🇪🇸',locale:'es-ES',currency:'EUR',language:'Spanish',
    headline:'Tus rizos, a tu manera.',subtitle:'Tu rutina para unos rizos naturales.',cta:'Explorar la colección',offer:'Descubre tu rutina',discountPercent:5,checkoutLabel:'Finalizar compra',accountLabel:'Mi cuenta',catalogue:'ES sample catalogue',route:'https://store.example.invalid/es/',
    products:[{name:'Crema de Rizos — Ejemplo',price:24.0},{name:'Gel de Rizos — Ejemplo',price:20.0}]},
];

const formatMoney = (value: number, m: Market) =>
  new Intl.NumberFormat(m.locale,{style:'currency',currency:m.currency}).format(value);

// Pure arithmetic applies an *illustrative* percentage reduction to mock local
// prices. It does not emulate Shopify discount eligibility or checkout totals.
const exampleDiscountedPrice = (price: number, percent: number) =>
  Math.round(price * (100 - percent)) / 100;

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
        <div className="markets-products-heading"><span>{market.catalogue}</span><small>{market.discountPercent > 0 ? `Sample promotion: ${market.discountPercent}% off` : 'No sample promotion in this market'}</small></div>
        <div className="markets-product-list">
          {market.products.map((p,i)=><article key={p.name}><span className="markets-product-mark" aria-hidden="true">{i===0?'◒':'◓'}</span><div><strong>{p.name}</strong><small>Invented sample product</small></div><div className="markets-example-price">{market.discountPercent > 0 ? <><s>{formatMoney(p.price,market)}</s><strong>{formatMoney(exampleDiscountedPrice(p.price,market.discountPercent),market)}</strong></> : <strong>{formatMoney(p.price,market)}</strong>}</div></article>)}
        </div>
        <div className="markets-checkout-preview" aria-label="Illustrative checkout and account labels"><div><span>CHECKOUT LABEL PREVIEW</span><strong>{market.checkoutLabel}</strong></div><div><span>ACCOUNT LABEL PREVIEW</span><strong>{market.accountLabel}</strong></div></div>
      </section>
      <aside className="markets-inspector" aria-live="polite">
        <h4>Market settings / {market.country}</h4>
        <div><Coins size={20}/><span><strong>Currency</strong><small>{market.currency} · fictional local prices; checkout currency depends on payment configuration</small></span></div>
        <div><PackageSearch size={20}/><span><strong>Catalogs</strong><small>{market.catalogue} · sample product availability and pricing</small></span></div>
        <div><BadgePercent size={20}/><span><strong>Discounts</strong><small>{market.discountPercent > 0 ? `Sample ${market.discountPercent}% market promotion (illustrative only)` : 'No sample discount assigned to this market'}</small></span></div>
        <div><PanelsTopLeft size={20}/><span><strong>Online Store / Theme</strong><small>One published theme · localised hero copy and regional landing-page sections; eligible plans only</small></span></div>
        <div><CreditCard size={20}/><span><strong>Checkout and accounts</strong><small>Example labels: {market.checkoutLabel} / {market.accountLabel}; per-market customisations require Advanced or Plus</small></span></div>
        <div><Languages size={20}/><span><strong>Domain / language</strong><small>{market.language}{market.extraLanguages ? ` · ${market.extraLanguages}` : ''} · sample route, not an Eve Curls URL</small></span></div>
      </aside>
    </div>
    <p className="markets-demo-disclaimer">This browser-like preview is independently created, uses invented products and prices, and makes no requests to Shopify. The domains, copy, catalogues, percentage discounts, sample regional overrides, local-currency prices and checkout/account labels shown here are examples, not verified Eve Curls production configuration. This is not a live checkout or payments integration; no exchange rates, taxes, real discount eligibility or checkout block customisation are implemented.</p>
  </div>;
}
