import { pdf, docx } from '../../resume-export';
import type { Design } from '../../resume-export';
export const runtime='nodejs';
export const dynamic='force-dynamic';
// Direct PDF and Word downloads are generated from one data source, so the
// online previews and attachments share identical dates, contact and employers.
export async function GET(_request:Request,{params}:{params:Promise<{design:string;format:string}>}){
 const {design,format}=await params;
 if((design!=='classic'&&design!=='modern'&&design!=='ats')||(format!=='pdf'&&format!=='word'))return new Response('Not found',{status:404});
 // /resume/ats is the descriptive public URL. /resume/modern remains an alias
 // for existing bookmarks, but all new exports use ATS-Friendly filenames.
 // The public filename is descriptive; no local paths or editing-tool claims.
 const exportDesign: Design = design==='classic'?'classic':'modern';
 const bytes=format==='pdf'?pdf(exportDesign):docx(exportDesign);
 return new Response(Buffer.from(bytes),{headers:{
  'Content-Type':format==='pdf'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'Content-Disposition': 'attachment; filename="JRV-Resume-'+(design==='classic'?'Classic':'ATS-Friendly')+'-2026.'+(format==='pdf'?'pdf':'docx')+'"',
  'X-Robots-Tag':'noindex, noarchive',
  'Cache-Control':'public, max-age=3600',
  'Content-Length':String(bytes.length)
 }});
}
