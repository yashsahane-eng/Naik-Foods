/**
 * Format numbers as Indian Rupee (₹)
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format weights (grams / kg)
 */
export function formatWeight(weight_g: number): string {
  if (weight_g >= 1000) {
    return `${(weight_g / 1000).toFixed(weight_g % 1000 === 0 ? 0 : 1)} kg`;
  }
  return `${weight_g}g`;
}
