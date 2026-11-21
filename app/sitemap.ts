import type { MetadataRoute } from 'next';

// Curate public pages that explain Shopify capabilities and documented projects.
// Only include paths that correspond to existing, indexable site routes.
// Include the published privacy notice so crawlers can discover it.
// Service routes, the analytics engineering case study, and the privacy notice
// declare self-referencing canonicals. Keep flagship client-only lab routes in
// sync with the adjacent server layouts that own their route metadata.
// Resume pages deliberately remain noindex and absent from this sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/', '/shopify-developer', '/ecommerce-management', '/shopify-cro', '/shopify-app-development',
    '/experience', '/analytics-lab', '/projects/spend-and-save', '/b2b-modernisation',
    '/cartoncloud-integration', '/conversion-audit',
    '/shipping-integration', '/shopify-flow', '/b2b-demo', '/eve-curls',
    '/editorial-homepage-demo', '/chilled-delivery-demo', '/engineering-standards',
    '/css-lab', '/python-automation', '/data-extraction-automation', '/privacy',
  ];
  return paths.map((path) => ({
    url: new URL(path, 'https://www.jrvallite.com').toString(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/privacy' ? 0.3 : path === '/' ? 1 : path === '/experience' || ['/shopify-developer', '/ecommerce-management', '/shopify-cro', '/shopify-app-development'].includes(path) ? 0.9 : 0.7,
  }));
}
