# Comparative Deviation Analysis System
## Architecture Guide

**Version**: 1.0
**Last Updated**: 2025-01-25
**Status**: Production
**Related Documents**:
- [API Reference](../api/comparative-analysis-api.md)
- [Integration Guide](../guides/integrating-comp-analysis.md)
- [Design Document](../plans/2025-01-25-comparative-deviation-analysis.md)
- [Troubleshooting Guide](../troubleshooting/comp-analysis.md)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architectural Components](#architectural-components)
4. [Data Flow](#data-flow)
5. [Integration Architecture](#integration-architecture)
6. [Performance Architecture](#performance-architecture)
7. [Design Patterns](#design-patterns)
8. [Technology Stack](#technology-stack)
9. [Deployment Model](#deployment-model)

---

## Executive Summary

### Purpose

The Comparative Deviation Analysis System is an **offline-first, platform-driven guidance engine** that automatically identifies the closest comparable problem from a library, highlights divergences, and provides progressive scaffolding to help students adapt known solutions to new problem variations.

### Key Architectural Decisions

1. **Offline-First**: All computation happens client-side using existing problem library data—no API calls, works without internet
2. **Progressive Disclosure**: Three-level UI hierarchy (divergences → guidance → solution) that encourages learning before revealing answers
3. **Automatic Activation**: System runs on every problem load without user intervention
4. **Leverage Existing Data**: Uses `DEVIATION_DATABASE` for content and `findSimilarProblems()` for matching logic
5. **Performance-Optimized**: Hybrid similarity scoring algorithm runs in ~10ms for 224 problems

### Business Value

- **Accelerates Learning**: Students see "This is like problem X, but with Y added"
- **Reduces Cognitive Load**: Platform identifies similarity patterns automatically
- **Builds Intuition**: Scaffolding helps students develop adaptation strategies
- **Exam-Ready**: Mimics real exam scenarios where students must adapt known approaches

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                         │
│  ┌────────────────┐              ┌──────────────────┐          │
│  │ ProblemViewer  │              │   ReconView      │          │
│  │  (Primary UI)  │              │ (Secondary UI)   │          │
│  └────────┬───────┘              └────────┬─────────┘          │
│           │                               │                     │
└───────────┼───────────────────────────────┼─────────────────────┘
            │                               │
            ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  COMPARATIVE ANALYSIS ENGINE                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  findClosestCompWithDivergenceAnalysis()                 │  │
│  │                                                           │  │
│  │  Input: targetProblem, problemLibrary                    │  │
│  │  Output: { hasComp, closestComp, similarityScore,       │  │
│  │            divergenceAnalysis }                           │  │
│  └──────────────┬────────────────────────────┬──────────────┘  │
│                 │                            │                  │
│       ┌─────────▼────────┐        ┌─────────▼────────┐        │
│       │ findSimilarProblems()     │ generateAdaptation│        │
│       │   (Similarity Scoring)    │   Guidance()      │        │
│       └──────────┬─────────┘       └─────────┬────────┘        │
└──────────────────┼───────────────────────────┼─────────────────┘
                   │                           │
                   ▼                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │  Problem     │   │  DEVIATION_  │   │  Archetype   │       │
│  │  Library     │   │  DATABASE    │   │  Signals     │       │
│  │  (JSON)      │   │              │   │              │       │
│  └──────────────┘   └──────────────┘   └──────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### System Boundaries

**In Scope**:
- Similarity matching between target problem and library problems
- Divergence detection (additional/missing deviations, new concepts)
- Adaptation guidance generation from deviation metadata
- Progressive disclosure UI components
- Offline computation (no network calls)

**Out of Scope**:
- Creating new problems or solutions
- Real-time problem generation
- Server-side computation or storage
- User authentication/authorization
- Problem submission or grading

---

## Architectural Components

### 1. Comparative Analysis Engine

**Location**: `src/utils/problemMatcher.js` (lines 502-728)

**Responsibility**: Core matching and divergence analysis logic

#### Sub-Components

##### 1.1 Similarity Matcher
```javascript
findSimilarProblems(targetProblem, problemLibrary, limit = 5)
```

**Purpose**: Calculate similarity scores between target and all library problems

**Algorithm**: Hybrid scoring with three weighted factors:
- **Archetype Match** (40%): Exact match (1.0) > Same tier (0.5) > Different (0.0)
- **Deviation Overlap** (35%): Jaccard similarity of deviation arrays
- **Keyword Overlap** (25%): Jaccard similarity of keyword arrays

**Output**:
```javascript
{
  similarProblems: [
    {
      problem: Object,
      similarityScore: 0.85,
      breakdown: {
        archetypeMatch: 1.0,
        deviationOverlap: 0.75,
        keywordOverlap: 0.60
      },
      explanation: "Same archetype (A1-CapitalStructure), 3 shared deviations, 5 common keywords"
    }
  ],
  totalCandidates: 223
}
```

##### 1.2 Divergence Analyzer
```javascript
findClosestCompWithDivergenceAnalysis(targetProblem, problemLibrary, similarityThreshold = 0.7)
```

**Purpose**: Find best comp and identify what's different

**Logic**:
1. Call `findSimilarProblems()` to get top match
2. Extract features from both problems (deviations, keywords, archetype)
3. Compare arrays to identify divergences:
   - **Additional Deviations**: In target but not in comp (added complexity)
   - **Missing Deviations**: In comp but not in target (simplification)
   - **Additional Concepts**: Keywords in target but not in comp (conceptual extension)
4. Generate adaptation guidance for each divergence
5. Return structured result with `hasComp` flag based on threshold

**Threshold Logic**:
- Similarity ≥ 70%: `hasComp = true`, guidance generated
- Similarity < 70%: `hasComp = false`, user directed to archetype guide

**Why 70%?**:
- Empirically tested to balance precision (good matches) vs recall (finding any match)
- Below 70%, differences are too substantial for meaningful adaptation guidance
- Avoids false positives where "similar" problems mislead students

##### 1.3 Guidance Generator
```javascript
generateAdaptationGuidance({
  additionalDeviations,
  missingDeviations,
  additionalConcepts,
  targetProblem,
  compProblem
})
```

**Purpose**: Create actionable step-by-step adaptation instructions

**Content Sources**:
- **Deviation Metadata**: Pulls from `DEVIATION_DATABASE` (name, explanation, checkpoints, time impact)
- **Archetype Approach**: Inferred from `inferCompApproach(compProblem)`

**Guidance Structure**:
```javascript
{
  type: 'additional_complexity' | 'simplification' | 'conceptual_extension',
  code: 'DEV-1.2.1',
  title: 'Your problem adds: Tax Shield Discount Rate',
  description: 'Unlike the comparable, your problem involves tax shields',
  adaptationSteps: [
    'Start with comp's approach: Calculate expected returns on debt',
    'Then add: Discount tax shields at r_D (debt rate)',
    'Verify: Tax shields exist only if debt is paid'
  ],
  timeImpact: 2.5,
  severity: 'high'
}
```

**Prioritization**: Guidance items sorted by severity (critical > high > medium > low)

**Step Limit**: Maximum 2 checkpoints from deviation database to prevent overwhelming students

---

### 2. User Interface Layer

#### 2.1 ProblemViewer Component (Primary UI)

**Location**: `src/components/practice/ProblemViewer.jsx` (lines 1-532)

**Responsibility**: Main problem practice interface with integrated comp analysis

**State Management**:
```javascript
const [compAnalysis, setCompAnalysis] = useState(null);
const [showGuidance, setShowGuidance] = useState(false);
const [showSolution, setShowSolution] = useState(false);
```

**Auto-Computation**:
```javascript
useEffect(() => {
  if (problems.length > 0 && currentProblemIndex >= 0) {
    const currentProblem = problems[currentProblemIndex];
    const analysis = findClosestCompWithDivergenceAnalysis(currentProblem, problems);
    setCompAnalysis(analysis);
    setShowGuidance(false); // Reset when changing problems
  }
}, [currentProblemIndex, problems]);
```

**Progressive Disclosure UI**:

1. **Level 0 (Always Visible)**: Problem text
2. **Level 1 (Automatic)**: Comp summary card with divergences
   ```jsx
   <div className="comp-summary-card">
     Similar to: [comp.title] (85% match)
     Key differences:
     • Your problem adds: Tax Shield Discount Rate
     • Your problem adds: Multiple Tranches
     [View Adaptive Guidance] [Show Solution]
   </div>
   ```

3. **Level 2 (Optional, User-Triggered)**: Adaptive guidance panel
   ```jsx
   <div className="adaptive-guidance">
     How to Adapt from the Comparable:
     [Guidance items ordered by severity]
     [Still stuck? Show Full Solution]
   </div>
   ```

4. **Level 3 (Override, User-Triggered)**: Full solution
   ```jsx
   <div className="solution-content">
     [Complete solution steps with calculations]
   </div>
   ```

**UI Interaction Flow**:
```
Problem loads
    ↓
Comp analysis auto-runs (10ms)
    ↓
Comp summary card appears (if hasComp)
    ↓
User clicks "View Adaptive Guidance"
    ↓
Guidance panel expands with step-by-step hints
    ↓
User clicks "Show Solution" (available at any time)
    ↓
Full solution revealed, comp summary hidden
```

#### 2.2 ReconView Component (Secondary UI)

**Location**: `src/components/reconnaissance/ReconView.jsx` (lines 1-293)

**Responsibility**: Archetype reconnaissance for pasted problems

**Integration Point**: After archetype scan, runs comp analysis for pasted text

```javascript
const handleScan = () => {
  const archetypeResults = scanForArchetypes(problemText);
  const deviationResults = detectDeviations(problemText, { archetypes: ... });

  // Create problem object from pasted text
  const pastedProblem = {
    id: 'pasted-problem',
    problem_text: problemText,
    archetype: archetypeResults.archetypes[0].code,
    deviations: deviationResults.deviations || [],
    keywords: archetypeResults.matchedKeywords || []
  };

  // Run comp analysis
  const analysis = findClosestCompWithDivergenceAnalysis(pastedProblem, problemLibrary);
  setCompAnalysis(analysis);
};
```

**Use Case**: Student pastes exam question → system identifies archetype + comp → shows where to find similar worked example

---

### 3. Data Layer

#### 3.1 Problem Library

**Sources**:
- `public/source-materials/guided_examples_v11.json`
- `public/source-materials/mock_questions_v11.json`

**Schema**:
```javascript
{
  id: "a1-bond-default-expected-return",
  title: "Bond Default with Hazard Rate",
  archetype: "A1-CapitalStructure",
  primary_archetype: "A1-CapitalStructure",
  deviations: ["DEV-1.1.1", "DEV-1.2.1"],
  keywords: ["debt", "default", "YTM", "CAPM", "tax shield"],
  problem_text: "...",
  solution_steps: [...],
  estimated_time_minutes: 8
}
```

**Size**: 224 problems (as of 2025-01-25)

**Access Pattern**: Loaded once on component mount, cached in state

#### 3.2 Deviation Database

**Location**: `src/utils/deviationInjector.js`

**Schema**:
```javascript
{
  code: "DEV-1.2.1",
  name: "Tax Shield Discount Rate",
  explanation: "Discount tax shields at debt rate r_D, not equity rate r_E",
  checkpoints: [
    "Verify: Tax shields only exist if debt is paid",
    "Calculate: PV(Tax Shields) = Σ τ × Interest × (1-PD) / (1+r_D)^t"
  ],
  time_impact_minutes: 2.5,
  severity: "high",
  category: "capital_structure"
}
```

**Size**: ~50 deviation definitions

**Access Pattern**: Imported as constant, accessed via array filter

---

## Data Flow

### Sequence Diagram: Problem Load with Comp Analysis

```
User                 ProblemViewer           problemMatcher         DEVIATION_DATABASE
 │                        │                         │                       │
 │  Navigate to problem   │                         │                       │
 ├───────────────────────>│                         │                       │
 │                        │                         │                       │
 │                        │  Load problem data      │                       │
 │                        │  (fetch JSON files)     │                       │
 │                        │                         │                       │
 │                        │  useEffect triggers     │                       │
 │                        ├────────────────────────>│                       │
 │                        │  findClosestComp        │                       │
 │                        │  WithDivergence         │                       │
 │                        │  Analysis()             │                       │
 │                        │                         │                       │
 │                        │                         │  Calculate similarity │
 │                        │                         │  (10ms, 224 problems) │
 │                        │                         │                       │
 │                        │                         │  Extract divergences  │
 │                        │                         │  (array comparisons)  │
 │                        │                         │                       │
 │                        │                         │  Generate guidance    │
 │                        │                         ├──────────────────────>│
 │                        │                         │  Lookup deviation     │
 │                        │                         │  metadata             │
 │                        │                         │<──────────────────────┤
 │                        │                         │                       │
 │                        │<────────────────────────┤                       │
 │                        │  { hasComp, closestComp,│                       │
 │                        │    divergenceAnalysis } │                       │
 │                        │                         │                       │
 │                        │  setCompAnalysis(...)   │                       │
 │                        │  Render comp summary    │                       │
 │<───────────────────────┤                         │                       │
 │  View comp summary     │                         │                       │
 │                        │                         │                       │
 │  Click "View Guidance" │                         │                       │
 ├───────────────────────>│                         │                       │
 │                        │  setShowGuidance(true)  │                       │
 │<───────────────────────┤                         │                       │
 │  View adaptive guidance│                         │                       │
 │                        │                         │                       │
```

### Data Transformation Pipeline

```
Target Problem
    ↓
[Extract Features]
    ↓
{
  archetype: "A1-CapitalStructure",
  deviations: ["DEV-1.1.1", "DEV-1.2.1", "DEV-4.1.1"],
  keywords: ["debt", "default", "senior", "junior", "tax shield"]
}
    ↓
[Calculate Similarity with All Library Problems]
    ↓
Similarity Scores: [0.85, 0.72, 0.68, 0.45, ...]
    ↓
[Select Top Match]
    ↓
Closest Comp: { id: "a1-bond-default", score: 0.85, ... }
    ↓
[Compare Feature Arrays]
    ↓
Divergences: {
  additionalDeviations: ["DEV-4.1.1"],
  missingDeviations: [],
  additionalConcepts: ["senior", "junior"]
}
    ↓
[Generate Guidance from Deviation Metadata]
    ↓
Adaptation Guidance: [
  {
    type: "additional_complexity",
    code: "DEV-4.1.1",
    title: "Your problem adds: Absolute Priority Rule Waterfall",
    adaptationSteps: [...]
  }
]
    ↓
[Return to UI]
    ↓
Progressive Disclosure Rendering
```

---

## Integration Architecture

### Integration Points with Existing Systems

#### 1. Integration with Problem Matching Engine

**Existing Function**: `findSimilarProblems()`
- **Location**: `src/utils/problemMatcher.js:286-327`
- **Role**: Provides similarity scoring infrastructure
- **Reuse Strategy**: Comparative analysis calls this function and adds divergence detection on top

**Benefit**: No duplication of similarity logic, maintains single source of truth

#### 2. Integration with Deviation Injection System

**Existing System**: `DEVIATION_DATABASE` in `deviationInjector.js`
- **Content**: Deviation metadata (name, explanation, checkpoints, time impact, severity)
- **Role**: Content source for adaptation guidance
- **Reuse Strategy**: Lookup deviations by code, extract metadata for guidance generation

**Benefit**: Consistent deviation information across deviation alerts and adaptation guidance

#### 3. Integration with Archetype Scanner

**Existing Function**: `scanForArchetypes()`
- **Location**: `src/utils/archetypeScanner.js`
- **Role**: Detects archetype and keywords from problem text
- **Integration**: ReconView uses scan results as input to comp analysis

**Flow**:
```
Pasted Text
    ↓
[scanForArchetypes()]
    ↓
{ archetypes: [...], keywords: [...] }
    ↓
[Create Problem Object]
    ↓
[findClosestCompWithDivergenceAnalysis()]
    ↓
Show Comp Summary
```

---

## Performance Architecture

### Computational Complexity

#### Similarity Calculation
- **Algorithm**: O(n × m) where n = library size, m = feature extraction cost
- **Current Performance**: ~10ms for 224 problems
- **Feature Extraction**: O(k) where k = average array length (~5 deviations, ~10 keywords)
- **Jaccard Similarity**: O(a + b) where a, b = array sizes

**Total for Single Problem**: O(n × (k + a + b)) ≈ O(n) since k, a, b are bounded constants

#### Divergence Analysis
- **Set Operations**: O(d) where d = number of deviations (~5)
- **Guidance Generation**: O(g × l) where g = guidance items (~3), l = lookup cost (O(1) with small database)

**Total**: O(d + g) ≈ O(1) since d and g are small constants

#### Overall Performance
- **Similarity**: ~8ms (224 problems × ~35μs each)
- **Divergence**: ~1ms (array comparisons + lookups)
- **Guidance Generation**: ~1ms (database lookups + formatting)
- **Total**: ~10ms per problem load

### Scaling Considerations

| Library Size | Expected Time | Mitigation Strategy |
|--------------|---------------|---------------------|
| 224 problems | ~10ms | ✅ Current (no action needed) |
| 500 problems | ~22ms | ✅ Acceptable (no action needed) |
| 1,000 problems | ~45ms | ⚠️ Monitor performance |
| 5,000 problems | ~225ms | ❌ Requires optimization |
| 10,000 problems | ~450ms | ❌ Requires indexing |

**Optimization Strategies for Future Scale**:

1. **Archetype Filtering** (Immediate Win)
   - Only compare within same archetype tier
   - Reduces candidates by ~80% (e.g., 224 → 45)
   - Implementation: Filter library by archetype before similarity calculation

2. **Keyword Indexing** (Medium Term)
   - Build inverted index: keyword → problem IDs
   - Candidate selection: problems with keyword overlap
   - Reduces candidates by ~70%

3. **Similarity Caching** (Long Term)
   - Pre-compute similarity matrix for all problem pairs
   - Store in IndexedDB for offline access
   - Trade-off: 224² = 50,176 entries (~2MB storage)

4. **Web Worker Offloading** (Advanced)
   - Move similarity calculation to background thread
   - Prevents UI blocking for large libraries
   - Complexity: Shared memory for problem data

### Caching Strategy

**Current Implementation**:
```javascript
const [compAnalysis, setCompAnalysis] = useState(null);

useEffect(() => {
  const analysis = findClosestCompWithDivergenceAnalysis(currentProblem, problems);
  setCompAnalysis(analysis);
}, [currentProblemIndex, problems]);
```

**Cache Invalidation**:
- Recomputed when `currentProblemIndex` changes (new problem)
- Recomputed when `problems` array changes (data reload)
- NOT recomputed when user interacts with UI (guidance, solution)

**Memory Footprint**:
- Comp analysis result: ~2KB per problem
- Total for 224 problems: ~450KB (acceptable)

---

## Design Patterns

### 1. Progressive Disclosure Pattern

**Intent**: Reveal complexity gradually to prevent overwhelming users

**Implementation**:
- **Level 1**: Comp summary (always visible if match found)
- **Level 2**: Adaptive guidance (user-triggered, optional)
- **Level 3**: Full solution (override, available anytime)

**Benefits**:
- Encourages active learning before passive consumption
- Reduces cognitive load
- Supports diverse learning styles (scaffolding vs direct answers)

### 2. Offline-First Architecture

**Intent**: Eliminate network dependency for core functionality

**Implementation**:
- All data loaded from static JSON files
- All computation client-side (JavaScript)
- No API calls, no server requirements

**Benefits**:
- Fast response times (~10ms)
- Works without internet
- Zero server costs
- Predictable performance

### 3. Dependency Injection (Data Sources)

**Intent**: Decouple logic from data sources

**Implementation**:
```javascript
// Functions accept data as parameters, not hardcoded sources
findClosestCompWithDivergenceAnalysis(targetProblem, problemLibrary)
generateAdaptationGuidance({ ..., targetProblem, compProblem })

// UI components load data and inject into engine
const [problems, setProblems] = useState([]);
const analysis = findClosestCompWithDivergenceAnalysis(currentProblem, problems);
```

**Benefits**:
- Testable (inject mock data)
- Flexible (swap data sources)
- Reusable (same logic, different data)

### 4. Pure Functions for Core Logic

**Intent**: Ensure predictability and testability

**Implementation**:
```javascript
// No side effects, same input = same output
export function calculateSimilarity(problem1, problem2) { ... }
export function generateAdaptationGuidance({ ... }) { ... }
export function inferCompApproach(compProblem) { ... }
```

**Benefits**:
- Easy to test (no mocks needed)
- Easy to reason about (no hidden state)
- Cacheable results (if needed)

### 5. Feature Extraction Abstraction

**Intent**: Normalize diverse problem schemas

**Implementation**:
```javascript
function extractArchetype(problem) {
  // Check multiple possible locations
  return problem.archetype || problem.metadata?.archetype || problem.analysis?.archetype || '';
}

function extractDeviations(problem) {
  // Aggregate from multiple sources
  return [...problem.deviation, ...problem.deviations, ...problem.metadata?.deviations];
}
```

**Benefits**:
- Handles schema variations
- Backward compatible
- Reduces brittleness

---

## Technology Stack

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 18.x | UI components, state management |
| **Routing** | React Router | 6.x | Client-side routing |
| **Build Tool** | Webpack | 5.x | Module bundling, dev server |
| **Language** | JavaScript (ES6+) | - | Application logic |
| **Testing Framework** | Jest + React Testing Library | 29.x | Unit and component tests |
| **Data Format** | JSON | - | Problem library, deviation database |

### Key Libraries

- **None for Comp Analysis**: Pure JavaScript implementation, no external dependencies
- **Set/Array Operations**: Native JavaScript (Set, Array.filter, Array.map)
- **Similarity Calculation**: Custom Jaccard similarity implementation

### Browser Requirements

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES6 Support**: Required for Set, arrow functions, destructuring
- **localStorage**: Optional (not used by comp analysis, but useful for caching)

---

## Deployment Model

### Client-Side Only

**Architecture**: Pure client-side application, no backend required

**Deployment Steps**:
1. Build static assets: `npm run build`
2. Serve static files from any web server (Apache, Nginx, Vercel, Netlify, GitHub Pages)
3. Ensure JSON data files are accessible at `/source-materials/`

### Performance Characteristics

| Metric | Value | Target |
|--------|-------|--------|
| **Initial Load** | ~1.5s | < 3s |
| **Problem Data Load** | ~200ms | < 500ms |
| **Comp Analysis** | ~10ms | < 50ms |
| **UI Render** | ~5ms | < 16ms (60 FPS) |
| **Memory Usage** | ~8MB | < 50MB |

### Offline Capability

**Service Worker**: Not required for basic functionality, but can add for:
- Offline caching of JSON data files
- Faster subsequent loads
- Progressive Web App (PWA) features

**IndexedDB**: Not currently used, but potential future optimization for:
- Pre-computed similarity matrices
- User progress tracking
- Cached guidance results

---

## Cross-Cutting Concerns

### Error Handling

**Strategy**: Graceful degradation

```javascript
// Handle missing library
if (!problemLibrary || problemLibrary.length === 0) {
  return { hasComp: false, closestComp: null, ... };
}

// Handle missing features
const deviations = extractDeviations(problem) || [];
const keywords = extractKeywords(problem) || [];
```

**UI Fallback**:
- No comp found → Show archetype guide instead
- Comp below threshold → Notify user, suggest alternative
- Missing deviation metadata → Skip guidance item

### Logging and Monitoring

**Current Implementation**: Console logs for development

**Production Considerations**:
- Remove verbose logs
- Add error tracking (Sentry, LogRocket)
- Track metrics (comp analysis hit rate, threshold distribution)

### Accessibility

**Keyboard Navigation**: All interactive elements (buttons, details) keyboard-accessible

**Screen Readers**:
- Semantic HTML (headings, lists, sections)
- ARIA labels for icons
- Clear button text (avoid icon-only)

**Color Contrast**: Severity colors meet WCAG AA standards

---

## Future Architecture Enhancements

### Phase 2: Multi-Comp Analysis

**Goal**: Handle problems that combine multiple comparables

**Approach**:
- Return top N comps (N=3) instead of single best match
- Show "This combines concepts from 3 different problems"
- Synthesize guidance from multiple sources

**Challenges**:
- Increased complexity in guidance generation
- UI space constraints
- Potential confusion from multiple sources

### Phase 3: Concept Dependency Graph

**Goal**: Understand prerequisite relationships between concepts

**Approach**:
- Build directed graph: Concept A → requires → Concept B
- "To solve this, you need to understand X first"
- Link to conceptual guides

**Data Requirements**:
- Concept taxonomy
- Dependency relationships
- Concept → Problem mapping

### Phase 4: Adaptive Difficulty Paths

**Goal**: Personalized problem recommendations

**Approach**:
- Track which divergences student struggles with
- Recommend easier problems that isolate specific concepts
- Build "practice path" from simple → complex

**Data Requirements**:
- User interaction tracking
- Problem difficulty ratings
- Concept isolation mappings

---

## See Also

- **[API Reference](../api/comparative-analysis-api.md)**: Function signatures and examples
- **[Integration Guide](../guides/integrating-comp-analysis.md)**: How to use in new components
- **[Design Decisions](../plans/2025-01-25-comparative-deviation-analysis.md)**: Rationale for key choices
- **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)**: Common issues and debugging tips
- **[Deviation System](./DEVIATION_INJECTION_SYSTEM.md)**: Related deviation alert system

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
**Review Schedule**: Quarterly or on major system changes
