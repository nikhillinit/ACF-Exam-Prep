You've asked to keep the supplementary exercises and to include all insights, even minute ones, from the lecture notes in the reformatted document. I have already provided the reformatted lecture notes based on this request.

Below are the **Supplementary Exercises and their Answers** from the original file, formatted for clarity and legibility, and retaining all the detailed insights, calculations, and explanations as requested.

---

## 📝 Lecture 13: Supplementary Exercises and Answers

### 1) Disagreements over variance and security mispricing.

If a security has a payoff which is linear in the underlying asset value (equity in an all equity firm) investors must only agree on the mean of the payoff distribution to agree on the price of the security. However, if a security has payoff which is non-linear in the underlying asset value (debt), then investors must agree on both the mean and the variability to agree on the price of the security. This question examines this issue. The firm's managers know the firm's cash flows next year will be either $\$1,200$ or $\$1,100$ with equal probability. The market believes that the firm's cash flows will be either $\$1,300$ or $\$1,000$ with equal probability. The firm needs to borrow $\$1,000$ to fund their business. The bond will have a face value of $\$1,000$.

| | **Manager's Knowledge** | **Market's Perception** |
| :--- | :--- | :--- |
| **Asset values** | Bad: 1100, Good: 1200 | Bad: 1000, Good: 1300 |
| **Expected Asset Value** | 1150 | 1150 |
| **Debt cash flows** | | |

#### A) Do the managers and the market agree on the expected asset value next year?

* **Answer:** Yes, the managers and the market agree on the expected asset value next year. They both think it will be $\$1,150$. They disagree on how bad the bad state is and how good the good state is.

#### B) The expected return on the debt required by the market is $10\%$. Given the manager's knowledge, what coupon rate should the managers set to raise $\$1,000$?

