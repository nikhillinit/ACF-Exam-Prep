# Deviation Injection System

## Overview

The Deviation Injection System is a sophisticated pattern-matching engine that automatically detects common pitfalls, exam traps, and conceptual deviations in ACF exam problems. It processes `solution_steps` arrays and injects inline deviation alerts exactly where they apply.

## Architecture: Option A (Inline Injection)

The system implements **Option A** from the brainstorming session: deviation alerts are injected directly into solution steps as a `deviation_alert` field, making them contextually relevant and immediately actionable.

### Data Flow

```
Raw Problem Object
    ↓
injectDeviationAlerts()
    ↓
Pattern Matching Engine
    ↓
Deviation Detection
    ↓
Alert Injection
    ↓
Enriched Problem Object
```

## Core Components

### 1. Deviation Database (`DEVIATION_DATABASE`)

A comprehensive catalog of 20+ deviations across all major archetypes:

- **A1 (Capital Structure)**: Hazard rate vs binary default, tax shield discount rates, amortizing debt
- **A2A (Multi-State)**: Equity limited liability, debt overhang detection, wealth transfers
- **A2B (Adverse Selection)**: Incentive compatibility, pooling equilibrium beliefs
- **A3 (CAPM)**: Levered/unlevered beta, WACC circularity, project-specific discount rates
- **A4 (Distress)**: Absolute priority waterfall, recovery rates
- **A5 (Payout)**: Dividend vs repurchase equivalence
- **A10 (Options)**: Put-call parity, Black-Scholes assumptions

Each deviation includes:
```javascript
{
  code: 'DEV-X.Y.Z',              // Unique identifier
  name: 'Short Descriptive Name',
  archetype: 'A1-CapitalStructure',
  patterns: [/* regex/keywords */],
  contextPatterns: [/* additional context */],
  antiPatterns: [/* exclusion patterns */],
  warning: '⚠️ Alert message',
  explanation: 'Why this matters...',
  checkpoints: ['Step 1', 'Step 2', ...],
  time_impact_minutes: 3.5,
  severity: 'critical' | 'high' | 'medium' | 'low',
  tier: 1 | 2
}
```

### 2. Pattern Matching Engine

The engine uses a three-layer matching system:

1. **Primary Patterns**: Core keywords/regex that identify the deviation context
2. **Context Patterns**: Additional signals that confirm applicability
3. **Anti-Patterns**: Exclusion patterns that prevent false positives

Example: DEV-1.1.1 (Hazard Rate Default)
```javascript
patterns: [
  /survival.*decrease|survival.*declin/i,
  /hazard.*rate/i,
  /(1\s*-\s*h(?:azard)?)\s*^\s*t/i
]
contextPatterns: [
  /expected return.*debt/i,
  /E\[r_D\]/i
]
antiPatterns: [
  /one.*year.*bond/i  // Exclude binary default
]
```

### 3. Main API Function

```javascript
injectDeviationAlerts(problem)
```

**Input**: Problem object with `solution_steps` array
```javascript
{
  id: 'problem-id',
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1',
      prompt: '...',
      reasoning: '...',
      calculation: '...',
      sanity_check: '...'
    }
  ]
}
```

**Output**: Enriched problem with deviation alerts
```javascript
{
  id: 'problem-id',
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1',
      prompt: '...',
      reasoning: '...',
      calculation: '...',
      sanity_check: '...',
      deviation_alert: {
        code: 'DEV-1.1.1',
        name: 'Hazard Rate Default',
        warning: '⚠️ Use IRR of expected cash flows...',
        explanation: 'With hazard rate models...',
        checkpoints: ['Check 1', 'Check 2', ...],
        time_impact_minutes: 3.5,
        severity: 'critical'
      },
      all_deviations: ['DEV-1.1.1', 'DEV-1.2.1']
    }
  ],
  deviation_summary: {
    total_deviations: 2,
    deviation_codes: ['DEV-1.1.1', 'DEV-1.2.1'],
    total_time_impact_minutes: 6.0,
    severity_distribution: {
      critical: 1,
      high: 1,
      medium: 0,
      low: 0
    }
  }
}
```

## Key Deviations

### Critical Severity (Exam Killers)

#### DEV-1.1.1: Hazard Rate Default - IRR Method
- **Context**: Multi-period debt with hazard rate
- **Trap**: Using weighted average instead of IRR of expected cash flows
- **Detection**: Looks for "survival decreases", "hazard rate", survival formula
- **Impact**: 3.5 minutes
- **Why Critical**: Fundamental conceptual error in expected return calculation

