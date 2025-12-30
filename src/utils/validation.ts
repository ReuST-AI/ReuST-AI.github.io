/**
 * Form validation utilities
 * Functions for validating form data and providing helpful error messages
 */

import type {
  VisualInspectionData,
  LogisticFeasibilityData,
  StructuralPerformanceData,
  LCAData,
  ValidationError,
} from '@/types';

// ============================================================================
// Generic Validation Helpers
// ============================================================================

/**
 * Check if a value is null or undefined
 */
function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if all required boolean fields are filled
 */
function validateBooleanFields(
  fields: any,
  fieldNames: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (fieldNames.includes(key) && isNullish(value)) {
      errors.push({
        field: key,
        message: `${formatFieldName(key)} is required`,
      });
    }
  }

  return errors;
}

/**
 * Format field name for display (camelCase to Title Case)
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate visual inspection data (manual input mode)
 *
 * @param data - Visual inspection form data
 * @param includeOptional - Whether to validate optional fields
 * @returns Array of validation errors (empty if valid)
 */
export function validateVisualInspection(
  data: VisualInspectionData,
  includeOptional: boolean = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Connection type is always required (slider, defaults to 0.5)
  if (isNullish(data.connectionType)) {
    errors.push({ field: 'connectionType', message: 'Connection type is required' });
  }

  // Required boolean fields
  const requiredFields = ['corroded', 'damaged'];
  errors.push(...validateBooleanFields(data, requiredFields));

  // Optional fields validation
  if (includeOptional) {
    const optionalFields = [
      'compositeConnection',
      'fireProtection',
      'sufficientAmount',
      'geometryCheck',
    ];
    errors.push(...validateBooleanFields(data, optionalFields));
  }

  return errors;
}

/**
 * Validate logistic feasibility data
 *
 * @param data - Logistic feasibility form data
 * @returns Array of validation errors (empty if valid)
 */
export function validateLogisticFeasibility(
  data: LogisticFeasibilityData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Item weight is required (0-3 scale)
  if (isNullish(data.itemWeight)) {
    errors.push({ field: 'itemWeight', message: 'Item weight is required' });
  }

  // All boolean fields are required
  const requiredFields = [
    'easyHandle',
    'existInfrastructure',
    'specialProtection',
    'dismantlePhase',
    'storageAvailability',
  ];
  errors.push(...validateBooleanFields(data, requiredFields));

  return errors;
}

/**
 * Validate structural performance data
 *
 * @param data - Structural performance form data
 * @returns Array of validation errors (empty if valid)
 */
export function validateStructuralPerformance(
  data: StructuralPerformanceData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Data quality is required (0-3 scale)
  if (isNullish(data.dataQuality)) {
    errors.push({ field: 'dataQuality', message: 'Data quality is required' });
  }

  // All boolean fields are required
  const requiredFields = ['constructionPeriod', 'maintenance', 'purpose', 'testing'];
  errors.push(...validateBooleanFields(data, requiredFields));

  return errors;
}

/**
 * Validate LCA data based on selected input method
 *
 * @param data - LCA form data
 * @returns Array of validation errors (empty if valid)
 */
export function validateLCA(data: LCAData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Input method must be selected
  if (!data.inputMethod) {
    errors.push({ field: 'inputMethod', message: 'Please select a weight input method' });
    return errors; // Can't validate further without knowing the method
  }

  // Validate based on input method
  switch (data.inputMethod) {
    case 'element':
      if (!data.elementWeight || data.elementWeight <= 0) {
        errors.push({ field: 'elementWeight', message: 'Element weight must be greater than 0' });
      }
      if (!data.elementQuantity || data.elementQuantity <= 0) {
        errors.push({ field: 'elementQuantity', message: 'Quantity must be greater than 0' });
      }
      break;

    case 'dimension':
      if (!data.height || data.height <= 0) {
        errors.push({ field: 'height', message: 'Height must be greater than 0' });
      }
      if (!data.width || data.width <= 0) {
        errors.push({ field: 'width', message: 'Width must be greater than 0' });
      }
      if (!data.length || data.length <= 0) {
        errors.push({ field: 'length', message: 'Length must be greater than 0' });
      }
      if (!data.unitWeight || data.unitWeight <= 0) {
        errors.push({ field: 'unitWeight', message: 'Unit weight must be greater than 0' });
      }
      if (!data.dimensionQuantity || data.dimensionQuantity <= 0) {
        errors.push({ field: 'dimensionQuantity', message: 'Quantity must be greater than 0' });
      }
      break;

    case 'bulk':
      if (!data.bulkWeight || data.bulkWeight <= 0) {
        errors.push({ field: 'bulkWeight', message: 'Bulk weight must be greater than 0' });
      }
      break;
  }

  // Carbon coefficients are always required
  if (isNullish(data.coefficientA1A3)) {
    errors.push({ field: 'coefficientA1A3', message: 'Product stage coefficient is required' });
  }
  if (isNullish(data.coefficientC1C4)) {
    errors.push({ field: 'coefficientC1C4', message: 'End of life coefficient is required' });
  }
  if (isNullish(data.coefficientD)) {
    errors.push({
      field: 'coefficientD',
      message: 'Reuse/recycle/recovery coefficient is required',
    });
  }

  return errors;
}

// ============================================================================
// Completeness Checks
// ============================================================================

/**
 * Check if visual inspection is complete enough to calculate
 *
 * @param hasImages - Whether images have been uploaded and classified
 * @param hasManualData - Whether manual input has been provided
 * @returns True if visual inspection can be calculated
 */
export function isVisualInspectionComplete(
  hasImages: boolean,
  hasManualData: boolean
): boolean {
  return hasImages || hasManualData;
}

/**
 * Check if all required data is present for generating assessment
 *
 * @param hasVisualInspection - Visual inspection is complete
 * @param hasLogisticFeasibility - Logistic feasibility is complete
 * @param hasStructuralPerformance - Structural performance is complete
 * @returns True if assessment can be generated
 */
export function canGenerateAssessment(
  hasVisualInspection: boolean,
  hasLogisticFeasibility: boolean,
  hasStructuralPerformance: boolean
): boolean {
  return hasVisualInspection && hasLogisticFeasibility && hasStructuralPerformance;
}
