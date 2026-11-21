'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BarChart3, Boxes, Check, Gift, Minus, Plus,
  RotateCcw, Workflow,
} from 'lucide-react';

// The hero is a working, deliberately fictional preview of four public case studies.
// Controls update local React state only: no Shopify cart mutations, requests,
// analytics, customer records, fulfilment writes, or invented commercial outcomes.
// Each illustration links to a separate case study with clear verification limits.
type Demo = 'rewards' | 'analytics' | 'integration' | 'b2b';
type DataSource = 'shopify' | 'ga4' | 'search';

const projects = [
  {
    key: 'rewards', number: '01', label: 'REWARDS', icon: Gift,
    title: 'The storefront meets the workflow.',
    deck: 'Move the fictional basket through three reward milestones. The cart visual explains eligibility; Shopify Flow handles eligible gifts after checkout.',
    href: '/projects/spend-and-save', cta: 'Explore reward engineering',
  },
  {
    key: 'analytics', number: '02', label: 'DATA LAB', icon: BarChart3,
    title: 'Make the data tell a clearer story.',
    deck: 'Switch between three fictional data sources to see the reporting layer change. The full lab explains Python extraction, validation, and handover.',
    href: '/analytics-lab', cta: 'Explore the Python analytics lab',
  },
  {
    key: 'integration', number: '03', label: 'WEBHOOKS', icon: Workflow,
    title: 'Follow a warehouse event.',
    deck: 'Advance a simulated event through the integration boundary. The real case study documents the design and its verified limits.',
    href: '/cartoncloud-integration', cta: 'Explore the integration',
  },
  {
    key: 'b2b', number: '04', label: 'WHOLESALE', icon: Boxes,
    title: 'A pricing rule you can inspect.',
    deck: 'Change fictional product quantities and see the weight, qualifying tier, and order estimate recalculate without a checkout connection.',
    href: '/b2b-modernisation', cta: 'Explore B2B modernisation',
  },
] as const;

const milestones = [
  { amount: 150, label: 'Bonus gift' },
  { amount: 200, label: 'Free shipping' },
  { amount: 300, label: 'Additional gift' },
] as const;

const sources = {
  shopify: {
    label: 'Shopify', metric: 'Orders', values: [18, 24, 21, 36, 28, 41, 35],
    detail: 'Illustrative order records, prepared for reconciliation.',
  },
  ga4: {
    label: 'GA4', metric: 'Sessions', values: [38, 31, 48, 55, 44, 65, 58],
    detail: 'Illustrative session records with attribution definitions.',
  },
  search: {
    label: 'Search Console', metric: 'Clicks', values: [12, 17, 15, 21, 25, 22, 30],
    detail: 'Illustrative search clicks with a distinct reporting grain.',
  },
} as const;

const eventSteps = [
  { name: 'Shopify', detail: 'Order event prepared' },
  { name: 'Worker', detail: 'Webhook validated' },
  { name: 'Warehouse', detail: 'Tracking event mapped' },
  { name: 'Shopify', detail: 'Status update considered' },
] as const;

function money(cents: number) {
  return '$' + (cents / 100).toFixed(2);
}

