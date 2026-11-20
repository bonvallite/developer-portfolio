import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileDown, FilePenLine, Printer } from 'lucide-react';
import { contact, summary, skills, experience, projects, education } from '../resume-data';
export function generateStaticParams(){return [{design:'classic'},{design:'modern'},{design:'ats'}];}
// Keep the two designs synchronized through a common data module, including
// the owner-approved February 2026 career transition and American English.
export default async function ResumePreview({params}:{params:Promise<{design:string}>}){
 const {design}=await params;if(design!=='classic'&&design!=='modern'&&design!=='ats')notFound();
 const classic=design==='classic';
 return <main className={'resume-preview '+(classic?'is-classic':'is-modern')}><div className="resume-preview-tools"><Link href="/resume"><ArrowLeft size={15}/> Résumé downloads</Link><div><a href={'/resume/'+design+'/pdf'}><FileDown size={16}/> Download {classic?'Classic':'ATS-Friendly'} PDF</a><a href={'/resume/'+design+'/word'}><FilePenLine size={16}/> Editable Word</a><span className="resume-print-label"><Printer size={16}/> Browser Print / Save as PDF available</span></div></div>
 <article className={'resume-paper '+(classic?'paper-classic':'paper-modern')}>
  <header className="resume-paper-header"><span className="resume-monogram">JRV</span><h1>{contact.name}</h1><h2>{contact.title}</h2><p>{contact.focus}</p><div className="resume-contact"><a href={'mailto:'+contact.email}>{contact.email}</a><a href={'tel:'+contact.phone.replace(/\s/g,'')}>{contact.phone}</a><a href={'https://'+contact.portfolio}>{contact.portfolio}</a><a href={'https://'+contact.linkedin}>{contact.linkedin}</a></div></header>
  <div className="resume-paper-grid"><div className="resume-main-col">
   <section><h3>Professional Profile</h3><p>{summary}</p></section>
   <section><h3>Professional Experience</h3>{experience.map(job=><div className="resume-job" key={job.employer}><div className="resume-job-top"><h4>{job.employer} <span> | {job.role}</span></h4><small>{job.dates}</small></div><ul>{job.bullets.map(b=><li key={b}>{b}</li>)}</ul></div>)}</section>
   <section><h3>Selected Technical Projects</h3>{projects.map(p=><div className="resume-job" key={p.name}><h4>{p.name}</h4><small>{p.stack}</small><p>{p.detail}</p></div>)}</section>
   <section><h3>Education</h3>{education.map(e=><p key={e.name}><strong>{e.name}</strong> — {e.detail}</p>)}</section>
  </div><aside className="resume-sidebar"><section><h3>Core Capabilities</h3><ul>{skills.map(x=><li key={x}>{x}</li>)}</ul></section><section><h3>Professional Links</h3><p><a href={'https://'+contact.portfolio}>{contact.portfolio}</a></p><p><a href={'https://'+contact.github}>{contact.github}</a></p><p><a href={'https://'+contact.linkedin}>{contact.linkedin}</a></p></section></aside></div>
 </article><p className="resume-preview-footnote">Public, owner-approved résumé · American English · Last updated November 2026</p></main>;
}
