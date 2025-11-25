import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ReconView from './components/reconnaissance/ReconView';
import ProblemViewer from './components/practice/ProblemViewer';
import MasteryDashboard from './components/review/MasteryDashboard';
import QuickAnalysisView from './components/QuickAnalysisView';

// Resource system imports
import ResourceBrowser from './components/resources/ResourceBrowser';

// Problem Library imports
import ProblemLibrary from './components/ProblemLibrary';
import './components/ProblemLibrary.css';

import './index.css';

// Main navigation component (needs access to useLocation)
function AppContent() {
  const location = useLocation();
  
  // Resource loader state
  const [resourcesLoaded, setResourcesLoaded] = useState(true);

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
    <>
      <div className="app-container">
        <header className="app-header">
          <h1>ACF Final Exam Prep System</h1>
          <nav className="main-nav">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              🔍 Reconnaissance
            </Link>
            <Link 
              to="/practice" 
              className={location.pathname === '/practice' ? 'active' : ''}
            >
              ✍️ Practice
            </Link>
            {/* Problem Library link */}
            <Link 
              to="/library" 
              className={location.pathname === '/library' ? 'active' : ''}
            >
              📖 Problem Library
            </Link>
            <Link 
              to="/review" 
              className={location.pathname === '/review' ? 'active' : ''}
            >
              📊 Review & Mastery
            </Link>
            <Link 
              to="/quick-analysis" 
              className={location.pathname === '/quick-analysis' ? 'active' : ''}
            >
              ⚡ Quick Analysis
            </Link>
            <Link 
              to="/resources" 
              className={location.pathname === '/resources' ? 'active' : ''}
            >
              📚 Resources
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ReconView />} />
            <Route path="/practice" element={<ProblemViewer />} />
            {/* Problem Library route */}
            <Route path="/library" element={<ProblemLibrary />} />
            <Route path="/review" element={<MasteryDashboard />} />
            <Route path="/quick-analysis" element={<QuickAnalysisView />} />
            <Route path="/resources" element={<ResourcesView />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>🎯 Target Score: 95%+ | ⏱️ Time: 180 minutes | 📊 Focus: Tier 1 Archetypes (80% of points)</p>
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
