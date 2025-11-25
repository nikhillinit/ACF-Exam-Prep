# A2A: Debt Overhang - Quick Reference Guide

## Overview
**Tier**: 1 (HIGH Priority) | **Time Budget**: 15 min | **Points**: 20-30 | **Exam Weight**: 80%

---

## Instant Recognition

### INSTANT TRIGGER Keywords (Weight: 4+)
- None for this archetype

### STRONG Keywords (Weight: 3+)
- debt overhang

### MODERATE Keywords (Weight: 2+)
- None for this archetype

### WEAK Keywords (Weight: 1)
- debt
- multi-state
- existing debt
- underinvestment
- wealth transfer

### Strong Signal Combinations (95%+ Confidence)
1. multi-state + existing debt → A2A
2. debt overhang + underinvestment → A2A

## Hybrid Patterns
- **A2A + A3**: Debt Overhang with CAPM
  - Frequency: MEDIUM
  - Sequence: A3-discount-rate → A2A-multi-state → wealth-transfer



---

## Resources

### Excel Template
- **Tab**: 2_Multi_State_Project
- **Color Code**: 
  - BLUE cells = Your inputs
  - YELLOW highlights = Key outputs
  - BLACK = Auto-calculated formulas

### Playbook Reference
- **Slides**: 6, 7

### Time Strategy
- **Allocation**: 15 minutes
- **Buffer**: +3 min for verification
- **Rule**: 1 point = 1 minute


---

## Worked Examples

### Example 1: a2a-debt-overhang-positive-npv-rejected
**Problem**: Firm D has risky debt outstanding with face value $120 due in 1 year. The firm’s assets will be worth either $160 (good state) or $80 (bad state) in 1 year, each with probability 0.5. The required ret...

**Key Insights**:
- Debt overhang occurs when positive NPV projects largely benefit existing debtholders rather than equity.
- Equity’s decision depends on its own wealth change, not on firm-wide NPV.
- Risky debt becoming safer can be a massive wealth transfer from equity to debt.

**Common Mistakes**:
- Comparing project NPV at the firm level to equity’s incentives without computing equity’s own wealth change.
- Ignoring the equity issuance step and assuming equity gets the full project benefit.
- Forgetting to revalue risky debt after the project; this hides the wealth transfer.

**Solution Approach**:
1. Step 1 - Reconnaissance
   Why is this a debt overhang / multi-state financing problem?
2. Step 2 - Asset-Level NPV of the Project
   Evaluate the project as if financed by risk-free capital with no existing claims.
3. Step 3 - Value of Debt and Equity Without the Project
   Compute current values of debt and equity given the existing capital structure.
4. Step 4 - Value of Debt and Equity With the Project (Before Financing Cost)
   Recompute values if the project were implemented, ignoring who pays for it.
5. Step 5 - Equity-Financed Project and Old Equity’s Wealth
   Account for the financing cost via new equity issuance.
6. Step 6 - Interpretation: Debt Overhang
   Explain why equity rationally rejects the project.

### Example 2: a2a-wealth-transfer-without-overhang
**Problem**: Consider the same Firm D as before but now assume the project cost is fully subsidized by the government (the firm pays $0 today) and still adds $40 to asset value in each state next year. There is no...

**Key Insights**:
- Wealth transfers to debtholders can exist without creating debt overhang.
- Overhang requires that equity’s net gain from the project (after financing it) is negative or small, even when firm-level NPV is positive.
- External subsidies or government support can neutralize overhang by relieving equity of the financing burden.

**Common Mistakes**:
- Labeling any improvement in debt value as 'overhang' even when equity clearly benefits.
- Forgetting that incentives depend on net gains after accounting for who pays.
- Ignoring the role of external financing (subsidies, government guarantees) in mitigating capital structure distortions.

**Solution Approach**:
1. Step 1 - Reconnaissance
   What’s different from the overhang case?
2. Step 2 - Values Without Project
   Recall baseline debt and equity values.
3. Step 3 - Values With Project (Cost = 0)
   Recompute values if the project is adopted for free.
4. Step 4 - Equity’s Incentive
   Does equity want this project?
5. Step 5 - Interpretation: Wealth Transfers vs Overhang
   Distinguish between a mere wealth transfer and true overhang.



---

## 5-Step Workflow

### IDENTIFY (30s)
- Scan for: "multi-state", "existing debt", "underinvestment", "wealth transfer"
- Check for: Problem-specific signals
- Flag: Hybrid if combined with other archetypes

### EXTRACT (30s)
- Core question: What is being asked?
- Sub-parts: Break down multi-part questions
- Data: List all given values and assumptions

### MAP (30s)
- Resource: Excel Tab 2_Multi_State_Project
- Verify: Do you have all necessary inputs?
- Plan: Identify calculation sequence

### EXECUTE (12 min)
- Follow template: Input values carefully
- Calculate: Work through systematically
- Multi-step: Handle dependencies in order

### CHECK (1-2 min)
- Sign: Does the direction make sense?
- Magnitude: Is the scale reasonable?
- Theory: Does it align with financial principles?
- Implications: Can you explain the result?



---

---
Generated: 2025-11-25 | Source: archetype-signals.json, keyword-mappings.json, tier-definitions.json, guided_problem_solving.json