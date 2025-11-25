/**
 * Deviation Alert Injection System
 *
 * Processes solution_steps arrays and injects deviation alerts inline.
 * Detects common pitfalls and exam traps by analyzing step reasoning and calculations.
 *
 * Option A Implementation: Inline injection into solution_steps
 */

/**
 * Deviation Database
 * Each deviation has:
 * - code: Unique identifier (DEV-X.Y.Z format)
 * - name: Short descriptive name
 * - archetype: Primary archetype where this appears
 * - patterns: Array of detection patterns (regex or keywords)
 * - warning: Alert message to display
 * - checkpoints: Array of verification steps
 * - time_impact_minutes: Estimated time cost if triggered
 * - severity: 'critical' | 'high' | 'medium' | 'low'
 */
const DEVIATION_DATABASE = [
  // ========================================
  // A1: CAPITAL STRUCTURE & TAX SHIELDS
  // ========================================
  {
    code: 'DEV-1.1.1',
    name: 'Hazard Rate Default - IRR Method',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /survival.*decrease|survival.*declin/i,
      /hazard.*rate/i,
      /\(1\s*-\s*h(?:azard)?\)\s*\^\s*t/i,
      /expected.*cash.*flow.*debt/i
    ],
    contextPatterns: [
      /expected return.*debt/i,
      /E\[r_D\]/i,
      /discount.*rate.*debt/i
    ],
    warning: '⚠️ DEV-1.1.1 applies here - use IRR of expected cash flows, not weighted average',
    explanation: 'With hazard rate default models, survival probability DECREASES each year. The correct approach is to calculate expected cash flows for each period (weighted by survival probability), then find the IRR of those cash flows. DO NOT take a weighted average of the no-default return and default return.',
    checkpoints: [
      'Survival DECREASES each year: S(t) = (1-h)^t',
      'Calculate expected CF for EACH period',
      'Use IRR/XIRR on the expected cash flow stream',
      'DO NOT use: p_survive × r_good + p_default × r_bad'
    ],
    time_impact_minutes: 3.5,
    severity: 'critical',
    tier: 1
  },

  {
    code: 'DEV-1.1.2',
    name: 'Binary Default - Weighted Average Method',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /one.*year.*bond/i,
      /single.*period.*default/i,
      /probability.*default.*maturity/i,
      /(?:10|20|30)%.*probability.*default/i
    ],
    antiPatterns: [
      /hazard/i,
      /survival.*year/i,
      /multi.*period/i
    ],
    warning: '✓ Binary default model - weighted average method is correct here',
    explanation: 'For single-period (usually 1-year) bonds with a fixed default probability at maturity, the correct approach is: E[r_D] = p_survive × r_good + p_default × r_bad. This is DIFFERENT from hazard rate models.',
    checkpoints: [
      'Default happens ONLY at maturity (single event)',
      'Calculate return in no-default state',
      'Calculate return in default state',
      'Weight by probabilities: p_good × r_good + p_bad × r_bad'
    ],
    time_impact_minutes: 0,
    severity: 'low',
    tier: 1
  },

  {
    code: 'DEV-1.2.1',
    name: 'Tax Shield Discount Rate',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /PV.*tax.*shield/i,
      /present.*value.*tax.*shield/i,
      /discount.*tax.*shield/i,
      /interest.*tax.*shield/i
    ],
    contextPatterns: [
      /τ\s*\*\s*(?:r_D|interest)/i,
      /tax.*rate.*\*.*interest/i
    ],
    warning: '⚠️ DEV-1.2.1 - Tax shields should be discounted at r_D (debt rate), NOT r_E or WACC',
    explanation: 'Tax shields exist only when interest is paid. Interest payments are contractually tied to debt, so tax shields have similar risk profile to debt cash flows. The appropriate discount rate is r_D (expected return on debt), not r_E or WACC.',
    checkpoints: [
      'Tax shields = τ × Interest',
      'Tax shields exist only if debt is paid (not in default)',
      'Risk profile matches debt, not equity',
      'Discount at r_D, the expected return on debt',
      'If debt is risky, adjust r_D for default probability'
    ],
    time_impact_minutes: 2.5,
    severity: 'high',
    tier: 1
  },

  {
    code: 'DEV-1.2.2',
    name: 'Tax Shields Lost in Default',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /tax.*shield.*default/i,
      /default.*lose.*tax.*shield/i,
      /tax.*shield.*bankruptcy/i
    ],
    warning: '⚠️ DEV-1.2.2 - In default, firm loses future tax shields (no interest paid)',
    explanation: 'When a firm defaults, it stops paying interest, which means it loses all future interest tax shields. This must be incorporated into the valuation of tax shields, especially in hazard rate models.',
    checkpoints: [
      'Identify default probability/hazard rate',
      'Tax shields exist only in survival path',
      'Expected tax shield = τ × Interest × P(survive)',
      'As default probability increases, PV(tax shields) decreases'
    ],
    time_impact_minutes: 2.0,
    severity: 'high',
    tier: 1
  },

  {
    code: 'DEV-1.3.1',
    name: 'Promised Yield vs Expected Return',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /promised.*yield/i,
      /YTM.*yield.*maturity/i,
      /expected.*return.*debt/i
    ],
    warning: '⚠️ DEV-1.3.1 - Promised yield ≠ Expected return. Promised ignores default, Expected incorporates it',
    explanation: 'Promised yield (YTM) assumes all promised cash flows are received (no default). Expected return on debt accounts for default probability and recovery. For risky debt: E[r_D] < Promised Yield.',
    checkpoints: [
      'Promised Yield = (Promised Payoff / Price) - 1',
      'Expected Return = E[Payoff] / Price - 1',
      'E[Payoff] = p_survive × Full_Payoff + p_default × Recovery',
      'For risky debt: E[r_D] < Promised YTM'
    ],
    time_impact_minutes: 2.0,
    severity: 'high',
    tier: 1
  },

  {
    code: 'DEV-1.4.1',
    name: 'Amortizing Debt Principal Schedule',
    archetype: 'A1-CapitalStructure',
    patterns: [
      /amortizing.*debt/i,
      /principal.*declin/i,
      /constant.*payment/i,
      /PMT.*function/i
    ],
    warning: '⚠️ DEV-1.4.1 - Amortizing debt has DECLINING principal. Interest = r × Principal(t)',
    explanation: 'Amortizing debt has equal total payments (principal + interest), but principal increases and interest decreases over time. You MUST track the principal balance each period to calculate correct interest and tax shields.',
    checkpoints: [
      'Total Payment = PMT (constant each period)',
      'Interest(t) = r × Principal_Beginning(t)',
      'Principal_Payment(t) = PMT - Interest(t)',
      'Principal_Ending(t) = Principal_Beginning(t) - Principal_Payment(t)',
      'Tax Shield(t) = τ × Interest(t) [decreases over time]'
    ],
    time_impact_minutes: 3.0,
    severity: 'high',
    tier: 1
  },

  // ========================================
  // A2A: MULTI-STATE & DEBT OVERHANG
  // ========================================
  {
    code: 'DEV-2.1.1',
    name: 'Equity Limited Liability',
    archetype: 'A2-MultiState',
    patterns: [
      /equity.*value.*state/i,
      /good.*state.*bad.*state/i,
      /firm.*value.*debt/i,
      /V.*-.*D/i
    ],
    warning: '⚠️ DEV-2.1.1 - Equity value = max(0, V - D) in each state. NEVER negative!',
    explanation: 'Equity holders have limited liability. In states where firm value is less than debt, equity = 0 (debtholders take the loss). Always use max(0, V - D) when calculating equity value.',
    checkpoints: [
      'In each state: Equity = max(0, FirmValue - Debt)',
      'If FirmValue < Debt → Equity = 0 (not negative)',
      'Debt gets min(FirmValue, Debt) in each state',
      'E[Equity] = Σ p(state) × max(0, V_state - D)'
    ],
    time_impact_minutes: 2.0,
    severity: 'critical',
    tier: 1
  },

  {
    code: 'DEV-2.2.1',
    name: 'Debt Overhang Detection',
    archetype: 'A2-MultiState',
    patterns: [
      /debt.*overhang/i,
      /underinvestment/i,
      /new.*project.*equity/i,
      /NPV.*project.*equity/i
    ],
    warning: '⚠️ DEV-2.2.1 - Check if equity holders benefit. NPV_firm > 0 does NOT mean equity will invest!',
    explanation: 'Debt overhang occurs when equity holders reject +NPV projects because most benefits go to debtholders. Must compare: Investment Cost vs Change in Equity Value.',
    checkpoints: [
      'Calculate Equity WITHOUT project in each state',
      'Calculate Equity WITH project in each state',
      'ΔEquity = E[Equity_with] - E[Equity_without]',
      'Equity invests only if: ΔEquity ≥ Investment',
      'Overhang exists if: NPV_firm > 0 but ΔEquity < Investment'
    ],
    time_impact_minutes: 4.0,
    severity: 'critical',
    tier: 1
  },

  {
    code: 'DEV-2.2.2',
    name: 'Wealth Transfer from Equity to Debt',
    archetype: 'A2-MultiState',
    patterns: [
      /wealth.*transfer/i,
      /benefit.*debt(?:holder)?/i,
      /risk.*shift/i,
      /asset.*substitution/i
    ],
    warning: '⚠️ DEV-2.2.2 - Track wealth transfer. Project may benefit debt but harm equity.',
    explanation: 'With risky debt outstanding, new projects can transfer value from equity to debt (or vice versa). Always calculate changes in BOTH equity and debt value.',
    checkpoints: [
      'ΔDebt = E[Debt_with_project] - E[Debt_without_project]',
      'ΔEquity = E[Equity_with_project] - E[Equity_without_project]',
      'ΔFirm = ΔEquity + ΔDebt',
      'If ΔDebt > ΔFirm → wealth transfer TO debtholders',
      'Equity may reject even if NPV > 0'
    ],
    time_impact_minutes: 3.5,
    severity: 'high',
    tier: 1
  },

  // ========================================
  // A2B: ADVERSE SELECTION & SIGNALING
  // ========================================
  {
    code: 'DEV-2B.1.1',
    name: 'Separating Equilibrium Incentive Compatibility',
    archetype: 'A2B-AdverseSelection',
    patterns: [
      /separating.*equilibrium/i,
      /incentive.*compat/i,
      /high.*type.*mimic/i,
      /low.*type.*deviate/i
    ],
    warning: '⚠️ DEV-2B.1.1 - Check BOTH IC constraints: Low type must prefer their action, High type must not mimic',
    explanation: 'Separating equilibria require two incentive compatibility constraints: (1) Low type prefers low-type action to high-type action, (2) High type prefers high-type action to low-type action.',
    checkpoints: [
      'IC for Low type: U_L(a_L) ≥ U_L(a_H)',
      'IC for High type: U_H(a_H) ≥ U_H(a_L)',
      'If either is violated, equilibrium breaks down',
      'Usually: Low type IC binds (high type has slack)'
    ],
    time_impact_minutes: 3.0,
    severity: 'high',
    tier: 2
  },

  {
    code: 'DEV-2B.2.1',
    name: 'Pooling Equilibrium Out-of-Equilibrium Beliefs',
    archetype: 'A2B-AdverseSelection',
    patterns: [
      /pooling.*equilibrium/i,
      /out.*of.*equilibrium.*belief/i,
      /deviat(?:e|ion).*belief/i
    ],
    warning: '⚠️ DEV-2B.2.1 - Pooling requires specifying beliefs after deviation. Use pessimistic beliefs.',
    explanation: 'In pooling equilibria, if someone deviates, the market must form beliefs about their type. Standard refinement: assume pessimistic beliefs (deviator is low type) to prevent unraveling.',
    checkpoints: [
      'On-equilibrium: Both types choose same action',
      'Market belief = prior (weighted average)',
      'Off-equilibrium: If someone deviates, what does market believe?',
      'Pessimistic refinement: Deviator is low type',
      'Check if high type wants to deviate given these beliefs'
    ],
    time_impact_minutes: 4.0,
    severity: 'high',
    tier: 2
  },

  // ========================================
  // A3: CAPM & DISCOUNT RATES
  // ========================================
  {
    code: 'DEV-3.1.1',
    name: 'Levered vs Unlevered Beta',
    archetype: 'A3-CAPM',
    patterns: [
      /unlever.*beta/i,
      /relever.*beta/i,
      /β_U.*β_L/i,
      /asset.*beta.*equity.*beta/i
    ],
    warning: '⚠️ DEV-3.1.1 - Unlevering: β_U = β_E × E/(E+D). Relevering: β_E = β_U × (E+D)/E',
    explanation: 'When a firm has debt, equity beta (β_E) is levered. To get asset/unlevered beta (β_U), must unlever. To apply to different capital structure, must relever. Formulas assume no debt beta for simplicity.',
    checkpoints: [
      'β_U (asset beta) = β_E × [E / (E + D)] if β_D ≈ 0',
      'Full formula: β_U = β_E × [E/(E+D)] + β_D × [D/(E+D)]',
      'Relevering: β_E_new = β_U × [(E+D)/E]_new',
      'Use market values for E and D, not book values',
      'Project beta = β_U of comparable firms (unlevered)'
    ],
    time_impact_minutes: 2.5,
    severity: 'high',
    tier: 1
  },

  {
    code: 'DEV-3.2.1',
    name: 'WACC Circular Reference',
    archetype: 'A3-CAPM',
    patterns: [
      /WACC.*circular/i,
      /iterative.*WACC/i,
      /bootstrap.*WACC/i,
      /V.*depends.*WACC/i
    ],
    warning: '⚠️ DEV-3.2.1 - WACC depends on V, but V depends on WACC. Use iteration or APV instead.',
    explanation: 'WACC = (E/V)×r_E + (D/V)×r_D×(1-τ) requires E and D, which require V, but V = PV(FCF, WACC). This is circular. Solution: iterate to convergence or use APV method.',
    checkpoints: [
      'Recognize circular dependency',
      'Option 1: Start with guess for V, calculate WACC, recalculate V, iterate',
      'Option 2: Use APV = V_U + PV(TS) - PV(Distress)',
      'Option 3: If D is fixed, can solve directly',
      'Check convergence if iterating'
    ],
    time_impact_minutes: 3.5,
    severity: 'medium',
    tier: 1
  },

  {
    code: 'DEV-3.3.1',
    name: 'Project vs Firm Discount Rate',
    archetype: 'A3-CAPM',
    patterns: [
      /project.*discount.*rate/i,
      /different.*risk.*firm/i,
      /comparable.*firm.*beta/i,
      /divisional.*cost.*capital/i
    ],
    warning: '⚠️ DEV-3.3.1 - Project discount rate should match PROJECT risk, not firm\'s overall beta',
    explanation: 'If a project has different systematic risk than the firm, must use project-specific discount rate. Find comparable firms in the project\'s industry, unlever their betas, and relever to firm\'s capital structure.',
    checkpoints: [
      'Identify comparable firms in project\'s industry',
      'Unlever comparable betas: β_U = β_E × [E/(E+D)]',
      'Average unlevered betas across comparables',
      'Relever to OUR firm\'s capital structure',
      'Use project-specific CAPM: r_project = r_f + β_project × MRP'
    ],
    time_impact_minutes: 4.0,
    severity: 'high',
    tier: 1
  },

  // ========================================
  // A4: DISTRESS & PRIORITY
  // ========================================
  {
    code: 'DEV-4.1.1',
    name: 'Absolute Priority Rule Waterfall',
    archetype: 'A6-Distress',
    patterns: [
      /waterfall/i,
      /priority.*claim/i,
      /senior.*junior/i,
      /absolute.*priority/i,
      /liquidation.*proceed/i
    ],
    warning: '⚠️ DEV-4.1.1 - Waterfall MUST respect absolute priority: Senior → Junior → Equity',
    explanation: 'In liquidation, claims are paid in strict order: Senior debt gets paid first (up to full amount), then junior debt gets remainder (up to full amount), then equity gets any residual. Lower priority gets NOTHING until higher priority is fully paid.',
    checkpoints: [
      'Senior Debt = min(Liquidation_Value, Senior_Face)',
      'Remaining = Liquidation_Value - Senior_Debt',
      'Junior Debt = min(Remaining, Junior_Face)',
      'Remaining = Remaining - Junior_Debt',
      'Equity = max(0, Remaining)'
    ],
    time_impact_minutes: 2.5,
    severity: 'critical',
    tier: 1
  },

  {
    code: 'DEV-4.2.1',
    name: 'Recovery Rate vs Recovery Amount',
    archetype: 'A6-Distress',
    patterns: [
      /recovery.*rate/i,
      /recovery.*\d+%/i,
      /default.*recover/i
    ],
    warning: '⚠️ DEV-4.2.1 - Recovery rate × Face Value = Recovery amount. Apply to correct base.',
    explanation: 'Recovery rate is typically given as percentage of face value (not market value). Recovery Amount = Recovery_Rate × Face_Value. This is what creditors receive in default.',
    checkpoints: [
      'Recovery Rate = % of face value recovered',
      'Recovery Amount = Recovery_Rate × Face_Value',
      'NOT: Recovery_Rate × Market_Price',
      'Return in default = (Recovery_Amount / Price) - 1'
    ],
    time_impact_minutes: 1.5,
    severity: 'medium',
    tier: 1
  },

  // ========================================
  // A5: PAYOUT POLICY
  // ========================================
  {
    code: 'DEV-5.1.1',
    name: 'Dividend vs Repurchase Equivalence',
    archetype: 'A4-Payout',
    patterns: [
      /dividend.*repurchase/i,
      /buyback.*dividend/i,
      /payout.*method/i,
      /tax.*arbitrage/i
    ],
    warning: '⚠️ DEV-5.1.1 - Without taxes/signaling, dividends = repurchases (M&M). Check for tax differences.',
    explanation: 'In perfect markets, dividends and repurchases are equivalent (M&M payout irrelevance). Differences arise from: (1) Taxes (capital gains vs ordinary income), (2) Signaling (dividends may signal more), (3) Clientele effects.',
    checkpoints: [
      'Perfect markets: Shareholders indifferent',
      'Dividend: All shareholders get cash proportionally',
      'Repurchase: Shareholders can choose to sell or not',
      'Tax difference: τ_dividend vs τ_capital_gains',
      'Signaling: Market may interpret differently'
    ],
    time_impact_minutes: 2.0,
    severity: 'medium',
    tier: 2
  },

  // ========================================
  // A10: OPTIONS
  // ========================================
  {
    code: 'DEV-10.1.1',
    name: 'Put-Call Parity',
    archetype: 'A10-Options',
    patterns: [
      /put.*call.*parity/i,
      /C.*-.*P.*=.*S.*-.*K/i,
      /synthetic.*position/i
    ],
    warning: '⚠️ DEV-10.1.1 - Put-Call Parity: C - P = S - PV(K). All variables must be for same strike and expiration.',
    explanation: 'Put-call parity links call price, put price, stock price, and strike: C - P = S - PV(K). Critical: Call and put must have SAME strike (K) and SAME expiration (T).',
    checkpoints: [
      'C - P = S - PV(K) or C - P = S - K×e^(-r×T)',
      'Same strike K for both call and put',
      'Same expiration T for both options',
      'S = current stock price',
      'PV(K) = K / (1+r)^T or K×e^(-r×T)'
    ],
    time_impact_minutes: 2.0,
    severity: 'high',
    tier: 1
  },

  {
    code: 'DEV-10.2.1',
    name: 'Black-Scholes Assumptions',
    archetype: 'A10-Options',
    patterns: [
      /Black.*Scholes/i,
      /option.*pric(?:e|ing).*formula/i,
      /N\(d1\).*N\(d2\)/i
    ],
    warning: '⚠️ DEV-10.2.1 - Black-Scholes assumes: no dividends, European exercise, constant σ and r.',
    explanation: 'Black-Scholes has strict assumptions. For dividends, adjust S to S×e^(-q×T). For American options, B-S is a lower bound (actual value may be higher due to early exercise).',
    checkpoints: [
      'Stock pays NO dividends (or adjust with dividend yield)',
      'European option (cannot exercise early)',
      'Constant volatility σ over option life',
      'Constant risk-free rate r',
      'Lognormal stock price distribution'
    ],
    time_impact_minutes: 1.5,
    severity: 'medium',
    tier: 1
  }
];

