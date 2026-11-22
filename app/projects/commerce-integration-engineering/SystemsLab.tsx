'use client';
/**
 * Interactive, client-only architecture and calculations for the draft JRV
 * systems-engineering case study. Every entity, event and trace is fictional:
 * no network calls, actual Shopify orders, tokens or CartonCloud credentials.
 * Production is an operational handoff through Shopify fulfilment events; this
 * panel does not claim an unverified direct production webhook.
 */
import { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, Check, ChevronRight, Cloud, Database,
  Factory, FileJson2, KeyRound, LockKeyhole, Package, Play, RotateCcw,
  ShieldAlert, ShieldCheck, ShoppingBag, Truck, Workflow
} from 'lucide-react';
import {
  DEMO_ZONES, calculateDemoEta, calculateDemoShipment,
  formatDemoDate, mapDemoCarrierStatus
} from '../../../lib/commerce-integration-demo.mjs';

const FLOWS = [
  { id:'eta', label:'01 · Order → ETA', subtitle:'Order-created webhook + metafields',
    steps:[
      {node:'shopify',label:'Shopify emits order event',detail:'An order-created webhook provides a purchase timestamp and destination. It is an outbound Shopify event, not a generic incoming Shopify webhook endpoint.',tech:'orders/create · POST'},
      {node:'worker',label:'Worker authenticates and calculates',detail:'The Worker checks a Shopify HMAC signature when the signing secret is configured, then applies postcode, dispatch and holiday rules.',tech:'Web Crypto · JavaScript'},
      {node:'kv',label:'Worker retrieves app access',detail:'Cloudflare KV holds the Shopify app offline access token established during OAuth. It does not store individual delivery-event queues in this source.',tech:'Workers KV · get'},
      {node:'app',label:'Custom app authorises write-back',detail:'App-granted Admin API scopes allow the Worker to submit authorised mutations.',tech:'OAuth 2.0 · Admin API'},
      {node:'shopify',label:'GraphQL saves delivery metafields',detail:'The estimated date and supporting breakdown return to Shopify order metafields for later operational and customer-facing use.',tech:'metafieldsSet · GraphQL'}
    ]},
  { id:'fulfilment', label:'02 · Production → Carrier', subtitle:'Fulfilment-created webhook + REST',
    steps:[
      {node:'production',label:'Production prepares the order',detail:'Production is the real-world operational process. The reviewed Worker does not show a separate outbound Production API call.',tech:'Operational handoff'},
      {node:'shopify',label:'Shopify creates a fulfilment',detail:'The Shopify fulfilment event starts the shipping handoff, after the internal production workflow.',tech:'fulfillments/create · POST'},
      {node:'worker',label:'Worker validates shipping eligibility',detail:'Gift cards, non-shipping items and pickup-related fulfilments are filtered. Physical-item weights inform the carton calculation.',tech:'JavaScript · validation'},
      {node:'worker',label:'Worker builds a consignment',detail:'Physical shipment grams are totalled, converted to kilograms and divided by a 20 kg illustrative carton capacity.',tech:'Math.ceil(weightKg / 20)'},
      {node:'carton',label:'CartonCloud REST accepts a consignment',detail:'An authenticated POST submits shipment information to CartonCloud. A carrier response is checked before the integration reports success.',tech:'OAuth client credentials · REST'}
    ]},
  { id:'tracking', label:'03 · Carrier → Shopify', subtitle:'Carrier callback + GraphQL updates',
    steps:[
      {node:'carton',label:'Carrier emits tracking milestone',detail:'CartonCloud provides a status and may include tracking number and URL. The URL is not guaranteed in every callback.',tech:'Carrier webhook · POST'},
      {node:'worker',label:'Worker validates callback',detail:'The receiving endpoint authenticates the callback, normalises its payload and matches a Shopify order reference.',tech:'Basic Authentication · mapping'},
      {node:'kv',label:'Worker obtains app token',detail:'Cloudflare Workers KV persists the offline token for the installed Shopify integration app.',tech:'Workers KV · get'},
      {node:'app',label:'Custom app authorises updates',detail:'The authenticated Worker uses the app permission scopes to reach the Shopify Admin API.',tech:'Shopify app · OAuth'},
      {node:'shopify',label:'Shopify tracking and statuses update',detail:'Tracking, fulfilment status events and delivery metafields are written back through Admin API operations. Native notifications may be requested.',tech:'GraphQL · tracking and events'}
    ]}
] as const;

