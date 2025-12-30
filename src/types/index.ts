/**
 * Type definitions for ReuST application
 * Comprehensive type system for structural steel reuse assessment
 */

import type * as tf from '@tensorflow/tfjs';

// ============================================================================
// ML Model Types
// ============================================================================

/**
 * Classification result from ML model
 */
export interface ClassificationResult {
  className: string;
  confidence: number;
}

/**
 * Available ML model types for structural element classification
 */
export type ModelType = 'corrosion' | 'connection' | 'damage';

/**
 * Loaded TensorFlow.js models
 */
export interface MLModels {
  corrosion: tf.GraphModel | null;
  connection: tf.GraphModel | null;
  damage: tf.GraphModel | null;
}

/**
 * Image classification results aggregated across all images
 */
export interface ImageClassificationResults {
  totalImages: number;
  corroded: number;
  notCorroded: number;
  bolted: number;
  welded: number;
  damaged: number;
  notDamaged: number;
}

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Visual inspection form data (manual input)
 */
export interface VisualInspectionData {
  connectionType: number; // 0-1 slider (welded to bolted)
  corroded: boolean | null;
  damaged: boolean | null;
  compositeConnection: boolean | null;
  fireProtection: boolean | null;
  sufficientAmount: boolean | null;
  geometryCheck: boolean | null;
}

/**
 * Logistic feasibility form data
 */
export interface LogisticFeasibilityData {
  itemWeight: number; // 0-3 (very heavy to very light)
  easyHandle: boolean | null;
  existInfrastructure: boolean | null;
  specialProtection: boolean | null;
  dismantlePhase: boolean | null;
  storageAvailability: boolean | null;
}

/**
 * Structural performance form data
 */
export interface StructuralPerformanceData {
  dataQuality: number; // 0-3 (no docs to all docs)
  constructionPeriod: boolean | null; // Post-2005
  maintenance: boolean | null;
  purpose: boolean | null; // Is unique
  testing: boolean | null; // Can conduct testing
}

/**
 * Weight input method types
 */
export type WeightInputMethod = 'element' | 'dimension' | 'bulk';

/**
 * LCA (Life Cycle Assessment) form data
 */
export interface LCAData {
  inputMethod: WeightInputMethod | null;
  // Element weight method
  elementWeight?: number;
  elementQuantity?: number;
  // Dimension method
  height?: number;
  width?: number;
  length?: number;
  unitWeight?: number;
  dimensionQuantity?: number;
  // Bulk weight method
  bulkWeight?: number;
  // Carbon coefficients
  coefficientA1A3: number; // Product stage
  coefficientC1C4: number; // End of life stage
  coefficientD: number; // Reuse/recycle/recovery stage
}

/**
 * Computed LCA results
 */
export interface LCAResults {
  totalWeight: number;
  productStage: number;
  endOfLifeStage: number;
  reuseRecycleRecovery: number;
}

// ============================================================================
// Performance Assessment Types
// ============================================================================

/**
 * Performance assessment for a single criterion
 */
export interface PerformanceAssessment {
  score: number; // Raw weighted score
  percentage: number; // Percentage (0-100)
  status: 'Passed' | 'Not passed';
  threshold: number; // Threshold for passing
}

/**
 * Complete assessment results for all criteria
 */
export interface AssessmentResults {
  visualInspection: PerformanceAssessment;
  logisticFeasibility: PerformanceAssessment;
  structuralPerformance: PerformanceAssessment;
  overallPercentage: number;
  recommendation: 'Dismantle - Reuse' | 'Demolition - Recycle';
}

// ============================================================================
// Application State Types
// ============================================================================

/**
 * Image data with preview information
 */
export interface ImageData {
  id: string;
  file: File;
  preview: string;
}

/**
 * UI state flags
 */
export interface UIState {
  isClassifying: boolean;
  showManualInput: boolean;
  showOptionalVisualData: boolean;
  activeDropdowns: Set<string>;
}

/**
 * Complete application state
 */
export interface AppState {
  // Image data
  images: ImageData[];
  classificationResults: ImageClassificationResults | null;

  // Form data
  visualInspection: VisualInspectionData;
  logisticFeasibility: LogisticFeasibilityData;
  structuralPerformance: StructuralPerformanceData;
  lca: LCAData;

  // Results
  assessmentResults: AssessmentResults | null;
  lcaResults: LCAResults | null;

  // UI state
  ui: UIState;

  // ML Models
  models: MLModels;
  modelsLoaded: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic option for select dropdowns
 */
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

/**
 * Dropdown section identifier
 */
export type DropdownSection =
  | 'visualInspection'
  | 'logisticFeasibility'
  | 'structuralPerformance'
  | 'lca'
  | 'suggestion';

/**
 * Form field validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}
