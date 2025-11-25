import React, { useState, useEffect } from 'react';
import ProblemDisplay from './ProblemDisplay';

/**
 * ProblemLibrary Component - Updated for v11 Schema
 * 
 * Loads both guided examples and mock questions from v11 JSON files
 * Handles filtering, searching, and problem selection
 */
function ProblemLibrary() {
  const [guidedExamples, setGuidedExamples] = useState([]);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [contentType, setContentType] = useState('all'); // 'all', 'guided', 'mock'
  const [archetypeFilter, setArchetypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProblems();
  }, []);

  async function loadProblems() {
    try {
      setLoading(true);
      
      // Load guided examples (v11)
      const guidedResponse = await fetch('/source-materials/guided_examples_v11.json');
      if (!guidedResponse.ok) {
        throw new Error(`Failed to load guided examples: ${guidedResponse.status}`);
      }
      const guidedData = await guidedResponse.json();
      const guided = guidedData.worked_examples.map(ex => ({
        ...ex,
        content_type: 'guided'
      }));
      
      // Load mock questions (v11)
      const mockResponse = await fetch('/source-materials/mock_questions_v11.json');
      if (!mockResponse.ok) {
        throw new Error(`Failed to load mock questions: ${mockResponse.status}`);
      }
      const mockData = await mockResponse.json();
      const mock = mockData.worked_examples.map(ex => ({
        ...ex,
        content_type: 'mock'
      }));
      
      setGuidedExamples(guided);
      setMockQuestions(mock);
      setAllProblems([...guided, ...mock]);
      setLoading(false);
      
      console.log(`✓ Loaded ${guided.length} guided examples and ${mock.length} mock questions`);
    } catch (err) {
      console.error('Error loading problems:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  // Get unique archetypes for filter
  const archetypes = [...new Set(allProblems.map(p => p.primary_archetype || p.archetype))].sort();

  // Filter problems
  const filteredProblems = allProblems.filter(problem => {
    // Content type filter
    if (contentType !== 'all' && problem.content_type !== contentType) {
      return false;
    }
    
    // Archetype filter
    const problemArchetype = problem.primary_archetype || problem.archetype;
    if (archetypeFilter !== 'all' && !problemArchetype?.includes(archetypeFilter)) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        problem.id,
        problem.title,
        problem.problem_intro,
        problem.problem_statement,
        problemArchetype
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="problem-library loading">
        <div className="spinner"></div>
        <p>Loading problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-library error">
        <h2>Error Loading Problems</h2>
        <p>{error}</p>
        <button onClick={loadProblems}>Retry</button>
      </div>
    );
  }

  return (
    <div className="problem-library">
      <header className="library-header">
        <h1>ACF Exam Prep - Problem Library</h1>
        <div className="library-stats">
          <span>{guidedExamples.length} Guided Examples</span>
          <span>{mockQuestions.length} Mock Questions</span>
          <span>{allProblems.length} Total Problems</span>
        </div>
      </header>

      <div className="library-controls">
        {/* Content Type Filter */}
        <div className="filter-group">
          <label>Content Type:</label>
          <select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="all">All ({allProblems.length})</option>
            <option value="guided">Guided Examples ({guidedExamples.length})</option>
            <option value="mock">Mock Questions ({mockQuestions.length})</option>
          </select>
        </div>

        {/* Archetype Filter */}
        <div className="filter-group">
          <label>Archetype:</label>
          <select 
            value={archetypeFilter} 
            onChange={(e) => setArchetypeFilter(e.target.value)}
          >
            <option value="all">All Archetypes</option>
            {archetypes.map(arch => (
              <option key={arch} value={arch}>{arch}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="filter-group search-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <button 
          className="clear-filters"
          onClick={() => {
            setContentType('all');
            setArchetypeFilter('all');
            setSearchQuery('');
          }}
        >
          Clear Filters
        </button>
      </div>

      <div className="library-content">
        {/* Problem List */}
        <aside className="problem-list">
          <h2>
            Problems ({filteredProblems.length})
          </h2>
          <div className="problem-items">
            {filteredProblems.map(problem => (
              <div
                key={problem.id}
                className={`problem-item ${selectedProblem?.id === problem.id ? 'selected' : ''}`}
                onClick={() => setSelectedProblem(problem)}
              >
                <div className="problem-item-header">
                  <span className="problem-id">{problem.id}</span>
                  <span className={`content-badge ${problem.content_type}`}>
                    {problem.content_type === 'guided' ? '📚' : '📝'}
                  </span>
                </div>
                <h3>{problem.title || 'Untitled Problem'}</h3>
                <div className="problem-item-meta">
                  <span className="archetype">
                    {problem.primary_archetype || problem.archetype}
                  </span>
                  {problem.estimated_time_minutes && (
                    <span className="time">⏱ {problem.estimated_time_minutes} min</span>
                  )}
                  {problem.problem_parts?.length > 0 && (
                    <span className="parts">📋 {problem.problem_parts.length} parts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Problem Display */}
        <main className="problem-display-container">
          {selectedProblem ? (
            <ProblemDisplay problem={selectedProblem} />
          ) : (
            <div className="no-selection">
              <h2>Select a problem to get started</h2>
              <p>Choose from {filteredProblems.length} available problems</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProblemLibrary;
