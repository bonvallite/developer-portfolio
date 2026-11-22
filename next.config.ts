import type { NextConfig } from 'next';

// 2026-11-20 public-site privacy hardening. These response headers restrict
// outbound referrers and browser features without adding heavy runtime scripts.
// CSP is intentionally not asserted here: Next.js hydration and the optional
// GTM/Clarity tag container need a nonce-based policy and vendor audit first.
// These headers cannot remove public Git history or provider-held visitor data.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Owner-approved 22 November 2026 retirement of the original public PDF.
  // Old bookmarks should reach the ATS/Classic chooser, not a legacy binary.
  // A redirect cannot erase previous public Git commits or deployed copies.
  async redirects() {
    return [{ source: '/JRV-Resume.pdf', destination: '/resume', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      // Public résumé downloads remain accessible to hiring teams, but are not
      // intended as search landing pages or personal-name SEO targets.
      {
        source: '/resume/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      // Legacy URL remains discouraged from indexing during the redirect;
      // the original static PDF is no longer part of this release candidate.
      {
        source: '/JRV-Resume.pdf',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      // Source archive is a linked technical reference, not an organic
      // acquisition page. Noindex is not access control or confidentiality.
      {
        source: '/case-studies/ecommerce-analytics/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

export default nextConfig;
