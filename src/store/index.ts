/**
 * Zustand store for application state management
 * Centralized state management for form data, ML models, and assessment results
 */

import { create } from 'zustand';
import type { AppState, ImageData, ImageClassificationResults, AssessmentResults } from '@/types';
import { DEFAULT_CARBON_COEFFICIENTS } from '@/constants';
import {
  calculateVisualInspectionManual,
  calculateVisualInspectionFromImages,
  calculateLogisticFeasibility,
  calculateStructuralPerformance,
  calculateLCA,
  calculateOverallPerformance,
  determineRecommendation,
} from '@/utils/calculations';

interface AppActions {
  // Image management
  setImages: (images: ImageData[]) => void;
  addImages: (images: ImageData[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;

  // Classification results
  setClassificationResults: (results: ImageClassificationResults) => void;

  // Visual inspection
  updateVisualInspection: (data: Partial<AppState['visualInspection']>) => void;
  setShowManualInput: (show: boolean) => void;
  setShowOptionalVisualData: (show: boolean) => void;

  // Logistic feasibility
  updateLogisticFeasibility: (data: Partial<AppState['logisticFeasibility']>) => void;

  // Structural performance
  updateStructuralPerformance: (data: Partial<AppState['structuralPerformance']>) => void;

  // LCA
  updateLCA: (data: Partial<AppState['lca']>) => void;
  calculateLCAResults: () => void;

  // Assessment
  generateAssessment: () => void;

  // ML Models
  setModels: (models: AppState['models']) => void;
  setModelsLoaded: (loaded: boolean) => void;

  // UI
  toggleDropdown: (section: string) => void;
  setIsClassifying: (isClassifying: boolean) => void;

  // Reset
  resetForm: () => void;
}

const initialState: AppState = {
  images: [],
  classificationResults: null,

  visualInspection: {
    connectionType: 0.5,
    corroded: null,
    damaged: null,
    compositeConnection: null,
    fireProtection: null,
    sufficientAmount: null,
    geometryCheck: null,
  },

  logisticFeasibility: {
    itemWeight: 0,
    easyHandle: null,
    existInfrastructure: null,
    specialProtection: null,
    dismantlePhase: null,
    storageAvailability: null,
  },

  structuralPerformance: {
    dataQuality: 0,
    constructionPeriod: null,
    maintenance: null,
    purpose: null,
    testing: null,
  },

  lca: {
    inputMethod: null,
    coefficientA1A3: DEFAULT_CARBON_COEFFICIENTS.productStage,
    coefficientC1C4: DEFAULT_CARBON_COEFFICIENTS.endOfLife,
    coefficientD: DEFAULT_CARBON_COEFFICIENTS.reuseRecycle,
  },

  assessmentResults: null,
  lcaResults: null,

  ui: {
    isClassifying: false,
    showManualInput: false,
    showOptionalVisualData: false,
    activeDropdowns: new Set(['visualInspection']),
  },

  models: {
    corrosion: null,
    connection: null,
    damage: null,
  },

  modelsLoaded: false,
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...initialState,

  // ============================================================================
  // Image Management
  // ============================================================================

  setImages: (images) => {
    set({ images, classificationResults: null });
  },

  addImages: (newImages) => {
    set((state) => ({
      images: [...state.images, ...newImages],
    }));
  },

  removeImage: (id) => {
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },

  clearImages: () => {
    set({ images: [], classificationResults: null });
  },

  // ============================================================================
  // Classification Results
  // ============================================================================

  setClassificationResults: (results) => {
    set({ classificationResults: results });
    // Auto-generate assessment when classification is complete
    setTimeout(() => {
      get().generateAssessment();
    }, 0);
  },

  // ============================================================================
  // Form Updates
  // ============================================================================

  updateVisualInspection: (data) => {
    set((state) => ({
      visualInspection: { ...state.visualInspection, ...data },
    }));
  },

  setShowManualInput: (show) => {
    set((state) => ({
      ui: { ...state.ui, showManualInput: show },
    }));
    if (show) {
      set({ images: [], classificationResults: null });
    }
  },

  setShowOptionalVisualData: (show) => {
    set((state) => ({
      ui: { ...state.ui, showOptionalVisualData: show },
    }));
  },

  updateLogisticFeasibility: (data) => {
    set((state) => ({
      logisticFeasibility: { ...state.logisticFeasibility, ...data },
    }));
  },

  updateStructuralPerformance: (data) => {
    set((state) => ({
      structuralPerformance: { ...state.structuralPerformance, ...data },
    }));
  },

  updateLCA: (data) => {
    set((state) => ({
      lca: { ...state.lca, ...data },
    }));
  },

  // ============================================================================
  // LCA Calculation
  // ============================================================================

  calculateLCAResults: () => {
    const { lca } = get();

    try {
      const results = calculateLCA(lca);
      set({ lcaResults: results });
    } catch (error) {
      console.error('Failed to calculate LCA:', error);
      set({ lcaResults: null });
    }
  },

  // ============================================================================
  // Assessment Generation
  // ============================================================================

  generateAssessment: () => {
    const state = get();
    const {
      classificationResults,
      visualInspection,
      logisticFeasibility,
      structuralPerformance,
      ui,
    } = state;

    try {
      // Calculate visual inspection assessment
      let visualInspectionAssessment;

      if (classificationResults) {
        // Use image classification results
        visualInspectionAssessment = calculateVisualInspectionFromImages(
          classificationResults,
          ui.showOptionalVisualData,
          ui.showOptionalVisualData ? visualInspection : undefined
        );
      } else if (ui.showManualInput) {
        // Use manual input
        visualInspectionAssessment = calculateVisualInspectionManual(
          visualInspection,
          ui.showOptionalVisualData
        );
      } else {
        // No data available
        return;
      }

      // Calculate other assessments
      const logisticFeasibilityAssessment = calculateLogisticFeasibility(logisticFeasibility);
      const structuralPerformanceAssessment =
        calculateStructuralPerformance(structuralPerformance);

      // Calculate overall performance
      const overallPercentage = calculateOverallPerformance(
        visualInspectionAssessment,
        logisticFeasibilityAssessment,
        structuralPerformanceAssessment
      );

      // Determine recommendation
      const recommendation = determineRecommendation(
        visualInspectionAssessment,
        logisticFeasibilityAssessment,
        structuralPerformanceAssessment
      );

      const results: AssessmentResults = {
        visualInspection: visualInspectionAssessment,
        logisticFeasibility: logisticFeasibilityAssessment,
        structuralPerformance: structuralPerformanceAssessment,
        overallPercentage,
        recommendation,
      };

      set({ assessmentResults: results });
    } catch (error) {
      console.error('Failed to generate assessment:', error);
      set({ assessmentResults: null });
    }
  },

  // ============================================================================
  // ML Models
  // ============================================================================

  setModels: (models) => {
    set({ models, modelsLoaded: true });
  },

  setModelsLoaded: (loaded) => {
    set({ modelsLoaded: loaded });
  },

  // ============================================================================
  // UI
  // ============================================================================

  toggleDropdown: (section) => {
    set((state) => {
      const newActiveDropdowns = new Set(state.ui.activeDropdowns);
      if (newActiveDropdowns.has(section)) {
        newActiveDropdowns.delete(section);
      } else {
        newActiveDropdowns.add(section);
      }
      return {
        ui: { ...state.ui, activeDropdowns: newActiveDropdowns },
      };
    });
  },

  setIsClassifying: (isClassifying) => {
    set((state) => ({
      ui: { ...state.ui, isClassifying },
    }));
  },

  // ============================================================================
  // Reset
  // ============================================================================

  resetForm: () => {
    set({
      ...initialState,
      // Preserve models
      models: get().models,
      modelsLoaded: get().modelsLoaded,
    });
  },
}));

// ============================================================================
// Selector Hooks (for optimized re-renders)
// ============================================================================

export const useImages = () => useAppStore((state) => state.images);
export const useClassificationResults = () =>
  useAppStore((state) => state.classificationResults);
export const useVisualInspection = () => useAppStore((state) => state.visualInspection);
export const useLogisticFeasibility = () => useAppStore((state) => state.logisticFeasibility);
export const useStructuralPerformance = () => useAppStore((state) => state.structuralPerformance);
export const useLCA = () => useAppStore((state) => state.lca);
export const useLCAResults = () => useAppStore((state) => state.lcaResults);
export const useAssessmentResults = () => useAppStore((state) => state.assessmentResults);
export const useModels = () => useAppStore((state) => state.models);
export const useModelsLoaded = () => useAppStore((state) => state.modelsLoaded);
export const useUIState = () => useAppStore((state) => state.ui);
