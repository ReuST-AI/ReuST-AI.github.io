# CLAUDE.MD

## Project Overview

**ReuST** (Reuse of Structural Steel) is a web-based decision-making framework for evaluating efficient end-of-life scenarios of structural steel elements. The application assesses the reuse potential of existing steel structures by considering:

- **Logistic feasibility**
- **Structural visual inspection** (with automated CNN-based image classification)
- **Structural performance**
- **Life cycle assessment (LCA)** for end-of-life scenarios

This project is based on the Python code written by [Mussie Birhane](https://github.com/MussieBirhane/decision-making-framework), converted into an interactive web application.

## Technology Stack

- **Frontend Framework**: p5.js (v1.4.1) - for interactive visualizations
- **Machine Learning**: TensorFlow.js - for CNN-based image classification
- **Languages**: JavaScript, HTML5, CSS3
- **Hosting**: GitHub Pages
- **ML Models**:
  - ConnectionModel - Analyzes connection types in steel structures
  - CorrosionModel - Detects corrosion levels
  - DamageModel - Assesses structural damage

## Project Structure

```
ReuST-AI.github.io/
├── index.html          # Main application interface
├── sketch.js           # p5.js sketch and main application logic
├── style.css           # Application styles
├── README.md           # Project readme
├── models/             # TensorFlow.js model files
│   ├── ConnectionModel/
│   ├── CorrosionModel/
│   └── DamageModel/
├── assets/             # Images, icons, and static resources
└── .vscode/            # VS Code configuration
```

## Key Files

### index.html
The main HTML structure containing:
- Image upload interface for structural inspection
- Form inputs for structural parameters
- Results visualization containers
- Library imports (p5.js, TensorFlow.js)

### sketch.js
Core application logic including:
- TensorFlow.js model loading and inference
- Image processing and classification
- Decision-making algorithm implementation
- Performance calculations
- p5.js visualizations

### style.css
Application styling for the user interface

## How Claude Can Help

### Code Understanding
- Explain the decision-making algorithm logic
- Analyze the ML model integration
- Review the structural performance calculations
- Document the image classification pipeline

### Development Tasks
- Add new features to the evaluation framework
- Improve the UI/UX
- Optimize TensorFlow.js model loading and inference
- Enhance image processing capabilities
- Add new visualization components

### Testing & Debugging
- Debug JavaScript issues
- Test ML model predictions
- Validate calculation accuracy
- Check browser compatibility

### Documentation
- Generate technical documentation
- Create user guides
- Document API integrations
- Explain calculation methodologies

## Development Guidelines

### Running Locally

Since this is a static web application, you can run it using any local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using VS Code Live Server extension
# Right-click index.html and select "Open with Live Server"
```

Then navigate to `http://localhost:8000` in your browser.

### Code Style
- Use clear, descriptive variable names
- Comment complex algorithms and calculations
- Keep functions focused and modular
- Follow existing code formatting patterns

### Testing Changes
- Test image upload functionality with various image formats
- Verify ML model predictions are accurate
- Check calculations against expected results
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Validate responsive design on different screen sizes

## Common Tasks

### Updating ML Models
1. Replace model files in the respective `models/` subdirectory
2. Update model loading code in `sketch.js` if model architecture changed
3. Test predictions with sample images
4. Update documentation with any new model capabilities

### Adding New Features
1. Check existing code structure in `sketch.js`
2. Add HTML elements in `index.html` if needed
3. Update styles in `style.css`
4. Test thoroughly before committing
5. Update this CLAUDE.MD if significant changes are made

### Modifying Calculations
1. Locate the relevant calculation function in `sketch.js`
2. Review the original Python implementation for reference
3. Update the JavaScript implementation
4. Test with known input/output pairs
5. Document the calculation methodology

### Styling Updates
1. Modify `style.css` for global styles
2. Test changes in the browser's developer tools first
3. Check responsive behavior at different breakpoints
4. Ensure accessibility standards are maintained

## Git Workflow

This project uses feature branches for development:

```bash
# Current development branch
git checkout claude/update-claude-md-g2ag1

# After making changes
git add .
git commit -m "Descriptive commit message"
git push -u origin claude/update-claude-md-g2ag1
```

Branch naming convention: `claude/<description>-<session-id>`

## Deployment

This project is hosted on GitHub Pages. Changes pushed to the main branch are automatically deployed.

## Resources

- [Original Python Framework](https://github.com/MussieBirhane/decision-making-framework)
- [p5.js Documentation](https://p5js.org/reference/)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Questions to Ask Claude

When working on this project, you can ask Claude:

- "Explain how the image classification pipeline works"
- "How are the structural performance calculations implemented?"
- "Add a feature to export results as PDF"
- "Improve the loading time for TensorFlow.js models"
- "Debug why images aren't uploading correctly"
- "Add validation for user input fields"
- "Optimize the decision-making algorithm"
- "Create unit tests for calculation functions"

## Notes for Claude

- The application uses TensorFlow.js for in-browser ML inference
- Models are loaded asynchronously and may affect initial page load time
- Image processing happens client-side
- All calculations should match the original Python implementation
- The app is designed for civil/structural engineers evaluating steel reuse
- User experience should be intuitive with clear guidance throughout the process

---

**Last Updated**: 2026-01-19
**Claude Session**: claude/update-claude-md-g2ag1
