import Link from 'next/link';

export const metadata = {
  title: 'Python Automation & Reusable Skills | Developer Portfolio',
  description: 'Public-safe Python automation, offline fictional FAQ retrieval, Samsung Health CSV ingestion and Jupyter notebook review.',
};

const github = 'https://github.com/bonvallite/developer-portfolio';
export default function PythonAutomationPage() {
  return <main className="container" style={{maxWidth:920,paddingTop:72,paddingBottom:100}}>
    <Link href="/" style={{textDecoration:'underline'}}>← Back to portfolio</Link>
    <p className="overline" style={{marginTop:48}}>PYTHON / AUTOMATION / AI PROTOTYPES</p>
    <h1>Python automation, from notebooks to reusable workflows.</h1>
    <p>Independent, public-safe examples of data ingestion, CSV processing, source-grounded FAQ retrieval and technical documentation. No actual health records, private company datasets or production credentials are published.</p>
    <h2>Samsung Health CSV merger</h2>
    <p>A local Python and Pandas utility that reads Samsung export CSVs, handles a common extra-title-row format, retains source provenance and writes an error report. Mixed datasets remain distinct measurements; concatenation is not a time-aligned health analysis.</p>
    <p><a href={github + '/tree/main/projects/samsung-health-csv-merger'} target="_blank" rel="noopener noreferrer">Explore the Python merger source →</a></p>
    <h2>Offline FAQ retrieval demonstration</h2>
    <p>An independently authored Python CLI searches fictional moon-library documents, returns verbatim answers with document and section attribution, and explicitly handles unsupported questions, ambiguous sources and retrieval limits. Automated tests run without AI services, credentials or model downloads.</p>
    <p>Keyword ranking suggests relevant sources; only curated question wordings can produce an answer. This is a conservative retrieval example, with no generated responses or claim of semantic understanding.</p>
    <p><a href={github + '/tree/main/projects/fictional-faq-retrieval'} target="_blank" rel="noopener noreferrer">Run the fictional FAQ demo and read its architecture →</a></p>
    <h2>Jupyter notebook review</h2>
    <p>Exercises progressed from variables and loops through functions, object-oriented programming, CSV processing, sentiment classification and FAQ chatbot prototypes. The published notes identify correctness issues and distinguish static review from model execution tests.</p>
    <p><a href={github + '/tree/main/projects/python-notebook-review'} target="_blank" rel="noopener noreferrer">Read notebook review notes →</a></p>
    <h2>Reusable Python automation skill</h2>
    <p>A documented workflow for converting notebook experiments and CSV scripts into reproducible, privacy-conscious portfolio projects. Includes a sample CLI and a publication checklist. The GitHub skill is source documentation, not a hosted Python execution service.</p>
    <p><a href={github + '/tree/main/skills/python-automation-portfolio'} target="_blank" rel="noopener noreferrer">View the reusable skill on GitHub →</a></p>
    <p style={{marginTop:48,fontSize:14,opacity:.8}}>Security note: All shared examples use generalised logic; source exports and personally identifying information remain private.</p>
  </main>;
}

