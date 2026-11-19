'use client';

import { useCallback, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';

// A self-contained, manually operated 3D book for public storefront references.
// Names and links are portfolio references, not endorsements or evidence of
// individual authorship. Screenshots come from an external public-site thumbnail
// service; a failed request falls back to a simple, legible editorial panel.
const pages = [
  { name: 'Peter Augustus', category: 'AUSTRALIAN ECOMMERCE', detail: 'Responsive homepage & Shopify operations', url: 'https://www.peteraugustus.com.au/' },
  { name: 'Eve Curls', category: 'INTERNATIONAL COMMERCE', detail: 'European-market storefront reference', url: 'https://www.evecurls.com/' },
  { name: 'Poseidon Animal Health', category: 'STOREFRONT REFERENCE', detail: 'Commerce experience and responsive discovery', url: 'https://poseidonanimalhealth.com.au/' },
  { name: 'Jace Industries', category: 'STOREFRONT REFERENCE', detail: 'Shopify storefront and customer journey', url: 'https://jaceindustries.com/' },
] as const;

const sheetCount = 3;
function StoreImage({ name, url }: { name: string; url: string }) {
  const [error, setError] = useState(false);
  // A cached public homepage thumbnail, not an authenticated production capture.
  const source = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?vpw=900&vph=620&w=900&h=620`;
  return <div className="rotation-image">
    {error ? <div className="rotation-image-fallback"><span>STOREFRONT PREVIEW</span><strong>{name}</strong><small>Open the live site to view its current homepage.</small></div> :
      // eslint-disable-next-line @next/next/no-img-element
      <img src={source} alt={`Public homepage preview of ${name}`} loading="lazy" decoding="async" onError={() => setError(true)} referrerPolicy="no-referrer"/>}
  </div>;
}
function ReferencePage({ index }: { index: number }) {
  const page = pages[index];
  return <div className="rotation-page-content">
    <div className="rotation-meta"><span>{page.category}</span><span>{String(index + 1).padStart(2, '0')} / 04</span></div>
    <StoreImage name={page.name} url={page.url}/>
    <div className="rotation-summary"><h3>{page.name}</h3><p>{page.detail}</p></div>
    <div className="rotation-page-actions"><span>PUBLIC SITE REFERENCE</span><a href={page.url} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}>Visit site <ArrowUpRight size={14}/></a></div>
  </div>;
}

// The book is anchored on the RIGHT HALF of the 3D scene. On this anchor,
// -50% centres the closed front, 0% centres an open spread, and +50% centres
// the closed back. This geometric choice keeps all states inside the stage.
export default function RotationArchive() {
  const [currentSheet, setCurrentSheet] = useState(0);
  const [swipeX, setSwipeX] = useState<number | null>(null);
  const turn = useCallback((direction: number) => setCurrentSheet(value => Math.max(0, Math.min(sheetCount, value + direction))), []);
  const state = currentSheet === 0 ? 'front' : currentSheet === sheetCount ? 'back' : 'open';
  const label = currentSheet === 0 ? 'Cover' : currentSheet === sheetCount ? 'Back cover' : `Spread ${currentSheet} of ${sheetCount - 1}`;
  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.target instanceof HTMLElement && event.target.closest('a, button')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); turn(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turn(-1); }
  }
  function handleTouchStart(event: TouchEvent<HTMLElement>) { setSwipeX(event.touches[0]?.clientX ?? null); }
  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (swipeX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? swipeX) - swipeX;
    setSwipeX(null);
    if (Math.abs(delta) > 40) turn(delta < 0 ? 1 : -1);
  }
  function faceClick(index: number, side: 'front'|'back') {
    if (side === 'front' && index === currentSheet) turn(1);
    if (side === 'back' && index === currentSheet - 1) turn(-1);
  }
  return <section id="storefront-archive" className="rotation-archive" aria-label="Interactive storefront lookbook" tabIndex={0} onKeyDown={handleKeys}>
    <div className="rotation-heading">
      <span className="rotation-kicker">THE STOREFRONT ARCHIVE / VOL. 01</span>
      <h2>Commerce work, <em>page by page.</em></h2>
      <p>Turn through selected storefront references, then explore the technical work behind the experience.</p>
    </div>
    <div className="rotation-scene" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`rotation-book rotation-book--${state}`}>
        {Array.from({length: sheetCount}, (_, index) => {
          const flipped = index < currentSheet;
          const frontVisible = index === currentSheet;
          const backVisible = index === currentSheet - 1;
          return <div key={index} className={`rotation-sheet${flipped ? ' is-flipped' : ''}`} style={{zIndex:flipped ? index + 1 : sheetCount - index}}>
            <div className={`rotation-face rotation-face--front${index === 0 ? ' rotation-cover' : ''}`} aria-hidden={!frontVisible}>
              {index === 0 ? <div className="rotation-cover-content"><span>EC. / WORK ARCHIVE</span><h3>THE<br/>ROTATION<br/>ARCHIVE</h3><p>Shopify Commerce Engineering</p><span>INTERACTIVE EDITION · 2026</span></div> : <ReferencePage index={index === 1 ? 1 : 3}/>}
              {frontVisible && <button className="rotation-turn-surface" type="button" aria-label={index === 0 ? 'Open the book' : 'Turn to next page'} onClick={() => faceClick(index,'front')}/>}
            </div>
            <div className={`rotation-face rotation-face--back${index === sheetCount - 1 ? ' rotation-cover rotation-back-cover' : ''}`} aria-hidden={!backVisible}>
              {index === sheetCount - 1 ? <div className="rotation-cover-content"><span>END OF ARCHIVE</span><h3>WHAT<br/>COMES<br/>NEXT?</h3><p>Explore the projects behind the storefronts.</p><Link href="/experience" className="rotation-cover-link" onClick={event=>event.stopPropagation()}>Explore experience <ArrowUpRight size={15}/></Link></div> : <ReferencePage index={index === 0 ? 0 : 2}/>}
              {backVisible && index !== sheetCount - 1 && <button className="rotation-turn-surface rotation-turn-surface--back" type="button" aria-label="Turn to previous page" onClick={() => faceClick(index,'back')}/>}
            </div>
          </div>;
        })}
      </div>
    </div>
    <div className="rotation-controls">
      <button type="button" disabled={currentSheet === 0} onClick={() => turn(-1)}><ArrowLeft size={18}/> Prev</button>
      <span role="status" aria-live="polite" className="rotation-count">{label}</span>
      {currentSheet === sheetCount
        ? <button type="button" onClick={() => setCurrentSheet(0)}><RotateCcw size={17}/> Back to cover</button>
        : <button type="button" onClick={() => turn(1)}>Next <ArrowRight size={18}/></button>}
    </div>
    <p className="rotation-hint">Use the controls, click a visible page, or swipe on mobile. Select a live-site link to open the website without turning the page.</p>
    <div className="rotation-after"><span>PUBLIC EXPERIENCE REFERENCES · NOT CLIENT ENDORSEMENTS</span><Link href="/experience">View the full cinematic gallery <ArrowUpRight size={17}/></Link></div>
  </section>;
}
