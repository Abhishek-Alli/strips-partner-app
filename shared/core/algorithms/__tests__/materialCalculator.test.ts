/**
 * Unit Tests for Material Calculator
 */

import {
  calculateMaterialQuantities,
  calculateBricks,
  calculateSteel
} from '../construction/materialCalculator';

describe('Material Calculator', () => {
  describe('Material Quantities Calculation', () => {
    test('should calculate material quantities for standard mix', () => {
      const result = calculateMaterialQuantities({
        area: 100, // 100 sq m
        thickness: 0.15, // 15 cm = 0.15 m
        unit: 'm',
        mixRatio: { cement: 1, sand: 2, aggregate: 4 }
      });

      // Volume = 100 × 0.15 = 15 cubic meters
      expect(result.volume).toBe(15);
      
      // Should have cement bags
      expect(result.cement.bags).toBeGreaterThan(0);
      expect(result.cement.weight).toBeGreaterThan(0);
      
      // Should have sand and aggregate volumes
      expect(result.sand.volume).toBeGreaterThan(0);
      expect(result.aggregate.volume).toBeGreaterThan(0);
    });

    test('should handle feet unit conversion', () => {
      const result = calculateMaterialQuantities({
        area: 1076.39, // ~100 sq m in sq ft
        thickness: 0.492, // ~15 cm in feet (0.15m × 3.28)
        unit: 'ft',
        mixRatio: { cement: 1, sand: 2, aggregate: 4 }
      });

      expect(result.volume).toBeGreaterThan(0);
      expect(result.cement.bags).toBeGreaterThan(0);
    });
  });

  describe('Bricks Calculation', () => {
    test('should calculate bricks for wall area', () => {
      const bricks = calculateBricks(100); // 100 sq m wall
      
      expect(bricks).toBeGreaterThan(0);
      // Standard calculation should give reasonable number
      expect(bricks).toBeLessThan(100000);
    });

    test('should handle custom brick size', () => {
      const bricks = calculateBricks(100, {
        length: 0.2,
        width: 0.1,
        height: 0.1
      });
      
      expect(bricks).toBeGreaterThan(0);
    });
  });

  describe('Steel Calculation', () => {
    test('should calculate steel with default rate', () => {
      const steel = calculateSteel(10); // 10 cubic meters
      
      // Default: 100 kg per cubic meter
      expect(steel).toBe(1000); // 10 × 100 = 1000 kg
    });

    test('should calculate steel with custom rate', () => {
      const steel = calculateSteel(10, 120); // 120 kg per cubic meter
      
      expect(steel).toBe(1200); // 10 × 120 = 1200 kg
    });
  });
});






