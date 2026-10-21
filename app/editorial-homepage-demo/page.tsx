'use client';

/**
 * Public-safe, single-page interactive storefront concept.
 *
 * Original React implementation with fictional products, names, pricing and service examples.
 * It does not import, connect to, or recreate any employer Shopify theme, Figma file,
 * catalogue, branding, fulfilment rules, API, reviews or proprietary configuration.
 * All purchase and postcode interactions are local demonstrations only.
 */
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Flame, Menu, Minus, Plus, ShoppingBag, SlidersHorizontal, Snowflake, Sprout, X } from 'lucide-react';
import styles from './demo.module.css';

type Product = { id: string; name: string; cut: string; price: number; occasion: 'steak' | 'fire' | 'slow' | 'everyday'; image: string; detail: string; tag: string };
type Slide = { eyebrow: string; heading: string; italic: string; body: string; image: string; label: string };

const photos = {
  hero: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1700&auto=format&fit=crop&q=82',
  grill: 'https://images.unsplash.com/photo-1558030006-450675393462?w=1700&auto=format&fit=crop&q=82',
  roast: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1700&auto=format&fit=crop&q=82',
  cut: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1000&auto=format&fit=crop&q=80',
  prep: 'https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?w=1000&auto=format&fit=crop&q=80',
};
const slides: Slide[] = [
  { eyebrow: 'THE ART OF GOOD FOOD / 001', heading: 'Good food.', italic: 'Great stories.', body: 'Exceptional cuts. Beautifully prepared. Made for the moments worth gathering around.', image: photos.hero, label: 'The craft' },
  { eyebrow: 'EVERY CUT HAS A STORY / 002', heading: 'Fire brings', italic: 'us together.', body: 'From a simple weeknight steak to a long Sunday lunch, start with something remarkable.', image: photos.grill, label: 'The occasion' },
  { eyebrow: 'THOUGHTFULLY SOURCED / 003', heading: 'Rooted in', italic: 'good taste.', body: 'Care at every stage, from the land to the board, with a little more attention to every detail.', image: photos.roast, label: 'The source' },
];
const categories = [
  { id: 'steak', name: 'Steak night', subtitle: 'Make the ordinary exceptional', numeral: '01', image: photos.cut },
  { id: 'fire', name: 'Around the fire', subtitle: 'Made for sharing', numeral: '02', image: photos.grill },
  { id: 'slow', name: 'Low & slow', subtitle: 'Good things take time', numeral: '03', image: photos.roast },
  { id: 'everyday', name: 'Everyday favourites', subtitle: 'A little better, every day', numeral: '04', image: photos.prep },
] as const;
const products: Product[] = [
  { id: 'ribeye', name: 'Heritage Ribeye', cut: '200 g / hand-trimmed', price: 38, occasion: 'steak', image: photos.cut, detail: 'Rich, buttery and beautifully balanced.', tag: 'BUTCHER FAVOURITE' },
  { id: 'sirloin', name: 'The Classic Sirloin', cut: '300 g / centre-cut', price: 32, occasion: 'steak', image: photos.hero, detail: 'A confident choice for the grill.', tag: 'BEST LOVED' },
  { id: 'tomahawk', name: 'Fire & Bone Tomahawk', cut: '1 kg / bone-in', price: 84, occasion: 'fire', image: photos.grill, detail: 'A statement cut for the table.', tag: 'FOR SHARING' },
  { id: 'skewers', name: 'Ember Skewers', cut: '6 pack / ready to cook', price: 29, occasion: 'fire', image: photos.prep, detail: 'Made for laid-back entertaining.', tag: 'NEW' },
  { id: 'brisket', name: 'Slow Sunday Brisket', cut: '1.5 kg / whole cut', price: 68, occasion: 'slow', image: photos.roast, detail: 'Low heat, long hours, big reward.', tag: 'LOW & SLOW' },
  { id: 'chuck', name: 'Country Chuck Roast', cut: '1 kg / roasting cut', price: 41, occasion: 'slow', image: photos.hero, detail: 'Comfort food made properly.', tag: 'BUTCHER FAVOURITE' },
  { id: 'minute', name: 'Everyday Minute Steaks', cut: '4 pack / thin-cut', price: 26, occasion: 'everyday', image: photos.cut, detail: 'Good dinners, without the fuss.', tag: 'WEEKNIGHT' },
  { id: 'burgers', name: 'House Blend Burgers', cut: '4 pack / handcrafted', price: 24, occasion: 'everyday', image: photos.grill, detail: 'Simple food, done exceptionally.', tag: 'FAMILY TABLE' },
];
const tabs = ['all', 'steak', 'fire', 'slow', 'everyday'] as const;
type Tab = typeof tabs[number];
const tabNames: Record<Tab, string> = { all: 'All cuts', steak: 'Steak', fire: 'For the fire', slow: 'Low & slow', everyday: 'Everyday' };
const money = (value: number) => '$' + value.toFixed(2);