const NODES = [
  { id:'shopify', title:'Shopify', subtitle:'Commerce & events', icon:ShoppingBag, detail:'Source of orders and fulfilments; destination for authorised tracking, event and metafield updates.' },
  { id:'production', title:'Production', subtitle:'Operational handoff', icon:Factory, detail:'The real-world preparation workflow precedes fulfilment. No separate direct production API is claimed here.' },
  { id:'worker', title:'Cloudflare Workers', subtitle:'JavaScript orchestration', icon:Cloud, detail:'Receives webhooks, validates requests, calculates dates and cartons, calls APIs and handles errors.' },
  { id:'carton', title:'CartonCloud', subtitle:'REST & callbacks', icon:Truck, detail:'Receives consignment POSTs and sends tracking updates to the Worker callback endpoint.' },
  { id:'app', title:'Custom Shopify App', subtitle:'Identity & permissions', icon:KeyRound, detail:'Non-embedded app registration. Its OAuth authorisation lets the Worker write back via Shopify Admin API.' },
  { id:'kv', title:'Workers KV', subtitle:'Persistent OAuth state', icon:Database, detail:'Temporarily persists signed OAuth state; stores the offline Shopify token after successful app authorisation.' }
] as const;

export function ArchitectureLab() {
  const [flowIndex,setFlowIndex]=useState(0);
  const [step,setStep]=useState(0);
  const [nodeId,setNodeId]=useState<string | null>(null);
  const flow=FLOWS[flowIndex];
  const current=flow.steps[step];
  const detailNode=NODES.find(node=>node.id === (nodeId || current.node)) || NODES[0];
  const changeFlow=(index:number)=>{setFlowIndex(index);setStep(0);setNodeId(null);};
  const selectStep=(index:number)=>{setStep(index);setNodeId(null);};
  const goNext=()=>{setStep(index=>(index+1)%flow.steps.length);setNodeId(null);};
  return <div className="cie-arch-lab">
    <div className="cie-tabs" role="group" aria-label="Integration journey">
      {FLOWS.map((item,index)=><button key={item.id} type="button" className={'cie-tab '+(index===flowIndex?'is-active':'')} onClick={()=>changeFlow(index)} aria-pressed={index===flowIndex}><strong>{item.label}</strong><small>{item.subtitle}</small></button>)}
    </div>
    <div className="cie-arch-grid">
      <div className="cie-network">
        <svg className="cie-network-lines" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
          <path d="M160 108 C380 70 365 255 500 255 S715 110 840 108" />
          <path d="M160 340 C340 360 350 255 500 255 S720 335 840 340" />
          <path d="M500 438 L500 290" />
        </svg>
        <div className="cie-nodes">
          {NODES.map(({id,title,subtitle,icon:Icon})=><button key={id} type="button" className={'cie-node cie-node--'+id+' '+(current.node===id?'is-flow-active ':'')+(detailNode.id===id?'is-inspected':'')} onClick={()=>setNodeId(id)} aria-pressed={detailNode.id===id}><Icon size={id==='worker'?31:23} aria-hidden="true" /><strong>{title}</strong><span>{subtitle}</span></button>)}
        </div>
        <div className="cie-network-label" aria-hidden="true"><span className="cie-network-blink" /> SIX CONCEPTUAL SYSTEM NODES</div>
      </div>
      <div className="cie-arch-inspector">
        <div className="cie-inspector-top"><span><Workflow size={15}/> EVENT INSPECTOR</span><strong>{String(step+1).padStart(2,'0')} / {flow.steps.length}</strong></div>
        <p className="cie-minor-title">SELECTED STEP</p>
        <h3>{current.label}</h3>
        <p>{current.detail}</p>
        <div className="cie-inspector-meta"><span>TECHNOLOGY</span><strong>{current.tech}</strong></div>
        <div className="cie-inspector-meta"><span>SELECTED NODE</span><strong>{detailNode.title}</strong></div>
        <p className="cie-node-explanation">{detailNode.detail}</p>
        <button type="button" className="cie-next-button" onClick={goNext}>Next event <ArrowRight size={17}/></button>
      </div>
    </div>
    <div className="cie-event-track" role="group" aria-label="Event stages">
      {flow.steps.map((item,index)=><button key={item.label} type="button" onClick={()=>selectStep(index)} aria-pressed={step===index} className={'cie-event-track-item '+(step===index?'is-active':'')}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.label}</strong></button>)}
    </div>
    <p className="cie-note"><ShieldCheck size={15}/> The animated connections are conceptual. Specific API boundaries are described in the stage inspector; this diagram does not represent a captured production trace.</p>
  </div>;
}

