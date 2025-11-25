/**
 * Tests for Comparative Analysis Engine
 *
 * Tests the new functions:
 * - findClosestCompWithDivergenceAnalysis()
 * - generateAdaptationGuidance()
 * - inferCompApproach()
 */

import {
  findClosestCompWithDivergenceAnalysis,
  generateAdaptationGuidance,
  inferCompApproach,
  calculateSimilarity,
  findSimilarProblems
} from './problemMatcher.js';

import { DEVIATION_DATABASE } from './deviationInjector.js';

describe('inferCompApproach', () => {
  it('should infer approach from archetype for A1-CapitalStructure', () => {
    const compProblem = {
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1']
    };

    const approach = inferCompApproach(compProblem);
    expect(approach).toContain('expected');
    expect(approach).toContain('debt');
  });

  it('should infer approach from archetype for A3-CAPM', () => {
    const compProblem = {
      archetype: 'A3-CAPM',
      deviations: ['DEV-3.1.1']
    };

    const approach = inferCompApproach(compProblem);
    expect(approach).toContain('beta');
  });

  it('should return generic approach for unknown archetype', () => {
    const compProblem = {
      archetype: 'UNKNOWN',
      deviations: []
    };

    const approach = inferCompApproach(compProblem);
    expect(approach).toBeTruthy();
    expect(typeof approach).toBe('string');
  });
});

describe('generateAdaptationGuidance', () => {
  it('should create guidance for additional deviations', () => {
    const input = {
      additionalDeviations: ['DEV-1.2.1'],
      missingDeviations: [],
      additionalConcepts: [],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);

    expect(guidance).toBeInstanceOf(Array);
    expect(guidance.length).toBeGreaterThan(0);

    const firstGuidance = guidance[0];
    expect(firstGuidance.type).toBe('additional_complexity');
    expect(firstGuidance.code).toBe('DEV-1.2.1');
    expect(firstGuidance.title).toContain('Tax Shield Discount Rate');
    expect(firstGuidance.adaptationSteps).toBeInstanceOf(Array);
    expect(firstGuidance.adaptationSteps.length).toBeGreaterThan(0);
  });

  it('should create guidance for missing deviations (simplification)', () => {
    const input = {
      additionalDeviations: [],
      missingDeviations: ['DEV-1.1.1'],
      additionalConcepts: [],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);

    expect(guidance).toBeInstanceOf(Array);
    expect(guidance.length).toBeGreaterThan(0);

    const firstGuidance = guidance[0];
    expect(firstGuidance.type).toBe('simplification');
    expect(firstGuidance.code).toBe('DEV-1.1.1');
    expect(firstGuidance.title).toContain('simpler');
  });

  it('should create guidance for additional concepts', () => {
    const input = {
      additionalDeviations: [],
      missingDeviations: [],
      additionalConcepts: ['tax shield', 'WACC'],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);

    expect(guidance).toBeInstanceOf(Array);
    expect(guidance.length).toBeGreaterThan(0);

    const firstGuidance = guidance[0];
    expect(firstGuidance.type).toBe('conceptual_extension');
    expect(firstGuidance.title).toContain('tax shield');
  });

  it('should order guidance by severity (critical first)', () => {
    const input = {
      additionalDeviations: ['DEV-1.2.1', 'DEV-4.1.1', 'DEV-3.1.1'], // Different severities
      missingDeviations: [],
      additionalConcepts: [],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);

    // Should be ordered: critical > high > medium > low
    const severities = guidance.map(g => {
      const dev = DEVIATION_DATABASE.find(d => d.code === g.code);
      return dev?.severity || 'low';
    });

    // Check that critical comes before high, high before medium, etc.
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    for (let i = 0; i < severities.length - 1; i++) {
      expect(severityOrder[severities[i]]).toBeGreaterThanOrEqual(severityOrder[severities[i + 1]]);
    }
  });

  it('should include time impact estimates', () => {
    const input = {
      additionalDeviations: ['DEV-1.2.1'],
      missingDeviations: [],
      additionalConcepts: [],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);

    const firstGuidance = guidance[0];
    expect(firstGuidance.timeImpact).toBeDefined();
    expect(typeof firstGuidance.timeImpact).toBe('number');
    expect(firstGuidance.timeImpact).toBeGreaterThan(0);
  });

  it('should handle empty inputs gracefully', () => {
    const input = {
      additionalDeviations: [],
      missingDeviations: [],
      additionalConcepts: [],
      targetProblem: { archetype: 'A1-CapitalStructure' },
      compProblem: { archetype: 'A1-CapitalStructure' }
    };

    const guidance = generateAdaptationGuidance(input);
    expect(guidance).toBeInstanceOf(Array);
    expect(guidance.length).toBe(0);
  });
});

