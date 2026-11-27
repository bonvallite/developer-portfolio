
/** Allowlisted in-process API transport. These routes are fictional aliases,
 * not deployed endpoints. No fetch, arbitrary URLs, user credentials, storage
 * or provider mutations. Inputs are data, never executable code. */
import {buildMetafieldSnapshot,SCHEMA} from './logistics-metafield-demo.mjs';
import {PROFILES} from './logistics-lifecycle-demo.mjs';
import {extractEstimateInputs,resolveExampleZone,gateShipment,normaliseCarrierEvent} from './worker-function-lab.mjs';
import {runSecurityDemo} from './logistics-security-demo.mjs';
const order={reference:'DEMO-001',shipping_address:{zip:'4810'},created_at:'2026-11-27T00:30:00Z'};
const fulfilment={reference:'DEMO-001',profile:'fnq',method:'shipping',items:[{grams:14000,quantity:3,requiresShipping:true,giftCard:false}]};
const tracking={references:{customer:'DEMO-001',numericId:'DEMO-CTN-001'},status:'COLLECTED'};
export const OPERATIONS=[
 {id:'health',method:'GET',path:'/demo/health',auth:'none',label:'Service health',body:{}},
 {id:'install',method:'GET',path:'/demo/install',auth:'none',label:'OAuth installation',body:{}},
 {id:'callback',method:'GET',path:'/demo/auth/callback',auth:'oauth',label:'OAuth callback',body:{}},
 {id:'estimate',method:'POST',path:'/demo/order-estimate',auth:'hmac',label:'Order-created webhook',body:order},
 {id:'fulfilment',method:'POST',path:'/demo/fulfilment',auth:'hmac',label:'Fulfilment webhook',body:fulfilment},
 {id:'tracking',method:'POST',path:'/demo/tracking',auth:'basic',label:'Carrier tracking webhook',body:tracking},
 {id:'retry',method:'POST',path:'/demo/admin/retry',auth:'bearer',label:'Administrative ETA retry',body:order},
 {id:'consignment',method:'POST',path:'/demo/carrier/consignments',auth:'grant',label:'Carrier REST consignment',body:fulfilment},
 {id:'meta',method:'POST',path:'/demo/shopify/graphql',auth:'grant',label:'GraphQL / metafieldsSet',body:{metafields:[{ownerId:'EXAMPLE_ORDER_ID',namespace:'custom',key:'estimated_delivery_date_iso',type:'date',value:'2026-12-03'}]}},
 {id:'trackwrite',method:'POST',path:'/demo/shopify/graphql',auth:'grant',label:'GraphQL / tracking update',body:{fulfillmentId:'EXAMPLE_FULFILMENT_ID',trackingInfoInput:{company:'Demo carrier',number:'DEMO-CTN-001',url:'https://example.com/tracking/demo'},notifyCustomer:true}},
 {id:'event',method:'POST',path:'/demo/shopify/graphql',auth:'grant',label:'GraphQL / fulfilment event',body:{fulfillmentEvent:{fulfillmentId:'EXAMPLE_FULFILMENT_ID',status:'DELIVERED',happenedAt:'2026-12-03T04:00:00Z'}}}
];
export const QUERIES={
 meta:'mutation SetOrderMetafields($metafields: [MetafieldsSetInput!]!) {\n  metafieldsSet(metafields: $metafields) {\n    metafields { namespace key type value }\n    userErrors { field message }\n  }\n}',
 trackwrite:'mutation UpdateTracking($fulfillmentId: ID!, $trackingInfoInput: FulfillmentTrackingInput!, $notifyCustomer: Boolean) {\n  fulfillmentTrackingInfoUpdate(fulfillmentId: $fulfillmentId, trackingInfoInput: $trackingInfoInput, notifyCustomer: $notifyCustomer) {\n    fulfillment { id trackingInfo { number url company } }\n    userErrors { field message }\n  }\n}',
 event:'mutation RecordEvent($fulfillmentEvent: FulfillmentEventInput!) {\n  fulfillmentEventCreate(fulfillmentEvent: $fulfillmentEvent) {\n    fulfillmentEvent { id status happenedAt }\n    userErrors { field message }\n  }\n}'
};
export const FAULTS=[['none','Normal response'],['auth','Reject authentication'],['transport','Upstream unavailable'],['graphql','GraphQL top-level error'],['user','Mutation userErrors']];
const isRecord=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const check=(ok,message)=>{if(!ok)throw new Error(message);};
const reference=v=>typeof v==='string'&&/^DEMO-[A-Z0-9-]{1,40}$/.test(v);
const queryName={meta:'metafieldsSet',trackwrite:'fulfillmentTrackingInfoUpdate',event:'fulfillmentEventCreate'};
/** Model a GraphQL response envelope; validates an illustrative subset, not
 * the Shopify schema. A successful HTTP status is not proof of a write. */
