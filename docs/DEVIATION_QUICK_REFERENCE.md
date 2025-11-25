# Deviation Quick Reference Guide

## Critical Deviations (Exam Killers)

### DEV-1.1.1: Hazard Rate Default - IRR Method
**Time Impact**: 3.5 minutes | **Archetype**: A1

**The Trap**: Using weighted average formula for multi-period hazard rate default
```
❌ WRONG: E[r_D] = p_survive × r_good + p_default × r_bad
✓ RIGHT: Calculate expected CF each period, then find IRR
```

**Quick Check**:
- Is survival probability DECREASING over time? (e.g., S(t) = (1-h)^t)
- Multiple periods?
- → Use IRR method, NOT weighted average

---

### DEV-2.1.1: Equity Limited Liability
**Time Impact**: 2.0 minutes | **Archetype**: A2A

**The Trap**: Allowing negative equity values
```
❌ WRONG: Equity = V - D (can go negative)
✓ RIGHT: Equity = max(0, V - D)
```

**Quick Check**:
- Calculating equity in different states?
- Firm value < Debt in some states?
- → Always use max(0, V - D)

---

### DEV-2.2.1: Debt Overhang Detection
**Time Impact**: 4.0 minutes | **Archetype**: A2A

**The Trap**: Assuming +NPV project means equity will invest
```
❌ WRONG: NPV > 0 → Equity invests
✓ RIGHT: Check if ΔEquity ≥ Investment Cost
```

**Quick Check**:
- New project with existing debt?
- Calculate equity value WITH and WITHOUT project
- If ΔEquity < Investment → Debt overhang exists

---

### DEV-4.1.1: Absolute Priority Rule Waterfall
**Time Impact**: 2.5 minutes | **Archetype**: A4 (Distress)

**The Trap**: Not respecting strict priority in liquidation
```
✓ RIGHT ORDER:
1. Senior Debt gets paid first (up to full amount)
2. Junior Debt gets remainder (up to full amount)
3. Equity gets any residual
```

**Quick Check**:
- Multiple debt classes?
- Bankruptcy/liquidation scenario?
- → Use waterfall: Senior → Junior → Equity

---

## High Priority Deviations

### DEV-1.2.1: Tax Shield Discount Rate
**Time Impact**: 2.5 minutes | **Archetype**: A1

**Quick Rule**: Tax shields should be discounted at **r_D** (debt rate), NOT r_E or WACC

**Why**: Tax shields exist only when interest is paid → same risk as debt

---

### DEV-1.3.1: Promised Yield vs Expected Return
**Time Impact**: 2.0 minutes | **Archetype**: A1

**Quick Rule**:
- **Promised Yield**: Ignores default (full promised payoff)
- **Expected Return**: Accounts for default probability and recovery
- For risky debt: E[r_D] < Promised YTM

---

### DEV-1.4.1: Amortizing Debt Principal Schedule
**Time Impact**: 3.0 minutes | **Archetype**: A1

**Quick Rule**: With amortizing debt, principal DECREASES each period
```
Interest(t) = r × Principal_Beginning(t)
Principal_Payment(t) = Total_Payment - Interest(t)
Tax_Shield(t) = τ × Interest(t)  [decreases over time]
```

---

### DEV-2.2.2: Wealth Transfer Detection
**Time Impact**: 3.5 minutes | **Archetype**: A2A

**Quick Rule**: New project can transfer value between equity and debt
```
Check BOTH:
ΔEquity = E[Equity_with] - E[Equity_without]
ΔDebt = E[Debt_with] - E[Debt_without]

If ΔDebt > ΔFirm NPV → Wealth transfer TO debtholders
```

---

### DEV-3.1.1: Levered vs Unlevered Beta
**Time Impact**: 2.5 minutes | **Archetype**: A3

**Quick Rules**:
```
Unlevering: β_U = β_E × [E / (E + D)]
Relevering: β_E = β_U × [(E + D) / E]
```

**When to use**:
- Unlevering: Getting asset beta from equity beta
- Relevering: Applying asset beta to different capital structure

---

### DEV-3.3.1: Project vs Firm Discount Rate
**Time Impact**: 4.0 minutes | **Archetype**: A3

**The Trap**: Using firm's overall beta for project with different risk

**Quick Rule**:
1. Find comparable firms in PROJECT's industry
2. Unlever their betas
3. Average unlevered betas
4. Relever to YOUR firm's capital structure
5. Use project-specific beta in CAPM

---

## Medium Priority Deviations

### DEV-2B.1.1: Incentive Compatibility
**Archetype**: A2B

**Quick Check**: In separating equilibrium, verify BOTH:
- IC for Low type: U_L(a_L) ≥ U_L(a_H)
- IC for High type: U_H(a_H) ≥ U_H(a_L)

---

### DEV-3.2.1: WACC Circular Reference
**Archetype**: A3

**The Problem**: WACC depends on V, but V depends on WACC

**Solutions**:
1. Iterate to convergence
2. Use APV instead: V = V_U + PV(TS) - PV(Distress)
3. If D is fixed, can solve directly