export default function CommerceWorkbench() {
  const [mode, setMode] = useState<Demo>('rewards');
  const [basket, setBasket] = useState(175);
  const [dataSource, setDataSource] = useState<DataSource>('shopify');
  const [eventStep, setEventStep] = useState(0);
  const [cutA, setCutA] = useState(4);
  const [cutB, setCutB] = useState(2);

  const active = projects.find(project => project.key === mode) ?? projects[0];
  const nextMilestone = milestones.find(item => basket < item.amount);
  const selectedSource = sources[dataSource];
  const topSourceValue = Math.max(...selectedSource.values);
  const weight = cutA * 750 + cutB * 1200; // integer grams
  const subtotal = cutA * 2800 + cutB * 3000; // integer AUD cents
  const discount = weight >= 20000 ? 15 : weight >= 10000 ? 10 : weight >= 5000 ? 5 : 0;
  const saving = Math.round(subtotal * discount / 100);
  const total = subtotal - saving;

  return (
    <section className="jrv2-console jrv2-workbench" aria-label="Interactive portfolio project studio">
      <div className="jrv2-console-top">
        <span className="jrv2-console-dots" aria-hidden="true"><i/><i/><i/></span>
        <b>JRV / PROJECT STUDIO</b>
        <span>REAL LOGIC · FICTIONAL DATA</span>
      </div>
      <div className="jrv2-workbench-tabs" role="group" aria-label="Choose an interactive project preview">
        {projects.map(project => (
          <button key={project.key} type="button"
            className={'jrv2-workbench-tab' + (mode === project.key ? ' is-active' : '')}
            aria-pressed={mode === project.key}
            onClick={() => setMode(project.key)}>
            <project.icon size={16} aria-hidden="true"/>
            <span>{project.label}</span>
          </button>
        ))}
      </div>
      <div className="jrv2-console-body jrv2-workbench-body">
        <div className="jrv2-workbench-copy">
          <span className="jrv2-console-label">WORKING PREVIEW / {active.number}</span>
          <h2 aria-live="polite" aria-atomic="true">{active.title}</h2>
          <p>{active.deck}</p>
        </div>

        <div className="jrv2-workbench-stage">
          {mode === 'rewards' && (
            <div className="jrv2-lab-rewards" aria-label="Fictional cart reward simulator">
              <div className="jrv2-lab-metric">
                <span>DEMO BASKET TOTAL</span>
                <strong>{money(basket * 100)}</strong>
                <small>Next milestone: {nextMilestone ? '$' + nextMilestone.amount : 'all reached'}</small>
              </div>
              <div className="jrv2-lab-progress" role="progressbar"
                aria-label="Fictional basket milestones" aria-valuemin={0}
                aria-valuemax={300} aria-valuenow={Math.min(basket, 300)}>
                <span style={{ width: Math.min(basket / 300 * 100, 100) + '%' }}/>
              </div>
              <ol className="jrv2-lab-milestones">
                {milestones.map(item => (
                  <li key={item.amount} className={basket >= item.amount ? 'is-earned' : ''}>
                    <span>{basket >= item.amount ? <Check size={12} aria-hidden="true"/> : '$' + item.amount}</span>
                    <strong>{item.label}</strong>
                  </li>
                ))}
              </ol>
              <output className="jrv2-lab-status" aria-live="polite">
                {nextMilestone
                  ? 'Add $' + (nextMilestone.amount - basket) + ' to reach ' + nextMilestone.label.toLowerCase() + '.'
                  : 'Every illustrative reward threshold is reached.'}
              </output>
              <div className="jrv2-lab-actions">
                <button type="button" onClick={() => setBasket(value => Math.min(value + 50, 400))}
                  disabled={basket >= 400}><Plus size={14} aria-hidden="true"/> Add $50</button>
                <button type="button" className="is-quiet" onClick={() => setBasket(175)}>
                  <RotateCcw size={14} aria-hidden="true"/> Reset
                </button>
              </div>
            </div>
          )}

          {mode === 'analytics' && (
            <div className="jrv2-lab-analytics" aria-label="Fictional source-switching analytics preview">
              <div className="jrv2-lab-source-tabs" role="group" aria-label="Choose a fictional reporting source">
                {(['shopify', 'ga4', 'search'] as const).map(key => (
                  <button key={key} type="button" aria-pressed={dataSource === key}
                    className={dataSource === key ? 'is-active' : ''}
                    onClick={() => setDataSource(key)}>{sources[key].label}</button>
                ))}
              </div>
              <div className="jrv2-lab-chart-head">
                <strong>{selectedSource.metric} / sample week</strong>
                <span>FICTIONAL DATASET</span>
              </div>
              <div className="jrv2-lab-chart" role="img"
                aria-label={'Fictional ' + selectedSource.metric.toLowerCase() + ' over seven periods: ' + selectedSource.values.join(', ')}>
                {selectedSource.values.map((value, index) => (
                  <div className="jrv2-lab-chart-column" key={index} aria-hidden="true">
                    <span>{value}</span>
                    <i style={{height: (value / topSourceValue * 100) + '%'}}/>
                    <small>{'D' + (index + 1)}</small>
                  </div>
                ))}
              </div>
              <output className="jrv2-lab-status" aria-live="polite">{selectedSource.detail}</output>
            </div>
          )}

          {mode === 'integration' && (
            <div className="jrv2-lab-integration" aria-label="Simulated webhook event stages">
              <div className="jrv2-lab-event-track">
                {eventSteps.map((step, index) => (
                  <div key={index} className={'jrv2-lab-event-node' +
                    (eventStep === index ? ' is-current' : '') +
                    (eventStep > index ? ' is-complete' : '')}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step.name}</strong>
                    <small>{step.detail}</small>
                  </div>
                ))}
              </div>
              <output className="jrv2-lab-status" aria-live="polite">
                Simulated step {eventStep + 1} of 4: {eventSteps[eventStep].detail}.
              </output>
              <div className="jrv2-lab-actions">
                <button type="button" onClick={() => setEventStep(index => (index + 1) % eventSteps.length)}>
                  <Workflow size={14} aria-hidden="true"/> Advance event
                </button>
                <button type="button" className="is-quiet" onClick={() => setEventStep(0)}>
                  <RotateCcw size={14} aria-hidden="true"/> Reset
                </button>
              </div>
            </div>
          )}

          {mode === 'b2b' && (
            <div className="jrv2-lab-b2b" aria-label="Fictional weight-based wholesale pricing simulator">
              <div className="jrv2-lab-cuts">
                {[
                  { name: 'Demo Cut A', weight: '0.75 kg', count: cutA, change: setCutA },
                  { name: 'Demo Cut B', weight: '1.20 kg', count: cutB, change: setCutB },
                ].map(cut => (
                  <div className="jrv2-lab-cut" key={cut.name}>
                    <span><strong>{cut.name}</strong><small>{cut.weight} per unit</small></span>
                    <div className="jrv2-lab-quantity">
                      <button type="button" aria-label={'Remove one ' + cut.name}
                        disabled={cut.count === 0}
                        onClick={() => cut.change(value => Math.max(0, value - 1))}><Minus size={14} aria-hidden="true"/></button>
                      <output aria-label={cut.name + ' quantity'}>{cut.count}</output>
                      <button type="button" aria-label={'Add one ' + cut.name}
                        disabled={cut.count === 12}
                        onClick={() => cut.change(value => Math.min(12, value + 1))}><Plus size={14} aria-hidden="true"/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="jrv2-lab-b2b-summary">
                <span>COMBINED WEIGHT <strong>{(weight / 1000).toFixed(2)} kg</strong></span>
                <span>FICTIONAL TIER <strong>{discount === 0 ? 'STANDARD' : discount + '% OFF'}</strong></span>
                <span>ESTIMATED TOTAL <strong>{money(total)}</strong></span>
              </div>
              <output className="jrv2-lab-status" aria-live="polite">
                {money(subtotal)} subtotal − {money(saving)} fictional saving.
              </output>
            </div>
          )}
        </div>

        <div className="jrv2-workbench-footer">
          <span>INTERACTIVE CONCEPT · NOT A LIVE STORE</span>
          <Link href={active.href}>{active.cta} <ArrowUpRight size={15} aria-hidden="true"/></Link>
        </div>
      </div>
      <div className="jrv2-console-bottom">
        <span>EXPLORE THE INTERFACE · INSPECT THE CASE STUDY</span>
        <span><span aria-hidden="true">●</span> <b>LOCAL DEMO</b></span>
      </div>
    </section>
  );
}
