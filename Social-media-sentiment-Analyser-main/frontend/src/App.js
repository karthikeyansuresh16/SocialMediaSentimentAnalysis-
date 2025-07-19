import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Social Media Sentiment Analyzer</h1>
        <p>Enter a topic to analyze sentiment from Reddit posts</p>
      </header>
      
      <main>
        <SearchForm
          setResults={setResults}
          setLoading={setLoading}
          setError={setError}
        />
        
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading-container">
            <p>Analyzing sentiment for Reddit posts...</p>
          </div>
        ) : (
          results && <Results results={results} />
        )}
      </main>
    </div>
  );
}

export default App;