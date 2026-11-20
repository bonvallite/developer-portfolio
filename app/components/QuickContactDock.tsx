'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

// Small contact route for long-form case studies and service pages.
// It does not intercept navigation, submit visitor data or claim a booked call.
// The homepage already has a dedicated enquiry section and does not need it.
export default function QuickContactDock() {
  const pathname = usePathname() || '/';
  if (pathname === '/' || pathname.startsWith('/resume') || pathname === '/privacy') return null;
  const subject = encodeURIComponent('Shopify project discussion | JRV');
  const body = encodeURIComponent('I found your work on ' + pathname + '.\n\nMy project or role:\nDesired outcome:\n');
  return <aside className="jrv-quick-dock" aria-label="Discuss a Shopify project">
    <div><strong>Have a similar challenge?</strong><span>Talk through the requirements.</span></div>
    <a href={'mailto:hello@jrvallite.com?subject=' + subject + '&body=' + body}>Discuss a project <ArrowUpRight size={16} aria-hidden="true" /></a>
    <Link href="/#contact" className="jrv-quick-dock-secondary">Contact options</Link>
  </aside>;
}
