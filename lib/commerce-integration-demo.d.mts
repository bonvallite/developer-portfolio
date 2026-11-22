// Public-safe lab is authored in ESM and intentionally independent of Next.js.
// These declarations keep TypeScript's strict compilation contract explicit.
export type DemoZone = {
  readonly id:string;
  readonly label:string;
  readonly postcode:string;
  readonly state:string;
  readonly dispatch:readonly number[];
  readonly delivery:readonly number[];
  readonly lead:number;
};
export const DEMO_ZONES:ReadonlyArray<DemoZone>;
export const CARRIER_STATUS_MAP:Readonly<Record<string,{status:string;label:string}>>;
export function calculateDemoEta(input?:{
  zoneId?:string;orderedAt?:string;closureDate?:string;
}):{
  zoneId:string;zoneLabel:string;postcode:string;orderedAt:string;
  orderedISO:string;productionISO:string|null;dispatchISO:string;
  deliveryISO:string;transitReadyISO:string|null;lastMileISO:string|null;
  routeWaitDays:number|null;leadDays:number;deliveryWeekdays:number[];
  deliveryMode:'route'|'state-dispatch-rule'|'special-schedule';
  rule:string;closureDate:string|null;isIllustrative:boolean;
};
export function calculateDemoShipment(input:{
  items:Array<{grams:number;quantity:number;requiresShipping:boolean;giftCard?:boolean}>;
  capacityKg?:number;
}):{eligible:boolean;weightKg:number;cartons:number;capacityKg:number;excludedItems:number;physicalItems:number};
export function mapDemoCarrierStatus(rawStatus:string):{status:string;label:string};
export function formatDemoDate(iso:string|null):string;

// Browser-only model: the Worker stores typed ETA order metafields and later
// writes fulfilment tracking. Merchant reports Shopify customer notifications
// use email when available, otherwise SMS when only a phone exists. The
// five-minute store-side notice delay and actual message delivery remain
// unverified in the Worker source. No Klaviyo or external sender is modelled.
export type DemoCommunicationStage = 'order'|'saved'|'eta-notice'|'fulfilled';
export const DEMO_COMMUNICATION_STAGES:ReadonlyArray<{
  readonly id:DemoCommunicationStage;
  readonly label:string;readonly offset:string;readonly detail:string;
}>;
export function calculateDemoCommunication(input?:{
  zoneId?:string;orderedAt?:string;stage?:DemoCommunicationStage;
  estimateSaved?:boolean;trackingReady?:boolean;hasEmail?:boolean;hasPhone?:boolean;
}):{
  stage:DemoCommunicationStage;stageIndex:number;
  eta:ReturnType<typeof calculateDemoEta>;
  orderMetafields:Array<{key:string;type:string;value:string}>;
  estimateSaved:boolean;notificationChannel:'email'|'sms'|'none';
  etaNoticeReady:boolean;emailNoticeReady:boolean;smsNoticeReady:boolean;
  shippingConfirmationReady:boolean;trackingReady:boolean;
  trackingReference:string|null;nativeTrackingNoticeRequested:boolean;
  orderReference:string;notificationWaitMinutes:number;isIllustrative:boolean;
};