* **Answer:** Based on the manager's knowledge, they believe they should set the coupon rate equal to $\mathbf{10\%}$ for the debt to sell for $\$1,000$ (face value).
    * If the coupon rate is $10\%$, the promised payment next year is $\$1,100$.
    * Since the minimum asset value (under manager's knowledge) is $\$1,100$, the bond always pays $\$1,100$.
    * The value of the debt, given the manager's information, is:
        $$V_{\text{debt}} = \frac{1100 + 1100}{2} / (1 + 0.10) = 1000 \quad (12) \text{}$$
    * Thus, they believe that a coupon rate of $10\%$ will lead to a market price of $\$1,000$.

#### C) If the managers sell the bond with a face value of $\$1,000$ and a coupon rate of $10\%$, how much money will they raise from the market?

* **Answer:** Based on the market's perception, the bond will have a market price of **\$955**.
    * The promised payment is still $\$1,100$.
    * Given the higher variability in asset values, as perceived by the market, the expected cash flow to the debt is $\frac{1000 + 1100}{2} = 1050$.
    * The market price (assuming $10\%$ required return) is:
        $$V_{\text{debt}} = \frac{1000 + 1100}{2} / (1 + 0.10) \approx 954.55 \quad (13) \text{}$$

#### D) What coupon rate must the firm set for the debt to sell for face value? Explain.

* **Answer:** The firm must set a coupon rate of **$20\%$** for the debt to sell for face value ($\$1,000$) to the market.
    * Since the market perceives the assets to be riskier than the managers, they will require a coupon rate greater than $10\%$ for the debt to sell for face value.
    * With a $20\%$ coupon rate, the promised payment is $\$1,200$ (Face Value of $\$1,000$ + Coupon of $\$200$).
    * The expected cash flow to debt (based on market's perception) is: $\frac{\min(1000, 1200) + \min(1300, 1200)}{2} = \frac{1000 + 1200}{2} = 1100$.
    * The market price (assuming $10\%$ required return) is:
        $$V_{\text{debt}} = \frac{1000 + 1200}{2} / (1 + 0.10) \approx 1000 \quad (14) \text{}$$
    * Firms will often test the market and change the coupon rate so that the bond sells for face value or close to face value.

#### E) How big must the NPV[Project | CSI] for the firm to be willing to issue the bond with the coupon rate you calculated in D)? Assume managers maximize shareholder wealth.

* **Answer:** The NPV[Project | CSI] must be at least **\$45** for the firm to be willing to issue a $20\%$ coupon bond.
    * Managers maximize shareholder value and are only willing to invest if the overall NPV is positive:
        $$\text{NPV [Project]} = \text{NPV [Project | CSI]} + \text{NPV [Financing]} > 0 \quad (15) \text{}$$
        $$\text{NPV [Project | CSI]} > - \text{NPV [Financing]} = - (P_{\text{debt}} - V_{\text{debt}}) \quad (15) \text{}$$
    * The managers' calculation of the debt's value ($V_{\text{debt, Manager}}$) for the $20\%$ coupon bond (promised payment $\$1,200$) is:
        $$V_{\text{debt, Manager}} = \frac{\min(1100, 1200) + \min(1200, 1200)}{2} / (1 + 0.10) = \frac{1100 + 1200}{2} / (1 + 0.10) \approx 1045.45 \quad \text{}$$
    * The **NPV of Financing** from the manager's perspective is $P_{\text{debt}} - V_{\text{debt, Manager}} = 1000 - 1045.45 \approx -45.45$.
    * This negative NPV means the debt is **underpriced** from the manager's (informed) perspective; the original shareholders lose value when issuing this debt.
    * Therefore, the project's intrinsic value must offset this loss:
        $$\text{NPV [Project | CSI]} > - (1000 - 1045.45) \approx 45.45 \quad (16) \text{}$$

---

## 🛡️ Lecture 12: Supplementary Exercises and Answers

### 1) Rajan and Associates: Optimal Hedging in an M\&M World.

The firm Rajan and Associates will have a cash flow from assets (CFA) next year as described in the table. Assume the five states are equally likely. The discount rate for assets ($r_{\text{asset}}$) is $15\%$ and the risk-free rate ($r_{\text{risk-free}}$) is $5\%$.

| | State 1 | State 2 | State 3 | State 4 | State 5 | Expected |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CFA** | 60 | 70 | 80 | 90 | 100 | 80 |
| **Risk index** | 12 | 14 | 16 | 18 | 20 | 16 |

#### A) What is the value of the firm?

* **Answer:** The value of the firm is **\$69.6**.
    * The expected CFA next year is $\$80$.
    * Discounting the expected CFA at the asset discount rate ($15\%$) gives the firm's value:
        $$V_{\text{asset}} = \frac{E[\text{CFA}]}{1 + r_{\text{asset}}} = \frac{80}{1 + 0.15} \approx 69.6 \quad (7) \text{}$$

#### B) What is the futures price today?

* **Answer:** The futures price today is **\$14.6**.
    * The expected value of the Risk Index is $16$.
    * The futures price ($F_0$) is set so that the NPV of the futures contract is zero. It depends on the expected value of the asset and the systematic risk premium:
        $$F_0 = E[\text{Risk Index}] \frac{1 + r_{\text{risk-free}}}{1 + r_{\text{asset}}} \quad (2) \text{}$$
        $$F_0 = 16 \frac{1 + 0.05}{1 + 0.15} \approx 14.6 \quad (8) \text{}$$

#### C) Recommend a hedging strategy to eliminate Rajan and Associates' risk exposure.

* **Answer:** Rajan and Associates should **sell five futures contracts** to completely eliminate their risk.
    * The CFA changes by $10$ for every $2$ change in the Risk Index, meaning CFA changes by $\mathbf{5 \times \text{Risk Index}}$.
    * By selling (shorting) five futures contracts, the firm receives five times the futures price ($\$14.6$) and pays five times the Risk Index in each state.
    * The net cash flow from shorting five contracts is:
        $$\text{Net CF}_{\text{short 5 contracts}} = 5 \cdot (F_0 - \text{Risk Index}) = 5 \cdot (14.6 - \text{Risk Index}) \quad (9) \text{}$$

| | State 1 | State 2 | State 3 | State 4 | State 5 | Expected |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CFA** | 60 | 70 | 80 | 90 | 100 | 80 |
| **Future payoffs** | $13$ | $3$ | $-7$ | $-17$ | $-27$ | $-7$ |
| **Net CFA** | $73$ | $73$ | $73$ | $73$ | $73$ | $73$ |

#### D) What is the expected cash flow on the derivatives contract that you recommended? Does this imply that Rajan and Associates is paying or receiving a risk premium?

* **Answer:** The expected payoff on shorting five futures contracts is **$-\$7.0**.
    * Since Rajan and Associates is paying money on average (they lose on average), they are **paying a risk premium**.
    * They are paying to reduce their **systematic risk**.

#### E) What is the value of the firm if it hedges as you suggest? Should the firm hedge?

* **Answer:** The value of the firm remains **\$69.6**. In an M\&M world, **the firm should not hedge** because it does not alter the firm's value.
    * If the firm hedges, its cash flow next year is a constant $\$73.0$ in every state of the world.
    * Since the firm now has no risk, the correct discount rate is the risk-free rate ($5\%$):
        $$V_{\text{assets}} = \frac{73.0}{1 + 0.05} \approx 69.52 \quad (10) \text{}$$
    * This is the same value as the unhedged firm ($69.6$), demonstrating that in a world where M\&M assumptions hold, hedging does not create value.

### 2) P\&G's swap.

P\&G entered into an interest rate swap where they committed to pay a spread over the commercial paper rate:
$$\text{Spread} = \max [17.0415 \cdot (r_{5\text{-year treasury}} - P_{30\text{-year treasury}}), 0] - 0.0075 \quad (5) \text{}$$
The notional amount of the swap was $\$200$M. $P_{30\text{-year treasury}}$ is the price of a $6.25\%$ semi-annual coupon bond per dollar of face value.

#### A) What is the payment that P\&G has to make on the swap if the five-year and thirty-year government bond rates are both equal to $5\%$?

* **Answer:** P\&G will **receive $\$1.5$M** (or pay a negative cash flow of $-\$1.5$M).
    * First, calculate the price of the 30-year bond when the yield is $5\%$ (since the coupon rate, $6.25\%$, is greater than the yield, the bond sells at a premium):
        $$P_{30\text{-year}} = \sum_{t=1}^{60} \frac{0.0625/2}{(1 + 0.05/2)^t} + \frac{1}{(1 + 0.05/2)^{60}} \approx 1.193 \quad (11) \text{}$$
    * Next, calculate the spread:
        $$\text{Spread} = \max [17.0415 \cdot (0.05 - 1.193), 0] - 0.0075$$
        $$\text{Spread} = \max [-0.3411, 0] - 0.0075 = -0.0075 \text{ or } -0.75\% \quad (12) \text{}$$
    * Payment = $\text{Spread} \cdot \$200\text{M} = -0.0075 \cdot \$200\text{M} = -\$1.5\text{M}$.
    * The swap would lower P\&G's borrowing rate by 75 basis points.

| $\mathbf{r_{5\text{-year}} / r_{30\text{-year}}}$ | **5%** | **6%** | **7%** | **8%** |
| :--- | :--- | :--- | :--- | :--- |
| $\mathbf{P_{30\text{-year}}}$ | 1.193 | 1.035 | 0.906 | 0.802 |
| **5%** | -0.75% | -0.75% | -0.75% | -0.75% |
| **6%** | -0.75% | -0.75% | 10.85% | 21.29% |
| **7%** | -0.75% | 15.08% | 27.89% | 38.34% |
| **8%** | 16.26% | 32.12% | 44.94% | 55.38% |

#### B) What is the spread that P\&G has to pay over the commercial paper rate if the five-year thirty-year government bond rates are both equal to $8\%$?

* **Answer:** The spread is **$55.38\%$**.
    * First, calculate the price of the 30-year bond when the yield is $8\%$ (since the coupon rate, $6.25\%$, is less than the yield, the bond sells at a discount):
        $$P_{30\text{-year}} = \sum_{t=1}^{60} \frac{0.0625/2}{(1 + 0.08/2)^t} + \frac{1}{(1 + 0.08/2)^{60}} \approx 0.802 \quad (13) \text{}$$
    * Next, calculate the spread:
        $$\text{Spread} = \max [17.0415 \cdot (0.08 - 0.802), 0] - 0.0075$$
        $$\text{Spread} = \max [0.5613, 0] - 0.0075 = 0.5538 \text{ or } 55.38\% \quad (14) \text{}$$
    * Payment = $0.5538 \cdot \$200\text{M} = \$110.8\text{M}$.
    * The swap will raise P\&G's borrowing rate by 5,538 basis points.

#### C) How is the relationship between interest rates and the swap payment different with this swap than a standard fixed for floating rate swap?

* **Answer:** The payments on P\&G's swap are a **non-linear, convex function** of interest rates, while a standard fixed-for-floating swap has a linear relationship.
    * In a standard swap, the payment would rise by the same amount (e.g., $1\%$ of the notional amount) for every $1\%$ rise in the interest rate.
    * With P\&G's swap, as the interest rates rise, the payments **increase at an increasing rate**.
    * This swap is a very risky speculative bet because the potential loss if the bet is wrong (payments rising by $55.38\%$ or more) is huge, while the maximum upside is small (lowering the rate by $0.75\%$).

---

## 📉 Lecture 10: Supplementary Exercises and Answers

### 1) Allocation of Decision Rights in Financing Contracts.

The firm borrowed capital, paid the proceeds as a dividend to equity holders in year 0, and has a $\$120$ payment due in year 2. The cash flow from assets (CFA) will be either $\$100$ (Bad State) or $\$200$ (Good State) in year 1. The year 1 CFA must be invested in one of three projects (Project 1, 2, or 3). The projects cost $\$100$ and have a $20\%$ discount rate.

| | **CFA$_0$** | **CFA$_{1, \text{Bad}}$** | **CFA$_{1, \text{Good}}$** | **E[CFA]** | **NPV** | **Rank** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Project 1** | -100 | 105 | 165 | 135 | 12.5 | 1 |
| **Project 2** | -100 | 15 | 205 | 110 | -8.3 | 3 |
| **Project 3** | -100 | 110 | 120 | 115 | -4.2 | 2 |

#### A) Positive NPV Projects (Management always chooses highest NPV project).

The firm takes all positive NPV projects. In the Bad State (\$100 CFA), it takes Project 1 once (NPV $12.5$). In the Good State (\$200 CFA), it takes Project 1 twice (two * $\$100$ investments).

1.  **Value of the debt ($V_{\text{debt}}$):**
    * $V_{\text{debt}} = \frac{1}{4(1.20)^2} \cdot [\min(105, 120) + \min(165, 120) + \min(210, 120) + \min(330, 120)]$
    * $V_{\text{debt}} = \frac{1}{4(1.44)} \cdot [105 + 120 + 120 + 120] = \frac{465}{5.76} \approx \mathbf{80.7} \quad (19) \text{}$

2.  **Value of the equity ($V_{\text{equity}}$):**
    * $V_{\text{equity}} = \frac{1}{4(1.20)^2} \cdot [\max(105-120, 0) + \max(165-120, 0) + \max(210-120, 0) + \max(330-120, 0)]$
    * $V_{\text{equity}} = \frac{1}{5.76} \cdot [0 + 45 + 90 + 210] = \frac{345}{5.76} \approx \mathbf{59.9} \quad (20) \text{}$

3.  **Value of the firm ($V_{\text{firm}}$):**
    * $V_{\text{firm}} = V_{\text{debt}} + V_{\text{equity}} = 80.7 + 59.9 = \mathbf{140.6} \quad (21) \text{}$
    * This is the highest value, consistent with M\&M when only positive NPV projects are taken.

#### B) Equity has Control (Equity chooses project to maximize CFE).

Equity holders choose the project that maximizes their payoff.

* **Bad State ($\$100$ CFA):** Equity chooses **Project 2** (CFE: $0$) because it maximizes the *potential* upside in the good state for equity. While Project 1 also has CFE of $0$, Project 2 has a higher NPV loss ($-8.3$ vs $12.5$), showing the incentive to take higher risk, negative NPV projects when levered (Risk Shifting).
* **Good State ($\$200$ CFA):** Equity chooses **Project 1** twice (CFE: $210$) because it maximizes CFE in this state.

1.  **Value of the debt ($V_{\text{debt}}$):**
    * $V_{\text{debt}} = \frac{1}{5.76} \cdot [\min(15, 120) + \min(205, 120) + \min(210, 120) + \min(330, 120)]$
    * $V_{\text{debt}} = \frac{1}{5.76} \cdot [15 + 120 + 120 + 120] = \frac{375}{5.76} \approx \mathbf{65.1} \quad (22) \text{}$

2.  **Value of the equity ($V_{\text{equity}}$):**
    * $V_{\text{equity}} = \frac{1}{5.76} \cdot [\max(15-120, 0) + \max(205-120, 0) + \max(210-120, 0) + \max(330-120, 0)]$
    * $V_{\text{equity}} = \frac{1}{5.76} \cdot [0 + 85 + 90 + 210] = \frac{385}{5.76} \approx \mathbf{66.8} \quad (23) \text{}$
    * Equity value ($66.8$) is greater than the M\&M case ($59.9$) because they benefited from the risk shifting in the bad state, lowering debt's value.

3.  **Value of the firm ($V_{\text{firm}}$):**
    * $V_{\text{firm}} = V_{\text{debt}} + V_{\text{equity}} = 65.1 + 66.8 = \mathbf{131.9} \quad (24) \text{}$
    * The firm's value is lower than the optimal $140.6$ because equity chose the negative NPV Project 2 in the bad state.

#### C) Debt has Control (Debt chooses project to maximize CFD in the Bad State).

Debt holders choose the project to maximize their payoff (minimize loss in default).

* **Bad State ($\$100$ CFA):** Debt chooses **Project 3** (CFD: $110$) because it minimizes the loss in default, even though it's a negative NPV project (NPV: $-4.2$).
* **Good State ($\$200$ CFA):** Equity still has control and chooses **Project 1** twice.

1.  **Value of the debt ($V_{\text{debt}}$):**
    * $V_{\text{debt}} = \frac{1}{5.76} \cdot [\min(110, 120) + \min(120, 120) + \min(210, 120) + \min(330, 120)]$
    * $V_{\text{debt}} = \frac{1}{5.76} \cdot [110 + 120 + 120 + 120] = \frac{470}{5.76} \approx \mathbf{81.6} \quad (25) \text{}$

2.  **Value of the equity ($V_{\text{equity}}$):**
    * $V_{\text{equity}} = \frac{1}{5.76} \cdot [\max(110-120, 0) + \max(120-120, 0) + \max(210-120, 0) + \max(330-120, 0)]$
    * $V_{\text{equity}} = \frac{1}{5.76} \cdot [0 + 0 + 90 + 210] = \frac{300}{5.76} \approx \mathbf{52.1} \quad (26) \text{}$

3.  **Value of the firm ($V_{\text{firm}}$):**
    * $V_{\text{firm}} = V_{\text{debt}} + V_{\text{equity}} = 81.6 + 52.1 = \mathbf{133.7} \quad (27) \text{}$
    * The firm's value is lower than the optimal $140.6$ because debt chose a negative NPV project (Project 3) in the bad state (Underinvestment).

#### D) Optimal Debt Contract.

* **Answer:** The equity holders will allocate decision rights to maximize their wealth (dividend + equity value). They will choose the contract that maximizes the firm's total value, as this maximizes the proceeds from the debt issue.
    * $V_{\text{debt control}} = 133.7$.
    * $V_{\text{equity control}} = 131.9$.
    * Since $V_{\text{debt control}} > V_{\text{equity control}}$ (Equation 28), it is optimal for the equity holders to write the bond contract so that the **debt holders have control** (e.g., through covenants) in the bad state.
    * Giving control to debt in the bad state prevents the equity holders from taking the worse negative NPV project (Project 2 with NPV $-8.3$) and compels them toward the less-worse negative NPV project (Project 3 with NPV $-4.2$).

#### E) Optimal Choice.

* **Answer:** No, the choice from D) (Debt Control) **does not maximize the value of the firm**.
    * $V_{\text{M\&M}} = 140.6$.
    * $V_{\text{debt control}} = 133.7$.
    * $V_{\text{equity control}} = 131.9$.
    * The optimal decision, in a world without incentive problems, is to always take the positive NPV Project 1, yielding a value of $140.6$.
    * In the bad state, both debt and equity holders choose negative NPV projects to maximize their respective portions of the firm, leading to sub-optimal total firm value.

---

## 💸 Lecture 7: Supplementary Exercises and Answers

### 1) Dividend policy for Fishman Catering Inc. (Example 1).

FCI is worth $8800$ (cum-dividend: $11$ per share, $800$ shares outstanding) and pays an $\$800$ annual dividend (DPS $\$1$). The discount rate is $10\%$. The total dividend for this year is increased to $\$1600$, and **cum-dividend shares** are sold to raise the necessary funds.

#### A) What fraction of the firm must FCI sell to finance the dividend ($1600$ in total)?

* **Answer:** FCI must sell **$8.33\%$** of the firm.
    * The dividend increase requires raising $\$800$ in new equity ($1600$ total dividend $- 800$ internal cash).
    * The firm's value *before* the issue but *after* the dividend announcement (cum-dividend) is $V_{\text{old}} + \text{New Cash} = 8800 + 800 = 9600$.
    * Fraction to sell: $k = \frac{\text{Cash Raised}}{\text{Total Firm Value}} = \frac{800}{9600} \approx 0.0833 \text{ or } 8.33\%$.

#### B) How many shares will be outstanding after the equity issue?

* **Answer:** There will be **$872.7$** shares outstanding.
    * The old shareholders own $1 - k = 91.67\%$ of the total shares, and they currently own $800$ shares.
    * Total shares ($N$) is $800 / 0.9167 \approx 872.7$.
    * New shares issued: $872.7 - 800 \approx 72.7$.

#### C) What is the dividend per share today and in future years?

* **Answer:**
    * **Today's DPS:** $\frac{\$1600}{872.7} \approx \mathbf{\$1.83}$.
    * **Future DPS (starting next year):** $\frac{\$800}{872.7} \approx \mathbf{\$0.917}$.

#### D) What is the cum-dividend stock price and the ex-dividend stock price?

* **Answer:**
    * **Cum-dividend price ($P_{\text{cum-div}}$):** $1.83 + \sum_{t=1}^{\infty} \frac{0.917}{(1+0.1)^t} = 1.83 + \frac{0.917}{0.1} \approx \mathbf{\$11.00} \quad (16) \text{}$
    * **Ex-dividend price ($P_{\text{ex-div}}$):** $P_{\text{cum-div}} - \text{DPS}_{\text{today}} = 11.00 - 1.83 \approx \mathbf{\$9.17}$.
    * The wealth of the old shareholders remains $\mathbf{\$8,800}$ cum-dividend (800 shares * $\$11$) or ex-dividend ($800 \text{ shares} \cdot 9.17 \text{ price} + 800 \text{ shares} \cdot 1.83 \text{ dividend}$).

### 2) Dividend policy for Fishman Catering Inc. (Example 2).

FCI is worth $\$8800$ (cum-dividend). The total dividend for this year is increased to $\$4800$ (from $\$800$), and **ex-dividend shares** are sold to finance the increase.

#### A) What fraction of the firm must FCI sell to finance the dividend?

* **Answer:** FCI must sell **$50\%$** of the firm.
    * Dividend increase requires raising $\$4000$ in new equity ($4800 - 800$ internal cash).
    * The price for the new shares is the *ex-dividend* value. The firm's value *ex-dividend* (tomorrow's expected value) is $V_{\text{ex-div}} = 800 / 0.1 = 8000$.
    * The total firm value *after* the dividend payment and *after* the investment of new cash: $V_{\text{ex-div}} + \text{New Cash} = 8000 + 4000 = 12000$.
    * Fraction to sell: $k = \frac{\text{Cash Raised}}{\text{Value after issue}} = \frac{4000}{8000 + 4000} \approx 0.333 \text{ or } 33.3\%$
    * **Correction based on expected value** (as the original notes implicitly calculate for share amount): The total value of the firm *after* investment of new capital is $8000 + 4000 = 12000$. Since the dividend is $\$4800$, the ex-dividend value of the firm after the issue is $12000 - 4800 = 7200$. To raise $\$4000$, the new shareholders must own $4000/8000 = 50\%$ *of the ex-dividend value of the firm before the new investment*. This is incorrect. The calculation in the notes' *answer* leads to a total of $1600$ shares, meaning $800$ new shares were sold, or **$50\%$ of the initial shares**. The new shareholders own $800 / 1600 = 50\%$ of the firm.

