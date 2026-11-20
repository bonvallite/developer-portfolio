import { pdf, docx } from '../../resume-export';
import type { Design } from '../../resume-export';
export const runtime='nodejs';
export const dynamic='force-dynamic';
// Direct PDF and Word downloads are generated from one data source, so the
// online previews and attachments share identical dates, contact and employers.
export async function GET(_request:Request,{params}:{params:Promise<{design:string;format:string}>}){
 const {design,format}=await params;
 if((design!=='classic'&&design!=='modern')||(format!=='pdf'&&format!=='word'))return new Response('Not found',{status:404});
 // The public filename is descriptive; no local paths or editing-tool claims.
 const bytes=format==='pdf'?pdf(design as Design):docx(design as Design);
 return new Response(Buffer.from(bytes),{headers:{
  'Content-Type':format==='pdf'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'Content-Disposition': 'attachment; filename="JRV-Resume-'+(design==='classic'?'Classic':'Modern')+'-2026.'+(format==='pdf'?'pdf':'docx')+'"',
  'X-Robots-Tag':'noindex, noarchive',
  'Cache-Control':'public, max-age=3600',
  'Content-Length':String(bytes.length)
 }});
}
