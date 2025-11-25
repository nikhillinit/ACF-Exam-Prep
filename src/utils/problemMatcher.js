/**
 * Problem Similarity/Matching Engine
 *
 * Implements hybrid similarity scoring based on:
 * - Archetype match (40% weight)
 * - Deviation overlap (35% weight)
 * - Keyword overlap (25% weight)
 */

import { DEVIATION_DATABASE } from './deviationInjector.js';

/**
 * Calculate Jaccard similarity between two sets
 * @param {Array} set1 - First set
 * @param {Array} set2 - Second set
 * @returns {number} Jaccard similarity coefficient (0-1)
 */
function jaccardSimilarity(set1, set2) {
  if (!set1 || !set2 || (set1.length === 0 && set2.length === 0)) {
    return 0;
  }

  const s1 = new Set(set1);
  const s2 = new Set(set2);

  if (s1.size === 0 && s2.size === 0) {
    return 0;
  }

  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);

  return intersection.size / union.size;
}

/**
 * Extract archetype tier from archetype code
 * @param {string} archetype - Archetype code (e.g., "A1", "B2.1")
 * @returns {string} Tier prefix (e.g., "A", "B")
 */
function getArchetypeTier(archetype) {
  if (!archetype || typeof archetype !== 'string') {
    return '';
  }
  return archetype.charAt(0);
}

/**
 * Calculate archetype similarity score
 * @param {string} archetype1 - First archetype code
 * @param {string} archetype2 - Second archetype code
 * @returns {number} Similarity score (0-1)
 */
function calculateArchetypeSimilarity(archetype1, archetype2) {
  if (!archetype1 || !archetype2) {
    return 0;
  }

  // Exact match
  if (archetype1 === archetype2) {
    return 1.0;
  }

  // Same tier (e.g., both start with "A" or both start with "B")
  if (getArchetypeTier(archetype1) === getArchetypeTier(archetype2)) {
    return 0.5;
  }

  // Different tiers
  return 0;
}

/**
 * Extract deviation codes from a problem
 * @param {Object} problem - Problem object
 * @returns {Array<string>} Array of deviation codes
 */
function extractDeviations(problem) {
  if (!problem) {
    return [];
  }

  const deviations = [];

  // Check primary deviation
  if (problem.deviation) {
    deviations.push(problem.deviation);
  }

  // Check deviations array
  if (Array.isArray(problem.deviations)) {
    deviations.push(...problem.deviations);
  }

  // Check metadata
  if (problem.metadata?.deviations) {
    if (Array.isArray(problem.metadata.deviations)) {
      deviations.push(...problem.metadata.deviations);
    } else if (typeof problem.metadata.deviations === 'string') {
      deviations.push(problem.metadata.deviations);
    }
  }

  // Check analysis object
  if (problem.analysis?.deviations) {
    if (Array.isArray(problem.analysis.deviations)) {
      deviations.push(...problem.analysis.deviations);
    }
  }

  // Remove duplicates and empty values
  return [...new Set(deviations.filter(d => d && typeof d === 'string'))];
}

/**
 * Extract keywords from a problem
 * @param {Object} problem - Problem object
 * @returns {Array<string>} Array of keywords
 */
function extractKeywords(problem) {
  if (!problem) {
    return [];
  }

  const keywords = [];

  // Check keywords array
  if (Array.isArray(problem.keywords)) {
    keywords.push(...problem.keywords);
  }

  // Check metadata
  if (problem.metadata?.keywords) {
    if (Array.isArray(problem.metadata.keywords)) {
      keywords.push(...problem.metadata.keywords);
    }
  }

  // Check matchedKeywords
  if (Array.isArray(problem.matchedKeywords)) {
    keywords.push(...problem.matchedKeywords);
  }

  // Check analysis object
  if (problem.analysis?.keywords) {
    if (Array.isArray(problem.analysis.keywords)) {
      keywords.push(...problem.analysis.keywords);
    }
  }

  // Normalize keywords (lowercase, trim)
  const normalized = keywords
    .filter(k => k && typeof k === 'string')
    .map(k => k.toLowerCase().trim());

  // Remove duplicates
  return [...new Set(normalized)];
}

/**
 * Extract archetype from a problem
 * @param {Object} problem - Problem object
 * @returns {string} Archetype code
 */
function extractArchetype(problem) {
  if (!problem) {
    return '';
  }

  // Check direct archetype field
  if (problem.archetype) {
    return problem.archetype;
  }

  // Check metadata
  if (problem.metadata?.archetype) {
    return problem.metadata.archetype;
  }

  // Check analysis object
  if (problem.analysis?.archetype) {
    return problem.analysis.archetype;
  }

  return '';
}

