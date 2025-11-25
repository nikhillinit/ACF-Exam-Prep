/**
 * Deviation Scanner Utility
 *
 * Scans problem text and solution steps to identify deviations from standard approaches.
 * Deviations are nuanced variations that require modified solution pathways.
 *
 * Pattern: Follows archetypeScanner.js structure
 * - Import deviation registry
 * - Keyword matching (1 point each)
 * - Pattern matching with regex (3 points each)
 * - Confidence scoring: HIGH (5+), MEDIUM (3-4), LOW (2)
 */

// Import deviation registry (will be created by another agent)
// Expected schema:
// {
//   "deviations": [
//     {
//       "code": "D1-StateContingent",
//       "name": "State-Contingent Debt",
//       "description": "...",
//       "detectionTriggers": ["state-contingent", "good state", "bad state"],
//       "detectionPatterns": ["/state.*contingent/i", "/good.*state.*bad.*state/i"],
//       "checkpoints": [...],
//       "guidance": {...}
//     }
//   ]
// }
let deviationRegistry = null;

/**
 * Lazy-load deviation registry
 * Handles both runtime import and test scenarios
 */
const getDeviationRegistry = () => {
  if (!deviationRegistry) {
    try {
      deviationRegistry = require('../data/deviation-registry.json');
    } catch (error) {
      console.warn('deviation-registry.json not found, using empty registry');
      deviationRegistry = { deviations: [] };
    }
  }
  return deviationRegistry;
};

/**
 * Detection patterns for common deviations
 * These complement the registry-based detection
 * Each pattern awards 3 points on match
 */
const DEVIATION_PATTERNS = {
  // D1: State-Contingent Debt
  'D1-StateContingent': [
    /state.*contingent/i,
    /good.*state.*bad.*state/i,
    /high.*state.*low.*state/i,
    /probability.*state/i,
    /state.*dependent/i,
    /contingent.*payment/i,
    /payment.*varies.*state/i
  ],

  // D2: Existing Debt with New Projects
  'D2-ExistingDebt': [
    /existing.*debt/i,
    /outstanding.*debt/i,
    /legacy.*debt/i,
    /prior.*debt/i,
    /already.*has.*debt/i,
    /current.*debt.*new.*project/i,
    /debt.*overhang/i
  ],

  // D3: Multi-Period Reinvestment
  'D3-MultiPeriod': [
    /multi.*period/i,
    /multiple.*periods?/i,
    /reinvest/i,
    /year.*\d+.*year.*\d+/i,
    /sequential.*decision/i,
    /period.*by.*period/i,
    /dynamic.*decision/i
  ],

  // D4: Protective Put (vs Standard Options)
  'D4-ProtectivePut': [
    /protective.*put/i,
    /put.*protection/i,
    /downside.*protection/i,
    /hedge.*downside/i,
    /insure.*against/i,
    /floor.*value/i
  ],

  // D5: Signaling with Costs
  'D5-SignalingCosts': [
    /signaling.*cost/i,
    /costly.*signal/i,
    /cost.*of.*signal/i,
    /mimic.*cost/i,
    /incentive.*compatible/i,
    /separating.*equilibrium.*cost/i
  ],

  // D6: Tax Shield with Default Risk
  'D6-TaxShieldDefault': [
    /tax.*shield.*default/i,
    /tax.*benefit.*bankruptcy/i,
    /expected.*tax.*shield/i,
    /tax.*shield.*probability/i,
    /default.*reduces.*tax/i
  ],

  // D7: WACC in Distress
  'D7-WACCDistress': [
    /WACC.*distress/i,
    /WACC.*bankruptcy/i,
    /cost.*capital.*default/i,
    /discount.*rate.*default.*risk/i,
    /distress.*costs.*WACC/i
  ],

  // D8: Amortizing Debt
  'D8-AmortizingDebt': [
    /amortizing/i,
    /amortization/i,
    /principal.*payment/i,
    /declining.*principal/i,
    /pay.*down.*principal/i,
    /scheduled.*repayment/i
  ],

  // D9: Payout with Constraints
  'D9-PayoutConstraints': [
    /dividend.*constraint/i,
    /payout.*restriction/i,
    /legal.*constraint.*dividend/i,
    /covenant.*dividend/i,
    /maximum.*payout/i,
    /cannot.*pay.*more.*than/i
  ],

  // D10: Real Options with Learning
  'D10-OptionsLearning': [
    /option.*learn/i,
    /learning.*option/i,
    /information.*reveals/i,
    /uncertainty.*resolves/i,
    /wait.*for.*information/i,
    /pilot.*project/i
  ]
};

/**
 * Keyword weights for deviation detection
 * Higher weight = stronger deviation signal
 */
