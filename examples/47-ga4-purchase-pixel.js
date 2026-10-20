// Illustrative Shopify custom pixel (Settings > Customer events) that turns
// the checkout_completed event into a GA4 "purchase" on a dataLayer. In the
// admin, paste the two functions and call register(analytics, window.dataLayer);
// they are exported here only so they can be tested. This replaces the older
// approach of adding tracking scripts to the order status page.
export function toGa4Purchase(checkout) {
  const order = checkout?.order;
  if (!order?.id) return null; // GA4 deduplicates purchases by transaction_id, so never send one without it.
  const amount = money => Number(money?.amount ?? 0);
  return {
    event: "purchase",
    ecommerce: {
      transaction_id: String(order.id),
      value: amount(checkout.totalPrice),
      tax: amount(checkout.totalTax),
      shipping: amount(checkout.shippingLine?.price),
      currency: checkout.currencyCode,
      items: (checkout.lineItems ?? []).map(line => ({
        item_id: line.variant?.sku || String(line.variant?.id ?? ""),
        item_name: line.title ?? "",
        price: amount(line.variant?.price),
        quantity: line.quantity,
      })),
    },
  };
}

export function register(analytics, dataLayer) {
  analytics.subscribe("checkout_completed", event => {
    const purchase = toGa4Purchase(event?.data?.checkout);
    if (!purchase) return;
    dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object first.
    dataLayer.push(purchase);
  });
}
