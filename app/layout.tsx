import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
// The approved {JRV} monogram uses the site's gold-on-charcoal palette in app/icon.svg.
// Next.js discovers this self-contained, transparent-corner favicon automatically.
// Do not add a competing metadata.icons entry or a legacy favicon.ico.
export const metadata: Metadata = {
  title: 'Jomar Vallite | Shopify & API Integration Developer',
  description: 'Shopify development, commerce automation, APIs, and serverless integration projects by Jomar Vallite.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}<Analytics /></body></html>;
}
