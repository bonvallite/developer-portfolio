/**
 * JRV storefront references, 22 November 2026.
 * Self-reported sites built, managed, maintained or optimised in differing
 * capacities. Names and public URLs do not imply exclusive authorship,
 * endorsement, continuing employment, or measured commercial outcomes.
 *
 * Capture run 44490966868 (19 November 2026) supplied 22 public homepage
 * screenshots. PR #96 published 21 locally hosted, checksum-verified WebPs.
 * Missing or failed captures show a direct live-site link rather than
 * requesting a third-party screenshot. The incomplete Axlrodd desktop view
 * stays excluded; promotional overlays require continued visual review.
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
// The Axlrodd desktop screenshot was almost empty; offer the live homepage
// rather than inventing a screenshot or requesting a remote thumbnail.
export function approvedStaticStorefrontShot(name: string, device: 'desktop'|'mobile'): string | null {
  if (!storefronts.some(([label]) => label === name)) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug === 'axlrodd' && device === 'desktop') return null;
  return '/portfolio/storefronts/' + slug + '-' + device + '.webp';
}
