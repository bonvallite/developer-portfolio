'use client';

/**
 * Public, zero-network event studio for the Shopify–CartonCloud case study.
 * This is a deliberately fictional architectural demonstration, not a live
 * webhook, warehouse transaction, order write, or measured production status.
 * The normal path explains intended boundaries. Invalid signature and write
 * failure paths stop at the affected stage and cannot report later success.
 * No credentials, shop names, order identifiers, customer data, private
 * integration code, analytics events, or external assets are used.
 */
import { useState } from 'react';
import {
  ArrowRight, AlertTriangle, CheckCircle2, Cloud, Code2, Database,
  GitBranch, RotateCcw, ShieldCheck, Truck,
} from 'lucide-react';
import './integration-lab.css';

type Scenario = 'normal' | 'invalid' | 'writeFailed';

const scenarios = [
  { key: 'normal', name: 'Normal path', detail: 'Follow the intended event lifecycle.' },
  { key: 'invalid', name: 'Invalid webhook', detail: 'Stop at signature verification.' },
  { key: 'writeFailed', name: 'Write rejected', detail: 'Stop before a Shopify update can be claimed.' },
] as const;

const systems = [
  { label: '01 / COMMERCE', name: 'Shopify', detail: 'Order and fulfilment context', icon: Database },
  { label: '02 / APPLICATION', name: 'Cloudflare Worker', detail: 'Authentication, routing, diagnostics', icon: Cloud },
  { label: '03 / INTEGRATION', name: 'CartonCloud', detail: 'Consignments and tracking events', icon: Truck },
  { label: '04 / RETURN PATH', name: 'Shopify', detail: 'Authorised metafield or fulfilment write', icon: GitBranch },
] as const;

const stages = [
  {
    title: 'Shopify event received',
    system: 'Shopify / entry point',
    short: 'Receive',
    detail: 'A Shopify event can start a fulfilment workflow. This example carries no real customer, address, order number, or merchant payload.',
    boundary: 'Receive only the event types the app is authorised to process. Record minimal diagnostic metadata.',
    code: [
      '// Illustrative flow, not production source',
      'const event = receiveWebhook();',
      'if (!event) return rejectRequest();',
      'markForSignatureVerification(event);',
    ],
  },
  {
    title: 'Authenticate and verify',
    system: 'Cloudflare Worker / trust boundary',
    short: 'Verify',
    detail: 'Before trusting an incoming webhook, verify the sender using the appropriate provider-specific mechanism and authorisation context.',
    boundary: 'Never process an invalid signature. Reject the request; do not queue a Shopify write or treat it as recoverable by blind replay.',
    code: [
      '// Example-only validation decision',
      'if (!verifySender(event)) {',
      '  recordRedactedRejection();',
      '  return rejectRequest();',
      '}',
    ],
  },
  {
    title: 'Map the consignment',
    system: 'Integration / data mapping',
    short: 'Map',
    detail: 'Translate permitted fulfilment context into a valid consignment lookup or provider-specific request. Matching identifiers need careful validation.',
    boundary: 'An attempted mapping is not evidence of a matched consignment or successfully created shipment.',
    code: [
      '// Mapping contract, not a real payload',
      'const reference = normaliseReference(event);',
      'if (!reference) return skipSafely();',
      'const mapped = prepareConsignmentQuery(reference);',
    ],
  },
  {
    title: 'Receive logistics state',
    system: 'CartonCloud / event handling',
    short: 'Track',
    detail: 'Consignment, tracking milestone, and estimated-date events are translated to a defined Shopify-facing state.',
    boundary: 'Out-of-order messages and duplicate deliveries require explicit, testable handling before a later state is overwritten.',
    code: [
      '// Fictional state-normalisation rules',
      'const milestone = normaliseTracking(update);',
      'if (isDuplicate(milestone)) return noChange();',
      'validateTransition(milestone);',
    ],
  },
  {
    title: 'Attempt Shopify update',
    system: 'Cloudflare Worker / write boundary',
    short: 'Write',
    detail: 'An authorised Shopify API operation can store a tracking, fulfilment, or delivery-estimate update against the intended order.',
    boundary: 'A request being prepared or sent does not prove the API write succeeded. Check the response, permissions, and stored result.',
    code: [
      '// Example-only Shopify write guard',
      'const result = await attemptAuthorisedWrite();',
      'if (!result.ok) {',
      '  recordRedactedWriteFailure();',
      '  return stopWithoutSuccess();',
      '}',
    ],
  },
  {
    title: 'Observe and recover',
    system: 'Application / diagnostics',
    short: 'Observe',
    detail: 'Record a minimal, sanitised outcome, inspect failures, and plan safe recovery where replay or retry is appropriate.',
    boundary: 'This completed diagram illustrates a possible path. It is not a live health check or proof of complete production synchronisation.',
    code: [
      '// Example-only observability contract',
      'logOutcomeWithoutCustomerData();',
      'auditRetryAndIdempotencySafety();',
      'reportVerifiedStateOnly();',
    ],
  },
] as const;

