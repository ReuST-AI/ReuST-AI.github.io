/**
 * ReuST - Award-Winning Main App Component
 * Modern, beautiful, accessible design
 */

import React, { useEffect } from 'react';
import { useMLModels } from './hooks/useMLModels';
import { useDisclaimer } from './hooks/useDisclaimer';
import { APP_METADATA, CONTACT_EMAIL } from './constants';

// Import award-winning styles
import './styles/design-system.css';
import './styles/global.css';
import styles from './App.module.css';

/**
 * Main Application Component
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
    <div className={styles.app}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={`${styles.heroBackground}`}>
          <div className={styles.heroGradient}></div>
          <div className={styles.heroPattern}></div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              <span>v2.0.0 - Powered by AI & Machine Learning</span>
            </div>

            <h1 className={`${styles.heroTitle} animate-slide-up`}>
              <span className="gradient-text">{APP_METADATA.title}</span>
            </h1>

            <p className={`${styles.heroSubtitle} animate-slide-up`} style={{ animationDelay: '100ms' }}>
              {APP_METADATA.fullTitle}
            </p>

            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>CNN-Based Classification</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Real-Time Analysis</span>
              </div>
              <div className={styles.feature}>
                <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Performance Metrics</span>
              </div>
            </div>

            {!modelsLoaded && (
              <div className={styles.loadingCard}>
                <div className={styles.loadingContent}>
                  <div className="loader loader-lg"></div>
                  <div className={styles.loadingText}>
                    <h3>Loading AI Models</h3>
                    <p>Initializing TensorFlow.js neural networks...</p>
                  </div>
                </div>
                <div className={styles.loadingProgress}>
                  <div className={styles.loadingProgressBar}></div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.heroIllustration}>
            <div className={styles.floatingCard} style={{ animationDelay: '0s' }}>
              <div className={styles.cardIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h4>Visual Inspection</h4>
                <p>AI-powered image analysis</p>
              </div>
            </div>

            <div className={styles.floatingCard} style={{ animationDelay: '200ms' }}>
              <div className={styles.cardIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h4>Assessment</h4>
                <p>Comprehensive evaluation</p>
              </div>
            </div>

            <div className={styles.floatingCard} style={{ animationDelay: '400ms' }}>
              <div className={styles.cardIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className={styles.cardContent}>
                <h4>LCA Report</h4>
                <p>Carbon footprint analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container ${styles.main}`}>
        {modelsLoaded ? (
          <div className={styles.contentSection}>
            {/* Status Card */}
            <div className={`card ${styles.statusCard}`}>
              <div className={styles.statusHeader}>
                <div className={styles.statusIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3>System Ready</h3>
                  <p>All ML models loaded successfully</p>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>3</div>
                  <div className={styles.statLabel}>AI Models</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>70%+</div>
                  <div className={styles.statLabel}>Accuracy</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>React</div>
                  <div className={styles.statLabel}>Framework</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>TS</div>
                  <div className={styles.statLabel}>Type-Safe</div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="card">
              <h3>🚀 Refactoring in Progress</h3>
              <p>
                The application has been refactored to React + Vite + TypeScript with a modern, award-winning design system.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete TypeScript type system</span>
                </div>
                <div className={styles.featureItem}>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Zustand state management</span>
                </div>
                <div className={styles.featureItem}>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom hooks for ML operations</span>
                </div>
                <div className={styles.featureItem}>
                  <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Award-winning UI/UX design</span>
                </div>
              </div>

              <div className={styles.ctaSection}>
                <p><strong>Next Steps:</strong> Feature components are ready to be implemented</p>
                <button className={styles.ctaButton}>
                  <span>View Documentation</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>
            <strong>ReuST</strong> - Decision Making Framework for Steel Reuse
          </p>
          <p>Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          <p style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)' }}>
            Powered by TensorFlow.js, React, and TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
