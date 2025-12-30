/**
 * Calculation utilities for performance assessment and LCA
 * Pure functions for score computation and carbon calculations
 */

import type {
  VisualInspectionData,
  LogisticFeasibilityData,
  StructuralPerformanceData,
  LCAData,
  LCAResults,
  PerformanceAssessment,
  ImageClassificationResults,
} from '@/types';

import {
  PERFORMANCE_THRESHOLDS,
  VISUAL_INSPECTION_WEIGHTS,
  IMAGE_CLASSIFICATION_WEIGHTS,
  LOGISTIC_WEIGHTS,
  STRUCTURAL_PERFORMANCE_WEIGHTS,
} from '@/constants';

// ============================================================================
// Performance Assessment Calculations
// ============================================================================

/**
 * Calculate visual inspection performance from manual input
 *
 * @param data - Visual inspection form data
 * @param hasOptionalData - Whether optional visual data fields are filled
 * @returns Performance assessment with score, percentage, and pass/fail status
 */
export function calculateVisualInspectionManual(
  data: VisualInspectionData,
  hasOptionalData: boolean
): PerformanceAssessment {
  const weights = VISUAL_INSPECTION_WEIGHTS;

  let score =
    weights.connectionType * data.connectionType +
    weights.connectionTypeBase +
    (weights.corrosion * (data.corroded ? 0 : 1) + weights.corrosionBase) +
    (weights.damage * (data.damaged ? 0 : 1) + weights.damageBase);

  if (hasOptionalData) {
    score +=
      weights.compositeConnection * (data.compositeConnection ? 0 : 1) +
      weights.fireProtection * (data.fireProtection ? 1 : 0) +
      weights.sufficientAmount * (data.sufficientAmount ? 1 : 0) +
      weights.geometryCheck * (data.geometryCheck ? 1 : 0);
  }

  const maxScore = hasOptionalData ? weights.maxScoreExtended : weights.maxScoreBasic;
  const percentage = (score / maxScore) * 100;
  const status = percentage >= PERFORMANCE_THRESHOLDS.visualInspection ? 'Passed' : 'Not passed';

  return {
    score,
    percentage,
    status,
    threshold: PERFORMANCE_THRESHOLDS.visualInspection,
  };
}

/**
 * Calculate visual inspection performance from image classification results
 *
 * @param results - Aggregated image classification results
 * @param hasOptionalData - Whether optional visual data fields are filled
 * @param optionalData - Optional visual inspection data
 * @returns Performance assessment with score, percentage, and pass/fail status
 */
export function calculateVisualInspectionFromImages(
  results: ImageClassificationResults,
  hasOptionalData: boolean,
  optionalData?: Partial<VisualInspectionData>
): PerformanceAssessment {
  const weights = IMAGE_CLASSIFICATION_WEIGHTS;
  const { totalImages } = results;

  if (totalImages === 0) {
    throw new Error('No images to classify');
  }

  let score =
    weights.corroded * (results.corroded / totalImages) +
    weights.notCorroded * (results.notCorroded / totalImages) +
    weights.bolted * (results.bolted / totalImages) +
    weights.welded * (results.welded / totalImages) +
    weights.damaged * (results.damaged / totalImages) +
    weights.notDamaged * (results.notDamaged / totalImages);

  if (hasOptionalData && optionalData) {
    const visualWeights = VISUAL_INSPECTION_WEIGHTS;
    score +=
      visualWeights.compositeConnection * (optionalData.compositeConnection ? 0 : 1) +
      visualWeights.fireProtection * (optionalData.fireProtection ? 1 : 0) +
      visualWeights.sufficientAmount * (optionalData.sufficientAmount ? 1 : 0) +
      visualWeights.geometryCheck * (optionalData.geometryCheck ? 1 : 0);
  }

  const maxScore = hasOptionalData
    ? VISUAL_INSPECTION_WEIGHTS.maxScoreExtended
    : VISUAL_INSPECTION_WEIGHTS.maxScoreBasic;
  const percentage = (score / maxScore) * 100;
  const status = percentage >= PERFORMANCE_THRESHOLDS.visualInspection ? 'Passed' : 'Not passed';

  return {
    score,
    percentage,
    status,
    threshold: PERFORMANCE_THRESHOLDS.visualInspection,
  };
}

/**
 * Calculate logistic feasibility performance
 *
 * @param data - Logistic feasibility form data
 * @returns Performance assessment with score, percentage, and pass/fail status
 */
