import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) {
      axios.get(`/api/books/search?q=${query}`)
        .then(response => setResults(response.data))
        .catch(error => console.error('Error searching books:', error));
    }
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      <div className="search-results">
        {results.map(book => (
          <div key={book._id} className="book-item">
            <h3>{book.title}</h3>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;