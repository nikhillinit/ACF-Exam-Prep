/**
 * Archetype Synthesizer
 *
 * Synthesizes comprehensive archetype guides from scattered data sources.
 * Combines: archetype signals, keyword mappings, tier info, worked examples.
 */

const dataLoader = require('../utils/dataLoader');

class ArchetypeSynthesizer {
  /**
   * Generate complete archetype guide
   * @param {string} archetypeId - Archetype ID (e.g., 'A1', 'A2A')
   * @param {Object} options - Synthesis options
   * @returns {Promise<Object>} Synthesized archetype guide data
   */
  async synthesize(archetypeId, options = {}) {
    const {
      includeExamples = true,
      maxExamples = 3
    } = options;

    // Collect data from multiple sources
    const archetype = await dataLoader.getArchetype(archetypeId);

    if (!archetype) {
      throw new Error(`Archetype ${archetypeId} not found`);
    }

    const tier = await dataLoader.getTier(archetype.tier);
    const keywordData = await dataLoader.getKeywordsForArchetype(archetypeId);
    const examples = includeExamples
      ? await dataLoader.getExamplesForArchetype(archetypeId)
      : [];

    // Synthesize the guide
    return {
      header: this.generateHeader(archetype, tier),
      recognition: this.generateRecognitionSection(archetype, keywordData),
      resources: this.generateResourceSection(archetype),
      examples: this.generateExamplesSection(examples.slice(0, maxExamples)),
      workflow: this.generateWorkflowSection(archetype),
      metadata: this.generateMetadata(archetypeId)
    };
  }

  /**
   * Generate header section
   */
  generateHeader(archetype, tier) {
    return {
      id: archetype.id,
      name: archetype.name,
      tier: archetype.tier,
      priority: tier?.priority || archetype.priority,
      timeAllocation: archetype.timeAllocation,
      pointValue: archetype.pointValue,
      examWeight: tier?.examWeight ? `${Math.round(tier.examWeight * 100)}%` : 'Unknown'
    };
  }

  /**
   * Generate recognition section
   */
  generateRecognitionSection(archetype, keywordData) {
    // Group keywords by strength
    const keywordsByStrength = {
      INSTANT_TRIGGER: [],
      STRONG: [],
      MODERATE: [],
      WEAK: []
    };

    keywordData.keywords.forEach(kw => {
      keywordsByStrength[kw.strength].push({
        keyword: kw.keyword,
        weight: kw.weight
      });
    });

    return {
      keywordsByStrength,
      strongSignals: keywordData.strongSignals.map(signal => ({
        keywords: signal.keywords,
        confidence: signal.confidence,
        description: `${signal.keywords.join(' + ')} → ${archetype.id}`
      })),
      hybridPatterns: this.extractHybridPatterns(archetype)
    };
  }

  /**
   * Extract hybrid patterns (placeholder for now)
   */
  extractHybridPatterns(archetype) {
    // This would be enhanced with actual hybrid pattern data
    const commonHybrids = {
      'A1': [
        {
          combination: 'A1 + A4',
          description: 'Capital Structure with Priority',
          frequency: 'HIGH',
          sequence: 'A1-pricing → A4-waterfall → A1-expected-returns'
        },
        {
          combination: 'A1 + A5',
          description: 'Capital Structure with Payout',
          frequency: 'LOW',
          sequence: 'A1-debt-value → A5-payout-choice → combined-effects'
        }
      ],
      'A2A': [
        {
          combination: 'A2A + A3',
          description: 'Debt Overhang with CAPM',
          frequency: 'MEDIUM',
          sequence: 'A3-discount-rate → A2A-multi-state → wealth-transfer'
        }
      ],
      'A3': [
        {
          combination: 'A3 + A1',
          description: 'CAPM with Capital Structure',
          frequency: 'HIGH',
          sequence: 'A3-beta-estimation → A1-leverage-effects → adjusted-WACC'
        }
      ]
    };

    return commonHybrids[archetype.id] || [];
  }

  /**
   * Generate resource section
   */
  generateResourceSection(archetype) {
    return {
      excelTab: archetype.excelTab || 'Not specified',
      playbookSlides: archetype.playbook_slides || [],
      timeStrategy: {
        allocation: archetype.timeAllocation,
        buffer: Math.ceil(archetype.timeAllocation * 0.15), // 15% buffer
        rule: '1 point = 1 minute'
      }
    };
  }

  /**
   * Generate examples section
   */
  generateExamplesSection(examples) {
    return examples.map(ex => ({
      id: ex.id || 'unknown',
      problemText: this.truncateText(ex.problem_text, 200),
      keyInsights: ex.key_insights || [],
      commonMistakes: ex.common_mistakes || [],
      solutionApproach: this.extractSolutionApproach(ex.solution_steps || [])
    }));
  }

  /**
   * Extract solution approach from steps
   */
  extractSolutionApproach(steps) {
    return steps.slice(0, 6).map((step, idx) => ({
      stepNumber: idx + 1,
      title: step.part || `Step ${idx + 1}`,
      summary: this.truncateText(step.prompt || step.reasoning || '', 150)
    }));
  }

  /**
   * Generate workflow section (5-step)
   */
  generateWorkflowSection(archetype) {
    const baseKeywords = (archetype.keywords || []).slice(0, 4).join('", "');

    return {
      identify: {
        time: '30s',
        tasks: [
          `Scan for: "${baseKeywords}"`,
          'Check for: Problem-specific signals',
          `Flag: Hybrid if combined with other archetypes`
        ]
      },
      extract: {
        time: '30s',
        tasks: [
          'Core question: What is being asked?',
          'Sub-parts: Break down multi-part questions',
          'Data: List all given values and assumptions'
        ]
      },
      map: {
        time: '30s',
        tasks: [
          `Resource: Excel Tab ${archetype.excelTab || 'TBD'}`,
          'Verify: Do you have all necessary inputs?',
          'Plan: Identify calculation sequence'
        ]
      },
      execute: {
        time: `${archetype.timeAllocation - 3} min`,
        tasks: [
          'Follow template: Input values carefully',
          'Calculate: Work through systematically',
          'Multi-step: Handle dependencies in order'
        ]
      },
      check: {
        time: '1-2 min',
        tasks: [
          'Sign: Does the direction make sense?',
          'Magnitude: Is the scale reasonable?',
          'Theory: Does it align with financial principles?',
          'Implications: Can you explain the result?'
        ]
      }
    };
  }

  /**
   * Generate metadata
   */
  generateMetadata(archetypeId) {
    return {
      generatedAt: new Date().toISOString().split('T')[0],
      archetypeId,
      sources: [
        'archetype-signals.json',
        'keyword-mappings.json',
        'tier-definitions.json',
        'guided_problem_solving.json'
      ]
    };
  }

  /**
   * Truncate text to max length
   */
  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }
}

module.exports = new ArchetypeSynthesizer();
