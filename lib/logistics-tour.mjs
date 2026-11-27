
/** Fourteen chapters derived from the independent normal-path event trace.
 * Never execute an API operation on scroll. Explicit physical, API and
 * app-authorised Shopify return paths are represented separately. */
import { runLifecycle } from './logistics-lifecycle-demo.mjs';
export function visualEdges(event){
  if(!event)return [];
  const edge=event.from+'-'+event.to;
  if(edge==='worker-worker')return [];
  if(edge==='worker-app')return event.status==='failed'?[edge]:[edge,'app-shopify'];
  if(edge==='worker-holiday')return [edge,'holiday-worker'];
  return [edge];
}
const defs=[
 ['Checkout & order creation','The storefront emits an order-created event.','Order created','auth'],
 ['HMAC verification','Authenticate before allowing delivery decisions.','Verify signature','auth'],
 ['Postcode and service eligibility','Resolve the example service profile. Unknown destinations stop the calculation.','Resolve postcode','eta'],
 ['Brisbane cut-off & dispatch','Evaluate local wall-clock time and select the next eligible dispatch.','Cut-off and dispatch','eta'],
 ['Regional transit rules','Compute arrival dates or a business-day window.','Transit rules','eta'],
 ['Holiday and closure engine','Compare the baseline against a fictional closure; cache and fallback are modelled.','Holiday and closure check','eta'],
 ['App-authorised ETA write-back','The Worker uses the app identity to write order metafields. Shopify renders an early ETA preview separately.','Initial metafield write','eta','ETA notification preview'],
 ['Production & fulfilment','Packing is an operational event; Shopify emits the fulfilment webhook.','Production and fulfilment','pack'],
 ['Fulfilment gatekeeper','Exclude non-carrier pathways in the intended demo routing.','Fulfilment gatekeeper','pack'],
 ['Carton & warehouse allocation','Calculate cartons from physical weight and select an example warehouse.','Carton and warehouse allocation','pack'],
 ['Chilled consignment & handover','The Worker creates a mock REST consignment; physical freight moves separately.','Create chilled consignment','pack','Physical freight handover'],
 ['Carrier scans & tracking webhook','The fleet reports a scan through CartonCloud, then the Worker receives the webhook.','Physical carrier scan','track','Carrier scan: Carrier picked up'],
 ['Three-part Shopify write-back','Tracking info, fulfilment events and status metafields use the authorised app path.','Shopify tracking write-back','track'],
 ['Delivery & customer communication','Later scans return through the Worker and app. Native notification previews do not send messages.','Customer status preview','track'],
];
export function buildTour(){
 const {events}=runLifecycle();
 return defs.map(([title,detail,first,module,second],i)=>{
  let selected;
  if(i===13)selected=events.slice(events.findLastIndex(e=>e.title==='Physical carrier scan'));
  else selected=[events.find(e=>e.title===first),...(second?[events.find(e=>e.title===second)]:[])].filter(Boolean);
  return {id:i+1,title,detail,module,events:selected,edges:selected.flatMap(visualEdges)};
 });
}
