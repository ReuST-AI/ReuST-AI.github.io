# ReuST - Structural Steel Reuse Framework

A modern, production-grade decision-making framework for efficient end-of-life scenarios of structural steel elements. This application evaluates the reuse potential of existing steel structures considering logistic feasibility, structural visual inspection, and structural performance, with built-in life cycle assessment capabilities.

## Features

- **🖼️ Automated Image Classification**: CNN-based analysis using TensorFlow.js for corrosion, connection types, and damage assessment
- **📊 Multi-Criteria Decision Making**: Evaluates three key aspects:
  - Structural Visual Inspection (70% threshold)
  - Logistic Feasibility (75% threshold)
  - Structural Performance (80% threshold)
- **♻️ Life Cycle Assessment**: Simplified cradle-to-cradle embodied carbon computation
- **🎨 Modern UI/UX**: Responsive design with dark/light theme support
- **🔒 Type-Safe**: Full TypeScript implementation with strict mode
- **⚡ Performance Optimized**: Fast loading with code splitting and lazy loading

## Architecture

This project follows a **feature-based architecture** with clear separation of concerns:

```
app/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── features/     # Feature modules (Visual Inspection, Logistic, Performance, LCA, Results)
│   │   ├── shared/       # Reusable components, hooks, store, types, utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── public/
│       └── models/       # TensorFlow.js ML models
│
├── backend/              # Node.js + Express + TypeScript
│   └── src/
│       └── server.ts     # Express server with health checks
│
└── package.json          # Workspace configuration
```

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **ML Framework**: TensorFlow.js
- **Form Management**: React Hook Form + Zod validation
- **Code Quality**: ESLint + Prettier

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Type Safety**: TypeScript
- **Security**: Helmet, CORS

## Getting Started

### Prerequisites

- Node.js ≥18.0.0
- npm ≥9.0.0

### Installation

```bash
# Install all dependencies for frontend and backend
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### Development

```bash
# Run frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend at http://localhost:3000
npm run dev:backend   # Backend at http://localhost:5000
```

### Production Build

```bash
# Build both frontend and backend
npm run build

# Or build separately:
npm run build:frontend
npm run build:backend
```

## Project Structure Details

### Feature Modules

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/      # Feature-specific components
├── services/        # Business logic and API calls
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── index.tsx       # Main feature export
```

**Available Features:**
- `visual-inspection/` - Image upload, ML classification, manual input
- `logistic-feasibility/` - Logistic parameters evaluation
- `structural-performance/` - Performance criteria assessment
- `lifecycle-assessment/` - Carbon footprint calculation
- `results/` - Decision recommendation display

### Shared Resources

```
shared/
├── components/     # Reusable UI (Button, Input, Select, Slider, etc.)
├── store/         # Zustand global state management
├── services/      # Shared business logic (decision engine)
├── theme/         # Theme provider and dark/light mode
├── types/         # Shared TypeScript definitions
└── utils/         # Utility functions
```

## Key Components

### ML Model Integration

Three TensorFlow.js models provide automated classification:
- **Corrosion Model**: Detects corroded vs. not corroded elements
- **Connection Model**: Identifies bolted vs. welded connections
- **Damage Model**: Assesses damaged vs. not damaged status

Models are loaded asynchronously and cached for performance.

### Decision Algorithm

The framework uses a weighted scoring system:

```typescript
Visual Inspection = f(corrosion, damage, connections, optional_data)
Logistic Feasibility = f(weight, handling, infrastructure, protection, dismantling, storage)
Structural Performance = f(data_quality, construction_period, maintenance, purpose, testing)

Overall Recommendation = All three criteria pass their thresholds ? "Reuse" : "Recycle"
```

### State Management

Zustand store manages:
- Visual inspection data and ML results
- Logistic feasibility parameters
- Structural performance data
- LCA inputs and results
- Evaluation outcomes

## Development Guidelines

### Code Style

- **Naming Conventions**:
  - camelCase for functions and variables
  - PascalCase for React components
  - kebab-case for file/folder names
- **Import Paths**: Use path aliases (`@/`, `@/features`, `@/shared`)
- **Type Safety**: No `any` types - explicit typing required

### Adding a New Feature

1. Create feature directory: `features/[feature-name]/`
2. Define types in `types/index.ts`
3. Add state slice to Zustand store
4. Create components and services
5. Export from `index.tsx`
6. Import in `App.tsx`

## Performance Optimization

- Code splitting for React and TensorFlow.js
- Lazy loading of ML models
- Memoization for expensive calculations
- Optimized image processing
- Development proxy to avoid CORS issues

## Accessibility

- WCAG 2.1 AA compliant
- Semantic HTML
- ARIA labels for screen readers
- Full keyboard navigation support

## Testing

```bash
# Run tests (to be implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Deployment

### Frontend
- Build output: `frontend/dist/`
- Deploy to: Vercel, Netlify, GitHub Pages, or any static hosting

### Backend
- Build output: `backend/dist/`
- Deploy to: Railway, Render, Heroku, or any Node.js hosting

## Credits

This web app is based on the Python code written by [Mussie Birhane](https://github.com/MussieBirhane).

See the [original decision-making framework](https://github.com/MussieBirhane/decision-making-framework) for more information.

## Disclaimer

**ReuST is currently under development and is intended for testing purposes only.** As the accuracy and reliability of the results are limited, the provided results should not be used in real-world scenarios. Use the results with caution and always consult with relevant experts for reliable assessments.

## License

See LICENSE file for details.

## Contact

For questions or support, please contact: alper.kanyilmaz@polimi.it
