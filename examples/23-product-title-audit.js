// Audit display titles without modifying any product records.
export function auditProductTitles(products, forbiddenPatterns = []) {
  return products.flatMap(({ id, title }) =>
    forbiddenPatterns.filter(pattern => pattern.test(title)).map(pattern => ({
      id, title, matchedRule: pattern.source
    }))
  );
}
