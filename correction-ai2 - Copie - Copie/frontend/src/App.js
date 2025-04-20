import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RewritePage from './components/RewritePage';
import TranslatePage from './components/TranslatePage';
import CorrectPage from './components/CorrectPage';
import NavigationBar from './components/NavigationBar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <Routes>
          <Route path="/rewrite" element={<RewritePage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/correct" element={<CorrectPage />} />
          <Route path="/" element={<TranslatePage />} /> {/* Page par défaut */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;