/**
 * Unit Tests for Area Calculator
 */

/// <reference types="jest" />

import {
  calculatePlotArea,
  calculateBuiltUpArea,
  calculateCarpetArea,
  calculateMultiFloorArea,
  sqMToSqFt,
  sqFtToSqM
} from '../construction/areaCalculator';

describe('Area Calculator', () => {
  describe('Unit Conversions', () => {
    test('should convert square meters to square feet correctly', () => {
      expect(sqMToSqFt(1)).toBeCloseTo(10.7639, 4);
      expect(sqMToSqFt(10)).toBeCloseTo(107.639, 2);
    });

    test('should convert square feet to square meters correctly', () => {
      expect(sqFtToSqM(10.7639)).toBeCloseTo(1, 4);
      expect(sqFtToSqM(107.639)).toBeCloseTo(10, 2);
    });
  });

  describe('Plot Area Calculation', () => {
    test('should calculate plot area in meters', () => {
      const result = calculatePlotArea({ length: 10, width: 10, unit: 'm' });
      expect(result.area).toBe(100);
      expect(result.areaInSqM).toBe(100);
      expect(result.areaInSqFt).toBeCloseTo(1076.39, 2);
    });

    test('should calculate plot area in feet', () => {
      const result = calculatePlotArea({ length: 10, width: 10, unit: 'ft' });
      // 10 ft × 10 ft = 100 sq ft = ~9.29 sq m
      expect(result.areaInSqFt).toBeCloseTo(100, 2);
      expect(result.area).toBeCloseTo(9.29, 2);
    });
  });

  describe('Built-up Area Calculation', () => {
    test('should calculate built-up area with default percentage', () => {
      const plotArea = calculatePlotArea({ length: 10, width: 10, unit: 'm' });
      const builtUp = calculateBuiltUpArea(plotArea);
      
      // 70% of 100 sq m = 70 sq m
      expect(builtUp.area).toBe(70);
    });

    test('should calculate built-up area with custom percentage', () => {
      const plotArea = calculatePlotArea({ length: 10, width: 10, unit: 'm' });
      const builtUp = calculateBuiltUpArea(plotArea, 80);
      
      // 80% of 100 sq m = 80 sq m
      expect(builtUp.area).toBe(80);
    });
  });

  describe('Carpet Area Calculation', () => {
    test('should calculate carpet area with default percentage', () => {
      const plotArea = calculatePlotArea({ length: 10, width: 10, unit: 'm' });
      const builtUp = calculateBuiltUpArea(plotArea);
      const carpet = calculateCarpetArea(builtUp);
      
      // 75% of 70 sq m = 52.5 sq m
      expect(carpet.area).toBe(52.5);
    });
  });

  describe('Multi-floor Area Calculation', () => {
    test('should calculate multi-floor area', () => {
      const singleFloor = calculatePlotArea({ length: 10, width: 10, unit: 'm' });
      const multiFloor = calculateMultiFloorArea(singleFloor, 3);
      
      // 100 sq m × 3 floors = 300 sq m
      expect(multiFloor.area).toBe(300);
    });
  });
});






