import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_ZONES, CARRIER_STATUS_MAP, calculateDemoEta,
  calculateDemoShipment, formatDemoDate, mapDemoCarrierStatus,
  DEMO_COMMUNICATION_STAGES, calculateDemoCommunication
} from '../lib/commerce-integration-demo.mjs';

// These validate ONLY deterministic, public-safe illustrations. They are not
// tests of the private production Worker or an actual carrier delivery promise.
test('seven labelled synthetic destinations are available',()=>{
  assert.equal(DEMO_ZONES.length,7);
  assert.equal(DEMO_ZONES.find(zone=>zone.id==='sa').state,'SA');
});
test('QLD weekday example uses the next-day delivery window',()=>{
  const result=calculateDemoEta({zoneId:'qld',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.dispatchISO,'2026-11-23');
  assert.equal(result.deliveryISO,'2026-11-24');
});
test('VIC Monday uses four destination business days',()=>{
  const result=calculateDemoEta({zoneId:'vic',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.dispatchISO,'2026-11-23');
  assert.equal(result.deliveryISO,'2026-11-27');
});
test('NSW Tuesday follows the three-business-day rule',()=>{
  const result=calculateDemoEta({zoneId:'nsw',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.dispatchISO,'2026-11-24');
  assert.equal(result.deliveryISO,'2026-11-27');
});
test('NSW late cutoff falls to Friday dispatch and Monday delivery',()=>{
  const result=calculateDemoEta({zoneId:'nsw',orderedAt:'2026-11-24T12:00'});
  assert.equal(result.dispatchISO,'2026-11-27');
  assert.equal(result.deliveryISO,'2026-11-30');
});
test('VIC Friday delivers the next Tuesday',()=>{
  const result=calculateDemoEta({zoneId:'vic',orderedAt:'2026-11-27T10:00'});
  assert.equal(result.dispatchISO,'2026-11-27');
  assert.equal(result.deliveryISO,'2026-12-01');
});
test('ACT waits for the configured route day after transit',()=>{
  const result=calculateDemoEta({zoneId:'act',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.deliveryISO,'2026-11-27');
});
test('SA shows Thursday production, Friday dispatch and Tuesday delivery',()=>{
  const result=calculateDemoEta({zoneId:'sa',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.productionISO,'2026-11-26');
  assert.equal(result.dispatchISO,'2026-11-27');
  assert.equal(result.deliveryISO,'2026-12-01');
});
test('fictional closure shifts the SA production slot',()=>{
  const result=calculateDemoEta({zoneId:'sa',orderedAt:'2026-11-23T10:00',closureDate:'2026-11-26'});
  assert.equal(result.productionISO,'2026-12-03');
  assert.equal(result.dispatchISO,'2026-12-04');
  assert.equal(result.deliveryISO,'2026-12-08');
});
test('validates date/time input rather than silently changing invalid dates',()=>{
  assert.throws(()=>calculateDemoEta({orderedAt:'2026-02-30T10:00'}),/invalid/);
});
test('physical order weight determines cartons, excluding digital items',()=>{
  const result=calculateDemoShipment({items:[
    {grams:7000,quantity:2,requiresShipping:true},
    {grams:4000,quantity:2,requiresShipping:true},
    {grams:0,quantity:1,requiresShipping:false}
  ]});
  assert.equal(result.weightKg,22);
  assert.equal(result.cartons,2);
  assert.equal(result.excludedItems,1);
});
test('non-shipping only orders are ineligible for consignment creation',()=>{
  const result=calculateDemoShipment({items:[{grams:0,quantity:1,requiresShipping:false}]});
  assert.equal(result.eligible,false);
  assert.equal(result.cartons,0);
});
test('carrier mapping distinguishes collection and actual delivery',()=>{
  assert.equal(mapDemoCarrierStatus('awaiting dropoff').status,'CONFIRMED');
  assert.equal(mapDemoCarrierStatus('COLLECTED').status,'CARRIER_PICKED_UP');
  assert.equal(mapDemoCarrierStatus('DELIVERED').status,'DELIVERED');
  assert.equal(mapDemoCarrierStatus('a new state').status,'UNMAPPED');
  assert.ok(Object.keys(CARRIER_STATUS_MAP).length>=6);
});
test('readable calendar values are stable across environments',()=>{
  assert.match(formatDemoDate('2026-11-27'),/27 Nov 2026/);
});

test('fictional QLD postcode zones share transit but differ by last-mile route calendar',()=>{
  const base={orderedAt:'2026-11-23T10:00'};
  const weekday=calculateDemoEta({...base,zoneId:'qld'});
  const wednesday=calculateDemoEta({...base,zoneId:'qld-wed'});
  const monThu=calculateDemoEta({...base,zoneId:'qld-mon-thu'});
  assert.equal(weekday.dispatchISO,'2026-11-23');
  assert.equal(weekday.transitReadyISO,'2026-11-24');
  assert.equal(weekday.deliveryISO,'2026-11-24');
  assert.equal(weekday.routeWaitDays,0);
  assert.equal(wednesday.dispatchISO,weekday.dispatchISO);
  assert.equal(wednesday.transitReadyISO,weekday.transitReadyISO);
  assert.equal(wednesday.deliveryISO,'2026-11-25');
  assert.equal(wednesday.routeWaitDays,1);
  assert.deepEqual(wednesday.deliveryWeekdays,[3]);
  assert.equal(monThu.deliveryISO,'2026-11-26');
  assert.equal(monThu.routeWaitDays,2);
  assert.equal(monThu.deliveryMode,'route');
  assert.equal(monThu.lastMileISO,monThu.deliveryISO);
});
test('fictional destination closure skips last-mile service rather than adding a second transit leg',()=>{
  const eta=calculateDemoEta({zoneId:'qld-mon-thu',orderedAt:'2026-11-23T10:00',closureDate:'2026-11-26'});
  assert.equal(eta.transitReadyISO,'2026-11-24');
  assert.equal(eta.deliveryISO,'2026-11-30');
  assert.equal(eta.lastMileISO,'2026-11-30');
  assert.equal(eta.routeWaitDays,6);
});
test('NSW VIC exceptions do not pretend to have a separate route calendar stage',()=>{
  for(const zoneId of ['nsw','vic']){
    const result=calculateDemoEta({zoneId,orderedAt:'2026-11-23T10:00'});
    assert.equal(result.deliveryMode,'state-dispatch-rule');
    assert.equal(result.transitReadyISO,null);
    assert.equal(result.routeWaitDays,null);
  }
});
test('special South Australia schedule remains separate from route-mode calculation',()=>{
  const result=calculateDemoEta({zoneId:'sa',orderedAt:'2026-11-23T10:00'});
  assert.equal(result.deliveryMode,'special-schedule');
  assert.equal(result.transitReadyISO,null);
});


// 23 Nov 2026: Shopify notification destination is selected from available
// order contact details. Email wins when present; SMS only if email is missing
// and a phone is available. This is merchant-reported behaviour (not a
// verified Worker sending routine) and has no Klaviyo or SMS-provider calls.
test('order-created demo shows no ETA fields or messages before Worker save',()=>{
  const x=calculateDemoCommunication({stage:'order'});
  assert.equal(x.estimateSaved,false);
  assert.deepEqual(x.orderMetafields,[]);
  assert.equal(x.etaNoticeReady,false);
  assert.equal(x.shippingConfirmationReady,false);
  assert.equal(x.trackingReference,null);
  assert.equal(x.notificationChannel,'email');
  assert.equal(x.smsNoticeReady,false);
});
test('Worker ETA appears as typed Shopify order metafields, not a metaobject',()=>{
  const x=calculateDemoCommunication({stage:'saved',zoneId:'qld-wed'});
  const fields=Object.fromEntries(x.orderMetafields.map(item=>[item.key,item]));
  assert.equal(x.estimateSaved,true);
  assert.equal(x.eta.deliveryISO,'2026-11-25');
  assert.equal(fields['custom.estimated_delivery_date_iso'].value,'2026-11-25');
  assert.equal(fields['custom.estimated_delivery_date_iso'].type,'date');
  assert.equal(fields['custom.estimated_delivery_date'].type,'single_line_text_field');
  assert.equal(fields['custom.delivery_zone'].value,x.eta.zoneLabel);
  assert.equal(fields['custom.delivery_postcode'].value,'DEMO-W');
  assert.equal(fields['custom.delivery_breakdown'].type,'multi_line_text_field');
  assert.equal(x.etaNoticeReady,false,'a saved ETA is not a sent notification');
});
test('Shopify email takes priority when email and mobile contact both exist',()=>{
  const x=calculateDemoCommunication({stage:'eta-notice',hasEmail:true,hasPhone:true,trackingReady:true});
  assert.equal(DEMO_COMMUNICATION_STAGES[2].offset,'T+5 min reported');
  assert.equal(x.notificationChannel,'email');
  assert.equal(x.etaNoticeReady,true);
  assert.equal(x.emailNoticeReady,true);
  assert.equal(x.smsNoticeReady,false,'SMS is not an independent channel');
  assert.equal(x.trackingReady,false,'tracking may arrive after the five-minute notice');
  assert.equal(x.trackingReference,null);
  assert.equal(x.nativeTrackingNoticeRequested,false);
  assert.equal(x.shippingConfirmationReady,false);
});
test('Shopify SMS is fallback only when order email is absent and mobile exists',()=>{
  const x=calculateDemoCommunication({stage:'eta-notice',hasEmail:false,hasPhone:true});
  assert.equal(x.notificationChannel,'sms');
  assert.equal(x.etaNoticeReady,true);
  assert.equal(x.smsNoticeReady,true);
  assert.equal(x.emailNoticeReady,false);
  const shipping=calculateDemoCommunication({stage:'fulfilled',hasEmail:false,hasPhone:true,trackingReady:true});
  assert.equal(shipping.shippingConfirmationReady,true);
  assert.equal(shipping.notificationChannel,'sms');
  assert.equal(shipping.trackingReady,true);
});
test('without either contact field do not invent an SMS or email recipient',()=>{
  const eta=calculateDemoCommunication({stage:'eta-notice',hasEmail:false,hasPhone:false});
  assert.equal(eta.notificationChannel,'none');
  assert.equal(eta.etaNoticeReady,false);
  assert.equal(eta.smsNoticeReady,false);
  assert.equal(eta.emailNoticeReady,false);
  const shipping=calculateDemoCommunication({stage:'fulfilled',hasEmail:false,hasPhone:false});
  assert.equal(shipping.shippingConfirmationReady,false);
  assert.equal(shipping.trackingReady,true,'tracking data can exist without a notification recipient');
});
test('fulfilment and carrier response can expose tracking but do not prove receipt',()=>{
  const x=calculateDemoCommunication({stage:'fulfilled',trackingReady:true});
  assert.equal(x.shippingConfirmationReady,true);
  assert.equal(x.trackingReady,true);
  assert.equal(x.trackingReference,'DEMO-TRACK-041');
  assert.equal(x.nativeTrackingNoticeRequested,true);
  assert.equal(x.isIllustrative,true);
});
test('missing carrier tracking cannot be fabricated in a shipping confirmation',()=>{
  const x=calculateDemoCommunication({stage:'fulfilled',trackingReady:false});
  assert.equal(x.shippingConfirmationReady,true);
  assert.equal(x.trackingReady,false);
  assert.equal(x.trackingReference,null);
  assert.equal(x.nativeTrackingNoticeRequested,false);
});
test('failed ETA write blocks the five-minute email or fallback SMS, but not fulfilment',()=>{
  for(const hasEmail of [false,true]){
    const eta=calculateDemoCommunication({stage:'eta-notice',estimateSaved:false,hasEmail,hasPhone:true});
    assert.deepEqual(eta.orderMetafields,[]);
    assert.equal(eta.etaNoticeReady,false);
    assert.equal(eta.smsNoticeReady,false);
    assert.equal(eta.emailNoticeReady,false);
  }
  const shipped=calculateDemoCommunication({stage:'fulfilled',estimateSaved:false,trackingReady:true});
  assert.equal(shipped.shippingConfirmationReady,true);
  assert.equal(shipped.trackingReady,true);
  assert.deepEqual(shipped.orderMetafields,[]);
});
test('phone availability does not send SMS when a usable email exists',()=>{
  const withPhone=calculateDemoCommunication({stage:'eta-notice',hasEmail:true,hasPhone:true});
  const withoutPhone=calculateDemoCommunication({stage:'eta-notice',hasEmail:true,hasPhone:false});
  assert.equal(withPhone.notificationChannel,'email');
  assert.equal(withoutPhone.notificationChannel,'email');
  assert.equal(withoutPhone.smsNoticeReady,false);
});
test('unknown stages and zones are rejected without real message delivery',()=>{
  assert.throws(()=>calculateDemoCommunication({stage:'unknown'}),/Unknown demonstration/);
  assert.throws(()=>calculateDemoCommunication({zoneId:'secret-zone'}),/Unknown demonstration delivery/);
});
