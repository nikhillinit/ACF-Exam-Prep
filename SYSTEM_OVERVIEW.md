# ACF Exam Prep System - Complete Overview

## 🎯 What Is This System?

A React-based adaptive tutoring system designed to help FINC440 students achieve A-level performance (95%+) on the Advanced Corporate Finance final exam through:

1. **Archetype-Based Pattern Recognition** - Identify question types in <30 seconds
2. **Tier 1/2 Prioritization** - Focus 80% of effort where 80% of points come from
3. **5-Step Universal Workflow** - Systematic problem-solving methodology
4. **Hybrid Question Decomposition** - Break complex multi-archetype problems into stages

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Reconnaissance│  │   Practice   │  │    Review    │      │
│  │     Mode      │  │     Mode     │  │     Mode     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CORE LOGIC LAYER                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  archetypeScanner.js                                │     │
│  │  ├─ Keyword extraction                              │     │
│  │  ├─ Pattern matching                                │     │
│  │  ├─ Confidence scoring                              │     │
│  │  └─ Hybrid detection                                │     │
│  └────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  workflowEngine.js                                  │     │
│  │  └─ 5-step workflow generation                      │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER (JSON)                       │
│  • archetype-signals.json    → 10 archetypes + 7 themes     │
│  • keyword-mappings.json     → Keyword database              │
│  • problems-index.json       → Mock exam catalog             │
│  • tier-definitions.json     → Tier 1/2 specifications       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL RESOURCES                         │
│  • Corporate_Finance_Templates.xlsx  → 11-sheet workbook     │
│  • ACF_Exam_Playbook.pptx           → Conceptual frameworks  │
│  • Mock exam PDFs                    → Practice materials    │
└─────────────────────────────────────────────────────────────┘
```

## 🎓 The 10 Archetypes

### Tier 1 (80% of exam points)
| ID | Name | Keywords | Excel Tab | Time | Points |
|----|------|----------|-----------|------|--------|
| A1 | Capital Structure | debt, default, coupon, tax shield | 1_Capital_Structure | 12min | 15-25 |
| A2A | Debt Overhang | multi-state, underinvestment | 2_Multi_State_Project | 15min | 20-30 |
| A2B | Adverse Selection | asymmetric info, equity issue | 2_Multi_State_Project | 15min | 20-30 |
| A3 | CAPM & Discount Rates | beta, unlever, WACC | 3_CAPM_Discount_Rates | 10min | 15-20 |
| A4 | Distress & Priority | senior, junior, waterfall | 4_Distress_Risk_Shift | 12min | 15-25 |
| A5 | Payout Policy | dividend, repurchase | 6_Payout_Policy | 10min | 10-20 |
| A6 | Risk Management | hedge, collar, derivatives | 7_Risk_Management | 12min | 15-25 |

### Tier 2 (20% of exam points)
| ID | Name | Keywords | Resource | Time | Points |
|----|------|----------|----------|------|--------|
| A7 | Valuation Multiples | P/E, EV/EBITDA | Playbook | 8min | 5-15 |
| A8 | Real Options | expand, abandon | Playbook | 10min | 10-20 |
| A9 | Diversification | portfolio, correlation | Playbook | 8min | 5-10 |
| A10 | Options Theory | call, put, strike | Playbook | 12min | 10-20 |

## 🔄 The 5-Step Universal Workflow

Every problem follows this systematic approach:

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: IDENTIFY (30s)                                       │
│ ├─ Scan keywords                                             │
│ ├─ Match to archetype(s)                                     │
│ ├─ Determine tier (1 or 2)                                   │
│ └─ Flag if hybrid                                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: EXTRACT (30s)                                        │
│ ├─ Restate core question                                     │
│ ├─ Identify all parts (A, B, C, etc.)                        │
│ └─ Note key assumptions                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: MAP (30s)                                            │
│ ├─ Quant? → Select Excel tab                                │
│ ├─ Conceptual? → Select Playbook theme                      │
│ └─ Verify assumptions (checklist)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: EXECUTE (Variable)                                   │
│ ├─ Open correct resource                                     │
│ ├─ Populate inputs (blue cells)                              │
│ ├─ Run calculations                                          │
│ └─ For hybrid: solve stages sequentially                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: CHECK (1-2min)                                       │
│ ├─ Sign check (+ or - as expected?)                         │
│ ├─ Magnitude check (reasonable range?)                       │
│ ├─ Theory link (connect to M&M, CAPM, etc.)                 │
│ └─ Implications (so what?)                                   │
└─────────────────────────────────────────────────────────────┘
```

## 💡 How the System Works

### Reconnaissance Mode (Main Feature)

1. **User pastes exam problem text**
   ```
   Example: "HAL Corporation has $500M debt with 6% coupon.
   Default occurs at maturity (year 5) with 8% probability..."
   ```

2. **Scanner extracts keywords**
   ```javascript
   Keywords detected: ["debt", "default", "coupon", "probability"]
   ```