export function CalculationLab() {
  const [zoneId,setZoneId]=useState('vic');
  const [orderedAt,setOrderedAt]=useState('2026-11-23T10:00');
  const [units,setUnits]=useState(8);
  const [grams,setGrams]=useState(2750);
  const [closure,setClosure]=useState(false);
  const [digitalOnly,setDigitalOnly]=useState(false);

  const result=useMemo(()=>{
    try{return {data:calculateDemoEta({zoneId,orderedAt,closureDate:closure?'2026-11-26':''}),error:''};}
    catch(error){return {data:null,error:error instanceof Error?error.message:'Invalid date'};}
  },[zoneId,orderedAt,closure]);
  const shipment=useMemo(()=>calculateDemoShipment({items:[
    {grams,quantity:units,requiresShipping:!digitalOnly},
    {grams:0,quantity:1,requiresShipping:false}
  ]}),[grams,units,digitalOnly]);

  const data=result.data;
  return <div className="cie-calc-panel">
    <div className="cie-calc-form">
      <div className="cie-panel-kicker"><Package size={16}/> LOCAL SIMULATION / CHANGE THE INPUTS</div>
      <label className="cie-input-label" htmlFor="cie-zone">Destination example</label>
      <select id="cie-zone" value={zoneId} onChange={e=>setZoneId(e.target.value)} className="cie-select">
        {DEMO_ZONES.map(zone=><option key={zone.id} value={zone.id}>{zone.label} · {zone.postcode}</option>)}
      </select>
      <label className="cie-input-label" htmlFor="cie-order-time">Order placed (Brisbane time)</label>
      <input id="cie-order-time" type="datetime-local" className="cie-input" value={orderedAt} onChange={e=>setOrderedAt(e.target.value)} />
      <div className="cie-slider-head"><label htmlFor="cie-quantity">Number of physical items</label><strong>{units}</strong></div>
      <input type="range" id="cie-quantity" min="1" max="16" step="1" value={units} onChange={e=>setUnits(Number(e.target.value))}/>
      <div className="cie-slider-head"><label htmlFor="cie-weight">Weight per item</label><strong>{(grams/1000).toFixed(2)} kg</strong></div>
      <input type="range" id="cie-weight" min="500" max="9000" step="250" value={grams} onChange={e=>setGrams(Number(e.target.value))}/>
      <label className="cie-check"><input type="checkbox" checked={closure} onChange={e=>setClosure(e.target.checked)}/><span>Inject fictional closure on 26 Nov 2026</span></label>
      <label className="cie-check"><input type="checkbox" checked={digitalOnly} onChange={e=>setDigitalOnly(e.target.checked)}/><span>Try non-shipping items only</span></label>
      <button className="cie-reset" type="button" onClick={()=>{setZoneId('vic');setOrderedAt('2026-11-23T10:00');setUnits(8);setGrams(2750);setClosure(false);setDigitalOnly(false);}}><RotateCcw size={14}/> Reset fictional order</button>
    </div>
    <div className="cie-calc-output" aria-live="polite">
      <div className="cie-result-top"><span>ENGINE OUTPUT / SYNTHETIC</span><span className="cie-result-ready"><Check size={13}/> CALCULATED LOCALLY</span></div>
      {data ? <>
        <div className="cie-result-highlight">
          <div><span>ESTIMATED DELIVERY</span><strong>{formatDemoDate(data.deliveryISO)}</strong><small>{data.zoneLabel}</small></div>
          <div><span>CARTON REQUIREMENT</span><strong>{shipment.cartons}<small> cartons</small></strong><small>{shipment.eligible?'20 kg illustration per carton':'Shipment not eligible'}</small></div>
        </div>
        <div className="cie-journey-tiles">
          <div><span>01 / ORDER</span><strong>{formatDemoDate(data.orderedISO)}</strong></div>
          <div><span>02 / PRODUCTION</span><strong>{formatDemoDate(data.productionISO)}</strong></div>
          <div><span>03 / DISPATCH</span><strong>{formatDemoDate(data.dispatchISO)}</strong></div>
          <div><span>04 / DELIVERY</span><strong>{formatDemoDate(data.deliveryISO)}</strong></div>
        </div>
        <div className="cie-output-rule"><strong>Why that date?</strong><p>{data.rule}</p></div>
      </> : <p className="cie-input-error" role="alert">{result.error}</p>}
      <div className="cie-weight-breakdown">
        <div><span>Shippable weight</span><strong>{shipment.weightKg.toFixed(2)} kg</strong></div>
        <div className="cie-weight-meter" aria-hidden="true"><span style={{width:Math.min(100,shipment.weightKg/20*100)+'%'}} /></div>
        <p>{shipment.eligible?shipment.cartons+' carton(s), rounded up from total physical item weight.':'Digital/non-shipping items are excluded; no carrier consignment would be prepared.'}</p>
      </div>
      <p className="cie-note"><ShieldCheck size={15}/> This is a deterministic learning model, not the complete private production rule table. The closure toggle is fictional and no public-holiday or delivery API is called.</p>
    </div>
  </div>;
}

