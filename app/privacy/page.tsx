import type { Metadata } from 'next';
import Link from 'next/link';

// Updated 2026-11-21 to explain consent-gated, fixed-category portfolio click
// signals. This notice is an implementation summary, not an audit of upstream
// GTM tags, third-party auto-events, vendor retention or legal compliance.
export const metadata: Metadata = {
  title: 'Privacy and Analytics',
  description: 'How this Shopify commerce portfolio handles optional analytics and direct enquiries.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return <main className="container" style={{ paddingTop: 85, paddingBottom: 110, maxWidth: 850, lineHeight: 1.85 }}>
    <Link href="/" style={{ color: '#8ce3da' }}>← Back to JRV portfolio</Link>
    <h1 style={{ fontSize: 'clamp(40px,6vw,67px)', letterSpacing: '-2px', lineHeight: 1.12 }}>Privacy and analytics</h1>
    <p>This portfolio showcases Shopify development, ecommerce operations, conversion optimisation and technical projects. Functional pages and public demonstrations work without optional analytics.</p>

    <h2>Optional analytics and consent</h2>
    <p>Google Tag Manager, Microsoft Clarity and Vercel Analytics are not loaded from the site until you choose <strong>Allow analytics</strong>. By default, optional analytics are off. Your preference is held in your browser&apos;s local storage so you do not have to decide again on each visit.</p>
    <p>If you accept, those services may process page, browser, device or interaction information according to the external vendors&apos; configurations. Google Tag Manager may also load tags managed in its separate container, which is not fully audited by the website source code.</p>
    <p>With consent, the site may queue limited click signals for an email-draft link, a résumé download link or a featured project link. Its own event payloads contain only predefined action, intent, source, design or format labels. They never include the text of a project brief, an email message, or a link URL. A click does not confirm that an email was sent, a document was downloaded or a project enquiry was received. These signals only reach Google Analytics if separately configured in the approved Tag Manager container.</p>
    <p>To reduce unintended collection of enquiry text by link trackers, the visible email-draft link includes only a fixed template. Optional text is added during the visitor&apos;s direct email-app handoff, not exposed in that link&apos;s address. External tags may still collect other link or browser information, so vendor-controlled click settings require a separate privacy review. The site&apos;s limited custom events do not establish that third-party tools collect no personal information.</p>
    <p>Use the persistent <strong>Privacy choices</strong> control at the bottom of the site to change your selection. Withdrawing consent reloads the page to stop future script execution in that document. It does not guarantee deletion of data or cookies already retained by an external service.</p>

    <h2>Enquiries</h2>
    <p>The project and hiring enquiry composer runs in your browser. Its optional text is not posted to a website server or lead database. Choosing <strong>Open email draft</strong> prepares the message in your own email app; the portfolio operator receives it only if you decide to send that email. You can also copy the public contact address. If you opt into analytics, a separate fixed-label click-intent event may be queued without including your draft text.</p>
    <p>Please do not submit customer information, passwords, confidential configurations or sensitive client data through an initial enquiry.</p>

    <h2>Links, public work and security</h2>
    <p>Public examples distinguish documented engineering work from fictional interactive demonstrations. Links to external profiles, source repositories and storefront references open third-party websites, where those services control their own privacy practices. The website sends a restrictive no-referrer policy.</p>
    <p>This notice does not certify zero-risk privacy or confidentiality. Source files and historic versions in a public repository are separate from the production website, and an indexing request cannot erase copies or search caches.</p>

    <h2>Questions and requests</h2>
    <p>For questions about this portfolio&apos;s analytics or a direct enquiry, email <a href="mailto:hello@jrvallite.com?subject=Portfolio%20privacy%20enquiry" style={{ color: '#8ce3da', textDecoration: 'underline' }}>hello@jrvallite.com</a>.</p>
    <p><small>Implementation updated 21 November 2026. Upstream service settings, retention policies, third-party click tracking and Tag Manager configuration require separate verification.</small></p>
  </main>;
}
