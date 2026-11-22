import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_ZONES, CARRIER_STATUS_MAP, calculateDemoEta,
  calculateDemoShipment, formatDemoDate, mapDemoCarrierStatus
} from '../lib/commerce-integration-demo.mjs';

// These validate ONLY deterministic, public-safe illustrations. They are not
// tests of the private production Worker or an actual carrier delivery promise.
test('five labelled synthetic destinations are available',()=>{
  assert.equal(DEMO_ZONES.length,5);
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
