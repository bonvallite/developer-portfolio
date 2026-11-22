/**
 * Public-safe, deterministic educational model of commerce integration concepts.
 * This is NOT copied from the private Worker or a shipping quote. It deliberately
 * omits production zone tables, customer information, tariffs and API endpoints.
 * Dates are Brisbane wall-clock inputs represented on a UTC calendar only so
 * browser locale and daylight-saving settings cannot change demonstration results.
 * The live Worker has additional routes, exceptions and holiday API fallbacks.
 */
export const DEMO_ZONES = Object.freeze([
  { id: 'qld', label: 'Queensland · weekday service', postcode: '4051', state: 'QLD', dispatch: [1,2,3,4,5], delivery: [1,2,3,4,5], lead: 1 },
  // Fictional postcode-zone examples let visitors compare last-mile calendars
  // inside one state. These are not copied from the production route table.
  { id: 'qld-wed', label: 'Queensland · Wednesday route (example)', postcode: 'DEMO-W', state: 'QLD', dispatch: [1,2,3,4,5], delivery: [3], lead: 1 },
  { id: 'qld-mon-thu', label: 'Queensland · Monday/Thursday route (example)', postcode: 'DEMO-MT', state: 'QLD', dispatch: [1,2,3,4,5], delivery: [1,4], lead: 1 },
  { id: 'nsw', label: 'New South Wales · metro', postcode: '2000', state: 'NSW', dispatch: [2,5], delivery: [1,2,3,4,5], lead: 2 },
  { id: 'vic', label: 'Victoria · metro', postcode: '3163', state: 'VIC', dispatch: [1,5], delivery: [1,2,3,4,5], lead: 2 },
  { id: 'act', label: 'ACT · route delivery', postcode: '2600', state: 'ACT', dispatch: [1,5], delivery: [2,5], lead: 3 },
  { id: 'sa', label: 'South Australia · special schedule', postcode: '5371', state: 'SA', dispatch: [5], delivery: [2], lead: 4 }
]);

export const CARRIER_STATUS_MAP = Object.freeze({
  AWAITING_DROPOFF: { status: 'CONFIRMED', label: 'Confirmed' },
  COLLECTED: { status: 'CARRIER_PICKED_UP', label: 'Carrier picked up' },
  IN_TRANSIT_PICKUP_WAREHOUSE: { status: 'IN_TRANSIT', label: 'In transit' },
  WITH_ON_FORWARDER: { status: 'IN_TRANSIT', label: 'In transit' },
  WAREHOUSE_FULFILMENT_SHIPPED: { status: 'IN_TRANSIT', label: 'In transit' },
  IN_TRANSIT_WAREHOUSE_DELIVERY: { status: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  IN_TRANSIT_PICK_DELIVERY: { status: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  DELIVERED: { status: 'DELIVERED', label: 'Delivered' }
});

const pad = value => String(value).padStart(2, '0');
const key = date => [date.getUTCFullYear(), pad(date.getUTCMonth()+1), pad(date.getUTCDate())].join('-');
const addDays = (date, days) => { const copy = new Date(date); copy.setUTCDate(copy.getUTCDate()+days); return copy; };
const isWeekday = date => date.getUTCDay() !== 0 && date.getUTCDay() !== 6;
const isOpen = (date, closureDate) => isWeekday(date) && key(date) !== closureDate;

function parseLocalDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error('Enter a valid Brisbane date and time.');
  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(Date.UTC(year,month-1,day,hour,minute));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month-1 ||
      date.getUTCDate() !== day || hour > 23 || minute > 59) {
    throw new Error('The date or time is invalid.');
  }
  return date;
}

function nextEligible(from, weekdays, closureDate, includeStart = true) {
  let date = includeStart ? new Date(from) : addDays(from,1);
  for (let attempt=0;attempt<70;attempt++,date=addDays(date,1)) {
    if (weekdays.includes(date.getUTCDay()) && isOpen(date,closureDate)) return date;
  }
  throw new Error('No eligible date exists in the demonstration window.');
}
function afterBusinessDays(from, count, closureDate) {
  let date = new Date(from);
  let remaining = count;
  while (remaining > 0) {
    date = addDays(date,1);
    if (isOpen(date,closureDate)) remaining--;
  }
  return date;
}

export function formatDemoDate(iso) {
  if (!iso) return 'Not scheduled';
  const date = new Date(iso + 'T12:00:00Z');
  return new Intl.DateTimeFormat('en-AU',{
    timeZone:'UTC', weekday:'short', day:'numeric', month:'short', year:'numeric'
  }).format(date);
}

