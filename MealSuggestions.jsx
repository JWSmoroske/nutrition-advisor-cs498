import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MealSuggestions = () => {
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/chat', {
          question: 'Suggest three healthy meals based on a balanced diet'
        });
        setSuggestions(response.data.response);  
      } catch (err) {
        console.error(err);
        setError('Failed to fetch meal suggestions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="meal-suggestions">
      <h2>Meal Suggestions</h2>

      {isLoading && <p>Loading suggestions...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && suggestions && (
        <div className="suggestions-text">
          <p>{suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default MealSuggestions;
