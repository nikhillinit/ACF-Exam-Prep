import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ProblemViewer.css';
import { findClosestCompWithDivergenceAnalysis } from '../../utils/problemMatcher';
import { getDeviationByCode } from '../../utils/deviationInjector';

function ProblemViewer() {
  const { '*': pathParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse archetype from path (e.g., /practice/A1-CapitalStructure)
  const archetype = pathParam || null;
  
  // Parse mode from query params
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'browse';
  
  // State
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [compAnalysis, setCompAnalysis] = useState(null);
  const [showGuidance, setShowGuidance] = useState(false);

  // Load problems on mount or when archetype changes
  useEffect(() => {
    loadProblems();
  }, [archetype]);

  // Auto-compute comp analysis when problem changes
  useEffect(() => {
    if (problems.length > 0 && currentProblemIndex >= 0 && currentProblemIndex < problems.length) {
      const currentProblem = problems[currentProblemIndex];
      const analysis = findClosestCompWithDivergenceAnalysis(currentProblem, problems);
      setCompAnalysis(analysis);
      setShowGuidance(false); // Reset guidance when changing problems
    }
  }, [currentProblemIndex, problems]);

  async function loadProblems() {
    setLoading(true);
    setError(null);
    
    try {
      // Load both guided examples and mock questions from v11 files
      const [guidedResponse, mockResponse] = await Promise.all([
        fetch('/source-materials/guided_examples_v11.json'),
        fetch('/source-materials/mock_questions_v11.json')
      ]);

      if (!guidedResponse.ok || !mockResponse.ok) {
        throw new Error('Failed to load problem data');
      }

      const guidedData = await guidedResponse.json();
      const mockData = await mockResponse.json();

      // Combine all problems
      const allProblems = [
        ...(guidedData.worked_examples || []),
        ...(mockData.worked_examples || [])
      ];

      // Filter by archetype if specified
      let filteredProblems = allProblems;
      if (archetype) {
        filteredProblems = allProblems.filter(problem => {
          const problemArchetype = problem.primary_archetype || problem.archetype || '';
          return problemArchetype.includes(archetype);
        });
      }

      if (filteredProblems.length === 0) {
        setError(`No problems found for archetype: ${archetype}`);
        setProblems([]);
      } else {
        setProblems(filteredProblems);
        setCurrentProblemIndex(0);
        setShowSolution(false);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading problems:', err);
      setError(`Error loading problems: ${err.message}`);
      setLoading(false);
    }
  }

  function nextProblem() {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setShowSolution(false);
    }
  }

  function previousProblem() {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      setShowSolution(false);
    }
  }

  function toggleSolution() {
    setShowSolution(!showSolution);
  }

  // Render loading state
  if (loading) {
    return (
      <div className="problem-viewer">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading problems...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="problem-viewer">
        <div className="error-state">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/library')}>
            Go to Problem Library
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (problems.length === 0) {
    return (
      <div className="problem-viewer">
        <div className="empty-state">
          <h2>No Problems Found</h2>
          <p>No problems available{archetype ? ` for archetype: ${archetype}` : ''}.</p>
          <button onClick={() => navigate('/library')}>
            Browse Problem Library
          </button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex];
  
  // Extract deviation information
  const deviations = currentProblem.comparison?.deviations_detected || [];
  const keyDistinctions = currentProblem.comparison?.key_distinctions || [];
  const hasDeviations = deviations.length > 0;

  return (
    <div className="problem-viewer">
      {/* Header */}
      <div className="viewer-header">
        <div className="header-info">
          <h2>
            {mode === 'instant' ? '⚡ Guided Practice' : '📝 Problem Viewer'}
          </h2>
          <div className="problem-meta">
            <span className="archetype-badge">
              {currentProblem.primary_archetype || currentProblem.archetype}
            </span>
            <span className="problem-counter">
              Problem {currentProblemIndex + 1} of {problems.length}
            </span>
            {hasDeviations && (
              <span className="deviation-indicator" title="This problem has deviations from standard approach">
                ⚠️ Deviations
              </span>
            )}
          </div>
        </div>
        <button 
          className="close-button"
          onClick={() => navigate('/library')}
        >
          ✕ Close
        </button>
      </div>

      {/* Deviation Warning Banner (if deviations exist) */}
      {hasDeviations && (
        <div className="deviation-banner">
          <div className="deviation-banner-icon">⚠️</div>
          <div className="deviation-banner-content">
            <h4>ACF Deviation Alert</h4>
            <p>This problem contains deviations from standard approaches. Pay special attention to:</p>
            <div className="deviation-tags">
              {deviations.map((deviation, index) => (
                <span key={index} className="deviation-tag">
                  {deviation}
                </span>
              ))}
            </div>
            {keyDistinctions.length > 0 && (
              <div className="key-distinctions">
                <strong>Key Distinctions:</strong>
                <ul>
                  {keyDistinctions.map((distinction, index) => (
                    <li key={index}>{distinction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Problem Content */}
      <div className="problem-content">
        <div className="problem-header">
          <h3>{currentProblem.title || currentProblem.id || `Problem ${currentProblemIndex + 1}`}</h3>
          {currentProblem.estimated_time_minutes && (
            <span className="time-estimate">⏱️ {currentProblem.estimated_time_minutes} min</span>
          )}
        </div>

        {/* Problem Statement */}
        <div className="problem-statement">
          <h4>Problem Statement</h4>
          <div className="problem-text">
            {currentProblem.problem_intro || currentProblem.problem_statement || currentProblem.problem_text}
          </div>
        </div>

        {/* Problem Parts (if available) */}
        {currentProblem.problem_parts && currentProblem.problem_parts.length > 0 && (
          <div className="problem-parts">
            <h4>Parts</h4>
            {currentProblem.problem_parts.map((part, index) => (
              <div key={index} className="problem-part">
                <div className="part-header">
                  <strong>Part {part.part_id || index + 1}</strong>
                  {part.label && <span> - {part.label}</span>}
                  {part.points && <span className="points"> ({part.points} pts)</span>}
                </div>
                <div className="part-text">{part.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Comparative Analysis Section (if not showing solution) */}
        {!showSolution && compAnalysis && (
          <div className="comp-analysis-section">
            {/* Comp Summary Card */}
            {compAnalysis.hasComp ? (
              <div className="comp-summary-card bg-cyan-900/20 rounded-lg border border-cyan-500/30 p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">🔍</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-cyan-400 mb-2">
                      Similar to: {compAnalysis.closestComp.title || compAnalysis.closestComp.id}
                      <span className="ml-2 text-sm font-normal text-cyan-300">
                        ({Math.round(compAnalysis.similarityScore * 100)}% match)
                      </span>
                    </h4>
                    {compAnalysis.divergenceAnalysis &&
                     (compAnalysis.divergenceAnalysis.additionalDeviations.length > 0 ||
                      compAnalysis.divergenceAnalysis.additionalConcepts.length > 0) && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-cyan-300 mb-2">Key differences:</p>
                        <ul className="space-y-1">
                          {compAnalysis.divergenceAnalysis.additionalDeviations.map((dev, idx) => {
                            const deviation = getDeviationByCode(dev);
                            return (
                              <li key={idx} className="text-sm text-slate-300">
                                • Your problem adds: <strong className="text-orange-400">{deviation?.name || dev}</strong>
                              </li>
                            );
                          })}
                          {compAnalysis.divergenceAnalysis.additionalConcepts.length > 0 && (
                            <li className="text-sm text-slate-300">
                              • Additional concepts: <strong className="text-purple-400">
                                {compAnalysis.divergenceAnalysis.additionalConcepts.slice(0, 3).join(', ')}
                              </strong>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowGuidance(!showGuidance)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all text-sm font-semibold"
                  >
                    {showGuidance ? 'Hide Guidance' : 'View Adaptive Guidance'}
                  </button>
                  <button
                    onClick={toggleSolution}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all text-sm font-semibold"
                  >
                    Show Solution
                  </button>
                </div>
              </div>
            ) : (
              <div className="comp-no-match bg-yellow-900/20 rounded-lg border border-yellow-500/30 p-6 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">
                      No close comparable found
                    </h4>
                    <p className="text-sm text-slate-300 mb-2">
                      Best match: {Math.round(compAnalysis.similarityScore * 100)}% similar
                    </p>
                    <p className="text-sm text-slate-400">
                      Use the Archetype Guide instead for this problem type.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Adaptive Guidance Panel */}
            {showGuidance && compAnalysis.hasComp && compAnalysis.divergenceAnalysis && (
              <div className="adaptive-guidance bg-orange-900/20 rounded-lg border border-orange-500/30 p-6 mb-4">
                <h4 className="text-lg font-bold text-orange-400 mb-4">
                  📋 How to Adapt from the Comparable:
                </h4>
                <div className="space-y-4">
                  {compAnalysis.divergenceAnalysis.adaptationGuidance.map((guidance, idx) => (
                    <div key={idx} className={`guidance-item p-4 rounded-lg border ${
                      guidance.severity === 'critical' ? 'bg-red-900/20 border-red-500/30' :
                      guidance.severity === 'high' ? 'bg-orange-900/20 border-orange-500/30' :
                      'bg-yellow-900/20 border-yellow-500/30'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className={`font-bold ${
                          guidance.severity === 'critical' ? 'text-red-400' :
                          guidance.severity === 'high' ? 'text-orange-400' :
                          'text-yellow-400'
                        }`}>
                          {guidance.severity === 'critical' && '🚨 '}
                          {guidance.severity === 'high' && '⚠️ '}
                          {guidance.title}
                        </h5>
                        {guidance.timeImpact > 0 && (
                          <span className="text-xs text-slate-400">
                            ⏱️ Adds ~{guidance.timeImpact} minutes
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{guidance.description}</p>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-cyan-400 font-semibold mb-2">
                          ▸ Show adaptation steps
                        </summary>
                        <ol className="list-decimal list-inside space-y-1 ml-4 text-slate-300">
                          {guidance.adaptationSteps.map((step, stepIdx) => (
                            <li key={stepIdx}>{step}</li>
                          ))}
                        </ol>
                      </details>
                    </div>
                  ))}
                </div>
                <button
                  onClick={toggleSolution}
                  className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all text-sm font-semibold"
                >
                  Still stuck? Show Full Solution
                </button>
              </div>
            )}
          </div>
        )}

        {/* Solution Section */}
        <div className="solution-section">
          <button 
            className={`solution-toggle ${showSolution ? 'active' : ''}`}
            onClick={toggleSolution}
          >
            {showSolution ? '👁️ Hide Solution' : '👁️ Show Solution'}
          </button>

          {showSolution && (
            <div className="solution-content">
              {/* Deviation Warning in Solution (repeated for emphasis) */}
              {hasDeviations && (
                <div className="deviation-solution-warning">
                  <h4>⚠️ Deviation Alert</h4>
                  <p>This solution involves the following deviations from standard ACF approaches:</p>
                  <div className="deviation-list">
                    {deviations.map((deviation, index) => (
                      <div key={index} className="deviation-item">
                        <span className="deviation-bullet">▸</span>
                        <strong>{deviation.toUpperCase()}</strong>
                      </div>
                    ))}
                  </div>
                  {keyDistinctions.length > 0 && (
                    <div className="distinctions-list">
                      {keyDistinctions.map((distinction, index) => (
                        <div key={index} className="distinction-item">
                          • {distinction}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Solution Steps */}
              {currentProblem.solution_steps && currentProblem.solution_steps.length > 0 && (
                <div className="solution-steps">
                  <h4>Solution Steps</h4>
                  {currentProblem.solution_steps.map((step, index) => (
                    <div key={index} className="solution-step">
                      {/* Inline Deviation Alert */}
                      {step.deviation_alert && (
                        <div className="step-deviation-alert">
                          <div className="alert-header">
                            <span className="alert-icon">⚠️</span>
                            <span className="alert-code">{step.deviation_alert.code}</span>
                            <span className="alert-name">{step.deviation_alert.name}</span>
                          </div>
                          <div className="alert-warning">{step.deviation_alert.warning}</div>
                          {step.deviation_alert.checkpoints && (
                            <div className="alert-checkpoints">
                              <strong>Checkpoints:</strong>
                              <ul>
                                {step.deviation_alert.checkpoints.map((cp, i) => (
                                  <li key={i}>{cp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="alert-time">⏱️ +{step.deviation_alert.time_impact_minutes} min</div>
                        </div>
                      )}

                      <div className="step-header">
                        <strong>{step.part || `Step ${index + 1}`}</strong>
                      </div>
                      {step.prompt && (
                        <div className="step-prompt">
                          <strong>Prompt:</strong> {step.prompt}
                        </div>
                      )}
                      {step.reasoning && (
                        <div className="step-reasoning">
                          <strong>Reasoning:</strong> {step.reasoning}
                        </div>
                      )}
                      {step.calculation && (
                        <div className="step-calculation">
                          <strong>Calculation:</strong>
                          <pre>{step.calculation}</pre>
                        </div>
                      )}
                      {step.sanity_check && (
                        <div className="step-sanity">
                          <strong>Sanity Check:</strong> {step.sanity_check}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Full Solution Text (fallback) */}
              {currentProblem.solution && !currentProblem.solution_steps && (
                <div className="solution-text">
                  <h4>Solution</h4>
                  <pre>{typeof currentProblem.solution === 'string' ? currentProblem.solution : currentProblem.solution.content || 'Solution not available'}</pre>
                </div>
              )}

              {/* Key Insights */}
              {currentProblem.key_insights && currentProblem.key_insights.length > 0 && (
                <div className="key-insights">
                  <h4>💡 Key Insights</h4>
                  <ul>
                    {currentProblem.key_insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {currentProblem.common_mistakes && currentProblem.common_mistakes.length > 0 && (
                <div className="common-mistakes">
                  <h4>⚠️ Common Mistakes</h4>
                  <ul>
                    {currentProblem.common_mistakes.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="viewer-navigation">
        <button 
          onClick={previousProblem}
          disabled={currentProblemIndex === 0}
          className="nav-button"
        >
          ← Previous
        </button>
        <button 
          onClick={nextProblem}
          disabled={currentProblemIndex === problems.length - 1}
          className="nav-button"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default ProblemViewer;
