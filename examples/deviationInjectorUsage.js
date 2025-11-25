/**
 * USAGE EXAMPLES: Deviation Injection System
 *
 * This file demonstrates how to integrate the deviation injection system
 * into various parts of the ACF Exam Prep application.
 */

import { injectDeviationAlerts, getDeviationsForArchetype } from '../src/utils/deviationInjector.js';

// ============================================
// EXAMPLE 1: Loading and Enriching Problems
// ============================================

/**
 * When loading problems from guided_problem_solving.json,
 * enrich them with deviation alerts before display
 */
async function loadEnrichedProblems() {
  // Load raw problems
  const response = await fetch('/source-materials/guided_problem_solving_COMPLETE.json');
  const data = await response.json();

  // Enrich each problem with deviation alerts
  const enrichedProblems = data.worked_examples.map(problem => {
    return injectDeviationAlerts(problem);
  });

  console.log('Loaded and enriched', enrichedProblems.length, 'problems');

  // Each problem now has:
  // - solution_steps with deviation_alert fields
  // - deviation_summary with totals and severity distribution

  return enrichedProblems;
}

// ============================================
// EXAMPLE 2: Displaying Deviation Alerts in UI
// ============================================

/**
 * React component to display a solution step with deviation alert
 */
function SolutionStepWithAlert({ step }) {
  return (
    <div className="solution-step">
      <h3>{step.part}</h3>

      {/* Show deviation alert if present */}
      {step.deviation_alert && (
        <div className={`deviation-alert severity-${step.deviation_alert.severity}`}>
          <div className="alert-header">
            <span className="alert-icon">⚠️</span>
            <strong>{step.deviation_alert.code}</strong>: {step.deviation_alert.name}
          </div>

          <p className="alert-warning">{step.deviation_alert.warning}</p>

          <details>
            <summary>Why this matters (click to expand)</summary>
            <p>{step.deviation_alert.explanation}</p>

            <h4>Checkpoints:</h4>
            <ul>
              {step.deviation_alert.checkpoints.map((checkpoint, i) => (
                <li key={i}>{checkpoint}</li>
              ))}
            </ul>

            <p className="time-impact">
              ⏱️ Time impact if triggered: <strong>{step.deviation_alert.time_impact_minutes} minutes</strong>
            </p>
          </details>
        </div>
      )}

      <div className="step-content">
        <p><strong>Prompt:</strong> {step.prompt}</p>
        <p><strong>Reasoning:</strong> {step.reasoning}</p>
        <pre>{step.calculation}</pre>
        <p className="sanity-check"><em>{step.sanity_check}</em></p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Pre-Flight Checklist Generation
// ============================================

/**
 * Generate a pre-flight checklist for a specific archetype
 * Shows all potential deviations BEFORE starting the problem
 */
function generatePreFlightChecklist(archetypeId) {
  const deviations = getDeviationsForArchetype(archetypeId);

  const checklist = {
    archetype: archetypeId,
    totalDeviations: deviations.length,
    criticalDeviations: deviations.filter(d => d.severity === 'critical').length,
    totalTimeRisk: deviations.reduce((sum, d) => sum + d.time_impact_minutes, 0),
    items: deviations.map(dev => ({
      code: dev.code,
      name: dev.name,
      severity: dev.severity,
      quickCheck: dev.checkpoints[0] // First checkpoint as quick reference
    }))
  };

  return checklist;
}

// Usage in React component
function PreFlightChecklistView({ archetype }) {
  const checklist = generatePreFlightChecklist(archetype);

  return (
    <div className="pre-flight-checklist">
      <h2>⚠️ Pre-Flight Checklist: {archetype}</h2>
      <p>
        Watch out for <strong>{checklist.criticalDeviations} critical</strong> deviations
        (total time risk: <strong>{checklist.totalTimeRisk} minutes</strong>)
      </p>

      <ul>
        {checklist.items.map(item => (
          <li key={item.code} className={`severity-${item.severity}`}>
            <strong>{item.code}</strong>: {item.name}
            <br />
            <em>Quick check: {item.quickCheck}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Real-Time Deviation Detection
// ============================================

/**
 * As user works through a problem in practice mode,
 * check if they're approaching a deviation
 */
function checkForDeviationsInUserWork(userText, currentStep, archetype) {
  // Create a mock step with user's work
  const mockStep = {
    part: currentStep.part,
    reasoning: userText,
    calculation: userText
  };

  const mockProblem = {
    archetype: archetype,
    solution_steps: [mockStep]
  };

  const enriched = injectDeviationAlerts(mockProblem);

  if (enriched.solution_steps[0].deviation_alert) {
    return {
      detected: true,
      alert: enriched.solution_steps[0].deviation_alert,
      message: `🚨 Deviation detected: ${enriched.solution_steps[0].deviation_alert.name}`
    };
  }

  return { detected: false };
}

// ============================================
// EXAMPLE 5: Integration with ProblemViewer
// ============================================

/**
 * Modify ProblemViewer to load enriched problems
 */
class EnrichedProblemViewer extends React.Component {
  state = {
    problem: null,
    currentStep: 0
  };

  async componentDidMount() {
    // Load problem (simplified)
    const rawProblem = await this.loadProblem(this.props.problemId);

    // Enrich with deviations
    const enrichedProblem = injectDeviationAlerts(rawProblem);

    this.setState({ problem: enrichedProblem });
  }

  render() {
    const { problem, currentStep } = this.state;
    if (!problem) return <div>Loading...</div>;

    const step = problem.solution_steps[currentStep];

    return (
      <div className="problem-viewer">
        <h1>{problem.id}</h1>

        {/* Show deviation summary */}
        {problem.deviation_summary && problem.deviation_summary.total_deviations > 0 && (
          <div className="deviation-summary">
            <h3>⚠️ Deviation Summary</h3>
            <p>
              This problem has <strong>{problem.deviation_summary.total_deviations}</strong> deviations
              with total time risk of <strong>{problem.deviation_summary.total_time_impact_minutes}</strong> minutes.
            </p>
            <ul>
              <li>Critical: {problem.deviation_summary.severity_distribution.critical}</li>
              <li>High: {problem.deviation_summary.severity_distribution.high}</li>
              <li>Medium: {problem.deviation_summary.severity_distribution.medium}</li>
              <li>Low: {problem.deviation_summary.severity_distribution.low}</li>
            </ul>
          </div>
        )}

        {/* Display current step with alert */}
        <SolutionStepWithAlert step={step} />

        {/* Navigation */}
        <div className="navigation">
          <button onClick={() => this.setState({ currentStep: currentStep - 1 })}
                  disabled={currentStep === 0}>
            Previous
          </button>
          <span>{currentStep + 1} / {problem.solution_steps.length}</span>
          <button onClick={() => this.setState({ currentStep: currentStep + 1 })}
                  disabled={currentStep === problem.solution_steps.length - 1}>
            Next
          </button>
        </div>
      </div>
    );
  }
}

// ============================================
// EXAMPLE 6: Batch Processing
// ============================================

/**
 * Process all problems in the database and generate statistics
 */
async function analyzeAllProblems() {
  const response = await fetch('/source-materials/guided_problem_solving_COMPLETE.json');
  const data = await response.json();

  const enrichedProblems = data.worked_examples.map(p => injectDeviationAlerts(p));

  // Generate statistics
  const stats = {
    totalProblems: enrichedProblems.length,
    problemsWithDeviations: enrichedProblems.filter(p => p.deviation_summary.total_deviations > 0).length,
    totalDeviations: enrichedProblems.reduce((sum, p) => sum + p.deviation_summary.total_deviations, 0),
    totalTimeRisk: enrichedProblems.reduce((sum, p) => sum + p.deviation_summary.total_time_impact_minutes, 0),
    byArchetype: {}
  };

  enrichedProblems.forEach(problem => {
    const arch = problem.archetype;
    if (!stats.byArchetype[arch]) {
      stats.byArchetype[arch] = {
        problems: 0,
        deviations: 0,
        timeRisk: 0
      };
    }
    stats.byArchetype[arch].problems++;
    stats.byArchetype[arch].deviations += problem.deviation_summary.total_deviations;
    stats.byArchetype[arch].timeRisk += problem.deviation_summary.total_time_impact_minutes;
  });

  console.log('Problem Analysis:', stats);
  return stats;
}

// ============================================
// EXAMPLE 7: CSS Styling (optional)
// ============================================

const deviationAlertStyles = `
/* Base alert styling */
.deviation-alert {
  border-left: 4px solid;
  padding: 12px;
  margin: 16px 0;
  background: #fff3cd;
  border-radius: 4px;
}

/* Severity levels */
.deviation-alert.severity-critical {
  border-color: #dc3545;
  background: #f8d7da;
}

.deviation-alert.severity-high {
  border-color: #fd7e14;
  background: #fff3cd;
}

.deviation-alert.severity-medium {
  border-color: #ffc107;
  background: #fff8e1;
}

.deviation-alert.severity-low {
  border-color: #17a2b8;
  background: #d1ecf1;
}

/* Alert header */
.deviation-alert .alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: bold;
}

.deviation-alert .alert-icon {
  font-size: 1.2em;
}

/* Warning text */
.deviation-alert .alert-warning {
  margin: 8px 0;
  font-size: 1.05em;
}

/* Time impact */
.deviation-alert .time-impact {
  margin-top: 12px;
  padding: 8px;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  font-size: 0.9em;
}

/* Checkpoints */
.deviation-alert ul {
  margin: 8px 0;
  padding-left: 24px;
}

.deviation-alert li {
  margin: 4px 0;
}

/* Summary view */
.deviation-summary {
  padding: 16px;
  background: #e7f3ff;
  border: 1px solid #2196f3;
  border-radius: 4px;
  margin-bottom: 20px;
}

.deviation-summary h3 {
  margin-top: 0;
  color: #1976d2;
}

.deviation-summary ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 16px;
}

.deviation-summary li {
  padding: 4px 12px;
  background: white;
  border-radius: 4px;
  font-size: 0.9em;
}
`;

// ============================================
// EXAMPLE 8: Integration Points
// ============================================

/**
 * Key integration points in existing codebase:
 *
 * 1. src/components/practice/ProblemViewer.jsx
 *    - Import injectDeviationAlerts
 *    - Enrich problem in loadProblemData()
 *    - Render alerts in step display
 *
 * 2. src/components/reconnaissance/ReconView.jsx
 *    - Show pre-flight checklist after archetype detection
 *    - Use getDeviationsForArchetype()
 *
 * 3. src/components/review/MasteryDashboard.jsx
 *    - Track deviation encounters in user performance
 *    - Show deviation mastery by code
 *
 * 4. src/utils/resourceLoader.js
 *    - Batch process all problems on app load
 *    - Cache enriched problems
 */

export {
  loadEnrichedProblems,
  SolutionStepWithAlert,
  generatePreFlightChecklist,
  PreFlightChecklistView,
  checkForDeviationsInUserWork,
  EnrichedProblemViewer,
  analyzeAllProblems,
  deviationAlertStyles
};
