'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

// Progressive enhancement for the homepage's four-part delivery story.
// No remote calls, visitor tracking, client details or fabricated performance data.
// A complete first step is rendered before hydration.
const journey = [
  {
    number: '01', key: 'DISCOVER', title: 'Find the real friction.',
    problem: 'Start with the customer journey, the platform limitations and the commercial requirement. Separate what is known from what still needs evidence.',
    outcome: 'A clear scope, success criteria and a practical order of work.',
    labels: ['Journey review', 'Data quality', 'Opportunity map'], code: 'DEFINE THE PROBLEM',
  },
  {
    number: '02', key: 'DESIGN', title: 'Make complex feel clear.',
    problem: 'Connect storefront experience, product data, operational rules and integrations. Prototype the flow before committing to a production change.',
    outcome: 'A responsive interface and a system design people can understand.',
    labels: ['Experience design', 'System map', 'Acceptance criteria'], code: 'DESIGN THE EXPERIENCE',
  },
  {
    number: '03', key: 'ENGINEER', title: 'Build for the real world.',
    problem: 'Implement accessible Liquid or React interfaces, reliable API handling and purposeful automation. Document dependencies and failure states.',
    outcome: 'Tested, maintainable features with considered fallback behaviour.',
    labels: ['Shopify & Liquid', 'APIs & workflows', 'Responsive QA'], code: 'SHIP WITH CONFIDENCE',
  },
  {
    number: '04', key: 'IMPROVE', title: 'Measure what matters.',
    problem: 'Review conversion paths, instrumentation and operational outcomes. Use verified evidence to decide what to improve next, without inventing wins.',
    outcome: 'A clear follow-up plan, reliable reporting and fewer hidden issues.',
    labels: ['Funnel analysis', 'Technical SEO', 'Iteration'], code: 'KEEP GETTING BETTER',
  },
] as const;

export default function HomeJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = journey[activeIndex];

  return <div className="jrv2-journey">
    <div className="jrv2-journey-tabs" role="group" aria-label="Explore the commerce delivery process">
      {journey.map((item, index) =>
        <button key={item.number} type="button"
          aria-pressed={index === activeIndex}
          className={'jrv2-journey-tab' + (index === activeIndex ? ' is-active' : '')}
          onClick={() => setActiveIndex(index)}>
          <span>{item.number}</span><strong>{item.key}</strong>
        </button>
      )}
    </div>
    <div className="jrv2-journey-display" aria-live="polite">
      <div className="jrv2-journey-story">
        <span className="jrv2-overline">THE APPROACH / {active.number}</span>
        <h3>{active.title}</h3>
        <p>{active.problem}</p>
        <div className="jrv2-journey-result"><CheckCircle2 size={21} aria-hidden="true" /><span><strong>Deliverable</strong>{active.outcome}</span></div>
        <a href="/#contact" className="jrv2-text-link">Discuss your project <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <div className="jrv2-journey-visual" aria-label={'Illustrative project workflow: ' + active.key}>
        <div className="jrv2-mini-window-head"><span aria-hidden="true">● ● ●</span><span>WORKFLOW / {active.number}</span></div>
        <div className="jrv2-mini-visual-body">
          <div className="jrv2-mini-visual-track"><span>COMMERCE SYSTEMS</span><span className="jrv2-mini-online">PLANNING</span></div>
          <div className="jrv2-mini-visual-rule" aria-hidden="true"><i /></div>
          <div className="jrv2-mini-visual-title">{active.code}</div>
          <div className="jrv2-mini-visual-items">
            {active.labels.map((label, index) => <div key={label} className="jrv2-mini-item"><span>{'0' + (index + 1)}</span><strong>{label}</strong><CheckCircle2 size={16} aria-hidden="true" /></div>)}
          </div>
          <div className="jrv2-mini-visual-footer"><span>REVIEW → DESIGN → BUILD → ITERATE</span><span>JRV / PROCESS</span></div>
        </div>
      </div>
    </div>
  </div>;
}
