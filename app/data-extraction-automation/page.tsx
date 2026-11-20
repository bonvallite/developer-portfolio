import Link from 'next/link';
import type { Metadata } from 'next';
import InteractiveLab from './interactive-lab';

// Public-safe, static editorial case study. No live APIs, credentials, customer
// records, raw client exports or verified business-performance claims.
// Platform favicons are illustrative identifiers loaded from Google favicon service.
// Source-derived on-page examples are abbreviated and sanitised. The linked
// source archive contains owner-supplied Python scripts with known identifiers
// replaced; it is not production-ready or evidence of successful API exports.
// Do not claim Shopify GraphQL was part of these verified extractions.
export const metadata: Metadata = {
  title: '12-Month Ecommerce Data Engineering | Analytics & API Automation',
  description: 'A real-world reporting challenge turned into documented Python, JavaScript and Google API extraction workflows. Explore the architecture, source-safe code and reporting outcomes.',
  alternates: { canonical: '/data-extraction-automation' },
};

const services = [["Shopify","shopify.com","Sales, orders and customers","Available handover data; GraphQL code not verified"],["Google Analytics 4","analytics.google.com","10 Python reporting modules","Source reviewed"],["Search Console","search.google.com","30-output GSC export schema","Source reviewed; notes included"],["Google Ads","ads.google.com","20 JavaScript reporting categories","Source reviewed"],["Bing","bing.com","10 configured Webmaster endpoints","Python client reported"],["Klaviyo","klaviyo.com","Campaign and flow reporting","Aggregated exports available"]];
const stages = [["01","THE REQUEST","One historical baseline, multiple commercial questions","The original brief asked for detailed order, customer, acquisition, paid-media, organic social, email and trading records. It required 12 complete calendar months plus November MTD separately, retaining original IDs, campaign names and metric definitions."],["02","THE PROBLEM","The information lived in disconnected systems","Shopify, Google analytics products, advertising accounts and messaging platforms each expose different dimensions, access models and reporting limitations. Dashboard screenshots could not provide the underlying records needed for reconciliation."],["03","THE ENGINEERING","Separate extraction workflows, one documented handover","Python GA4 and GSC modules, JavaScript Google Ads Scripts and a Bing JSON API client were organised around authentication, paginated requests, chunked queries, CSV exports and audit-friendly manifests. Shopify and Klaviyo data also formed part of the wider handover."],["04","THE RECOVERY WORK","Handle real-world API constraints","Search Console queries required compatible dimension combinations; Discover reporting dropped an unsupported device dimension. URL inspection was given timeout/retry handling. Individual export failures were recorded without discarding the whole reporting run."],["05","THE RESULT","Structured files prepared for analysis","The approach produces source-specific CSV datasets and manifests, allowing analysts to investigate traffic, customer journeys, search visibility and advertising effectiveness. Verified outputs and unfinished coverage are distinguished instead of implying that every planned report succeeded."]];
const examples = [{"title":"GA4 · paginated acquisition","lang":"Python / GA4 Data API","code":"offset = 0\nwhile True:\n    request = RunReportRequest(\n        property=property_path,\n        dimensions=dimensions,\n        metrics=metrics,\n        date_ranges=date_ranges,\n        limit=PAGE_SIZE,\n        offset=offset,\n    )\n    response = client.run_report(request)\n    # Convert dimension and metric values into export rows.\n    offset += len(response.rows)\n    if not response.rows or offset >= response.row_count:\n        break","note":"Sanitised excerpt reconstructed from the supplied GA4 Python modules; does not connect to live accounts."},{"title":"Search Console · 30-day chunks","lang":"Python / Search Analytics API","code":"cur = start_dt\nwhile cur <= end_dt:\n    chunk_end = min(cur + timedelta(days=29), end_dt)\n    rows = query_rows(\n        service, site_url,\n        cur.isoformat(), chunk_end.isoformat(),\n        ['date', 'query', 'page'], 'web'\n    )\n    output.extend(rows)\n    cur = chunk_end + timedelta(days=1)","note":"Generalised from the supplied GSC chunking approach. The original workflow uses 25,000-row startRow pagination."},{"title":"Google Ads · isolated CSV exports","lang":"JavaScript / Google Ads Scripts / GAQL","code":"function runExport(folder, manifest, filename, headers, query, mapFn) {\n  try {\n    const rows = [headers];\n    const report = AdsApp.search(query);\n    while (report.hasNext()) rows.push(mapFn(report.next()));\n    writeCsvToFolder(folder, filename, rows);\n    manifest.push([filename, rows.length - 1, 'OK']);\n  } catch (error) {\n    manifest.push([filename, 0, 'ERROR']);\n  }\n}","note":"Sanitised implementation pattern from the supplied Google Ads code. Google Ads uses GAQL, not Shopify GraphQL."},{"title":"Shopify · commerce extraction interface","lang":"GraphQL / Shopify Admin API","code":"query OrdersForReporting($cursor: String) {\n  orders(first: 100, after: $cursor) {\n    pageInfo { hasNextPage endCursor }\n    edges {\n      node { id createdAt name }\n    }\n  }\n}","note":"Independent illustrative GraphQL example only. A Shopify GraphQL export script for this project has not been supplied or verified."}];
const stack = ['Python', 'JavaScript', 'Google Cloud', 'OAuth 2.0', 'REST APIs', 'Google Ads Scripts', 'GAQL', 'PowerShell', 'CSV / Excel', 'Shopify GraphQL (related skill)'];
const pipeline = [
  ['01 / CONNECT','Authorised access','Google Cloud OAuth, platform permissions and separate credential scopes'],
  ['02 / EXTRACT','API-driven retrieval','GA4 paginated reports, GSC 30-day chunks, Google Ads Scripts and Bing endpoints'],
  ['03 / VERIFY','Fault-aware processing','API dimension compatibility, retries, row counts and per-dataset statuses'],
  ['04 / DELIVER','Organised handover','Separate CSV exports, source manifests, calendar and reporting coverage notes'],
];

