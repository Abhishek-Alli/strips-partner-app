/**
 * Budget Estimator
 * 
 * Pure functions for estimating construction budgets
 * Uses configurable cost constants
 */

import { CostConstants, QualityGrade, DEFAULT_COST_CONSTANTS } from './costConstants';
import { AreaResult } from '../construction/areaCalculator';

export interface BudgetInput {
  area: AreaResult; // Area in square meters
  location: string; // City/location name
  qualityGrade: QualityGrade;
  customCostConstants?: Partial<CostConstants>;
}

export interface CostBreakdown {
  foundation: number;
  structure: number;
  finishing: number;
  electrical: number;
  plumbing: number;
  miscellaneous: number;
}

export interface BudgetResult {
  totalCost: number; // Total estimated cost in INR
  costPerSqFt: number; // Cost per square foot
  costPerSqM: number; // Cost per square meter
  breakdown: CostBreakdown;
  area: {
    sqFt: number;
    sqM: number;
  };
  qualityGrade: QualityGrade;
  location: string;
}

/**
 * Get location multiplier
 */
function getLocationMultiplier(
  location: string,
  constants: CostConstants
): number {
  const normalizedLocation = location.toLowerCase().trim();
  return constants.locationMultipliers[normalizedLocation] || 
         constants.locationMultipliers['default'] || 
         1.0;
}

/**
 * Calculate base cost per square foot
 */
function getBaseCostPerSqFt(
  qualityGrade: QualityGrade,
  constants: CostConstants
): number {
  return constants.baseCostPerSqFt[qualityGrade];
}

/**
 * Estimate construction budget
 * 
 * Formula:
 * Total Cost = Area (sq ft) × Base Cost per sq ft × Location Multiplier
 * 
 * Breakdown is calculated using percentage distribution
 */
export function estimateBudget(input: BudgetInput): BudgetResult {
  const {
    area,
    location,
    qualityGrade,
    customCostConstants
  } = input;
  
  // Merge custom constants with defaults
  const constants: CostConstants = {
    ...DEFAULT_COST_CONSTANTS,
    ...customCostConstants,
    baseCostPerSqFt: {
      ...DEFAULT_COST_CONSTANTS.baseCostPerSqFt,
      ...customCostConstants?.baseCostPerSqFt
    },
    locationMultipliers: {
      ...DEFAULT_COST_CONSTANTS.locationMultipliers,
      ...customCostConstants?.locationMultipliers
    },
    costBreakdownPercentages: {
      ...DEFAULT_COST_CONSTANTS.costBreakdownPercentages,
      ...customCostConstants?.costBreakdownPercentages
    }
  };
  
  // Get base cost and location multiplier
  const baseCostPerSqFt = getBaseCostPerSqFt(qualityGrade, constants);
  const locationMultiplier = getLocationMultiplier(location, constants);
  
  // Calculate total cost
  const areaSqFt = area.areaInSqFt;
  const costPerSqFt = baseCostPerSqFt * locationMultiplier;
  const totalCost = areaSqFt * costPerSqFt;
  
  // Calculate cost per square meter
  const costPerSqM = totalCost / area.areaInSqM;
  
  // Calculate breakdown
  const breakdown: CostBreakdown = {
    foundation: Math.round((totalCost * constants.costBreakdownPercentages.foundation) / 100),
    structure: Math.round((totalCost * constants.costBreakdownPercentages.structure) / 100),
    finishing: Math.round((totalCost * constants.costBreakdownPercentages.finishing) / 100),
    electrical: Math.round((totalCost * constants.costBreakdownPercentages.electrical) / 100),
    plumbing: Math.round((totalCost * constants.costBreakdownPercentages.plumbing) / 100),
    miscellaneous: Math.round((totalCost * constants.costBreakdownPercentages.miscellaneous) / 100)
  };
  
  return {
    totalCost: Math.round(totalCost),
    costPerSqFt: Math.round(costPerSqFt * 100) / 100,
    costPerSqM: Math.round(costPerSqM * 100) / 100,
    breakdown,
    area: {
      sqFt: Math.round(areaSqFt * 100) / 100,
      sqM: Math.round(area.areaInSqM * 100) / 100
    },
    qualityGrade,
    location
  };
}

/**
 * Estimate cost for specific component
 */
export function estimateComponentCost(
  totalCost: number,
  component: keyof CostBreakdown,
  constants: CostConstants = DEFAULT_COST_CONSTANTS
): number {
  const percentage = constants.costBreakdownPercentages[component];
  return Math.round((totalCost * percentage) / 100);
}