const failureCopy: Record<Exclude<Scenario, 'normal'>, {
  title: string; explanation: string; recovery: string;
}> = {
  invalid: {
    title: 'Verification rejected the event',
    explanation: 'The simulated signature check failed. The event is not trusted and no mapping, warehouse processing, or Shopify write follows.',
    recovery: 'Inspect sender configuration and redacted rejection diagnostics. Do not replay an unverified payload or report fulfilment success.',
  },
  writeFailed: {
    title: 'Shopify write did not succeed',
    explanation: 'The simulated Shopify API write failed. No successful tracking or delivery-date update can be claimed, even if earlier mapping steps ran.',
    recovery: 'Inspect scopes, response status, and idempotency. Use bounded, authorised retry only when safe and verify the stored result before notifying anyone.',
  },
};

export default function IntegrationLab() {
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [step, setStep] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);
  const stopAt = scenario === 'invalid' ? 1 : scenario === 'writeFailed' ? 4 : null;
  const blocked = stopAt !== null && step === stopAt;
  const completed = scenario === 'normal' && step === stages.length - 1;
  const current = stages[step];
  const canAdvance = !blocked && step < stages.length - 1;
  const failure = scenario === 'normal' ? null : failureCopy[scenario];

  function setMode(next: Scenario) {
    setScenario(next);
    setStep(0);
    setShowRecovery(false);
  }
  function selectStep(index: number) {
    setStep(stopAt === null ? index : Math.min(index, stopAt));
    setShowRecovery(false);
  }
  function advance() {
    if (canAdvance) {
      setStep(index => Math.min(index + 1, stages.length - 1));
      setShowRecovery(false);
    }
  }

  return (
    <section className="jrv-integration-lab" aria-labelledby="integration-lab-title" id="event-studio">
      <div className="jrv-integration-lab__intro">
        <span>03 / LIVE ENGINEERING EXPLORER</span>
        <h2 id="integration-lab-title">Follow the event. Inspect the boundary.</h2>
        <p>Choose a fictional scenario and trace it through the systems. See how verification, mapping, Shopify writes, and failure recovery should be treated, without connecting to a real warehouse or customer order.</p>
      </div>

      <div className="jrv-integration-lab__shell">
        <div className="jrv-integration-lab__topbar">
          <span className="jrv-integration-lab__dots" aria-hidden="true"><i/><i/><i/></span>
          <strong>JRV / INTEGRATION EVENT STUDIO</strong>
          <span>LOCAL STATE · NO EXTERNAL REQUESTS</span>
        </div>
        <ol className="jrv-integration-lab__systems" aria-label="Conceptual event systems">
          {systems.map((system, index) =>
            <li key={system.label}>
              <span className="jrv-integration-lab__system-label">{system.label}</span>
              <system.icon size={23} aria-hidden="true"/>
              <strong>{system.name}</strong>
              <small>{system.detail}</small>
              {index < systems.length - 1 && <ArrowRight className="jrv-integration-lab__system-arrow" size={17} aria-hidden="true"/>}
            </li>
          )}
        </ol>

        <div className="jrv-integration-lab__scenario">
          <div>
            <span>CHOOSE A FICTIONAL EVENT PATH</span>
            <p>Failures stop the walkthrough before any later stage can be represented as successful.</p>
          </div>
          <div role="group" aria-label="Integration scenario">
            {scenarios.map(option =>
              <button type="button" key={option.key}
                className={scenario === option.key ? 'is-active' : ''}
                aria-pressed={scenario === option.key}
                onClick={() => setMode(option.key)}>{option.name}</button>
            )}
          </div>
        </div>

        <div className="jrv-integration-lab__timeline" role="group" aria-label="Six processing stages">
          {stages.map((stage, index) => {
            const futureBlocked = stopAt !== null && index > stopAt;
            const stopped = stopAt === index && step === index;
            const passed = index < step;
            return (
              <button type="button" key={stage.title}
                aria-pressed={step === index} disabled={futureBlocked}
                className={(step === index ? 'is-selected ' : '') +
                  (stopped ? 'is-stopped ' : '') + (passed ? 'is-passed' : '')}
                onClick={() => selectStep(index)}>
                <span className="jrv-integration-lab__timeline-num">{String(index + 1).padStart(2, '0')}</span>
                <strong>{stage.short}</strong>
                <small>{futureBlocked ? 'BLOCKED' : stopped ? 'REJECTED' : passed ? 'REVIEWED' : step === index ? 'ACTIVE' : 'PENDING'}</small>
              </button>
            );
          })}
        </div>

        <div className="jrv-integration-lab__grid">
          <div className="jrv-integration-lab__detail">
            <span>STAGE {String(step + 1).padStart(2, '0')} / 06 · {current.system}</span>
            <h3 aria-live="polite" aria-atomic="true">{blocked && failure ? failure.title : current.title}</h3>
            <p>{blocked && failure ? failure.explanation : current.detail}</p>
            <div className={'jrv-integration-lab__event' + (blocked ? ' is-failure' : '')}>
              {blocked ? <AlertTriangle size={21} aria-hidden="true"/> : completed ? <CheckCircle2 size={21} aria-hidden="true"/> : <ShieldCheck size={21} aria-hidden="true"/>}
              <div>
                <strong>{blocked ? 'SIMULATED STOP · NO SUCCESS CLAIM' : completed ? 'ILLUSTRATIVE PATH COMPLETE' : 'FICTIONAL EVENT / STEP INSPECTED'}</strong>
                <p>{blocked && failure ? 'Later steps are disabled. No real API write or notification occurred.' : current.boundary}</p>
              </div>
            </div>
            {blocked && failure && showRecovery && (
              <div className="jrv-integration-lab__recovery" role="status">
                <strong>Safe recovery considerations</strong>
                <p>{failure.recovery} This control does not retry anything.</p>
              </div>
            )}
            <div className="jrv-integration-lab__actions">
              {blocked
                ? <button type="button" onClick={() => setShowRecovery(value => !value)}>
                    <AlertTriangle size={16} aria-hidden="true"/>{showRecovery ? 'Hide recovery notes' : 'Inspect safe recovery'}
                  </button>
                : <button type="button" onClick={advance} disabled={!canAdvance}>
                    Next stage <ArrowRight size={16} aria-hidden="true"/>
                  </button>}
              <button type="button" className="is-quiet"
                onClick={() => { setStep(0); setShowRecovery(false); }}>
                <RotateCcw size={15} aria-hidden="true"/> Reset trace
              </button>
            </div>
          </div>
          <div className="jrv-integration-lab__inspector">
            <div className="jrv-integration-lab__inspector-top">
              <span><Code2 size={16} aria-hidden="true"/> {current.short.toUpperCase()} / LOGIC VIEW</span>
              <span>EXAMPLE ONLY</span>
            </div>
            <pre><code>{current.code.join('\n')}</code></pre>
            <div className="jrv-integration-lab__inspector-status" aria-live="polite">
              <span>{blocked ? 'STOPPED' : completed ? 'END OF EXAMPLE' : 'INSPECTION MODE'}</span>
              <p>{blocked ? 'No downstream write or success notification is represented.' : 'This is illustrative pseudocode, not deployed Worker source or a live API trace.'}</p>
            </div>
          </div>
        </div>
        <div className="jrv-integration-lab__bottom">
          <span>AUTHENTICATION → MAPPING → LOGISTICS → SHOPIFY WRITE → DIAGNOSTICS</span>
          <span>NO REAL ORDERS · NO SECRETS</span>
        </div>
      </div>
      <p className="jrv-integration-lab__caveat">This diagram models logical responsibilities, not a guaranteed direct network route or verified end-to-end production result. The published case study distinguishes observed API reads from delivery-date and tracking reliability that still requires representative testing.</p>
    </section>
  );
}