3. **Archetype identification**
   ```javascript
   Match: A1 - Capital Structure (Tier 1)
   Confidence: HIGH (95%)
   Hybrid: NO
   ```

4. **Resource mapping**
   ```
   Excel Tab: 1_Capital_Structure
   Playbook: Slides 3-5
   Time Budget: 12 minutes
   Expected Points: 20
   ```

5. **Display execution plan**
   - 5-step workflow customized for A1
   - Excel input cell locations
   - Assumption checklist
   - Time allocation

### Practice Mode

- Full 180-minute mock exams
- Individual archetype drills
- Real-time workflow tracking
- Solution verification

### Review Mode

- Performance metrics by archetype
- Gap analysis (weakest areas)
- Recognition speed tracking
- Mastery level assessment

## 📈 Data Flow Example

```
User Input:
"TransDigm has senior debt ($100M, 6% coupon) and junior debt 
($50M, 8% coupon). Beta is 1.5, rf=3%, market premium=7%..."

↓

archetypeScanner.js processes:
Keywords: ["senior", "junior", "beta", "rf", "market premium"]

↓

Scoring:
A4 (Priority): 3 matches → Score: 8
A1 (Capital Structure): 2 matches → Score: 6
A3 (CAPM): 3 matches → Score: 9

↓

Results:
Primary: A3 (CAPM)
Secondary: A1, A4
Hybrid: YES
Solving Sequence: A3 → A1 → A4

↓

Display:
1. Scanner shows: "3 archetypes, Tier 1, Hybrid detected"
2. HybridSequencer shows: "Solve A3 first (discount rate needed)"
3. ArchetypeMapper shows: Excel tabs for each archetype
4. TimeAllocator shows: Total 34 minutes (10+12+12)
```

## 🚀 Getting Started

### 1. Installation
```bash
cd C:\dev\School\ACF\ACF-Exam-Prep
npm install
```

### 2. Add Source Materials
```
public/source-materials/
├── Corporate_Finance_Templates.xlsx
└── pdfs/
    ├── Fall_2024_Final.pdf
    └── Mock_29.pdf
```

### 3. Start Application
```bash
npm start
```
Opens at `http://localhost:3000`

### 4. First Use
1. Navigate to Reconnaissance mode (default)
2. Paste a practice problem
3. Click "Scan & Identify Archetypes"
4. Review the generated execution plan
5. Follow the 5-step workflow

## 🎯 Success Metrics

You're exam-ready when you achieve:

| Metric | Target | Current |
|--------|--------|---------|
| Tier 1 Recognition | <30s | [Track] |
| Tier 1 Accuracy | >95% | [Track] |
| Tier 2 Recognition | <60s | [Track] |
| Tier 2 Accuracy | >85% | [Track] |
| Workflow Fluency | 5/5 steps | [Track] |
| Hybrid Competency | 3/3 solved | [Track] |
| Full Mock Exam | >85% (204/240) | [Track] |

## 📚 Key Files Reference

### Must-Read Documentation
1. `README.md` - Project overview & quick start
2. `docs/USAGE.md` - Operational guide
3. `docs/EXCEL_INTEGRATION.md` - Excel templates guide
4. `DIRECTORY_STRUCTURE.txt` - File organization

### Core Data Files
- `src/data/archetype-signals.json` - Archetype definitions
- `src/data/keyword-mappings.json` - Keyword database
- `src/data/problems-index.json` - Mock exam catalog

### Core Logic
- `src/utils/archetypeScanner.js` - Pattern recognition
- `src/utils/workflowEngine.js` - Workflow generation
- `src/components/reconnaissance/ReconView.jsx` - Main interface

## 🔧 Customization

### Adding New Archetypes
1. Edit `src/data/archetype-signals.json`
2. Add keywords to `src/data/keyword-mappings.json`
3. Update tier classifications if needed

### Adding Mock Exams
1. Place PDF in `public/source-materials/pdfs/`
2. Add entry to `src/data/problems-index.json`
3. Tag with appropriate archetypes

### Modifying Workflows
1. Edit `src/data/tier-definitions.json`
2. Update step descriptions
3. Adjust time allocations

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| npm install fails | `npm cache clean --force` |
| Port 3000 in use | `PORT=3001 npm start` |
| Excel files not loading | Check paths in `.env` |
| Scanner returns no results | Verify `archetype-signals.json` loaded |
| Components not rendering | Check browser console for errors |

## 📞 Next Steps

1. Complete setup using `DEPLOYMENT_GUIDE.md`
2. Run first reconnaissance on a practice problem
3. Review all 10 archetypes in `docs/ARCHETYPE_GUIDE.md`
4. Configure first mock exam practice
5. Track progress in Review mode

---

**System Version**: 1.0.0  
**Last Updated**: December 2024  
**Target Exam**: FINC440 Advanced Corporate Finance Final