const KEYWORD_WEIGHTS = {
  // Weight 1 - Generic indicators
  'state': 1,
  'existing': 1,
  'multiple': 1,

  // Weight 2 - Moderate signals
  'contingent': 2,
  'reinvest': 2,
  'amortizing': 2,
  'protective': 2,

  // Weight 3 - Strong signals
  'state-contingent': 3,
  'existing debt': 3,
  'debt overhang': 3,
  'protective put': 3,
  'signaling cost': 3,

  // Weight 4 - Very strong signals
  'state contingent debt': 4,
  'multi-period reinvestment': 4,
  'costly signaling': 4,
  'amortizing debt schedule': 4
};

/**
 * Scans problem text for deviations
 * Returns identified deviations with confidence scores
 *
 * Scoring:
 * - Keyword match: +1 point (or custom weight)
 * - Pattern match: +3 points each
 * - Strong signal combo: +5 points
 *
 * Confidence:
 * - HIGH: 5+ points
 * - MEDIUM: 3-4 points
 * - LOW: 2 points
 *
 * @param {string} problemText - The exam problem text to scan
 * @returns {object} Scan results with deviations, scores, and confidence
 */
export const scanForDeviations = (problemText) => {
  const registry = getDeviationRegistry();
  const text = problemText.toLowerCase();
  const matchedTriggers = [];
  const deviationScores = {};
  const patternMatches = {};

  // Phase 1: Keyword-based detection (1 point per keyword, or custom weight)
  registry.deviations.forEach(deviation => {
    const triggers = deviation.detectionTriggers || [];

    triggers.forEach(trigger => {
      const lowerTrigger = trigger.toLowerCase();
      if (text.includes(lowerTrigger)) {
        matchedTriggers.push({
          deviation: deviation.code,
          trigger: trigger
        });

        // Apply keyword weight
        const weight = KEYWORD_WEIGHTS[lowerTrigger] || 1;
        deviationScores[deviation.code] = (deviationScores[deviation.code] || 0) + weight;
      }
    });
  });

  // Phase 2: Pattern-based detection (3 points per pattern match)
  Object.entries(DEVIATION_PATTERNS).forEach(([deviationCode, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(problemText)) {
        // Track which patterns matched for debugging
        if (!patternMatches[deviationCode]) {
          patternMatches[deviationCode] = [];
        }
        patternMatches[deviationCode].push(pattern.toString());

        // Add 3 points for pattern match
        deviationScores[deviationCode] = (deviationScores[deviationCode] || 0) + 3;
      }
    });
  });

  // Phase 3: Registry pattern matching (also 3 points each)
  registry.deviations.forEach(deviation => {
    if (deviation.detectionPatterns) {
      deviation.detectionPatterns.forEach(patternStr => {
        try {
          // Convert string pattern to regex (e.g., "/pattern/i" -> regex)
          const match = patternStr.match(/^\/(.+)\/([gimuy]*)$/);
          if (match) {
            const pattern = new RegExp(match[1], match[2]);
            if (pattern.test(problemText)) {
              if (!patternMatches[deviation.code]) {
                patternMatches[deviation.code] = [];
              }
              patternMatches[deviation.code].push(patternStr);
              deviationScores[deviation.code] = (deviationScores[deviation.code] || 0) + 3;
            }
          }
        } catch (error) {
          console.warn(`Invalid pattern in registry: ${patternStr}`, error);
        }
      });
    }
  });

  // Phase 4: Strong signal combinations (+5 points)
  // These are deviation-specific multi-keyword indicators
  const strongSignals = [
    {
      keywords: ['state', 'contingent', 'payment'],
      deviation: 'D1-StateContingent',
      confidence: 0.95
    },
    {
      keywords: ['existing', 'debt', 'new project'],
      deviation: 'D2-ExistingDebt',
      confidence: 0.90
    },
    {
      keywords: ['protective', 'put', 'downside'],
      deviation: 'D4-ProtectivePut',
      confidence: 0.95
    },
    {
      keywords: ['amortizing', 'principal', 'payment'],
      deviation: 'D8-AmortizingDebt',
      confidence: 0.90
    }
  ];

  strongSignals.forEach(signal => {
    const allPresent = signal.keywords.every(kw => text.includes(kw.toLowerCase()));
    if (allPresent) {
      deviationScores[signal.deviation] = (deviationScores[signal.deviation] || 0) + 5;
    }
  });

  // Phase 5: Sort and filter deviations by score
  const scoredDeviations = Object.entries(deviationScores)
    .sort((a, b) => b[1] - a[1]) // Sort by score descending
    .filter(([_, score]) => score >= 2) // Minimum threshold: 2 points
    .map(([code, score]) => {
      const deviation = registry.deviations.find(d => d.code === code);
      const confidence = score >= 5 ? 'HIGH' : (score >= 3 ? 'MEDIUM' : 'LOW');

      return {
        code,
        name: deviation?.name || code,
        score,
        confidence,
        patterns: patternMatches[code] || [],
        deviation: deviation || null
      };
    });

  // Phase 6: Build response object
  const topScore = scoredDeviations.length > 0 ? scoredDeviations[0].score : 0;
  const overallConfidence = topScore >= 5 ? 'HIGH' : (topScore >= 3 ? 'MEDIUM' : 'LOW');

  return {
    deviations: scoredDeviations,
    deviationScores,
    matchedTriggers: [...new Set(matchedTriggers.map(m => m.trigger))],
    patternMatches,
    topScore,
    confidence: overallConfidence,
    hasDeviations: scoredDeviations.length > 0,
    metadata: {
      scannedAt: new Date().toISOString(),
      problemLength: problemText.length,
      triggersFound: matchedTriggers.length,
      patternsMatched: Object.keys(patternMatches).length
    }
  };
};

