# Comparative Analysis Troubleshooting
## Debugging and Common Issues

**Version**: 1.0
**Last Updated**: 2025-01-25
**Related Documents**:
- [Architecture Guide](../architecture/comparative-analysis.md)
- [API Reference](../api/comparative-analysis-api.md)
- [Integration Guide](../guides/integrating-comp-analysis.md)

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Common Issues](#common-issues)
3. [Debugging Techniques](#debugging-techniques)
4. [Performance Issues](#performance-issues)
5. [Data Quality Issues](#data-quality-issues)
6. [UI Integration Issues](#ui-integration-issues)
7. [FAQ](#faq)

---

## Quick Diagnostics

### Issue Decision Tree

```
Problem: Comp analysis not working
│
├─ No comp analysis displayed?
│  ├─ Check: Is findClosestCompWithDivergenceAnalysis() called?
│  │  └─ Add console.log before call
│  ├─ Check: Is result stored in state?
│  │  └─ console.log(compAnalysis) in component
│  └─ Check: Is UI conditional rendering correct?
│     └─ Try rendering unconditionally
│
├─ hasComp always false?
│  ├─ Check: Similarity scores
│  │  └─ console.log(result.similarityScore)
│  ├─ Check: Problem library loaded?
│  │  └─ console.log(problemLibrary.length)
│  └─ Check: Threshold too high?
│     └─ Try lower threshold (0.5)
│
├─ Wrong comparable found?
│  ├─ Check: Feature extraction
│  │  └─ Log extracted archetype, deviations, keywords
│  ├─ Check: Problem metadata quality
│  │  └─ Verify archetype/deviations are correct
│  └─ Check: Library has better comps?
│     └─ Manually verify expected comp exists
│
└─ Guidance not generated?
   ├─ Check: Divergences detected?
   │  └─ console.log(divergenceAnalysis)
   ├─ Check: Deviations in database?
   │  └─ Search DEVIATION_DATABASE for codes
   └─ Check: UI rendering guidance?
      └─ Try rendering guidance.length
```

---

## Common Issues

### Issue 1: No Comp Found (hasComp = false)

**Symptom**: `hasComp` is always `false` even for similar problems

**Possible Causes**:

**1. Library empty or not loaded**
```javascript
// Check library size
console.log('Library size:', problemLibrary.length);
// Expected: 224 (or similar)
// Actual: 0 or undefined → Library not loaded
```

**Solution**:
```javascript
// Wait for library to load before computing
useEffect(() => {
  if (currentProblem && problemLibrary.length > 0) {
    const analysis = findClosestCompWithDivergenceAnalysis(
      currentProblem,
      problemLibrary
    );
    setCompAnalysis(analysis);
  }
}, [currentProblem, problemLibrary]);
```

**2. Similarity threshold too high**
```javascript
// Check similarity score
const result = findClosestCompWithDivergenceAnalysis(problem, library);
console.log('Similarity score:', result.similarityScore);
// If score is 0.65 but threshold is 0.7 → No match
```

**Solution**:
```javascript
// Lower threshold temporarily for testing
const result = findClosestCompWithDivergenceAnalysis(
  problem,
  library,
  0.5  // Lower threshold
);
```

**3. Problem missing required metadata**
```javascript
// Check problem structure
console.log('Archetype:', extractArchetype(problem));
console.log('Deviations:', extractDeviations(problem));
console.log('Keywords:', extractKeywords(problem));
// If all return empty arrays → No metadata to match on
```

**Solution**:
```javascript
// Enrich problem metadata
problem.archetype = 'A1-CapitalStructure';
problem.deviations = ['DEV-1.1.1'];
problem.keywords = ['debt', 'default', 'YTM'];
```

**4. Library contains only target problem**
```javascript
// Check if library excludes target
const targetId = problem.id;
const candidates = library.filter(p => p.id !== targetId);
console.log('Candidates:', candidates.length);
// If 0 → Library only has target problem
```

**Solution**:
```javascript
// Ensure library has multiple problems
// Check data loading logic
```

---

### Issue 2: Wrong Comparable Found

**Symptom**: System finds a comp, but it's not the expected similar problem

**Diagnosis**:
```javascript
// Log similarity breakdown
const similarity = calculateSimilarity(problem1, problem2);
console.log('Archetype match:', similarity.breakdown.archetypeMatch);
console.log('Deviation overlap:', similarity.breakdown.deviationOverlap);
console.log('Keyword overlap:', similarity.breakdown.keywordOverlap);
console.log('Total score:', similarity.totalScore);

// Log feature comparison
console.log('Problem 1 archetype:', similarity.features.archetype1);
console.log('Problem 2 archetype:', similarity.features.archetype2);
console.log('Problem 1 deviations:', similarity.features.deviations1);
console.log('Problem 2 deviations:', similarity.features.deviations2);
```

**Common Causes**:

**1. Archetype mismatch weighted heavily**
- Archetype is 40% of similarity score
- Even with matching deviations/keywords, different archetypes reduce score significantly

**Solution**: Verify archetypes are correct
```javascript
// Check if archetype assignment is accurate
console.log('Expected archetype:', 'A1-CapitalStructure');
console.log('Actual archetype:', problem.archetype);
```

**2. Keyword noise**
- Too many generic keywords dilute similarity
- Example: ['the', 'and', 'calculate'] don't distinguish problems

**Solution**: Use domain-specific keywords
```javascript
// Good keywords (specific)
keywords: ['tax shield', 'WACC', 'unlevered beta', 'APV']

// Bad keywords (generic)
keywords: ['calculate', 'find', 'determine', 'value']
```

**3. Missing expected comp from library**
```javascript
// Verify expected comp exists in library
const expectedComp = library.find(p => p.id === 'expected-comp-id');
if (!expectedComp) {
  console.error('Expected comp not in library!');
}
```

---

### Issue 3: No Divergences Detected

**Symptom**: `divergenceAnalysis` shows empty arrays

**Diagnosis**:
```javascript
const result = findClosestCompWithDivergenceAnalysis(problem, library);
console.log('Additional deviations:', result.divergenceAnalysis.additionalDeviations);
console.log('Missing deviations:', result.divergenceAnalysis.missingDeviations);
console.log('Additional concepts:', result.divergenceAnalysis.additionalConcepts);
// All empty → Perfect match or missing metadata
```

**Possible Causes**:

**1. Perfect match (100% similarity)**
- Target and comp are identical
- No divergences expected

**Verification**:
```javascript
if (result.similarityScore === 1.0) {
  console.log('Perfect match - no divergences expected');
}
```

**2. Both problems missing deviation metadata**
```javascript
console.log('Target deviations:', extractDeviations(targetProblem));
console.log('Comp deviations:', extractDeviations(result.closestComp));
// Both empty → No deviations to compare
```

**Solution**: Add deviation metadata to problems

**3. Deviations are identical**
```javascript
// Even if both have deviations, they might be the same
const targetDevs = new Set(extractDeviations(targetProblem));
const compDevs = new Set(extractDeviations(result.closestComp));
const additional = [...targetDevs].filter(d => !compDevs.has(d));
console.log('Additional deviations:', additional);
// Empty → Sets are identical
```

---

### Issue 4: Guidance Not Generated

**Symptom**: `adaptationGuidance` array is empty despite divergences

**Diagnosis**:
```javascript
const result = findClosestCompWithDivergenceAnalysis(problem, library);
console.log('Divergences detected:', {
  additional: result.divergenceAnalysis.additionalDeviations.length,
  missing: result.divergenceAnalysis.missingDeviations.length,
  concepts: result.divergenceAnalysis.additionalConcepts.length
});
console.log('Guidance items:', result.divergenceAnalysis.adaptationGuidance.length);
```

**Possible Causes**:

**1. Similarity below threshold**
```javascript
if (!result.hasComp) {
  console.log('Similarity below threshold - guidance skipped');
  console.log('Score:', result.similarityScore);
}
```

**Solution**: Lower threshold or improve problem similarity

**2. Deviation codes not in database**
```javascript
import { DEVIATION_DATABASE } from '../../utils/deviationInjector';

result.divergenceAnalysis.additionalDeviations.forEach(code => {
  const deviation = DEVIATION_DATABASE.find(d => d.code === code);
  if (!deviation) {
    console.error(`Deviation ${code} not in database!`);
  }
});
```

**Solution**: Add missing deviations to `DEVIATION_DATABASE`

**3. All divergences are simplifications**
- Simplifications generate guidance, but with negative time impact
- Check if guidance is being filtered out in UI

```javascript
const allGuidance = result.divergenceAnalysis.adaptationGuidance;
const simplifications = allGuidance.filter(g => g.type === 'simplification');
console.log(`${simplifications.length} simplifications found`);
```

---

### Issue 5: Performance Problems

**Symptom**: Comp analysis takes >100ms, UI lags

**Diagnosis**:
```javascript
console.time('comp-analysis');
const result = findClosestCompWithDivergenceAnalysis(problem, library);
console.timeEnd('comp-analysis');
// Expected: ~10ms for 224 problems
// Actual: >100ms → Performance issue
```

**Common Causes**:

**1. Library too large**
```javascript
console.log('Library size:', library.length);
// >1000 problems → Needs optimization
```

**Solution**: Filter library before analysis
```javascript
// Filter by archetype tier
const tier = extractArchetype(problem).charAt(0);
const filtered = library.filter(p =>
  extractArchetype(p).charAt(0) === tier
);
console.log(`Filtered from ${library.length} to ${filtered.length} problems`);
```

**2. Recomputing unnecessarily**
```javascript
// Anti-pattern: Recompute on every render
function MyComponent() {
  const analysis = findClosestCompWithDivergenceAnalysis(problem, library);
  // This runs on EVERY render!
}

// Solution: Use useEffect or useMemo
function MyComponent() {
  const analysis = useMemo(() =>
    findClosestCompWithDivergenceAnalysis(problem, library),
    [problem.id, library.length]
  );
}
```

**3. Large feature arrays**
```javascript
// Check feature array sizes
const deviations = extractDeviations(problem);
const keywords = extractKeywords(problem);
console.log('Deviations:', deviations.length); // Expected: ~5
console.log('Keywords:', keywords.length);     // Expected: ~10

// If >50 each → Bloated metadata
```

**Solution**: Clean up metadata, remove duplicates

---

## Debugging Techniques

### Technique 1: Similarity Breakdown Analysis

**Purpose**: Understand why two problems have a specific similarity score

```javascript
import { calculateSimilarity } from '../../utils/problemMatcher';

// Compare two specific problems
const similarity = calculateSimilarity(problem1, problem2);

console.group('Similarity Breakdown');
console.log('Total Score:', similarity.totalScore.toFixed(4));

console.group('Components');
console.log('Archetype Match:', similarity.breakdown.archetypeMatch, '(40% weight)');
console.log('Deviation Overlap:', similarity.breakdown.deviationOverlap, '(35% weight)');
console.log('Keyword Overlap:', similarity.breakdown.keywordOverlap, '(25% weight)');
console.groupEnd();

console.group('Features');
console.log('Archetype 1:', similarity.features.archetype1);
console.log('Archetype 2:', similarity.features.archetype2);
console.log('Deviations 1:', similarity.features.deviations1);
console.log('Deviations 2:', similarity.features.deviations2);
console.log('Keywords 1:', similarity.features.keywords1);
console.log('Keywords 2:', similarity.features.keywords2);
console.groupEnd();

console.groupEnd();
```

**Example Output**:
```
Similarity Breakdown
  Total Score: 0.8250
  Components
    Archetype Match: 1.0 (40% weight)
    Deviation Overlap: 0.6667 (35% weight)
    Keyword Overlap: 0.7143 (25% weight)
  Features
    Archetype 1: A1-CapitalStructure
    Archetype 2: A1-CapitalStructure
    Deviations 1: ['DEV-1.1.1', 'DEV-1.2.1', 'DEV-4.1.1']
    Deviations 2: ['DEV-1.1.1', 'DEV-1.2.1']
    Keywords 1: ['debt', 'default', 'tax shield', 'senior', 'junior']
    Keywords 2: ['debt', 'default', 'tax shield', 'YTM']
```

---

### Technique 2: Feature Extraction Validation

**Purpose**: Verify problem metadata is extracted correctly

```javascript
// Test feature extraction
function debugFeatureExtraction(problem) {
  console.group(`Problem: ${problem.id}`);

  console.log('Raw Data:');
  console.log('  archetype:', problem.archetype);
  console.log('  primary_archetype:', problem.primary_archetype);
  console.log('  deviations:', problem.deviations);
  console.log('  keywords:', problem.keywords);
  console.log('  metadata:', problem.metadata);

  console.log('Extracted:');
  console.log('  archetype:', extractArchetype(problem));
  console.log('  deviations:', extractDeviations(problem));
  console.log('  keywords:', extractKeywords(problem));

  console.groupEnd();
}

// Test all problems in library
library.forEach(debugFeatureExtraction);
```

---

### Technique 3: Divergence Analysis Tracing

**Purpose**: Trace how divergences are detected and guidance generated

```javascript
function debugDivergenceAnalysis(target, comp) {
  const targetDevs = new Set(extractDeviations(target));
  const compDevs = new Set(extractDeviations(comp));
  const targetKeys = new Set(extractKeywords(target));
  const compKeys = new Set(extractKeywords(comp));

  console.group('Divergence Analysis');

  console.log('Target Deviations:', [...targetDevs]);
  console.log('Comp Deviations:', [...compDevs]);

  const additional = [...targetDevs].filter(d => !compDevs.has(d));
  const missing = [...compDevs].filter(d => !targetDevs.has(d));
  const newConcepts = [...targetKeys].filter(k => !compKeys.has(k));

  console.log('Additional (target has, comp doesn't):', additional);
  console.log('Missing (comp has, target doesn't):', missing);
  console.log('New Concepts:', newConcepts);

  // Check guidance generation
  const guidance = generateAdaptationGuidance({
    additionalDeviations: additional,
    missingDeviations: missing,
    additionalConcepts: newConcepts,
    targetProblem: target,
    compProblem: comp
  });

  console.log('Generated Guidance:', guidance.length, 'items');
  guidance.forEach((g, idx) => {
    console.log(`  ${idx + 1}. [${g.severity}] ${g.title}`);
  });

  console.groupEnd();
}
```

---

### Technique 4: End-to-End Tracing

**Purpose**: Trace entire comp analysis pipeline

```javascript
function debugCompAnalysis(target, library) {
  console.group('=== COMP ANALYSIS DEBUG ===');

  console.log('Step 1: Input Validation');
  console.log('  Target:', target?.id || 'undefined');
  console.log('  Library size:', library?.length || 0);

  console.log('Step 2: Feature Extraction (Target)');
  const targetArchetype = extractArchetype(target);
  const targetDevs = extractDeviations(target);
  const targetKeys = extractKeywords(target);
  console.log('  Archetype:', targetArchetype);
  console.log('  Deviations:', targetDevs);
  console.log('  Keywords:', targetKeys);

  console.log('Step 3: Similarity Calculation');
  console.time('  Time');
  const similarities = library.map(p => ({
    id: p.id,
    score: calculateSimilarity(target, p).totalScore
  })).sort((a, b) => b.score - a.score);
  console.timeEnd('  Time');
  console.log('  Top 5:');
  similarities.slice(0, 5).forEach(s => {
    console.log(`    ${s.id}: ${s.score.toFixed(4)}`);
  });

  console.log('Step 4: Comp Selection');
  const topMatch = similarities[0];
  console.log('  Selected:', topMatch.id);
  console.log('  Score:', topMatch.score);
  console.log('  Above threshold?', topMatch.score >= 0.7);

  console.log('Step 5: Divergence Detection');
  const comp = library.find(p => p.id === topMatch.id);
  debugDivergenceAnalysis(target, comp);

  console.groupEnd();
}
```

---

## Performance Issues

### Issue: Slow Comp Analysis (>50ms)

**Benchmarking**:
```javascript
// Measure each step
console.time('Total');

console.time('Feature Extraction');
const features = extractAllFeatures(target);
console.timeEnd('Feature Extraction');

console.time('Similarity Calculation');
const similarities = library.map(p => calculateSimilarity(target, p));
console.timeEnd('Similarity Calculation');

console.time('Sorting');
similarities.sort((a, b) => b.totalScore - a.totalScore);
console.timeEnd('Sorting');

console.time('Divergence Analysis');
const divergences = analyzeDivergences(target, closestComp);
console.timeEnd('Divergence Analysis');

console.time('Guidance Generation');
const guidance = generateAdaptationGuidance({ ... });
console.timeEnd('Guidance Generation');

console.timeEnd('Total');
```

**Optimization Strategies**:

**1. Archetype Pre-Filtering**
```javascript
// Reduce library size before analysis
const tier = extractArchetype(target).charAt(0);
const filteredLibrary = library.filter(p => {
  const pTier = extractArchetype(p).charAt(0);
  return pTier === tier;
});
// Typically reduces from 224 to ~40 problems
```

**2. Memoize Feature Extraction**
```javascript
// Cache extracted features to avoid re-extraction
const featureCache = new Map();

function getCachedFeatures(problem) {
  const cacheKey = problem.id;
  if (!featureCache.has(cacheKey)) {
    featureCache.set(cacheKey, {
      archetype: extractArchetype(problem),
      deviations: extractDeviations(problem),
      keywords: extractKeywords(problem)
    });
  }
  return featureCache.get(cacheKey);
}
```

**3. Use Web Workers for Large Libraries**
```javascript
// Offload computation to background thread
// (Advanced - requires restructuring)
const worker = new Worker('compAnalysisWorker.js');
worker.postMessage({ target, library });
worker.onmessage = (e) => {
  setCompAnalysis(e.data);
};
```

---

## Data Quality Issues

### Issue: Inconsistent Problem Metadata

**Symptoms**:
- Some problems match well, others don't
- Similarity scores vary wildly for similar problems

**Audit Script**:
```javascript
function auditProblemMetadata(library) {
  const report = {
    total: library.length,
    missingArchetype: 0,
    missingDeviations: 0,
    missingKeywords: 0,
    problems: []
  };

  library.forEach(problem => {
    const archetype = extractArchetype(problem);
    const deviations = extractDeviations(problem);
    const keywords = extractKeywords(problem);

    const issues = [];
    if (!archetype) {
      issues.push('No archetype');
      report.missingArchetype++;
    }
    if (deviations.length === 0) {
      issues.push('No deviations');
      report.missingDeviations++;
    }
    if (keywords.length === 0) {
      issues.push('No keywords');
      report.missingKeywords++;
    }

    if (issues.length > 0) {
      report.problems.push({
        id: problem.id,
        issues
      });
    }
  });

  console.group('Metadata Audit Report');
  console.log(`Total Problems: ${report.total}`);
  console.log(`Missing Archetype: ${report.missingArchetype} (${(report.missingArchetype / report.total * 100).toFixed(1)}%)`);
  console.log(`Missing Deviations: ${report.missingDeviations} (${(report.missingDeviations / report.total * 100).toFixed(1)}%)`);
  console.log(`Missing Keywords: ${report.missingKeywords} (${(report.missingKeywords / report.total * 100).toFixed(1)}%)`);

  if (report.problems.length > 0) {
    console.log('\nProblems with Issues:');
    report.problems.forEach(p => {
      console.log(`  ${p.id}: ${p.issues.join(', ')}`);
    });
  }
  console.groupEnd();

  return report;
}

// Run audit
const audit = auditProblemMetadata(library);
```

---

## UI Integration Issues

### Issue: Comp Analysis Not Displaying

**Checklist**:

1. **State correctly initialized?**
   ```javascript
   const [compAnalysis, setCompAnalysis] = useState(null);
   // NOT: const compAnalysis = null; (won't update)
   ```

2. **useEffect dependencies correct?**
   ```javascript
   useEffect(() => {
     // ...
   }, [currentProblem, problemLibrary]);
   // Include all variables used in effect
   ```

3. **Conditional rendering logic correct?**
   ```javascript
   {compAnalysis?.hasComp && (
     <CompSummary analysis={compAnalysis} />
   )}
   // NOT: {compAnalysis && ... } (renders for hasComp:false)
   ```

4. **Data passed to child components?**
   ```javascript
   <CompSummaryCard analysis={compAnalysis} />
   // Check that prop name matches in child
   ```

---

## FAQ

### Q: Why is similarity score lower than expected?

**A**: Similarity is weighted:
- Archetype: 40%
- Deviations: 35%
- Keywords: 25%

Even with perfect deviation/keyword overlap, different archetypes cap similarity at 60%.

**Example**:
```
Problem A: Archetype A1, Deviations [DEV-1.1.1], Keywords [debt, YTM]
Problem B: Archetype A2, Deviations [DEV-1.1.1], Keywords [debt, YTM]

Archetype: 0.5 (same tier) × 0.40 = 0.20
Deviations: 1.0 (perfect) × 0.35 = 0.35
Keywords: 1.0 (perfect) × 0.25 = 0.25
Total: 0.80 (80%)
```

---

### Q: Can I change the similarity threshold dynamically?

**A**: Yes, pass as third parameter:

```javascript
// Strict matching
const strictAnalysis = findClosestCompWithDivergenceAnalysis(problem, library, 0.85);

// Lenient matching
const lenientAnalysis = findClosestCompWithDivergenceAnalysis(problem, library, 0.60);

// Dynamic based on problem
const threshold = problem.difficulty === 'hard' ? 0.75 : 0.65;
const analysis = findClosestCompWithDivergenceAnalysis(problem, library, threshold);
```

---

### Q: How do I debug why a specific problem pair doesn't match?

**A**: Use `calculateSimilarity()` directly:

```javascript
const similarity = calculateSimilarity(problem1, problem2);
console.log('Score:', similarity.totalScore);
console.log('Breakdown:', similarity.breakdown);
console.log('Features:', similarity.features);
```

This shows exactly which components contribute to the score.

---

### Q: Can I filter out certain problems from being comps?

**A**: Yes, filter library before analysis:

```javascript
// Exclude specific problems
const filtered = library.filter(p => p.id !== 'problem-to-exclude');

// Only include certain archetypes
const filtered = library.filter(p =>
  extractArchetype(p).startsWith('A1')
);

// Only include problems with solutions
const filtered = library.filter(p => p.solution_steps?.length > 0);

const analysis = findClosestCompWithDivergenceAnalysis(problem, filtered);
```

---

### Q: Why does guidance have empty adaptation steps?

**A**: Check if deviation exists in `DEVIATION_DATABASE`:

```javascript
import { DEVIATION_DATABASE } from '../../utils/deviationInjector';

const devCode = 'DEV-X.Y.Z';
const deviation = DEVIATION_DATABASE.find(d => d.code === devCode);

if (!deviation) {
  console.error(`Deviation ${devCode} not found in database!`);
  // Add to database or remove from problem metadata
}
```

---

### Q: How can I test comp analysis without a full problem library?

**A**: Create a minimal test library:

```javascript
const testLibrary = [
  {
    id: 'test-comp-1',
    archetype: 'A1-CapitalStructure',
    deviations: ['DEV-1.1.1'],
    keywords: ['debt', 'default'],
    title: 'Test Comp 1'
  },
  {
    id: 'test-comp-2',
    archetype: 'A1-CapitalStructure',
    deviations: ['DEV-1.1.1', 'DEV-1.2.1'],
    keywords: ['debt', 'default', 'tax shield'],
    title: 'Test Comp 2'
  }
];

const result = findClosestCompWithDivergenceAnalysis(myProblem, testLibrary);
```

---

## See Also

- **[Architecture Guide](../architecture/comparative-analysis.md)**: System design
- **[API Reference](../api/comparative-analysis-api.md)**: Function documentation
- **[Integration Guide](../guides/integrating-comp-analysis.md)**: How to use in components

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
