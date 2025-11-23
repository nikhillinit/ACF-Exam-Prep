Lecture 6: Real Options
Core Concept: Real Options Valuation (ROV) extends traditional Discounted Cash Flow (DCF) analysis by incorporating the value of managerial flexibility to make future decisions after uncertainty is resolved.

1. Comparison to Traditional Valuation Methods:

Multiples: Often used for pricing rather than intrinsic valuation.

Discounted Cash Flow (DCF): Assumes a single, fixed decision is made today (e.g., invest now). It is static and fails to account for the value of flexibility.

Real Options: Recognizes that management can make sequential decisions. An initial decision is made today (e.g., to explore or delay), with a second decision in the future (e.g., to expand, abandon, or contract) based on new information. This is analogous to a financial call option, where the right (but not the obligation) to invest later is valuable.

2. Illustrative Example: Coffee Café Investment

Scenario: Deciding whether to build a coffee shop in Chicago. The market type (favorable "Berkeley" or unfavorable "Cleveland") is uncertain at the outset.

Two Strategic Options:

Build then Learn: Invest $100K immediately. After building, you learn the true market type and are stuck with the resulting cash flows (which could be low).

Learn then Build (Real Options Approach): Delay the major investment to first learn the market type. Only if the market is favorable ("Berkeley") do you proceed with building. This strategy avoids losses in the bad state.

Valuation: The Real Options approach is valued using decision trees, showing that the ability to abandon the project in a bad state creates significant value that a standard DCF would miss.

3. Benefits and Costs of Delaying Investment (The Real Option):

Benefits:

Better Information: Allows for more informed future decisions.

Avoids Negative NPV: The option to not proceed prevents investing in money-losing projects.

Costs:

