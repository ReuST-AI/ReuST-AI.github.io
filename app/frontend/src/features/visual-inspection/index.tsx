import { useState, useEffect } from 'react';
import { Accordion } from '@/shared/components/Accordion';
import { FileUpload } from '@/shared/components/FileUpload';
import { Button } from '@/shared/components/Button';
import { Checkbox } from '@/shared/components/Checkbox';
import { Select } from '@/shared/components/Select';
import { Slider } from '@/shared/components/Slider';
import { Loader } from '@/shared/components/Loader';
import { useAppStore } from '@/shared/store/useAppStore';
import { loadAllModels, areAllModelsLoaded } from './services/modelLoader';
import { classifyMultipleImages } from './services/imageClassifier';

export const VisualInspectionFeature = () => {
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageElements, setImageElements] = useState<HTMLImageElement[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showOptionalData, setShowOptionalData] = useState(false);

  const {
    visualInspection,
    setVisualInspectionData,
    clearImages,
    isClassifying,
    setIsClassifying,
    setEvaluationResult,
    logistic,
    structuralPerformance,
  } = useAppStore();

  useEffect(() => {
    const initModels = async () => {
      if (!areAllModelsLoaded()) {
        try {
          await loadAllModels();
          setModelsLoaded(true);
        } catch (error) {
          console.error('Failed to load models:', error);
        }
      } else {
        setModelsLoaded(true);
      }
    };
    initModels();
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);

    const loadImages = async () => {
      const elements = await Promise.all(
        urls.map(
          (url) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = url;
            })
        )
      );
      setImageElements(elements);
    };

    loadImages();
    setVisualInspectionData({ images: files, useManualInput: false });
  };

  const handleClassify = async () => {
    if (imageElements.length === 0) return;

    setIsClassifying(true);
    try {
      const classifications = await classifyMultipleImages(imageElements);
      useAppStore.getState().visualInspection.classificationResults = classifications;

      const { calculateOverallEvaluation } = await import('@/shared/services/decisionEngine');
      const result = calculateOverallEvaluation(
        visualInspection,
        logistic,
        structuralPerformance,
        classifications
      );
      setEvaluationResult(result);
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <Accordion
      title="Structural Visual Inspection"
      defaultOpen
      description="Upload images for automated CNN-based classification or enter data manually"
    >
      <div className="space-y-6">
        {!visualInspection.useManualInput && (
          <>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              disabled={visualInspection.useManualInput}
            />

            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </>
        )}

        <Checkbox
          label="Don't have image files? Enter data manually"
          checked={visualInspection.useManualInput}
          onChange={(e) => {
            setVisualInspectionData({ useManualInput: e.target.checked });
            if (e.target.checked) {
              clearImages();
              setImagePreviewUrls([]);
              setImageElements([]);
            }
          }}
          disabled={imagePreviewUrls.length > 0}
        />

        {visualInspection.useManualInput && (
          <div className="space-y-4">
            <Slider
              label="Connection type (fully welded → fully bolted)"
              min={0}
              max={1}
              step={0.01}
              value={visualInspection.connectionType}
              onChange={(value) => setVisualInspectionData({ connectionType: value })}
            />

            <Select
              label="Is the element corroded?"
              value={
                visualInspection.corroded === null
                  ? ''
                  : visualInspection.corroded
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  corroded: e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <Select
              label="Is the element damaged or distorted?"
              value={
                visualInspection.damaged === null
                  ? ''
                  : visualInspection.damaged
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  damaged: e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </div>
        )}

        <Checkbox
          label="Do you have additional information on the building?"
          checked={showOptionalData}
          onChange={(e) => setShowOptionalData(e.target.checked)}
        />

        {showOptionalData && (
          <div className="space-y-4">
            <Select
              label="Are there steel-concrete composite connections?"
              value={
                visualInspection.compositeConnection === null
                  ? ''
                  : visualInspection.compositeConnection
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  compositeConnection:
                    e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <Select
              label="Is there fire protection on the element?"
              value={
                visualInspection.fireProtection === null
                  ? ''
                  : visualInspection.fireProtection
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  fireProtection:
                    e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <Select
              label="Availability of sufficient amount of potential reusable elements?"
              value={
                visualInspection.sufficientAmount === null
                  ? ''
                  : visualInspection.sufficientAmount
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  sufficientAmount:
                    e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />

            <Select
              label="Does the element pass standard geometric check without modification?"
              value={
                visualInspection.geometryCheck === null
                  ? ''
                  : visualInspection.geometryCheck
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setVisualInspectionData({
                  geometryCheck:
                    e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
                })
              }
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button
            onClick={handleClassify}
            disabled={
              isClassifying ||
              !modelsLoaded ||
              (imageElements.length === 0 && !visualInspection.useManualInput)
            }
          >
            {isClassifying ? 'Classifying...' : 'Classify and Decide'}
          </Button>
          {isClassifying && <Loader />}
        </div>

        {!modelsLoaded && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Loading ML models... Please wait.
          </p>
        )}
      </div>
    </Accordion>
  );
};
