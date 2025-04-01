// src/AddFood.jsx
import React, { useState } from 'react';

const AddFood = () => {
  const [manualEntry, setManualEntry] = useState(true); // Toggle between manual and picture upload
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (manualEntry) {
      // Handle manual entry
      alert(`Added: ${foodName} - ${calories} calories`);
      setFoodName('');
      setCalories('');
      // TODO: fetch response from backend using fetch('.../api/add') (look at TestComp.jsx for syntax) & send JSON of all parameters
      // database expects foods to be inputted as JSON with: 
      // Name (string), Calories (int), Fats (float), Cholesterol (int), Sodium (int), Carbohydrate (float), Protein (float)
      // other fetches are ('.../api/delete/:id'), (.../api/update/:id) for eventual delete and update functionalities
    } else {
      // Handle picture upload
      if (selectedFile) {
        alert(`Uploaded: ${selectedFile.name}`);
        setSelectedFile(null);
      } else {
        alert('Please select a file to upload.');
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="add-food">
      <h2>Add Food</h2>

      {/* Toggle between manual entry and picture upload */}
      <div className="toggle-buttons">
        <button
          onClick={() => setManualEntry(true)}
          className={manualEntry ? 'active' : ''}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setManualEntry(false)}
          className={!manualEntry ? 'active' : ''}
        >
          Upload Picture
        </button>
      </div>

      {/* Manual Entry Form */}
      {manualEntry && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
          <button type="submit">Add Food</button>
        </form>
      )}

      {/* Picture Upload Form */}
      {!manualEntry && (
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Upload Picture</button>
        </form>
      )}
    </div>
  );
};

export default AddFood;
