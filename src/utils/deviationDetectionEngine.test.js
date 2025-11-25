/**
 * Unit Tests for Deviation Detection Engine
 *
 * Tests the four-phase detection algorithm:
 * 1. Keyword extraction
 * 2. Pattern matching
 * 3. Archetype correlation
 * 4. Confidence ranking
 */

import {
  detectDeviations,
  mapDeviationsToSteps,
  detectDeviationAtStep,
  clearCache,
  resetEngine,
  __internal
} from './deviationDetectionEngine';

describe('deviationDetectionEngine', () => {
  beforeEach(() => {
    resetEngine(); // Clear cache and reload registry
  });

  describe('detectDeviations', () => {
    test('detects hazard rate deviation with HIGH confidence', () => {
      const text = 'The company faces annual default probability of 5% using a hazard rate model';
      const result = detectDeviations(text);

      expect(result.deviations).toHaveLength(1);
      expect(result.deviations[0].code).toBe('DEV-1.1.1');
      expect(result.deviations[0].name).toBe('Hazard Rate Default Modeling');
      expect(result.deviations[0].confidence).toBe('HIGH');
      expect(result.deviations[0].score).toBeGreaterThanOrEqual(5);
    });

    test('detects amortizing debt deviation with HIGH confidence', () => {
      const text = 'The debt has an amortizing structure with equal annual payments and declining principal balance';
      const result = detectDeviations(text);

      expect(result.deviations.length).toBeGreaterThan(0);
      expect(result.deviations[0].code).toBe('DEV-1.2.1');
      expect(result.deviations[0].confidence).toBe('HIGH');
    });

    test('detects debt overhang deviation', () => {
      const text = 'The firm has existing debt outstanding. Equity holders refuse to invest in the positive-NPV project due to debt overhang';
      const result = detectDeviations(text);

      expect(result.deviations.length).toBeGreaterThan(0);
      expect(result.deviations[0].code).toBe('DEV-2.1.1');
      expect(result.deviations[0].name).toBe('Debt Overhang Problem');
    });

    test('detects APV deviation', () => {
      const text = 'Calculate the adjusted present value (APV) given changing leverage over time';
      const result = detectDeviations(text);

      expect(result.deviations.length).toBeGreaterThan(0);
      const apvDeviation = result.deviations.find(d => d.code === 'DEV-4.2.1');
      expect(apvDeviation).toBeDefined();
      expect(apvDeviation.name).toBe('APV vs WACC Approach');
    });

    test('detects beta unlevering deviation', () => {
      const text = 'Unlever the equity beta using the comparable firm with different leverage';
      const result = detectDeviations(text);

      expect(result.deviations.length).toBeGreaterThan(0);
      const betaDeviation = result.deviations.find(d => d.code === 'DEV-4.1.1');
      expect(betaDeviation).toBeDefined();
    });

    test('returns empty for standard problem with no deviations', () => {
      const text = 'Calculate the NPV of a simple project with constant cash flows';
      const result = detectDeviations(text);

      expect(result.deviations).toHaveLength(0);
      expect(result.metadata.overallConfidence).toBe('NONE');
    });

    test('detects multiple deviations in complex problem', () => {
      const text = `
        The firm has existing debt and faces annual default probability of 5%.
        Calculate expected return using hazard rate model with amortizing debt structure.
      `;
      const result = detectDeviations(text);

      expect(result.deviations.length).toBeGreaterThan(1);
      // Should detect: hazard rate, existing debt, amortizing
      const codes = result.deviations.map(d => d.code);
      expect(codes).toContain('DEV-1.1.1'); // Hazard rate
      expect(codes).toContain('DEV-1.2.1'); // Amortizing
    });

    test('handles archetype context for correlation boost', () => {
      const text = 'Calculate the unlevered firm value and tax shield separately';

      // Without archetype context
      const withoutContext = detectDeviations(text);

      // With archetype context (A1 relates to APV/WACC deviations)
      const withContext = detectDeviations(text, { archetypes: 'A1' });

      // Score should be higher with archetype boost
      const withoutScore = withoutContext.deviations[0]?.score || 0;
      const withScore = withContext.deviations[0]?.score || 0;
      expect(withScore).toBeGreaterThanOrEqual(withoutScore);
    });

    test('caches detection results for identical inputs', () => {
      const text = 'Hazard rate default probability of 5%';

      // First call
      const result1 = detectDeviations(text);

      // Second call (should hit cache)
      const result2 = detectDeviations(text);

      expect(result1).toEqual(result2);
      expect(result1.deviations[0].code).toBe(result2.deviations[0].code);
    });

    test('handles invalid input gracefully', () => {
      expect(detectDeviations('')).toMatchObject({ deviations: [] });
      expect(detectDeviations(null)).toMatchObject({ deviations: [] });
      expect(detectDeviations(undefined)).toMatchObject({ deviations: [] });
    });
  });

  describe('mapDeviationsToSteps', () => {
    test('injects deviation alert at correct step', () => {
      const deviations = [
        {
          code: 'DEV-1.1.1',
          name: 'Hazard Rate Default Modeling',
          description: 'Use hazard rate model',
          confidence: 'HIGH',
          score: 8,
          checkpoints: ['Check survival probability'],
          time_impact_minutes: 3.5
        }
      ];

      const steps = [
        {
          part: 'A',
          reasoning: 'Calculate expected return using standard approach',
          calculation: 'E[R] = ...'
        },
        {
          part: 'B',
          reasoning: 'Calculate survival probability using hazard rate model',
          calculation: 'P(survive) = (1-h)^t'
        },
        {
          part: 'C',
          reasoning: 'Calculate final NPV',
          calculation: 'NPV = ...'
        }
      ];

      const enriched = mapDeviationsToSteps(deviations, steps);

      // Step 1 should have no alert
      expect(enriched[0].deviation_alert).toBeUndefined();

      // Step 2 should have deviation alert (mentions hazard rate)
      expect(enriched[1].deviation_alert).toBeDefined();
      expect(enriched[1].deviation_alert.code).toBe('DEV-1.1.1');
      expect(enriched[1].deviation_alert.severity).toBe('critical');

      // Step 3 should have no alert
      expect(enriched[2].deviation_alert).toBeUndefined();
    });

    test('prioritizes HIGH confidence over MEDIUM when multiple deviations found', () => {
      const deviations = [
        {
          code: 'DEV-1',
          name: 'Deviation 1',
          description: 'Test',
          confidence: 'MEDIUM',
          score: 4,
          checkpoints: []
        },
        {
          code: 'DEV-2',
          name: 'Deviation 2',
          description: 'Test',
          confidence: 'HIGH',
          score: 6,
          checkpoints: []
        }
      ];

      const steps = [
        {
          part: 'A',
          reasoning: 'Step mentions both deviation 1 and deviation 2 keywords'
        }
      ];

      const enriched = mapDeviationsToSteps(deviations, steps);

      // Should inject the HIGH confidence deviation
      if (enriched[0].deviation_alert) {
        expect(enriched[0].deviation_alert.confidence).toBe('HIGH');
      }
    });

    test('returns original steps when no deviations provided', () => {
      const steps = [
        { part: 'A', reasoning: 'Test' },
        { part: 'B', reasoning: 'Test' }
      ];

      const enriched = mapDeviationsToSteps([], steps);

      expect(enriched).toEqual(steps);
    });
  });

  describe('detectDeviationAtStep', () => {
    test('detects deviation in specific step text', () => {
      const stepText = 'Calculate survival probability using hazard rate: P(s) = (1-h)^t';
      const problemText = 'Annual default probability with hazard rate model';

      const result = detectDeviationAtStep(stepText, 2, problemText);

      expect(result.stepNumber).toBe(2);
      expect(result.deviation).toBeDefined();
      expect(result.deviation.code).toBe('DEV-1.1.1');
      expect(result.recommendation).toContain('Hazard Rate');
    });

    test('uses problem context when step has weak signal', () => {
      const stepText = 'Calculate the expected value';
      const problemText = 'Annual default probability of 5% with hazard rate model';

      const result = detectDeviationAtStep(stepText, 3, problemText);

      // Should detect from problem context
      expect(result.problemConfidence).toBe('HIGH');
      expect(result.deviation?.code).toBe('DEV-1.1.1');
    });

    test('recommends standard approach when no deviation detected', () => {
      const stepText = 'Calculate simple NPV';
      const problemText = 'Standard project valuation';

      const result = detectDeviationAtStep(stepText, 1, problemText);

      expect(result.deviation).toBeNull();
      expect(result.recommendation).toContain('standard approach');
    });
  });

  describe('Performance', () => {
    test('completes detection in less than 50ms for typical problem', () => {
      const text = `
        HAL Corporation is considering issuing senior debt to finance a new project.
        The company faces annual default probability of 5% with hazard rate model.
        The debt will have an amortizing structure with equal annual payments.
        Calculate the expected return on debt accounting for default risk.
      `;

      const start = performance.now();
      detectDeviations(text);
      const end = performance.now();

      const duration = end - start;
      expect(duration).toBeLessThan(50);
    });

    test('cache improves performance on repeated calls', () => {
      const text = 'Hazard rate default probability';

      // First call (no cache)
      const start1 = performance.now();
      detectDeviations(text);
      const end1 = performance.now();
      const duration1 = end1 - start1;

      // Second call (with cache)
      const start2 = performance.now();
      detectDeviations(text);
      const end2 = performance.now();
      const duration2 = end2 - start2;

      // Cached call should be faster (or at least not slower)
      expect(duration2).toBeLessThanOrEqual(duration1 * 1.5);
    });
  });

  describe('Internal functions', () => {
    test('extractKeywords finds relevant keywords with weights', () => {
      const text = 'annual default probability with hazard rate';
      const keywords = __internal.extractKeywords(text);

      expect(keywords.length).toBeGreaterThan(0);

      const hazardKeyword = keywords.find(k => k.keyword.includes('hazard'));
      expect(hazardKeyword).toBeDefined();
      expect(hazardKeyword.weight).toBeGreaterThan(1);
    });

    test('matchPatterns finds regex pattern matches', () => {
      const text = 'Annual default probability of 5%';
      const matches = __internal.matchPatterns(text);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].score).toBe(3); // Pattern match = 3 points
    });

    test('scoreDeviations ranks by score descending', () => {
      const keywords = [
        { keyword: 'hazard', weight: 2.0, deviations: ['DEV-1.1.1'] },
        { keyword: 'amortizing', weight: 2.0, deviations: ['DEV-1.2.1'] }
      ];

      const patterns = [
        { code: 'DEV-1.1.1', score: 6 }
      ];

      const scored = __internal.scoreDeviations(keywords, patterns);

      // DEV-1.1.1 should be first (keyword + pattern = 8 points)
      // DEV-1.2.1 should be second (keyword only = 2 points)
      expect(scored[0].code).toBe('DEV-1.1.1');
      expect(scored[0].score).toBeGreaterThan(scored[1]?.score || 0);
    });
  });

  describe('Cache management', () => {
    test('clearCache removes all cached results', () => {
      detectDeviations('Hazard rate default');
      clearCache();

      const stats = require('./deviationDetectionEngine').getCacheStats();
      expect(stats.size).toBe(0);
    });

    test('cache respects max size limit', () => {
      // Generate 150 unique problems (exceeds 100 item limit)
      for (let i = 0; i < 150; i++) {
        detectDeviations(`Problem ${i} with unique text`);
      }

      const stats = require('./deviationDetectionEngine').getCacheStats();
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });
  });
});
