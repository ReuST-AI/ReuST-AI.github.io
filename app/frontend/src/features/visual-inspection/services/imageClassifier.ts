import * as tf from '@tensorflow/tfjs';
import { getModel, type ModelType } from './modelLoader';
import type { ClassificationResult, ImageClassifications } from '@/shared/types';

const CLASS_NAMES = {
  corrosion: ['Corroded', 'Not Corroded'],
  connection: ['Bolted', 'Welded'],
  damage: ['Damaged', 'Not Damaged'],
};

const preprocessImage = (imageElement: HTMLImageElement): tf.Tensor => {
  let tensor = tf.browser.fromPixels(imageElement);
  tensor = tf.image.resizeBilinear(tensor, [128, 128]);
  tensor = tensor.toFloat();
  tensor = tensor.reshape([-1, 128, 128, 3]);
  return tensor;
};

const classifyWithModel = async (
  imageElement: HTMLImageElement,
  modelType: ModelType
): Promise<ClassificationResult> => {
  const model = getModel(modelType);
  if (!model) {
    throw new Error(`${modelType} model not loaded`);
  }

  const tensor = preprocessImage(imageElement);
  try {
    const prediction = model.predict(tensor) as tf.Tensor;
    const result = (await prediction.data())[0];
    const classIndex = result > 0.5 ? 1 : 0;
    const className = CLASS_NAMES[modelType][classIndex];

    return {
      className,
      confidence: classIndex === 1 ? result : 1 - result,
    };
  } finally {
    tensor.dispose();
  }
};

export const classifyImage = async (
  imageElement: HTMLImageElement
): Promise<ImageClassifications> => {
  const [corrosion, connection, damage] = await Promise.all([
    classifyWithModel(imageElement, 'corrosion'),
    classifyWithModel(imageElement, 'connection'),
    classifyWithModel(imageElement, 'damage'),
  ]);

  return { corrosion, connection, damage };
};

export const classifyMultipleImages = async (
  imageElements: HTMLImageElement[]
): Promise<ImageClassifications[]> => {
  return Promise.all(imageElements.map(classifyImage));
};

export const aggregateClassifications = (
  classifications: ImageClassifications[]
): {
  corrodedPercentage: number;
  notCorrodedPercentage: number;
  boltedPercentage: number;
  weldedPercentage: number;
  damagedPercentage: number;
  notDamagedPercentage: number;
} => {
  const total = classifications.length;
  if (total === 0) {
    return {
      corrodedPercentage: 0,
      notCorrodedPercentage: 0,
      boltedPercentage: 0,
      weldedPercentage: 0,
      damagedPercentage: 0,
      notDamagedPercentage: 0,
    };
  }

  const counts = classifications.reduce(
    (acc, classification) => {
      if (classification.corrosion.className === 'Corroded') acc.corroded++;
      if (classification.corrosion.className === 'Not Corroded') acc.notCorroded++;
      if (classification.connection.className === 'Bolted') acc.bolted++;
      if (classification.connection.className === 'Welded') acc.welded++;
      if (classification.damage.className === 'Damaged') acc.damaged++;
      if (classification.damage.className === 'Not Damaged') acc.notDamaged++;
      return acc;
    },
    { corroded: 0, notCorroded: 0, bolted: 0, welded: 0, damaged: 0, notDamaged: 0 }
  );

  return {
    corrodedPercentage: (counts.corroded / total) * 100,
    notCorrodedPercentage: (counts.notCorroded / total) * 100,
    boltedPercentage: (counts.bolted / total) * 100,
    weldedPercentage: (counts.welded / total) * 100,
    damagedPercentage: (counts.damaged / total) * 100,
    notDamagedPercentage: (counts.notDamaged / total) * 100,
  };
};