---

### DEV-4.2.1: Recovery Rate vs Amount
**Archetype**: A4 (Distress)

**Quick Rule**:
- Recovery Rate = % of FACE VALUE (not market price)
- Recovery Amount = Recovery_Rate × Face_Value

---

### DEV-5.1.1: Dividend vs Repurchase
**Archetype**: A5 (Payout)

**Quick Rule**: Without taxes/signaling, dividends = repurchases (M&M)

**Differences arise from**:
1. Taxes (capital gains vs ordinary income)
2. Signaling (dividends may signal more)
3. Clientele effects

---

### DEV-10.1.1: Put-Call Parity
**Archetype**: A10 (Options)

**Formula**: C - P = S - PV(K)

**Critical**: Call and put must have SAME strike and SAME expiration

---

### DEV-10.2.1: Black-Scholes Assumptions
**Archetype**: A10 (Options)

**Assumptions**:
- No dividends (or adjust with dividend yield)
- European exercise only
- Constant volatility σ
- Constant risk-free rate r

---

## Binary vs Hazard Rate Default (Critical Distinction)

### Binary Default (1-period)
- Fixed probability at maturity (e.g., 10% chance in Year 1)
- **Method**: Weighted average
- **Formula**: E[r_D] = p_survive × r_good + p_default × r_bad

### Hazard Rate Default (multi-period)
- Probability each period (e.g., 5% per year)
- Survival DECREASES: S(t) = (1-h)^t
- **Method**: IRR of expected cash flows
- **DO NOT use weighted average**

**How to distinguish**:
- "10% probability of default at maturity" → Binary
- "5% hazard rate per year" → Hazard rate
- Single period bond → Binary
- Multi-year bond with survival formula → Hazard rate

---

## Quick Severity Guide

### Critical (4 deviations)
Will likely fail the problem if triggered. Time impact: 2-4 minutes.
- DEV-1.1.1 (Hazard Rate)
- DEV-2.1.1 (Limited Liability)
- DEV-2.2.1 (Debt Overhang)
- DEV-4.1.1 (Waterfall)

### High (10 deviations)
Major conceptual errors. Time impact: 2-4 minutes.
- All discount rate issues (A1, A3)
- Beta unlevering/relevering
- Promised vs expected return
- Wealth transfers

### Medium (4 deviations)
Important but may still get partial credit. Time impact: 1.5-3 minutes.
- WACC circularity
- Recovery rate confusion
- Put-call parity
- Black-Scholes assumptions

### Low (1 deviation)
Confirmation messages, not traps. Time impact: 0 minutes.
- DEV-1.1.2 (Binary default confirmation)

---

## Pre-Flight Checklist by Archetype

### A1: Capital Structure
- [ ] Binary vs Hazard rate default? (DEV-1.1.1)
- [ ] Tax shields discounted at r_D? (DEV-1.2.1)
- [ ] Promised vs expected return clear? (DEV-1.3.1)
- [ ] Amortizing vs bullet debt? (DEV-1.4.1)

### A2A: Multi-State
- [ ] Using max(0, V-D) for equity? (DEV-2.1.1)
- [ ] Checking ΔEquity vs Investment? (DEV-2.2.1)
- [ ] Tracking wealth transfers? (DEV-2.2.2)

### A2B: Adverse Selection
- [ ] Both IC constraints verified? (DEV-2B.1.1)
- [ ] Off-equilibrium beliefs specified? (DEV-2B.2.1)

### A3: CAPM
- [ ] Unlever/relever beta correctly? (DEV-3.1.1)
- [ ] Aware of WACC circularity? (DEV-3.2.1)
- [ ] Project-specific beta? (DEV-3.3.1)

### A4: Distress
- [ ] Waterfall respects priority? (DEV-4.1.1)
- [ ] Recovery = rate × face value? (DEV-4.2.1)

---

## Integration Code Snippets

### Load Enriched Problem
```javascript
import { injectDeviationAlerts } from './utils/deviationInjector';

const rawProblem = await fetchProblem(id);
const enriched = injectDeviationAlerts(rawProblem);
```

### Display Alert
```jsx
{step.deviation_alert && (
  <div className={`alert severity-${step.deviation_alert.severity}`}>
    <strong>{step.deviation_alert.code}</strong>:
    {step.deviation_alert.warning}
  </div>
)}
```

### Get Pre-Flight Checklist
```javascript
import { getDeviationsForArchetype } from './utils/deviationInjector';

const checklist = getDeviationsForArchetype('A1-CapitalStructure');
```

---

## Quick Stats

- **Total Deviations**: 19
- **Critical**: 4
- **High**: 10
- **Medium**: 4
- **Low**: 1
- **Avg Time Impact**: ~2.5 minutes per deviation
- **Max Time Impact**: 4.0 minutes (Debt Overhang)

---

## Contact & Support

For questions or to report issues:
- See full documentation: `docs/DEVIATION_INJECTION_SYSTEM.md`
- Run tests: `node src/utils/deviationInjector.test.js`
- Validate: `validateDeviationDatabase()`
