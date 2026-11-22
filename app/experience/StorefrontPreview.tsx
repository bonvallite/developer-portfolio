'use client';

import { useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { approvedStaticStorefrontShot } from '../data/storefronts';

// Only same-origin, checksum-verified WebPs from 19 November 2026 are shown.
// No external screenshot service or remote thumbnails run in the browser.
// An image that is absent or fails loading instead shows a direct live-site
// link without changing the device-frame size. Axlrodd desktop is excluded.
// Historical screenshots are not evidence of endorsement or current designs.
function Screenshot({ name, url, device }: { name: string; url: string; device: 'desktop' | 'mobile' }) {
  const localShot = approvedStaticStorefrontShot(name, device);
  const [unavailable, setUnavailable] = useState(!localShot);
  const [loaded, setLoaded] = useState(false);
  function recoverImage() {
    setLoaded(false);
    setUnavailable(true);
  }
  return <div className={`storefront-device ${device}`}>
    <span className="overline">{device === 'desktop' ? 'DESKTOP / 1280 PX VIEWPORT' : 'MOBILE / 390 PX VIEWPORT'}</span>
    <div className={`storefront-screen${loaded ? ' is-ready' : ''}`}>
      {unavailable || !localShot
        ? <div className="storefront-shot-unavailable" role="status">
            <ImageOff size={20} aria-hidden="true"/>
            <p>{localShot ? 'Preview unavailable' : `${device === 'desktop' ? 'Desktop' : 'Mobile'} preview not archived`}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} live website instead`}>View live site <ArrowUpRight size={12} aria-hidden="true"/></a>
          </div>
        : <img src={localShot}
            alt={`${device === 'desktop' ? 'Desktop' : 'Mobile'} homepage preview of ${name}`}
            loading="lazy" decoding="async" referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)} onError={recoverImage} />}
    </div>
  </div>;
}

export default function StorefrontPreview({ name, url }: { name: string; url: string }) {
  return <article className="storefront-preview-card">
    <div className="storefront-preview-head"><h3>{name}</h3><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website`}>Visit website <ArrowUpRight size={15}/></a></div>
    <div className="storefront-preview-pair"><Screenshot name={name} url={url} device="desktop"/><Screenshot name={name} url={url} device="mobile"/></div>
  </article>;
}
