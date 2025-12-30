/**
 * Custom hook for image classification
 * Handles image upload, classification, and result aggregation
 */

import { useCallback } from 'react';
import { useAppStore } from '@/store';
import { classifyImages, loadImagesFromFiles, filterImageFiles } from '@/utils/ml';
import type { ImageData } from '@/types';

/**
 * Hook for image classification functionality
 * Provides functions to handle file uploads and classification
 *
 * @returns Object containing classification functions and state
 */
export function useImageClassification() {
  const {
    images,
    models,
    modelsLoaded,
    setImages,
    removeImage,
    clearImages,
    setClassificationResults,
    setIsClassifying,
    setShowManualInput,
  } = useAppStore();

  /**
   * Handle file selection/drop
   * Creates ImageData objects with previews
   */
  const handleFileSelection = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = filterImageFiles(fileArray);

      if (imageFiles.length === 0) {
        console.warn('No valid image files selected');
        return;
      }

      const newImages: ImageData[] = imageFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      setImages(newImages);
      setShowManualInput(false);

      console.log(`Loaded ${newImages.length} images`);
    },
    [setImages, setShowManualInput]
  );

  /**
   * Classify all uploaded images using ML models
   */
  const classifyAllImages = useCallback(async () => {
    if (!modelsLoaded || !models.corrosion || !models.connection || !models.damage) {
      console.error('Models not loaded yet');
      alert('Please wait for models to load before classifying images');
      return;
    }

    if (images.length === 0) {
      console.warn('No images to classify');
      return;
    }

    try {
      setIsClassifying(true);

      // Load all images as HTMLImageElements
      console.log('Loading images for classification...');
      const imageElements = await loadImagesFromFiles(images.map((img) => img.file));

      // Classify all images
      console.log('Classifying images...');
      const results = await classifyImages(imageElements, {
        corrosion: models.corrosion,
        connection: models.connection,
        damage: models.damage,
      });

      console.log('Classification complete:', results);

      // Store results
      setClassificationResults(results);
    } catch (error) {
      console.error('Classification failed:', error);
      alert('Failed to classify images. Please try again.');
    } finally {
      setIsClassifying(false);
    }
  }, [images, models, modelsLoaded, setClassificationResults, setIsClassifying]);

  /**
   * Remove a specific image
   */
  const handleRemoveImage = useCallback(
    (id: string) => {
      const image = images.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      removeImage(id);
    },
    [images, removeImage]
  );

  /**
   * Clear all images
   */
  const handleClearImages = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview);
    });
    clearImages();
  }, [images, clearImages]);

  return {
    images,
    handleFileSelection,
    classifyAllImages,
    handleRemoveImage,
    handleClearImages,
  };
}
