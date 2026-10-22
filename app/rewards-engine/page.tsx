"use client";
// Independent, fictional demo: no live store connection and no reward fulfilment.
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gift, ShoppingBag, Truck, Settings2, ShieldCheck } from "lucide-react";
import { DEMO_OFFER, calculateRewardState, formatAUD } from "../../lib/rewards-engine.mjs";
import RewardsVisuals from "./RewardsVisuals";

type Offer = {
  enabled: boolean;
  name: string;
  giftThreshold: number;
  giftLabel: string;
  shippingThreshold: number;
  bonusThreshold: number;
  bonusLabel: string;
  terms: string;
};

export default function RewardsEnginePage() {
  const [offer, setOffer] = useState<Offer>({ ...DEMO_OFFER });
  const [subtotal, setSubtotal] = useState(180);
  const state = useMemo(() => calculateRewardState(offer, subtotal), [offer, subtotal]);
  const [surface, setSurface] = useState<"home"|"product"|"collection"|"cart">("cart");
  const input = (label: string, field: "giftThreshold"|"shippingThreshold"|"bonusThreshold") => (
    <label style={{display:"grid",gap:7,fontSize:13,color:"#d6d6db"}}>{label}
      <input aria-label={label} type="number" min={1} max={9999} value={offer[field]}
        onChange={e=>setOffer(o=>({...o,[field]:Number(e.target.value)}))}
        style={{padding:11,background:"#151a1d",border:"1px solid #777",borderRadius:8,color:"white"}}/>
    </label>);
  const progress = state.valid && state.enabled ? state.progressPercent : 0;
  return <main style={{maxWidth:1160,margin:"0 auto",padding:"36px 22px 100px",minHeight:"100vh"}}>
    <Link href="/" style={{color:"#d9b47c",display:"inline-flex",gap:8,alignItems:"center"}}><ArrowLeft size={16}/> Back to portfolio</Link>
    <p style={{color:"#d9b47c",letterSpacing:2,fontSize:12,marginTop:65}}>SHOPIFY · METAOBJECTS · JAVASCRIPT · AUTOMATION</p>
    <h1 style={{fontSize:"clamp(40px,7vw,80px)",letterSpacing:"-3px",lineHeight:1.06,margin:"18px 0 20px"}}>One configuration.<br/><span style={{color:"#d9b47c"}}>Every customer touchpoint.</span></h1>
    <p style={{color:"#afb4bd",maxWidth:810,lineHeight:1.8,fontSize:17}}>An interactive, independently authored illustration of a unified gift-with-purchase experience. Adjust fictional offer settings and watch the announcement, product-card reference, collection promotion and minicart respond together.</p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",margin:"30px 0 24px"}}>
      {["Metaobject-led content","Liquid theme surfaces","React-aware cart enhancement","Post-checkout Shopify Flow"].map(s=><span key={s} style={{padding:"9px 13px",border:"1px solid #6e5940",color:"#edd0a2",fontSize:12}}>{s}</span>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(295px,1fr))",gap:20,alignItems:"start",marginTop:40}}>
      <section style={{background:"#1a1e23",border:"1px solid #454545",borderRadius:14,padding:25}}>
        <h2 style={{fontSize:23,display:"flex",alignItems:"center",gap:10}}><Settings2 size={21}/> Fictional offer editor</h2>
        <p style={{fontSize:13,color:"#afb4bd",lineHeight:1.7}}>This local editor simulates Shopify metaobject fields. It does not modify any store, discount or order.</p>
        <div style={{display:"grid",gap:18,marginTop:25}}>
          <label style={{display:"flex",gap:10,alignItems:"center"}}><input type="checkbox" checked={offer.enabled} onChange={e=>setOffer(o=>({...o,enabled:e.target.checked}))}/> Promotion enabled</label>
          {input("First gift threshold (AUD)","giftThreshold")}
          {input("Free shipping milestone (AUD)","shippingThreshold")}
          {input("Bonus gift threshold (AUD)","bonusThreshold")}
          <label style={{display:"grid",gap:7,fontSize:13}}>First gift label<input value={offer.giftLabel} onChange={e=>setOffer(o=>({...o,giftLabel:e.target.value}))} style={{padding:11,background:"#151a1d",border:"1px solid #777",borderRadius:8,color:"white"}}/></label>
          <label style={{display:"grid",gap:7,fontSize:13}}>Bonus gift label<input value={offer.bonusLabel} onChange={e=>setOffer(o=>({...o,bonusLabel:e.target.value}))} style={{padding:11,background:"#151a1d",border:"1px solid #777",borderRadius:8,color:"white"}}/></label>
          <button type="button" onClick={()=>setOffer({...DEMO_OFFER})} style={{padding:12,background:"transparent",color:"#d9b47c",border:"1px solid #876a46",cursor:"pointer"}}>Reset fictional settings</button>
        </div>
      </section>
      <section style={{background:"#1a1e23",border:"1px solid #454545",borderRadius:14,padding:25}}>
        <h2 style={{fontSize:23,display:"flex",alignItems:"center",gap:10}}><ShoppingBag size={21}/> Customer preview</h2>
        <label style={{display:"grid",gap:9,fontSize:13,margin:"20px 0 23px"}}>Illustrative basket subtotal: <strong style={{fontSize:25}}>{formatAUD(subtotal)}</strong>
          <input type="range" min="0" max="450" step="5" value={subtotal} onChange={e=>setSubtotal(Number(e.target.value))}/>
        </label>
        <div role="group" aria-label="Preview surface" style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {(["home","product","collection","cart"] as const).map(key=><button key={key} type="button" aria-pressed={surface===key} onClick={()=>setSurface(key)} style={{cursor:"pointer",background:surface===key?"#d9b47c":"#2a2f34",color:surface===key?"#141414":"white",padding:"9px 12px",border:0,borderRadius:7,textTransform:"capitalize"}}>{key==="home"?"Homepage":key==="product"?"Product card":key==="collection"?"Collection":"Minicart"}</button>)}
        </div>
        {!state.valid ? <p role="alert" style={{color:"#ffbcaa"}}>Invalid thresholds or labels. Promotional messages are hidden until the settings are corrected.</p> : !state.enabled ? <p>Promotion disabled. Customer messaging is hidden.</p> : <>
          {surface==="home" && <div style={{background:"#d9b47c",color:"#151515",padding:22,borderRadius:10,textAlign:"center"}}><p style={{fontSize:12,letterSpacing:1}}>SEASONAL REWARDS</p><h3 style={{fontSize:23}}>Shop more. Enjoy more.</h3><p>Receive {offer.giftLabel} when you spend {formatAUD(offer.giftThreshold)}.</p></div>}
          {surface==="product" && <div style={{display:"grid",gridTemplateColumns:"minmax(105px,1fr) 2fr",gap:16,background:"#f4f1e9",color:"#1b2422",borderRadius:10,padding:17}}><div style={{borderRadius:8,background:"linear-gradient(150deg,#d8ceb9,#eee8da)",minHeight:142,display:"grid",placeItems:"center",color:"#536351"}}><ShoppingBag size={40} strokeWidth={1.2}/></div><div><p style={{fontSize:11,letterSpacing:1.2}}>ILLUSTRATIVE PRODUCT CARD</p><h3 style={{fontSize:19,margin:"12px 0 9px"}}>Butcher's seasonal selection</h3><p style={{fontSize:13,lineHeight:1.65}}>Spend {formatAUD(offer.giftThreshold)} to unlock {offer.giftLabel}.</p><span style={{fontSize:12,fontWeight:700}}>Browse selection →</span></div></div>}
          {surface==="collection" && <div style={{border:"1px solid #9d7f57",borderRadius:10,padding:25,background:"#24231f"}}><p style={{fontSize:12,color:"#d9b47c"}}>CURATED COLLECTION</p><h3 style={{fontSize:26}}>Unlock something extra.</h3><p style={{lineHeight:1.7}}>Spend {formatAUD(offer.giftThreshold)} for {offer.giftLabel}. Spend {formatAUD(offer.bonusThreshold)} for {offer.bonusLabel} too.</p><span style={{display:"inline-flex",alignItems:"center",gap:6,color:"#d9b47c"}}>Explore collection <ArrowRight size={16}/></span></div>}
          {surface==="cart" && <div style={{background:"#f4f1e9",color:"#1b2422",borderRadius:10,padding:24}}>
            <p style={{fontSize:12,letterSpacing:1}}>YOUR CART · REWARDS</p><h3 style={{fontSize:22}}>{state.next? `Add ${formatAUD(state.remaining)} to unlock your next reward` : "All three rewards unlocked!"}</h3>
            <div role="progressbar" aria-label="Reward milestone progress" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} style={{height:10,borderRadius:20,background:"#d1d8d0",overflow:"hidden",margin:"24px 0 18px"}}><div style={{width:`${progress}%`,height:"100%",background:"#426950",transition:"width .15s"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,textAlign:"center"}}>{state.milestones.map(m=><div key={m.id} style={{fontSize:11,opacity:m.unlocked?1:.65}}><strong style={{display:"block",fontSize:15}}>{formatAUD(m.threshold)}</strong><span>{m.unlocked?"✓ ": ""}{m.id==="shipping"?"Eligible shipping":m.label}</span></div>)}</div>
            <p style={{fontSize:11,marginTop:25,color:"#4d5852"}}>{offer.terms}</p>
          </div>}
          {surface!=="cart" && <div style={{display:"flex",gap:12,alignItems:"center",marginTop:18,color:"#aeb8ad",fontSize:13}}><Gift size={17}/> {state.unlockedCount} of 3 milestones reached</div>}
        </>}
      </section>
    </div>
    <section id="backend-diagram" style={{marginTop:72}} aria-labelledby="backend-title">
      <p style={{color:"#d9b47c",fontSize:12,letterSpacing:2}}>BACKEND / SYSTEMS ARCHITECTURE</p>
      <h2 id="backend-title" style={{fontSize:"clamp(30px,4vw,44px)",margin:"12px 0",lineHeight:1.16}}>From one editor to every experience, then to fulfilment.</h2>
      <p style={{color:"#b7bcc3",maxWidth:850,lineHeight:1.8,fontSize:15}}>The diagram separates the editorial source of truth from the authoritative checkout and post-order rules. Solid arrows show customer-facing data flow and order fulfilment. The dashed line is a required configuration consistency check: Shopify Flow and delivery discounts are <strong>not automatically rewritten</strong> by changing a metaobject.</p>
      <a href="/rewards-backend-architecture.svg" target="_blank" rel="noopener noreferrer" aria-label="Open enlarged backend architecture diagram" style={{display:"block",marginTop:22}}>
        <img src="/rewards-backend-architecture.svg" alt="Configuration-led rewards architecture diagram: a metaobject drives Liquid and JavaScript storefront surfaces, while a completed order separately triggers Shopify Flow gift fulfilment and shipping discounts are enforced independently." style={{width:"100%",height:"auto",border:"1px solid #3e4c42",borderRadius:14,background:"#111b18"}}/>
      </a>
      <p style={{color:"#9da9a7",fontSize:12,marginTop:9}}>Click the architecture illustration to inspect a larger version. Conceptual, public-safe design, not a live Flow export.</p>
    </section>
    <RewardsVisuals offer={offer} subtotal={subtotal}/>
    <section style={{marginTop:75,padding:"clamp(22px,4vw,44px)",border:"1px solid #816a49",borderRadius:14,background:"linear-gradient(140deg,#24211c,#15191c)"}}>
      <p style={{letterSpacing:2,color:"#d9b47c",fontSize:12}}>END-TO-END OWNERSHIP / WHAT I BRING TO THE TABLE</p>
      <h2 style={{fontSize:"clamp(28px,4.5vw,48px)",lineHeight:1.16,margin:"16px 0 19px"}}>I connect the commercial problem to the code that solves it.</h2>
      <p style={{color:"#d9dde1",lineHeight:1.85,fontSize:16,maxWidth:870}}>A promotion is more than a banner. Customers experience it across announcements, collections, campaign pages, product discovery and the cart. I approach the challenge as one system: research the purchase journey, examine the data, design the interface, build reusable Shopify components, integrate carefully with an app-owned cart and validate the business rules behind the message.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:28}}>
        {[
          ["01 / ANALYSE","ShopifyQL, AOV trends, conversion friction and outcome measurement"],
          ["02 / DESIGN","Reward journey, progressive feedback and responsive visual hierarchy"],
          ["03 / ENGINEER","Liquid, metaobjects, HTML/CSS, JavaScript and Shadow DOM"],
          ["04 / INTEGRATE","App-owned React interfaces, Flow fulfilment and checkout boundaries"],
          ["05 / VALIDATE","Fallback behaviour, threshold tests, accessibility and documentation"]
        ].map(([step,detail])=><article key={step} style={{padding:18,border:"1px solid #665740",background:"#131618"}}><h3 style={{fontSize:12,letterSpacing:1.2,color:"#d9b47c"}}>{step}</h3><p style={{fontSize:13,lineHeight:1.75,color:"#b6bbc3"}}>{detail}</p></article>)}
      </div>
      <p style={{marginTop:25,color:"#aeb1bb",fontSize:13,lineHeight:1.8}}>The goal is one editorial source for connected storefront messages, not unverified claims that changing a metaobject also rewrites Shopify Flow or shipping discounts. Product-card and checkout placements require their own verification. Historical commercial improvements must not be attributed to this specific new cart interface without post-launch evidence.</p>
    </section>
    <section style={{marginTop:70}}>
      <p style={{letterSpacing:2,color:"#d9b47c",fontSize:12}}>PROBLEM → SOLUTION</p>
      <h2 style={{fontSize:36}}>Less promotional drift. More cohesive journeys.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:18}}>
        {[["01 / The problem","Promotional messages can drift between homepage, collections, a third-party cart and fulfilment rules."],["02 / Central configuration","A Shopify metaobject models reward thresholds, labels and terms once for every storefront presentation surface."],["03 / The technical challenge","An app-owned cart may render in an open ShadowRoot and rerender through React hydration. Enhancements must not take over transactional behaviour."],["04 / The reliable pattern","Use Liquid for theme content, scoped JavaScript for app integration, and a distinct post-checkout automation path with eligibility and duplicate guards."]].map(([heading,body])=><article key={heading} style={{padding:24,background:"#1a1e23",border:"1px solid #393d42"}}><h3 style={{fontSize:18,color:"#d9b47c"}}>{heading}</h3><p style={{color:"#adb1ba",lineHeight:1.8,fontSize:14}}>{body}</p></article>)}
      </div>
    </section>
    <section style={{marginTop:70}}>
      <p style={{letterSpacing:2,color:"#d9b47c",fontSize:12}}>BEHIND THE EXPERIENCE / POST-CHECKOUT AUTOMATION</p>
      <h2 style={{fontSize:"clamp(26px,4vw,37px)",margin:"14px 0"}}>The storefront explains. The order workflow fulfils.</h2>
      <p style={{color:"#afb4bd",lineHeight:1.8,maxWidth:830}}>The cart progress rail is only an information layer. In the production engineering pattern, Shopify Flow evaluates the order after checkout and handles qualifying gifts. Shipping is enforced separately. Changing editorial offer data does not automatically change these independent rules.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:23}}>
        {[
          {step:"01",title:"Order placed",detail:"Checkout remains under Shopify's supported order lifecycle."},
          {step:"02",title:"Evaluate eligibility",detail:"Recheck spend, exclusions, subscriptions and prior processing state."},
          {step:"03",title:"Add eligible gift",detail:"Shopify Flow adds qualifying line items using the authorised order action."},
          {step:"04",title:"Fulfil and verify",detail:"Record processing, guard against repeat additions and pack the gift."}
        ].map(item=><div key={item.step} style={{border:"1px solid #60503a",padding:19,background:"#1a1e23"}}><span style={{fontSize:12,color:"#d9b47c"}}>{item.step} / AUTOMATION</span><h3 style={{fontSize:19,margin:"14px 0 7px"}}>{item.title}</h3><p style={{color:"#adb4bd",fontSize:13,lineHeight:1.75}}>{item.detail}</p></div>)}
      </div>
      <p style={{color:"#adb4bd",fontSize:12,marginTop:20}}>Conceptual workflow only: no live orders, gifts or discounts are changed by this demonstration. Actual Flow settings require independent verification.</p>
    </section>
    <section style={{marginTop:60,padding:25,border:"1px solid #6e5940",borderRadius:12}}> 
      <h2 style={{display:"flex",gap:12,alignItems:"center",fontSize:22}}><ShieldCheck/> What this demonstration does, and does not, prove</h2>
      <p style={{color:"#b6bac3",lineHeight:1.8}}>Every setting and reward in this interactive demo is fictional. The visual surfaces share one local JavaScript configuration; there is no active Shopify connection, production theme code, shipping discount, third-party cart modification or Shopify Flow execution. In a production integration, gift fulfilment and shipping eligibility must be validated independently against authoritative platform rules. AOV improvement is an optimisation hypothesis, not a measured outcome.</p>
      <p style={{color:"#d9b47c",fontSize:14}}>Study the reusable implementation in GitHub: <a href="https://github.com/bonvallite/developer-portfolio/blob/main/lib/rewards-engine.mjs" style={{textDecoration:"underline"}}>rewards engine</a> · <a href="https://github.com/bonvallite/developer-portfolio/blob/main/THIRD_PARTY_CART_HISTORY.md" style={{textDecoration:"underline"}}>Shadow DOM engineering history</a></p>
    </section>
  </main>;
}
