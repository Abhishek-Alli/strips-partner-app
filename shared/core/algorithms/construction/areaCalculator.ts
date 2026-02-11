/**
 * Area Calculator
 * 
 * Pure functions for calculating various area types
 * All inputs/outputs are in standardized units (square meters)
 */

export type Unit = 'ft' | 'm';

export interface AreaInput {
  length: number;
  width: number;
  unit: Unit;
}

export interface AreaResult {
  area: number; // Always in square meters
  areaInSqFt: number; // Also provided in square feet for convenience
  areaInSqM: number; // Same as area
}

/**
 * Convert square meters to square feet
 */
export function sqMToSqFt(sqM: number): number {
  return sqM * 10.7639;
}

/**
 * Convert square feet to square meters
 */
export function sqFtToSqM(sqFt: number): number {
  return sqFt / 10.7639;
}

/**
 * Calculate plot area (rectangular)
 * Formula: length × width
 */
export function calculatePlotArea(input: AreaInput): AreaResult {
  const { length, width, unit } = input;
  
  // Convert to meters if needed
  let lengthM = length;
  let widthM = width;
  
  if (unit === 'ft') {
    // Convert feet to meters: 1 ft = 0.3048 m
    lengthM = length * 0.3048;
    widthM = width * 0.3048;
  }
  
  // Calculate area in square meters
  const areaSqM = lengthM * widthM;
  const areaSqFt = sqMToSqFt(areaSqM);
  
  return {
    area: areaSqM,
    areaInSqM: areaSqM,
    areaInSqFt: areaSqFt
  };
}

/**
 * Calculate built-up area
 * Built-up area = Plot area × Built-up percentage
 * Default built-up percentage: 70% (configurable)
 */
export function calculateBuiltUpArea(
  plotArea: AreaResult,
  builtUpPercentage: number = 70
): AreaResult {
  const areaSqM = (plotArea.area * builtUpPercentage) / 100;
  const areaSqFt = sqMToSqFt(areaSqM);
  
  return {
    area: areaSqM,
    areaInSqM: areaSqM,
    areaInSqFt: areaSqFt
  };
}

/**
 * Calculate carpet area
 * Carpet area = Built-up area × Carpet percentage
 * Default carpet percentage: 75% of built-up area (configurable)
 */
export function calculateCarpetArea(
  builtUpArea: AreaResult,
  carpetPercentage: number = 75
): AreaResult {
  const areaSqM = (builtUpArea.area * carpetPercentage) / 100;
  const areaSqFt = sqMToSqFt(areaSqM);
  
  return {
    area: areaSqM,
    areaInSqM: areaSqM,
    areaInSqFt: areaSqFt
  };
}

/**
 * Calculate area for multiple floors
 * Total area = Single floor area × Number of floors
 */
export function calculateMultiFloorArea(
  singleFloorArea: AreaResult,
  numberOfFloors: number
): AreaResult {
  const areaSqM = singleFloorArea.area * numberOfFloors;
  const areaSqFt = sqMToSqFt(areaSqM);
  
  return {
    area: areaSqM,
    areaInSqM: areaSqM,
    areaInSqFt: areaSqFt
  };
}






