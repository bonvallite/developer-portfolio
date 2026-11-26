'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Shared by the fictional Commerce Engineering, CartonCloud and Spend & Save
// diagrams. Registration changes no tracking, network or global scroll state.
gsap.registerPlugin(useGSAP);

/**
 * Animate the already-selected diagram stage, never decide which stage passed.
 *
 * The host owns every permission, failure, step and derived value. Call this
 * hook with a stable stage identity and apply the returned ref to its diagram
 * root. Mark active visual nodes with data-gsap-focus="true" and the current
 * explanatory panel with data-gsap-detail. Existing aria-pressed, disabled,
 * aria-live and pseudocode remain source-of-truth and work without GSAP.
 *
 * MatchMedia skips motion on reduced-motion preference and reverts on change;
 * revertOnUpdate removes stale transforms when React changes the stage or
 * route. Brightness >=1 and transforms keep all text visible and focusable.
 */
export function useDiagramStageMotion(stageKey: string) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const root = scope.current;
      if (!root) return;
      const focus = root.querySelectorAll<HTMLElement>('[data-gsap-focus="true"]');
      const details = root.querySelectorAll<HTMLElement>('[data-gsap-detail]');
      if (!focus.length) return;

      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
      timeline.fromTo(
        focus,
        { scale: 0.955, filter: 'brightness(1.55)' },
        { scale: 1, filter: 'brightness(1)', duration: 0.52,
          stagger: 0.07, clearProps: 'transform,filter' }
      );
      if (details.length) {
        timeline.fromTo(
          details,
          { y: 9 },
          { y: 0, duration: 0.43, stagger: 0.06,
            clearProps: 'transform' },
          '<0.08'
        );
      }
    });
    return () => media.revert();
  }, { scope, dependencies: [stageKey], revertOnUpdate: true });

  return scope;
}
