import archetypeSignals from '../data/archetype-signals.json';
import keywordMappings from '../data/keyword-mappings.json';

/**
 * Scans problem text and identifies relevant archetypes
 * @param {string} problemText - The exam problem text
 * @returns {object} Scan results with identified archetypes and metadata
 */
export const scanForArchetypes = (problemText) => {
  const text = problemText.toLowerCase();
  const matchedKeywords = [];
  const archetypeScores = {};
  
  // Score each archetype based on keyword matches
  Object.entries(keywordMappings.keywordToArchetype).forEach(([keyword, archetypeIds]) => {
    if (text.includes(keyword)) {
      matchedKeywords.push(keyword);
      archetypeIds.forEach(id => {
        archetypeScores[id] = (archetypeScores[id] || 0) + 1;
      });
    }
  });

  // Boost scores for strong signals
  keywordMappings.strongSignals.forEach(signal => {
    const allPresent = signal.keywords.every(kw => text.includes(kw.toLowerCase()));
    if (allPresent) {
      archetypeScores[signal.archetype] = (archetypeScores[signal.archetype] || 0) + 5;
    }
  });

  // Get top scoring archetypes
  const identifiedIds = Object.entries(archetypeScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score >= 2)
    .slice(0, 3)
    .map(([id]) => id);

  // Get full archetype details
  const identifiedArchetypes = identifiedIds.map(id => 
    archetypeSignals.archetypes.find(a => a.id === id)
  ).filter(Boolean);

  // Check if hybrid
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

  return {
    archetypes: identifiedArchetypes,
    matchedKeywords: [...new Set(matchedKeywords)],
    isHybrid,
    primaryTier,
    estimatedPoints: Math.round(estimatedPoints),
    confidence: identifiedArchetypes.length > 0 ? 'HIGH' : 'LOW'
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
