# Comparative Deviation Analysis System
## Design Document

**Date**: 2025-01-25
**Status**: Approved for Implementation
**Type**: Platform Enhancement - Automatic Guidance System

---

## Executive Summary

The Comparative Deviation Analysis system automatically identifies the closest comparable problem from the library, highlights where the current problem diverges, and provides progressive scaffolding to help students adapt their approach.

**Key Innovation**: Three-level progressive disclosure:
1. **Automatic**: Comp summary with divergences (always visible)
2. **Optional**: Adaptive guidance with step-by-step hints
3. **Override**: "Show Solution" button reveals full answer

---

## Problem Statement

Students encounter new problems and don't know where to start. Existing system provides:
- Archetype detection (what TYPE of problem)
- Deviation alerts (exam traps to avoid)
- Full solutions (complete answer)

**Gap**: No guidance on HOW to bridge from known problems to unknown variations.

**User Need**: "I've seen something similar before, but this problem has X added. How do I adapt my approach?"

---

## Solution Architecture

### Core Components

#### 1. Comparative Analysis Engine (`problemMatcher.js`)

**Function**: `findClosestCompWithDivergenceAnalysis(targetProblem, problemLibrary)`

**Returns**:
```javascript
{
  hasComp: boolean,
  closestComp: Problem | null,
  similarityScore: number (0-1),
  divergenceAnalysis: {
    additionalDeviations: string[],      // In target, not in comp
    missingDeviations: string[],         // In comp, not in target
    additionalConcepts: string[],        // New keywords
    adaptationGuidance: AdaptationStep[] // How to adapt
  }
}
```

**Logic**:
1. Use existing `findSimilarProblems()` to get top match
2. Compare deviation arrays: `targetDeviations` vs `compDeviations`
3. Compare keyword arrays: `targetKeywords` vs `compKeywords`
4. Generate adaptation guidance for each divergence

---

#### 2. Adaptation Guidance Generator

**Function**: `generateAdaptationGuidance({ additionalDeviations, missingDeviations, additionalConcepts, targetProblem, compProblem })`

**Returns**:
```javascript
[
  {
    type: 'additional_complexity' | 'simplification' | 'conceptual_extension',
    code: 'DEV-X.Y.Z',
    title: 'Your problem adds: Tax Shield Discount Rate',
    description: 'Unlike the comparable, your problem involves tax shields',
    adaptationSteps: [
      'Start with comp\'s approach: Calculate expected returns on debt',
      'Then add: Discount tax shields at r_D (debt rate)',
      'Verify: Tax shields exist only if debt is paid'
    ],
    timeImpact: 2.5,
    severity: 'high'
  }
]
```

**For Additional Deviations** (target more complex):
- Lookup deviation in `DEVIATION_DATABASE`
- Extract: name, explanation, checkpoints
- Format: "Start with comp's approach, then add [deviation explanation]"

**For Missing Deviations** (target simpler):
- Identify which comp steps can be skipped
- Format: "Skip the comp's [deviation] steps - use standard approach"

**For New Concepts**:
- Identify high-value keywords (tax, dividend, option, etc.)
- Format: "Apply comp's methodology, incorporate [concepts]"

---

#### 3. Progressive Disclosure UI

**Location**: `ProblemViewer.jsx`

**State Management**:
```javascript
const [compAnalysis, setCompAnalysis] = useState(null);
const [showGuidance, setShowGuidance] = useState(false);
const [showSolution, setShowSolution] = useState(false);

useEffect(() => {
  if (currentProblem && allProblems.length > 0) {
    const analysis = findClosestCompWithDivergenceAnalysis(
      currentProblem,
      allProblems
    );
    setCompAnalysis(analysis);
  }
}, [currentProblem]);
```

**UI Flow**:

```
┌─────────────────────────────────────────────────────────┐
│ Problem Text                                            │
│ [Student reads problem...]                              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 🔍 Similar to: "Bond Default with Hazard Rate" (85%)   │
│                                                         │
│ Key differences:                                        │
│ • Your problem adds: Tax Shield Discount Rate          │
│ • Your problem adds: Multiple Tranches (Senior/Junior) │
│                                                         │
│ [View Adaptive Guidance] [Show Solution]               │
└─────────────────────────────────────────────────────────┘
                        ↓
           (If "View Adaptive Guidance" clicked)
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 📋 How to Adapt from the Comparable:                    │
│                                                         │
│ ⚠️ Your problem adds: Tax Shield Discount Rate         │
│ Unlike the comparable, your problem involves tax shields│
│                                                         │
│ ▸ Show adaptation steps                                │
│   1. Start with comp's approach: Calculate E[r_D]      │
│   2. Then add: Discount tax shields at r_D             │
│   3. Verify: Tax shields only exist if debt is paid    │
│                                                         │
│ ⏱️ Adds ~2.5 minutes                                    │
│                                                         │
│ [Still stuck? Show Full Solution]                      │
└─────────────────────────────────────────────────────────┘
                        ↓
              (If "Show Solution" clicked)
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 📝 Complete Solution:                                   │
│ [Full solution steps with calculations...]             │
└─────────────────────────────────────────────────────────┘
```

