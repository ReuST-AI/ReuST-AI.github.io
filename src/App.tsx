/**
 * Main App Component
 * Root component for ReuST application
 */

import React, { useEffect } from 'react';
import { useMLModels } from './hooks/useMLModels';
import { useDisclaimer } from './hooks/useDisclaimer';
import { APP_METADATA, CONTACT_EMAIL } from './constants';

// Import styles
import './styles/global.css';

/**
 * Simple placeholder component structure
 * TODO: Replace with actual feature components
 */
const App: React.FC = () => {
  const { modelsLoaded } = useMLModels();
  const { showDisclaimer, handleCloseDisclaimer, disclaimerMessage } = useDisclaimer();

  useEffect(() => {
    if (showDisclaimer) {
      alert(disclaimerMessage);
      handleCloseDisclaimer();
    }
  }, [showDisclaimer, disclaimerMessage, handleCloseDisclaimer]);

  return (
    <div className="app">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 title={APP_METADATA.fullTitle}>{APP_METADATA.title}</h1>
        <div className="divider"></div>
        <p style={{ fontStyle: 'italic' }}>{APP_METADATA.fullTitle}</p>
      </div>

      {/* Loading state for models */}
      {!modelsLoaded && (
        <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)', margin: '20px 0' }}>
          <p>Loading ML models...</p>
          <div className="loader"></div>
        </div>
      )}

      {/* Main content */}
      {modelsLoaded && (
        <div>
          <p style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <strong>React + Vite + TypeScript Refactoring in Progress</strong>
            <br />
            <br />
            The application architecture has been set up with:
            <br />
            ✓ TypeScript types and interfaces
            <br />
            ✓ Zustand state management
            <br />
            ✓ ML model loading hooks
            <br />
            ✓ Utility functions for calculations
            <br />
            ✓ Reusable UI components framework
            <br />
            <br />
            Next steps: Implement feature components (Visual Inspection, Logistic Feasibility, etc.)
            <br />
            See REFACTORING_GUIDE.md for details on the new architecture.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer>
        <p>Contact: {CONTACT_EMAIL}</p>
      </footer>
    </div>
  );
};

export default App;