/**
 * Calculate similarity between two problems
 * @param {Object} problem1 - First problem
 * @param {Object} problem2 - Second problem
 * @returns {Object} Similarity breakdown and total score
 */
export function calculateSimilarity(problem1, problem2) {
  // Extract features from both problems
  const archetype1 = extractArchetype(problem1);
  const archetype2 = extractArchetype(problem2);
  const deviations1 = extractDeviations(problem1);
  const deviations2 = extractDeviations(problem2);
  const keywords1 = extractKeywords(problem1);
  const keywords2 = extractKeywords(problem2);

  // Calculate individual similarity scores
  const archetypeScore = calculateArchetypeSimilarity(archetype1, archetype2);
  const deviationScore = jaccardSimilarity(deviations1, deviations2);
  const keywordScore = jaccardSimilarity(keywords1, keywords2);

  // Apply weights (40%, 35%, 25%)
  const ARCHETYPE_WEIGHT = 0.40;
  const DEVIATION_WEIGHT = 0.35;
  const KEYWORD_WEIGHT = 0.25;

  const totalScore =
    (archetypeScore * ARCHETYPE_WEIGHT) +
    (deviationScore * DEVIATION_WEIGHT) +
    (keywordScore * KEYWORD_WEIGHT);

  return {
    totalScore: parseFloat(totalScore.toFixed(4)),
    breakdown: {
      archetypeMatch: parseFloat(archetypeScore.toFixed(4)),
      deviationOverlap: parseFloat(deviationScore.toFixed(4)),
      keywordOverlap: parseFloat(keywordScore.toFixed(4))
    },
    features: {
      archetype1,
      archetype2,
      deviations1,
      deviations2,
      keywords1,
      keywords2
    }
  };
}

/**
 * Generate human-readable explanation of similarity
 * @param {Object} similarity - Similarity calculation result
 * @returns {string} Explanation text
 */
function generateExplanation(similarity) {
  const { breakdown, features } = similarity;
  const parts = [];

  // Archetype explanation
  if (breakdown.archetypeMatch === 1.0) {
    parts.push(`Same archetype (${features.archetype1})`);
  } else if (breakdown.archetypeMatch === 0.5) {
    parts.push(`Same archetype tier (${features.archetype1} and ${features.archetype2})`);
  } else {
    parts.push(`Different archetypes (${features.archetype1} vs ${features.archetype2})`);
  }

  // Deviation explanation
  const sharedDeviations = features.deviations1.filter(d =>
    features.deviations2.includes(d)
  );

  if (sharedDeviations.length > 0) {
    const deviationList = sharedDeviations.slice(0, 3).join(', ');
    const more = sharedDeviations.length > 3 ? ` (+${sharedDeviations.length - 3} more)` : '';
    parts.push(`${sharedDeviations.length} shared deviation${sharedDeviations.length > 1 ? 's' : ''} (${deviationList}${more})`);
  } else if (features.deviations1.length > 0 || features.deviations2.length > 0) {
    parts.push('No shared deviations');
  }

  // Keyword explanation
  const sharedKeywords = features.keywords1.filter(k =>
    features.keywords2.includes(k)
  );

  if (sharedKeywords.length > 0) {
    parts.push(`${sharedKeywords.length} common keyword${sharedKeywords.length > 1 ? 's' : ''}`);
  }

  return parts.join(', ');
}

/**
 * Find similar problems to a target problem
 * @param {Object} targetProblem - The problem to find matches for
 * @param {Array<Object>} problemLibrary - Array of problems to search
 * @param {number} limit - Maximum number of results to return (default: 5)
 * @returns {Object} Results with similar problems and scores
 */
export function findSimilarProblems(targetProblem, problemLibrary, limit = 5) {
  if (!targetProblem || !Array.isArray(problemLibrary)) {
    return {
      similarProblems: [],
      totalCandidates: 0,
      error: 'Invalid input parameters'
    };
  }

  const targetId = targetProblem.id || targetProblem.problemId;

  // Calculate similarity for all problems
  const similarities = problemLibrary
    .filter(problem => {
      // Exclude the target problem itself
      const problemId = problem.id || problem.problemId;
      return problemId !== targetId;
    })
    .map(problem => {
      const similarity = calculateSimilarity(targetProblem, problem);
      return {
        problem,
        similarityScore: similarity.totalScore,
        breakdown: similarity.breakdown,
        explanation: generateExplanation(similarity)
      };
    })
    .filter(result => result.similarityScore > 0) // Only include non-zero matches
    .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by score descending
    .slice(0, limit); // Limit results

  return {
    similarProblems: similarities,
    totalCandidates: problemLibrary.length - 1, // Exclude target problem
    targetProblem: {
      id: targetId,
      archetype: extractArchetype(targetProblem),
      deviations: extractDeviations(targetProblem),
      keywords: extractKeywords(targetProblem)
    }
  };
}

