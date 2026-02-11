/**
 * Calculator Validators
 * 
 * Input validation for calculator functions
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate area input
 */
export function validateAreaInput(
  length: number,
  width: number,
  unit: 'ft' | 'm'
): ValidationResult {
  if (length <= 0) {
    return { valid: false, error: 'Length must be greater than 0' };
  }
  
  if (width <= 0) {
    return { valid: false, error: 'Width must be greater than 0' };
  }
  
  if (length > 10000) {
    return { valid: false, error: 'Length exceeds maximum allowed value (10,000)' };
  }
  
  if (width > 10000) {
    return { valid: false, error: 'Width exceeds maximum allowed value (10,000)' };
  }
  
  return { valid: true };
}

/**
 * Validate thickness input
 */
export function validateThickness(
  thickness: number,
  unit: 'ft' | 'm'
): ValidationResult {
  if (thickness <= 0) {
    return { valid: false, error: 'Thickness must be greater than 0' };
  }
  
  if (unit === 'm' && thickness > 10) {
    return { valid: false, error: 'Thickness exceeds maximum allowed value (10m)' };
  }
  
  if (unit === 'ft' && thickness > 33) {
    return { valid: false, error: 'Thickness exceeds maximum allowed value (33ft)' };
  }
  
  return { valid: true };
}

/**
 * Validate mix ratio
 */
export function validateMixRatio(
  cement: number,
  sand: number,
  aggregate: number
): ValidationResult {
  if (cement <= 0 || sand <= 0 || aggregate <= 0) {
    return { valid: false, error: 'All mix ratio values must be greater than 0' };
  }
  
  if (cement > 10 || sand > 10 || aggregate > 10) {
    return { valid: false, error: 'Mix ratio values exceed maximum allowed (10)' };
  }
  
  return { valid: true };
}

/**
 * Validate area for budget estimation
 */
export function validateBudgetArea(area: number): ValidationResult {
  if (area <= 0) {
    return { valid: false, error: 'Area must be greater than 0' };
  }
  
  if (area > 100000) {
    return { valid: false, error: 'Area exceeds maximum allowed value (100,000 sq ft)' };
  }
  
  return { valid: true };
}

/**
 * Validate location name
 */
export function validateLocation(location: string): ValidationResult {
  if (!location || location.trim().length === 0) {
    return { valid: false, error: 'Location is required' };
  }
  
  if (location.length > 100) {
    return { valid: false, error: 'Location name is too long' };
  }
  
  return { valid: true };
}






