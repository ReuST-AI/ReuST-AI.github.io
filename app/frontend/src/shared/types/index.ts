export interface ClassificationResult {
  className: string;
  confidence: number;
}

export interface ImageClassifications {
  corrosion: ClassificationResult;
  connection: ClassificationResult;
  damage: ClassificationResult;
}

export interface VisualInspectionData {
  images: File[];
  classificationResults: ImageClassifications[];
  useManualInput: boolean;
  connectionType: number;
  corroded: boolean | null;
  damaged: boolean | null;
  compositeConnection: boolean | null;
  fireProtection: boolean | null;
  sufficientAmount: boolean | null;
  geometryCheck: boolean | null;
}

export interface LogisticData {
  itemWeight: number | null;
  easyHandle: boolean | null;
  existInfrastructure: boolean | null;
  specialProtection: boolean | null;
  dismantlePhase: boolean | null;
  storageAvailability: boolean | null;
}

export interface StructuralPerformanceData {
  dataQuality: number | null;
  constructionPeriod: boolean | null;
  maintenance: boolean | null;
  purpose: boolean | null;
  testing: boolean | null;
}

export interface LCAData {
  weightInputMethod: 'single' | 'dimensions' | 'bulk';
  singleWeight: number | null;
  itemCount: number | null;
  height: number | null;
  width: number | null;
  length: number | null;
  unitWeight: number | null;
  quantity: number | null;
  bulkWeight: number | null;
  coefficientA1A3: number;
  coefficientC1C4: number;
  coefficientD: number;
}

export interface LCAResult {
  totalWeight: number;
  productStage: number;
  endOfLifeStage: number;
  reuseStage: number;
}

export interface EvaluationResult {
  visualInspection: {
    score: number;
    percentage: number;
    status: 'Passed' | 'Not passed';
  };
  logisticFeasibility: {
    score: number;
    percentage: number;
    status: 'Passed' | 'Not passed';
  };
  structuralPerformance: {
    score: number;
    percentage: number;
    status: 'Passed' | 'Not passed';
  };
  overallPercentage: number;
  recommendation: 'Dismantle - Reuse' | 'Demolition - Recycle';
  imagesSummary?: string;
}
