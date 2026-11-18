import Link from 'next/link';
import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { DEMO_OFFER_FIELDS, parseOfferFields, rewardLadderView, formatCents } from '../../lib/reward-ladder.mjs';

export const metadata: Metadata = {
  title: 'Planning a Reward Ladder | Jomar Vallite',
  description: 'A worked, fictional plan for adding tiered reward progress to an app-owned Shopify cart: audit findings, data contract, failure behaviour, build phases, risks and measurement.',
};

// Public narrative only. The shop, offer, amounts and gift names are fictional, and the
// plan is independently written. It is not the proposal, configuration or source of any
// employer project. Example messages below are produced by the same engine the demo uses,
// so the plan and the demo cannot drift apart.
const parsed = parseOfferFields(DEMO_OFFER_FIELDS);
if (!parsed.ok) throw new Error(`Demo offer is invalid: ${parsed.reason}`);
const config = parsed.config;

const examples = [8000, 10000, 12500, 15000, 20000, 25000].map((cents) => {
  const view = rewardLadderView(cents, config);
  return [formatCents(cents), view.headline, view.secondary || 'None yet'];
});

const findings = [
  ['The visible cart is not the theme’s cart', 'A theme can contain a working drawer that is switched off while an app injects its own. Checking the cart setting and the rendered DOM decided where the code could live, and showed that the app’s cart sits in an open Shadow DOM that theme CSS cannot reach.'],
  ['Three markers, two systems', 'Gifts are granted by one automation and free shipping by a separate shipping rule. “Match the automation exactly” therefore covers only some of the markers. Each needs its own verified rule.'],
  ['“Free” was already in the data', 'The configured gift names begin with “Free”. A sentence frame that adds its own word would print “a free Free item”, so frames may only add words the data never contains.'],
  ['Offer values change often', 'Amounts and gifts are edited regularly by non-developers. Anything hardcoded in code would go stale, so every value comes from one configuration entry.'],
];

const contract: string[][] = [
  ['rewards_enabled', 'boolean', String(DEMO_OFFER_FIELDS.rewards_enabled), 'Master switch. Off means no ladder.'],
  ['gift_one_threshold', 'whole dollars', `$${DEMO_OFFER_FIELDS.gift_one_threshold}`, 'First milestone. Converted to cents.'],
  ['shipping_threshold', 'whole dollars', `$${DEMO_OFFER_FIELDS.shipping_threshold}`, 'Second milestone.'],
  ['gift_two_threshold', 'whole dollars', `$${DEMO_OFFER_FIELDS.gift_two_threshold}`, 'Final milestone. Must be above the other two.'],
  ['gift_one_label', 'text', DEMO_OFFER_FIELDS.gift_one_label, 'Inserted verbatim into the message.'],
  ['gift_two_label', 'text', DEMO_OFFER_FIELDS.gift_two_label, 'Inserted verbatim into the message.'],
  ['terms', 'text, optional', DEMO_OFFER_FIELDS.terms, 'One line under the ladder. Blank means no line.'],
];

const failures = [
  ['Offer disabled, blank, malformed, or thresholds out of order', 'No ladder. The app’s own strip stays visible.', 'Fail closed. A wrong promise costs more than a missing one.'],
  ['The app changes its markup and the anchor disappears', 'Ladder removed. The app’s strip stays visible.', 'Fail open. Never leave the customer with neither.'],
  ['The drawer is closed or not yet rendered', 'Nothing mounted. Mounts when the drawer appears.', 'No orphaned nodes or hidden elements.'],
  ['Building the ladder throws', 'Ladder removed and the app’s strip restored.', 'Errors never break the cart.'],
  ['The app re-renders and wipes the ladder', 'Restored exactly once.', 'Idempotent mount. Never a duplicate.'],
  ['The app moves to a closed shadow root', 'The code does not try to get around it.', 'Use a supported extension surface instead.'],
];

const phases = [
  ['1. Confirm the qualifying rule', 'Read the automation and shipping rule that grant rewards. Write the subtotal basis down (discounts, gift cards, subscriptions) and back-test it on recent orders.', 'A written rule and a sample table', 'The basis is agreed and matches real orders'],
  ['2. Build the engine', 'Pure functions for offer parsing, the subtotal basis, progress and copy. No DOM.', 'A tested module', 'One-cent boundary tests pass at every threshold'],
  ['3. Mount, observe only', 'Insert the ladder beside the app’s own strip without hiding it.', 'A stable mount', 'No duplicates across repeated app re-renders'],
  ['4. Hide the native strip', 'Hide it only after the ladder is confirmed in place, and restore it whenever the ladder goes.', 'Fail-open behaviour', 'Forced failures leave the app’s strip visible'],
  ['5. QA on a controlled copy', 'Boundary matrix, disabled and invalid offers, gift-card-only carts, mobile and desktop, quantity changes.', 'A sign-off matrix', 'Display agrees with what the automation grants'],
  ['6. Release and watch', 'Publish with a rollback path. Watch cart errors and support questions, then measure.', 'A live release', 'No checkout regression and no duplicate mounts'],
];

