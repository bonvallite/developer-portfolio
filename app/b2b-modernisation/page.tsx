import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, Layers3, LogIn, ShoppingBag, SlidersHorizontal, Store, UsersRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'B2B Commerce Modernisation | Shopify Markets & Catalogues | JR Vallite',
  description: 'How I designed a four-market Shopify Advanced B2B experience with three company pricing tiers, contextual catalogues, customer accounts, and streamlined wholesale purchasing.',
};

// Conceptual public-safe representation of a four-market implementation.
// The labels are illustrative: real market names, catalogue rules, company
// assignments, prices, and client-specific configurations are not published.
// Market-specific storefront presentation and checkout are contextual, not
// separate stores or a promise of independently customised checkout code.
const markets = [
  { name: 'Retail market', kind: 'B2C', detail: 'Standard consumer catalogue', tone: 'retail' },
  { name: 'Wholesale tier 1', kind: 'B2B', detail: 'Company pricing catalogue A', tone: 'wholesale' },
  { name: 'Wholesale tier 2', kind: 'B2B', detail: 'Company pricing catalogue B', tone: 'wholesale' },
  { name: 'Wholesale tier 3', kind: 'B2B', detail: 'Company pricing catalogue C', tone: 'wholesale' },
];
const capabilities = [
  { icon: Building2, title: 'Market architecture', description: 'Structured one retail and three wholesale purchasing contexts within a single Shopify Advanced store.' },
  { icon: UsersRound, title: 'Company segmentation', description: 'Organised approved business accounts into the relevant wholesale market based on volume-tier eligibility.' },
  { icon: Layers3, title: 'Catalogue-led pricing', description: 'Mapped a distinct catalogue to each market so entitled customers see the applicable prices when buying for their company.' },
  { icon: SlidersHorizontal, title: 'Contextual storefront UX', description: 'Tailored landing-page content and theme presentation to make the wholesale buying journey clearer.' },
];
const pathway = [
  { number: '01', title: 'Apply and sign in', body: 'Use the native customer account journey instead of a second wholesale portal.' },
  { number: '02', title: 'Approve the company', body: 'Review the application and associate an eligible business with its pricing tier and B2B market.' },
  { number: '03', title: 'Recognise purchasing context', body: 'The customer signs in and selects the company purchasing context.' },
  { number: '04', title: 'Present entitled pricing', body: 'Market catalogue, theme presentation and applicable checkout configuration follow the selected context.' },
];

