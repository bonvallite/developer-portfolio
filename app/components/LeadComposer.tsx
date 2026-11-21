'use client';

import { useState } from 'react';
import { ArrowUpRight, Copy, Mail, ShieldCheck } from 'lucide-react';

// No lead database, third-party form or analytics event is created here.
// The brief is held only in React memory and inserted into the visitor's own
// email application when they click the explicit email-draft action.
const mailbox = 'hello@jrvallite.com';
const choices = {
  project: {
    label: 'I have a Shopify project',
    subject: 'Shopify project enquiry | JRV',
    questions: 'Store or business:\nChallenge:\nScope and intended outcome:\nTimeline:\n',
  },
  role: {
    label: 'I am hiring',
    subject: 'Shopify / ecommerce role enquiry | JRV',
    questions: 'Company:\nRole and responsibilities:\nEmployment arrangement:\nNext step:\n',
  },
} as const;

export default function LeadComposer() {
  const [intent, setIntent] = useState<keyof typeof choices>('project');
  const [brief, setBrief] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle');
  const selected = choices[intent];
  const mailto = 'mailto:' + mailbox + '?subject=' + encodeURIComponent(selected.subject) +
    '&body=' + encodeURIComponent(selected.questions + (brief.trim() ? '\nAdditional context:\n' + brief.trim() + '\n' : ''));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(mailbox);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('unavailable');
    }
  }

  return <div className="jrv2-lead" aria-labelledby="jrv2-lead-heading">
    <div className="jrv2-lead-intro">
      <span className="jrv2-overline">YOUR NEXT STEP / DIRECT CONTACT</span>
      <h3 id="jrv2-lead-heading">Start with the challenge.</h3>
      <p>Choose the kind of conversation and open a pre-filled email. No account, tracking form or unnecessary steps.</p>
      <div className="jrv2-lead-promise"><ShieldCheck size={19} aria-hidden="true" /> Your message stays on your device until you choose to send it.</div>
    </div>
    <div className="jrv2-lead-form">
      <fieldset className="jrv2-lead-choices"><legend>What brings you here?</legend>
        {(Object.keys(choices) as Array<keyof typeof choices>).map(value =>
          <button key={value} type="button" className={'jrv2-lead-choice' + (intent === value ? ' is-selected' : '')}
            aria-pressed={intent === value} onClick={() => setIntent(value)}>{choices[value].label}</button>
        )}
      </fieldset>
      <label htmlFor="jrv2-project-brief">Optional: a short description</label>
      <textarea id="jrv2-project-brief" value={brief} onChange={event => setBrief(event.target.value)}
        rows={3} maxLength={600} placeholder="Tell me what you need help with. Do not include passwords, customer information or confidential data." />
      <div className="jrv2-lead-actions">
        <a className="jrv2-cta jrv2-cta-primary" href={mailto}><Mail size={18} aria-hidden="true" /> Open email draft <ArrowUpRight size={18} aria-hidden="true" /></a>
        <button type="button" className="jrv2-copy" onClick={copyEmail}><Copy size={16} aria-hidden="true" /> Copy email</button>
      </div>
      <p className="jrv2-lead-email" aria-live="polite">{copyStatus === 'copied' ? 'Copied: ' : copyStatus === 'unavailable' ? 'Copy unavailable. Email: ' : 'Or email directly: '}<strong>{mailbox}</strong></p>
    </div>
  </div>;
}
