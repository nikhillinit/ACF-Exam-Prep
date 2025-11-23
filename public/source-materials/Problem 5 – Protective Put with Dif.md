Problem 5 – Protective Put with Different Strikes and Volatility

You are considering two ways to invest in stock Z:

Strategy A (Naked Equity): Buy 1 share of Z at S₀ = 100.

Strategy B (Protective Put): Buy 1 share of Z at 100 and 1 put with strike K = 90 expiring in one year. The put costs $5.

Assume risk-free rate 
𝑟
𝑓
=
2
%
r
f
	​

=2%.

Case 1 (Moderate volatility):
In one year, stock price is either 80 (down state) or 120 (up state), each with probability 50%.

Case 2 (High volatility):
In one year, stock price is either 60 (down state) or 140 (up state), each with probability 50%.

Tasks:

A. For Case 1, compute the payoff and one-year return for Strategy A and Strategy B.

B. Repeat for Case 2 (more volatile distribution).

C. Compare the expected returns and risk patterns across strategies and cases. How do changing the strike and volatility affect:

Downside protection

Upside participation

Expected return and β?

Solution 5
A. Case 1: S_T ∈ {80, 120}, K = 90

Strategy A – Naked Equity

Initial cost: 100.

If S_T = 80 → payoff = 80 → profit = 80 − 100 = −20 → return = −20%.

If S_T = 120 → payoff = 120 → profit = 120 − 100 = +20 → return = +20%.

Expected return:

E[return] = 0.5(−20%) + 0.5(20%) = 0%.

Strategy B – Protective Put (K=90, put cost=5)

Initial cost: 100 (stock) + 5 (put) = 105.

Payoffs:

If S_T = 80:

Stock = 80

Put payoff = max(90 − 80, 0) = 10

Total payoff = 80 + 10 = 90

Profit = 90 − 105 = −15 → return = −15 / 105 ≈ −14.3%

If S_T = 120:

Stock = 120

Put = max(90 − 120, 0) = 0

Total payoff = 120

Profit = 120 − 105 = 15 → return = 15 / 105 ≈ +14.3%

Expected return:

E[return] ≈ 0.5(−14.3%) + 0.5(+14.3%) = 0%.

So in this toy symmetric case, both strategies have expected return 0%, but:

A: ±20% swings

B: ±14.3% swings (less volatility).

B. Case 2: S_T ∈ {60, 140}, K = 90

Same initial costs; underlying is more volatile.

Strategy A – Naked Equity

Initial cost: 100.

Down state S_T = 60:

Profit = 60 − 100 = −40 → return = −40%.

Up state S_T = 140:

Profit = 140 − 100 = +40 → return = +40%.

Expected return:

E[return] = 0.5(−40%) + 0.5(40%) = 0%.

Variability has doubled.

Strategy B – Protective Put (K=90)

Initial cost = 105.

Down state S_T = 60:

Stock = 60

Put payoff = max(90 − 60, 0) = 30

Total payoff = 60 + 30 = 90

Profit = 90 − 105 = −15 → return = −14.3%

Up state S_T = 140:

Stock = 140

Put payoff = 0

Total payoff = 140

Profit = 140 − 105 = 35 → return = 35 / 105 ≈ +33.3%

Expected return:

E[return] ≈ 0.5(−14.3%) + 0.5(33.3%) ≈ 9.5%.

If the put price stayed at 5 while volatility increased, this combination now has a positive expected return, because more of the payoff distribution lies in the high-upside region that the put doesn’t cap.

C. Intuition: Changing K and volatility

Downside protection:

The put sets a floor at 90 regardless of how bad the stock does; in Case 1 and Case 2, the worst total payoff is 90.

As underlying volatility rises (80→60 in the down state), the stock alone gets more painful in lows (−40% instead of −20%), but the protective put keeps loss fixed at −15 on the combined position.

Upside participation:

Protective put does not cap upside; you still fully participate in stock gains beyond 90.

With higher volatility, upside states are further out (140 vs 120), so your gains on the protected position grow faster.

Expected return & β:

In a properly priced market, put premium would increase when volatility increases, preventing “free lunch.”

At a fixed low put price, higher volatility increases expected payoff and thus expected return and β of the position that is net long convexity (long stock + long put).

In equilibrium, higher volatility leads to a higher cost of the put so that the expected return of the protected position still matches its systematic risk in CAPM.

Bottom line:
Raising volatility while holding put price fixed increases both the variance and the expected return of the protective strategy; in reality, option prices adjust so that required return per unit β stays consistent.

SET 6 – Changing Bond Default Probability and Tax Rate
Problem 6 – Debt, Default, and Tax Shields with Parameters Changed

A firm issues a 3-year bond:

Face value: $200m

Coupon: 8% annually

Issue price: 100% of par (so coupon = promised yield).

Corporate tax rate initial: 25%.

Risk-free rate: 3%.

Market risk premium: 6%.

Default risk (Case 1):

5% probability of default at maturity (Year 3).

Recovery in default: 50% of face including final coupon.

Tasks:

A. Compute the promised yield and explain why it equals 8% in Case 1.

B. Approximate the expected return on the bond in Case 1 given the default assumptions.

C. Compute the NPV of the tax shields over 3 years (coupon × tax rate), assuming no default before maturity (i.e., default only affects Year 3’s shield via survival probability) and discounting at the bond’s expected return.

D. Now suppose:

Corporate tax rate falls to 15%, and

Default probability increases to 15% with same recovery.
Qualitatively, how do:

Expected return

Bond β

NPV of tax shields
change vs Case 1?

Solution 6
A. Promised yield = coupon when priced at par

Price = 100% of par, coupon = 8%.

Promised yield to maturity (YTM) is the IRR that equates the present value of coupon + principal to the price.

For a bond priced at par with coupon = 8% and risk-free defaultless environment, the promised YTM = 8%.

Here, despite default risk, investors are being promised an 8% yield if all coupons and principal are paid. So promised yield = 8% by construction.

B. Expected return in Case 1

We focus on total payoff at maturity:

If no default (95% prob):

Coupons: Year 1 = 16, Year 2 = 16, Year 3 = 16.

Principal: 200 at Year 3.

If default at maturity (5% prob):

Recovery = 50% of face including final coupon.

Face + final coupon at maturity would be: 200 + 16 = 216.

Recovery = 0.5 × 216 = 108 at maturity.

Assume coupons in Years 1 and 2 still paid (the usual stylized exam assumption; if not, you adjust accordingly).

For a quick approximation ignoring mid-year defaults and intermediate coupon survival:

Expected cashflow at Year 3 (ignoring discounting):

Good state: 216 (principal + final coupon) with 95%.

Default state: 108 with 5%.

𝐸
[
CF
3
]
=
0.95
×
216
+
0.05
×
108
=
205.2
+
5.4
=
210.6
E[CF
3
	​

]=0.95×216+0.05×108=205.2+5.4=210.6.

But you invested 200 today; you also get coupons in Years 1 and 2 (16 each). Let’s approximate expected return per year using the average return interpretation:

Rough idea:

Total promised “good path” cashflows: 16, 16, 216.

Expected reduction from default only hits the final payoff:

Expected reduction in final payoff = 0.05 × (216 − 108) = 0.05 × 108 = 5.4.

So in expectation, you lose 5.4 of the promised 216, which is 5.4/200 ≈ 2.7 percentage points spread over 3 years, ~0.9 percentage points per year.

So:

Promised yield = 8%;

Expected return ≈ 8% − 0.9% ≈ 7.1% per year.

(In a more exact solution you’d solve the IRR on expected cashflows, but this is the intuitive exam approximation.)

C. NPV of tax shields (Case 1)

Annual interest = 16M each year (8% of 200M).

Tax rate = 25%.

Tax shield each year (if alive) = 0.25 × 16 = 4M.

Assuming default only at maturity:

Years 1 & 2: survival = 100%.

Year 3: survival = 95%; if default, we assume last year’s tax shield is lost (or smaller).

So expected tax shields:

Year 1: 4M

Year 2: 4M

Year 3: 0.95 × 4M = 3.8M

Discount at E[r_D] ≈ 7.1%:

𝑃
𝑉
(
TS
1
)
=
4
/
1.071
≈
3.73
PV(TS
1
	​

)=4/1.071≈3.73
𝑃
𝑉
(
TS
2
)
=
4
/
1.071
2
≈
3.48
PV(TS
2
	​

)=4/1.071
2
≈3.48
𝑃
𝑉
(
TS
3
)
=
3.8
/
1.071
3
≈
3.10
PV(TS
3
	​

)=3.8/1.071
3
≈3.10

Total TS NPV ≈ 3.73 + 3.48 + 3.10 ≈ 10.3M.

D. Changing τ and default probability

Now:

Tax rate τ drops from 25% → 15%.

Default probability rises from 5% → 15%.

Effects:

Expected return E[r_D]:

