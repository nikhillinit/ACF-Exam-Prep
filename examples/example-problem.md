---
archetype: A1-CapitalStructure
difficulty: core
time: 25
---

# XYZ Corporation Debt Issuance with Default Risk

XYZ Corporation is considering issuing $150 million of senior debt to finance a new manufacturing facility. The debt will have a 5-year maturity with an annual coupon rate of 6%.

**Given Information:**
- Face value of debt: $150 million
- Annual coupon rate: 6%
- Maturity: 5 years
- Corporate tax rate: 30%
- Annual default probability (hazard rate): 5%
- Recovery rate in default: 60% of face value
- Unlevered cost of equity: 12%
- Risk-free rate: 3%

The company faces financial distress risk with a constant 5% annual hazard rate throughout the 5-year period. If default occurs, debt holders recover 60% of the face value.

## Part A

Calculate the promised yield to maturity (YTM) on the senior debt.

### Solution

**Reasoning:** The promised YTM is the internal rate of return (IRR) of the promised cash flows, assuming no default occurs. For a bond issued at par with annual coupons, the promised YTM equals the coupon rate.

**Calculation:**
```
Annual coupon payment = $150M × 6% = $9M
Face value payment at maturity = $150M

Promised cash flows:
Year 1-4: $9M (coupon only)
Year 5: $9M + $150M = $159M (coupon + principal)

For a par bond: Promised YTM = Coupon Rate = 6%

Verification:
PV = 9/1.06 + 9/1.06² + 9/1.06³ + 9/1.06⁴ + 159/1.06⁵
   = 8.49 + 8.01 + 7.55 + 7.13 + 118.82
   = 150.00 ✓
```

**Answer:** The promised YTM is 6.0%

## Part B

Calculate the expected return on the debt, accounting for the 5% annual default probability with hazard rate modeling.

### Solution

**Reasoning:** Expected return differs from promised yield because there's a probability of default. We must use the hazard rate model where survival probability decays exponentially. The expected cash flow each year equals the probability of surviving to that year times the promised payment, plus the probability of defaulting in that year times the recovery value.

**Calculation:**
```
Hazard rate h = 5% = 0.05

Survival probabilities (cumulative):
P(survive to year 1) = (1 - 0.05)¹ = 0.9500
P(survive to year 2) = (1 - 0.05)² = 0.9025
P(survive to year 3) = (1 - 0.05)³ = 0.8574
P(survive to year 4) = (1 - 0.05)⁴ = 0.8145
P(survive to year 5) = (1 - 0.05)⁵ = 0.7738

Probability of default in each year:
P(default in year t) = P(survive to t-1) - P(survive to t)

Year 1: 1.0000 - 0.9500 = 0.0500
Year 2: 0.9500 - 0.9025 = 0.0475
Year 3: 0.9025 - 0.8574 = 0.0451
Year 4: 0.8574 - 0.8145 = 0.0429
Year 5: 0.8145 - 0.7738 = 0.0407

Recovery value = 60% × $150M = $90M

Expected cash flows:
Year 1: 0.9500 × $9M + 0.0500 × $90M = $8.55M + $4.50M = $13.05M
Year 2: 0.9025 × $9M + 0.0475 × $90M = $8.12M + $4.28M = $12.40M
Year 3: 0.8574 × $9M + 0.0451 × $90M = $7.72M + $4.06M = $11.78M
Year 4: 0.8145 × $9M + 0.0429 × $90M = $7.33M + $3.86M = $11.19M
Year 5: 0.7738 × $159M + 0.0407 × $90M = $123.03M + $3.66M = $126.69M

Solving for IRR (expected return):
-150 + 13.05/(1+r) + 12.40/(1+r)² + 11.78/(1+r)³ + 11.19/(1+r)⁴ + 126.69/(1+r)⁵ = 0

Expected return r ≈ 5.2%
```

**Answer:** The expected return on the debt is approximately 5.2%, which is less than the 6% promised yield due to default risk.

## Part C

Calculate the present value of tax shields from this debt issuance.

### Solution

**Reasoning:** Tax shields equal the corporate tax rate times interest payments. However, we must account for two key factors: (1) tax shields are only realized if the firm survives, and (2) tax shields should be discounted at the expected return on debt (not the promised yield or risk-free rate).

**Calculation:**
```
Annual interest payment = $150M × 6% = $9M
Tax shield per year (if no default) = $9M × 30% = $2.7M

Expected tax shields (accounting for survival):
Year 1: 0.9500 × $2.7M = $2.565M
Year 2: 0.9025 × $2.7M = $2.437M
Year 3: 0.8574 × $2.7M = $2.315M
Year 4: 0.8145 × $2.7M = $2.199M
Year 5: 0.7738 × $2.7M = $2.089M

Discount at expected return (5.2%):
PV(TS) = 2.565/1.052 + 2.437/1.052² + 2.315/1.052³ + 2.199/1.052⁴ + 2.089/1.052⁵
       = 2.438 + 2.202 + 1.985 + 1.791 + 1.621
       = $10.04M
```

**Answer:** The present value of tax shields is approximately $10.0 million.

## Part D

Compare the expected return on debt (5.2%) to the promised yield (6.0%) and explain the difference in terms of risk premium.

### Solution

**Reasoning:** The difference between promised yield and expected return represents the default premium. Debt holders demand a 6% promised yield, but their expected return is only 5.2% because there's a chance they won't receive all promised payments.

**Calculation:**
```
Default premium = Promised YTM - Expected Return
                = 6.0% - 5.2%
                = 0.8% or 80 basis points

This premium compensates debt holders for:
1. Expected loss from default: 5% probability × 40% loss severity
2. Risk premium for bearing default risk

Expected loss per year ≈ 5% × 40% = 2% of face value
Recovery of 60% means 40% loss in default state
```

**Answer:** The 80 basis point spread represents the default premium. Debt holders require a 6% promised yield to achieve a 5.2% expected return, with the difference compensating for expected default losses.

## Key Insights

- **Promised yield ≠ Expected return** when default risk is present
- **Hazard rate model** requires exponential survival decay: (1-h)^t, not linear
- **Tax shields are risky** - they're lost if the firm defaults, so must account for survival probability
- **Discount rate matters** - tax shields should be discounted at expected return on debt, not risk-free rate or promised yield
- Default occurs only once, so probabilities must be carefully calculated as marginal (not cumulative) each year

## Common Mistakes

- **Using cumulative default probability** instead of hazard rate exponential decay
- **Discounting tax shields at wrong rate** (using promised yield or risk-free rate instead of expected return)
- **Forgetting tax shields are lost in default** - must weight by survival probability
- **Double-counting default** across multiple periods (default can only happen once)
- **Mixing up recovery rate and loss rate** (60% recovery = 40% loss given default)
- **Not solving for IRR correctly** when calculating expected return from expected cash flows
