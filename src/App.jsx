import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const statusLabel = (performance, threshold) => (performance >= threshold ? 'Passed' : 'Not passed');

const round = (value, decimals = 1) => {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const Section = ({
  id,
  title,
  description,
  isOpen = true,
  onToggle,
  children,
  variant = 'default',
  meta,
  className = '',
}) => {
  const collapsible = typeof onToggle === 'function';
  const containerClasses =
    variant === 'compact'
      ? 'rounded-2xl border border-white/40 bg-white/65 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl'
      : 'rounded-3xl border border-white/50 bg-white/70 p-8 shadow-xl shadow-slate-900/10 backdrop-blur-2xl';

  return (
    <section id={id} className={`relative overflow-hidden transition-all ${containerClasses} ${className}`}>
      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Assessment Module</span>
            <h2 className="text-2xl font-display font-semibold text-slate-900">{title}</h2>
            {description ? <p className="text-sm text-slate-600">{description}</p> : null}
          </div>
          <div className="flex items-start gap-3">
            {meta}
            {collapsible ? (
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`${id}-content`}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                  isOpen
                    ? 'border-slate-200 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
        {!collapsible || isOpen ? (
          <div id={`${id}-content`} className="space-y-6">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
};

const SelectField = ({ id, label, options, value, onChange, required }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600" htmlFor={id}>
    {label}
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-white/50 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-inner shadow-white/20 backdrop-blur focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
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
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600" htmlFor={id}>
    {label}
    <input
      id={id}
      type="number"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      min={min}
      step={step ?? 'any'}
      className="w-full rounded-xl border border-white/50 bg-white/60 px-4 py-2 text-sm font-medium text-slate-800 shadow-inner shadow-white/20 backdrop-blur focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
    />
  </label>
);

const ToggleCard = ({ active, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-all ${
      active
        ? 'border-brand bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft'
        : 'border-white/60 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:shadow-md'
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

const getStatusBadgeClasses = (status) =>
  status === 'Passed'
    ? 'border border-emerald-200 bg-emerald-50 text-emerald-600'
    : 'border border-amber-200 bg-amber-50 text-amber-600';

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(status)}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

const StepItem = ({ title, status, description }) => {
  const stepStyles = {
    done: {
      border: 'border-emerald-100',
      background: 'bg-emerald-50/80',
      iconBg: 'bg-emerald-500 text-white',
      iconPath: 'M5 13l4 4L19 7',
    },
    'in-progress': {
      border: 'border-sky-100',
      background: 'bg-sky-50/70',
      iconBg: 'bg-sky-500 text-white',
      iconPath: 'M12 6v6l3 3',
    },
    pending: {
      border: 'border-slate-200',
      background: 'bg-white',
      iconBg: 'bg-slate-100 text-slate-500',
      iconPath: 'M12 6v6l3 3',
    },
    skipped: {
      border: 'border-slate-200',
      background: 'bg-slate-50',
      iconBg: 'bg-slate-200 text-slate-500',
      iconPath: 'M6 6l12 12M6 18L18 6',
    },
  };

  const { border, background, iconBg, iconPath } = stepStyles[status] ?? stepStyles.pending;

  return (
    <div className={`flex items-start gap-3 rounded-xl border ${border} ${background} p-3`}>
      <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};

const RecommendationCard = ({ suggestion, totalImages, inspectionScore, logisticScore, performanceScore }) => {
  const overallValue = Number.parseFloat(suggestion.overall);
  const metrics = [
    {
      id: 'inspection',
      label: 'Inspection score',
      value: inspectionScore.percentage,
      status: inspectionScore.status,
    },
    {
      id: 'logistic',
      label: 'Logistic feasibility',
      value: logisticScore.percentage,
      status: logisticScore.status,
    },
    {
      id: 'performance',
      label: 'Structural performance',
      value: performanceScore.percentage,
      status: performanceScore.status,
    },
  ];

  return (
    <article className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/40 bg-white/55 p-8 shadow-xl shadow-slate-900/10 backdrop-blur-2xl">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          suggestion.tone === 'success'
            ? 'from-emerald-500/20 via-emerald-400/10 to-emerald-500/5'
            : 'from-amber-500/20 via-amber-400/10 to-amber-500/5'
        } opacity-80`}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">End-of-life readiness</span>
              <h3 className="text-2xl font-display font-semibold text-slate-900">{suggestion.label}</h3>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                suggestion.tone === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700'
                  : 'bg-amber-500/10 text-amber-700'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {suggestion.tone === 'success' ? 'High readiness' : 'Needs caution'}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Composite readiness based on structural inspection, logistics, and performance intelligence.
          </p>
        </div>
        <div className="relative rounded-3xl border border-white/40 bg-white/60 p-6 shadow-inner shadow-white/20 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Overall readiness</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-display font-semibold text-slate-900">{overallValue.toFixed(1)}%</p>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Composite score</p>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Weighted perspective of all active assessment modules.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-white/40 bg-white/65 p-4 shadow-sm shadow-white/30 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{metric.label}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-2xl font-display font-semibold text-slate-900">{metric.value.toFixed(1)}%</p>
                <StatusBadge status={metric.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="relative text-xs font-medium text-slate-500">
        {totalImages
          ? `${totalImages} classified image${totalImages === 1 ? '' : 's'} enriched this insight.`
          : 'Manual scoring currently informs this insight.'}
      </p>
    </article>
  );
};

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
  const [logisticOpen, setLogisticOpen] = useState(true);
  const [performanceOpen, setPerformanceOpen] = useState(true);
  const [lcaOpen, setLcaOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('assessment');

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
  const disclaimerShownRef = useRef(false);

  useEffect(() => {
    if (disclaimerShownRef.current) return;
    disclaimerShownRef.current = true;
    const storageKey = 'reust-disclaimer-shown';
    if (typeof window === 'undefined') return;
    const hasSeenDisclaimer = sessionStorage.getItem(storageKey);
    if (!hasSeenDisclaimer) {
      alert(
        'Disclaimer:\n\nReuST is currently under development and is intended for testing purposes only. As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. Use the results with caution and always consult with relevant experts for reliable assessments.'
      );
      sessionStorage.setItem(storageKey, 'true');
    }
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

  const classificationBreakdown = useMemo(() => {
    if (!classification || !classification.total) {
      return null;
    }

    const total = classification.total || 1;
    return [
      {
        id: 'not-corroded',
        label: 'Not corroded',
        value: round((classification.notCorroded / total) * 100),
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-600',
      },
      {
        id: 'corroded',
        label: 'Corroded',
        value: round((classification.corroded / total) * 100),
        tone: 'border-amber-200 bg-amber-50 text-amber-600',
      },
      {
        id: 'bolted',
        label: 'Bolted',
        value: round((classification.bolted / total) * 100),
        tone: 'border-sky-200 bg-sky-50 text-sky-600',
      },
      {
        id: 'welded',
        label: 'Welded',
        value: round((classification.welded / total) * 100),
        tone: 'border-indigo-200 bg-indigo-50 text-indigo-600',
      },
      {
        id: 'not-damaged',
        label: 'Not damaged',
        value: round((classification.notDamaged / total) * 100),
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-600',
      },
      {
        id: 'damaged',
        label: 'Damaged',
        value: round((classification.damaged / total) * 100),
        tone: 'border-rose-200 bg-rose-50 text-rose-600',
      },
    ];
  }, [classification]);

  const hasEvidence = previews.length > 0 || noImageData;

  const visualSteps = useMemo(() => {
    const steps = [];
    steps.push({
      id: 'evidence',
      title: 'Evidence captured',
      status: hasEvidence ? 'done' : 'pending',
      description: hasEvidence
        ? noImageData
          ? 'Manual inspection inputs enabled.'
          : `${previews.length} image${previews.length === 1 ? '' : 's'} ready for review.`
        : 'Upload imagery or switch to manual scoring.',
    });

    steps.push({
      id: 'classification',
      title: noImageData ? 'Manual scoring in progress' : 'AI classification',
      status: noImageData ? 'skipped' : isClassifying ? 'in-progress' : classification ? 'done' : 'pending',
      description: noImageData
        ? 'Image classification skipped because manual scoring is active.'
        : classification
        ? 'Latest run completed successfully.'
        : 'Run classification to unlock decision guidance.',
    });

    steps.push({
      id: 'decision',
      title: 'Decision summary prepared',
      status: classification || noImageData ? 'done' : 'pending',
      description:
        classification || noImageData
          ? `${suggestion.label} · Overall ${suggestion.overall}%`
          : 'Decision pending classification results.',
    });

    return steps;
  }, [classification, hasEvidence, isClassifying, noImageData, previews.length, suggestion.label, suggestion.overall]);

  const tabSliderStyle = useMemo(
    () => ({
      transform: activeTab === 'assessment' ? 'translateX(0%)' : 'translateX(100%)',
    }),
    [activeTab]
  );

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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(24,65,99,0.16),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-fixed bg-center opacity-10"
        aria-hidden="true"
      />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-24 pt-12 text-slate-900">
        <header className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
          <div className="absolute -left-24 -top-32 h-64 w-64 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 right-[-6rem] h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Beta workspace
                </span>
                <h1 className="text-5xl font-display font-semibold tracking-tight text-slate-900">ReuST</h1>
                <p className="text-base text-slate-600">
                  A decision making framework for efficient end-of-life scenarios of structural steel elements.
                </p>
              </div>
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:max-w-sm">
                <div className="relative flex w-full max-w-xs items-center rounded-full bg-white/70 p-1.5 shadow-inner shadow-white/40 backdrop-blur">
                  <span
                    className="absolute inset-y-1 left-1 w-[calc(50%-0.75rem)] rounded-full bg-slate-900 transition-transform duration-300 ease-out"
                    style={tabSliderStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveTab('assessment')}
                    className={`relative z-[1] flex-1 rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.35em] transition-colors ${
                      activeTab === 'assessment' ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Assessment workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('life-cycle')}
                    className={`relative z-[1] flex-1 rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.35em] transition-colors ${
                      activeTab === 'life-cycle' ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Life cycle (LCA)
                  </button>
                </div>
                <a
                  href="mailto:alper.kanyilmaz@polimi.it"
                  className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-brand to-brand-dark px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,65,99,0.22)] transition hover:shadow-soft"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Need support
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/40 p-4 text-xs font-medium text-slate-500 shadow-inner shadow-white/30">
              Prototype for evaluation purposes only. Validate the outputs with your engineering team before implementation.
            </div>
            {loadingModels ? (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-300/70 bg-amber-100/70 px-4 py-3 text-sm text-amber-800 shadow-sm">
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-amber-500" aria-hidden="true" />
                Loading machine learning models. This may take a few seconds…
              </div>
            ) : null}
            {modelError ? (
              <div className="rounded-2xl border border-rose-300/70 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 shadow-sm">{modelError}</div>
            ) : null}
          </div>
        </header>

        {activeTab === 'assessment' ? (
          <>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <Section
                id="visual-inspection"
                title="Structural visual inspection"
                description="Hero workspace for imagery-led assessment with manual override controls."
                isOpen={visualOpen}
                onToggle={() => setVisualOpen((value) => !value)}
                meta={
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Inspection score</p>
                    <p className="mt-2 text-3xl font-display font-semibold text-slate-900">{inspectionScore.percentage.toFixed(1)}%</p>
                    <StatusBadge status={inspectionScore.status} />
                  </div>
                }
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                  <div className="space-y-6">
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
                        className={`group relative flex min-h-[280px] cursor-pointer flex-col justify-between gap-6 overflow-hidden rounded-3xl border-2 border-dashed p-8 transition-all duration-300 ${
                          isDragging
                            ? 'border-brand bg-brand-light/70 shadow-[0_35px_60px_rgba(24,65,99,0.25)]'
                            : 'border-white/60 bg-white/70 shadow-[0_35px_60px_rgba(15,23,42,0.14)]'
                        }`}
                        role="button"
                        tabIndex={0}
                        onClick={() => document.getElementById('image-input')?.click()}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-brand-light/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-brand">
                              Visual evidence
                            </span>
                            <h3 className="text-2xl font-display font-semibold text-slate-900">Upload structural imagery</h3>
                            <p className="max-w-md text-sm text-slate-600">
                              Drop recent site captures or browse your device to initialise automated classification.
                            </p>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-14 w-14 text-brand/60 transition-transform duration-300 group-hover:-translate-y-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 7l-4-4m00L8 7m4-4v12" />
                          </svg>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-brand">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(24,65,99,0.25)] transition hover:bg-brand-dark"
                            onClick={() => document.getElementById('image-input')?.click()}
                          >
                            Browse files
                          </button>
                          <span className="text-xs font-medium uppercase tracking-[0.28em] text-brand/70">or drag & drop</span>
                        </div>
                        <input
                          id="image-input"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) => handleFiles(event.target.files)}
                          className="hidden"
                        />
                      </div>
                    ) : null}

                    <div className="flex items-start gap-3 rounded-2xl border border-white/50 bg-white/60 p-4 shadow-sm shadow-white/40 backdrop-blur">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
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
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Work without imagery</p>
                        <p className="text-xs text-slate-500">Toggle to rely on manual scoring when photos are unavailable.</p>
                      </div>
                    </div>

                    {previews.length ? (
                      <div className="rounded-3xl border border-white/50 bg-white/60 p-4 shadow-inner shadow-white/30 backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Loaded imagery</p>
                        <div className="mt-3 grid max-h-44 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                          {previews.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt={`Uploaded preview ${index + 1}`}
                              className="aspect-square w-full rounded-xl object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3">
                      {!noImageData ? (
                        <button
                          type="button"
                          onClick={classifyImages}
                          className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 disabled:opacity-70"
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
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                          {isClassifying ? 'Running classification…' : 'Run AI classification'}
                        </button>
                      ) : null}
                      {(previews.length || noImageData) && (
                        <button
                          type="button"
                          onClick={resetImages}
                          className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-white/70 hover:text-slate-900"
                        >
                          Reset evidence
                        </button>
                      )}
                      {classification ? (
                        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                          {classification.total} image{classification.total === 1 ? '' : 's'} analysed
                        </span>
                      ) : null}
                    </div>

                    <div className="rounded-3xl border border-white/50 bg-white/65 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                      <h3 className="text-base font-semibold text-slate-900">
                        {noImageData ? 'Manual inspection scoring' : 'Refine inspection inputs'}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500">
                        {noImageData
                          ? 'Enter qualitative observations to estimate the inspection score.'
                          : 'Fine-tune the automated output with on-site knowledge.'}
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

                    <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-base font-semibold text-slate-900">Extended building context</h3>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-500"
                            checked={optionalVisualData}
                            onChange={(event) => setOptionalVisualData(event.target.checked)}
                          />
                          Provide additional information
                        </label>
                      </div>
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
                            label="Availability of sufficient reusable elements?"
                            value={visualInputs.sufficientAmount}
                            onChange={(value) => setVisualInputs((state) => ({ ...state, sufficientAmount: value }))}
                            options={[
                              { value: '1', label: 'Yes' },
                              { value: '0', label: 'No' },
                            ]}
                          />
                          <SelectField
                            id="geometry-check"
                            label="Passes geometric checks without modification?"
                            value={visualInputs.geometryCheck}
                            onChange={(value) => setVisualInputs((state) => ({ ...state, geometryCheck: value }))}
                            options={[
                              { value: '1', label: 'Yes' },
                              { value: '0', label: 'No' },
                            ]}
                          />
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-slate-500">Enable the toggle to capture detailed project context.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/50 bg-white/65 p-6 shadow-lg shadow-slate-900/10 backdrop-blur">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Inspection analytics</p>
                          <p className="text-3xl font-display font-semibold text-slate-900">{inspectionScore.percentage.toFixed(1)}%</p>
                          <p className="text-xs text-slate-500">
                            {classification?.total
                              ? `AI-assisted evaluation across ${classification.total} uploaded image${classification.total === 1 ? '' : 's'}.`
                              : noImageData
                              ? 'Manual scoring active. Update dropdowns to refine the score.'
                              : 'Upload and classify imagery to activate AI scoring.'}
                          </p>
                        </div>
                        <StatusBadge status={inspectionScore.status} />
                      </div>
                      {classifySummary ? <p className="mt-4 text-xs text-slate-500">{classifySummary}</p> : null}
                    </div>

                    <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                      <p className="text-sm font-semibold text-slate-900">Progress tracker</p>
                      <div className="mt-4 space-y-3">
                        {visualSteps.map((step) => (
                          <StepItem key={step.id} {...step} />
                        ))}
                      </div>
                    </div>

                    {classificationBreakdown ? (
                      <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                        <p className="text-sm font-semibold text-slate-900">Classification breakdown</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {classificationBreakdown.map((item) => (
                            <div key={item.id} className={`rounded-xl border px-4 py-3 ${item.tone}`}>
                              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                              <p className="mt-2 text-2xl font-semibold">{item.value}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Section>
              <div className="h-full">
                <RecommendationCard
                  suggestion={suggestion}
                  totalImages={classification?.total ?? 0}
                  inspectionScore={inspectionScore}
                  logisticScore={logisticScore}
                  performanceScore={performanceScore}
                />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Section
                id="logistic-feasibility"
                title="Logistic feasibility"
                description="Capture dismantling, handling, and storage considerations to understand feasibility constraints."
                isOpen={logisticOpen}
                onToggle={() => setLogisticOpen((value) => !value)}
                variant="compact"
                className="h-full"
                meta={
                  <div className="text-right space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Score</p>
                    <p className="text-2xl font-display font-semibold text-slate-900">{logisticScore.percentage.toFixed(1)}%</p>
                    <StatusBadge status={logisticScore.status} />
                  </div>
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <SelectField
                    id="item-weight"
                    label="Weight of the structural element"
                    value={logisticInputs.itemWeight}
                    onChange={(value) => setLogisticInputs((state) => ({ ...state, itemWeight: value }))}
                    options={[
                      { value: '3', label: 'Very light (<0.1 t)' },
                      { value: '2', label: 'Light (0.1–0.2 t)' },
                      { value: '1', label: 'Heavy (0.2–0.5 t)' },
                      { value: '0', label: 'Very heavy (>0.5 t)' },
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
                    label="Need special protective measures for components?"
                    value={logisticInputs.specialProtection}
                    onChange={(value) => setLogisticInputs((state) => ({ ...state, specialProtection: value }))}
                    options={[
                      { value: '1', label: 'Yes' },
                      { value: '0', label: 'No' },
                    ]}
                  />
                  <SelectField
                    id="dismantle-phase"
                    label="Dismantling phase complexity"
                    value={logisticInputs.dismantlePhase}
                    onChange={(value) => setLogisticInputs((state) => ({ ...state, dismantlePhase: value }))}
                    options={[
                      { value: '1', label: 'Straightforward' },
                      { value: '0', label: 'Complex' },
                    ]}
                  />
                  <SelectField
                    id="storage-availability"
                    label="Is there storage availability on-site?"
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
                title="Structural performance"
                description="Evaluate documentation quality, maintenance history, adaptability, and testing feasibility."
                isOpen={performanceOpen}
                onToggle={() => setPerformanceOpen((value) => !value)}
                variant="compact"
                className="h-full"
                meta={
                  <div className="text-right space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Score</p>
                    <p className="text-2xl font-display font-semibold text-slate-900">{performanceScore.percentage.toFixed(1)}%</p>
                    <StatusBadge status={performanceScore.status} />
                  </div>
                }
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <SelectField
                    id="data-quality"
                    label="Quality of available data?"
                    value={performanceInputs.dataQuality}
                    onChange={(value) => setPerformanceInputs((state) => ({ ...state, dataQuality: value }))}
                    options={[
                      { value: '0', label: 'No documentation' },
                      { value: '1', label: 'Only drawings available' },
                      { value: '2', label: 'Drawings and calculation report' },
                      { value: '3', label: 'Comprehensive documentation' },
                    ]}
                  />
                  <SelectField
                    id="construction-period"
                    label="Designed and constructed after 2005?"
                    value={performanceInputs.constructionPeriod}
                    onChange={(value) => setPerformanceInputs((state) => ({ ...state, constructionPeriod: value }))}
                    options={[
                      { value: '1', label: 'Yes' },
                      { value: '0', label: 'No' },
                    ]}
                  />
                  <SelectField
                    id="maintenance"
                    label="Has the structure undergone maintenance?"
                    value={performanceInputs.maintenance}
                    onChange={(value) => setPerformanceInputs((state) => ({ ...state, maintenance: value }))}
                    options={[
                      { value: '1', label: 'Yes' },
                      { value: '0', label: 'No' },
                    ]}
                  />
                  <SelectField
                    id="purpose"
                    label="Is the element unique for its purpose?"
                    value={performanceInputs.purpose}
                    onChange={(value) => setPerformanceInputs((state) => ({ ...state, purpose: value }))}
                    options={[
                      { value: '0', label: 'Yes' },
                      { value: '1', label: 'No' },
                    ]}
                  />
                  <SelectField
                    id="testing"
                    label="Is sample testing feasible?"
                    value={performanceInputs.testing}
                    onChange={(value) => setPerformanceInputs((state) => ({ ...state, testing: value }))}
                    options={[
                      { value: '1', label: 'Yes' },
                      { value: '0', label: 'No' },
                    ]}
                  />
                </div>
              </Section>
            </div>
          </>
        ) : (
          <Section
            id="life-cycle"
            title="Life cycle assessment (LCA)"
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
                      label="Height [mm]"
                      value={lcaInputs.height}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, height: value }))}
                      placeholder="320"
                      min="0"
                    />
                    <NumberField
                      id="lca-width"
                      label="Width [mm]"
                      value={lcaInputs.width}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, width: value }))}
                      placeholder="120"
                      min="0"
                    />
                    <NumberField
                      id="lca-length"
                      label="Length [m]"
                      value={lcaInputs.length}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, length: value }))}
                      placeholder="6"
                      min="0"
                    />
                    <NumberField
                      id="lca-unit-weight"
                      label="Unit weight [kg/m³]"
                      value={lcaInputs.unitWeight}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, unitWeight: value }))}
                      placeholder="7850"
                      min="0"
                    />
                    <NumberField
                      id="lca-quantity"
                      label="Quantity"
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
                      id="lca-bulk-weight"
                      label="Total bulk weight [kg]"
                      value={lcaInputs.bulkWeight}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, bulkWeight: value }))}
                      placeholder="12000"
                      min="0"
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                  <p className="text-sm font-semibold text-slate-800">Emission factors (kgCO₂e/kg)</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <NumberField
                      id="lca-ca1a3"
                      label="Product stage (A1-A3)"
                      value={lcaInputs.cA1A3}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, cA1A3: value }))}
                      placeholder="1.13"
                    />
                    <NumberField
                      id="lca-cc1c4"
                      label="End-of-life (C1-C4)"
                      value={lcaInputs.cC1C4}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, cC1C4: value }))}
                      placeholder="0.018"
                    />
                    <NumberField
                      id="lca-cd"
                      label="Benefits beyond (D)"
                      value={lcaInputs.cD}
                      onChange={(value) => setLcaInputs((state) => ({ ...state, cD: value }))}
                      placeholder="-0.413"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={calculateCarbon}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(24,65,99,0.28)] transition hover:shadow-soft"
                >
                  Calculate carbon impact
                </button>

                {lcaResult ? (
                  <div className="rounded-3xl border border-white/50 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
                    <p className="text-sm font-semibold text-slate-800">Results</p>
                    <dl className="mt-4 grid gap-4 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <dt>Total weight</dt>
                        <dd className="font-semibold text-slate-900">{lcaResult.totalWeight} kg</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Product stage (A1-A3)</dt>
                        <dd className="font-semibold text-slate-900">{lcaResult.product} kgCO₂e</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>End-of-life (C1-C4)</dt>
                        <dd className="font-semibold text-slate-900">{lcaResult.endOfLife} kgCO₂e</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt>Benefits beyond (D)</dt>
                        <dd className="font-semibold text-slate-900">{lcaResult.recovery} kgCO₂e</dd>
                      </div>
                    </dl>
                  </div>
                ) : null}
              </div>
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}


export default App;
