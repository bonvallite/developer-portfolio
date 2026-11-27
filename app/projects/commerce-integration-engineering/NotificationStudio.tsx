
'use client';
/** Fixed LiquidJS rendering reads only the local stored snapshot; motion
 * never sends a message. The reported delay is a virtual clock control. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {PROFILES} from '../../../lib/logistics-lifecycle-demo.mjs';
import {NOTICE_STAGES,buildNotificationDemo} from '../../../lib/logistics-notification-demo.mjs';
import './notification-studio.css';
gsap.registerPlugin(useGSAP);
export default function NotificationStudio(){
 const scope=useRef<HTMLDivElement>(null);
 const [profile,setProfile]=useState('fnq'),[stage,setStage]=useState('eta'),[closureDate,setClosureDate]=useState(''),[minutes,setMinutes]=useState(5),[etaAccepted,setEtaAccepted]=useState(true),[trackingAccepted,setTrackingAccepted]=useState(true),[trackingReady,setTrackingReady]=useState(true),[hasEmail,setHasEmail]=useState(true),[hasPhone,setHasPhone]=useState(true),[enabled,setEnabled]=useState(true);
 let model:ReturnType<typeof buildNotificationDemo>|null=null,error='';
 try{model=buildNotificationDemo({profile,stage,closureDate,minutes,etaAccepted,trackingAccepted,trackingReady,hasEmail,hasPhone,enabled});}catch(e){error=e instanceof Error?e.message:'Invalid scenario';}
 useGSAP(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.fromTo('[data-notice-preview]',{y:8},{y:0,duration:.35,clearProps:'transform'});gsap.fromTo('[data-notice-link]',{scaleX:0},{scaleX:1,duration:.4,stagger:.08,transformOrigin:'left center',clearProps:'transform'});});
  return()=>mm.revert();
 },{scope,dependencies:[profile,stage,closureDate,minutes,etaAccepted,trackingAccepted,trackingReady,hasEmail,hasPhone,enabled],revertOnUpdate:true});
 return <div ref={scope} className="jrv-notice">
  <div className="jrv-life-top"><span>SHOPIFY / TRANSACTIONAL COMMUNICATIONS</span><span>FIXED LIQUIDJS TEMPLATES · PREVIEW ONLY</span></div>
  <p className="jrv-notice-note">Actual local Liquid rendering with synthetic metafield context. Email-first and SMS fallback, plus the five-minute early ETA timing, reflect the reported merchant setup, not a guarantee of Shopify delivery or a Worker send.</p>
  <div className="jrv-notice-controls">
   <label>Delivery profile<select value={profile} onChange={e=>setProfile(e.target.value)}>{PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
   <label>Fictional closure<input type="date" value={closureDate} onChange={e=>setClosureDate(e.target.value)}/></label>
   <label>Virtual minutes after payment: {minutes}<input type="range" min="0" max="60" step="1" value={minutes} onChange={e=>setMinutes(Number(e.target.value))}/></label>
   {([{label:'ETA write accepted',value:etaAccepted,set:setEtaAccepted},{label:'Selected tracking write accepted',value:trackingAccepted,set:setTrackingAccepted},{label:'Tracking details available',value:trackingReady,set:setTrackingReady},{label:'Email available',value:hasEmail,set:setHasEmail},{label:'Mobile available',value:hasPhone,set:setHasPhone},{label:'Selected notification enabled',value:enabled,set:setEnabled}]).map(c=><label className="jrv-notice-check" key={c.label}><input type="checkbox" checked={c.value} onChange={e=>c.set(e.target.checked)}/>{c.label}</label>)}
  </div>
  <div className="jrv-notice-stages" aria-label="Notification stage">{NOTICE_STAGES.map(s=><button key={s.id} type="button" aria-pressed={stage===s.id} onClick={()=>setStage(s.id)}>{s.label}</button>)}</div>
  {error?<p role="alert">{error}</p>:model&&<>
   <div className="jrv-notice-flow" aria-label="Stored order data to template to customer preview"><span>Stored order data</span><i data-notice-link aria-hidden="true"/><span>Fixed Liquid template</span><i data-notice-link aria-hidden="true"/><span>{model.channel==='None'?'No channel':model.channel+' preview'}</span></div>
   <div className="jrv-notice-grid">
    <div className="jrv-notice-panel"><h3>Template and stored context</h3><p>Typed booleans, unset fields omitted, no attempted writes treated as saved.</p><details open><summary>Liquid source (read-only)</summary><pre>{model.template}</pre></details><details><summary>Local Liquid context</summary><pre>{JSON.stringify(model.context,null,2)}</pre></details></div>
    <div className="jrv-notice-panel" data-notice-preview><h3>Customer view</h3><div role="status" className="jrv-notice-status"><strong>{model.ready?'PREVIEW AVAILABLE':'PREVIEW SUPPRESSED'}</strong><span>{model.channel} · {model.reason}</span></div><div className={'jrv-notice-message '+(model.channel==='SMS'?'sms':'email')}><small>FICTIONAL COLD-CHAIN STORE</small>{model.rendered?<p>{model.rendered}</p>:<p>No message preview for the selected conditions.</p>}</div><p>ETA stored: {model.etaSaved?'Yes':'No'} · Tracking link: {model.trackingAvailable?'Available':'Unavailable'}</p><p>External requests: 0 · Messages sent: 0</p></div>
   </div>
  </>}
  <p className="jrv-notice-note">The early ETA view can display a pending estimate if the write failed; a rejected selected tracking write suppresses the corresponding milestone preview. Later event eligibility is modelled, not verified native notification configuration. Nothing is sent or scheduled.</p>
 </div>;
}