/**
 * Group problems by deviation pattern
 * @param {Array<Object>} problems - Array of problems to cluster
 * @returns {Object} Grouped problems by deviation pattern
 */
export function groupByDeviationPattern(problems) {
  if (!Array.isArray(problems)) {
    return {
      groups: [],
      totalGroups: 0,
      ungrouped: [],
      error: 'Invalid input: expected array of problems'
    };
  }

  const patternMap = new Map();
  const ungrouped = [];

  problems.forEach(problem => {
    const deviations = extractDeviations(problem);

    if (deviations.length === 0) {
      ungrouped.push(problem);
      return;
    }

    // Create a sorted, unique key for the deviation pattern
    const patternKey = [...new Set(deviations)].sort().join('|');

    if (!patternMap.has(patternKey)) {
      patternMap.set(patternKey, {
        pattern: deviations.sort(),
        deviationCodes: [...new Set(deviations)],
        problems: [],
        count: 0
      });
    }

    const group = patternMap.get(patternKey);
    group.problems.push(problem);
    group.count++;
  });

  // Convert map to array and sort by group size
  const groups = Array.from(patternMap.values())
    .sort((a, b) => b.count - a.count);

  return {
    groups,
    totalGroups: groups.length,
    ungrouped,
    summary: {
      totalProblems: problems.length,
      groupedProblems: problems.length - ungrouped.length,
      ungroupedProblems: ungrouped.length,
      largestGroup: groups.length > 0 ? groups[0].count : 0,
      smallestGroup: groups.length > 0 ? groups[groups.length - 1].count : 0
    }
  };
}

/**
 * Find problems with specific deviation combinations
 * @param {Array<Object>} problems - Array of problems to search
 * @param {Array<string>} targetDeviations - Deviation codes to match
 * @param {boolean} exactMatch - Whether to require exact match (default: false)
 * @returns {Array<Object>} Matching problems
 */
export function findByDeviationPattern(problems, targetDeviations, exactMatch = false) {
  if (!Array.isArray(problems) || !Array.isArray(targetDeviations)) {
    return [];
  }

  const targetSet = new Set(targetDeviations);

  return problems.filter(problem => {
    const problemDeviations = extractDeviations(problem);
    const problemSet = new Set(problemDeviations);

    if (exactMatch) {
      // Exact match: same deviations, no more, no less
      if (targetSet.size !== problemSet.size) {
        return false;
      }
      return [...targetSet].every(dev => problemSet.has(dev));
    } else {
      // Partial match: contains all target deviations (may have more)
      return [...targetSet].every(dev => problemSet.has(dev));
    }
  });
}

/**
 * Get deviation statistics across a problem set
 * @param {Array<Object>} problems - Array of problems to analyze
 * @returns {Object} Deviation statistics
 */
export function getDeviationStatistics(problems) {
  if (!Array.isArray(problems)) {
    return {
      totalProblems: 0,
      deviationFrequency: {},
      error: 'Invalid input: expected array of problems'
    };
  }

  const deviationFrequency = {};
  const deviationCooccurrence = {};

  problems.forEach(problem => {
    const deviations = extractDeviations(problem);

    // Count individual deviations
    deviations.forEach(deviation => {
      deviationFrequency[deviation] = (deviationFrequency[deviation] || 0) + 1;
    });

    // Count co-occurrences
    for (let i = 0; i < deviations.length; i++) {
      for (let j = i + 1; j < deviations.length; j++) {
        const pair = [deviations[i], deviations[j]].sort().join('|');
        deviationCooccurrence[pair] = (deviationCooccurrence[pair] || 0) + 1;
      }
    }
  });

  // Sort by frequency
  const sortedDeviations = Object.entries(deviationFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([deviation, count]) => ({
      deviation,
      count,
      percentage: ((count / problems.length) * 100).toFixed(2)
    }));

  const sortedCooccurrences = Object.entries(deviationCooccurrence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20) // Top 20 co-occurrences
    .map(([pair, count]) => ({
      deviations: pair.split('|'),
      count,
      percentage: ((count / problems.length) * 100).toFixed(2)
    }));

  return {
    totalProblems: problems.length,
    uniqueDeviations: sortedDeviations.length,
    deviationFrequency: sortedDeviations,
    topCooccurrences: sortedCooccurrences,
    averageDeviationsPerProblem: (
      problems.reduce((sum, p) => sum + extractDeviations(p).length, 0) / problems.length
    ).toFixed(2)
  };
}

