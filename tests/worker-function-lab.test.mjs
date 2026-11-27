
import test from 'node:test';
import assert from 'node:assert/strict';
import {FUNCTIONS,executeFunction} from '../lib/worker-function-lab.mjs';
const run=(id,value)=>executeFunction(id,JSON.stringify(value));
test('every function has a runnable normal fixture',()=>{
 assert.equal(FUNCTIONS.length,11);
 for(const f of FUNCTIONS)assert.equal(run(f.id,f.example).ok,true,f.id);
});
test('postcode normalisation preserves leading zeroes and rejects letters',()=>{
 assert.equal(run('postcode',{postcode:800}).result.postcode,'0800');
 assert.equal(run('postcode',{postcode:'48A0'}).ok,false);
 assert.equal(run('zone',{postcode:'9999'}).result.matched,false);
});
test('Brisbane cut-off crosses noon correctly',()=>{
 assert.equal(run('timezone',{timestamp:'2026-11-27T01:59:00Z'}).result.beforeNoon,true);
 assert.equal(run('timezone',{timestamp:'2026-11-27T02:00:00Z'}).result.beforeNoon,false);
});
test('actual schedule and closure difference',()=>{
 assert.equal(run('schedule',{profile:'fnq',orderedAt:'2026-11-27T12:00'}).result.dispatchISO,'2026-12-04');
 assert.equal(run('holiday',FUNCTIONS.find(f=>f.id==='holiday').example).result.affected,true);
 assert.equal(run('holiday',FUNCTIONS.find(f=>f.id==='holiday').edge).result.affected,false);
});
test('gift card exclusion and non-carrier gate',()=>{
 const f=FUNCTIONS.find(f=>f.id==='fulfilment');
 assert.equal(run(f.id,f.example).result.cartons,3);
 assert.equal(run(f.id,f.example).result.excludedItems,1);
 assert.equal(run(f.id,f.edge).result.cartons,0);
});
test('carrier mapping and GraphQL userErrors are not transport success',()=>{
 const c=FUNCTIONS.find(f=>f.id==='carrier'),w=FUNCTIONS.find(f=>f.id==='write');
 assert.equal(run(c.id,c.example).result.mapped.status,'CARRIER_PICKED_UP');
 assert.equal(run(c.id,c.edge).result.eligible,false);
 assert.equal(run(w.id,w.edge).result.accepted,false);
 assert.equal(run(w.id,w.edge).result.reason,'MUTATION_USER_ERRORS');
});
test('allowlist and JSON limits prevent arbitrary execution',()=>{
 assert.equal(executeFunction('missing','{}').ok,false);
 assert.equal(executeFunction('postcode','not JSON').ok,false);
 assert.equal(executeFunction('postcode','[]').ok,false);
 assert.equal(executeFunction('postcode',' '.repeat(16001)).ok,false);
 const f=FUNCTIONS.find(f=>f.id==='trace');
 const trace=run(f.id,f.edge).result.events;
 assert.equal(trace.at(-1).status,'failed');
});
