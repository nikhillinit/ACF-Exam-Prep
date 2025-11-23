# Complete File Index - ACF Exam Prep System

## 🎯 Essential Documents (Read First)

| Document | Purpose | Time |
|----------|---------|------|
| **START_HERE.md** | Absolute first read - deployment path | 2 min |
| **QUICK_START.md** | 5-minute setup guide | 3 min |
| **README.md** | Project overview & philosophy | 5 min |
| **SYSTEM_OVERVIEW.md** | Complete architecture | 15 min |

## 📚 Documentation Files

### Setup & Deployment
- `DEPLOYMENT_GUIDE.md` - Windows deployment instructions
- `docs/SETUP.md` - Detailed installation guide
- `WINDOWS_SETUP.bat` - Automated setup script

### Usage & Operation
- `docs/USAGE.md` - Complete operational guide (MUST READ)
- `docs/EXCEL_INTEGRATION.md` - Excel template usage
- `docs/ARCHETYPE_GUIDE.md` - Detailed archetype reference

### Reference
- `DIRECTORY_STRUCTURE.txt` - File organization (comprehensive)
- `VISUAL_TREE.txt` - Directory tree with icons
- `PROJECT_SUMMARY.txt` - System specifications
- `FILE_LIST.txt` - Complete file listing

## 💻 Source Code

### Main Application
- `src/index.js` - React entry point
- `src/App.jsx` - Main app component
- `src/index.css` - Global styles

### Core Logic (The Brain)
- `src/utils/archetypeScanner.js` - **🔥 Pattern recognition engine**
- `src/utils/keywordMatcher.js` - Keyword-to-archetype mapping
- `src/utils/workflowEngine.js` - 5-step workflow generator

### Components - Reconnaissance
- `src/components/reconnaissance/ReconView.jsx` - **🔥 Main interface**
- `src/components/reconnaissance/Scanner.jsx` - Results display
- `src/components/reconnaissance/HybridSequencer.jsx` - Hybrid solver
- `src/components/reconnaissance/ArchetypeMapper.jsx` - Resource mapper
- `src/components/reconnaissance/TimeAllocator.jsx` - Time calculator
- `src/components/reconnaissance/ExcelLauncher.jsx` - Excel integration

### Components - Practice
- `src/components/practice/ProblemViewer.jsx` - Problem display
- `src/components/practice/SolutionCheck.jsx` - Answer verification
- `src/components/practice/WorkflowGuide.jsx` - 5-step overlay
- `src/components/practice/TierFilter.jsx` - Tier 1/2 filter

### Components - Review
- `src/components/review/PerformanceTracker.jsx` - Metrics dashboard
- `src/components/review/GapAnalysis.jsx` - Weakness identification
- `src/components/review/MasteryDashboard.jsx` - Progress visualization

### Utilities - Excel
- `src/utils/excel/excelBridge.js` - File I/O handler
- `src/utils/excel/formulaValidator.js` - Formula audit tool

### Utilities - Archetype
- `src/utils/archetype/archetypeDefinitions.js` - Archetype specs
- `src/utils/archetype/tierClassifier.js` - Tier 1/2 classification

### Utilities - Scoring
- `src/utils/scoring/pointCalculator.js` - Score computation
- `src/utils/scoring/timeTracker.js` - Time management

### Custom Hooks
- `src/hooks/useArchetypeRecognition.js` - Recognition hook
- `src/hooks/useExamTimer.js` - Timer hook
- `src/hooks/useProblemState.js` - Problem state management

## 💾 Data Files (The Knowledge Base)

- `src/data/archetype-signals.json` - **🔥 10 archetypes + 7 themes**
- `src/data/keyword-mappings.json` - **🔥 Keyword database**
- `src/data/problems-index.json` - Mock exam catalog
- `src/data/tier-definitions.json` - Tier specifications
- `src/data/mock-exams-catalog.json` - Exam metadata

## ⚙️ Configuration

- `package.json` - Dependencies & scripts
- `config/webpack.config.js` - Webpack configuration
- `config/babel.config.js` - Babel configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment template

## 🌐 Public Assets

- `public/index.html` - HTML entry point
- `public/assets/` - Images, icons (empty initially)
- `public/source-materials/` - **📊 YOUR MATERIALS GO HERE**
  - `Corporate_Finance_Templates.xlsx` - Excel workbook (add this!)
  - `Mock_Solutions.md` - Solution docs (add this!)
  - `pdfs/` - Exam PDFs (add these!)

