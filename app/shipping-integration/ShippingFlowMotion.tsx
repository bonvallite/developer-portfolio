'use client';

import { useRef, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// This page-local enhancement is the only first-stage use of ScrollTrigger.
// Registering it does not install smooth scrolling or touch-wheel interception.
gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Explain how three conceptual services contribute to the final checkout
 * decision. The content and arrow connectors render fully visible in SSR:
 * GSAP only adds a brief sequential highlight when the diagram enters view.
 *
 * ScrollTrigger is scoped and used once, with an explicit Replay button for
 * readers who want to see the path again. Reduced-motion users see the full
 * static diagram and no replay control. None of this performs a rate lookup,
 * changes checkout, accesses private client configuration or sends analytics.
 */
export default function ShippingFlowMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const replay = useRef<(() => void) | null>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const root = scope.current;
      if (!root) return;
      const services = root.querySelectorAll<HTMLElement>('.shipping-story-system');
      const connectors = root.querySelectorAll<HTMLElement>('.shipping-story-flow-line span');
      const outcome = root.querySelector<HTMLElement>('.shipping-story-result');
      if (services.length === 0 || !outcome) return;

      const sequence = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
      sequence.fromTo(
        services,
        { y: 14, filter: 'brightness(0.87)' },
        { y: 0, filter: 'brightness(1)', stagger: 0.22,
          duration: 0.55, clearProps: 'transform,filter' }
      );
      if (connectors.length) {
        sequence.fromTo(
          connectors,
          { scaleY: 0.15, transformOrigin: 'top center' },
          { scaleY: 1, duration: 0.38, stagger: 0.1, clearProps: 'transform' },
          '-=0.12'
        );
      }
      sequence.fromTo(
        outcome,
        { scale: 0.965, filter: 'brightness(1.32)' },
        { scale: 1, filter: 'brightness(1)', duration: 0.58,
          clearProps: 'transform,filter' },
        '-=0.05'
      );

      const trigger = ScrollTrigger.create({
        trigger: root, start: 'top 80%', once: true,
        onEnter: () => sequence.restart(),
      });
      replay.current = () => sequence.restart();
      return () => {
        replay.current = null;
        trigger.kill();
        sequence.kill();
      };
    });
    return () => media.revert();
  }, { scope });

  return (
    <div ref={scope} className="shipping-story-architecture" role="group"
      aria-label="Conceptual flow from Recharge, Zapiet and Shopify into a final checkout rate">
      {children}
      <div className="shipping-story-motion-controls">
        <button type="button" className="shipping-story-replay"
          onClick={() => replay.current?.()}>
          <RotateCcw size={15} aria-hidden="true"/> Replay the rate decision
        </button>
      </div>
    </div>
  );
}