---

### Integration Points

1. **ProblemViewer.jsx** (Primary)
   - Auto-compute comp analysis on problem load
   - Display comp summary + divergences
   - Show adaptive guidance (conditional)
   - Show full solution (override)

2. **ReconView.jsx** (Secondary)
   - After archetype scan, show comp analysis for pasted problems
   - Help students recognize similarity before attempting

3. **ArchetypeAnalysisPanel.jsx** (Enhancement)
   - Add collapsible "Why This Match?" section
   - Show keyword/signal/pattern contributions

---

## Data Structures

### Comparative Analysis Result
```javascript
{
  hasComp: true,
  closestComp: {
    id: "a1-bond-default-expected-return-and-beta",
    problem_text: "...",
    archetype: "A1-CapitalStructure",
    deviations: ["DEV-1.1.1"],
    keywords: ["debt", "default", "YTM", "CAPM"]
  },
  similarityScore: 0.85,
  divergenceAnalysis: {
    additionalDeviations: ["DEV-1.2.1", "DEV-4.1.1"],
    missingDeviations: [],
    additionalConcepts: ["tax shield", "senior", "junior"],
    adaptationGuidance: [
      {
        type: "additional_complexity",
        code: "DEV-1.2.1",
        title: "Your problem adds: Tax Shield Discount Rate",
        description: "Unlike the comparable, your problem involves tax shields",
        adaptationSteps: [
          "Start with comp's approach: Calculate expected returns on debt",
          "Then add: Discount tax shields at r_D (debt rate)",
          "Verify: Tax shields exist only if debt is paid"
        ],
        timeImpact: 2.5,
        severity: "high"
      },
      {
        type: "additional_complexity",
        code: "DEV-4.1.1",
        title: "Your problem adds: Absolute Priority Rule Waterfall",
        description: "Unlike the comparable, your problem involves multiple tranches",
        adaptationSteps: [
          "Start with comp's approach: Calculate expected debt returns",
          "Then add: Apply waterfall (Senior → Junior → Equity)",
          "Verify: Senior gets paid first, up to full amount"
        ],
        timeImpact: 2.5,
        severity: "critical"
      }
    ]
  }
}
```

---

## Design Decisions

### 1. Why Automatic Comp Analysis?
- **Decision**: Run on every problem load (no user action required)
- **Rationale**: Students don't know to look for comps. Platform should proactively surface similarities.
- **Alternative Rejected**: "Find Similar Problems" button (requires awareness, extra click)

### 2. Why Progressive Disclosure?
- **Decision**: Three levels (divergences → guidance → solution)
- **Rationale**: Students learn better with scaffolding. Force engagement before revealing answer.
- **Alternative Rejected**: Show everything at once (overwhelming, reduces learning)

### 3. Why Allow Solution Override?
- **Decision**: "Show Solution" button available at all times
- **Rationale**: Students may be time-pressured (exam prep) or genuinely stuck. Don't force struggle.
- **Alternative Rejected**: Force viewing guidance first (frustrating, ignores legitimate use cases)

### 4. Why Step-Level Guidance?
- **Decision**: Adaptation guidance maps to specific solution steps
- **Rationale**: Matches existing deviation injection pattern. Contextual > generic.
- **Alternative Rejected**: Problem-level guidance only (less actionable)

### 5. Why Use Deviation Database?
- **Decision**: Leverage existing `DEVIATION_DATABASE` for guidance content
- **Rationale**: Already has high-quality explanations, checkpoints, time estimates. Don't duplicate.
- **Alternative Rejected**: Create separate guidance database (redundant, maintenance burden)

---

## Edge Cases

### No Good Comp Found (<70% similarity)
**Behavior**: Display message
```
⚠️ No close comparable found (best match: 45% similar)
Use the Archetype Guide instead for this problem type.
[View Archetype Guide]
```

### Perfect Match (100% similarity)
**Behavior**: Skip comp analysis, show message
```
✓ This problem has a worked example in the library!
[View Worked Example]
```

### Multiple Equally Good Comps
**Behavior**: Pick first (highest similarity score wins)
**Future Enhancement**: Show multiple comps if tie within 5%

### Comp Has More Complexity Than Target
**Behavior**: Show simplification guidance
```
✓ Your problem is simpler: No Hazard Rate Default
Skip the comp's hazard rate steps - use weighted average method instead.
⏱️ Saves ~3.5 minutes
```

---

## Performance Considerations

