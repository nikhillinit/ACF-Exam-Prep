# A4: Distress & Priority - Quick Reference Guide

## Overview
**Tier**: 1 (HIGH Priority) | **Time Budget**: 12 min | **Points**: 15-25 | **Exam Weight**: 80%

---

## Instant Recognition

### INSTANT TRIGGER Keywords (Weight: 4+)
- absolute priority

### STRONG Keywords (Weight: 3+)
- senior
- junior
- waterfall

### MODERATE Keywords (Weight: 2+)
- default

### WEAK Keywords (Weight: 1)
- debt
- recovery
- wealth transfer
- priority
- bankruptcy

### Strong Signal Combinations (95%+ Confidence)
1. senior + junior + waterfall → A4


---

## Resources

### Excel Template
- **Tab**: 4_Distress_Risk_Shift
- **Color Code**: 
  - BLUE cells = Your inputs
  - YELLOW highlights = Key outputs
  - BLACK = Auto-calculated formulas

### Playbook Reference
- **Slides**: 12, 13

### Time Strategy
- **Allocation**: 12 minutes
- **Buffer**: +2 min for verification
- **Rule**: 1 point = 1 minute


---

## Worked Examples

### Example 1: a4-liquidation-waterfall-priority
**Problem**: Firm X is being liquidated. Its assets are sold for $120 million in cash. The capital structure consists of (1) a secured bank loan with face value $60 million, (2) unsecured bonds with face value $50...

**Key Insights**:
- Absolute priority determines who gets paid in distress; senior claims get paid first.
- Recovery rates decrease as you move down the capital structure from secured debt to equity.
- Waterfall analysis underpins the pricing and risk of each security class.

**Common Mistakes**:
- Paying everyone a pro-rata share of the asset value instead of using strict priority.
- Forgetting to cap each tranche’s recovery at face value.
- Failing to check that total distributed equals the asset value.

**Solution Approach**:
1. Step 1 - Reconnaissance
   Why is this a priority / waterfall problem?
2. Step 2 - Allocate Cash by Priority
   Apply the absolute priority rule.
3. Step 3 - Compute Recovery Rates
   Express recoveries as percentages of face value.
4. Step 4 - Interpret Priority and Risk
   Explain what this says about risk and expected returns.
5. Step 5 - Connection to Capital Structure Design
   Relate waterfall outcomes to optimal capital structure.

### Example 2: a4-risk-shifting-senior-vs-junior
**Problem**: Firm Y has debt with face value $120 due in 1 year. It must choose between two mutually exclusive projects: Safe and Risky. Both require the same investment today and are financed entirely with existi...

**Key Insights**:
- Risk-shifting arises because equity’s payoff is convex: limited downside but unlimited upside.
- Creditors bear much of the downside when projects become riskier, so equity may rationally favor those projects.
- This agency problem explains why debt contracts often include covenants restricting risk-taking.

**Common Mistakes**:
- Conflating 'best for equity' with 'best for the firm' when there is substantial debt.
- Ignoring priority, which hides that creditors absorb much of the downside in the risky project.
- Failing to compute both firm value and equity value before labeling a situation as risk-shifting.

**Solution Approach**:
1. Step 1 - Reconnaissance
   Why is this a risk-shifting problem?
2. Step 2 - Firm and Equity Values under Project Safe
   Compute firm value and equity value for the safer project.
3. Step 3 - Firm and Equity Values under Project Risky
   Compute firm value and equity value for the riskier project.
4. Step 4 - Compare Firm vs Equity Preferences
   Which project is better for the firm? Which do equity holders prefer?
5. Step 5 - Interpretation: Risk-Shifting
   Explain the mechanism of risk-shifting.



---

## 5-Step Workflow

### IDENTIFY (30s)
- Scan for: "senior", "junior", "waterfall", "priority"
- Check for: Problem-specific signals
- Flag: Hybrid if combined with other archetypes

### EXTRACT (30s)
- Core question: What is being asked?
- Sub-parts: Break down multi-part questions
- Data: List all given values and assumptions

### MAP (30s)
- Resource: Excel Tab 4_Distress_Risk_Shift
- Verify: Do you have all necessary inputs?
- Plan: Identify calculation sequence

### EXECUTE (9 min)
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