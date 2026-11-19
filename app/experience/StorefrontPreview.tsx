'use client';

import { useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';

// The screenshots are supplied by WordPress mShots for the public homepage.
// Captures may be cached, blocked or temporarily unavailable. Keep the
// dimensions stable and provide an accessible live-site fallback on error.
function storefrontShot(url: string, device: 'desktop' | 'mobile') {
  const viewport = device === 'desktop' ? { width: 1280, height: 800 } : { width: 390, height: 844 };
  // Keep the source viewport accurate, but request thumbnails sized for the UI.
  // This reduces bytes for warm captures without altering the site's responsive view.
  const output = device === 'desktop' ? { width: 680, height: 425 } : { width: 220, height: 476 };
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?vpw=${viewport.width}&vph=${viewport.height}&w=${output.width}&h=${output.height}`;
}

function Screenshot({ name, url, device }: { name: string; url: string; device: 'desktop' | 'mobile' }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return <div className={`storefront-device ${device}`}>
    <span className="overline">{device === 'desktop' ? 'DESKTOP / 1280 PX VIEWPORT' : 'MOBILE / 390 PX VIEWPORT'}</span>
    <div className={`storefront-screen${loaded ? " is-ready" : ""}`}>
      {failed ? <div className="storefront-shot-unavailable" role="status"><ImageOff size={20} aria-hidden="true"/><p>Preview unavailable</p><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} live website instead`}>View live site <ArrowUpRight size={12} aria-hidden="true"/></a></div> :
      // Plain img avoids image-optimisation proxying of third-party snapshots.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={storefrontShot(url, device)} alt={`${device === 'desktop' ? 'Desktop' : 'Mobile'} homepage preview of ${name}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
    </div>
  </div>;
}

export default function StorefrontPreview({ name, url }: { name: string; url: string }) {
  return <article className="storefront-preview-card">
    <div className="storefront-preview-head"><h3>{name}</h3><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website`}>Visit website <ArrowUpRight size={15}/></a></div>
    <div className="storefront-preview-pair"><Screenshot name={name} url={url} device="desktop"/><Screenshot name={name} url={url} device="mobile"/></div>
  </article>;
}