## 📊 Directory Structure

```
ACF-Exam-Prep/
├── 📄 Documentation (14 files)
│   ├── START_HERE.md ⭐
│   ├── QUICK_START.md ⭐
│   ├── README.md
│   ├── SYSTEM_OVERVIEW.md
│   └── docs/ (4 guides)
│
├── 💻 Source Code (50+ files)
│   ├── src/
│   │   ├── components/ (18 files)
│   │   ├── utils/ (11 files)
│   │   ├── data/ (5 JSON files) ⭐
│   │   └── hooks/ (3 files)
│
├── ⚙️ Configuration (5 files)
│   ├── package.json
│   ├── webpack.config.js
│   └── babel.config.js
│
└── 🌐 Public (3 folders)
    ├── index.html
    └── source-materials/ ⭐ ADD YOUR FILES HERE
```

## 🔥 Critical Files (Top 10)

1. **START_HERE.md** - Begin here
2. **QUICK_START.md** - 5-min setup
3. **src/utils/archetypeScanner.js** - Core recognition engine
4. **src/data/archetype-signals.json** - 10 archetypes defined
5. **src/data/keyword-mappings.json** - Keyword database
6. **src/components/reconnaissance/ReconView.jsx** - Main UI
7. **docs/USAGE.md** - Complete operational guide
8. **package.json** - Dependencies
9. **public/source-materials/** - Your materials folder
10. **SYSTEM_OVERVIEW.md** - Architecture reference

## 📋 Setup Checklist

- [ ] Copy folder to `C:\dev\School\ACF\ACF-Exam-Prep`
- [ ] Run `npm install` (2-3 minutes)
- [ ] Add `Corporate_Finance_Templates.xlsx` to `public/source-materials/`
- [ ] Add mock exam PDFs to `public/source-materials/pdfs/`
- [ ] Copy `.env.example` to `.env`
- [ ] Run `npm start`
- [ ] Test reconnaissance with sample problem
- [ ] Verify all 10 archetypes load correctly

## 🎯 Reading Order (Recommended)

**Day 1: Setup (30 minutes)**
1. START_HERE.md (2 min)
2. QUICK_START.md (3 min)
3. Deploy system (5 min)
4. Test reconnaissance (5 min)
5. README.md (5 min)
6. docs/USAGE.md (10 min)

**Day 2: Deep Dive (60 minutes)**
7. SYSTEM_OVERVIEW.md (15 min)
8. docs/EXCEL_INTEGRATION.md (15 min)
9. docs/ARCHETYPE_GUIDE.md (20 min)
10. Practice with actual problems (remainder)

**Ongoing: Reference**
11. DIRECTORY_STRUCTURE.txt (as needed)
12. PROJECT_SUMMARY.txt (as needed)

## 🔍 Finding What You Need

| Need | File |
|------|------|
| Quick setup | QUICK_START.md |
| How to use | docs/USAGE.md |
| Excel help | docs/EXCEL_INTEGRATION.md |
| Architecture | SYSTEM_OVERVIEW.md |
| File locations | DIRECTORY_STRUCTURE.txt |
| Deployment | DEPLOYMENT_GUIDE.md |
| Troubleshooting | QUICK_START.md (bottom) |
| Archetype details | docs/ARCHETYPE_GUIDE.md |

## 💡 Pro Tips

1. **Start Here**: Always begin with START_HERE.md
2. **Core Files**: Focus on the 🔥 marked files first
3. **Data Files**: Review JSON files to understand system logic
4. **Source Materials**: Add your files before first run
5. **Documentation**: Read docs/USAGE.md before heavy use

## 📦 Package Contents

- **Total Files**: ~70 files
- **React Components**: 18 files
- **Utility Functions**: 11 files
- **Data Files**: 5 JSON files
- **Documentation**: 14 markdown files
- **Configuration**: 5 files
- **Lines of Code**: ~5,000 LOC

## 🆘 Quick Help

**Issue?** Check:
1. QUICK_START.md → Troubleshooting section
2. DEPLOYMENT_GUIDE.md → Common issues
3. docs/USAGE.md → Operational problems
4. Console errors → Browser developer tools

---

**You now have everything you need!** 🚀

Next step: Open **START_HERE.md** and begin your 5-minute deployment.
