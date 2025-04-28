import React, { useState } from 'react';
import axios from 'axios';

const AddFood = () => {
  const [manualEntry, setManualEntry] = useState(true);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (manualEntry) {
      try {
        const foodData = {
          name: foodName,
          calories: parseInt(calories),
          fat: 0,             // Default if manual entry doesn't ask
          cholesterol: 0,
          sodium: 0,
          carbohydrate: 0,
          protein: 0,
        };

        const response = await axios.post('/api/add', foodData);
        setMessage(response.data.message || 'Food added successfully');
        setFoodName('');
        setCalories('');
      } catch (error) {
        console.error(error);
        setMessage('Error adding food manually.');
      }
    } else {
      if (selectedFile) {
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];

            const response = await axios.post('/api/upload', { image: `data:image/jpeg;base64,${base64Image}` });
            setMessage(response.data.message || 'Image uploaded and parsed successfully');
            setSelectedFile(null);
          };
          reader.readAsDataURL(selectedFile);
        } catch (error) {
          console.error(error);
          setMessage('Error uploading image.');
        }
      } else {
        setMessage('Please select a file to upload.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="add-food">
      <h2>Add Food</h2>

      <div className="toggle-buttons">
        <button onClick={() => setManualEntry(true)} className={manualEntry ? 'active' : ''}>
          Manual Entry
        </button>
        <button onClick={() => setManualEntry(false)} className={!manualEntry ? 'active' : ''}>
          Upload Picture
        </button>
      </div>

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

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddFood;
