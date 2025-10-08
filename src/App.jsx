import { useCallback, useEffect, useMemo, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const statusLabel = (performance, threshold) => (performance >= threshold ? 'Passed' : 'Not passed');

const round = (value, decimals = 1) => {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const Section = ({ id, title, description, isOpen, onToggle, children }) => (
  <section
    id={id}
    className={`rounded-3xl border border-white/40 bg-white/75 p-6 shadow-soft transition-all duration-300 ${
      isOpen ? 'ring-2 ring-brand/40' : 'hover:ring-1 hover:ring-brand/30'
    }`}
  >
    <button
      type="button"
      className="flex w-full items-start justify-between gap-4 text-left"
      onClick={onToggle}
    >
      <div>
        <h2 className="text-xl font-semibold text-brand-dark">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
        {isOpen ? '-' : '+'}
      </span>
    </button>
    {isOpen ? <div className="mt-6 space-y-6">{children}</div> : null}
  </section>
);

const SelectField = ({ id, label, options, value, onChange, required }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
    {label}
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      required={required}
    >
      <option value="" disabled>
        Please select
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const NumberField = ({ id, label, value, onChange, placeholder, min, step }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor={id}>
    {label}
    <input
      id={id}
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      min={min}
      step={step ?? 'any'}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
    />
  </label>
);

const ToggleCard = ({ active, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-all ${
      active
        ? 'border-brand bg-brand text-white shadow-soft'
        : 'border-slate-200 bg-white text-slate-700 hover:border-brand/50 hover:bg-brand-light'
    }`}
  >
    <span className="text-sm font-semibold tracking-wide">{title}</span>
    {description ? <span className="text-xs opacity-80">{description}</span> : null}
  </button>
);

const SliderField = ({ id, label, min = 0, max = 1, step = 0.01, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <div className="relative">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand/20"
      />
      <span
        className="absolute -top-8 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white shadow"
        style={{ left: `${((value - min) / (max - min || 1)) * 100}%`, transform: 'translateX(-50%)' }}
      >
        {value.toFixed(2)}
      </span>
    </div>
    <div className="flex justify-between text-xs font-medium text-slate-500">
      <span>{min.toFixed(2)}</span>
      <span>{max.toFixed(2)}</span>
    </div>
  </div>
);

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const toNumber = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInteger = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function App() {
  const [models, setModels] = useState({ corrosion: null, connection: null, damage: null });
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelError, setModelError] = useState(null);

  const [visualOpen, setVisualOpen] = useState(true);
  const [logisticOpen, setLogisticOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [lcaOpen, setLcaOpen] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState(null);

  const [noImageData, setNoImageData] = useState(false);
  const [optionalVisualData, setOptionalVisualData] = useState(false);
  const [connectionSlider, setConnectionSlider] = useState(0.5);
  const [visualInputs, setVisualInputs] = useState({
    corroded: '',
    damaged: '',
    compositeConnection: '',
    fireProtection: '',
    sufficientAmount: '',
    geometryCheck: '',
  });

  const [logisticInputs, setLogisticInputs] = useState({
    itemWeight: '',
    easyHandle: '',
    existInfrastructure: '',
    specialProtection: '',
    dismantlePhase: '',
    storageAvailability: '',
  });

  const [performanceInputs, setPerformanceInputs] = useState({
    dataQuality: '',
    constructionPeriod: '',
    maintenance: '',
    purpose: '',
    testing: '',
  });

  const [lcaMode, setLcaMode] = useState('weight');
  const [lcaInputs, setLcaInputs] = useState({
    weight: '',
    items: '',
    height: '',
    width: '',
    length: '',
    unitWeight: '',
    quantity: '',
    bulkWeight: '',
    cA1A3: '1.13',
    cC1C4: '0.018',
    cD: '-0.413',
  });
  const [lcaResult, setLcaResult] = useState(null);

  useEffect(() => {
    alert(
      'Disclaimer:\n\nReuST is currently under development and is intended for testing purposes only. As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. Use the results with caution and always consult with relevant experts for reliable assessments.'
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadModels = async () => {
      try {
        const [corrosion, connection, damage] = await Promise.all([
          tf.loadGraphModel('/models/CorrosionModel/model.json'),
          tf.loadGraphModel('/models/ConnectionModel/model.json'),
          tf.loadGraphModel('/models/DamageModel/model.json'),
        ]);
        if (mounted) {
          setModels({ corrosion, connection, damage });
          setModelError(null);
        }
      } catch (error) {
        console.error('Failed to load models', error);
        if (mounted) {
          setModelError('Unable to load the TensorFlow models. Please refresh the page or try again later.');
        }
      } finally {
        if (mounted) {
          setLoadingModels(false);
        }
      }
    };

    loadModels();
    return () => {
      mounted = false;
    };
  }, []);

  const resetImages = useCallback(() => {
    setPreviews([]);
    setClassification(null);
  }, []);

  const handleFiles = useCallback((selectedFiles) => {
    if (!selectedFiles?.length) {
      resetImages();
      return;
    }

    const fileList = Array.from(selectedFiles);
    Promise.all(
      fileList.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    )
      .then((results) => {
        setPreviews(results);
        setNoImageData(false);
        setClassification(null);
      })
      .catch((error) => {
        console.error('Failed to read files', error);
        alert('Unable to read one or more files. Please try again.');
      });
  }, [resetImages]);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (event.dataTransfer?.files?.length) {
        handleFiles(event.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const classifyImages = useCallback(async () => {
    if (!previews.length) {
      alert('Please upload images before classification.');
      return;
    }

    if (!models.corrosion || !models.connection || !models.damage) {
      alert('Models are still loading. Please wait a moment and try again.');
      return;
    }

    setIsClassifying(true);
    try {
      const counts = {
        corroded: 0,
        notCorroded: 0,
        bolted: 0,
        welded: 0,
        damaged: 0,
        notDamaged: 0,
        total: 0,
      };

      for (const src of previews) {
        const imageElement = await loadImageElement(src);
        counts.total += 1;
        const inputTensor = tf.tidy(() =>
          tf.browser
            .fromPixels(imageElement)
            .resizeBilinear([128, 128])
            .toFloat()
            .expandDims(0)
        );

        const [corrosionPrediction, connectionPrediction, damagePrediction] = tf.tidy(() => {
          const corrosionValue = models.corrosion.predict(inputTensor).dataSync()[0];
          const connectionValue = models.connection.predict(inputTensor).dataSync()[0];
          const damageValue = models.damage.predict(inputTensor).dataSync()[0];
          return [corrosionValue, connectionValue, damageValue];
        });

        if (corrosionPrediction > 0.5) {
          counts.notCorroded += 1;
        } else {
          counts.corroded += 1;
        }

        if (connectionPrediction > 0.5) {
          counts.welded += 1;
        } else {
          counts.bolted += 1;
        }

        if (damagePrediction > 0.5) {
          counts.notDamaged += 1;
        } else {
          counts.damaged += 1;
        }

        tf.dispose(inputTensor);
      }

      setClassification(counts);
      setNoImageData(false);
    } catch (error) {
      console.error('Classification failed', error);
      alert('An error occurred while classifying the images. Please try again.');
    } finally {
      setIsClassifying(false);
    }
  }, [models.corrosion, models.connection, models.damage, previews]);

  const computeInspectionScore = useCallback(() => {
    const hasImageInsights = !noImageData && classification && classification.total > 0;
    let inspectionScore = 0;

    if (hasImageInsights) {
      const total = classification.total || 1;
      inspectionScore += 1 * (classification.corroded / total);
      inspectionScore += 1 * (classification.damaged / total);
      inspectionScore += 1 * (classification.welded / total);
      inspectionScore += 3 * (classification.bolted / total);
      inspectionScore += 3 * (classification.notCorroded / total);
      inspectionScore += 3 * (classification.notDamaged / total);
    } else {
      inspectionScore += 2 * connectionSlider + 1;
      inspectionScore += 2 * toInteger(visualInputs.corroded) + 1;
      inspectionScore += 2 * toInteger(visualInputs.damaged) + 1;
    }

    if (optionalVisualData) {
      inspectionScore += 1 * toInteger(visualInputs.compositeConnection);
      inspectionScore += 1 * toInteger(visualInputs.fireProtection);
      inspectionScore += 2 * toInteger(visualInputs.sufficientAmount);
      inspectionScore += 2 * toInteger(visualInputs.geometryCheck);
      const percentage = (inspectionScore / 15) * 100;
      return { value: inspectionScore, percentage, status: statusLabel(percentage, 70) };
    }

    const percentage = (inspectionScore / 12) * 100;
    return { value: inspectionScore, percentage, status: statusLabel(percentage, 70) };
  }, [classification, connectionSlider, noImageData, optionalVisualData, visualInputs]);

  const computeLogisticScore = useCallback(() => {
    const logisticScore =
      3 * (toInteger(logisticInputs.itemWeight) / 3) +
      3 * toInteger(logisticInputs.easyHandle) +
      4 * toInteger(logisticInputs.existInfrastructure) +
      1 * toInteger(logisticInputs.specialProtection) +
      3 * toInteger(logisticInputs.dismantlePhase) +
      3 * toInteger(logisticInputs.storageAvailability);
    const percentage = (logisticScore / 17) * 100;
    return { value: logisticScore, percentage, status: statusLabel(percentage, 75) };
  }, [logisticInputs]);

  const computePerformanceScore = useCallback(() => {
    const performanceScore =
      4 * (toInteger(performanceInputs.dataQuality) / 3) +
      2 * toInteger(performanceInputs.constructionPeriod) +
      3 * toInteger(performanceInputs.maintenance) +
      3 * toInteger(performanceInputs.purpose) +
      3 * toInteger(performanceInputs.testing);
    const percentage = (performanceScore / 15) * 100;
    return { value: performanceScore, percentage, status: statusLabel(percentage, 80) };
  }, [performanceInputs]);

  const inspectionScore = useMemo(() => computeInspectionScore(), [computeInspectionScore]);
  const logisticScore = useMemo(() => computeLogisticScore(), [computeLogisticScore]);
  const performanceScore = useMemo(() => computePerformanceScore(), [computePerformanceScore]);

  const suggestion = useMemo(() => {
    const passes = [inspectionScore.status, logisticScore.status, performanceScore.status];
    const reuse = passes.every((status) => status === 'Passed');
    const overall = ((inspectionScore.percentage + logisticScore.percentage + performanceScore.percentage) / 3).toFixed(2);
    return {
      label: reuse ? 'Dismantle - Reuse' : 'Demolition - Recycle',
      tone: reuse ? 'success' : 'warning',
      overall,
    };
  }, [inspectionScore, logisticScore, performanceScore]);

  const classifySummary = useMemo(() => {
    if (!classification || !classification.total) {
      return null;
    }
    const total = classification.total;
    return `Loaded images: ${round((classification.corroded / total) * 100)}% corroded, ${round(
      (classification.notCorroded / total) * 100
    )}% not corroded, ${round((classification.bolted / total) * 100)}% bolted, ${round(
      (classification.welded / total) * 100
    )}% welded, ${round((classification.damaged / total) * 100)}% damaged, ${round(
      (classification.notDamaged / total) * 100
    )}% not damaged.`;
  }, [classification]);

  const calculateCarbon = useCallback(() => {
    let totalWeight = 0;
    if (lcaMode === 'weight') {
      totalWeight = toNumber(lcaInputs.weight) * toInteger(lcaInputs.items);
    } else if (lcaMode === 'dimensions') {
      const height = toNumber(lcaInputs.height) / 1000;
      const width = toNumber(lcaInputs.width) / 1000;
      const length = toNumber(lcaInputs.length);
      const unitWeight = toNumber(lcaInputs.unitWeight);
      const quantity = toInteger(lcaInputs.quantity);
      totalWeight = height * width * length * unitWeight * quantity;
    } else if (lcaMode === 'bulk') {
      totalWeight = toNumber(lcaInputs.bulkWeight);
    }

    if (totalWeight <= 0) {
      alert('Total weight is zero. Please provide valid input values.');
      return;
    }

    const product = totalWeight * toNumber(lcaInputs.cA1A3, 1.13);
    const endOfLife = totalWeight * toNumber(lcaInputs.cC1C4, 0.018);
    const recovery = totalWeight * toNumber(lcaInputs.cD, -0.413);

    setLcaResult({
      totalWeight: totalWeight.toFixed(1),
      product: product.toFixed(1),
      endOfLife: endOfLife.toFixed(1),
      recovery: recovery.toFixed(1),
    });
  }, [lcaInputs, lcaMode]);

  const overallTone = suggestion.tone === 'success' ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-900';

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand to-brand-light pb-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 text-slate-900">
        <header className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="ReuST logo" className="h-16 w-auto" />
                <h1 className="text-4xl font-bold tracking-tight text-brand-dark">ReuST</h1>
              </div>
              <p className="mt-4 max-w-3xl text-base text-slate-700">
                A decision making framework for efficient end-of-life scenarios of structural steel elements. Evaluate visual
                inspection data, logistic feasibility, structural performance, and life cycle impacts in one cohesive workspace.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-sm text-slate-600">
              <span className="font-semibold uppercase tracking-wider text-brand-dark">Contact</span>
              <a href="mailto:alper.kanyilmaz@polimi.it" className="font-medium text-brand hover:underline">
                alper.kanyilmaz@polimi.it
              </a>
            </div>
          </div>
          {loadingModels ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" aria-hidden="true" />
              Loading machine learning models. This may take a few seconds…
            </div>
          ) : null}
          {modelError ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{modelError}</div>
          ) : null}
        </header>

        <Section
          id="visual-inspection"
          title="Structural Visual Inspection"
          description="Upload images to leverage the convolutional neural network or switch to manual scoring if images are unavailable."
          isOpen={visualOpen}
          onToggle={() => setVisualOpen((value) => !value)}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                    checked={noImageData}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setNoImageData(checked);
                      if (checked) {
                        setPreviews([]);
                        setClassification(null);
                      }
                    }}
                    disabled={previews.length > 0}
                  />
                  Don't have image files?
                </label>
                <p className="mt-2 text-sm text-slate-500">
                  Enable this option to provide manual inspection data instead of image-based classification.
                </p>
              </div>

              {!noImageData ? (
                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                    isDragging ? 'border-brand bg-brand-light/60' : 'border-slate-300 bg-white'
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => document.getElementById('image-input')?.click()}
                >
                  <img
                    src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/upload-512.png"
                    alt="Upload"
                    className="h-16 w-16 opacity-70"
                  />
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-brand">Click to upload</span> or drag and drop structural element images.
                  </div>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => handleFiles(event.target.files)}
                    className="hidden"
                  />
                  {previews.length ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        resetImages();
                      }}
                      className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Clear images
                    </button>
                  ) : null}
                </div>
              ) : null}

              {previews.length ? (
                <div className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2">
                  {previews.map((src, index) => (
                    <img key={index} src={src} alt={`Uploaded preview ${index + 1}`} className="h-20 w-full rounded-xl object-cover" />
                  ))}
                </div>
              ) : null}

              {!noImageData ? (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={classifyImages}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40"
                    disabled={isClassifying}
                  >
                    {isClassifying ? (
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : null}
                    {isClassifying ? 'Classifying…' : 'Classify and Decide'}
                  </button>
                  {classification ? (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand">{classification.total} image(s) analysed</span>
                  ) : null}
                </div>
              ) : null}

              {classifySummary ? (
                <p className="rounded-2xl border border-brand/30 bg-brand-light/60 p-4 text-sm text-brand-dark">{classifySummary}</p>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-brand-dark">
                  {noImageData ? 'Provide inspection scores' : 'Manual adjustments'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {noImageData
                    ? 'Enter your qualitative assessment to estimate the visual inspection score.'
                    : 'Fine tune inspection outcomes if additional context is available.'}
                </p>
                <div className="mt-4 space-y-4">
                  <SliderField
                    id="connection-type"
                    label="Connection type [fully welded - fully bolted]?"
                    value={connectionSlider}
                    onChange={setConnectionSlider}
                  />
                  <SelectField
                    id="corroded"
                    label="Is the element corroded?"
                    value={visualInputs.corroded}
                    onChange={(value) => setVisualInputs((state) => ({ ...state, corroded: value }))}
                    options={[
                      { value: '0', label: 'Yes' },
                      { value: '1', label: 'No' },
                    ]}
                  />
                  <SelectField
                    id="damaged"
                    label="Is the element damaged or distorted?"
                    value={visualInputs.damaged}
                    onChange={(value) => setVisualInputs((state) => ({ ...state, damaged: value }))}
                    options={[
                      { value: '0', label: 'Yes' },
                      { value: '1', label: 'No' },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                    checked={optionalVisualData}
                    onChange={(event) => setOptionalVisualData(event.target.checked)}
                  />
                  Do you have additional information on the building?
                </label>
                {optionalVisualData ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <SelectField
                      id="composite-connection"
                      label="Are there steel-concrete composite connections?"
                      value={visualInputs.compositeConnection}
                      onChange={(value) => setVisualInputs((state) => ({ ...state, compositeConnection: value }))}
                      options={[
                        { value: '0', label: 'Yes' },
                        { value: '1', label: 'No' },
                      ]}
                    />
                    <SelectField
                      id="fire-protection"
                      label="Is there fire protection on the element?"
                      value={visualInputs.fireProtection}
                      onChange={(value) => setVisualInputs((state) => ({ ...state, fireProtection: value }))}
                      options={[
                        { value: '1', label: 'Yes' },
                        { value: '0', label: 'No' },
                      ]}
                    />
                    <SelectField
                      id="sufficient-amount"
                      label="Availability of sufficient amount of potential reusable elements?"
                      value={visualInputs.sufficientAmount}
                      onChange={(value) => setVisualInputs((state) => ({ ...state, sufficientAmount: value }))}
                      options={[
                        { value: '1', label: 'Yes' },
                        { value: '0', label: 'No' },
                      ]}
                    />
                    <SelectField
                      id="geometry-check"
                      label="Does the element pass standard geometric check without modification?"
                      value={visualInputs.geometryCheck}
                      onChange={(value) => setVisualInputs((state) => ({ ...state, geometryCheck: value }))}
                      options={[
                        { value: '1', label: 'Yes' },
                        { value: '0', label: 'No' },
                      ]}
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Enable the toggle above to provide additional building insights.</p>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="logistic-feasibility"
          title="Logistic Feasibility"
          description="Assess the practical considerations for dismantling, handling, and storing structural elements."
          isOpen={logisticOpen}
          onToggle={() => setLogisticOpen((value) => !value)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              id="item-weight"
              label="Weight of the structural element"
              value={logisticInputs.itemWeight}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, itemWeight: value }))}
              options={[
                { value: '3', label: 'Very light [< 0.1 ton]' },
                { value: '2', label: 'Light [0.1 - 0.2 ton]' },
                { value: '1', label: 'Heavy [0.2 - 0.5 ton]' },
                { value: '0', label: 'Very heavy [> 0.5 ton]' },
              ]}
            />
            <SelectField
              id="easy-handle"
              label="Ease to handle, transport, store, and process?"
              value={logisticInputs.easyHandle}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, easyHandle: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
            <SelectField
              id="exist-infrastructure"
              label="Availability of dismantle-sort-repair infrastructure"
              value={logisticInputs.existInfrastructure}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, existInfrastructure: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
            <SelectField
              id="special-protection"
              label="Special protection is needed for transportation?"
              value={logisticInputs.specialProtection}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, specialProtection: value }))}
              options={[
                { value: '0', label: 'Yes' },
                { value: '1', label: 'No' },
              ]}
            />
            <SelectField
              id="dismantle-phase"
              label="Dismantle phase is compatible with demolition work?"
              value={logisticInputs.dismantlePhase}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, dismantlePhase: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
            <SelectField
              id="storage-availability"
              label="Availability of storage"
              value={logisticInputs.storageAvailability}
              onChange={(value) => setLogisticInputs((state) => ({ ...state, storageAvailability: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
          </div>
        </Section>

        <Section
          id="structural-performance"
          title="Structural Performance"
          description="Evaluate the documentation, maintenance, and adaptability of the structural elements."
          isOpen={performanceOpen}
          onToggle={() => setPerformanceOpen((value) => !value)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              id="data-quality"
              label="Quality of available data?"
              value={performanceInputs.dataQuality}
              onChange={(value) => setPerformanceInputs((state) => ({ ...state, dataQuality: value }))}
              options={[
                { value: '0', label: 'No documentation' },
                { value: '1', label: 'Only drawing available' },
                { value: '2', label: 'Drawings and calculation report available' },
                { value: '3', label: 'All detailed documentation available' },
              ]}
            />
            <SelectField
              id="construction-period"
              label="Is the building designed and constructed after year 2005?"
              value={performanceInputs.constructionPeriod}
              onChange={(value) => setPerformanceInputs((state) => ({ ...state, constructionPeriod: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
            <SelectField
              id="maintenance"
              label="Did the structure have maintenance before?"
              value={performanceInputs.maintenance}
              onChange={(value) => setPerformanceInputs((state) => ({ ...state, maintenance: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
            <SelectField
              id="purpose"
              label="Is the structural element unique for its purpose?"
              value={performanceInputs.purpose}
              onChange={(value) => setPerformanceInputs((state) => ({ ...state, purpose: value }))}
              options={[
                { value: '0', label: 'Yes' },
                { value: '1', label: 'No' },
              ]}
            />
            <SelectField
              id="testing"
              label="Is it possible to conduct sample testing?"
              value={performanceInputs.testing}
              onChange={(value) => setPerformanceInputs((state) => ({ ...state, testing: value }))}
              options={[
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
              ]}
            />
          </div>
        </Section>

        <Section
          id="life-cycle"
          title="Life Cycle Assessment (LCA)"
          description="Estimate embodied carbon through simplified cradle-to-cradle calculations."
          isOpen={lcaOpen}
          onToggle={() => setLcaOpen((value) => !value)}
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Select how you prefer to input the weight of the elements.</p>
              <div className="grid gap-3 md:grid-cols-3">
                <ToggleCard
                  active={lcaMode === 'weight'}
                  title="Weight"
                  description="Weight × quantity"
                  onClick={() => setLcaMode('weight')}
                />
                <ToggleCard
                  active={lcaMode === 'dimensions'}
                  title="Dimensions"
                  description="Volume × unit weight"
                  onClick={() => setLcaMode('dimensions')}
                />
                <ToggleCard
                  active={lcaMode === 'bulk'}
                  title="Bulk weight"
                  description="Direct total mass"
                  onClick={() => setLcaMode('bulk')}
                />
              </div>

              {lcaMode === 'weight' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberField
                    id="lca-weight"
                    label="Weight of single element [kg]"
                    value={lcaInputs.weight}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, weight: value }))}
                    placeholder="150"
                    min="0"
                  />
                  <NumberField
                    id="lca-items"
                    label="Number of items"
                    value={lcaInputs.items}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, items: value }))}
                    placeholder="50"
                    min="0"
                  />
                </div>
              ) : null}

              {lcaMode === 'dimensions' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberField
                    id="lca-height"
                    label="Height of the element [mm]"
                    value={lcaInputs.height}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, height: value }))}
                    placeholder="500"
                    min="0"
                  />
                  <NumberField
                    id="lca-width"
                    label="Width of the element [mm]"
                    value={lcaInputs.width}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, width: value }))}
                    placeholder="250"
                    min="0"
                  />
                  <NumberField
                    id="lca-length"
                    label="Length of the element [m]"
                    value={lcaInputs.length}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, length: value }))}
                    placeholder="12"
                    min="0"
                  />
                  <NumberField
                    id="lca-unit-weight"
                    label="Material unit weight [kg/m³]"
                    value={lcaInputs.unitWeight}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, unitWeight: value }))}
                    placeholder="7850"
                    min="0"
                  />
                  <NumberField
                    id="lca-quantity"
                    label="Number of items"
                    value={lcaInputs.quantity}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, quantity: value }))}
                    placeholder="12"
                    min="0"
                  />
                </div>
              ) : null}

              {lcaMode === 'bulk' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <NumberField
                    id="lca-bulk"
                    label="Bulk weight of the material [kg]"
                    value={lcaInputs.bulkWeight}
                    onChange={(value) => setLcaInputs((state) => ({ ...state, bulkWeight: value }))}
                    placeholder="1500"
                    min="0"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <NumberField
                  id="lca-ca1a3"
                  label="Product stage A1-A3 coefficient [kgCO₂e]"
                  value={lcaInputs.cA1A3}
                  onChange={(value) => setLcaInputs((state) => ({ ...state, cA1A3: value }))}
                  step="0.01"
                />
                <NumberField
                  id="lca-cc1c4"
                  label="End of life stage C1-C4 coefficient [kgCO₂e]"
                  value={lcaInputs.cC1C4}
                  onChange={(value) => setLcaInputs((state) => ({ ...state, cC1C4: value }))}
                  step="0.01"
                />
                <NumberField
                  id="lca-cd"
                  label="Reuse/recycle stage D coefficient [kgCO₂e]"
                  value={lcaInputs.cD}
                  onChange={(value) => setLcaInputs((state) => ({ ...state, cD: value }))}
                  step="0.01"
                />
              </div>

              <button
                type="button"
                onClick={calculateCarbon}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                Compute the embodied carbon
              </button>

              {lcaResult ? (
                <div className="rounded-2xl border border-brand/30 bg-brand-light/60 p-5 text-sm text-brand-dark">
                  <p>
                    Total weight of structural element: <strong>{lcaResult.totalWeight} kg</strong>
                  </p>
                  <p>
                    Product stage A1-A3: <strong>{lcaResult.product} kgCO₂e</strong>
                  </p>
                  <p>
                    End of life stage C1-C4: <strong>{lcaResult.endOfLife} kgCO₂e</strong>
                  </p>
                  <p>
                    Reuse, recycle and recovery stage D: <strong>{lcaResult.recovery} kgCO₂e</strong>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Section>

        <section className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-soft">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-brand-dark">Suggestion for the End-of-Life Scenario</h2>
            {classifySummary ? <p className="text-sm text-slate-600">{classifySummary}</p> : null}
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Structural visual inspection: {inspectionScore.percentage.toFixed(2)}% | {inspectionScore.status}</li>
              <li>Logistic feasibility: {logisticScore.percentage.toFixed(2)}% | {logisticScore.status}</li>
              <li>Structural performance: {performanceScore.percentage.toFixed(2)}% | {performanceScore.status}</li>
            </ul>
            <div className={`mt-4 flex items-center justify-between rounded-2xl px-6 py-4 text-base font-semibold ${overallTone}`}>
              <span>Based on the input evaluation, the efficient end-of-life scenario is:</span>
              <span>{suggestion.label}</span>
            </div>
            <p className="text-center text-sm font-semibold text-brand-dark">The overall reusability performance {suggestion.overall}%</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
