/**
 * Autonomous Problem Analyzer (Browser-Compatible)
 *
 * Analyzes new exam problems to detect archetypes, deviations, and generate solution approaches.
 * Includes confidence scoring and pattern recognition enhancement.
 * Optimized with parallelization for browser performance.
 */

import dataLoader from './dataLoader';

class ProblemAnalyzer {
  constructor() {
    this.cache = {
      keywords: null,
      archetypes: null,
      deviations: null
    };
  }

  /**
   * Analyze a problem text and generate comprehensive report
   * @param {string} problemText - The exam problem text
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeProblem(problemText, options = {}) {
    const {
      includeCalculations = true,
      includeExamples = true,
      includeDeviations = true
    } = options;

    // Load data if not cached (parallel loading for performance)
    if (!this.cache.keywords) {
      const [keywords, archetypes, deviations] = await Promise.all([
        dataLoader.loadKeywordMappings(),
        dataLoader.getAllArchetypes(),
        dataLoader.loadDeviationRegistry()
      ]);

      this.cache.keywords = keywords;
      this.cache.archetypes = archetypes;
      this.cache.deviations = deviations;
    }

    // Step 1: Extract keywords from problem
    const extractedKeywords = this.extractKeywords(problemText);

    // Step 2: Detect archetypes with confidence scores
    const archetypeDetection = this.detectArchetypes(extractedKeywords, problemText);

    // Steps 3-6: Run analysis phases in parallel where possible
    const [deviationDetection, similarExamples] = await Promise.all([
      // Step 3: Detect deviations (if enabled)
      includeDeviations
        ? this.detectDeviations(problemText, archetypeDetection.primary)
        : Promise.resolve(null),

      // Step 5: Find similar examples (parallel with deviations)
      includeExamples
        ? this.findSimilarExamples(archetypeDetection.primary, extractedKeywords)
        : Promise.resolve([])
    ]);

    // Step 4: Generate solution approach (depends on deviation detection)
    const solutionApproach = await this.generateSolutionApproach(
      archetypeDetection,
      deviationDetection,
      problemText
    );

    // Step 6: Generate calculations (synchronous, can run after)
    const calculations = includeCalculations
      ? this.suggestCalculations(archetypeDetection.primary, problemText)
      : null;

    return {
      problemText: problemText.substring(0, 200) + '...',
      analysis: {
        archetypes: archetypeDetection,
        deviations: deviationDetection,
        keywords: extractedKeywords
      },
      approach: solutionApproach,
      calculations,
      similarExamples,
      confidence: archetypeDetection.confidence,
      metadata: {
        analyzedAt: new Date().toISOString(),
        analysisVersion: '1.0.0'
      }
    };
  }

  /**
   * Extract keywords from problem text
   */
  extractKeywords(problemText) {
    const text = problemText.toLowerCase();
    const keywordToArchetype = this.cache.keywords.keywordToArchetype || {};
    const keywordWeights = this.cache.keywords.keywordWeights || {};

    const found = [];

    for (const [keyword, archetypes] of Object.entries(keywordToArchetype)) {
      if (text.includes(keyword.toLowerCase())) {
        found.push({
          keyword,
          weight: keywordWeights[keyword] || 1,
          archetypes,
          positions: this.findKeywordPositions(text, keyword.toLowerCase())
        });
      }
    }

    return found.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Find all positions of a keyword in text
   */
  findKeywordPositions(text, keyword) {
    const positions = [];
    let index = text.indexOf(keyword);
    while (index !== -1) {
      positions.push(index);
      index = text.indexOf(keyword, index + 1);
    }
    return positions;
  }

  /**
   * Detect archetypes with confidence scoring
   */
  detectArchetypes(extractedKeywords, problemText) {
    const archetypeScores = {};

    // Score each archetype based on keyword matches
    extractedKeywords.forEach(kwData => {
      kwData.archetypes.forEach(archetypeId => {
        if (!archetypeScores[archetypeId]) {
          archetypeScores[archetypeId] = {
            score: 0,
            matchedKeywords: [],
            totalWeight: 0
          };
        }

        archetypeScores[archetypeId].score += kwData.weight;
        archetypeScores[archetypeId].totalWeight += kwData.weight;
        archetypeScores[archetypeId].matchedKeywords.push({
          keyword: kwData.keyword,
          weight: kwData.weight
        });
      });
    });

    // Convert scores to confidence percentages
    const maxScore = Math.max(...Object.values(archetypeScores).map(a => a.score), 1);

    const rankedArchetypes = Object.entries(archetypeScores)
      .map(([id, data]) => ({
        id,
        confidence: (data.score / maxScore) * 100,
        rawScore: data.score,
        matchedKeywords: data.matchedKeywords,
        archetype: this.cache.archetypes.find(a => a.id === id)
      }))
      .sort((a, b) => b.confidence - a.confidence);

    // Detect if hybrid (multiple archetypes with high confidence)
    const highConfidence = rankedArchetypes.filter(a => a.confidence > 40);
    const isHybrid = highConfidence.length > 1;

    return {
      primary: rankedArchetypes[0],
      secondary: rankedArchetypes.slice(1, 3),
      all: rankedArchetypes,
      isHybrid,
      hybridCombination: isHybrid ? highConfidence.map(a => a.id).join(' + ') : null,
      confidence: rankedArchetypes[0]?.confidence || 0
    };
  }

  /**
   * Detect deviations in the problem
   */
  async detectDeviations(problemText, primaryArchetype) {
    if (!primaryArchetype) return null;

    const text = problemText.toLowerCase();
    const detectedDeviations = [];

    // Check deviation registry for patterns
    const deviations = this.cache.deviations.deviations || [];

    for (const deviation of deviations) {
      // Check if deviation applies to this archetype
      if (deviation.archetype && deviation.archetype !== primaryArchetype.id) {
        continue;
      }

      // Check detection patterns
      const triggers = deviation.detection_triggers || [];
      const patterns = deviation.detection_patterns || [];

      let matchScore = 0;
      const matchedTriggers = [];

      // Check keyword triggers
      triggers.forEach(trigger => {
        if (text.includes(trigger.toLowerCase())) {
          matchScore += 1;
          matchedTriggers.push(trigger);
        }
      });

      // Check regex patterns
      patterns.forEach(patternStr => {
        try {
          const match = patternStr.match(/^\/(.+)\/([gimuy]*)$/);
          if (match) {
            const regex = new RegExp(match[1], match[2]);
            if (regex.test(problemText)) {
              matchScore += 2; // Regex matches are stronger signals
            }
          }
        } catch (e) {
          // Invalid regex, skip
        }
      });

      if (matchScore > 0) {
        detectedDeviations.push({
          code: deviation.code || deviation.id,
          name: deviation.name,
          description: deviation.description,
          severity: deviation.severity || 'MEDIUM',
          timeImpact: deviation.time_impact_minutes || 0,
          matchScore,
          matchedTriggers,
          guidance: deviation.guidance_text || deviation.standard_approach
        });
      }
    }

    return {
      total: detectedDeviations.length,
      deviations: detectedDeviations.sort((a, b) => b.matchScore - a.matchScore),
      totalTimeImpact: detectedDeviations.reduce((sum, d) => sum + d.timeImpact, 0)
    };
  }

  /**
   * Generate solution approach based on detection results
   */
  async generateSolutionApproach(archetypeDetection, deviationDetection, problemText) {
    const primary = archetypeDetection.primary;
    if (!primary) {
      return {
        error: 'Could not detect archetype',
        recommendation: 'Manual classification needed'
      };
    }

    const approach = {
      archetype: {
        id: primary.id,
        name: primary.archetype?.name,
        confidence: Math.round(primary.confidence),
        tier: primary.archetype?.tier
      },
      timeAllocation: {
        base: primary.archetype?.timeAllocation || 10,
        deviationAdjustment: deviationDetection?.totalTimeImpact || 0,
        recommended: (primary.archetype?.timeAllocation || 10) + (deviationDetection?.totalTimeImpact || 0)
      },
      resources: {
        excelTab: primary.archetype?.excelTab,
        playbookSlides: primary.archetype?.playbook_slides || []
      },
      workflow: this.generateWorkflowSteps(primary, deviationDetection),
      warnings: deviationDetection?.deviations.map(d => ({
        severity: d.severity,
        message: d.name,
        guidance: d.guidance
      })) || []
    };

    // Add hybrid handling if detected
    if (archetypeDetection.isHybrid) {
      approach.hybridHandling = {
        combination: archetypeDetection.hybridCombination,
        solvingSequence: this.suggestHybridSequence(archetypeDetection.all.slice(0, 2)),
        recommendation: 'Solve archetypes sequentially, using outputs from first as inputs to second'
      };
    }

    return approach;
  }

  /**
   * Generate 5-step workflow with specific guidance
   */
  generateWorkflowSteps(primaryArchetype, deviationDetection) {
    const archetype = primaryArchetype.archetype;
    const keywords = primaryArchetype.matchedKeywords.slice(0, 5).map(kw => kw.keyword).join('", "');

    return {
      step1_identify: {
        time: '30s',
        action: `Confirm archetype: ${archetype?.name}`,
        checklist: [
          `Keywords present: "${keywords}"`,
          `Tier ${archetype?.tier} problem (${archetype?.tier === 1 ? 'HIGH' : 'MEDIUM'} priority)`,
          `Deviations detected: ${deviationDetection?.total || 0}`
        ]
      },
      step2_extract: {
        time: '30-60s',
        action: 'Extract key information',
        checklist: [
          'What is the core question?',
          'What are the given values?',
          'What are the required outputs?',
          'What assumptions are stated or implied?'
        ]
      },
      step3_map: {
        time: '30s',
        action: 'Map to resources',
        checklist: [
          `Open Excel tab: ${archetype?.excelTab || 'TBD'}`,
          `Reference playbook slides: ${archetype?.playbook_slides?.join(', ') || 'N/A'}`,
          'Identify which formulas/templates apply'
        ]
      },
      step4_execute: {
        time: `${(archetype?.timeAllocation || 10) - 3} min`,
        action: 'Calculate solution',
        checklist: [
          'Input values into Excel template',
          'Apply formulas systematically',
          'Handle deviations with adjusted approach',
          'Double-check intermediate calculations'
        ]
      },
      step5_check: {
        time: '1-2 min',
        action: 'Verify and interpret',
        checklist: [
          'Sign: Does the result direction make sense?',
          'Magnitude: Is the scale reasonable?',
          'Theory: Does it align with financial principles?',
          'Implications: Can you explain why?'
        ]
      }
    };
  }

  /**
   * Suggest hybrid solving sequence
   */
  suggestHybridSequence(topArchetypes) {
    const sequences = {
      'A3-A1': 'First compute discount rate (A3), then use in capital structure analysis (A1)',
      'A1-A4': 'First analyze debt structure (A1), then apply priority waterfall (A4)',
      'A2A-A3': 'First compute discount rate (A3), then analyze debt overhang (A2A)',
      'A1-A5': 'First value debt/equity (A1), then analyze payout policy (A5)'
    };

    const key = topArchetypes.map(a => a.id).join('-');
    return sequences[key] || `Solve ${topArchetypes[0].id} first, then ${topArchetypes[1].id}`;
  }

  /**
   * Find similar worked examples
   */
  async findSimilarExamples(primaryArchetype, extractedKeywords) {
    if (!primaryArchetype) return [];

    const examples = await dataLoader.getExamplesForArchetype(primaryArchetype.id);

    return examples.slice(0, 3).map(ex => ({
      id: ex.id,
      problemText: ex.problem_text?.substring(0, 150) + '...',
      keyInsights: ex.key_insights || [],
      commonMistakes: ex.common_mistakes || []
    }));
  }

  /**
   * Suggest calculation approach
   */
  suggestCalculations(primaryArchetype, problemText) {
    if (!primaryArchetype) return null;

    const calculations = {
      'A1': {
        steps: [
          '1. Identify: Face value, coupon, price, maturity, default probability',
          '2. Calculate promised YTM: (Face + Coupon) / Price - 1',
          '3. Calculate expected return: p_good × r_good + p_default × r_default',
          '4. Infer debt beta: β_D = (E[r_D] - r_f) / MRP'
        ],
        formulas: [
          'Promised YTM = (Payoff_good / Price) - 1',
          'Expected Return = (1-p) × r_good + p × r_default',
          'Debt Beta = (E[r_D] - r_f) / (E[r_m] - r_f)'
        ]
      },
      'A2A': {
        steps: [
          '1. Value debt and equity WITHOUT project',
          '2. Value debt and equity WITH project (ignore financing cost)',
          '3. Calculate equity issuance needed to fund project',
          '4. Compute old equity wealth change',
          '5. Determine if equity accepts (positive wealth change?)'
        ],
        formulas: [
          'Debt_without = min(Face, Asset_value)',
          'Equity_without = max(0, Asset_value - Face)',
          'Equity_after_issuance = Equity_new × (Old_shares / Total_shares)'
        ]
      },
      'A3': {
        steps: [
          '1. Unlever comparable beta: β_A = β_E / [1 + (1-τ) × D/E]',
          '2. Relever at target structure: β_E = β_A × [1 + (1-τ) × D/E]',
          '3. Compute r_E via CAPM: r_E = r_f + β_E × MRP',
          '4. Compute WACC: WACC = (E/V) × r_E + (D/V) × r_D × (1-τ)'
        ],
        formulas: [
          'β_A = [E/(D+E)] × β_E + [D/(D+E)] × β_D',
          'r_E = r_f + β_E × (E[r_m] - r_f)',
          'WACC = w_E × r_E + w_D × r_D × (1-τ)'
        ]
      }
    };

    return calculations[primaryArchetype.id] || {
      steps: ['Refer to archetype guide for calculation approach'],
      formulas: ['See Excel template for formulas']
    };
  }
}

// Export singleton instance
export default new ProblemAnalyzer();
