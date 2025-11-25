/**
 * Static Knowledge Base for Quick Problem Guidance
 * 
 * Provides instant qualitative guidance for de novo problems without requiring an API.
 * Maps keywords to archetype guidance extracted from ACFQ2ConceptualGuide.md
 * 
 * UPDATED: Added weighted keyword detection, A2B-AdverseSelection, and question pattern matching
 */

export const archetypeGuidance = {
  'A1-CapitalStructure': {
    keywords: [
      'debt', 'equity', 'WACC', 'tax shield', 'leverage', 'capital structure',
      'interest', 'coupon', 'bond', 'amortizing', 'bullet', 'default',
      'bankruptcy', 'financial distress', 'optimal capital structure',
      'expected return on debt', 'promised yield', 'YTM', 'yield to maturity'
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
3. **MAP**: Quantitative → Excel tab "1_Capital_Structure"
4. **EXECUTE**: Calculate E[r_D] first, then compute PV of tax shields
5. **CHECK**: E[r_D] > coupon rate (default premium), tax shields positive

**Key Formulas:**
• WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)
• E[r_D] = (Σ p(state) × CF_state / Price) - 1
• PV(Tax Shields) = Σ [Interest_t × τ / (1+r_D)^t]

**Excel Tab:** 1_Capital_Structure
**Tier:** Tier 1 (quantitative)`,
    
    formulas: [
      'WACC = (E/V)×r_E + (D/V)×r_D×(1-τ)',
      'E[r_D] = (Σ p(state) × CF_state / Price) - 1',
      'PV(TS) = Σ [Interest_t × τ / (1+r_D)^t]',
      'V_L = V_U + PV(Tax Shields) - PV(Distress Costs)'
    ],
    
    excelTab: '1_Capital_Structure'
  },

  'A2-MultiState': {
    keywords: [
      'states', 'scenarios', 'good state', 'bad state', 'debt overhang',
      'APV', 'state-contingent', 'probability', 'equity value', 'firm value',
      'underinvestment', 'asset substitution', 'wealth transfer'
    ],
    quickGuide: `**ARCHETYPE 2: MULTI-STATE VALUATION & DEBT OVERHANG**

**Core Question:** How do we value firms/projects when outcomes are state-dependent?

**Key Concepts:**
• State-contingent valuation: Different outcomes in Good vs. Bad states
• Debt overhang: Equity holders reject +NPV projects because benefits go to debtholders
• Equity = max(0, Firm Value - Debt) in each state

**Typical Approach:**
1. **IDENTIFY**: Look for "states", "scenarios", "debt overhang"
2. **EXTRACT**: States, probabilities, payoffs, existing debt
3. **MAP**: Build state table
4. **EXECUTE**: Equity_state = max(0, V_state - D)
5. **CHECK**: Equity can never be negative

**Key Formulas:**
• Equity_state = max(0, V_state - D)
• E[Equity] = Σ p(state) × Equity_state
• Debt Overhang: NPV_firm > 0 but NPV_equity < 0

**Excel Tab:** 2_MultiState_Valuation
**Tier:** Tier 1 (quantitative)`,
    
    formulas: [
      'Equity_state = max(0, FirmValue_state - Debt)',
      'E[Equity] = Σ p(state) × Equity_state',
      'Debt Overhang: NPV_firm > 0 but ΔEquity < Investment'
    ],
    
    excelTab: '2_MultiState_Valuation'
  },

  'A2B-AdverseSelection': {
    keywords: [
      'asymmetric information', 'information asymmetry', 'private information',
      'signaling', 'signal', 'pecking order', 'Myers-Majluf', 'adverse selection',
      'high type', 'low type', 'pooling', 'separating', 'mimic', 'reveal',
      'underpricing', 'market perception', 'equity issue', 'informed', 'uninformed'
    ],
    quickGuide: `**ARCHETYPE 2B: ADVERSE SELECTION & SIGNALING**

**Core Question:** How does information asymmetry affect financing and investment decisions?

**Key Concepts:**
• Asymmetric information: Managers know more than outside investors
• Adverse selection: "Lemons problem" in equity markets
• Signaling: Costly actions reveal private information
• Pecking order: Internal funds > Debt > Equity
• Pooling vs. Separating equilibria

**Typical Approach:**
1. **IDENTIFY**: Look for "signaling", "high/low type", "asymmetric information"
2. **EXTRACT**: Types, signal costs, pooled vs revealed values
3. **MAP**: Build payoff matrix for each type under each action
4. **EXECUTE**: Check separating condition: Cost_signal > Benefit_mimic
5. **CHECK**: Signal must be costly, high type benefits, low type won't mimic

**Key Formulas:**
• Separating condition: Cost_signal > Benefit_mimic (for low type)
• Pooled value = p(High) × V_High + p(Low) × V_Low
• NPV_signal = V_true - V_pooled - Cost_signal

**Common Mistakes:**
✗ Forgetting signals must be costly to be credible
✗ Not checking if low type wants to mimic
✗ Confusing pooling with separating equilibrium

**Excel Tab:** 2_Multi_State_Project
**Tier:** Tier 1/2 (conceptual + calculation)`,
    
    formulas: [
      'Separating: Cost_signal > Benefit_mimic (low type)',
      'Pooled value = p(High) × V_High + p(Low) × V_Low',
      'NPV_signal = V_true - V_pooled - Cost_signal'
    ],
    
    excelTab: '2_Multi_State_Project'
  },

  'A3-CAPM': {
    keywords: [
      'CAPM', 'beta', 'discount rate', 'cost of equity', 'cost of capital',
      'risk-free rate', 'market risk premium', 'systematic risk', 'levered beta',
      'unlevered beta', 'project discount rate', 'unlever', 'relever'
    ],
    quickGuide: `**ARCHETYPE 3: CAPM, BETA, AND DISCOUNT RATES**

**Core Question:** What discount rate should I use for this cash flow?

**Key Concepts:**
• CAPM: r_E = r_f + β × MRP
• Beta measures systematic risk
• Levered vs. Unlevered beta

**Typical Approach:**
1. **IDENTIFY**: "discount rate", "CAPM", "beta"
2. **EXTRACT**: rf, MRP, beta, D/E ratio
3. **MAP**: Match cash flow type to discount rate
4. **EXECUTE**: Unlever/relever beta if needed
5. **CHECK**: Levered beta > Unlevered beta

**Key Formulas:**
• r_E = r_f + β_E × MRP
• β_U = β_E / [1 + (1-τ)×(D/E)]
• β_E = β_U × [1 + (1-τ)×(D/E)]

**Excel Tab:** 3_CAPM_DiscountRates
**Tier:** Tier 1`,
    
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
      'dividend tax', 'capital gains tax', 'clientele effect', 'signaling',
      'information asymmetry', 'distribution', 'special dividend', 'retain earnings',
      'payout ratio', 'dividend yield', 'announce dividend', 'dividend increase'
    ],
    quickGuide: `**ARCHETYPE 4: PAYOUT POLICY (DIVIDENDS VS. BUYBACKS)**

**Core Question:** Should the firm pay dividends or repurchase shares? What does payout signal?

**Key Concepts:**
• M&M irrelevance (perfect markets): Payout policy doesn't matter
• Taxes: Dividends vs. capital gains tax treatment
• Signaling: Payout changes convey information about firm quality
• Clientele effects: Different investors prefer different policies

**Typical Approach:**
1. **IDENTIFY**: "dividend", "buyback", "payout", "signaling"
2. **EXTRACT**: Tax rates, cash amount, share price, signaling context
3. **MAP**: Tax comparison OR signaling equilibrium analysis
4. **EXECUTE**: Compare after-tax values OR check separation conditions
5. **CHECK**: With taxes, prefer lower tax method; signaling must be credible

**Key Formulas:**
• After-tax dividend = Div × (1 - τ_div)
• Shares repurchased = Cash / Price
• Signal credibility: Cost > Benefit of mimicking

**Excel Tab:** 4_Payout_Policy
**Tier:** Tier 2 (conceptual) or Tier 1 (with signaling)`,
    
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
      'flexibility', 'timing option', 'growth option', 'option value'
    ],
    quickGuide: `**ARCHETYPE 5: REAL OPTIONS**

**Core Question:** What is the value of managerial flexibility?

**Key Concepts:**
• Real options: Apply option pricing to real assets
• Option to expand, abandon, or wait
• NPV understates value when flexibility exists

**Key Formulas:**
• Total value = Base NPV + Option value
• Option to abandon: max(0, Salvage - PV(losses))

**Excel Tab:** 5_Real_Options
**Tier:** Tier 2`,
    
    formulas: [
      'Total value = Base NPV + Option value',
      'Call option analogy: max(0, S - K)'
    ],
    
    excelTab: '5_Real_Options'
  },

  'A6-Distress': {
    keywords: [
      'senior', 'junior', 'subordinated', 'waterfall', 'priority',
      'bankruptcy', 'liquidation', 'absolute priority rule', 'APR',
      'recovery rate', 'distress', 'restructuring', 'claims'
    ],
    quickGuide: `**ARCHETYPE 6: DISTRESS & PRIORITY**

**Core Question:** How are claims paid when firm value is insufficient?

**Key Concepts:**
• Absolute Priority Rule (APR): Senior before junior
• Waterfall: Sequential payment of claims
• Recovery rate: Fraction claimants receive in default

**Key Formulas:**
• Senior payment = min(Senior claim, Firm value)
• Junior payment = min(Junior claim, Remaining)
• Equity = max(0, V - Total debt)

**Excel Tab:** 4_Distress_Risk_Shift
**Tier:** Tier 1`,
    
    formulas: [
      'Senior payment = min(Senior claim, Firm value)',
      'Junior payment = min(Junior claim, Remaining)',
      'Equity = max(0, V - Total debt)'
    ],
    
    excelTab: '4_Distress_Risk_Shift'
  }
};

/**
 * Keyword weights for weighted detection scoring
 * Higher weight = stronger signal for that archetype
 */
const KEYWORD_WEIGHTS = {
  // Generic (weak) - weight 1
  'debt': 1,
  'equity': 1,
  'wacc': 1,
  'value': 1,
  
  // Moderate - weight 2
  'coupon': 2,
  'bond': 2,
  'tax shield': 2,
  'beta': 2,
  'states': 2,
  
  // Strong - weight 3
  'dividend': 3,
  'buyback': 3,
  'repurchase': 3,
  'payout': 3,
  'senior': 3,
  'junior': 3,
  'waterfall': 3,
  'real option': 3,
  'debt overhang': 3,
  
  // Very strong - weight 4
  'signaling': 4,
  'signal': 4,
  'asymmetric information': 4,
  'information asymmetry': 4,
  'high type': 4,
  'low type': 4,
  'pooling': 4,
  'separating': 4,
  'mimic': 4,
  'pecking order': 4,
  'Myers-Majluf': 4,
  'adverse selection': 4,
  'absolute priority': 4
};

/**
 * Question patterns for regex-based detection boost
 */
const QUESTION_PATTERNS = {
  'A4-Payout': [
    /what.*(dividend|payout)/i,
    /should.*(pay|distribute|announce)/i,
    /dividend.*signal/i,
    /signal.*dividend/i
  ],
  'A2B-AdverseSelection': [
    /signal/i,
    /type.*(reveal|separate|mimic)/i,
    /information.*asymmetr/i,
    /high.*type.*low.*type/i,
    /pooling.*separating/i
  ],
  'A5-RealOptions': [
    /option.*to.*(expand|abandon|wait)/i,
    /value.*flexibility/i,
    /real.*option/i
  ],
  'A6-Distress': [
    /waterfall/i,
    /priority.*claim/i,
    /senior.*junior/i,
    /absolute.*priority/i
  ],
  'A1-CapitalStructure': [
    /calculate.*wacc/i,
    /expected.*return.*debt/i,
    /tax.*shield/i
  ],
  'A3-CAPM': [
    /discount.*rate/i,
    /unlever.*beta/i,
    /cost.*of.*equity/i
  ]
};

/**
 * Detect archetype from problem text using WEIGHTED keyword matching
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
  
  // Calculate WEIGHTED keyword match scores
  for (const [archetype, data] of Object.entries(archetypeGuidance)) {
    let score = 0;
    const matchedKeywords = [];
    
    data.keywords.forEach(kw => {
      const lowerKw = kw.toLowerCase();
      if (text.includes(lowerKw)) {
        // Use explicit weight if defined, otherwise heuristic
        let weight = KEYWORD_WEIGHTS[lowerKw];
        if (weight === undefined) {
          weight = lowerKw.includes(' ') ? 3 : 2;
        }
        score += weight;
        matchedKeywords.push(kw);
      }
    });
    
    scores[archetype] = {
      score: score,
      count: matchedKeywords.length,
      keywords: matchedKeywords
    };
  }
  
  // BOOST: Apply question pattern matching (+10 points)
  for (const [archetype, patterns] of Object.entries(QUESTION_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(problemText))) {
      if (scores[archetype]) {
        scores[archetype].score += 10;
        scores[archetype].patternMatch = true;
      }
    }
  }
  
  // Sort by SCORE (not just count)
  const sorted = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
  const topMatch = sorted[0];
  
  if (topMatch[1].score === 0) {
    return {
      archetype: 'Unknown',
      confidence: 0,
      guidance: null,
      message: 'No archetype detected. Try including more specific keywords.'
    };
  }
  
  const detectedArchetype = topMatch[0];
  const confidence = Math.min(95, 20 + topMatch[1].score * 5);
  
  return {
    archetype: detectedArchetype,
    confidence: confidence,
    matchedKeywords: topMatch[1].keywords,
    weightedScore: topMatch[1].score,
    patternMatch: topMatch[1].patternMatch || false,
    guidance: archetypeGuidance[detectedArchetype],
    alternativeArchetypes: sorted.slice(1, 4)
      .filter(([_, data]) => data.score > 0)
      .map(([arch, data]) => ({
        archetype: arch,
        score: data.score,
        matchCount: data.count
      }))
  };
}

/**
 * Get all available archetypes
 */
export function getAllArchetypes() {
  return Object.keys(archetypeGuidance);
}

/**
 * Get guidance for a specific archetype
 */
export function getGuidanceForArchetype(archetypeId) {
  return archetypeGuidance[archetypeId] || null;
}

/**
 * Extract the question/required section from problem text
 */
export function extractQuestionSection(text) {
  const requiredMatch = text.match(/REQUIRED:?([\s\S]*?)(?:$|(?=\n\n[A-Z]))/i);
  if (requiredMatch) return requiredMatch[1];
  
  const questionMatch = text.match(/[^.]*\?[^.]*$/gm);
  if (questionMatch) return questionMatch.join(' ');
  
  return text.slice(-500);
}

export default {
  archetypeGuidance,
  detectArchetype,
  getAllArchetypes,
  getGuidanceForArchetype,
  extractQuestionSection
};
