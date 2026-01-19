import { Header } from './shared/components/Header';
import { Footer } from './shared/components/Footer';
import { VisualInspectionFeature } from './features/visual-inspection';
import { LogisticFeasibilityFeature } from './features/logistic-feasibility';
import { StructuralPerformanceFeature } from './features/structural-performance';
import { LifecycleAssessmentFeature } from './features/lifecycle-assessment';
import { ResultsFeature } from './features/results';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <VisualInspectionFeature />
          <LogisticFeasibilityFeature />
          <StructuralPerformanceFeature />
          <LifecycleAssessmentFeature />
          <ResultsFeature />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
