import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2, ClipboardList, FileCode2, GitBranch, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation & engineering standards | Jomar Vallite',
  description: 'How inline documentation, dated changelogs, validation evidence and release handovers make commerce systems easier to maintain.',
};

const standards = [
  { icon: BookOpen, title: 'Read before editing', detail: 'Read the target changelog, linked archives, affected source and existing comments. Confirm the exact theme or environment and current release status.' },
  { icon: FileCode2, title: 'Keep context in the code', detail: 'Explain purpose, behaviour, dependencies and failure paths beside the logic. Update or remove outdated notes whenever the implementation changes.' },
  { icon: ClipboardList, title: 'Record every change', detail: 'Log the date, target, affected files, what changed, why and validation performed. Preserve the history and append corrections when evidence changes.' },
  { icon: ShieldCheck, title: 'Verify the saved result', detail: 'Check the saved files and run validation appropriate to the change. Record browser, mobile and integration results separately from syntax checks and builds.' },
  { icon: GitBranch, title: 'Make handover practical', detail: 'Describe system ownership, configuration and dependencies. Keep release status current and verify the recovery reference before release.' },
  { icon: CheckCircle2, title: 'Finish with evidence', detail: 'Verify both inline documentation and the changelog. Keep pending checks visible and resolve release requirements before calling the change ready.' },
];

// Public presentation of ENGINEERING_STANDARDS.md. Keep both accounts aligned.
// The sample record is fictional; its pending checks demonstrate evidence limits.
// Shared layout and responsive rules live in app/globals.css under .standards-*.
export default function EngineeringStandards() {
  return (
    <main className="container demo-shell standards-page">
      <Link href="/#engineering-quality" className="demo-back"><ArrowLeft size={16} aria-hidden="true" /> Back to engineering quality</Link>
      <header className="demo-heading standards-heading">
        <span className="overline">HOW I WORK / DOCUMENTATION & CHANGE CONTROL</span>
        <h1>Good code needs<br /><em>a clear history.</em></h1>
        <p>Documentation is part of delivery. I keep the explanation beside the code, the history in the changelog and the validation with the release, so a system can be understood and maintained after launch.</p>
        <a className="button secondary" href="https://github.com/bonvallite/developer-portfolio/blob/main/ENGINEERING_STANDARDS.md" target="_blank" rel="noopener noreferrer">Read the GitHub standard <ArrowUpRight size={17} aria-hidden="true" /></a>
      </header>

      <section className="standards-contract" aria-labelledby="completion-rule">
        <CheckCircle2 size={28} aria-hidden="true" />
        <div><span className="overline">MY COMPLETION RULE</span><h2 id="completion-rule">The code, comments, changelog and evidence must agree.</h2><p>A working feature also needs an accurate explanation, a traceable change record and a clear account of what was checked.</p></div>
      </section>

      <section aria-labelledby="working-standard" className="standards-section">
        <div className="section-head"><div><span className="overline">01 / THE WORKING STANDARD</span><h2 id="working-standard">A practice for every change.</h2></div><p>Applied across theme development, automation and integrations.</p></div>
        <ol className="standards-grid">
          {standards.map(({ icon: Icon, title, detail }, index) => (
            <li key={title}><div className="standards-card-top"><Icon size={25} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{detail}</p></li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="change-example" className="standards-section">
        <div className="section-head"><div><span className="overline">02 / WHAT A USEFUL RECORD CONTAINS</span><h2 id="change-example">A change someone<br />else can follow.</h2></div><p>Illustrative record with fictional paths and target. The status shows exactly what the evidence supports.</p></div>
        <article className="standards-record">
          <div className="standards-record-heading"><div><span className="overline">EXAMPLE CHANGE RECORD</span><h3>Cart item-count typography</h3></div><span className="standards-status">Awaiting browser QA</span></div>
          <dl>
            <div><dt>Date / target</dt><dd>22 October 2026 · <code>staging-theme-example</code></dd></div>
            <div><dt>Affected files</dt><dd><code>assets/example-cart.js</code>, <code>assets/example-cart.css</code>, maintained cart notes and changelog</dd></div>
            <div><dt>Change</dt><dd>Give the dynamic item count its own typography hook and reapply it after the cart component rerenders.</dd></div>
            <div><dt>Why</dt><dd>Keep the subtotal label prominent while the changing item count stays visually secondary.</dd></div>
            <div><dt>Inline context</dt><dd>Explain the hook, rerender lifecycle, CSS scope and dependency on the app-owned cart markup.</dd></div>
            <div><dt>Evidence</dt><dd>A real record would link the saved-file comparison and syntax results. No executed checks are claimed for this fictional example.</dd></div>
            <div><dt>Open checks</dt><dd>Quantity changes, singular/plural counts, discount states, mobile layout and app fallback still need browser verification.</dd></div>
          </dl>
        </article>
      </section>

      <section className="standards-section" aria-labelledby="maintenance-value">
        <div className="section-head"><div><span className="overline">03 / WHY THIS MATTERS</span><h2 id="maintenance-value">Built for the next person.</h2></div></div>
        <div className="standards-value-grid">
          <article><h3>Clear ownership</h3><p>Someone changing an offer can see which data drives the interface and which fulfilment or shipping rules are managed elsewhere.</p></article>
          <article><h3>Traceable decisions</h3><p>A developer investigating a regression can find the changed files, the original reason and the evidence available at the time.</p></article>
          <article><h3>Practical handover</h3><p>The next maintainer can understand the dependencies, remaining checks and recovery plan without reconstructing the project from chat history.</p></article>
        </div>
        <p className="standards-footnote">This is my working standard and review requirement. Comment counts, checklists and automated builds each provide useful evidence; documentation accuracy still needs review. This page describes the practice and does not certify every historical client change.</p>
        <div className="actions"><a className="button primary" href="https://github.com/bonvallite/developer-portfolio/blob/main/ENGINEERING_STANDARDS.md#reusable-change-record" target="_blank" rel="noopener noreferrer">View the change-record template <ArrowUpRight size={17} aria-hidden="true" /></a><Link className="button secondary" href="/#contact">Discuss a project <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
    </main>
  );
}