Postponed Cash Flows: Delaying a positive-NPV project means forgoing early cash flows (analogous to a call option's dividend).

Cost of Information: While sometimes free, information gathering can have explicit costs.

Competitive Entry: Delay may allow competitors to enter the market first.

Lectures 7 & 8: Dividend Policy & Capital Structure Irrelevance
These lectures establish the foundational theorems of Franco Modigliani and Merton Miller (M&M), which state that under perfect market assumptions, dividend policy and capital structure are irrelevant to firm value.

Core Assumptions of M&M (Perfect Capital Markets):

No taxes.

No transaction costs (for trading securities or financial distress).

Investment Policy is Held Constant (firm takes all positive-NPV projects).

Symmetric Information (all participants have the same information).

Efficient Markets (Price = Intrinsic Value).

Managers maximize shareholder value.

Part A: Dividend Policy Irrelevance
1. The Theorem: In a perfect world, the choice of how much dividend to pay does not affect the total value of the firm. Shareholders are indifferent between dividends and capital gains.

2. Fishman Catering Inc. (FCI) Example:

Setup: FCI has $1600 in cash and a positive-NPV project (Cost: $800, PV: ~$1455, NPV: ~$655). The discount rate is 10%.

Initial Policy: Pays a $1/share perpetual dividend. The ex-dividend value is $10/share.

Policy Change: The firm announces a one-time increase to a $2/share dividend.

Analysis: To pay the extra $800 dividend, the firm must raise $800. It does so by issuing new equity. The new shareholders demand a fair fraction of the firm, precisely equal to the $800 they contribute.

Result: The total firm value (cum-dividend) remains unchanged at $11/share. The wealth of the original shareholders is unchanged. They have more cash from the higher dividend, but this is exactly offset by dilution in their ownership stake.

Key Insight: The source of the extra cash for dividends is irrelevant; it cannot create value. This is the concept of "Homemade Dividends"—if shareholders desire cash, they can create it themselves by selling a portion of their shares.

3. Why Dividend Policy Becomes Relevant in Reality:
M&M irrelevance breaks down when its assumptions are violated.

Taxes: Investors typically prefer capital gains over dividends due to lower statutory tax rates and the valuable option to defer taxes until sale. Corporations, however, may prefer dividends due to the dividend-received deduction.

Transaction Costs: Flotation costs for issuing new equity make external financing expensive, favoring retained earnings over dividend payouts.

Signaling: Dividend changes can signal management's confidence in future earnings, causing stock price reactions.

Agency Costs: Payouts can reduce the "free cash flow" available for managers to waste on perquisites or negative-NPV projects.

Part B: Capital Structure Irrelevance
1. The Theorem: In a perfect world, the mix of debt and equity used to finance a firm does not affect its total value. The value is determined solely by the cash flows generated by its assets.

2. Numerical Example:

Unlevered Firm: A project with an expected asset value of $80 is valued at ~$69.60 (discounted at 15%).

Levering the Firm: The firm issues $60 of debt to pay a $60 dividend.

The debt is risky. In the "Bad" state, asset cash flows ($60) are less than the promised payment ($76), leading to a default where debtholders receive only the available $60.

The expected return on debt (r_debt) is calculated at 13.3%.

Using the formula r_equity = r_asset + (D/E)(r_asset - r_debt), the cost of equity is found to be 25.5%.

The value of equity is calculated as $9.60.

The Irrelevance Result: The total firm value remains $69.60 ($60 debt + $9.60 equity). The wealth of the original shareholders is unchanged; they simply own a more leveraged, and hence riskier, equity claim.

3. Why Capital Structure Becomes Relevant in Reality:
The value of a levered firm in the real world can be expressed using the Adjusted Present Value (APV) method, which breaks down the deviations from M&M:

V_Levered = V_Unlevered + NPV(Financing Side Effects)

NPV(Financing) = NPV(Tax Shield) - NPV(Costs of Financial Distress) + [Price - Value] of Securities - NPV(Transaction Costs)

The key real-world factors are:

Corporate Taxes: The tax-deductibility of interest payments creates a valuable "interest tax shield," increasing the value of the levered firm. Initially, this shield was valued as τ_c * D (tax rate times debt value) for perpetual, risk-free debt.

Costs of Financial Distress (CoFD): As leverage increases, so does the probability of bankruptcy. Bankruptcy is not costless; it involves direct costs (legal/administrative fees) and indirect costs (lost sales, inability to invest, fire sales of assets). These costs reduce firm value.

Security Mispricing: If management believes its stock is overvalued, issuing equity can transfer wealth from new to old shareholders. The market, anticipating this, reacts negatively to equity issue announcements.

Agency Costs & Managerial Incentives: Debt can discipline managers by reducing free cash flow, but it can also lead to underinvestment (skipping good projects if benefits accrue to debtholders) or risk-shifting (taking excessive risk).

4. The Trade-Off Theory:
Firms are posited to choose a target capital structure by trading off the benefits of debt (the interest tax shield) against the costs (financial distress and agency costs).

Lecture 9: Capital Structure - Taxation
This lecture delves deeper into the nuances of the interest tax shield.

1. Valuing the Tax Shield with Risky Debt:

The simple formula τ * D assumes debt is risk-free and perpetual.

With risky debt, the tax shield is also risky. If a firm defaults, it loses the ability to deduct interest. The value of the tax shield must be discounted at a rate r_TS that reflects this risk.

The systematic risk of the tax shield (β_TS) can differ from the risk of the debt itself (β_D). It is often argued that β_TS > β_D because the tax shield is more volatile and correlated with the firm's underlying assets, especially if the firm has past losses (tax-loss carryforwards) or is near financial distress.

2. Effective Marginal Tax Rate (EMTR):

The statutory corporate tax rate (e.g., 35%) is not always the effective rate a firm pays on an extra dollar of interest.

Due to rules like loss carryforwards and carrybacks, the present value of the tax savings from $1 of interest can be less than τ. For example, if a firm has a loss today, the tax benefit of interest is deferred, reducing its present value: EMTR = τ / (1 + r) < τ.

3. The Tax Cuts and Jobs Act (TCJA) of 2017:

Reduced the corporate tax rate from 35% to 21%, directly reducing the value of the interest tax shield.

Limited interest deductibility to 30% of EBITDA (switching to EBIT), further constraining the tax benefits of debt for highly leveraged firms.

4. APV vs. WACC:

APV (Adjusted Present Value): Values the project and financing side effects separately. It is more flexible, especially when capital structure is not constant.

WACC (Weighted Average Cost of Capital): Incorporates the tax shield into a single discount rate. It is simpler but assumes a constant debt-to-value ratio.

WACC = (1 - τ) * r_debt * (D/V) + r_equity * (E/V)

Both methods should yield the same answer if applied correctly with consistent assumptions.

Lecture 10: Costs of Financial Distress
1. Quantifying CoFD:

The lecture extends the capital structure example by introducing a direct cost of financial distress—a $4 loss in asset value in the "Bad" state due to bankruptcy.

To entice lenders to still provide $60, the firm must promise a higher payment ($80). This higher promised payment further reduces the cash flows to equity in the "Good" state.

The final valuation shows: V_Levered = $67.80 < $69.60 = V_Unlevered. The difference of $1.80 is the present value of the expected costs of financial distress.

2. Economic vs. Financial Distress:

Economic Distress: A decline in a firm's operating performance and asset value (e.g., due to a bad market shock). This affects all firms, levered or unlevered.

Financial Distress: The additional costs that arise specifically because a firm has debt and cannot meet its obligations. This includes the $1.80 PV(CoFD) calculated above, which is an incremental loss on top of the economic shock.

3. Sources of Financial Distress Costs:

Asset Fire Sales: Selling assets quickly at prices below their true value (P < V).

Damaged Stakeholder Relationships: Key employees, suppliers, and customers may flee, fearing instability.

Covenants & Inability to Invest: Debt covenants can prevent the firm from undertaking positive-NPV projects.

Distorted Investment Incentives:

Underinvestment: Skipping good projects because the benefits would primarily go to debtholders.

Risk-Shifting: Taking on excessively risky, negative-NPV projects because equity holders keep the upside while debtholders bear the downside.

Lecture 11: Capital Structure & Security Mispricing
1. Market Reaction to Equity Issues:

Empirical evidence shows a significant negative stock price reaction (e.g., -2.7%) upon the announcement of an equity issue.

This is explained by asymmetric information (Myers & Majluf, 1984). Managers are assumed to have better information about the firm's true value.

If managers believe the stock is overvalued, they are more likely to issue equity. The market understands this incentive and interprets an equity issue as a signal that the stock is overpriced, leading to a price drop.

If managers believe the stock is undervalued, they will avoid issuing equity, as it would dilute existing shareholders at a cheap price.

2. Numerical Example of Mispricing:

Setup: A firm with assets-in-place ($100 expected value) and a new project (NPV = $15) needs to raise $100.

Information Asymmetry: Managers know if the firm is in a high-value (State 1) or low-value (State 2) state, but the market does not.

Inefficient Outcome: In the initial "pooling" equilibrium, the firm issues and invests in both states. However, this is detrimental to old shareholders in State 1 (the good state) because they are selling a fraction of their valuable firm for too low a price (NPV(Financing) < 0).

New (Separating) Equilibrium: The market learns that only low-value firms (State 2) issue equity. The announcement of an equity issue therefore signals that the firm is in the low state, causing an immediate price drop. High-value firms forgo the positive-NPV project to avoid sending the wrong signal, leading to an overall loss of value.

3. Potential Solutions:

Use internal cash (retained earnings).

Issue less information-sensitive securities like risk-free debt.

Improve disclosure to reduce information asymmetry.

Use a rights issue, which is less likely to be interpreted as a negative signal.

Lecture 12: Risk Management
Core Concept: Risk management is not about eliminating risk, but about moving cash flows across time and states of the world to create value when capital structure is relevant.

1. Instruments:

Forwards/Futures: A contract to buy/sell an asset at a pre-set price on a future date. The forward price is set so the initial NPV is zero. The payoff is linear and symmetric.

Options: Provide the right, but not the obligation, to buy (call) or sell (put) an asset. Payoff is asymmetric.

Swaps: Agreement to exchange one stream of cash flows for another (e.g., floating for fixed interest rates). The example shows how an interest rate swap can transform a floating-rate loan into a synthetic fixed-rate loan, and vice-versa.

2. Value Creation through Risk Management:

Lowering Costs of Financial Distress: Hedging reduces the volatility of cash flows, which lowers the probability of entering financial distress. This increases firm value by reducing the PV(CoFD). A graphical analysis shows that hedging allows a firm to safely take on more debt to capture a larger tax shield, or to operate with the same debt level but a much lower risk of distress.

Improving the Investment Decision: In perfect markets, investment is independent of cash flow. In reality, with external financing being costly, firms with volatile cash flows may be forced to forgo positive-NPV projects during cash shortfalls. Hedging ensures stable internal funds, allowing the firm to maintain its optimal investment level.

Managerial Incentives: Hedging can reduce the risk for undiversified, risk-averse managers, better aligning their incentives with shareholders. It also makes firm performance more transparent, aiding monitoring.

Lecture 13: Security Design & Financial Innovation
Core Concept: Firms can create custom securities (like convertible debt) by combining the basic building blocks of finance (debt, equity, options) to better meet their needs and the needs of investors in an imperfect world.

1. Convertible Debt: A Hybrid Security

Definition: A bond that can be converted into a predetermined number of shares of the issuing company's common stock.

Payoff: At maturity, the holder chooses the maximum of:

The face value of the bond (Min[Assets, FV]).

The value of the equity received upon conversion (Conversion Ratio * Stock Price).

Break-Even Analysis: Conversion becomes attractive when the stock price exceeds the "conversion price" (Face Value / Conversion Ratio). At this point, the convertible bond behaves like equity.

Decomposition: A convertible bond can be viewed as straight debt plus a warrant (a call option issued by the company on its own stock).

2. Reasons for Issuing Convertible Debt (Non-M&M):

"Backdoor" Equity Financing: For firms that find straight equity too expensive (due to negative signaling) and straight debt too risky (high coupon rates), convertibles can be a cost-effective compromise. They carry a lower coupon than straight debt because the conversion option is valuable to investors.

Addressing Mispricing from Disagreement: If the market overestimates the firm's risk (volatility), it will demand a very high coupon on straight debt. Issuing a convertible allows the firm to "sell" the overpriced volatility (the option component) to the market, effectively reducing its overall financing cost.

Mitigating Investment Distortions: Convertible debt can reduce the "risk-shifting" problem. Because holders participate in the upside, they are less concerned about equity holders taking excessive risk, aligning the incentives of debt and equity holders.