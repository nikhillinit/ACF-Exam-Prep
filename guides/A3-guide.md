# A3: CAPM & Discount Rates - Quick Reference Guide

## Overview
**Tier**: 1 (HIGH Priority) | **Time Budget**: 10 min | **Points**: 15-20 | **Exam Weight**: 80%

---

## Instant Recognition

### INSTANT TRIGGER Keywords (Weight: 4+)
- None for this archetype

### STRONG Keywords (Weight: 3+)
- None for this archetype

### MODERATE Keywords (Weight: 2+)
- beta

### WEAK Keywords (Weight: 1)
- unlever
- relever
- discount rate
- WACC
- cost of capital
- cost of equity
- CAPM
- market risk premium

### Strong Signal Combinations (95%+ Confidence)
1. beta + unlever + WACC → A3

## Hybrid Patterns
- **A3 + A1**: CAPM with Capital Structure
  - Frequency: HIGH
  - Sequence: A3-beta-estimation → A1-leverage-effects → adjusted-WACC



---

## Resources

### Excel Template
- **Tab**: 3_CAPM_Discount_Rates
- **Color Code**: 
  - BLUE cells = Your inputs
  - YELLOW highlights = Key outputs
  - BLACK = Auto-calculated formulas

### Playbook Reference
- **Slides**: 10, 11

### Time Strategy
- **Allocation**: 10 minutes
- **Buffer**: +2 min for verification
- **Rule**: 1 point = 1 minute


---

## Worked Examples

### Example 1: a3-unlever-relever-beta
**Problem**: Project P is in a new line of business for Firm T. To estimate an appropriate discount rate, T identifies a pure-play comparable firm C that operates only in the project’s business. Firm C has an equi...

**Key Insights**:
- Unlevering and re-levering betas is the core tool for project-specific discount rates under CAPM.
- Asset beta captures business risk; equity beta adds financial leverage on top.
- Using the firm’s overall WACC for a project with different risk is generally incorrect and can bias investment decisions.

**Common Mistakes**:
- Using the firm’s existing WACC even when the project is clearly in a different industry.
- Forgetting to convert D/E into E/(D+E) and D/(D+E) when computing β_A.
- Treating β_E of the comparable as if it were directly applicable to the project without adjusting for different leverage.

**Solution Approach**:
1. Step 1 - Reconnaissance
   Why is this a CAPM / discount rate choice problem?
2. Step 2 - Unlever the Comparable’s Beta
   Compute the asset beta for firm C.
3. Step 3 - Re-lever at Firm T’s Target D/E
   Compute the project’s equity beta at the target leverage.
4. Step 4 - Compute Discount Rates using CAPM
   Use CAPM to get r_A and r_E for the project.
5. Step 5 - Interpretation
   Explain how this helps with project valuation.

### Example 2: a3-capm-discount-rate-selection
**Problem**: Firm Q is evaluating a new project. The firm’s equity beta is 1.1, its market-value debt-to-equity ratio is 0.4, and its debt is approximately risk-free. The risk-free rate is 4% and the market risk p...

**Key Insights**:
- r_E, r_A, and WACC each have a specific role depending on whose cash flows you are discounting and how leverage behaves.
- For FCFF with roughly constant leverage, WACC is the right discount rate.
- For project valuation with explicit APV, r_A is used for operating cash flows and debt-like rates are used for tax shields.

**Common Mistakes**:
- Automatically using r_E as the discount rate for all projects regardless of the cash flow definition.
- Ignoring taxes when computing WACC (forgetting the (1 − τ) on r_D).
- Using book-value weights instead of market-value weights when computing WACC.

**Solution Approach**:
1. Step 1 - Reconnaissance
   What decision are we making here?
2. Step 2 - Compute Equity Cost of Capital
   Use CAPM to get r_E.
3. Step 3 - Compute Asset Discount Rate
   Back out the asset beta and r_A.
4. Step 4 - Compute After-Tax WACC
   Use r_E and r_D to compute WACC.
5. Step 5 - Which Rate for Project Free Cash Flows?
   Decide which rate is appropriate and explain why.



---

## 5-Step Workflow

### IDENTIFY (30s)
- Scan for: "beta", "unlever", "relever", "discount rate"
- Check for: Problem-specific signals
- Flag: Hybrid if combined with other archetypes

### EXTRACT (30s)
- Core question: What is being asked?
- Sub-parts: Break down multi-part questions
- Data: List all given values and assumptions

### MAP (30s)
- Resource: Excel Tab 3_CAPM_Discount_Rates
- Verify: Do you have all necessary inputs?
- Plan: Identify calculation sequence

### EXECUTE (7 min)
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