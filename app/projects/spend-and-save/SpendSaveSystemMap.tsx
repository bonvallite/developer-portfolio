'use client';

import { useState } from 'react';
import { useDiagramStageMotion } from '../../components/useDiagramStageMotion';
import { ArrowRight, CheckCircle2, Code2, Database, MailCheck, ShoppingCart, Workflow } from 'lucide-react';

// Public architecture inspector for a fictional Spend & Save implementation.
// It visualises the same threshold and post-checkout state as the surrounding
// demonstration, but never executes Liquid, Shopify Flow, order edits, emails,
// or storefront API calls. Snippets are illustrative pseudocode (not a
// reproduction or export of a merchant's private workflow or credentials).
type Thresholds = { first: number; shipping: number; final: number };
type StageKey = 'configuration' | 'storefront' | 'automation' | 'confirmation';
type Props = {
  subtotal: number;
  thresholds: Thresholds;
  flowStage: number;
  orderEditCommitted: boolean;
  notificationReady: boolean;
};

const stages = [
  {
    key: 'configuration', name: 'Configuration', short: 'Merchant rules', label: '01 / SOURCE OF TRUTH',
    icon: Database, title: 'One offer. Consistent rules.',
    explanation: 'A Shopify metaobject can define the active reward campaign. Storefront messages and the after-checkout workflow must read the same approved values rather than duplicating thresholds in unrelated scripts.',
    note: 'A real implementation also verifies active dates, variants, limits, and an authorised source for each field.',
  },
  {
    key: 'storefront', name: 'Storefront', short: 'Liquid + JS', label: '02 / CUSTOMER EXPERIENCE',
    icon: ShoppingCart, title: 'Show eligibility. Never insert gifts.',
    explanation: 'The browser calculates progress and explains the next reward using the basket subtotal. This presentation layer does not edit the customer’s order or add complimentary gift lines.',
    note: 'The checkout shipping benefit is configured and validated separately from post-checkout gift fulfilment.',
  },
  {
    key: 'automation', name: 'After checkout', short: 'Shopify Flow', label: '03 / ORDER OPERATIONS',
    icon: Workflow, title: 'Validate, edit, and commit.',
    explanation: 'A paid-order event initiates the eligible gift decision. An implementation must prevent duplicate processing, validate qualifying conditions, and commit an order edit before treating gifts as fulfilled.',
    note: 'This is a model of the sequence. It is not a live Shopify Flow run or proof that an order edit succeeded in a production store.',
  },
  {
    key: 'confirmation', name: 'Confirmation', short: 'Customer email', label: '04 / CUSTOMER CONFIDENCE',
    icon: MailCheck, title: 'Notify only when the edit succeeds.',
    explanation: 'The customer confirmation is downstream of a successful, eligible order edit. If the commit fails, the model does not display a success notification.',
    note: 'A real workflow must separately validate notification delivery, consent, templates, and failure handling.',
  },
] as const;

function aud(value: number) {
  return 'A$' + value.toFixed(0);
}

