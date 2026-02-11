/**
 * Unit Tests for Budget Estimator
 */

/// <reference types="jest" />

import { estimateBudget } from '../budget/budgetEstimator';
import { calculatePlotArea } from '../construction/areaCalculator';

describe('Budget Estimator', () => {
  test('should estimate budget for standard quality', () => {
    const plotArea = calculatePlotArea({ length: 30, width: 40, unit: 'ft' });
    
    const result = estimateBudget({
      area: plotArea,
      location: 'mumbai',
      qualityGrade: 'standard'
    });

    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.costPerSqFt).toBeGreaterThan(0);
    expect(result.breakdown.foundation).toBeGreaterThan(0);
    expect(result.breakdown.structure).toBeGreaterThan(0);
    
    // Verify breakdown totals approximately equal total cost
    const breakdownTotal = Object.values(result.breakdown).reduce((sum, val) => sum + val, 0);
    expect(Math.abs(breakdownTotal - result.totalCost)).toBeLessThan(result.totalCost * 0.01); // Within 1%
  });

  test('should apply location multiplier', () => {
    const plotArea = calculatePlotArea({ length: 30, width: 40, unit: 'ft' });
    
    const mumbaiResult = estimateBudget({
      area: plotArea,
      location: 'mumbai',
      qualityGrade: 'standard'
    });
    
    const defaultResult = estimateBudget({
      area: plotArea,
      location: 'default',
      qualityGrade: 'standard'
    });

    // Mumbai should have higher cost due to multiplier
    expect(mumbaiResult.totalCost).toBeGreaterThan(defaultResult.totalCost);
  });

  test('should reflect quality grade differences', () => {
    const plotArea = calculatePlotArea({ length: 30, width: 40, unit: 'ft' });
    
    const basicResult = estimateBudget({
      area: plotArea,
      location: 'default',
      qualityGrade: 'basic'
    });
    
    const premiumResult = estimateBudget({
      area: plotArea,
      location: 'default',
      qualityGrade: 'premium'
    });

    // Premium should cost more than basic
    expect(premiumResult.totalCost).toBeGreaterThan(basicResult.totalCost);
  });

  test('should use custom cost constants', () => {
    const plotArea = calculatePlotArea({ length: 30, width: 40, unit: 'ft' });
    
    const result = estimateBudget({
      area: plotArea,
      location: 'default',
      qualityGrade: 'standard',
      customCostConstants: {
        baseCostPerSqFt: {
          basic: 1000,
          standard: 1500,
          premium: 2000
        }
      }
    });

    expect(result.totalCost).toBeGreaterThan(0);
    // Should use custom base cost (1500) instead of default (1800)
    expect(result.costPerSqFt).toBeCloseTo(1500, 0);
  });
});