/**
 * Main function: Inject deviation alerts into problem solution steps
 *
 * @param {Object} problem - Problem object with solution_steps array
 * @returns {Object} - Problem with deviation_alert fields added to relevant steps
 */
export function injectDeviationAlerts(problem) {
  if (!problem || !problem.solution_steps || !Array.isArray(problem.solution_steps)) {
    console.warn('Invalid problem object or missing solution_steps');
    return problem;
  }

  const archetype = problem.archetype || 'Unknown';
  const enrichedSteps = problem.solution_steps.map(step => {
    const detectedDeviations = detectDeviations(step, archetype, problem);

    if (detectedDeviations.length > 0) {
      // If multiple deviations detected, use the highest severity
      const primaryDeviation = detectedDeviations.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })[0];

      return {
        ...step,
        deviation_alert: {
          code: primaryDeviation.code,
          name: primaryDeviation.name,
          warning: primaryDeviation.warning,
          explanation: primaryDeviation.explanation,
          checkpoints: primaryDeviation.checkpoints,
          time_impact_minutes: primaryDeviation.time_impact_minutes,
          severity: primaryDeviation.severity
        },
        // Store all detected deviations for advanced UI
        all_deviations: detectedDeviations.map(d => d.code)
      };
    }

    return step;
  });

  return {
    ...problem,
    solution_steps: enrichedSteps,
    deviation_summary: generateDeviationSummary(enrichedSteps)
  };
}