const TRACE_STAGES = [
  {title:'Receive carrier callback',tech:'CartonCloud → Worker'},
  {title:'Verify and parse webhook',tech:'HTTP authentication'},
  {title:'Find eligible Shopify fulfilment',tech:'Shopify REST lookup'},
  {title:'Map carrier status',tech:'Normalisation rules'},
  {title:'Write tracking and metafields',tech:'App-authorised GraphQL'},
  {title:'Evaluate customer notification',tech:'Shopify native notification'}
];
const TRACE_SCENARIOS = [
  {id:'normal',label:'Complete tracking'},
  {id:'missing',label:'Missing tracking link'},
  {id:'replay',label:'Repeated callback'},
  {id:'invalid',label:'Invalid signature'}
] as const;

export function EventLab() {
  const [scenario,setScenario]=useState<(typeof TRACE_SCENARIOS)[number]['id']>('normal');
  const [rawStatus,setRawStatus]=useState('COLLECTED');
  const [stage,setStage]=useState(0);
  const mapped=mapDemoCarrierStatus(rawStatus);
  const blocked=scenario==='invalid';
  const current=TRACE_STAGES[stage];
  const warning=scenario==='missing' ? 'Carrier provided a number, but no public tracking URL. The real implementation can still write a tracking number; notification design needs review.'
    : scenario==='replay' ? 'The reviewed source checks unchanged tracking, but repeat callbacks can still create further status events. This is an improvement opportunity, not a deduplication guarantee.'
    : scenario==='invalid' ? 'Invalid authentication should stop the workflow before any Shopify write. This simulated trace is blocked at verification.'
    : 'The fictional callback progresses to Shopify fulfilment updates. An API write is not proof that an email reached a customer.';
  const maxStage=blocked?1:TRACE_STAGES.length-1;
  const safePayload={event:'logistics.status',reference:'DEMO-ORDER',status:rawStatus,tracking_number:scenario==='missing'?'DEMO-NUMBER':'DEMO-NUMBER',tracking_url:scenario==='missing'?null:'https://example.invalid/track/fictional',simulated:true};
  return <div className="cie-trace-layout">
    <div className="cie-trace-controls">
      <div className="cie-panel-kicker"><FileJson2 size={16}/> CARRIER CALLBACK / PLAY THE EVENT</div>
      <div className="cie-trace-choices" role="group" aria-label="Callback scenario">
        {TRACE_SCENARIOS.map(item=><button type="button" key={item.id} className={scenario===item.id?'is-active':''} onClick={()=>{setScenario(item.id);setStage(0);}} aria-pressed={scenario===item.id}>{item.label}</button>)}
      </div>
      <label className="cie-input-label" htmlFor="cie-carrier-status">CartonCloud example status</label>
      <select id="cie-carrier-status" className="cie-select" value={rawStatus} onChange={e=>{setRawStatus(e.target.value);setStage(0);}}>
        {['AWAITING_DROPOFF','COLLECTED','WITH_ON_FORWARDER','IN_TRANSIT_WAREHOUSE_DELIVERY','DELIVERED'].map(status=><option value={status} key={status}>{status.replaceAll('_',' ')}</option>)}
      </select>
      <div className="cie-event-stepper" role="group" aria-label="Simulated callback stages">
        {TRACE_STAGES.map((item,index)=><button key={item.title} type="button" disabled={index>maxStage} onClick={()=>setStage(index)} aria-pressed={stage===index} className={stage===index?'is-active':''}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.title}</strong><ChevronRight size={14}/></button>)}
      </div>
      <div className="cie-trace-actions">
        <button type="button" className="cie-next-button" disabled={stage===maxStage} onClick={()=>setStage(value=>Math.min(maxStage,value+1))}><Play size={15}/> Run next step</button>
        <button type="button" className="cie-reset" onClick={()=>setStage(0)}><RotateCcw size={14}/> Restart trace</button>
      </div>
    </div>
    <div className="cie-trace-monitor" aria-live="polite">
      <div className="cie-monitor-top"><span><span className="cie-network-blink"/> EVENT TRACE</span><strong>SIMULATED</strong></div>
      <p className="cie-minor-title">STEP {String(stage+1).padStart(2,'0')} / {TRACE_STAGES.length}</p>
      <h3>{current.title}</h3>
      <p className="cie-trace-tech">{current.tech}</p>
      <div className="cie-translation"><span>CARTONCLOUD</span><strong>{rawStatus}</strong><ArrowRight size={16}/><span>SHOPIFY EVENT</span><strong>{mapped.status}</strong></div>
      <div className={'cie-trace-alert '+(scenario==='normal'?'is-normal':'is-warning')}>
        {scenario==='normal'?<ShieldCheck size={21}/>:<ShieldAlert size={21}/>}<p>{warning}</p>
      </div>
      <div className="cie-payload">
        <div><span>EXAMPLE EVENT / JSON</span><span>NO LIVE REQUESTS</span></div>
        <pre><code>{JSON.stringify(safePayload,null,2)}</code></pre>
      </div>
      {blocked?<p className="cie-note">Verification rejected. No downstream Shopify changes are simulated.</p>:<p className="cie-note">The Worker writes through app-authorised Shopify APIs. Notification delivery, idempotency and runtime success are not proven by this demonstration.</p>}
    </div>
  </div>;
}

