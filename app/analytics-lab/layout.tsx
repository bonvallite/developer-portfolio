import type { Metadata } from 'next';

// The interactive lab page is a Client Component and cannot export Metadata.
// Keep its unique search description, self-canonical and share preview here.
// Metrics in the lab remain entirely synthetic and are never represented as
// verified customer performance or live first-party analytics.
const title = 'Shopify Analytics Lab | Python, GA4 & CRO';
const description = 'Explore a Python analytics lab for Shopify, GA4 and Search Console, with an interactive purchase funnel, CSV example and fictional reporting data.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/analytics-lab' },
  openGraph: {
    type: 'article',
    title,
    description,
    url: 'https://www.jrvallite.com/analytics-lab',
  },
};

export default function AnalyticsLabLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
