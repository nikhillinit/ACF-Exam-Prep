import archetypeSignals from '../data/archetype-signals.json';
import keywordMappings from '../data/keyword-mappings.json';

/**
 * Question patterns that strongly indicate specific archetypes
 * IMPORTANT: These IDs match archetype-signals.json schema:
 *   A5 = Payout Policy (NOT Real Options)
 *   A2B = Adverse Selection/Signaling
 *   A8 = Real Options
 *   A4 = Distress & Priority
 */
const QUESTION_PATTERNS = {
  // A5 in archetype-signals.json = Payout Policy
  'A5': [
    /what.*(dividend|payout)/i,
    /should.*(pay|distribute|announce)/i,
    /optimal.*(dividend|payout).*policy/i,
    /dividend.*signal/i,
    /signal.*dividend/i,
    /payout.*decision/i,
    /repurchase.*vs.*dividend/i
  ],
  // A2B = Adverse Selection & Signaling
  'A2B': [
    /signal/i,
    /type.*(reveal|separate|mimic)/i,
    /information.*asymmetr/i,
    /asymmetric.*information/i,
    /high.*type.*low.*type/i,
    /pooling.*separating/i,
    /pecking.*order/i,
    /Myers-Majluf/i,
    /adverse.*selection/i
  ],
  // A8 in archetype-signals.json = Real Options
  'A8': [
    /option.*to.*(expand|abandon|wait|delay)/i,
    /value.*flexibility/i,
    /real.*option/i,
    /strategic.*option/i,
    /managerial.*flexibility/i
  ],
  // A4 in archetype-signals.json = Distress & Priority
  'A4': [
    /waterfall/i,
    /priority.*claim/i,
    /bankruptcy.*proceed/i,
    /senior.*junior/i,
    /absolute.*priority/i,
    /liquidation.*value/i
  ],
  // A1 = Capital Structure
  'A1': [
    /calculate.*wacc/i,
    /expected.*return.*debt/i,
    /value.*levered/i,
    /tax.*shield/i,
    /promised.*yield/i,
    /yield.*maturity/i
  ],
  // A3 = CAPM & Discount Rates
  'A3': [
    /discount.*rate/i,
    /unlever.*beta/i,
    /relever.*beta/i,
    /cost.*of.*equity/i,
    /capm/i,
    /project.*beta/i
  ],
  // A2A = Debt Overhang / Multi-State
  'A2A': [
    /state.*contingent/i,
    /good.*state.*bad.*state/i,
    /debt.*overhang/i,
    /underinvestment.*problem/i,
    /wealth.*transfer/i
  ],
  // A6 = Risk Management / Hedging
  'A6': [
    /hedge/i,
    /collar/i,
    /cap.*floor/i,
    /futures.*contract/i,
    /swap/i,
    /risk.*management/i
  ]
};

/**
 * Keyword weights - higher = stronger signal
 * These override the default count-based scoring
 */
const KEYWORD_WEIGHTS = {
  // Generic (weak) - weight 1
  'debt': 1,
  'equity': 1,
  'value': 1,
  
  // Moderate - weight 2  
  'default': 2,
  'coupon': 2,
  'beta': 2,
  
  // Strong - weight 3
  'dividend': 3,
  'repurchase': 3,
  'payout': 3,
  'senior': 3,
  'junior': 3,
  'waterfall': 3,
  
  // Very strong - weight 4
  'signaling': 4,
  'signal': 4,
  'asymmetric information': 4,
  'high type': 4,
  'low type': 4,
  'pecking order': 4,
  'Myers-Majluf': 4
};

/**
 * Scans problem text and identifies relevant archetypes
 * @param {string} problemText - The exam problem text
 * @returns {object} Scan results with identified archetypes and metadata
 */
