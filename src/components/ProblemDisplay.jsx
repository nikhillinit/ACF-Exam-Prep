import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

/**
 * ProblemDisplay Component - v11 Schema with Two-Track Rendering
 * 
 * Handles both:
 * - Guided Examples (integrated format, may have few/no parts)
 * - Mock Questions (structured format with multiple parts)
 */
function ProblemDisplay({ problem }) {
  const [showSolution, setShowSolution] = useState(false);
  const [activePartId, setActivePartId] = useState(null);
  
  if (!problem) {
    return null;
  }

  const hasParts = problem.problem_parts && problem.problem_parts.length > 0;
  const isGuided = problem.content_type === 'guided';
  const hasSolutionSteps = problem.solution_steps && problem.solution_steps.length > 0;
  const hasSolutionContent = problem.solution?.available && problem.solution?.content;

  // Set initial active part
  React.useEffect(() => {
    if (hasParts && !activePartId) {
      setActivePartId(problem.problem_parts[0].part_id);
    }
  }, [problem.id, hasParts, activePartId]);

  return (
    <MathJaxContext>
      <div className={`problem-display ${problem.content_type}`}>
        {/* Header */}
        <header className="problem-header">
          <div className="problem-title-row">
            <h1>{problem.title || problem.id}</h1>
            <span className={`content-badge ${problem.content_type}`}>
              {isGuided ? '📚 Guided Example' : '📝 Mock Question'}
            </span>
          </div>
          
          <div className="problem-metadata">
            <span className="archetype">
              🏷️ {problem.primary_archetype || problem.archetype}
            </span>
            {problem.estimated_time_minutes && (
              <span className="time">
                ⏱️ {problem.estimated_time_minutes} min
              </span>
            )}
            {problem.difficulty && (
              <span className="difficulty">
                📊 {problem.difficulty}
              </span>
            )}
            {problem.points && (
              <span className="points">
                🎯 {problem.points} points
              </span>
            )}
          </div>
        </header>

        {/* Problem Intro - Always Show */}
        <section className="problem-intro">
          <h2>Problem Statement</h2>
          <div className="intro-content">
            {problem.problem_intro || problem.problem_statement || problem.problem_text}
          </div>
        </section>

        {/* Two-Track Rendering */}
        {hasParts ? (
          // Track 2: Structured Parts (Mock Questions)
          <section className="problem-parts">
            <h2>Problem Parts</h2>
            
            {/* Part Tabs */}
            <div className="part-tabs">
              {problem.problem_parts.map((part) => (
                <button
                  key={part.part_id}
                  className={`part-tab ${activePartId === part.part_id ? 'active' : ''}`}
                  onClick={() => setActivePartId(part.part_id)}
                >
                  Part {part.part_id}
                  {part.points > 0 && <span className="part-points">({part.points} pts)</span>}
                </button>
              ))}
            </div>

            {/* Active Part Content */}
            {problem.problem_parts.map((part) => (
              activePartId === part.part_id && (
                <div key={part.part_id} className="part-content active">
                  <div className="part-header">
                    <h3>Part {part.part_id}: {part.label}</h3>
                    {part.points > 0 && (
                      <span className="part-points-badge">{part.points} points</span>
                    )}
                  </div>
                  <div className="part-text">
                    {part.text}
                  </div>
                </div>
              )
            ))}
          </section>
        ) : (
          // Track 1: Single Problem (Guided Examples without parts)
          <section className="single-problem">
            {/* No additional content needed - intro contains full problem */}
          </section>
        )}

        {/* Solution Section */}
        {(hasSolutionSteps || hasSolutionContent) && (
          <section className="solution-section">
            <div className="solution-header">
              <h2>Solution</h2>
              <button
                className="toggle-solution"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? '🙈 Hide Solution' : '👁️ Show Solution'}
              </button>
            </div>

            {showSolution && (
              <div className="solution-content">
                {/* Guided Examples: Solution Steps with LaTeX */}
                {hasSolutionSteps && (
                  <div className="solution-steps">
                    {problem.solution_steps.map((step, idx) => (
                      <div key={idx} className="solution-step">
                        <h4>
                          {step.part || `Step ${step.step_index !== undefined ? step.step_index + 1 : idx + 1}`}
                        </h4>
                        
                        {step.calculation && (
                          <div className="step-calculation">
                            {step.has_latex ? (
                              <MathJax>{step.calculation}</MathJax>
                            ) : (
                              <pre>{step.calculation}</pre>
                            )}
                          </div>
                        )}
                        
                        {step.explanation && (
                          <div className="step-explanation">
                            <p>{step.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mock Questions: Solution Content */}
                {hasSolutionContent && (
                  <div className="solution-text">
                    <pre>{problem.solution.content}</pre>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Key Insights (Guided Examples) */}
        {isGuided && problem.key_insights && problem.key_insights.length > 0 && (
          <section className="key-insights">
            <h2>💡 Key Insights</h2>
            <ul>
              {problem.key_insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Common Mistakes (Guided Examples) */}
        {isGuided && problem.common_mistakes && problem.common_mistakes.length > 0 && (
          <section className="common-mistakes">
            <h2>⚠️ Common Mistakes</h2>
            <ul>
              {problem.common_mistakes.map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Learning Graph (Future Feature) */}
        {problem.learning_graph && (
          <section className="learning-graph">
            <h2>📊 Learning Path</h2>
            <div className="learning-graph-content">
              {problem.learning_graph.prerequisite_ids?.length > 0 && (
                <div className="prerequisites">
                  <h4>📚 Prerequisites:</h4>
                  <ul>
                    {problem.learning_graph.prerequisite_ids.map(id => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {problem.learning_graph.next_step_ids?.length > 0 && (
                <div className="next-steps">
                  <h4>➡️ Next Steps:</h4>
                  <ul>
                    {problem.learning_graph.next_step_ids.map(id => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {problem.learning_graph.variant_ids?.length > 0 && (
                <div className="variants">
                  <h4>🔄 Similar Problems:</h4>
                  <ul>
                    {problem.learning_graph.variant_ids.map(id => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!problem.learning_graph.prerequisite_ids?.length && 
                !problem.learning_graph.next_step_ids?.length && 
                !problem.learning_graph.variant_ids?.length) && (
                <p className="learning-graph-empty">
                  Learning path not yet configured for this problem.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Comparison (if available) */}
        {problem.comparison?.closest_comparable_id && (
          <section className="problem-comparison">
            <h2>🔍 Compare to Similar Problem</h2>
            <div className="comparison-content">
              <p>
                <strong>Most Similar:</strong> {problem.comparison.closest_comparable_id}
                {problem.comparison.similarity_score && (
                  <span className="similarity-score">
                    ({(problem.comparison.similarity_score * 100).toFixed(0)}% similar)
                  </span>
                )}
              </p>
              
              {problem.comparison.key_distinctions?.length > 0 && (
                <div className="distinctions">
                  <h4>Key Distinctions:</h4>
                  <ul>
                    {problem.comparison.key_distinctions.map((distinction, idx) => (
                      <li key={idx}>{distinction}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {problem.comparison.deviations_detected?.length > 0 && (
                <div className="deviations">
                  <h4>Deviations Detected:</h4>
                  <ul>
                    {problem.comparison.deviations_detected.map((deviation, idx) => (
                      <li key={idx}>{deviation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </MathJaxContext>
  );
}

export default ProblemDisplay;
