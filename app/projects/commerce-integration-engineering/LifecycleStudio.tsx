
'use client';

/** Event-driven GSAP visualisation. React owns the selected trace; GSAP only
 * moves packets along the matching SVG edges, including the app return leg. No external API calls or sends. */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { PROFILES, runLifecycle } from '../../../lib/logistics-lifecycle-demo.mjs';
import './lifecycle-studio.css';
import LifecycleTopology from './LifecycleTopology';
import { visualEdges } from '../../../lib/logistics-tour.mjs';

gsap.registerPlugin(useGSAP, MotionPathPlugin);
type Fault='none'|'signature'|'postcode'|'holiday'|'write'|'carrier';
const faults: {id:Fault; label:string}[]=[{id:'none',label:'Normal path'},{id:'signature',label:'Invalid signature'},{id:'postcode',label:'Unmatched postcode'},{id:'holiday',label:'Holiday API unavailable'},{id:'write',label:'Shopify write rejected'},{id:'carrier',label:'Carrier unavailable'}];
export default function LifecycleStudio(){
  const [profile,setProfile]=useState('fnq'),[orderedAt,setOrderedAt]=useState('2026-11-27T10:30'),[closureDate,setClosureDate]=useState(''),[weight,setWeight]=useState(42),[method,setMethod]=useState('shipping'),[fault,setFault]=useState<Fault>('none'),[step,setStep]=useState(0),[playing,setPlaying]=useState(false),[hasEmail,setHasEmail]=useState(true),[hasPhone,setHasPhone]=useState(true);
  const scope=useRef<HTMLDivElement>(null);
  const reset=()=>{setStep(0);setPlaying(false);};
  let error='',trace:ReturnType<typeof runLifecycle>|null=null;
  try{trace=runLifecycle({profile,orderedAt,closureDate,weight,method,fault,hasEmail,hasPhone});}catch(e){error=e instanceof Error?e.message:'Invalid input';}
  const events=trace?.events??[],last=Math.max(0,events.length-1),index=Math.min(step,last),event=events[index];
  const activeEdges=visualEdges(event);
  const edge=activeEdges.join('|');
  const activeNodes=event?[...new Set([event.from,event.to,...activeEdges.flatMap((p:string)=>p.split('-'))])]:[];
  // Stop playback at the actual trace end, including rejection or skip.
  useEffect(()=>{if(!playing)return;if(index>=last){setPlaying(false);return;}const t=window.setTimeout(()=>setStep(s=>Math.min(s+1,last)),1350);return()=>window.clearTimeout(t);},[playing,index,last]);
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const host=scope.current;if(!host)return;
      const packet=host.querySelector<SVGCircleElement>('[data-packet]');
      if(packet&&activeEdges.length){
        const sequence=gsap.timeline();
        for(const id of activeEdges){
          const path=host.querySelector<SVGPathElement>('[data-edge="'+id+'"]');
          if(path)sequence.fromTo(packet,{opacity:0},{opacity:1,motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:.45,ease:'power1.inOut'});
        }
      }
      gsap.fromTo('[data-live-inspector]',{y:8},{y:0,duration:.3,ease:'power2.out'});
    });
    return()=>mm.revert();
  },{scope,dependencies:[edge,index,profile,fault],revertOnUpdate:true});
  return <div ref={scope} className="jrv-lifecycle">
    <div className="jrv-life-top"><span>JRV / INTEGRATION CONTROL CENTRE</span><span>LOCAL SANDBOX · NO NETWORK</span></div>
    <div className="jrv-life-controls">
      <label>Delivery profile<select value={profile} onChange={e=>{setProfile(e.target.value);reset();}}>{PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
      <label>Brisbane order time<input type="datetime-local" value={orderedAt} onChange={e=>{setOrderedAt(e.target.value);reset();}}/></label>
      <label>Fictional closure<input type="date" value={closureDate} onChange={e=>{setClosureDate(e.target.value);reset();}}/></label>
      <label>Weight (kg)<input type="number" min="0" max="200" value={weight} onChange={e=>{setWeight(Number(e.target.value));reset();}}/></label>
      <label>Fulfilment<select value={method} onChange={e=>{setMethod(e.target.value);reset();}}><option value="shipping">Cold-chain shipping</option><option value="pickup">Store pickup</option><option value="local">In-house local (intended)</option><option value="giftcard">Gift card only</option></select></label>
      <label>Scenario<select value={fault} onChange={e=>{setFault(e.target.value as Fault);reset();}}>{faults.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
      <label className="jrv-life-check"><input type="checkbox" checked={hasEmail} onChange={e=>{setHasEmail(e.target.checked);reset();}}/> Email available</label>
      <label className="jrv-life-check"><input type="checkbox" checked={hasPhone} onChange={e=>{setHasPhone(e.target.checked);reset();}}/> Mobile available</label>
    </div>
    {error?<p role="alert">{error}</p>:<>
    <div className="jrv-life-workspace">
      <div>
        <LifecycleTopology activeEdges={activeEdges} activeNodes={activeNodes}/>
        <p className="jrv-life-caption">Teal: active data path. Ember: orchestration. Physical freight is separate from API traffic. All outputs are simulated.</p>
        <div className="jrv-life-actions"><button type="button" onClick={reset}>Reset</button><button type="button" disabled={index===0} onClick={()=>{setPlaying(false);setStep(index-1);}}>Previous</button><button type="button" className="jrv-life-play" disabled={index===last&&!playing} onClick={()=>setPlaying(p=>!p)}>{playing?'Pause':'Play trace'}</button><button type="button" disabled={index===last} onClick={()=>{setPlaying(false);setStep(index+1);}}>Next event</button></div>
        <progress max={Math.max(1,events.length)} value={index+1} aria-label="Trace progress"/>
      </div>
      <div className="jrv-life-inspector" data-live-inspector>
        <p className="jrv-life-kicker">EVENT {index+1} / {events.length} · {event?.status.toUpperCase()}</p>
        <h3 aria-live={playing?'off':'polite'}>{event?.title}</h3><p>{event?.operation}</p>
        <details open><summary>Request / input</summary><pre>{JSON.stringify(event?.input,null,2)}</pre></details>
        <details open><summary>Response / output</summary><pre>{JSON.stringify(event?.output,null,2)}</pre></details>
      </div>
    </div>
    <div className="jrv-life-trace" aria-label="Execution trace">{events.map((e,i)=><button type="button" key={e.id} aria-pressed={index===i} onClick={()=>{setPlaying(false);setStep(i);}}><span>{String(e.id).padStart(2,'0')}</span>{e.title}<small>{i>index?'Pending':e.status}</small></button>)}</div>
    <div className="jrv-life-results">
      <article><h3>Computed schedule</h3><p>{index>=5&&trace?.eta?trace.eta.dispatchISO+' → '+trace.eta.windowStart+(trace.eta.isWindow?' – '+trace.eta.windowEnd:''):'Awaiting calculation'}</p></article>
      <article><h3>Freight allocation</h3><p>{index>=10&&trace?.shipment?trace.shipment.cartons+' cartons / '+trace.shipment.weightKg+' kg':'No allocation inspected'}</p></article>
      <article><h3>Customer preview</h3><p>{index>=7&&trace?.notice?trace.notice.channel+' · '+trace.notice.estimated:'No notification inspected'}</p><small>Nothing is sent.</small></article>
    </div>
    </>}
  </div>;
}
