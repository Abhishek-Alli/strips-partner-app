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
}

/**
 * Default cost constants
 * All costs in INR per square foot
 */
export const DEFAULT_COST_CONSTANTS: CostConstants = {
  baseCostPerSqFt: {
    basic: 1200,      // ₹1,200 per sq ft
    standard: 1800,  // ₹1,800 per sq ft
    premium: 2500    // ₹2,500 per sq ft
  },
  locationMultipliers: {
    'mumbai': 1.3,      // 30% higher in Mumbai
    'delhi': 1.2,       // 20% higher in Delhi
    'bangalore': 1.15, // 15% higher in Bangalore
    'pune': 1.1,       // 10% higher in Pune
    'hyderabad': 1.1,  // 10% higher in Hyderabad
    'chennai': 1.05,   // 5% higher in Chennai
    'kolkata': 1.0,    // Base rate
    'default': 1.0     // Default multiplier
  },
  costBreakdownPercentages: {
    foundation: 15,      // 15% of total cost
    structure: 35,       // 35% of total cost
    finishing: 25,       // 25% of total cost
    electrical: 8,       // 8% of total cost
    plumbing: 7,         // 7% of total cost
    miscellaneous: 10    // 10% of total cost (total = 100%)
  }
};






