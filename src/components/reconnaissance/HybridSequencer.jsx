import React from 'react';

const HybridSequencer = ({ archetypes }) => {
  // Simple heuristic: CAPM (A3) usually comes first, then others
  const sequence = [...archetypes].sort((a, b) => {
    if (a.id === 'A3') return -1;
    if (b.id === 'A3') return 1;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="hybrid-sequencer card" style={{ marginTop: '1.5rem', background: '#fef3c7' }}>
      <h3>⚠️ Hybrid Question Detected</h3>
      <p>This problem involves multiple archetypes. Follow this solving sequence:</p>
      
      <div style={{ marginTop: '1rem' }}>
        {sequence.map((arch, idx) => (
          <div key={arch.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'white',
            borderRadius: '0.5rem'
          }}>
            <div style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '1rem'
            }}>
              {idx + 1}
            </div>
            <div>
              <strong>{arch.id} - {arch.name}</strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Excel Tab: {arch.excelTab || 'N/A'} | Time: ~{arch.timeAllocation}min
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
        <strong>💡 Tip:</strong> Solve each archetype as a sub-problem, then integrate results in final interpretation.
      </div>
    </div>
  );
};

export default HybridSequencer;
