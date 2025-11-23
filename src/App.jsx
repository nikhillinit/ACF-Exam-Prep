import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReconView from './components/reconnaissance/ReconView';
import ProblemViewer from './components/practice/ProblemViewer';
import MasteryDashboard from './components/review/MasteryDashboard';
import './index.css';

function App() {
  const [currentMode, setCurrentMode] = useState('recon');

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>ACF Final Exam Prep System</h1>
          <nav className="main-nav">
            <Link to="/" className={currentMode === 'recon' ? 'active' : ''}>
              Reconnaissance
            </Link>
            <Link to="/practice" className={currentMode === 'practice' ? 'active' : ''}>
              Practice
            </Link>
            <Link to="/review" className={currentMode === 'review' ? 'active' : ''}>
              Review & Mastery
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ReconView />} />
            <Route path="/practice" element={<ProblemViewer />} />
            <Route path="/review" element={<MasteryDashboard />} />
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
