import './globals.css';
import type { Metadata } from 'next';
import ConsentManager from './components/ConsentManager';
import QuickContactDock from './components/QuickContactDock';

// Public wordmark JRV. The approved {JRV} favicon remains app/icon.svg.
// Canonical URLs are route-specific; the root must never canonicalise every
// service or case-study URL to the homepage. Avoid personal-name metadata.
export const metadata: Metadata = {
  metadataBase: new URL('https://www.jrvallite.com'),
  title: { default: 'Shopify Developer & Ecommerce Manager | CRO & Custom Apps', template: '%s | JRV' },
  description: 'Shopify development, ecommerce management, conversion rate optimisation, custom apps and API integrations. Explore practical projects and technical expertise.',
  keywords: ['Shopify developer', 'Shopify expert', 'ecommerce manager', 'Shopify CRO specialist', 'Shopify app developer', 'Shopify API integration', 'Shopify B2B developer'],
  openGraph: {
    type: 'website',
    siteName: 'JRV | Shopify Commerce Engineering',
    title: 'Shopify Developer & Ecommerce Manager | CRO & Custom Apps',
    description: 'Shopify storefront engineering, ecommerce operations, CRO, custom integrations and automation.',
    // The app/opengraph-image.tsx file creates the self-hosted branded image.
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  robots: { index: true, follow: true },
};

// 2026-11-20 privacy improvement: tracking scripts are no longer rendered
// in the shared document head. ConsentManager handles all optional GTM,
// Microsoft Clarity and Vercel Analytics only after explicit opt-in. No
// third-party preconnect is made from this layout for hidden thumbnails.
// Neither this component nor its manager verifies upstream vendor retention.
// Put the consent manager before main content: the mobile (<800px) choice
// panel is part of normal flow, instead of covering contact and hiring CTAs.
// Desktop still renders a fixed compact panel; the settings control remains
// accessible everywhere and analytics continues to require opt-in.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <ConsentManager />
        {children}
        <QuickContactDock />
      </body>
    </html>
  );
}
