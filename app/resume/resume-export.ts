// Server-only résumé exports, using one source of approved career information.
// Both downloadable designs use a legible single-column reading order and
// predictable page margins. ATS avoids decoration; Classic uses an ivory
// editorial masthead, teal typography and subtle gold rules without overlays.
// PDF Info and DOCX core properties identify the document owner and actual
// export service, never a fictitious human editor or third-party application.
// Validate text extraction, reading order, format and metadata after release.
import { deflateRawSync } from 'node:zlib';
import { contact, summary, skills, experience, projects, education } from './resume-data';
export type Design = 'classic' | 'modern';
const encoder = new TextEncoder();
const esc = (s:string) => s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\u2022/g,'-').replace(/[^\x20-\x7e]/g,' ');
const xml = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
type Line = {t:string;bold?:boolean;kind?:'title'|'sub'|'head'|'body'|'bullet'|'small'};
function lines():Line[] {
 const out:Line[]=[];
 out.push({t:contact.name,kind:'title',bold:true},{t:contact.title,kind:'sub',bold:true},{t:contact.focus,kind:'small'});
 out.push({t:contact.email+'  |  '+contact.phone+'  |  '+contact.portfolio,kind:'small'});
 out.push({t:contact.linkedin+'  |  '+contact.github,kind:'small'});
 out.push({t:'PROFESSIONAL PROFILE',kind:'head',bold:true},{t:summary,kind:'body'});
 out.push({t:'CORE CAPABILITIES',kind:'head',bold:true},...skills.map(t=>({t:'• '+t,kind:'bullet' as const})));
 out.push({t:'PROFESSIONAL EXPERIENCE',kind:'head',bold:true});
 for(const job of experience){
  out.push({t:job.employer+'  |  '+job.role,kind:'sub',bold:true},{t:job.dates,kind:'small'});
  out.push(...job.bullets.map(t=>({t:'• '+t,kind:'bullet' as const})));
 }
 out.push({t:'SELECTED TECHNICAL PROJECTS',kind:'head',bold:true});
 for(const p of projects)out.push({t:p.name+'  |  '+p.stack,kind:'sub',bold:true},{t:'• '+p.detail,kind:'bullet'});
 out.push({t:'EDUCATION',kind:'head',bold:true},...education.map(t=>({t:t.name+'  |  '+t.detail,kind:'body' as const})));
 return out;
}
function split(text:string,max:number):string[]{
 const words=esc(text).split(/\s+/),ret:string[]=[];let cur='';
 for(const w of words){if((cur+' '+w).trim().length>max&&cur){ret.push(cur);cur=w;}else cur=(cur+' '+w).trim();}
 if(cur)ret.push(cur);return ret;
}
function rgb(hex:string){const n=parseInt(hex.replace('#',''),16);return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255].map(x=>x.toFixed(3)).join(' ');}
export function pdf(design:Design):Uint8Array{
 const modern=design==='modern',accent=modern?'#273746':'#125b61',dark='#202b33';
 const pages:string[][]=[];let cmds:string[]=[];let y=744;let count=0;
 function rect(x:number,yy:number,w:number,h:number,col:string){cmds.push(rgb(col)+' rg '+x+' '+yy+' '+w+' '+h+' re f');}
 function rule(x:number,yy:number,w:number,col:string){rect(x,yy,w,1,col);}
 function drawText(x:number,yy:number,t:string,size:number,bold=false,color=dark){cmds.push(rgb(color)+' rg BT /'+(bold?'F2':'F1')+' '+size+' Tf 1 0 0 1 '+x+' '+yy+' Tm ('+esc(t)+') Tj ET');}
 // Both exports use a single reading column. The old Classic export painted a
 // decorative sidebar over the text area without positioning content inside it.
 // A restrained full-width header replaces it and never obscures body text.
 function init(){cmds=[];y=744;count++;
  if(count===1){
   if(modern){rule(44,758,524,'#283746');}
   else{rect(0,776,612,16,'#125b61');rect(44,637,524,1,'#cfdbd8');rect(44,635,62,3,'#c5a06b');drawText(44,759,'JRV  /  PROFESSIONAL PROFILE',8,true,'#125b61');}
  }else{
   rule(44,760,524,accent);
   drawText(44,769,'JRV  /  PROFESSIONAL RESUME',8,true,accent);
   y=733;
  }
 }
 function finish(){drawText(44,30,'JRV  /  '+(modern?'ATS-FRIENDLY':'CLASSIC')+'  /  '+count,8,false,accent);pages.push(cmds);init();}
 init();
 for(const row of lines()){
  const isTitle=row.kind==='title',isHead=row.kind==='head',isSub=row.kind==='sub';
  if(isTitle){
    y=modern?722:726;
    drawText(44,y,row.t,modern?22:25,true,modern?dark:'#173c41');
    y-=27;continue;
  }
  // Classic uses dark text on white throughout; only the masthead ribbon is filled.
  const size=row.kind==='small'?8.7:isHead?10.1:isSub?10.2:row.kind==='bullet'?9.4:9.6;
  const max=modern?105:101;
  const chunks=split(row.t,max),gap=13.1;
  const reserve=(isHead?18:0)+chunks.length*gap+6;
  if(y-reserve < 55)finish();
  if(isHead){
    y-=13;
    rule(44,y-8,524,modern?'#d3dce1':'#a3cdca');
    drawText(44,y,row.t,size,true,accent);
    y-=20;continue;
  }
  for(const chunk of chunks){
    const color=row.kind==='small'?'#53616b':(!modern&&isSub&&count===1?'#125b61':dark);
    drawText(44+(row.kind==='bullet'?11:0),y,chunk,size,Boolean(row.bold),color);
    y-=gap;
  }
  y-=row.kind==='bullet'?2:isSub?4:6;
 }
 drawText(44,30,'JRV  /  '+(modern?'ATS-FRIENDLY':'CLASSIC')+'  /  '+count,8,false,accent);
 pages.push(cmds);
 const objects:string[]=[];
 const add=(s:string)=>{objects.push(s);return objects.length;};
 // Metadata attributes actual ownership and production to JRV; no invented editor.
 const meta=(s:string)=>'('+esc(s)+')';
 const info=add('<< /Title '+meta(contact.name+' - '+(modern?'ATS-Friendly':'Classic')+' Resume 2026')+
  ' /Author '+meta(contact.name)+
  ' /Subject '+meta('Shopify Developer and Ecommerce Manager - Professional Resume')+
  ' /Keywords '+meta('Shopify, Ecommerce, CRO, Systems Integration')+
  ' /Creator '+meta('JRV Portfolio Resume Export')+
  ' /Producer '+meta('JRV Portfolio Resume Export')+' >>');
 const root=add('');const kids=add('');const font1=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');const font2=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
 const ids:number[]=[];
 for(const page of pages){
  const stream=page.join('\n')+'\n';
  const len=encoder.encode(stream).length;
  const cs=add('<< /Length '+len+' >>\nstream\n'+stream+'endstream');
  const id=add('<< /Type /Page /Parent '+kids+' 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 '+font1+' 0 R /F2 '+font2+' 0 R >> >> /Contents '+cs+' 0 R >>');
  ids.push(id);
 }
 objects[root-1]='<< /Type /Catalog /Pages '+kids+' 0 R >>';
 objects[kids-1]='<< /Type /Pages /Kids ['+ids.map(x=>x+' 0 R').join(' ')+'] /Count '+ids.length+' >>';
 let data='%PDF-1.4\n',offsets=[0];let byteLen=encoder.encode(data).length;
 for(let i=0;i<objects.length;i++){offsets.push(byteLen);const s=(i+1)+' 0 obj\n'+objects[i]+'\nendobj\n';data+=s;byteLen+=encoder.encode(s).length;}
 const xref=byteLen;data+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objects.length+1)+' /Root '+root+' 0 R /Info '+info+' 0 R >>\nstartxref\n'+xref+'\n%%EOF';
 return encoder.encode(data);
}
function crc32(data:Uint8Array){let c=0xffffffff;for(const b of data){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function zip(files:{name:string;body:string}[]):Uint8Array{
 const locals:Uint8Array[]=[];const central:Uint8Array[]=[];let off=0;
 function u16(d:DataView,i:number,n:number){d.setUint16(i,n,true);}
 function u32(d:DataView,i:number,n:number){d.setUint32(i,n,true);}
 for(const f of files){
  const name=encoder.encode(f.name),plain=encoder.encode(f.body),def=deflateRawSync(plain),crc=crc32(plain);
  const h=new Uint8Array(30+name.length),v=new DataView(h.buffer);u32(v,0,0x04034b50);u16(v,4,20);u16(v,8,8);u32(v,14,crc);u32(v,18,def.length);u32(v,22,plain.length);u16(v,26,name.length);h.set(name,30);locals.push(h,def);
  const ch=new Uint8Array(46+name.length),cv=new DataView(ch.buffer);u32(cv,0,0x02014b50);u16(cv,4,20);u16(cv,6,20);u16(cv,10,8);u32(cv,16,crc);u32(cv,20,def.length);u32(cv,24,plain.length);u16(cv,28,name.length);u32(cv,42,off);ch.set(name,46);central.push(ch);off+=h.length+def.length;
 }
 const cdSize=central.reduce((n,b)=>n+b.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);u32(v,0,0x06054b50);u16(v,8,files.length);u16(v,10,files.length);u32(v,12,cdSize);u32(v,16,off);
 const chunks=[...locals,...central,end],buf=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0));let p=0;for(const b of chunks){buf.set(b,p);p+=b.length;}return buf;
}
export function docx(design:Design):Uint8Array{
 const isClassic=design==='classic',accent=isClassic?'125B61':'273746';
 const pars=lines().map(r=>{
  const style=r.kind==='title'?'Title':r.kind==='head'?'Heading1':r.kind==='sub'?'Heading2':'Normal';
  const bold=r.bold?'<w:b/>':'';
  return '<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r><w:rPr>'+bold+'</w:rPr><w:t xml:space="preserve">'+xml(r.t)+'</w:t></w:r></w:p>';
 }).join('');
 const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'+
  '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="20"/></w:rPr><w:pPr><w:spacing w:after="110"/></w:pPr></w:style>'+
  '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:color w:val="'+accent+'"/><w:sz w:val="42"/></w:rPr></w:style>'+
  '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:color w:val="'+accent+'"/><w:sz w:val="22"/></w:rPr><w:pPr><w:spacing w:before="260" w:after="115"/></w:pPr></w:style>'+
  '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:sz w:val="21"/></w:rPr><w:pPr><w:spacing w:before="150" w:after="75"/></w:pPr></w:style></w:styles>';
 const doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+pars+'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="900" w:right="1000" w:bottom="900" w:left="1000"/></w:sectPr></w:body></w:document>';
 return zip([
 {name:'[Content_Types].xml',body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'},
 {name:'_rels/.rels',body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'},
 {name:'word/_rels/document.xml.rels',body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
 {name:'word/document.xml',body:doc},{name:'word/styles.xml',body:styles},
 {name:'docProps/core.xml',body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
  '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
  '<dc:title>'+xml(contact.name+' - '+(isClassic?'Classic':'ATS-Friendly')+' Resume 2026')+'</dc:title>'+
  '<dc:subject>Professional resume - Shopify Developer and Ecommerce Manager</dc:subject>'+
  '<dc:creator>'+xml(contact.name)+'</dc:creator>'+
  '<cp:lastModifiedBy>'+xml(contact.name)+'</cp:lastModifiedBy>'+
  '<cp:keywords>Shopify, Ecommerce, CRO, Systems Integration</cp:keywords></cp:coreProperties>'},
 {name:'docProps/app.xml',body:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
  '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>JRV Portfolio Resume Export</Application></Properties>'}
 ]);
}
