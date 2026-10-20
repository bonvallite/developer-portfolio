// Simple cart quantity guard, not a checkout enforcement mechanism.
export function validQuantity(value, { min = 1, max = 99, step = 1 } = {}) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity >= min && quantity <= max &&
    Number.isInteger((quantity - min) / step);
}
