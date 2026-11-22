/**
 * JRV storefront references, 22 November 2026.
 * Self-reported sites built, managed, maintained or optimised in differing
 * capacities. Names and public URLs do not imply exclusive authorship,
 * endorsement, continuing employment, or measured commercial outcomes.
 *
 * A dated capture artefact from GitHub Actions run 44490966868 contains
 * desktop/mobile public-site screenshots for these 11 active targets;
 * reviewers must inspect legitimacy and permissions before publishing those
 * exact pixels as locally hosted static images. The live gallery currently
 * uses public-site thumbnail requests with visible fallbacks.
 *
 * A retired Skull Seeker website was intentionally excluded by the owner.
 * Keep this list and scripts/capture-storefronts.mjs in sync.
 */
export type StorefrontReference = readonly [name: string, url: string];

export const storefronts: ReadonlyArray<StorefrontReference> = [
  ['Peter Augustus', 'https://www.peteraugustus.com.au/'],
  ['Poseidon Animal Health', 'https://poseidonanimalhealth.com.au/'],
  ['Eve Curls', 'https://www.evecurls.com/'],
  ['Jace Industries', 'https://jaceindustries.com/'],
  ['Colossal Diamond Tools', 'https://colossaldiamondtools.com/'],
  ['Rene Ruiz Collection', 'https://reneruizcollection.com/'],
  ['Urban August', 'https://urbanaugust.com/'],
  ['Warehouse-Lighting', 'https://www.warehouse-lighting.com/'],
  ['OSOYOO', 'https://osoyoo.com/'],
  ['Axlrodd', 'https://axlrodd.com/'],
  ['Tronus Footwear', 'https://tronusfootwear.com/'],
];

// Peter Augustus also has a dedicated custom-homepage review on /experience.
// Its other ten references remain in the existing secondary gallery there.
// The homepage includes all eleven so none is missing from the portfolio.
export const secondaryStorefronts = storefronts.slice(1);

// Browser-capture filenames are derived from the approved public site names.
// All but one dated 19 Nov captures are eligible for the local WebP archive.
// The Axlrodd desktop screenshot was almost empty; use the remote thumbnail
// or live homepage rather than pretend a complete screenshot exists.
export function approvedStaticStorefrontShot(name: string, device: 'desktop'|'mobile'): string | null {
  if (!storefronts.some(([label]) => label === name)) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug === 'axlrodd' && device === 'desktop') return null;
  return '/portfolio/storefronts/' + slug + '-' + device + '.webp';
}
