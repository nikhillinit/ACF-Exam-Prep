import React from 'react';

const Scanner = ({ results }) => {
  return (
    <div className="scanner-results card" style={{ marginTop: '1.5rem' }}>
      <h3>🎯 Scan Results</h3>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>Identified Archetypes:</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {results.archetypes.map((arch) => (
            <div key={arch.id} className={`badge-tier${arch.tier}`}>
              {arch.id} - {arch.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <strong>Tier Classification:</strong>
          <p>Tier {results.primaryTier} ({results.primaryTier === 1 ? 'HIGH' : 'MEDIUM'} Priority)</p>
        </div>
        <div>
          <strong>Hybrid Question:</strong>
          <p>{results.isHybrid ? 'YES ⚠️' : 'NO'}</p>
        </div>
        <div>
          <strong>Estimated Points:</strong>
          <p>{results.estimatedPoints}</p>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Keywords Detected:</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {results.matchedKeywords.map((kw, idx) => (
            <span key={idx} style={{ 
              background: '#e0e7ff', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}>
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
