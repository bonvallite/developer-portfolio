// Fictional product content renderer: encode content separately from HTML.
export function descriptionSections(product) {
  return { introduction: String(product.introduction ?? "").trim(),
    highlights: (product.highlights ?? []).filter(Boolean).map(String),
    specifications: (product.specifications ?? []).filter(x => x.label && x.value) };
}
