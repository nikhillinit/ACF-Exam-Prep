# Comparative Deviation Analysis System
## Complete Documentation

**Version**: 1.0
**System Status**: Production
**Last Updated**: 2025-01-25

---

## Overview

The **Comparative Deviation Analysis System** is an offline-first, platform-driven guidance engine that automatically:
1. Identifies the closest comparable problem from the library
2. Highlights divergences (additional deviations, missing complexity, new concepts)
3. Provides progressive scaffolding with step-by-step adaptation guidance

### Key Features

- **Automatic**: Runs on every problem load, no user action required
- **Offline**: Pure client-side, works without internet (~10ms computation)
- **Progressive**: Three-level disclosure (divergences → guidance → solution)
- **Smart**: Hybrid similarity scoring (archetype 40%, deviations 35%, keywords 25%)
- **Actionable**: Step-by-step adaptation hints from deviation database

---

## Quick Start

### For Users

**What you'll see:**

When viewing a problem, you'll automatically see:

```
┌─────────────────────────────────────────────┐
│ 🔍 Similar to: "Bond Default with Hazard   │
│     Rate" (85% match)                       │
│                                             │
│ Key differences:                            │
│ • Your problem adds: Tax Shield Discount   │
│   Rate                                      │
│ • Your problem adds: Multiple Tranches     │
│                                             │
│ [View Adaptive Guidance] [Show Solution]   │
└─────────────────────────────────────────────┘
```

**Click "View Adaptive Guidance"** to see step-by-step hints:

```
📋 How to Adapt from the Comparable:

⚠️ Your problem adds: Tax Shield Discount Rate
Unlike the comparable, your problem involves tax shields

▸ Show adaptation steps
  1. Start with comp's approach: Calculate E[r_D]
  2. Then add: Discount tax shields at r_D
  3. Verify: Tax shields only exist if debt is paid

⏱️ Adds ~2.5 minutes
```

### For Developers

**Basic Integration** (5 minutes):

```javascript
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';

const [compAnalysis, setCompAnalysis] = useState(null);

useEffect(() => {
  if (currentProblem && problemLibrary.length > 0) {
    const analysis = findClosestCompWithDivergenceAnalysis(
      currentProblem,
      problemLibrary
    );
    setCompAnalysis(analysis);
  }
}, [currentProblem, problemLibrary]);

// Display results
{compAnalysis?.hasComp && (
  <CompSummaryCard analysis={compAnalysis} />
)}
```

See **[Integration Guide](../guides/integrating-comp-analysis.md)** for complete examples.

---

## Documentation Index

### 1. Architecture & Design

| Document | Purpose | Audience |
|----------|---------|----------|
| **[Architecture Guide](../architecture/comparative-analysis.md)** | System design, components, data flow | Developers, Architects |
| **[Design Decisions](../DESIGN_DECISIONS.md)** | Rationale for key choices, trade-offs | All stakeholders |
| **[Design Document (Original)](../plans/2025-01-25-comparative-deviation-analysis.md)** | Detailed design spec from planning phase | Developers, PMs |

**Start here if**: You want to understand how the system works or why decisions were made.

### 2. API & Integration

| Document | Purpose | Audience |
|----------|---------|----------|
| **[API Reference](../api/comparative-analysis-api.md)** | Function signatures, parameters, examples | Developers |
| **[Integration Guide](../guides/integrating-comp-analysis.md)** | How to add comp analysis to components | Frontend Developers |

**Start here if**: You want to use comp analysis in your code.

### 3. Testing & Troubleshooting

| Document | Purpose | Audience |
|----------|---------|----------|
| **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)** | Common issues, debugging techniques | Developers, Support |
| **[Unit Tests](../../src/utils/problemMatcher.test.js)** | Backend function tests | Developers |
| **[Component Tests](../../src/components/practice/ProblemViewer.test.jsx)** | UI integration tests | Frontend Developers |

**Start here if**: Something isn't working or you need to debug.

---

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────┐
│                     USER INTERFACE                        │
│  ┌──────────────┐                 ┌──────────────┐      │
│  │ ProblemViewer │                │  ReconView   │      │
│  │  (Primary)   │                 │ (Secondary)  │      │
│  └──────┬───────┘                 └──────┬───────┘      │
│         │                                │              │
└─────────┼────────────────────────────────┼──────────────┘
          │                                │
          ▼                                ▼
