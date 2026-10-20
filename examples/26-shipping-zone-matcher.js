// Fictional postcode groups and destination matching; not live delivery eligibility.
export function findShippingZone(postcode, zones) {
  const code = String(postcode).padStart(4, "0");
  return zones.find(zone => zone.postcodes.includes(code))?.name ?? null;
}
