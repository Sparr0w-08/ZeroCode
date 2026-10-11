export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function formatFraction(val: number): string {
  if (isNaN(val) || val <= 0) return '0';
  
  const whole = Math.floor(val);
  const remainder = val - whole;

  // Closest common fractions tolerance
  const fractions: Array<[number, string]> = [
    [0.125, '⅛'],
    [0.166, '⅙'],
    [0.2, '⅕'],
    [0.25, '¼'],
    [0.333, '⅓'],
    [0.375, '⅜'],
    [0.4, '⅖'],
    [0.5, '½'],
    [0.6, '⅗'],
    [0.625, '⅝'],
    [0.666, '⅔'],
    [0.75, '¾'],
    [0.8, '⅘'],
    [0.875, '⅞'],
  ];

  let matchedFraction = '';
  for (const [fracVal, symbol] of fractions) {
    if (Math.abs(remainder - fracVal) < 0.045) {
      matchedFraction = symbol;
      break;
    }
  }

  if (matchedFraction) {
    return whole > 0 ? `${whole} ${matchedFraction}` : matchedFraction;
  }

  // If close to next whole number
  if (Math.abs(remainder - 1) < 0.04) {
    return `${whole + 1}`;
  }

  // Fallback to formatted decimal
  return `${roundToTwo(val)}`;
}

/**
 * Calculates conservative spice / salt recommendation when multiplier is large.
 * Commercial chefs recommend multiplying salt & fiery spices at ~75% for 3x+ scale.
 */
export function calculateSpiceRecommendation(originalAmount: number, multiplier: number): number {
  if (multiplier <= 2) {
    return originalAmount * multiplier;
  }
  // Damped scaling: 1 + (multiplier - 1) * 0.75
  const dampedMultiplier = 1 + (multiplier - 1) * 0.75;
  return roundToTwo(originalAmount * dampedMultiplier);
}
