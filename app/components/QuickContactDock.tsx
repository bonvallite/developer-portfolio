'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

// Only long case studies need a secondary floating enquiry prompt. The homepage,
// four service pages, privacy and résumé routes already have purpose-built CTAs.
// The dock stays hidden until the visitor scrolls beyond the first screen so it
// never obscures hero copy or primary actions, especially on small devices.
// No visitor inputs, server submissions or lead storage. The mailto link
// declares only fixed, consent-gated click-intent metadata (not a sent lead).
const handledRoutes = new Set([
  '/', '/shopify-developer', '/ecommerce-management', '/shopify-cro',
  '/shopify-app-development', '/privacy',
]);

export default function QuickContactDock() {
  const pathname = usePathname() || '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > Math.max(560, window.innerHeight * 0.7);
      setVisible(previous => previous === next ? previous : next);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  if (!visible || handledRoutes.has(pathname) || pathname.startsWith('/resume')) return null;
  const subject = encodeURIComponent('Shopify project discussion | JRV');
  const body = encodeURIComponent('I found your work on ' + pathname + '.\n\nMy project or role:\nDesired outcome:\n');
  return <aside className="jrv-quick-dock" aria-label="Discuss a Shopify project">
    <div><strong>Have a similar challenge?</strong><span>Talk through the requirements.</span></div>
    <a href={'mailto:hello@jrvallite.com?subject=' + subject + '&body=' + body} data-jrv-track="email" data-jrv-intent="project" data-jrv-source="case_dock">Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></a>
    <Link href="/#contact" className="jrv-quick-dock-secondary">Contact options</Link>
  </aside>;
}
