/**
 * Deviation Detection Engine
 *
 * High-performance detection engine for identifying deviations in ACF exam problems.
 * Uses multi-phase scoring algorithm with keyword extraction, pattern matching,
 * archetype correlation, and confidence ranking.
 *
 * Architecture: Pure utility functions (framework-agnostic)
 * Performance: <50ms for typical problems with caching
 *
 * Created: 2025-11-25
 * Part of: Dynamic Deviation Injection System
 */

// Lazy-loaded deviation registry
let deviationRegistry = null;
let deviationIndex = null;

// In-memory cache for detection results (LRU-style with 100 item limit)
const detectionCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Load deviation registry from JSON
 * @private
 */
const loadDeviationRegistry = () => {
  if (!deviationRegistry) {
    try {
      // Try different paths for Webpack vs Node.js
      try {
        deviationRegistry = require('../data/deviation-registry.json');
      } catch (e1) {
        // Fallback for Node.js execution
        const path = require('path');
        const fs = require('fs');
        const registryPath = path.join(__dirname, '../data/deviation-registry.json');
        const data = fs.readFileSync(registryPath, 'utf8');
        deviationRegistry = JSON.parse(data);
      }
    } catch (error) {
      console.warn('deviation-registry.json not found, using empty registry');
      deviationRegistry = { deviations: [] };
    }
  }
  return deviationRegistry;
};

/**
 * Load or build deviation index for fast lookups
 * @private
 */
const loadDeviationIndex = () => {
  if (!deviationIndex) {
    const registry = loadDeviationRegistry();
    deviationIndex = buildDeviationIndex(registry);
  }
  return deviationIndex;
};

/**
 * Build optimized index from deviation registry
 * Creates keyword index and pre-compiles regex patterns
 * @private
 */
const buildDeviationIndex = (registry) => {
  const keywordIndex = {};
  const archetypeIndex = {};
  const compiledPatterns = new Map();

  registry.deviations.forEach(deviation => {
    // Build keyword index
    (deviation.detection_triggers || []).forEach(keyword => {
      const normalized = keyword.toLowerCase();
      if (!keywordIndex[normalized]) {
        keywordIndex[normalized] = {
          deviations: [],
          weight: calculateKeywordWeight(keyword)
        };
      }
      keywordIndex[normalized].deviations.push(deviation.code);
    });

    // Build archetype index
    (deviation.related_archetypes || []).forEach(archetype => {
      if (!archetypeIndex[archetype]) {
        archetypeIndex[archetype] = [];
      }
      archetypeIndex[archetype].push(deviation.code);
    });

    // Pre-compile regex patterns
    const patterns = (deviation.detection_patterns || []).map(patternStr => {
      try {
        const match = patternStr.match(/^\/(.+)\/([gimuy]*)$/);
        if (match) {
          return new RegExp(match[1], match[2]);
        }
        return new RegExp(patternStr, 'i');
      } catch (error) {
        console.warn(`Invalid pattern for ${deviation.code}: ${patternStr}`, error);
        return null;
      }
    }).filter(p => p !== null);

    compiledPatterns.set(deviation.code, patterns);
  });

  return {
    keywordIndex,
    archetypeIndex,
    compiledPatterns,
    metadata: {
      buildTime: new Date().toISOString(),
      deviationCount: registry.deviations.length,
      keywordCount: Object.keys(keywordIndex).length
    }
  };
};

/**
 * Calculate weight for a keyword based on specificity
 * More specific keywords get higher weights
 * @private
 */
const calculateKeywordWeight = (keyword) => {
  const wordCount = keyword.split(' ').length;

  // Multi-word phrases are more specific
  if (wordCount >= 3) return 2.5;
  if (wordCount === 2) return 2.0;

  // Single words with specific meanings
  const highValueWords = ['hazard', 'amortizing', 'overhang', 'substitution', 'recursive'];
  if (highValueWords.some(w => keyword.toLowerCase().includes(w))) {
    return 2.0;
  }

  return 1.0;
};

/**
 * PHASE 1: Extract keywords from problem text with weights
 * @private
 */
const extractKeywords = (problemText) => {
  const index = loadDeviationIndex();
  const textLower = problemText.toLowerCase();
  const foundKeywords = [];

  for (const [keyword, data] of Object.entries(index.keywordIndex)) {
    if (textLower.includes(keyword)) {
      foundKeywords.push({
        keyword,
        weight: data.weight,
        deviations: data.deviations
      });
    }
  }

  return foundKeywords;
};

/**
 * PHASE 2: Match regex patterns from deviation registry
 * @private
 */
