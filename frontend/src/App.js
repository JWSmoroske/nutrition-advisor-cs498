import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header'; // Import from src/Header.jsx
import Sidebar from './components/sidebar'; // Import from src/Sidebar.jsx
import AddFood from './components/AddFood'; // Import from src/AddFood.jsx
import DailySummary from './components/DailySummary'; // Import from src/DailySummary.jsx
import MealSuggestions from './components/MealSuggestions'; // Import from src/MealSuggestions.jsx


function App() {
  return (
    <Router>
      <div className="App">
      <Sidebar />
      <header className="main-content">
        <h1>Nutrition Assistant</h1>
          <Header />
          <Routes>
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/daily-summary" element={<DailySummary />} />
            <Route path="/meal-suggestions" element={<MealSuggestions />} />
            <Route path="/" element={<AddFood />} /> {/* Default route */}
          </Routes>
      </header>
      </div>
      </Router>
  );
}

export default App;
