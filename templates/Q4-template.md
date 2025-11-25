---
archetype: C1-RealOptions
difficulty: exam-level
time: 45
---

# [Problem Title - Q4 Comprehensive Real Options Problem]

[Detailed scenario involving strategic flexibility - option to wait, expand, or abandon]

**Project Overview:**
- Investment required
- Expected cash flows
- Uncertainty that resolves over time

**Option Characteristics:**
- Type: Option to [wait/expand/abandon]
- Exercise price: $X million (investment cost)
- Underlying asset: Project value
- Time to expiration: T years
- Volatility: σ%

**Market Parameters:**
- Risk-free rate: rf%
- Required return: r%

## Part A

Calculate the base NPV (invest immediately without flexibility).

### Solution

**Reasoning:** Standard NPV calculation assuming immediate investment. This serves as baseline to compare against option value.

**Calculation:**
```
NPV_base = -Investment + PV(Expected Cash Flows)
        = -I + Σ [E[CF_t] / (1+r)^t]
        = ...
```

**Answer:** NPV_base = $X million

## Part B

Build a binomial tree for project value evolution.

### Solution

**Reasoning:** Model uncertainty using binomial tree. Calculate up/down factors from volatility, then build tree forward.

**Calculation:**
```
Time step: Δt = 1 year
Up factor: u = e^(σ√Δt) = e^(σ×1) = ...
Down factor: d = 1/u = ...

Risk-neutral probability:
q = (e^(r×Δt) - d) / (u - d) = ...

Binomial Tree (Project Values):
                    Year 0    Year 1         Year 2
                      V0    →  V0×u       →  V0×u²
                           ↘  V0×d       ↗  V0×u×d
                                        ↘  V0×d²

Where V0 = PV(Cash Flows without investment) = NPV_base + I
```

**Answer:** [Complete binomial tree with values at each node]

## Part C

Value the option using backward induction.

### Solution

**Reasoning:** Work backwards from terminal nodes. At each node, compare:
- Exercise value = Project Value - Investment Cost
- Continuation value = PV(Expected Option Value next period)
Choose maximum (exercise or wait).

**Calculation:**
```
Terminal nodes (Year 2):
  Option Value = max(Project Value - I, 0)

Working backward to Year 1:
  Continuation Value = [q × Option_up + (1-q) × Option_down] / (1+rf)
  Exercise Value = max(Project Value - I, 0)
  Option Value = max(Exercise, Continue)

Year 0:
  Option Value_0 = [q × Option_1u + (1-q) × Option_1d] / (1+rf)
```

**Answer:** Option Value = $X million

## Part D

Compare immediate investment vs optimal exercise strategy.

### Solution

**Reasoning:** Compare NPV of immediate investment (Part A) against option value (Part C). The difference represents the value of flexibility.

**Calculation:**
```
Value of Flexibility = Option Value - max(NPV_base, 0)
                     = $X - $Y
                     = $Z million

Optimal Strategy:
  If uncertainty is high: Wait
  If NPV_base >> 0: Exercise immediately
  If NPV_base < 0 but option value > 0: Keep option alive
```

**Answer:**
- Optimal strategy: [Wait/Invest Now]
- Value of flexibility: $X million
- Exercise when: [Condition]

## Part E

Determine optimal exercise timing and conditions.

### Solution

**Reasoning:** Examine tree to find at which nodes we should exercise. Generally exercise when project value is sufficiently high that intrinsic value exceeds time value.

**Calculation:**
```
Exercise boundary:
  Exercise at node if: V - I > Continuation Value

From backward induction:
  Year 1, up state: [Exercise/Wait]
  Year 1, down state: [Exercise/Wait/Abandon]
  Year 2: Exercise only if V > I
```

**Answer:**
- Exercise if project value exceeds $X million in Year 1
- Wait if value is between $Y and $X
- Abandon if value falls below $Y

## Key Insights

- Flexibility has value even when base NPV is negative
- Option value = Intrinsic Value + Time Value
- Higher volatility increases option value (more upside potential, limited downside)
- Early exercise may be optimal for American options with cash flows
- Risk-neutral valuation uses risk-free rate for discounting, not required return
- The option to wait is valuable when uncertainty resolves over time

## Common Mistakes

- Using required return r instead of risk-free rate rf for discounting in binomial model
- Forgetting to compare exercise vs continuation at each node
- Calculating u and d incorrectly from volatility
- Not accounting for cash flows forgone during waiting period
- Mixing up risk-neutral probability with real-world probability
- Concluding option value = NPV (option value ≥ max(NPV, 0))
- Working forward instead of backward through the tree
