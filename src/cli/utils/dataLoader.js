/**
 * Data Loader Utility
 *
 * Loads and caches JSON data files for CLI tools.
 * Provides unified access to all knowledge sources.
 */

const fs = require('fs');
const path = require('path');

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.rootDir = path.resolve(__dirname, '../../..');
  }

  /**
   * Load JSON file with caching
   * @param {string} relativePath - Path relative to project root
   * @returns {Promise<any>} Parsed JSON data
   */
  async loadJSON(relativePath) {
    if (this.cache.has(relativePath)) {
      return this.cache.get(relativePath);
    }

    const fullPath = path.join(this.rootDir, relativePath);

    try {
      const content = await fs.promises.readFile(fullPath, 'utf-8');
      const data = JSON.parse(content);
      this.cache.set(relativePath, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to load ${relativePath}: ${error.message}`);
    }
  }

  /**
   * Load archetype signals data
   * @returns {Promise<Object>} Archetype signals data
   */
  async loadArchetypeSignals() {
    return this.loadJSON('src/data/archetype-signals.json');
  }

  /**
   * Load keyword mappings data
   * @returns {Promise<Object>} Keyword mappings data
   */
  async loadKeywordMappings() {
    return this.loadJSON('src/data/keyword-mappings.json');
  }

  /**
   * Load tier definitions data
   * @returns {Promise<Object>} Tier definitions data
   */
  async loadTierDefinitions() {
    return this.loadJSON('src/data/tier-definitions.json');
  }

  /**
   * Load guided problem solving examples
   * @returns {Promise<Object>} Guided examples data
   */
  async loadGuidedExamples() {
    return this.loadJSON('src/data/guided_problem_solving.json');
  }

  /**
   * Load deviation registry
   * @returns {Promise<Object>} Deviation registry data
   */
  async loadDeviationRegistry() {
    return this.loadJSON('src/data/deviation-registry.json');
  }

  /**
   * Load problems index
   * @returns {Promise<Object>} Problems index data
   */
  async loadProblemsIndex() {
    return this.loadJSON('src/data/problems-index.json');
  }

  /**
   * Load resource registry
   * @returns {Promise<Object>} Resource registry data
   */
  async loadResourceRegistry() {
    return this.loadJSON('src/data/resourceRegistry.json');
  }

  /**
   * Get a specific archetype by ID
   * @param {string} archetypeId - Archetype ID (e.g., 'A1', 'A2A')
   * @returns {Promise<Object|null>} Archetype data or null if not found
   */
  async getArchetype(archetypeId) {
    const signals = await this.loadArchetypeSignals();
    return signals.archetypes.find(a => a.id === archetypeId) || null;
  }

  /**
   * Get all archetypes
   * @returns {Promise<Array>} Array of all archetypes
   */
  async getAllArchetypes() {
    const signals = await this.loadArchetypeSignals();
    return signals.archetypes;
  }

  /**
   * Get tier information for a tier ID
   * @param {number} tierId - Tier ID (1 or 2)
   * @returns {Promise<Object|null>} Tier data or null if not found
   */
  async getTier(tierId) {
    const tiers = await this.loadTierDefinitions();
    return tiers.tiers?.[tierId] || null;
  }

  /**
   * Get examples for a specific archetype
   * @param {string} archetypeId - Archetype ID
   * @returns {Promise<Array>} Array of examples for this archetype
   */
  async getExamplesForArchetype(archetypeId) {
    const examples = await this.loadGuidedExamples();

    if (!examples.worked_examples) {
      return [];
    }

    return examples.worked_examples.filter(ex => {
      const exArchetype = ex.archetype || ex.primary_archetype || '';
      return exArchetype.includes(archetypeId);
    });
  }

  /**
   * Get keyword weights and mappings
   * @param {string} archetypeId - Archetype ID
   * @returns {Promise<Object>} Keyword data for this archetype
   */
  async getKeywordsForArchetype(archetypeId) {
    const mappings = await this.loadKeywordMappings();

    const archetypeKeywords = [];
    const keywordToArchetype = mappings.keywordToArchetype || {};
    const keywordWeights = mappings.keywordWeights || {};

    for (const [keyword, archetypes] of Object.entries(keywordToArchetype)) {
      if (archetypes.includes(archetypeId)) {
        archetypeKeywords.push({
          keyword,
          weight: keywordWeights[keyword] || 1,
          strength: this.categorizeKeywordStrength(keywordWeights[keyword] || 1)
        });
      }
    }

    // Also get strong signals
    const strongSignals = (mappings.strongSignals || [])
      .filter(s => s.archetype === archetypeId);

    return {
      keywords: archetypeKeywords.sort((a, b) => b.weight - a.weight),
      strongSignals
    };
  }

  /**
   * Categorize keyword strength by weight
   * @param {number} weight - Keyword weight
   * @returns {string} Strength category
   */
  categorizeKeywordStrength(weight) {
    if (weight >= 4) return 'INSTANT_TRIGGER';
    if (weight >= 3) return 'STRONG';
    if (weight >= 2) return 'MODERATE';
    return 'WEAK';
  }

  /**
   * Get hybrid patterns involving an archetype
   * @param {string} archetypeId - Archetype ID
   * @returns {Promise<Array>} Array of hybrid patterns
   */
  async getHybridPatternsForArchetype(archetypeId) {
    const mappings = await this.loadKeywordMappings();
    const hybridIndicators = mappings.hybridIndicators || [];

    // For now, return indicators that might apply to this archetype
    // This could be enhanced with actual hybrid pattern data
    return hybridIndicators.filter(indicator =>
      typeof indicator === 'string' && indicator.length > 0
    );
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
module.exports = new DataLoader();
