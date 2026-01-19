import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './shared/theme/ThemeProvider';
import App from './App';
import './index.css';

const showDisclaimer = () => {
  alert(
    'Disclaimer:\n\n' +
      'ReuST is currently under development and is intended for testing purposes only. ' +
      'As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. ' +
      'Use the results with caution and always consult with relevant experts for reliable assessments.'
  );
};

window.addEventListener('load', showDisclaimer);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