/**
 * Batch similarity calculation for multiple targets
 * @param {Array<Object>} targetProblems - Problems to find matches for
 * @param {Array<Object>} problemLibrary - Library to search
 * @param {number} limit - Results per target (default: 5)
 * @returns {Array<Object>} Similarity results for each target
 */
export function batchFindSimilar(targetProblems, problemLibrary, limit = 5) {
  if (!Array.isArray(targetProblems) || !Array.isArray(problemLibrary)) {
    return [];
  }

  return targetProblems.map(target => ({
    targetId: target.id || target.problemId,
    results: findSimilarProblems(target, problemLibrary, limit)
  }));
}

// ========================================
// COMPARATIVE DEVIATION ANALYSIS SYSTEM
// ========================================

/**
 * Infer high-level approach from comp problem's archetype
 * @param {Object} compProblem - Comparable problem
 * @returns {string} High-level approach description
 */
export function inferCompApproach(compProblem) {
  if (!compProblem) {
    return 'Review the comparable problem and identify the key approach';
  }

  const archetype = extractArchetype(compProblem);

  // Map archetypes to high-level approaches
  const approachMap = {
    'A1-CapitalStructure': 'Calculate expected returns on debt using survival probabilities, then use in valuation',
    'A2-MultiState': 'Calculate equity and debt values in each state using max(0, V - D), then take expectations',
    'A2B-AdverseSelection': 'Identify separating or pooling equilibrium, check incentive compatibility constraints',
    'A3-CAPM': 'Calculate beta for the project or firm, use CAPM to find required return',
    'A4-Payout': 'Compare dividend vs repurchase using tax implications and shareholder wealth effects',
    'A6-Distress': 'Apply absolute priority rule waterfall: Senior → Junior → Equity',
    'A10-Options': 'Use option pricing formulas or put-call parity to value the position'
  };

  // Try exact match first
  if (approachMap[archetype]) {
    return approachMap[archetype];
  }

  // Try tier match (e.g., A1, A2, A3)
  const tier = getArchetypeTier(archetype);
  for (const [key, value] of Object.entries(approachMap)) {
    if (key.startsWith(tier)) {
      return value;
    }
  }

  // Generic fallback
  return 'Follow the comparable problem\'s methodology and adapt to your specific case';
}

/**
 * Generate adaptation guidance for divergences between target and comp
 * @param {Object} params - Parameters object
 * @param {Array<string>} params.additionalDeviations - Deviations in target, not in comp
 * @param {Array<string>} params.missingDeviations - Deviations in comp, not in target
 * @param {Array<string>} params.additionalConcepts - Keywords in target, not in comp
 * @param {Object} params.targetProblem - Target problem
 * @param {Object} params.compProblem - Comp problem
 * @returns {Array<Object>} Array of adaptation guidance objects
 */
export function generateAdaptationGuidance({
  additionalDeviations = [],
  missingDeviations = [],
  additionalConcepts = [],
  targetProblem = {},
  compProblem = {}
}) {
  const guidance = [];
  const compApproach = inferCompApproach(compProblem);

  // Process additional deviations (target more complex than comp)
  additionalDeviations.forEach(deviationCode => {
    const deviation = DEVIATION_DATABASE.find(d => d.code === deviationCode);
    if (!deviation) return;

    guidance.push({
      type: 'additional_complexity',
      code: deviation.code,
      title: `Your problem adds: ${deviation.name}`,
      description: `Unlike the comparable, your problem involves ${deviation.name.toLowerCase()}`,
      adaptationSteps: [
        `Start with comp's approach: ${compApproach}`,
        `Then add: ${deviation.explanation}`,
        ...(deviation.checkpoints ? deviation.checkpoints.slice(0, 2) : [])
      ],
      timeImpact: deviation.time_impact_minutes || 0,
      severity: deviation.severity || 'medium'
    });
  });

  // Process missing deviations (target simpler than comp)
  missingDeviations.forEach(deviationCode => {
    const deviation = DEVIATION_DATABASE.find(d => d.code === deviationCode);
    if (!deviation) return;

    guidance.push({
      type: 'simplification',
      code: deviation.code,
      title: `Your problem is simpler: No ${deviation.name}`,
      description: `The comparable has ${deviation.name.toLowerCase()}, but your problem doesn't need this`,
      adaptationSteps: [
        `Skip the comp's ${deviation.name.toLowerCase()} steps`,
        'Use the standard approach instead',
        'This simplifies the solution'
      ],
      timeImpact: -(deviation.time_impact_minutes || 0), // Negative time = saves time
      severity: 'low'
    });
  });

  // Process additional concepts (new keywords)
  if (additionalConcepts.length > 0) {
    // Group concepts into a single guidance item
    const conceptList = additionalConcepts.slice(0, 3).join(', ');
    guidance.push({
      type: 'conceptual_extension',
      code: 'CONCEPT-EXTENSION',
      title: `Your problem involves: ${conceptList}`,
      description: `Apply the comp's methodology, but incorporate these additional concepts`,
      adaptationSteps: [
        `Start with comp's approach: ${compApproach}`,
        `Incorporate: ${conceptList}`,
        'Ensure these concepts are properly integrated into the calculation'
      ],
      timeImpact: 1.5,
      severity: 'medium'
    });
  }

  // Sort by severity (critical > high > medium > low)
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  guidance.sort((a, b) => {
    const severityA = severityOrder[a.severity] || 0;
    const severityB = severityOrder[b.severity] || 0;
    return severityB - severityA;
  });

  return guidance;
}

