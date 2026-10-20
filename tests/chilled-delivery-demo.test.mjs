import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateChilledDelivery, DEMO_ZONES } from '../lib/chilled-delivery-demo.mjs';

test('supports only four fictional example postcodes', () => {
 assert.equal(DEMO_ZONES.length,4);
 assert.equal(estimateChilledDelivery({postcode:'9999',orderDate:'2026-10-20'}).status,'unknown');
 assert.equal(estimateChilledDelivery({postcode:'400',orderDate:'2026-10-20'}).status,'invalid');
});

test('illustrative weekends move transit but doorstep stays on configured day', () => {
 const result=estimateChilledDelivery({postcode:'3000',orderDate:'2026-10-22',basketCents:10000});
 assert.equal(result.status,'sample');
 assert.equal(result.dispatchDate,'2026-10-26');
 assert.equal(result.carrierArrivalDate,'2026-10-28');
 assert.equal(result.deliveryDate,'2026-10-29');
 assert.equal(result.sampleFeeCents,1800);
});

test('fictional free-shipping threshold changes demo display only', () => {
 const result=estimateChilledDelivery({postcode:'4000',orderDate:'2026-10-20',basketCents:25000});
 assert.equal(result.sampleFeeCents,0);
 assert.equal(result.deliveryDate,'2026-10-22');
});

test('blank date returns validation result', () => {
 assert.equal(estimateChilledDelivery({postcode:'2000',orderDate:''}).status,'invalid');
});
