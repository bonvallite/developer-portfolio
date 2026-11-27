
'use client';
/** ScrollTrigger observes native scrolling; it never pins or drives order
 * execution. The static chapter list is server-visible and keyboard reachable.
 * The shared graph displays the selected read-only example trace. */
import {useRef,useState} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import LifecycleTopology from './LifecycleTopology';
import {buildTour} from '../../../lib/logistics-tour.mjs';
import './lifecycle-studio.css';
import './lifecycle-tour.css';
gsap.registerPlugin(useGSAP,ScrollTrigger,MotionPathPlugin);
const chapters=buildTour();
export default function LifecycleTour(){
 const scope=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(0);
 const chapter=chapters[active];
 const activeNodes=[...new Set<string>(chapter.events.flatMap((e:{from:string;to:string})=>[e.from,e.to]).concat(chapter.edges.flatMap((e:string)=>e.split('-'))))];
 useGSAP(()=>{
   const media=gsap.matchMedia();
   media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)',()=>{
     const cards=scope.current?.querySelectorAll<HTMLElement>('[data-tour-chapter]');
     cards?.forEach((card,i)=>ScrollTrigger.create({trigger:card,start:'top 62%',end:'bottom 62%',onEnter:()=>setActive(i),onEnterBack:()=>setActive(i)}));
   });
   return()=>media.revert();
 },{scope});
 useGSAP(()=>{
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
     const host=scope.current,packet=host?.querySelector<SVGCircleElement>('[data-packet]');
     if(!host||!packet||!chapter.edges.length)return;
     const sequence=gsap.timeline();
     for(const id of chapter.edges){
       const path=host.querySelector<SVGPathElement>('[data-edge="'+id+'"]');
       if(path)sequence.fromTo(packet,{opacity:0},{opacity:1,motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:.48,ease:'power1.inOut'});
     }
   });
   return()=>media.revert();
 },{scope,dependencies:[active],revertOnUpdate:true});
 return <div ref={scope} className="jrv-tour">
  <div className="jrv-tour-layout">
   <div className="jrv-tour-visual">
    <div className="jrv-life-top"><span>ARCHITECTURE / READ-ONLY TOUR</span><span>CHAPTER {String(chapter.id).padStart(2,'0')} / 14</span></div>
    <LifecycleTopology activeEdges={chapter.edges} activeNodes={activeNodes} module={chapter.module}/>
    <h3>{chapter.title}</h3><p>{chapter.detail}</p>
    <div className="jrv-tour-payload"><span>EVENT OUTPUTS · LOCAL EXAMPLE</span><pre>{JSON.stringify(chapter.events.map((e:{operation:string;output:unknown})=>({operation:e.operation,output:e.output})),null,2)}</pre></div>
    <div className="jrv-tour-controls"><button type="button" disabled={active===0} onClick={()=>setActive(i=>i-1)}>Previous chapter</button><button type="button" disabled={active===13} onClick={()=>setActive(i=>i+1)}>Next chapter</button></div>
   </div>
   <div className="jrv-tour-chapters">
    {chapters.map((c,i)=><article key={c.id} data-tour-chapter={c.id} className={active===i?'active':''}>
     <span className="jrv-tour-number">{String(c.id).padStart(2,'0')} / {c.module.toUpperCase()}</span>
     <h3>{c.title}</h3><p>{c.detail}</p>
     <ul>{c.events.map((e:{id:number;operation:string})=><li key={e.id}>{e.operation}</li>)}</ul>
     <button type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>Inspect chapter {c.id}</button>
    </article>)}
   </div>
  </div>
  <p className="jrv-life-caption">Scroll on desktop or select chapters manually on any device. Teal paths carry data; orange paths represent physical freight. This read-only tour is an independent example, not a production trace.</p>
 </div>;
}
