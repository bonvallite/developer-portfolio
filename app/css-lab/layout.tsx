import type { Metadata } from 'next';

// This layout provides search metadata for the client-rendered interactive demo.
// Keep it separate from its client component and avoid inherited home canonicals.
export const metadata: Metadata = {
  title: "CSS Engineering Lab | Shopify Frontend Skills",
  description: "Interactive CSS engineering demonstrations for responsive layout, specificity, positioning and storefront frontend fundamentals.",
  alternates: { canonical: '/css-lab' },
  openGraph: { url: 'https://www.jrvallite.com/css-lab', title: "CSS Engineering Lab | Shopify Frontend Skills", description: "Interactive CSS engineering demonstrations for responsive layout, specificity, positioning and storefront frontend fundamentals." },
};

export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
