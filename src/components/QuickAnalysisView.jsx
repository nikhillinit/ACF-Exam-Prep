import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectArchetype, extractQuestionSection } from '../utils/staticGuidance';
import './QuickAnalysisView.css';

// Deviation detection keywords (based on ACF Deviation Cookbook)
// Keep this separate as it's specific to detecting problem variations
const DEVIATION_KEYWORDS = {
  'priority': ['senior', 'junior', 'subordinated', 'waterfall', 'seniority', 'secured', 'unsecured', 'claim priority'],
  'perpetual': ['perpetual', 'perpetuity', 'forever', 'infinite horizon', 'no maturity'],
  'amortizing': ['amortizing', 'amortization', 'principal payment', 'scheduled repayment'],
  'callable': ['callable', 'call option', 'call provision', 'early redemption'],
  'convertible': ['convertible', 'conversion', 'convert to equity'],
  'floating-rate': ['floating rate', 'variable rate', 'LIBOR', 'adjustable rate'],
  'multi-period': ['multi-period', 'multiple periods', 'several years', 'staged investment'],
  'growth': ['growing', 'growth rate', 'escalating', 'increasing cash flows'],
  'real-options': ['real option', 'option to expand', 'option to abandon', 'flexibility value'],
  'asymmetric-info': ['asymmetric information', 'private information', 'signaling', 'adverse selection', 'high type', 'low type']
};

/**
 * Detect deviations from standard problem types
 */
function detectDeviations(problemText) {
  const text = problemText.toLowerCase();
  const detectedDeviations = [];
  
  Object.entries(DEVIATION_KEYWORDS).forEach(([deviation, keywords]) => {
    const matchedKeywords = keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    if (matchedKeywords.length > 0) {
      detectedDeviations.push({
        type: deviation,
        keywords: matchedKeywords
      });
    }
  });
  
  return detectedDeviations;
}

function QuickAnalysisView() {
  const navigate = useNavigate();
  const [problemText, setProblemText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    setAnalysis(null);
  };

  const analyzeProblem = () => {
    if (!problemText.trim()) return;

    setIsAnalyzing(true);

    // Simulate slight delay for UX
    setTimeout(() => {
      // Use the weighted detection from staticGuidance.js
      const detectionResult = detectArchetype(problemText);
      
      // Detect deviations separately
      const deviations = detectDeviations(problemText);

      // Extract question section for display
      const questionSection = extractQuestionSection(problemText);

      setAnalysis({
        archetype: detectionResult.archetype,
        confidence: detectionResult.confidence,
        keywords: detectionResult.matchedKeywords || [],
        weightedScore: detectionResult.weightedScore,
        patternMatch: detectionResult.patternMatch,
        deviations: deviations,
        alternatives: detectionResult.alternativeArchetypes || [],
        guide: detectionResult.guidance,
        questionSection: questionSection
      });

      setIsAnalyzing(false);
    }, 500);
  };

  const handleGuidedPractice = () => {
    if (analysis && analysis.archetype !== 'Unknown') {
      navigate(`/practice/${analysis.archetype}?mode=instant`);
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
                {analysis.confidence}% confidence
                {analysis.patternMatch && <span className="pattern-badge">📌 Pattern Match</span>}
              </div>
            </div>
            <div className="archetype-result">
              <div className="archetype-badge-large">
                {analysis.archetype}
              </div>
              <div className="confidence-meter">
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ width: `${analysis.confidence}%` }}
                  />
                </div>
              </div>
              {analysis.weightedScore && (
                <div className="score-display">
                  Weighted Score: <strong>{analysis.weightedScore}</strong>
                </div>
              )}
            </div>
            {analysis.keywords.length > 0 && (
              <div className="keywords-section">
                <h4>Detected Keywords:</h4>
                <div className="keywords-list">
                  {analysis.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            {analysis.alternatives && analysis.alternatives.length > 0 && (
              <div className="alternatives-section">
                <h4>Alternative Archetypes:</h4>
                <div className="alternatives-list">
                  {analysis.alternatives.map((alt, index) => (
                    <span key={index} className="alt-tag">
                      {alt.archetype} (score: {alt.score || alt.matchCount})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Deviation Warnings */}
          {analysis.deviations && analysis.deviations.length > 0 && (
            <div className="result-card deviation-card">
              <div className="card-header deviation-header">
                <h2>⚠️ ACF Deviations Detected</h2>
                <span className="deviation-count">{analysis.deviations.length} deviation(s)</span>
              </div>
              <div className="deviation-content">
                <p className="deviation-intro">
                  This problem contains deviations from standard ACF approaches. Pay special attention to these aspects:
                </p>
                <div className="deviation-items">
                  {analysis.deviations.map((deviation, index) => (
                    <div key={index} className="deviation-item-card">
                      <div className="deviation-type">
                        <span className="deviation-icon">▸</span>
                        <strong>{deviation.type.toUpperCase().replace(/-/g, ' ')}</strong>
                      </div>
                      <div className="deviation-keywords">
                        Triggers: {deviation.keywords.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="deviation-tip">
                  <strong>💡 Tip:</strong> Review the ACF Deviation Cookbook for specific handling of these deviations.
                </div>
              </div>
            </div>
          )}

          {/* Quick Guide */}
          {analysis.guide && (
            <div className="result-card guide-card">
              <div className="card-header">
                <h2>📚 Quick Guide</h2>
              </div>
              <div className="guide-content">
                <pre className="guide-text">
                  {analysis.guide.quickGuide}
                </pre>
                
                {analysis.guide.formulas && (
                  <div className="formulas-section">
                    <h4>Key Formulas:</h4>
                    <ul className="formulas-list">
                      {analysis.guide.formulas.map((formula, index) => (
                        <li key={index} className="formula-item">
                          <code>{formula}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysis.guide.excelTab && (
                  <div className="excel-tab-info">
                    <strong>📊 Excel Tab:</strong> {analysis.guide.excelTab}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <button 
              className="btn-primary btn-large" 
              onClick={handleGuidedPractice}
              disabled={analysis.archetype === 'Unknown'}
            >
              ⚡ Start Guided Practice
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/library')}>
              📚 Browse Problem Library
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !isAnalyzing && (
        <div className="qa-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Ready to analyze</h3>
          <p>Paste a problem above and click "Analyze Problem" to get started</p>
          <p className="empty-hint">
            <strong>Tip:</strong> Try the "Load Signaling Example" button to see how the improved 
            detection correctly identifies dividend/signaling problems!
          </p>
        </div>
      )}
    </div>
  );
}

export default QuickAnalysisView;