#### B) How many shares will be outstanding after the dividend payment and equity issue?

* **Answer:** There will be **$1600$** shares outstanding.
    * The old shareholders own $800$ shares (which is $50\%$ of the total after issue).
    * Total shares: $800 / 0.5 = 1600$.

#### C) What is the ex-dividend price of FCI?

* **Answer:** The ex-dividend price is $\mathbf{\$5/\text{share}}$.
    * Ex-dividend value of the firm is the discounted value of future dividends: $\$8000$.
    * $P_{\text{ex-div}} = \frac{\$8000}{1600 \text{ shares}} = \$5$.
    * Alternatively, $P_{\text{cum-div}} = \$11$. $\text{DPS} = 4800 / 800 = 6$. $11 - 6 = 5$.

#### D) What is the dividend per share expected to be next year?

* **Answer:** The expected dividend per share will be $\mathbf{\$0.50/\text{share}}$.
    * Next year's total dividend reverts to $\$800$.
    * With $1600$ shares outstanding, $\frac{\$800}{1600} = \$0.50$.

### 3) Do it yourself dividends.

Managers forgo this year's dividend ($\$800$) and invest it in a zero NPV project with a $10\%$ return. The return will be used for next year's dividend.

#### A) What dividend payment does the market expect next year?

* **Answer:** The market expects a total dividend of **\$1680** next year.
    * Original free cash flow next year: $\$800$.
    * Return from investment: $800 \cdot (1 + 0.10) = 880$.
    * Total dividend: $800 + 880 = 1680$.

