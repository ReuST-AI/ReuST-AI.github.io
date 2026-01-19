import type {
  VisualInspectionData,
  LogisticData,
  StructuralPerformanceData,
  EvaluationResult,
  ImageClassifications,
} from '../types';
import { aggregateClassifications } from '@/features/visual-inspection/services/imageClassifier';

const THRESHOLDS = {
  visualInspection: 70,
  logisticFeasibility: 75,
  structuralPerformance: 80,
};

const determineStatus = (
  percentage: number,
  threshold: number
): 'Passed' | 'Not passed' => {
  return percentage >= threshold ? 'Passed' : 'Not passed';
};

export const calculateVisualInspection = (
  data: VisualInspectionData,
  classifications: ImageClassifications[]
): {
  score: number;
  percentage: number;
  status: 'Passed' | 'Not passed';
} => {
  let score = 0;
  let maxScore = 12;

  if (data.useManualInput) {
    score += 2 * data.connectionType + 1;
    score += data.corroded === false ? 3 : data.corroded === true ? 1 : 0;
    score += data.damaged === false ? 3 : data.damaged === true ? 1 : 0;
  } else if (classifications.length > 0) {
    const aggregated = aggregateClassifications(classifications);
    const totalImages = classifications.length;

    score += 1 * (aggregated.corrodedPercentage / 100);
    score += 1 * (aggregated.damagedPercentage / 100);
    score += 1 * (aggregated.weldedPercentage / 100);
    score += 3 * (aggregated.boltedPercentage / 100);
    score += 3 * (aggregated.notCorrodedPercentage / 100);
    score += 3 * (aggregated.notDamagedPercentage / 100);
  }

  const hasOptionalData =
    data.compositeConnection !== null ||
    data.fireProtection !== null ||
    data.sufficientAmount !== null ||
    data.geometryCheck !== null;

  if (hasOptionalData) {
    maxScore = 15;
    score += data.compositeConnection === true ? 0 : data.compositeConnection === false ? 1 : 0;
    score += data.fireProtection === false ? 0 : data.fireProtection === true ? 1 : 0;
    score += data.sufficientAmount === true ? 2 : data.sufficientAmount === false ? 0 : 0;
    score += data.geometryCheck === true ? 2 : data.geometryCheck === false ? 0 : 0;
  }

  const percentage = (score / maxScore) * 100;
  const status = determineStatus(percentage, THRESHOLDS.visualInspection);

  return { score, percentage, status };
};

export const calculateLogisticFeasibility = (
  data: LogisticData
): {
  score: number;
  percentage: number;
  status: 'Passed' | 'Not passed';
} => {
  const itemWeight = data.itemWeight ?? 0;
  const easyHandle = data.easyHandle === true ? 1 : 0;
  const existInfrastructure = data.existInfrastructure === true ? 1 : 0;
  const specialProtection = data.specialProtection === false ? 1 : 0;
  const dismantlePhase = data.dismantlePhase === true ? 1 : 0;
  const storageAvailability = data.storageAvailability === true ? 1 : 0;

  const score =
    3 * (itemWeight / 3) +
    3 * easyHandle +
    4 * existInfrastructure +
    1 * specialProtection +
    3 * dismantlePhase +
    3 * storageAvailability;

  const percentage = (score / 17) * 100;
  const status = determineStatus(percentage, THRESHOLDS.logisticFeasibility);

  return { score, percentage, status };
};

export const calculateStructuralPerformance = (
  data: StructuralPerformanceData
): {
  score: number;
  percentage: number;
  status: 'Passed' | 'Not passed';
} => {
  const dataQuality = data.dataQuality ?? 0;
  const constructionPeriod = data.constructionPeriod === true ? 1 : 0;
  const maintenance = data.maintenance === true ? 1 : 0;
  const purpose = data.purpose === false ? 1 : 0;
  const testing = data.testing === true ? 1 : 0;

  const score =
    4 * (dataQuality / 3) +
    2 * constructionPeriod +
    3 * maintenance +
    3 * purpose +
    3 * testing;

  const percentage = (score / 15) * 100;
  const status = determineStatus(percentage, THRESHOLDS.structuralPerformance);

  return { score, percentage, status };
};

export const calculateOverallEvaluation = (
  visualInspection: VisualInspectionData,
  logistic: LogisticData,
  structuralPerformance: StructuralPerformanceData,
  classifications: ImageClassifications[]
): EvaluationResult => {
  const visualInspectionResult = calculateVisualInspection(
    visualInspection,
    classifications
  );
  const logisticResult = calculateLogisticFeasibility(logistic);
  const structuralPerformanceResult =
    calculateStructuralPerformance(structuralPerformance);

  const overallPercentage =
    (visualInspectionResult.percentage +
      logisticResult.percentage +
      structuralPerformanceResult.percentage) /
    3;

  const allPassed =
    visualInspectionResult.status === 'Passed' &&
    logisticResult.status === 'Passed' &&
    structuralPerformanceResult.status === 'Passed';

  const recommendation = allPassed ? 'Dismantle - Reuse' : 'Demolition - Recycle';

  let imagesSummary: string | undefined;
  if (classifications.length > 0) {
    const aggregated = aggregateClassifications(classifications);
    imagesSummary = `Loaded images: ${aggregated.corrodedPercentage.toFixed(1)}% corroded, ${aggregated.notCorrodedPercentage.toFixed(1)}% not corroded, ${aggregated.boltedPercentage.toFixed(1)}% bolted, ${aggregated.weldedPercentage.toFixed(1)}% welded, ${aggregated.damagedPercentage.toFixed(1)}% damaged, ${aggregated.notDamagedPercentage.toFixed(1)}% not damaged.`;
  }

  return {
    visualInspection: visualInspectionResult,
    logisticFeasibility: logisticResult,
    structuralPerformance: structuralPerformanceResult,
    overallPercentage,
    recommendation,
    imagesSummary,
  };
};
