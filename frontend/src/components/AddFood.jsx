// src/AddFood.jsx

import React, { useState } from "react";
import axios from "axios";

export default function AddFood() {
  const [manualEntry, setManualEntry]   = useState(true);
  const [foodName, setFoodName]         = useState("");     // initialized to "" (never undefined) :contentReference[oaicite:2]{index=2}
  const [calories, setCalories]         = useState("");     // string, never undefined :contentReference[oaicite:3]{index=3}
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData]     = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    if (manualEntry) {
      alert(`Added: ${foodName} - ${calories} calories`);
      setFoodName("");
      setCalories("");
    } else {
      if (!selectedFile) return alert("Please select a file.");
      try {
        // Build FormData with the raw file :contentReference[oaicite:2]{index=2}
        const formData = new FormData();
        formData.append("imageFile", selectedFile);               // field name "imageFile" :contentReference[oaicite:3]{index=3}
        
        // POST multipart/form-data to our new endpoint
        const resp = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }    // Axios infers boundary :contentReference[oaicite:4]{index=4}
        );

        if (resp.data.success) {
          setParsedData(resp.data.data);
        } else {
          alert("Upload failed: " + resp.data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading image.");
      } finally {
        setSelectedFile(null);
      }
    }
  };

  return (
    <div className="add-food">
      <h2>Add Food</h2>
      <div className="toggle-buttons">
        <button onClick={() => setManualEntry(true)}  className={manualEntry ? "active" : ""}>Manual Entry</button>
        <button onClick={() => setManualEntry(false)} className={!manualEntry ? "active" : ""}>Upload Picture</button>
      </div>

      {manualEntry ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Food Name"
            value={foodName || ""}                         // fallback ensures a string :contentReference[oaicite:4]{index=4}
            onChange={e => setFoodName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories || ""}                         // fallback ensures a string :contentReference[oaicite:5]{index=5}
            onChange={e => setCalories(e.target.value)}
            required
          />
          <button type="submit">Add Food</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={e => setSelectedFile(e.target.files[0])}  // uncontrolled file input :contentReference[oaicite:6]{index=6}
              required
              style={{color: 'black'}}
          />
          <button type="submit">Upload Picture</button>
        </form>
      )}

      {/* Conditionally render parsed nutrition facts */}
      {parsedData && (
        <div className="nutrition-results">
          <h3>Parsed Nutrition Facts</h3>
          <table>
            <tbody>
              <tr><td>Name</td><td>{parsedData.name}</td></tr>
              <tr><td>Calories</td><td>{parsedData.calories}</td></tr>
              <tr><td>Fat (g)</td><td>{parsedData.fat}</td></tr>
              <tr><td>Cholesterol (mg)</td><td>{parsedData.cholesterol}</td></tr>
              <tr><td>Sodium (mg)</td><td>{parsedData.sodium}</td></tr>
              <tr><td>Carbs (g)</td><td>{parsedData.carbohydrate}</td></tr>
              <tr><td>Protein (g)</td><td>{parsedData.protein}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
