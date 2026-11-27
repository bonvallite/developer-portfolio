
/** Documented field names; educational schema and values, not a production
 * definition export. Only six ETA field types are corroborated by the existing
 * public communication model. Other types are explicitly proposed examples.
 * Shopify mutation variables encode values as strings; unset is not a write. */
import {PROFILES,schedule} from './logistics-lifecycle-demo.mjs';
import {formatDemoDate,mapDemoCarrierStatus} from './commerce-integration-demo.mjs';
const TEXT='single_line_text_field', MULTI='multi_line_text_field';
const field=(key,group,type,source,consumer,reviewed=false)=>({key,group,type,source,consumer,typeEvidence:reviewed?'Existing public reference':'Illustrative type',phase:group==='Tracking and status'?'tracking':'eta'});
export const SCHEMA=[
 field('estimated_delivery_date','Core schedule',TEXT,'Formatted delivery estimate','ETA notice',true),
 field('estimated_delivery_date_iso','Core schedule','date','Delivery calculator','Date comparison',true),
 field('delivery_day_name','Core schedule',TEXT,'Calendar weekday','ETA notice',true),
 field('delivery_dispatch_date','Core schedule',TEXT,'Formatted dispatch date','Dispatch information'),
 field('delivery_dispatch_date_iso','Core schedule','date','Dispatch calculation','Schedule comparison'),
 field('delivery_breakdown','Core schedule',MULTI,'Production / dispatch / transit rule','ETA notice',true),
 field('delivery_zone','Zone and pricing',TEXT,'Example profile lookup','Delivery summary',true),
 field('delivery_fee','Zone and pricing','number_decimal','Merchant rate configuration (not available)','Order data'),
 field('delivery_postcode','Zone and pricing',TEXT,'Normalised destination','Delivery summary',true),
 field('subscription_cancellation_cutoff','Zone and pricing',TEXT,'Reported general cut-off rule','Subscription information'),
 field('delivery_window_start','Window and rules',TEXT,'Formatted first arrival date','Window preview'),
 field('delivery_window_start_iso','Window and rules','date','First arrival calculation','Window comparison'),
 field('delivery_window_end','Window and rules',TEXT,'Formatted last arrival date','Window preview'),
 field('delivery_window_end_iso','Window and rules','date','Last arrival calculation','Window comparison'),
 field('delivery_window_label','Window and rules',TEXT,'Formatted arrival range','Window preview'),
 field('delivery_transit_label','Window and rules',TEXT,'Regional transit rule','ETA notice'),
 field('delivery_calculation_rule','Window and rules',TEXT,'Selected scheduling branch','Diagnostics'),
 field('delivery_is_window','Window and rules','boolean','Schedule output','Conditional Liquid rendering'),
 field('delivery_holiday_affected','Holiday impact','boolean','Baseline vs adjusted schedule','Conditional holiday notice'),
 field('delivery_holiday_name','Holiday impact',TEXT,'Fictional closure fixture','Holiday notice'),
 field('delivery_holiday_date','Holiday impact','date','Fictional closure fixture','Holiday notice'),
 field('delivery_holiday_message','Holiday impact',MULTI,'Computed impact explanation','Holiday notice'),
 field('delivery_status','Tracking and status',TEXT,'Human-readable carrier mapping','Tracking notice'),
 field('delivery_status_raw','Tracking and status',TEXT,'Raw example carrier event','Diagnostics'),
 field('shopify_fulfillment_event_status','Tracking and status',TEXT,'Mapped Shopify event enum','Shipment timeline'),
 field('delivery_status_updated_at','Tracking and status','date_time','Example event timestamp','Status information'),
 field('delivered_at','Tracking and status','date_time','Delivered milestone only','Delivery confirmation'),
 field('cartoncloud_tracking_number','Tracking and status',TEXT,'Fictional carrier reference','Tracking notice'),
 field('pod_tracking_link','Tracking and status','url','Fictional carrier tracking URL','Tracking link')
];
export const STAGES=[
 {id:'created',label:'Order received',raw:null},
 {id:'eta',label:'ETA calculated',raw:null},
 {id:'collected',label:'Carrier collected',raw:'COLLECTED'},
 {id:'transit',label:'In transit',raw:'IN_TRANSIT_PICKUP_WAREHOUSE'},
 {id:'out',label:'Out for delivery',raw:'IN_TRANSIT_WAREHOUSE_DELIVERY'},
 {id:'delivered',label:'Delivered',raw:'DELIVERED'}
];
const weekday=iso=>new Intl.DateTimeFormat('en-AU',{timeZone:'UTC',weekday:'long'}).format(new Date(iso+'T12:00:00Z'));
const stageTimestamp=(eta,index)=>{
 const base=new Date(eta.dispatchISO+'T04:00:00Z');
 if(index===3)base.setUTCDate(base.getUTCDate()+1);
 if(index>=4)return eta.windowStart+(index===4?'T00:00:00Z':'T04:00:00Z');
 return base.toISOString().replace('.000','');
};
function trackingValues(eta,index){
 if(index<2)return {};
 const raw=STAGES[index].raw,mapped=mapDemoCarrierStatus(raw),at=stageTimestamp(eta,index);
 return {delivery_status:mapped.label,delivery_status_raw:raw,shopify_fulfillment_event_status:mapped.status,delivery_status_updated_at:at,delivered_at:index===5?at:null,cartoncloud_tracking_number:'DEMO-CTN-001',pod_tracking_link:'https://example.com/tracking/demo'};
}
/** Build a local snapshot and a separate attempted mutation for a selected
 * event. Failure never commits data. Earlier successful tracking values stay
 * intact. The tracking path does not depend on success of the separate ETA. */
