# ReuST React + Vite + TypeScript Refactoring Guide

## Overview

This document outlines the refactoring from vanilla JavaScript to a modern React + Vite + TypeScript architecture. The refactoring follows senior-level best practices for maintainability, type safety, and code organization.

## ✅ Completed Work

### 1. Project Setup
- **Package.json**: Modern dependencies including React 18, TypeScript, Vite, TensorFlow.js, and Zustand
- **TypeScript Configuration**: Strict mode enabled with path aliases for clean imports
- **Vite Configuration**: Optimized build setup with path resolution
- **Folder Structure**: Clean separation of concerns

### 2. Type System (`src/types/index.ts`)
Complete TypeScript definitions for:
- ML model types and classification results
- Form data structures for all sections
- Performance assessment and LCA types
- Application state types
- UI utility types

### 3. Constants (`src/constants/index.ts`)
Centralized configuration for:
- ML model paths and class names
- Performance thresholds (70%, 75%, 80%)
- Calculation weights for all criteria
- Default carbon coefficients
- Form options and dropdowns
- UI text and metadata

### 4. Utility Functions

#### `src/utils/calculations.ts`
Pure functions for:
- `calculateVisualInspectionManual()`: Manual input scoring
- `calculateVisualInspectionFromImages()`: Image classification scoring
- `calculateLogisticFeasibility()`: Logistic performance
- `calculateStructuralPerformance()`: Structural assessment
- `calculateLCA()`: Carbon footprint calculations
- `calculateOverallPerformance()`: Overall percentage
- `determineRecommendation()`: Final recommendation logic

#### `src/utils/ml.ts`
TensorFlow.js utilities:
- `loadAllModels()`: Async model loading
- `classifyImage()`: Single image classification
- `classifyImages()`: Batch classification
- `preprocessImage()`: Image tensor preprocessing
- `loadImageFromFile()`: File to HTMLImageElement

#### `src/utils/validation.ts`
Form validation:
- `validateVisualInspection()`: Visual inspection form validation
- `validateLogisticFeasibility()`: Logistic form validation
- `validateStructuralPerformance()`: Structural form validation
- `validateLCA()`: LCA form validation

### 5. State Management (`src/store/index.ts`)
Zustand store with:
- Complete application state
- Actions for all data updates
- Automatic assessment generation
- Optimized selector hooks
- Form reset functionality

**Key Features**:
- Centralized state management
- Type-safe actions
- Derived state calculations
- Automatic updates on data changes

### 6. Custom Hooks

#### `src/hooks/useMLModels.ts`
- Loads all three TensorFlow.js models on mount
- Manages model lifecycle
- Provides loading state

#### `src/hooks/useImageClassification.ts`
- File selection handling
- Image preview management
- Batch classification
- Result aggregation

#### `src/hooks/useDisclaimer.ts`
- Session-based disclaimer display
- localStorage persistence

### 7. UI Components

#### `src/components/ui/Dropdown.tsx`
Reusable accordion/dropdown component with:
- Active/inactive states
- Smooth transitions
- Title and description props

#### `src/components/ui/FormInput.tsx`
Form input components:
- `SelectInput`: Dropdown select with type-safe options
- `NumberInput`: Validated number input
- `CheckboxInput`: Styled checkbox
- `SliderInput`: Range slider with value display

#### `src/components/ui/*.module.css`
CSS Modules for component styling

### 8. Global Styles (`src/styles/global.css`)
Migrated original styles to:
- Modern CSS structure
- Reusable utility classes
- Consistent theming

## 📋 Remaining Work

### Phase 1: Complete UI Components (30-60 min)

Create these additional components:

```
src/components/ui/
├── ImageUploader.tsx        # Drag-and-drop image upload
├── ImageUploader.module.css
├── Button.tsx               # Reusable button component
├── Button.module.css
├── Loader.tsx               # Loading spinner
└── Modal.tsx                # Disclaimer modal
```

### Phase 2: Feature Components (2-3 hours)

Implement the main feature sections:

```
src/components/features/
├── VisualInspection.tsx       # Image upload + manual input
├── VisualInspection.module.css
├── LogisticFeasibility.tsx    # Logistic form
├── LogisticFeasibility.module.css
├── StructuralPerformance.tsx  # Structural form
├── StructuralPerformance.module.css
├── LCA.tsx                    # Life cycle assessment
├── LCA.module.css
├── Suggestion.tsx             # Results display
└── Suggestion.module.css
```

