
/** Independent educational functions; no provider requests, real credentials,
 * private configuration, or dynamic code execution. The dispatcher only calls
 * a fixed allowlist. JSON data is validated before reaching the shared engine. */
import {PROFILES,schedule,runLifecycle} from './logistics-lifecycle-demo.mjs';
import {calculateDemoShipment,mapDemoCarrierStatus} from './commerce-integration-demo.mjs';
const record=(v)=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const requireValue=(condition,message)=>{if(!condition)throw new Error(message);};
const text=(v,name)=>{requireValue(typeof v==='string'&&v.length<=500,name+' must be a string (up to 500 characters).');return v;};
const profile=(v)=>{requireValue(PROFILES.some(p=>p.id===v),'Select a known example profile.');return v;};
export function normalisePostcode(value){
 const raw=typeof value==='number'&&Number.isInteger(value)?String(value):text(value,'Postcode').trim();
 requireValue(/^\d{1,4}$/.test(raw),'Use one to four digits.');
 return raw.padStart(4,'0');
}
export function resolveExampleZone(value){
 const postcode=normalisePostcode(value),match=PROFILES.find(p=>p.postcode===postcode);
 return {postcode,matched:Boolean(match),profile:match?.id??null,reason:match?'EXAMPLE_MATCH':'NOT_IN_DEMO_TABLE'};
}
export function extractEstimateInputs(order){
 requireValue(record(order)&&record(order.shipping_address),'Supply an order with shipping_address.');
 const postcode=normalisePostcode(order.shipping_address.zip);
 const orderedAt=text(order.created_at,'created_at');
 requireValue(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(orderedAt),'Supply ISO timestamp with explicit offset.');
 const wallClock=brisbaneWallClock(orderedAt);
 return {postcode,orderedAt,brisbane:wallClock};
}
export function brisbaneWallClock(timestamp){
 const iso=text(timestamp,'Timestamp');
 requireValue(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(iso),'Use ISO time with an explicit offset.');
 const d=new Date(iso);requireValue(Number.isFinite(+d),'Invalid timestamp.');
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Brisbane',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d);
 const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
 return {wallClock:p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute,zone:'Australia/Brisbane',beforeNoon:Number(p.hour)<12};
}
export function compareClosure(input){
 const p=profile(input.profile),at=text(input.orderedAt,'Order time'),closure=text(input.closureDate??'','Closure');
 const baseline=schedule(p,at),adjusted=schedule(p,at,closure);
 return {baseline,adjusted,affected:['dispatchISO','windowStart','windowEnd'].some(k=>baseline[k]!==adjusted[k])};
}
export function gateShipment(input){
 requireValue(['shipping','pickup','local','giftcard'].includes(input.method),'Unknown fulfilment method.');
 requireValue(Array.isArray(input.items)&&input.items.length<=100,'Supply up to 100 items.');
 for(const item of input.items){
  requireValue(record(item)&&typeof item.requiresShipping==='boolean'&&typeof item.giftCard==='boolean','Items need shipping and gift-card flags.');
  requireValue(Number.isFinite(item.grams)&&item.grams>=0&&item.grams<=200000&&Number.isInteger(item.quantity)&&item.quantity>=0&&item.quantity<=100,'Invalid item weight or quantity.');
 }
 const shipment=calculateDemoShipment({items:input.items});
 const eligible=input.method==='shipping'&&shipment.weightKg>0&&shipment.eligible;
 return {eligible,method:input.method,physicalWeightKg:shipment.weightKg,cartons:eligible?shipment.cartons:0,excludedItems:shipment.excludedItems,reason:eligible?'ELIGIBLE_FREIGHT':'NON_CARRIER_OR_EMPTY'};
}
export function normaliseCarrierEvent(input){
 requireValue(record(input),'Supply a carrier event object.');
 const event=record(input.data)?input.data:input;
 requireValue(record(event.references),'Missing references object.');
 const reference=text(event.references.customer,'Reference');
 requireValue(/^DEMO-[A-Z0-9-]{1,40}$/.test(reference),'Use a fictional DEMO reference.');
 const raw=text(event.status,'Status');
 const mapped=mapDemoCarrierStatus(raw);
 const tracking=event.references.numericId==null?null:text(event.references.numericId,'Tracking reference');
 requireValue(!tracking||/^DEMO-[A-Z0-9-]{1,40}$/.test(tracking),'Use a fictional tracking reference.');
 return {reference,tracking,raw,mapped,eligible:mapped.status!=='UNMAPPED'};
}
export function inspectWriteResponse(input){
 requireValue(Number.isInteger(input.http)&&input.http>=100&&input.http<=599,'Invalid HTTP status.');
 requireValue(Array.isArray(input.errors)&&Array.isArray(input.userErrors),'Supply errors and userErrors arrays.');
 const accepted=input.http>=200&&input.http<300&&input.errors.length===0&&input.userErrors.length===0&&input.dataPresent===true;
 return {accepted,reason:accepted?'MOCK_WRITE_ACCEPTED':input.http<200||input.http>=300?'HTTP_FAILURE':input.errors.length?'GRAPHQL_ERRORS':input.userErrors.length?'MUTATION_USER_ERRORS':'NO_DATA',notificationSent:false};
}
// Fixed descriptors provide valid and adversarial examples. Snippets are
// deliberately short explanatory extracts, not a byte-for-byte production source.
export const FUNCTIONS=[
 {id:'extract',group:'Request ingress',name:'extractEstimateInputs',purpose:'Read a fictional Shopify order and isolate only the schedule inputs.',example:{shipping_address:{zip:'4810'},created_at:'2026-11-27T00:30:00Z'},edge:{shipping_address:{zip:'ABC'},created_at:'2026-11-27T00:30:00Z'},code:'const postcode = normalisePostcode(order.shipping_address.zip);\nconst brisbane = brisbaneWallClock(order.created_at);\nreturn { postcode, brisbane };',execute:extractEstimateInputs},
 {id:'postcode',group:'Delivery engine',name:'normalisePostcode',purpose:'Preserve leading zeroes and reject non-numeric postcodes.',example:{postcode:800},edge:{postcode:'48A0'},code:'if (!/^\\d{1,4}$/.test(raw)) throw new Error(...);\nreturn raw.padStart(4, "0");',execute:i=>({postcode:normalisePostcode(i.postcode)})},
 {id:'zone',group:'Delivery engine',name:'resolveExampleZone',purpose:'Lookup a limited public demonstration profile; absence is not evidence of real delivery coverage.',example:{postcode:'4810'},edge:{postcode:'9999'},code:'const postcode = normalisePostcode(value);\nconst match = PROFILES.find(p => p.postcode === postcode);\nreturn { postcode, matched: Boolean(match) };',execute:i=>resolveExampleZone(i.postcode)},
 {id:'timezone',group:'Delivery engine',name:'brisbaneWallClock',purpose:'Convert an offset-aware timestamp to Brisbane wall-clock time without browser timezone drift.',example:{timestamp:'2026-11-27T01:59:00Z'},edge:{timestamp:'2026-11-27T02:00:00Z'},code:'const parts = new Intl.DateTimeFormat("en-CA", {\n  timeZone: "Australia/Brisbane", hourCycle: "h23", ...options\n}).formatToParts(date);\nreturn { wallClock, beforeNoon: hour < 12 };',execute:i=>brisbaneWallClock(i.timestamp)},
 {id:'schedule',group:'Delivery engine',name:'schedule',purpose:'Reuse the lifecycle engine to compute dispatch and the delivery window for a selected example profile.',example:{profile:'fnq',orderedAt:'2026-11-27T11:59',closureDate:''},edge:{profile:'fnq',orderedAt:'2026-11-27T12:00',closureDate:''},code:'if (orderHour >= 12) advanceToNextDay();\nwhile (!eligibleFriday(dispatch)) advanceDay();\nreturn { windowStart: businessDays(dispatch, 4),\n         windowEnd: businessDays(dispatch, 5) };',execute:i=>schedule(profile(i.profile),text(i.orderedAt,'Order time'),text(i.closureDate??'','Closure'))},
 {id:'holiday',group:'Delivery engine',name:'compareClosure',purpose:'Compare two actual model calculations with and without a fictional closure. No holiday API or real cache request occurs.',example:{profile:'fnq',orderedAt:'2026-11-27T10:30',closureDate:'2026-12-01'},edge:{profile:'fnq',orderedAt:'2026-11-27T10:30',closureDate:'2026-11-29'},code:'const baseline = schedule(profile, orderedAt);\nconst adjusted = schedule(profile, orderedAt, closureDate);\nreturn { baseline, adjusted, affected: datesDiffer };',execute:compareClosure},
 {id:'fulfilment',group:'Fulfilment gatekeeper',name:'gateShipment',purpose:'Filter non-shippable items, calculate physical weight and ceil-based cartons; local delivery is excluded in the intended demo pathway.',example:{method:'shipping',items:[{grams:14000,quantity:3,requiresShipping:true,giftCard:false},{grams:0,quantity:1,requiresShipping:false,giftCard:true}]},edge:{method:'pickup',items:[{grams:14000,quantity:3,requiresShipping:true,giftCard:false}]},code:'const shipment = calculateDemoShipment({ items });\nconst eligible = method === "shipping" && shipment.weightKg > 0;\nreturn { eligible, cartons: eligible ? shipment.cartons : 0 };',execute:gateShipment},
 {id:'warehouse',group:'Fulfilment gatekeeper',name:'allocateExampleWarehouse',purpose:'Read a fictional regional allocation from the same lifecycle fixtures; no live warehouse identifier is exposed.',example:{profile:'sa'},edge:{profile:'unknown'},code:'const zone = PROFILES.find(p => p.id === profile);\nreturn { warehouse: "DEMO-" + zone.warehouse };',execute:i=>({warehouse:'DEMO-'+PROFILES.find(p=>p.id===profile(i.profile)).warehouse})},
 {id:'carrier',group:'Tracking mapper',name:'normaliseCarrierEvent',purpose:'Unwrap a supported example event envelope, validate fictional references and translate the status.',example:{data:{references:{customer:'DEMO-001',numericId:'DEMO-CTN-001'},status:'COLLECTED'}},edge:{references:{customer:'DEMO-001'},status:'UNKNOWN'},code:'const event = input.data ?? input;\nconst mapped = mapDemoCarrierStatus(event.status);\nreturn { reference, tracking, mapped, eligible };',execute:normaliseCarrierEvent},
 {id:'write',group:'Shopify API boundary',name:'inspectWriteResponse',purpose:'Distinguish HTTP success from GraphQL errors and mutation userErrors before declaring the mock write accepted.',example:{http:200,errors:[],userErrors:[],dataPresent:true},edge:{http:200,errors:[],userErrors:[{message:'Example validation error'}],dataPresent:true},code:'const accepted = http >= 200 && http < 300\n  && errors.length === 0 && userErrors.length === 0\n  && dataPresent === true;',execute:inspectWriteResponse},
 {id:'trace',group:'Orchestration',name:'runLifecycle',purpose:'Generate the full local event trace using the same engine as the architecture studio; simulated failure truncates the path.',example:{profile:'fnq',weight:42,method:'shipping',fault:'none'},edge:{profile:'fnq',weight:42,method:'shipping',fault:'write'},code:'const trace = runLifecycle(input);\nreturn { events: trace.events, eta: trace.eta,\n         shipment: trace.shipment, notice: trace.notice };',execute:i=>{
  const p=profile(i.profile);requireValue(Number.isFinite(i.weight)&&i.weight>=0&&i.weight<=200,'Invalid weight.');
  requireValue(['shipping','pickup','local','giftcard'].includes(i.method),'Invalid method.');
  requireValue(['none','signature','postcode','holiday','write','carrier'].includes(i.fault),'Invalid fault.');
  const t=runLifecycle({profile:p,weight:i.weight,method:i.method,fault:i.fault});
  return {events:t.events.map(e=>({id:e.id,title:e.title,status:e.status})),eta:t.eta,shipment:t.shipment,notice:t.notice};
 }}
];
export function executeFunction(id,raw){
 try{
  requireValue(typeof raw==='string'&&raw.length<=16000,'JSON input exceeds the local limit.');
  const input=JSON.parse(raw);requireValue(record(input),'Input must be a JSON object.');
  const fn=FUNCTIONS.find(f=>f.id===id);requireValue(Boolean(fn),'Unknown function.');
  return {ok:true,result:fn.execute(input)};
 }catch(error){return {ok:false,error:error instanceof Error?error.message:'Invalid input'};}
}
