// Build schema.org BreadcrumbList from fictional/local navigation objects.
export function breadcrumbSchema(items) {
  if (!Array.isArray(items) || items.length === 0) throw Error("Items required");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1,
      name: String(item.name), item: new URL(item.url, "https://example.com").href
    }))
  };
}
