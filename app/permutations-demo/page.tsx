"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Code2 } from "lucide-react";
import { lexicographicPermutations } from "../../lib/lexicographic-permutations.mjs";

// Public educational example. Never fetches data, sends input to a server, or
// claims ownership of the original debugging exercise.
const source = "https://github.com/bonvallite/developer-portfolio/tree/feature/lexicographic-permutations-20261024/projects/lexicographic-permutations";

export default function PermutationsDemo() {
  const [input, setInput] = useState("abc");
  const { items, error } = useMemo(() => {
    try {
      return { items: lexicographicPermutations(input), error: "" };
    } catch (problem) {
      return { items: [] as string[], error: problem instanceof Error ? problem.message : "Invalid input." };
    }
  }, [input]);

  function downloadResults() {
    if (!items.length) return;
    const contents = items.join("\n") + "\n";
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "permutations-" + [...input].sort().join("") + ".txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return <main className="container" style={{maxWidth:1000,paddingTop:70,paddingBottom:110}}>
    <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:8,textDecoration:"underline"}}><ArrowLeft size={17}/> Back to portfolio</Link>
    <p className="overline" style={{marginTop:50}}>ALGORITHMS / C / JAVASCRIPT / BACKTRACKING</p>
    <h1 style={{fontSize:"clamp(38px,6vw,66px)",lineHeight:1.12,marginTop:16}}>Lexicographic permutations<span style={{color:"#d3aa73"}}>.</span></h1>
    <p style={{fontSize:17,lineHeight:1.8,color:"#aeb3c1",maxWidth:750}}>An interactive exploration of recursion and backtracking, paired with a C debugging exercise. Each selected character index must be released before the next branch is explored.</p>
    <div style={{background:"#151a23",border:"1px solid #343b49",borderRadius:14,padding:"clamp(18px,4vw,34px)",marginTop:36}}>
      <label htmlFor="permutation-input" style={{display:"block",fontWeight:700,marginBottom:12}}>Enter 1–7 lowercase letters</label>
      <input id="permutation-input" value={input} onChange={e=>setInput(e.target.value)} maxLength={8} spellCheck={false}
        style={{width:"100%",maxWidth:380,padding:"13px 15px",borderRadius:8,background:"#0b0e12",border:"1px solid #606777",color:"#fff",fontSize:18}}/>
      <p style={{color:"#aeb3c1",fontSize:13,marginTop:11}}>The demo sorts the characters before generating results. Repeated characters create repeated output lines because their positions are distinct.</p>
      {error ? <p role="alert" style={{color:"#ffb7a8",marginTop:16}}>{error}</p> : <>
        <p aria-live="polite" style={{marginTop:26,fontSize:16}}><strong>{items.length.toLocaleString("en-AU")}</strong> permutations generated</p>
        <pre style={{maxHeight:340,overflow:"auto",background:"#0b0e12",border:"1px solid #343b49",borderRadius:10,padding:18,fontSize:14,lineHeight:1.6}}>{items.slice(0,60).join("\n")}{items.length>60 ? "\n… ("+(items.length-60).toLocaleString("en-AU")+" more lines in the download)" : ""}</pre>
        <button type="button" onClick={downloadResults} style={{display:"inline-flex",alignItems:"center",gap:9,border:0,borderRadius:8,padding:"13px 18px",color:"#0b0e12",background:"#d9b47c",fontWeight:700,cursor:"pointer"}}><Download size={18}/> Download full output (.txt)</button>
      </>}
    </div>
    <section style={{marginTop:44}}>
      <h2 style={{fontSize:28}}>The debugging lesson</h2>
      <p style={{lineHeight:1.8,color:"#b5b8c2"}}>The recursive C program uses a bitmask to track which character indices are currently selected. After visiting a branch, the program decreases the running length and clears the corresponding bit. Without that reset, later branches incorrectly consider the character permanently used.</p>
      <pre style={{overflow:"auto",background:"#151a23",border:"1px solid #343b49",padding:20,borderRadius:10,fontSize:15}}>bitmask &amp;= ~(1 &lt;&lt; i);</pre>
      <a href={source} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:9,marginTop:20,textDecoration:"underline"}}><Code2 size={20}/> View C source and 5,040-line example output <ArrowUpRight size={17}/></a>
      <p style={{fontSize:13,color:"#9ea2ae",marginTop:28}}>Educational debugging exercise, not employer code or a production service. The browser generator is independently implemented in JavaScript, and input never leaves your device.</p>
    </section>
  </main>;
}
