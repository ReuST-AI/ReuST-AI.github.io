import { Accordion } from '@/shared/components/Accordion';
import { Select } from '@/shared/components/Select';
import { useAppStore } from '@/shared/store/useAppStore';

export const LogisticFeasibilityFeature = () => {
  const { logistic, setLogisticData } = useAppStore();

  return (
    <Accordion title="Logistic Feasibility">
      <div className="space-y-4">
        <Select
          label="Weight of the structural element"
          value={logistic.itemWeight?.toString() ?? ''}
          onChange={(e) =>
            setLogisticData({ itemWeight: e.target.value ? Number(e.target.value) : null })
          }
          options={[
            { value: '3', label: 'Very light [< 0.1 ton]' },
            { value: '2', label: 'Light [0.1 - 0.2 ton]' },
            { value: '1', label: 'Heavy [0.2 - 0.5 ton]' },
            { value: '0', label: 'Very heavy [> 0.5 ton]' },
          ]}
        />

        <Select
          label="Ease to handle, transport, store, and process?"
          value={logistic.easyHandle === null ? '' : logistic.easyHandle ? 'yes' : 'no'}
          onChange={(e) =>
            setLogisticData({
              easyHandle:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Availability of dismantle-sort-repair infrastructure"
          value={
            logistic.existInfrastructure === null
              ? ''
              : logistic.existInfrastructure
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setLogisticData({
              existInfrastructure:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Special protection is needed for transportation?"
          value={
            logistic.specialProtection === null
              ? ''
              : logistic.specialProtection
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setLogisticData({
              specialProtection:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Dismantle phase is compatible with demolition work?"
          value={
            logistic.dismantlePhase === null ? '' : logistic.dismantlePhase ? 'yes' : 'no'
          }
          onChange={(e) =>
            setLogisticData({
              dismantlePhase:
                e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null,
            })
          }
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />

        <Select
          label="Availability of storage"
          value={
            logistic.storageAvailability === null
              ? ''
              : logistic.storageAvailability
              ? 'yes'
              : 'no'
          }
          onChange={(e) =>
            setLogisticData({
              storageAvailability:
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
