import React, { useState } from 'react';
import axios from 'axios';
import './SearchForm.css';

const SearchForm = ({ setResults, setLoading, setError }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/reddit/analyze', {
        topic
      });
      setResults(response.data);
    } 
    catch (error) {
      console.error('Error fetching sentiment analysis:', error);
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., bitcoin, climate change)"
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Analyze Sentiment</button>
      </form>
    </div>
  );
};

export default SearchForm;