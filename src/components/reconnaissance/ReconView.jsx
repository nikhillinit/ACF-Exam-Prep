import React, { useState, useEffect } from 'react';
import Scanner from './Scanner';
import HybridSequencer from './HybridSequencer';
import ArchetypeMapper from './ArchetypeMapper';
import TimeAllocator from './TimeAllocator';
import { scanForArchetypes } from '../../utils/archetypeScanner';

// Complete example problem with solution
const EXAMPLE_PROBLEM = `HAL Corporation is considering issuing debt to finance a new project. The company is evaluating two debt structures:

Issue 0: Senior debt with $100M face value, 5% annual coupon, 5-year maturity
Issue 1: Junior debt with $50M face value, 8% annual coupon, 5-year maturity

The corporate tax rate is 30%. The company faces financial distress risk with the following probabilities:
- Year 1-3: 5% annual default probability (hazard rate)
- Year 4-5: 10% annual default probability (hazard rate)

In the event of default, the recovery rates are:
- Senior debt: 60% of face value
- Junior debt: 20% of face value (after senior debt is paid)

The company's unlevered cost of equity is 12%, and the risk-free rate is 3%.

REQUIRED:

A. Compute the promised yield to maturity on Issue 0 and verify it is approximately 5%.

B. Compute the expected return on Issue 0, given the 5% default probability in early years and 10% in later years, with 60% recovery.

C. Compute the expected return on Issue 1, given 10% default probability and 20% recovery. Compare the two expected returns and comment on the change in debt beta (sign and magnitude).

D. Compute the NPV of tax shields (corporate level) for each issue, assuming tax shields are realized each year until maturity unless default occurs at maturity, and discount them at the respective expected returns from parts B and C.

E. Incorporate personal taxes qualitatively: how do the investor-level tax rates (30% on interest vs 20% on equity) affect the overall tax advantage of debt in each scenario? Is refinancing still attractive once personal taxes are considered?

SOLUTION APPROACH:

This is a hybrid A1 (Capital Structure & Tax Shields) + A4 (Distress & Priority) problem.

Step 1 (A1): Calculate promised YTM for Issue 0
- Annual coupon payment = $100M × 5% = $5M
- Face value = $100M
- Maturity = 5 years
- YTM ≈ 5% (since coupon rate equals YTM for par bonds)

Step 2 (A1 + A4): Calculate expected return on Issue 0 (E[r_D0])
- Consider default probabilities: 5% (Years 1-3), 10% (Years 4-5)
- Recovery rate: 60%
- Expected cash flows = (1 - PD) × Promised CF + PD × Recovery
- Discount at appropriate rate to find E[r_D0] ≈ 4.2%

Step 3 (A4): Calculate expected return on Issue 1 (E[r_D1])
- Higher default probability: 10%
- Lower recovery: 20% (junior debt)
- Expected return E[r_D1] ≈ 6.5%
- Debt beta increases significantly due to priority subordination

Step 4 (A1): Calculate NPV of tax shields
- Issue 0: PV(Tax Shields) = Σ [τ × Interest × (1 - PD)] / (1 + E[r_D0])^t
- Issue 1: PV(Tax Shields) = Σ [τ × Interest × (1 - PD)] / (1 + E[r_D1])^t
- Discount at expected returns, not promised yields

Step 5 (A1): Personal tax analysis
- Interest taxed at 30%, equity at 20%
- Net tax advantage = τ_corp - (τ_interest - τ_equity) × (1 - τ_corp)
- Refinancing may be less attractive when personal taxes are included

KEY INSIGHTS:
- Junior debt has higher expected return due to subordination risk
- Tax shields must be discounted at expected returns, not promised yields
- Personal taxes reduce the net tax advantage of debt
- Priority structure significantly affects debt beta and required returns`;

const ReconView = () => {
  const [problemText, setProblemText] = useState(EXAMPLE_PROBLEM);
  const [scanResults, setScanResults] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleScan = () => {
    if (!problemText.trim()) return;
    
    const results = scanForArchetypes(problemText);
    setScanResults(results);
    setShowWorkflow(true);
  };

  // Auto-clear example and show hint
  const handleTextChange = (e) => {
    setProblemText(e.target.value);
    // Clear scan results when user starts typing
    if (scanResults) {
      setScanResults(null);
      setShowWorkflow(false);
    }
  };

  return (
    <div className="recon-container">
      <div className="recon-header">
        <h2>📡 Exam Reconnaissance</h2>
        <p>Paste your problem text below. The system will identify archetypes, suggest resources, and generate your execution plan.</p>
        <p className="example-hint" style={{ 
          fontSize: '0.9rem', 
          color: '#94a3b8', 
          marginTop: '0.5rem',
          fontStyle: 'italic'
        }}>
          💡 An example problem with solution is pre-loaded below. Clear it and paste your own problem, or click "Scan" to analyze the example.
        </p>
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
            minHeight: '400px'
          }}
        />
        <button 
          onClick={handleScan} 
          className="btn btn-primary" 
          style={{ 
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem'
          }}
        >
          🔍 Scan & Identify Archetypes
        </button>
      </div>

      {scanResults && (
        <>
          <Scanner results={scanResults} />
          
          {scanResults.isHybrid && (
            <HybridSequencer archetypes={scanResults.archetypes} />
          )}
          
          <ArchetypeMapper archetypes={scanResults.archetypes} />
          
          <TimeAllocator 
            archetypes={scanResults.archetypes}
            estimatedPoints={scanResults.estimatedPoints}
          />
        </>
      )}
    </div>
  );
};

export default ReconView;
