
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecoveryState,recoveryTransition} from '../lib/logistics-recovery-demo.mjs';
const apply=(s,...actions)=>actions.reduce(recoveryTransition,s);
const drain=s=>{while(s.cursor<s.inbox.length&&!['waiting','dead'].includes(s.job?.state))s=recoveryTransition(s,'next');return s;};
test('normal lifecycle completes with no repeated booking or mock writes',()=>{
 const s=drain(createRecoveryState('normal'));assert.equal(s.carrierStatus,'DELIVERED');assert.equal(s.commits.length,13);assert.equal(s.ignored,0);
});
test('duplicate ids and second booking for the same fulfilment do not repeat writes',()=>{
 const s=drain(createRecoveryState('duplicate'));assert.equal(s.ignored,3);assert.equal(s.commits.length,13);assert.equal(s.commits.filter(c=>c.operation==='Create consignment').length,1);
});
test('stale status and older timestamp cannot regress or prematurely advance',()=>{
 const s=drain(createRecoveryState('stale'));assert.equal(s.ignored,2);assert.equal(s.carrierStatus,'DELIVERED');assert.equal(s.lastOccurred,40);
});
test('partial success resumes at first unfinished step after virtual backoff',()=>{
 const initial=createRecoveryState('partial');let s=apply(initial,'next','next');
 assert.equal(initial.cursor,0);assert.equal(s.job.state,'waiting');assert.equal(s.job.due,30);assert.equal(s.carrierStatus,null);
 assert.deepEqual(s.job.completed,['fulfillmentTrackingInfoUpdate']);assert.equal(apply(s,'next').cursor,s.cursor);
 s=apply(s,'advance');assert.equal(s.job.state,'complete');assert.equal(s.carrierStatus,'CARRIER_PICKED_UP');
 assert.equal(s.commits.filter(c=>c.eventId==='DEMO-SCAN-1'&&c.operation==='fulfillmentTrackingInfoUpdate').length,1);
});
test('exhaustion follows 30/60 backoff then admin replay preserves checkpoints',()=>{
 let s=apply(createRecoveryState('exhausted'),'next','next','advance');
 assert.equal(s.job.due,90);s=apply(s,'advance');assert.equal(s.job.attempt,2);
 s=apply(s,'advance');assert.equal(s.job.state,'dead');assert.equal(s.job.attempt,3);
 assert.equal(apply(s,'admin').job.state,'dead');s=apply(s,'restore','admin');
 assert.equal(s.job.state,'complete');assert.equal(s.commits.filter(c=>c.eventId==='DEMO-SCAN-1').length,3);
});
test('rejected ETA stays unset until administrative recovery',()=>{
 let s=apply(createRecoveryState('eta'),'next');assert.equal(s.job.state,'dead');assert.equal(s.etaSaved,false);
 s=apply(s,'restore','admin');assert.equal(s.etaSaved,true);assert.ok(s.etaValue);assert.equal(s.bookingCreated,false);
});
