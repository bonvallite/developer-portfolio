
/** Proposed reliability design, independently implemented for one fictional
 * order/fulfilment. Pure transitions, no real queue, persistence, provider
 * mutations or distributed exactly-once guarantees. All time is virtual.
 * One active job serialises writes; successful mock steps are checkpointed. */
import {mapDemoCarrierStatus} from './commerce-integration-demo.mjs';
import {buildMetafieldSnapshot} from './logistics-metafield-demo.mjs';
export const RECOVERY_SCENARIOS=[
 {id:'normal',label:'Normal delivery'},
 {id:'duplicate',label:'Duplicate fulfilment and carrier events'},
 {id:'stale',label:'Out-of-order carrier milestone'},
 {id:'partial',label:'Partial Shopify write / transient failure'},
 {id:'exhausted',label:'Retry exhaustion / administrative replay'},
 {id:'eta',label:'ETA write rejected / administrative repair'}
];
const rank={CONFIRMED:0,CARRIER_PICKED_UP:1,IN_TRANSIT:2,OUT_FOR_DELIVERY:3,DELIVERED:4};
const operations={booking:['Create consignment'],tracking:['fulfillmentTrackingInfoUpdate','fulfillmentEventCreate','metafieldsSet'],eta:['metafieldsSet (ETA)']};
const rawFor={collected:'COLLECTED',transit:'IN_TRANSIT_PICKUP_WAREHOUSE',out:'IN_TRANSIT_WAREHOUSE_DELIVERY',delivered:'DELIVERED'};
const event=(id,kind,raw='',occurred=0)=>({id,kind,raw,occurred});
const booking=event('DEMO-BOOK-1','booking');
const collected=event('DEMO-SCAN-1','tracking',rawFor.collected,10);
const transit=event('DEMO-SCAN-2','tracking',rawFor.transit,20);
const out=event('DEMO-SCAN-3','tracking',rawFor.out,30);
const delivered=event('DEMO-SCAN-4','tracking',rawFor.delivered,40);
const eta=event('DEMO-ETA-1','eta');
const fixtures={
 normal:[booking,collected,transit,out,delivered],
 duplicate:[booking,booking,event('DEMO-BOOK-2','booking'),collected,collected,transit,out,delivered],
 stale:[booking,collected,out,transit,event('DEMO-SCAN-5','tracking',rawFor.delivered,15),delivered],
 partial:[booking,collected,transit,out,delivered],
 exhausted:[booking,collected,transit,out,delivered],
 eta:[eta,booking,collected]
};
/** @typedef {{id:string,kind:string,raw:string,occurred:number}} RecoveryEvent */
/** @typedef {{event:RecoveryEvent,mapped:string|null,attempt:number,completed:string[],state:string,due:number|null}} RecoveryJob */
/** @typedef {{scenario:string,now:number,inbox:RecoveryEvent[],cursor:number,seen:string[],bookingCreated:boolean,carrierStatus:string|null,lastOccurred:number|null,etaSaved:boolean,etaValue:string|null,job:RecoveryJob|null,log:{id:number,at:number,title:string,detail:string,status:string}[],commits:{eventId:string,operation:string,at:number}[],ignored:number,incidentCount:number,faultEnabled:boolean}} RecoveryState */
/** Explicit state contract prevents null/empty-array inference at the React boundary.
 * @returns {RecoveryState}
 */
