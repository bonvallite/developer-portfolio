import './resume.css';
import type { Metadata } from 'next';
// Résumé pages intentionally expose approved personal details, but should not
// be included in search indexing. This does not make a public URL private.
export const metadata: Metadata = {
 title:'ATS-Friendly & Classic Résumé Downloads | JRV',
 description:'Choose an ATS-friendly or classic professional résumé. Download a PDF or editable Word document.',
 robots:{index:false,follow:false,noarchive:true},
};
export default function ResumeLayout({children}:{children:React.ReactNode}){return <div className="resume-site">{children}</div>;}
