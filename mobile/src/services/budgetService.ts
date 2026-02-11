/**
 * Budget Service (Mobile)
 * 
 * Service layer for budget estimation
 * Uses core algorithms from shared layer
 */

import { logger } from '../core/logger';
import {
  estimateBudget,
  estimateComponentCost,
  BudgetInput,
  BudgetResult
} from '../../shared/core/algorithms/budget/budgetEstimator';
import {
  validateBudgetArea,
  validateLocation
} from '../../shared/core/validators/calculatorValidators';
import { AreaResult } from '../../shared/core/algorithms/construction/areaCalculator';
import { QualityGrade } from '../../shared/core/algorithms/budget/costConstants';

class BudgetService {
  /**
   * Estimate construction budget
   */
  estimateBudget(
    area: AreaResult,
    location: string,
    qualityGrade: QualityGrade,
    customCostConstants?: any
  ): BudgetResult {
    // Validate inputs
    const areaValidation = validateBudgetArea(area.areaInSqFt);
    if (!areaValidation.valid) {
      throw new Error(areaValidation.error);
    }
    
    const locationValidation = validateLocation(location);
    if (!locationValidation.valid) {
      throw new Error(locationValidation.error);
    }
    
    const input: BudgetInput = {
      area,
      location,
      qualityGrade,
      customCostConstants
    };
    
    return estimateBudget(input);
  }

  /**
   * Estimate component cost
   */
  estimateComponentCost(
    totalCost: number,
    component: 'foundation' | 'structure' | 'finishing' | 'electrical' | 'plumbing' | 'miscellaneous'
  ): number {
    if (totalCost <= 0) {
      throw new Error('Total cost must be greater than 0');
    }
    
    return estimateComponentCost(totalCost, component);
  }
}

export const budgetService = new BudgetService();






