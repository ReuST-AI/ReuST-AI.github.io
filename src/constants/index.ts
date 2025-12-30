/**
 * Application constants
 * Centralized configuration for ML models, thresholds, weights, and options
 */

import type { SelectOption } from '@/types';

// ============================================================================
// ML Model Configuration
// ============================================================================

/**
 * Paths to TensorFlow.js model files
 */
export const MODEL_PATHS = {
  corrosion: './models/CorrosionModel/model.json',
  connection: './models/ConnectionModel/model.json',
  damage: './models/DamageModel/model.json',
} as const;

/**
 * Class names for each ML model
 */
export const CLASS_NAMES = {
  corrosion: ['Corroded', 'Not Corroded'] as const,
  connection: ['Bolted', 'Welded'] as const,
  damage: ['Damaged', 'Not Damaged'] as const,
} as const;

/**
 * Image preprocessing configuration
 */
export const IMAGE_CONFIG = {
  size: 128, // Image resize dimensions (128x128)
  displayHeight: 200, // Display height in px
} as const;

// ============================================================================
// Performance Assessment Configuration
// ============================================================================

/**
 * Threshold percentages for each criterion to pass
 */
export const PERFORMANCE_THRESHOLDS = {
  visualInspection: 70,
  logisticFeasibility: 75,
  structuralPerformance: 80,
} as const;

/**
 * Weights for visual inspection criteria (manual input)
 */
export const VISUAL_INSPECTION_WEIGHTS = {
  connectionType: 2,
  connectionTypeBase: 1,
  corrosion: 2,
  corrosionBase: 1,
  damage: 2,
  damageBase: 1,
  compositeConnection: 1,
  fireProtection: 1,
  sufficientAmount: 2,
  geometryCheck: 2,
  maxScoreBasic: 12, // Without optional data
  maxScoreExtended: 15, // With optional data
} as const;

/**
 * Weights for visual inspection criteria (image classification)
 */
export const IMAGE_CLASSIFICATION_WEIGHTS = {
  corroded: 1,
  notCorroded: 3,
  bolted: 3,
  welded: 1,
  damaged: 1,
  notDamaged: 3,
} as const;

/**
 * Weights for logistic feasibility criteria
 */
export const LOGISTIC_WEIGHTS = {
  itemWeight: 3,
  itemWeightDivisor: 3,
  easyHandle: 3,
  existInfrastructure: 4,
  specialProtection: 1,
  dismantlePhase: 3,
  storageAvailability: 3,
  maxScore: 17,
} as const;

/**
 * Weights for structural performance criteria
 */
export const STRUCTURAL_PERFORMANCE_WEIGHTS = {
  dataQuality: 4,
  dataQualityDivisor: 3,
  constructionPeriod: 2,
  maintenance: 3,
  purpose: 3,
  testing: 3,
  maxScore: 15,
} as const;

// ============================================================================
// LCA Configuration
// ============================================================================

/**
 * Default carbon coefficients for LCA calculations
 */
export const DEFAULT_CARBON_COEFFICIENTS = {
  productStage: 1.13, // A1-A3 [kgCO2e]
  endOfLife: 0.018, // C1-C4 [kgCO2e]
  reuseRecycle: -0.413, // D [kgCO2e]
} as const;

// ============================================================================
// Form Options
// ============================================================================

/**
 * Weight categories for structural elements
 */
export const WEIGHT_OPTIONS: SelectOption<number>[] = [
  { value: 3, label: 'Very light [< 0.1 ton]' },
  { value: 2, label: 'Light [0.1 - 0.2 ton]' },
  { value: 1, label: 'Heavy [0.2 - 0.5 ton]' },
  { value: 0, label: 'Very heavy [> 0.5 ton]' },
];

/**
 * Data quality levels
 */
export const DATA_QUALITY_OPTIONS: SelectOption<number>[] = [
  { value: 0, label: 'No documentation' },
  { value: 1, label: 'Only drawing available' },
  { value: 2, label: 'Drawings and calculation report available' },
  { value: 3, label: 'All detailed documentation available' },
];

/**
 * Boolean options (Yes/No)
 */
export const BOOLEAN_OPTIONS: SelectOption<boolean>[] = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

// ============================================================================
// UI Configuration
// ============================================================================

/**
 * Disclaimer message shown on app load
 */
export const DISCLAIMER_MESSAGE = `Disclaimer:

ReuST is currently under development and is intended for testing purposes only. As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. Use the results with caution and always consult with relevant experts for reliable assessments.`;

/**
 * Dropdown section titles
 */
export const SECTION_TITLES = {
  visualInspection: 'Structural Visual Inspection',
  logisticFeasibility: 'Logistic Feasibility',
  structuralPerformance: 'Structural Performance',
  lca: 'Life Cycle Assessment (LCA)',
  suggestion: 'Suggestion for the End-of-Life Scenario',
} as const;

/**
 * Section descriptions
 */
export const SECTION_DESCRIPTIONS = {
  visualInspection:
    'This criteria is supplemented with an automated convolutional neural network (CNN) based image classification tool. Images can be uploaded and parameters related to corrosion, connection types and damage status are evaluated automatically.',
  logisticFeasibility:
    'Evaluates the practical aspects of reusing structural elements including weight, handling, infrastructure, and storage.',
  structuralPerformance:
    'This criteria evaluates the parameters related to the mechanical and physical performance of each structural elements under consideration.',
  lca: 'The life cycle assessment is reported based on a simplified embodied carbon computation from the cradle-to-cradle approach. For this, the weights of the structural steel elements and the associated carbon factors are considered.',
  suggestion:
    'Based on the input of the information for each criteria i.e., logistic feasibility, structural visual inspection and structural performance, the weighted sum of the parameters is presented in percentage. Accordingly, the weighted sum of each criteria is compared with the criteria threshold value which is defined by the authors apriori. The criteria threshold value defined for logistic feasibility, structural visual inspection and structural performance is 75%, 70% and 80%, respectively.',
} as const;

/**
 * Contact information
 */
export const CONTACT_EMAIL = 'alper.kanyilmaz@polimi.it';

/**
 * Application metadata
 */
export const APP_METADATA = {
  title: 'ReuST',
  fullTitle:
    'A decision making framework for efficient end-of-life scenarios of structural steel elements',
  version: '2.0.0',
} as const;
