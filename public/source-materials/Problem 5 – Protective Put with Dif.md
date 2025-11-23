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