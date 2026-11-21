'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './consent-manager.css';
import { reportPortfolioClick } from './portfolio-intent-events';

// Optional analytics are OFF until the visitor explicitly accepts.
// The choice is stored only in this browser. This manager does not collect
// contact forms, customer records or session recordings by itself.
// Explicit portfolio link markers can produce fixed, non-PII click-intent
// events through GTM only after consent. No clicks are confirmed enquiries.
// Reversing an accepted choice reloads the page because already-loaded external
// vendor scripts cannot be reliably unloaded in a running document.
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

  function choose(value: 'accepted' | 'rejected') {
    try { window.localStorage.setItem(storageKey, value); } catch { /* Respect blocked storage. */ }
    if (choice === 'accepted' && value === 'rejected') {
      // Opt-out starts a clean document, rather than claiming that embedded
      // third-party scripts and provider cookies have been fully removed.
      window.location.reload();
      return;
    }
    setChoice(value);
    setOpen(false);
  }

  if (choice === 'loading') return null;

  return <>
    {choice === 'accepted' && <Analytics />}
    {open && <section className="jrv-consent" aria-label="Optional website analytics preferences">
      <div><strong>Your privacy. Your choice.</strong><p>Essential site functions work without analytics. With your permission, this portfolio loads Google Tag Manager, Microsoft Clarity and Vercel Analytics, and may count clicks on enquiry emails, résumé downloads and featured projects. Clicks are not confirmed enquiries. No optional analytics runs before you opt in. <a href="/privacy">Read the privacy notice</a>.</p></div>
      <div className="jrv-consent-actions">
        <button type="button" onClick={() => choose('rejected')}>Reject optional</button>
        <button type="button" className="jrv-consent-accept" onClick={() => choose('accepted')}>Allow analytics</button>
      </div>
    </section>}
    <button type="button" className="jrv-consent-settings" onClick={() => setOpen(value => !value)} aria-label="Change analytics privacy choices">Privacy choices</button>
  </>;
}
