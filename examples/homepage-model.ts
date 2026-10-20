/**
 * Public portfolio demonstration. Independently authored with fictional labels.
 * NOT copied from any merchant theme, section configuration, or client code.
 * Data-only UI model; can be adapted to theme editor blocks in an authorised project.
 */
export type HomeModule =
  | { kind: 'hero'; headline: string; ctaText: string; ctaUrl: string }
  | { kind: 'shop-by-need'; heading: string; categories: readonly { label: string; url: string }[] }
  | { kind: 'featured'; heading: string; collectionHandle: string }
  | { kind: 'trust'; heading: string; body: string };

export const sampleHomepage: readonly HomeModule[] = [
  { kind: 'hero', headline: 'Discover products made for your day', ctaText: 'Shop now', ctaUrl: '/collections/all' },
  { kind: 'shop-by-need', heading: 'What are you shopping for?', categories: [
    { label: 'Everyday essentials', url: '/collections/essentials' },
    { label: 'Special occasions', url: '/collections/occasions' }
  ] },
  { kind: 'featured', heading: 'Explore the collection', collectionHandle: 'featured' },
  { kind: 'trust', heading: 'How delivery works', body: 'Check availability, timing and options before checkout.' }
];

/** Verify that CTA paths stay local to the demo storefront. */
export function validateHomepage(modules: readonly HomeModule[]): string[] {
  const errors: string[] = [];
  for (const [index, module] of modules.entries()) {
    const links = module.kind === 'hero'
      ? [module.ctaUrl]
      : module.kind === 'shop-by-need' ? module.categories.map(item => item.url) : [];
    if (links.some(url => !url.startsWith('/') || url.startsWith('//'))) {
      errors.push('Module ' + index + ' has an invalid internal link');
    }
  }
  return errors;
}
