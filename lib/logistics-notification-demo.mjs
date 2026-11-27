
/** Fixed local Liquid templates with the existing LiquidJS dependency.
 * No arbitrary template input, includes, network, external recipients or sends.
 * The actual Shopify runtime, template scope and event configuration may differ. */
import {Liquid} from 'liquidjs';
import {buildMetafieldSnapshot} from './logistics-metafield-demo.mjs';
const liquid=new Liquid({strictVariables:false,strictFilters:true});
export const NOTICE_STAGES=[
 {id:'created',label:'Order received',title:'Order received'},
 {id:'eta',label:'Early delivery estimate',title:'Your delivery schedule'},
 {id:'collected',label:'Shipping confirmation',title:'Your order is on the way'},
 {id:'transit',label:'Tracking update',title:'Your order is in transit'},
 {id:'out',label:'Out for delivery',title:'Your order is out for delivery'},
 {id:'delivered',label:'Delivered',title:'Your order has been delivered'}
];
export const EMAIL_TEMPLATE=`Order {{ order.name }}
{{ title }}
{% if stage == 'created' %}Thank you for your order. Delivery information will follow.{% else %}{% if order.metafields.custom.delivery_is_window.value == true and order.metafields.custom.delivery_window_label.value != blank %}Estimated delivery window: {{ order.metafields.custom.delivery_window_label.value }}
{% elsif order.metafields.custom.estimated_delivery_date.value != blank %}Estimated delivery: {{ order.metafields.custom.estimated_delivery_date.value }}
{% else %}Delivery estimate is not yet available.
{% endif %}{% if order.metafields.custom.delivery_dispatch_date.value != blank %}Scheduled dispatch: {{ order.metafields.custom.delivery_dispatch_date.value }}
{% endif %}{% if order.metafields.custom.delivery_holiday_affected.value == true and order.metafields.custom.delivery_holiday_message.value != blank %}Holiday notice: {{ order.metafields.custom.delivery_holiday_message.value }}
{% endif %}{% if order.metafields.custom.delivery_status.value != blank %}Shipment status: {{ order.metafields.custom.delivery_status.value }}
{% endif %}{% if order.metafields.custom.pod_tracking_link.value != blank %}Tracking: {{ order.metafields.custom.pod_tracking_link.value }}
{% else %}Tracking details are not yet available.
{% endif %}{% endif %}`;
export const SMS_TEMPLATE=`Order {{ order.name }}: {{ title }}. {% if stage != 'created' %}{% if order.metafields.custom.delivery_is_window.value == true and order.metafields.custom.delivery_window_label.value != blank %}Estimated delivery window {{ order.metafields.custom.delivery_window_label.value }}. {% elsif order.metafields.custom.estimated_delivery_date.value != blank %}Estimated delivery {{ order.metafields.custom.estimated_delivery_date.value }}. {% else %}Delivery estimate pending. {% endif %}{% if order.metafields.custom.delivery_holiday_affected.value == true %}Holiday adjustment applies. {% endif %}{% if order.metafields.custom.pod_tracking_link.value != blank %}Track: {{ order.metafields.custom.pod_tracking_link.value }}{% else %}Tracking pending.{% endif %}{% endif %}`;
const emailParsed=liquid.parse(EMAIL_TEMPLATE),smsParsed=liquid.parse(SMS_TEMPLATE);
/** Convert string-encoded mutation fields to typed Liquid values. In particular,
 * the string "false" is truthy in Liquid and must not act as boolean true. */
export function buildNotificationDemo({profile='fnq',orderedAt='2026-11-27T10:30',closureDate='',stage='eta',etaAccepted=true,trackingAccepted=true,trackingReady=true,hasEmail=true,hasPhone=true,enabled=true,minutes=5}={}){
 const notice=NOTICE_STAGES.find(s=>s.id===stage);
 if(!notice||!Number.isInteger(minutes)||minutes<0||minutes>60)throw new Error('Invalid notification scenario.');
 const snapshot=buildMetafieldSnapshot({profile,orderedAt,closureDate,stage,etaAccepted,trackingAccepted});
 const channel=hasEmail?'Email':hasPhone?'SMS':'None';
 const custom=Object.fromEntries(snapshot.rows.filter(r=>r.value!==null&&(trackingReady||!['cartoncloud_tracking_number','pod_tracking_link'].includes(r.key))).map(r=>[r.key,{value:r.type==='boolean'?r.value==='true':r.value}]));
 const trackingStage=!['created','eta'].includes(stage);
 const reason=!enabled?'NOTIFICATION_DISABLED':channel==='None'?'NO_CONTACT_CHANNEL':stage==='eta'&&minutes<5?'WAITING_REPORTED_DELAY':trackingStage&&!trackingAccepted?'SELECTED_STATUS_WRITE_REJECTED':'PREVIEW_AVAILABLE';
 const ready=reason==='PREVIEW_AVAILABLE';
 const context={title:notice.title,stage,order:{name:'DEMO-001',metafields:{custom}}};
 const rendered=ready?liquid.renderSync(channel==='SMS'?smsParsed:emailParsed,context).trim():null;
 return {channel,reason,ready,rendered,context,template:channel==='SMS'?SMS_TEMPLATE:EMAIL_TEMPLATE,sent:false,externalRequests:0,trackingStage,etaSaved:Boolean(custom.estimated_delivery_date),trackingAvailable:Boolean(custom.pod_tracking_link),reportedDelayMinutes:5};
}
