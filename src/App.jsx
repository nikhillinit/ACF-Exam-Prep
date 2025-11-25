import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReconView from './components/reconnaissance/ReconView';
import ProblemViewer from './components/practice/ProblemViewer';
import MasteryDashboard from './components/review/MasteryDashboard';
import QuickAnalysisView from './components/QuickAnalysisView';

// Resource system imports
import ResourceBrowser from './components/resources/ResourceBrowser';

// NEW: Problem Library imports
import ProblemLibrary from './components/ProblemLibrary';
import './components/ProblemLibrary.css';

// Archetype Guide imports
import ArchetypeGuideViewer from './components/ArchetypeGuideViewer';

import './index.css';

function App() {
  const [currentMode, setCurrentMode] = useState('recon');
  
  // Resource loader state
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  // Initialize resource loader on app start
  useEffect(() => {
    async function init() {
      console.log('Initializing resources...');
      // Simple initialization - just set to true
      setResourcesLoaded(true);
      console.log('✅ Resources ready');
    }
    init();
  }, []);

  // Resources view component (inline to handle loading state)
  const ResourcesView = () => (
    <div className="resources-container">
      {resourcesLoaded ? (
        <ResourceBrowser />
      ) : (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading resources...</p>
        </div>
      )}
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>ACF Final Exam Prep System</h1>
          <nav className="main-nav">
            <Link 
              to="/" 
              className={currentMode === 'recon' ? 'active' : ''}
              onClick={() => setCurrentMode('recon')}
            >
              🔍 Reconnaissance
            </Link>
            <Link 
              to="/practice" 
              className={currentMode === 'practice' ? 'active' : ''}
              onClick={() => setCurrentMode('practice')}
            >
              ✍️ Practice
            </Link>
            {/* NEW: Problem Library link */}
            <Link 
              to="/library" 
              className={currentMode === 'library' ? 'active' : ''}
              onClick={() => setCurrentMode('library')}
            >
              📖 Problem Library
            </Link>
            <Link 
              to="/review" 
              className={currentMode === 'review' ? 'active' : ''}
              onClick={() => setCurrentMode('review')}
            >
              📊 Review & Mastery
            </Link>
            <Link 
              to="/quick-analysis" 
              className={currentMode === 'quick-analysis' ? 'active' : ''}
              onClick={() => setCurrentMode('quick-analysis')}
            >
              ⚡ Quick Analysis
            </Link>
            <Link
              to="/resources"
              className={currentMode === 'resources' ? 'active' : ''}
              onClick={() => setCurrentMode('resources')}
            >
              📚 Resources
            </Link>
            <Link
              to="/archetype-guide"
              className={currentMode === 'archetype-guide' ? 'active' : ''}
              onClick={() => setCurrentMode('archetype-guide')}
            >
              📋 Archetype Guide
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ReconView />} />
            {/* FIXED: Practice route with wildcard to support /practice/A1-CapitalStructure */}
            <Route path="/practice/*" element={<ProblemViewer />} />
            {/* NEW: Problem Library route */}
            <Route path="/library" element={<ProblemLibrary />} />
            <Route path="/review" element={<MasteryDashboard />} />
            <Route path="/quick-analysis" element={<QuickAnalysisView />} />
            <Route path="/resources" element={<ResourcesView />} />
            <Route path="/archetype-guide" element={<ArchetypeGuideViewer />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>🎯 Target Score: 95%+ | ⏱️ Time: 180 minutes | 📊 Focus: Tier 1 Archetypes (80% of points)</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