export function calculateDemoEta({ zoneId='vic', orderedAt='2026-11-23T10:00', closureDate='' } = {}) {
  const zone = DEMO_ZONES.find(item => item.id === zoneId);
  if (!zone) throw new Error('Unknown demonstration delivery zone.');
  const order = parseLocalDateTime(orderedAt);
  let production = null;
  let dispatch;
  let delivery;
  let rule;
  let transitReady = null;
  let deliveryMode = 'route';

  if (zone.state === 'SA') {
    // Mirrors the distinct Thu production -> Fri dispatch -> Tue delivery shape.
    production = nextEligible(order,[4],closureDate,true);
    dispatch = nextEligible(production,[5],closureDate,false);
    delivery = nextEligible(dispatch,[2],closureDate,false);
    rule = 'Thursday production, Friday dispatch, Tuesday delivery';
    deliveryMode = 'special-schedule';
  } else {
    // Demo weekday cut-off. Live Worker also handles its holiday service.
    const beforeSameDayCutoff = order.getUTCHours()<11 ||
      (order.getUTCHours()===11 && order.getUTCMinutes()<=59);
    const canDispatchToday = beforeSameDayCutoff &&
      zone.dispatch.includes(order.getUTCDay()) && isOpen(order,closureDate);
    dispatch = canDispatchToday ? new Date(order) :
      nextEligible(order,zone.dispatch,closureDate,false);

    if (zone.state==='NSW' && dispatch.getUTCDay()===2) {
      delivery = afterBusinessDays(dispatch,3,closureDate);
      rule = 'Tuesday dispatch + 3 NSW business days';
      deliveryMode = 'state-dispatch-rule';
    } else if (zone.state==='VIC' && dispatch.getUTCDay()===1) {
      delivery = afterBusinessDays(dispatch,4,closureDate);
      rule = 'Monday dispatch + 4 VIC business days';
      deliveryMode = 'state-dispatch-rule';
    } else if (zone.state==='NSW' && dispatch.getUTCDay()===5) {
      delivery = nextEligible(dispatch,[1,2,3,4,5],closureDate,false);
      rule = 'Friday dispatch -> next available Monday (or business day)';
      deliveryMode = 'state-dispatch-rule';
    } else if (zone.state==='VIC' && dispatch.getUTCDay()===5) {
      delivery = nextEligible(dispatch,[2,3,4,5,1],closureDate,false);
      // First Tuesday after Friday, moved to next business day for closures.
      const tuesday = nextEligible(dispatch,[2],null,false);
      delivery = nextEligible(tuesday,[1,2,3,4,5],closureDate,true);
      rule = 'Friday dispatch -> next Tuesday, adjusted for closures';
      deliveryMode = 'state-dispatch-rule';
    } else {
      const earliest = addDays(dispatch,Math.max(1,zone.lead));
      transitReady = earliest;
      delivery = nextEligible(earliest,zone.delivery,closureDate,true);
      rule = 'Transit lead + next available destination route day';
    }
  }
  // A simulated closure is optional and deliberately not an official holiday feed.
  const baseline = key(order);
  return {
    zoneId, zoneLabel:zone.label, postcode:zone.postcode,
    orderedAt, orderedISO:baseline,
    productionISO:production ? key(production) : null,
    dispatchISO:key(dispatch), deliveryISO:key(delivery),
    // Route waiting is already included in the final date. It must not be
    // added a second time. NSW/VIC overrides bypass zone route calendars.
    transitReadyISO:transitReady ? key(transitReady) : null,
    lastMileISO:deliveryMode==='route' ? key(delivery) : null,
    routeWaitDays:transitReady ? Math.round((delivery.getTime()-transitReady.getTime())/86400000) : null,
    leadDays:zone.lead, deliveryWeekdays:[...zone.delivery], deliveryMode,
    rule, closureDate:closureDate || null, isIllustrative:true
  };
}

export function calculateDemoShipment({ items, capacityKg=20 } = {}) {
  if (!Array.isArray(items) || !Number.isFinite(capacityKg) || capacityKg<=0)
    throw new Error('Supply shipment items and a positive carton capacity.');
  const physical = items.filter(item=>item?.requiresShipping && !item?.giftCard);
  const grams = physical.reduce((sum,item)=>{
    const g = Number(item.grams);
    const quantity = Number(item.quantity);
    if (!Number.isFinite(g) || !Number.isFinite(quantity) || g < 0 || quantity < 0)
      throw new Error('Weight and quantity must be non-negative numbers.');
    return sum + g*quantity;
  },0);
  const weightKg = grams/1000;
  return { eligible:physical.length>0, weightKg,
    cartons:physical.length>0 ? Math.max(1,Math.ceil(weightKg/capacityKg)) : 0,
    capacityKg, excludedItems:items.length-physical.length, physicalItems:physical.length };
}

export function mapDemoCarrierStatus(rawStatus) {
  const key = String(rawStatus||'').trim().toUpperCase().replace(/[\s-]+/g,'_');
  return CARRIER_STATUS_MAP[key] || {status:'UNMAPPED', label:'Needs investigation'};
}