/**
 * Find closest comparable with divergence analysis
 * @param {Object} targetProblem - Problem to find comparable for
 * @param {Array<Object>} problemLibrary - Library of problems
 * @param {number} similarityThreshold - Minimum similarity score (default: 0.7)
 * @returns {Object} Comparative analysis result
 */
export function findClosestCompWithDivergenceAnalysis(
  targetProblem,
  problemLibrary,
  similarityThreshold = 0.7
) {
  // Handle edge cases
  if (!targetProblem || !Array.isArray(problemLibrary) || problemLibrary.length === 0) {
    return {
      hasComp: false,
      closestComp: null,
      similarityScore: 0,
      divergenceAnalysis: {
        additionalDeviations: [],
        missingDeviations: [],
        additionalConcepts: [],
        adaptationGuidance: []
      }
    };
  }

  // Find similar problems using existing function
  const similarityResults = findSimilarProblems(targetProblem, problemLibrary, 1);

  if (!similarityResults.similarProblems || similarityResults.similarProblems.length === 0) {
    return {
      hasComp: false,
      closestComp: null,
      similarityScore: 0,
      divergenceAnalysis: {
        additionalDeviations: [],
        missingDeviations: [],
        additionalConcepts: [],
        adaptationGuidance: []
      }
    };
  }

  const topMatch = similarityResults.similarProblems[0];
  const closestComp = topMatch.problem;
  const similarityScore = topMatch.similarityScore;

  // Check if similarity meets threshold
  const hasComp = similarityScore >= similarityThreshold;

  // Extract features for divergence analysis
  const targetDeviations = extractDeviations(targetProblem);
  const compDeviations = extractDeviations(closestComp);
  const targetKeywords = extractKeywords(targetProblem);
  const compKeywords = extractKeywords(closestComp);

  // Identify divergences
  const targetDeviationSet = new Set(targetDeviations);
  const compDeviationSet = new Set(compDeviations);
  const targetKeywordSet = new Set(targetKeywords);
  const compKeywordSet = new Set(compKeywords);

  // Additional deviations: in target but not in comp
  const additionalDeviations = targetDeviations.filter(d => !compDeviationSet.has(d));

  // Missing deviations: in comp but not in target (simplification)
  const missingDeviations = compDeviations.filter(d => !targetDeviationSet.has(d));

  // Additional concepts: keywords in target but not in comp
  const additionalConcepts = targetKeywords.filter(k => !compKeywordSet.has(k));

  // Generate adaptation guidance
  const adaptationGuidance = hasComp ? generateAdaptationGuidance({
    additionalDeviations,
    missingDeviations,
    additionalConcepts,
    targetProblem,
    compProblem: closestComp
  }) : [];

  return {
    hasComp,
    closestComp: hasComp ? closestComp : null,
    similarityScore: parseFloat(similarityScore.toFixed(4)),
    divergenceAnalysis: {
      additionalDeviations,
      missingDeviations,
      additionalConcepts,
      adaptationGuidance
    }
  };
}

export default {
  calculateSimilarity,
  findSimilarProblems,
  groupByDeviationPattern,
  findByDeviationPattern,
  getDeviationStatistics,
  batchFindSimilar,
  findClosestCompWithDivergenceAnalysis,
  generateAdaptationGuidance,
  inferCompApproach
};
