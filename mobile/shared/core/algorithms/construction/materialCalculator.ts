/**
 * Material Calculator
 * 
 * Pure functions for calculating construction material quantities
 * Based on standard construction formulas
 */

export interface MixRatio {
  cement: number;
  sand: number;
  aggregate: number;
}

export interface MaterialInput {
  area: number; // Area in square meters
  thickness: number; // Thickness in meters
  mixRatio: MixRatio; // e.g., { cement: 1, sand: 2, aggregate: 4 }
  unit?: 'm' | 'ft'; // Unit for thickness
}

export interface MaterialResult {
  volume: number; // Total volume in cubic meters
  cement: {
    bags: number; // Number of 50kg bags
    weight: number; // Total weight in kg
  };
  sand: {
    volume: number; // Volume in cubic meters
    volumeInCft: number; // Volume in cubic feet
  };
  aggregate: {
    volume: number; // Volume in cubic meters
    volumeInCft: number; // Volume in cubic feet
  };
}

/**
 * Standard constants
 */
const CEMENT_BAG_WEIGHT_KG = 50; // Standard cement bag weight
const CEMENT_DENSITY_KG_PER_CUBIC_METER = 1440; // Density of cement
const DRY_VOLUME_MULTIPLIER = 1.54; // Dry volume = Wet volume × 1.54

/**
 * Calculate total volume of concrete needed
 * Volume = Area × Thickness
 */
function calculateVolume(area: number, thickness: number, unit: 'm' | 'ft'): number {
  let thicknessM = thickness;
  
  if (unit === 'ft') {
    // Convert feet to meters: 1 ft = 0.3048 m
    thicknessM = thickness * 0.3048;
  }
  
  return area * thicknessM;
}

/**
 * Calculate material quantities for concrete
 * Based on mix ratio (e.g., 1:2:4 means 1 part cement, 2 parts sand, 4 parts aggregate)
 */
export function calculateMaterialQuantities(input: MaterialInput): MaterialResult {
  const { area, thickness, mixRatio, unit = 'm' } = input;
  
  // Calculate wet volume
  const wetVolume = calculateVolume(area, thickness, unit);
  
  // Calculate dry volume (accounts for voids)
  const dryVolume = wetVolume * DRY_VOLUME_MULTIPLIER;
  
  // Calculate total parts in mix ratio
  const totalParts = mixRatio.cement + mixRatio.sand + mixRatio.aggregate;
  
  // Calculate volume of each material
  const cementVolume = (dryVolume * mixRatio.cement) / totalParts;
  const sandVolume = (dryVolume * mixRatio.sand) / totalParts;
  const aggregateVolume = (dryVolume * mixRatio.aggregate) / totalParts;
  
  // Calculate cement weight and bags
  const cementWeight = cementVolume * CEMENT_DENSITY_KG_PER_CUBIC_METER;
  const cementBags = Math.ceil(cementWeight / CEMENT_BAG_WEIGHT_KG);
  
  // Convert volumes to cubic feet (1 m³ = 35.3147 ft³)
  const sandVolumeCft = sandVolume * 35.3147;
  const aggregateVolumeCft = aggregateVolume * 35.3147;
  
  return {
    volume: wetVolume,
    cement: {
      bags: cementBags,
      weight: Math.round(cementWeight * 100) / 100
    },
    sand: {
      volume: Math.round(sandVolume * 100) / 100,
      volumeInCft: Math.round(sandVolumeCft * 100) / 100
    },
    aggregate: {
      volume: Math.round(aggregateVolume * 100) / 100,
      volumeInCft: Math.round(aggregateVolumeCft * 100) / 100
    }
  };
}

/**
 * Calculate bricks needed for masonry
 * Standard brick size: 190mm × 90mm × 90mm (0.19m × 0.09m × 0.09m)
 * Mortar thickness: 10mm (0.01m)
 */
export function calculateBricks(
  wallArea: number, // Area in square meters
  brickSize: { length: number; width: number; height: number } = {
    length: 0.19,
    width: 0.09,
    height: 0.09
  },
  mortarThickness: number = 0.01
): number {
  // Calculate brick area including mortar
  const brickAreaWithMortar = 
    (brickSize.length + mortarThickness) * (brickSize.height + mortarThickness);
  
  // Calculate number of bricks
  const numberOfBricks = Math.ceil(wallArea / brickAreaWithMortar);
  
  // Add 5% wastage
  return Math.ceil(numberOfBricks * 1.05);
}

/**
 * Calculate steel required for RCC
 * Standard: 80-120 kg per cubic meter of concrete
 */
export function calculateSteel(
  concreteVolume: number, // Volume in cubic meters
  steelPerCubicMeter: number = 100 // kg per cubic meter (default 100 kg/m³)
): number {
  return Math.round(concreteVolume * steelPerCubicMeter);
}