export default function DataExtractionAutomationPage() {
  return <main className="case-study">
    
<style>{`.case-study{background:#0b0e12;color:#f4f2ee;min-height:100vh}.case-shell{max-width:1160px;margin:auto;padding:0 28px}.case-hero{padding:86px 0 78px;background:radial-gradient(ellipse at 84% 10%,#b28b4520,transparent 60%)}.case-kicker{color:#d9b47c;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase}.case-hero h1{font-size:clamp(40px,5.4vw,76px);letter-spacing:-2.7px;line-height:1.07;max-width:980px;margin:20px 0}.case-lede{color:#b6b8c1;max-width:760px;font-size:18px;line-height:1.8}.case-actions{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0}.case-button{padding:13px 18px;border-radius:5px;border:1px solid #9d8056;color:#f6e5ca;font-size:13px;font-weight:700}.case-button.case-primary{background:#d9b47c;color:#17120e}.case-caption{font-size:12px;color:#a1a3ad;line-height:1.65}.case-section{padding:76px 0;border-top:1px solid #ffffff18}.case-section h2{font-size:clamp(30px,3.3vw,47px);line-height:1.15;letter-spacing:-1.5px;max-width:850px;margin:12px 0 20px}.case-section-intro{max-width:760px;color:#b6b8c1;line-height:1.85}.case-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:32px}.case-card{background:linear-gradient(150deg,#1a1d22,#111418);border:1px solid #444038;border-radius:12px;padding:24px;min-width:0}.case-card h3{font-size:20px;letter-spacing:-.5px;margin:8px 0}.case-card p{color:#b7b8c0;font-size:14px;line-height:1.75}.case-index{color:#d9b47c;font-size:12px;letter-spacing:1px}.case-platforms{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.case-platform{display:flex;gap:12px;align-items:start;border-radius:11px;border:1px solid #39383a;background:#171a1e;padding:17px;min-width:0}.case-platform img{width:28px;height:28px;object-fit:contain;flex-shrink:0}.case-platform strong{display:block;font-size:14px}.case-platform span{display:block;color:#a9abb4;font-size:12px;margin-top:5px;line-height:1.5}.case-pipeline{margin-top:22px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}.case-node{border:1px solid #775f40;border-radius:12px;padding:22px 16px;background:#201e1b}.case-node span{font-size:11px;letter-spacing:1px;color:#d9b47c}.case-node strong{display:block;margin:10px 0;font-size:15px}.case-node p{color:#b6b6bc;font-size:12px;line-height:1.6;margin:0}.case-tech{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0}.case-tech span{border:1px solid #6e5c43;color:#e8c896;padding:8px 11px;border-radius:4px;font-size:12px}.case-detail{border:1px solid #514738;border-radius:10px;background:#15191d;margin:12px 0;overflow:hidden}.case-detail summary{cursor:pointer;padding:18px 22px;color:#f3dfc0;font-weight:700;list-style-position:inside}.case-detail summary:focus-visible,.case-button:focus-visible{outline:2px solid #e9be7d;outline-offset:3px}.case-detail pre{overflow-x:auto;font-size:12px;line-height:1.7;color:#d4e1d4;background:#0d1014;margin:0;padding:22px}.case-detail p{color:#aaaeba;font-size:13px;line-height:1.7;margin:0;padding:16px 22px}.case-disclaimer{border-left:3px solid #d9b47c;background:#171a1e;padding:20px 24px;color:#bfc0c5;line-height:1.8;font-size:13px}.case-footer{padding:55px 0 85px}.case-footer a{color:#e2bd85;text-decoration:underline}@media(max-width:750px){.case-shell{padding:0 20px}.case-hero{padding:58px 0}.case-section{padding:56px 0}.case-flow,.case-platforms{grid-template-columns:1fr}.case-pipeline{grid-template-columns:repeat(2,minmax(0,1fr))}.case-card{padding:19px}}@media(max-width:410px){.case-pipeline{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.case-study *{scroll-behavior:auto!important;transition:none!important}} 
      /* CSS-only atmospheric hero: GPU-light transforms, no external hero image. */
      .case-cinema{height:278px;position:relative;margin-top:34px;border:1px solid #584631;border-radius:18px;background:radial-gradient(ellipse at 50% 90%,#d4a15525,transparent 64%),linear-gradient(110deg,#11161b,#18191a 50%,#13161a);overflow:hidden;isolation:isolate}
      .case-cinema:before{content:\'\';position:absolute;inset:0;background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);background-size:52px 52px;mask-image:linear-gradient(transparent,#000)}
      .case-cinema-orbit{position:absolute;width:420px;height:420px;border:1px solid #c6a15b8c;border-radius:50%;left:calc(50% - 210px);top:26px;box-shadow:0 0 45px #d9b47c18;animation:case-orbit 10s ease-in-out infinite alternate}
      .case-cinema-glow{position:absolute;width:420px;height:170px;background:#d9b47c22;filter:blur(45px);bottom:-100px;left:calc(50% - 210px)}
      .case-cinema-console{position:absolute;left:calc(50% - 210px);top:33px;width:420px;height:205px;border:1px solid #a27a44;border-radius:12px;background:linear-gradient(135deg,#202329,#090c10);box-shadow:0 23px 65px #0009,0 0 22px #c69a4522;transform:perspective(900px) rotateY(-8deg) rotateX(3deg);padding:16px 18px;animation:case-float 7s ease-in-out infinite}
      .case-cinema-menu,.case-cinema-labels{display:flex;justify-content:space-between;gap:12px;font:700 10px \'Space Grotesk\',sans-serif;color:#e9c18c;letter-spacing:1px}
      .case-cinema-bars{display:flex;align-items:flex-end;gap:9px;height:109px;padding-top:14px}
      .case-cinema-bars i{flex:1;background:linear-gradient(0deg,#765527,#d9b47c);height:25%;border-radius:3px 3px 0 0;opacity:.92}
      .case-cinema-bars i:nth-child(2),.case-cinema-bars i:nth-child(7){height:54%}.case-cinema-bars i:nth-child(3),.case-cinema-bars i:nth-child(10){height:39%}.case-cinema-bars i:nth-child(4),.case-cinema-bars i:nth-child(8){height:70%}.case-cinema-bars i:nth-child(5),.case-cinema-bars i:nth-child(11){height:83%}.case-cinema-bars i:nth-child(6),.case-cinema-bars i:nth-child(12){height:97%}
      .case-cinema-labels{color:#9e9da5;letter-spacing:.5px;border-top:1px solid #ffffff1b;padding-top:9px}
      .case-cinema-float{position:absolute;border:1px solid #8a693e;border-radius:9px;padding:14px 18px;background:#15191edc;color:#cdb28a;font-size:10px;letter-spacing:1px;top:84px;left:10%;box-shadow:0 12px 32px #0005}
      .case-cinema-float b{display:block;font-size:14px;color:#ffe0ae;margin-top:9px}.case-cinema-b{left:auto;right:7%;top:120px}
      @keyframes case-float{0%,100%{transform:perspective(900px) rotateY(-8deg) rotateX(3deg) translateY(0)}50%{transform:perspective(900px) rotateY(-8deg) rotateX(3deg) translateY(-7px)}}
      @keyframes case-orbit{from{transform:scale(.98)}to{transform:scale(1.04)}}
      @media(max-width:750px){.case-cinema{height:200px}.case-cinema-console{width:300px;height:163px;left:calc(50% - 150px);top:20px}.case-cinema-orbit{width:310px;height:310px;left:calc(50% - 155px)}.case-cinema-bars{height:77px;gap:5px}.case-cinema-float{display:none}.case-cinema-labels{font-size:8px}}
      @media(prefers-reduced-motion:reduce){.case-cinema-orbit,.case-cinema-console{animation:none}}
`}</style>
    <header className="case-shell case-hero">
      <Link href="/" style={{color:'#d9b47c',fontSize:13}}>← Back to portfolio</Link>
      <p className="case-kicker" style={{marginTop:50}}>ENGINEERING CASE STUDY / DATA PIPELINES / ECOMMERCE</p>
      <h1>One complex reporting request.<br/><span style={{color:'#d9b47c'}}>A repeatable data pipeline.</span></h1>
      <p className="case-lede">Turning a 12-month ecommerce performance brief into API-driven extraction workflows, traceable CSV datasets and an evidence-led reporting handover.</p>
      <div className="case-actions"><a href="#architecture" className="case-button case-primary">View architecture ↗</a><a href="#source-lab" className="case-button">Explore code ↗</a><a href="#outputs" className="case-button">Review outputs ↗</a></div>
      <p className="case-caption">Python · JavaScript · Google Cloud · Search Console · GA4 · Google Ads · Bing · Shopify reporting</p>
      {/* Cinematic visual built from CSS only, without video or a large download.
          Decorative cards do not claim live API connections or measured uplift. */}
      <div className="case-cinema" aria-hidden="true">
        <div className="case-cinema-orbit"/>
        <div className="case-cinema-glow"/>
        <div className="case-cinema-console">
          <div className="case-cinema-menu"><span>COMMERCE / DATA PIPELINE</span><span>● ● ●</span></div>
          <div className="case-cinema-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <div className="case-cinema-labels"><span>API ACCESS</span><span>EXTRACTION</span><span>CSV OUTPUT</span></div>
        </div>
        <div className="case-cinema-float case-cinema-a">DATA SOURCES <b>06 SERVICES</b></div>
        <div className="case-cinema-float case-cinema-b">PYTHON · GOOGLE CLOUD <b>REPORTING WORKFLOW</b></div>
      </div>
    </header>
    <section className="case-shell case-section" id="story">
      <p className="case-kicker">01 / FROM PROBLEM TO SOLUTION</p>
      <h2>A business needed answers. The data was spread across platforms.</h2>
      <p className="case-section-intro">The brief asked for detailed, joinable underlying records rather than screenshots or dashboard summaries. Its scope included sales and customers, acquisition and conversion, advertising, organic social, email and fulfilment, with 12 full months and current-month data separated. My engineering response focused on repeatable extraction and traceable outputs instead of rebuilding reports manually.</p>
      <div className="case-flow">{stages.map(stage=><article className="case-card" key={stage[0]}><span className="case-index">{stage[0]} / {stage[1]}</span><h3>{stage[2]}</h3><p>{stage[3]}</p></article>)}</div>
    </section>
    <section className="case-shell case-section" id="architecture">
      <p className="case-kicker">02 / HOW THE SYSTEM FITS TOGETHER</p>
      <h2>Multiple sources. Separate extractors. One organised handover.</h2>
      <p className="case-section-intro">Each platform has distinct API capabilities and metric definitions. This diagram shows an extraction architecture, not a live synchronised data warehouse or an assertion that every source was retrieved by Python.</p>
      <div className="case-platforms" aria-label="Source platforms">{services.map(source=><div className="case-platform" key={source[0]}>
        {/* Favicons support recognition; text labels remain visible if external images fail. */}
        <img src={'https://www.google.com/s2/favicons?domain='+source[1]+'&sz=64'} width="28" height="28" alt="" loading="lazy" referrerPolicy="no-referrer" />
        <div><strong>{source[0]}</strong><span>{source[2]}</span><span>{source[3]}</span></div>
      </div>)}</div>
      <div className="case-pipeline" aria-label="Data extraction process">{pipeline.map(node=><div className="case-node" key={node[0]}><span>{node[0]}</span><strong>{node[1]}</strong><p>{node[2]}</p></div>)}</div>
      <div className="case-tech" aria-label="Technologies used and related capabilities">{stack.map(tech=><span key={tech}>{tech}</span>)}</div>
      <p className="case-caption">Execution tooling: the supplied extraction source establishes Python and JavaScript. PowerShell was used in the documented Windows workflow. Bash and Shopify GraphQL remain relevant engineering capabilities, but their direct use in this data extraction has not been verified.</p>
    </section>
    <div className="case-shell"><InteractiveLab /></div>
    <section className="case-shell case-section" id="outputs">
      <p className="case-kicker">04 / DELIVERABLES AND DECISIONS</p>
      <h2>Structured data that can support commercial decisions.</h2>
      <div className="case-flow">
        <article className="case-card"><span className="case-index">GA4 / VERIFIED SOURCE</span><h3>10 Python reporting modules</h3><p>Daily acquisition, device conversion, buyer geography, landing pages, event funnel, products, campaign attribution, new versus returning, promotions and tracking audit.</p></article>
        <article className="case-card"><span className="case-index">GSC / VERIFIED SOURCE</span><h3>30 documented output categories</h3><p>Queries, pages, devices, search types, brand segmentation, monthly keyword movement and selected URL inspections. Some categories contain API-coverage notes instead of underlying extracted metrics.</p></article>
        <article className="case-card"><span className="case-index">GOOGLE ADS / DOCUMENTED SCRIPT</span><h3>20 reporting categories</h3><p>JavaScript Ads Scripts retrieve campaign and creative-level dimensions, save separate CSV files to a timestamped Drive folder and record export status in a manifest.</p></article>
        <article className="case-card"><span className="case-index">BING / PYTHON CLIENT</span><h3>10 configured endpoints</h3><p>Search, query, page, crawl, sitemap and link-report endpoints are represented in a fault-isolated JSON API client. Endpoint coverage and successful rows require manifests to validate.</p></article>
      </div>
      <div className="case-disclaimer" style={{marginTop:24}}><strong style={{color:'#f4e2c3'}}>What is verified, and what is not.</strong><div>These counts represent scripts, designed output categories or configured endpoints. They are not counts of successful exports. The inspected code uses a rolling 365-day period, which differs from the original 12 complete calendar months plus November MTD requirement. GA4 event counts are not a sequential user funnel, and platform attribution metrics are not automatically interchangeable.</div></div>
    </section>
    <footer className="case-shell case-footer"><p className="case-kicker">THE VALUE / ECOMMERCE ENGINEERING</p><h2>Turning fragmented data into a foundation for better decisions.</h2><p className="case-section-intro">The workflow supports SEO prioritisation, acquisition quality reviews, advertising effectiveness, tracking diagnostics and customer analysis, while keeping missing fields visible. Business results require validated extracts and reconciliation rather than assumptions.</p><p><Link href="/python-automation">See related Python engineering →</Link></p><p><Link href="/">Return to portfolio →</Link></p></footer>
  </main>;
}
