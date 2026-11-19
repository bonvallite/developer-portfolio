import type { Metadata } from 'next';
import CinematicB2B from './CinematicB2B';

// Server component retains metadata and defers interactive chapter state to
// CinematicB2B.tsx. This keeps the route discoverable, accessible, and static.
// Fictional product prices and distinct legacy/native accounting definitions
// are documented in the client component; do not mix them as one sales series.
export const metadata: Metadata = {
  title: 'Shopify B2B Modernisation | Markets & Catalogues Case Study',
  description: 'A five-chapter interactive case study: replacing third-party wholesale price logic with Shopify Markets, Catalogues, company purchasing contexts, and an evidence-led sales history.',
  alternates: { canonical: '/b2b-modernisation' },
};

export default function B2BModernisationPage(){
  return <CinematicB2B/>;
}
