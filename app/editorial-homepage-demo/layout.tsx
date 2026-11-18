import type { Metadata } from 'next';

// This layout provides search metadata for the client-rendered interactive demo.
// Keep it separate from its client component and avoid inherited home canonicals.
export const metadata: Metadata = {
  title: "Custom Shopify Homepage UX Demonstration",
  description: "Independent interactive Shopify storefront homepage concept illustrating responsive merchandising, discovery, promotional sections and UX.",
  alternates: { canonical: '/editorial-homepage-demo' },
  openGraph: { url: 'https://www.jrvallite.com/editorial-homepage-demo', title: "Custom Shopify Homepage UX Demonstration", description: "Independent interactive Shopify storefront homepage concept illustrating responsive merchandising, discovery, promotional sections and UX." },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
