'use client';

import { useCallback, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';

// A self-contained, manually operated 3D book for public storefront references.
// Names and links are portfolio references, not endorsements or evidence of
// individual authorship. Screenshots come from an external public-site thumbnail
// service; a failed request falls back to a simple, legible editorial panel.
// Only the visible book faces mount images, avoiding six hidden-sheet requests.
// Each spread has a project-context CTA and a separate public-site link;
// the latter is not an endorsement or proof of exclusive authorship.
const pages = [
  { name: 'Peter Augustus', category: 'THEME ENGINEERING / OPERATIONS', detail: 'Modular homepage UX, product discovery, delivery logic and storefront maintenance.', url: 'https://www.peteraugustus.com.au/', caseHref: '/experience#custom-homepage', caseLabel: 'View homepage case study' },
  { name: 'Eve Curls', category: 'SHOPIFY MARKETS / INTERNATIONAL', detail: 'A six-market Shopify architecture spanning storefront, catalogues, currencies and localisation.', url: 'https://www.evecurls.com/', caseHref: '/eve-curls', caseLabel: 'Explore Markets demo' },
  { name: 'Poseidon Animal Health', category: 'STOREFRONT EXPERIENCE', detail: 'Public storefront reference demonstrating responsive merchandising and product discovery.', url: 'https://poseidonanimalhealth.com.au/', caseHref: '/experience', caseLabel: 'View experience overview' },
  { name: 'Jace Industries', category: 'STOREFRONT EXPERIENCE', detail: 'Public storefront reference within the broader Shopify development and management portfolio.', url: 'https://jaceindustries.com/', caseHref: '/experience', caseLabel: 'View experience overview' },
] as const;

const sheetCount = 3;
function StoreImage({ name, url }: { name: string; url: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // A cached public homepage thumbnail, not an authenticated production capture.
  // Keep the 900px capture viewport but request a 520px-wide thumbnail.
  // Remote generation can still be slow on a cold cache; only mount visible pages.
  const source = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?vpw=900&vph=620&w=520&h=358`;
  return <div className={`rotation-image${loaded ? " is-ready" : ""}`}>
    {error ? <div className="rotation-image-fallback"><span>STOREFRONT PREVIEW</span><strong>{name}</strong><small>Open the live site to view its current homepage.</small></div> :
      // eslint-disable-next-line @next/next/no-img-element
      <img src={source} alt={`Public homepage preview of ${name}`} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setError(true)} referrerPolicy="no-referrer"/>}
  </div>;
}
function ReferencePage({ index }: { index: number }) {
  const page = pages[index];
  return <div className="rotation-page-content">
    <div className="rotation-meta"><span>{page.category}</span><span>{String(index + 1).padStart(2, '0')} / 04</span></div>
    <StoreImage name={page.name} url={page.url}/>
    <div className="rotation-summary"><h3>{page.name}</h3><p>{page.detail}</p></div>
    <div className="rotation-page-actions"><Link href={page.caseHref} onClick={event => event.stopPropagation()} className="rotation-case-link">{page.caseLabel} <ArrowUpRight size={13}/></Link><a href={page.url} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}>Live website <ArrowUpRight size={13}/></a></div>
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
      <span className="rotation-kicker">SELECTED WORK / THE STOREFRONT ARCHIVE</span>
      <h2>More than a storefront. <em>Engineering behind every experience.</em></h2>
      <p>Explore responsive Shopify interfaces, multi-market architecture and ongoing ecommerce operations. Each spread connects a live storefront reference with the related work or technical approach.</p>
    </div>
    <div className="rotation-scene" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`rotation-book rotation-book--${state}`}>
        {Array.from({length: sheetCount}, (_, index) => {
          const flipped = index < currentSheet;
          const frontVisible = index === currentSheet;
          const backVisible = index === currentSheet - 1;
          return <div key={index} className={`rotation-sheet${flipped ? ' is-flipped' : ''}`} style={{zIndex:flipped ? index + 1 : sheetCount - index}}>
            <div className={`rotation-face rotation-face--front${index === 0 ? ' rotation-cover' : ''}`} aria-hidden={!frontVisible} inert={!frontVisible}>
              {index === 0 ? <div className="rotation-cover-content"><span>EC. / WORK ARCHIVE</span><h3>SHOPIFY<br/>WORK<br/>ARCHIVE</h3><p>Storefront UX · B2B · Integrations · CRO</p><span>OPEN TO EXPLORE THE WORK</span></div> : frontVisible ? <ReferencePage index={index === 1 ? 1 : 3}/> : null}
              {frontVisible && <button className="rotation-turn-surface" type="button" aria-label={index === 0 ? 'Open the book' : 'Turn to next page'} onClick={() => faceClick(index,'front')}/>}
            </div>
            <div className={`rotation-face rotation-face--back${index === sheetCount - 1 ? ' rotation-cover rotation-back-cover' : ''}`} aria-hidden={!backVisible} inert={!backVisible}>
              {index === sheetCount - 1 ? <div className="rotation-cover-content"><span>BEYOND THE SCREENSHOTS</span><h3>BUILT.<br/>MANAGED.<br/>OPTIMISED.</h3><p>See the technical responsibilities, selected projects and practical demonstrations.</p><Link href="/experience" className="rotation-cover-link" onClick={event=>event.stopPropagation()}>View experience &amp; case studies <ArrowUpRight size={15}/></Link></div> : backVisible ? <ReferencePage index={index === 0 ? 0 : 2}/> : null}
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
    <p className="rotation-hint">Turn the pages using the controls or swipe on mobile. Case-study links explain the work; live-site links open the public storefronts.</p>
    <div className="rotation-after"><div><strong>Want the technical details?</strong><span> Public references, not client endorsements or verified performance claims.</span></div><Link href="/experience">Explore projects &amp; experience <ArrowUpRight size={17}/></Link></div>
  </section>;
}
