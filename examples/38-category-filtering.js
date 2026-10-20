// Example product filter with anonymous product attributes.
export function filterProducts(products, { category, minPrice, maxPrice } = {}) {
  return products.filter(product =>
    (!category || product.category === category) &&
    (minPrice == null || product.price >= minPrice) &&
    (maxPrice == null || product.price <= maxPrice));
}
