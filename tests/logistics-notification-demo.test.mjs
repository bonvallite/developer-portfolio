
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildNotificationDemo,NOTICE_STAGES} from '../lib/logistics-notification-demo.mjs';
test('six stages render fixed Liquid locally without sends',()=>{
 for(const s of NOTICE_STAGES){const r=buildNotificationDemo({stage:s.id});assert.equal(r.ready,true,s.id);assert.ok(r.rendered.includes('DEMO-001'));assert.equal(r.sent,false);assert.equal(r.externalRequests,0);}
});
test('window, single date and actual boolean holiday branches',()=>{
 const fnq=buildNotificationDemo();assert.match(fnq.rendered,/Estimated delivery window:/);assert.doesNotMatch(fnq.rendered,/Holiday notice:/);
 const single=buildNotificationDemo({profile:'nsw'});assert.match(single.rendered,/Estimated delivery:/);assert.doesNotMatch(single.rendered,/Estimated delivery window:/);
 const holiday=buildNotificationDemo({closureDate:'2026-12-01'});assert.match(holiday.rendered,/Holiday notice:/);
});
test('contact fallback and virtual early notice delay',()=>{
 assert.equal(buildNotificationDemo().channel,'Email');
 const sms=buildNotificationDemo({hasEmail:false});assert.equal(sms.channel,'SMS');assert.match(sms.rendered,/Tracking pending/);
 assert.equal(buildNotificationDemo({hasEmail:false,hasPhone:false}).reason,'NO_CONTACT_CHANNEL');
 assert.equal(buildNotificationDemo({minutes:4}).rendered,null);
 assert.equal(buildNotificationDemo({minutes:5}).ready,true);
 assert.equal(buildNotificationDemo({enabled:false}).rendered,null);
});
test('failed writes and missing tracking cannot fabricate stored details',()=>{
 const eta=buildNotificationDemo({etaAccepted:false});assert.match(eta.rendered,/Delivery estimate is not yet available/);assert.equal(eta.etaSaved,false);
 const bad=buildNotificationDemo({stage:'delivered',trackingAccepted:false});assert.equal(bad.ready,false);assert.equal(bad.rendered,null);
 const missing=buildNotificationDemo({stage:'collected',trackingReady:false});assert.match(missing.rendered,/Tracking details are not yet available/);assert.equal(missing.trackingAvailable,false);
 const delivered=buildNotificationDemo({stage:'delivered'});assert.match(delivered.rendered,/Shipment status: Delivered/);assert.match(delivered.rendered,/https:\/\/example\.com\/tracking\/demo/);
});