export default function SpendSaveSystemMap({
  subtotal, thresholds, flowStage, orderEditCommitted, notificationReady,
}: Props) {
  const [selected, setSelected] = useState<StageKey>('storefront');
  // Focus animation mirrors, but never replaces, the selected fictitious
  // engineering layer. Thresholds and order-edit state remain authoritative.
  const scope = useDiagramStageMotion(selected);
  const active = stages.find(item => item.key === selected) ?? stages[1];
  const qualifying = subtotal >= thresholds.first;
  const additionalGift = subtotal >= thresholds.final;
  const code: Record<StageKey, string> = {
    configuration: [
      '// Illustrative campaign configuration',
      'offer.firstGift = ' + thresholds.first + ';',
      'offer.freeShipping = ' + thresholds.shipping + ';',
      'offer.finalGift = ' + thresholds.final + ';',
      'validateIncreasingThresholds(offer);',
    ].join('\n'),
    storefront: [
      '// Public demonstration rules',
      'const progress = getRewardProgress(' + subtotal + ', offer);',
      'const next = progress.next;',
      '// Update message and bar, not order lines.',
      'renderRewardProgress(progress);',
    ].join('\n'),
    automation: [
      '// Illustrative post-payment sequence',
      'if (!order.paid || alreadyProcessed(order)) return;',
      'const gifts = getEligibleGifts(order.subtotal, offer);',
      'if (!gifts.length) return;',
      'const result = commitGiftOrderEdit(gifts);',
      'if (!result.ok) return; // no confirmation',
    ].join('\n'),
    confirmation: [
      '// Notification must be downstream of success',
      'if (!orderEditCommitted) return;',
      'if (!eligibleGifts.length) return;',
      'sendGiftConfirmationPreview();',
      '// No real email is sent in this portfolio.',
    ].join('\n'),
  };

  const stateDescription: Record<StageKey, string> = {
    configuration: 'Example thresholds: ' + aud(thresholds.first) + ' gift, ' +
      aud(thresholds.shipping) + ' shipping, ' + aud(thresholds.final) + ' final gift.',
    storefront: qualifying
      ? aud(subtotal) + ' qualifies for the first illustrative gift' +
        (additionalGift ? ' and the final gift' : '') + '. Gifts are still absent from the basket.'
      : aud(subtotal) + ' is below the first illustrative gift threshold. No gift qualifies yet.',
    automation: !qualifying
      ? 'No gift qualifies. The demonstration should not perform an order edit.'
      : orderEditCommitted
        ? 'The simulated order edit is committed; its gift lines can now appear.'
        : flowStage >= 0
          ? 'Simulated workflow step ' + (flowStage + 1) + ' is active. Gift lines are not committed yet.'
          : 'Awaiting the fictional paid-order event. No gift lines have been added.',
    confirmation: notificationReady
      ? 'A confirmation preview is available. No real email has been sent.'
      : 'The confirmation remains unavailable until the simulated gift order edit succeeds.',
  };

  return (
    <div ref={scope} className="ss-system" aria-label="Interactive Spend and Save engineering architecture">
      <div className="ss-system-head">
        <div><span>THE IMPLEMENTATION MAP</span>
          <p>Follow one promotion from configuration to customer confirmation.</p>
        </div>
        <span className="ss-system-flag">FICTIONAL / SAFE TO EXPLORE</span>
      </div>

      <div className="ss-system-map" role="group" aria-label="Select a system layer">
        {stages.map((item, index) =>
          <button key={item.key} type="button" aria-pressed={selected === item.key}
            data-gsap-focus={selected === item.key ? 'true' : undefined}
            className={'ss-system-node' + (selected === item.key ? ' is-selected' : '')}
            onClick={() => setSelected(item.key)}>
            <span className="ss-system-node-number">{String(index + 1).padStart(2, '0')}</span>
            <item.icon size={24} strokeWidth={1.7} aria-hidden="true" />
            <strong>{item.name}</strong>
            <small>{item.short}</small>
            {index < stages.length - 1 && <ArrowRight size={18} className="ss-system-arrow" aria-hidden="true"/>}
          </button>
        )}
      </div>

      <div className="ss-system-detail">
        <div className="ss-system-explainer" data-gsap-detail>
          <span className="ss-system-step-label">{active.label}</span>
          <h3 aria-live="polite" aria-atomic="true">{active.title}</h3>
          <p>{active.explanation}</p>
          <div className="ss-system-state" aria-label="Current fictional simulation state">
            <CheckCircle2 size={19} aria-hidden="true"/>
            <span>{stateDescription[selected]}</span>
          </div>
          <p className="ss-system-limit"><strong>Production consideration:</strong> {active.note}</p>
        </div>
        <div className="ss-system-code" data-gsap-detail>
          <div><span><Code2 size={15} aria-hidden="true"/> {active.name.toUpperCase()} / LOGIC VIEW</span><span>EXAMPLE ONLY</span></div>
          <pre><code>{code[selected]}</code></pre>
          <p>Illustrative code, not private merchant source or an executable Shopify API call.</p>
        </div>
      </div>
    </div>
  );
}