const AUTH_STAGES = [
  {step:'App registration',title:'Create the authorised application',detail:'A non-embedded Shopify app is registered with order and fulfilment read/write scopes. Cloudflare hosts its external installation and callback routes.',kvKey:'none',kvValue:'App configuration belongs to Shopify Dev Dashboard',tech:'Shopify Dev Dashboard'},
  {step:'Authorisation state',title:'Sign and temporarily store state',detail:'The Worker creates a signed state token and stores a matching record in Workers KV with a 600-second expiry.',kvKey:'oauth_state:<demo-random>',kvValue:'{ shop: "fictional-store", ttl: 600 }',tech:'crypto.subtle · KV.put'},
  {step:'OAuth callback',title:'Validate the return from Shopify',detail:'The callback verifies Shopify HMAC, matching shop, signed cookie and the temporary KV state before exchanging a code.',kvKey:'oauth_state:<demo-random>',kvValue:'Validated and deleted after use',tech:'HMAC-SHA256 · OAuth'},
  {step:'Offline access',title:'Persist authorised Shopify access',detail:'The authorised offline token record is persisted in Workers KV. Its actual value is never shown in this demonstration.',kvKey:'shopify_token:demo-shop',kvValue:'{ access_token: "••••••", scope: "[redacted]" }',tech:'Workers KV · persistent token'},
  {step:'API operation',title:'Use the app for Shopify write-back',detail:'The Worker obtains the offline token and sends authenticated Shopify Admin API requests for tracking, events and metafields.',kvKey:'shopify_token:demo-shop',kvValue:'KV.get → token (masked) → Shopify Admin GraphQL',tech:'REST · GraphQL · permission scopes'}
] as const;

export function OAuthLab() {
  const [index,setIndex]=useState(0);
  const current=AUTH_STAGES[index];
  return <div className="cie-oauth-layout">
    <div className="cie-oauth-rail" role="group" aria-label="Shopify app OAuth and KV steps">
      {AUTH_STAGES.map((item,i)=><button type="button" key={item.step} aria-pressed={index===i} className={index===i?'is-active':''} onClick={()=>setIndex(i)}><span>0{i+1}</span><strong>{item.step}</strong><ArrowRight size={16}/></button>)}
    </div>
    <div className="cie-oauth-detail" aria-live="polite">
      <div className="cie-panel-kicker"><LockKeyhole size={16}/> CUSTOM SHOPIFY APP / WORKERS KV</div>
      <h3>{current.title}</h3>
      <p>{current.detail}</p>
      <div className="cie-kv-window">
        <div className="cie-kv-window-header"><Database size={17}/><strong>Cloudflare Workers KV</strong><span>MASKED</span></div>
        <dl><dt>KEY</dt><dd>{current.kvKey}</dd><dt>VALUE / ACTION</dt><dd>{current.kvValue}</dd></dl>
      </div>
      <div className="cie-inspector-meta"><span>ENGINEERING SKILL</span><strong>{current.tech}</strong></div>
      <button className="cie-next-button" type="button" onClick={()=>setIndex(value=>(value+1)%AUTH_STAGES.length)}>Next authentication stage <ArrowRight size={16}/></button>
    </div>
    <p className="cie-note cie-oauth-note"><ShieldCheck size={15}/> Workers KV is used for OAuth state and offline access credentials in the reviewed source. This does not claim a durable event queue or transactional deduplication store.</p>
  </div>;
}
