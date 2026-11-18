import type { Metadata } from 'next';

// This layout provides search metadata for the client-rendered interactive demo.
// Keep it separate from its client component and avoid inherited home canonicals.
export const metadata: Metadata = {
  title: "Shopify B2B Wholesale Pricing Simulator",
  description: "Interactive fictional Shopify B2B simulator demonstrating weight-based purchasing eligibility and wholesale pricing logic.",
  alternates: { canonical: '/b2b-demo' },
  openGraph: { url: 'https://www.jrvallite.com/b2b-demo', title: "Shopify B2B Wholesale Pricing Simulator", description: "Interactive fictional Shopify B2B simulator demonstrating weight-based purchasing eligibility and wholesale pricing logic." },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
