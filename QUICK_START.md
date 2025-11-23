# Quick Start Guide - 5 Minutes to Running

## ⚡ Rapid Deployment (Windows)

### Step 1: Copy Files (1 minute)
```powershell
# Option A: From WSL
xcopy /E /I /H "\\wsl$\Ubuntu\home\claude\ACF-Exam-Prep" "C:\dev\School\ACF\ACF-Exam-Prep"

# Option B: Extract ZIP
# Extract ACF-Exam-Prep.zip to C:\dev\School\ACF\
```

### Step 2: Install Dependencies (2 minutes)
```powershell
cd C:\dev\School\ACF\ACF-Exam-Prep
npm install
```

### Step 3: Add Source Materials (1 minute)
Place these in `C:\dev\School\ACF\ACF-Exam-Prep\public\source-materials\`:
- ✅ Corporate_Finance_Templates.xlsx
- ✅ Mock_Solutions.md
- ✅ pdfs/*.pdf (any mock exams)

### Step 4: Start Application (30 seconds)
```powershell
npm start
```
Browser opens at `http://localhost:3000`

### Step 5: Test Reconnaissance (30 seconds)
1. Paste this test problem:
   ```
   TransDigm has $100M senior debt with 6% coupon and $50M 
   junior debt with 8% coupon. Default occurs at maturity 
   with 10% probability. Recovery rate is 40%.
   ```
2. Click "Scan & Identify Archetypes"
3. Verify it identifies: A1 (Capital Structure), A4 (Priority)

## ✅ Success Verification

You should see:
- ✓ Archetypes: A1, A4 (Tier 1)
- ✓ Keywords: debt, senior, junior, default, coupon
- ✓ Hybrid: YES
- ✓ Excel Tab: 1_Capital_Structure, 4_Distress_Risk_Shift
- ✓ Time Budget: 24 minutes

## 🚀 First Real Use

### Test on Actual Exam Problem
1. Open `Fall_2024_Final.pdf` (Q1 - HAL Corporation)
2. Copy problem text
3. Paste into Reconnaissance mode
4. Follow generated execution plan
5. Open suggested Excel tab
6. Solve using 5-step workflow

## 📁 What You Have

```
✓ React application (localhost:3000)
✓ 10 archetype definitions
✓ Keyword matching engine
✓ 5-step workflow system
✓ Hybrid question detector
✓ Excel integration
✓ Time management calculator
```

## 🎯 Next Steps

1. **Today**: Test reconnaissance on 3-5 past exam problems
2. **This Week**: Practice all Tier 1 archetypes individually
3. **Week 2**: Solve hybrid questions
4. **Week 3**: Full 180-minute mock exams
5. **Final Week**: Speed optimization + conceptual themes

## 📖 Reference Documents

| Document | Purpose |
|----------|---------|
| `SYSTEM_OVERVIEW.md` | Complete system architecture |
| `docs/USAGE.md` | Detailed operational guide |
| `docs/EXCEL_INTEGRATION.md` | Excel template usage |
| `DIRECTORY_STRUCTURE.txt` | File organization |

## 🆘 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| Port in use | `set PORT=3001 && npm start` |
| Scanner no results | Check `src/data/archetype-signals.json` exists |
| Excel not found | Verify file in `public/source-materials/` |
| Build errors | `npm cache clean --force && npm install` |

## 💪 Exam Success Formula

```
30s recognition × 5-step workflow × 12min execution = A-level performance
```

**Target**: 95%+ on 240-point exam = 228+ points

**Strategy**:
- Tier 1: 180 points → Need 171+ (95%)
- Tier 2: 60 points → Need 51+ (85%)
- Time Buffer: 10 minutes for checks

---

**You're ready to start!** 🎓

Open `http://localhost:3000` and begin reconnaissance training.
