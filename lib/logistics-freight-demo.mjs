
/** Independent physical-operation view derived from the existing local trace.
 * Cartons represent a mathematical weight allocation, not a packing plan.
 * Route geometry, refrigerated vehicle and milestones are illustrations;
 * no GPS, temperature readings, physical shipment or provider writes exist. */
import {PROFILES,runLifecycle} from './logistics-lifecycle-demo.mjs';
export function buildFreightJourney({profile='fnq',weight=42,method='shipping',fault='none',orderedAt='2026-11-27T10:30'}={}){
 const zone=PROFILES.find(p=>p.id===profile);
 if(!zone||!['shipping','pickup','local','giftcard'].includes(method)||!['none','carrier'].includes(fault))throw new Error('Unknown freight example.');
 if(!Number.isInteger(weight)||weight<0||weight>200)throw new Error('Use a whole-number shipment weight from 0 to 200 kg.');
 const trace=runLifecycle({profile,weight,method,fault,orderedAt});
 const steps=[];
 const find=(title)=>trace.events.find(e=>e.title===title);
 const add=(id,title,detail,position,events=[],status='success')=>steps.push({id,title,detail,position,events:events.filter(Boolean),status});
 add('production','Production handoff','Fictional order prepared for fulfilment; no direct production API.',0,[find('Production and fulfilment')]);
 const gate=find('Fulfilment gatekeeper');
 add('gate','Fulfilment gatekeeper','Separate external freight from non-carrier pathways.',0,[gate],gate?.status??'skipped');
 if(!trace.shipment){
  const labels={pickup:'Held for store pickup',local:'In-house delivery handoff',giftcard:'No physical shipment',shipping:'No eligible physical weight'};
  add('bypass',labels[method],'No external consignment, carrier scan or delivery confirmation is fabricated.',0,[],'skipped');
  return {steps,cartons:[],warehouse:null,eta:trace.eta,reference:null,eligible:false};
 }
 const cartons=Array.from({length:trace.shipment.cartons},(_,i)=>({id:i+1,kg:Math.min(20,Math.max(0,weight-i*20))}));
 add('packing','Pack and allocate cartons','Illustrative weight split using 20 kg per carton.',0,[find('Carton and warehouse allocation')]);
 const consignment=find('Create chilled consignment');
 add('consignment','Request chilled consignment','The Worker builds the carrier REST payload and example warehouse allocation.',0,[consignment],consignment?.status??'failed');
 if(consignment?.status!=='success')return {steps,cartons,warehouse:zone.warehouse,eta:trace.eta,reference:null,eligible:true};
 add('handover','Refrigerated freight handover','Illustrative loading onto a cold-chain vehicle; no live temperature data.',1,[find('Physical freight handover')]);
 const scans=trace.events.filter(e=>e.title==='Physical carrier scan');
 const webhooks=trace.events.filter(e=>e.title.startsWith('Carrier scan:'));
 const writes=trace.events.filter(e=>e.title==='Shopify tracking write-back');
 const notices=trace.events.filter(e=>e.title==='Customer status preview');
 const milestones=[['collected','Carrier collected',1],['transit','In transit',2],['out','Out for delivery',3],['delivered','Delivered',4]];
 milestones.forEach(([id,title,position],i)=>{
  add(id,title,'Physical scan becomes a carrier webhook, then an app-authorised Shopify write and notification preview.',position,[scans[i],webhooks[i],writes[i],notices[i]]);
 });
 return {steps,cartons,warehouse:zone.warehouse,eta:trace.eta,reference:'DEMO-CTN-001',eligible:true};
}
