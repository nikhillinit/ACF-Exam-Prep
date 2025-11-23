import React from 'react';

const ArchetypeMapper = ({ archetypes }) => {
  return (
    <div className="archetype-mapper card" style={{ marginTop: '1.5rem' }}>
      <h3>📋 Resource Mapping</h3>
      <p>For each identified archetype, here are your resources:</p>
      
      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {archetypes.map((arch) => (
          <div key={arch.id} style={{ 
            padding: '1rem', 
            border: '2px solid var(--border)',
            borderRadius: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{arch.id} - {arch.name}</h4>
              <span className={`badge-tier${arch.tier}`}>Tier {arch.tier}</span>
            </div>
            
            <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>📊 Excel Tab:</strong>
                <p>{arch.excelTab || 'Not required'}</p>
              </div>
              <div>
                <strong>📖 Playbook Slides:</strong>
                <p>{arch.playbook_slides ? arch.playbook_slides.join(', ') : 'Conceptual'}</p>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <strong>🔑 Key Keywords:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {arch.keywords.slice(0, 6).map((kw, idx) => (
                  <span key={idx} style={{ 
                    background: '#f3f4f6', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                  }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchetypeMapper;
