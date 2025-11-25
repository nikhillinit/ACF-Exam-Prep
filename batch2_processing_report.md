# Batch 2 Processing Report
## Problems 57-112 (Indices 56-111)

**Processing Date:** 2025-11-25
**Source File:** `public/source-materials/guided_examples_v11.json`
**Output File:** `public/source-materials/batch2_enriched.json`

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Problems Processed** | 56 |
| **Problems with Deviations** | 9 (16.1%) |
| **Problems with 2+ Deviations** | 6 |
| **Total Time Impact** | 65.5 minutes |
| **Avg Time Impact/Problem** | 1.2 minutes |
| **Processing Time** | 0.04 seconds |

---

## Severity Distribution

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 0 | 0% |
| **High** | **28** | **96.6%** |
| Medium | 0 | 0% |
| Low | 1 | 3.4% |

**Key Finding:** 96.6% of detected deviations are HIGH severity, indicating significant exam traps that could cost substantial time if not caught early.

---

## Top Deviation Codes Detected

| Rank | Code | Name | Occurrences | Description |
|------|------|------|-------------|-------------|
| 1 | **DEV-1.2.2** | Tax Shields Lost in Default | 6 | When firms default, they lose future tax shields (no interest paid) |
| 2 | **DEV-1.3.1** | Promised Yield vs Expected Return | 5 | Promised yield ≠ Expected return; must account for default probability |
| 3 | DEV-3.1.1 | Levered vs Unlevered Beta | 1 | Must unlever/relever beta when changing capital structure |
| 4 | DEV-3.3.1 | Project vs Firm Discount Rate | 1 | Project discount rate should match project risk, not firm's overall risk |
| 5 | DEV-1.4.1 | Amortizing Debt Principal Schedule | 1 | Amortizing debt has declining principal; interest = r × Principal(t) |
| 6 | DEV-1.1.2 | Binary Default - Weighted Average | 1 | For single-period bonds, use weighted average method |

---

## Key Insights

### 1. Capital Structure Dominance
- **11 of 15 total deviation instances (73%)** are from **A1-CapitalStructure** archetype
- This suggests batch 2 contains heavy focus on debt valuation and tax shields

### 2. Tax Shield Complexity
- **DEV-1.2.2** (Tax Shields Lost in Default) appears in 6 problems
- This is a critical concept where students often forget that defaulted firms lose future tax benefits
- Time impact: 2 minutes per occurrence = 12 minutes total potential time saved

### 3. Yield vs Return Confusion
- **DEV-1.3.1** (Promised Yield vs Expected Return) appears in 5 problems
- Common trap: using promised yield instead of expected return when debt is risky
- Time impact: 2 minutes per occurrence = 10 minutes total potential time saved

### 4. CAPM/Beta Calculations
- 2 problems involve beta calculations (DEV-3.1.1, DEV-3.3.1)
- These are high-complexity deviations requiring careful attention to:
  - Unlevering/relevering formulas
  - Matching project risk to appropriate comparables

---

## Archetype Breakdown

| Archetype | Problems with Deviations | Top Deviation |
|-----------|-------------------------|---------------|
| A1-CapitalStructure | 7-8 | DEV-1.2.2, DEV-1.3.1 |
| A3-CAPM | 1-2 | DEV-3.1.1, DEV-3.3.1 |
| Others | 0-1 | Various |

---

## Time Impact Analysis

### Total Time Saved by Detection
- **65.5 minutes** of potential time waste prevented across 9 problems
- Average of **7.3 minutes saved per problem with deviations**
- For the 6 problems with multiple deviations, average impact is **higher** (multiple traps per problem)

### Most Time-Consuming Deviations
1. **DEV-1.2.2** (Tax Shields Lost in Default): 12 minutes total (6 × 2 min)
2. **DEV-1.3.1** (Promised vs Expected Return): 10 minutes total (5 × 2 min)
3. **DEV-3.1.1** (Beta Levering): 2.5 minutes (1 occurrence)
4. **DEV-3.3.1** (Project Discount Rate): 4 minutes (1 occurrence)