export function calculateLogisticFeasibility(data: LogisticFeasibilityData): PerformanceAssessment {
  const weights = LOGISTIC_WEIGHTS;

  const score =
    weights.itemWeight * (data.itemWeight / weights.itemWeightDivisor) +
    weights.easyHandle * (data.easyHandle ? 1 : 0) +
    weights.existInfrastructure * (data.existInfrastructure ? 1 : 0) +
    weights.specialProtection * (data.specialProtection ? 0 : 1) +
    weights.dismantlePhase * (data.dismantlePhase ? 1 : 0) +
    weights.storageAvailability * (data.storageAvailability ? 1 : 0);

  const percentage = (score / weights.maxScore) * 100;
  const status = percentage >= PERFORMANCE_THRESHOLDS.logisticFeasibility ? 'Passed' : 'Not passed';

  return {
    score,
    percentage,
    status,
    threshold: PERFORMANCE_THRESHOLDS.logisticFeasibility,
  };
}

/**
 * Calculate structural performance assessment
 *
 * @param data - Structural performance form data
 * @returns Performance assessment with score, percentage, and pass/fail status
 */
export function calculateStructuralPerformance(
  data: StructuralPerformanceData
): PerformanceAssessment {
  const weights = STRUCTURAL_PERFORMANCE_WEIGHTS;

  const score =
    weights.dataQuality * (data.dataQuality / weights.dataQualityDivisor) +
    weights.constructionPeriod * (data.constructionPeriod ? 1 : 0) +
    weights.maintenance * (data.maintenance ? 1 : 0) +
    weights.purpose * (data.purpose ? 0 : 1) +
    weights.testing * (data.testing ? 1 : 0);

  const percentage = (score / weights.maxScore) * 100;
  const status =
    percentage >= PERFORMANCE_THRESHOLDS.structuralPerformance ? 'Passed' : 'Not passed';

  return {
    score,
    percentage,
    status,
    threshold: PERFORMANCE_THRESHOLDS.structuralPerformance,
  };
}

// ============================================================================
// LCA Calculations
// ============================================================================

/**
 * Calculate total weight from LCA input data
 *
 * @param data - LCA form data
 * @returns Total weight in kg
 */
export function calculateTotalWeight(data: LCAData): number {
  switch (data.inputMethod) {
    case 'element':
      return (data.elementWeight || 0) * (data.elementQuantity || 0);

    case 'dimension': {
      const height = (data.height || 0) / 1000; // Convert mm to m
      const width = (data.width || 0) / 1000; // Convert mm to m
      const length = data.length || 0; // Already in m
      const unitWeight = data.unitWeight || 0; // kg/m³
      const quantity = data.dimensionQuantity || 0;

      return height * width * length * unitWeight * quantity;
    }

    case 'bulk':
      return data.bulkWeight || 0;

    default:
      return 0;
  }
}

/**
 * Calculate LCA results (embodied carbon)
 *
 * @param data - LCA form data
 * @returns LCA results with carbon emissions for each stage
 */
export function calculateLCA(data: LCAData): LCAResults {
  const totalWeight = calculateTotalWeight(data);

  return {
    totalWeight,
    productStage: totalWeight * data.coefficientA1A3,
    endOfLifeStage: totalWeight * data.coefficientC1C4,
    reuseRecycleRecovery: totalWeight * data.coefficientD,
  };
}

// ============================================================================
// Overall Assessment
// ============================================================================

/**
 * Calculate overall reusability percentage
 *
 * @param visualInspection - Visual inspection assessment
 * @param logisticFeasibility - Logistic feasibility assessment
 * @param structuralPerformance - Structural performance assessment
 * @returns Overall percentage (average of all three criteria)
 */
export function calculateOverallPerformance(
  visualInspection: PerformanceAssessment,
  logisticFeasibility: PerformanceAssessment,
  structuralPerformance: PerformanceAssessment
): number {
  return (
    (visualInspection.percentage +
      logisticFeasibility.percentage +
      structuralPerformance.percentage) / 3
  );
}

/**
 * Determine end-of-life recommendation based on assessments
 *
 * @param visualInspection - Visual inspection assessment
 * @param logisticFeasibility - Logistic feasibility assessment
 * @param structuralPerformance - Structural performance assessment
 * @returns Recommendation string
 */
export function determineRecommendation(
  visualInspection: PerformanceAssessment,
  logisticFeasibility: PerformanceAssessment,
  structuralPerformance: PerformanceAssessment
): 'Dismantle - Reuse' | 'Demolition - Recycle' {
  const allPassed =
    visualInspection.status === 'Passed' &&
    logisticFeasibility.status === 'Passed' &&
    structuralPerformance.status === 'Passed';

  return allPassed ? 'Dismantle - Reuse' : 'Demolition - Recycle';
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format number to fixed decimal places
 *
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Round number to specified decimal places
 *
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 1)
 * @returns Rounded number
 */
export function roundNumber(value: number, decimals: number = 1): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}