function validateVariables(id,body){
 if(id==='meta'){
  check(Array.isArray(body.metafields)&&body.metafields.length>0&&body.metafields.length<=29,'Supply 1–29 example metafields.');
  for(const f of body.metafields){
   const def=SCHEMA.find(d=>d.key===f?.key);
   check(isRecord(f)&&f.ownerId==='EXAMPLE_ORDER_ID'&&f.namespace==='custom'&&def&&def.type===f.type&&typeof f.value==='string'&&f.value.length<=500,'Invalid example field, owner or type.');
   if(f.type==='date')check(/^\d{4}-\d{2}-\d{2}$/.test(f.value)&&Number.isFinite(+new Date(f.value))&&new Date(f.value).toISOString().slice(0,10)===f.value,'Invalid date value.');
   if(f.type==='boolean')check(['true','false'].includes(f.value),'Boolean values must be strings true or false.');
  }
 }else if(id==='trackwrite'){
  check(body.fulfillmentId==='EXAMPLE_FULFILMENT_ID'&&isRecord(body.trackingInfoInput)&&reference(body.trackingInfoInput.number)&&body.trackingInfoInput.url==='https://example.com/tracking/demo'&&typeof body.notifyCustomer==='boolean','Use the example fulfilment, tracking reference and URL.');
 }else{
  const e=body.fulfillmentEvent;
  check(isRecord(e)&&e.fulfillmentId==='EXAMPLE_FULFILMENT_ID'&&['CONFIRMED','CARRIER_PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED'].includes(e.status)&&typeof e.happenedAt==='string'&&Number.isFinite(+new Date(e.happenedAt)),'Invalid example event.');
 }
}
export async function executeApiDemo({operation='estimate',method='POST',raw='',fault='none'}={}){
 const trace=[];
 const add=(name,status,detail)=>trace.push({id:trace.length+1,name,status,detail});
 const finish=(http,body,accepted=false)=>({http,body,accepted,trace,externalRequests:0,notificationSent:false});
 const op=OPERATIONS.find(o=>o.id===operation);
 if(!op)return finish(404,{error:'UNKNOWN_LOCAL_OPERATION'});
 add('Local router','success',op.method+' '+op.path);
 if(method!==op.method){add('Method guard','failed','Method not allowed');return finish(405,{error:'METHOD_NOT_ALLOWED',allow:op.method});}
 if(!FAULTS.some(f=>f[0]===fault)||(['graphql','user'].includes(fault)&&!queryName[operation]))return finish(400,{error:'FAULT_NOT_APPLICABLE'});
 if(op.auth!=='none'){
  if(op.auth==='grant'){add('Example app grant',fault==='auth'?'failed':'success','Mock authorisation only');if(fault==='auth')return finish(401,{error:'DEMO_GRANT_REJECTED'});}
  else{
   const mode=op.auth==='hmac'?'webhook':op.auth;
   const scenario=fault==='auth'?(mode==='webhook'?'tampered':mode==='oauth'?'state':'invalid'):'valid';
   // Webhook body is signed and checked as raw text before JSON parsing.
   const security=await runSecurityDemo({mode,scenario,body:raw});
   add('Authentication guard',security.accepted?'success':'failed',security.reason);
   if(!security.accepted)return finish(security.http,{error:security.reason});
   if(operation==='callback')return finish(200,{offlineGrantStored:security.credentialStored,steps:security.steps.map(s=>s.title)},true);
  }
 }else if(fault==='auth')return finish(400,{error:'NO_AUTH_GUARD_ON_THIS_ROUTE'});
 if(fault==='transport'){add('Mock upstream','failed','Simulated service unavailable');return finish(503,{error:'MOCK_UPSTREAM_UNAVAILABLE'});}
 if(operation==='health')return finish(200,{ok:true,transport:'in-process',providerRequests:0},true);
 if(operation==='install')return finish(200,{next:'Mock consent screen',stateTtlSeconds:600,redirectPerformed:false},true);
 let body;
 try{check(typeof raw==='string'&&raw.length<=16000,'JSON input is too large.');body=JSON.parse(raw);check(isRecord(body),'Expected JSON object.');}
 catch(e){add('JSON validation','failed',e.message);return finish(400,{error:'INVALID_JSON',message:e.message});}
 add('JSON validation','success','Object parsed locally');
 if(queryName[operation]){
  const name=queryName[operation];
  if(fault==='graphql'){add('GraphQL envelope','failed','Top-level errors');return finish(200,{data:null,errors:[{message:'Simulated GraphQL execution error'}]});}
  try{validateVariables(operation,body);if(fault==='user')throw new Error('Simulated mutation rejection.');}
  catch(e){add('Mutation validation','failed',e.message);return finish(200,{data:{[name]:{userErrors:[{field:['variables'],message:e.message}]}}});}
  add('Mutation validation','success','Example variable checks passed');
  add('Mock write','success','No external state modified');
  const value=operation==='meta'?{metafields:body.metafields}:operation==='trackwrite'?{fulfillment:{id:body.fulfillmentId,trackingInfo:[body.trackingInfoInput]}}:{fulfillmentEvent:{id:'EXAMPLE_EVENT_ID',...body.fulfillmentEvent}};
  return finish(200,{data:{[name]:{...value,userErrors:[]}},mock:true},true);
 }
 try{
  if(operation==='estimate'||operation==='retry'){
   check(reference(body.reference),'Use a fictional order reference.');
   const input=extractEstimateInputs(body),zone=resolveExampleZone(input.postcode);
   if(!zone.matched){add('Zone lookup','skipped',zone.reason);return finish(200,{skipped:true,reason:zone.reason});}
   const snapshot=buildMetafieldSnapshot({profile:zone.profile,orderedAt:input.brisbane.wallClock,closureDate:body.closureDate??''});
   add('Delivery calculation','success',snapshot.eta.rule);add('Build mutation variables','success','Calculated fields; unset keys omitted');
   return finish(200,{reference:body.reference,eta:snapshot.eta,variables:snapshot.variables,mock:true},true);
  }
  if(operation==='fulfilment'||operation==='consignment'){
   check(reference(body.reference),'Use a fictional order reference.');
   const profile=PROFILES.find(p=>p.id===body.profile);check(profile,'Unknown example profile.');
   const shipment=gateShipment(body);
   add('Fulfilment gate',shipment.eligible?'success':'skipped',shipment.reason);
   if(!shipment.eligible)return finish(200,{skipped:true,shipment});
   const consignment={references:{customer:body.reference},warehouse:{id:'DEMO-'+profile.warehouse},details:{shipmentType:'Chilled'},items:[{product:{references:{code:'CTN'}},quantity:shipment.cartons,weight:shipment.physicalWeightKg}]};
   add('Build chilled consignment','success','Example carton allocation');
   return finish(operation==='consignment'?201:200,{shipment,consignment,mock:true},true);
  }
  if(operation==='tracking'){
   const mapped=normaliseCarrierEvent(body);
   add('Status mapping',mapped.eligible?'success':'skipped',mapped.mapped.status);
   if(!mapped.eligible||!mapped.tracking)return finish(200,{skipped:true,reason:!mapped.eligible?'UNMAPPED_STATUS':'MISSING_TRACKING',mapped});
   add('Build Shopify write-back','success','Tracking, event and status updates prepared');
   return finish(200,{mapped,operations:['fulfillmentTrackingInfoUpdate','fulfillmentEventCreate','metafieldsSet'],mock:true},true);
  }
 }catch(e){add('Business validation','failed',e.message);return finish(422,{error:'INVALID_DEMO_INPUT',message:e.message});}
 return finish(404,{error:'UNKNOWN_LOCAL_OPERATION'});
}