---

## Recommendations for Batch 2 Study Focus

### Priority 1: Master Tax Shield Calculations
- **Why:** 40% of deviations involve tax shields
- **Focus Areas:**
  - How default affects future tax shields
  - Correct discount rate for tax shields (r_D, not r_E)
  - Expected vs promised calculations

### Priority 2: Yield vs Return Distinction
- **Why:** 33% of deviations involve this concept
- **Key Rule:** Promised Yield assumes no default; Expected Return accounts for default risk
- **Formula:** E[r_D] = [p_survive × Full_Payoff + p_default × Recovery] / Price - 1

### Priority 3: CAPM Beta Mechanics
- **Why:** Less frequent but HIGH complexity
- **Key Skills:**
  - Unlevering: β_U = β_E × [E/(E+D)]
  - Relevering: β_E = β_U × [(E+D)/E]
  - When to use project-specific vs firm-wide discount rates

---

## Technical Details

### Processing Methodology
1. **Scan each solution step** for deviation patterns using regex and keyword matching
2. **Inject inline alerts** into `deviation_alert` field when patterns match
3. **Add `detected_deviations` array** with all DEV codes found
4. **Generate `deviation_summary`** with aggregated statistics

### Enrichment Schema
Each enriched problem now contains:
```json
{
  "solution_steps": [
    {
      "part": "...",
      "reasoning": "...",
      "calculation": "...",
      "deviation_alert": {
        "code": "DEV-X.Y.Z",
        "name": "Deviation Name",
        "warning": "Alert message",
        "explanation": "Detailed explanation",
        "checkpoints": ["Step 1", "Step 2", ...],
        "time_impact_minutes": 2.5,
        "severity": "high"
      },
      "all_deviations": ["DEV-X.Y.Z", "DEV-A.B.C"]
    }
  ],
  "deviation_summary": {
    "total_deviations": 2,
    "deviation_codes": ["DEV-X.Y.Z", "DEV-A.B.C"],
    "total_time_impact_minutes": 5.0,
    "severity_distribution": {
      "critical": 0,
      "high": 2,
      "medium": 0,
      "low": 0
    }
  }
}
```

---

## Comparison with Expected Patterns

### Pattern Coverage
- ✅ Tax shield calculations (high coverage)
- ✅ Debt pricing with default risk (high coverage)
- ✅ Beta levering/unlevering (moderate coverage)
- ⚠️ Multi-state models (low coverage in this batch)
- ⚠️ Options pricing (not detected in batch 2)
- ⚠️ Payout policy (not detected in batch 2)

### Quality Metrics
- **Detection Rate:** 16.1% (9 of 56 problems contain deviations)
- **Multiple Deviation Rate:** 66.7% (6 of 9 problems with deviations have 2+)
- **High Severity Rate:** 96.6% (28 of 29 total alerts are HIGH severity)

---

## Next Steps

1. ✅ **Batch 2 Complete** - 56 problems enriched
2. ⏳ **Batch 3 Pending** - Problems 113-168 (indices 112-167)
3. ⏳ **Batch 4 Pending** - Problems 169-224 (indices 168-223)
4. ⏳ **Final Merge** - Combine all 4 batches into `guided_examples_v12.json`

---

## File Locations

- **Input:** `c:\Users\nikhi\ACF-Exam-Prep\public\source-materials\guided_examples_v11.json`
- **Output:** `c:\Users\nikhi\ACF-Exam-Prep\public\source-materials\batch2_enriched.json`
- **Processing Script:** `c:\Users\nikhi\ACF-Exam-Prep\process_batch2.js`
- **This Report:** `c:\Users\nikhi\ACF-Exam-Prep\batch2_processing_report.md`

---

*Report generated automatically by deviation injection system*
*For questions or issues, check the deviation database in `src/utils/deviationInjector.js`*
