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
      <head>
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
      </head>
      <body>
        {children}
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