┌──────────────────────────────────────────────────────────┐
│            COMPARATIVE ANALYSIS ENGINE                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  findClosestCompWithDivergenceAnalysis()           │  │
│  │                                                     │  │
│  │  1. Find similar problems (hybrid scoring)         │  │
│  │  2. Select top match (if ≥70% similarity)          │  │
│  │  3. Detect divergences (array comparisons)         │  │
│  │  4. Generate guidance (from deviation database)    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
          │                                │
          ▼                                ▼
┌──────────────────────────────────────────────────────────┐
│                    DATA SOURCES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Problem    │  │  DEVIATION_  │  │  Archetype   │  │
│  │   Library    │  │  DATABASE    │  │   Signals    │  │
│  │  (224 probs) │  │  (~50 devs)  │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

```
Problem loads
    ↓
Extract features (archetype, deviations, keywords)
    ↓
Calculate similarity with all library problems (~10ms)
    ↓
Select top match
    ↓
Compare feature arrays → Detect divergences
    ↓
Lookup divergences in DEVIATION_DATABASE
    ↓
Generate adaptation guidance (steps, time impact, severity)
    ↓
Return result { hasComp, closestComp, similarityScore, divergenceAnalysis }
    ↓
UI renders progressive disclosure
```

---

## Core Concepts

### Similarity Scoring

**Formula**:
```
Similarity = (Archetype × 0.40) +
             (Deviations × 0.35) +
             (Keywords × 0.25)
```

**Component Scoring**:
- **Archetype**: Exact match (1.0) > Same tier (0.5) > Different (0.0)
- **Deviations**: Jaccard similarity = |A ∩ B| / |A ∪ B|
- **Keywords**: Jaccard similarity (normalized, lowercase)

**Threshold**: 70% minimum for "good comp" (hasComp = true)

### Divergence Types

| Type | Description | Example |
|------|-------------|---------|
| **Additional Complexity** | Target has deviation that comp doesn't | Comp: basic CAPM<br>Target: adds tax shields |
| **Simplification** | Comp has deviation that target doesn't | Comp: multi-state model<br>Target: single state |
| **Conceptual Extension** | Target introduces new concepts (keywords) | Comp: debt pricing<br>Target: adds WACC, beta |

### Progressive Disclosure

**Level 1 (Automatic)**: Comp summary with divergences
- Always visible if hasComp = true
- Shows similarity score, key differences
- Provides context for problem

**Level 2 (Optional)**: Adaptive guidance
- User clicks "View Adaptive Guidance"
- Step-by-step adaptation instructions
- Sorted by severity (critical → high → medium → low)

**Level 3 (Override)**: Full solution
- User clicks "Show Solution" (available anytime)
- Complete worked solution
- Comp summary hidden (context shift)

---

## Key Algorithms

### Feature Extraction

**Problem**: Problems have inconsistent schemas (archetype vs primary_archetype)

**Solution**: Flexible extraction functions
```javascript
function extractArchetype(problem) {
  return problem.archetype ||
         problem.primary_archetype ||
         problem.metadata?.archetype ||
         '';
}

function extractDeviations(problem) {
  const deviations = [];
  if (problem.deviation) deviations.push(problem.deviation);
  if (problem.deviations) deviations.push(...problem.deviations);
  if (problem.metadata?.deviations) deviations.push(...problem.metadata.deviations);
  return [...new Set(deviations)]; // Deduplicate
}
```

**Benefits**: Handles schema evolution, backward compatible, no mutation

### Similarity Calculation

**Problem**: Need to compare problems across multiple dimensions

**Solution**: Weighted hybrid scoring
```javascript
function calculateSimilarity(problem1, problem2) {
  const archetypeScore = calculateArchetypeSimilarity(
    extractArchetype(problem1),
    extractArchetype(problem2)
  );

  const deviationScore = jaccardSimilarity(
    extractDeviations(problem1),
    extractDeviations(problem2)
  );

  const keywordScore = jaccardSimilarity(
    extractKeywords(problem1),
    extractKeywords(problem2)
  );

  return {
    totalScore: (archetypeScore * 0.40) +
                (deviationScore * 0.35) +
                (keywordScore * 0.25),
    breakdown: { archetypeScore, deviationScore, keywordScore }
  };
}
```

**Complexity**: O(n) for n library problems (each comparison is O(1))

### Guidance Generation

**Problem**: Need actionable step-by-step hints, not generic advice