const matchPatterns = (problemText, candidateDeviations = null) => {
  const index = loadDeviationIndex();
  const registry = loadDeviationRegistry();
  const matches = [];

  // If candidates provided, only test those patterns
  const deviationsToTest = candidateDeviations
    ? candidateDeviations
    : registry.deviations.map(d => d.code);

  deviationsToTest.forEach(code => {
    const patterns = index.compiledPatterns.get(code) || [];
    let matchCount = 0;

    for (const pattern of patterns) {
      if (pattern.test(problemText)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      matches.push({
        code,
        matchCount,
        score: matchCount * 3 // 3 points per pattern match
      });
    }
  });

  return matches;
};

/**
 * PHASE 3: Correlate with archetype context for boost
 * @private
 */
const correlateWithArchetypes = (scores, archetypeContext) => {
  if (!archetypeContext) return scores;

  const index = loadDeviationIndex();
  const archetypeDeviations = index.archetypeIndex[archetypeContext] || [];

  // Boost scores for deviations related to this archetype
  const boosted = { ...scores };
  archetypeDeviations.forEach(code => {
    if (boosted[code]) {
      boosted[code] += 1.5; // Archetype correlation boost
    }
  });

  return boosted;
};

/**
 * PHASE 4: Score and rank deviations by confidence
 * @private
 */
const scoreDeviations = (keywords, patterns, archetypeContext = null) => {
  const scores = {};

  // Add keyword scores
  keywords.forEach(({ keyword, weight, deviations }) => {
    deviations.forEach(code => {
      scores[code] = (scores[code] || 0) + weight;
    });
  });

  // Add pattern match scores
  patterns.forEach(({ code, score }) => {
    scores[code] = (scores[code] || 0) + score;
  });

  // Apply archetype boost
  const finalScores = correlateWithArchetypes(scores, archetypeContext);

  // Rank by score and assign confidence
  const ranked = Object.entries(finalScores)
    .map(([code, score]) => ({
      code,
      score,
      confidence: score >= 5 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW'
    }))
    .filter(d => d.score >= 2) // Minimum threshold
    .sort((a, b) => b.score - a.score);

  return ranked;
};

/**
 * Get full deviation details by code
 * @private
 */
const getDeviationByCode = (code) => {
  const registry = loadDeviationRegistry();
  return registry.deviations.find(d => d.code === code);
};

/**
 * Main detection function: Detect deviations from problem text
 *
 * Uses four-phase algorithm:
 * 1. Keyword extraction (weighted scoring)
 * 2. Pattern matching (regex + heuristics)
 * 3. Archetype correlation (context boost)
 * 4. Confidence ranking (HIGH/MEDIUM/LOW)
 *
 * @param {string} problemText - The exam problem text to analyze
 * @param {object} context - Optional context (archetypes, problemId, etc.)
 * @returns {object} Detection results with deviations and metadata
 *
 * @example
 * const result = detectDeviations(
 *   'Annual default probability of 5% with hazard rate model',
 *   { archetypes: 'A1' }
 * );
 * // Returns: { deviations: [{code: 'DEV-1.1.1', confidence: 'HIGH', ...}], ... }
 */
export const detectDeviations = (problemText, context = {}) => {
  if (!problemText || typeof problemText !== 'string') {
    return {
      deviations: [],
      metadata: { error: 'Invalid problem text' }
    };
  }

  // Check cache first
  const cacheKey = `${problemText.substring(0, 100)}_${context.archetypes || 'none'}`;
  if (detectionCache.has(cacheKey)) {
    return detectionCache.get(cacheKey);
  }

  // Phase 1: Extract keywords
  const keywords = extractKeywords(problemText);

  // Phase 2: Pre-filter candidates by keywords (performance optimization)
  const candidateSet = new Set();
  keywords.forEach(({ deviations }) => {
    deviations.forEach(code => candidateSet.add(code));
  });

  // Phase 3: Match patterns (only test candidate deviations)
  const patterns = matchPatterns(problemText, Array.from(candidateSet));

  // Phase 4: Score and rank
  const scored = scoreDeviations(keywords, patterns, context.archetypes);

  // Enrich with full deviation data
  const enrichedDeviations = scored.map(({ code, score, confidence }) => {
    const deviation = getDeviationByCode(code);
    return {
      code,
      name: deviation?.name || code,
      description: deviation?.description || '',
      category: deviation?.category || '',
      score,
      confidence,
      severity: deviation?.severity || 'medium',
      time_impact_minutes: deviation?.time_impact_minutes || 0,
      checkpoints: deviation?.checkpoints || [],
      common_errors: deviation?.common_errors || [],
      formula_hints: deviation?.formula_hints || [],
      related_archetypes: deviation?.related_archetypes || []
    };
  });

  // Build result object
  const result = {
    deviations: enrichedDeviations,
    metadata: {
      keywordsFound: keywords.length,
      patternsMatched: patterns.length,
      candidatesEvaluated: candidateSet.size,
      topScore: enrichedDeviations.length > 0 ? enrichedDeviations[0].score : 0,
      overallConfidence: enrichedDeviations.length > 0 ? enrichedDeviations[0].confidence : 'NONE',
      detectedAt: new Date().toISOString(),
      problemLength: problemText.length
    }
  };

  // Cache result (with LRU eviction)
  if (detectionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = detectionCache.keys().next().value;
    detectionCache.delete(firstKey);
  }
  detectionCache.set(cacheKey, result);

  return result;
};

/**
 * Map detected deviations to specific solution steps
 *
 * Analyzes each solution step to determine which deviations apply.
 * Injects deviation alerts at the appropriate steps.
 *
 * @param {array} deviations - Array of detected deviations
 * @param {array} solutionSteps - Array of solution step objects
 * @returns {array} Solution steps enriched with deviation_alert fields
 *
 * @example
 * const enriched = mapDeviationsToSteps(
 *   [{ code: 'DEV-1.1.1', name: 'Hazard Rate', ... }],
 *   [{ part: 'A', reasoning: 'Calculate using hazard rate...', ... }]
 * );
 */
export const mapDeviationsToSteps = (deviations, solutionSteps) => {
  if (!deviations || deviations.length === 0) {
    return solutionSteps; // No deviations to inject
  }

  return solutionSteps.map((step, index) => {
    // Combine step text fields for analysis
    const stepText = [
      step.part || '',
      step.prompt || '',
      step.reasoning || '',
      step.calculation || '',
      step.sanity_check || ''
    ].join(' ');

    // Find deviations applicable to this step
    const applicableDeviations = deviations.filter(deviation => {
      // Quick scan of step text for deviation keywords
      const stepScan = detectDeviations(stepText);
      return stepScan.deviations.some(d => d.code === deviation.code);
    });

    // If multiple deviations found, prioritize by severity and confidence
    if (applicableDeviations.length > 0) {
      const primary = applicableDeviations.sort((a, b) => {
        // Sort by confidence first, then score
        const confidenceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const confDiff = confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
        if (confDiff !== 0) return confDiff;
        return b.score - a.score;
      })[0];

      // Inject deviation alert
      return {
        ...step,
        deviation_alert: {
          code: primary.code,
          name: primary.name,
          warning: `This step requires ${primary.name} approach`,
          explanation: primary.description,
          checkpoints: primary.checkpoints,
          time_impact_minutes: primary.time_impact_minutes,
          severity: getSeverityLevel(primary.confidence, primary.score),
          confidence: primary.confidence
        }
      };
    }

    return step; // No deviation for this step
  });
};

/**
 * Determine severity level from confidence and score
 * @private
 */
const getSeverityLevel = (confidence, score) => {
  if (confidence === 'HIGH' && score >= 8) return 'critical';
  if (confidence === 'HIGH') return 'high';
  if (confidence === 'MEDIUM') return 'medium';
  return 'low';
};

/**
 * Detect deviations at a specific solution step
 * Useful for step-by-step guidance
 *
 * @param {string} stepText - Text of the current step
 * @param {number} stepNumber - Step number (1-based)
 * @param {string} problemText - Full problem text for context
 * @returns {object} Step-specific deviation detection results
 */
export const detectDeviationAtStep = (stepText, stepNumber, problemText) => {
  // Scan step text
  const stepScan = detectDeviations(stepText);

  // Also scan full problem for context
  const problemScan = detectDeviations(problemText);

  // Determine which deviation applies to this step
  let applicableDeviation = null;

  if (stepScan.deviations.length > 0 && stepScan.deviations[0].confidence !== 'LOW') {
    applicableDeviation = stepScan.deviations[0];
  } else if (problemScan.deviations.length > 0 && problemScan.deviations[0].confidence === 'HIGH') {
    applicableDeviation = problemScan.deviations[0];
  }

  return {
    stepNumber,
    deviation: applicableDeviation,
    stepConfidence: stepScan.metadata.overallConfidence,
    problemConfidence: problemScan.metadata.overallConfidence,
    recommendation: applicableDeviation
      ? `Apply ${applicableDeviation.name} approach`
      : 'Use standard approach'
  };
};

/**
 * Clear detection cache
 * Useful for testing or when registry is updated
 */
export const clearCache = () => {
  detectionCache.clear();
};

/**
 * Get cache statistics
 * Useful for monitoring performance
 */
export const getCacheStats = () => {
  return {
    size: detectionCache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: detectionCache.size > 0 ? 'Unknown (implement hit tracking)' : 0
  };
};

/**
 * Reset engine (clear cache and reload registry)
 * Useful for testing and hot reload
 */
export const resetEngine = () => {
  detectionCache.clear();
  deviationRegistry = null;
  deviationIndex = null;
};

// Export for testing
export const __internal = {
  extractKeywords,
  matchPatterns,
  correlateWithArchetypes,
  scoreDeviations,
  buildDeviationIndex,
  loadDeviationRegistry
};

// Default export
export default {
  detectDeviations,
  mapDeviationsToSteps,
  detectDeviationAtStep,
  clearCache,
  getCacheStats,
  resetEngine
};