Higher default probability reduces expected payoff (more chance of getting only 108 instead of 216 at maturity).

To compensate, price must fall or required return must rise (for given price).

So E[r_D] increases vs Case 1.

Bond β:

With more default risk, bond payoffs become more sensitive to the economic state (good vs bad).

That means the bond’s β becomes more positive (greater co-movement with the market), enlarging the spread between E[r_D] and r_f.

NPV of tax shields:

Two opposing effects:

Lower τ: reduces each tax shield from 4M to 0.15 × 16 = 2.4M → TS smaller each year.

Higher r_TS (discount rate for TS) from higher E[r_D]: reduces PV of TS further.

Higher default probability: more chance to lose tax shields in late years.

All three push TS NPV down significantly.

Overall, we can say:

Expected return ↑

Debt β ↑

TS NPV ↓

Intuition:
Lower tax rate means the government is taking a smaller slice, so interest deductions help less. Higher default risk makes the bond more risky and more expensive in expected-value terms, so tax shields are both smaller and more heavily discounted.

SET 7 – Multi-State Project with Probability and Distribution Changes
Problem 7 – Changing Probabilities and State Payoffs in a Financing Problem

An all-equity firm has current assets worth either 
𝑉
0
=
200
V
0
	​

=200 or 
𝑉
0
=
300
V
0
	​

=300 in one year with the following probabilities:

Case A:

State 1 (50%): Assets = 200

State 2 (50%): Assets = 300

The discount rate is 10%. The firm can invest I = 60 today in a project with one-year payoffs:

State 1: 60

State 2: 80

The firm has no cash and must finance the project by issuing equity at fair value.

A. Compute firm value without the project.

B. Compute NPV(project) in an M&M world.

C. Compute post-project firm value and the fraction of equity sold to new investors.

D. Compute old shareholders’ wealth before vs after the project + equity issue. Does equity capture the full NPV?

Now consider Case B, where probabilities change to:

State 1 (30%): Assets = 200; Project payoff = 60

State 2 (70%): Assets = 300; Project payoff = 80

Keep discount rate and project cost the same.

E. How do the project NPV, fraction sold, and value captured by old shareholders change in Case B?

F. Intuition: How does shifting probability mass toward the good state affect:

NPV_total

NPV to old equity?

Solution 7
A. Firm value without project (Case A)

Assets one year:

50% → 200

50% → 300

Expected asset value in 1 year:

𝐸
[
𝑉
1
]
=
0.5
×
200
+
0.5
×
300
=
100
+
150
=
250
E[V
1
	​

]=0.5×200+0.5×300=100+150=250

Present value at r=10%:

𝑉
pre
=
250
/
1.1
≈
227.27
V
pre
	​

=250/1.1≈227.27

This is also current equity value since there is no debt.

B. Project NPV in M&M world (Case A)

Project payoffs: 60 or 80, 50/50.

Expected project payoff:

𝐸
[
Proj
1
]
=
0.5
×
60
+
0.5
×
80
=
30
+
40
=
70
E[Proj
1
	​

]=0.5×60+0.5×80=30+40=70

Present value:

𝑃
𝑉
(
project
)
=
70
/
1.1
≈
63.64
PV(project)=70/1.1≈63.64

NPV:

𝑁
𝑃
𝑉
=
63.64
–
60
≈
+
3.64
NPV=63.64–60≈+3.64

So project is value-creating with NPV ≈ 3.64.

C. Post-project firm value and fraction sold (Case A)

Total expected asset value with project:

𝐸
[
𝑉
1
with
]
=
𝐸
[
old
]
+
𝐸
[
project
]
=
250
+
70
=
320
E[V
1
with
	​

]=E[old]+E[project]=250+70=320

Present value:

𝑉
post
=
320
/
1.1
≈
290.91
V
post
	​

=320/1.1≈290.91

To raise 60 in cash now, the firm issues equity:

k = 60 / V_post = 60 / 290.91 ≈ 0.2062 (20.62%)

D. Old shareholders’ wealth change (Case A)

Old equity pre = V_pre ≈ 227.27.

Old equity post = (1 − k) × V_post = 0.7938 × 290.91 ≈ 231.00 (approx).

Change in wealth for old shareholders:

Δ
𝑊
old
=
231.00
–
227.27
≈
+
3.73
ΔW
old
	​

=231.00–227.27≈+3.73

Note:

NPV_total ≈ +3.64

Old equity gain ≈ +3.73 (small rounding).

So old shareholders capture essentially all of the project’s NPV here. Equity issue at fair value in an all-equity firm with no debt and no special priorities leads to old equity capturing the NPV, as expected in M&M.

E. Redo with Case B probabilities

Now:

State 1 (30%): old assets = 200, project = 60

State 2 (70%): old assets = 300, project = 80

Firm without project:

𝐸
[
𝑉
1
old
]
=
0.3
×
200
+
0.7
×
300
=
60
+
210
=
270
E[V
1
old
	​

]=0.3×200+0.7×300=60+210=270
𝑉
pre
𝐵
=
270
/
1.1
≈
245.45
V
pre
B
	​

=270/1.1≈245.45

Project alone:

𝐸
[
Proj
1
]
=
0.3
×
60
+
0.7
×
80
=
18
+
56
=
74
E[Proj
1
	​

]=0.3×60+0.7×80=18+56=74
𝑃
𝑉
(
project
)
=
74
/
1.1
≈
67.27
PV(project)=74/1.1≈67.27

NPV:

𝑁
𝑃
𝑉
𝐵
=
67.27
–
60
=
7.27
>
3.64
NPV
B
=67.27–60=7.27>3.64

So under the new probabilities, project is more valuable since high state is more likely.

Total E[V_1 with project] = 270 + 74 = 344

𝑉
post
𝐵
=
344
/
1.1
≈
312.73
V
post
B
	​

=344/1.1≈312.73

Fraction to new investors:

