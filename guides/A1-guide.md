# A1: Capital Structure - Quick Reference Guide

## Overview
**Tier**: 1 (HIGH Priority) | **Time Budget**: 12 min | **Points**: 15-25 | **Exam Weight**: 80%

---

## Instant Recognition

### INSTANT TRIGGER Keywords (Weight: 4+)
- None for this archetype

### STRONG Keywords (Weight: 3+)
- None for this archetype

### MODERATE Keywords (Weight: 2+)
- default
- coupon
- tax shield

### WEAK Keywords (Weight: 1)
- debt
- YTM
- yield to maturity
- amortizing
- recovery
- expected return on debt
- promised yield

### Strong Signal Combinations (95%+ Confidence)
1. default + coupon + YTM → A1
2. expected return on debt + tax shield → A1

## Hybrid Patterns
- **A1 + A4**: Capital Structure with Priority
  - Frequency: HIGH
  - Sequence: A1-pricing → A4-waterfall → A1-expected-returns

- **A1 + A5**: Capital Structure with Payout
  - Frequency: LOW
  - Sequence: A1-debt-value → A5-payout-choice → combined-effects



---

## Resources

### Excel Template
- **Tab**: 1_Capital_Structure
- **Color Code**: 
  - BLUE cells = Your inputs
  - YELLOW highlights = Key outputs
  - BLACK = Auto-calculated formulas

### Playbook Reference
- **Slides**: 3, 4, 5

### Time Strategy
- **Allocation**: 12 minutes
- **Buffer**: +2 min for verification
- **Rule**: 1 point = 1 minute


---

## Worked Examples

### Example 1: a1-bond-default-expected-return-and-beta
**Problem**: Firm L issues a 1-year coupon bond with face value $100 and an 8% annual coupon. The bond currently trades at $96. There is a 10% probability the firm defaults at maturity. In default, investors recei...

**Key Insights**:
- Promised yield and expected return are different objects; default risk drives a wedge between them.
- Risky corporate debt typically has a positive beta; treating all debt as risk-free can severely mis-measure WACC.
- When default probability is small but not trivial, the expected return can be much closer to the risk-free rate than the coupon suggests.

**Common Mistakes**:
- Plugging the coupon rate or promised YTM directly into CAPM instead of the expected return.
- Ignoring the default state entirely and treating a clearly risky bond as risk-free.
- Computing returns using payoff/face instead of payoff/price.

**Solution Approach**:
1. Step 1 - Reconnaissance
   What kind of problem is this?
2. Step 2 - What Do I Need?
   List the target outputs and required inputs.
3. Step 3 - Promised YTM (Ignore Default)
   Compute the promised yield to maturity ignoring default risk.
4. Step 4 - Expected Return on Debt
   Incorporate default to find the expected return E[r_D].
5. Step 5 - Debt Beta from CAPM
   Use CAPM to infer the bond’s beta.
6. Step 6 - Interpretation & Common Pitfalls
   Interpret the result and connect to capital structure intuition.

### Example 2: a1-tax-shield-risky-debt
**Problem**: Firm R has permanent risky debt with face value $200 and an expected return of 4%. The corporate tax rate is 25%. The probability of default each year is 1% and, if the firm defaults, it permanently l...

**Key Insights**:
- Tax shields should be discounted at a rate that matches their risk profile, which is typically debt-like when debt is fixed.
- Default risk lowers the PV of tax shields relative to the simple τD approximation.
- APV separates the operating value of the firm from financial side effects like tax shields and distress costs.

**Common Mistakes**:
- Discounting tax shields at the equity cost of capital in a fixed-debt setting.
- Applying τD without adjusting for default risk when the problem clearly states a nontrivial default probability.
- Forgetting that if interest stops in default, tax shields stop too.

**Solution Approach**:
1. Step 1 - Reconnaissance
   How do I know this is a tax shield valuation problem?
2. Step 2 - What Do I Need?
   Identify the cash flows and discount rate for tax shields.
3. Step 3 - Compute the PV of Tax Shields
   Apply the approximation formula.
4. Step 4 - Why Discount at the Debt Rate?
   Explain why the tax shield’s discount rate looks like r_D + p rather than r_E.
5. Step 5 - Interpretation
   Connect the PV of tax shields to levered firm value.

### Example 3: a1-apv-tax-shields-and-distress
**Problem**: Firm S is currently unlevered and has a value of $500 million based on the present value of its operating cash flows. It is considering issuing $200 million of permanent debt with an expected return o...

**Key Insights**:
- APV decomposes value into operating value plus financing side effects.
- Tax shields and distress costs are the key opposing forces in the static tradeoff theory.
- Even if post-transaction equity value is lower, old shareholders can gain via cash distributions when leverage is value-creating.

**Common Mistakes**:
- Forgetting to subtract distress costs in APV and thus overvaluing levered firm value.
- Using τ * r_D * D / r_D instead of the simpler τ * D for low-risk, fixed debt (overcomplicating when the exam clearly wants τ * D).
- Ignoring the cash distribution when evaluating whether shareholders benefit from a recapitalization.

**Solution Approach**:
1. Step 1 - Reconnaissance
   Why is this an APV / leverage tradeoff problem?
2. Step 2 - What Do I Need?
   Clarify the components of APV.
3. Step 3 - Compute Levered Firm Value
   Apply the APV formula.
4. Step 4 - Interpret Economic Tradeoff
   What does this say about the optimality of this debt level?
5. Step 5 - Equity Value After Levering
   How does this translate into equity value if the firm issues debt to repurchase equity?



---

## 5-Step Workflow

### IDENTIFY (30s)
- Scan for: "debt", "default", "coupon", "YTM"
- Check for: Problem-specific signals
- Flag: Hybrid if combined with other archetypes

### EXTRACT (30s)
- Core question: What is being asked?
- Sub-parts: Break down multi-part questions
- Data: List all given values and assumptions

### MAP (30s)
- Resource: Excel Tab 1_Capital_Structure
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