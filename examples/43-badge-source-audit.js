// Read-only audit for the stale-badge problem in CASE_STUDIES.md, section 10.
// Compares legacy "badge:" product tags with the metafield source of truth and
// reports every product where they disagree. It never edits products.
// Input: [{ id, tags, badgeLabel }], where badgeLabel is the label of the
// product's custom.category_badge metaobject (null if unset), for example
// from a product export or an Admin GraphQL query. Data here is fictional.
export function auditBadgeSources(products, { tagPrefix = "badge:" } = {}) {
  const prefix = tagPrefix.toLowerCase();
  return products.flatMap(({ id, tags = [], badgeLabel = null }) => {
    const fromTags = tags.filter(tag => tag.toLowerCase().startsWith(prefix)).map(tag => tag.slice(prefix.length).trim());
    if (!fromTags.length) return [];
    const matches = badgeLabel != null && fromTags.some(tag => tag.toLowerCase() === badgeLabel.toLowerCase());
    const issues = [];
    if (fromTags.length > 1) issues.push("multiple_badge_tags");
    if (badgeLabel == null) issues.push("tag_without_metafield");
    else if (!matches) issues.push("tag_disagrees_with_metafield");
    if (matches && fromTags.length === 1) issues.push("redundant_tag"); // Safe to remove once nothing reads tags.
    return [{ id, fromTags, badgeLabel, issues }];
  });
}
