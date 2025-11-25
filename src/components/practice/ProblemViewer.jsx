import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ProblemViewer.css';

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

  // Load problems on mount or when archetype changes
  useEffect(() => {
    loadProblems();
  }, [archetype]);

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
