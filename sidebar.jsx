// src/sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>NutriAI</h2>
      <ul>
        <li>
          <Link to="/add-food">Add Food</Link>
        </li>
        <li>
          <Link to="/daily-summary">Daily Summary</Link>
        </li>
        <li>
          <Link to="/meal-suggestions">Meal Suggestions</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;