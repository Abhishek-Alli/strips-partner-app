/**
 * Admin Cost Configuration Service
 * 
 * Manages cost constants for budget estimation
 */

import { apiClient } from '../apiClient';
import { logger } from '../../core/logger';
import { CostConstants, QualityGrade, DEFAULT_COST_CONSTANTS } from '@shared/core/algorithms/budget/costConstants';

class CostConfigurationService {
  /**
   * Get current cost constants
   */
  async getCostConstants(): Promise<{ constants: CostConstants }> {
    try {
      if (apiClient.isMockMode()) {
        return { constants: DEFAULT_COST_CONSTANTS };
      }

      return apiClient.get<{ constants: CostConstants }>('/admin/cost-configuration');
    } catch (error) {
      logger.error('Failed to get cost constants', error as Error);
      throw error;
    }
  }

  /**
   * Update cost constants
   */
  async updateCostConstants(constants: Partial<CostConstants>): Promise<{ constants: CostConstants }> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Cost constants updated', constants);
        return { constants: { ...DEFAULT_COST_CONSTANTS, ...constants } as CostConstants };
      }

      return apiClient.put<{ constants: CostConstants }>('/admin/cost-configuration', constants);
    } catch (error) {
      logger.error('Failed to update cost constants', error as Error);
      throw error;
    }
  }

  /**
   * Update base cost per sq ft for a quality grade
   */
  async updateBaseCost(qualityGrade: QualityGrade, costPerSqFt: number): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Base cost updated', { qualityGrade, costPerSqFt });
        return;
      }

      await apiClient.patch('/admin/cost-configuration/base-cost', {
        qualityGrade,
        costPerSqFt
      });
    } catch (error) {
      logger.error('Failed to update base cost', error as Error);
      throw error;
    }
  }

  /**
   * Update location multiplier
   */
  async updateLocationMultiplier(location: string, multiplier: number): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Location multiplier updated', { location, multiplier });
        return;
      }

      await apiClient.patch('/admin/cost-configuration/location-multiplier', {
        location,
        multiplier
      });
    } catch (error) {
      logger.error('Failed to update location multiplier', error as Error);
      throw error;
    }
  }

  /**
   * Update cost breakdown percentages
   */
  async updateCostBreakdown(breakdown: Partial<CostConstants['costBreakdownPercentages']>): Promise<void> {
    try {
      if (apiClient.isMockMode()) {
        logger.info('Cost breakdown updated', breakdown);
        return;
      }

      await apiClient.patch('/admin/cost-configuration/breakdown', breakdown);
    } catch (error) {
      logger.error('Failed to update cost breakdown', error as Error);
      throw error;
    }
  }
}

export const costConfigurationService = new CostConfigurationService();