export function createRecoveryState(scenario='partial'){
 if(!Object.hasOwn(fixtures,scenario))throw new Error('Unknown recovery scenario.');
 return {scenario,now:0,inbox:fixtures[scenario].map(e=>({...e})),cursor:0,seen:[],bookingCreated:false,carrierStatus:null,lastOccurred:null,etaSaved:false,etaValue:null,job:null,log:[],commits:[],ignored:0,incidentCount:0,faultEnabled:['partial','exhausted','eta'].includes(scenario)};
}
function log(s,title,detail,status='success'){
 s.log.push({id:s.log.length+1,at:s.now,title,detail,status});
}
function active(s){return s.job&&['waiting','dead'].includes(s.job.state);}
function finishJob(s,j){
 if(j.event.kind==='booking')s.bookingCreated=true;
 if(j.event.kind==='tracking'){s.carrierStatus=j.mapped;s.lastOccurred=j.event.occurred;}
 if(j.event.kind==='eta'){const snapshot=buildMetafieldSnapshot({stage:'eta'});s.etaSaved=true;s.etaValue=snapshot.preview.eta;}
 s.seen.push(j.event.id);s.job={...j,state:'complete',due:null};
 log(s,'Commit local checkpoint','Event '+j.event.id+' completed; no actual provider write.');
}
function execute(s){
 const j=s.job;
 j.attempt++;
 const list=operations[j.event.kind];
 while(j.completed.length<list.length){
  const op=list[j.completed.length];
  const failing=s.faultEnabled&&((s.scenario==='partial'&&j.event.id===collected.id&&op==='fulfillmentEventCreate'&&j.attempt===1)||(s.scenario==='exhausted'&&j.event.id===collected.id&&op==='metafieldsSet')||(s.scenario==='eta'&&j.event.kind==='eta'));
  if(failing){
   s.incidentCount++;
   const permanent=s.scenario==='eta';
   if(permanent||j.attempt>=3){j.state='dead';j.due=null;log(s,'Dead-letter incident',op+(permanent?' · simulated mutation userErrors':' · retry limit reached'),'failed');}
   else{j.state='waiting';j.due=s.now+30*2**(j.attempt-1);log(s,'Retry scheduled',op+' · simulated 503 · due at T+'+j.due+'s','failed');}
   return;
  }
  j.completed.push(op);
  s.commits.push({eventId:j.event.id,operation:op,at:s.now});
  log(s,'Operation checkpoint',op+' accepted locally');
 }
 finishJob(s,j);
}
/** Every action returns a new state. Inbox delivery is deliberately serial;
 * retries keep the same event ID and completed-step list. In production,
 * durable atomic claims, provider reconciliation and concurrency tests matter. */
/** @param {RecoveryState} state
 * @param {string} action
 * @returns {RecoveryState}
 */
export function recoveryTransition(state,action){
 const s=structuredClone(state);
 const ignore=(detail)=>{s.ignored++;log(s,'Event ignored',detail,'skipped');};
 if(action==='restore'){s.faultEnabled=false;log(s,'Upstream restored','Disable the selected fictional fault.');return s;}
 if(action==='advance'){
  s.now+=30;log(s,'Virtual clock advanced','T+'+s.now+' seconds');
  if(s.job?.state==='waiting'&&s.now>=s.job.due)execute(s);
  return s;
 }
 if(action==='admin'){
  if(s.job?.state!=='dead')return s;
  if(s.faultEnabled){log(s,'Recovery blocked','Restore the fictional upstream or correct the rejected input first.','skipped');return s;}
  s.job.state='waiting';s.job.attempt=0;s.job.due=s.now;
  log(s,'Administrative replay','Reuse the same event and completed-step checkpoints.');
  execute(s);return s;
 }
 if(action!=='next'||active(s)||s.cursor>=s.inbox.length)return s;
 const e=s.inbox[s.cursor++];
 log(s,'Event received',e.id+' · '+e.kind);
 if(s.seen.includes(e.id)){ignore('Duplicate event ID '+e.id);return s;}
 if(e.kind==='booking'&&s.bookingCreated){s.seen.push(e.id);ignore('Existing consignment for this fictional fulfilment');return s;}
 let mapped=null;
 if(e.kind==='tracking'){
  if(!s.bookingCreated){ignore('No local consignment');return s;}
  mapped=mapDemoCarrierStatus(e.raw).status;
  if(!Object.hasOwn(rank,mapped)){ignore('Unmapped status');return s;}
  if(s.carrierStatus!==null&&(rank[mapped]<=rank[s.carrierStatus]||e.occurred<s.lastOccurred)){
   s.seen.push(e.id);ignore('Stale or non-advancing milestone '+mapped);return s;
  }
 }
 s.job={event:e,mapped,attempt:0,completed:[],state:'running',due:null};
 execute(s);return s;
}
