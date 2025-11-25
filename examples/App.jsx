import React from 'react';
import MainLayout from './components/layout/MainLayout';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import './App.css';

function App() {
  return (
    <MainLayout>
      <EnhancedDashboard />
    </MainLayout>
  );
}

export default App;