#### DEV-2.1.1: Equity Limited Liability
- **Context**: Multi-state valuation with debt
- **Trap**: Allowing negative equity values
- **Detection**: Looks for "equity value", "firm value - debt", state calculations
- **Impact**: 2.0 minutes
- **Why Critical**: Violates basic corporate finance principle

#### DEV-2.2.1: Debt Overhang Detection
- **Context**: New project with existing debt
- **Trap**: Assuming positive firm NPV means equity will invest
- **Detection**: Looks for "debt overhang", "underinvestment", "new project"
- **Impact**: 4.0 minutes
- **Why Critical**: Central concept in A2A problems

#### DEV-4.1.1: Absolute Priority Rule Waterfall
- **Context**: Bankruptcy/liquidation with multiple debt classes
- **Trap**: Not respecting strict priority ordering
- **Detection**: Looks for "waterfall", "priority", "senior", "junior"
- **Impact**: 2.5 minutes
- **Why Critical**: Fundamental to distress problems

### High Severity (Major Errors)

#### DEV-1.2.1: Tax Shield Discount Rate
- **Trap**: Discounting tax shields at r_E or WACC instead of r_D
- **Impact**: 2.5 minutes

#### DEV-1.3.1: Promised Yield vs Expected Return
- **Trap**: Confusing promised YTM with expected return on debt
- **Impact**: 2.0 minutes

#### DEV-1.4.1: Amortizing Debt Principal Schedule
- **Trap**: Treating amortizing debt like bullet debt
- **Impact**: 3.0 minutes

#### DEV-3.1.1: Levered vs Unlevered Beta
- **Trap**: Not properly unlevering/relevering beta
- **Impact**: 2.5 minutes

## Usage Examples

### Basic Usage

```javascript
import { injectDeviationAlerts } from './utils/deviationInjector.js';

// Load raw problem
const rawProblem = await loadProblem('a1-hazard-rate');

// Enrich with deviations
const enrichedProblem = injectDeviationAlerts(rawProblem);

// Display with alerts
enrichedProblem.solution_steps.forEach(step => {
  console.log(step.part);
  if (step.deviation_alert) {
    console.log('⚠️', step.deviation_alert.warning);
  }
});
```

### React Component Integration

```jsx
function SolutionStep({ step }) {
  return (
    <div className="step">
      <h3>{step.part}</h3>

      {step.deviation_alert && (
        <DeviationAlert alert={step.deviation_alert} />
      )}

      <p>{step.reasoning}</p>
      <pre>{step.calculation}</pre>
    </div>
  );
}

function DeviationAlert({ alert }) {
  return (
    <div className={`alert severity-${alert.severity}`}>
      <div className="alert-header">
        <strong>{alert.code}</strong>: {alert.name}
      </div>
      <p>{alert.warning}</p>

      <details>
        <summary>Why this matters</summary>
        <p>{alert.explanation}</p>
        <ul>
          {alert.checkpoints.map((cp, i) => (
            <li key={i}>{cp}</li>
          ))}
        </ul>
        <p>Time impact: {alert.time_impact_minutes} minutes</p>
      </details>
    </div>
  );
}
```

### Pre-Flight Checklist

```javascript
import { getDeviationsForArchetype } from './utils/deviationInjector.js';

// After archetype detection, show relevant deviations
const deviations = getDeviationsForArchetype('A1-CapitalStructure');

console.log('Watch out for:');
deviations.forEach(dev => {
  console.log(`- ${dev.code}: ${dev.name} (${dev.severity})`);
  console.log(`  ${dev.checkpoints[0]}`);
});
```

### Batch Processing

```javascript
import { batchInjectDeviations } from './utils/deviationInjector.js';

// Process all problems at once
const allProblems = await loadAllProblems();
const enrichedProblems = batchInjectDeviations(allProblems);

// Generate statistics
const stats = {
  totalProblems: enrichedProblems.length,
  withDeviations: enrichedProblems.filter(p =>
    p.deviation_summary.total_deviations > 0
  ).length
};
```

## Integration Points

### 1. ProblemViewer Component
**File**: `src/components/practice/ProblemViewer.jsx`

```javascript
import { injectDeviationAlerts } from '../../utils/deviationInjector';

// In loadProblemData():
const rawProblem = await fetchProblem(problemId);
const enrichedProblem = injectDeviationAlerts(rawProblem);
this.setState({ problem: enrichedProblem });
```

### 2. ReconView Component
**File**: `src/components/reconnaissance/ReconView.jsx`

```javascript
import { getDeviationsForArchetype } from '../../utils/deviationInjector';

// After archetype detection:
const deviations = getDeviationsForArchetype(detectedArchetype);
this.setState({ preFlightChecklist: deviations });
```

