import type { Metadata } from 'next';

// This layout provides search metadata for the client-rendered interactive demo.
// Keep it separate from its client component and avoid inherited home canonicals.
export const metadata: Metadata = {
  title: "Shopify Shipping Calculator & Delivery Scheduling Demo",
  description: "Independent Shopify delivery calculator demonstration covering postcodes, dispatch rules and chilled delivery estimates using fictional data.",
  alternates: { canonical: '/chilled-delivery-demo' },
  openGraph: { url: 'https://www.jrvallite.com/chilled-delivery-demo', title: "Shopify Shipping Calculator & Delivery Scheduling Demo", description: "Independent Shopify delivery calculator demonstration covering postcodes, dispatch rules and chilled delivery estimates using fictional data." },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