export default function EditorialHomepageDemo() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [tab, setTab] = useState<Tab>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [marbling, setMarbling] = useState(6);
  const [postcode, setPostcode] = useState('');
  const [postcodeMessage, setPostcodeMessage] = useState('');
  const slide = slides[slideIndex];
  const visibleProducts = useMemo(() => products.filter(p => tab === 'all' || p.occasion === tab).slice(0, 4), [tab]);
  const bagItems = products.filter(p => (cart[p.id] || 0) > 0);
  const bagCount = bagItems.reduce((sum, p) => sum + (cart[p.id] || 0), 0);
  const bagTotal = bagItems.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const changeQuantity = (id: string, change: number) => setCart(current => ({ ...current, [id]: Math.max(0, (current[id] || 0) + change) }));
  const goSlide = (step: number) => setSlideIndex(current => (current + step + slides.length) % slides.length);
  const selectOccasion = (next: Tab) => { setTab(next); document.getElementById('demo-shop')?.scrollIntoView({ behavior: 'smooth' }); };
  const checkPostcode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = postcode.trim();
    if (!/^\d{4}$/.test(clean)) { setPostcodeMessage('Enter a four-digit Australian postcode.'); return; }
    const examples: Record<string, string> = {
      '2000': 'Sydney sample: chilled delivery concept available.',
      '3000': 'Melbourne sample: chilled delivery concept available.',
      '4000': 'Brisbane sample: chilled delivery concept available.',
      '5000': 'Adelaide sample: chilled delivery concept available.',
    };
    setPostcodeMessage(examples[clean] || 'This fictional demo only illustrates four sample postcodes: 2000, 3000, 4000 and 5000.');
  };
  const grade = marbling < 4 ? 'Delicate' : marbling < 7 ? 'Balanced' : marbling < 9 ? 'Rich' : 'Extraordinary';

  return <div className={styles.site} id="top">
    <div className={styles.notice}>AN INDEPENDENT DESIGN & ENGINEERING CONCEPT <span>·</span> NO LIVE ORDERS</div>
    <header className={styles.header}>
      <a className={styles.logo} href="#top" aria-label="Ember and Grain, back to top"><span className={styles.logoSymbol} aria-hidden="true">✳</span><span>EMBER <i>&</i> GRAIN<small>THE MODERN BUTCHERY</small></span></a>
      <nav className={styles.desktopNav} aria-label="Main navigation"><a href="#demo-occasions">The occasions</a><a href="#demo-shop">Our cuts</a><a href="#demo-craft">Our craft</a><a href="#demo-delivery">Delivery</a></nav>
      <div className={styles.headerActions}><button type="button" className={styles.bagButton} onClick={() => setBagOpen(true)} aria-label={'Open demo bag, ' + bagCount + ' items'}><ShoppingBag size={18} strokeWidth={1.5} /><span>Bag ({bagCount})</span></button><button type="button" className={styles.menuButton} onClick={() => setMenuOpen(current => !current)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={24}/> : <Menu size={24}/>}</button></div>
    </header>
    {menuOpen && <nav className={styles.mobileNav} aria-label="Mobile navigation">{[['The occasions','#demo-occasions'],['Our cuts','#demo-shop'],['Our craft','#demo-craft'],['Delivery','#demo-delivery']].map(([name,url]) => <a key={url} href={url} onClick={() => setMenuOpen(false)}>{name}<ArrowUpRight size={15}/></a>)}</nav>}
    <main>
      <section className={styles.hero} aria-label="Featured stories">
        <div className={styles.heroPhoto} role="img" aria-label="Editorial food photography representing the current story" style={{ backgroundImage: 'linear-gradient(90deg,rgba(11,19,15,.92) 0%,rgba(11,19,15,.55) 48%,rgba(11,19,15,.06) 100%),url("' + slide.image + '")' }} />
        <div className={styles.heroCopy} key={slideIndex}><span className={styles.eyebrow}><span className={styles.line}/> {slide.eyebrow}</span><h1>{slide.heading}<br/><em>{slide.italic}</em></h1><p>{slide.body}</p><a className={styles.lightButton} href="#demo-occasions">Discover the collection <ArrowUpRight size={18}/></a></div>
        <div className={styles.heroBottom}><div className={styles.heroIndex}><strong>0{slideIndex + 1}</strong><span>/ 0{slides.length}</span><span className={styles.heroLine}/><span>{slide.label}</span></div><div className={styles.heroControls}><button type="button" aria-label="Previous story" onClick={() => goSlide(-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next story" onClick={() => goSlide(1)}><ArrowRight size={18}/></button></div></div>
        <a href="#demo-occasions" className={styles.scrollHint}>SCROLL TO EXPLORE <ArrowDown size={14}/></a>
      </section>
      <section className={styles.statement} aria-label="Store philosophy"><span className={styles.micro}>A MORE THOUGHTFUL WAY TO SHOP</span><p>Not just what&apos;s for dinner.<br/><em>Who you&apos;re sharing it with.</em></p><span className={styles.statementStar} aria-hidden="true">✳</span></section>
      <section className={styles.section} id="demo-occasions"><div className={styles.sectionIntro}><div><span className={styles.micro}>01 / FIND YOUR MOMENT</span><h2>Start with <em>the occasion.</em></h2></div><p>From a quiet evening to a full table. Find something special for the way you love to cook.</p></div><div className={styles.occasionGrid}>{categories.map(category => <button type="button" key={category.id} className={styles.occasionCard} onClick={() => selectOccasion(category.id)}><span className={styles.occasionImage} style={{ backgroundImage: 'linear-gradient(180deg,transparent 5%,rgba(9,16,12,.8) 100%),url("' + category.image + '")' }} /><span className={styles.occasionTop}>{category.numeral} / 04 <ArrowUpRight size={21}/></span><span className={styles.occasionBottom}><strong>{category.name}</strong><span>{category.subtitle}</span></span></button>)}</div></section>
      <section className={styles.featureBand}><div className={styles.featureCopy}><span className={styles.micro}>THE WEEKLY EDIT</span><h2>Consider this <em>your invitation.</em></h2><p>One good cut, one new reason to gather. A seasonal story told through food, warmth and simple ritual.</p><a className={styles.outlineButton} href="#demo-shop">Explore the edit <ArrowUpRight size={16}/></a></div><div className={styles.featurePhoto} style={{backgroundImage:'url("' + photos.grill + '")'}} role="img" aria-label="Grilled food editorial photograph"/><span className={styles.featureNumber}>02 / THE EDIT</span></section>
      <section className={styles.section} id="demo-shop"><div className={styles.sectionIntro}><div><span className={styles.micro}>02 / THE BUTCHER&apos;S SELECTION</span><h2>Exceptionally <em>good cuts.</em></h2></div><p>Explore a hand-picked edit. All names, prices and purchasing actions in this showcase are fictional.</p></div><div className={styles.tabs} role="group" aria-label="Filter sample cuts">{tabs.map(next => <button className={tab === next ? styles.tabActive : ''} key={next} type="button" aria-pressed={tab === next} onClick={() => setTab(next)}>{tabNames[next]}</button>)}</div><div className={styles.productGrid}>{visibleProducts.map(product => <article className={styles.productCard} key={product.id}><div className={styles.productImage} style={{backgroundImage:'url("' + product.image + '")'}} role="img" aria-label={'Food photograph for sample ' + product.name}><span className={styles.productTag}>{product.tag}</span><button type="button" className={styles.quickAdd} onClick={() => { changeQuantity(product.id, 1); setBagOpen(true); }} aria-label={'Add ' + product.name + ' to demo bag'}><Plus size={19}/></button></div><div className={styles.productDetails}><div><span>{product.cut}</span><h3>{product.name}</h3><p>{product.detail}</p></div><strong>{money(product.price)}</strong></div></article>)}</div><p className={styles.disclaimer}>Fictional catalogue and prices. Bag actions are interactive but do not connect to Shopify or process payments.</p></section>
      <section className={styles.marbleSection} id="demo-marbling"><div className={styles.marbleVisual}><div className={styles.marbleTile} style={{backgroundImage: 'linear-gradient(145deg,rgba(20,10,8,.26),rgba(15,10,8,.58)),url("' + photos.cut + '")'}}><span>THE ART OF MARBLING</span><strong>SB <span>{marbling}</span></strong></div><span className={styles.marbleCaption}>A VISUAL EXPLORER / NOT A PRODUCT GRADE CLAIM</span></div><div className={styles.marbleCopy}><span className={styles.micro}>03 / KNOW WHAT MAKES IT DIFFERENT</span><h2>There&apos;s beauty <em>in the detail.</em></h2><p>Every cut has its own character. Explore how a richer marbling score can change the tasting experience.</p><div className={styles.sliderTop}><strong>{grade}</strong><span>SAMPLE SCORE {marbling} / 10</span></div><input type="range" min="1" max="10" step="1" value={marbling} onChange={event => setMarbling(Number(event.target.value))} aria-label="Explore fictional marbling score" className={styles.marbleSlider}/><div className={styles.sliderEnds}><span>SUBTLE</span><span>EXTRA RICH</span></div><p className={styles.sliderNote}>A general educational interaction, not a replica of any supplier&apos;s grading system or product data.</p></div></section>
      <section className={styles.craft} id="demo-craft"><div className={styles.craftHeading}><span className={styles.micro}>04 / WE BELIEVE IN THE DETAILS</span><h2>From open country.<br/><em>To an open flame.</em></h2><p>Great food isn&apos;t just made at the table. The story starts long before.</p></div><div className={styles.craftSteps}><div><Sprout size={30} strokeWidth={1.2}/><span>01</span><h3>Thoughtfully sourced</h3><p>Careful choices and an appreciation for where good food begins.</p></div><div><SlidersHorizontal size={30} strokeWidth={1.2}/><span>02</span><h3>Purposefully prepared</h3><p>A little attention changes everything. Craft matters in every cut.</p></div><div><Flame size={30} strokeWidth={1.2}/><span>03</span><h3>Made for your table</h3><p>Beautiful meals, memorable company and reasons to come together.</p></div></div></section>
      <section className={styles.delivery} id="demo-delivery"><div className={styles.deliveryIntro}><Snowflake size={27} strokeWidth={1.2}/><span className={styles.micro}>05 / FROM US TO YOU</span><h2>Good things,<br/><em>delivered with care.</em></h2><p>A polished discovery journey should make the practical details feel just as effortless. Try this fictional postcode interaction.</p><form className={styles.postcodeForm} onSubmit={checkPostcode}><label htmlFor="demo-postcode">YOUR POSTCODE</label><div><input id="demo-postcode" inputMode="numeric" maxLength={4} value={postcode} onChange={event => { setPostcode(event.target.value); setPostcodeMessage(''); }} placeholder="e.g. 2000" aria-describedby="postcode-result"/><button type="submit" aria-label="Check demo postcode"><ArrowRight size={20}/></button></div></form><p id="postcode-result" aria-live="polite" className={styles.postcodeResult}>{postcodeMessage || 'Try sample postcodes: 2000 · 3000 · 4000 · 5000'}</p><span className={styles.deliveryDisclaimer}>ILLUSTRATIVE ONLY · NO REAL COVERAGE, FEES OR DELIVERY PROMISES</span></div><div className={styles.deliveryImage} style={{backgroundImage:'url("' + photos.prep + '")'}} role="img" aria-label="Editorial food preparation photography"/><span className={styles.deliverySide}>DESIGNED FOR EVERY SCREEN — BUILT WITH INTENT</span></section>
      <section className={styles.closing}><span>THE FINAL WORD</span><h2>A little more care.<br/><em>A lot more flavour.</em></h2><a href="#top">Back to the beginning <ArrowUpRight size={18}/></a></section>
    </main>
    <footer className={styles.footer}><div><a className={styles.logo} href="#top"><span className={styles.logoSymbol} aria-hidden="true">✳</span><span>EMBER <i>&</i> GRAIN<small>THE MODERN BUTCHERY</small></span></a><p>Independent portfolio demonstration. Brand, catalogue and interactions are fictional.</p></div><div className={styles.footerLinks}><a href="#demo-occasions">Discover</a><a href="#demo-shop">The cuts</a><a href="#demo-craft">Our craft</a><a href="#demo-delivery">Delivery</a></div><small>© 2026 EDITORIAL STOREFRONT CONCEPT · NO CLIENT CODE OR IMAGES</small></footer>
    {bagOpen && <div className={styles.drawerOverlay} onClick={() => setBagOpen(false)}><aside role="dialog" aria-modal="true" aria-label="Demo shopping bag" className={styles.drawer} onClick={event => event.stopPropagation()}><div className={styles.drawerHead}><div><span className={styles.micro}>FICTIONAL CHECKOUT EXPERIENCE</span><h2>Your bag ({bagCount})</h2></div><button type="button" aria-label="Close bag" onClick={() => setBagOpen(false)}><X size={24}/></button></div>{bagItems.length ? <div className={styles.drawerItems}>{bagItems.map(p => <div className={styles.drawerItem} key={p.id}><div className={styles.drawerThumb} style={{backgroundImage:'url("' + p.image + '")'}}/><div><strong>{p.name}</strong><small>{p.cut}</small><div className={styles.quantity}><button type="button" aria-label={'Remove one ' + p.name} onClick={() => changeQuantity(p.id, -1)}><Minus size={14}/></button><span>{cart[p.id]}</span><button type="button" aria-label={'Add one ' + p.name} onClick={() => changeQuantity(p.id, 1)}><Plus size={14}/></button></div></div><strong>{money(p.price * cart[p.id])}</strong></div>)}</div> : <div className={styles.emptyBag}><ShoppingBag size={34} strokeWidth={1}/><p>Your story starts with a good cut.</p><button onClick={() => setBagOpen(false)} type="button">Explore the collection <ArrowRight size={15}/></button></div>}<div className={styles.drawerFoot}><div><span>Demo subtotal</span><strong>{money(bagTotal)}</strong></div><p><Check size={14}/> This is a portfolio mock-up. No orders or payments are available.</p><button type="button" disabled>Checkout unavailable in demo</button></div></aside></div>}
    <a className={styles.portfolioReturn} href="/" aria-label="Return to developer portfolio">← Portfolio</a>
  </div>;
}
