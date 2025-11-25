/**
 * Archetype Guide Viewer Component
 *
 * Displays synthesized archetype quick reference guides
 */

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ArchetypeGuideViewer = () => {
  const [archetypes, setArchetypes] = useState([]);
  const [selectedArchetype, setSelectedArchetype] = useState('A1');
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'markdown'

  const API_BASE = 'http://localhost:3001';

  // Load available archetypes on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/archetypes`)
      .then(res => res.json())
      .then(data => setArchetypes(data.archetypes))
      .catch(err => console.error('Failed to load archetypes:', err));
  }, []);

  // Load guide when archetype selection changes
  useEffect(() => {
    if (!selectedArchetype) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/archetype-guide/${selectedArchetype}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGuideData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedArchetype]);

  const renderFormattedView = () => {
    if (!guideData) return null;

    const { header, recognition, resources, examples, workflow } = guideData;

    return (
      <div className="formatted-guide">
        {/* Header */}
        <div className="guide-header" style={styles.header}>
          <h1>{header.id}: {header.name}</h1>
          <div style={styles.metadata}>
            <span><strong>Tier:</strong> {header.tier} ({header.priority})</span>
            <span><strong>Time:</strong> {header.timeAllocation} min</span>
            <span><strong>Points:</strong> {header.pointValue}</span>
            <span><strong>Exam Weight:</strong> {header.examWeight}</span>
          </div>
        </div>

        {/* Recognition Keywords */}
        <section style={styles.section}>
          <h2>🔍 Instant Recognition</h2>
          {Object.entries(recognition.keywordsByStrength).map(([strength, keywords]) => (
            keywords.length > 0 && (
              <div key={strength} style={styles.keywordGroup}>
                <h3 style={styles.strengthTitle}>{strength.replace('_', ' ')}</h3>
                <div style={styles.keywordTags}>
                  {keywords.slice(0, 10).map((kw, idx) => (
                    <span key={idx} style={{...styles.tag, ...styles[`tag${strength}`]}}>
                      {kw.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )
          ))}

          {recognition.strongSignals?.length > 0 && (
            <div style={styles.strongSignals}>
              <h3>Strong Signal Combinations (95%+ Confidence)</h3>
              <ul>
                {recognition.strongSignals.map((signal, idx) => (
                  <li key={idx}>{signal.description}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Resources */}
        <section style={styles.section}>
          <h2>📚 Resources</h2>
          <div style={styles.resourceGrid}>
            <div>
              <strong>Excel Tab:</strong> {resources.excelTab}
            </div>
            {resources.playbookSlides?.length > 0 && (
              <div>
                <strong>Playbook Slides:</strong> {resources.playbookSlides.join(', ')}
              </div>
            )}
            <div>
              <strong>Time Allocation:</strong> {resources.timeStrategy.allocation} min
              (+{resources.timeStrategy.buffer} min buffer)
            </div>
          </div>
        </section>

        {/* Worked Examples */}
        {examples?.length > 0 && (
          <section style={styles.section}>
            <h2>💡 Worked Examples</h2>
            {examples.map((ex, idx) => (
              <div key={idx} style={styles.example}>
                <h3>Example {idx + 1}: {ex.id}</h3>
                <p style={styles.problemText}>{ex.problemText}</p>

                {ex.keyInsights?.length > 0 && (
                  <div style={styles.insights}>
                    <strong>Key Insights:</strong>
                    <ul>
                      {ex.keyInsights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ex.commonMistakes?.length > 0 && (
                  <div style={styles.mistakes}>
                    <strong>Common Mistakes:</strong>
                    <ul>
                      {ex.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Workflow */}
        <section style={styles.section}>
          <h2>⚙️ 5-Step Workflow</h2>
          <div style={styles.workflow}>
            {['identify', 'extract', 'map', 'execute', 'check'].map((step) => {
              const stepData = workflow[step];
              return (
                <div key={step} style={styles.workflowStep}>
                  <h3>{step.toUpperCase()} ({stepData.time})</h3>
                  <ul>
                    {stepData.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  const renderMarkdownView = () => {
    if (!guideData) return null;

    // Generate markdown from guideData
    const markdownFormatter = require('../cli/formatters/markdownFormatter');
    const markdown = markdownFormatter.format(guideData);

    return (
      <div style={styles.markdownContainer}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <div style={styles.selector}>
          <label htmlFor="archetype-select">Select Archetype:</label>
          <select
            id="archetype-select"
            value={selectedArchetype}
            onChange={(e) => setSelectedArchetype(e.target.value)}
            style={styles.select}
          >
            {archetypes.map(a => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.name} (Tier {a.tier})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.viewToggle}>
          <button
            onClick={() => setViewMode('formatted')}
            style={{...styles.button, ...(viewMode === 'formatted' ? styles.buttonActive : {})}}
          >
            Formatted View
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            style={{...styles.button, ...(viewMode === 'markdown' ? styles.buttonActive : {})}}
          >
            Markdown View
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {loading && <div style={styles.loading}>Loading guide...</div>}
        {error && <div style={styles.error}>Error: {error}</div>}
        {!loading && !error && guideData && (
          viewMode === 'formatted' ? renderFormattedView() : renderMarkdownView()
        )}
      </div>
    </div>
  );
};

// Inline styles (you can move these to a CSS file)
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  selector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  viewToggle: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  buttonActive: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  },
  content: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#d32f2f'
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #eee'
  },
  metadata: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#666'
  },
  section: {
    marginBottom: '30px'
  },
  keywordGroup: {
    marginBottom: '15px'
  },
  strengthTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#555'
  },
  keywordTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500'
  },
  tagINSTANT_TRIGGER: {
    backgroundColor: '#d32f2f',
    color: 'white'
  },
  tagSTRONG: {
    backgroundColor: '#f57c00',
    color: 'white'
  },
  tagMODERATE: {
    backgroundColor: '#fbc02d',
    color: '#333'
  },
  tagWEAK: {
    backgroundColor: '#e0e0e0',
    color: '#666'
  },
  strongSignals: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px'
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },
  example: {
    marginBottom: '25px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  problemText: {
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '15px'
  },
  insights: {
    marginBottom: '15px'
  },
  mistakes: {
    color: '#d32f2f'
  },
  workflow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  workflowStep: {
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  markdownContainer: {
    lineHeight: '1.6'
  }
};

export default ArchetypeGuideViewer;
