import type { MetadataRoute } from 'next';

// Curate public pages that explain Shopify capabilities and documented projects.
// Only include paths that correspond to existing, indexable site routes.
// Stage 3 adds four unique service URLs, each with a self-referencing canonical.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/', '/shopify-developer', '/ecommerce-management', '/shopify-cro', '/shopify-app-development',
    '/experience', '/cartoncloud-integration', '/conversion-audit',
    '/shipping-integration', '/shopify-flow', '/b2b-demo', '/eve-curls',
    '/editorial-homepage-demo', '/chilled-delivery-demo', '/engineering-standards',
    '/css-lab', '/python-automation',
  ];
  return paths.map((path) => ({
    url: new URL(path, 'https://www.jrvallite.com').toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/experience' || ['/shopify-developer', '/ecommerce-management', '/shopify-cro', '/shopify-app-development'].includes(path) ? 0.9 : 0.7,
  }));
}
