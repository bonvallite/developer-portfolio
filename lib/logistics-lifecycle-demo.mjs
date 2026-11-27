
/** Independent, zero-network teaching model. Dates use a UTC calendar to represent
 * Brisbane wall-clock input; region fixtures are not a merchant rate or zone table.
 * An event is a local observation, never a production request or email. */
import { calculateDemoEta, calculateDemoShipment, mapDemoCarrierStatus } from './commerce-integration-demo.mjs';

export const PROFILES = [
  {id:'fnq',label:'Long-haul Friday window',postcode:'4810',warehouse:'QLD'},
  {id:'sa',label:'Thursday production cycle',postcode:'5371',warehouse:'MEL'},
  {id:'nsw',label:'NSW dispatch cycle',postcode:'2000',warehouse:'SYD'},
  {id:'vic',label:'VIC dispatch cycle',postcode:'3163',warehouse:'MEL'},
  {id:'qld',label:'QLD weekday service',postcode:'4051',warehouse:'QLD'},
];
const day = d=>d.toISOString().slice(0,10);
const plus = (d,n)=>{const x=new Date(d);x.setUTCDate(x.getUTCDate()+n);return x;};
const open=(d,closure)=>d.getUTCDay()>0&&d.getUTCDay()<6&&day(d)!==closure;
function advance(d,n,closure){let x=new Date(d);while(n>0){x=plus(x,1);if(open(x,closure))n--;}return x;}
/** Long-haul example: Friday before noon, four to five business days after dispatch. */
export function schedule(profile,orderedAt,closureDate=''){
  const parsed=new Date(orderedAt+':00Z');
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(orderedAt)||!Number.isFinite(+parsed)||parsed.toISOString().slice(0,16)!==orderedAt)throw new Error('Enter a valid Brisbane wall-clock date and time.');
  if(closureDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(closureDate)||!Number.isFinite(+new Date(closureDate))||day(new Date(closureDate))!==closureDate))throw new Error('Enter a valid fictional closure date.');
  if(profile!=='fnq'){const e=calculateDemoEta({zoneId:profile,orderedAt,closureDate});return {...e,windowStart:e.deliveryISO,windowEnd:e.deliveryISO,isWindow:false};}
  let dispatch=new Date(parsed);
  if(dispatch.getUTCHours()>=12)dispatch=plus(dispatch,1);
  while(dispatch.getUTCDay()!==5||!open(dispatch,closureDate))dispatch=plus(dispatch,1);
  const start=day(advance(dispatch,4,closureDate)),end=day(advance(dispatch,5,closureDate));
  return {dispatchISO:day(dispatch),deliveryISO:start,windowStart:start,windowEnd:end,isWindow:true,productionISO:null,rule:'Friday dispatch + 4–5 business days',closureDate};
}
/** Local event trace with an explicit failure boundary; no side effects or requests. */
export function runLifecycle({profile='fnq',orderedAt='2026-11-27T10:30',closureDate='',weight=42,method='shipping',fault='none',hasEmail=true,hasPhone=true}={}){
  const zone=PROFILES.find(z=>z.id===profile);
  if(!zone)throw new Error('Unknown example profile.');
  if(!Number.isFinite(weight)||weight<0||weight>200)throw new Error('Enter a weight from 0 to 200 kg.');
  const events=[];
  const emit=(title,from,to,operation,input,output,status='success')=>events.push({id:events.length+1,title,from,to,operation,input,output,status});
  const order={reference:'DEMO-001',postcode:zone.postcode,createdAt:orderedAt,method,weight};
  emit('Order created','shopify','worker','orders/create',order,{received:true});
  emit('Verify signature','shopify','worker','HMAC verification (simulated)',{valid:fault!=='signature'},{http:fault==='signature'?401:200},fault==='signature'?'failed':'success');
  if(fault==='signature')return {events,eta:null,shipment:null,fields:{},notice:null};
  emit('Resolve postcode','worker','worker','Postcode validation',{postcode:zone.postcode},{zone:zone.label,matched:fault!=='postcode'},fault==='postcode'?'skipped':'success');
  if(fault==='postcode')return {events,eta:null,shipment:null,fields:{},notice:null};
  emit('Cut-off and dispatch','worker','worker','Brisbane wall-clock evaluation',{orderedAt},{timezone:'Australia/Brisbane',profile});
  const baseline=schedule(profile,orderedAt),eta=schedule(profile,orderedAt,closureDate);
  emit('Transit rules','worker','worker','Regional schedule',{profile},{rule:eta.rule,baseline});
  const affected=baseline.dispatchISO!==eta.dispatchISO||baseline.windowStart!==eta.windowStart||baseline.windowEnd!==eta.windowEnd;
  emit('Holiday and closure check','worker','holiday','Synthetic holiday adapter',{closureDate,source:fault==='holiday'?'static fallback fixture':'cache fixture'},{affected,dispatch:eta.dispatchISO,window:[eta.windowStart,eta.windowEnd]});
  const fields={estimated_delivery_date:eta.deliveryISO,delivery_dispatch_date_iso:eta.dispatchISO,delivery_window_start_iso:eta.windowStart,delivery_window_end_iso:eta.windowEnd,delivery_window_label:eta.isWindow?eta.windowStart+' – '+eta.windowEnd:eta.deliveryISO,delivery_is_window:String(eta.isWindow),delivery_holiday_affected:String(affected),delivery_zone:zone.label,delivery_calculation_rule:eta.rule};
  emit('Initial metafield write','worker','app','metafieldsSet',{namespace:'custom',fields},{data:fault==='write'?null:{accepted:true},userErrors:fault==='write'?[{message:'Simulated write rejected'}]:[]},fault==='write'?'failed':'success');
  if(fault==='write')return {events,eta,shipment:null,fields:{},notice:null};
  const notice={channel:hasEmail?'Email':hasPhone?'SMS':'No available channel',estimated:fields.delivery_window_label,dispatch:eta.dispatchISO,holidayAffected:affected};
  emit('ETA notification preview','shopify','notice','Store-side Liquid rendering (timing reported, not executed)',{fields},{...notice,sent:false});
  emit('Production and fulfilment','shopify','worker','fulfillments/create',{method,weight},{received:true});
  const shipment=calculateDemoShipment({items:[{grams:weight*1000,quantity:1,requiresShipping:method==='shipping',giftCard:method==='giftcard'}]});
  const eligible=method==='shipping'&&weight>0&&shipment.eligible;
  emit('Fulfilment gatekeeper','worker','worker','Physical-item and delivery-method guard',{method,weight},{eligible,reason:eligible?'Eligible freight':'Non-carrier pathway'},eligible?'success':'skipped');
  if(!eligible)return {events,eta,shipment:null,fields,notice};
  emit('Carton and warehouse allocation','worker','worker','ceil(weightKg / capacityKg)',{weightKg:shipment.weightKg,capacityKg:20},{cartons:shipment.cartons,warehouse:zone.warehouse});
  const payload={type:'CONSIGNMENT',references:{customer:order.reference},warehouse:{id:'DEMO-'+zone.warehouse},details:{type:'DELIVERY',shipmentType:'Chilled'},items:[{product:{references:{code:'CTN'}},quantity:shipment.cartons,weight:shipment.weightKg}]};
  emit('Create chilled consignment','worker','carrier','REST consignment creation (mock)',payload,{http:fault==='carrier'?503:201,reference:fault==='carrier'?null:'DEMO-CTN-001'},fault==='carrier'?'failed':'success');
  if(fault==='carrier')return {events,eta,shipment,fields,notice};
  const statuses=['COLLECTED','IN_TRANSIT_PICKUP_WAREHOUSE','IN_TRANSIT_WAREHOUSE_DELIVERY','DELIVERED'];
  for(const raw of statuses){
    const mapped=mapDemoCarrierStatus(raw);
    emit('Carrier scan: '+mapped.label,'carrier','worker','Tracking webhook (mock Basic Auth)',{references:{customer:order.reference,numericId:'DEMO-CTN-001'},properties:{trackingLink:'https://example.com/tracking/demo'},status:raw},{mapped});
    emit('Shopify tracking write-back','worker','app','fulfillmentTrackingInfoUpdate → fulfillmentEventCreate → metafieldsSet',{tracking:'DEMO-CTN-001',status:mapped.status},{accepted:true,notificationRequested:raw==='COLLECTED',delivery_status:mapped.label});
    emit('Customer status preview','shopify','notice','Native notification eligibility / preview',{status:mapped.status},{label:mapped.label,sent:false});
  }
  return {events,eta,shipment,fields,notice};
}
