/**
 * Static Knowledge Base for Quick Problem Guidance
 * 
 * Provides instant qualitative guidance for de novo problems without requiring an API.
 * Maps keywords to archetype guidance extracted from ACFQ2ConceptualGuide.md
 */

export const archetypeGuidance = {
  'A1-CapitalStructure': {
    keywords: [
      'debt', 'equity', 'WACC', 'tax shield', 'leverage', 'capital structure',
      'interest', 'coupon', 'bond', 'amortizing', 'bullet', 'default',
      'bankruptcy', 'financial distress', 'optimal capital structure'
    ],
    quickGuide: `**ARCHETYPE 1: CAPITAL STRUCTURE & TAX SHIELDS**

**Core Question:** How does debt financing affect firm value?

**Key Concepts:**
• Tax shields from debt: Interest is tax-deductible, creating value
• Trade-off theory: Balance tax benefits vs. distress costs
• M&M Propositions: With/without taxes framework
• Expected return on debt E[r_D]: Must account for default risk
• WACC: Weighted average cost of capital

**Typical Approach:**
1. **IDENTIFY**: Look for keywords like "debt", "tax shield", "WACC", "capital structure"
2. **EXTRACT**: Note if debt is bullet or amortizing, tax rate, default probability, recovery rate
3. **MAP**: 
   - Quantitative → Excel tab "1_Capital_Structure"
   - Calculate E[r_D] first (accounting for default)
   - Then compute PV of tax shields
4. **EXECUTE**:
   - Build survival probability table if hazard rate model
   - Calculate expected cash flows = No-default CF × P(survive) + Default CF × P(default)
   - Discount at appropriate rate (usually E[r_D] for tax shields)
5. **CHECK**:
   - Sign: E[r_D] should exceed coupon rate (default risk premium)
   - Magnitude: Tax shields should be positive (benefit from debt)
   - Theory: Aligns with M&M Proposition I with taxes

**Key Formulas:**
• WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)
• E[r_D] = (Σ p(state) × CF_state / Price) - 1
• PV(Tax Shields) = Σ [Interest_t × τ / (1+r_D)^t]
• For hazard model: Survival_t = (1 - hazard_rate)^t

**Common Mistakes:**
✗ Using coupon rate instead of expected return E[r_D]
✗ Forgetting that amortizing debt has declining principal
✗ Not accounting for tax shields being lost in default
✗ Using wrong discount rate for tax shields (should be r_D, not WACC)
✗ Confusing binary default model with hazard rate model

**Excel Tab:** 1_Capital_Structure
**Tier:** Usually Tier 1 (quantitative, Excel-heavy)`,
    
    formulas: [
      'WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)',
      'E[r_D] = (Σ p(state) × CF_state / Price) - 1',
      'PV(TS) = Σ [Interest_t × τ / (1+r_D)^t]',
      'Survival_t = (1 - hazard)^t',
      'V_L = V_U + PV(Tax Shields) - PV(Distress Costs)'
    ],
    
    excelTab: '1_Capital_Structure'
  },

  'A2-MultiState': {
    keywords: [
      'states', 'scenarios', 'good state', 'bad state', 'debt overhang',
      'APV', 'state-contingent', 'probability', 'equity value', 'firm value',
      'underinvestment', 'asset substitution'
    ],
    quickGuide: `**ARCHETYPE 2: MULTI-STATE VALUATION & DEBT OVERHANG**

**Core Question:** How do we value firms/projects when outcomes are state-dependent?

**Key Concepts:**
• State-contingent valuation: Different outcomes in Good vs. Bad states
• Debt overhang: Equity holders reject +NPV projects because benefits go to debtholders
• Equity = max(0, Firm Value - Debt) in each state
• APV (Adjusted Present Value) approach

**Typical Approach:**
1. **IDENTIFY**: Look for "states", "scenarios", "debt overhang", "underinvestment"
2. **EXTRACT**: 
   - Number of states (usually 2: Good/Bad)
   - Probabilities of each state
   - Cash flows or firm values in each state
   - Existing debt amount and terms
3. **MAP**:
   - Build state table (rows = states, columns = firm value, debt, equity)
   - Check for debt overhang: Does NPV_equity < 0 even if NPV_firm > 0?
4. **EXECUTE**:
   - Calculate Firm Value in each state
   - Equity_state = max(0, FirmValue_state - Debt)
   - E[Equity] = Σ p(state) × Equity_state
   - Check if new project benefits equity or just debtholders
5. **CHECK**:
   - Equity can never be negative (limited liability)
   - If debt > firm value in bad state, equity = 0 in that state
   - Debt overhang exists if equity holders reject +NPV project

**Key Formulas:**
• Equity_state = max(0, V_state - D)
• E[Equity] = Σ p(state) × Equity_state
• E[Debt] = Σ p(state) × min(V_state, D)
• Debt Overhang: NPV_firm > 0 but NPV_equity < 0

**Common Mistakes:**
✗ Forgetting equity = max(0, V-D) — equity can't be negative!
✗ Not checking for debt overhang when evaluating new projects
✗ Using wrong probabilities or forgetting to probability-weight
✗ Confusing firm value with equity value
✗ Not considering that equity is a call option on firm value

**Excel Tab:** 2_MultiState_Valuation
**Tier:** Usually Tier 1 (quantitative, table-building)`,
    
    formulas: [
      'Equity_state = max(0, FirmValue_state - Debt)',
      'E[Equity] = Σ p(state) × Equity_state',
      'E[Debt] = Σ p(state) × min(FirmValue_state, Debt)',
      'Debt Overhang: NPV_firm > 0 but ΔEquity < Investment'
    ],
    
    excelTab: '2_MultiState_Valuation'
  },

  'A3-CAPM': {
    keywords: [
      'CAPM', 'beta', 'discount rate', 'cost of equity', 'cost of capital',
      'risk-free rate', 'market risk premium', 'systematic risk', 'levered beta',
      'unlevered beta', 'project discount rate'
    ],
    quickGuide: `**ARCHETYPE 3: CAPM, BETA, AND DISCOUNT RATES**

**Core Question:** What discount rate should I use for this cash flow?

**Key Concepts:**
• CAPM: r_E = r_f + β × MRP
• Beta measures systematic risk (correlation with market)
• Levered vs. Unlevered beta: Debt affects equity beta
• Different cash flows need different discount rates

**Typical Approach:**
1. **IDENTIFY**: Keywords like "discount rate", "CAPM", "beta", "cost of equity"
2. **EXTRACT**:
   - What cash flow am I discounting? (Firm, Equity, Project, Tax Shields?)
   - Risk-free rate, market risk premium
   - Beta (and whether it's levered or unlevered)
   - Debt/Equity ratio if relevering beta
3. **MAP**: Use decision tree:
   - Valuing ENTIRE FIRM (FCFF) → Use WACC or r_U
   - Valuing EQUITY (dividends, buybacks) → Use r_E
   - Valuing PROJECT → Use project-specific discount rate
   - Valuing TAX SHIELDS → Use r_D
4. **EXECUTE**:
   - If project risk ≠ firm risk: Unlever firm beta, relever at project D/E
   - β_U = β_E / [1 + (1-τ)×(D/E)]
   - β_E = β_U × [1 + (1-τ)×(D/E)]
   - r = r_f + β × MRP
5. **CHECK**:
   - Higher risk → Higher beta → Higher discount rate
   - Levered beta > Unlevered beta (debt amplifies equity risk)
   - WACC should be between r_D and r_E

**Key Formulas:**
• r_E = r_f + β_E × MRP
• β_U = β_E / [1 + (1-τ)×(D/E)]
• β_E = β_U × [1 + (1-τ)×(D/E)]
• WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)

**Common Mistakes:**
✗ Using firm's WACC for projects with different risk
✗ Forgetting to unlever/relever beta when risk changes
✗ Using levered beta when you need unlevered (or vice versa)
✗ Discounting tax shields at WACC instead of r_D
✗ Not matching cash flow type to discount rate

**Excel Tab:** 3_CAPM_DiscountRates
**Tier:** Can be Tier 1 (quant) or Tier 2 (conceptual)`,
    
    formulas: [
      'r_E = r_f + β_E × MRP',
      'β_U = β_E / [1 + (1-τ)×(D/E)]',
      'β_E = β_U × [1 + (1-τ)×(D/E)]',
      'WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)'
    ],
    
    excelTab: '3_CAPM_DiscountRates'
  },

  'A4-Payout': {
    keywords: [
      'dividend', 'buyback', 'repurchase', 'payout policy', 'share repurchase',
      'dividend tax', 'capital gains tax', 'clientele effect', 'signaling'
    ],
    quickGuide: `**ARCHETYPE 4: PAYOUT POLICY (DIVIDENDS VS. BUYBACKS)**

**Core Question:** Should the firm pay dividends or repurchase shares?

**Key Concepts:**
• M&M irrelevance (perfect markets): Payout policy doesn't matter
• Taxes: Dividends vs. capital gains tax treatment
• Signaling: Payout changes convey information
• Clientele effects: Different investors prefer different policies

**Typical Approach:**
1. **IDENTIFY**: Keywords like "dividend", "buyback", "payout", "repurchase"
2. **EXTRACT**:
   - Tax rates (dividend vs. capital gains)
   - Amount of cash to distribute
   - Current share price and shares outstanding
3. **MAP**:
   - If taxes differ: Calculate after-tax value to shareholders
   - If signaling: Consider market reaction
   - If no taxes/frictions: Payout policy is irrelevant (M&M)
4. **EXECUTE**:
   - Dividend: After-tax value = Dividend × (1 - τ_div)
   - Buyback: After-tax value = (New price - Old price) × (1 - τ_CG)
   - Compare after-tax wealth
5. **CHECK**:
   - In perfect markets, shareholders should be indifferent
   - With taxes, prefer method with lower tax rate
   - Buybacks more flexible (not a commitment)

**Key Formulas:**
• After-tax dividend = Div × (1 - τ_div)
• Shares repurchased = Cash / Price
• New shares outstanding = Old shares - Repurchased
• New price = (Market cap - Cash) / New shares

**Common Mistakes:**
✗ Forgetting to account for tax differences
✗ Not adjusting share count after buyback
✗ Ignoring that buybacks increase ownership %
✗ Confusing dividend yield with total return

**Excel Tab:** 4_Payout_Policy
**Tier:** Usually Tier 2 (conceptual)`,
    
    formulas: [
      'After-tax dividend = Div × (1 - τ_div)',
      'Shares repurchased = Cash / Price_per_share',
      'New price = (Old market cap - Cash) / New shares'
    ],
    
    excelTab: '4_Payout_Policy'
  },

  'A5-RealOptions': {
    keywords: [
      'real option', 'option to expand', 'option to abandon', 'option to wait',
      'flexibility', 'timing option', 'growth option', 'Black-Scholes'
    ],
    quickGuide: `**ARCHETYPE 5: REAL OPTIONS**

**Core Question:** What is the value of managerial flexibility?

**Key Concepts:**
• Real options: Apply option pricing to real assets
• Option to expand: Invest more if project succeeds
• Option to abandon: Exit if project fails
• Option to wait: Delay investment to learn more
• NPV understates value when flexibility exists

**Typical Approach:**
1. **IDENTIFY**: Keywords like "option to", "flexibility", "can expand/abandon"
2. **EXTRACT**:
   - Base case NPV
   - What flexibility exists? (expand, abandon, wait)
   - Costs and benefits of exercising option
3. **MAP**:
   - Traditional NPV analysis first
   - Then add option value
   - May use decision tree or Black-Scholes analogy
4. **EXECUTE**:
   - Calculate NPV without flexibility
   - Calculate value of option (payoff in each state)
   - Total value = NPV + Option value
5. **CHECK**:
   - Option value should be positive (flexibility is valuable)
   - Total value > Traditional NPV

**Key Formulas:**
• Value with options = NPV + Option value
• Option to abandon: max(0, Salvage - PV(future losses))
• Option to expand: Payoff if expand - Cost to expand

**Common Mistakes:**
✗ Using traditional NPV when flexibility exists
✗ Not recognizing embedded options
✗ Forgetting that option value is always ≥ 0

**Excel Tab:** 5_Real_Options
**Tier:** Usually Tier 2 (conceptual)`,
    
    formulas: [
      'Total value = Base NPV + Option value',
      'Call option analogy: max(0, S - K)',
      'Put option analogy: max(0, K - S)'
    ],
    
    excelTab: '5_Real_Options'
  }
};

