import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  VisualInspectionData,
  LogisticData,
  StructuralPerformanceData,
  LCAData,
  LCAResult,
  EvaluationResult,
  ImageClassifications,
} from '../types';

interface AppState {
  // Visual Inspection
  visualInspection: VisualInspectionData;
  setVisualInspectionData: (data: Partial<VisualInspectionData>) => void;
  addClassificationResult: (result: ImageClassifications) => void;
  clearImages: () => void;

  // Logistic Feasibility
  logistic: LogisticData;
  setLogisticData: (data: Partial<LogisticData>) => void;

  // Structural Performance
  structuralPerformance: StructuralPerformanceData;
  setStructuralPerformanceData: (data: Partial<StructuralPerformanceData>) => void;

  // LCA
  lca: LCAData;
  setLCAData: (data: Partial<LCAData>) => void;
  lcaResult: LCAResult | null;
  setLCAResult: (result: LCAResult | null) => void;

  // Results
  evaluationResult: EvaluationResult | null;
  setEvaluationResult: (result: EvaluationResult | null) => void;

  // Loading states
  isClassifying: boolean;
  setIsClassifying: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialVisualInspectionState: VisualInspectionData = {
  images: [],
  classificationResults: [],
  useManualInput: false,
  connectionType: 0.5,
  corroded: null,
  damaged: null,
  compositeConnection: null,
  fireProtection: null,
  sufficientAmount: null,
  geometryCheck: null,
};

const initialLogisticState: LogisticData = {
  itemWeight: null,
  easyHandle: null,
  existInfrastructure: null,
  specialProtection: null,
  dismantlePhase: null,
  storageAvailability: null,
};

const initialStructuralPerformanceState: StructuralPerformanceData = {
  dataQuality: null,
  constructionPeriod: null,
  maintenance: null,
  purpose: null,
  testing: null,
};

const initialLCAState: LCAData = {
  weightInputMethod: 'single',
  singleWeight: null,
  itemCount: null,
  height: null,
  width: null,
  length: null,
  unitWeight: null,
  quantity: null,
  bulkWeight: null,
  coefficientA1A3: 1.13,
  coefficientC1C4: 0.018,
  coefficientD: -0.413,
};

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    // Visual Inspection
    visualInspection: initialVisualInspectionState,
    setVisualInspectionData: (data) =>
      set((state) => ({
        visualInspection: { ...state.visualInspection, ...data },
      })),
    addClassificationResult: (result) =>
      set((state) => ({
        visualInspection: {
          ...state.visualInspection,
          classificationResults: [...state.visualInspection.classificationResults, result],
        },
      })),
    clearImages: () =>
      set((state) => ({
        visualInspection: {
          ...state.visualInspection,
          images: [],
          classificationResults: [],
        },
      })),

    // Logistic Feasibility
    logistic: initialLogisticState,
    setLogisticData: (data) =>
      set((state) => ({
        logistic: { ...state.logistic, ...data },
      })),

    // Structural Performance
    structuralPerformance: initialStructuralPerformanceState,
    setStructuralPerformanceData: (data) =>
      set((state) => ({
        structuralPerformance: { ...state.structuralPerformance, ...data },
      })),

    // LCA
    lca: initialLCAState,
    setLCAData: (data) =>
      set((state) => ({
        lca: { ...state.lca, ...data },
      })),
    lcaResult: null,
    setLCAResult: (result) => set({ lcaResult: result }),

    // Results
    evaluationResult: null,
    setEvaluationResult: (result) => set({ evaluationResult: result }),

    // Loading states
    isClassifying: false,
    setIsClassifying: (loading) => set({ isClassifying: loading }),

    // Reset
    reset: () =>
      set({
        visualInspection: initialVisualInspectionState,
        logistic: initialLogisticState,
        structuralPerformance: initialStructuralPerformanceState,
        lca: initialLCAState,
        lcaResult: null,
        evaluationResult: null,
        isClassifying: false,
      }),
  }))
);