**Component Pattern**:
```typescript
import { useAppStore } from '@/store';
import { Dropdown } from '@/components/ui/Dropdown';
import { SelectInput, NumberInput } from '@/components/ui/FormInput';

export const LogisticFeasibility: React.FC = () => {
  const { logisticFeasibility, updateLogisticFeasibility, ui, toggleDropdown } = useAppStore();
  const isActive = ui.activeDropdowns.has('logisticFeasibility');

  return (
    <Dropdown
      title="Logistic Feasibility"
      isActive={isActive}
      onToggle={() => toggleDropdown('logisticFeasibility')}
    >
      <SelectInput
        label="Weight of the structural element"
        value={logisticFeasibility.itemWeight}
        options={WEIGHT_OPTIONS}
        onChange={(value) => updateLogisticFeasibility({ itemWeight: value })}
      />
      {/* Add remaining fields... */}
    </Dropdown>
  );
};
```

### Phase 3: Integration & Testing (1-2 hours)

1. **Update App.tsx**: Import and render all feature components
2. **Test ML Models**: Verify model loading and classification
3. **Test Calculations**: Validate all scoring functions
4. **Test Form Flow**: End-to-end user journey
5. **Fix Styling**: Ensure pixel-perfect match with original

### Phase 4: Build & Deployment (30 min)

1. Install dependencies:
```bash
npm install
```

2. Test development build:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Update deployment:
   - Replace old `index.html` with `index-new.html`
   - Deploy `dist/` folder to GitHub Pages

## 🏗️ Architecture Benefits

### Before (Vanilla JS)
- ❌ No type safety
- ❌ Global mutable state
- ❌ DOM manipulation throughout
- ❌ Difficult to test
- ❌ Hard to maintain

### After (React + TypeScript)
- ✅ Full type safety with TypeScript
- ✅ Centralized state management (Zustand)
- ✅ Declarative UI (React)
- ✅ Reusable components
- ✅ Testable pure functions
- ✅ Clear separation of concerns

## 📁 Project Structure

```
/
├── public/              # Static assets
│   ├── models/          # TensorFlow.js models (keep existing)
│   └── assets/          # Images, favicon (keep existing)
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── features/    # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Pure utility functions
│   ├── constants/       # Configuration constants
│   ├── styles/          # Global styles
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index-new.html       # New Vite HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── REFACTORING_GUIDE.md # This file
```

## 🎯 Key Patterns

### 1. State Management Pattern
```typescript
// In component
const { data, updateData } = useAppStore();

// Update state
updateData({ field: newValue });

// State automatically triggers re-renders
```

### 2. Form Input Pattern
```typescript
<SelectInput
  label="Field Label"
  value={formData.field}
  options={OPTIONS_CONSTANT}
  onChange={(value) => updateForm({ field: value })}
/>
```

### 3. Classification Flow
```typescript
const { handleFileSelection, classifyAllImages } = useImageClassification();

// 1. User selects files
handleFileSelection(files);

// 2. Classify images
await classifyAllImages();

// 3. Results automatically stored and assessment generated
```

### 4. Assessment Generation
```typescript
// Automatic on data change
useEffect(() => {
  if (hasRequiredData) {
    generateAssessment();
  }
}, [formData]);
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Next Steps Priority

1. **HIGH**: Create `ImageUploader` component (critical for functionality)
2. **HIGH**: Create `VisualInspection` feature component
3. **HIGH**: Create `Suggestion` component (results display)
4. **MEDIUM**: Create remaining feature components (Logistic, Structural, LCA)
5. **MEDIUM**: Polish styling and responsiveness
6. **LOW**: Add unit tests
7. **LOW**: Add error boundaries
8. **LOW**: Performance optimization

## 🐛 Known Issues to Address

1. Replace `index.html` with `index-new.html` after testing
2. Ensure `public/models/` directory is accessible to Vite
3. Test image upload file size limits
4. Verify TensorFlow.js WASM backend works in production

## 📚 Learning Resources

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Zustand**: https://github.com/pmndrs/zustand
- **TensorFlow.js**: https://www.tensorflow.org/js

## 🎉 Benefits of This Refactoring

1. **Type Safety**: Catch errors at compile-time instead of runtime
2. **Maintainability**: Clear code organization and separation of concerns
3. **Reusability**: Components and utilities can be easily reused
4. **Testability**: Pure functions and isolated components are easy to test
5. **Developer Experience**: Better IDE support, autocomplete, and refactoring tools
6. **Performance**: React's virtual DOM and Vite's fast build times
7. **Scalability**: Easy to add new features without breaking existing code

## 💡 Tips for Completion

1. Start with one feature component at a time
2. Use existing vanilla JS code as reference for logic
3. Test frequently in development mode
4. Leverage TypeScript errors to catch issues early
5. Follow the established patterns in utilities and hooks
6. Keep components small and focused (Single Responsibility Principle)
7. Don't hesitate to extract repeated code into utilities

---

**Version**: 2.0.0
**Last Updated**: 2025-12-30
**Author**: AI Assistant via Claude Code
