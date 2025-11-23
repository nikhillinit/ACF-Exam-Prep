import keywordMappings from '../data/keyword-mappings.json';

/**
 * Matches keywords to archetypes with confidence scoring
 */
export const matchKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const matches = [];

  Object.entries(keywordMappings.keywordToArchetype).forEach(([keyword, archetypes]) => {
    if (lowerText.includes(keyword)) {
      matches.push({
        keyword,
        archetypes,
        position: lowerText.indexOf(keyword)
      });
    }
  });

  return matches;
};

/**
 * Highlights keywords in text
 */
export const highlightKeywords = (text) => {
  let highlighted = text;
  const keywords = Object.keys(keywordMappings.keywordToArchetype);
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<mark>$&</mark>`);
  });

  return highlighted;
};