### 3. Resource Loader
**File**: `src/utils/resourceLoader.js`

```javascript
import { batchInjectDeviations } from './deviationInjector';

export async function loadGuidedProblems() {
  const response = await fetch('/source-materials/guided_problem_solving_COMPLETE.json');
  const data = await response.json();

  // Enrich on load
  const enriched = batchInjectDeviations(data.worked_examples);

  return enriched;
}
```

### 4. MasteryDashboard
**File**: `src/components/review/MasteryDashboard.jsx`

Track user encounters with deviations:
```javascript
{
  userId: 'user123',
  deviationMastery: {
    'DEV-1.1.1': {
      encountered: 5,
      avoided: 3,
      triggered: 2,
      lastEncounter: '2025-01-15'
    }
  }
}
```

## Performance Considerations

- **Pattern Matching**: O(n × m) where n = steps, m = deviations
- **Typical Problem**: 6-8 steps, 20 deviations → ~150 pattern tests
- **Execution Time**: < 5ms per problem
- **Batch Processing**: Can handle 100+ problems in < 500ms

## Testing

Run the test suite:
```bash
node src/utils/deviationInjector.test.js
```

Tests cover:
1. Database validation
2. Hazard rate detection (DEV-1.1.1)
3. Binary default detection (DEV-1.1.2)
4. Tax shield discount rate (DEV-1.2.1)
5. Equity limited liability (DEV-2.1.1)
6. Debt overhang (DEV-2.2.1)
7. Query functions
8. Real problem integration

## Extending the System

### Adding a New Deviation

1. Add to `DEVIATION_DATABASE`:
```javascript
{
  code: 'DEV-X.Y.Z',
  name: 'Your Deviation Name',
  archetype: 'A1-CapitalStructure',
  patterns: [
    /pattern1/i,
    /pattern2/i
  ],
  warning: '⚠️ Your warning message',
  explanation: 'Detailed explanation...',
  checkpoints: [
    'Checkpoint 1',
    'Checkpoint 2'
  ],
  time_impact_minutes: 2.5,
  severity: 'high',
  tier: 1
}
```

2. Test detection:
```javascript
const testProblem = {
  archetype: 'A1-CapitalStructure',
  solution_steps: [{
    reasoning: 'Text containing your pattern...'
  }]
};

const enriched = injectDeviationAlerts(testProblem);
console.log(enriched.solution_steps[0].deviation_alert);
```

3. Validate:
```javascript
const validation = validateDeviationDatabase();
console.log(validation);
```

## Deviation Code Schema

Format: `DEV-X.Y.Z`

- **X**: Archetype number (1=A1, 2=A2A, 2B=A2B, 3=A3, etc.)
- **Y**: Category within archetype (1=core, 2=edge cases, 3=advanced)
- **Z**: Specific deviation number

Examples:
- `DEV-1.1.1`: A1, core category, deviation #1 (Hazard Rate)
- `DEV-1.2.1`: A1, edge cases, deviation #1 (Tax Shield Discount)
- `DEV-2.1.1`: A2A, core category, deviation #1 (Limited Liability)

## Future Enhancements

1. **Machine Learning**: Train model on past exam questions to detect new deviation patterns
2. **User Feedback**: Allow users to confirm/dispute deviation applicability
3. **Difficulty Calibration**: Adjust severity based on user performance data
4. **Dynamic Patterns**: Update patterns based on emerging exam trends
5. **Multi-Language**: Support explanations in multiple languages
6. **Integration with LLM**: Use GPT-4 to generate contextual explanations

## FAQ

**Q: What if a deviation is incorrectly detected?**
A: Use `antiPatterns` to exclude false positives, or adjust pattern specificity.

**Q: Can multiple deviations apply to one step?**
A: Yes. The system stores all matches in `all_deviations`, but displays the highest severity one in `deviation_alert`.

**Q: How do I disable deviation injection?**
A: Simply don't call `injectDeviationAlerts()`. The system is opt-in.

**Q: Are deviations archetype-specific?**
A: Yes. The system only checks deviations that match the problem's archetype.

**Q: Can I query deviations without injecting them?**
A: Yes. Use `getDeviationsForArchetype()`, `getDeviationByCode()`, etc.

## Conclusion

The Deviation Injection System provides:
- ✅ Inline, contextual deviation alerts
- ✅ Comprehensive database of 20+ critical deviations
- ✅ Fast, efficient pattern matching
- ✅ Easy integration with existing components
- ✅ Extensible architecture for future deviations
- ✅ Testing and validation tools

By making deviation alerts contextually relevant and immediately actionable, the system helps students avoid costly mistakes and develop robust problem-solving intuition.
