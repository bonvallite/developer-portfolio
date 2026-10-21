"use client";

/**
 * Public-safe frontend visual references inspired by an internal progression mock-up.
 * All products, prices and rewards are fictional. These are responsive visual
 * illustrations, not live Shopify components or screenshots of a client store.
 */
import { Gift, Truck, ShoppingBag, ChevronRight, Check, Package, ArrowRight } from "lucide-react";
import { calculateRewardState, formatAUD } from "../../lib/rewards-engine.mjs";

type Offer = {
  enabled: boolean;
  giftThreshold: number;
  shippingThreshold: number;
  bonusThreshold: number;
  giftLabel: string;
  bonusLabel: string;
  terms: string;
};

const frame = { border: "1px solid #696158", borderRadius: 12, background: "#f7f3eb", color: "#27231e", overflow: "hidden" as const, boxShadow: "0 18px 30px rgba(0,0,0,.19)" };
const kicker = { color: "#d8b47e", fontSize: 11, fontWeight: 700, letterSpacing: 1.5 };
const browser = (name: string) => <div style={{background:"#f4eee5",color:"#797265",padding:"10px 15px",borderBottom:"1px solid #e1dacf",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:10}}>
  <span style={{letterSpacing:1}}>◉ ◉ ◉ <span style={{marginLeft:8}}>{name}</span></span>
  <span>DESIGN REFERENCE</span>
</div>;

