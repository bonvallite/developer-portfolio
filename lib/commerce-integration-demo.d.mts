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
  deliveryISO:string;rule:string;closureDate:string|null;isIllustrative:boolean;
};
export function calculateDemoShipment(input:{
  items:Array<{grams:number;quantity:number;requiresShipping:boolean;giftCard?:boolean}>;
  capacityKg?:number;
}):{eligible:boolean;weightKg:number;cartons:number;capacityKg:number;excludedItems:number;physicalItems:number};
export function mapDemoCarrierStatus(rawStatus:string):{status:string;label:string};
export function formatDemoDate(iso:string|null):string;