#### B) What is the value of the firm today?

* **Answer:** The value of the firm today is **\$8800**.
    * The value of the firm is unchanged because dividend policy is irrelevant (M\&M holds).
    * $V_{\text{firm}} = \frac{1680}{1.10} + \sum_{t=2}^{\infty} \frac{800}{(1.10)^t} = 1527.27 + 7272.73 = 8800$.

#### C) One of FCI's investors owns $50\%$ of the equity. She had been expecting a $\$400$ dividend. Recommend a trading strategy to 'reverse' FCI's decision.

* **Answer:** The investor should **sell $\$400$ worth of her stock** (or $\frac{400}{8800} \cdot 100\% \approx 4.55\%$ of her equity).
    * The investor expected $\$400$ cash and $\$4400$ in equity ($50\%$ of $\$8800$).
    * After the policy change, the investor has $\$0$ cash and $\$4400$ in equity ($50\%$ of $\$8800$).
    * By selling $\$400$ of her stock, she creates a **homemade dividend**.
    * Her final portfolio: $\$400$ cash and $\$4000$ in FCI equity, which is the same as the original expected portfolio.

---

## 🔮 Lecture 6: Supplementary Exercises and Answers

### 1) The value of imperfect information.

The Chicago coffee café project is valued at NPV $\$20.3$ without information. We examine a market research firm that is not $100\%$ accurate.