/**
 * Detect archetype from problem text using keyword matching
 * @param {string} problemText - The problem statement
 * @returns {object} - Detected archetype with confidence score and guidance
 */
export function detectArchetype(problemText) {
  if (!problemText || problemText.trim().length === 0) {
    return {
      archetype: 'Unknown',
      confidence: 0,
      guidance: null,
      message: 'Please provide a problem statement'
    };
  }

  const text = problemText.toLowerCase();
  const scores = {};
  
  // Calculate keyword match scores for each archetype
  for (const [archetype, data] of Object.entries(archetypeGuidance)) {
    const matchedKeywords = data.keywords.filter(kw => 
      text.includes(kw.toLowerCase())
    );
    scores[archetype] = {
      count: matchedKeywords.length,
      keywords: matchedKeywords
    };
  }
  
  // Sort by match count
  const sorted = Object.entries(scores).sort((a, b) => b[1].count - a[1].count);
  const topMatch = sorted[0];
  
  if (topMatch[1].count === 0) {
    return {
      archetype: 'Unknown',
      confidence: 0,
      guidance: null,
      message: 'No archetype detected. Try including more specific keywords like "debt", "WACC", "states", "CAPM", etc.'
    };
  }
  
  const detectedArchetype = topMatch[0];
  const matchCount = topMatch[1].count;
  const matchedKeywords = topMatch[1].keywords;
  
  // Calculate confidence (rough heuristic: 20% per keyword match, capped at 95%)
  const confidence = Math.min(95, matchCount * 15 + 25);
  
  return {
    archetype: detectedArchetype,
    confidence: confidence,
    matchedKeywords: matchedKeywords,
    guidance: archetypeGuidance[detectedArchetype],
    alternativeArchetypes: sorted.slice(1, 3).filter(([_, score]) => score.count > 0).map(([arch, score]) => ({
      archetype: arch,
      matchCount: score.count
    }))
  };
}

/**
 * Get all available archetypes
 * @returns {array} - List of archetype IDs
 */
export function getAllArchetypes() {
  return Object.keys(archetypeGuidance);
}

/**
 * Get guidance for a specific archetype
 * @param {string} archetypeId - The archetype ID (e.g., 'A1-CapitalStructure')
 * @returns {object} - Guidance object or null if not found
 */
export function getGuidanceForArchetype(archetypeId) {
  return archetypeGuidance[archetypeId] || null;
}

/**
 * Search for specific concept across all archetypes
 * @param {string} concept - Concept to search for
 * @returns {array} - Archetypes that mention this concept
 */
export function searchConcept(concept) {
  const results = [];
  const searchTerm = concept.toLowerCase();
  
  for (const [archetype, data] of Object.entries(archetypeGuidance)) {
    if (data.quickGuide.toLowerCase().includes(searchTerm) ||
        data.keywords.some(kw => kw.toLowerCase().includes(searchTerm))) {
      results.push({
        archetype,
        guidance: data
      });
    }
  }
  
  return results;
}

export default {
  archetypeGuidance,
  detectArchetype,
  getAllArchetypes,
  getGuidanceForArchetype,
  searchConcept
};
