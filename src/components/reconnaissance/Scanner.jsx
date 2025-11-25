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

      {/* NEW: Display detected deviations */}
      {results.deviations && results.deviations.length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: '0.5rem', borderLeft: '4px solid #dc2626' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#991b1b' }}>⚠️ Deviations Detected</h4>
          <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '1rem' }}>
            This problem requires {results.deviations.length} special approach{results.deviations.length > 1 ? 'es' : ''} that differ from standard methods.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {results.deviations.map((deviation) => (
              <div
                key={deviation.code}
                style={{
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  borderLeft: `3px solid ${deviation.confidence === 'HIGH' ? '#dc2626' : deviation.confidence === 'MEDIUM' ? '#ea580c' : '#3b82f6'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <code style={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      background: '#f3f4f6',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontWeight: '600'
                    }}>
                      {deviation.code}
                    </code>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {deviation.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    background: deviation.confidence === 'HIGH' ? '#fef2f2' : deviation.confidence === 'MEDIUM' ? '#fff7ed' : '#eff6ff',
                    color: deviation.confidence === 'HIGH' ? '#991b1b' : deviation.confidence === 'MEDIUM' ? '#9a3412' : '#1e40af'
                  }}>
                    {deviation.confidence}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: '0.5rem 0' }}>
                  {deviation.description}
                </p>

                {deviation.time_impact_minutes > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    ⏱️ Additional time needed: <strong>+{deviation.time_impact_minutes} minutes</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          {results.deviationMetadata && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
              Detected {results.deviationMetadata.keywordsFound} keywords and {results.deviationMetadata.patternsMatched} patterns in {results.deviationMetadata.problemLength} characters
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
