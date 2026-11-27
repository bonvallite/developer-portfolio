
'use client';
/** Schematic freight movement follows the selected computed trace. GSAP
 * animates visual positions only; manual navigation works without motion.
 * 27 Nov: explicitly type trace event callbacks at the JS/TS boundary. */
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {PROFILES} from '../../../lib/logistics-lifecycle-demo.mjs';
import {buildFreightJourney} from '../../../lib/logistics-freight-demo.mjs';
import './freight-journey.css';
gsap.registerPlugin(useGSAP);
const stops=[100,245,375,505,645];
const stages=['Production','Carrier depot','Transit','Last mile','Customer'];
export default function FreightJourney(){
 const scope=useRef<HTMLDivElement>(null);
 const [profile,setProfile]=useState('fnq'),[weight,setWeight]=useState(42),[method,setMethod]=useState('shipping'),[fault,setFault]=useState('none'),[index,setIndex]=useState(0),[playing,setPlaying]=useState(false),[replay,setReplay]=useState(0);
 const reset=()=>{setIndex(0);setPlaying(false);};
 const journey=buildFreightJourney({profile,weight,method,fault});
 const last=journey.steps.length-1,current=Math.min(index,last),step=journey.steps[current],previous=journey.steps[Math.max(0,current-1)];
 const packed=journey.steps.findIndex(s=>s.id==='packing'),showCartons=packed>=0&&current>=packed;
 const booked=journey.steps.findIndex(s=>s.id==='consignment'),showRef=booked>=0&&current>=booked&&Boolean(journey.reference);
 const moving=step.position>0, x=stops[step.position]??stops[0], prevX=stops[previous.position]??stops[0];
 useEffect(()=>{if(!playing)return;if(current>=last){setPlaying(false);return;}const t=window.setTimeout(()=>setIndex(n=>Math.min(n+1,last)),1800);return()=>window.clearTimeout(t);},[playing,current,last]);
 useGSAP(()=>{
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   if(moving)gsap.fromTo('[data-freight-truck]',{x:prevX-x},{x:0,duration:.85,ease:'power2.inOut',clearProps:'transform'});
   if(step.id==='packing')gsap.fromTo('[data-freight-carton]',{y:12,opacity:.45},{y:0,opacity:1,stagger:.055,duration:.35,clearProps:'transform,opacity'});
   if(step.events.some((e:{title:string})=>e.title.startsWith('Carrier scan:')))gsap.fromTo('[data-freight-scan]',{scale:.65,opacity:.2},{scale:1,opacity:1,duration:.4,transformOrigin:'center',clearProps:'transform,opacity'});
  });
  return()=>mm.revert();
 },{scope,dependencies:[current,profile,weight,method,fault,replay],revertOnUpdate:true});
 return <div ref={scope} className="jrv-freight">
  <div className="jrv-life-top"><span>OPERATIONS / PHYSICAL LOGISTICS</span><span>SCHEMATIC · NO GPS OR SENSOR DATA</span></div>
  <p className="jrv-freight-note">Change a synthetic shipment and inspect its computed freight path. The 20 kg allocation is illustrative; actual carton packing, cold-chain compliance and vehicle routing are not established by this demonstration.</p>
  <div className="jrv-freight-controls">
   <label>Destination profile<select value={profile} onChange={e=>{setProfile(e.target.value);reset();}}>{PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
   <label>Order weight: {weight} kg<input type="range" min="0" max="200" step="1" value={weight} onChange={e=>{setWeight(Number(e.target.value));reset();}}/></label>
   <label>Delivery method<select value={method} onChange={e=>{setMethod(e.target.value);reset();}}><option value="shipping">External cold-chain</option><option value="pickup">Store pickup</option><option value="local">In-house local (intended)</option><option value="giftcard">Gift card only</option></select></label>
   <label>Carrier scenario<select value={fault} onChange={e=>{setFault(e.target.value);reset();}}><option value="none">Normal handover</option><option value="carrier">Carrier API unavailable</option></select></label>
  </div>
  <div className="jrv-freight-scene">
   <svg viewBox="0 0 760 300" role="img" aria-label="Illustrative production, packing, carrier depot, transit, last mile and customer. Truck position represents a selected lifecycle step, not geographic tracking.">
    <path className="jrv-freight-road" d="M65 220H700"/><path className="jrv-freight-road-line" d="M65 220H700"/>
    {stops.map((sx,i)=><g key={i}><circle cx={sx} cy="220" r="6" className={i<=step.position&&moving?'jrv-freight-stop reached':'jrv-freight-stop'}/><text className="jrv-freight-label" x={sx} y="261">{stages[i]}</text></g>)}
    <g className="jrv-freight-building" transform="translate(27 55)">
     <path d="M0 36L66 0L132 36V126H0Z"/><rect x="14" y="56" width="42" height="70"/><rect x="75" y="56" width="42" height="30"/><text x="66" y="24">PRODUCTION</text>
    </g>
    <g className="jrv-freight-building" transform="translate(181 66)">
     <path d="M0 22L64 0L128 22V115H0Z"/><rect x="14" y="43" width="100" height="72"/><path d="M14 63H114M14 83H114M14 103H114"/><text x="64" y="18">{showCartons?journey.warehouse:'DEPOT'}</text>
    </g>
    <g className="jrv-freight-building" transform="translate(601 78)">
     <path d="M0 35L44 0L88 35V103H0Z"/><rect x="33" y="61" width="22" height="42"/><rect x="10" y="46" width="18" height="18"/><text x="44" y="29">HOME</text>
    </g>
    {showCartons&&!moving&&journey.cartons.slice(0,10).map((c,i)=><g key={c.id} transform={'translate('+(335+(i%5)*32)+' '+(97+Math.floor(i/5)*43)+')'}><g data-freight-carton className="jrv-freight-carton"><rect width="27" height="26" rx="2"/><path d="M13 0V26"/><text x="13.5" y="37">{c.kg} kg</text></g></g>)}
    {moving&&<g transform={'translate('+x+' 0)'}><g data-freight-truck className="jrv-freight-truck">
     <rect x="-55" y="153" width="75" height="49" rx="4"/><path className="cab" d="M20 163H42L60 182V202H20Z"/><path className="window" d="M30 168H41L49 181H30Z"/><circle className="wheel" cx="-35" cy="204" r="10"/><circle className="wheel" cx="43" cy="204" r="10"/><text x="-17" y="175">CHILLED</text><text x="-17" y="190">{journey.cartons.length} CTN</text>
    </g></g>}
    {step.events.some((e:{title:string})=>e.title.startsWith('Carrier scan:'))&&<g transform={'translate('+x+' 0)'}><g data-freight-scan className="jrv-freight-scan"><circle cx="0" cy="120" r="19"/><path d="M-8 120L-2 126L9 114"/><text x="0" y="94">SCAN RECORDED</text></g></g>}
    <text className="jrv-freight-legend" x="20" y="286">EMBER / PHYSICAL FREIGHT · TEAL / DIGITAL EVENT</text>
   </svg>
  </div>
  <div className="jrv-freight-actions"><button type="button" onClick={reset}>Reset journey</button><button type="button" disabled={current===0} onClick={()=>{setPlaying(false);setIndex(current-1);}}>Previous freight step</button><button type="button" className="jrv-freight-play" onClick={()=>{if(playing){setPlaying(false);return;}if(current===last)setIndex(0);setPlaying(true);}}>{playing?'Pause journey':'Play journey'}</button><button type="button" disabled={current===last} onClick={()=>{setPlaying(false);setIndex(current+1);}}>Next freight step</button><button type="button" onClick={()=>{setPlaying(false);setReplay(n=>n+1);}}>Replay motion</button></div>
  <div className="jrv-freight-metrics"><div><span>Allocated cartons</span><strong data-freight-count>{showCartons?journey.cartons.length:'Pending'}</strong></div><div><span>Example warehouse</span><strong>{showCartons?journey.warehouse:'Pending'}</strong></div><div><span>Consignment</span><strong>{showRef?journey.reference:'Not created'}</strong></div><div><span>Computed ETA</span><strong>{journey.eta?journey.eta.windowStart+(journey.eta.isWindow?' – '+journey.eta.windowEnd:''):'Unavailable'}</strong></div></div>
  <div className="jrv-freight-steps" aria-label="Freight journey stages">{journey.steps.map((s,i)=><button type="button" key={s.id} aria-pressed={current===i} onClick={()=>{setPlaying(false);setIndex(i);}}><small>{String(i+1).padStart(2,'0')} · {s.status}</small>{s.title}</button>)}</div>
  <div className="jrv-freight-inspector"><p className="jrv-freight-note" role="status">STEP {current+1} / {journey.steps.length} · {step.status.toUpperCase()}</p><h3>{step.title}</h3><p>{step.detail}</p>{showCartons&&<p>Illustrative carton weights: {journey.cartons.map(c=>c.kg+' kg').join(' + ')} = {weight} kg.</p>}<details open><summary>Associated digital events ({step.events.length})</summary><pre>{step.events.length?JSON.stringify(step.events.map((e:{operation:string;input:unknown;output:unknown;status:string})=>({operation:e.operation,input:e.input,output:e.output,status:e.status})),null,2):'No external carrier event.'}</pre></details></div>
  <p className="jrv-freight-note">Physical milestones are separate from digital updates. All locations, tracking references and vehicle movements are schematic; no actual consignment, proof of delivery or message is generated.</p>
 </div>;
}
