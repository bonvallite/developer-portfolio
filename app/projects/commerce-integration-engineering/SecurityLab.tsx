
'use client';
/** Explicit execution produces local results before GSAP animates selected
 * steps. No redirect, cookie, provider credential, persistent KV or request. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {SECURITY_MODES,runSecurityDemo} from '../../../lib/logistics-security-demo.mjs';
import './security-lab.css';
gsap.registerPlugin(useGSAP,MotionPathPlugin);
const positions=[{id:'client',x:12,y:45,w:125,title:'Event / merchant'},{id:'worker',x:177,y:45,w:130,title:'Worker guard'},{id:'api',x:350,y:45,w:125,title:'Mock API'},{id:'kv',x:177,y:145,w:130,title:'Local KV model'}];
const edges=[{id:'client-worker',d:'M137 75H177'},{id:'worker-api',d:'M307 67H350'},{id:'api-worker',d:'M350 88H307'},{id:'worker-kv',d:'M242 105V145'}];
export default function SecurityLab(){
 const scope=useRef<HTMLDivElement>(null);
 const [mode,setMode]=useState('webhook'),[scenario,setScenario]=useState('valid'),[body,setBody]=useState('{"reference":"DEMO-001","topic":"orders/create"}'),[result,setResult]=useState<Awaited<ReturnType<typeof runSecurityDemo>>|null>(null),[index,setIndex]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const generation=useRef(0),config=SECURITY_MODES.find(m=>m.id===mode)??SECURITY_MODES[0],event=result?.steps[index];
 const edge=event?event.from+'-'+event.to:'';
 const reset=()=>{generation.current++;setResult(null);setIndex(0);setError('');setBusy(false);};
 async function execute(){
  const id=++generation.current;setBusy(true);setError('');setResult(null);setIndex(0);
  try{const output=await runSecurityDemo({mode,scenario,body});if(id===generation.current)setResult(output);}
  catch(e){if(id===generation.current)setError(e instanceof Error?e.message:'Local execution failed.');}
  finally{if(id===generation.current)setBusy(false);}
 }
 useGSAP(()=>{
  if(!event)return;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
    const host=scope.current,path=host?.querySelector<SVGPathElement>('[data-security-edge="'+edge+'"]'),packet=host?.querySelector<SVGCircleElement>('[data-security-packet]');
    if(path&&packet)gsap.fromTo(packet,{opacity:0},{opacity:1,motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:.65,ease:'power1.inOut'});
    gsap.fromTo('[data-security-output]',{y:5},{y:0,duration:.25,clearProps:'transform'});
  });
  return()=>mm.revert();
 },{scope,dependencies:[result,index],revertOnUpdate:true});
 return <div className="jrv-security" ref={scope}>
 <div className="jrv-life-top"><span>TRUST BOUNDARY / SECURITY LAB</span><span>WEB CRYPTO · LOCAL SIMULATION</span></div>
 <p className="jrv-security-note">Real HMAC-SHA256 signing and verification use a public teaching key. OAuth, cookie checks, KV expiry, Basic and Bearer authorisation use local fixtures. No production credentials, redirects, cookies or external calls.</p>
 <div className="jrv-security-controls">
 <label>Authentication flow<select value={mode} onChange={e=>{setMode(e.target.value);setScenario('valid');reset();}}>{SECURITY_MODES.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
 <label>Security scenario<select value={scenario} onChange={e=>{setScenario(e.target.value);reset();}}>{config.scenarios.map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></label>
 </div>
 {mode==='webhook'&&<label className="jrv-security-body">Synthetic raw webhook body<textarea value={body} maxLength={16000} onChange={e=>{setBody(e.target.value);reset();}} spellCheck={false}/><small>Use fictional data only. Verification signs the exact bytes; the tampering scenario appends a space.</small></label>}
 <button type="button" className="jrv-security-run" onClick={()=>void execute()} disabled={busy}>{busy?'Verifying locally…':'Execute security test'}</button>
 {error&&<p role="alert">{error}</p>}
 <div className="jrv-security-grid">
 <div>
 <svg viewBox="0 0 490 220" role="img" aria-label="Local event source, Worker authentication guard, mock API and local KV model">
 {edges.map(p=><path key={p.id} data-security-edge={p.id} d={p.d} className={'jrv-life-edge '+(edge===p.id?'active':'')}/>)}
 {positions.map(n=><g key={n.id} className={'jrv-life-node '+(n.id==='worker'?'worker ':'')+(event&&(event.from===n.id||event.to===n.id)?'active':'')}><rect x={n.x} y={n.y} width={n.w} height="60" rx="7"/><text x={n.x+n.w/2} y={n.y+34}>{n.title}</text></g>)}
 <circle r="5" data-security-packet className="jrv-life-packet"/>
 </svg>
 <div className="jrv-security-result" role="status">{result?<><strong>{result.accepted?'ACCEPTED':'REJECTED'} · HTTP {result.http} (mock)</strong><span>{result.reason}</span><span>Offline grant stored: {result.credentialStored?'Yes (local model)':'No'} · External requests: {result.externalRequests}</span></>:<span>Ready — execute a local security test.</span>}</div>
 </div>
 <div data-security-output className="jrv-security-output"><h3>{event?.title??'Execution inspector'}</h3><p>{event?.status.toUpperCase()??'Awaiting execution'}</p><details open><summary>Input</summary><pre>{event?JSON.stringify(event.input,null,2):'No request yet'}</pre></details><details open><summary>Result</summary><pre>{event?JSON.stringify(event.output,null,2):'No result yet'}</pre></details></div>
 </div>
 <div className="jrv-security-steps" aria-label="Security execution trace">{result?.steps.map((s,i)=><button type="button" key={s.id} aria-pressed={index===i} onClick={()=>setIndex(i)}><small>{String(s.id).padStart(2,'0')} · {s.status}</small>{s.title}</button>)}</div>
 <p className="jrv-security-note">Select any completed step to inspect its input and output. Rejections terminate the trace. The replay example models consume-once state before any code exchange; it does not prove distributed atomicity or production replay protection.</p>
 </div>;
}
