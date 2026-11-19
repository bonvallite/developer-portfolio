import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
// Public wordmark: EC. (Shopify Commerce Engineering). The approved {JRV}
// browser favicon is intentionally different and remains in app/icon.svg,
// using the site's gold-on-charcoal palette.
// Next.js discovers this self-contained, transparent-corner favicon automatically.
// Do not add a competing metadata.icons entry or a legacy favicon.ico.
// Search metadata describes services, not the site owner's personal name.
// Keep canonical URLs aligned with the www domain; avoid Person schema.
export const metadata: Metadata = {
  metadataBase: new URL('https://www.jrvallite.com'),
  title: { default: 'Shopify Developer & Ecommerce Manager | CRO & Custom Apps', template: '%s | Shopify Commerce Engineering' },
  description: 'Shopify development, ecommerce management, conversion rate optimisation, custom apps and API integrations. Explore practical projects and technical expertise.',
  keywords: ['Shopify developer', 'Shopify expert', 'ecommerce manager', 'Shopify CRO specialist', 'Shopify app developer', 'Shopify API integration', 'Shopify B2B developer'],
  // Do not set a root canonical: it would be inherited by case-study routes.
  // The homepage owns its canonical; service pages will use their own URLs.
  // Avoid a sitewide Open Graph URL that would incorrectly identify all subpages as home.
  openGraph: { type: 'website', siteName: 'Shopify Commerce Engineering', title: 'Shopify Developer & Ecommerce Manager | CRO & Custom Apps', description: 'Shopify storefront engineering, ecommerce operations, CRO, custom integrations and automation.' },
  robots: { index: true, follow: true },
};
// The root layout owns one sitewide Microsoft Clarity installation, as a native
// inline script in <head> alongside GTM. Its self-inserting external tag loads async.
// Preserve the owner's public project ID; do not install a second copy elsewhere
// (including GTM) without checking duplicate collection and consent requirements.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <head>
        {/* Reuse an early connection for public screenshot thumbnails in the
            experience and archive galleries, without preloading hidden images. */}
        <link rel="preconnect" href="https://s.wordpress.com" crossOrigin="anonymous" />
        {/*
          Google's manual installation requires the actual scripts in <head>.
          A preview showed that next/script beforeInteractive only preloaded GTM
          in the head while serialising its execution queue into the body.
          Keep this one sitewide async loader and dataLayer initialiser together.
          Review visitor notice and consent controls before collecting analytics.
        */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-KVJVH4VM" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());",
          }}
        />
        {/* Clarity is installed once here; its loader inserts the external script asynchronously. */}
        <script
          id="microsoft-clarity"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "zekmhvjftc");
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

