'use client';
/**
 * 22 Nov 2026: customer communication reconstruction for Draft PR #100.
 * The inspected Worker calculates ETA on orders/create and writes typed
 * custom.* order METAFIELDS through the app-authorised Admin GraphQL API.
 * Fulfilment and CartonCloud tracking arrive later through a separate path.
 * The owner's five-minute email delay and SMS channel are REPORTED store
 * behaviour outside the inspected Worker; never claim that worker.js sends
 * an email/SMS or that a notifyCustomer request guarantees delivery.
 * All examples are fictional and stay in this browser; no network calls.
 */
import { useMemo, useState } from 'react';
import {
  ArrowRight, Check, Clock3, Database, Mail, MessageSquareText,
  ShieldCheck, ShoppingBag, Truck, AlertCircle
} from 'lucide-react';
import {
  DEMO_COMMUNICATION_STAGES, calculateDemoCommunication, formatDemoDate
} from '../../../lib/commerce-integration-demo.mjs';
import type { DemoCommunicationStage } from '../../../lib/commerce-integration-demo.mjs';

type Channel = 'eta'|'shipping'|'sms';
const ROUTES = [
  {id:'qld-wed',label:'Wednesday route · fictional zone'},
  {id:'qld',label:'Weekday route · fictional example'},
  {id:'qld-mon-thu',label:'Mon/Thu route · fictional zone'}
];
export default function CustomerCommunicationLab() {
  const [stage,setStage]=useState<DemoCommunicationStage>('eta-notice');
  const [channel,setChannel]=useState<Channel>('eta');
  const [zoneId,setZoneId]=useState('qld-wed');
  const [estimateSaved,setEstimateSaved]=useState(true);
  const [trackingReady,setTrackingReady]=useState(true);
  const [smsEnabled,setSmsEnabled]=useState(true);
  const model=useMemo(()=>calculateDemoCommunication({
    zoneId,stage,estimateSaved,trackingReady,smsEnabled
  }),[zoneId,stage,estimateSaved,trackingReady,smsEnabled]);
  const estimate=formatDemoDate(model.eta.deliveryISO);
  const hasPreview=channel==='eta'?model.etaNoticeReady:
    channel==='shipping'?model.shippingConfirmationReady:model.smsNoticeReady;
  const channelName=channel==='eta'?'ESTIMATED DELIVERY EMAIL':
    channel==='shipping'?'SHIPPING CONFIRMATION EMAIL':'CUSTOMER SMS';
  const explanation=channel==='eta'
    ?'Reported five-minute store notification. The Worker stores ETA metafields; separate store automation must trigger the message.'
    :channel==='shipping'
      ?'Shipping confirmation follows fulfilment. The Worker may request a tracking update notification, but no email receipt is guaranteed.'
      :'SMS is a reported store channel. The Worker does not implement SMS sending; the SMS provider, consent and receipt are not verified.';
  return <div className="cie-communications">
    <div className="cie-communications-top">
      <div>
        <span className="cie-mini-kicker"><Mail size={15} aria-hidden="true"/> CUSTOMER EXPERIENCE / WORKER → ORDER DATA → MESSAGES</span>
        <h3>An ETA before a tracking link.</h3>
        <p>Explore the handoff from order creation to a calculated delivery date, a reported five-minute customer notice, and a later fulfilment/tracking update. The Worker <strong>stores delivery data</strong>; a separate store notification process owns emails and SMS delivery.</p>
      </div>
      <div className="cie-communication-controls">
        <label htmlFor="cie-comms-zone">Fictional destination route</label>
        <select id="cie-comms-zone" value={zoneId} onChange={e=>setZoneId(e.target.value)}>
          {ROUTES.map(route=><option key={route.id} value={route.id}>{route.label}</option>)}
        </select>
        <label className="cie-check"><input type="checkbox" checked={estimateSaved} onChange={e=>setEstimateSaved(e.target.checked)}/> GraphQL ETA metafield write succeeds</label>
        <label className="cie-check"><input type="checkbox" checked={trackingReady} onChange={e=>setTrackingReady(e.target.checked)}/> Tracking reference available after fulfilment</label>
        <label className="cie-check"><input type="checkbox" checked={smsEnabled} onChange={e=>setSmsEnabled(e.target.checked)}/> Include reported SMS channel</label>
      </div>
    </div>
    <div className="cie-communication-timeline" role="group" aria-label="Select order and notification stage">
      {DEMO_COMMUNICATION_STAGES.map((item,index)=><button type="button" key={item.id}
        className={'cie-communication-stage '+(stage===item.id?'is-active':'')}
        aria-pressed={stage===item.id} onClick={()=>setStage(item.id)}>
        <span className="cie-communication-stage-count">{index+1}</span>
        <span className="cie-communication-stage-copy"><small>{item.offset}</small><strong>{item.label}</strong><span>{item.detail}</span></span>
        {stage===item.id?<Check size={16} aria-hidden="true"/>:<ArrowRight size={16} aria-hidden="true"/>}
      </button>)}
    </div>
    <div className="cie-communications-grid">
      <section className="cie-communication-data" aria-labelledby="cie-communication-data-title">
        <div className="cie-communication-panel-head">
          <span className="cie-mini-kicker"><Database size={15} aria-hidden="true"/> ORDER PERSISTENCE</span>
          <h4 id="cie-communication-data-title">Custom order metafields</h4>
          <p>Typed Shopify <code>custom.*</code> metafields, not metaobjects. The Worker calculates the ETA and uses the app-authorised <code>metafieldsSet</code> mutation.</p>
        </div>
        <div className="cie-communication-order">
          <span><ShoppingBag size={14} aria-hidden="true"/> FICTIONAL ORDER / {model.orderReference}</span>
          <span>{model.estimateSaved?'ETA FIELDS SAVED':model.stageIndex===0?'AWAITING WEBHOOK':estimateSaved?'AWAITING ESTIMATE WRITE':'ETA WRITE FAILED'}</span>
        </div>
        <div className="cie-communication-fields" aria-live="polite">
          {model.orderMetafields.length
            ? model.orderMetafields.map(field=><div className="cie-communication-field" key={field.key}>
                <div><code>{field.key}</code><span>{field.type}</span></div>
                <strong>{field.value}</strong>
              </div>)
            : <div className="cie-communication-empty"><AlertCircle size={20} aria-hidden="true"/><p>{model.stageIndex===0?'The Worker has not written delivery metadata yet.':'No ETA metafields were saved. Do not promise a delivery date in customer communications.'}</p></div>}
        </div>
        <div className="cie-communication-layer">
          <span><Clock3 size={14} aria-hidden="true"/> REPORTED CUSTOMER NOTICE DELAY</span>
          <strong>5 minutes</strong>
          <small>Configured outside the inspected Worker. The delay allows estimated delivery fields to populate, but does not guarantee a saved estimate or available tracking link.</small>
        </div>
      </section>
      <section className="cie-communication-preview" aria-labelledby="cie-communication-preview-title">
        <div className="cie-communication-panel-head">
          <span className="cie-mini-kicker"><Mail size={15} aria-hidden="true"/> CUSTOMER VIEW / FICTIONAL SAMPLE</span>
          <h4 id="cie-communication-preview-title">See what the customer could receive.</h4>
          <p>{explanation}</p>
        </div>
        <div className="cie-communication-channel-tabs" role="group" aria-label="Select customer notification preview">
          <button type="button" aria-pressed={channel==='eta'} className={channel==='eta'?'is-active':''} onClick={()=>setChannel('eta')}><Mail size={14}/> ETA email</button>
          <button type="button" aria-pressed={channel==='shipping'} className={channel==='shipping'?'is-active':''} onClick={()=>setChannel('shipping')}><Truck size={14}/> Shipping email</button>
          <button type="button" aria-pressed={channel==='sms'} className={channel==='sms'?'is-active':''} onClick={()=>setChannel('sms')}><MessageSquareText size={14}/> SMS</button>
        </div>
        <div className="cie-customer-message" aria-live="polite">
          <div className="cie-customer-message-status"><span>{channelName}</span><strong>{hasPreview?'CONCEPT PREVIEW':'NOT YET AVAILABLE'}</strong></div>
          {hasPreview ? channel==='sms' ? <div className="cie-sms-display">
            <span className="cie-sms-sender">FICTIONAL COLD-CHAIN STORE</span>
            <p>Order {model.orderReference}: {model.estimateSaved?'Estimated chilled delivery '+estimate+'. ':''}
              {model.trackingReady?' Tracking is now available: DEMO-TRACK-041.':' Tracking details will follow after fulfilment.'}
              Delivery dates may change due to route or weather conditions.</p>
            <small>Illustrative SMS only. No telephone number, provider or real message.</small>
          </div> : <div className="cie-customer-email">
            <div className="cie-customer-email-brand"><span>DEMO COLD-CHAIN STORE</span><strong>ORDER {model.orderReference}</strong></div>
            <h4>{channel==='shipping'?'Your order is on the way':'Your estimated delivery date'}</h4>
            <p>{channel==='shipping'?'Your order has been prepared for delivery. Tracking information will be updated as it becomes available.':'Thank you for your order. Here is the estimated chilled delivery date based on the destination route and order timing.'}</p>
            {model.estimateSaved?<div className="cie-customer-email-eta">
              <span>ESTIMATED COLD-CHAIN DELIVERY</span>
              <strong>{estimate}</strong>
              <dl><dt>Delivery zone</dt><dd>{model.eta.zoneLabel}</dd><dt>Postcode example</dt><dd>{model.eta.postcode}</dd></dl>
            </div>:<p className="cie-customer-email-missing">The ETA write was not confirmed. No estimated date is shown.</p>}
            {channel==='shipping' && <div className="cie-customer-email-tracking">
              <strong>{model.trackingReady?'Tracking reference: '+model.trackingReference:'Tracking link not yet available'}</strong>
              <span>{model.trackingReady?'A fictional tracking link would appear here only after the carrier provides it.':'Carrier details can arrive after fulfilment. Do not invent a tracking number or URL.'}</span>
            </div>}
            <p className="cie-customer-email-fineprint">This chilled delivery date is a best estimate. Weather and operating conditions may affect arrival. This is an illustrative message, not a verified live Shopify template.</p>
          </div> : <div className="cie-communication-empty cie-communication-waiting">
            <Clock3 size={25} aria-hidden="true"/>
            <strong>{channel==='eta'?
              !estimateSaved?'ETA write failed':model.stageIndex<2?'Waiting for the five-minute notice':'ETA unavailable'
              :channel==='shipping'?'Waiting for fulfilment':'SMS disabled or not yet scheduled'}</strong>
            <p>{channel==='shipping'
              ?'Shipping confirmation cannot be assumed at payment time. Fulfilment and carrier details happen later.'
              :'Customer dates depend on saved order metadata and separately configured notification behaviour.'}</p>
          </div>}
        </div>
        <div className="cie-communication-observations">
          <span>{channel==='shipping'&&model.nativeTrackingNoticeRequested?'Shopify tracking notification: REQUESTED (illustrative)':
            channel==='eta'&&model.etaNoticeReady?'Five-minute ETA message: REPORTED WORKFLOW':
            channel==='sms'&&model.smsNoticeReady?'SMS content: REPORTED CHANNEL':'No notification delivery confirmed'}</span>
          <small>None of these UI states sends email or SMS, proves inbox delivery, or reads an actual Shopify template.</small>
        </div>
      </section>
    </div>
    <div className="cie-communications-disclosure">
      <ShieldCheck size={19} aria-hidden="true"/>
      <p><strong>Verified Worker:</strong> an <code>orders/create</code> event calculates a postcode-specific ETA and saves typed order metafields; later fulfilment and carrier tracking updates use custom-app authorisation. <strong>Merchant-reported, not verified in the Worker:</strong> the five-minute email delay, email template, SMS sending configuration and message receipts. This illustration intentionally excludes the provided real order, postcode and tracking reference.</p>
    </div>
  </div>;
}
