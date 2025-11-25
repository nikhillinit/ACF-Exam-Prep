# Deviation Injection System

## What It Does

Automatically detects common exam pitfalls and injects contextual alerts directly into solution steps.

## Quick Start

```javascript
import { injectDeviationAlerts } from './deviationInjector.js';

// Load problem
const problem = {
  archetype: 'A1-CapitalStructure',
  solution_steps: [
    {
      part: 'Step 1',
      reasoning: 'With hazard rate 5%, survival decreases each year...',
      calculation: 'S(t) = (1-0.05)^t'
    }
  ]
};

// Enrich with deviation alerts
const enriched = injectDeviationAlerts(problem);

// Check for alerts
if (enriched.solution_steps[0].deviation_alert) {
  console.log('⚠️', enriched.solution_steps[0].deviation_alert.warning);
}
```

## Output Structure

```javascript
{
  solution_steps: [
    {
      part: 'Step 1',
      deviation_alert: {
        code: 'DEV-1.1.1',
        name: 'Hazard Rate Default',
        warning: '⚠️ Use IRR of expected cash flows...',
        explanation: 'Detailed explanation...',
        checkpoints: ['Check 1', 'Check 2', ...],
        time_impact_minutes: 3.5,
        severity: 'critical'
      }
    }
  ],
  deviation_summary: {
    total_deviations: 1,
    total_time_impact_minutes: 3.5,
    severity_distribution: { critical: 1, high: 0, medium: 0, low: 0 }
  }
}
```

## Available Functions

### `injectDeviationAlerts(problem)`
Main function. Takes problem object, returns enriched version with deviation alerts.

### `getDeviationsForArchetype(archetypeId)`
Returns all deviations for a specific archetype (useful for pre-flight checklists).

### `getDeviationByCode(code)`
Look up specific deviation by code (e.g., 'DEV-1.1.1').

### `getCriticalDeviations()`
Returns only critical severity deviations across all archetypes.

### `batchInjectDeviations(problems)`
Process multiple problems at once.

### `validateDeviationDatabase()`
Validate database integrity (useful for testing).

## Coverage

- **19 deviations** across 7 archetypes
- **4 critical** (exam killers)
- **10 high** severity (major errors)
- **4 medium** severity (important concepts)
- **1 low** severity (confirmations)

### By Archetype
- A1 (Capital Structure): 6 deviations
- A2A (Multi-State): 3 deviations
- A2B (Adverse Selection): 2 deviations
- A3 (CAPM): 3 deviations
- A4/A6 (Distress): 2 deviations
- A5 (Payout): 1 deviation
- A10 (Options): 2 deviations

## Critical Deviations

1. **DEV-1.1.1**: Hazard Rate Default (use IRR, not weighted average)
2. **DEV-2.1.1**: Equity Limited Liability (never negative)
3. **DEV-2.2.1**: Debt Overhang (check ΔEquity vs Investment)
4. **DEV-4.1.1**: Waterfall Priority (Senior → Junior → Equity)

## Integration

See `examples/deviationInjectorUsage.js` for detailed examples:
- React component integration
- Pre-flight checklist generation
- Real-time deviation detection
- Batch processing

## Testing

```bash
node src/utils/deviationInjector.test.js
```

## Documentation

- **Full Docs**: `docs/DEVIATION_INJECTION_SYSTEM.md`
- **Quick Reference**: `docs/DEVIATION_QUICK_REFERENCE.md`
- **Usage Examples**: `examples/deviationInjectorUsage.js`

## Files

- `deviationInjector.js` - Main system (450+ lines)
- `deviationInjector.test.js` - Test suite with 8 test cases
- `README_DEVIATIONS.md` - This file

## Performance

- ~150 pattern tests per problem (6-8 steps × 20 deviations)
- < 5ms execution time per problem
- Can batch process 100+ problems in < 500ms

## Validation Results

```
✓ Database valid
✓ 19 deviations
✓ 19 unique codes
✓ No errors
```
