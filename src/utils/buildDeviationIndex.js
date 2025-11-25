/**
 * Build Deviation Index
 *
 * Utility script to build optimized deviation-index.json from deviation-registry.json
 * This pre-built index enables O(1) keyword lookups and faster pattern matching.
 *
 * Run with: node src/utils/buildDeviationIndex.js
 */

const fs = require('fs');
const path = require('path');

// Load deviation registry
const registryPath = path.join(__dirname, '../data/deviation-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

console.log('Building deviation index...');
console.log(`Found ${registry.deviations.length} deviations in registry\n`);

// Build keyword index
const keywordIndex = {};
let totalKeywords = 0;

registry.deviations.forEach(deviation => {
  const triggers = deviation.detection_triggers || [];

  triggers.forEach(keyword => {
    const normalized = keyword.toLowerCase();

    if (!keywordIndex[normalized]) {
      keywordIndex[normalized] = {
        deviations: [],
        weight: calculateKeywordWeight(keyword),
        frequency: 0
      };
      totalKeywords++;
    }

    keywordIndex[normalized].deviations.push(deviation.code);
    keywordIndex[normalized].frequency++;
  });
});

console.log(`✓ Built keyword index: ${totalKeywords} unique keywords`);

// Build archetype index
const archetypeIndex = {};
let totalArchetypes = 0;

registry.deviations.forEach(deviation => {
  const archetypes = deviation.related_archetypes || [];

  archetypes.forEach(archetype => {
    if (!archetypeIndex[archetype]) {
      archetypeIndex[archetype] = [];
      totalArchetypes++;
    }
    archetypeIndex[archetype].push(deviation.code);
  });
});

console.log(`✓ Built archetype index: ${totalArchetypes} archetypes`);

// Build category index
const categoryIndex = {};

registry.deviations.forEach(deviation => {
  const category = deviation.category;

  if (!categoryIndex[category]) {
    categoryIndex[category] = [];
  }
  categoryIndex[category].push(deviation.code);
});

console.log(`✓ Built category index: ${Object.keys(categoryIndex).length} categories`);

// Pre-compile and validate patterns
const compiledPatterns = [];
let validPatterns = 0;
let invalidPatterns = 0;

registry.deviations.forEach(deviation => {
  const patterns = deviation.detection_patterns || [];

  patterns.forEach(patternStr => {
    try {
      const match = patternStr.match(/^\/(.+)\/([gimuy]*)$/);
      if (match) {
        // Test regex compilation
        new RegExp(match[1], match[2]);
        compiledPatterns.push({
          code: deviation.code,
          pattern: patternStr,
          flags: match[2],
          valid: true
        });
        validPatterns++;
      } else {
        // Try as simple pattern
        new RegExp(patternStr, 'i');
        compiledPatterns.push({
          code: deviation.code,
          pattern: patternStr,
          flags: 'i',
          valid: true
        });
        validPatterns++;
      }
    } catch (error) {
      console.warn(`⚠ Invalid pattern for ${deviation.code}: ${patternStr}`);
      compiledPatterns.push({
        code: deviation.code,
        pattern: patternStr,
        valid: false,
        error: error.message
      });
      invalidPatterns++;
    }
  });
});

console.log(`✓ Validated patterns: ${validPatterns} valid, ${invalidPatterns} invalid\n`);

// Build complete index
const index = {
  metadata: {
    schema_version: '1.0',
    build_timestamp: new Date().toISOString(),
    source_registry: 'deviation-registry.json',
    total_deviations: registry.deviations.length,
    total_keywords: totalKeywords,
    total_archetypes: totalArchetypes,
    valid_patterns: validPatterns,
    invalid_patterns: invalidPatterns
  },

  keyword_index: keywordIndex,
  archetype_index: archetypeIndex,
  category_index: categoryIndex,
  compiled_patterns: compiledPatterns
};

// Write to file
const indexPath = path.join(__dirname, '../data/deviation-index.json');
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log('✓ Index saved to:', indexPath);
console.log('\nIndex Statistics:');
console.log(`  - Deviations: ${index.metadata.total_deviations}`);
console.log(`  - Keywords: ${index.metadata.total_keywords}`);
console.log(`  - Archetypes: ${index.metadata.total_archetypes}`);
console.log(`  - Patterns: ${index.metadata.valid_patterns}`);
console.log(`\nIndex build complete! 🎉\n`);

/**
 * Calculate keyword weight based on specificity
 */
function calculateKeywordWeight(keyword) {
  const wordCount = keyword.split(' ').length;

  if (wordCount >= 3) return 2.5;
  if (wordCount === 2) return 2.0;

  const highValueWords = ['hazard', 'amortizing', 'overhang', 'substitution', 'recursive'];
  if (highValueWords.some(w => keyword.toLowerCase().includes(w))) {
    return 2.0;
  }

  return 1.0;
}
