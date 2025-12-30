/**
 * Custom hook for managing disclaimer modal
 * Shows disclaimer on first app load
 */

import { useEffect, useState } from 'react';
import { DISCLAIMER_MESSAGE } from '@/constants';

const DISCLAIMER_STORAGE_KEY = 'reust-disclaimer-shown';

/**
 * Hook to manage disclaimer display
 * Shows disclaimer once per session
 *
 * @returns Object containing disclaimer state and setter
 */
export function useDisclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if disclaimer has been shown this session
    const hasShown = sessionStorage.getItem(DISCLAIMER_STORAGE_KEY);

    if (!hasShown) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleCloseDisclaimer = () => {
    sessionStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
    setShowDisclaimer(false);
  };

  return {
    showDisclaimer,
    handleCloseDisclaimer,
    disclaimerMessage: DISCLAIMER_MESSAGE,
  };
}
