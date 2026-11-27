
'use client';
/** Local API workbench. Read-only request definitions, editable variables and
 * method/fault controls. No network transport; animation follows execution. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {OPERATIONS,QUERIES,FAULTS,executeApiDemo} from '../../../lib/logistics-api-demo.mjs';
import './api-playground.css';
gsap.registerPlugin(useGSAP);
const pretty=(x:unknown)=>JSON.stringify(x,null,2);
export default function ApiPlayground(){
 const scope=useRef<HTMLDivElement>(null),generation=useRef(0);
 const initial=OPERATIONS.find(o=>o.id==='estimate')!;
 const [operation,setOperation]=useState(initial.id),[method,setMethod]=useState(initial.method),[raw,setRaw]=useState(pretty(initial.body)),[fault,setFault]=useState('none'),[result,setResult]=useState<Awaited<ReturnType<typeof executeApiDemo>>|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState(false);
 const op=OPERATIONS.find(o=>o.id===operation)??initial;
 const query=QUERIES[operation as keyof typeof QUERIES];
 const reset=()=>{generation.current++;setResult(null);setBusy(false);setError('');setCopied(false);};
 const select=(id:string)=>{const next=OPERATIONS.find(o=>o.id===id)??initial;setOperation(next.id);setMethod(next.method);setRaw(pretty(next.body));setFault('none');reset();};
 async function execute(){
  const id=++generation.current;setBusy(true);setResult(null);setError('');
  try{const output=await executeApiDemo({operation,method,raw,fault});if(id===generation.current)setResult(output);}
  catch(e){if(id===generation.current)setError(e instanceof Error?e.message:'Local execution failed.');}
  finally{if(id===generation.current)setBusy(false);}
 }
 useGSAP(()=>{
  if(!result)return;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.fromTo('[data-api-result]',{y:6},{y:0,duration:.3,clearProps:'transform'});gsap.fromTo('[data-api-step]',{x:5},{x:0,stagger:.05,duration:.2,clearProps:'transform'});});
  return()=>mm.revert();
 },{scope,dependencies:[result],revertOnUpdate:true});
 const request={method,path:op.path,headers:{'Content-Type':'application/json',...(op.auth==='none'?{}:{'X-Demo-Auth':op.auth+' fixture (local only)'})},...(method==='POST'?{body:raw}:{})};
 return <div ref={scope} className="jrv-api">
 <div className="jrv-life-top"><span>DEVELOPER / API WORKBENCH</span><span>IN-PROCESS TRANSPORT · NO NETWORK</span></div>
 <p className="jrv-api-note">Choose a fictional endpoint, edit JSON, and execute the local handler. The GraphQL documents are illustrative, fixed examples; the mock validates a subset of variables, not the full Shopify schema. Never enter real credentials or customer data.</p>
 <div className="jrv-api-controls"><label>API operation<select value={operation} onChange={e=>select(e.target.value)}>{OPERATIONS.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label><label>HTTP method<select value={method} onChange={e=>{setMethod(e.target.value);reset();}}><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select></label><label>Response scenario<select value={fault} onChange={e=>{setFault(e.target.value);reset();}}>{FAULTS.filter(f=>query||!['graphql','user'].includes(f[0])).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label></div>
 <div className="jrv-api-route"><strong>{method}</strong><code>{op.path}</code><span>LOCAL ALIAS</span></div>
 <details><summary>Request headers (generated demo fixtures)</summary><pre>{pretty(request.headers)}</pre></details>
 <div className="jrv-api-workspace">
 <div className="jrv-api-panel"><h3>{query?'GraphQL request':'Request body'}</h3>{query&&<details open><summary>Mutation document</summary><pre>{query}</pre></details>}{op.method==='POST'?<label>{query?'Editable GraphQL variables':'Editable JSON body'}<textarea maxLength={16000} spellCheck={false} value={raw} onChange={e=>{setRaw(e.target.value);reset();}}/></label>:<p>No body is used for this local GET operation.</p>}<div className="jrv-api-actions"><button type="button" onClick={()=>{setRaw(pretty(op.body));reset();}}>Reset JSON</button><button type="button" onClick={()=>{if(navigator.clipboard)void navigator.clipboard.writeText(pretty(request)).then(()=>setCopied(true)).catch(()=>setCopied(false));}}>{copied?'Copied':'Copy local request'}</button><button type="button" className="jrv-api-send" onClick={()=>void execute()} disabled={busy}>{busy?'Executing…':'Execute locally'}</button></div></div>
 <div className="jrv-api-panel" data-api-result><h3>Mock response</h3><div role="status">{result?<><strong>HTTP {result.http} · {result.accepted?'ACCEPTED':'NOT ACCEPTED'}</strong><span>External requests: {result.externalRequests} · Messages sent: 0</span></>:<span>Awaiting execution.</span>}</div>{error&&<p role="alert">{error}</p>}<pre>{result?pretty(result.body):'No response yet.'}</pre></div>
 </div>
 <div className="jrv-api-trace" aria-label="Local API execution trace">{result?.trace.map(s=><div data-api-step key={s.id}><small>{String(s.id).padStart(2,'0')} · {s.status.toUpperCase()}</small><strong>{s.name}</strong><span>{s.detail}</span></div>)}</div>
 <p className="jrv-api-note">HTTP 200 can still contain GraphQL errors or mutation userErrors. A mock accepted response is not evidence of a production write, notification or delivered shipment.</p>
 </div>;
}
