import { Accordion } from '@/shared/components/Accordion';
import { Select } from '@/shared/components/Select';
import { useAppStore } from '@/shared/store/useAppStore';

export const StructuralPerformanceFeature = () => {
  const { structuralPerformance, setStructuralPerformanceData } = useAppStore();

  return (
    <Accordion
      title="Structural Performance"
      description="Evaluates mechanical and physical performance of structural elements"
    >
      <div className="space-y-4">
        <Select
          label="Quality of available data?"
          value={structuralPerformance.dataQuality?.toString() ?? ''}
          onChange={(e) =>
            setStructuralPerformanceData({
              dataQuality: e.target.value ? Number(e.target.value) : null,
            })
          }
          options={[
            { value: '0', label: 'No documentation' },
            { value: '1', label: 'Only drawing available' },
            { value: '2', label: 'Drawings and calculation report available' },
            { value: '3', label: 'All detailed documentation available' },
          ]}
        />

        <Select
          label="Is the building designed and constructed after year 2005?"
          value={
            structuralPerformance.constructionPeriod === null
              ? ''
              : structuralPerformance.constructionPeriod
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setStructuralPerformanceData({
              constructionPeriod:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Did the structure have maintenance before?"
          value={
            structuralPerformance.maintenance === null
              ? ''
              : structuralPerformance.maintenance
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setStructuralPerformanceData({
              maintenance:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Is the structural element unique for its purpose?"
          value={
            structuralPerformance.purpose === null
              ? ''
              : structuralPerformance.purpose
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setStructuralPerformanceData({
              purpose:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Is it possible to conduct sample testing?"
          value={
            structuralPerformance.testing === null
              ? ''
              : structuralPerformance.testing
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setStructuralPerformanceData({
              testing:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
      </div>
    </Accordion>
  );
};
