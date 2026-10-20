/**
 * Fictional Australian chilled-delivery demonstration.
 * Independently authored. Not Peter Augustus production source,
 * a postcode coverage database, a real carrier quote or a checkout promise.
 */
export const DEMO_ZONES = Object.freeze([
  { postcode: '2000', region: 'Sydney NSW', dispatchDays: [1, 3], deliveryDays: [2, 4], transitDays: 2, feeCents: 1400 },
  { postcode: '3000', region: 'Melbourne VIC', dispatchDays: [1, 3], deliveryDays: [1, 4], transitDays: 2, feeCents: 1800 },
  { postcode: '4000', region: 'Brisbane QLD', dispatchDays: [1, 2, 3, 4, 5], deliveryDays: [1, 2, 3, 4, 5], transitDays: 1, feeCents: 900 },
  { postcode: '5000', region: 'Adelaide SA', dispatchDays: [5], deliveryDays: [2], transitDays: 3, feeCents: 2200 }
]);
const MS_DAY = 86400000;
const asDate = value => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new RangeError('Invalid order date');
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};
const shift = (d, days) => new Date(d.getTime() + days * MS_DAY);
const iso = d => d.toISOString().slice(0, 10);
const findNext = (from, weekdays, maxDays = 21) => {
  for (let offset = 1; offset <= maxDays; offset++) {
    const candidate = shift(from, offset);
    if (weekdays.includes(candidate.getUTCDay())) return candidate;
  }
  throw new RangeError('No available delivery day in demo window');
};
/**
 * @param {{postcode:string, orderDate:string, basketCents?:number}} input
 */
export function estimateChilledDelivery(input) {
  const postcode = String(input.postcode || '').trim();
  if (!/^\d{4}$/.test(postcode)) return { status: 'invalid', message: 'Enter a four-digit Australian postcode.' };
  const zone = DEMO_ZONES.find(z => z.postcode === postcode);
  if (!zone) return { status: 'unknown', message: 'This postcode is not in the four sample locations. Try 2000, 3000, 4000 or 5000.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.orderDate || ''))) return { status: 'invalid', message: 'Choose a valid sample order date.' };
  const placed = asDate(input.orderDate);
  const dispatch = findNext(placed, zone.dispatchDays);
  const arrival = shift(dispatch, zone.transitDays);
  // Model inter-facility transit over calendar days, but not weekend doorstep delivery.
  let delivery = arrival;
  for (let i = 0; i < 21 && !zone.deliveryDays.includes(delivery.getUTCDay()); i++) delivery = shift(delivery, 1);
  const basketCents = Number.isFinite(input.basketCents) ? Math.max(0, Number(input.basketCents)) : 0;
  return { status: 'sample', region: zone.region, postcode, dispatchDate: iso(dispatch),
    carrierArrivalDate: iso(arrival), deliveryDate: iso(delivery),
    sampleFeeCents: basketCents >= 25000 ? 0 : zone.feeCents,
    message: 'Illustrative only: not a carrier quote or checkout rate.' };
}
