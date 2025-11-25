# Comparative Deviation Analysis API
## API Reference

**Version**: 1.0
**Last Updated**: 2025-01-25
**Module**: `src/utils/problemMatcher.js`
**Related Documents**:
- [Architecture Guide](../architecture/comparative-analysis.md)
- [Integration Guide](../guides/integrating-comp-analysis.md)
- [Troubleshooting Guide](../troubleshooting/comp-analysis.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Core Functions](#core-functions)
3. [Helper Functions](#helper-functions)
4. [Data Structures](#data-structures)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)

---

## Overview

The Comparative Analysis API provides three main functions for finding similar problems, detecting divergences, and generating adaptation guidance. All functions are **pure** (no side effects) and **offline** (no network calls).

### Import Statement

```javascript
import {
  findClosestCompWithDivergenceAnalysis,
  generateAdaptationGuidance,
  inferCompApproach,
  calculateSimilarity,
  findSimilarProblems
} from '../../utils/problemMatcher';
```

---

## Core Functions

### findClosestCompWithDivergenceAnalysis()

**Purpose**: Find the closest comparable problem and analyze divergences

**Signature**:
```javascript
function findClosestCompWithDivergenceAnalysis(
  targetProblem: Problem,
  problemLibrary: Problem[],
  similarityThreshold?: number = 0.7
): CompAnalysisResult
```

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `targetProblem` | `Problem` | Yes | - | The problem to find a comparable for |
| `problemLibrary` | `Problem[]` | Yes | - | Array of problems to search |
| `similarityThreshold` | `number` | No | `0.7` | Minimum similarity score (0-1) to consider a match |

**Returns**: `CompAnalysisResult` (see [Data Structures](#data-structures))

**Algorithm**:
1. Find top similar problem using `findSimilarProblems()`
2. Extract features (archetype, deviations, keywords) from both problems
3. Identify divergences:
   - Additional deviations in target (added complexity)
   - Missing deviations from comp (simplification)
   - Additional concepts/keywords (conceptual extension)
4. Generate adaptation guidance if similarity ≥ threshold
5. Return structured result with `hasComp` flag

**Example**:
```javascript
const targetProblem = {
  id: 'exam-problem-1',
  archetype: 'A1-CapitalStructure',
  deviations: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-4.1.1'],
  keywords: ['debt', 'default', 'tax shield', 'senior', 'junior'],
  problem_text: '...'
};

const library = [...]; // Load from JSON

const result = findClosestCompWithDivergenceAnalysis(targetProblem, library);

if (result.hasComp) {
  console.log(`Similar to: ${result.closestComp.title}`);
  console.log(`Match: ${Math.round(result.similarityScore * 100)}%`);
  console.log(`Divergences: ${result.divergenceAnalysis.additionalDeviations.length}`);
}
```

**Performance**: ~10ms for 224 problems

**Edge Cases**:
- Empty library → `hasComp: false`
- Missing target fields → Uses default empty arrays
- No match above threshold → `hasComp: false`, best match still returned
- Perfect match (100% similarity) → `hasComp: true`, empty divergences

---

### generateAdaptationGuidance()

**Purpose**: Create step-by-step guidance for adapting from comparable to target

**Signature**:
```javascript
function generateAdaptationGuidance({
  additionalDeviations = [],
  missingDeviations = [],
  additionalConcepts = [],
  targetProblem = {},
  compProblem = {}
}): AdaptationGuidance[]
```

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `additionalDeviations` | `string[]` | No | `[]` | Deviation codes in target but not in comp |
| `missingDeviations` | `string[]` | No | `[]` | Deviation codes in comp but not in target |
| `additionalConcepts` | `string[]` | No | `[]` | Keywords in target but not in comp |
| `targetProblem` | `Problem` | No | `{}` | Target problem object (for context) |
| `compProblem` | `Problem` | No | `{}` | Comparable problem object (for approach inference) |

**Returns**: `AdaptationGuidance[]` (see [Data Structures](#data-structures))

**Content Sources**:
- Deviation metadata from `DEVIATION_DATABASE`
- High-level approach from `inferCompApproach(compProblem)`
- Checkpoints limited to 2 per deviation

**Example**:
```javascript
const guidance = generateAdaptationGuidance({
  additionalDeviations: ['DEV-1.2.1', 'DEV-4.1.1'],
  missingDeviations: [],
  additionalConcepts: ['tax shield', 'senior', 'junior'],
  targetProblem: { archetype: 'A1-CapitalStructure' },
  compProblem: { archetype: 'A1-CapitalStructure' }
});

guidance.forEach(item => {
  console.log(`${item.severity.toUpperCase()}: ${item.title}`);
  console.log(`Description: ${item.description}`);
  console.log(`Time Impact: +${item.timeImpact} minutes`);
  item.adaptationSteps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
});

// Output:
// CRITICAL: Your problem adds: Absolute Priority Rule Waterfall
// Description: Unlike the comparable, your problem involves multiple tranches
// Time Impact: +2.5 minutes
//   1. Start with comp's approach: Calculate expected returns on debt
//   2. Then add: Apply waterfall (Senior → Junior → Equity)
//   3. Verify: Senior gets paid first, up to full amount
```

**Sorting**: Guidance items ordered by severity (critical > high > medium > low)

**Performance**: ~1ms (database lookups + array operations)

---

### inferCompApproach()

**Purpose**: Infer high-level approach from comparable problem's archetype

**Signature**:
```javascript
function inferCompApproach(compProblem: Problem): string
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `compProblem` | `Problem` | Yes | Comparable problem with archetype field |

**Returns**: `string` - High-level approach description

**Archetype Mapping**:

| Archetype | Approach |
|-----------|----------|
| `A1-CapitalStructure` | "Calculate expected returns on debt using survival probabilities, then use in valuation" |
| `A2-MultiState` | "Calculate equity and debt values in each state using max(0, V - D), then take expectations" |
| `A2B-AdverseSelection` | "Identify separating or pooling equilibrium, check incentive compatibility constraints" |
| `A3-CAPM` | "Calculate beta for the project or firm, use CAPM to find required return" |
| `A4-Payout` | "Compare dividend vs repurchase using tax implications and shareholder wealth effects" |
| `A6-Distress` | "Apply absolute priority rule waterfall: Senior → Junior → Equity" |
| `A10-Options` | "Use option pricing formulas or put-call parity to value the position" |
| Unknown | "Follow the comparable problem's methodology and adapt to your specific case" |

**Example**:
```javascript
const compProblem = {
  archetype: 'A1-CapitalStructure',
  title: 'Bond Default with Hazard Rate'
};

const approach = inferCompApproach(compProblem);
console.log(approach);
// "Calculate expected returns on debt using survival probabilities, then use in valuation"
```

**Fallback Behavior**: If archetype not in mapping, tries tier match (e.g., "A1" matches "A1-CapitalStructure"), then generic fallback

---

## Helper Functions

### calculateSimilarity()

**Purpose**: Calculate similarity score between two problems

**Signature**:
```javascript
function calculateSimilarity(problem1: Problem, problem2: Problem): SimilarityResult
```

**Returns**:
```javascript
{
  totalScore: 0.85,
  breakdown: {
    archetypeMatch: 1.0,    // 40% weight
    deviationOverlap: 0.75, // 35% weight
    keywordOverlap: 0.60    // 25% weight
  },
  features: {
    archetype1: 'A1-CapitalStructure',
    archetype2: 'A1-CapitalStructure',
    deviations1: ['DEV-1.1.1', 'DEV-1.2.1'],
    deviations2: ['DEV-1.1.1'],
    keywords1: ['debt', 'default', 'tax shield'],
    keywords2: ['debt', 'default', 'YTM']
  }
}
```

**Formula**:
```
totalScore = (archetypeScore × 0.40) +
             (deviationScore × 0.35) +
             (keywordScore × 0.25)
```

**Archetype Scoring**:
- Exact match: 1.0
- Same tier (e.g., both A1): 0.5
- Different tiers: 0.0

**Overlap Scoring**: Jaccard similarity = |A ∩ B| / |A ∪ B|

---

### findSimilarProblems()

**Purpose**: Find top N similar problems to target

**Signature**:
```javascript
function findSimilarProblems(
  targetProblem: Problem,
  problemLibrary: Problem[],
  limit?: number = 5
): SimilarityResults
```

**Returns**:
```javascript
{
  similarProblems: [
    {
      problem: { id: 'comp1', ... },
      similarityScore: 0.85,
      breakdown: { archetypeMatch: 1.0, deviationOverlap: 0.75, keywordOverlap: 0.60 },
      explanation: "Same archetype (A1-CapitalStructure), 2 shared deviations, 3 common keywords"
    }
  ],
  totalCandidates: 223,
  targetProblem: {
    id: 'target-id',
    archetype: 'A1-CapitalStructure',
    deviations: [...],
    keywords: [...]
  }
}
```

**Filtering**: Excludes target problem itself, filters out zero-similarity matches

**Sorting**: Descending by similarity score

---

## Data Structures

### Problem

```javascript
{
  // Required fields
  id: string,                          // Unique identifier

  // Archetype (at least one location required)
  archetype?: string,                  // Direct archetype field
  primary_archetype?: string,          // Alternative location
  metadata?: {
    archetype?: string                 // Nested location
  },

  // Deviations (optional, checked in multiple locations)
  deviation?: string,                  // Single deviation
  deviations?: string[],               // Array of deviations
  metadata?: {
    deviations?: string | string[]     // Nested deviations
  },

  // Keywords (optional, checked in multiple locations)
  keywords?: string[],                 // Direct keywords
  matchedKeywords?: string[],          // From archetype scan
  metadata?: {
    keywords?: string[]                // Nested keywords
  },

  // Optional fields
  title?: string,
  problem_text?: string,
  problem_intro?: string,
  solution_steps?: SolutionStep[],
  estimated_time_minutes?: number
}
```

### CompAnalysisResult

```javascript
{
  hasComp: boolean,                    // True if similarity ≥ threshold
  closestComp: Problem | null,         // Best matching problem (null if no match)
  similarityScore: number,             // 0.0 to 1.0 (rounded to 4 decimals)
  divergenceAnalysis: {
    additionalDeviations: string[],    // In target, not in comp
    missingDeviations: string[],       // In comp, not in target
    additionalConcepts: string[],      // Keywords in target, not in comp
    adaptationGuidance: AdaptationGuidance[]
  }
}
```

### AdaptationGuidance

```javascript
{
  type: 'additional_complexity' | 'simplification' | 'conceptual_extension',
  code: string,                        // Deviation code or 'CONCEPT-EXTENSION'
  title: string,                       // Human-readable title
  description: string,                 // Explanation of the divergence
  adaptationSteps: string[],           // Step-by-step adaptation instructions
  timeImpact: number,                  // Minutes added (positive) or saved (negative)
  severity: 'critical' | 'high' | 'medium' | 'low'
}
```

### SimilarityResult

```javascript
{
  totalScore: number,                  // 0.0 to 1.0 (weighted average)
  breakdown: {
    archetypeMatch: number,            // 0.0 to 1.0
    deviationOverlap: number,          // 0.0 to 1.0
    keywordOverlap: number             // 0.0 to 1.0
  },
  features: {
    archetype1: string,
    archetype2: string,
    deviations1: string[],
    deviations2: string[],
    keywords1: string[],
    keywords2: string[]
  }
}
```

---

## Usage Examples

### Example 1: Basic Comp Analysis in React Component

```javascript
import React, { useState, useEffect } from 'react';
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';

function MyComponent() {
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [problems, setProblems] = useState([]);
  const currentProblem = problems[0];

  useEffect(() => {
    // Load problem library
    fetch('/source-materials/guided_examples_v11.json')
      .then(res => res.json())
      .then(data => setProblems(data.worked_examples));
  }, []);

  useEffect(() => {
    if (currentProblem && problems.length > 0) {
      const analysis = findClosestCompWithDivergenceAnalysis(
        currentProblem,
        problems
      );
      setCompAnalysis(analysis);
    }
  }, [currentProblem, problems]);

  if (!compAnalysis) return <div>Loading...</div>;

  return (
    <div>
      {compAnalysis.hasComp ? (
        <div>
          <h3>Similar to: {compAnalysis.closestComp.title}</h3>
          <p>Match: {Math.round(compAnalysis.similarityScore * 100)}%</p>
          <h4>Key differences:</h4>
          <ul>
            {compAnalysis.divergenceAnalysis.additionalDeviations.map(dev => (
              <li key={dev}>Your problem adds: {dev}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No close comparable found</div>
      )}
    </div>
  );
}
```

### Example 2: Custom Similarity Threshold

```javascript
// More strict matching (85% required)
const strictAnalysis = findClosestCompWithDivergenceAnalysis(
  targetProblem,
  library,
  0.85  // Higher threshold
);

// More lenient matching (60% sufficient)
const lenientAnalysis = findClosestCompWithDivergenceAnalysis(
  targetProblem,
  library,
  0.60  // Lower threshold
);
```

### Example 3: Using Adaptation Guidance

```javascript
const result = findClosestCompWithDivergenceAnalysis(targetProblem, library);

if (result.hasComp && result.divergenceAnalysis.adaptationGuidance.length > 0) {
  const guidance = result.divergenceAnalysis.adaptationGuidance;

  // Filter by severity
  const criticalGuidance = guidance.filter(g => g.severity === 'critical');

  // Calculate total time impact
  const totalTimeAdded = guidance.reduce((sum, g) => sum + g.timeImpact, 0);

  // Group by type
  const byType = {
    complexity: guidance.filter(g => g.type === 'additional_complexity'),
    simplification: guidance.filter(g => g.type === 'simplification'),
    conceptual: guidance.filter(g => g.type === 'conceptual_extension')
  };

  console.log(`Total time impact: +${totalTimeAdded} minutes`);
  console.log(`Critical items: ${criticalGuidance.length}`);
}
```

### Example 4: Manual Divergence Analysis

```javascript
import { generateAdaptationGuidance } from '../../utils/problemMatcher';

// Manually specify divergences
const guidance = generateAdaptationGuidance({
  additionalDeviations: ['DEV-1.2.1'],
  missingDeviations: [],
  additionalConcepts: ['WACC', 'unlevered beta'],
  targetProblem: {
    archetype: 'A1-CapitalStructure',
    title: 'My Problem'
  },
  compProblem: {
    archetype: 'A1-CapitalStructure',
    title: 'Reference Problem'
  }
});

console.log(`Generated ${guidance.length} guidance items`);
```

### Example 5: Batch Analysis

```javascript
// Analyze multiple problems
const targets = [problem1, problem2, problem3];

const results = targets.map(target => ({
  problem: target,
  analysis: findClosestCompWithDivergenceAnalysis(target, library)
}));

// Find problems without good comps
const noComps = results.filter(r => !r.analysis.hasComp);
console.log(`${noComps.length} problems need archetype guide instead`);

// Find problems with critical divergences
const criticalDivergences = results.filter(r =>
  r.analysis.hasComp &&
  r.analysis.divergenceAnalysis.adaptationGuidance.some(g => g.severity === 'critical')
);
console.log(`${criticalDivergences.length} problems have critical deviations`);
```

### Example 6: Similarity Breakdown Analysis

```javascript
import { calculateSimilarity } from '../../utils/problemMatcher';

const similarity = calculateSimilarity(problem1, problem2);

console.log(`Total Score: ${similarity.totalScore}`);
console.log('Breakdown:');
console.log(`  Archetype: ${similarity.breakdown.archetypeMatch} (40% weight)`);
console.log(`  Deviations: ${similarity.breakdown.deviationOverlap} (35% weight)`);
console.log(`  Keywords: ${similarity.breakdown.keywordOverlap} (25% weight)`);

// Identify why similarity is low
if (similarity.totalScore < 0.5) {
  if (similarity.breakdown.archetypeMatch === 0) {
    console.log('❌ Different archetypes - not comparable');
  } else if (similarity.breakdown.deviationOverlap < 0.3) {
    console.log('⚠️ Very different deviations - weak match');
  } else {
    console.log('ℹ️ Similar type but different keywords');
  }
}
```

---

## Error Handling

### Input Validation

All functions handle missing or malformed inputs gracefully:

```javascript
// Empty library
const result1 = findClosestCompWithDivergenceAnalysis(problem, []);
// Returns: { hasComp: false, closestComp: null, similarityScore: 0, ... }

// Null/undefined target
const result2 = findClosestCompWithDivergenceAnalysis(null, library);
// Returns: { hasComp: false, closestComp: null, ... }

// Missing fields in problem
const incompleteProblem = { id: 'test' }; // No archetype, deviations, keywords
const result3 = findClosestCompWithDivergenceAnalysis(incompleteProblem, library);
// Works: Uses empty arrays for missing fields

// Empty guidance inputs
const guidance = generateAdaptationGuidance({
  additionalDeviations: [],
  missingDeviations: [],
  additionalConcepts: []
});
// Returns: [] (empty array)
```

### Common Issues and Solutions

#### Issue: Low similarity scores for expected matches

**Cause**: Mismatched field names (archetype vs primary_archetype)

**Solution**: Use feature extraction functions handle multiple locations
```javascript
// Feature extraction checks multiple locations automatically
const archetype = extractArchetype(problem);
// Checks: problem.archetype, problem.primary_archetype, problem.metadata.archetype
```

#### Issue: Missing deviation in adaptation guidance

**Cause**: Deviation code not in `DEVIATION_DATABASE`

**Solution**: Add missing deviation to database
```javascript
// If deviation code doesn't exist in database, it's skipped silently
// Check: DEVIATION_DATABASE.find(d => d.code === 'DEV-X.Y.Z')
```

#### Issue: No comp found despite similar problems

**Cause**: Similarity below 70% threshold

**Solution**: Lower threshold or improve problem metadata
```javascript
// Option 1: Lower threshold
const result = findClosestCompWithDivergenceAnalysis(problem, library, 0.6);

// Option 2: Enrich problem metadata (add more keywords/deviations)
problem.keywords = [...problem.keywords, 'additional', 'keywords'];
```

---

## Performance Tips

### 1. Filter Library by Archetype First

```javascript
// Instead of searching all problems
const result = findClosestCompWithDivergenceAnalysis(problem, allProblems);

// Filter by archetype tier first (faster for large libraries)
const sameTier = allProblems.filter(p =>
  extractArchetype(p).startsWith(extractArchetype(problem).charAt(0))
);
const result = findClosestCompWithDivergenceAnalysis(problem, sameTier);
```

### 2. Reuse Similarity Results

```javascript
// If you need both similarity list and divergence analysis:
const similarities = findSimilarProblems(problem, library, 5);
const topMatch = similarities.similarProblems[0];

// Don't call findClosestCompWithDivergenceAnalysis separately
// Instead, manually construct divergence analysis from top match
```

### 3. Memoize Expensive Computations

```javascript
import { useMemo } from 'react';

const compAnalysis = useMemo(() => {
  return findClosestCompWithDivergenceAnalysis(currentProblem, problems);
}, [currentProblem.id, problems.length]); // Only recompute when problem changes
```

---

## TypeScript Support

While the codebase uses JavaScript, here are TypeScript definitions for reference:

```typescript
interface Problem {
  id: string;
  archetype?: string;
  primary_archetype?: string;
  deviations?: string[];
  keywords?: string[];
  metadata?: {
    archetype?: string;
    deviations?: string[];
    keywords?: string[];
  };
  title?: string;
  problem_text?: string;
}

interface CompAnalysisResult {
  hasComp: boolean;
  closestComp: Problem | null;
  similarityScore: number;
  divergenceAnalysis: {
    additionalDeviations: string[];
    missingDeviations: string[];
    additionalConcepts: string[];
    adaptationGuidance: AdaptationGuidance[];
  };
}

interface AdaptationGuidance {
  type: 'additional_complexity' | 'simplification' | 'conceptual_extension';
  code: string;
  title: string;
  description: string;
  adaptationSteps: string[];
  timeImpact: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

function findClosestCompWithDivergenceAnalysis(
  targetProblem: Problem,
  problemLibrary: Problem[],
  similarityThreshold?: number
): CompAnalysisResult;

function generateAdaptationGuidance(params: {
  additionalDeviations?: string[];
  missingDeviations?: string[];
  additionalConcepts?: string[];
  targetProblem?: Problem;
  compProblem?: Problem;
}): AdaptationGuidance[];

function inferCompApproach(compProblem: Problem): string;
```

---

## See Also

- **[Architecture Guide](../architecture/comparative-analysis.md)**: System design and components
- **[Integration Guide](../guides/integrating-comp-analysis.md)**: How to use in new components
- **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)**: Debugging and common issues
- **[Design Document](../plans/2025-01-25-comparative-deviation-analysis.md)**: Design rationale

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
