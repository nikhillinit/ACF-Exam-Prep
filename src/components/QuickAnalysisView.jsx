import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyticalAgent } from '../hooks/useAnalyticalAgent';
import './QuickAnalysisView.css';

function QuickAnalysisView() {
  const navigate = useNavigate();
  const [problemText, setProblemText] = useState('');

  // Use the analytical agent hook
  const { analysis, loading: isAnalyzing, error, analyzeProblem: runAnalysis } = useAnalyticalAgent({
    enableCache: true,
    includeCalculations: true,
    includeExamples: true,
    includeDeviations: true
  });

  // Updated example to demonstrate signaling detection
  const exampleProblem = `Helios Solar Corp has private information about its future profitability. The company knows it is either a "high type" firm (worth $150M) or a "low type" firm (worth $80M). The market cannot distinguish between the two types.

Currently, Helios has $20M in excess cash that it could either:
1. Pay out as a special dividend of $2 per share (10M shares outstanding)
2. Retain for future investment

High-type firms face a signaling cost of $5M if they pay the dividend (due to disruption to operations), while low-type firms face only a $2M cost.

The market currently values all firms at the pooled average: 0.5 × $150M + 0.5 × $80M = $115M.

REQUIRED:
A. If Helios is a high-type firm, should it pay the dividend to signal its type? Calculate the NPV of signaling.
B. Would a low-type firm want to mimic the high-type by also paying a dividend? Explain.
C. Under what conditions would a separating equilibrium exist?`;

  const loadExample = () => {
    setProblemText(exampleProblem);
  };

  const analyzeProblem = async () => {
    if (!problemText.trim()) return;
    await runAnalysis(problemText);
  };

  const handleGuidedPractice = () => {
    if (analysis && analysis.analysis?.archetypes?.primary) {
      const archetypeId = analysis.analysis.archetypes.primary.id;
      navigate(`/practice/${archetypeId}?mode=instant`);
    }
  };

  return (
    <div className="quick-analysis-view">
      <div className="qa-header">
        <h1>🔍 Quick Problem Analysis</h1>
        <p className="qa-subtitle">
          Paste any corporate finance problem and get instant guidance on archetype, approach, deviations, and key concepts. 
          Now with <strong>weighted keyword detection</strong> and <strong>question pattern matching</strong>!
        </p>
      </div>

      {/* Input Section */}
      <div className="qa-input-section">
        <div className="input-header">
          <h2>📋 Problem Statement</h2>
          <div className="input-actions">
            <button className="btn-secondary" onClick={loadExample}>
              Load Signaling Example
            </button>
            <button className="btn-secondary" onClick={() => { setProblemText(''); setAnalysis(null); }}>
              Clear
            </button>
          </div>
        </div>
        <textarea
          className="problem-input"
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder="Paste your problem text here...

Example: 'A firm is considering issuing $100M of debt with a 5% coupon rate. The corporate tax rate is 30%. Calculate the present value of tax shields...'

Or try: 'Helios Corp has private information about its type. Should it pay a dividend to signal its quality?'"
          rows={12}
        />
        <div className="input-footer">
          <span className="char-count">{problemText.length} characters</span>
          <button 
            className="btn-primary analyze-btn"
            onClick={analyzeProblem}
            disabled={!problemText.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner">⏳</span> Analyzing...
              </>
            ) : (
              <>
                ⚡ Analyze Problem
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="qa-results">
          {/* Archetype Detection */}
          <div className="result-card archetype-card">
            <div className="card-header">
              <h2>🎯 Detected Archetype</h2>
              <div className="confidence-badge">
                {Math.round(analysis.confidence || 0)}% confidence
                {analysis.analysis?.archetypes?.isHybrid && <span className="pattern-badge">🔀 Hybrid Problem</span>}
              </div>
            </div>
            <div className="archetype-result">
              <div className="archetype-badge-large">
                {analysis.analysis?.archetypes?.primary?.id || 'Unknown'}
              </div>
              <div className="archetype-name">
                {analysis.analysis?.archetypes?.primary?.archetype?.name || 'Unknown Archetype'}
              </div>
              <div className="confidence-meter">
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${Math.round(analysis.confidence || 0)}%` }}
                  />
                </div>
              </div>
              {analysis.analysis?.archetypes?.primary?.rawScore && (
                <div className="score-display">
                  Weighted Score: <strong>{analysis.analysis.archetypes.primary.rawScore.toFixed(2)}</strong>
                </div>
              )}
            </div>
            {analysis.analysis?.archetypes?.primary?.matchedKeywords?.length > 0 && (
              <div className="keywords-section">
                <h4>Detected Keywords (with weights):</h4>
                <div className="keywords-list">
                  {analysis.analysis.archetypes.primary.matchedKeywords.slice(0, 8).map((kw, index) => (
                    <span key={index} className="keyword-tag">
                      {kw.keyword} <small>({kw.weight}x)</small>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.analysis?.archetypes?.secondary?.length > 0 && (
              <div className="alternatives-section">
                <h4>Alternative Archetypes:</h4>
                <div className="alternatives-list">
                  {analysis.analysis.archetypes.secondary.map((alt, index) => (
                    <span key={index} className="alt-tag">
                      {alt.id} ({Math.round(alt.confidence)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.analysis?.archetypes?.isHybrid && (
              <div className="hybrid-alert">
                <strong>🔀 Hybrid Problem Detected:</strong> {analysis.analysis.archetypes.hybridCombination}
                {analysis.approach?.hybridHandling && (
                  <p className="hybrid-guidance">{analysis.approach.hybridHandling.solvingSequence}</p>
                )}
              </div>
            )}
          </div>

          {/* Deviation Warnings */}
          {analysis.analysis?.deviations?.deviations?.length > 0 && (
            <div className="result-card deviation-card">
              <div className="card-header deviation-header">
                <h2>⚠️ ACF Deviations Detected</h2>
                <span className="deviation-count">{analysis.analysis.deviations.total} deviation(s)</span>
                {analysis.analysis.deviations.totalTimeImpact > 0 && (
                  <span className="time-impact">+{analysis.analysis.deviations.totalTimeImpact} min</span>
                )}
              </div>
              <div className="deviation-content">
                <p className="deviation-intro">
                  This problem contains deviations from standard ACF approaches. Pay special attention to these aspects:
                </p>
                <div className="deviation-items">
                  {analysis.analysis.deviations.deviations.map((deviation, index) => (
                    <div key={index} className="deviation-item-card">
                      <div className="deviation-header-row">
                        <div className="deviation-type">
                          <span className="deviation-icon">▸</span>
                          <strong>{deviation.name}</strong>
                        </div>
                        <span className={`severity-badge severity-${deviation.severity.toLowerCase()}`}>
                          {deviation.severity}
                        </span>
                      </div>
                      <div className="deviation-description">{deviation.description}</div>
                      {deviation.matchedTriggers.length > 0 && (
                        <div className="deviation-keywords">
                          Triggers: {deviation.matchedTriggers.join(', ')}
                        </div>
                      )}
                      {deviation.timeImpact > 0 && (
                        <div className="deviation-time">
                          Time impact: +{deviation.timeImpact} minutes
                        </div>
                      )}
                      {deviation.guidance && (
                        <div className="deviation-guidance">
                          <strong>Guidance:</strong> {deviation.guidance}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="deviation-tip">
                  <strong>💡 Tip:</strong> Review the ACF Deviation Cookbook for specific handling of these deviations.
                </div>
              </div>
            </div>
          )}

          {/* Solution Workflow */}
          {analysis.approach?.workflow && (
            <div className="result-card workflow-card">
              <div className="card-header">
                <h2>📋 5-Step Solution Workflow</h2>
                {analysis.approach?.timeAllocation && (
                  <span className="time-badge">
                    {analysis.approach.timeAllocation.recommended} min recommended
                  </span>
                )}
              </div>
              <div className="workflow-content">
                {Object.entries(analysis.approach.workflow).map(([key, step], index) => (
                  <div key={key} className="workflow-step">
                    <div className="step-header">
                      <span className="step-number">{index + 1}</span>
                      <h4>{step.action}</h4>
                      <span className="step-time">{step.time}</span>
                    </div>
                    <ul className="step-checklist">
                      {step.checklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculations & Formulas */}
          {analysis.calculations && (
            <div className="result-card calculations-card">
              <div className="card-header">
                <h2>🧮 Calculation Approach</h2>
              </div>
              <div className="calculations-content">
                {analysis.calculations.steps && (
                  <div className="calc-steps">
                    <h4>Step-by-Step:</h4>
                    <ol className="steps-list">
                      {analysis.calculations.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {analysis.calculations.formulas && (
                  <div className="formulas-section">
                    <h4>Key Formulas:</h4>
                    <ul className="formulas-list">
                      {analysis.calculations.formulas.map((formula, index) => (
                        <li key={index} className="formula-item">
                          <code>{formula}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources */}
          {analysis.approach?.resources && (
            <div className="result-card resources-card">
              <div className="card-header">
                <h2>📚 Resources</h2>
              </div>
              <div className="resources-content">
                {analysis.approach.resources.excelTab && (
                  <div className="resource-item">
                    <strong>📊 Excel Tab:</strong> {analysis.approach.resources.excelTab}
                  </div>
                )}
                {analysis.approach.resources.playbookSlides?.length > 0 && (
                  <div className="resource-item">
                    <strong>📖 Playbook Slides:</strong> {analysis.approach.resources.playbookSlides.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Similar Examples */}
          {analysis.similarExamples?.length > 0 && (
            <div className="result-card examples-card">
              <div className="card-header">
                <h2>💡 Similar Examples</h2>
                <span className="examples-count">{analysis.similarExamples.length} found</span>
              </div>
              <div className="examples-content">
                {analysis.similarExamples.map((example, index) => (
                  <div key={index} className="example-item">
                    <h4>Example {index + 1}</h4>
                    <p className="example-text">{example.problemText}</p>
                    {example.keyInsights?.length > 0 && (
                      <div className="example-insights">
                        <strong>Key Insights:</strong>
                        <ul>
                          {example.keyInsights.map((insight, i) => (
                            <li key={i}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <button
              className="btn-primary btn-large"
              onClick={handleGuidedPractice}
              disabled={!analysis.analysis?.archetypes?.primary}
            >
              ⚡ Start Guided Practice
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/library')}>
              📚 Browse Problem Library
            </button>
            <button className="btn-secondary btn-large" onClick={analyzeProblem}>
              🔄 Re-analyze
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="qa-error">
          <div className="error-icon">⚠️</div>
          <h3>Analysis Error</h3>
          <p>{error}</p>
          <button className="btn-secondary" onClick={analyzeProblem}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !isAnalyzing && !error && (
        <div className="qa-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Ready to analyze with the Analytical Agent</h3>
          <p>Paste a problem above and click "Analyze Problem" to get comprehensive analysis including:</p>
          <ul className="empty-features">
            <li>✓ Multi-archetype detection with confidence scoring</li>
            <li>✓ Sophisticated deviation detection from registry</li>
            <li>✓ 5-step solution workflows with time allocation</li>
            <li>✓ Calculation steps and formulas</li>
            <li>✓ Similar worked examples</li>
            <li>✓ Hybrid problem handling</li>
          </ul>
          <p className="empty-hint">
            <strong>💡 Tip:</strong> Results are automatically cached for 24 hours for faster access!
          </p>
        </div>
      )}
    </div>
  );
}

export default QuickAnalysisView;
