---
archetype: A2A-DebtOverhang
difficulty: exam-level
time: 30
---

# [Problem Title - Q2 Multi-State Problem]

[Problem statement with state-contingent scenarios]

**Company Background:**
- Current situation
- Existing debt outstanding
- Investment opportunity

**State-Contingent Outcomes:**

| State | Probability | Asset Value | Other Parameters |
|-------|-------------|-------------|------------------|
| Good  | 60%         | $X million  | ...              |
| Bad   | 40%         | $Y million  | ...              |

**Existing Debt:**
- Face value: $Z million
- ...

## Part A

Calculate the firm NPV of the project (from total firm perspective).

### Solution

**Reasoning:** Firm NPV considers all claimholders (debt + equity). Calculate expected value across states, then subtract investment cost.

**Calculation:**
```
E[Assets with project] = 0.60 × Assets_Good + 0.40 × Assets_Bad
E[Assets without]      = 0.60 × Assets0_Good + 0.40 × Assets0_Bad
Firm NPV = E[Assets with] - E[Assets without] - Investment
```

**Answer:** Firm NPV = $X million (should be positive)

## Part B

Calculate equity value WITH and WITHOUT the project in each state.

### Solution

**Reasoning:** Equity = max(Assets - Face Value of Debt, 0) due to limited liability. Calculate for each state separately.

**Calculation:**
```
Without project:
  Good state: Equity = max(Assets_Good - Face, 0)
  Bad state:  Equity = max(Assets_Bad - Face, 0)

With project:
  Good state: Equity = max(Assets_Good_new - Face, 0)
  Bad state:  Equity = max(Assets_Bad_new - Face, 0)
```

**Answer:** [Table showing equity values in each scenario]

## Part C

Determine whether equity holders will invest in the project.

### Solution

**Reasoning:** Equity holders compare expected equity value with vs without project, accounting for their investment contribution. They invest only if their incremental value is positive.

**Calculation:**
```
E[Equity without] = 0.60 × Equity_Good + 0.40 × Equity_Bad
E[Equity with]    = 0.60 × Equity_Good_new + 0.40 × Equity_Bad_new
ΔEquity = E[Equity with] - E[Equity without] - Equity Investment

If ΔEquity < 0, equity rationally rejects the project.
```

**Answer:** Equity will [accept/reject] because ΔEquity = $X million

## Part D

Quantify the wealth transfer from equity to debt.

### Solution

**Reasoning:** If Firm NPV > 0 but ΔEquity < 0, the difference represents value transferred to debt holders. Debt becomes safer when assets increase.

**Calculation:**
```
Value Transfer = Firm NPV - ΔEquity
```

**Answer:** $X million transfers from equity to debt

## Key Insights

- Positive-NPV projects can be rejected due to debt overhang
- Limited liability creates option-like payoff for equity
- Existing debt holders benefit from new investment without contributing
- This is a key agency cost of debt

## Common Mistakes

- Concluding project should be taken because Firm NPV > 0 (ignoring equity's perspective)
- Forgetting to subtract equity's investment from incremental equity value
- Not applying limited liability (max function) in bad states
- Mixing up firm value vs equity value
