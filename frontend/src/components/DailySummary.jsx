import React from 'react';

const DailySummary = () => {

  // (.../api/retrieve) API route for retrieval of all database items that the user has input, this output also currently has an attached calorieTotal and neededCalories (based on a daily average) 
  
  // Mock data for foods eaten today
  const foods = {
    breakfast: [
      { name: 'Oatmeal', calories: 150 },
      { name: 'Banana', calories: 105 },
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 350 },
      { name: 'Apple', calories: 95 },
    ],
    dinner: [
      { name: 'Salmon', calories: 400 },
      { name: 'Broccoli', calories: 55 },
    ],
    additional: [
      { name: 'Protein Shake', calories: 200 },
    ],
  };

  return (
    <div className="daily-summary">
      <h2 style={{ textAlign: 'center' }}>Daily Summary</h2>
      
      {/* Horizontal meal tables container */}
      <div className="horizontal-meals">
        {/* Breakfast */}
        <div className="meal-container">
          <h3>Breakfast</h3>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th className="calories-column">Calories</th>
              </tr>
            </thead>
            <tbody>
              {foods.breakfast.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td className="calories-column">{food.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lunch */}
        <div className="meal-container">
          <h3>Lunch</h3>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th className="calories-column">Calories</th>
              </tr>
            </thead>
            <tbody>
              {foods.lunch.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td className="calories-column">{food.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dinner */}
        <div className="meal-container">
          <h3>Dinner</h3>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th className="calories-column">Calories</th>
              </tr>
            </thead>
            <tbody>
              {foods.dinner.map((food, index) => (
                <tr key={index}>
                  <td>{food.name}</td>
                  <td className="calories-column">{food.calories} kcal</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional (kept below) */}
      <div className="additional-container">
        <h3>Additional</h3>
        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th className="calories-column">Calories</th>
            </tr>
          </thead>
          <tbody>
            {foods.additional.map((food, index) => (
              <tr key={index}>
                <td>{food.name}</td>
                <td className="calories-column">{food.calories} kcal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailySummary;
