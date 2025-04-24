import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BookList from '../components/BookList';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) {
      axios.get(`http://localhost:5000/api/books/search?q=${query}`)
        .then(response => setResults(response.data))
        .catch(error => console.error('Error searching books:', error));
    }
  }, [query]);

  return (
    <div className="search-results-page">
      <h1>Search Results for "{query}"</h1>
      <BookList books={results} />
    </div>
  );
};

export default SearchResults;