/**
 * Calculator Service (Mobile)
 * 
 * Service layer for construction calculations
 * Uses core algorithms from shared layer
 */

import { logger } from '../core/logger';
import {
  calculatePlotArea,
  calculateBuiltUpArea,
  calculateCarpetArea,
  calculateMultiFloorArea,
  AreaInput,
  AreaResult
} from '../../shared/core/algorithms/construction/areaCalculator';
import {
  calculateMaterialQuantities,
  calculateBricks,
  calculateSteel,
  MaterialInput,
  MaterialResult
} from '../../shared/core/algorithms/construction/materialCalculator';
import {
  validateAreaInput,
  validateThickness,
  validateMixRatio,
  validateBudgetArea,
  validateLocation
} from '../../shared/core/validators/calculatorValidators';

class CalculatorService {
  /**
   * Calculate plot area
   */
  calculatePlotArea(input: AreaInput): AreaResult {
    const validation = validateAreaInput(input.length, input.width, input.unit);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    return calculatePlotArea(input);
  }

  /**
   * Calculate built-up area
   */
  calculateBuiltUpArea(
    plotArea: AreaResult,
    builtUpPercentage: number = 70
  ): AreaResult {
    if (builtUpPercentage <= 0 || builtUpPercentage > 100) {
      throw new Error('Built-up percentage must be between 1 and 100');
    }
    
    return calculateBuiltUpArea(plotArea, builtUpPercentage);
  }

  /**
   * Calculate carpet area
   */
  calculateCarpetArea(
    builtUpArea: AreaResult,
    carpetPercentage: number = 75
  ): AreaResult {
    if (carpetPercentage <= 0 || carpetPercentage > 100) {
      throw new Error('Carpet percentage must be between 1 and 100');
    }
    
    return calculateCarpetArea(builtUpArea, carpetPercentage);
  }

  /**
   * Calculate multi-floor area
   */
  calculateMultiFloorArea(
    singleFloorArea: AreaResult,
    numberOfFloors: number
  ): AreaResult {
    if (numberOfFloors <= 0 || numberOfFloors > 100) {
      throw new Error('Number of floors must be between 1 and 100');
    }
    
    return calculateMultiFloorArea(singleFloorArea, numberOfFloors);
  }

  /**
   * Calculate material quantities
   */
  calculateMaterialQuantities(input: MaterialInput): MaterialResult {
    const thicknessValidation = validateThickness(input.thickness, input.unit || 'm');
    if (!thicknessValidation.valid) {
      throw new Error(thicknessValidation.error);
    }
    
    const mixRatioValidation = validateMixRatio(
      input.mixRatio.cement,
      input.mixRatio.sand,
      input.mixRatio.aggregate
    );
    if (!mixRatioValidation.valid) {
      throw new Error(mixRatioValidation.error);
    }
    
    return calculateMaterialQuantities(input);
  }

  /**
   * Calculate bricks needed
   */
  calculateBricks(
    wallArea: number,
    brickSize?: { length: number; width: number; height: number },
    mortarThickness?: number
  ): number {
    if (wallArea <= 0) {
      throw new Error('Wall area must be greater than 0');
    }
    
    return calculateBricks(wallArea, brickSize, mortarThickness);
  }

  /**
   * Calculate steel required
   */
  calculateSteel(
    concreteVolume: number,
    steelPerCubicMeter: number = 100
  ): number {
    if (concreteVolume <= 0) {
      throw new Error('Concrete volume must be greater than 0');
    }
    
    return calculateSteel(concreteVolume, steelPerCubicMeter);
  }
}

export const calculatorService = new CalculatorService();






