/**
 * Cost Constants
 * 
 * Default cost constants for budget estimation
 * These can be overridden by admin configuration
 */

export type QualityGrade = 'basic' | 'standard' | 'premium';

export interface CostConstants {
  baseCostPerSqFt: {
    [key in QualityGrade]: number;
  };
  laborCostPerSqFt: {
    [key in QualityGrade]: number;
  };
  locationMultipliers: {
    [location: string]: number;
  };
  costBreakdownPercentages: {
    foundation: number;
    structure: number;
    finishing: number;
    electrical: number;
    plumbing: number;
    miscellaneous: number;
  };
  materialRatesPerUnit: {
    cementBag: number;     // INR per 50kg bag
    steelKg: number;       // INR per kg
    brickPer1000: number;  // INR per 1000 bricks
    sandCft: number;       // INR per cubic feet
    aggregateCft: number;  // INR per cubic feet
  };
}

/**
 * Default cost constants — all material costs in INR
 */
export const DEFAULT_COST_CONSTANTS: CostConstants = {
  // Material cost per sq ft (excludes labour)
  baseCostPerSqFt: {
    basic:    800,   // ₹800/sqft material
    standard: 1200,  // ₹1,200/sqft material
    premium:  1800,  // ₹1,800/sqft material
  },
  // Labour cost per sq ft
  laborCostPerSqFt: {
    basic:    400,  // ₹400/sqft labour
    standard: 600,  // ₹600/sqft labour
    premium:  700,  // ₹700/sqft labour
  },
  locationMultipliers: {
    // Metro cities
    'mumbai':       1.35,
    'delhi':        1.28,
    'bangalore':    1.22,
    'pune':         1.15,
    'hyderabad':    1.14,
    'chennai':      1.12,
    'kolkata':      1.05,
    'ahmedabad':    1.10,
    // Tier 2 cities
    'noida':        1.22,
    'gurgaon':      1.25,
    'faridabad':    1.18,
    'thane':        1.28,
    'navi mumbai':  1.22,
    'navi_mumbai':  1.22,
    'chandigarh':   1.12,
    'kochi':        1.08,
    'indore':       0.95,
    'nagpur':       0.95,
    'coimbatore':   0.98,
    'visakhapatnam':0.96,
    'surat':        1.08,
    'vadodara':     1.00,
    'goa':          1.18,
    // Tier 3 cities
    'jaipur':       0.95,
    'lucknow':      0.90,
    'bhopal':       0.88,
    'patna':        0.85,
    'bhubaneswar':  0.90,
    'agra':         0.88,
    'varanasi':     0.85,
    'ranchi':       0.87,
    'guwahati':     0.90,
    'amritsar':     0.92,
    'mysore':       0.96,
    'mysuru':       0.96,
    'madurai':      0.94,
    'nashik':       1.02,
    'aurangabad':   0.95,
    'dehradun':     0.96,
    'raipur':       0.88,
    'default':      1.0,
  },
  costBreakdownPercentages: {
    foundation:   15,
    structure:    35,
    finishing:    25,
    electrical:   8,
    plumbing:     7,
    miscellaneous:10,
  },
  materialRatesPerUnit: {
    cementBag:     380,   // ₹380 per 50kg bag
    steelKg:       60,    // ₹60 per kg
    brickPer1000:  7500,  // ₹7,500 per 1000 bricks
    sandCft:       45,    // ₹45 per cft
    aggregateCft:  55,    // ₹55 per cft
  },
};

/** Sorted list of city names for UI dropdowns */
export const CITY_LIST: string[] = Object.keys(DEFAULT_COST_CONSTANTS.locationMultipliers)
  .filter(k => k !== 'default')
  .sort();






