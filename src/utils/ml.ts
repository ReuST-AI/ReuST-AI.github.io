/**
 * Machine Learning utilities
 * Functions for loading TensorFlow.js models and image classification
 */

import * as tf from '@tensorflow/tfjs';
import type { ClassificationResult, ImageClassificationResults } from '@/types';
import { MODEL_PATHS, CLASS_NAMES, IMAGE_CONFIG } from '@/constants';

// ============================================================================
// Model Loading
// ============================================================================

/**
 * Load a TensorFlow.js GraphModel from the specified path
 *
 * @param modelPath - Path to model.json file
 * @returns Promise resolving to loaded GraphModel
 * @throws Error if model fails to load
 */
export async function loadModel(modelPath: string): Promise<tf.GraphModel> {
  try {
    const model = await tf.loadGraphModel(modelPath);
    console.log(`Model loaded successfully: ${modelPath}`);
    return model;
  } catch (error) {
    console.error(`Failed to load model from ${modelPath}:`, error);
    throw new Error(`Failed to load model: ${modelPath}`);
  }
}

/**
 * Load all required ML models for the application
 *
 * @returns Promise resolving to object containing all models
 */
export async function loadAllModels() {
  try {
    const [corrosionModel, connectionModel, damageModel] = await Promise.all([
      loadModel(MODEL_PATHS.corrosion),
      loadModel(MODEL_PATHS.connection),
      loadModel(MODEL_PATHS.damage),
    ]);

    console.log('All models loaded successfully');

    return {
      corrosion: corrosionModel,
      connection: connectionModel,
      damage: damageModel,
    };
  } catch (error) {
    console.error('Failed to load one or more models:', error);
    throw error;
  }
}

// ============================================================================
// Image Preprocessing
// ============================================================================

/**
 * Preprocess image for model input
 * Converts HTMLImageElement to tensor and resizes to model input size
 *
 * @param image - HTMLImageElement to preprocess
 * @returns Preprocessed tensor ready for model input [1, 128, 128, 3]
 */
export function preprocessImage(image: HTMLImageElement): tf.Tensor4D {
  // Convert image to tensor
  let tensor = tf.browser.fromPixels(image);

  // Resize to model input size (128x128)
  tensor = tf.image.resizeBilinear(tensor, [IMAGE_CONFIG.size, IMAGE_CONFIG.size]);

  // Convert to float
  tensor = tensor.toFloat();

  // Add batch dimension and reshape to [1, 128, 128, 3]
  const reshaped = tensor.reshape([1, IMAGE_CONFIG.size, IMAGE_CONFIG.size, 3]) as tf.Tensor4D;

  // Dispose intermediate tensor to free memory
  tensor.dispose();

  return reshaped;
}

// ============================================================================
// Image Classification
// ============================================================================

/**
 * Classify a single image using the specified model
 *
 * @param model - Loaded TensorFlow.js GraphModel
 * @param image - HTMLImageElement to classify
 * @param classNames - Array of class names for this model
 * @returns Classification result with class name and confidence
 */
export async function classifyImage(
  model: tf.GraphModel,
  image: HTMLImageElement,
  classNames: readonly string[]
): Promise<ClassificationResult> {
  // Preprocess image
  const tensor = preprocessImage(image);

  try {
    // Run prediction
    const prediction = model.predict(tensor) as tf.Tensor;
    const predictionData = await prediction.data();

    // Get confidence score (assuming binary classification)
    const confidence = predictionData[0];
    const classIndex = confidence > 0.5 ? 1 : 0;
    const className = classNames[classIndex];

    // Cleanup tensors
    tensor.dispose();
    prediction.dispose();

    return {
      className,
      confidence,
    };
  } catch (error) {
    // Cleanup on error
    tensor.dispose();
    throw error;
  }
}

/**
 * Classify multiple images across all three models
 *
 * @param images - Array of HTMLImageElements to classify
 * @param models - Object containing all loaded models
 * @returns Promise resolving to aggregated classification results
 */
export async function classifyImages(
  images: HTMLImageElement[],
  models: {
    corrosion: tf.GraphModel;
    connection: tf.GraphModel;
    damage: tf.GraphModel;
  }
): Promise<ImageClassificationResults> {
  const results: ImageClassificationResults = {
    totalImages: images.length,
    corroded: 0,
    notCorroded: 0,
    bolted: 0,
    welded: 0,
    damaged: 0,
    notDamaged: 0,
  };

  // Process all images
  const promises = images.flatMap((image) => [
    classifyImage(models.corrosion, image, CLASS_NAMES.corrosion).then((result) => {
      if (result.className === 'Corroded') {
        results.corroded++;
      } else {
        results.notCorroded++;
      }
    }),
    classifyImage(models.connection, image, CLASS_NAMES.connection).then((result) => {
      if (result.className === 'Bolted') {
        results.bolted++;
      } else {
        results.welded++;
      }
    }),
    classifyImage(models.damage, image, CLASS_NAMES.damage).then((result) => {
      if (result.className === 'Damaged') {
        results.damaged++;
      } else {
        results.notDamaged++;
      }
    }),
  ]);

  await Promise.all(promises);

  return results;
}

// ============================================================================
// Image Loading
// ============================================================================

/**
 * Load image file as HTMLImageElement
 *
 * @param file - File object to load
 * @returns Promise resolving to HTMLImageElement
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${file.name}`));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Load multiple image files as HTMLImageElements
 *
 * @param files - Array of File objects
 * @returns Promise resolving to array of HTMLImageElements
 */
export async function loadImagesFromFiles(files: File[]): Promise<HTMLImageElement[]> {
  return Promise.all(files.map(loadImageFromFile));
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate if file is an image
 *
 * @param file - File to validate
 * @returns True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Filter array of files to only include images
 *
 * @param files - Array of files to filter
 * @returns Array containing only image files
 */
export function filterImageFiles(files: File[]): File[] {
  return files.filter(isImageFile);
}