/**
 * Detects which deviation applies at a specific solution step
 *
 * This is used during guided problem solving to identify when
 * a deviation-specific approach is needed at a particular step.
 *
 * @param {string} stepText - The text of the current solution step
 * @param {number} stepNumber - The step number (1-based)
 * @param {string} problemText - The full problem text for context
 * @returns {object} Detected deviation for this step, or null
 */
export const detectDeviationAtStep = (stepText, stepNumber, problemText) => {
  // First, scan the step text for deviations
  const stepScan = scanForDeviations(stepText);

  // Also consider full problem context
  const problemScan = scanForDeviations(problemText);

  // Combine results - step-specific takes priority
  let detectedDeviation = null;

  if (stepScan.hasDeviations && stepScan.confidence !== 'LOW') {
    // Strong deviation signal in step text
    detectedDeviation = stepScan.deviations[0];
  } else if (problemScan.hasDeviations && problemScan.confidence === 'HIGH') {
    // High confidence deviation in problem, might apply to this step
    // Check if step keywords align with deviation
    const topDeviation = problemScan.deviations[0];
    const registry = getDeviationRegistry();
    const deviationCard = registry.deviations.find(d => d.code === topDeviation.code);

    if (deviationCard && deviationCard.applicableSteps) {
      // Check if this step number is in applicable steps
      if (deviationCard.applicableSteps.includes(stepNumber)) {
        detectedDeviation = topDeviation;
      }
    } else {
      // No step restrictions, apply to all steps
      detectedDeviation = topDeviation;
    }
  }

  return {
    stepNumber,
    deviation: detectedDeviation,
    stepConfidence: stepScan.confidence,
    problemConfidence: problemScan.confidence,
    recommendation: detectedDeviation
      ? `Apply ${detectedDeviation.name} approach at this step`
      : 'Use standard approach',
    checkpointIndex: detectedDeviation
      ? findRelevantCheckpoint(detectedDeviation.code, stepNumber)
      : null
  };
};

/**
 * Finds the relevant checkpoint for a given deviation and step
 * @private
 */
const findRelevantCheckpoint = (deviationCode, stepNumber) => {
  const registry = getDeviationRegistry();
  const deviation = registry.deviations.find(d => d.code === deviationCode);

  if (!deviation || !deviation.checkpoints) {
    return null;
  }

  // Find checkpoint that matches this step number
  // Checkpoints might have a 'step' field indicating which step they apply to
  for (let i = 0; i < deviation.checkpoints.length; i++) {
    const checkpoint = deviation.checkpoints[i];
    if (checkpoint.step === stepNumber || checkpoint.stepRange?.includes(stepNumber)) {
      return i;
    }
  }

  // Default: return checkpoint index based on step progression
  const checkpointIndex = Math.min(
    Math.floor((stepNumber - 1) / 2),
    deviation.checkpoints.length - 1
  );

  return checkpointIndex;
};

/**
 * Retrieves complete deviation guidance card
 *
 * Returns the full deviation record including:
 * - Description and context
 * - Detection criteria
 * - Solution checkpoints
 * - Key differences from standard approach
 * - Common pitfalls
 *
 * @param {string} devCode - Deviation code (e.g., 'D1-StateContingent')
 * @returns {object|null} Full deviation card or null if not found
 */
