import type { Metadata } from 'next';

// Server-only metadata wrapper keeps the interactive case-study page client-side
// without leaking internal theme source, customer details, or tracking data.
export const metadata: Metadata = {
  title: 'Custom Shopify Storefront Engineering | JRV',
  description: 'Explore a fictional interactive demonstration of Figma-led Shopify theme engineering, Liquid sections, mega navigation, product pages, and delivery UX.',
  alternates: { canonical: '/projects/storefront-engineering' },
  robots: { index: true, follow: true },
};
export default function Layout({children}:{children:React.ReactNode}){return children;}