export default function RewardsVisuals({offer, subtotal}: {offer:Offer; subtotal:number}) {
  const state = calculateRewardState(offer, subtotal);
  const active = state.valid && state.enabled;
  const amount = state.valid && state.enabled ? state.remaining : 0;
  const unlockText = active ? state.next ? `Add ${formatAUD(amount)} to unlock your next reward` : "You've unlocked every reward" : "Rewards currently unavailable";
  const max = active ? state.progressPercent : 0;

  return <section id="frontend-reference" style={{marginTop:76}} aria-labelledby="gallery-heading">
    <p style={kicker}>FRONTEND / VISUAL DESIGN REFERENCE</p>
    <h2 id="gallery-heading" style={{fontSize:"clamp(29px,4.2vw,44px)",margin:"11px 0 15px",lineHeight:1.16}}>One promotion. Four connected storefront views.</h2>
    <p style={{maxWidth:840,lineHeight:1.8,color:"#b9bfc4",fontSize:15,marginBottom:24}}>Inspired by the approved cart progression layout, these four independent, fictional mock-ups share the same offer editor and basket slider above. Change an amount or reward name to see each presentation respond. No client brand assets, original code, live SKUs or checkout integration are included.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,400px),1fr))",gap:22,alignItems:"start"}}>
      <article style={{background:"#1b2021",border:"1px solid #4d4940",borderRadius:16,padding:17}}>
        <p style={{fontSize:11,letterSpacing:1.5,color:"#dab986",margin:"0 0 12px"}}>01 / ANNOUNCEMENT &amp; HOMEPAGE</p>
        <div style={frame}>
          {browser("shop / homepage")}
          <div style={{background:active?"#354e3d":"#434343",color:"#fffbef",padding:"12px 16px",textAlign:"center",fontSize:12,fontWeight:700}}>
            {active ? `A little extra: ${offer.giftLabel} on ${formatAUD(offer.giftThreshold)}+ orders` : "Welcome to the seasonal store"}
          </div>
          <div style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e4ded2"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:23,letterSpacing:1}}>THE MARKET EDIT</span>
            <span style={{fontSize:11,letterSpacing:1}}>SHOP&nbsp;  ABOUT&nbsp;  CART</span>
          </div>
          <div style={{minHeight:208,display:"grid",gridTemplateColumns:"1.2fr 1fr",background:"#e6e0d4"}}>
            <div style={{padding:"25px 12px 25px 22px",display:"flex",flexDirection:"column",justifyContent:"center",gap:13}}>
              <span style={{fontSize:10,letterSpacing:1.7,color:"#7d715b"}}>HAND-CURATED / SEASONAL</span>
              <strong style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(24px,3vw,33px)",lineHeight:1.03}}>Make every basket more rewarding.</strong>
              <span style={{fontSize:11,lineHeight:1.6}}>{active?`A thoughtful extra when your basket reaches ${formatAUD(offer.giftThreshold)}.`:"Discover something exceptional."}</span>
              <span style={{fontSize:10,fontWeight:700,borderBottom:"1px solid #51442e",width:"fit-content",paddingBottom:3}}>EXPLORE COLLECTION →</span>
            </div>
            <div aria-hidden="true" style={{background:"radial-gradient(ellipse at 60% 48%,#bc9f7a 0%,#9b7a58 28%,#455641 31%,#344338 52%,#d9cab3 54%,#b9ad9b 68%,#87745f 100%)"}}/>
          </div>
        </div>
        <p style={{fontSize:12,color:"#b6bbc0",lineHeight:1.6,margin:"14px 0 2px"}}>A consistent headline offer, generated from the same editorial configuration.</p>
      </article>

      <article style={{background:"#1b2021",border:"1px solid #4d4940",borderRadius:16,padding:17}}>
        <p style={{fontSize:11,letterSpacing:1.5,color:"#dab986",margin:"0 0 12px"}}>02 / PRODUCT CARD &amp; DISCOVERY</p>
        <div style={frame}>
          {browser("shop / selection")}
          <div style={{padding:"20px 18px",display:"grid",gridTemplateColumns:"minmax(100px,1fr) 1.35fr",gap:15,minHeight:299}}>
            <div style={{minHeight:215,position:"relative",background:"linear-gradient(140deg,#ddcfba,#c6b397 57%,#9d907e)",borderRadius:6}}>
              <div style={{position:"absolute",width:"65%",height:"51%",left:"18%",top:"21%",borderRadius:"40% 52% 47% 55%",background:"radial-gradient(ellipse,#8d4b40 0%,#672e29 44%,#eee0c6 48%,#965c4b 53%,#5c2e29 77%,#653d31 100%)",boxShadow:"0 10px 21px #745d493f",transform:"rotate(-18deg)"}}/>
              <span style={{position:"absolute",top:9,left:9,background:"#354d3d",color:"#fff",padding:"5px 7px",fontSize:10}}>CHEF'S PICK</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:12}}>
              <span style={{fontSize:10,letterSpacing:1.4,color:"#796c59"}}>CURATED FOR YOUR TABLE</span>
              <strong style={{fontFamily:"Georgia,serif",fontSize:25,fontWeight:500,lineHeight:1.08}}>Weekend Butcher's Selection</strong>
              <span style={{fontSize:20}}>A$95.00</span>
              <div style={{background:"#e5eadd",borderLeft:"3px solid #44684e",padding:"11px 12px",fontSize:11,lineHeight:1.6}}>
                <Gift size={16} style={{verticalAlign:"middle",marginRight:7}}/>
                {active?`Spend ${formatAUD(offer.giftThreshold)} for ${offer.giftLabel}.`:"Browse our seasonal selections."}
              </div>
              <span style={{fontSize:12,background:"#263c30",color:"#fff",textAlign:"center",padding:10,borderRadius:4}}>VIEW DETAILS</span>
            </div>
          </div>
        </div>
        <p style={{fontSize:12,color:"#b6bbc0",lineHeight:1.6,margin:"14px 0 2px"}}>Illustrative placement only. Product-card integration requires a verified theme connection.</p>
      </article>

      <article style={{background:"#1b2021",border:"1px solid #4d4940",borderRadius:16,padding:17}}>
        <p style={{fontSize:11,letterSpacing:1.5,color:"#dab986",margin:"0 0 12px"}}>03 / COLLECTION &amp; CAMPAIGN TEMPLATE</p>
        <div style={frame}>
          {browser("shop / seasonal collection")}
          <div style={{padding:22,background:"#233c2f",color:"#f4f0e7"}}>
            <p style={{fontSize:10,letterSpacing:2,color:"#d8c198"}}>THE SEASONAL EDIT</p>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:31,fontWeight:400,margin:"10px 0"}}>Thoughtful cuts. Extra rewards.</h3>
            <p style={{fontSize:12,lineHeight:1.65,marginBottom:17}}>{active?`Spend ${formatAUD(offer.giftThreshold)} for a little something extra. Higher baskets may unlock delivery benefits and another gift.`:"Explore our curated collection."}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
              {[
                {icon:<Gift size={18}/>,label:"First gift",value:offer.giftThreshold},
                {icon:<Truck size={18}/>,label:"Eligible shipping",value:offer.shippingThreshold},
                {icon:<Package size={18}/>,label:"Bonus reward",value:offer.bonusThreshold}
              ].map((m,i)=><div key={i} style={{background:"#f3efe3",color:"#293c30",padding:"12px 6px",textAlign:"center",borderRadius:5,opacity:active?1:.5}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:7}}>{m.icon}</div>
                <strong style={{fontSize:17}}>{active?formatAUD(m.value):"—"}</strong>
                <div style={{fontSize:10,lineHeight:1.3,marginTop:4}}>{m.label}</div>
              </div>)}
            </div>
          </div>
          <div style={{padding:"16px 21px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}>
            <span>EXPLORE THE COLLECTION</span><ChevronRight size={16}/>
          </div>
        </div>
        <p style={{fontSize:12,color:"#b6bbc0",lineHeight:1.6,margin:"14px 0 2px"}}>A dedicated offer strip keeps multiple spending milestones visible on campaign pages.</p>
      </article>

      <article style={{background:"#1b2021",border:"1px solid #4d4940",borderRadius:16,padding:17}}>
        <p style={{fontSize:11,letterSpacing:1.5,color:"#dab986",margin:"0 0 12px"}}>04 / REACT-OWNED MINICART PROGRESSION</p>
        <div style={{...frame,maxWidth:445,margin:"0 auto"}}>
          {browser("cart / open shadow root")}
          <div style={{background:"#fffdf9",padding:"18px 21px 15px",borderBottom:"1px solid #e3ddd3"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:19}}>
              <strong style={{fontFamily:"Georgia,serif",fontSize:27,fontWeight:500}}>Your cart <span style={{fontFamily:"Arial,sans-serif",fontSize:12,fontWeight:400}}>(3)</span></strong>
              <span style={{fontSize:17,background:"#f0eee6",padding:"0 8px",borderRadius:4}} aria-hidden="true">×</span>
            </div>
            <p style={{fontSize:13,textAlign:"center",fontWeight:700,lineHeight:1.55,color:"#203a2c"}}>{unlockText}</p>
            <div role="progressbar" aria-label="Illustrative cart reward progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(max)} style={{height:7,background:"#dfddd2",borderRadius:20,margin:"17px 0 13px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${max}%`,background:"#607749",borderRadius:20,transition:"width .2s ease"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:7}}>
              {[
                {value:offer.giftThreshold,label:"First gift",icon:<Gift size={17}/>},
                {value:offer.shippingThreshold,label:"Shipping",icon:<Truck size={17}/>},
                {value:offer.bonusThreshold,label:"Bonus",icon:<Package size={17}/>}
              ].map((m,i)=><div key={i} style={{textAlign:"center",fontSize:10,opacity:active?(subtotal>=m.value?1:.54):.4}}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:4}}>{active&&subtotal>=m.value?<Check size={14} color="#3b744a"/>:m.icon}<b style={{fontSize:14}}>{formatAUD(m.value)}</b></div>
                <span style={{display:"block",marginTop:5}}>{m.label}</span>
              </div>)}
            </div>
            <p style={{fontSize:10,textAlign:"center",color:"#6f6a61",lineHeight:1.5,marginTop:16}}>{active?offer.terms:"Rewards are hidden until an active, valid offer is configured."}</p>
          </div>
          <div style={{padding:"14px 21px",background:"#fff"}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:13}}>
              <div style={{background:"linear-gradient(140deg,#e2d6c3,#ae8e6e)",borderRadius:5,width:57,height:59,display:"grid",placeItems:"center"}}><ShoppingBag size={21}/></div>
              <div style={{flex:1}}><strong style={{fontSize:13}}>Chef's weekly selection</strong><div style={{fontSize:11,color:"#6f6c65",marginTop:4}}>Sample product · Quantity 3</div></div>
              <strong style={{fontSize:14}}>{formatAUD(subtotal)}</strong>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #e8e3da",paddingTop:15}}>
              <span style={{fontWeight:700}}>Subtotal <span style={{fontWeight:400,fontSize:12}}>(3 items)</span></span>
              <strong>{formatAUD(subtotal)}</strong>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>
              <span style={{border:"1px solid #6e6255",padding:12,textAlign:"center",fontSize:11,fontWeight:700}}>VIEW CART</span>
              <span style={{background:"#344e3b",color:"#fff",padding:12,textAlign:"center",fontSize:11,fontWeight:700}}>CHECKOUT <ArrowRight size={12} style={{verticalAlign:"middle"}}/></span>
            </div>
          </div>
        </div>
        <p style={{fontSize:12,color:"#b6bbc0",lineHeight:1.6,margin:"14px 0 2px"}}>Based on the approved progression layout concept. This is a safe mock-up, not a functional cart or checkout.</p>
      </article>
    </div>
  </section>;
}
