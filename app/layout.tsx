import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
// The approved {JRV} monogram uses the site's gold-on-charcoal palette in app/icon.svg.
// Next.js discovers this self-contained, transparent-corner favicon automatically.
// Do not add a competing metadata.icons entry or a legacy favicon.ico.
export const metadata: Metadata = {
  title: 'Jomar Vallite | Shopify & API Integration Developer',
  description: 'Shopify development, commerce automation, APIs, and serverless integration projects by Jomar Vallite.',
};
// Load Clarity once in the shared root layout, after Next.js becomes interactive.
// Keep the public Clarity project ID aligned with the analytics documentation.
// Consent/privacy requirements must be reviewed before using recorded visitor behaviour.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        {children}
        {/*
          Next.js beforeInteractive injects these into the document <head> for every route.
          Initialise dataLayer first, then load the owner's GTM container exactly once.
          Do not add another Google tag via page components or Vercel project settings.
          Check the published privacy notice and any required consent handling.
        */}
        <Script id="google-tag-datalayer" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KVJVH4VM"
        />
        <Analytics />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "zekmhvjftc");
          `}
        </Script>
      </body>
    </html>
  );
}

