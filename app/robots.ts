import type { MetadataRoute } from 'next';

// Keep service and project pages discoverable while excluding utility endpoints.
// Removing personal-name content requires deindexing old URLs, not blocking crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: 'https://www.jrvallite.com/sitemap.xml',
    host: 'https://www.jrvallite.com',
  };
}
