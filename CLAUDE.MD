# CLAUDE.MD

## Project Overview

**ReuST** (Reuse of Structural Steel) is a modern, production-grade web application for evaluating efficient end-of-life scenarios of structural steel elements. The application assesses the reuse potential of existing steel structures by considering:

- **Logistic feasibility** (75% threshold)
- **Structural visual inspection** (70% threshold) - with automated CNN-based image classification
- **Structural performance** (80% threshold)
- **Life cycle assessment (LCA)** for cradle-to-cradle carbon footprint analysis

This project is based on the Python code written by [Mussie Birhane](https://github.com/MussieBirhane/decision-making-framework), refactored into a modern React + TypeScript application.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Machine Learning**: TensorFlow.js
- **Form Management**: React Hook Form + Zod validation
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Type Safety**: TypeScript
- **Security**: Helmet, CORS

### ML Models
- **ConnectionModel** - Classifies connection types (Bolted/Welded)
- **CorrosionModel** - Detects corrosion status (Corroded/Not Corroded)
- **DamageModel** - Assesses damage status (Damaged/Not Damaged)

## Project Structure

```
ReuST-AI.github.io/
├── app/                        # Modern React application (NEW)
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── features/      # Feature modules
│   │   │   │   ├── visual-inspection/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── services/      # ML model loader, image classifier
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── types/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── logistic-feasibility/
│   │   │   │   ├── structural-performance/
│   │   │   │   ├── lifecycle-assessment/
│   │   │   │   └── results/
│   │   │   ├── shared/
│   │   │   │   ├── components/       # Reusable UI (Button, Input, Select, etc.)
│   │   │   │   ├── store/            # Zustand state management
│   │   │   │   ├── services/         # Decision engine, calculations
│   │   │   │   ├── theme/            # Dark/light mode provider
│   │   │   │   ├── types/            # Shared TypeScript types
│   │   │   │   └── utils/
│   │   │   ├── App.tsx               # Root component
│   │   │   ├── main.tsx              # Entry point
│   │   │   └── index.css             # Global styles + Tailwind
│   │   ├── public/
│   │   │   ├── models/               # TensorFlow.js models
│   │   │   │   ├── ConnectionModel/
│   │   │   │   ├── CorrosionModel/
│   │   │   │   └── DamageModel/
│   │   │   └── assets/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   ├── backend/
│   │   ├── src/
│   │   │   └── server.ts             # Express API server
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── package.json                  # Workspace root
│   └── README.md                     # Complete documentation
├── index.html                        # Original app (LEGACY)
├── sketch.js                         # Original p5.js code (LEGACY)
├── style.css                         # Original styles (LEGACY)
├── models/                           # Original models (LEGACY)
├── assets/                           # Static resources
└── README.md                         # Repository readme
```

## Architecture

### Feature-Based Organization

Each feature is a self-contained module with:
- **Components**: React UI components
- **Services**: Business logic and API calls
- **Hooks**: Custom React hooks
- **Types**: TypeScript type definitions
- **index.tsx**: Public API (barrel export)

### Key Design Patterns

1. **Separation of Concerns**: UI, logic, state, and types are cleanly separated
2. **Type Safety**: Strict TypeScript with zero `any` types
3. **State Management**: Zustand for lightweight, performant global state
4. **Component Composition**: Reusable, accessible UI components
5. **Path Aliases**: Clean imports using `@/`, `@/features`, `@/shared`

### Core Services

#### Decision Engine (`shared/services/decisionEngine.ts`)
- Implements weighted scoring system
- Calculates Visual Inspection (max 12-15 points, 70% threshold)
- Calculates Logistic Feasibility (max 17 points, 75% threshold)
- Calculates Structural Performance (max 15 points, 80% threshold)
- Determines final recommendation: Reuse vs. Recycle

#### ML Services (`features/visual-inspection/services/`)
- **modelLoader.ts**: Asynchronous TensorFlow.js model loading with caching
- **imageClassifier.ts**: Image preprocessing, classification, aggregation

#### LCA Calculator (`features/lifecycle-assessment/services/`)
- Three weight input methods (single, dimensions, bulk)
- Carbon footprint calculation (A1-A3, C1-C4, D stages)

## How Claude Can Help

### Code Understanding
- Explain the React component architecture
- Analyze the decision-making algorithm logic
- Review the Zustand state management flow
- Document the ML model integration and classification pipeline
- Trace data flow from user input to recommendation

### Development Tasks
- **Add New Features**: Extend evaluation criteria, add new ML models
- **UI/UX Improvements**: Enhance components, add animations, improve accessibility
- **Backend Development**: Add API endpoints, database integration, authentication
- **Performance Optimization**: Code splitting, lazy loading, memoization
- **Testing**: Unit tests for services, integration tests for features
- **Documentation**: Technical docs, user guides, API documentation

### Debugging & Troubleshooting
- Debug TypeScript type errors
- Fix React component rendering issues
- Troubleshoot Zustand state updates
- Debug TensorFlow.js model loading failures
- Resolve build and deployment issues

### Refactoring & Code Quality
- Refactor components for better reusability
- Extract shared logic into custom hooks
- Improve type definitions for better IntelliSense
- Optimize bundle size and performance
- Implement best practices and design patterns

## Development Guidelines

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Navigate to the app directory
cd app/

# Install workspace dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### Running Locally

```bash
# From app/ directory

# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend → http://localhost:3000
npm run dev:backend   # Backend → http://localhost:5000
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately:
npm run build:frontend  # Output: frontend/dist/
npm run build:backend   # Output: backend/dist/
```

### Code Style & Standards

#### Naming Conventions
- **camelCase**: functions, variables, file names
- **PascalCase**: React components, TypeScript types/interfaces
- **kebab-case**: directories, CSS classes

#### TypeScript Guidelines
- Enable strict mode (already configured)
- No `any` types - use explicit types or `unknown`
- Define interfaces for all data structures
- Use type inference where appropriate
- Export types from feature modules

#### React Best Practices
- Use functional components with hooks
- Keep components small and focused (< 300 lines)
- Extract complex logic into custom hooks
- Use proper dependency arrays in useEffect
- Memoize expensive calculations with useMemo
- Avoid prop drilling - use Zustand store

#### Import Organization
```typescript
// 1. External dependencies
import { useState } from 'react';
import { create } from 'zustand';

// 2. Internal absolute imports (use path aliases)
import { Button } from '@/shared/components/Button';
import { useAppStore } from '@/shared/store/useAppStore';

// 3. Relative imports
import { classifyImage } from './services/imageClassifier';

// 4. Types
import type { ClassificationResult } from '@/shared/types';

// 5. Styles (if any)
import './styles.css';
```

### Testing Changes
- Test image upload with various formats (PNG, JPG, JPEG)
- Verify ML model predictions are accurate
- Check calculation accuracy against expected results
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Validate responsive design on different screen sizes
- Test dark/light theme switching
- Verify accessibility with screen readers
- Run type checking: `npm run type-check`
- Run linting: `npm run lint`

## Common Tasks

### Adding a New Feature Module

```bash
# 1. Create feature directory structure
mkdir -p app/frontend/src/features/[feature-name]/{components,services,hooks,types}

# 2. Create index.tsx (main export)
touch app/frontend/src/features/[feature-name]/index.tsx

# 3. Define types in types/index.ts
# 4. Add state slice to shared/store/useAppStore.ts
# 5. Create components and services
# 6. Import and use in App.tsx
```

### Adding a New UI Component

```typescript
// app/frontend/src/shared/components/NewComponent.tsx
import { type ReactNode } from 'react';
import clsx from 'clsx';

interface NewComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const NewComponent = ({
  children,
  variant = 'primary',
  className
}: NewComponentProps) => {
  return (
    <div className={clsx(
      'base-styles',
      {
        'variant-primary': variant === 'primary',
        'variant-secondary': variant === 'secondary',
      },
      className
    )}>
      {children}
    </div>
  );
};
```

### Updating ML Models

1. Replace model files in `app/frontend/public/models/[ModelName]/`
2. Update model loading in `features/visual-inspection/services/modelLoader.ts`
3. Update classification logic if needed
4. Test predictions with sample images
5. Update documentation

### Modifying Decision Algorithm

1. Locate calculation functions in `shared/services/decisionEngine.ts`
2. Review original Python implementation for reference
3. Update TypeScript implementation with proper types
4. Add unit tests for new calculations
5. Update threshold values if needed
6. Document changes in comments

### Adding Backend API Endpoints

```typescript
// app/backend/src/routes/example.ts
import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.post('/api/example', async (req: Request, res: Response) => {
  try {
    // Handle request
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### Styling with Tailwind

```typescript
// Use Tailwind utility classes
<div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>

// For dynamic styles, use clsx
import clsx from 'clsx';

<button className={clsx(
  'rounded px-4 py-2 font-medium transition',
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
  }
)}>
  Click me
