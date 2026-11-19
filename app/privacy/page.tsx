import type { Metadata } from 'next';
import Link from 'next/link';

// This notice describes integrations visible in the site's root layout.
// Verify vendor configuration, consent requirements and actual retention settings
// before representing this page as a complete legal compliance assessment.
export const metadata: Metadata = {
  title: 'Privacy and Analytics',
  description: 'How this Shopify engineering portfolio uses analytics tools and handles direct enquiries.',
  alternates: { canonical: '/privacy' },
};

// The public privacy enquiry address is the portfolio domain mailbox.
// Keep it aligned with the contact links on app/page.tsx.
export default function PrivacyPage() {
  return (
    <main className="container" style={{ paddingTop: 96, paddingBottom: 96, maxWidth: 820 }}>
      <Link href="/">← Back to portfolio</Link>
      <h1>Privacy and analytics</h1>
      <p>This portfolio showcases ecommerce development and technical work. It currently loads Google Tag Manager, Microsoft Clarity and Vercel Analytics. Depending on their configuration, these services may collect information about visits, interactions, devices and pages viewed.</p>
      <h2>Contact enquiries</h2>
      <p>Choosing an email contact link opens your own email application with suggested enquiry fields. The website does not receive those draft details unless you choose to send an email. Messages you send are used to respond to your enquiry.</p>
      <h2>Analytics</h2>
      <p>Google Tag Manager can load other tags depending on its published configuration. Microsoft Clarity provides interaction analytics, and Vercel Analytics provides website traffic measurement. Their processing and retention depend on the relevant provider and account settings.</p>
      <h2>Your choices</h2>
      <p>You can manage browser privacy and tracking settings. To ask about this website's analytics or request information about an enquiry you sent, contact <a href="mailto:hello@jrvallite.com?subject=Portfolio%20privacy%20enquiry">the site operator by email</a>.</p>
      <p><strong>Note:</strong> This notice describes integrations identified in the site code; it does not certify that every deployed tag or consent setting has been independently audited.</p>
    </main>
  );
}