| $\mathbf{\text{True State} \downarrow / \text{MR Firm Says} \rightarrow}$ | **Berkeley** | **Cleveland** | **Probability** |
| :--- | :--- | :--- | :--- |
| **Berkeley** | 0.76 | 0.04 | 0.80 |
| **Cleveland** | 0.04 | 0.16 | 0.20 |

#### A) What is the probability that the market research firm is correct when it says the market is like Berkeley/Cleveland?

* **Answer:**
    * $\text{Pr}(\text{Berkeley} | \text{MR says Berkeley}) = \frac{0.76}{0.76 + 0.04} = \mathbf{0.95}$ (95\% correct) $\quad (9) \text{}$
    * $\text{Pr}(\text{Cleveland} | \text{MR says Cleveland}) = \frac{0.16}{0.16 + 0.04} = \mathbf{0.80}$ (80\% correct) $\quad (10) \text{}$

#### B) What is the expected annual cash flow from building the coffee café conditional on the market research results?

* **Expected CF conditional on result (CF $\mid$ MR says):**
    * $\text{MR says Berkeley} \implies 95\%$ chance CF is $22\text{K}$ (Berkeley CF) and $5\%$ chance CF is $12\text{K}$ (Cleveland CF).
        $$E[\text{CF} | \text{MR says Berkeley}] = 0.95(22) + 0.05(12) = \mathbf{21.5\text{K}} \quad (11) \text{}$$
    * $\text{MR says Cleveland} \implies 80\%$ chance CF is $12\text{K}$ (Cleveland CF) and $20\%$ chance CF is $22\text{K}$ (Berkeley CF).
        $$E[\text{CF} | \text{MR says Cleveland}] = 0.80(12) + 0.20(22) = \mathbf{14.0\text{K}} \quad (12) \text{}$$

