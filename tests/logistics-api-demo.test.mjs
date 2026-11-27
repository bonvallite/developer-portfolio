
import test from 'node:test';
import assert from 'node:assert/strict';
import {OPERATIONS,executeApiDemo} from '../lib/logistics-api-demo.mjs';
const run=(operation,overrides={})=>{const op=OPERATIONS.find(o=>o.id===operation);return executeApiDemo({operation,method:op.method,raw:JSON.stringify(op.body),...overrides});};
test('all eleven operation fixtures execute without external calls',async()=>{
 assert.equal(OPERATIONS.length,11);
 for(const op of OPERATIONS){const r=await run(op.id);assert.equal(r.accepted,true,op.id);assert.equal(r.externalRequests,0);assert.equal(r.notificationSent,false);}
});
test('ETA and carton outputs derive from shared engine',async()=>{
 const r=await run('estimate');assert.equal(r.body.eta.windowEnd,'2026-12-04');
 const c=await run('consignment');assert.equal(c.http,201);assert.equal(c.body.shipment.cartons,3);
});
test('auth precedes parsing and business execution',async()=>{
 const r=await run('estimate',{raw:'{',fault:'auth'});assert.equal(r.http,401);assert.ok(!r.trace.some(s=>s.name==='JSON validation'));
 assert.equal((await run('estimate',{raw:'{'})).http,400);
 assert.equal((await run('estimate',{method:'GET'})).http,405);
 assert.equal((await run('fulfilment',{fault:'transport'})).http,503);
});
test('non-carrier and unsupported status produce skips',async()=>{
 const f=OPERATIONS.find(o=>o.id==='fulfilment').body;
 const p=await run('fulfilment',{raw:JSON.stringify({...f,method:'pickup'})});assert.equal(p.body.skipped,true);
 const t=OPERATIONS.find(o=>o.id==='tracking').body;
 const r=await run('tracking',{raw:JSON.stringify({...t,status:'UNKNOWN'})});assert.equal(r.body.skipped,true);
});
test('GraphQL HTTP 200 is not sufficient for successful mutation',async()=>{
 const g=await run('meta',{fault:'graphql'});assert.equal(g.http,200);assert.equal(g.accepted,false);assert.ok(g.body.errors.length);
 const u=await run('meta',{fault:'user'});assert.equal(u.http,200);assert.equal(u.accepted,false);assert.ok(u.body.data.metafieldsSet.userErrors.length);
 const invalid=await run('meta',{raw:JSON.stringify({metafields:[{ownerId:'OTHER'}]})});assert.equal(invalid.accepted,false);
 assert.equal((await executeApiDemo({operation:'https://example.com'})).http,404);
});
