import * as tf from '@tensorflow/tfjs';

export type ModelType = 'corrosion' | 'connection' | 'damage';

interface LoadedModels {
  corrosion: tf.GraphModel | null;
  connection: tf.GraphModel | null;
  damage: tf.GraphModel | null;
}

const models: LoadedModels = {
  corrosion: null,
  connection: null,
  damage: null,
};

const MODEL_PATHS = {
  corrosion: '/models/CorrosionModel/model.json',
  connection: '/models/ConnectionModel/model.json',
  damage: '/models/DamageModel/model.json',
};

export const loadModel = async (modelType: ModelType): Promise<tf.GraphModel> => {
  if (models[modelType]) {
    return models[modelType]!;
  }

  try {
    const model = await tf.loadGraphModel(MODEL_PATHS[modelType]);
    models[modelType] = model;
    console.log(`✓ ${modelType} model loaded successfully`);
    return model;
  } catch (error) {
    console.error(`Failed to load ${modelType} model:`, error);
    throw new Error(`Failed to load ${modelType} model`);
  }
};

export const loadAllModels = async (): Promise<void> => {
  await Promise.all([
    loadModel('corrosion'),
    loadModel('connection'),
    loadModel('damage'),
  ]);
  console.log('✓ All models loaded successfully');
};

export const getModel = (modelType: ModelType): tf.GraphModel | null => {
  return models[modelType];
};

export const isModelLoaded = (modelType: ModelType): boolean => {
  return models[modelType] !== null;
};

export const areAllModelsLoaded = (): boolean => {
  return Object.values(models).every((model) => model !== null);
};
