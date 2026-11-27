
'use client';
/** Explicit local execution only: a function selection loads a fixture, and
 * Run invokes the allowlisted module. Motion highlights the result, not state. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {FUNCTIONS,executeFunction} from '../../../lib/worker-function-lab.mjs';
import './worker-function-lab.css';
gsap.registerPlugin(useGSAP);
const pretty=(v:unknown)=>JSON.stringify(v,null,2);
export default function WorkerFunctionLab(){
 const scope=useRef<HTMLDivElement>(null);
 const [selected,setSelected]=useState(FUNCTIONS[0].id);
 const fn=FUNCTIONS.find(f=>f.id===selected)??FUNCTIONS[0];
 const [input,setInput]=useState(pretty(FUNCTIONS[0].example));
 const [result,setResult]=useState<ReturnType<typeof executeFunction>|null>(null);
 const [run,setRun]=useState(0);
 const load=(value:unknown)=>{setInput(pretty(value));setResult(null);};
 useGSAP(()=>{
  if(!run||!result)return;
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.fromTo('[data-function-result]',{y:6},{y:0,duration:.28,ease:'power2.out',clearProps:'transform'});
    gsap.fromTo('[data-function-line]',{scaleX:0},{scaleX:1,duration:.45,ease:'power2.out',transformOrigin:'left center'});
  });
  return()=>media.revert();
 },{scope,dependencies:[run,result],revertOnUpdate:true});
 return <div className="jrv-function-lab" ref={scope}>
  <div className="jrv-life-top"><span>WORKER / FUNCTION INSPECTOR</span><span>11 EXECUTABLE LOCAL EXAMPLES</span></div>
  <p className="jrv-function-note">Select a function, edit its fictional JSON input, and run it. Code excerpts explain the pattern; the execution uses independently authored demo modules, not private production code.</p>
  <div className="jrv-function-layout">
   <nav aria-label="Worker example functions" className="jrv-function-list">
    {FUNCTIONS.map(f=><button key={f.id} type="button" aria-pressed={f.id===selected} onClick={()=>{setSelected(f.id);load(f.example);}}><small>{f.group}</small><strong>{f.name}()</strong></button>)}
   </nav>
   <div className="jrv-function-main">
    <h3>{fn.name}()</h3><p>{fn.purpose}</p>
    <div className="jrv-function-pipeline" aria-label="Input to function to output"><span>JSON input</span><span data-function-line aria-hidden="true"/><span>Validated function</span><span data-function-line aria-hidden="true"/><span>Result</span></div>
    <div className="jrv-function-actions"><button type="button" onClick={()=>load(fn.example)}>Load normal example</button><button type="button" onClick={()=>load(fn.edge)}>Load edge case</button></div>
    <div className="jrv-function-grid">
     <div><label htmlFor="jrv-function-input">Editable JSON input</label><textarea id="jrv-function-input" spellCheck={false} maxLength={16000} value={input} onChange={e=>{setInput(e.target.value);setResult(null);}}/></div>
     <div data-function-result><span className="jrv-function-label">Execution output</span><div role="status" className="jrv-function-status">{result?(result.ok?'Function executed — inspect returned decision':'Input or validation error'):'Ready — no execution yet'}</div><pre>{result?pretty(result):'Run function to inspect output.'}</pre></div>
    </div>
    <button type="button" className="jrv-function-run" onClick={()=>{setResult(executeFunction(selected,input));setRun(n=>n+1);}}>Run function</button>
    <details open><summary>Illustrative JavaScript excerpt</summary><pre>{fn.code}</pre></details>
   </div>
  </div>
 </div>;
}
