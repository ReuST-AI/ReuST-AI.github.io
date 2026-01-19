import { useState } from 'react';
import { Accordion } from '@/shared/components/Accordion';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { Checkbox } from '@/shared/components/Checkbox';
import { useAppStore } from '@/shared/store/useAppStore';
import { calculateLCA } from './services/lcaCalculator';

export const LifecycleAssessmentFeature = () => {
  const { lca, setLCAData, lcaResult, setLCAResult } = useAppStore();
  const [weightMethod, setWeightMethod] = useState<'single' | 'dimensions' | 'bulk'>('single');

  const handleCalculate = () => {
    const result = calculateLCA({ ...lca, weightInputMethod: weightMethod });
    setLCAResult(result);
  };

  return (
    <Accordion
      title="Life Cycle Assessment (LCA)"
      description="Simplified embodied carbon computation from cradle-to-cradle approach"
    >
      <div className="space-y-6">
        <p className="text-sm">Please select how you prefer to input the weight of the elements.</p>

        <div className="space-y-4">
          <Checkbox
            label="Weight of single element"
            checked={weightMethod === 'single'}
            onChange={(e) => e.target.checked && setWeightMethod('single')}
          />
          {weightMethod === 'single' && (
            <div className="ml-6 space-y-4">
              <Input
                label="Weight of single element (kg)"
                type="number"
                value={lca.singleWeight ?? ''}
                onChange={(e) =>
                  setLCAData({
                    singleWeight: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="Enter weight (e.g., 150 kg)"
              />
              <Input
                label="Number of items"
                type="number"
                value={lca.itemCount ?? ''}
                onChange={(e) =>
                  setLCAData({ itemCount: e.target.value ? Number(e.target.value) : null })
                }
                placeholder="Enter quantity (e.g., 50)"
              />
            </div>
          )}

          <Checkbox
            label="Dimension of single element"
            checked={weightMethod === 'dimensions'}
            onChange={(e) => e.target.checked && setWeightMethod('dimensions')}
          />
          {weightMethod === 'dimensions' && (
            <div className="ml-6 space-y-4">
              <Input
                label="Height of the element (mm)"
                type="number"
                value={lca.height ?? ''}
                onChange={(e) =>
                  setLCAData({ height: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                label="Width of the element (mm)"
                type="number"
                value={lca.width ?? ''}
                onChange={(e) =>
                  setLCAData({ width: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                label="Length of the element (m)"
                type="number"
                value={lca.length ?? ''}
                onChange={(e) =>
                  setLCAData({ length: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                label="Material unit weight (kg/m³)"
                type="number"
                value={lca.unitWeight ?? ''}
                onChange={(e) =>
                  setLCAData({ unitWeight: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                label="Number of items"
                type="number"
                value={lca.quantity ?? ''}
                onChange={(e) =>
                  setLCAData({ quantity: e.target.value ? Number(e.target.value) : null })
                }
              />
            </div>
          )}

          <Checkbox
            label="Bulk material weight"
            checked={weightMethod === 'bulk'}
            onChange={(e) => e.target.checked && setWeightMethod('bulk')}
          />
          {weightMethod === 'bulk' && (
            <div className="ml-6">
              <Input
                label="Bulk weight of the material (kg)"
                type="number"
                value={lca.bulkWeight ?? ''}
                onChange={(e) =>
                  setLCAData({ bulkWeight: e.target.value ? Number(e.target.value) : null })
                }
              />
            </div>
          )}
        </div>

        <div className="space-y-4 border-t pt-4 dark:border-gray-700">
          <Input
            label="Product stage A1-A3 Coefficient (kgCO₂e)"
            type="number"
            step={0.01}
            value={lca.coefficientA1A3}
            onChange={(e) =>
              setLCAData({ coefficientA1A3: Number(e.target.value) })
            }
          />
          <Input
            label="End of life stage C1-C4 Coefficient (kgCO₂e)"
            type="number"
            step={0.01}
            value={lca.coefficientC1C4}
            onChange={(e) =>
              setLCAData({ coefficientC1C4: Number(e.target.value) })
            }
          />
          <Input
            label="Reuse, recycle and recovery stage D Coefficient (kgCO₂e)"
            type="number"
            step={0.01}
            value={lca.coefficientD}
            onChange={(e) =>
              setLCAData({ coefficientD: Number(e.target.value) })
            }
          />
        </div>

        <Button onClick={handleCalculate}>Compute the embodied carbon</Button>

        {lcaResult && (
          <div className="mt-4 space-y-2 rounded-lg bg-accent-light/10 p-4 dark:bg-accent-dark/10">
            <p>
              <strong>Total weight of structural element:</strong> {lcaResult.totalWeight.toFixed(1)} kg
            </p>
            <p>
              <strong>Product stage A1-A3:</strong> {lcaResult.productStage.toFixed(1)} kgCO₂e
            </p>
            <p>
              <strong>End of life stage C1-C4:</strong> {lcaResult.endOfLifeStage.toFixed(1)} kgCO₂e
            </p>
            <p>
              <strong>Reuse, recycle and recovery stage D:</strong> {lcaResult.reuseStage.toFixed(1)} kgCO₂e
            </p>
          </div>
        )}
      </div>
    </Accordion>
  );
};