/**
 * Detect which deviations apply to a given step
 *
 * @param {Object} step - Solution step object
 * @param {string} archetype - Problem archetype
 * @param {Object} problem - Full problem context
 * @returns {Array} - Array of applicable deviation objects
 */
function detectDeviations(step, archetype, problem) {
  const detectedDeviations = [];
  const stepText = combineStepText(step);

  for (const deviation of DEVIATION_DATABASE) {
    // Skip if archetype doesn't match (unless deviation is universal)
    if (deviation.archetype !== archetype && !deviation.archetype.includes('Universal')) {
      continue;
    }

    // Check if patterns match
    const patternMatch = checkPatternMatch(stepText, deviation.patterns);
    const contextMatch = !deviation.contextPatterns ||
                        checkPatternMatch(stepText, deviation.contextPatterns);
    const antiPatternMatch = deviation.antiPatterns &&
                            checkPatternMatch(stepText, deviation.antiPatterns);

    // Deviation applies if:
    // 1. Main patterns match
    // 2. Context patterns match (if specified)
    // 3. Anti-patterns DON'T match (if specified)
    if (patternMatch && contextMatch && !antiPatternMatch) {
      detectedDeviations.push(deviation);
    }
  }

  return detectedDeviations;
}

/**
 * Combine step text fields for pattern matching
 */