𝑘
=
60
/
312.73
≈
0.1918
(
19.18
k=60/312.73≈0.1918(19.18

Old equity post:

𝑊
old, post
𝐵
=
(
1
−
0.1918
)
×
312.73
≈
0.8082
×
312.73
≈
252.96
W
old, post
B
	​

=(1−0.1918)×312.73≈0.8082×312.73≈252.96

Old equity pre: 245.45.

Change:

Δ
𝑊
old
𝐵
≈
252.96
−
245.45
≈
7.51
ΔW
old
B
	​

≈252.96−245.45≈7.51

Project NPV = 7.27; old shareholders gain ≈ 7.51 (rounding). Again, almost all project NPV flows to old equity.

F. Intuition: shifting probability toward good state

NPV_total:

Higher probability of good state → higher expected project payoff → higher project NPV.

We saw NPV jump from ~3.64 to ~7.27.

Fraction sold (k):

V_post increases, so for a fixed $60 raise, k shrinks slightly (20.6% → 19.2%).

That means old equity is slightly less diluted.

NPV to old equity:

Old equity’s gain goes from ~3.7 to ~7.5, basically capturing the larger project NPV.

Without debt or priority complications, the market values project fairly and old equity sees almost the entire increase.

Key pattern:
Changing the probability mass toward the good state raises NPV and benefits old equity more, but does not in this simple case create conflict between NPV(project) and NPV(equity)—they move together. Under debt or asymmetric information (debt overhang / adverse selection), this could change and create underinvestment; here, it’s still “take the project.”

SET 8 – Real Options: Changing Discount Rate and Information Quality
Problem 8 – Option to Wait with Changed Discount Rate and Research Quality

A firm is considering building a new facility. Investment cost is $100m. One year from today, the project’s present value (if built at that time) will be either:

High state (H): PV = $150m

Low state (L): PV = $80m

Today, before learning the state, the firm can either:

Invest now (build immediately), or

Wait one year, observe state, and then decide whether to invest.

Assume the risk-free rate is 5% and that discounting is done at that rate.

Case 1 (original): Perfect information after waiting

If it waits, the firm will know whether state is H or L next year and can invest then.

Probabilities:

P(H) = 50%, P(L) = 50%.

Tasks:

A. Compute NPV if the firm invests now, ignoring the option to wait.

B. Compute NPV if the firm waits for perfect information and then invests optimally.

C. Compute the value of waiting (real option) in Case 1.

Now consider Case 2 (imperfect research):

The firm can buy a noisy forecast that correctly identifies H vs L 80% of the time.

After receiving the forecast, the firm can decide to invest or not; if forecast is wrong, it may invest in L or skip H mistakenly.

D. Qualitatively, how does the value of waiting change if:

The discount rate rises from 5% to 12%?

The research is imperfect (80% accuracy vs 100%)?
Explain why.

Solution 8
A. NPV of investing now (Case 1, no waiting)

If invest now, you pay 100 today and project PV (as of today) is random:

Today’s expected PV = E[PV] = 0.5×150 + 0.5×80 = 75 + 40 = 115.

NPV_now = 115 − 100 = +15.

(We assume the 150 and 80 are already present values at t=0; if they were t=1 values, you’d discount them, but structure same.)

B. NPV of waiting with perfect information (Case 1)

If you wait 1 year, then:

If high state H: PV of project if built then is 150 (in today’s dollars or in t=1 PV terms—interpretation consistent). You pay 100 at that time, so NPV_H = 50 (150 − 100).

If low state L: PV of project = 80 < cost 100, so best action is not to invest; NPV_L = 0.

Expected NPV from waiting:

𝑁
𝑃
𝑉
wait
=
𝑃
(
𝐻
)
×
𝑁
𝑃
𝑉
𝐻
+
𝑃
(
𝐿
)
×
𝑁
𝑃
𝑉
𝐿
=
0.5
×
50
+
0.5
×
0
=
25
NPV
wait
	​

=P(H)×NPV
H
	​

+P(L)×NPV
L
	​

=0.5×50+0.5×0=25

NPV_wait = +25.

C. Value of waiting (perfect info, r=5%)

Value of real option = NPV_wait − NPV_now = 25 − 15 = +10.

Interpretation:

If you invest now, sometimes you mistakenly build in L (bad) and sometimes you build in H (good).

If you wait with perfect info, you avoid building in L and only build in H, raising expected NPV from 15 → 25.

D. Changing discount rate and research quality

Now think about how rising discount rate and imperfect information change the option’s value.

Higher discount rate (5% → 12%)

Waiting pushes out both cost and payoff by a year.

When discounting at a higher r, future cashflows are less valuable relative to now.

The option to wait is more valuable when:

The information is worth a lot relative to the cost of delay.

Rising r has two effects:

The benefit of waiting (avoiding bad projects, capturing good ones) is discounted more heavily → VOI shrinks.

If the distribution of project PV is unchanged, the cost of delay eats more of the high-state payoff.

So with higher r, value of waiting falls: you’re less willing to defer a good project because the delay penalty is larger.

Imperfect information (80% accuracy)

With perfect information, you always do the right thing (invest in H, skip L).

With 80% accuracy, you sometimes:

Invest in L (false positive) and lose money.

Miss H (false negative) and forgo positive NPV.

Net effect:

Expected NPV of “wait and then invest conditionally on forecast” is smaller than with perfect info.

You still reduce mistakes relative to “invest now blindly,” but not as much.

Thus:

Imperfect information → VOI declines vs perfect info case.

If accuracy is very low (<50%), it may be worse than random, and the value of waiting can even become negative (you’d be better off ignoring or “inverting” the forecast).

Overall intuition:

Real option value is highest when:

r is low (cost of delay is small).

Information is high quality (you really do avoid bad states and capture good states).


As r rises or info quality falls, the value of waiting shrinks, possibly to zero or negative if conditions are extreme.

---

# 9. Bond Tax Shields – Changing Recovery

## Problem 9 – Same Coupon & Price, Higher Recovery

A firm issues a 4-year bullet bond:

* Face value: $300m
* Coupon: 7% annually
* Issue price: 100% of par
* Corporate tax rate: 25%
* Risk-free rate: 3%, market risk premium: 6%

Case A (baseline):

* Default probability at maturity: 10%
* Recovery in default: **40%** of face plus final coupon

Case B:

* Recovery in default increases to **70%** (same default probability).

**Tasks:**

A. In Case A, approximate the expected return on the bond relative to the 7% promised yield.
B. Describe qualitatively how increasing recovery to 70% in Case B affects:

* Expected return
* Debt β
* NPV of tax shields

---

### Solution 9

**A. Case A: Expected return vs promised yield**

* Promised yield = 7% (priced at par).
* If default only at maturity, expected loss is:

  * Probability of default × (promised payoff – recovery payoff) at maturity.
* With low recovery (40%), the “bad state” payoff is far from promised, so expected loss is larger.

Approximate logic:

* Promised YTM = 7%
* Expected return ≈ 7% − “default loss correction”
* With p_default = 10%, poor recovery, default loss correction might be ~1–1.5% per year ⇒ E[r_D] ≈ 5.5–6%.

(Exact value would require IRR on expected cashflows, but intuition: E[r_D] < 7%.)

**B. Effect of increasing recovery (Case B)**

If recovery increases from 40% → 70%:

* Expected loss in default **shrinks**.
* For same price and default probability:

  * Expected return **rises** (closer to 7%) because the bad state is less bad.
  * The bond β **shrinks**:

    * Payoff is less sensitive to the “good vs bad” macrostate; bond is safer.
* Tax shields: TS = τ × interest each year, discounted at a TS discount rate (often approximated by E[r_D] if shields are debt-like):

  * Higher E[r_D] in Case A (if price adjusts) → changes TS discount rate.
  * With better recovery, the debt is **less risky**, so TS are **less risky** and can be discounted at a lower rate.
  * But for a fixed coupon/face/τ, the **present value of TS** increases because:

    * Probability of survival (to get interest) doesn’t change,
    * But the appropriate discount rate for TS is **lower** and closer to risk-free.

**Intuition:**
Better recovery makes debt more bond-like and less equity-like: expected return rises (for fixed price), β falls, and TS associated with that debt become safer and more valuable.

---

# 10. Bond TS – Changing Coupon vs Par

## Problem 10 – Discount Bond vs Par Bond

Firm B issues a 5-year bullet bond:

* Face value: $250m
* Corporate tax rate: 30%

Case A (par):

* Coupon = 6%
* Price = 100% of par → YTM = 6%

Case B (discount):

* Coupon = 4%
* Price = 94% of par → promised YTM ≈ 6%

Default risk is negligible in both cases.

**Tasks:**

A. For Case A, compute annual tax shield and TS NPV assuming perpetual refinancing at 6%.
B. For Case B, compute annual tax shield and compare TS NPV with Case A, assuming YTM 6%.
C. Intuition: Even if YTM matches, how does changing coupon vs price affect TS?

---

### Solution 10

**A. Case A – Par bond, coupon 6%**

Interest each year = 0.06 × 250 = 15m
Tax shield each year = τ × interest = 0.30 × 15 = 4.5m

If you assume perpetual refinancing at same terms and discount TS at YTM = 6%:

[
V_{TS}^{A} = \frac{4.5}{0.06} = 75m
]

**B. Case B – Discount bond, coupon 4%**

Interest each year = 0.04 × 250 = 10m
Tax shield each year = 0.30 × 10 = 3m

Even if promised YTM is ~6% (because price < par), the **coupon** is lower.

Perpetual TS approximation:

[
V_{TS}^{B} = \frac{3}{0.06} = 50m
]

So TS is **lower** because the **interest expense** (and thus shield) is lower.

**C. Intuition**

* Tax shield depends on **interest paid**, not YTM.
* Two bonds with same YTM but different coupons:

  * Higher coupon → higher interest → bigger tax shield.
  * Discount bond (lower coupon, lower price) has smaller annual interest and smaller TS even if required return is the same.
* Economically: the tax advantage of debt is tied to **the size of interest deductions**, not the market’s required return.

---

# 11. Multi-State Debt – Changing Face Value

## Problem 11 – Debt Face Value and Default Region

A firm’s asset value in one year is:

* State 1 (30%): $100m
* State 2 (40%): $150m
* State 3 (30%): $220m

The firm considers issuing zero-coupon debt maturing in one year.

Case A:

* Face value of debt: **F = $140m**

Case B:

* Face value increases to **F = $180m**

**Tasks:**

A. For Case A, compute debt and equity payoff in each state.
B. Same for Case B.
C. Intuition: How does raising F change:

* Probability of default
* Equity’s payoff pattern
* Equity’s incentive to increase risk?

---

### Solution 11

**Case A (F = 140)**

State 1: V = 100 < 140

* Debt gets 100, equity = 0 (default).

State 2: V = 150 > 140

* Debt gets 140, equity = 10.

State 3: V = 220 > 140

* Debt gets 140, equity = 80.

**Default in State 1 only** (30%).

**Case B (F = 180)**

State 1: V = 100 < 180

* Debt = 100, equity = 0 (default).

State 2: V = 150 < 180

* Debt = 150, equity = 0 (default).

State 3: V = 220 > 180

* Debt = 180, equity = 40.

Now default occurs in States 1 & 2 (70% combined).

**Intuition:**

* Raising F pushes the **default threshold** up; more states end in default.
* Equity becomes a more out-of-the-money call on the firm’s assets:

  * Equity now only pays off in the best state.
  * Equity’s payoff is more sensitive to **extreme upside** and zero in more moderate states.
* Thus, equity has **stronger incentives to increase volatility** (“risk-shifting”), since only very high values rescue them.

---

# 12. Multi-State Project – Changing Project Payoff Skew

## Problem 12 – Debt Overhang with a “Good-in-Bad-States” Project

Same firm as Problem 11, but it already has debt F = 140 (Case A, one-year zero coupon).

Project P costs 30 today and yields in one year:

Case 1 (good-in-good-states):

* State 1: +10
* State 2: +20
* State 3: +40

Case 2 (good-in-bad-states):

* State 1: +40
* State 2: +20
* State 3: +10

Discount rate = 10%. Old debt outstanding cannot be changed.

**Tasks:**

A. In Case 1, do most of the project’s benefits go to debt or equity?
B. In Case 2, do most of the project’s benefits go to debt or equity?
C. Intuition: which pattern is more likely to create **debt overhang** (equity rejecting a positive-NPV project)?

---

### Solution 12 (Qualitative)

We focus on where the **marginal payoff** of the project changes payoffs.

**Case 1 (project pays more in high states)**

* Old default regime: only State 1 is default.
* Project is small in State 1 (+10), bigger in States 2,3 when debt is already safe.
* Most of the incremental payoff in States 2,3 flows to **equity** (because debt is already fully paid).
* So the project’s benefits accrue **mainly to equity**; debt doesn’t gain much.

**Case 2 (project pays more in bad states)**

* Project is large in State 1 (+40), medium in State 2 (+20), small in State 3 (+10).
* In low asset states, the project’s gains go first to **debt**, reducing default losses.
* Equity may still be wiped out in bad states, so project’s improvements primarily repair creditor losses, not equity’s payoff.

**Debt overhang intuition:**

* A project whose marginal payoff mostly helps **bad states** where debt is at risk (Case 2) is more prone to **debt overhang**:

  * Total firm NPV may be positive,
  * But equity sees little incremental payoff after paying debt.
  * Equity might refuse to fund the project even though it increases total value.
* A project whose payoff is concentrated in **good states** (Case 1) mostly benefits equity; they are more likely to approve it.

---

# 13. Project Probabilities – Changing Good/Bad Probabilities Under Debt Overhang

## Problem 13 – Probability Shift with Existing Debt

Same as Problem 12 Case 2 (good-in-bad-states project), but now we’ll change probabilities.

Assets still:

* State 1: 100
* State 2: 150
* State 3: 220

Debt: F = 140.

Project P (good in bad states):

* State 1: +40
* State 2: +20
* State 3: +10

Case A probabilities:

* (0.4, 0.4, 0.2)

Case B probabilities:

* (0.2, 0.4, 0.4)

**Tasks:**

A. In which case is total NPV more likely to be positive?
B. In which case is **equity** more likely to reject the project (debt overhang)?
C. Intuition: how does increasing probability of good states change debt vs equity’s claim on project NPV?

---

### Solution 13 (Qualitative)

* The project’s payoff is skewed toward **bad** states (40 in State 1, 20 in State 2, 10 in State 3).
* Debt is at risk in bad state(s), already safe in the best state.

**Case A (more mass in bad states)**

* 40% chance of State 1, 40% chance of State 2.
* The project’s biggest payoff (40) happens relatively often in State 1 where debt suffers.
* So more of the project’s benefit flows to **debt** (repairing default losses).
* Total NPV may be strongly positive, but equity sees only limited incremental payoff in States 1 & 2.

**Case B (more mass in good states)**

* 20% probability of State 1, 40% for State 2, 40% for State 3.
* Project’s large payoff in State 1 matters less, more weight is on moderate/good states where debt is safe or nearly safe.
* So more of the project’s benefit flows to **equity** (or at least not exclusively to debt).

**Answers:**

A. Total NPV is more likely to be **positive in Case A**, because project pays big when firm value is low (classic risk-hedging project) and those bad states are frequent.

B. Equity is more likely to **reject** the project in Case A (classic debt overhang), because:

* That’s where the project helps the **debt holders** most (in bad states).
* Equity gets less incremental payoff relative to their funding cost.

C. Intuition: shifting probability toward good states (Case B) makes the project’s NPV distribution more equity-friendly, reducing underinvestment risk.

---

# 14. CAPM – Changing Market Risk Premium and Risk-Free Rate

## Problem 14 – WACC and Firm Value Under Different MRP & r_f

Firm E has:

* Asset beta β_A = 1.0
* No debt (all equity)
* Expected cashflow next year: CF₁ = $100m, growing at g = 2% perpetually.

**Case A:**

* r_f = 2%, MRP = 8%
* Discount rate r_A = 2% + 1.0×8% = 10%

**Case B:**

* r_f = 4%, MRP = 4%
* New discount rate r_A = 4% + 1.0×4% = 8%

**Tasks:**

A. Compute firm value in Case A and Case B.
B. Intuition: how can firm value rise even if risk-free rates increase from 2% → 4%?

---

### Solution 14

Value using Gordon Growth formula:

[
V = \frac{CF_1}{r_A − g}
]

**Case A: r_A = 10%**

[
V_A = \frac{100}{0.10 − 0.02} = \frac{100}{0.08} = 1250
]

**Case B: r_A = 8%**

[
V_B = \frac{100}{0.08 − 0.02} = \frac{100}{0.06} ≈ 1666.7
]

So value in Case B is **higher** (~1667 vs 1250).

**Intuition:**

* Although r_f rose from 2% to 4%, the **market risk premium fell** (8%→4%), lowering the total risk premium and expected return from 10%→8%.
* The key is the **total discount rate r_A**: it went **down**, not up, because the fall in MRP more than offset the rise in r_f.
* Firm value is driven by CF and r − g; if r falls, value rises regardless of what components (r_f vs MRP) changed.

---

# 15. CAPM – Changing β and MRP While Keeping r_f Fixed

## Problem 15 – Same Asset, Different States of the World

A project has:

* β_project = 1.2
* CF₁ = $50m, growth g = 0% (perpetuity)
* r_f = 3%

**Case A: MRP = 6%**
**Case B: MRP = 3%**

**Tasks:**

A. Compute project value in both cases.
B. Intuition: what does a lower MRP mean for valuation if β is unchanged?

---

### Solution 15

Expected return on project:

* Case A: r_A = 3% + 1.2×6% = 10.2%
* Case B: r_A = 3% + 1.2×3% = 6.6%

Value = CF₁ / (r − g) = 50 / r (since g=0).

* Case A: V = 50 / 0.102 ≈ 490.2
* Case B: V = 50 / 0.066 ≈ 757.6

Lower MRP → lower discount rate → **higher project value**.

**Intuition:**
If markets require less compensation per unit β (lower MRP), all risky cashflows discount at a lower rate, increasing valuations even if β hasn’t changed.

---

# 16. P/CF Multiple – Changing Growth and Discount Rate

## Problem 16 – Two Firms, Different Growth and r

Two firms both have current cashflow CF₁ = $100m.

Firm A:

* Growth g_A = 2%
* Discount rate r_A = 8%

Firm B:

* Growth g_B = 5%
* Discount rate r_B = 10%

**Tasks:**

A. Compute P/CF for each if valued as growth perpetuities.
B. Intuition: can a higher growth but higher risk firm have the same or lower multiple than a lower growth, lower risk firm?

---

### Solution 16

Value = CF₁ / (r − g).

Firm A:

[
V_A = \frac{100}{0.08 − 0.02} = \frac{100}{0.06} ≈ 1667 → P/CF ≈ 16.7×
]

Firm B:

[
V_B = \frac{100}{0.10 − 0.05} = \frac{100}{0.05} = 2000 → P/CF = 20×
]

In this calibration, the higher growth “wins” enough to give a higher multiple, despite higher risk.

If instead r_B was, say, 12%:

[
V_B = \frac{100}{0.12 − 0.05} = \frac{100}{0.07} ≈ 1429 → P/CF ≈ 14.3×
]

Now the higher risk more than offsets higher growth, and B has a **lower multiple**.

**Intuition:**
Multiples depend on **both** growth and risk: higher growth pulls multiples up, higher required return pushes them down. The net effect depends on which dominates.

---

# 17. Under/Overinvestment – Changing Project Size

## Problem 17 – Project Size Relative to Firm

An all-equity firm has value V = $500m. It has a project with:

* Cost I = 50
* PV of future cashflows = 60

So NPV = +10.

Case A: Only **one** such project exists.
Case B: **Ten** identical projects exist (total I=500, PV=600, NPV=+100).

**Tasks:**

A. Which case creates more absolute value?
B. Which case is more likely to be constrained by **financing frictions** (adverse selection, limits to debt capacity)?
C. Intuition: how does project scale matter for underinvestment risk?

---

### Solution 17

A.

* Case A: NPV = +10
* Case B: ten× that ⇒ NPV = +100

B.

* When NPV is small relative to firm value (Case A), the firm can often fund it internally or with modest financing; even with some friction, most value can be captured.
* When NPV is **large** (Case B), the firm may need to issue substantial equity or debt:

  * If equity is undervalued (adverse selection), PEcking Order says they might refuse.
  * If debt capacity is limited, they may not be able to borrow enough without major distress risk.

C.

* Larger project scale magnifies **underinvestment risk** under frictions:

  * More NPV is potentially left on the table if the firm cannot or will not finance.
  * The bigger the wedge between total NPV and NPV to equity under certain financing, the more dramatic the underinvestment problem becomes.

---

# 18. Negative Alpha – Changing Sample Length

## Problem 18 – Alpha Significance and Sample Size

A CAPM regression for stock Z over 12 months yields:

* α̂ = −3% (annualized)
* Standard error of α̂ ≈ 2%

Case A: Uses 12 months of data.
Case B: Uses 60 months of data and gets the same point estimate α̂ = −3%, but standard error now ≈ 1%.

**Tasks:**

A. In which case is the negative alpha statistically more credible?
B. Intuition: why does longer sample length change your confidence, even if the point estimate is unchanged?

---

### Solution 18

A.

* Case A: t-stat ≈ −3 / 2 = −1.5 (not very significant).
* Case B: t-stat ≈ −3 / 1 = −3 (more strongly significant).

So the negative alpha is more **statistically persuasive** in Case B.

B.

* Longer samples reduce sampling error; standard error of alpha shrinks roughly with √T.
* A persistent negative alpha over many years is harder to attribute to luck; more likely to reflect real mispricing or missing risk factors.
* Short samples yield noisy estimates; you’re cautious about reading too much into them.

---

# 19. Market Timing – Changing Degree of Mispricing

## Problem 19 – Issuing Equity When Overvalued by Different Amounts

Firm F is all equity with intrinsic value $100 per share.

Case A:

* Market price P = $110 (10% overvalued).

Case B:

* Market price P = $130 (30% overvalued).

The firm wants to raise $100m to fund a zero-NPV project (just for illustration).

**Tasks:**

A. How many shares must be issued in each case?
B. How much wealth is transferred from new to old shareholders in each case?
C. Intuition: how does the degree of mispricing affect the attractiveness of equity issuance?

---

### Solution 19

A. Shares issued:

* Case A: shares = 100 / 110 ≈ 0.909m
* Case B: shares = 100 / 130 ≈ 0.769m

B. Wealth transfer:

* Intrinsic total value increase from project = 0 (by assumption zero NPV).
* Old intrinsic equity value pre = V = P_true × shares_outstanding (say 100 × N).
* After raising 100, firm has 100 of additional cash; intrinsic value becomes 100N + 100.

But new shareholders paid:

* Case A: pay 110 per share for intrinsic 100 → they overpay ~10 per share.

  * Transfer = (#new shares) × (mispricing) ≈ 0.909m × 10 = $9.09m to old shareholders.
* Case B: overpay 30 per share → transfer ≈ 0.769m × 30 ≈ $23.07m.

C.

* The more overvalued the stock, the **more attractive** it is for existing shareholders to issue equity:

  * They give up fewer intrinsic claims for more cash.
  * Equity issuance becomes a powerful way to transfer wealth from new investors to old ones, even if projects are mediocre.

---

# 20. Protective Put vs Covered Call – Changing Strike

## Problem 20 – Two Option Strategies, Strike Moved

Two strategies on stock with S₀ = 100:

* **Protective Put:** long stock + long put @K=90 for $5.
* **Covered Call:** long stock + short call @K=110 for $5.

Assume one-year horizon, S_T in {80, 100, 120} equal prob.

**Tasks:**

A. Compute payoff in each state for the protective put and covered call.
B. If we change the strike from 90 → 95 (protective put) and 110 → 105 (covered call), how do payoffs change?
C. Intuition: how does raising put strike (or lowering call strike) change risk/return?

---

### Solution 20 (sketch)

You can compute:

* Protective put (K=90) payoff = stock + put = max(S_T, 90).
* Covered call (K=110) payoff = stock − call = min(S_T, 110).

When you move K from 90→95 (put):

* Floor moves up from 90 to 95 → **better protection** in bad states.
* Put becomes more valuable (must cost more); initial outlay rises → **expected net return** falls.

When you move K from 110→105 (call):

* Cap moves down from 110 to 105 → less upside.
* Call is more valuable (you receive more premium), but your payoff is capped sooner.

**Intuition:**

* Higher put strike = higher floor = less downside, more insurance cost → lower β, lower expected return.
* Lower call strike = lower cap = you give up more upside, collect more income now → position becomes more bond-like, β and expected return fall.

---

# 21. Maturity Mismatch – Changing Debt Maturity

## Problem 21 – Short vs Long Maturity with Same Coupon

Firm G needs $200m. Two pure strategies:

* Strategy S: Issue 2-year bond, 6% coupon, roll over indefinitely.
* Strategy L: Issue 10-year bond, 6% coupon, no rollover.

Assume identical tax rate and coupon rate; default risk depends on chance of **not being able to roll**.

**Tasks:**

A. Qualitatively compare:

* Refinancing risk
* Flexibility
* Tax shield risk
  between S and L.
  B. How would raising the **probability of a credit freeze** (e.g., 2008-type event) change the trade-off?

---

### Solution 21 (qualitative)

* Short maturity (S):

  * Higher **refinancing risk**: you must roll every 2 years; if markets freeze, you may face distress.
  * More flexibility: you can adjust outstanding debt to changing business conditions.
  * Tax shields are **more uncertain** because they depend on successful rollovers.

* Long maturity (L):

  * Lower refinancing risk (locked for 10 years).
  * Less flexibility: stuck with that financing even if firm’s risk profile changes.
  * Tax shield stream is more secure (subject to operational default, but not rollover).

If probability of credit freeze increases:

* Short debt becomes much riskier (refinancing risk).
* Long debt becomes relatively more attractive despite lower flexibility.

---

# 22. Dividend Smoothing – Changing Profit Volatility

## Problem 22 – Smoothing in Stable vs Volatile Earnings

Firm H has:

* Stable earnings (Case A): EPS year after year varies between $4.80–$5.20.
* Volatile earnings (Case B): EPS ranges from $1 to $9.

Both consider a **constant dividend** of $4 per year.

**Tasks:**

A. In which case is smoothing more “natural”?
B. In which case does a fixed $4 dividend carry more signaling power?
C. Intuition: how does earnings volatility affect payout policy interpretation?

---

### Solution 22

* Case A (stable):

  * Paying $4 is obviously sustainable and unremarkable; limited signaling content.
  * Smoothing is almost trivial since earnings rarely move far from $5.

* Case B (volatile):

  * Committing to $4 when EPS can be 1–9 is a strong signal: managers are **confident** that average earnings justify this.
  * Cutting the dividend down from $4 in bad years is a strong negative signal.

**Intuition:**
Dividend smoothing is more informative in volatile settings because it requires management to **look through** short-term noise and commit against substantial downside years. The more variable earnings are, the more likely dividend changes or maintenance will be interpreted as signals rather than mechanical.

---

# 23. FX Hedge – Changing Correlation

## Problem 23 – Natural Hedge vs Financial Hedge

An exporter E earns revenues in euros (EUR) but reports in USD.

Case A:

* Its **operating margin** improves when EUR/USD rises (strong euro).
* It has **no euro-denominated debt**.

Case B:

* It borrows heavily in EUR, and its inputs are in USD.

**Tasks:**

A. In Case A, what is the firm’s unhedged exposure to EUR?
B. In Case B, how does having EUR debt change its exposure?
C. Intuition: why might a firm with natural hedge (Case B) need less derivative hedging?

---

### Solution 23

A. Case A:

* Revenues in EUR, costs mostly in USD → strong euro increases USD value of revenue.
* Firm has a **long EUR exposure**: profits rise when EUR rises.

B. Case B:

* Revenues still in EUR, but debt payments also in EUR.
* If EUR rises:

  * Revenues ↑ in USD, but interest and principal also ↑ in USD.
  * A portion of operating exposure is offset by financing exposure.

C. Intuition:

* Case B has a **natural hedge**: revenue and debt service both depend on EUR.
* A net exposure (difference between revenue and debt flows) is smaller, so the firm may need **less** derivative hedging.
* In Case A, the firm is unidirectionally exposed to EUR and may benefit from using forwards/options to trim FX risk.

---

# 24. Real Option – Cost of Delay vs NPV Gain

## Problem 24 – High Growth vs High Discount Rate

Project J:

* Invest now: NPV_now = +10.
* Wait 1 year: if demand high, NPV_H = +40; if low, NPV_L = −10.

Probabilities: 50/50.

**Case A:** discount rate r = 5%.
**Case B:** discount rate r = 20%.

**Tasks:**

A. In Case A, is the option to wait likely to be valuable?
B. In Case B, how does the higher discount rate affect value of waiting?
C. Intuition: when does waiting make sense and when is “invest now” better?

---

### Solution 24 (qualitative)

With low discount rate (5%):

* Cost of delaying a positive NPV_now project is modest.
* Benefit of waiting is being able to avoid **negative NPV** states (L) and invest only in **H**.
* Real option value likely **positive**.

With high discount rate (20%):

* Cost of delay is large; future payoffs are heavily discounted.
* Even if you avoid L, the present value of a high-state payoff shrinks when brought back at 20%.
* Option to wait may no longer dominate “invest now with NPV=10,” or might be only marginally better.

**Intuition:**
Waiting is most attractive when:

* Uncertainty is high (big gap between H and L),
* There’s a meaningful chance of negative NPV states, and
* The cost of delay (r) is not too high.

---

# 25. Loan Covenants – Severity vs Flexibility

## Problem 25 – Tight vs Loose Covenants

Firm K has two possible covenant packages on its new debt:

* **Tight package:**

  * Dividend payout cap at 20% of earnings
  * Strict leverage and interest coverage tests
  * Limited asset sales

* **Loose package:**

  * Minimal dividend restrictions
  * Weirdly low leverage covenant, rarely binding

**Tasks:**

A. Which package is more attractive to **creditors**, and why?
B. How can tight covenants **benefit equity** too?
C. Intuition: when might equity prefer looser covenants despite higher interest rates?

---

### Solution 25 (qualitative)

A.

* Tight covenants protect creditors from asset substitution, dividend tunneling, and over-borrowing.
* Lower expected losses → lower required yield → better rating. Creditors usually favor **tighter** covenants if priced fairly.

B.

* Tighter covenants can reduce the **cost of debt**, raising firm value.
* They can also provide discipline against managerial empire-building, benefiting shareholders.
* In many cases, value created > flexibility lost.

C.

* Equity might prefer looser covenants if:

  * The firm has many growth options and needs flexibility to invest or raise additional capital.
  * Tighter covenants would block attractive projects or force early renegotiation.
* It’s a trade-off between **cheaper debt + discipline** vs **freedom to pursue opportunities**.

---

# 26. Payout vs Investment – Thin Margins & High Growth

## Problem 26 – Payout Choice in Marginal Business

Firm L:

* Current earnings: $10m.
* Positive NPV projects totaling $50m, but only $20m of internal cash.
* Debt capacity is limited; equity is believed undervalued.

Board considers:

* Paying $5m dividend
* Retaining all internal cash and no dividend.

**Tasks:**

A. From trade-off + pecking order perspective, which action is better?
B. Intuition: how do investment needs and perceived mispricing shape payout policy?

---

### Solution 26

A.

* Given the firm has **more positive NPV projects** than internal cash, and equity is believed **undervalued**, paying dividends forces the firm to either:

  * Issue equity at a discount (wealth transfer), or
  * Skip positive NPV projects (underinvestment).
* Under trade-off and pecking order, **retaining all cash (no dividend)** is the better choice.

B.

* Investment needs: When good projects are constrained by internal funds, payout should be **lower**, not higher.
* Perceived mispricing: If equity is undervalued, equity issuance is costly; firms prefer internal cash and debt.
* Thus, for thin-margin high-growth firms with limited external financing, minimal dividends are often optimal.

---

# 27. Hedging Fuel – Changing Business Cyclicality

## Problem 27 – Fuel Hedge for Cyclical vs Defensive Airline

Two airlines:

* Airline C: highly **cyclical**; demand is strong when economy is strong.
* Airline D: more **defensive**; demand stable across cycles.

Both use jet fuel as major input and consider hedging fuel prices.

**Tasks:**

A. For Airline C, how does fuel price typically move relative to its revenue?
B. For Airline D, is that correlation as strong?
C. Intuition: which airline benefits more from hedging fuel prices and why?

---

### Solution 27

A.

* Airline C: when the economy is strong, travel demand and jet fuel prices both tend to be **high**.

  * So fuel cost spikes occur when revenue is also high → partial natural hedge.
  * However, margin still at risk if fuel increases more than revenue.

B.

* Airline D: demand is more stable; its revenue is less tied to macro conditions and fuel prices.

  * So spikes in fuel prices do not coincide with proportionally higher revenue.
  * Fuel cost shocks are more purely negative.

C.

* Airline D likely benefits **more** from hedging fuel prices:

  * It has less natural hedge; high fuel prices directly compress its margins in all states.
  * Hedging shifts risk from shareholders to counterparties more effectively.
* For Airline C, hedging may still help, especially if fuel volatility outpaces revenue shifts, but the natural correlation already partially mitigates risk.

---

# 28. Multi-Divisional WACC – Shifting Weight Across Divisions

## Problem 28 – Divisional WACC vs Firm WACC

Conglomerate M has two divisions:

* Division 1 (Utilities): β₁ = 0.4, value weight w₁ = 60%.
* Division 2 (Tech): β₂ = 1.4, value weight w₂ = 40%.
* r_f = 3%, MRP = 7%. No debt (all equity).

**Tasks:**

A. Compute firm-wide β and WACC.
B. Suppose Tech division’s weight grows to 70% and Utilities shrinks to 30%. Compute new β and WACC.
C. Intuition: what happens if the firm keeps using the **old WACC** to evaluate utility projects after this shift?

---

### Solution 28

A.

Firm β = w₁β₁ + w₂β₂ = 0.6×0.4 + 0.4×1.4 = 0.24 + 0.56 = 0.80

WACC = r_f + β × MRP = 3% + 0.8×7% = 3% + 5.6% = 8.6%

B.

New weights: w₁ = 0.3, w₂ = 0.7.

Firm β_new = 0.3×0.4 + 0.7×1.4 = 0.12 + 0.98 = 1.10

WACC_new = 3% + 1.10×7% = 3% + 7.7% = 10.7%

C.

* If the firm starts to be **dominated by tech**, its true overall risk and WACC go up.
* If managers keep using the old 8.6% WACC to evaluate **utility** projects:

  * For utility projects, true β ≈ 0.4 → true required return ≈ 3% + 0.4×7% = 5.8%.
  * Using 8.6% artificially penalizes them; you might **reject good low-risk projects**.
* More importantly, using the **firm’s average WACC** for all projects in this evolving mix will:

  * Overvalue risky tech-like projects (β≈1.4) if WACC is below their required return.
  * Undervalue safe utility-like projects if WACC is above their required return.
* This is why divisional WACCs are crucial in multi-division firms.

---


# 29. Callable vs Non-Callable Bond – Changing Call Feature

## Problem 29 – Effect of Callability on Yield and Tax Shields

A firm issues a **10-year, 6% coupon bond**, face $300m, corporate tax rate 25%.

Case A: **Non-callable**

* Price at issue: 100% of par → YTM = 6%.

Case B: **Callable at par after Year 5**

* Price at issue: investors now demand 98% of par to compensate for call risk.

Assume no default risk (compare only callability).

**Tasks:**

A. In Case A, compute annual tax shield and its PV if the bond is held to maturity (discount TS at 6%).
B. In Case B, assuming the firm will call if interest rates drop and refinance at 4% after Year 5, describe qualitatively how:

* YTM at issue changes
* Expected PV of tax shields changes
  C. Intuition: why do callable bonds typically offer higher promised yields and potentially lower tax shield value?

---

### Solution 29

**A. Non-callable tax shields**

Interest each year = 6% × 300 = 18m
Tax shield each year = 0.25 × 18 = 4.5m

If discount at 6% and treat as 10-year annuity:

[
V_{TS}^{A} = 4.5 \times \left(\frac{1 - (1.06)^{-10}}{0.06}\right) \approx 4.5 \times 7.3601 \approx 33.1m
]

**B. Call risk (Case B)**

Because the bond is callable:

* Investors know that if interest rates fall, the firm will call and refinance at a lower rate.
* This **caps the benefit** of lower rates for investors (they lose the high coupons in that scenario).
* To compensate, they demand a **lower price** (98%) → **higher YTM** than 6% at issue.

Tax shields:

* For Years 1–5: same 6% coupon → TS = 4.5m each year.
* After Year 5: if rates drop and firm calls, coupon drops from 6% to 4% on new debt:

  * Interest after call: 0.04 × 300 = 12 → TS = 0.25 × 12 = 3m per year.

PV of TS in callable case is **lower** than holding the 6% bond for full 10 years, because:

* In good interest rate scenarios (where rates fall), the firm uses the call to reduce interest (and TS).
* TS in years 6–10 are only 3m instead of 4.5m.
* Discount rate for TS may also change (4% vs 6%), but the amount per year is smaller.

**C. Intuition**

* Callable bonds offer **higher promised yields** to compensate investors for the risk that the issuer will refinance when it’s advantageous to the issuer (bad for investor).
* From the firm’s perspective, a call option lets it **reduce interest payments in good states**, which also **reduces tax shields** in those states.
* So callability can reduce the **expected PV of tax shields**, especially when rates are likely to fall and the issuer calls.

---

# 30. Senior vs Junior New Debt – Changing Priority

## Problem 30 – New Secured vs Unsecured Debt with Existing Bonds

Firm X already has **$200m unsecured bonds** outstanding.

It wants to raise **$100m** for a project by issuing new debt. It can:

* Option 1: Issue **new senior secured debt** (priority above existing bonds).
* Option 2: Issue **new unsecured debt** at equal priority with existing bonds.

One-year maturity. If total firm value at maturity is:

* State 1 (30%): 200
* State 2 (50%): 350
* State 3 (20%): 500

**Tasks:**

A. Under Option 1 (new senior 100 + existing unsecured 200), describe the payoff waterfall across states.
B. Under Option 2 (all unsecured 300), describe the payoff waterfall.
C. Intuition: how does moving the new debt from unsecured to **senior secured** change:

* Existing unsecured bond value (wealth transfer)
* Equity’s incentives?

---

### Solution 30

### A. Option 1 – Senior 100, unsecured 200

State 1: V = 200

* Senior (100) is paid first → gets 100.
* Remaining = 100 for unsecured + equity.
* Unsecured claims total 200 → they share the 100 pro rata. If pre-project, there was only 200 existing unsecured, they get 100; new equity is 0.
* Equity = 0.

State 2: V = 350

* Senior: 100 fully paid.
* Remaining = 250 for unsecured + equity.
* Unsecured (existing 200) get full 200.
* Equity = 50.

State 3: V = 500

* Senior: 100
* Unsecured: 200
* Equity: 200

### B. Option 2 – All unsecured (300 total)

Now there is no super-senior:

State 1: V = 200

* Total unsecured claims = 300 (existing 200 + new 100).
* They share 200 pro rata:

  * Existing get (200/300)×200 ≈ 133.3
  * New get (100/300)×200 ≈ 66.7
* Equity = 0.

State 2: V = 350

* Unsecured share 350:

  * Existing: (200/300)×350 ≈ 233.3
  * New: (100/300)×350 ≈ 116.7
* Equity = 0.

State 3: V = 500

* Total unsecured = 300; they get full 300: 200 to existing, 100 to new.
* Equity = 200.

### C. Intuition

* Making new debt **senior** (Option 1) concentrates more **downside protection** in that new debt.

  * Existing unsecured bonds lose value because they have to wait behind the new senior.
  * Equity may actually gain in “Normal/Strong” states if the project is good, but existing bondholders bear more of the risk.
* **Wealth transfer:**

  * Senior secured debt creates a transfer from **existing unsecured** to **new lenders and/or equity**, because old bondholders are now pushed further down in the waterfall.
* Equity’s incentives:

  * Equity often favors issuing new **senior** debt when it transfers risk to existing creditors (like a “seniority flip”).
  * This may reduce the cost of new debt but hurt existing creditors → they will demand covenants or higher rates ex-ante to prevent this.

---

# 31. Real Option to Expand – Changing Expansion Payoff

## Problem 31 – Option to Expand with Different Multipliers

A firm can build a small plant now for $50m with PV of cashflows = $60m (NPV_now = +10).

If demand turns out high in one year, it can **expand** by investing an additional amount:

* Expansion cost: $40m at t=1.
* Expansion PV (if done at t=1) = Case A: $70m; Case B: $120m.

Probability of high demand (H) next year: 50%; low demand (L): 50%. Discount rate: 10%.

**Tasks:**

A. In both cases, compute the **NPV of expansion** if high demand is realized.
B. What is the **value today** of the expansion option in each case?
C. Intuition: how does higher expansion payoff change the value of the small plant + option combo?

---

### Solution 31

**Baseline small plant NPV (ignoring expansion):** +10 (60 − 50).

### A. Expansion NPV in high-demand state

Case A:

* Cost = 40; PV of expansion cashflows = 70.
* NPV_H^A = 70 − 40 = +30.

Case B:

* Cost = 40; PV_expansion = 120.
* NPV_H^B = 120 − 40 = +80.

### B. Present value of expansion option

Option gives you the **right but not obligation** to invest 40 if high demand occurs.

Under risk-neutral-ish (just simple expected value with discount):

* Probability(H) = 0.5; in L you do not expand (NPV_L=0).

Case A option value:

[
V_{\text{expansion}}^A = \frac{0.5 × 30 + 0.5 × 0}{1.1} = \frac{15}{1.1} ≈ 13.6
]

Case B:

[
V_{\text{expansion}}^B = \frac{0.5 × 80 + 0.5 × 0}{1.1} = \frac{40}{1.1} ≈ 36.4
]

So expansion option is worth about 13.6m in Case A and 36.4m in Case B.

### C. Intuition

* Larger expansion payoff (Case B) makes the **option to expand** much more valuable.

* Adding that to the base small plant NPV:

  * Case A: total NPV ≈ 10 + 13.6 = 23.6
  * Case B: total NPV ≈ 10 + 36.4 = 46.4

* Even if small plant alone is only mildly attractive (NPV=+10), the presence of a **highly profitable expansion contingency** can make the combined strategy very valuable.

* Thus, real options lead you to **prefer flexible initial designs** when future expansion is highly profitable.

---

# 32. Coffee Café – Changing Probabilities and Discount Rate

## Problem 32 – Revised Coffee Café Example

A coffee café project in Chicago can be:

* Berkeley-like: PV = $40K
* Cleveland-like: PV = $0K (just break-even; NPV=0)

Prior probabilities:

* P(B) = 40%
* P(C) = 60%

Discount rate: r = 5%. Investment cost today: $25K.

**Case 1: No information**
**Case 2: Perfect info next year**, but you must delay investment by 1 year (build in t=1).

**Tasks:**

A. Compute NPV if you **invest now** (no info).
B. Compute NPV if you **wait, learn type, and invest only if Berkeley**, building at t=1.
C. Compute **value of information** (VOI).
D. Intuition: how do higher discount rate and different probabilities vs the original example affect VOI?

---

### Solution 32

### A. NPV if invest now

Expected PV of café:

[
E[PV] = 0.4×40 + 0.6×0 = 16
]

NPV_now = 16 − 25 = **−9K** (negative).

### B. NPV if wait, then invest selectively

If wait to t=1:

* If B: build then; cost 25 paid at t=1.

  * PV at t=1 = 40 (still). NPV at t=1 = 40 − 25 = 15.
  * PV at t=0 = 15 / 1.05 ≈ 14.29.
* If C: do not build, NPV = 0.

Expected NPV:

[
NPV_{\text{wait}} = 0.4×14.29 + 0.6×0 ≈ 5.72
]

### C. Value of information

VOI = NPV_wait − NPV_now = 5.72 − (−9) ≈ **+14.72K**.

So information is very valuable: it turns a negative-NPV project into a positive NPV waiting strategy.

### D. Intuition

Relative to a simpler example:

* Discount rate is modest (5%), so delay cost is not huge.
* The **bad state** is quite common (60%) and is zero NPV; the bad outcome is “no gain,” but if we built blindly in C we’d lose because we paid 25 for 0 PV; that’s why invest-now NPV is negative.
* Perfect info allows us to **avoid building in C** and only build in B, transforming a negative unconditional NPV into a positive conditional NPV.
* VOI is large because:

  * The unconditional project is negative NPV if we commit now.
  * Info changes our decision in a significant fraction of states.

---

# 33. Recap – Changing D/E and Maintaining Asset Beta

## Problem 33 – Recapitalization with Fixed Asset Risk

Firm R has:

* Asset beta β_A = 0.9
* Current capital structure: D/E = 0.5 (i.e., 33% debt, 67% equity).
* Risk-free rate 3%, market risk premium 7%.
* Currently, debt beta is approx 0.2.

Case A (current):

* D/V = 1/3, E/V = 2/3.

Case B:

* Recap to D/E = 1.0 (50% debt, 50% equity).
* Assume D/V = 0.5, E/V = 0.5.
* Assume debt beta rises to 0.3.

**Tasks:**

A. Compute equity β and cost of equity in Case A.
B. Compute equity β and cost of equity in Case B.
C. Intuition: how does raising leverage while holding asset beta fixed affect r_E and WACC?

---

### Solution 33

### A. Case A – β_E current

Asset beta = weighted avg:

[
β_A = \frac{D}{V}β_D + \frac{E}{V}β_E
]

Plugging:

* β_A = 0.9, D/V = 1/3, E/V = 2/3, β_D = 0.2.

[
0.9 = \frac{1}{3}×0.2 + \frac{2}{3}×β_E
]

[
0.9 = 0.0667 + \frac{2}{3}β_E
]

[
0.9 − 0.0667 ≈ 0.8333 = \frac{2}{3}β_E
]

[
β_E ≈ 0.8333 × \frac{3}{2} = 1.25
]

Cost of equity:

[
r_E = 3% + 1.25 × 7% = 3% + 8.75% = 11.75%
]

### B. Case B – Recap, new β_E

Now D/V = 0.5, E/V = 0.5, β_D = 0.3.

Same formula:

[
0.9 = 0.5×0.3 + 0.5×β_E
]

[
0.9 = 0.15 + 0.5β_E
]

[
0.75 = 0.5β_E \Rightarrow β_E = 1.5
]

New r_E:

[
r_E = 3% + 1.5 × 7% = 3% + 10.5% = 13.5%
]

### C. Intuition

* Raising leverage (D/V from 1/3 to 1/2) while holding β_A fixed:

  * Increases β_E from 1.25 → 1.5.
  * Equity is riskier because equity is a smaller slice of a fixed β_A asset pool.
* WACC = D/V r_D + E/V r_E:

  * r_D also rises (β_D from 0.2→0.3), but debt is still cheaper than equity.
  * With taxes, WACC may fall or rise depending on tax shield vs distress cost assumptions. Under MM without distress, WACC is unchanged.
* Key takeaway: you cannot infer value change from r_E alone. Need to consider WACC and frictions.

---

# 34. Payout & Taxes – Dividend vs Repurchase Under Different Tax Regimes

## Problem 34 – Tax-Driven Payout Policy

Firm S has $100m of excess cash. It can:

* Pay a **special dividend** of $100m; or
* **Repurchase shares** worth $100m.

Two tax regimes:

**Regime 1 (Tax-dividend-unfriendly):**

* Dividend tax τ_d = 30%
* Capital gains tax τ_cg = 15%

**Regime 2 (Tax-neutral):**

* τ_d = τ_cg = 20%

Firm’s stock is fairly priced.

**Tasks:**

A. In Regime 1, which payout method is more tax-efficient for shareholders?
B. In Regime 2, does payout method matter from a pure tax point of view?
C. Intuition: how does tax regime interact with payout policy in MM-like world?

---

### Solution 34

A.

* Regime 1: dividends taxed more heavily than capital gains.
* If the firm pays a cash **dividend**, each shareholder receives $X and loses 30% in tax.
* If it **repurchases shares**, selling shareholders realize capital gains taxed at 15%, while nonsellers defer capital gains until they sell.
* Therefore, repurchases are generally **more tax-efficient** than dividends in Regime 1.

B.

* Regime 2: τ_d = τ_cg = 20%.
* Now tax bite is similar whether value comes as dividend or capital gain.
* In pure tax arithmetic, payout method is roughly **neutral**.

C.

* In MM with no taxes, payout is irrelevant.
* Once we add **personal taxes**, payout form matters:

  * If dividends are taxed more, firms tilt toward **repurchases**.
  * If tax treatment is equal, payout form is closer to irrelevant.
* In practice, regime matters; this is one reason we see repurchases more heavily used in certain markets.

---

# 35. Convertible Debt – Changing Conversion Ratio

## Problem 35 – Conversion Ratio and Equity Dilution

Firm T issues convertible bonds:

* Face value: $100m
* Maturity: 5 years
* Conversion option: each $1,000 bond can convert into:

  * Case A: 20 shares
  * Case B: 40 shares

There are currently 10m shares outstanding; stock price is currently $30.

At maturity, suppose the firm’s equity value is such that stock price is $50 (above conversion threshold).

**Tasks:**

A. In Case A, how many new shares would be issued on conversion, and what fraction of the firm would bondholders own?
B. In Case B, same questions.
C. Intuition: how does a higher conversion ratio change:

* Equity dilution
* Cost of debt
* Equity risk in boom states?

---

### Solution 35

Number of bonds:

* Total face = 100m; each bond = 1,000 → 100,000 bonds.

A. Case A (20 shares per bond):

* Total new shares = 100,000 × 20 = 2m shares.
* Old shares = 10m.
* Post-conversion total = 12m shares.
* Bondholders’ ownership = 2m / 12m = **1/6 ≈ 16.7%**.

B. Case B (40 shares per bond):

* New shares = 100,000 × 40 = 4m.
* Total shares = 10m + 4m = 14m.
* Bondholders’ ownership = 4/14 ≈ 28.6%.

C. Intuition:

* Higher conversion ratio → more equity transferred to bondholders in high-value states → **more dilution** for old equity.
* Because conversion is valuable to bondholders, they accept a **lower coupon** on the bond:

  * Cost of debt is lower ex-ante.
* In boom states (stock price high), equity’s payoff is shared more with former bondholders; equity’s upside is reduced, which can mitigate excessive risk-taking and align incentives somewhat.

---

# 36. Partial vs Full Hedge – Changing Hedge Ratio

## Problem 36 – Degree of Hedging

A firm has exposure to commodity X:

* It will **buy 1m units** of X in a year.
* X’s price in a year, P₁, is random: mean $10, stdev $4.

It considers:

* Strategy 1: no hedge.
* Strategy 2: **full hedge** using 1m units of futures at $10.
* Strategy 3: **half hedge** using 0.5m units of futures.

Assume futures are fairly priced.

**Tasks:**

A. Which strategy leaves the firm’s **cost of X** most volatile?
B. Which strategy eliminates price risk for X completely?
C. Intuition: in practice, why might a firm choose a **partial hedge**?

---

### Solution 36

A.

* No hedge: cost = 1m × P₁ → fully exposed to volatility.
* So Strategy 1 has **maximum volatility**.

B.

* Full hedge (Strategy 2):

  * Pay fixed $10 per unit on futures; any spot price move is offset by futures gains/losses.
  * Net cost per unit ~$10; price risk is essentially **zero**.
* Half hedge (Strategy 3):

  * Only half the exposure is hedged; still some volatility remains.

C.

Why partial hedge?

* If:

  * Correlation between X prices and revenue is not perfect (natural partial hedge).
  * Manager wants to retain some upside from favorable price moves.
  * Hedge accounting or margin/collateral requirements make full hedge expensive.

* Partial hedging can be a compromise: reduce distress risk and underinvestment without fully capping beneficial volatility.

---

# 37. Maintenance vs Incurrence Covenants – Changing Frequency

## Problem 37 – Restriction Check Frequency

Loan A includes a **maintenance covenant**:

* Leverage ratio must be below 2.0× at each **quarter-end**.

Loan B includes an **incurrence covenant**:

* Leverage ratio must be below 2.0× only when **new debt is incurred**.

**Tasks:**

A. Which covenant type (maintenance vs incurrence) is more restrictive day-to-day?
B. Which one gives equity/management more flexibility between test dates?
C. Intuition: why might term loans from banks use maintenance covenants while bonds use incurrence covenants?

---

### Solution 37

A.

* Maintenance covenant (Loan A) is more restrictive:

  * The firm must meet leverage test **every quarter**; persistent monitoring.
  * Violations can trigger renegotiation, waivers, or default.

B.

* Incurrence covenants (Loan B) give more flexibility:

  * Firm can temporarily exceed leverage thresholds as long as it doesn’t issue new debt or trigger specific covenant events.
  * Less continuous monitoring.

C.

* Banks typically hold concentrated exposures and engage in relationship lending; they want **frequent monitoring** (maintenance covenants).
* Bondholders are more dispersed and prefer simpler, less intrusive covenants; incurrence covenants are easier to monitor and enforce.
* Maintenance covenants can reduce risk and lower interest rates but may be too rigid for bond markets.

---

# 38. Project Finance vs Corporate Finance – Changing Project Size & Risk

## Problem 38 – When to Use Project Finance

A company can undertake a large infrastructure project:

* Investment: $500m.
* Stand-alone project β_proj ≈ 1.8 (higher than core firm β).
* If financed on **corporate balance sheet**, project cashflows and risks fully mix with the firm.

Alternatively, it can:

* Create a **Project Finance SPV** with non-recourse debt backed only by project cashflows and limited sponsor equity.

Case A: Project is **large relative to the firm** (project value ≈ existing firm value).
Case B: Project is **small relative to the firm** (project value ≈ 5% of firm).

**Tasks:**

A. Qualitatively, in which case is project finance more attractive and why?
B. How do size and risk interplay in the project vs corporate finance choice?

---

### Solution 38

A.

* Case A (large project, high β_proj):

  * Putting it on the corporate balance sheet significantly changes firm’s overall risk and can strain its debt capacity.
  * Project finance SPV isolates the risk; lenders look to project cashflows and collateral, not the parent’s entire balance sheet.
  * Non-recourse structure can protect the parent from large downside outcomes → **project finance more attractive** here.

* Case B (small project, high β_proj but only 5% of firm):

  * The project’s risk is diversified at the firm level; its impact on firm β and capacity is modest.
  * Project finance overhead (structuring, covenants, multiple parties) may not be worth it.
  * Corporate finance might be simpler and cheaper.

B.

* Large, risky projects with distinct cashflows and high political/contract risk often suit **project finance**:

  * Risk is concentrated and carved out.
  * Creditors rely on project-level contracts and collateral.
* Smaller or less risky projects are often financed corporately:

  * Firm can absorb risk internally; overhead of SPV is not justified.
  * Risk is shared across the firm’s diversified asset base.

---

