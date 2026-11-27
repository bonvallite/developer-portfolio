
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFreightJourney} from '../lib/logistics-freight-demo.mjs';
test('carton allocation conserves physical weight within illustrative capacity',()=>{
 for(const weight of [1,20,21,42,200]){
  const r=buildFreightJourney({weight});
  assert.equal(r.cartons.length,Math.ceil(weight/20));assert.equal(r.cartons.reduce((n,c)=>n+c.kg,0),weight);
  assert.ok(r.cartons.every(c=>c.kg>0&&c.kg<=20));
 }
});
test('normal freight trace connects physical milestones to digital writes',()=>{
 const r=buildFreightJourney();assert.equal(r.steps.length,9);assert.equal(r.warehouse,'QLD');
 assert.equal(r.steps.at(-1).id,'delivered');
 const final=r.steps.at(-1).events;
 assert.equal(final[0].input.status,'DELIVERED');assert.equal(final.at(-1).output.sent,false);
 assert.ok(final.some(e=>e.title==='Shopify tracking write-back'));
});
test('carrier rejection stops before physical handover and no reference is created',()=>{
 const r=buildFreightJourney({fault:'carrier'});
 assert.equal(r.steps.at(-1).id,'consignment');assert.equal(r.steps.at(-1).status,'failed');
 assert.equal(r.reference,null);assert.ok(r.steps.every(s=>s.position===0));
});
test('non-carrier and zero-weight methods skip freight entirely',()=>{
 for(const input of [{method:'pickup'},{method:'local'},{method:'giftcard'},{weight:0}]){
  const r=buildFreightJourney(input);assert.equal(r.cartons.length,0);assert.equal(r.reference,null);
  assert.equal(r.steps.at(-1).id,'bypass');assert.ok(r.steps.every(s=>s.position===0));
 }
});
test('regional allocation and validation reuse the shared profile',()=>{
 assert.equal(buildFreightJourney({profile:'sa'}).warehouse,'MEL');assert.equal(buildFreightJourney({profile:'nsw'}).warehouse,'SYD');
 assert.throws(()=>buildFreightJourney({weight:201}));assert.throws(()=>buildFreightJourney({profile:'unknown'}));
});
