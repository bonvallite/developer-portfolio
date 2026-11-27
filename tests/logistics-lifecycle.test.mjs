
import test from 'node:test';
import assert from 'node:assert/strict';
import {runLifecycle,schedule} from '../lib/logistics-lifecycle-demo.mjs';
test('Friday long-haul window is computed, not canned',()=>{
 const e=schedule('fnq','2026-11-27T10:30');
 assert.equal(e.dispatchISO,'2026-11-27');assert.equal(e.windowStart,'2026-12-03');assert.equal(e.windowEnd,'2026-12-04');
 assert.equal(schedule('fnq','2026-11-27T12:00').dispatchISO,'2026-12-04');
 assert.equal(schedule('fnq','2026-11-27T10:30','2026-12-01').windowEnd,'2026-12-07');
});
test('normal flow computes cartons and closes the tracking loop',()=>{
 const r=runLifecycle();assert.equal(r.shipment.cartons,3);
 assert.equal(r.events.at(-1).output.label,'Delivered');assert.equal(r.events.at(-1).output.sent,false);
 assert.equal(r.fields.delivery_is_window,'true');
});
test('auth and write failures stop the actual trace',()=>{
 for(const fault of ['signature','postcode','write','carrier']){
  const r=runLifecycle({fault});assert.notEqual(r.events.at(-1).status,'success');
  assert.equal(r.events.some(e=>e.title.startsWith('Carrier scan')),false);
 }
 assert.equal(runLifecycle({fault:'write'}).notice,null);
});
test('non-carrier methods bypass consignments',()=>{
 for(const method of ['pickup','local','giftcard']){
  const r=runLifecycle({method});assert.equal(r.shipment,null);
  assert.equal(r.events.at(-1).status,'skipped');
 }
});
test('notification preview uses email first and never sends',()=>{
 assert.equal(runLifecycle({hasEmail:false,hasPhone:true}).notice.channel,'SMS');
 assert.equal(runLifecycle({hasEmail:false,hasPhone:false}).notice.channel,'No available channel');
 assert.equal(runLifecycle({hasEmail:true,hasPhone:true}).notice.channel,'Email');
});
test('invalid input fails safely',()=>{assert.throws(()=>schedule('fnq','2026-02-30T10:00'));assert.throws(()=>runLifecycle({weight:-1}));});