**Solution**: Extract from deviation database
```javascript
function generateAdaptationGuidance({ additionalDeviations, compProblem }) {
  return additionalDeviations.map(devCode => {
    const deviation = DEVIATION_DATABASE.find(d => d.code === devCode);
    const approach = inferCompApproach(compProblem);

    return {
      type: 'additional_complexity',
      title: `Your problem adds: ${deviation.name}`,
      description: `Unlike the comparable, your problem involves ${deviation.name.toLowerCase()}`,
      adaptationSteps: [
        `Start with comp's approach: ${approach}`,
        `Then add: ${deviation.explanation}`,
        ...deviation.checkpoints.slice(0, 2) // Limit to 2
      ],
      timeImpact: deviation.time_impact_minutes,
      severity: deviation.severity
    };
  });
}
```

**Content Source**: Existing `DEVIATION_DATABASE` (single source of truth)

---

## Implementation Files

### Backend Engine

| File | Purpose | LOC |
|------|---------|-----|
| `src/utils/problemMatcher.js` | Core matching and divergence analysis | ~740 |
| `src/utils/deviationInjector.js` | Deviation database (content source) | ~200 |
| `src/utils/archetypeScanner.js` | Archetype detection from text | ~150 |

### Frontend UI

| File | Purpose | LOC |
|------|---------|-----|
| `src/components/practice/ProblemViewer.jsx` | Primary UI integration | ~530 |
| `src/components/reconnaissance/ReconView.jsx` | Secondary UI (pasted text) | ~290 |

### Tests

| File | Purpose | Coverage |
|------|---------|----------|
| `src/utils/problemMatcher.test.js` | Backend unit tests | 100% |
| `src/components/practice/ProblemViewer.test.jsx` | Frontend component tests | 95% |

---

## Performance Characteristics

| Metric | Value | Target |
|--------|-------|--------|
| **Similarity Calculation** | ~8ms (224 problems) | < 50ms |
| **Divergence Analysis** | ~1ms | < 5ms |
| **Guidance Generation** | ~1ms | < 5ms |
| **Total** | ~10ms | < 50ms |
| **Memory** | ~8MB (library + state) | < 50MB |

### Scaling Limits

| Library Size | Performance | Action Needed |
|--------------|-------------|---------------|
| 224 problems | ✅ ~10ms | None |
| 500 problems | ✅ ~22ms | Monitor |
| 1,000 problems | ⚠️ ~45ms | Consider archetype filtering |
| 5,000 problems | ❌ ~225ms | Requires optimization (indexing) |

---

## Common Use Cases

### 1. Student Practice Mode

**Scenario**: Student working through practice problems

**Flow**:
1. Student selects problem from library
2. Problem loads → Comp analysis auto-runs
3. Comp summary appears: "Similar to Problem X (85% match)"
4. Student reads divergences: "Your problem adds: Tax Shields"
5. Student clicks "View Adaptive Guidance"
6. Guidance shows: "Start with X, then add Y, verify Z"
7. Student attempts solution with hints
8. If stuck, clicks "Show Solution" for full answer

**Value**: Scaffolded learning, connects new to known

### 2. Exam Reconnaissance

**Scenario**: Student pastes exam question to understand approach

**Flow**:
1. Student pastes problem text into ReconView
2. System scans for archetypes and keywords
3. Creates problem object from scanned data
4. Runs comp analysis against library
5. Shows: "This is similar to guided example #12"
6. Student navigates to example #12 to study approach
7. Returns to exam with understanding

**Value**: Quick orientation, reduces panic

### 3. Instructor Analytics

**Scenario**: Instructor wants to understand problem coverage

**Flow**:
1. Load all problems in library
2. Run comp analysis for each problem
3. Aggregate results:
   - How many have good comps (≥70%)?
   - Which problems are "orphans" (no comp)?
   - What's average divergence count?
4. Identify gaps in problem coverage
5. Create new problems to fill gaps

**Value**: Data-driven curriculum design

---

## Troubleshooting Quick Reference

### Problem: No comp found (hasComp = false)

**Checklist**:
- [ ] Problem library loaded? (`console.log(library.length)`)
- [ ] Similarity score checked? (`console.log(result.similarityScore)`)
- [ ] Threshold too high? (Try 0.5 temporarily)
- [ ] Problem has metadata? (archetype, deviations, keywords)

### Problem: Wrong comp found

**Checklist**:
- [ ] Similarity breakdown analyzed? (`console.log(similarity.breakdown)`)
- [ ] Archetype correct? (`console.log(extractArchetype(problem))`)
- [ ] Expected comp exists? (`library.find(p => p.id === 'expected-id')`)
- [ ] Keywords too noisy? (Check for generic terms)

### Problem: No guidance generated

**Checklist**:
- [ ] Divergences detected? (`console.log(divergenceAnalysis)`)
- [ ] Deviations in database? (`DEVIATION_DATABASE.find(d => d.code === ...)`)
- [ ] Similarity above threshold? (`result.hasComp === true`)

See **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)** for detailed debugging.

---

## Extension Guide

### Adding a New Deviation

1. Add to `DEVIATION_DATABASE` in `src/utils/deviationInjector.js`:
   ```javascript
   {
     code: 'DEV-X.Y.Z',
     name: 'My New Deviation',
     explanation: 'What makes this unique',
     checkpoints: ['Verify step 1', 'Verify step 2'],
     time_impact_minutes: 3.0,
     severity: 'high'
   }
   ```

2. Tag problems with deviation code in JSON files

3. Guidance auto-generates (no code changes needed)

### Adding a New Archetype

1. Update `inferCompApproach()` in `src/utils/problemMatcher.js`:
   ```javascript
   const approachMap = {
     'AX-NewArchetype': 'High-level approach description'
   };
   ```

2. Tag problems with new archetype in JSON

3. Similarity calculation works automatically

### Customizing Similarity Weights

**Current**: 40% archetype, 35% deviations, 25% keywords

**To change**: Edit `src/utils/problemMatcher.js:209-211`
```javascript
const ARCHETYPE_WEIGHT = 0.30;  // Decreased
const DEVIATION_WEIGHT = 0.50;  // Increased
const KEYWORD_WEIGHT = 0.20;    // Decreased
```

**Warning**: Test extensively, keep total = 1.0

---

## Testing

### Run Tests

```bash
# Backend unit tests
npm test src/utils/problemMatcher.test.js

