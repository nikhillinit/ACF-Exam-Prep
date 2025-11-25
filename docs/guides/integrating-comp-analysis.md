# Integrating Comparative Analysis
## Integration Guide

**Version**: 1.0
**Last Updated**: 2025-01-25
**Audience**: Frontend developers adding comp analysis to new components
**Related Documents**:
- [Architecture Guide](../architecture/comparative-analysis.md)
- [API Reference](../api/comparative-analysis-api.md)
- [Design Document](../plans/2025-01-25-comparative-deviation-analysis.md)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Integration Patterns](#integration-patterns)
3. [UI Components](#ui-components)
4. [Customization](#customization)
5. [Extension Patterns](#extension-patterns)
6. [Testing Integration](#testing-integration)
7. [Common Scenarios](#common-scenarios)

---

## Quick Start

### Minimal Integration (5 minutes)

**Step 1**: Import the function
```javascript
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';
```

**Step 2**: Add state for comp analysis
```javascript
const [compAnalysis, setCompAnalysis] = useState(null);
```

**Step 3**: Compute on problem load
```javascript
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

**Step 4**: Display results
```javascript
{compAnalysis?.hasComp && (
  <div>
    <h4>Similar to: {compAnalysis.closestComp.title}</h4>
    <p>Match: {Math.round(compAnalysis.similarityScore * 100)}%</p>
  </div>
)}
```

**That's it!** You now have basic comp analysis in your component.

---

## Integration Patterns

### Pattern 1: Auto-Compute on Problem Change

**Use Case**: Problem viewer, practice mode, quiz interface

**Implementation**:
```javascript
import React, { useState, useEffect } from 'react';
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';

function ProblemPractice() {
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compAnalysis, setCompAnalysis] = useState(null);

  const currentProblem = problems[currentIndex];

  // Load problems once
  useEffect(() => {
    fetch('/source-materials/guided_examples_v11.json')
      .then(res => res.json())
      .then(data => setProblems(data.worked_examples));
  }, []);

  // Recompute comp analysis when problem changes
  useEffect(() => {
    if (currentProblem && problems.length > 0) {
      const analysis = findClosestCompWithDivergenceAnalysis(
        currentProblem,
        problems
      );
      setCompAnalysis(analysis);
    }
  }, [currentProblem, problems]);

  return (
    <div>
      <h2>{currentProblem?.title}</h2>
      {compAnalysis?.hasComp && (
        <CompSummaryCard analysis={compAnalysis} />
      )}
      <button onClick={() => setCurrentIndex(i => i + 1)}>Next</button>
    </div>
  );
}
```

**Key Points**:
- Comp analysis auto-updates when `currentIndex` changes
- Library loaded once, reused for all comparisons
- State reset handled by `useEffect` dependency array

---

### Pattern 2: On-Demand Analysis (User-Triggered)

**Use Case**: "Find similar problems" button, advanced features

**Implementation**:
```javascript
function ProblemExplorer() {
  const [problem, setProblem] = useState(null);
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFindSimilar = async () => {
    setIsAnalyzing(true);

    // Load library if not already loaded
    const response = await fetch('/source-materials/guided_examples_v11.json');
    const data = await response.json();
    const library = data.worked_examples;

    // Run analysis
    const analysis = findClosestCompWithDivergenceAnalysis(
      problem,
      library
    );

    setCompAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div>
      <button onClick={handleFindSimilar} disabled={isAnalyzing}>
        {isAnalyzing ? 'Analyzing...' : 'Find Similar Problems'}
      </button>

      {compAnalysis && (
        <CompAnalysisResults analysis={compAnalysis} />
      )}
    </div>
  );
}
```

**Key Points**:
- Analysis only runs when user requests
- Loading state shown during computation
- Library fetched on-demand (could cache for performance)

---

### Pattern 3: Pasted Text Analysis

**Use Case**: Reconnaissance view, paste-and-analyze interface

**Implementation**:
```javascript
import { scanForArchetypes } from '../../utils/archetypeScanner';
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';

function PasteAndAnalyze() {
  const [pastedText, setPastedText] = useState('');
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [problemLibrary, setProblemLibrary] = useState([]);

  // Load library once
  useEffect(() => {
    fetch('/source-materials/guided_examples_v11.json')
      .then(res => res.json())
      .then(data => setProblemLibrary(data.worked_examples));
  }, []);

  const handleAnalyze = () => {
    // Step 1: Scan for archetypes and keywords
    const scanResults = scanForArchetypes(pastedText);

    if (scanResults.archetypes.length === 0) {
      alert('No archetype detected');
      return;
    }

    // Step 2: Create problem object from pasted text
    const pastedProblem = {
      id: 'pasted-problem',
      problem_text: pastedText,
      archetype: scanResults.archetypes[0].code,
      keywords: scanResults.matchedKeywords || [],
      deviations: [] // Could add deviation detection here
    };

    // Step 3: Find comparable
    const analysis = findClosestCompWithDivergenceAnalysis(
      pastedProblem,
      problemLibrary
    );

    setCompAnalysis(analysis);
  };

  return (
    <div>
      <textarea
        value={pastedText}
        onChange={e => setPastedText(e.target.value)}
        placeholder="Paste problem text here..."
        rows={15}
      />
      <button onClick={handleAnalyze}>Analyze</button>

      {compAnalysis?.hasComp && (
        <div>
          <h3>Found Similar Problem!</h3>
          <p>Similar to: {compAnalysis.closestComp.title}</p>
          <p>Match: {Math.round(compAnalysis.similarityScore * 100)}%</p>
        </div>
      )}
    </div>
  );
}
```

**Key Points**:
- Combines archetype scanning with comp analysis
- Creates synthetic problem object from text
- Could enhance with deviation detection for better matching

---

### Pattern 4: Progressive Disclosure UI

**Use Case**: Educational platforms, guided learning

**Implementation**:
```javascript
function ProgressiveGuidance() {
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // ... comp analysis computation ...

  return (
    <div>
      {/* Level 1: Comp Summary (always visible) */}
      {compAnalysis?.hasComp && !showSolution && (
        <div className="comp-summary">
          <h4>
            Similar to: {compAnalysis.closestComp.title}
            ({Math.round(compAnalysis.similarityScore * 100)}% match)
          </h4>
          <ul>
            {compAnalysis.divergenceAnalysis.additionalDeviations.map(dev => (
              <li key={dev}>Your problem adds: {dev}</li>
            ))}
          </ul>
          <button onClick={() => setShowGuidance(!showGuidance)}>
            {showGuidance ? 'Hide Guidance' : 'View Adaptive Guidance'}
          </button>
          <button onClick={() => setShowSolution(true)}>
            Show Solution
          </button>
        </div>
      )}

      {/* Level 2: Adaptive Guidance (user-triggered) */}
      {showGuidance && compAnalysis?.hasComp && !showSolution && (
        <div className="adaptive-guidance">
          <h4>How to Adapt from the Comparable:</h4>
          {compAnalysis.divergenceAnalysis.adaptationGuidance.map((guidance, idx) => (
            <div key={idx} className={`guidance-${guidance.severity}`}>
              <h5>{guidance.title}</h5>
              <p>{guidance.description}</p>
              <details>
                <summary>Show adaptation steps</summary>
                <ol>
                  {guidance.adaptationSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </details>
            </div>
          ))}
        </div>
      )}

      {/* Level 3: Full Solution (override) */}
      {showSolution && (
        <div className="solution">
          <h4>Complete Solution</h4>
          {/* ... solution content ... */}
        </div>
      )}
    </div>
  );
}
```

**Key Points**:
- Three levels of disclosure: summary → guidance → solution
- Comp summary hidden when solution shown
- User controls progression through learning aids

---

## UI Components

### Reusable Comp Summary Card

```javascript
// components/CompSummaryCard.jsx
import React from 'react';
import './CompSummaryCard.css';
import { getDeviationByCode } from '../../utils/deviationInjector';

function CompSummaryCard({ analysis, onViewGuidance, onShowSolution }) {
  if (!analysis?.hasComp) {
    return (
      <div className="comp-no-match">
        <span>⚠️</span>
        <div>
          <h4>No close comparable found</h4>
          <p>Best match: {Math.round(analysis.similarityScore * 100)}% similar</p>
          <p>Use the Archetype Guide instead.</p>
        </div>
      </div>
    );
  }

  const { closestComp, similarityScore, divergenceAnalysis } = analysis;

  return (
    <div className="comp-summary-card">
      <div className="comp-header">
        <span className="icon">🔍</span>
        <div>
          <h4>
            Similar to: {closestComp.title}
            <span className="similarity-score">
              ({Math.round(similarityScore * 100)}% match)
            </span>
          </h4>
        </div>
      </div>

      {(divergenceAnalysis.additionalDeviations.length > 0 ||
        divergenceAnalysis.additionalConcepts.length > 0) && (
        <div className="divergences">
          <p className="divergences-header">Key differences:</p>
          <ul>
            {divergenceAnalysis.additionalDeviations.map((devCode, idx) => {
              const deviation = getDeviationByCode(devCode);
              return (
                <li key={idx}>
                  Your problem adds: <strong>{deviation?.name || devCode}</strong>
                </li>
              );
            })}
            {divergenceAnalysis.additionalConcepts.length > 0 && (
              <li>
                Additional concepts:{' '}
                <strong>
                  {divergenceAnalysis.additionalConcepts.slice(0, 3).join(', ')}
                </strong>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="comp-actions">
        <button onClick={onViewGuidance} className="btn-guidance">
          View Adaptive Guidance
        </button>
        <button onClick={onShowSolution} className="btn-solution">
          Show Solution
        </button>
      </div>
    </div>
  );
}

export default CompSummaryCard;
```

**CSS** (`CompSummaryCard.css`):
```css
.comp-summary-card {
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.comp-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comp-header .icon {
  font-size: 1.5rem;
}

.comp-header h4 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #06b6d4;
  margin: 0;
}

.similarity-score {
  font-size: 0.9rem;
  color: #22d3ee;
  font-weight: normal;
  margin-left: 0.5rem;
}

.divergences {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.divergences-header {
  font-size: 0.95rem;
  font-weight: 600;
  color: #67e8f9;
  margin-bottom: 0.5rem;
}

.divergences ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
  color: #cbd5e1;
}

.divergences li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.comp-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-guidance,
.btn-solution {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-guidance {
  background: #ea580c;
  color: white;
}

.btn-guidance:hover {
  background: #f97316;
}

.btn-solution {
  background: #9333ea;
  color: white;
}

.btn-solution:hover {
  background: #a855f7;
}

.comp-no-match {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.comp-no-match span {
  font-size: 1.5rem;
}

.comp-no-match h4 {
  font-weight: bold;
  color: #eab308;
  margin: 0 0 0.5rem 0;
}

.comp-no-match p {
  color: #cbd5e1;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}
```

---

### Adaptive Guidance Panel

```javascript
// components/AdaptiveGuidancePanel.jsx
import React from 'react';
import './AdaptiveGuidancePanel.css';

function AdaptiveGuidancePanel({ guidance, onShowSolution }) {
  if (!guidance || guidance.length === 0) {
    return null;
  }

  return (
    <div className="adaptive-guidance-panel">
      <h4 className="panel-header">
        📋 How to Adapt from the Comparable:
      </h4>

      <div className="guidance-items">
        {guidance.map((item, idx) => (
          <div key={idx} className={`guidance-item severity-${item.severity}`}>
            <div className="item-header">
              <h5 className="item-title">
                {item.severity === 'critical' && '🚨 '}
                {item.severity === 'high' && '⚠️ '}
                {item.title}
              </h5>
              {item.timeImpact > 0 && (
                <span className="time-impact">
                  ⏱️ Adds ~{item.timeImpact} minutes
                </span>
              )}
            </div>

            <p className="item-description">{item.description}</p>

            <details className="adaptation-steps">
              <summary>▸ Show adaptation steps</summary>
              <ol>
                {item.adaptationSteps.map((step, stepIdx) => (
                  <li key={stepIdx}>{step}</li>
                ))}
              </ol>
            </details>
          </div>
        ))}
      </div>

      <button onClick={onShowSolution} className="btn-show-solution">
        Still stuck? Show Full Solution
      </button>
    </div>
  );
}

export default AdaptiveGuidancePanel;
```

**CSS** (`AdaptiveGuidancePanel.css`):
```css
.adaptive-guidance-panel {
  background: rgba(234, 88, 12, 0.1);
  border: 1px solid rgba(234, 88, 12, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
}

.panel-header {
  font-size: 1.1rem;
  font-weight: bold;
  color: #fb923c;
  margin: 0 0 1rem 0;
}

.guidance-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guidance-item {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
}

.guidance-item.severity-critical {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
}

.guidance-item.severity-high {
  background: rgba(234, 88, 12, 0.1);
  border-color: rgba(234, 88, 12, 0.3);
}

.guidance-item.severity-medium {
  background: rgba(234, 179, 8, 0.1);
  border-color: rgba(234, 179, 8, 0.3);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.item-title {
  font-weight: bold;
  margin: 0;
}

.severity-critical .item-title {
  color: #f87171;
}

.severity-high .item-title {
  color: #fb923c;
}

.severity-medium .item-title {
  color: #fbbf24;
}

.time-impact {
  font-size: 0.75rem;
  color: #94a3b8;
}

.item-description {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin: 0 0 0.75rem 0;
}

.adaptation-steps {
  font-size: 0.875rem;
}

.adaptation-steps summary {
  cursor: pointer;
  color: #06b6d4;
  font-weight: 600;
  margin-bottom: 0.5rem;
  user-select: none;
}

.adaptation-steps ol {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0 0 0.5rem;
  color: #cbd5e1;
}

.adaptation-steps li {
  margin-bottom: 0.25rem;
}

.btn-show-solution {
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #9333ea;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-show-solution:hover {
  background: #a855f7;
}
```

---

## Customization

### Custom Similarity Threshold

```javascript
// More strict matching (only 85%+ similarity)
const analysis = findClosestCompWithDivergenceAnalysis(
  problem,
  library,
  0.85
);

// More lenient matching (accept 60%+ similarity)
const analysis = findClosestCompWithDivergenceAnalysis(
  problem,
  library,
  0.60
);

// Dynamic threshold based on problem difficulty
const threshold = problem.difficulty === 'hard' ? 0.75 : 0.65;
const analysis = findClosestCompWithDivergenceAnalysis(
  problem,
  library,
  threshold
);
```

### Custom Library Filtering

```javascript
// Only compare within same archetype tier
const sameTier = library.filter(p => {
  const tier = extractArchetype(p).charAt(0);
  return tier === extractArchetype(currentProblem).charAt(0);
});

const analysis = findClosestCompWithDivergenceAnalysis(
  currentProblem,
  sameTier
);

// Only compare problems with solutions
const withSolutions = library.filter(p => p.solution_steps?.length > 0);

// Only compare recent problems (last 6 months)
const recent = library.filter(p => {
  const date = new Date(p.created_at);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return date > sixMonthsAgo;
});
```

### Custom Guidance Filtering

```javascript
// Only show critical/high severity guidance
const criticalGuidance = compAnalysis.divergenceAnalysis.adaptationGuidance
  .filter(g => g.severity === 'critical' || g.severity === 'high');

// Only show guidance that adds significant time
const significantGuidance = compAnalysis.divergenceAnalysis.adaptationGuidance
  .filter(g => g.timeImpact > 2);

// Group guidance by type
const guidanceByType = {
  complexity: compAnalysis.divergenceAnalysis.adaptationGuidance
    .filter(g => g.type === 'additional_complexity'),
  simplification: compAnalysis.divergenceAnalysis.adaptationGuidance
    .filter(g => g.type === 'simplification'),
  conceptual: compAnalysis.divergenceAnalysis.adaptationGuidance
    .filter(g => g.type === 'conceptual_extension')
};
```

---

## Extension Patterns

### Adding New Deviation Types

**Step 1**: Add deviation to database (`src/utils/deviationInjector.js`)
```javascript
export const DEVIATION_DATABASE = [
  // ... existing deviations ...
  {
    code: 'DEV-X.Y.Z',
    name: 'My New Deviation',
    explanation: 'What makes this deviation unique',
    checkpoints: [
      'First checkpoint to verify',
      'Second checkpoint to verify'
    ],
    time_impact_minutes: 3.0,
    severity: 'high',
    category: 'custom'
  }
];
```

**Step 2**: Tag problems with new deviation
```javascript
// In problem JSON files
{
  "id": "problem-123",
  "deviations": ["DEV-1.1.1", "DEV-X.Y.Z"], // Include new deviation
  // ... rest of problem
}
```

**Step 3**: Guidance auto-generates
```javascript
// No code changes needed - adaptation guidance automatically
// generated from DEVIATION_DATABASE when deviation detected
```

---

### Adding New Archetypes

**Step 1**: Add archetype approach mapping
```javascript
// In src/utils/problemMatcher.js, update inferCompApproach()
const approachMap = {
  // ... existing archetypes ...
  'AX-NewArchetype': 'High-level approach description for new archetype'
};
```

**Step 2**: Tag problems with new archetype
```javascript
{
  "id": "problem-456",
  "archetype": "AX-NewArchetype",
  // ... rest of problem
}
```

**Step 3**: Similarity calculation works automatically
```javascript
// Archetype similarity uses tier matching automatically:
// - Exact match: 1.0
// - Same tier (AX): 0.5
// - Different tier: 0.0
```

---

### Custom Similarity Weights

To change the weighting of similarity factors, modify `calculateSimilarity()`:

```javascript
// Current weights (in src/utils/problemMatcher.js:209-211)
const ARCHETYPE_WEIGHT = 0.40;  // 40%
const DEVIATION_WEIGHT = 0.35;  // 35%
const KEYWORD_WEIGHT = 0.25;    // 25%

// Example: Prioritize deviations more
const ARCHETYPE_WEIGHT = 0.30;
const DEVIATION_WEIGHT = 0.50;  // Increased
const KEYWORD_WEIGHT = 0.20;
```

**Recommendation**: Keep total = 1.0, test extensively before changing

---

## Testing Integration

### Unit Test Example

```javascript
// MyComponent.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import MyComponent from './MyComponent';
import * as problemMatcher from '../../utils/problemMatcher';

jest.mock('../../utils/problemMatcher');

describe('MyComponent with Comp Analysis', () => {
  it('displays comp analysis when problem loads', async () => {
    const mockAnalysis = {
      hasComp: true,
      closestComp: { title: 'Test Comp' },
      similarityScore: 0.85,
      divergenceAnalysis: {
        additionalDeviations: ['DEV-1.2.1'],
        missingDeviations: [],
        additionalConcepts: [],
        adaptationGuidance: []
      }
    };

    problemMatcher.findClosestCompWithDivergenceAnalysis
      .mockReturnValue(mockAnalysis);

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText(/Similar to: Test Comp/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
    });
  });

  it('handles no comp found gracefully', async () => {
    const mockAnalysis = {
      hasComp: false,
      closestComp: null,
      similarityScore: 0.45,
      divergenceAnalysis: null
    };

    problemMatcher.findClosestCompWithDivergenceAnalysis
      .mockReturnValue(mockAnalysis);

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText(/No close comparable found/i)).toBeInTheDocument();
    });
  });
});
```

### Integration Test Example

```javascript
// End-to-end test
describe('Comp Analysis E2E', () => {
  it('loads problem, computes comp, displays divergences', async () => {
    render(<ProblemViewer />);

    // Wait for problem to load
    await waitFor(() => {
      expect(screen.getByText(/Problem 1/i)).toBeInTheDocument();
    });

    // Check comp summary appears
    expect(screen.getByText(/Similar to:/i)).toBeInTheDocument();

    // Check divergences displayed
    expect(screen.getByText(/Your problem adds:/i)).toBeInTheDocument();
  });
});
```

---

## Common Scenarios

### Scenario 1: Exam Prep Platform

**Requirement**: Show comp for every practice problem

```javascript
function ExamPrepPractice() {
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    if (problems[currentIndex]) {
      const analysis = findClosestCompWithDivergenceAnalysis(
        problems[currentIndex],
        problems
      );
      setCompAnalysis(analysis);
      setShowSolution(false); // Reset when changing problems
    }
  }, [currentIndex, problems]);

  return (
    <div>
      <ProblemDisplay problem={problems[currentIndex]} />

      {!showSolution && compAnalysis?.hasComp && (
        <CompSummaryCard
          analysis={compAnalysis}
          onShowSolution={() => setShowSolution(true)}
        />
      )}

      {showSolution && (
        <SolutionDisplay problem={problems[currentIndex]} />
      )}

      <Navigation
        onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
        onNext={() => setCurrentIndex(i => Math.min(problems.length - 1, i + 1))}
      />
    </div>
  );
}
```

---

### Scenario 2: Problem Recommendation Engine

**Requirement**: Find 5 most similar problems for practice

```javascript
import { findSimilarProblems } from '../../utils/problemMatcher';

function RecommendedPractice({ currentProblem, allProblems }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (currentProblem) {
      const results = findSimilarProblems(currentProblem, allProblems, 5);
      setRecommendations(results.similarProblems);
    }
  }, [currentProblem]);

  return (
    <div>
      <h3>Recommended Practice Problems:</h3>
      <ul>
        {recommendations.map((rec, idx) => (
          <li key={idx}>
            <strong>{rec.problem.title}</strong>
            <span> ({Math.round(rec.similarityScore * 100)}% similar)</span>
            <p>{rec.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Scenario 3: Instructor Dashboard

**Requirement**: Analyze which problems lack good comparables

```javascript
function InstructorAnalytics({ problemLibrary }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const results = problemLibrary.map(problem => {
      const analysis = findClosestCompWithDivergenceAnalysis(
        problem,
        problemLibrary,
        0.7
      );
      return {
        problem,
        hasComp: analysis.hasComp,
        similarityScore: analysis.similarityScore,
        divergenceCount: analysis.divergenceAnalysis?.additionalDeviations.length || 0
      };
    });

    const noComps = results.filter(r => !r.hasComp);
    const highDivergence = results.filter(r => r.divergenceCount >= 3);

    setAnalytics({
      totalProblems: problemLibrary.length,
      withComps: results.length - noComps.length,
      withoutComps: noComps.length,
      highDivergence: highDivergence.length,
      avgSimilarity: results.reduce((sum, r) => sum + r.similarityScore, 0) / results.length
    });
  }, [problemLibrary]);

  return (
    <div>
      <h2>Problem Coverage Analysis</h2>
      <p>Total Problems: {analytics?.totalProblems}</p>
      <p>With Good Comps (≥70%): {analytics?.withComps}</p>
      <p>Without Comps: {analytics?.withoutComps}</p>
      <p>High Divergence (≥3): {analytics?.highDivergence}</p>
      <p>Avg Similarity: {(analytics?.avgSimilarity * 100).toFixed(1)}%</p>
    </div>
  );
}
```

---

## See Also

- **[Architecture Guide](../architecture/comparative-analysis.md)**: System design and components
- **[API Reference](../api/comparative-analysis-api.md)**: Function signatures and examples
- **[Troubleshooting Guide](../troubleshooting/comp-analysis.md)**: Common issues and debugging

---

**Document Version**: 1.0
**Last Updated**: 2025-01-25
**Maintained By**: ACF Exam Prep Development Team