### Computation Cost
- **Similarity Calculation**: Already computed by `findSimilarProblems()` (~5ms for 224 problems)
- **Divergence Analysis**: Array comparisons (~1ms)
- **Guidance Generation**: Database lookups (~2ms)
- **Total**: ~10ms per problem load (negligible)

### Caching Strategy
- Comp analysis results cached in component state
- Recomputed only when problem changes
- No server calls (fully offline)

### Scalability
- Current: 224 problems (~10ms)
- At 1000 problems: ~45ms (still acceptable)
- At 10000 problems: May need indexing (future optimization)

---

## Testing Strategy

### Unit Tests (`problemMatcher.test.js`)
```javascript
describe('findClosestCompWithDivergenceAnalysis', () => {
  it('finds closest comp with >70% similarity');
  it('identifies additional deviations in target');
  it('identifies missing deviations (simplification)');
  it('generates adaptation guidance for additional complexity');
  it('returns hasComp: false when no good match');
  it('handles perfect match (100% similarity)');
});

describe('generateAdaptationGuidance', () => {
  it('creates guidance for additional deviations');
  it('creates guidance for missing deviations');
  it('creates guidance for new concepts');
  it('orders guidance by severity (critical first)');
  it('includes time impact estimates');
});
```

### Component Tests (`ProblemViewer.test.jsx`)
```javascript
describe('ProblemViewer with Comp Analysis', () => {
  it('auto-computes comp analysis on problem load');
  it('displays comp summary with divergences');
  it('shows adaptive guidance when button clicked');
  it('shows solution when Show Solution clicked');
  it('hides comp summary when solution shown');
  it('handles no comp found gracefully');
});
```

### Integration Tests
```javascript
describe('End-to-End Comp Analysis', () => {
  it('loads problem → computes comp → displays divergences');
  it('adaptive guidance references correct deviation names');
  it('navigation to comp problem works');
  it('works offline (no API calls)');
});
```

---

## Success Metrics

### Quantitative
- ✅ Comp analysis runs in <50ms per problem
- ✅ >80% of problems have good comp (>70% similarity)
- ✅ Adaptation guidance has >3 actionable steps per divergence
- ✅ Zero API calls (fully offline)
- ✅ 100% test coverage for new functions

### Qualitative
- ✅ Students can articulate: "This is like problem X, but adds Y"
- ✅ Adaptation guidance is actionable (not generic platitudes)
- ✅ UI is scannable and non-overwhelming
- ✅ Solution override is intuitive

---

## Future Enhancements

### Phase 2: Concept Graph
- Build graph of concept dependencies
- "To solve this, you need to understand [prerequisite concepts]"
- Link to conceptual guides

### Phase 3: Adaptive Difficulty
- Track which divergences student struggles with
- Recommend easier problems that isolate specific concepts
- Build "practice path" from simple → complex

### Phase 4: Multi-Comp Analysis
- "This problem combines concepts from 3 different comps"
- Show how to synthesize approaches

---

## Maintenance & Extensibility

### Adding New Deviations
1. Add to `DEVIATION_DATABASE` in `deviationInjector.js`
2. Adaptation guidance auto-generates from database entry
3. No additional code changes needed

### Adding New Archetypes
1. Add to `archetype-signals.json`
2. Add patterns to `archetypeScanner.js`
3. Comparative analysis works automatically

### Updating Guidance Quality
1. Refine `generateAdaptationGuidance()` logic
2. Improve `inferCompApproach()` heuristics
3. All problems benefit immediately (no per-problem updates)

---

## Implementation Checklist

- [ ] Backend: `findClosestCompWithDivergenceAnalysis()`
- [ ] Backend: `generateAdaptationGuidance()`
- [ ] Backend: `inferCompApproach()`
- [ ] Backend: Unit tests
- [ ] Frontend: ProblemViewer comp summary card
- [ ] Frontend: ProblemViewer adaptive guidance section
- [ ] Frontend: ProblemViewer solution override
- [ ] Frontend: ReconView comp analysis integration
- [ ] Frontend: ArchetypeAnalysisPanel "Why?" section
- [ ] Frontend: Component tests
- [ ] Integration: End-to-end tests
- [ ] Verification: Manual testing with real problems
- [ ] Documentation: This design doc ✓
- [ ] Code review: Quality check
- [ ] Commit: Clean git history

---

## References

- Existing: `problemMatcher.js` - Similarity scoring algorithm
- Existing: `deviationInjector.js` - Deviation database
- Existing: `archetype-signals.json` - Archetype definitions
- Related: `ProblemViewer.jsx` - Current solution display
- Related: `ReconView.jsx` - Archetype identification UI

---

## Approval

**Designed by**: Claude Code (Sonnet 4.5)
**Validated via**: Superpowers Brainstorming Skill
**Approved by**: User
**Date**: 2025-01-25
**Status**: ✅ Ready for Implementation