# Frontend component tests
npm test src/components/practice/ProblemViewer.test.jsx

# All tests
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

**Expected**:
- Backend functions: 100% coverage
- Frontend components: 95% coverage

### Writing New Tests

**Backend test template**:
```javascript
describe('myFunction', () => {
  it('should handle normal case', () => {
    const result = myFunction(input);
    expect(result).toEqual(expected);
  });

  it('should handle edge case', () => {
    const result = myFunction(edgeInput);
    expect(result).toEqual(edgeExpected);
  });
});
```

See **[API Reference](../api/comparative-analysis-api.md)** for function signatures.

---

## FAQ

### Q: Does comp analysis require internet?

**A**: No. All computation is client-side, using locally loaded JSON files. Works 100% offline.

### Q: How long does comp analysis take?

**A**: ~10ms for 224 problems. Runs automatically on problem load without noticeable delay.

### Q: Can I change the 70% threshold?

**A**: Yes. Pass third parameter: `findClosestCompWithDivergenceAnalysis(problem, library, 0.80)`

### Q: What if no comp is found?

**A**: System returns `hasComp: false` and UI shows "No close comparable found - use Archetype Guide instead."

### Q: Can I exclude certain problems from matching?

**A**: Yes. Filter library before analysis:
```javascript
const filtered = library.filter(p => p.id !== 'problem-to-exclude');
const result = findClosestCompWithDivergenceAnalysis(problem, filtered);
```

### Q: How do I debug similarity scores?

**A**: Use `calculateSimilarity()` directly:
```javascript
const similarity = calculateSimilarity(problem1, problem2);
console.log(similarity.breakdown); // Shows archetype, deviation, keyword scores
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-25 | Initial release with core functionality |

---

## Contributing

### Reporting Issues

1. Check **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)** first
2. Provide:
   - Problem ID or description
   - Expected comp vs actual comp
   - Similarity score breakdown
   - Console logs (if available)

### Proposing Changes

1. Document rationale (why change is needed)
2. Consider impact on existing problems
3. Test with representative problem set
4. Update relevant documentation

---

## Support

### Documentation

- **[Architecture Guide](../architecture/comparative-analysis.md)**: How system works
- **[API Reference](../api/comparative-analysis-api.md)**: Function documentation
- **[Integration Guide](../guides/integrating-comp-analysis.md)**: How to use
- **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)**: Debugging help

### Contact

- GitHub Issues: [Report bugs or request features]
- Documentation: Review quarterly or on major changes

---

## License

Part of ACF Exam Prep Platform
Copyright © 2025

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
