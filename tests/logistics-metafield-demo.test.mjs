
import test from 'node:test';
import assert from 'node:assert/strict';
import {SCHEMA,buildMetafieldSnapshot} from '../lib/logistics-metafield-demo.mjs';
const row=(s,k)=>s.rows.find(r=>r.key===k);
test('29 distinct documented keys; 22 ETA and 7 tracking; six corroborated type examples',()=>{
 assert.equal(SCHEMA.length,29);assert.equal(new Set(SCHEMA.map(f=>f.key)).size,29);
 assert.equal(SCHEMA.filter(f=>f.phase==='eta').length,22);
 assert.equal(SCHEMA.filter(f=>f.typeEvidence==='Existing public reference').length,6);
});
test('no write at creation; dynamic ETA window and unset fee',()=>{
 const c=buildMetafieldSnapshot({stage:'created'});assert.equal(c.variables.metafields.length,0);
 assert.ok(c.rows.every(r=>r.value===null));
 const s=buildMetafieldSnapshot();
 assert.equal(row(s,'delivery_window_start_iso').value,'2026-12-03');
 assert.equal(row(s,'delivery_window_end_iso').value,'2026-12-04');
 assert.equal(row(s,'delivery_fee').value,null);
 assert.ok(s.variables.metafields.every(f=>typeof f.value==='string'&&f.ownerId==='EXAMPLE_ORDER_ID'));
 assert.ok(!s.variables.metafields.some(f=>f.key==='delivery_fee'));
});
test('single-date and closure-dependent keys are conditional',()=>{
 const s=buildMetafieldSnapshot({profile:'nsw'});
 assert.equal(row(s,'delivery_is_window').value,'false');assert.equal(row(s,'delivery_window_start_iso').value,null);
 const h=buildMetafieldSnapshot({closureDate:'2026-12-01'});
 assert.equal(row(h,'delivery_holiday_affected').value,'true');assert.equal(row(h,'delivery_window_end_iso').value,'2026-12-07');
 assert.equal(row(h,'delivery_holiday_date').value,'2026-12-01');
});
test('failed ETA write is not stored and does not prevent independent tracking',()=>{
 const rejected=buildMetafieldSnapshot({etaAccepted:false});
 assert.equal(row(rejected,'estimated_delivery_date').state,'Rejected');assert.equal(rejected.preview.eta,null);
 const delivered=buildMetafieldSnapshot({stage:'delivered',etaAccepted:false});
 assert.equal(delivered.preview.eta,null);assert.equal(delivered.preview.status,'Delivered');
});
test('failed carrier write retains previous milestone; delivered_at only on accepted delivery',()=>{
 const rejected=buildMetafieldSnapshot({stage:'delivered',trackingAccepted:false});
 assert.equal(rejected.preview.status,'Out for delivery');assert.equal(row(rejected,'delivered_at').value,null);
 assert.equal(row(rejected,'delivery_status').state,'Rejected');
 const accepted=buildMetafieldSnapshot({stage:'delivered'});
 assert.equal(accepted.preview.status,'Delivered');assert.ok(row(accepted,'delivered_at').value);
 assert.equal(accepted.preview.sent,false);
});
