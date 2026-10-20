import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Jomar Vallite | Shopify & API Integration Developer',
  description: 'Shopify development, commerce automation, APIs, and serverless integration projects by Jomar Vallite.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body>{children}</body></html>;
}
