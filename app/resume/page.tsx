import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Download, FileText, FilePenLine } from 'lucide-react';

// Only two primary downloads are offered. The ATS-friendly version uses a
// standard, single-column reading order; Classic retains the teal design.
// Word files and online previews remain secondary, accessible links.
// Career content is defined once in resume-data.ts. No generator names appear
// in either the user-facing page or the exported file's descriptive metadata.
const choices = [
  {
    label: 'ATS-Friendly Résumé',
    number: '01',
    route: 'modern',
    note: 'Recommended for online job applications',
    description: 'A clean, single-column layout with selectable text, conventional headings, and no tables or graphics in the downloadable document.',
    className: 'modern',
  },
  {
    label: 'Classic Résumé',
    number: '02',
    route: 'classic',
    note: 'Traditional résumé design',
    description: 'An original-inspired teal layout for direct applications, introductions, and sharing with employers.',
    className: 'classic',
  },
] as const;

export default function ResumeIndex() {
 return <main className="resume-index"><div className="resume-index-wrap">
  <Link href="/" className="resume-back"><ArrowLeft size={16}/> Back to JRV portfolio</Link>
  <p className="resume-eyebrow">JRV / RÉSUMÉS</p>
  <h1>Your next role.<br/><em>Two ways to apply.</em></h1>
  <p className="resume-lead">Choose a résumé format. Both reflect the same current experience and use American English.</p>
  <section className="resume-choice-grid" aria-label="Download a résumé">
   {choices.map((item) => <article className="resume-choice-card resume-download-card" key={item.route}>
     <span className="resume-choice-number">{item.number} / {item.note}</span>
     <div className={'resume-choice-icon '+item.className}><FileText size={26} aria-hidden="true"/></div>
     <h2>{item.label}</h2>
     <p>{item.description}</p>
     <a className="resume-action resume-action-primary" href={'/resume/'+item.route+'/pdf'}>
       <Download size={17} aria-hidden="true"/> Download {item.route==='modern'?'ATS-Friendly':'Classic'} Résumé
     </a>
     <div className="resume-secondary-links">
       <Link href={'/resume/'+item.route}>View online <ArrowUpRight size={14}/></Link>
       <a href={'/resume/'+item.route+'/word'}><FilePenLine size={14}/> Editable Word</a>
     </div>
   </article>)}
  </section>
  <p className="resume-privacy-note">The online previews and files are public and contain contact details. Search engines are requested not to index these pages or downloads, but the links are not private.</p>
 </div></main>;
}