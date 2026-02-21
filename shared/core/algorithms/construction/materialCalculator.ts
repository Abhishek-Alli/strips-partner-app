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

// ──────────────────────────────────────────────
// ADDITIONAL MATERIAL CALCULATORS
// ──────────────────────────────────────────────

export interface PaintResult {
  liters: number;
  tins: number;
  coverageNote: string;
}

/**
 * Calculate paint required for walls/ceiling
 * Standard: 1 litre covers ~12 sq m per coat
 */
export function calculatePaint(
  wallArea: number,
  coats: number = 2,
  coveragePerLiter: number = 12
): PaintResult {
  const liters = Math.ceil((wallArea * coats) / coveragePerLiter);
  return {
    liters,
    tins: Math.ceil(liters / 20),
    coverageNote: `${coats} coat(s) at ${coveragePerLiter} m²/L`,
  };
}

export interface TileResult {
  tiles: number;
  boxes: number;
  wastage: number;
}

/**
 * Calculate tiles for floor/wall area (default 600×600mm tile)
 */
export function calculateTiles(
  floorArea: number,
  tileSizeMm: { length: number; width: number } = { length: 600, width: 600 },
  wastagePercent: number = 10,
  tilesPerBox: number = 4
): TileResult {
  const tileSqM = (tileSizeMm.length / 1000) * (tileSizeMm.width / 1000);
  const base    = Math.ceil(floorArea / tileSqM);
  const wastage = Math.ceil(base * (wastagePercent / 100));
  const total   = base + wastage;
  return { tiles: total, boxes: Math.ceil(total / tilesPerBox), wastage };
}

export type FlooringType = 'vitrified' | 'marble' | 'granite' | 'wooden' | 'ceramic';

export interface FlooringResult {
  sqft: number;
  sqm: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
}

const FLOORING_COST_PER_SQFT: Record<FlooringType, { min: number; max: number }> = {
  vitrified: { min: 50,  max: 120 },
  marble:    { min: 100, max: 400 },
  granite:   { min: 80,  max: 250 },
  wooden:    { min: 150, max: 500 },
  ceramic:   { min: 30,  max: 80  },
};

/**
 * Estimate flooring cost for a given area
 */
export function calculateFlooring(areaSqm: number, type: FlooringType = 'vitrified'): FlooringResult {
  const sqft = areaSqm * 10.7639;
  const rate  = FLOORING_COST_PER_SQFT[type];
  return {
    sqft: Math.round(sqft * 100) / 100,
    sqm:  areaSqm,
    estimatedCostMin: Math.round(sqft * rate.min),
    estimatedCostMax: Math.round(sqft * rate.max),
  };
}

export interface ElectricalResult {
  lightPoints: number;
  fanPoints: number;
  socketPoints: number;
  totalPoints: number;
  wiringLengthMeters: number;
  estimatedCost: number;
}

/**
 * Estimate electrical wiring requirements
 * ~1 light per 10 sqm, 1 fan per 12 sqm, 1 socket per 8 sqm
 */
export function calculateElectricalWiring(builtUpAreaSqft: number, floors: number = 1): ElectricalResult {
  const totalSqm    = builtUpAreaSqft * 0.092903 * floors;
  const lightPoints  = Math.ceil(totalSqm / 10);
  const fanPoints    = Math.ceil(totalSqm / 12);
  const socketPoints = Math.ceil(totalSqm / 8);
  const totalPoints  = lightPoints + fanPoints + socketPoints;
  return {
    lightPoints,
    fanPoints,
    socketPoints,
    totalPoints,
    wiringLengthMeters: totalPoints * 25,
    estimatedCost: totalPoints * 175,
  };
}

export interface PlumbingResult {
  cpvcLengthMeters: number;
  pvcLengthMeters: number;
  fittings: number;
  estimatedCost: number;
}

/**
 * Estimate plumbing pipe requirements
 */
export function calculatePlumbingPipes(bathrooms: number, kitchens: number = 1, floors: number = 1): PlumbingResult {
  const cpvc = (bathrooms * 15 + kitchens * 10) * floors;
  const pvc  = (bathrooms * 20 + kitchens * 15) * floors;
  return {
    cpvcLengthMeters: cpvc,
    pvcLengthMeters:  pvc,
    fittings: Math.ceil((cpvc + pvc) * 0.3),
    estimatedCost: Math.round(cpvc * 250 + pvc * 100),
  };
}

export interface WaterproofingResult {
  liquidMembraneLiters: number;
  estimatedCost: number;
}

/**
 * Calculate waterproofing material requirements (2 coats)
 */
export function calculateWaterproofing(roofAreaSqm: number, bathroomAreaSqm: number = 0, coats: number = 2): WaterproofingResult {
  const liters = Math.ceil((roofAreaSqm + bathroomAreaSqm) * coats);
  return { liquidMembraneLiters: liters, estimatedCost: liters * 200 };
}