function combineStepText(step) {
  const parts = [
    step.part || '',
    step.prompt || '',
    step.reasoning || '',
    step.calculation || '',
    step.sanity_check || ''
  ];
  return parts.join(' ');
}

/**
 * Check if any pattern in array matches text
 */
function checkPatternMatch(text, patterns) {
  if (!patterns || patterns.length === 0) return false;

  return patterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(text);
    } else if (typeof pattern === 'string') {
      return text.toLowerCase().includes(pattern.toLowerCase());
    }
    return false;
  });
}

/**
 * Generate summary of all deviations in problem
 */
function generateDeviationSummary(steps) {
  const deviationCodes = new Set();
  let totalTimeImpact = 0;
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

  steps.forEach(step => {
    if (step.deviation_alert) {
      deviationCodes.add(step.deviation_alert.code);
      totalTimeImpact += step.deviation_alert.time_impact_minutes;
      severityCounts[step.deviation_alert.severity]++;
    }
  });

  return {
    total_deviations: deviationCodes.size,
    deviation_codes: Array.from(deviationCodes),
    total_time_impact_minutes: Math.round(totalTimeImpact * 10) / 10,
    severity_distribution: severityCounts
  };
}

/**
 * Get all deviations for a specific archetype
 * Useful for pre-flight checklist generation
 */
