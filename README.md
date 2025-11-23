# ACF Final Exam Preparation System

A React-based adaptive tutoring system for FINC440 Advanced Corporate Finance final exam preparation. This system helps students achieve A-level performance (95%+) through archetype-based pattern recognition and systematic problem-solving workflows.

## 🎯 Core Philosophy

This is **NOT about memorizing theory**. It's about **operationalizing the 5-Step Universal Workflow** under exam pressure. The system emphasizes:

- **Archetype Recognition Speed** (<30 seconds)
- **Tier 1 Prioritization** (80% effort on 80% of points)
- **Template Execution** (systematic use of Excel + PowerPoint resources)
- **Hybrid Question Decomposition** (breaking multi-archetype problems into stages)

## 📁 Project Structure

```
ACF-Exam-Prep/
├── src/
│   ├── components/
│   │   ├── reconnaissance/    # Exam reconnaissance tools
│   │   ├── practice/          # Practice problem interface
│   │   └── review/            # Performance tracking & gap analysis
│   ├── utils/
│   │   ├── archetypeScanner.js    # Core pattern recognition
│   │   ├── keywordMatcher.js      # Keyword-to-archetype mapping
│   │   └── workflowEngine.js      # 5-step workflow generator
│   ├── data/
│   │   ├── archetype-signals.json    # 10 archetypes + 7 themes
│   │   ├── problems-index.json       # Mock exams catalog
│   │   ├── keyword-mappings.json     # Keyword database
│   │   └── tier-definitions.json     # Tier 1/2 classification
│   └── hooks/                 # Custom React hooks
├── public/
│   ├── source-materials/
│   │   ├── Corporate_Finance_Templates.xlsx
│   │   ├── pdfs/              # Mock finals & past exams
│   │   └── Mock_Solutions.md
│   └── assets/
├── docs/                      # Documentation
└── config/                    # Webpack & Babel configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Excel (for template integration)
- Source materials:
  - `Corporate_Finance_Templates.xlsx`
  - Mock final PDFs
  - ACF Exam Playbook (PowerPoint)

### Installation

```bash
# Clone or navigate to project directory
cd C:\dev\School\ACF\ACF-Exam-Prep

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### First Run Setup

1. Place your source materials in `public/source-materials/`:
   - Excel templates
   - PDF mock exams
   - Solutions markdown files

2. Update `.env` if needed (copy from `.env.example`)

## 📚 Key Features

### 1. Reconnaissance Mode
- Paste any exam problem
- Instant archetype identification (<30s)
- Automatic hybrid detection
- Resource mapping (Excel tabs + Playbook slides)
- Time allocation strategy

### 2. Practice Mode
- Full mock exam simulations
- Tier-filtered problem sets
- Real-time workflow guidance
- Solution checking

### 3. Review Mode
- Performance dashboard
- Gap analysis by archetype
- Mastery level tracking
- Time management analytics

## 🎓 The 10 Archetypes

### Tier 1 (80% of exam points)
- **A1**: Capital Structure
- **A2A**: Debt Overhang
- **A2B**: Adverse Selection
- **A3**: CAPM & Discount Rates
- **A4**: Distress & Priority
- **A5**: Payout Policy
- **A6**: Risk Management

### Tier 2 (20% of exam points)
- **A7**: Valuation Multiples
- **A8**: Real Options
- **A9**: Diversification
- **A10**: Options Theory

## 📖 The 5-Step Universal Workflow

Every problem follows this sequence:

1. **IDENTIFY** → Scan keywords → Match archetype → Note tier + hybrid
2. **EXTRACT** → What's the core question? → Write margin note
3. **MAP** → Quant (Excel?) or Conceptual (Playbook + 3-5 bullets)?
4. **EXECUTE** → Follow archetype recipe → Solve in stages if hybrid
5. **CHECK** → Sign + magnitude + theory link + implications

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint codebase

### Adding New Archetypes

1. Update `src/data/archetype-signals.json`
2. Add keywords to `src/data/keyword-mappings.json`
3. Update Excel templates if quantitative
4. Add to Playbook if conceptual

### Adding Mock Exams

1. Place PDF in `public/source-materials/pdfs/`
2. Add entry to `src/data/problems-index.json`
3. Tag with appropriate archetypes

## 📊 Success Metrics

You're exam-ready when you achieve:

- ✅ **Tier 1 Recognition**: 10/10 correct IDs in <30 seconds
- ✅ **5-Step Fluency**: Complete workflow without prompting
- ✅ **Excel Efficiency**: Any Tier 1 problem in <12 minutes
- ✅ **Conceptual Clarity**: 3-5 bullet structure (>85% on Q2)
- ✅ **Hybrid Competency**: 3/3 multi-archetype problems solved
- ✅ **Time Management**: 180-min simulation with >85% accuracy

## 🤝 Contributing

This is a personal study tool. If you'd like to adapt it for your own use:

1. Fork the repository
2. Update archetype definitions for your course
3. Replace source materials with your own
4. Customize the tier system as needed

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

Built for FINC440 Advanced Corporate Finance students pursuing exam excellence through systematic, archetype-based preparation.

---

**Target Score**: 95%+ | **Time Limit**: 180 minutes | **Focus**: Tier 1 Archetypes
