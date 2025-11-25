/**
 * Data Loader Utility (Browser-Compatible)
 *
 * Loads and caches JSON data files for React components.
 * Provides unified access to all knowledge sources.
 */

// Import JSON files directly (Webpack will handle these)
import archetypeSignalsData from '../../data/archetype-signals.json';
import keywordMappingsData from '../../data/keyword-mappings.json';
import tierDefinitionsData from '../../data/tier-definitions.json';
import guidedExamplesData from '../../data/guided_problem_solving.json';
import deviationRegistryData from '../../data/deviation-registry.json';
import problemsIndexData from '../../data/problems-index.json';
import resourceRegistryData from '../../data/resourceRegistry.json';

class DataLoader {
  constructor() {
    this.cache = new Map();
    // Pre-load data into cache
    this.cache.set('archetype-signals', archetypeSignalsData);
    this.cache.set('keyword-mappings', keywordMappingsData);
    this.cache.set('tier-definitions', tierDefinitionsData);
    this.cache.set('guided-examples', guidedExamplesData);
    this.cache.set('deviation-registry', deviationRegistryData);
    this.cache.set('problems-index', problemsIndexData);
    this.cache.set('resource-registry', resourceRegistryData);
  }

  /**
   * Load JSON data from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached data
   */
  async loadJSON(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    throw new Error(`Data not found for key: ${key}`);
  }

  /**
   * Load archetype signals data
   * @returns {Promise<Object>} Archetype signals data
   */
  async loadArchetypeSignals() {
    return this.loadJSON('archetype-signals');
  }

  /**
   * Load keyword mappings data
   * @returns {Promise<Object>} Keyword mappings data
   */
  async loadKeywordMappings() {
    return this.loadJSON('keyword-mappings');
  }

  /**
   * Load tier definitions data
   * @returns {Promise<Object>} Tier definitions data
   */
  async loadTierDefinitions() {
    return this.loadJSON('tier-definitions');
  }

  /**
   * Load guided problem solving examples
   * @returns {Promise<Object>} Guided examples data
   */
  async loadGuidedExamples() {
    return this.loadJSON('guided-examples');
  }

  /**
   * Load deviation registry
   * @returns {Promise<Object>} Deviation registry data
   */
  async loadDeviationRegistry() {
    return this.loadJSON('deviation-registry');
  }

  /**
   * Load problems index
   * @returns {Promise<Object>} Problems index data
   */
  async loadProblemsIndex() {
    return this.loadJSON('problems-index');
  }

  /**
   * Load resource registry
   * @returns {Promise<Object>} Resource registry data
   */
  async loadResourceRegistry() {
    return this.loadJSON('resource-registry');
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
    // In browser version, we don't clear imported modules
    // Cache is essentially permanent after import
    console.warn('Cache clear not implemented for browser version');
  }
}

// Export singleton instance
export default new DataLoader();