</button>
```

## Git Workflow

This project uses feature branches for development:

```bash
# Create a new feature branch
git checkout -b claude/<description>-<session-id>

# Make changes and commit
git add .
git commit -m "Descriptive commit message following conventional commits"
git push -u origin claude/<description>-<session-id>

# Create a pull request on GitHub
```

### Branch Naming Convention
`claude/<description>-<session-id>`

Examples:
- `claude/setup-app-architecture-ZRR62`
- `claude/add-pdf-export-ABC123`

### Commit Message Guidelines

Follow conventional commits format:

```
feat: Add PDF export functionality
fix: Resolve image upload bug
docs: Update README with new architecture
refactor: Extract decision logic into service
perf: Optimize TensorFlow.js model loading
test: Add unit tests for LCA calculator
```

## Deployment

### Frontend (Static)
- **Recommended**: Vercel, Netlify, GitHub Pages
- Build command: `cd app/frontend && npm run build`
- Output directory: `app/frontend/dist/`

### Backend (Node.js)
- **Recommended**: Railway, Render, Heroku, Fly.io
- Build command: `cd app/backend && npm run build`
- Start command: `cd app/backend && npm start`
- Environment variables: Set `PORT`, `CORS_ORIGIN`, `NODE_ENV`

### Full Stack Deployment
1. Deploy backend first and note the API URL
2. Update frontend `VITE_API_URL` environment variable
3. Build and deploy frontend

## Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Express](https://expressjs.com/)

### Project References
- [Original Python Framework](https://github.com/MussieBirhane/decision-making-framework) by Mussie Birhane
- [Legacy Implementation](../index.html) - Original p5.js version
- [App Documentation](./app/README.md) - Comprehensive app guide

## Questions to Ask Claude

### Architecture & Design
- "Explain the feature-based architecture and why it's used"
- "How does the Zustand store manage state across features?"
- "Walk me through the data flow from image upload to recommendation"
- "What are the benefits of TypeScript strict mode in this project?"

### Implementation
- "Add a new evaluation criterion to the framework"
- "Implement PDF export for evaluation results"
- "Add user authentication with JWT"
- "Create a dashboard to track multiple evaluations"
- "Add database persistence for saving projects"

### Optimization
- "Improve the TensorFlow.js model loading time"
- "Optimize the bundle size"
- "Add caching for ML predictions"
- "Implement lazy loading for feature modules"

### Debugging
- "Debug why classifications aren't showing up"
- "Fix TypeScript error in decision engine"
- "Resolve CORS issues with backend API"
- "Troubleshoot dark mode not persisting"

### Testing
- "Create unit tests for the decision algorithm"
- "Add integration tests for the visual inspection flow"
- "Set up E2E testing with Playwright"
- "Add snapshot tests for components"

## Important Implementation Notes

### For Claude Developers

**State Management:**
- All feature state lives in Zustand store (`shared/store/useAppStore.ts`)
- Use selectors for optimal re-rendering: `const data = useAppStore((state) => state.visualInspection)`
- Never mutate state directly - use provided setter functions

**ML Model Integration:**
- Models are loaded asynchronously on component mount
- Check `areAllModelsLoaded()` before enabling classification
- Images are preprocessed to 128x128 before classification
- All models expect RGB input (3 channels)

**Decision Algorithm:**
- Must maintain parity with original Python implementation
- Thresholds: Visual 70%, Logistic 75%, Performance 80%
- All three criteria must pass for "Reuse" recommendation
- Optional data (composite, fire protection, etc.) increases max score to 15

**Type Safety:**
- All form values should have proper types (not `any`)
- Use Zod schemas for runtime validation if needed
- Export types from feature modules for reusability
- Prefer interfaces for object shapes, types for unions

**Performance:**
- Use `React.memo()` for expensive components
- Memoize calculations with `useMemo()`
- Debounce user input for real-time calculations
- Lazy load TensorFlow.js models

**Accessibility:**
- All interactive elements need keyboard support
- Images need alt text
- Forms need proper labels and ARIA attributes
- Color contrast must meet WCAG 2.1 AA standards
- Test with screen readers

**Security:**
- Never commit `.env` files
- Sanitize all user inputs
- Use helmet for backend security headers
- Validate file uploads (type, size)
- Implement rate limiting on API endpoints

---

**Last Updated**: 2026-01-19
**Current Branch**: `claude/setup-app-architecture-ZRR62`
**App Version**: 2.0.0 (Modern React Refactor)
**Legacy Version**: 1.0.0 (Original p5.js app available in root)
