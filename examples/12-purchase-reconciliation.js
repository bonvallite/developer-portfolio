// Synthetic transaction reconciliation using stable IDs, excluding sensitive details.
export function reconcilePurchases(storeOrders, analyticsEvents) {
  const store = new Map(storeOrders.map(o => [o.id, o.amount]));
  const analytics = new Map(analyticsEvents.map(e => [e.id, e.amount]));
  return {
    missingInAnalytics: [...store.keys()].filter(id => !analytics.has(id)),
    missingInStore: [...analytics.keys()].filter(id => !store.has(id)),
    revenueDifference: [...store.values()].reduce((a,b)=>a+b,0) -
      [...analytics.values()].reduce((a,b)=>a+b,0)
  };
}