const risks = [
  ['The app changes its markup', 'The ladder disappears or misplaces', 'Anchor on stable hooks, fail open, and re-check on every re-render'],
  ['Display and automation disagree', 'Customers are promised a reward that never arrives', 'Verify the basis first and keep it in one function'],
  ['A long gift name', 'Wrapping pushes checkout below the fold', 'Design for two-line names and show only the next reward in the headline'],
  ['Offer entry edited incorrectly', 'Wrong or partial promise on screen', 'Strict validation with no fallbacks'],
  ['Observer feedback loop', 'Endless re-rendering', 'Only write when the output changed, and test that it settles'],
  ['Stale documentation', 'The next developer trusts old rules', 'Update the guide and changelog with every change'],
];

const criteria = [
  'Amounts and gift names are read from configuration and never appear in code.',
  'Editing the configuration changes the cart on the next load with no code change.',
  'The ladder always points at the nearest unreached reward and confirms what is unlocked.',
  'Each milestone flips exactly at its threshold, one cent either side.',
  'The ladder stays compact on mobile and does not push the checkout button out of reach.',
  'Re-renders, quantity changes and removals never produce a second ladder.',
  'If the ladder cannot mount, the app’s own strip is still visible and the cart still works.',
  'Customer copy says plainly that rewards are added after checkout.',
  'Documentation and the changelog match the shipped behaviour.',
];

const metrics = [
  ['Baseline first', 'Use at least four weeks before release as the comparison, and watch for seasonal campaigns that would distort it.'],
  ['Order bands, not just the average', 'Count orders under, between and over each threshold. Movement from just under a threshold to just over it is the signal that matters.'],
  ['Net of the gift', 'A reward costs money. The extra margin from larger orders has to exceed the cost of the gifts given.'],
  ['Separate the confounders', 'Split one-off and subscription orders, and account for free shipping and any other promotion running at the same time.'],
];

