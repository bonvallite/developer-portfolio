'use client';
/**
 * Additional public-safe and entirely client-side JRV demo modules.
 * Destination calendars are synthetic teaching fixtures, not a copied
 * employer postcode table. The app write-back is a simulation of the
 * independently verified Worker API flow and never calls any provider.
 * The OAuth-authorised Worker makes Admin API requests; the Shopify app
 * is an identity/permission layer, not a separate receiving web server.
 */
import { useMemo, useState } from 'react';
import { ArrowRight, Check, CircleAlert, Database, KeyRound, Mail, MapPin, PackageCheck, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { calculateDemoEta, formatDemoDate, mapDemoCarrierStatus } from '../../../lib/commerce-integration-demo.mjs';

const ZONE_CHOICES = [
  { id:'qld', label:'Weekday route', colour:'teal' },
  { id:'qld-wed', label:'Wednesday-only route', colour:'orange' },
  { id:'qld-mon-thu', label:'Monday and Thursday route', colour:'violet' }
] as const;
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function LastMileLab() {
  const [placedAt,setPlacedAt] = useState('2026-11-23T10:00');
  const [closure,setClosure] = useState(false);
  const [selected,setSelected] = useState('qld-wed');
  const comparisons = useMemo(()=>ZONE_CHOICES.map(zone=>{
    try { return {...zone, data:calculateDemoEta({zoneId:zone.id,orderedAt:placedAt,closureDate:closure?'2026-11-26':''}),error:null}; }
    catch(error) { return {...zone,data:null,error:error instanceof Error?error.message:'Invalid date'}; }
  }),[placedAt,closure]);
  const chosen = comparisons.find(item=>item.id===selected) || comparisons[0];
  const detail = chosen.data;
  return <div className="cie-lastmile">
    <div className="cie-lastmile-intro">
      <div><span className="cie-mini-kicker"><MapPin size={15}/> LOCATION-AWARE RULES</span><h3>Same dispatch. Different doorstep.</h3><p>Compare three <strong>fictional Queensland subzones</strong> sharing one-day transit but different final-mile calendars. A postcode mapping selects the route in the real system; these examples deliberately use invented zone identifiers.</p></div>
      <div className="cie-lastmile-inputs"><label htmlFor="cie-mile-order">Order date and time · Brisbane</label><input id="cie-mile-order" type="datetime-local" value={placedAt} onChange={event=>setPlacedAt(event.target.value)}/><label className="cie-check"><input type="checkbox" checked={closure} onChange={event=>setClosure(event.target.checked)}/> Fictional closure · 26 Nov 2026</label></div>
    </div>
    <div className="cie-mile-options" role="group" aria-label="Select a fictional last-mile delivery zone">
      {comparisons.map(item=><button type="button" key={item.id} className={'cie-mile-option '+(item.id===selected?'is-active':'')} aria-pressed={item.id===selected} onClick={()=>setSelected(item.id)}>
        <span className={'cie-mile-pin '+item.colour} aria-hidden="true"/><span><strong>{item.label}</strong><small>{item.data?'Next delivery '+formatDemoDate(item.data.deliveryISO):'Invalid date'}</small></span><ArrowRight size={16}/>
      </button>)}
    </div>
    <div className="cie-mile-output" aria-live="polite">
      {detail?<>
        <div className="cie-mile-date"><span>SELECTED ROUTE / ESTIMATED DELIVERY</span><strong>{formatDemoDate(detail.deliveryISO)}</strong><small>One-day transit. {detail.routeWaitDays===0?'No additional wait for a permitted delivery day.':detail.routeWaitDays+' extra calendar day(s) waiting for an available route.'}</small></div>
        <div className="cie-mile-calendar" aria-label="Illustrative weekday service calendar">{WEEKDAYS.map((day,i)=><div key={day} className={detail.deliveryWeekdays.includes(i)?'is-route-day':''}><span>{day}</span><strong>{detail.deliveryWeekdays.includes(i)?'●':'–'}</strong></div>)}</div>
        <div className="cie-mile-stages">
          <div><span>01 / DISPATCH</span><strong>{formatDemoDate(detail.dispatchISO)}</strong><small>Origin leaves depot</small></div>
          <div><span>02 / TRANSIT READY</span><strong>{formatDemoDate(detail.transitReadyISO)}</strong><small>Lead time: {detail.leadDays} calendar day</small></div>
          <div><span>03 / LAST MILE</span><strong>{formatDemoDate(detail.lastMileISO)}</strong><small>Next available route slot</small></div>
          <div><span>04 / DELIVERED</span><strong>Not yet confirmed</strong><small>Actual carrier event is separate</small></div>
        </div>
      </>:<p role="alert">Enter a valid Brisbane order date and time.</p>}
      <p className="cie-note"><ShieldCheck size={15}/> The last-mile wait is <strong>already included</strong> in the estimated delivery date. No second delivery day is added. NSW/VIC dispatch-day overrides and SA production rules are handled differently in the existing calculation lab.</p>
    </div>
  </div>;
}

type Scenario = 'normal'|'no-url'|'replay'|'rejected'|'api-error';
const WRITEBACK_STEPS = [
  { name:'CartonCloud callback',tech:'Authenticated carrier POST',desc:'The Worker receives a synthetic logistics update and verifies the incoming callback.' },
  { name:'Identify fulfilment',tech:'Shopify Admin REST lookup',desc:'The Worker uses the custom app offline access to find the matching eligible Shopify order and fulfilment.' },
  { name:'Update tracking',tech:'fulfillmentTrackingInfoUpdate',desc:'The Worker requests a tracking update. A native customer notification can be requested with notifyCustomer.' },
  { name:'Create fulfilment event',tech:'fulfillmentEventCreate',desc:'The Worker maps the carrier milestone to a Shopify fulfilment event where supported.' },
  { name:'Save order metafields',tech:'metafieldsSet',desc:'Shopify receives delivery_status, delivery_status_raw, status timestamp and applicable tracking information.' },
  { name:'Notification decision',tech:'Shopify native notification',desc:'A notification may be requested, but the Worker response does not prove an email was delivered.' }
] as const;
const STATUS_CHOICES = [
  {value:'AWAITING_DROPOFF',label:'Awaiting drop-off'},
  {value:'COLLECTED',label:'Collected'},
  {value:'WITH_ON_FORWARDER',label:'In transit'},
  {value:'IN_TRANSIT_WAREHOUSE_DELIVERY',label:'Out for delivery'},
  {value:'DELIVERED',label:'Delivered'}
] as const;

export function ShopifyWritebackLab() {
  const [status,setStatus]=useState('WITH_ON_FORWARDER');
  const [scenario,setScenario]=useState<Scenario>('normal');
  const [notify,setNotify]=useState(true);
  const [stage,setStage]=useState(-1);
  const mapped = mapDemoCarrierStatus(status);
  const invalid = scenario==='rejected';
  const error = scenario==='api-error';
  const replay = scenario==='replay';
  const missingUrl = scenario==='no-url';
  const max = invalid?0:error?2:5;
  const completed=stage>=0 && stage===max && !invalid && !error;
  const trackingChanged=!replay && !invalid && !error && stage>=2;
  const statusWritten=!invalid && !error && stage>=4;
  const eventWritten=!invalid && !error && stage>=3;
  const notificationRequest=notify && trackingChanged;
  const exampleLink=missingUrl?null:'https://example.invalid/tracking/DEMO';
  const fields = statusWritten?[
    {key:'delivery_status',value:mapped.label},
    {key:'delivery_status_raw',value:status},
    {key:'shopify_fulfillment_event_status',value:mapped.status},
    {key:'delivery_status_updated_at',value:'2026-11-23T10:20:00Z'},
    ...(status==='DELIVERED'?[{key:'delivered_at',value:'2026-11-23T10:20:00Z'}]:[]),
    {key:'cartoncloud_tracking_number',value:'DEMO-TRACK'},
    ...(exampleLink?[{key:'pod_tracking_link',value:exampleLink}]:[])
  ]:[];
  const explain = invalid?'The fictional callback fails authentication. No Shopify API call occurs.'
    :error?'The fictional GraphQL tracking mutation returned a validation error. Do not report an order update or customer notification as successful.'
    :replay?'The tracking number is unchanged. The reviewed Worker may still create another mapped status event and update delivery metafields; it does not guarantee complete webhook deduplication.'
    :missingUrl?'A number is available, but no public tracking URL was supplied. The number may still be written to Shopify; customer experience must not promise a working tracking link.'
    :'This fictional update progresses through the authenticated app, Shopify fulfilment events, order metafields and an optional notification request.';
  const next=()=>setStage(previous=>Math.min(max,previous+1));
  const reset=()=>setStage(-1);
  const chooseScenario=(value:Scenario)=>{setScenario(value);reset();};
  return <div className="cie-writeback">
    <div className="cie-writeback-controls">
      <span className="cie-mini-kicker"><KeyRound size={15}/> CUSTOM APP / WRITE-BACK WORKBENCH</span>
      <h3>From carrier event to Shopify record.</h3>
      <label className="cie-input-label" htmlFor="cie-write-status">Fictional CartonCloud milestone</label>
      <select className="cie-select" id="cie-write-status" value={status} onChange={event=>{setStatus(event.target.value);reset();}}>{STATUS_CHOICES.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select>
      <label className="cie-input-label" htmlFor="cie-write-scenario">Response scenario</label>
      <select className="cie-select" id="cie-write-scenario" value={scenario} onChange={event=>chooseScenario(event.target.value as Scenario)}>
        <option value="normal">Successful update</option><option value="no-url">No tracking URL</option><option value="replay">Repeated tracking callback</option><option value="rejected">Rejected authentication</option><option value="api-error">GraphQL validation error</option>
      </select>
      <label className="cie-check"><input type="checkbox" checked={notify} onChange={event=>{setNotify(event.target.checked);reset();}}/> Request native Shopify customer notification</label>
      <div className="cie-writeback-steps" role="group" aria-label="Write-back workflow stages">
        {WRITEBACK_STEPS.map((item,index)=><button key={item.name} type="button" aria-pressed={stage===index} disabled={index>max} onClick={()=>setStage(index)} className={(stage===index?'is-active ':'')+(stage>index?'is-done':'')}><span>{index<stage?<Check size={13}/>:String(index+1).padStart(2,'0')}</span><strong>{item.name}</strong></button>)}
      </div>
      <div className="cie-trace-actions"><button type="button" className="cie-next-button" onClick={next} disabled={stage>=max}><ArrowRight size={15}/> {stage<0?'Start simulation':'Next write-back step'}</button><button type="button" className="cie-reset" onClick={reset}><RotateCcw size={14}/> Reset</button></div>
      <p className="cie-note"><ShieldCheck size={15}/> All state changes happen in this browser only. This is not a functional Shopify app server, real outgoing email, or a live fulfilment test.</p>
    </div>
    <div className="cie-writeback-monitor" aria-live="polite">
      <div className="cie-monitor-top"><span>APP-AUTHORISED ADMIN API</span><strong>FICTIONAL ORDER / DEMO-001</strong></div>
      <div className="cie-writeback-route">
        <div><Truck size={20}/><span>CartonCloud</span></div><ArrowRight size={16}/><div><KeyRound size={20}/><span>Cloudflare + KV</span></div><ArrowRight size={16}/><div><ShoppingBag size={20}/><span>Shopify</span></div>
      </div>
      <div className="cie-writeback-explainer"><strong>{stage<0?'Ready to simulate':WRITEBACK_STEPS[stage].name}</strong><p>{stage<0?'Choose a milestone and run the write-back. No data has been submitted.':WRITEBACK_STEPS[stage].desc}</p><small>{stage<0?'Local demo only':WRITEBACK_STEPS[stage].tech}</small></div>
      {(invalid||error||replay||missingUrl) && <div className="cie-trace-alert is-warning"><CircleAlert size={20}/><p>{explain}</p></div>}
      <div className="cie-writeback-snapshot">
        <div className="cie-writeback-card">
          <span className="cie-mini-kicker"><Truck size={14}/> SHIPPING UPDATE</span>
          <dl><dt>Tracking number</dt><dd>{trackingChanged||replay&&stage>=2?'DEMO-TRACK':'—'}</dd><dt>Tracking URL</dt><dd>{trackingChanged&&exampleLink?'Fictional URL available':missingUrl&&stage>=2?'Not supplied':'—'}</dd><dt>Mutation result</dt><dd>{error&&stage>=2?'USER_ERRORS':trackingChanged?'SIMULATED SUCCESS':replay&&stage>=2?'UNCHANGED':'PENDING'}</dd></dl>
        </div>
        <div className="cie-writeback-card">
          <span className="cie-mini-kicker"><Database size={14}/> ORDER METAFIELDS</span>
          <p className="cie-writeback-placeholder">{statusWritten?fields.length+' example fields written':'No order update simulated yet'}</p>
          {fields.length>0&&<div className="cie-writeback-fields">{fields.map(field=><div key={field.key}><span>{field.key}</span><strong>{field.value}</strong></div>)}</div>}
        </div>
        <div className="cie-writeback-card">
          <span className="cie-mini-kicker"><PackageCheck size={14}/> FULFILMENT EVENT</span>
          <p className="cie-writeback-placeholder">{eventWritten?mapped.label:'No event simulated yet'}</p>
          <small>{eventWritten?mapped.status:'Awaiting authorised event write'}</small>
        </div>
        <div className="cie-writeback-card">
          <span className="cie-mini-kicker"><Mail size={14}/> CUSTOMER NOTIFICATION</span>
          <p className="cie-writeback-placeholder">{!notify?'Disabled by user':notificationRequest?'Requested via Shopify':replay&&stage>=2?'No new tracking notification requested':'Not requested'}</p>
          <small>{notificationRequest?'Not proof of email delivery':'No email has been sent by this demonstration'}</small>
        </div>
      </div>
      <div className="cie-email-preview">
        <span className="cie-mini-kicker"><Mail size={14}/> CUSTOMER EMAIL / CONCEPT PREVIEW</span>
        <div><strong>{mapped.status==='DELIVERED'?'Delivery update':'Shipping update'}</strong><small>Fictional recipient · No message sent</small></div>
        <p>Your order <strong>DEMO-001</strong> has a delivery status of <strong>{mapped.label.toLowerCase()}</strong>. {exampleLink?'Tracking information may be available in your order details.':'A public tracking link is not currently available.'}</p>
        <small>This copy is illustrative, not a verified Shopify notification template. A requested notification may be delayed, suppressed, or fail independently.</small>
      </div>
      <p className="cie-note"><ShieldCheck size={15}/> {completed?'Simulation reached its final stage. These are fictional UI records.':explain}</p>
    </div>
  </div>;
}