export const getDeviationGuidance = (devCode) => {
  const registry = getDeviationRegistry();
  const deviation = registry.deviations.find(d => d.code === devCode);

  if (!deviation) {
    console.warn(`Deviation not found: ${devCode}`);
    return null;
  }

  // Return complete deviation card with all guidance
  return {
    code: deviation.code,
    name: deviation.name,
    description: deviation.description,
    context: deviation.context || 'No context provided',

    // Detection information
    detection: {
      triggers: deviation.detectionTriggers || [],
      patterns: deviation.detectionPatterns || [],
      examples: deviation.examplePhrases || []
    },

    // Solution guidance
    solution: {
      checkpoints: deviation.checkpoints || [],
      keyDifferences: deviation.keyDifferences || [],
      modifiedSteps: deviation.modifiedSteps || []
    },

    // Warnings and pitfalls
    pitfalls: deviation.commonPitfalls || [],
    warnings: deviation.warnings || [],

    // References
    relatedArchetypes: deviation.relatedArchetypes || [],
    applicableSteps: deviation.applicableSteps || null,

    // Metadata
    difficulty: deviation.difficulty || 'medium',
    frequency: deviation.frequency || 'uncommon',
    examAppearances: deviation.examAppearances || []
  };
};

/**
 * Gets all deviations related to a specific archetype
 * Useful for archetype-specific deviation analysis
 *
 * @param {string} archetypeId - Archetype ID (e.g., 'A1', 'A2A')
 * @returns {array} Array of deviation cards related to this archetype
 */
export const getDeviationsByArchetype = (archetypeId) => {
  const registry = getDeviationRegistry();

  return registry.deviations
    .filter(d => d.relatedArchetypes?.includes(archetypeId))
    .map(d => ({
      code: d.code,
      name: d.name,
      description: d.description,
      confidence: 'N/A' // No scan context
    }));
};

/**
 * Checks if a problem contains multiple deviations (hybrid deviation case)
 *
 * @param {string} problemText - The problem text to analyze
 * @returns {object} Hybrid analysis results
 */
export const checkForHybridDeviations = (problemText) => {
  const scan = scanForDeviations(problemText);

  const isHybrid = scan.deviations.length > 1 &&
                   scan.deviations.filter(d => d.confidence !== 'LOW').length > 1;

  return {
    isHybrid,
    deviationCount: scan.deviations.length,
    highConfidenceCount: scan.deviations.filter(d => d.confidence === 'HIGH').length,
    deviations: scan.deviations,
    recommendation: isHybrid
      ? 'Problem involves multiple deviations - address each in sequence'
      : scan.deviations.length === 1
        ? 'Single deviation detected - follow modified approach'
        : 'No deviations detected - use standard approach'
  };
};

/**
 * Maps deviation codes to more detailed metadata
 * Useful for UI rendering and guidance display
 */
export const DEVIATION_METADATA = {
  'D1-StateContingent': {
    shortName: 'State-Contingent',
    icon: 'split-path',
    color: '#FF6B6B',
    complexity: 'high'
  },
  'D2-ExistingDebt': {
    shortName: 'Existing Debt',
    icon: 'layers',
    color: '#4ECDC4',
    complexity: 'medium'
  },
  'D3-MultiPeriod': {
    shortName: 'Multi-Period',
    icon: 'timeline',
    color: '#45B7D1',
    complexity: 'high'
  },
  'D4-ProtectivePut': {
    shortName: 'Protective Put',
    icon: 'shield',
    color: '#96CEB4',
    complexity: 'medium'
  },
  'D5-SignalingCosts': {
    shortName: 'Costly Signals',
    icon: 'dollar-sign',
    color: '#FFEAA7',
    complexity: 'high'
  },
  'D6-TaxShieldDefault': {
    shortName: 'Tax Shield + Default',
    icon: 'alert-triangle',
    color: '#DFE6E9',
    complexity: 'high'
  },
  'D7-WACCDistress': {
    shortName: 'WACC in Distress',
    icon: 'trending-down',
    color: '#FD79A8',
    complexity: 'high'
  },
  'D8-AmortizingDebt': {
    shortName: 'Amortizing',
    icon: 'trending-down',
    color: '#A29BFE',
    complexity: 'medium'
  },
  'D9-PayoutConstraints': {
    shortName: 'Constrained Payout',
    icon: 'lock',
    color: '#FD79A8',
    complexity: 'medium'
  },
  'D10-OptionsLearning': {
    shortName: 'Options + Learning',
    icon: 'lightbulb',
    color: '#FDCB6E',
    complexity: 'high'
  }
};

/**
 * Export for testing - allows injection of custom registry
 * @private
 */
export const __setDeviationRegistry = (registry) => {
  deviationRegistry = registry;
};

/**
 * Reset registry to force reload
 * Useful for testing and hot reload scenarios
 * @private
 */
export const __resetRegistry = () => {
  deviationRegistry = null;
};

// Default export for convenience
export default {
  scanForDeviations,
  detectDeviationAtStep,
  getDeviationGuidance,
  getDeviationsByArchetype,
  checkForHybridDeviations,
  DEVIATION_METADATA
};
