---
archetype: A1-CapitalStructure,A4-Distress
difficulty: hard
time: 40
---

# [Problem Title - Q3 Hybrid Problem with Multiple Deviations]

[Complex scenario involving multiple concepts - capital structure + distress/priority]

**Company Overview:**
- Firm characteristics
- Debt structure (senior + junior tranches)
- Default probabilities

**Debt Issuance Details:**

**Issue 0 (Senior Debt):**
- Face value: $X million
- Coupon rate: Y%
- Maturity: Z years

**Issue 1 (Junior Debt):**
- Face value: $A million
- Coupon rate: B%
- Maturity: Z years

**Default Risk:**
- Years 1-3: h1% annual hazard rate
- Years 4-5: h2% annual hazard rate

**Recovery in Default:**
- Senior debt: R1% of face value
- Junior debt: R2% of face value (after senior is paid)

**Other Parameters:**
- Corporate tax rate: τ%
- Risk-free rate: rf%
- Unlevered cost of equity: rA%

## Part A

Calculate the promised YTM for each debt issue.

### Solution

**Reasoning:** Promised YTM is the IRR of promised payments (assuming no default). For par bonds, YTM equals coupon rate.

**Calculation:**
```
Issue 0:
Annual coupon = Face × Coupon Rate = $X × Y% = $C0
YTM_promised_0 ≈ Y% (verify with IRR calculation if needed)

Issue 1:
Annual coupon = Face × Coupon Rate = $A × B% = $C1
YTM_promised_1 ≈ B%
```

**Answer:** YTM_0 = X%, YTM_1 = Y%

## Part B

Calculate the expected return on each debt issue, accounting for default risk.

### Solution

**Reasoning:** Expected return differs from promised yield due to default probability. Use hazard rate model to calculate survival probabilities, then compute expected cash flows.

**Calculation:**
```
Survival probabilities (constant hazard rate):
P(survive to year t) = (1 - h)^t

For each year:
P(survive) = (1-h)^t for years 1-3
P(survive) = (1-h1)^3 × (1-h2)^(t-3) for years 4-5

Expected cash flow each year:
E[CF_t] = P(survive to t) × Promised_CF + P(default in t) × Recovery

Then solve for IRR of expected cash flows = Expected Return
```

**Answer:** E[r_0] = X.X%, E[r_1] = Y.Y%

## Part C

Calculate the NPV of tax shields for each debt issue.

### Solution

**Reasoning:** Tax shields = τ × Interest payments, but must account for:
1. Tax shields lost if default occurs
2. Discount at expected return (not promised yield)

**Calculation:**
```
For each year t:
Interest_t = Face × Coupon Rate
Tax Shield_t = τ × Interest_t

Expected Tax Shield_t = P(survive to t) × Tax Shield_t

PV(Tax Shields) = Σ [Expected TS_t / (1 + E[r])^t]

Issue 0:
PV(TS_0) = ...

Issue 1:
PV(TS_1) = ...
```

**Answer:** PV(TS_0) = $X million, PV(TS_1) = $Y million

## Part D

Determine recovery amounts for each tranche in the default state.

### Solution

**Reasoning:** Absolute priority rule: senior debt paid first, junior gets remainder (if any). Total assets in default determine recovery.

**Calculation:**
```
Assume default occurs with assets = $V

Senior recovery:
  If V ≥ Face_Senior: Full recovery = Face_Senior
  If V < Face_Senior: Partial recovery = V

Junior recovery:
  Residual = max(0, V - Face_Senior)
  Junior gets min(Residual, Face_Junior)

Recovery rates:
  R_Senior = Recovery_Senior / Face_Senior
  R_Junior = Recovery_Junior / Face_Junior
```

**Answer:** Senior: $X million (R%); Junior: $Y million (R%)

## Key Insights

- Promised yield ≠ Expected return when default risk present
- Hazard rate model requires exponential survival decay: (1-h)^t
- Tax shields must be discounted at expected return, not promised yield
- Junior debt has much lower recovery than senior (priority matters)
- Higher expected return for junior debt reflects both default probability AND lower recovery

## Common Mistakes

- Using promised yield instead of expected return for discounting
- Treating hazard rate as cumulative probability (it's conditional)
- Forgetting that tax shields are lost in default
- Not applying absolute priority rule correctly
- Discounting at risk-free rate instead of expected return
- Double-counting default probability across periods
