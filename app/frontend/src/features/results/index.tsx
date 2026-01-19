import { useAppStore } from '@/shared/store/useAppStore';
import clsx from 'clsx';

export const ResultsFeature = () => {
  const { evaluationResult } = useAppStore();

  if (!evaluationResult) return null;

  const isReuse = evaluationResult.recommendation === 'Dismantle - Reuse';

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold">
        Suggestion for the End-of-Life Scenario
      </h2>

      {evaluationResult.imagesSummary && (
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {evaluationResult.imagesSummary}
        </p>
      )}

      <ul className="mb-6 space-y-2">
        <li>
          Structural visual inspection:{' '}
          <strong>{evaluationResult.visualInspection.percentage.toFixed(2)}%</strong> |{' '}
          <span
            className={clsx({
              'text-green-600 dark:text-green-400':
                evaluationResult.visualInspection.status === 'Passed',
              'text-red-600 dark:text-red-400':
                evaluationResult.visualInspection.status === 'Not passed',
            })}
          >
            {evaluationResult.visualInspection.status}
          </span>
        </li>
        <li>
          Logistic feasibility:{' '}
          <strong>{evaluationResult.logisticFeasibility.percentage.toFixed(2)}%</strong> |{' '}
          <span
            className={clsx({
              'text-green-600 dark:text-green-400':
                evaluationResult.logisticFeasibility.status === 'Passed',
              'text-red-600 dark:text-red-400':
                evaluationResult.logisticFeasibility.status === 'Not passed',
            })}
          >
            {evaluationResult.logisticFeasibility.status}
          </span>
        </li>
        <li>
          Structural performance:{' '}
          <strong>{evaluationResult.structuralPerformance.percentage.toFixed(2)}%</strong> |{' '}
          <span
            className={clsx({
              'text-green-600 dark:text-green-400':
                evaluationResult.structuralPerformance.status === 'Passed',
              'text-red-600 dark:text-red-400':
                evaluationResult.structuralPerformance.status === 'Not passed',
            })}
          >
            {evaluationResult.structuralPerformance.status}
          </span>
        </li>
      </ul>

      <div className="text-center">
        <p className="mb-2 text-sm font-medium">
          Based on the input evaluation, the efficient end-of-life scenario is:
        </p>
        <div
          className={clsx(
            'inline-block rounded-lg px-8 py-4 text-xl font-bold',
            {
              'bg-green-600 text-white': isReuse,
              'bg-yellow-400 text-black': !isReuse,
            }
          )}
        >
          {evaluationResult.recommendation}
        </div>
        <p className="mt-4 text-lg font-medium">
          The overall reusability performance:{' '}
          <strong>{evaluationResult.overallPercentage.toFixed(2)}%</strong>
        </p>
      </div>
    </div>
  );
};
