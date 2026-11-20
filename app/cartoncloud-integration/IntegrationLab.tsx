'use client';
/**
 * Public-safe, entirely local illustration of an integration event lifecycle.
 * Stages are educational, not a live API trace or evidence of production success.
 * No network calls, customer identifiers, credentials or internal payloads.
 */
import { useState } from 'react';
import { ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import './integration-lab.css';

const stages = [
  { title:'Shopify order event', system:'Shopify', detail:'An order or fulfilment event initiates an integration workflow. The sample event contains no real order details.' },
  { title:'Authenticate and verify', system:'Cloudflare Worker', detail:'Validate the incoming webhook and required authorisation before processing. Invalid events must be rejected.' },
  { title:'Map the consignment', system:'Integration layer', detail:'Resolve a corresponding consignment and normalise the event into the destination system’s expected format.' },
  { title:'Receive logistics update', system:'CartonCloud', detail:'Handle a hypothetical tracking milestone or delivery estimate; retries and duplicate events require safeguards.' },
  { title:'Write back to Shopify', system:'Cloudflare Worker', detail:'Apply an authorised order, fulfilment or metafield update, and check the write result.' },
  { title:'Observe and recover', system:'Diagnostics', detail:'Record an anonymised outcome and investigate failures or retry safely. A completed illustration does not prove real-world reliability.' },
] as const;

export default function IntegrationLab(){
  const [step,setStep]=useState(0);
  const [failure,setFailure]=useState(false);
  const current=stages[step];
  return <section className="jrv-integration-lab" aria-labelledby="integration-lab-title">
    <div className="jrv-integration-lab__intro"><span>INTERACTIVE ENGINEERING LAB / SIMULATED</span><h2 id="integration-lab-title">Follow one fulfilment event.</h2><p>Inspect how a conceptual Shopify–CartonCloud event moves through the custom application. This is a fictional, step-driven walkthrough, not a production connection.</p></div>
    <div className="jrv-integration-lab__grid">
      <div className="jrv-integration-lab__steps" role="group" aria-label="Integration processing stages">
        {stages.map((s,i)=><button type="button" key={s.title} aria-pressed={step===i} className={step===i?'is-selected':''} onClick={()=>setStep(i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{s.title}</strong><ArrowRight size={15} aria-hidden="true"/></button>)}
      </div>
      <div className="jrv-integration-lab__detail" aria-live="polite">
        <span>STAGE {String(step+1).padStart(2,'0')} / {stages.length} · {current.system}</span>
        <h3>{current.title}</h3><p>{current.detail}</p>
        <div className="jrv-integration-lab__event"><ShieldCheck size={20} aria-hidden="true"/><div><strong>{failure?'SIMULATED FAILURE':'SIMULATED EVENT'}</strong><p>{failure?'The integration must stop or retry safely, record diagnostics and avoid claiming the Shopify write succeeded.':'No real webhook, consignment or customer information is processed in this demo.'}</p></div></div>
        <label className="jrv-integration-lab__toggle"><input type="checkbox" checked={failure} onChange={e=>setFailure(e.target.checked)}/> Explore a failure scenario</label>
        <div className="jrv-integration-lab__actions"><button type="button" onClick={()=>setStep(s=>Math.min(stages.length-1,s+1))} disabled={step===stages.length-1}>Next stage <ArrowRight size={16}/></button><button type="button" onClick={()=>{setStep(0);setFailure(false)}}><RotateCcw size={15}/> Reset</button></div>
      </div>
    </div>
    <p className="jrv-integration-lab__caveat">The architecture is intentionally simplified. Authentication, mapping, retries and persistence must be verified against authorised implementation evidence before making production guarantees.</p>
  </section>;
}