describe('findClosestCompWithDivergenceAnalysis', () => {
  const mockLibrary = [
    {
      id: 'comp1',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1'],
      keywords: ['debt', 'default', 'YTM', 'CAPM']
    },
    {
      id: 'comp2',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1', 'DEV-1.2.1'],
      keywords: ['debt', 'default', 'tax shield', 'YTM']
    },
    {
      id: 'comp3',
      archetype: 'A3-CAPM',
      deviations: ['DEV-3.1.1'],
      keywords: ['beta', 'CAPM', 'discount rate']
    }
  ];

  it('should find closest comp with >70% similarity', () => {
    const targetProblem = {
      id: 'target1',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1', 'DEV-1.2.1'],
      keywords: ['debt', 'default', 'tax shield']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.hasComp).toBe(true);
    expect(result.closestComp).toBeDefined();
    expect(result.similarityScore).toBeGreaterThan(0.7);
    expect(result.divergenceAnalysis).toBeDefined();
  });

  it('should identify additional deviations in target', () => {
    const targetProblem = {
      id: 'target2',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-4.1.1'], // Has extra deviation
      keywords: ['debt', 'default', 'YTM']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.divergenceAnalysis.additionalDeviations).toContain('DEV-4.1.1');
  });

  it('should identify missing deviations (simplification)', () => {
    const targetProblem = {
      id: 'target3',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1'], // Missing DEV-1.2.1 that comp has
      keywords: ['debt', 'default', 'tax shield']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.divergenceAnalysis.missingDeviations).toBeDefined();
    // The closest comp (comp2) has DEV-1.2.1, target doesn't
    if (result.closestComp?.id === 'comp2') {
      expect(result.divergenceAnalysis.missingDeviations).toContain('DEV-1.2.1');
    }
  });

  it('should generate adaptation guidance', () => {
    const targetProblem = {
      id: 'target4',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-4.1.1'],
      keywords: ['debt', 'default', 'tax shield', 'senior', 'junior']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.divergenceAnalysis.adaptationGuidance).toBeDefined();
    expect(result.divergenceAnalysis.adaptationGuidance).toBeInstanceOf(Array);

    if (result.divergenceAnalysis.additionalDeviations.length > 0 ||
        result.divergenceAnalysis.missingDeviations.length > 0 ||
        result.divergenceAnalysis.additionalConcepts.length > 0) {
      expect(result.divergenceAnalysis.adaptationGuidance.length).toBeGreaterThan(0);
    }
  });

  it('should return hasComp: false when no match above threshold', () => {
    const targetProblem = {
      id: 'target5',
      archetype: 'B5-UnrelatedArchetype',
      deviations: ['DEV-99.99.99'],
      keywords: ['completely', 'different', 'keywords']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.hasComp).toBe(false);
    expect(result.closestComp).toBeNull();
    expect(result.similarityScore).toBeLessThan(0.7);
  });

  it('should identify additional concepts in target', () => {
    const targetProblem = {
      id: 'target6',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1'],
      keywords: ['debt', 'default', 'YTM', 'WACC', 'leverage'] // Extra keywords
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.divergenceAnalysis.additionalConcepts).toBeDefined();
    expect(result.divergenceAnalysis.additionalConcepts.length).toBeGreaterThan(0);
  });

  it('should handle perfect match (same problem)', () => {
    const targetProblem = {
      id: 'target7',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1'],
      keywords: ['debt', 'default', 'YTM', 'CAPM']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result.hasComp).toBe(true);
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.9);
    // Should have minimal divergences
    expect(result.divergenceAnalysis.additionalDeviations.length).toBe(0);
    expect(result.divergenceAnalysis.missingDeviations.length).toBe(0);
  });

  it('should handle empty library', () => {
    const targetProblem = {
      id: 'target8',
      archetype: 'A1-CapitalStructure',
      deviations: ['DEV-1.1.1'],
      keywords: ['debt']
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, []);

    expect(result.hasComp).toBe(false);
    expect(result.closestComp).toBeNull();
  });

  it('should handle missing problem fields gracefully', () => {
    const targetProblem = {
      id: 'target9',
      // Missing archetype, deviations, keywords
    };

    const result = findClosestCompWithDivergenceAnalysis(targetProblem, mockLibrary);

    expect(result).toBeDefined();
    expect(result.hasComp).toBe(false);
  });
});