export default function B2BModernisation() {
  return <main className="b2bm-page" style={{overflow:'visible'}}>
    <div className="container" style={{paddingTop:52,paddingBottom:96,maxWidth:1120}}>
      <Link href="/" style={{color:'#dfbd8d',display:'inline-flex',gap:8,alignItems:'center'}}><ArrowLeft size={17}/> Back to portfolio</Link>
      <header style={{marginTop:72,marginBottom:46}}>
        <p className="overline">COMMERCE ENGINEERING / SHOPIFY ADVANCED</p>
        <h1 style={{fontSize:'clamp(2.35rem,6vw,5rem)',lineHeight:1.08,letterSpacing:'-.045em',maxWidth:960,margin:'20px 0'}}>One Shopify storefront.<br/><span style={{color:'#d9b47c'}}>Four markets. Three B2B tiers.</span></h1>
        <p style={{fontSize:'clamp(1rem,2vw,1.22rem)',color:'#adb0ba',lineHeight:1.8,maxWidth:830}}>I helped simplify a complicated wholesale experience by replacing a separate app-led journey with Shopify customer accounts, company market assignment, market-specific catalogues, and contextual storefront presentation.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:9,marginTop:24}}>{['Shopify Markets','B2B company accounts','Catalogue pricing','Theme and landing-page UX'].map(x=><span key={x} style={{border:'1px solid #796443',padding:'9px 12px',fontSize:12,color:'#e4c18f'}}>{x}</span>)}</div>
      </header>

      <section aria-labelledby="architecture" style={{border:'1px solid #4c4539',borderRadius:20,padding:'clamp(20px,4vw,38px)',background:'linear-gradient(145deg,#1c1d20,#111418)'}}>
        <p className="overline">SOLUTION ARCHITECTURE / CONCEPTUAL DIAGRAM</p>
        <h2 id="architecture" style={{fontSize:'clamp(1.6rem,3vw,2.35rem)',margin:'10px 0 12px'}}>Market-led B2B architecture</h2>
        <p style={{color:'#acacb5',maxWidth:790,lineHeight:1.75,marginBottom:26}}>Company and retail purchasing contexts are routed into their own market configurations. The diagram shows the design principle, not a copy of confidential store settings.</p>
        <div style={{border:'1px solid #806847',background:'#24221f',padding:20,borderRadius:14,textAlign:'center',maxWidth:490,margin:'0 auto'}}>
          <Store color="#e0b777" style={{margin:'0 auto 8px'}} aria-hidden="true"/>
          <strong style={{display:'block',fontSize:19}}>Shopify Advanced storefront</strong>
          <span style={{color:'#b9ac94',fontSize:13}}>Native customer sign-in · Company purchasing context</span>
        </div>
        <div aria-hidden="true" style={{height:28,width:2,background:'#b89661',margin:'0 auto'}}/>
        <div style={{border:'1px solid #54483a',borderRadius:10,textAlign:'center',padding:13,color:'#e4c18f',maxWidth:380,margin:'0 auto 28px',fontWeight:600}}>Market assignment and catalogue selection</div>
        <div className="b2bm-market-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:12}}>
          {markets.map((market,i)=><article key={market.name} style={{minWidth:0,border:market.tone==='retail'?'1px solid #60717e':'1px solid #ad8950',borderRadius:13,background:market.tone==='retail'?'#1b2830':'#2a251d',padding:'20px 14px',textAlign:'center'}}>
            <span style={{display:'block',fontSize:11,letterSpacing:1.3,color:market.tone==='retail'?'#a9c7d5':'#e2b878'}}>{market.kind} · MARKET {i+1}</span>
            <h3 style={{fontSize:'clamp(14px,1.6vw,19px)',margin:'13px 0'}}>{market.name}</h3>
            <p style={{fontSize:12,lineHeight:1.6,color:'#ccc6bd',margin:0}}>{market.detail}</p>
          </article>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:12,marginTop:22}} className="b2bm-context-grid">
          {['Catalogue pricing','Market-aware theme content','Applicable checkout settings'].map(x=><div key={x} style={{background:'#131619',padding:'16px 10px',borderRadius:9,textAlign:'center',fontSize:13,color:'#e6d4bb'}}>{x}</div>)}
        </div>
        <p style={{color:'#9ca0aa',fontSize:12,lineHeight:1.7,marginTop:19}}>Illustrative architecture. Pricing eligibility is governed by Shopify market and company configuration, not client-side JavaScript. A market-specific checkout experience does not imply a separate checkout or custom checkout code.</p>
      </section>

      <section style={{marginTop:82}}>
        <p className="overline">THE PROBLEM AND THE DECISION</p>
        <h2 style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',margin:'14px 0'}}>Reduce friction without adding another platform</h2>
        <div className="b2bm-two-col" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:18}}>
          <article style={{border:'1px solid #3b3f45',padding:24,borderRadius:12}}>
            <h3>Before: third-party wholesale journey</h3>
            <p style={{color:'#adb0b7',lineHeight:1.8}}>Separate app configuration, more complex registration and wholesale purchasing steps, and additional administration for business pricing and customer access.</p>
          </article>
          <article style={{border:'1px solid #876c45',padding:24,borderRadius:12}}>
            <h3>After: native Shopify B2B Markets</h3>
            <p style={{color:'#adb0b7',lineHeight:1.8}}>One customer account experience, approved company contexts, three catalogue-led B2B pricing tiers, and a dedicated retail market in the same storefront.</p>
          </article>
        </div>
      </section>

      <section style={{marginTop:86}}>
        <p className="overline">MY IMPLEMENTATION RESPONSIBILITIES</p>
        <h2 style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',margin:'14px 0 28px'}}>Architecture, configuration and customer experience</h2>
        <div className="b2bm-two-col" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:16}}>
          {capabilities.map(c=><article key={c.title} style={{borderTop:'1px solid #806747',padding:'24px 8px'}}>
            <c.icon color="#d9b47c" size={25} aria-hidden="true"/><h3 style={{fontSize:21,margin:'14px 0 8px'}}>{c.title}</h3><p style={{color:'#b3b5bc',lineHeight:1.8}}>{c.description}</p>
          </article>)}
        </div>
      </section>

      <section style={{marginTop:82}}>
        <p className="overline">COMPANY BUYING JOURNEY</p>
        <h2 style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',margin:'14px 0 24px'}}>From application to automatic pricing</h2>
        <ol className="b2bm-path" style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:16,listStyle:'none',padding:0}}>
          {pathway.map(s=><li key={s.number} style={{border:'1px solid #393b40',borderRadius:12,padding:19,minWidth:0}}>
            <span style={{fontSize:12,color:'#d9b47c',letterSpacing:2}}>{s.number}</span>
            <h3 style={{fontSize:17,margin:'14px 0 10px'}}>{s.title}</h3>
            <p style={{fontSize:13,lineHeight:1.7,color:'#b3b5bc'}}>{s.body}</p>
          </li>)}
        </ol>
      </section>

      <section style={{marginTop:82,padding:'clamp(22px,4vw,40px)',background:'#191d20',borderLeft:'3px solid #d9b47c'}}>
        <p className="overline">BUSINESS IMPACT / EVIDENCE BOUNDARY</p>
        <h2 style={{fontSize:'clamp(1.7rem,3.5vw,2.6rem)',margin:'14px 0'}}>Simpler purchasing, clearer commercial signals</h2>
        <p style={{color:'#b8bac1',lineHeight:1.8,maxWidth:850}}>After the implementation, the business reported greater interest in its wholesale programme, while business-associated order value reached higher levels in several months. These observations are directional, not a verified attribution to the market migration.</p>
        <p style={{color:'#b8bac1',lineHeight:1.8,maxWidth:850}}>To quantify the effect, I would match approved company accounts to orders, confirm market and catalogue eligibility, segment repeat purchasers, compare like-for-like periods, and separate genuine B2B orders from wholesale-tagged or candidate accounts.</p>
      </section>
      <section style={{marginTop:75,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
        <Link className="button primary" href="/b2b-demo">Try the fictional weight calculator <ArrowRight size={17}/></Link>
        <Link className="button secondary" href="/experience">Explore experience <ArrowUpRight size={17}/></Link>
        <a className="button secondary" href="https://github.com/bonvallite/developer-portfolio" target="_blank" rel="noopener noreferrer">Public code portfolio <ArrowUpRight size={17}/></a>
      </section>
    </div>
    <style>{`
      @media(max-width:760px){.b2bm-market-grid,.b2bm-path{grid-template-columns:repeat(2,minmax(0,1fr))!important}.b2bm-two-col{grid-template-columns:1fr!important}}
      @media(max-width:450px){.b2bm-market-grid,.b2bm-context-grid,.b2bm-path{grid-template-columns:1fr!important}}
    `}</style>
  </main>;
}
