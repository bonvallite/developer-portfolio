'use client';

import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import StorefrontPreview from './StorefrontPreview';

type Store = readonly [name: string, url: string];

// Client-controlled navigation is deliberately manual: no autoplay, scroll
// hijacking, third-party animation dependencies or fabricated static images.
// Locally optimised 19 November 2026 homepage captures are preferred. The
// screenshot component also retains remote-thumbnail and live-site fallbacks.
// Images show dated public homepages, not endorsements or measured outcomes.
export default function StorefrontShowcase({ stores }: { stores: ReadonlyArray<Store> }) {
  const [active, setActive] = useState(0);
  const [motionKey, setMotionKey] = useState(0);
  const count = stores.length;
  const navigate = useCallback((index: number) => {
    if (!count) return;
    setActive((index + count) % count);
    setMotionKey((previous) => previous + 1);
  }, [count]);

  // Keyboard shortcuts are scoped to the focused gallery, not the whole page,
  // so arrow navigation never interferes with normal document scrolling.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(active + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(active - 1); }
    if (event.key === 'Home') { event.preventDefault(); navigate(0); }
    if (event.key === 'End') { event.preventDefault(); navigate(count - 1); }
  };
  // Honour reduced-motion preferences through CSS only. No timers are used.
  useEffect(() => { if (active >= count && count) setActive(0); }, [active, count]);
  if (!count) return null;
  const [name, url] = stores[active];
  return (
    <section className="cinematic-showcase" aria-label="Storefront portfolio gallery" tabIndex={0} onKeyDown={handleKeyDown}>
      <header className="cinematic-showcase-top">
        <div><span className="overline">SELECTED STOREFRONTS / INTERACTIVE GALLERY</span><p>Browse the responsive homepage previews</p></div>
        <div className="cinematic-showcase-count" aria-label={`Store ${active + 1} of ${count}`}><strong>{String(active + 1).padStart(2, '0')}</strong><span> / {String(count).padStart(2, '0')}</span></div>
      </header>
      <div className="cinematic-showcase-stage">
        <div className="cinematic-showcase-glow" aria-hidden="true"/>
        <div key={motionKey} className="cinematic-showcase-slide">
          <StorefrontPreview name={name} url={url}/>
        </div>
        <div className="cinematic-showcase-navigation">
          <button type="button" onClick={() => navigate(active - 1)} aria-label="Previous storefront"><ArrowLeft size={19}/><span>Previous</span></button>
          <span className="cinematic-showcase-current" role="status" aria-live="polite">{name}</span>
          <button type="button" onClick={() => navigate(active + 1)} aria-label="Next storefront"><span>Next</span><ArrowRight size={19}/></button>
        </div>
      </div>
      <div className="cinematic-showcase-progress" role="presentation">
        {stores.map(([label], index) =>
          <button key={label} type="button" aria-label={`Show ${label}`} aria-current={index === active ? 'true' : undefined} onClick={() => navigate(index)}><span className={index === active ? 'selected' : ''}/></button>)}
      </div>
      <div className="cinematic-showcase-index" aria-label="Choose a storefront">
        {stores.map(([label], index) =>
          <button key={label} type="button" className={index === active ? 'active' : ''} aria-pressed={index === active} onClick={() => navigate(index)}><span className="cinematic-index-number">{String(index + 1).padStart(2, '0')}</span>{label}<ArrowUpRight size={14} aria-hidden="true"/></button>)}
      </div>
      <p className="cinematic-showcase-hint">Use the arrows or choose a store. While the gallery is focused, Left/Right and Home/End also work. Locally hosted captures were taken 19 November 2026 and may show dated promotions or overlays. Other screenshots may be cached.</p>
    </section>
  );
}
