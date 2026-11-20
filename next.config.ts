import type { NextConfig } from 'next';

// 2026-11-20 public-site privacy hardening. These response headers restrict
// outbound referrers and browser features without adding heavy runtime scripts.
// CSP is intentionally not asserted here: Next.js hydration and the optional
// GTM/Clarity tag container need a nonce-based policy and vendor audit first.
// These headers cannot remove public Git history or provider-held visitor data.
const nextConfig: NextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

export default nextConfig;
