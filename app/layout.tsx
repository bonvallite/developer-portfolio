import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
// The approved {JRV} favicon is supplied by app/icon.svg, which Next.js discovers
// automatically. Avoid a competing metadata.icons entry or a legacy favicon.ico.
export const metadata: Metadata = {
  title: 'Jomar Vallite | Shopify & API Integration Developer',
  description: 'Shopify development, commerce automation, APIs, and serverless integration projects by Jomar Vallite.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}<Analytics /></body></html>;
}