#### C) What is the value of the project with imperfect information? What is the value of the information in this case?

* **Answer:** The value of the project is **\$23.0K**. The value of the imperfect information is **\$2.7K**.

1.  **Conditional NPV decision** ($r_{\text{asset}} = 10.5\%$):
    * If $\text{MR says Berkeley}$: $\text{NPV} = -100 + \sum_{t=1}^{10} \frac{21.5}{(1.105)^t} \approx \mathbf{29.3\text{K}}$ (Build) $\quad (13) \text{}$
    * If $\text{MR says Cleveland}$: $\text{NPV} = -100 + \sum_{t=1}^{10} \frac{14.0}{(1.105)^t} \approx \mathbf{-15.8\text{K}}$ (Don't Build) $\quad (14) \text{}$
    * The decision is the same as with perfect information (don't build if the NPV is negative).

2.  **Value of Project with Imperfect Information** ($r_{\text{risk-free}} = 2.0\%$):
    * The MR firm says "Berkeley" with probability $0.80$ and "Cleveland" with probability $0.20$.
        $$V_{\text{imperfect info}} = \frac{0.80(\text{NPV}_{\text{Build}|\text{B}}) + 0.20(\text{NPV}_{\text{Don't Build}|\text{C}})}{1 + r_{\text{risk-free}}} \quad \text{}$$
        $$V_{\text{imperfect info}} = \frac{0.80(29.3) + 0.20(0.0)}{1 + 0.02} \approx \mathbf{23.0\text{K}} \quad (15) \text{}$$

3.  **Value of Information:**
    * $V_{\text{information}} = V_{\text{imperfect info}} - V_{\text{no info}} = 23.0\text{K} - 20.3\text{K} = \mathbf{2.7\text{K}}$.
    * This is less than the value of **perfect information** ($5.0\text{K}$).