// Fictional B2B invoice totals with Australian GST on tax-exclusive wholesale
// prices. Integer cents throughout; GST is rounded once per invoice. Not tax
// advice: GST-free items and the rounding method must be confirmed for a real business.
export function invoiceTotals(lines, { gstRateBps = 1000 } = {}) {
  if (!Array.isArray(lines)) throw TypeError("Lines required");
  if (!Number.isSafeInteger(gstRateBps) || gstRateBps < 0) throw Error("Invalid GST rate");
  let subtotalCents = 0;
  let taxableCents = 0;
  for (const line of lines) {
    if (!Number.isSafeInteger(line?.unitCents) || line.unitCents < 0 ||
        !Number.isSafeInteger(line.quantity) || line.quantity < 0) throw Error("Invalid line");
    const lineCents = line.unitCents * line.quantity;
    subtotalCents += lineCents;
    if (!line.gstFree) taxableCents += lineCents;
  }
  if (!Number.isSafeInteger(subtotalCents)) throw Error("Invoice exceeds safe numeric range");
  const gstCents = Math.round(taxableCents * gstRateBps / 10000);
  return { subtotalCents, taxableCents, gstCents, totalCents: subtotalCents + gstCents };
}
