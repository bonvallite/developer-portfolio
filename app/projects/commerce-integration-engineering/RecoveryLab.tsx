
'use client';
/** Explicit actions advance a pure in-memory incident model. GSAP highlights
 * the resulting log only; no timer, external writes or actual retries.
 * RecoveryState is declared at the engine boundary so empty initial arrays
 * and null checkpoints retain their full lifecycle types. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {RECOVERY_SCENARIOS,createRecoveryState,recoveryTransition} from '../../../lib/logistics-recovery-demo.mjs';
import './recovery-lab.css';
gsap.registerPlugin(useGSAP);
export default function RecoveryLab(){
 const scope=useRef<HTMLDivElement>(null);
 const [state,setState]=useState<ReturnType<typeof createRecoveryState>>(()=>createRecoveryState());
 const dispatch=(action:string)=>setState(s=>recoveryTransition(s,action));
 const blocked=state.job?.state==='waiting'||state.job?.state==='dead';
 const latest=state.log.at(-1);
 useGSAP(()=>{
  if(!latest)return;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.fromTo('[data-recovery-latest]',{y:6},{y:0,duration:.3,clearProps:'transform'});});
  return()=>mm.revert();
 },{scope,dependencies:[state.log.length,state.scenario],revertOnUpdate:true});
 return <div className="jrv-recovery" ref={scope}>
  <div className="jrv-life-top"><span>RELIABILITY / INCIDENT CONTROL</span><span>PROPOSED RECOVERY DESIGN · LOCAL ONLY</span></div>
  <p className="jrv-recovery-note">This independently implemented model demonstrates possible safeguards, not verified production capabilities. One fictional fulfilment, serial execution, in-memory checkpoints and virtual time; no durable queue or exactly-once guarantee.</p>
  <label>Incident scenario<select value={state.scenario} onChange={e=>setState(createRecoveryState(e.target.value))}>{RECOVERY_SCENARIOS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
  <div className="jrv-recovery-metrics">{[{label:'Virtual clock',value:'T+'+state.now+'s'},{label:'Consignment',value:state.bookingCreated?'Created':'Not created'},{label:'Committed milestone',value:state.carrierStatus??'None'},{label:'Ignored events',value:state.ignored},{label:'Incidents',value:state.incidentCount},{label:'ETA stored',value:state.etaSaved?'Yes':'No'}].map(m=><div key={m.label}><small>{m.label}</small><strong>{m.value}</strong></div>)}</div>
  <div className="jrv-recovery-actions"><button type="button" className="jrv-recovery-primary" disabled={blocked||state.cursor>=state.inbox.length} onClick={()=>dispatch('next')}>Process next event</button><button type="button" onClick={()=>dispatch('advance')}>Advance 30 seconds</button><button type="button" disabled={!state.faultEnabled} onClick={()=>dispatch('restore')}>Restore upstream</button><button type="button" disabled={state.job?.state!=='dead'||state.faultEnabled} onClick={()=>dispatch('admin')}>Administrative replay</button><button type="button" onClick={()=>setState(createRecoveryState(state.scenario))}>Reset incident</button></div>
  <div className="jrv-recovery-grid">
   <div className="jrv-recovery-panel"><h3>Event inbox</h3><div className="jrv-recovery-inbox">{state.inbox.map((e,i)=><div key={i} className={i<state.cursor?'processed':''}><small>{i<state.cursor?'RECEIVED':'QUEUED'} · {e.kind}</small><code>{e.id}</code><span>{e.raw||'—'}</span></div>)}</div></div>
   <div className="jrv-recovery-panel" data-recovery-latest><h3>Current checkpoint</h3><div role="status"><strong>{state.job?.state.toUpperCase()??'READY'}</strong><span>{state.job?.due!=null?'Retry due at T+'+state.job.due+'s':'No scheduled retry'}</span><span>{state.job?'Attempt '+state.job.attempt+' / 3':'No active job'}</span></div><p>{latest?.detail??'Process the next event to begin.'}</p><pre>{JSON.stringify(state.job,null,2)}</pre></div>
  </div>
  <div className="jrv-recovery-grid">
   <div className="jrv-recovery-panel"><h3>Incident audit trail</h3><div className="jrv-recovery-log">{state.log.length?state.log.slice().reverse().map(e=><div key={e.id}><small>T+{e.at}s · {e.status.toUpperCase()}</small><strong>{e.title}</strong><span>{e.detail}</span></div>):<p>No events processed.</p>}</div></div>
   <div className="jrv-recovery-panel"><h3>Accepted mock operations ({state.commits.length})</h3><div className="jrv-recovery-log">{state.commits.map((c,i)=><div key={i}><small>{c.eventId} · T+{c.at}s</small><strong>{c.operation}</strong></div>)}</div><p>Successful steps are not repeated during retries. ETA and carrier jobs are separate in this model.</p></div>
  </div>
  <p className="jrv-recovery-note">Backoff: 30s, then 60s, then dead-letter after the third failed attempt. Example mutation validation errors require manual repair. Production must reconcile ambiguous provider outcomes and implement atomic durable claims, queue policies and authorised administrative operations. No notification is sent.</p>
 </div>;
}
