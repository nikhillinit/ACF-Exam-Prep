import React from 'react';

const TimeAllocator = ({ archetypes, totalPoints }) => {
  const totalTime = archetypes.reduce((sum, arch) => sum + (arch.timeAllocation || 0), 0);
  
  return (
    <div className="time-allocator card" style={{ marginTop: '1.5rem', background: '#f0fdf4' }}>
      <h3>⏱️ Time Allocation Strategy</h3>
      
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {totalTime}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Total Minutes
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              {totalPoints}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Estimated Points
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
              {(totalPoints / totalTime).toFixed(1)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Points per Minute
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>Time Breakdown by Archetype:</h4>
          {archetypes.map((arch) => (
            <div key={arch.id} style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: 'white',
              borderRadius: '0.25rem'
            }}>
              <div style={{ width: '120px', fontWeight: '500' }}>
                {arch.id}
              </div>
              <div style={{ flex: 1, background: '#e5e7eb', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(arch.timeAllocation / totalTime) * 100}%`,
                  height: '100%',
                  background: arch.tier === 1 ? 'var(--tier1)' : 'var(--tier2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {arch.timeAllocation}min
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
        <strong>💡 Rule of Thumb:</strong> 1 point ≈ 1 minute. Add 5-minute buffer for checks.
      </div>
    </div>
  );
};

export default TimeAllocator;
