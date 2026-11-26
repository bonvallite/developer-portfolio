'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Official React hook. Register when this homepage-only client module loads;
// it adds no third-party analytics script, new network call or optional plugin.
gsap.registerPlugin(useGSAP);

type Props = { children: ReactNode };

/**
 * Progressive, non-essential GSAP enhancement of the homepage hero.
 *
 * Preserve the exact jrv2-hero-copy class: responsive CSS and browser tests
 * use it. Children remain fully server-rendered and visible before hydration.
 * We never animate opacity/visibility, so no initial blank heading is possible.
 *
 * The hook scopes selector access and reverts tweens on unmount; matchMedia
 * handles users who change their reduced-motion preference during a session.
 * Leave native scrolling, links, and focus alone. ScrollTrigger is not used.
 */
export default function GsapHeroMotion({ children }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const container = scope.current;
      if (!container) return;
      // Explicitly local selectors; no cross-page or global element motion.
      const targets = container.querySelectorAll<HTMLElement>(
        '.jrv2-eyebrow, #jrv2-title, .jrv2-hero-lead'
      );
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { y: 12 },
        {
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'transform',
        }
      );
    });

    // Revert matchMedia handlers and inline transforms on route unmount.
    return () => media.revert();
  }, { scope });

  return <div ref={scope} className="jrv2-hero-copy">{children}</div>;
}