export function getDeviationsForArchetype(archetypeId) {
  return DEVIATION_DATABASE.filter(dev => dev.archetype === archetypeId);
}

/**
 * Search for deviation by code
 */
export function getDeviationByCode(code) {
  return DEVIATION_DATABASE.find(dev => dev.code === code);
}

/**
 * Get all critical deviations across all archetypes
 */
export function getCriticalDeviations() {
  return DEVIATION_DATABASE.filter(dev => dev.severity === 'critical');
}

/**
 * Batch process multiple problems
 */
export function batchInjectDeviations(problems) {
  if (!Array.isArray(problems)) {
    console.warn('Expected array of problems');
    return problems;
  }

  return problems.map(problem => injectDeviationAlerts(problem));
}

/**
 * Validate deviation database integrity
 * Useful for testing
 */
export function validateDeviationDatabase() {
  const errors = [];
  const codes = new Set();

  DEVIATION_DATABASE.forEach((dev, index) => {
    // Check required fields
    if (!dev.code) errors.push(`Deviation ${index}: missing code`);
    if (!dev.name) errors.push(`Deviation ${dev.code}: missing name`);
    if (!dev.warning) errors.push(`Deviation ${dev.code}: missing warning`);
    if (!dev.patterns || dev.patterns.length === 0) {
      errors.push(`Deviation ${dev.code}: missing patterns`);
    }

    // Check for duplicate codes
    if (codes.has(dev.code)) {
      errors.push(`Duplicate deviation code: ${dev.code}`);
    }
    codes.add(dev.code);

    // Check severity values
    if (!['critical', 'high', 'medium', 'low'].includes(dev.severity)) {
      errors.push(`Deviation ${dev.code}: invalid severity ${dev.severity}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    total_deviations: DEVIATION_DATABASE.length,
    unique_codes: codes.size
  };
}

// Export database for external access
export { DEVIATION_DATABASE };

export default {
  injectDeviationAlerts,
  getDeviationsForArchetype,
  getDeviationByCode,
  getCriticalDeviations,
  batchInjectDeviations,
  validateDeviationDatabase,
  DEVIATION_DATABASE
};