export const scanForArchetypes = (problemText) => {
  const text = problemText.toLowerCase();
  const matchedKeywords = [];
  const archetypeScores = {};
  
  // Score each archetype based on WEIGHTED keyword matches
  Object.entries(keywordMappings.keywordToArchetype).forEach(([keyword, archetypeIds]) => {
    if (text.includes(keyword)) {
      matchedKeywords.push(keyword);
      
      // Get weight for this keyword (default to 1 if not specified)
      const weight = KEYWORD_WEIGHTS[keyword] || 1;
      
      archetypeIds.forEach(id => {
        archetypeScores[id] = (archetypeScores[id] || 0) + weight;
      });
    }
  });

  // Boost scores for strong signals (existing logic - adds +5)
  keywordMappings.strongSignals.forEach(signal => {
    const allPresent = signal.keywords.every(kw => text.includes(kw.toLowerCase()));
    if (allPresent) {
      archetypeScores[signal.archetype] = (archetypeScores[signal.archetype] || 0) + 5;
    }
  });

  // NEW: Boost based on Question Patterns (+10 points - massive boost)
  Object.entries(QUESTION_PATTERNS).forEach(([archetypeId, patterns]) => {
    if (patterns.some(pattern => pattern.test(problemText))) {
      // Add 10 points for matching question pattern
      archetypeScores[archetypeId] = (archetypeScores[archetypeId] || 0) + 10;
    }
  });

  // Get top scoring archetypes (sorted by score, not count)
  const identifiedIds = Object.entries(archetypeScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score >= 2)
    .slice(0, 3)
    .map(([id]) => id);

  // Get full archetype details from archetype-signals.json
  const identifiedArchetypes = identifiedIds.map(id => 
    archetypeSignals.archetypes.find(a => a.id === id)
  ).filter(Boolean);

  // Check if hybrid (multiple strong archetypes)
  const isHybrid = identifiedArchetypes.length > 1 || 
    keywordMappings.hybridIndicators.some(indicator => 
      text.includes(indicator.toLowerCase())
    );

  // Determine primary tier
  const primaryTier = identifiedArchetypes.length > 0 
    ? Math.min(...identifiedArchetypes.map(a => a.tier))
    : 2;

  // Estimate points
  const estimatedPoints = identifiedArchetypes.reduce((sum, arch) => {
    const range = arch.pointValue.split('-').map(Number);
    return sum + (range[0] + range[1]) / 2;
  }, 0);

  // Calculate confidence based on score
  const topScore = identifiedIds.length > 0 ? archetypeScores[identifiedIds[0]] : 0;
  const confidence = topScore >= 10 ? 'HIGH' : (topScore >= 5 ? 'MEDIUM' : 'LOW');

  return {
    archetypes: identifiedArchetypes,
    archetypeScores: archetypeScores, // Expose scores for debugging
    matchedKeywords: [...new Set(matchedKeywords)],
    isHybrid,
    primaryTier,
    estimatedPoints: Math.round(estimatedPoints),
    confidence: confidence,
    topScore: topScore
  };
};

/**
 * Identifies conceptual themes in problem text
 */
export const identifyThemes = (problemText) => {
  const text = problemText.toLowerCase();
  const themes = [];

  archetypeSignals.conceptualThemes.forEach(theme => {
    const keywordMatches = theme.keyPrinciples.some(principle =>
      text.includes(principle.toLowerCase().split(' ').slice(0, 3).join(' '))
    );
    
    if (keywordMatches) {
      themes.push(theme);
    }
  });

  return themes;
};

/**
 * Suggests hybrid solving sequence
 */
export const suggestHybridSequence = (archetypes) => {
  const sequence = [...archetypes];
  
  // A3 (CAPM) usually comes first for discount rates
  sequence.sort((a, b) => {
    if (a.id === 'A3') return -1;
    if (b.id === 'A3') return 1;
    // A1 often comes before A4
    if (a.id === 'A1' && b.id === 'A4') return -1;
    if (a.id === 'A4' && b.id === 'A1') return 1;
    return 0;
  });

  return sequence;
};

/**
 * Maps between different archetype ID schemes
 * staticGuidance.js uses A4-Payout, archetype-signals.json uses A5 for Payout
 */
export const ARCHETYPE_ID_MAP = {
  // staticGuidance.js ID -> archetype-signals.json ID
  'A4-Payout': 'A5',
  'A5-RealOptions': 'A8',
  'A6-Distress': 'A4',
  // Direct matches
  'A1-CapitalStructure': 'A1',
  'A2-MultiState': 'A2A',
  'A2B-AdverseSelection': 'A2B',
  'A3-CAPM': 'A3'
};

/**
 * Convert between archetype ID schemes
 * @param {string} id - Archetype ID from one scheme
 * @param {string} fromScheme - 'static' or 'signals'
 * @returns {string} - Converted ID
 */
export const convertArchetypeId = (id, fromScheme = 'static') => {
  if (fromScheme === 'static') {
    return ARCHETYPE_ID_MAP[id] || id.split('-')[0];
  } else {
    // Reverse lookup
    const entry = Object.entries(ARCHETYPE_ID_MAP).find(([_, v]) => v === id);
    return entry ? entry[0] : id;
  }
};
