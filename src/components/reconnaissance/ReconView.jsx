import React, { useState, useEffect } from 'react';
import Scanner from './Scanner';
import HybridSequencer from './HybridSequencer';
import ArchetypeMapper from './ArchetypeMapper';
import TimeAllocator from './TimeAllocator';
import { scanForArchetypes } from '../../utils/archetypeScanner';

const ReconView = () => {
  const [problemText, setProblemText] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleScan = () => {
    if (!problemText.trim()) return;
    
    const results = scanForArchetypes(problemText);
    setScanResults(results);
    setShowWorkflow(true);
  };

  return (
    <div className="recon-container">
      <div className="recon-header">
        <h2>📡 Exam Reconnaissance</h2>
        <p>Paste your problem text below. The system will identify archetypes, suggest resources, and generate your execution plan.</p>
      </div>

      <div className="recon-input card">
        <label>Problem Text:</label>
        <textarea
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder="Paste the exam question here..."
          rows={10}
          style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
        />
        <button onClick={handleScan} className="btn btn-primary" style={{ marginTop: '1rem' }}>
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
            totalPoints={scanResults.estimatedPoints}
          />
        </>
      )}
    </div>
  );
};

export default ReconView;