export function buildMetafieldSnapshot({profile='fnq',orderedAt='2026-11-27T10:30',closureDate='',stage='eta',etaAccepted=true,trackingAccepted=true}={}){
 const zone=PROFILES.find(p=>p.id===profile),index=STAGES.findIndex(s=>s.id===stage);
 if(!zone||index<0)throw new Error('Unknown demonstration scenario.');
 const baseline=schedule(profile,orderedAt),eta=schedule(profile,orderedAt,closureDate);
 const affected=['dispatchISO','windowStart','windowEnd'].some(k=>baseline[k]!==eta[k]);
 const range=eta.isWindow?formatDemoDate(eta.windowStart)+' – '+formatDemoDate(eta.windowEnd):formatDemoDate(eta.deliveryISO);
 const etaValues={
  estimated_delivery_date:range,estimated_delivery_date_iso:eta.deliveryISO,
  delivery_day_name:eta.isWindow?weekday(eta.windowStart)+' – '+weekday(eta.windowEnd):weekday(eta.deliveryISO),
  delivery_dispatch_date:formatDemoDate(eta.dispatchISO),delivery_dispatch_date_iso:eta.dispatchISO,
  delivery_breakdown:[eta.productionISO?'Production '+eta.productionISO:null,'Dispatch '+eta.dispatchISO,eta.rule].filter(Boolean).join(' → '),
  delivery_zone:zone.label,delivery_fee:null,delivery_postcode:zone.postcode,subscription_cancellation_cutoff:'11:59 pm AEST (reported rule)',
  delivery_window_start:eta.isWindow?formatDemoDate(eta.windowStart):null,delivery_window_start_iso:eta.isWindow?eta.windowStart:null,
  delivery_window_end:eta.isWindow?formatDemoDate(eta.windowEnd):null,delivery_window_end_iso:eta.isWindow?eta.windowEnd:null,
  delivery_window_label:eta.isWindow?range:null,delivery_transit_label:eta.rule,delivery_calculation_rule:eta.rule,delivery_is_window:String(eta.isWindow),
  delivery_holiday_affected:String(affected),delivery_holiday_name:affected?'Example closure':null,delivery_holiday_date:affected?closureDate:null,
  delivery_holiday_message:affected?'The fictional closure changes the calculated schedule.':null
 };
 const prevTracking=trackingValues(eta,index-1),nextTracking=trackingValues(eta,index);
 const values=index>=1&&etaAccepted?{...etaValues}:{};
 if(index>=2)Object.assign(values,trackingAccepted?nextTracking:prevTracking);
 const rows=SCHEMA.map(f=>{
   const value=values[f.key]??null;
   const previous=f.phase==='tracking'?prevTracking[f.key]??null:index>1&&etaAccepted?etaValues[f.key]??null:null;
   const attempted=index===1&&f.phase==='eta'?etaValues[f.key]??null:index>=2&&f.phase==='tracking'?nextTracking[f.key]??null:null;
   const rejected=attempted!==null&&(index===1?!etaAccepted:!trackingAccepted);
   return {...f,value,previous,attempted,state:rejected?'Rejected':value===null?'Unset':value!==previous?'Updated':'Stored'};
 });
 // Example owner ID is a placeholder, never a usable Shopify identifier.
 const mutationRows=rows.filter(r=>r.attempted!==null);
 const variables={metafields:mutationRows.map(r=>({ownerId:'EXAMPLE_ORDER_ID',namespace:'custom',key:r.key,type:r.type,value:String(r.attempted)}))};
 const accepted=index===0?null:index===1?Boolean(etaAccepted):Boolean(trackingAccepted);
 return {rows,variables,accepted,stage,eta,preview:{eta:values.estimated_delivery_date??null,holiday:values.delivery_holiday_message??null,status:values.delivery_status??null,tracking:values.pod_tracking_link??null,sent:false}};
}
