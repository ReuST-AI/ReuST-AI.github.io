# CLAUDE.MD

## ⚠️ IMPORTANT: Architecture Refactoring

**This application has been refactored from vanilla JavaScript to React + Vite + TypeScript** (Version 2.0.0).

See **[REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)** for complete details on the new architecture, implementation status, and next steps.

### Current Status
✅ **Completed**: Core architecture, type system, state management, utilities, hooks, and UI component framework
⏳ **In Progress**: Feature component implementation
📚 **Documentation**: See REFACTORING_GUIDE.md for comprehensive details

---

## Project Overview

**ReuST** (Reuse Steel) is a web-based decision-making framework for evaluating efficient end-of-life scenarios of structural steel elements. The application helps assess the reuse potential of existing steel structures by considering:

- Logistic feasibility
- Structural visual inspection (with CNN-based image classification)
- Structural performance
- Life cycle assessment (LCA)

This project is a web implementation based on the Python code written by [Mussie Birhane](https://github.com/MussieBirhane). See the [original framework](https://github.com/MussieBirhane/decision-making-framework) for more information.

## Tech Stack (v2.0.0)

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.3
- **Language**: TypeScript 5.6.3
- **State Management**: Zustand 4.5.5
- **Machine Learning**: TensorFlow.js 4.21.0
- **Styling**: CSS Modules + Global CSS
- **Fonts**: Google Fonts (Roboto Condensed)
- **Deployment**: GitHub Pages

### Previous Version (v1.0.0)
- Vanilla JavaScript with p5.js
- Direct DOM manipulation
- Global state in variables
- See `index-old.html` and `sketch.js` (legacy files)

## Project Structure (v2.0.0)

```
/
├── src/                   # Source code (TypeScript + React)
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Dropdown.tsx & .module.css
│   │   │   └── FormInput.tsx & .module.css
│   │   └── features/     # Feature-specific components (to be implemented)
│   ├── hooks/            # Custom React hooks
│   │   ├── useMLModels.ts
│   │   ├── useImageClassification.ts
│   │   └── useDisclaimer.ts
│   ├── store/            # Zustand state management
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Pure utility functions
│   │   ├── calculations.ts  # Performance & LCA calculations
│   │   ├── ml.ts            # TensorFlow.js utilities
│   │   └── validation.ts    # Form validation
│   ├── constants/        # Configuration constants
│   │   └── index.ts
│   ├── styles/           # Global styles
│   │   └── global.css
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type declarations
├── models/               # TensorFlow.js model files (public)
│   ├── CorrosionModel/
│   ├── ConnectionModel/
│   └── DamageModel/
├── assets/               # Static assets (public)
├── index.html            # Vite HTML template
├── index-old.html        # Legacy vanilla JS version (preserved)
├── sketch.js             # Legacy JavaScript (preserved)
├── style.css             # Legacy CSS (preserved)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── REFACTORING_GUIDE.md  # Detailed refactoring documentation
├── CLAUDE.MD             # This file
└── README.md             # Basic project information
```

## Core Components

### 1. Structural Visual Inspection (index.html:28-133)

**Purpose**: Automated assessment of structural elements using CNN-based image classification.

**Features**:
- Drag-and-drop or click-to-upload interface for images
- Three ML models for classification:
  - **Corrosion Model**: Detects if elements are corroded or not
  - **Connection Model**: Identifies bolted vs. welded connections
  - **Damage Model**: Assesses if elements are damaged or distorted

**Manual Input Option**: If images are unavailable, users can manually input:
- Connection type (slider from fully welded to fully bolted)
- Corrosion status
- Damage/distortion status

**Optional Building Information**:
- Steel-concrete composite connections
- Fire protection presence
- Availability of sufficient reusable elements
- Standard geometric check compliance

### 2. Logistic Feasibility (index.html:135-194)

**Purpose**: Evaluates the practical aspects of reusing structural elements.

**Parameters**:
- Element weight categories (very light < 0.1 ton, light 0.1-0.2 ton, heavy 0.2-0.5 ton, very heavy > 0.5 ton)
- Ease of handling, transport, storage, and processing
- Infrastructure availability for dismantle-sort-repair
- Special protection requirements for transportation
- Demolition work compatibility
- Storage availability

### 3. Structural Performance (index.html:196-250)

**Purpose**: Assesses mechanical and physical performance parameters.

**Parameters**:
- Data quality (none, drawings only, drawings + calculation report, all documentation)
- Construction period (pre/post 2005)
- Maintenance history
- Element uniqueness for its purpose
- Sample testing possibility

### 4. Life Cycle Assessment (index.html:252-345)

**Purpose**: Computes embodied carbon using a cradle-to-cradle approach.

**Weight Input Options**:
1. **Single Element Weight**: Weight (kg) × Number of items
2. **Element Dimensions**: Height (mm) × Width (mm) × Length (m) × Unit weight (kg/m³) × Quantity
3. **Bulk Material Weight**: Total weight in kg

**Carbon Coefficients**:
- Product stage A1-A3: Default 1.13 kgCO₂e
- End of life stage C1-C4: Default 0.018 kgCO₂e
- Reuse/recycle/recovery stage D: Default -0.413 kgCO₂e

### 5. End-of-Life Scenario Suggestion (index.html:347-369)

**Purpose**: Provides recommendations based on weighted sum of all criteria.

**Thresholds**:
- Logistic feasibility: 75%
- Structural visual inspection: 70%
- Structural performance: 80%

## Key JavaScript Functions (sketch.js)

### ML Model Loading
```javascript
function preload() {
  CORROSION_MODEL = tf.loadGraphModel("./models/CorrosionModel/model.json");
  CONNECTION_MODEL = tf.loadGraphModel("./models/ConnectionModel/model.json");
  DAMAGE_MODEL = tf.loadGraphModel("./models/DamageModel/model.json");
}
```

### Image Classification
- `classifyImages()`: Main function for processing uploaded images
- `dropHandler(ev)`: Handles drag-and-drop file uploads
- Image preprocessing for CNN models

### Carbon Calculation
- `calculateCarbon()`: Computes embodied carbon based on user inputs
- Supports three different weight input methods

### UI Interaction
- `toggleOptions(id)`: Shows/hides conditional input fields
- Dynamic form validation and state management

## Decision-Making Algorithm

The framework evaluates reuse potential through a weighted scoring system:

1. **Collect Data**: User inputs parameters across all four categories
2. **Process Visual Inspection**: If images provided, CNN models classify corrosion, connection type, and damage
3. **Calculate Scores**: Each category receives a percentage score based on weighted parameters
4. **Compare to Thresholds**: Scores are compared against predefined thresholds
5. **Generate Recommendation**: System suggests the most efficient end-of-life scenario (reuse, recycle, or disposal)

## Model Information

**Classification Models**:
- All three models (Corrosion, Connection, Damage) use binary classification
- Models are loaded as TensorFlow.js GraphModels
- Located in `/models/` directory with `model.json` files

**Class Names**:
- Corrosion: ["Corroded", "Not Corroded"]
- Connection: ["Bolted", "Welded"]
- Damage: ["Damaged", "Not Damaged"]

## Development Notes

### Important Considerations

1. **Development Status**: The application displays a disclaimer on load stating it's under development and intended for testing purposes only. Results should not be used in real-world scenarios without expert consultation.

2. **Image Processing**: The app accepts multiple images and processes them through all three CNN models simultaneously.

3. **Checkbox Logic**: Various checkboxes control conditional form sections. When images are uploaded, manual input options are disabled.

4. **Responsive Design**: The interface uses a dropdown accordion pattern for each major section.

### Code Patterns

- **Form Validation**: Dropdowns default to "Please select" to ensure user action
- **Dynamic UI**: Sections expand/collapse based on user selections
- **Loader States**: Visual feedback during image classification
- **Error Handling**: File type validation for image uploads

### Working with This Codebase

When modifying this project:

1. **ML Models**: Model files are preloaded; ensure paths remain correct if restructuring
2. **Weights/Thresholds**: Performance calculation weights are defined in `sketch.js`
3. **Styling**: All styles are in `style.css`; the app uses custom CSS (no framework)
4. **Dependencies**: External dependencies are loaded via CDN (p5.js, TensorFlow.js, Font Awesome)

## Contact

Project maintainer: alper.kanyilmaz@polimi.it

## Deployment

This is a static site hosted on GitHub Pages at: https://reust-ai.github.io/

## Current Branch

Development is happening on branch: `claude/update-claude-md-Z9bpy`


## New Architecture (v2.0.0)

### Key Benefits
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Maintainability**: Clean separation of concerns and modular structure
- **State Management**: Centralized Zustand store with predictable updates
- **Reusability**: Component-based architecture with reusable UI elements
- **Testability**: Pure functions and isolated components
- **Developer Experience**: Hot module replacement, fast builds, better tooling

### Core Modules

#### 1. Type System (`src/types/index.ts`)
Complete TypeScript definitions for all data structures including ML models, form data, assessments, and state.

#### 2. Constants (`src/constants/index.ts`)
Centralized configuration for:
- ML model paths and class names
- Performance thresholds (70%, 75%, 80%)
- Calculation weights
- Form options
- UI text

#### 3. Utilities
- **calculations.ts**: Pure functions for performance scoring and LCA
- **ml.ts**: TensorFlow.js model loading and image classification
- **validation.ts**: Form validation logic

#### 4. State Management (`src/store/index.ts`)
Zustand store managing:
- Image data and classification results
- Form data for all sections
- Assessment results
- ML models
- UI state

#### 5. Custom Hooks
- **useMLModels**: Loads and manages TensorFlow.js models
- **useImageClassification**: Handles file uploads and classification
- **useDisclaimer**: Manages disclaimer display

#### 6. UI Components
- **Dropdown**: Reusable accordion component
- **FormInput**: Select, number, checkbox, and slider inputs
- Additional components in development (see REFACTORING_GUIDE.md)

### Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Next Steps

See **[REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)** for:
- Complete implementation status
- Detailed architecture patterns
- Feature component implementation guide
- Testing and deployment instructions

---

**Version**: 2.0.0 (React + Vite + TypeScript)  
**Last Updated**: 2025-12-30  
**Original Version**: See `index-old.html` and `sketch.js`

