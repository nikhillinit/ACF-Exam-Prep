import React, { useState } from 'react';
import Scanner from './Scanner';
import HybridSequencer from './HybridSequencer';
import ArchetypeMapper from './ArchetypeMapper';
import TimeAllocator from './TimeAllocator';
import { scanForArchetypes } from '../../utils/archetypeScanner';

// Conceptual explanations mapped to archetypes
const CONCEPTUAL_EXPLANATIONS = {
  'A1': {
    title: 'Capital Structure & Tax Shields',
    content: `**Core Concept**: The tax deductibility of interest creates value for levered firms.

**Key Formula**:
PV(Tax Shields) = Σ [τ × Interest_t × (1 - PD_t)] / (1 + r_D)^t

Where:
- τ = corporate tax rate
- PD_t = cumulative default probability by time t
- r_D = expected return on debt (NOT promised yield)

**Common Mistakes**:
1. Discounting at promised yield instead of expected return
2. Ignoring default risk when computing tax shields
3. Forgetting that tax shields are lost in default

**When to Use**:
- Questions about debt financing decisions
- Comparing different capital structures
- Evaluating refinancing opportunities
- Analyzing the impact of tax rate changes

**Personal Taxes**:
Net tax advantage = τ_corp - (τ_interest - τ_equity) × (1 - τ_corp)

When personal tax rates on interest exceed those on equity, the corporate tax advantage is partially offset.`
  },
  'A2': {
    title: 'Multi-State Project & Financing',
    content: `**Core Concept**: Analyze projects and financing decisions across multiple states of the world.

**Key Framework**:
1. Build a state table with asset values in each state
2. Apply priority structure (debt before equity)
3. Compute expected values using probabilities
4. Determine financing terms: k = Cash_raised / V_E,post

**Debt Overhang (A2A)**:
Positive NPV projects may be rejected when:
- Existing risky debt captures most of the value
- Old equity holders bear the cost but don't get the benefit
- New equity financing is required

**Common Mistakes**:
1. Using promised returns instead of expected returns
2. Mixing today-values with future payoffs
3. Ignoring the fraction sold to new investors (k)

**When to Use**:
- Multi-state valuation problems
- Old vs new shareholder wealth analysis
- Debt overhang scenarios
- Priority structure with multiple tranches`
  },
  'A3': {
    title: 'CAPM, Beta & Discount Rates',
    content: `**Core Concept**: Expected returns depend on systematic risk (beta), not total risk.

**CAPM Formula**:
E[R] = R_f + β × (E[R_M] - R_f)

**Beta Relationships**:
- β_assets = β_equity × (E/(E+D)) + β_debt × (D/(E+D))
- β_equity increases with leverage
- β_debt > 0 when default risk exists

**Project vs Firm WACC**:
Use project-specific discount rate when:
- Project has different risk than firm average
- Project has different leverage than firm average

**Common Mistakes**:
1. Using firm WACC for projects with different risk
2. Confusing historical returns with expected returns
3. Ignoring the impact of leverage on equity beta

**When to Use**:
- Calculating required returns
- Project valuation with different risk
- Comparing investments across risk classes
- Evaluating whether to use firm or project-specific WACC`
  },
  'A4': {
    title: 'Distress & Priority',
    content: `**Core Concept**: Default risk and priority structure affect expected returns and recovery rates.

**Key Relationships**:
Expected Return = Promised Yield - Expected Loss
Expected Loss = PD × (1 - Recovery Rate) × Face Value

**Priority Structure**:
1. Senior debt: First claim on assets (higher recovery)
2. Junior debt: Residual claim after senior (lower recovery)
3. Equity: Last claim (often zero in default)

**Debt Beta**:
β_debt increases with:
- Higher default probability
- Lower recovery rate
- Junior priority (subordination)

**Common Mistakes**:
1. Using same expected return for senior and junior debt
2. Ignoring the impact of priority on recovery rates
3. Assuming debt is risk-free when calculating WACC

**When to Use**:
- Multi-tranche debt structures
- Distressed firm valuation
- Credit spread analysis
- Comparing debt instruments with different seniority`
  }
};

const ReconView = () => {
  const [problemText, setProblemText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showConceptual, setShowConceptual] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState(null);

  const handleScan = () => {
    if (!problemText.trim()) return;
    
    const results = scanForArchetypes(problemText);
    setScanResults(results);
    setShowWorkflow(true);
    setShowConceptual(false);
  };

  const handleTextChange = (e) => {
    setProblemText(e.target.value);
    if (scanResults) {
      setScanResults(null);
      setShowWorkflow(false);
      setShowConceptual(false);
    }
  };

  const handleShowConceptual = (archetype) => {
    setSelectedArchetype(archetype);
    setShowConceptual(true);
  };

  return (
    <div className="recon-container">
      <div className="recon-header">
        <h2>📡 Exam Reconnaissance</h2>
        <p>Paste your problem text below. The system will identify archetypes, suggest resources, and generate your execution plan.</p>
      </div>

      <div className="recon-input card">
        <label style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
          Problem Text:
        </label>
        <textarea
          value={problemText}
          onChange={handleTextChange}
          placeholder="Paste the exam question here..."
          rows={25}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            border: '1px solid var(--border)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            fontFamily: 'monospace',
            resize: 'vertical',
            minHeight: '500px'
          }}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={handleScan} 
            className="btn btn-primary" 
            style={{ 
              padding: '0.75rem 1.5rem',
              fontSize: '1rem'
            }}
          >
            🔍 Scan & Identify Archetypes
          </button>
          
          {scanResults && (
            <button 
              onClick={() => handleShowConceptual(scanResults.archetypes[0])}
              className="btn btn-secondary"
              style={{ 
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#6366f1',
                color: 'white'
              }}
            >
              📚 Show Conceptual Explanation
            </button>
          )}
        </div>
      </div>

      {showConceptual && selectedArchetype && CONCEPTUAL_EXPLANATIONS[selectedArchetype] && (
        <div className="card" style={{ 
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          border: '2px solid #6366f1'
        }}>
          <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>
            📖 {CONCEPTUAL_EXPLANATIONS[selectedArchetype].title}
          </h3>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {CONCEPTUAL_EXPLANATIONS[selectedArchetype].content}
          </div>
        </div>
      )}

      {showWorkflow && scanResults && (
        <>
          <Scanner results={scanResults} />
          {scanResults.isHybrid && <HybridSequencer archetypes={scanResults.archetypes} />}
          <ArchetypeMapper archetypes={scanResults.archetypes} />
          <TimeAllocator 
            tier={scanResults.tier} 
            estimatedPoints={scanResults.estimatedPoints}
            isHybrid={scanResults.isHybrid}
          />
        </>
      )}
    </div>
  );
};

export default ReconView;
