import './resume.css';
import type { Metadata } from 'next';
// Résumé pages intentionally expose approved personal details, but should not
// be included in search indexing. This does not make a public URL private.
export const metadata: Metadata = {
 title:'Résumé Designs | JRV',
 description:'Choose between two professional résumé designs and download PDF or editable Word versions.',
 robots:{index:false,follow:false,noarchive:true},
};
export default function ResumeLayout({children}:{children:React.ReactNode}){return <div className="resume-site">{children}</div>;}
