
'use client';
/** Shared SVG topology for the interactive trace and the read-only tour.
 * Unique marker IDs prevent two diagrams from referencing the wrong SVG. */
import {useId} from 'react';
const nodes=[{id:'shopify',x:20,y:30,w:170,h:68,title:'Shopify Store',sub:'Orders · fulfilments'},{id:'app',x:490,y:30,w:170,h:68,title:'Custom Shopify App',sub:'OAuth · Admin API'},{id:'worker',x:235,y:155,w:210,h:152,title:'Cloudflare Worker',sub:'Trust · rules · routing'},{id:'holiday',x:20,y:190,w:170,h:62,title:'Holiday adapter',sub:'Cache · fallback'},{id:'carrier',x:490,y:190,w:170,h:62,title:'CartonCloud',sub:'Consignment · scans'},{id:'notice',x:20,y:350,w:170,h:65,title:'Shopify notifications',sub:'Liquid · email / SMS'},{id:'fleet',x:490,y:350,w:170,h:65,title:'Cold-chain fleet',sub:'Physical freight'}];
const edges=[{id:'shopify-worker',d:'M105 98 V132 H270 V155'},{id:'worker-app',d:'M410 155 V130 H575 V98'},{id:'app-shopify',d:'M490 64 H190'},{id:'worker-holiday',d:'M235 211 H190'},{id:'holiday-worker',d:'M190 237 H235'},{id:'worker-carrier',d:'M445 203 H490'},{id:'carrier-worker',d:'M490 239 H445'},{id:'shopify-notice',d:'M40 98 H8 V382 H20'},{id:'carrier-fleet',d:'M575 252 V350'},{id:'fleet-carrier',d:'M620 350 V252'}];

export default function LifecycleTopology({activeEdges,activeNodes,module}:{activeEdges:string[];activeNodes:string[];module?:string}){
 const marker=useId().replace(/:/g,'');
 return <svg className="jrv-life-svg" viewBox="0 0 680 445" role="img" aria-label="Shopify sends events to the Worker; the app authorises Shopify writes; CartonCloud and holidays exchange with the Worker; fleet and notification boundaries remain separate.">
 <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="currentColor"/></marker></defs>
 {edges.map(p=><path key={p.id} data-edge={p.id} d={p.d} className={'jrv-life-edge '+(activeEdges.includes(p.id)?'active':'')+(p.id.includes('fleet')?' physical':'')} markerEnd={'url(#'+marker+')'}/>)}
 {nodes.map(n=><g key={n.id} className={'jrv-life-node '+(n.id==='worker'?'worker ':'')+(activeNodes.includes(n.id)?'active':'')}>
 <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="9"/><text x={n.x+n.w/2} y={n.y+25}>{n.title}</text><text className="sub" x={n.x+n.w/2} y={n.y+44}>{n.sub}</text>
 {n.id==='worker'&&['A / Delivery & holidays','B / Fulfilment gatekeeper','C / Tracking mapper'].map((t,i)=><g key={t} className={['eta','pack','track'][i]===module?'active-module':''}><rect className="worker-module" x="245" y={212+i*27} width="190" height="22" rx="4"/><text className="sub" x="340" y={227+i*27}>{t}</text></g>)}
 </g>)}
 <circle data-packet r="6" cx="0" cy="0" className="jrv-life-packet"/>
 </svg>;
}
