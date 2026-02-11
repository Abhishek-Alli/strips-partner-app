/**
 * Calculator Formatters
 * 
 * Format numbers and results for display
 */

/**
 * Format currency (INR)
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/**
 * Format area
 */
export function formatArea(area: number, unit: 'sqft' | 'sqm' = 'sqft'): string {
  const formatted = area.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return `${formatted} ${unit === 'sqft' ? 'sq ft' : 'sq m'}`;
}

/**
 * Format volume
 */
export function formatVolume(volume: number, unit: 'cft' | 'cum' = 'cum'): string {
  const formatted = volume.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return `${formatted} ${unit === 'cft' ? 'cu ft' : 'cu m'}`;
}

/**
 * Format weight
 */
export function formatWeight(weight: number, unit: 'kg' | 'ton' = 'kg'): string {
  if (unit === 'ton' && weight >= 1000) {
    const tons = weight / 1000;
    return `${tons.toLocaleString('en-IN', { maximumFractionDigits: 2 })} tons`;
  }
  return `${weight.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${unit}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with abbreviations
 */
export function formatLargeNumber(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return formatCurrency(num);
}






