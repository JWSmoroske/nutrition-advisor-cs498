// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './header'; // Import from src/Header.jsx
import Sidebar from './sidebar'; // Import from src/Sidebar.jsx
import AddFood from './AddFood'; // Import from src/AddFood.jsx
import DailySummary from './DailySummary'; // Import from src/DailySummary.jsx
import MealSuggestions from './MealSuggestions'; // Import from src/MealSuggestions.jsx
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/daily-summary" element={<DailySummary />} />
            <Route path="/meal-suggestions" element={<MealSuggestions />} />
            <Route path="/" element={<AddFood />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
