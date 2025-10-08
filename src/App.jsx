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
    className={`group relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-8 shadow-soft transition-all duration-500 ${
      isOpen ? 'ring-2 ring-brand/30' : 'hover:-translate-y-1 hover:shadow-xl'
    }`}
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-80" />
    <div className="relative">
      <button
        type="button"
        className="flex w-full flex-col gap-4 text-left md:flex-row md:items-start md:justify-between"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">Assessment Module</span>
          <h2 className="text-2xl font-display font-semibold text-brand-dark">{title}</h2>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-brand/20 bg-brand/5 text-brand transition-all duration-300 ${
            isOpen ? 'rotate-180 bg-brand text-white shadow-lg' : 'group-hover:border-brand/40'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen ? (
        <div id={`${id}-content`} className="mt-8 space-y-8">
          {children}
        </div>
      ) : null}
    </div>
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

const statusStyles = (status) =>
  status === 'Passed'
    ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200'
    : 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200';

const MetricCard = ({ label, value, status, caption, accent, icon, statusClassName }) => {
  const statusClass = statusClassName ?? statusStyles(status);
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-6 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition duration-500 group-hover:opacity-100`} />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">{label}</p>
          <p className="mt-3 text-3xl font-display font-semibold text-brand-dark">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-inner">
          {icon}
        </div>
      </div>
      <div className="relative mt-6 flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{status}</span>
        <span className="text-right text-xs font-medium text-slate-500">{caption}</span>
      </div>
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

  const summaryCards = useMemo(() => {
    const logisticComplete = Object.values(logisticInputs).some((value) => value !== '');
    const performanceComplete = Object.values(performanceInputs).some((value) => value !== '');
    const visualCaption = classification?.total
      ? `AI-assisted · ${classification.total} image${classification.total > 1 ? 's' : ''}`
      : noImageData
      ? 'Manual scoring active'
      : 'Provide inspection evidence';
    const logisticCaption = logisticComplete ? 'Inputs captured' : 'Awaiting data';
    const performanceCaption = performanceComplete ? 'Inputs captured' : 'Awaiting data';
    const recommendationCaption =
      suggestion.tone === 'success' ? 'Reuse pathway recommended' : 'Recycling recommended';
    const recommendationAccent =
      suggestion.tone === 'success'
        ? 'from-emerald-300/40 via-emerald-200/40 to-transparent'
        : 'from-amber-300/40 via-amber-200/40 to-transparent';

    return [
      {
        id: 'visual',
        label: 'Visual Inspection',
        value: `${inspectionScore.percentage.toFixed(1)}%`,
        status: inspectionScore.status,
        caption: visualCaption,
        accent: 'from-emerald-300/30 via-emerald-200/40 to-transparent',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4l1-2h8l1 2h4m-2 0a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2m7 3a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
        ),
      },
      {
        id: 'logistic',
        label: 'Logistic Feasibility',
        value: `${logisticScore.percentage.toFixed(1)}%`,
        status: logisticScore.status,
        caption: logisticCaption,
        accent: 'from-sky-300/30 via-sky-200/40 to-transparent',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10-2v-4a1 1 0 00-1-1h-5V7h3l3 3h2a1 1 0 011 1v4m-4 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
      {
        id: 'performance',
        label: 'Structural Performance',
        value: `${performanceScore.percentage.toFixed(1)}%`,
        status: performanceScore.status,
        caption: performanceCaption,
        accent: 'from-indigo-300/30 via-indigo-200/40 to-transparent',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        id: 'decision',
        label: 'Decision Pathway',
        value: `${suggestion.overall}%`,
        status: suggestion.label,
        caption: recommendationCaption,
        accent: recommendationAccent,
        statusClassName:
          suggestion.tone === 'success'
            ? 'bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-300'
            : 'bg-amber-400/20 text-amber-700 ring-1 ring-inset ring-amber-300',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 010 6.364L3 14l4 4 1.318-1.318a4.5 4.5 0 016.364 0L16 19l4-4-1.318-1.318a4.5 4.5 0 000-6.364L16 6l-1.318 1.318a4.5 4.5 0 01-6.364 0L7 6l-2.682.318z"
            />
          </svg>
        ),
      },
    ];
  }, [
    classification,
    inspectionScore,
    logisticInputs,
    logisticScore,
    noImageData,
    performanceInputs,
    performanceScore,
    suggestion,
  ]);

  const moduleSummaries = useMemo(
    () => [
      {
        id: 'visual',
        label: 'Visual inspection',
        percentage: inspectionScore.percentage.toFixed(1),
        status: inspectionScore.status,
        description: 'Condition & connection integrity',
      },
      {
        id: 'logistic',
        label: 'Logistic feasibility',
        percentage: logisticScore.percentage.toFixed(1),
        status: logisticScore.status,
        description: 'Dismantling & handling readiness',
      },
      {
        id: 'performance',
        label: 'Structural performance',
        percentage: performanceScore.percentage.toFixed(1),
        status: performanceScore.status,
        description: 'Reliability & reuse potential',
      },
    ],
    [inspectionScore, logisticScore, performanceScore]
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

  const recommendationAccent =
    suggestion.tone === 'success'
      ? 'from-emerald-200/60 via-emerald-100/70 to-transparent'
      : 'from-amber-200/60 via-amber-100/70 to-transparent';

  const overallTone =
    suggestion.tone === 'success'
      ? 'from-emerald-500 via-emerald-600 to-emerald-700 text-white'
      : 'from-amber-100 via-amber-200 to-amber-300 text-amber-900';

  return (
    <div className="relative min-h-screen overflow-hidden pb-16">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/40 blur-3xl animate-pulse-soft"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 left-[-10%] h-[26rem] w-[26rem] rounded-full bg-sky-400/30 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-12rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-emerald-400/25 blur-3xl animate-float"
        aria-hidden="true"
      />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 text-slate-900">
        <header className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-10 shadow-soft backdrop-blur">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-light/80 via-white/90 to-white/60 opacity-90"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  <span className="h-2 w-2 rounded-full bg-brand-dark" />
                  Beta workspace
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  <img src="/assets/logo.png" alt="ReuST logo" className="h-16 w-auto" />
                  <div className="space-y-3">
                    <h1 className="text-4xl font-display font-semibold tracking-tight text-brand-dark">ReuST Decision Studio</h1>
                    <p className="max-w-2xl text-sm text-slate-600">
                      Harmonise visual inspections, logistic constraints, structural performance, and carbon insights to guide reuse strategies for structural steel elements.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-brand/20 bg-white/90 p-5 text-sm text-slate-600 shadow-inner backdrop-blur">
                <p className="font-semibold text-brand-dark">Need support?</p>
                <a href="mailto:alper.kanyilmaz@polimi.it" className="mt-2 inline-flex items-center gap-2 font-medium text-brand hover:underline">
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
                  alper.kanyilmaz@polimi.it
                </a>
                <p className="mt-4 text-xs text-slate-500">
                  Prototype for evaluation purposes only. Validate results with your engineering team before implementation.
                </p>
              </div>
            </div>
            {loadingModels ? (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-700 shadow-sm">
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-amber-500" aria-hidden="true" />
                Loading machine learning models. This may take a few seconds…
              </div>
            ) : null}
            {modelError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 shadow-sm">{modelError}</div>
            ) : null}
            <nav className="flex flex-wrap gap-3 text-xs font-semibold text-brand">
              <a
                href="#visual-inspection"
                className="rounded-full border border-brand/20 bg-white/70 px-4 py-1.5 transition hover:border-brand hover:bg-brand/10"
              >
                Visual inspection
              </a>
              <a
                href="#logistic-feasibility"
                className="rounded-full border border-brand/20 bg-white/70 px-4 py-1.5 transition hover:border-brand hover:bg-brand/10"
              >
                Logistics
              </a>
              <a
                href="#structural-performance"
                className="rounded-full border border-brand/20 bg-white/70 px-4 py-1.5 transition hover:border-brand hover:bg-brand/10"
              >
                Performance
              </a>
              <a
                href="#life-cycle"
                className="rounded-full border border-brand/20 bg-white/70 px-4 py-1.5 transition hover:border-brand hover:bg-brand/10"
              >
                Life cycle
              </a>
            </nav>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <MetricCard key={card.id} {...card} />
          ))}
        </section>

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
              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner">
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

              <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner">
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

        <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-8 shadow-soft">
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${recommendationAccent} opacity-90`}
            aria-hidden="true"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5">
              <h2 className="text-3xl font-display font-semibold text-brand-dark">End-of-life recommendation</h2>
              <p className="text-sm text-slate-600">
                Synthesising inspection, logistics, and performance scores to highlight the most resource-efficient pathway.
              </p>
              {classifySummary ? (
                <div className="rounded-2xl border border-brand/20 bg-white/70 p-4 text-sm text-slate-600 shadow-sm">{classifySummary}</div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand/20 bg-white/60 p-4 text-sm text-slate-500">
                  Upload imagery or share manual assessments to unlock richer AI-driven insights.
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-3">
                {moduleSummaries.map((module) => (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">{module.label}</p>
                    <p className="mt-3 text-2xl font-display text-brand-dark">{module.percentage}%</p>
                    <span className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(module.status)}`}>
                      {module.status}
                    </span>
                    <p className="mt-3 text-xs text-slate-500">{module.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex h-full flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br ${overallTone} p-8 shadow-xl`}>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                  Scenario
                </span>
                <p className="text-3xl font-display font-semibold">{suggestion.label}</p>
                <p className="text-sm opacity-90">
                  The blended score across all modules is <strong>{suggestion.overall}%</strong>. Continue iterating inputs to see how the recommendation evolves.
                </p>
              </div>
              <div className="rounded-2xl bg-white/20 p-4 text-sm backdrop-blur">
                <p>
                  Document assumptions and share this dashboard with your stakeholders to support circular construction decisions and transparent communication.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
