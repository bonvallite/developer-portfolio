import type { Metadata } from 'next';

// The Spend & Save demo is a Client Component, so route metadata belongs in
// this server layout. The illustrated thresholds, gifts, order edits and Flow
// execution are fictional; this route does not represent a live checkout.
const title = 'Shopify Spend & Save Rewards | Flow Automation';
const description = 'Explore an interactive Shopify Spend & Save reward journey, with cart milestones, post-checkout Shopify Flow gifting and fictional customer examples.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/projects/spend-and-save' },
  openGraph: {
    type: 'article',
    title,
    description,
    url: 'https://www.jrvallite.com/projects/spend-and-save',
  },
};

export default function SpendSaveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
