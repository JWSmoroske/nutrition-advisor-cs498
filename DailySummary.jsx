import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailySummary = () => {
  const [foods, setFoods] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    additional: [],
  });
  const [calorieTotal, setCalorieTotal] = useState(0);
  const [neededCalories, setNeededCalories] = useState(0);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('/api/retrieve');
        const { data, calorieTotal, neededCalories } = response.data;

        const categorized = {
          breakfast: [],
          lunch: [],
          dinner: [],
          additional: [],
        };

        // Since your backend does not send meal types, for now put all in "additional"
        data.forEach(item => {
          categorized.additional.push({
            name: item.name,
            calories: item.calories,
          });
        });

        setFoods(categorized);
        setCalorieTotal(calorieTotal);
        setNeededCalories(neededCalories);
      } catch (error) {
        console.error('Failed to fetch foods:', error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="daily-summary">
      <h2 style={{ textAlign: 'center' }}>Daily Summary</h2>

      <p style={{ textAlign: 'center' }}>
        <strong>Total Calories:</strong> {calorieTotal} kcal
      </p>
      <p style={{ textAlign: 'center' }}>
        <strong>Calories Needed:</strong> {neededCalories} kcal
      </p>

      <div className="horizontal-meals">
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <MealSection key={meal} title={meal} foods={foods[meal]} />
        ))}
      </div>

      <div className="additional-container">
        <MealSection title="Additional" foods={foods.additional} />
      </div>
    </div>
  );
};

const MealSection = ({ title, foods }) => (
  <div className="meal-container">
    <h3>{title.charAt(0).toUpperCase() + title.slice(1)}</h3>
    <table>
      <thead>
        <tr>
          <th>Food</th>
          <th className="calories-column">Calories</th>
        </tr>
      </thead>
      <tbody>
        {foods.length === 0 ? (
          <tr><td colSpan="2">No foods logged.</td></tr>
        ) : (
          foods.map((food, index) => (
            <tr key={index}>
              <td>{food.name}</td>
              <td className="calories-column">{food.calories} kcal</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DailySummary;