const th: CSSProperties = { textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #4a4640', color: '#c5a272', font: '500 11px "Space Grotesk",sans-serif', letterSpacing: 1.4, textTransform: 'uppercase' };
const td: CSSProperties = { textAlign: 'left', verticalAlign: 'top', padding: '12px 14px', borderBottom: '1px solid #2c2b2b', color: '#aaadb6' };

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, lineHeight: 1.7 }}>
        <thead><tr>{head.map((h) => <th key={h} scope="col" style={th}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} style={j === 0 ? { ...td, color: '#eee9e1', fontWeight: 600 } : td}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function RewardLadderPlan() {
  return <main>
    <header className="header container"><Link className="brand" href="/"><strong>JV.</strong><span>DEVELOPER PORTFOLIO</span></Link><nav aria-label="Page navigation"><Link href="/#work">Projects</Link><Link href="/experience">Experience</Link></nav></header>
    <section className="hero container" style={{ paddingBottom: 48 }}>
      <div className="eyebrow"><span className="spark" /> PLANNING / REWARD LADDER</div>
      <h1>Planning a reward ladder<br /><em>before writing the code.</em></h1>
      <div className="hero-bottom"><p>A worked plan for adding tiered reward progress to a cart that a third-party app owns. The shop, offer and amounts are <strong>fictional</strong>, and the plan is independently written. It shows how I move from audit findings to a data contract, failure rules, build phases and a measurement plan.</p></div>
      <div className="hero-tags"><span>SHOPIFY</span><span>SHADOW DOM</span><span>CONFIGURATION-DRIVEN</span><span>QA PLAN</span><span>FAIL-SAFE DESIGN</span></div>
      <div className="actions" style={{ marginTop: 28 }}><Link href="/reward-ladder-demo" className="button primary">Try the interactive demo <ArrowUpRight size={16} /></Link><Link href="#phases" className="button secondary">Jump to the build plan</Link></div>
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="decision-title">
      <div className="section-head"><div><span className="overline">01 / THE DECISION</span><h2 id="decision-title">What is being proposed<span className="dot">.</span></h2></div></div>
      <p style={{ maxWidth: 820, color: '#aaadb6', lineHeight: 1.85 }}>Today the cart shows only a free-shipping message, so the earlier gift and the later bonus are invisible when it matters. The proposal is a compact progress ladder that always points at the nearest reward, layered onto the app’s cart rather than replacing it.</p>
      <p style={{ maxWidth: 820, color: '#aaadb6', lineHeight: 1.85 }}><strong style={{ color: '#eee9e1' }}>Decision requested:</strong> approve building it on a controlled copy of the live theme, followed by QA that compares what the cart promises with what the automation actually grants, before any release.</p>
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="audit-title">
      <div className="section-head"><div><span className="overline">02 / WHAT THE AUDIT FOUND</span><h2 id="audit-title">Four facts that shaped the design<span className="dot">.</span></h2></div></div>
      <div className="quality-grid">{findings.map(([title, detail], i) => <article key={title}><span className="overline">FINDING {String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="contract-title">
      <div className="section-head"><div><span className="overline">03 / THE DATA CONTRACT</span><h2 id="contract-title">One configuration entry drives everything<span className="dot">.</span></h2></div></div>
      <p style={{ maxWidth: 820, color: '#aaadb6', lineHeight: 1.85 }}>A disabled, blank, malformed, or out-of-order offer produces no ladder at all. There are deliberately no fallback amounts or gift names.</p>
      <Table head={['Field', 'Type', 'Example value', 'Behaviour']} rows={contract} />
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="states-title">
      <div className="section-head"><div><span className="overline">04 / WHAT THE CUSTOMER SEES</span><h2 id="states-title">The message follows the basket<span className="dot">.</span></h2></div></div>
      <p style={{ maxWidth: 820, color: '#aaadb6', lineHeight: 1.85 }}>These rows are generated by the same engine as the demo, from the example offer above. Change the offer and they change with it.</p>
      <Table head={['Qualifying basket', 'Main message', 'Second line']} rows={examples} />
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="failure-title">
      <div className="section-head"><div><span className="overline">05 / FAILURE BEHAVIOUR</span><h2 id="failure-title">Closed on data, open on structure<span className="dot">.</span></h2></div></div>
      <Table head={['Situation', 'Result', 'Why']} rows={failures} />
    </section>

    <section id="phases" className="section container" style={{ paddingTop: 30 }} aria-labelledby="phases-title">
      <div className="section-head"><div><span className="overline">06 / THE BUILD PLAN</span><h2 id="phases-title">Six phases, each with a gate<span className="dot">.</span></h2></div></div>
      <Table head={['Phase', 'Work', 'Output', 'Gate to pass']} rows={phases} />
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="risks-title">
      <div className="section-head"><div><span className="overline">07 / RISKS AND MITIGATIONS</span><h2 id="risks-title">What could go wrong<span className="dot">.</span></h2></div></div>
      <Table head={['Risk', 'Impact', 'Mitigation']} rows={risks} />
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="criteria-title">
      <div className="section-head"><div><span className="overline">08 / ACCEPTANCE CRITERIA</span><h2 id="criteria-title">Done means all of these<span className="dot">.</span></h2></div></div>
      <ul style={{ color: '#aaadb6', lineHeight: 1.9, maxWidth: 860, paddingLeft: 22 }}>{criteria.map((c) => <li key={c}>{c}</li>)}</ul>
    </section>

    <section className="section container" style={{ paddingTop: 30 }} aria-labelledby="measure-title">
      <div className="section-head"><div><span className="overline">09 / MEASURING THE EFFECT</span><h2 id="measure-title">How the result would be judged<span className="dot">.</span></h2></div></div>
      <div className="quality-grid">{metrics.map(([title, detail]) => <article key={title}><h3>{title}</h3><p>{detail}</p></article>)}</div>
      <p className="disclaimer">This plan claims no uplift. It describes how an effect would be measured, not a result. The shop, offer, amounts and gift names are fictional, and nothing here is the proposal, configuration or source code of any employer project.</p>
      <div className="actions" style={{ marginTop: 24 }}>
        <Link href="/#work" className="button secondary"><ArrowLeft size={16} /> Back to projects</Link>
        <Link href="/reward-ladder-demo" className="button secondary">Interactive demo <ArrowUpRight size={16} /></Link>
        <a href="https://github.com/bonvallite/developer-portfolio" className="button secondary" target="_blank" rel="noopener noreferrer">GitHub portfolio <ArrowUpRight size={16} /></a>
      </div>
    </section>
  </main>;
}
