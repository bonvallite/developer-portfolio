"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Code2, RotateCcw, Layers3, MousePointer2 } from "lucide-react";
import { lessons, questions, gradeCssAnswers } from "../../lib/css-lab.mjs";
import styles from "./css-lab.module.css";

const categories = ["All", "Selectors", "Box model", "Positioning", "Layout", "Responsive", "Visibility"] as const;
type Category = (typeof categories)[number];
type Lesson = {id:string; category:string; title:string; summary:string; code:string; detail:string};
type Quiz = {id:string; topic:string; prompt:string; options:string[]; correct:number; reason:string};
type Visibility = "visible" | "hidden" | "none" | "transparent";

const allLessons = lessons as Lesson[];
const allQuestions = questions as Quiz[];

export default function CssLabPage() {
  const [category, setCategory] = useState<Category>("All");
  const [padding, setPadding] = useState(20);
  const [borderBox, setBorderBox] = useState(true);
  const [visibility, setVisibility] = useState<Visibility>("visible");
  const [clicks, setClicks] = useState(0);
  const [actionClicked, setActionClicked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  const filtered = useMemo(
    () => allLessons.filter(topic => category === "All" || topic.category === category),
    [category]
  );
  const score = useMemo(() => gradeCssAnswers(answers), [answers]);
  const contentWidth = 250 - 2 * (padding + 4);
  const outerWidth = borderBox ? 250 : 250 + 2 * (padding + 4);

  return <main className={styles.page}>
    <div className="container">
      <Link href="/" className={styles.back}><ArrowLeft size={16}/> Back to portfolio</Link>
      <section className={styles.hero} aria-labelledby="css-lab-title">
        <div className={styles.heroCopy}>
          <span className="overline">INTERACTIVE LEARNING / CSS ENGINEERING</span>
          <h1 id="css-lab-title">CSS, beyond the <em>basics.</em></h1>
          <p>Explore the browser behaviours behind real interface problems, from specificity and stacking contexts to responsive sizing, layouts, and visibility.</p>
          <div className={styles.heroStats}>
            <div><strong>{allLessons.length}</strong><span>concept notes</span></div>
            <div><strong>3</strong><span>interactive labs</span></div>
            <div><strong>{allQuestions.length}</strong><span>practice questions</span></div>
          </div>
          <a href="#css-lessons" className={styles.heroCta}>Explore the concepts <ArrowRight size={17}/></a>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.mockBrowser}>
            <div className={styles.browserChrome}><span/><span/><span/> <small>style-lab.css</small></div>
            <div className={styles.browserCode}>
              <p><span className={styles.codeSel}>.commerce-layout</span> {"{"}</p>
              <p>  <span className={styles.codeKey}>display</span>: flex;</p>
              <p>  <span className={styles.codeKey}>gap</span>: 1rem;</p>
              <p>{"}"}</p>
              <p className={styles.codeGap}><span className={styles.codeSel}>.content</span> {"{"}</p>
              <p>  <span className={styles.codeKey}>flex</span>: 1;</p>
              <p>  <span className={styles.codeKey}>min-width</span>: 0;</p>
              <p>{"}"}</p>
            </div>
            <div className={styles.mockResult}><span/><span/><span/></div>
          </div>
        </div>
      </section>

      <section id="css-lessons" className={styles.section}>
        <div className={styles.sectionHeading}>
          <div><span className="overline">01 / CONCEPT LIBRARY</span><h2>Understand the rules<span className={styles.dot}>.</span></h2></div>
          <p>Concise explanations and runnable CSS patterns, with modern caveats where older advice can be misleading.</p>
        </div>
        <div className={styles.filters} aria-label="Filter CSS topics">
          {categories.map(item => <button type="button" key={item} className={category===item ? styles.activeFilter : styles.filter} onClick={() => setCategory(item)} aria-pressed={category===item}>{item}</button>)}
        </div>
        <div className={styles.lessonGrid}>
          {filtered.map((topic, index) => <article key={topic.id} className={styles.lesson}>
            <div className={styles.lessonTop}><span>{topic.category.toUpperCase()}</span><span>{String(index+1).padStart(2,"0")}</span></div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
            <pre className={styles.code}><code>{topic.code}</code></pre>
            <p className={styles.lessonNote}>{topic.detail}</p>
          </article>)}
        </div>
      </section>

      <section className={styles.section} id="css-interactive">
        <div className={styles.sectionHeading}>
          <div><span className="overline">02 / EXPERIMENT IN THE BROWSER</span><h2>Try it, then understand it<span className={styles.dot}>.</span></h2></div>
          <p>Change the inputs below to see how styles affect dimensions, position within a row, and pointer interaction.</p>
        </div>
        <div className={styles.labGrid}>
          <article className={styles.labPanel}>
            <div className={styles.labHeading}><Layers3 size={23}/><div><h3>Box sizing inspector</h3><p>Declared width: 250px · border: 4px per side</p></div></div>
            <div className={styles.switchRow} role="group" aria-label="Box sizing mode">
              <button type="button" className={borderBox?styles.modeActive:styles.mode} aria-pressed={borderBox} onClick={()=>setBorderBox(true)}>border-box</button>
              <button type="button" className={!borderBox?styles.modeActive:styles.mode} aria-pressed={!borderBox} onClick={()=>setBorderBox(false)}>content-box</button>
            </div>
            <label className={styles.rangeLabel} htmlFor="css-padding">Padding: <strong>{padding}px each side</strong></label>
            <input id="css-padding" className={styles.range} type="range" min="4" max="54" value={padding} onChange={e=>setPadding(Number(e.target.value))}/>
            <div className={styles.boxStage}>
              <div className={styles.paddingBox} style={{width:250,boxSizing:borderBox?"border-box":"content-box",padding,borderWidth:4}}>
                <div className={styles.innerBox}><span>Content</span><small>{borderBox? contentWidth : 250}px</small></div>
              </div>
            </div>
            <p className={styles.readout}>Actual outer width: <strong>{outerWidth}px</strong></p>
            <p className={styles.helper}>Margins are not included in the declared width for either sizing model.</p>
          </article>

          <article className={styles.labPanel}>
            <div className={styles.labHeading}><Code2 size={23}/><div><h3>Flexbox row</h3><p>One growing item and one fixed-size action</p></div></div>
            <div className={styles.flexDemo}>
              <div className={styles.flexContent}><strong>Flexible content area</strong><small>flex: 1; min-width: 0;</small></div>
              <button type="button" className={styles.flexButton} onClick={()=>setActionClicked(value=>!value)}>{actionClicked?"Clicked":"Action"}</button>
            </div>
            <p className={styles.helper}>Resize the window. The content compresses first, while the button keeps its natural width through <code>flex: none</code>.</p>
            <div className={styles.hoverDemo}>
              <p>Try a hover and keyboard focus state:</p>
              <button type="button" className={styles.hoverButton}><MousePointer2 size={16}/> Point or tab here</button>
            </div>
          </article>

          <article className={styles.labPanel}>
            <div className={styles.labHeading}><MousePointer2 size={23}/><div><h3>Visibility and interaction</h3><p>Compare different approaches to hiding content</p></div></div>
            <div className={styles.switchRow} role="group" aria-label="Visibility mode">
              {(["visible","hidden","none","transparent"] as const).map(mode => <button key={mode} type="button" className={visibility===mode?styles.modeActive:styles.mode} aria-pressed={visibility===mode} onClick={()=>{setVisibility(mode);setClicks(0)}}>{mode}</button>)}
            </div>
            <div className={styles.visibilityStage}>
              <div className={styles.stageLabel}>Before</div>
              {visibility!=="none" && <button type="button" className={[styles.stageTarget,visibility==="hidden"?styles.hidden:"",visibility==="transparent"?styles.transparent:""].filter(Boolean).join(" ")} onClick={()=>setClicks(count=>count+1)}>Click target</button>}
              <div className={styles.stageLabel}>After</div>
            </div>
            <p className={styles.readout}>Target clicks: <strong>{clicks}</strong></p>
            <p className={styles.helper}>{visibility==="visible"?"Visible controls occupy space and receive input.":visibility==="hidden"?"visibility: hidden preserves the layout space but prevents ordinary pointer input.":visibility==="none"?"display: none removes the element from the layout.":"opacity: 0 hides the painting, but the invisible target still has its box and can receive clicks."}</p>
          </article>
        </div>
      </section>

      <section className={styles.section} id="css-practice">
        <div className={styles.sectionHeading}>
          <div><span className="overline">03 / ORIGINAL PRACTICE EXERCISES</span><h2>Check your understanding<span className={styles.dot}>.</span></h2></div>
          <p>Eight independently written scenarios. No assessment questions or external test materials are reproduced.</p>
        </div>
        <div className={styles.quizHeader}>
          <div><strong>{score.answered}/{score.total}</strong><span> questions answered</span></div>
          {revealed && <div className={styles.score}><CheckCircle2 size={19}/><strong>{score.correct}/{score.total}</strong><span> correct</span></div>}
        </div>
        <div className={styles.questions}>
          {allQuestions.map((q, index) => {
            const selected=answers[q.id];
            const correct=selected===q.correct;
            return <fieldset className={styles.question} key={q.id}>
              <legend><span>{String(index+1).padStart(2,"0")} / {q.topic}</span>{q.prompt}</legend>
              <div className={styles.options}>
                {q.options.map((option,i)=><label key={option} className={[styles.option,selected===i?styles.optionSelected:"",revealed&&i===q.correct?styles.optionRight:""].filter(Boolean).join(" ")}>
                  <input type="radio" name={q.id} value={i} checked={selected===i} onChange={()=>{setAnswers(old=>({...old,[q.id]:i})); setRevealed(false);}}/>
                  <span>{option}</span>
                </label>)}
              </div>
              {revealed && <p className={correct?styles.feedbackGood:styles.feedback}>
                {correct?"Correct. ":"Review: "}{q.reason}
              </p>}
            </fieldset>;
          })}
        </div>
        <div className={styles.quizActions}>
          <button type="button" className={styles.primary} onClick={()=>setRevealed(true)} disabled={score.answered!==score.total}>Check my answers <ArrowRight size={17}/></button>
          <button type="button" className={styles.reset} onClick={()=>{setAnswers({});setRevealed(false);}}><RotateCcw size={16}/> Reset</button>
          {score.answered!==score.total && <span className={styles.helper}>Answer every question to see your result.</span>}
        </div>
      </section>

      <section className={styles.footerNote}>
        <span className="overline">OPEN, TESTABLE LEARNING EXAMPLE</span>
        <h2>From CSS understanding to production UI.</h2>
        <p>The concepts are presented as an independently developed educational project, not as an examination transcript, certification, or a client implementation. All controls work in the browser; no inputs are sent to a backend.</p>
        <Link href="/" className={styles.back}>Return to developer portfolio <ArrowRight size={17}/></Link>
      </section>
    </div>
  </main>;
}
