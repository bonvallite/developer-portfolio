// Illustrative threshold checks only; field CWV reporting uses distributions.
export function vitalBudget({ lcpMs, inpMs, cls }) {
  return { lcp: lcpMs <= 2500, inp: inpMs <= 200, cls: cls <= 0.1 };
}
