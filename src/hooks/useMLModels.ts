/**
 * Custom hook for loading and managing ML models
 * Handles TensorFlow.js model loading and lifecycle
 */

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { loadAllModels } from '@/utils/ml';

/**
 * Hook to load ML models on component mount
 * Models are loaded once and stored in global state
 *
 * @returns Object containing models loaded status and models
 */
export function useMLModels() {
  const { models, modelsLoaded, setModels, setModelsLoaded } = useAppStore();

  useEffect(() => {
    // Only load models once
    if (modelsLoaded || models.corrosion) {
      return;
    }

    let cancelled = false;

    async function loadModels() {
      try {
        console.log('Loading ML models...');
        const loadedModels = await loadAllModels();

        if (!cancelled) {
          setModels(loadedModels);
          setModelsLoaded(true);
          console.log('All models loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load models:', error);
        if (!cancelled) {
          setModelsLoaded(false);
        }
      }
    }

    loadModels();

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [models, modelsLoaded, setModels, setModelsLoaded]);

  return {
    models,
    modelsLoaded,
  };
}
