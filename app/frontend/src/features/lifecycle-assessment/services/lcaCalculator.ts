import type { LCAData, LCAResult } from '@/shared/types';

export const calculateLCA = (data: LCAData): LCAResult | null => {
  let totalWeight = 0;

  switch (data.weightInputMethod) {
    case 'single':
      if (data.singleWeight && data.itemCount) {
        totalWeight = data.singleWeight * data.itemCount;
      }
      break;

    case 'dimensions':
      if (
        data.height &&
        data.width &&
        data.length &&
        data.unitWeight &&
        data.quantity
      ) {
        totalWeight =
          ((data.height / 1000) * (data.width / 1000)) *
          data.length *
          data.unitWeight *
          data.quantity;
      }
      break;

    case 'bulk':
      if (data.bulkWeight) {
        totalWeight = data.bulkWeight;
      }
      break;
  }

  if (totalWeight <= 0) {
    return null;
  }

  const productStage = totalWeight * data.coefficientA1A3;
  const endOfLifeStage = totalWeight * data.coefficientC1C4;
  const reuseStage = totalWeight * data.coefficientD;

  return {
    totalWeight,
    productStage,
    endOfLifeStage,
    reuseStage,
  };
};
