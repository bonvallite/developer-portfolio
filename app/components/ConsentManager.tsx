'use client';

import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './consent-manager.css';
import { reportPortfolioClick } from './portfolio-intent-events';

// Optional analytics are OFF until the visitor explicitly accepts.
// The choice is stored only in this browser. This manager does not collect
// contact forms, customer records or session recordings by itself.
// Explicit portfolio link markers can produce fixed, non-PII click-intent
// events through GTM only after consent. No clicks are confirmed enquiries.
// The always-available privacy settings button exposes its expanded state.
// Mobile shows the initial panel before page content in normal document flow
// rather than overlaying contact actions. Only explicit user reopening moves
// keyboard focus to the panel heading. Escape may dismiss an unresolved panel
// without accepting analytics; settings remains available to reopen it.
// Reversing an accepted choice reloads because already-loaded vendor scripts
// cannot be reliably unloaded in a running document.
const storageKey = 'jrv-optional-analytics-consent-v1';
type Choice = 'loading' | 'unresolved' | 'accepted' | 'rejected';
type ClarityQueue = ((...args: unknown[]) => void) & { q?: unknown[][] };
type TrackingWindow = Window & {
  dataLayer?: unknown[];
  clarity?: ClarityQueue;
};

function enableExternalAnalytics() {
  const w = window as TrackingWindow;
  if (!document.querySelector('script[data-jrv-analytics="gtm"]')) {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.dataset.jrvAnalytics = 'gtm';
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KVJVH4VM';
    document.head.appendChild(script);
  }
  if (!document.querySelector('script[data-jrv-analytics="clarity"]')) {
    if (!w.clarity) {
      const stub: ClarityQueue = (...args: unknown[]) => {
        stub.q = stub.q || [];
        stub.q.push(args);
      };
      stub.q = [];
      w.clarity = stub;
    }
    const script = document.createElement('script');
    script.async = true;
    script.dataset.jrvAnalytics = 'clarity';
    script.src = 'https://www.clarity.ms/tag/zekmhvjftc';
    document.head.appendChild(script);
  }
}

export default function ConsentManager() {
  const [choice, setChoice] = useState<Choice>('loading');
  const [open, setOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);
  const focusOnReopen = useRef(false);
  const restoreFocusOnClose = useRef(false);

  useEffect(() => {
    // Delegation covers server-rendered links and client-side route transitions
    // without turning every portfolio page into a client component. Never read
    // link hrefs or submitted text: mailto URLs may contain visitor messages.
    const onTrackedClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[data-jrv-track]');
      if (link) reportPortfolioClick(link);
    };
    document.addEventListener('click', onTrackedClick, true);
    return () => document.removeEventListener('click', onTrackedClick, true);
  }, []);

  useEffect(() => {
    let previous: string | null = null;
    try { previous = window.localStorage.getItem(storageKey); } catch { /* Storage may be blocked. */ }
    const stored: Choice = previous === 'accepted' ? 'accepted' : previous === 'rejected' ? 'rejected' : 'unresolved';
    setChoice(stored);
    setOpen(stored === 'unresolved');
  }, []);

  useEffect(() => {
    if (choice === 'accepted') enableExternalAnalytics();
  }, [choice]);

  useEffect(() => {
    // A first-visit banner does not steal focus. When the settings control
    // explicitly reopens it, announce the labelled section by focusing its
    // heading. Return focus to settings after closing or choosing a preference.
    if (open && focusOnReopen.current) {
      focusOnReopen.current = false;
      headingRef.current?.focus();
    } else if (!open && restoreFocusOnClose.current) {
      restoreFocusOnClose.current = false;
      settingsRef.current?.focus();
    }
  }, [open]);

  function togglePreferences() {
    if (open) restoreFocusOnClose.current = true;
    else focusOnReopen.current = true;
    setOpen(value => !value);
  }

  function dismissWithoutConsent() {
    // Escape changes only panel visibility, never the consent decision.
    // A visitor who has not opted in must remain untracked.
    restoreFocusOnClose.current = true;
    setOpen(false);
  }

  function choose(value: 'accepted' | 'rejected') {
    try { window.localStorage.setItem(storageKey, value); } catch { /* Respect blocked storage. */ }
    if (choice === 'accepted' && value === 'rejected') {
      // Opt-out starts a clean document, rather than claiming that embedded
      // third-party scripts and provider cookies have been fully removed.
      window.location.reload();
      return;
    }
    restoreFocusOnClose.current = true;
    setChoice(value);
    setOpen(false);
  }

  if (choice === 'loading') return null;

  return <>
    {choice === 'accepted' && <Analytics />}
    {open && <section id="jrv-consent-panel" className="jrv-consent" aria-labelledby="jrv-consent-title" aria-describedby="jrv-consent-description" onKeyDown={event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        dismissWithoutConsent();
      }
    }}>
      <div><h2 ref={headingRef} id="jrv-consent-title" tabIndex={-1}>Your privacy. Your choice.</h2><p id="jrv-consent-description">Optional analytics are off until you agree. Allowing them loads Google Tag Manager, Microsoft Clarity and Vercel Analytics, which may count enquiry-email, résumé and project clicks, not sent enquiries. The site works without analytics. <a href="/privacy">Read the privacy notice</a>.</p></div>
      <div className="jrv-consent-actions">
        <button type="button" onClick={() => choose('rejected')}>Reject optional</button>
        <button type="button" className="jrv-consent-accept" onClick={() => choose('accepted')}>Allow analytics</button>
      </div>
    </section>}
    <button ref={settingsRef} type="button" className="jrv-consent-settings" onClick={togglePreferences} aria-label="Change analytics privacy choices" aria-controls="jrv-consent-panel" aria-expanded={open}>Privacy choices</button>
  </>;
}
