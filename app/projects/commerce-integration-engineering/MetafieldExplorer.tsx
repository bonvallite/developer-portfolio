
'use client';
/** A local schema inspector: snapshot and mutation attempt are independent.
 * GSAP decorates selection only, not a write; no network or notifications. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {PROFILES} from '../../../lib/logistics-lifecycle-demo.mjs';
import {SCHEMA,STAGES,buildMetafieldSnapshot} from '../../../lib/logistics-metafield-demo.mjs';
import './metafield-explorer.css';
gsap.registerPlugin(useGSAP);
const groups=['All fields',...new Set(SCHEMA.map(f=>f.group))];
const mutation='mutation SetOrderMetafields($metafields: [MetafieldsSetInput!]!) {\n  metafieldsSet(metafields: $metafields) {\n    metafields { namespace key type value }\n    userErrors { field message }\n  }\n}';
export default function MetafieldExplorer(){
 const scope=useRef<HTMLDivElement>(null);
 const [profile,setProfile]=useState('fnq'),[orderedAt,setOrderedAt]=useState('2026-11-27T10:30'),[closureDate,setClosureDate]=useState(''),[stage,setStage]=useState('eta'),[etaAccepted,setEtaAccepted]=useState(true),[trackingAccepted,setTrackingAccepted]=useState(true),[group,setGroup]=useState('All fields'),[query,setQuery]=useState(''),[selected,setSelected]=useState(SCHEMA[0].key);
 let result:ReturnType<typeof buildMetafieldSnapshot>|null=null,error='';
 try{result=buildMetafieldSnapshot({profile,orderedAt,closureDate,stage,etaAccepted,trackingAccepted});}catch(e){error=e instanceof Error?e.message:'Invalid input';}
 const rows=result?.rows??[];
 const filtered=rows.filter(r=>(group==='All fields'||r.group===group)&&('custom.'+r.key).includes(query.trim().toLowerCase()));
 const active=filtered.find(r=>r.key===selected)??filtered[0];
 useGSAP(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.fromTo('[data-meta-detail]',{y:6},{y:0,duration:.25,clearProps:'transform'});});
  return()=>mm.revert();
 },{scope,dependencies:[stage,selected,group,query,profile,orderedAt,closureDate,etaAccepted,trackingAccepted],revertOnUpdate:true});
 return <div className="jrv-meta" ref={scope}>
  <div className="jrv-life-top"><span>SHOPIFY / ORDER DATA CONTRACT</span><span>29 DOCUMENTED KEYS · LOCAL MODEL</span></div>
  <p className="jrv-meta-note">These are the documented field names, with independently reconstructed values and illustrative types where not corroborated by the earlier public reference. No real merchant schema, rate table, order or write is queried. Null means unset, not a deletion request.</p>
  <div className="jrv-meta-controls">
   <label>Delivery profile<select value={profile} onChange={e=>setProfile(e.target.value)}>{PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
   <label>Brisbane order time<input type="datetime-local" value={orderedAt} onChange={e=>setOrderedAt(e.target.value)}/></label>
   <label>Fictional closure<input type="date" value={closureDate} onChange={e=>setClosureDate(e.target.value)}/></label>
   <label className="jrv-meta-check"><input type="checkbox" checked={etaAccepted} onChange={e=>setEtaAccepted(e.target.checked)}/> ETA write accepted</label>
   <label className="jrv-meta-check"><input type="checkbox" checked={trackingAccepted} onChange={e=>setTrackingAccepted(e.target.checked)}/> Selected tracking write accepted</label>
  </div>
  <div className="jrv-meta-stages" aria-label="Metafield lifecycle stage">{STAGES.map(s=><button key={s.id} type="button" aria-pressed={stage===s.id} onClick={()=>setStage(s.id)}>{s.label}</button>)}</div>
  {error?<p role="alert">{error}</p>:result&&<>
   <div className="jrv-meta-counts"><div><strong>22</strong><span>ETA keys</span></div><div><strong>7</strong><span>Tracking keys</span></div><div><strong>{rows.filter(r=>r.value!==null).length}</strong><span>Stored in local snapshot</span></div></div>
   <div className="jrv-meta-controls"><label>Field group<select value={group} onChange={e=>setGroup(e.target.value)}>{groups.map(g=><option key={g}>{g}</option>)}</select></label><label>Search metafields<input type="search" placeholder="delivery_window" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
   <div className="jrv-meta-workspace">
    <div className="jrv-meta-list" aria-label="Metafield keys">{filtered.map(r=><button type="button" key={r.key} aria-pressed={active?.key===r.key} onClick={()=>setSelected(r.key)}><code>custom.{r.key}</code><small>{r.state} · {r.type}</small></button>)}{!filtered.length&&<p>No matching fields.</p>}</div>
    <div className="jrv-meta-detail" data-meta-detail>{active?<>
     <span className="jrv-meta-kicker">{active.group} / {active.state}</span><h3>custom.{active.key}</h3>
     <dl><dt>Type</dt><dd>{active.type} · {active.typeEvidence}</dd><dt>Source</dt><dd>{active.source}</dd><dt>Potential consumer</dt><dd>{active.consumer}</dd><dt>Write operation</dt><dd>metafieldsSet · {active.phase==='eta'?'Order creation':'Carrier milestone'}</dd></dl>
     <div className="jrv-meta-values"><div><span>Previous</span><pre>{active.previous??'Unset'}</pre></div><div><span>Attempted</span><pre>{active.attempted??'No write'}</pre></div><div><span>Stored locally</span><pre>{active.value??'Unset'}</pre></div></div>
     <details><summary>Illustrative Liquid access</summary><pre>{'{{ order.metafields.custom.'+active.key+'.value }}'}</pre><p>Example only; actual template scope and conditional rendering require store-side verification.</p></details>
    </>:<p>Select a matching field.</p>}</div>
   </div>
   <details className="jrv-meta-mutation"><summary>GraphQL mutation and variables ({result.variables.metafields.length} attempted fields)</summary><pre>{mutation}</pre><pre>{JSON.stringify(result.variables,null,2)}</pre><p role="status">{result.accepted===null?'No mutation attempted.':result.accepted?'Simulated write accepted.':'Simulated write rejected; prior stored values retained.'}</p><p>Placeholder owner ID and illustrative types. Not an executable production request.</p></details>
   <div className="jrv-meta-preview"><span className="jrv-meta-kicker">LIQUID / CUSTOMER DATA PREVIEW</span><h3>{result.preview.eta??'No stored delivery estimate'}</h3>{result.preview.holiday&&<p>{result.preview.holiday}</p>}<p>{result.preview.status??'No carrier status stored'}</p><p>{result.preview.tracking?'Fictional tracking link available':'Tracking link not available'}</p><small>Preview only. No message is sent.</small></div>
  </>}
 </div>;
}
