#!/bin/bash

# Root directories
mkdir -p src/{components,utils,data,hooks,styles}
mkdir -p public/{source-materials/pdfs,assets}
mkdir -p docs
mkdir -p config

# Source subdirectories
mkdir -p src/components/{reconnaissance,practice,review}
mkdir -p src/utils/{excel,archetype,scoring}

# Create all necessary files
touch src/index.js
touch src/App.jsx
touch src/index.css

# Components
touch src/components/reconnaissance/ReconView.jsx
touch src/components/reconnaissance/Scanner.jsx
touch src/components/reconnaissance/HybridSequencer.jsx
touch src/components/reconnaissance/ExcelLauncher.jsx
touch src/components/reconnaissance/ArchetypeMapper.jsx
touch src/components/reconnaissance/TimeAllocator.jsx

touch src/components/practice/ProblemViewer.jsx
touch src/components/practice/SolutionCheck.jsx
touch src/components/practice/WorkflowGuide.jsx
touch src/components/practice/TierFilter.jsx

touch src/components/review/PerformanceTracker.jsx
touch src/components/review/GapAnalysis.jsx
touch src/components/review/MasteryDashboard.jsx

# Utils
touch src/utils/archetypeScanner.js
touch src/utils/keywordMatcher.js
touch src/utils/workflowEngine.js
touch src/utils/excel/excelBridge.js
touch src/utils/excel/formulaValidator.js
touch src/utils/archetype/archetypeDefinitions.js
touch src/utils/archetype/tierClassifier.js
touch src/utils/scoring/pointCalculator.js
touch src/utils/scoring/timeTracker.js

# Data files
touch src/data/problems-index.json
touch src/data/archetype-signals.json
touch src/data/mock-exams-catalog.json
touch src/data/keyword-mappings.json
touch src/data/tier-definitions.json

# Hooks
touch src/hooks/useArchetypeRecognition.js
touch src/hooks/useExamTimer.js
touch src/hooks/useProblemState.js

# Config
touch config/webpack.config.js
touch config/babel.config.js

# Package management
touch package.json
touch package-lock.json
touch .gitignore
touch .env.example

# Documentation
touch docs/SETUP.md
touch docs/USAGE.md
touch docs/ARCHETYPE_GUIDE.md
touch docs/EXCEL_INTEGRATION.md

# Root level files
touch README.md
touch LICENSE

echo "Directory structure created successfully!"
