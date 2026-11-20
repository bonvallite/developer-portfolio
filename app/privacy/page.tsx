import type { Metadata } from 'next';
import Link from 'next/link';

// Updated 2026-11-20 to reflect optional, consent-gated analytics. This notice
// is a factual implementation summary, not a legal or vendor-retention audit.
export const metadata: Metadata = {
  title: 'Privacy and Analytics',
  description: 'How this Shopify commerce portfolio handles optional analytics and direct enquiries.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <main className="container" style={{ paddingTop: 85, paddingBottom: 110, maxWidth: 850, lineHeight: 1.85 }}>
    <Link href="/" style={{ color: '#e0bf8a' }}>← Back to JRV portfolio</Link>
    <h1 style={{ fontSize: 'clamp(40px,6vw,67px)', letterSpacing: '-2px', lineHeight: 1.12 }}>Privacy and analytics</h1>
    <p>This portfolio showcases Shopify development, ecommerce operations, conversion optimisation and technical projects. Functional pages and public demonstrations work without optional analytics.</p>

    <h2>Optional analytics and consent</h2>
    <p>Google Tag Manager, Microsoft Clarity and Vercel Analytics are not loaded from the site until you choose <strong>Allow analytics</strong>. By default, optional analytics are off. Your preference is held in your browser&apos;s local storage so you do not have to decide again on each visit.</p>
    <p>If you accept, those services may process page, browser, device or interaction information according to the external vendors&apos; configurations. Google Tag Manager may also load tags managed in its separate container, which is not fully audited by the website source code.</p>
    <p>Use the persistent <strong>Privacy choices</strong> control at the bottom of the site to change your selection. Withdrawing consent reloads the page to stop future script execution in that document. It does not guarantee deletion of data or cookies already retained by an external service.</p>

    <h2>Enquiries</h2>
    <p>The project and hiring enquiry composer runs in your browser. Its optional text is not posted to a website server or lead database. Choosing <strong>Open email draft</strong> inserts your text into your own email app; the website receives it only if you decide to send that email. You can also copy the public contact address.</p>
    <p>Please do not submit customer information, passwords, confidential configurations or sensitive client data through an initial enquiry.</p>

    <h2>Links, public work and security</h2>
    <p>Public examples distinguish documented engineering work from fictional interactive demonstrations. Links to external profiles, source repositories and storefront references open third-party websites, where those services control their own privacy practices. The website sends a restrictive no-referrer policy.</p>
    <p>This notice does not certify zero-risk privacy or confidentiality. Source files and historic versions in a public repository are separate from the production website, and an indexing request cannot erase copies or search caches.</p>

    <h2>Questions and requests</h2>
    <p>For questions about this portfolio&apos;s analytics or a direct enquiry, email <a href="mailto:hello@jrvallite.com?subject=Portfolio%20privacy%20enquiry" style={{ color: '#e0bf8a', textDecoration: 'underline' }}>hello@jrvallite.com</a>.</p>
    <p><small>Implementation updated 20 November 2026. Upstream service settings, retention policies and third-party tags require separate verification.</small></p>
  </main>;
}
