/**
 * Problem Similarity/Matching Engine
 *
 * Implements hybrid similarity scoring based on:
 * - Archetype match (40% weight)
 * - Deviation overlap (35% weight)
 * - Keyword overlap (25% weight)
 */

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

export default {
  calculateSimilarity,
  findSimilarProblems,
  groupByDeviationPattern,
  findByDeviationPattern,
  getDeviationStatistics,
  batchFindSimilar
};
