import type { Metadata } from 'next';
import CinematicB2B from './CinematicB2B';

// Server component retains metadata and defers interactive chapter state to
// CinematicB2B.tsx. This keeps the route discoverable, accessible, and static.
// Fictional product prices and distinct legacy/native accounting definitions
// are documented in the client component; do not mix them as one sales series.
// 21 Nov crawl: title budget includes the root layout's ' | JRV' suffix;
// the description retains the platform concepts without outcome claims.
export const metadata: Metadata = {
  title: 'Shopify B2B Modernisation | Markets & Catalogues',
  description: 'Explore Shopify B2B modernisation across Markets, Catalogues and company purchasing, with a five-chapter case study of wholesale pricing changes.',
  alternates: { canonical: '/b2b-modernisation' },
};

export default function B2BModernisationPage(){
  return <CinematicB2B/>;
}
