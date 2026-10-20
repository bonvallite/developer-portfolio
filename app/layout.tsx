import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
export const metadata: Metadata = {
  title: 'Jomar Vallite | Shopify & API Integration Developer',
  description: 'Shopify development, commerce automation, APIs, and serverless integration projects by Jomar Vallite.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}<Analytics /></body></html>;
}
